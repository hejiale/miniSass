import Axios from "axios";

export default {
    /**
     * 店铺剧本申领-申请详情
     */
    async getBoxStoreApplyCheckDetail(query) {
        return await Axios.post(
            "/boxStoreApply/queryBoxStoreApplyInfo",
            query
        );
    },
    /**
     * 店铺剧本申领-申请详情  通过ID查询
     */
    async getBoxStoreApplyCheckDetailById(query) {
        return await Axios.post(
            "/boxStoreApply/getBoxStoreApplyCheckDetailById",
            query
        );
    },
    /**
     * 店铺剧本申领-新增
     */
    async addBoxStoreApply(query) {
        return await Axios.post("/boxStoreApply/addBoxStoreApply", query);
    },
    /**
     * 店铺剧本申领-更新
     */
    async updateBoxStoreApplyWithMp(query) {
        return await Axios.post("/boxStoreApply/editBoxStoreApply", query);
    },
    /**
     * 店铺剧本申领-B端剧本待申领列表
     */
    async boxDramaApplyBListExpect(query) {
        return await Axios.post("/boxDramaApply/bListExpect",query);
    },
    /**
     * 店铺剧本申领-B端剧本已申领列表
     */
    async boxDramaApplyBListExist(query) {
        return await Axios.post("/boxDramaApply/bListExist",query);
    },
    /**
     * 剧本申领-店铺状态查询
     */
    async checkBoxDramaApply(query) {
        return await Axios.post("/boxDramaApply/checkBoxDramaApply", query);
    },
    /**
     * 剧本申领-详情题目
     */
    async getBoxDramaApplyDetail(query) {
        return await Axios.post("/boxDramaApply/getBoxDramaApplyByProductId", query);
    },
    /**
     * 剧本申领-商品详情
     */
    async productDetail(query) {
        return await Axios.post("/product/detail", query);
    },
    /**
     * 申领订单信息
     */
    async queryBoxStoreApplyDetail(query) {
        return await Axios.post("/boxStoreApply/queryBoxStoreApplyDetail", query);
    },
    /**
     * 校验指定商品是否存在未支付且未关闭的订单
     */
    async checkProductOrder(query) {
        return await Axios.post("/order/checkProductOrder", query);
    }
}