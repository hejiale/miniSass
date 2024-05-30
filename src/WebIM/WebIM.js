// 小程序3.0sdk
import websdk from "./Easemob-chat-4.0.3";
import config from "./WebIMConfig";

var window = {};
let WebIM = window.WebIM = uni.WebIM = websdk;
window.WebIM.config = config; //var DOMParser = window.DOMParser = xmldom.DOMParser;

WebIM.conn = new WebIM.connection({
  appKey: WebIM.config.appkey,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === "boolean" ? WebIM.config.https : location.protocol === "https:",
  url: WebIM.config.xmppURL,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: false,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  isDebug: false
});

module.exports = {
  "default": WebIM
};


