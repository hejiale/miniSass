import Axios from "axios";

export default {
  /**
   * 商品列表分页查询
   */
  async getStoreProductPage(query) {
    return await Axios.post("/storeProductController/getConditionStoreProductPage", query);
  },
  /* 玩家--组局列表
*/
  async getCityGatheringPage(data) {
    return await Axios.post("/gathering/getCityGatheringPage", data);
  },
  /* 剧本-APP剧本详情查询
*/
  async queryAppDramaDetail(data) {
    return await Axios.post("/drama/queryAppDramaDetail", data);
  },
  /* 剧本详情 - 相关推荐
*/
  async getDramaDetailRecommend(data) {
    return await Axios.post("/drama/getDramaDetailRecommend", data);
  },
  /* 剧本详情-可玩店铺
*/
  async queryDramaDetailStore(data) {
    return await Axios.post("/v2/store/queryDramaDetailStore", data);
  },
  /* 剧本评价-查询评价列表分页与统计结果
*/
  async queryDramaEvaluatePageAndCount(data) {
    return await Axios.post("/dramaEvaluate/queryDramaEvaluatePageAndCount", data);
  },
  // 组局列表
  async getGatheringList2(query) {
    return await Axios.post("/gathering/getCityGatheringPage", query);
  },
  /*小程序-用户剧本杀玩耍-更新
*/
  async updateUserDramaPlayMP(data) {
    return await Axios.post("/userDramaPlay/updateUserDramaPlayMP", data);
  },
  /*小程序-用户剧本杀玩耍-取消想玩、已玩
*/
  async cancelUserDramaPlayMP(data) {
    return await Axios.post("/userDramaPlay/cancelUserDramaPlayMP", data);
  },
  /*小程序-体验角色接口
*/
  async queryMurderMysteryRole(data) {
    return await Axios.post("/dramaEvaluateApp/getDramaRole", data);
  },
  /*店铺接口 剧评详情页-发布剧评 -关联店铺
*/
  async queryStoreDrama(data) {
    return await Axios.post("/store/queryStoreDrama", data);
  },
  /*剧本评价-发布评价
 */
  async addDramaEvaluate(data) {
    return await Axios.post("/dramaEvaluate/addDramaEvaluate", data);
  },
  /*剧本详情-获取剧本标签
 */
  async queryDramaDict(data) {
    return await Axios.post("/dict/queryDramaDict", data);
  },
  /*新增体验角色
 */
  async addDramaRoleOther(data) {
    return await Axios.post("/dramaRoleOther/addDramaRoleOther", data);
  },
  /*体验角色接口查询体验其他角色
 */
  async queryDramaRoleOther(data) {
    return await Axios.post("/dramaRoleOther/queryDramaRoleOther", data);
  },
  /*批量文件上传
 */
  async uploadFiles(data) {
    return await Axios.post("/file/uploadFiles", data);
  },
  /*新增草稿箱
 */
  async addDrafts(data) {
    return await Axios.post("/drafts/addDrafts", data);
  },
  /*查询店铺成员
 */
  async queryStoreUserPage(data) {
    return await Axios.post("/storeUser/queryStoreUserPage", data);
  },
  /*查询草稿箱
 */
  async queryDraftsSecond(data) {
    return await Axios.post("/drafts/queryDraftsSecond", data);
  },
  /* 剧评详情页列表
*/
  async queryDramaEvaluateComment(data) {
    return await Axios.post("/dramaEvaluate/queryDramaEvaluateComment", data);
  },
  /* 剧本评价-查询评价列表分页
*/
  async queryDramaEvaluateCommentByEvaluateId(data) {
    return await Axios.post("/dramaEvaluateComment/queryDramaEvaluateCommentByEvaluateId", data);
  },
  /* 剧本点赞
*/
  async fabulous(data) {
    return await Axios.post("/dramaEvaluateComment/fabulous", data);
  },
  /* 剧本取消点赞
*/
  async cancelFabulous(data) {
    return await Axios.post("/dramaEvaluateComment/cancelFabulous", data);
  },
  /* 新增评论接口
*/
  async publishDramaEvaluateComment(data) {
    return await Axios.post("/dramaEvaluateComment/publishDramaEvaluateComment", data);
  },
  /*圈子-查询动态圈列表（分页）
*/
  async queryDynamicWithDramaPage(data) {
    return await Axios.post("/userDynamicCircle/queryDynamicWithDramaPage", data);
  },
  /*剧本评价-查询我是否已评价
*/
  async ifExistMyEvaluate(data) {
    return await Axios.post("/dramaEvaluate/ifExistMyEvaluate", data);
  },
  /*剧本评价-查询我是否已评价
*/
  async getDramaDetailJoinDynamic(data) {
    return await Axios.post("/userDynamicCircle/getDramaDetailJoinDynamic", data);
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
};
