import Axios from "axios";

export default {
    /*店铺接口 剧评详情页-发布剧评 -关联店铺
*/
    async queryStoreDrama(data) {
        return await Axios.post("/store/queryStoreDrama", data);
    },
    /*动态详情-V2
*/
    async dynamicDetail(data) {
        return await Axios.post("/userDynamicCircle/dynamicDetail", data);
    },
    /*用户查询接口
*/
    async queryUserList(data) {
        return await Axios.post("/user/queryUserList", data);
    },
    /*剧本排行榜列表
*/
    async rankingList(data) {
        return await Axios.post("/v2/drama/rankingList", data);
    },
    /*发现-查询资讯
*/
    async officialDynamicList(data) {
        return await Axios.post("/backend/activity/officialDynamicList", data);
    },
    /*动态圈接口:
发布动态:
*/
    async addDynamicWithDrama(data) {
        return await Axios.post("/userDynamicCircle/addDynamicWithDrama", data);
    },
    /*关联剧本
*/
    async queryDramaPage(data) {
        return await Axios.post("/v2/drama/dramaGatherPage", data);
    },
    /*圈子-查询动态圈列表（分页）
*/
    async queryDynamicWithDramaPage(data) {
        return await Axios.post("/userDynamicCircle/queryDynamicWithDramaPage", data);
    },
    /*APP-关注-关注、取消关注用户
*/
    async updateUserFocus(data) {
        return await Axios.post("/userFocus/updateUserFocus", data);
    },
    /*圈子-查询评论列表(分页)
*/
    async queryDynamicCommentPage(data) {
        return await Axios.post("/userDynamicCircle/queryDynamicCommentPage", data);
    },
    /*圈子-圈子-发表评论
*/
    async addUserDynamicComment(data) {
        return await Axios.post("/userDynamicCircle/addUserDynamicComment", data);
    },
};
