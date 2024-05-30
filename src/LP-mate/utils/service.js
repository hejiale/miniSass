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
   * LP-TA的剧场时光
   */
  async theatreTime(query) {
    return await Axios.post("/LpActivityUser/theatreTime", query);
  },
  /**
   * LP-剩余匹配次数
   */
  async remainingMatchingTimes(query) {
    return await Axios.post("/lpUserMatchCount/remainingMatchingTimes", query);
  },
  /**
   * LP-收费次数商品列表
   */
  async feeCountProduct(query) {
    return await Axios.post("/lpUserMatchCount/feeCountProduct", query);
  },
  /**
   * LP-匹配条件缓存查询
   */
  async lpUserMatchCountMatching(query) {
    return await Axios.post("/lpUserMatchCount/matchingRequirementSave", query);
  },
  /**
   * LP-匹配条件缓存查询
   */
  async matchingRequirementsCache(query) {
    return await Axios.post("/lpUserMatchCount/matchingRequirementsCache", query);
  },
  /**
   * LP-匹配条件缓存查询
   */
  async startlpUserMatch(query) {
    return await Axios.post("/lpUserMatchCount/matching", query);
  },
  /**
   * LP-活动列表
   */
  async LpActivityList(query) {
    return await Axios.post("/LpActivity/list", query);
  },
  /**
   * LP-邀请活动
   */
  async lpUserInviteActiveInvite(query) {
    return await Axios.post("/lpUserInviteActive/invite", query);
  },
  /**
   * LP-关注
   */
  async lpUserFollowFocus(query) {
    return await Axios.post("/lpUserFollow/follow", query);
  },
  /**
   * LP-取消关注
   */
  async lpUserFollowCancelFocus(query) {
    return await Axios.post("/lpUserFollow/unfollow", query);
  },
  /**
   * LP-是否关注
   */
  async lpUserFollowIsFollow(query) {
    return await Axios.post("/lpUserFollow/isFollow", query);
  },
  /**
   * LP-根据tab展示列表
   */
  async InviteActiveListByTable(query) {
    return await Axios.post("/lpUserInviteActive/InviteActiveListByTable", query);
  },
  /**
   * LP-根据tab展示关注列表
   */
  async followListByTab(query) {
    return await Axios.post("/lpUserFollow/followListByTab", query);
  },
  /**
   * LP-关注数量
   */
  async followCount(query) {
    return await Axios.post("/lpUserFollow/followCount", query);
  },
  /**
   * LP-首页星球轨道小球
   */
  async simulateOrbitalMotion(query) {
    return await Axios.post("/LpUserMessage/simulateOrbitalMotion", query);
  },
}