import Axios from "axios";

export default {
  /**
   * 店家,玩家--组局列表
   */
  async getGatheringList(query) {
    return await Axios.post(
      "/gathering/user/getCityGatheringInfo",
      query
    );
  },
  /**
   * 店铺评价列表
   */
  async evaluatePageList(query) {
    return await Axios.post(
      "/store/evaluate/pageList",
      query
    );
  },
  /**
   * 添加-【想玩-收藏】
   */
  async storePlayFocus(query) {
    return await Axios.post(
      "/user/storePlay/focus",
      query
    );
  },
  /**
   * 添加-【想玩-收藏】
   */
  async updateUserDramaPlayMP(query) {
    return await Axios.post(
      "/userDramaPlay/updateUserDramaPlayMP",
      query
    );
  },
  /**
   * 取消【想玩-收藏】
   */
  async cancelUserDramaPlayMP(query) {
    return await Axios.post(
      "/userDramaPlay/cancelUserDramaPlayMP",
      query
    );
  },
  /**
   * 分页查询店铺DM列表
   */
  async getStoreDMList(query) {
    return await Axios.post(
      "/storeUser/getStorePersonnelPage",
      query
    );
  },
  /**
   * 评价
   */
  async evaluateOperation(query) {
    return await Axios.post(
      "/store/evaluate/operation",
      query
    );
  },
  /**
   * 评价详情
   */
  async evaluateDetail(query) {
    return await Axios.post(
      "/store/evaluate/detail",
      query
    );
  },
  /**
   * 关注-关注、取消关注用户
   */
  async updateUserFocus(query) {
    return await Axios.post(
      "/userFocus/updateUserFocus",
      query
    );
  },
  /**
   * 举报-获取举报类型
   */
  async getFeedType(query) {
    return await Axios.post(
      "/userFeedBack/getFeedType",
      query
    );
  },
  /**
   * 新增反馈信息（包括举报、建议）
   */
  async addUserFeedBackRecord(query) {
    return await Axios.post(
      "/userFeedBack/addUserFeedBackRecord",
      query
    );
  }
};
