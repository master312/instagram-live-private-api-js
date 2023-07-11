// Used to handle account related actions, and store account info

import * as crypto from "crypto";
import State from "../core/state"

export default class AccountEntity {
    /**
     * Account username
     */
    public username: string = "";

    /**
     * UserID received from instagram.
     */
    public userId: number = 0;

    /**
     * Is user logged in
     */
    public isLoggedIn: boolean = false;

    /**
     * Time when was this user logged in
     * @private
     */
    public loginTime: Date = new Date("");

    /**
     * Main state object
     * @private
     */
    private state: State;

    constructor(appState: State) {
        this.state = appState;
    }

    public async login(email: string, password: string) {
        const {encrypted, time} = this.encryptPassword(password);

        let deviceInfo = this.state.deviceInfo;
        // Will throw exception on failure
        // TODO: maybe handle properly? There might be body.message with error message
        const response = await this.state.request.send({
            method: 'POST',
            url: '/api/v1/accounts/login/',
            form: this.state.request.sign({
                username: email,
                enc_password: `#PWD_INSTAGRAM:4:${time}:${encrypted}`,
                guid: deviceInfo.uuid,
                phone_id: deviceInfo.phoneId,
                _csrftoken: this.state.getCookieCsrf(),
                device_id: deviceInfo.deviceId,
                adid: deviceInfo.adid,
                google_tokens: '[]',
                login_attempt_count: 0,
                country_codes: JSON.stringify([{country_code: '1', source: 'default'}]),
                jazoest: AccountEntity.createJazoest(deviceInfo.phoneId),
            }),
        });

        console.log(`Account login response code: ${response.statusCode}`);
        if (response.statusCode != 200) {
            console.log("ERROR: Failed to login!");
            return;
        }

        this.userId = response.body.logged_in_user.pk_id;
        this.state.dsUserId = this.userId;
        this.isLoggedIn = true;
        this.loginTime = new Date();
        this.username = response.body.logged_in_user.username;
        this.state.authorization = response.headers['ig-set-authorization'];
        console.log(`User logged in! ID: ${this.userId} Username: ${this.username}`)
    }

    /**
     * End user session, and logs out.
     * TODO: untested.
     */
    public async logout() {
        if (!this.isLoggedIn) {
            return;
        }

        const deviceInfo = this.state.deviceInfo;

        console.log("Instagram logging out...")
        const response = await this.state.request.send({
            method: 'POST',
            url: '/api/v1/accounts/logout/',
            form: {
                guid: deviceInfo.uuid,
                phone_id: deviceInfo.phoneId,
                _csrftoken: this.state.getCookieCsrf(),
                device_id: deviceInfo.deviceId,
                _uuid: deviceInfo.uuid,
            },
        });

        // TODO: Maybe check response for status?

        this.userId = 0;
        this.state.dsUserId = 0;
        this.isLoggedIn = false;
        this.username = "";
        this.state.authorization = undefined;
        console.log("Instagram logged out.");
    }

    /**
     * Queries server for user info.
     * Only works if account is logged in.
     * @returns object returned from server.
     */
    public async getUserInfo() {
        // TODO: ...
    }

    private encryptPassword(password: string) {
        // Parts of code taken from https://github.com/dilame/instagram-private-api
        // which is released under same licence

        const randKey = crypto.randomBytes(32);
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', randKey, iv);
        const time = Math.floor(Date.now() / 1000).toString();
        cipher.setAAD(Buffer.from(time));
        const aesEncrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
        const sizeBuffer = Buffer.alloc(2, 0);
        const rsaEncrypted = crypto.publicEncrypt({
            key: Buffer.from(this.state.passwordEncryptPubKey, 'base64').toString(),
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, randKey);

        sizeBuffer.writeInt16LE(rsaEncrypted.byteLength, 0);
        const authTag = cipher.getAuthTag();
        return {
            time,
            encrypted: Buffer.concat([
                Buffer.from([1, this.state.passwordEncryptKeyId]),
                iv,
                sizeBuffer,
                rsaEncrypted, authTag, aesEncrypted
            ]).toString('base64'),
        };
    }

    private static createJazoest(input: string) {
        const buf = Buffer.from(input, 'ascii');
        let sum = 0;
        for (let i = 0; i < buf.byteLength; i++) {
            sum += buf.readUInt8(i);
        }

        return `2${sum}`;
    }
}