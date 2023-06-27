import State from "./state";
import DeviceInfo from "./deviceInfo";
import * as constants from "./constants";

const loadSh = require("lodash")
const requestPromise = require("request-promise");


export class Request {

    private state: State;

    constructor(state: State) {
        this.state = state;
    }

    public async send(options: object) {
        requestPromise(options);
    }

    /**
     * Generate default headers that should go with every request
     */
    private genDefaultHeaders() {
        let temp;
        let deviceInfo: DeviceInfo = this.state.deviceInfo;
        return {
            'User-Agent': deviceInfo.userAgent,
            'X-Ads-Opt-Out': '1',
            'X-CM-Bandwidth-KBPS': '-1.000',
            'X-CM-Latency': '-1.000',
            'X-IG-Device-Locale': "en_US",
            'X-IG-App-Locale': "en_US",
            'X-Pigeon-Session-Id': this.state.getPigeonSessionId(),
            'X-Pigeon-Rawclienttime': (Date.now() / 1000).toFixed(3),
            'X-IG-Connection-Speed': `${loadSh.randomInt(1000, 3700)}kbps`,
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
            // Authorization: this.client.state.authorization, TODO: ...!!! This si received from login resposne??? Example: -> Bearer IGT:2:eyJkc191c2VyX2lkIjoiNTE2NjcxMzIiLCJz
            Host: 'i.instagram.com',
            'Accept-Encoding': 'gzip',
            Connection: 'close',
        };
    }
}