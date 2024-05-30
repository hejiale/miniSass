import Axios from "axios";

export default {
  /**
 * 校验邀请链接
 */
  async checkStoreEmployeeInvite(query) {
    return await Axios.post("/storeUserApply/checkStoreEmployeeInvite", query);
  },
  /**
   * 店铺用户申请-用户申请加入店铺
   */
  async addStoreUserApply(query) {
    return await Axios.post("/storeUserApply/addStoreUserApply", query);
  },
  /**
     * 创建邀请链接
     */
  async addStoreEmployeeInvite(query) {
    return await Axios.post("/storeUserApply/addStoreEmployeeInvite", query);
  },
}