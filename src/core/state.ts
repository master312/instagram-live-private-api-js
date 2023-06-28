// Main api state. This is kinda like an root of all functions
// Think of it as intagram app main.cpp

import * as toughCookie from "tough-cookie";
import DeviceInfo from "./deviceInfo";
import * as constants from "./constants";
import Chance from "chance";
import {Request} from "./request";

const loadSh = require("lodash");

export default class State {

    /**
     * Public key used to encrypt passwords.
     * Read from response headers.
     */
    public passwordEncryptPubKey: string = "";

    /**
     * Key ID used for password encryption.
     * Read from response headers.
     */
    public passwordEncryptKeyId: number = 0;

    /**
     * Place to store cookieJar
     * @private
     */
    public cookieJar: toughCookie.CookieJar;

    /**
     * Holds info about virtual device we are using to connect to instagram.
     * @private
     */
    public deviceInfo: DeviceInfo;

    /**
     * Authorization data to be injected into request header.
     */
    public authorization: any = undefined;

    /**
     * Request instance object, used to send requests to instagram
     */
    public request: Request;

    constructor(deviceChanceSeed: string = "") {
        this.cookieJar = new toughCookie.CookieJar(new toughCookie.MemoryCookieStore());
        this.deviceInfo = new DeviceInfo(deviceChanceSeed)
        this.request = new Request(this);

        console.log(`- New IG state constructed. Device info: ${JSON.stringify(this.deviceInfo)}`)
    }


    /**
     * Initialize state.
     * Gets necessary header values from 'https://i.instagram.com/api/v1/qe/sync/'
     */
    public async initialize() {
        console.log("Initializing instagram state...")
        const headers = await this.request.requestSyncValues();
        const {
            'ig-set-password-encryption-key-id': pwKeyId,
            'ig-set-password-encryption-pub-key': pwPubKey,
        } = headers;

        this.passwordEncryptKeyId = pwKeyId;
        this.passwordEncryptPubKey = pwPubKey;
        if (pwKeyId && pwPubKey) {
            console.log("Instagram state initialized successfully!");
            return
        }

        console.log(`Instagram state failed to initialize. Raw headers: ${headers}`);
    }

    /**
     * UID for instagram headers.
     * This is ID that changes every time user switches app -- MAYBE?? need more info??
     * In this case, it will change on timeout defined in constants.js.PIGEON_SESSION_LIFETIME
     */
    public getPigeonSessionId() {
        return new Chance(`${"getPigeonSessionId"}${this.deviceInfo}${Math.round(Date.now() / constants.PIGEON_SESSION_LIFETIME)}`).guid();
    }

    /**
     * Gets cookie by key.
     * @param key
     * @return whole cookie object probably in format {key: "xxx", value: "yyy"}
     */
    public getCookie(key: string) {
        const cookies = this.cookieJar.getCookies(constants.IG_REST_HOST);
        return loadSh._.find(cookies, {key}) || null;
    }

    public getCookieCsrf() {
        try {
            return this.getCookie('csrftoken').value || 'missing';
        } catch (_a) {
            return 'missing';
        }
    }
}
