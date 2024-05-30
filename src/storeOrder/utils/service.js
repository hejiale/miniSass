import Axios from "axios";

export default {
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
     * 店家--踢人，退款，ignore锁车状态
     */
    async kickOutMember(query) {
        return await Axios.post("/gathering/kickOutMember", query);
    },
}