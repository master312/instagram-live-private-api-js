// Parts of code taken from https://github.com/dilame/instagram-private-api
// which is released under the same licence

// TODO: Test this version...
// export const APP_VERSION = "288.0.0.22.66" // June 21, 2023
// export const APP_VERSION_CODE = "368806255";

export const APP_VERSION = '275.0.0.27.98';
export const APP_VERSION_CODE = '367507885';
export const DEVICE_CAPABILITIES_HEADER = '3brTvwE=';
export const FB_ANALYTICS_APP_ID = '567067343352427';
export const IG_HOSTNAME = 'i.instagram.com';
export const IG_WEB_HOSTNAME = 'www.instagram.com';
export const IG_REST_HOST = `https://${IG_HOSTNAME}/`;
export const IG_REST_WEB_HOST = `https://${IG_WEB_HOSTNAME}/`;
export const BLOKS_VERSION_ID = '1b030ce63a06c25f3e4de6aaaf6802fe1e76401bc5ab6e5fb85ed6c2d333e0c7';
export const PIGEON_SESSION_LIFETIME = 1210101
export const SIGNATURE_KEY = '9193488027538fd3450b83b7d05286d4ca9599a0f7eeed90d8c85925698a05dc';
export const SIGNATURE_VERSION = '4';
/**
 * String of random devices to be used as user agent
 */
export const deviceStrings = [
    "25/7.1.1; 440dpi; 1080x1920; Xiaomi; Mi Note 3; jason; qcom",
    "23/6.0.1; 480dpi; 1080x1920; Xiaomi; Redmi Note 3; kenzo; qcom",
    "23/6.0; 480dpi; 1080x1920; Xiaomi; Redmi Note 4; nikel; mt6797",
    "24/7.0; 480dpi; 1080x1920; Xiaomi/xiaomi; Redmi Note 4; mido; qcom",
    "23/6.0; 480dpi; 1080x1920; Xiaomi; Redmi Note 4X; nikel; mt6797",
    "27/8.1.0; 440dpi; 1080x2030; Xiaomi/xiaomi; Redmi Note 5; whyred; qcom",
    "23/6.0.1; 480dpi; 1080x1920; Xiaomi; Redmi 4; markw; qcom",
    "27/8.1.0; 440dpi; 1080x2030; Xiaomi/xiaomi; Redmi 5 Plus; vince; qcom",
    "25/7.1.2; 440dpi; 1080x2030; Xiaomi/xiaomi; Redmi 5 Plus; vince; qcom",
    "26/8.0.0; 480dpi; 1080x1920; Xiaomi; MI 5; gemini; qcom",
    "27/8.1.0; 480dpi; 1080x1920; Xiaomi/xiaomi; Mi A1; tissot_sprout; qcom",
    "26/8.0.0; 480dpi; 1080x1920; Xiaomi; MI 6; sagit; qcom",
    "25/7.1.1; 440dpi; 1080x1920; Xiaomi; MI MAX 2; oxygen; qcom",
    "24/7.0; 480dpi; 1080x1920; Xiaomi; MI 5s; capricorn; qcom",
    "26/8.0.0; 480dpi; 1080x1920; samsung; SM-A520F; a5y17lte; samsungexynos7880",
    "26/8.0.0; 480dpi; 1080x2076; samsung; SM-G950F; dreamlte; samsungexynos8895",
    "26/8.0.0; 640dpi; 1440x2768; samsung; SM-G950F; dreamlte; samsungexynos8895",
    "26/8.0.0; 420dpi; 1080x2094; samsung; SM-G955F; dream2lte; samsungexynos8895",
    "26/8.0.0; 560dpi; 1440x2792; samsung; SM-G955F; dream2lte; samsungexynos8895",
    "24/7.0; 480dpi; 1080x1920; samsung; SM-A510F; a5xelte; samsungexynos7580",
    "26/8.0.0; 480dpi; 1080x1920; samsung; SM-G930F; herolte; samsungexynos8890",
    "26/8.0.0; 480dpi; 1080x1920; samsung; SM-G935F; hero2lte; samsungexynos8890",
    "26/8.0.0; 420dpi; 1080x2094; samsung; SM-G965F; star2lte; samsungexynos9810",
    "26/8.0.0; 480dpi; 1080x2076; samsung; SM-A530F; jackpotlte; samsungexynos7885",
    "24/7.0; 640dpi; 1440x2560; samsung; SM-G925F; zerolte; samsungexynos7420",
    "26/8.0.0; 420dpi; 1080x1920; samsung; SM-A720F; a7y17lte; samsungexynos7880",
    "24/7.0; 640dpi; 1440x2560; samsung; SM-G920F; zeroflte; samsungexynos7420",
    "24/7.0; 420dpi; 1080x1920; samsung; SM-J730FM; j7y17lte; samsungexynos7870",
    "26/8.0.0; 480dpi; 1080x2076; samsung; SM-G960F; starlte; samsungexynos9810",
    "26/8.0.0; 420dpi; 1080x2094; samsung; SM-N950F; greatlte; samsungexynos8895",
    "26/8.0.0; 420dpi; 1080x2094; samsung; SM-A730F; jackpot2lte; samsungexynos7885",
    "26/8.0.0; 420dpi; 1080x2094; samsung; SM-A605FN; a6plte; qcom",
    "26/8.0.0; 480dpi; 1080x1920; HUAWEI/HONOR; STF-L09; HWSTF; hi3660",
    "27/8.1.0; 480dpi; 1080x2280; HUAWEI/HONOR; COL-L29; HWCOL; kirin970",
    "26/8.0.0; 480dpi; 1080x2032; HUAWEI/HONOR; LLD-L31; HWLLD-H; hi6250",
    "26/8.0.0; 480dpi; 1080x2150; HUAWEI; ANE-LX1; HWANE; hi6250",
    "26/8.0.0; 480dpi; 1080x2032; HUAWEI; FIG-LX1; HWFIG-H; hi6250",
    "27/8.1.0; 480dpi; 1080x2150; HUAWEI/HONOR; COL-L29; HWCOL; kirin970",
    "26/8.0.0; 480dpi; 1080x2038; HUAWEI/HONOR; BND-L21; HWBND-H; hi6250",
    "23/6.0.1; 420dpi; 1080x1920; LeMobile/LeEco; Le X527; le_s2_ww; qcom"
];

export const builds = [
    "NMF26X",
    "MMB29M",
    "MRA58K",
    "NRD90M",
    "MRA58K",
    "OPM1.171019.011",
    "IMM76L",
    "JZO54K",
    "JDQ39",
    "JLS36I",
    "KTU84P",
    "LRX22C",
    "LMY48M",
    "MMB29V",
    "NRD91N",
    "N2G48C"
];

