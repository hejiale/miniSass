import Axios from "axios";

export default {
  /**
   * 店铺剧本-可添加剧本列表
   */
  async queryDramaByStore(query) {
    return await Axios.post("/storeDrama/queryDramaByStore", query);
  },
  /**
   * 小程序-店铺剧本查询
   */
  async queryStoreDramaPage(query) {
    return await Axios.post("/storeDrama/queryStoreDramaPage", query);
  },
  /**
   * 批量修改店铺剧本价格
   */
  async changePrice(query) {
    return await Axios.post("/storeDrama/changePrice", query);
  },
  /**
   * 批量删除店铺剧本
   */
  async deleteStoreDrama(query) {
    return await Axios.post("/storeDrama/deleteStoreDrama", query);
  },
  /**
   * 置顶店铺剧本
   */
  async storeDramaMoveTop(query) {
    return await Axios.post("/storeDrama/moveTop", query);
  },
  /**
   * 取消置顶店铺剧本
   */
  async storeDramaCancelMoveTop(query) {
    return await Axios.post("/storeDrama/cancelMoveTop", query);
  },
  /**
   * 推荐店铺剧本
   */
  async storeDramaSetRecommend(query) {
    return await Axios.post("/storeDrama/setRecommend", query);
  },
  /**
   * 取消推荐店铺剧本
   */
  async storeDramaCancelRecommend(query) {
    return await Axios.post("/storeDrama/cancelRecommend", query);
  },
  /**
   * 店铺剧本新增
   */
  async storeDramaAdd(query) {
    return await Axios.post("/storeDrama/add", query);
  },
  /**
   * 店铺剧本-获取剧本标准价格
   */
  async getStoreDramaStandardPrice(query) {
    return await Axios.post("/storeDrama/getStoreDramaStandardPrice", query);
  },
  /**
   * 店铺剧本-设置剧本标准价格
   */
  async setStoreStandardPrice(query) {
    return await Axios.post("/storeDrama/setStoreStandardPrice", query);
  }
};
