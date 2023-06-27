// Main api state. This is kinda like an root of all functions
// Think of it as intagram app main.cpp

import * as toughCookie from "tough-cookie";
import DeviceInfo from "./deviceInfo";
import * as constants from "./constants";
import Chance from "chance";

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

    constructor(deviceChanceSeed: string = "") {
        this.cookieJar = new toughCookie.CookieJar(new toughCookie.MemoryCookieStore());
        this.deviceInfo = new DeviceInfo(deviceChanceSeed)

        console.log(`- New IG state constructed. Device info: ${this.deviceInfo}`)
    }

    /**
     * TODO: .....
     */
    public async initialize() {
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
}