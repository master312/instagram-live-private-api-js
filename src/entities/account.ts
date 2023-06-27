// Used to handle account related actions, and store account info

import * as crypto from "crypto";
import State from "../core/state"
import * as Bluebird from "bluebird"

export class AccountEntity {
    /**
     * Account username
     * @private
     */
    private username: string = "";

    /**
     * UserID received from instagram.
     * TODO: 'number' might be invalid type
     * @private
     */
    private userId: number = 0;

    /**
     * Is user logged in
     * @private
     */
    private isLoggedIn: boolean = false;

    /**
     * Time when was this user logged in
     * @private
     */
    private loginTime: Date = new Date();

    /**
     * Main state object
     * @private
     */
    private appState: State;

    constructor(appState: State) {
        this.appState = appState;
    }

    public async login(username: string, password: string) {
        this.username = username;
    }

    public async logout() {
    }

    /**
     * Queries server for user info.
     * Only works if account is logged in.
     * @returns object returned from server.
     */
    public async getUserInfo() {
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
            key: Buffer.from(this.appState.passwordEncryptPubKey, 'base64').toString(),
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, randKey);

        sizeBuffer.writeInt16LE(rsaEncrypted.byteLength, 0);
        const authTag = cipher.getAuthTag();
        return {
            time,
            encrypted: Buffer.concat([
                Buffer.from([1, this.appState.passwordEncryptKeyId]),
                iv,
                sizeBuffer,
                rsaEncrypted, authTag, aesEncrypted
            ]).toString('base64'),
        };
    }
}