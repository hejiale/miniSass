import Axios from "axios";

export default {
  /**
   * 剧本列表分页查询
   */
  async productGetList(query) {
    return await Axios.post("/product/getList", query);
  },
  /**
   * B端剧本已申领列表
   */
  async boxDramaApplyBListExist(query) {
    return await Axios.post("/boxDramaApply/bListExist", query);
  },
  /**
   * 剧本详情查询
   */
  async dramaQueryDramaDetail(query) {
    return await Axios.post("/drama/queryDramDetail", query);
  },
  /**
   * 检测开本状态
   */
  async onlineGameCheckOnlineGame(query) {
    return await Axios.post("/onlineGame/checkOnlineGame", query);
  },
  /**
   * 校验指定商品是否存在未支付且未关闭的订单
   */
  async checkProductOrder(query) {
    return await Axios.post("/order/checkProductOrder", query);
  },
  /**
   * 开始游戏
   */
  async onlineGameStartGame(query) {
    return await Axios.post("/onlineGame/startGame", query);
  },
  /**
   * 当前剧本是否已申领
   */
  async dramaIsApply(query) {
    return await Axios.post("/drama/isApply", query);
  },
  /**
   * 获取商户数据
   */
  myTicket(data) {
    return Axios.post("/couponTicket/myTicket", data);
  },
  /**
   * 已授权的剧本商品列表
   */
  getAuthorizedBoxProductList(data) {
    return Axios.post("/product/getAuthorizedBoxProductList", data);
  },
  /**
   * 查询店铺进行游戏
   */
  getStoreCurrentGame(data) {
    return Axios.post("/onlineGame/getStoreCurrentGame", data);
  },
  
};
