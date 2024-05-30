import ENUM from "./enums";
import api from "@/api";

/**
 * 用户城市选择跳转
 * @param resetGlobalCacheCity 是否重置全局城市信息
 */
function userChooseCityNavigator(resetGlobalCacheCity) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('USER_CHOOSE_CITY'), resetGlobalCacheCity);
}

/**
 * 剧本详情跳转
 * @param dramaId {number} 剧本编号
 */
function dramaDetailNavigator(dramaId) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('DRAMA_DETAIL'), dramaId);
}

/**
 * 剧本列表跳转
 */
function dramaListNavigator() {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('DRAMA_LIST'));
}

/**
 * 组局列表跳转
 */
function gatherListNavigator() {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('GATHER_LIST'));
}

/**
 * 组局详情跳转
 * @param gatherId {number} 组局编号
 */
function gatherDetailNavigator(gatherId) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('GATHER_DETAIL'), gatherId);
}

/**
 * 发现列表跳转
 */
function discoverListNavigator() {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('DISCOVER_LIST'));
}

/**
 * 我的组局跳转
 */
function myGatherNavigator() {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('GATHER_LIST'));
}

/**
 * 门店详情跳转
 * @param storeId {number} 门店编号
 */
function storeDetailNavigator(storeId) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('STORE_DETAIL'), storeId);
}

/**
 * 官方咨询详情跳转
 * @param activityId {number} 活动编号
 */
function activityDetailNavigator(activityId) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('CONSULATION_DETAIL'), activityId);
}

/**
 * 用户个人详情跳转
 * @param userId {number} 用户编号
 */
function userDetailNavigator(userId) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('USER_DETAIL'), userId);
}

/**
 * 用户动态详情跳转
 * @param dynamicId {number} 动态详情编号
 */
function userDynamicDetailNavigator(dynamicId) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('USER_CIRCLE_EVALUATE_DETAIL'), dynamicId);
}

/**
 * 用户发布动态页
 * @param dynamicId {number} 动态详情编号
 */
function userDynamicPublishNavigator(dynamicId) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('USER_CIRCLE_PUBLISH'), dynamicId);
}

/**
 * 排行榜列表跳转
 * @param index
 */
function rankListNavigator(index) {
    navigateTo(ENUM.NavigatorType.getPageByJumpType('RANK_LIST'), index);
}

/**
 * 首页活动活动类型
 * @param jumpType   {string}  跳转类型
 * @param jumpDetail {number} 跳转编号
 */
function activityNavigator(jumpType, jumpDetail) {
    console.log(`${jumpType}  \t  ${jumpDetail}`);
    reportUserEvent("BANNER_CLICK", [{"serviceId": jumpDetail}]);
    navigateTo(ENUM.NavigatorType.getPageByJumpType(jumpType), jumpDetail);
}

/**
 * 首页剧圈动态类型跳转
 * @param dynamicType   {number} 跳转类型
 * @param dynamicDetail {number} 跳转详情
 * @param serviceData   {number} 跳转特殊数据
 */
function dynamicNavigator(dynamicType, dynamicDetail, serviceData) {
    reportUserEvent("DYNAMIC_CLICK", [{"serviceId": dynamicDetail, "serviceData": dynamicType}]);
    navigateTo(ENUM.NavigatorType.getPageByDynamicType(dynamicType), dynamicDetail, serviceData);
}

/**
 * 特殊处理路径跳转
 * @param navigatorEnum   {string} 跳转类型
 * @param navigatorDetail {number} 跳转详情编号
 * @param dramaId         {number} 剧本编号
 */
function navigateTo(navigatorEnum, navigatorDetail, dramaId) {
    if (navigatorEnum === null || navigatorEnum === undefined) {
        return;
    }
    let page;
    if (navigatorEnum.type === 2) {
        page = `/webview/pages/index?id=${navigatorDetail}`;
    } else {
        page = navigatorEnum.value.replace(`{id}`, navigatorDetail).replace(`{dramaId}`, dramaId);
    }
    if (navigatorEnum.jumpType === 'DRAMA_LIST') {
        uni.setStorageSync("gatherTabIndex", 2);
    }
    if (navigatorEnum.type === 3) {
        uni.switchTab({url: page})
    } else {
        uni.navigateTo({url: page,});
    }
}

/*上报用户埋点*/
function reportUserEvent(reportEventType, eventDataList, page) {
    new Promise(async (resolve, reject) => {
        try {
            let data = await api.reportUserEvent({
                dataSource: "SAAS_MP",
                page: page,
                eventTypeEnum: reportEventType,
                eventDataList: eventDataList
            });
            resolve(data);
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    userChooseCityNavigator,
    dramaDetailNavigator,
    dramaListNavigator,
    gatherListNavigator,
    gatherDetailNavigator,
    myGatherNavigator,
    storeDetailNavigator,
    activityDetailNavigator,
    userDetailNavigator,
    userDynamicDetailNavigator,
    userDynamicPublishNavigator,
    dynamicNavigator,
    activityNavigator,
    reportUserEvent,
    discoverListNavigator,
    rankListNavigator
};