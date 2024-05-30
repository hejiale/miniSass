import Axios from "axios";

export default {
  /**
   * 获取员工的权限列表
   */
  async getStoreUserFunctions(query) {
    return await Axios.post(
      "/store/userRolePermission/getStoreUserFunctions",
      query
    );
  },
  /**
   * 创建邀请链接
   */
  async addStoreEmployeeInvite(query) {
    return await Axios.post("/storeUserApply/addStoreEmployeeInvite", query);
  },
  /**
   * 获取商户数据
   */
  getMerchantBase(data) {
    return Axios.post("/merchant/getMerchantBase", data);
  },
  /**
   * 获取商户数据
   */
  myTicket(data) {
    return Axios.post("/couponTicket/myTicket", data);
  },
  /**
   * 店铺- 店铺已开本次数、可申领剧本数、已申领剧本数
   */
  getStoreDramaCount(data) {
    return Axios.post("/store/getStoreDramaCount", data);
  },
  /**
   * 我的卡券
   */
  myTicket(data) {
    return Axios.post("/couponTicket/myTicket", data);
  },
  /**
   * 自动发券--店家-用户正在参与的活动
   */
  getActivityInAction(data) {
    return Axios.post("/couponAutoSend/getActivityInAction", data);
  }
};
