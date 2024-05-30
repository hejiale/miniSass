import service from "@/services/game.js";
let SID = uni.getStorageSync("SID") && JSON.parse(uni.getStorageSync("SID"));
const getDefaultState = () => {
  return {
    userInfo: {},
    gameInfo: {}, // 游戏开始开场记录  dramaId 用的昊阳的
    roomUsersList: [],
    rolePlayersList: [], // 获取角色
    roundInfo: [], // 回合信息
    roundList: [], // 回合信息
    publicClues: [], // 公开池线索
    dmClues: [], // DM池线索
    murderMysteryOnlineRecordId: null, //	开场记录id
    voteDetail: {}, // 投票工具详情
    stochasticDetail: {}, //随机工具详情
    stochasticRoleList: {}, //随机工具角色列表
    questionDetail: {}, //问答题工具详情
    seatInfo: [], // DM座位信息
    roundActionIndex: 0, // 回合进行中索引存储
    privateClues: [], // 获取玩家池线索
    roleVisible: false,
    phoneData: {},
    emailData: [],
    questionList: [], //问答题列表
    rollList: [], //随机工具列表
    currentRoundId: null,
    stashSeatId: [],
    rolePlayersStash: [],
    toolList: []
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
    // 游戏开始开场记录
    setGameInfo(state, gameInfo) {
      state.gameInfo = gameInfo;
    },
    // 开始游戏前-获得房间内的所有用户
    setRoomUsersList(state, roomUsersList) {
      state.roomUsersList = roomUsersList;
    },
    // 获取角色-用户
    setRolePlayersList(state, rolePlayersList) {
      state.rolePlayersList = rolePlayersList;
    },
    // 回合信息
    setRoundInfo(state, roundInfo) {
      state.roundInfo = roundInfo;
    },
    setPasswordInfo(state, passwordInfo){
      state.passwordInfo = passwordInfo;
    },
    // 回合信息
    setRoundlist(state, roundList) {
      state.roundList = roundList;
    },
    // 获取公开池线索
    setPublicClues(state, publicClues) {
      state.publicClues = publicClues;
    },
    // 获取DM池线索
    setDmClues(state, dmClues) {
      state.dmClues = dmClues;
    },
    // 获取开场记录id
    setMurderMysteryOnlineRecordId(state, murderMysteryOnlineRecordId) {
      state.murderMysteryOnlineRecordId = murderMysteryOnlineRecordId;
    },
    // 获取投票工具详情
    setVoteDetail(state, voteDetail) {
      state.voteDetail = voteDetail;
    },
    // 获取随机工具详情
    setStochasticDetail(state, stochasticDetail) {
      state.stochasticDetail = stochasticDetail;
    },
    // 获取随机工具角色列表
    setStochasticRoleList(state, stochasticRoleList) {
      state.stochasticRoleList = stochasticRoleList;
    },
    // 获取问答题工具详情
    setQuestionDetail(state, questionDetail) {
      state.questionDetail = questionDetail;
    },
    // DM座位信息
    setSeatInfo(state, seatInfo) {
      state.seatInfo = seatInfo;
    },
    setRoundActionIndex(state, roundActionIndex) {
      state.roundActionIndex = roundActionIndex;
    },
    // 获取玩家池线索
    setPrivateClues(state, privateClues) {
      state.privateClues = privateClues;
    },
    // 角色详情展示
    setRoleVisible(state, roleVisible) {
      state.roleVisible = roleVisible;
    },
    // 电话数据
    setPhoneData(state, phoneData) {
      state.phoneData = phoneData;
    },
    // 邮箱数据
    setEmailData(state, emailData) {
      state.emailData = emailData;
    },
    // 问答题列表
    setQuestionList(state, questionList) {
      state.questionList = questionList;
    },
    // 随机工具列表
    setRollList(state, rollList) {
      state.rollList = rollList;
    },
    // 存储当前回合id
    setCurrentRoundId(state, currentRoundId) {
      state.currentRoundId = currentRoundId;
    },
    // 存储座位userId数组
    setStashSeatId(state, stashSeatId) {
      state.stashSeatId = stashSeatId;
    },
    setRolePlayersStash(state, rolePlayersStash) {
      state.rolePlayersStash = rolePlayersStash;
    },
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    setToolList(state, toolList) {
      state.toolList = toolList;
    },
  },
  actions: {
    async getUserInfo({ commit, dispatch /** , state */ }) {
      const res = await service.getUserSelf();
      commit("setUserInfo", res);
      
      dispatch("checkOnlineGame");
    },
    // 开始游戏前-获得房间内的所有用户
    async getRoomUsers({ commit /** , state */ }, { ...params }) {
      const res = await service.getRoomUsers(params);
      commit("setRoomUsersList", res);
    },
    // 获取角色-用户
    async getRolePlayers({ commit, state }) {
      const res = await service.getRolePlayers({
        murderMysteryOnlineRecordId: state.gameInfo.id,
      });
      // function sortRule(a, b) {
      //   return Number(a.position || 100) - Number(b.position  || 100);
      // }
      // res.rolePlayerItemList.sort(sortRule);
    
      // res.rolePlayerItemList.sort((a,b)=>{
      //   return state.stashSeatId.indexOf(a.userId)-state.stashSeatId.indexOf(b.userId);
      // });
      let stashList = []
      res.rolePlayerItemList.map(v => {
        let index = Number(v.position)
        if(index) {
          stashList[index-1] = {...v, position: Number(v.position) }
        }
      })
      // uni.hideLoading();
      commit("setRolePlayersStash", stashList);
      commit("setRolePlayersList", res.rolePlayerItemList);
    },
    // 回合信息
    async getRoundInfo({ commit, state }) {
      const res = await service.getRoundInfo({
        murderMysteryOnlineRecordId: state.gameInfo.id,
      });
      function sortRule(a, b) {
        return Number(a.sort) - Number(b.sort);
      }
      let list = res.roundResultItemList.sort(sortRule);
      list.length &&
        list.map((v, i) => {
          if (v.status == "0") {
            commit("setRoundActionIndex", i);
          }
        });
      commit("setRoundlist", list);
      let otherList = [
        {
          roundName: "其他线索",
          id: -1,
        },
      ];

      commit("setRoundInfo", [
        ...otherList,
        ...res.roundResultItemList.sort(sortRule),
      ]);
    },
    /**
     * 获取公开池线索
     */
    async getPublicClues({ commit, state }) {
      const res = await service.getPublicClues({
        roomNumber: state.gameInfo.roomId,
      });
      // uni.hideLoading();
      commit("setPublicClues", res.clues);
    },
    /**
     * 获取DM池线索
     */
    async getDmClues({ commit, state }, { ...params }) {
      const res = await service.getDmClues({
        roomNumber: state.gameInfo.roomId,
        userId: state.userInfo.id,
        roundId: state.roundInfo[0].id,
        ...params,
      });
      // uni.hideLoading();
      commit("setDmClues", res.clues);
    },
    /**
     * 检测开本状态
     */
    async checkOnlineGame({ commit, dispatch, state }) {
      const res = await service.checkOnlineGame({
        dmId: state.userInfo.id,
        storeId: uni.getStorageSync('storeId')
      });
      if (!res.murderMysteryOnlineRecord) {
        uni.showModal({
          title: "提示",
          content: "此房间已关闭！",
          showCancel: false,
          success() {
            uni.switchTab({
              url: "/pages/index/index",
            });
          },
        });
        return;
      }
      commit("setGameInfo", {
        ...res.murderMysteryOnlineRecord,
        playerNum: res.playerNum,
        isAllPosition: res.isAllPosition,
        dramaName: res.dramaName,
        dramaCover: res.dramaCover,
        activateRoundId: res.activateRoundId,
        storeNumber: res.storeNumber
      });
      commit("setCurrentRoundId", res.activateRoundId);
      let murderId = res?.murderMysteryOnlineRecord?.id ?? null;
      if (!murderId) return;
      commit("setMurderMysteryOnlineRecordId", {
        murderMysteryOnlineRecordId: murderId,
      });
      if (res.murderMysteryOnlineRecord.roomStatus === "CREATING") {
        dispatch("getRoomUsers", {
          murderMysteryOnlineRecordId: murderId,
        });
        // if (res.isAllPosition)
        dispatch("getSeatInfo");
        dispatch("getRolePlayers");
      } else {
        dispatch("getRolePlayers");
      }
    },

    /**
     * DM座位信息
     */
    async getSeatInfo({ commit, state }) {
      const res = await service.getSeatInfo({
        murderMysteryOnlineRecordId: state.gameInfo.id
      });
      res.seatItemList.length && commit("setSeatInfo", res.seatItemList);
    },
    /**
     * 获取玩家池线索
     */
    async getPrivateClues({ commit, state }, { ...params }) {
      const res = await service.getPrivateClues({
        roomNumber: state.gameInfo.roomId,
        userId: params.userId,
      });
      // uni.hideLoading();
      commit("setPrivateClues", res.clues);
      params.open && commit("setRoleVisible", true);
    },
    /**
     * 获取随机工具角色列表
     */
    async getStochasticRoleList({ commit, state }, { ...params }) {
      const res = await service.getRollPlayerList(params);
      commit("setStochasticRoleList", res);
    },
    /**
     * 获取问答题列表
     */
    async queryQuestionList({ commit, state }) {
      const res = await service.getQuestionList(
        state.murderMysteryOnlineRecordId
      );
      res.map((v) => {
        v.roleList = [];
        state.rolePlayersList.map((val) => {
          v.roleIds.map((value) => {
            if (value == val.roleId) {
              v.roleList.push(val);
            }
          });
        });
      });
      commit("setQuestionList", res);
    },
    /**
     * 获取随机工具列表
     */
    async queryRollList({ commit, state }) {
      const res = await service.getRollList(state.murderMysteryOnlineRecordId);
      commit("setRollList", res);
    },
    /**
     * DM端是否展示工具icon
     */
    async isShowToolIcon({ commit, state }) {
      const res = await service.isShowToolIcon(state.murderMysteryOnlineRecordId);
      let toolList = [
        { type: "question", src: 'tool-question' },
        { type: "vote", src: 'tool-vote' },
        { type: "stochastic", src: 'tool-stochastic' },
        { type: "jigsaw", src: 'tool-jigsaw' },
        { type: "tel", src: 'tool-tel' },
      ]
      res.length && res.map((v)=>{
        if(v.toolType === 'QUESTION') {
          toolList[0].isShow = v.isShow
        } else if(v.toolType === 'VOTE') {
          toolList[1].isShow = v.isShow
        } else if(v.toolType === 'ROLL') {
          toolList[2].isShow = v.isShow
        } else if(v.toolType === 'JIGSAW') {
          toolList[3].isShow = v.isShow
        } else if(v.toolType === 'PHONE') {
          toolList[4].isShow = v.isShow
        }
      })
      commit("setToolList", toolList);
    }
  },
  getters: {},
};
