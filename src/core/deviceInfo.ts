const chance = require("chance");
const uuid = require("uuid");
import * as constants from "./constants";
import {builds} from "./constants";

export default class DeviceInfo {

    /**
     * User agent string to be added to request headers
     */
    public userAgent: string;

    public deviceId: string;

    public uuid: string;

    public phoneId: string;

    public adid: string;

    public build: string;

    public deviceString: string;

    public connectionTypeHeader: string = 'WIFI';

    /**
     * Set to TRUE if in EU or FALSE if in US.
     */
    public euDCEnabled: boolean = true;

    constructor(chanceSeed: string) {
        let ch = new chance(chanceSeed || uuid.v4());
        this.deviceString = ch.pickone(constants.deviceStrings);
        const id = ch.string({
            pool: 'abcdef0123456789',
            length: 16,
        });

        this.deviceId = `android-${id}`;
        this.uuid = ch.guid();
        this.phoneId = ch.guid();
        this.adid = ch.guid();
        this.build = ch.pickone(builds);
        this.userAgent = `Instagram ${constants.APP_VERSION} Android (${this.deviceString}; en_US; ${constants.APP_VERSION_CODE})`;
    }
}