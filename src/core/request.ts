import State from "./state";
import DeviceInfo from "./deviceInfo";
import * as constants from "./constants";
import requestPromise from "request-promise";
import * as crypto from "crypto";
const loadSh = require("lodash")

export class Request {

    private state: State;

    constructor(state: State) {
        this.state = state;
    }

    /**
     * Sends request to instagram.
     * @param userOptions Options to be added to the request. Additional default options will be added in this method.
     * @param ignoreHttpErrors if set, all error handling will be skipped in this method.
     * @return response data or throws error
     */
    public async send(userOptions: object, ignoreHttpErrors: boolean = false) {
        // Fill in / merge default values with userOptions.
        const options = loadSh.defaultsDeep(
            userOptions,
            {
                baseUrl: 'https://i.instagram.com/',
                resolveWithFullResponse: true,
                proxy: "",
                simple: false,
                transform: Request.responseAutoParse,
                jar: this.state.cookieJar,
                strictSSL: false,
                gzip: true,
                headers: this.genDefaultHeaders(),
                method: 'GET',
            }
        );

        console.log(`-- Sending IG request: ${options.method} url: ${options.url || options.uri || '!NO URL SPECIFIED!'}`)
        let response = await requestPromise(options);

        console.log(`-- Got response. Status code: ${response.statusCode}`);
        if (ignoreHttpErrors || response.statusCode === 200 || (response.body && response.body.status === 'ok')) {
            return response;
        }

        // TODO: Proper error handling
        throw new Error(`-- HTTP REQUEST. RAW-RESPONSE: ${JSON.stringify(response)}`);
    }

    /**
     * Queue instagram core headers.
     */
    public async requestSyncValues() {
        const response = await this.send({
            method: 'GET',
            url: '/api/v1/qe/sync/'
        }, true);

        return response.headers;
    }

    public sign(payload: any) {
        const json = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        const signature = crypto.createHmac('sha256', constants.SIGNATURE_KEY).update(json).digest('hex');
        return {
            ig_sig_key_version: constants.SIGNATURE_VERSION,
            signed_body: `${signature}.${json}`,
        };
    }

    /**
     * User by requestPromise to parse arguments
     * See https://github.com/request/request-promise#the-transform-function
     */
    private static responseAutoParse(body: any, response: any, resolveWithFullResponse: boolean) {
        // We will assume that response is always in json format
        if (typeof body === 'undefined' || !body.trim()) {
            return response;
        }

        try {
            response.body = JSON.parse(body);
        } catch (e) {
            console.log(`Exception parsing body: ${e}`);
            return response;
        }

        return resolveWithFullResponse ? response : response.body;
    }

    /**
     * Generate default headers that should go with every request
     */
    private genDefaultHeaders() {
        let temp;
        let deviceInfo: DeviceInfo = this.state.deviceInfo;
        let min = 1000;
        let max = 3700;
        let connectionSpeed = Math.floor(Math.random() * (max - min + 1)) + min;
        return {
            'User-Agent': deviceInfo.userAgent,
            'X-Ads-Opt-Out': '1',
            'X-CM-Bandwidth-KBPS': '-1.000',
            'X-CM-Latency': '-1.000',
            'X-IG-Device-Locale': "en_US",
            'X-IG-App-Locale': "en_US",
            'X-Pigeon-Session-Id': this.state.getPigeonSessionId(),
            'X-Pigeon-Rawclienttime': (Date.now() / 1000).toFixed(3),
            'X-IG-Connection-Speed': `${connectionSpeed}kbps`,
            'X-IG-Bandwidth-Speed-KBPS': '-1.000',
            'X-IG-Bandwidth-TotalTime-MS': '0',
            'X-IG-Bandwidth-TotalBytes-B': '0',
            'X-IG-EU-DC-ENABLED': deviceInfo.euDCEnabled.toString(),    // TODO: Test this?
            'X-IG-Extended-CDN-Thumbnail-Cache-Busting-Value': "1000",
            'X-Bloks-Version-Id': constants.BLOKS_VERSION_ID,
            'X-MID': (temp = this.state.getCookie('mid')) === null || temp === void 0 ? void 0 : temp.value,
            'X-IG-WWW-Claim': '0',
            //'X-IG-WWW-Claim': this.client.state.igWWWClaim || '0', TODO: ..!!!!!! -> this is something that allows upload photos? Not needed for live app?... Provided in the response header when request https://www.instagram.com/account/login/ajax/
            'X-Bloks-Is-Layout-RTL': "false",
            'X-IG-Connection-Type': deviceInfo.connectionTypeHeader,
            'X-IG-Capabilities': constants.DEVICE_CAPABILITIES_HEADER,
            'X-IG-Device-ID': deviceInfo.uuid,
            'X-IG-App-ID': constants.FB_ANALYTICS_APP_ID,
            'X-IG-Android-ID': deviceInfo.deviceId,
            'X-FB-HTTP-Engine': 'Liger',
            'Accept-Language': "en-US",
            'Authorization': this.state.authorization, // Example: -> Bearer IGT:2:eyJkc191c2VyX2lkIjoiNTE2NjcxMzIiLCJz
            Host: 'i.instagram.com',
            'Accept-Encoding': 'gzip',
            Connection: 'close',
        };
    }
}