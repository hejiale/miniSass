import Axios from "axios";
export default {
   /**
   * 获取商户数据
   */
   getMerchantBase(data) {
		return Axios.post("/merchant/getMerchantBase", data);
	},
   /**
   * 获取商户数据
   */
   getMerchantAmount(data) {
		return Axios.post("/merchant/getMerchantAmount", data);
	},
   /**
   * 商户B端提现页查询
   */
   merchantTransferList(data) {
		return Axios.post("/merchant/merchantTransferList", data);
	}
   
}