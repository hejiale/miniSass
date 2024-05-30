import Axios from "axios";

export default {
    /**
   * 店铺用户-店铺用户列表分页查询
   */
    async queryStoreUserPage(query) {
        return await Axios.post("/storeUser/queryStoreUserPage", query);
    },
    /**
     * 店铺用户-成员移除
     */
    async removeStoreUser(query) {
        return await Axios.post("/storeUser/deleteStoreUser", query);
    },
    /**
     * 获取员工的角色(用户类型)
     */
    async getStoreUserUserType(query) {
        return await Axios.post("/store/userRolePermission/getStoreUserUserType", query);
    },
    /**
     * 设置角色给员工
     */
    async setStoreUserRole(query) {
        return await Axios.post("/store/userRolePermission/setStoreUserRole", query);
    },
    /**
     * 获取员工的权限列表
     */
    async getStoreUserPermissions(query) {
        return await Axios.post("/store/userRolePermission/getStoreUserPermissions", query);
    },
    /**
     * 设置设置员工的权限
     */
    async setUserStorePermissions(query) {
        return await Axios.post("/store/userRolePermission/setUserStorePermissions", query);
    },
}