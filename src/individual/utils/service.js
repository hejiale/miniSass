import Axios from "axios";
export default {
   /**
   * 获取商户数据
   */
   getMerchantBase(data) {
		return Axios.post("/merchant/getMerchantBase", data);
	},
   /**
   * 商户数据提交
   */
   postMerchantBase(data) {
		return Axios.post("/merchant/merchantBaseCommit", data);
	},
   /**
   * 商户数据更新
   */
   merchantBaseUpdate(data) {
		return Axios.post("/merchant/merchantBaseUpdate", data);
	},
   /**
   * 商户发送短信验证码
   */
   getCaptchaCode(data) {
		return Axios.post("/merchant/getCaptchaCode", data);
	},
   /**
   * 校验验证码
   */
   getAvailableCode(data) {
		return Axios.post("/merchant/getAvailableCode", data);
	},

}