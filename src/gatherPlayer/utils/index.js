import Axios from "axios";

export default {
  /**
   * 商品列表分页查询
   */
  async getStoreProductPage(query) {
    return await Axios.post("/storeProductController/getConditionStoreProductPage", query);
  },
  /**
   * 玩家--发起组局，生成订单
   */
  async userCreateGathering(query) {
    return await Axios.post("/gathering/userCreateGathering", query);
  },
  /**
   * 组局详情Detail
   */
  async getGatheringDetail(query) {
    return await Axios.post("/gathering/getCurrentUserInGatheringInfo", query);
  },
  /**
   * 玩家--加入组局
   */
  async joinGathering(query) {
    return await Axios.post("/gathering/joinGathering", query);
  },
  /**
   * 玩家--我的组局订单列表
   */
  async playerGatheredGamePage(query) {
    return await Axios.post("/gathering/playerGatheredGamePage", query);
  },
  /**
   * 获取该用户组局内的未支付订单信息
   */
  async getGatherNotPayOrderInfo(query) {
    return await Axios.post("/gathering/getGatherNotPayOrderInfo", query);
  },
};
