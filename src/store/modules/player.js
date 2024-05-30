import service from "@/services/game.js";
const getDefaultState = () => {
  return {
    userInfo: {},
    rolePlayersList: [], // 获取角色
    murderMysteryOnlineRecordId: null,
    dramaItem: {}, // 剧本信息
    options: {}, // 路由参数
    roomInfo: {}, // 房间状态
    publicClues: [], // 公开池线索
    privateClues: [], // 玩家池线索
    clueType: "all", // 线索类型
    toolList: [], // 工具列表
    jigsawList: {}, // 拼图池
    trueJigsawList: {}, //正确拼图
    isJigsawSuccess: false, //拼图成功
    isEmail: false,
    isPassword: false,
    passwordInfo: null, //密码解锁信息
    userRole: {}, // 当前用户角色信息
    currentRoundInfo:{ }
  }
}
const state = getDefaultState();
export default {
  namespaced: true,
  state,
  mutations: {
    // 保存用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 获取角色-用户
    setRolePlayersList(state, rolePlayersList) {
      state.rolePlayersList = rolePlayersList;
    },
    // 开场记录
    setMurderMysteryOnlineRecordId(state, murderMysteryOnlineRecordId) {
      state.murderMysteryOnlineRecordId = murderMysteryOnlineRecordId;
    },
    // 剧本信息
    setDramaItem(state, dramaItem) {
      state.dramaItem = dramaItem;
    },
    setOptions(state, options) {
      state.options = options;
    },
    setRoomInfo(state, roomInfo) {
      state.roomInfo = roomInfo;
    },
    // 获取公开池线索
    setPublicClues(state, publicClues) {
      state.publicClues = publicClues;
    },
    // 获取玩家池线索
    setPrivateClues(state, privateClues) {
      state.privateClues = privateClues;
    },
    setClueType(state, clueType) {
      state.clueType = clueType;
    },
    setToolList(state, toolList) {
      state.toolList = toolList;
    },
    // 拼图池数据
    setJigsawList(state, jigsawList) {
      state.jigsawList = jigsawList;
    },
    // 正确拼图数据
    setTrueJigsawList(state, trueJigsawList) {
      state.trueJigsawList = trueJigsawList;
    },
    // 拼图是否完成
    setIsJigsawSuccess(state, isJigsawSuccess) {
      state.isJigsawSuccess = isJigsawSuccess;
    },
    // 回合信息
    setRoundInfo(state, roundInfo) {
      state.roundInfo = roundInfo;
    },
    setIsEmail(state, isEmail) {
      state.isEmail = isEmail;
    },
    setIsPassword(state, isPassword) {
      state.isPassword = isPassword;
    },
    setPasswordInfo(state, passwordInfo){
      state.passwordInfo = passwordInfo;
    },
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    setUserRole(state, userRole) {
      state.userRole = userRole;
    },
    setCurrentRoundInfo(state, currentRoundInfo) {
      state.currentRoundInfo = currentRoundInfo;
    },
  },
  actions: {
    async getUserInfo({ commit, dispatch, state }) {
      const res = await service.getUserSelf();
      commit("setUserInfo", res);
      res.id && dispatch("checkOnlineRoom");

      wx.hideLoading();
    },
    // 获取角色-用户
    async getRolePlayers({ commit, state }) {
      if (!state.murderMysteryOnlineRecordId) return;
      const res = await service.getRolePlayers({
        murderMysteryOnlineRecordId: state.murderMysteryOnlineRecordId,
      });
      let list = res.rolePlayerItemList
      if(list.length) {
        commit("setRolePlayersList", list);
        let index = list.findIndex(v=>v.userId === state.userInfo.id);
        if(index != -1){
          commit("setUserRole", list[index]);
        }
       
      }
    },
    // 检测玩家-查询房间状态
    async checkOnlineRoom({ commit, dispatch, state }) {
      const res = await service.checkOnlineRoom({
        roomId: state.options.roomId,
        userId: state.userInfo.id
      });
      if (
        !res.murderMysteryOnlineRecord ||
        res.murderMysteryOnlineRecord.roomStatus === "FINISH" ||
        res.murderMysteryOnlineRecord.roomStatus === "CLOSE"
      ) {
        uni.showToast({
          title: "房间已关闭",
          icon: "none",
          duration: 2000,
        });
        setTimeout(() => {
          uni.switchTab({
            url: "/pages/index/index",
          });
        }, 2000);
        commit('RESET_STATE');
        return;
      } 
      dispatch('checkoutUser', {
        ...res,
      });
     
      // res.roleItems && commit('setRoleItems', res.roleItems);
    },
    /**
     * 获取公开池线索
     */
    async getPublicClues({ commit, state }) {
      let obj = {};
      if (state.clueType != "all") {
        obj.clueType = state.clueType;
      }
      const res = await service.getPublicClues({
        roomNumber: state.options.roomId,
        userId: state.userInfo.id,
        ...obj,
      });
      commit("setPublicClues", res.clues);
    },
    /**
     * 获取玩家池线索
     */
    async getPrivateClues({ commit, state }) {
      let obj = {};
      if (state.clueType != "all") {
        obj.clueType = state.clueType;
      }
      const res = await service.getPrivateClues({
        roomNumber: state.options.roomId,
        userId: state.userInfo.id,
        ...obj,
      });
      commit("setPrivateClues", res.clues);
    },
    // 上报用户信息
    async enterRoom({ commit, state }) {
      if (!state.userInfo.id || !state.murderMysteryOnlineRecordId || !state.userInfo.phone) return;
      const res = await service.enterRoom({
        murderMysteryOnlineRecordId: state.murderMysteryOnlineRecordId,
        userId: state.userInfo.id,
      });
    },
    // 玩家查询工具
    async getToolList({ commit, state }) {
      const res = await service.getToolList({
        murderMysteryOnlineRecordId: state.murderMysteryOnlineRecordId,
        userId: state.userInfo.id,
      });
      commit("setToolList", res);
    },
    /**
     * 获取拼图池
     */
    async getJigsawCurrentList({ commit, state }, { ...params }) {
      const res = await service.getCurrentJigsaw(params);
      commit("setJigsawList", res);
    },
    async checkoutUser({ commit, dispatch, state },{ ...res }) {
     //判断是DM点击分享进入的情况，重定向页面
      let dmUser = await service.checkUserCurrentGame({
        userId: state.userInfo.id,
        storeId: state.roomInfo.storeId,
      });
      if (dmUser.isDM) {
        uni.redirectTo({
          url: `/game-DM/pages/index`,
        });
        return;
      }
      // 查询当前人是否有局 
      let userCurrent = await service.checkUserCurrentGame({
        storeId: state.roomInfo.storeId,
        userId: state.userInfo.id
      })
      if(userCurrent.flag) {
        if (userCurrent.roomId && res.murderMysteryOnlineRecord.roomId === userCurrent.roomId ) {

        } else {
          uni.showToast({
            title: "请联系DM关闭旧房间",
            icon: "none",
            duration: 2000,
          });
          setTimeout(() => {
            uni.switchTab({
              url: "/pages/index/index",
            });
          }, 2000);
          commit('RESET_STATE');
          return;
        }
      } 
      let isPlayer = await service.isThisGamePlayer({
        recordId: res.murderMysteryOnlineRecord.id,
        userId: state.userInfo.id
      })
      if(res.gameStatus === "CHOOSE_ROLE" || res.gameStatus === "PLAYING") {
        if(!isPlayer.flag) {
          uni.showToast({
            title: "非本房间玩家",
            icon: "none",
            duration: 2000,
          });
          setTimeout(() => {
            commit('RESET_STATE');
            uni.switchTab({
              url: "/pages/index/index",
            });
          }, 2000);
          return;
        }
      }
      
      if (res.gameStatus === "CHOOSE_SEAT") {
        if(state.userInfo.phone) {
          dispatch("enterRoom");
        }
      } else {
        dispatch('getRolePlayers');
      }
        res.dramaItem &&
          commit("setDramaItem", {
            content: res?.dramaItem?.content ?? "",
            dramaCover: res?.dramaItem?.dramaCover ?? "",
            dramaName: res?.dramaItem?.dramaName ?? "",
            dramaRoleList: res?.dramaItem?.dramaRoleList ?? "",
            imageOtherList: res?.dramaItem?.imageOtherList ?? "",
            backgroundUrl: res?.dramaItem?.backgroundUrl ?? "",
            logoUrl: res?.dramaItem?.logoUrl ?? "",
          });
          
        res.murderMysteryOnlineRecord &&
          commit("setRoomInfo", {
            ...res.murderMysteryOnlineRecord,
            playerNum: res.playerNum,
            isRaiseHand: res.isRaiseHand,
            isAllPosition: res.isAllPosition,
            gameStatus: res.gameStatus,
            userId: state.userInfo.id,
            storeId: res.storeId,
            storeNumber: res.storeNumber
          });
    },
    // 回合信息
    async getRoundInfo({ commit, dispatch, state }) {
      const res = await service.getRoundInfo({
        murderMysteryOnlineRecordId: state.murderMysteryOnlineRecordId,
      });
      
      function sortRule(a, b) {
        return Number(a.sort) - Number(b.sort);
      }
      let list =  res.roundResultItemList.sort(sortRule)
      let arr = []
      list.map(v=>{
       arr.push(v.roundType)
      }) 
      if(arr.includes('PHYSICAL_EVIDENCE_INVESTIGATION')) {
        commit("setIsEmail",true);
      } else {
        commit("setIsEmail",false);
      }
      
      commit("setRoundInfo", [
        ...list,
      ]);
    },
    //查询密码解锁信息
    async queryPassWordInfo({ commit, state }, { ...params }){
      try{
        const res = await service.getPasswordDecryptionByRoundId({
          ...params,
        })
        commit("setPasswordInfo", res);
      }catch(e){}
    },
    // 获取当前回合信息
    async getCurrentRoundInfo({ commit, dispatch, state }) {
      const res = await service.getCurrentRoundInfo({
        murderMysteryOnlineRecordId: state.murderMysteryOnlineRecordId,
      });
      commit("setCurrentRoundInfo", res);

      if(res && res.roundType === 'PHYSICAL_EVIDENCE_INVESTIGATION') {
        commit("setIsEmail",true);
      } else {
        commit("setIsEmail",false);
      }

      if(res && res.roundType === 'PASSWORD_DECRYPTION') {
        commit("setIsPassword",true);
        dispatch("queryPassWordInfo", {id: res.id});
      } else {
        commit("setIsPassword",false);
      }
    },
  },
  getters: {},
};
