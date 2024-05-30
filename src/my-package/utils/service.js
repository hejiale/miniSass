import Axios from "axios";

export default {
    /**
     * 店铺申请-店铺申请新增
     */
    async addStoreApply(query) {
        return await Axios.post("/storeApply/addStoreApply", query);
    },
    /**
     * 店铺申请-我的店铺申请列表分页查询
     */
    async queryMyStoreApplyPage(query) {
        return await Axios.post("/storeApply/StoreApplyMyPageRequest", query);
    },
    /**
     * B端订单列表
     */
    async orderList(query) {
        return await Axios.post("/order/b-list", query);
    },
    /**
     * B端订单详情
     */
    async orderDetail(query) {
        return await Axios.post("/order/b-detail", query);
    },
    /**
     * 
      取消订单
     */
      async cancelOrder(query) {
        return await Axios.post("/order/cancelOrder", query);
    },
    /**
     * 
      玩家--主动退出组局,退款
     */
      async leaveGathering(query) {
        return await Axios.post("/gathering/leaveGathering", query);
    },
     /* 解析并校验统一社会信用代码
     */
    async checkCreditCode(query) {
        return await Axios.post("/store/checkCreditCode", query);
    },
    /* 保存用户编辑信息
     */
    async saveAppUserEditInfo(query) {
        return await Axios.post("/user/saveAppUserEditInfo", query);
    },
    /* 圈子-删除动态
     */
    async deletDynamic(query){
        return await Axios.post("/userDynamicCircle/deleteDynamic", query)
    }
}