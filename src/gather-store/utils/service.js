import Axios from "axios";

export default {
    /**
       * 店家--解散组局,所有人退款
       */
    async cancelGathering(query) {
        return await Axios.post("/gathering/cancelGathering", query);
    },
    /**
     * 店家--修改占位男女人数
     */
    async changeBotNum(query) {
        return await Axios.post("/gathering/changeBotNum", query);
    },
    /**
     * 组局详情Detail
     */
    async getGatheringDetail(query) {
        return await Axios.post("/gathering/getGatheringDetail", query);
    },
    /**
     * 店家,玩家--组局列表
     */
    async getGatheringList(query) {
        return await Axios.post("/gathering/getGatheringList", query);
    },
    /**
     * 生成组局公告
     */
    async getGatheringPublicContent(query) {
        return await Axios.post("/gathering/getGatheringPublicContent", query);
    },
    /**
     * 店家--每日组局数列表
     */
    async getStoreGatheringOverviewByDate(query) {
        return await Axios.post(
            "/gathering/getStoreGatheringOverviewByDate",
            query
        );
    },
    /**
     * 店家--踢人，退款，ignore锁车状态
     */
    async kickOutMember(query) {
        return await Axios.post("/gathering/kickOutMember", query);
    },
    /**
     * 店家--锁车
     */
    async lockGathering(query) {
        return await Axios.post("/gathering/lockGathering", query);
    },
    /**
     * 店家--修改反串状态
     */
    async setIsRevertSexTrue(query) {
        return await Axios.post("/gathering/setIsRevertSexTrue", query);
    },
    /**
     * 店家--发起组局
     */
    async storeCreateGathering(query) {
        return await Axios.post("/gathering/storeCreateGathering", query);
    },
    /**
     * 店家--解锁
     */
    async unlockGathering(query) {
        return await Axios.post("/gathering/unlockGathering", query);
    },
    /**
     * 店家--一键补齐
     */
    async changeFullBotNum(query) {
        return await Axios.post("/gathering/changeFullBotNum", query);
    },
}