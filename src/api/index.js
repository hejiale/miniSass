import Axios from "axios";

export default {
  /**
   * 用户-saas小程序绑定手机号
   */
  async mpBindPhone(query) {
    return await Axios.post("/auth/saveWeChatMiniAppUserPhone", query);
  },
  /**
   * 用户-更新用户微信信息
   */
  async updateUserWxMessage(query) {
    return await Axios.post("/user/saveAppUserEditInfo", query);
  },
  /**
   * 用户-用户查询
   */
  async getUserSelf(query) {
    return await Axios.post("/user/getCurrentUserInfo", query);
  },
  /**
   * 字典-字典列表查询
   */
  async queryDictList(query) {
    return await Axios.post("/dict/queryDicts", query);
  },
  /**
   * 地区-地区列表查询-级联
   */
  async queryRegionWithCodeCascadeList(query) {
    return await Axios.post("/region/getRegion", query);
  },
  /**
   * 小程序-Code2Session
   */
  async code2Session(query) {
    return await Axios.post("/auth/loginWeChatMiniApp", query);
  },
  /**
   * 卡包--我的优惠券
   */
  async myTicket(query) {
    return await Axios.post("/couponTicket/myTicket", query);
  },
  /**
   * 店铺-我的店铺更新
   */
  async updateMyStore(query) {
    return await Axios.post("/store/updateStoreDetail", query);
  },
  /**
   * 店铺-店铺详情查询
   */
  async getUserStore(query) {
    return await Axios.post("/store/queryStoreDetail", query);
  },
  /**
   * 店铺-店铺查询-首页
   */
  async getStoreHome(query) {
    return await Axios.post("/v2/store/detail", query);
  },
  /**
   * 店铺剧本-剧本列表分页查询-店铺
   */
  async queryStoreDramaPage(query) {
    return await Axios.post("/storeDrama/queryStoreDramaPage", query);
  },
  /**
   * 店铺剧本-剧本详情查询-用户查询
   */
  async getStoreDrama(query) {
    return await Axios.post("/storeDrama/queryStoreDramaDetail", query);
  },
  /*店铺接口 剧评详情页-发布剧评 -关联店铺
*/
  async queryStoreDrama(data) {
    return await Axios.post("/store/queryStoreDrama", data);
  },
  /**
   * 判断该小程序用户是否是店员
   */
  async checkIsStoreUser(query) {
    return await Axios.post("/store/userRolePermission/checkIsStoreUser", query);
  },
  /**
   * 坐标解析行政区划
   */
  async regionResolver(query) {
    return await Axios.post("/region/regionResolver", query);
  },
  /**
 * 创建订单
 */
  async createOrder(query) {
    return await Axios.post("/order/create", query);
  },
  /**
 * 网关类支付
 */
  async paymentGw(query) {
    return await Axios.post("/payment/paymentGw", query);
  },
  /**
   * 店铺用户-店铺用户列表分页查询
   */
  async queryStoreUserPage(query) {
    return await Axios.post("/storeUser/queryStoreUserPage", query);
  },
  /**
   * 店铺-获取我的店铺二维码
   */
  async getMyStoreQrCode(query) {
    return await Axios.post("/store/getMyStoreQrCode", query);
  },
  /**
   * 获取玩家组局列表
   */
  async getGatheringList(query) {
    return await Axios.post("/gathering/getGatheringList", query);
  },
  // 按字母排序获取行政区划[到县市一级]
  async getRegionByLetter(query) {
    return await Axios.post("/region/getRegionByLetterSecond", query);
  },
  async getGatheringList2(query) {
    return await Axios.post("/gathering/getCityGatheringPage", query);
  },
  /**
   * 玩家--每日组局数列表
   */
  async getUserGatheringOverviewByDate(query) {
    return await Axios.post("/gathering/getUserGatheringOverviewByDate", query);
  },
  // 获取热门城市
  async getRegionResolver(query) {
    return await Axios.post("/region/regionResolver", query);
  },
  // 获取城市筛选热门城市列表
  async getHotCity(query) {
    return await Axios.post("/region/getHotCity", query);
  },
  // 新增历史记录
  async saveCommonRegion(query) {
    return await Axios.post("/userRegion/saveCommonRegion", query);
  },
  // 查询历史城市 
  async getqueryHistoryRegionList(query) {
    return await Axios.post("/userRegion/queryHistoryRegionList", query);
  },
  // 查询优选门店
  async getPreferredStore(query) {
    return await Axios.post("/v2/store/conditionPageList", query);
  },
  // 查询热玩剧本和我想玩的
  async getDramaGatherPage(query) {
    return await Axios.post("/v2/drama/dramaGatherPage", query);
  },
  // 获取城市区域
  async getRegion(query) {
    return await Axios.post("/region/getRegion", query);
  },
  /**
   * 获取商户数据
   */
  getMerchantBase(data) {
    return Axios.post("/merchant/getMerchantBase", data);
  },
  /**
   * 获取银行编码
   */
  getBankCode(data) {
    return Axios.post("/merchant/getBankCode", data);
  },
  /* 首页banner图信息
*/
  async promotionList(data) {
    return await Axios.post("/activity/promotionList", data);
  },
  /* 首页获取城市组局列表
  */
  async getCityGatheringInfo(data) {
    return await Axios.post("/gathering/user/getCityGatheringInfo", data);
  },
  /* 首页热本推荐
 */
  async queryHotDrama() {
    return await Axios.post("/v2/drama/popularList");
  },
  /**
   * 新本速递
   */
  async queryNewDrama() {
    return await Axios.post("/drama/queryNewDrama");
  },

  /* 剧本排行榜列表
 */
  async rankingList(data) {
    return await Axios.post("/v2/drama/rankingList", data);
  },
  /* 首页剧圈动态
*/
  async homePageDynamic(data) {
    return await Axios.post("/community/homePageDynamic", data);
  },
  /* 剧圈动态点赞
*/
  async userPraiseDynamic(data) {
    return await Axios.post("/community/userPraiseDynamic", data);
  },
  /*用户埋点*/
  async reportUserEvent(data) {
    return await Axios.post("/event/saveBatch", data);
  },
  /**
   * 视频分析
   */
  detectMediaMeta(data) {
    return Axios.post("/file/detectMediaMeta", data);
  },
  /**
   * 校验图片或内容是否合规
   */
  riskCheckContent(data) {
    return Axios.post("/risk/checkContent", data);
  },

  /* 发起组局可玩的店铺列表
*/
  async storePage(data) {
    return await Axios.post("/v2/store/gather/storePage", data);
  },
  /*APP-关注-关注、取消关注用户
*/
  async updateUserFocus(data) {
    return await Axios.post("/userFocus/updateUserFocus", data);
  },
  /*圈子-查询动态圈列表（分页）
*/
  async queryDynamicWithDramaPage(data) {
    return await Axios.post("/userDynamicCircle/queryDynamicWithDramaPage", data);
  },
  /*圈子-删除动态
  */
  async deleteDynamic(data) {
    return await Axios.post("/userDynamicCircle/deleteDynamic", data);
  },
  /*剧评-删除
*/
  async deleteDramaEvaluate(data) {
    return await Axios.post("/dramaEvaluate/deleteDramaEvaluate", data);
  },
  /*剧评-编辑
*/
  async updateDramaEvaluate(data) {
    return await Axios.post("/dramaEvaluate/updateDramaEvaluate", data);
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
    )
  },
  /* 我的页面用户信息
*/
  async homePage(data) {
    return await Axios.post("/v2/user/homePage", data);
  },
  /* 我的组局列表
*/
  async playerGatheredGamePage(data) {
    return await Axios.post("/gathering/user/getCurrentGatherStation", data);
  },
  /* 角色下个人信息主页
*/
  async homePageRoleDetail(data) {
    return await Axios.post("/v2/user/homePageRoleDetail", data);
  },
  /* 我的剧评
*/
  async myDramaEvaluate(data) {
    return await Axios.post("/v2/dramaEvaluate/myDramaEvaluate", data);
  },
  /**
   * 获取太阳码
   */
  getSunCode(data) {
    return Axios.post("/sunCodeGenerate/v2/getSunCode", data);
  },
  /**
   * 首页推荐剧本列表
   */
  recommendEvaluate(data) {
    return Axios.post("/v2/dramaEvaluate/recommendEvaluate", data);
  },
  /**
   * 举报-获取举报类型
   */
  getFeedType(query) {
    return Axios.post("/userFeedBack/getFeedType", query);
  },
  /**
   * 新增反馈信息（包括举报、建议）
   */
  async addUserFeedBackRecord(query) {
    return await Axios.post("/userFeedBack/addUserFeedBackRecord", query);
  },
  /**
   * 获取主题色
   */
  async getCoverMainColor(query) {
    return await Axios.post("/v2/user/getCoverMainColor", query);
  },
  /**
   * LP预约
   */
  async addReservation(query) {
    return await Axios.post("/lpReservation/addReservation", query);
  }
};

