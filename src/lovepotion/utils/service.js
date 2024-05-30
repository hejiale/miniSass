import Axios from "axios";

export default {
  /**
   * LP-用户保存
   */
  async LpUserMessageSave(query) {
    return await Axios.post("/LpUserMessage/save", query);
  },
  /**
   * LP-用户查询
   */
  async queryLpUserMessage(query) {
    return await Axios.post("/LpUserMessage/queryLpUserMessage", query);
  },
  /**
   * LP-轮播图列表
   */
  async lpBannerList(query) {
    return await Axios.post("/lpBanner/list", query);
  },
  /**
   * LP-活动列表
   */
  async LpActivityList(query) {
    return await Axios.post("/LpActivity/CList", query);
  },
  /**
   * LP-会员报名
   */
  async LpActivityUserMemberReg(query) {
    return await Axios.post("/LpActivityUser/memberReg", query);
  },
  /**
   * C端-LP-活动详情
   */
  async LpActivityDetail(query) {
    return await Axios.post("/LpActivity/detail", query);
  },
  /**
   * LP-客服
   */
  async getLpCustomer(query) {
    return await Axios.post("/lpCustomer/get", query);
  },
  /**
   * LP-活动用户信息
   */
  async activityUserDetail(query) {
    return await Axios.post("/LpActivityUser/activityUserDetail", query);
  },
  /**
   * LP-获取太阳码（24小时缓存）
   */
  async sunCodeGenerate(query) {
    return await Axios.post("/sunCodeGenerate/v2/lp/getSunCode", query);
  },
  /**
   * LP-获取我的受邀人记录
   */
  async getMyInviteList(query) {
    return await Axios.post("/LpUserMessage/getMyInviteList", query);
  },
  /**
   * LP-获取我的受邀人记录
   */
  async getMyInviteList(query) {
    return await Axios.post("/LpUserMessage/getMyInviteList", query);
  },
  /**
   * LP-获取套餐详情
   */
  async getPackageDetail(query) {
    return await Axios.post("/lpMembershipPackage/getPackageDetail", query);
  },
  /**
   * LP-会员套餐列表
   */
  async lpMembershipPackageList(query) {
    return await Axios.post("/lpMembershipPackage/list", query);
  },
  /**
   * LP-会员购买记录
   */
  async getLpMembershipShoppingRecord(query) {
    return await Axios.post("/LpUserMessage/getLpMembershipShoppingRecord", query);
  },
  /**
   * 问卷-该LP用户是否填写
   */
  async getUserIsWrite(query) {
    return await Axios.post("/lpDisc/getUserIsWrite", query);
  }
}