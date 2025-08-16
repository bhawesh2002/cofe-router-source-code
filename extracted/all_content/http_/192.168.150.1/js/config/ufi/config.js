define(function() {
    var config = {
        WIFI_BANDWIDTH_SUPPORT: true,
        AP_STATION_SUPPORT: true,
        WIFI_BAND_SUPPORT: true,
        MAX_STATION_NUMBER: 8,
        WEBUI_TITLE: '4G Mobile Hotspot',
		HAS_MULTI_SSID: true,//多ssid功能
		HAS_URL:true,// 是否支持URL过滤,
		RJ45_SUPPORT:true,//是否支持rj45
        WIFI_SWITCH_SUPPORT: true,//是否支持wifi开关
		WIFI_SUPPORT_QR_SWITCH: true, //是否支持wifi二维码显示控制。
		WIFI_BANDWIDTH_SUPPORT_40MHZ: true, //频带宽度是否支持40MHZ,reltek芯片支持，博通芯片不支持
        SD_CARD_SUPPORT: false,//是否支持SD卡
		AUTO_MODES: [ {
            name: 'Automatic',
            value: 'NETWORK_auto'
        }, {
            name: '4G Only',
            value: 'Only_LTE'
        }, {
            name: '3G Only',
            value: 'TD_W'
        }, {
            name: '2G Only',
            value: 'Only_GSM'
        }
		]
    };

    return config;
});
