import Axios from "axios";

export default {
    /**
     * 查询订单列表
     */
    async queryOrderList(query) {
        return await Axios.post("/order/b-list", query);
    },
    /**
     * 查询订单详情
     */
    async queryOrderDetail(query) {
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
      确认收货
     */
    async storeApplyDramaWriteOff(query) {
        return await Axios.post("/orderLogistics/storeApplyDramaWriteOff", query);
    },
    /**
     * 检测开本状态
     */
    async onlineGameCheckOnlineGame(query) {
        return await Axios.post("/onlineGame/checkOnlineGame", query);
    },

}