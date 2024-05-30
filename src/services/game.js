import Axios from "axios";
import { enums } from "@/utils/enums";
export default {
  /**
   * 创建订单
   */
  async createOrder(query) {
    return await Axios.post("/order/create", query);
  },
  /**
   * 用户-用户查询
   */
  async getUserSelf(query) {
    return await Axios.post("/user/getCurrentUserInfo", query);
  },
  /**
   * IM-注册用户
   */
  async registerForIM(query) {
    return await Axios.post("/user/registerForIM", query);
  },

  /**
   * 开始游戏(创建房间)
   */
  // startGame(data) {
  // 	return Axios.post("/onlineGame/startGame", data);
  // },
  /**
   * 检测开本状态
   */
  checkOnlineGame(data) {
    return Axios.post("/onlineGame/checkOnlineGame", data);
  },
  /**
   * 开始游戏前-进入房间
   */
  enterRoom(data) {
    return Axios.post("/onlineGame/enterRoom", data);
  },
  /**
   * 开始游戏前-获得房间内的所有用户
   */
  getRoomUsers(data) {
    return Axios.post("/onlineGame/getRoomUsers", data);
  },
  /**
   * DM分配座位
   */
  assignSeatDM(data) {
    return Axios.post("/onlineGame/assignSeat", data);
  },
  /**
   * 用户选角色
   */
  takeSeatPlayer(data) {
    return Axios.post("/onlineGame/takeSeat", data);
  },
  /**
   * 用户取消选角色
   */
  vacateSeatPlayer(data) {
    return Axios.post("/onlineGame/vacateSeat", data);
  },
  /**
   * 游戏开场
   */
  initializeGame(data) {
    return Axios.post("/onlineGame/initializeGame", data);
  },

  /**
   * 开始游戏后-结束游戏
   */
  terminateGame(data) {
    return Axios.post("/onlineGame/terminateGame", data);
  },

  /**
   * 开始游戏前-结束游戏
   */
  terminatePreGame(data) {
    return Axios.post("/onlineGame/terminatePreGame", data);
  },
  /**
   * 获取角色-用户
   */
  getRolePlayers(data) {
    return Axios.post("/onlineGame/getRolePlayers", data);
  },

  /**
   * 检测玩家-查询房间状态
   */
  checkOnlineRoom(data) {
    return Axios.post("/onlineGame/checkOnlineRoom", data);
  },

  /**
   * 开始选择角色透传
   */
  startSelectRoleCommand(data) {
    return Axios.post("/onlineGame/startSelectRoleCommand", data);
  },
  /**
   * 回合信息
   */
  getRoundInfo(data) {
    return Axios.post("/onlineGame/getRoundInfo", data);
  },

  /**
   * DM座位信息
   */
  getSeatInfo(data) {
    return Axios.post("/onlineGame/getSeatInfo", data);
  },

  /**
   * 下个回合
   */
  startNextRound(data) {
    return Axios.post("/onlineGame/startNextRound", data);
  },

  // 线上开本线索接口 S

  /**
   * DM-线索公开
   */
  dmCluePublish(data) {
    return Axios.post("/onlineGameClue/dmCluePublish", data);
  },

  /**
   * DM-线索转移
   */
  dmClueTransfer(data) {
    return Axios.post("/onlineGameClue/dmClueTransfer", data);
  },

  /**
   * 玩家-线索公开
   */
  playerCluePublish(data) {
    return Axios.post("/onlineGameClue/playerCluePublish", data);
  },

  /**
   * 玩家-线索转移
   */
  playerClueTransfer(data) {
    return Axios.post("/onlineGameClue/playerClueTransfer", data);
  },

  /**
   * 获取DM池线索
   */
  getDmClues(data) {
    return Axios.post("/onlineGameClue/getDmClues", data);
  },

  /**
   * 获取玩家池线索
   */
  getPrivateClues(data) {
    return Axios.post("/onlineGameClue/getPrivateClues", data);
  },

  /**
   * DM-公共池线索回收
   */
  dmPublicClueBack(data) {
    return Axios.post("/onlineGameClue/dmPublicClueBack", data);
  },

  /**
   * DM-玩家线索回收
   */
  dmClueBack(data) {
    return Axios.post("/onlineGameClue/dmClueBack", data);
  },

  /**
   * 获取公开池线索
   */
  getPublicClues(data) {
    return Axios.post("/onlineGameClue/getPublicClues", data);
  },

  // 线上开本线索接口 E
  /**
   * 举手
   */
  raiseHand(data) {
    return Axios.post("/onlineGameRaiseHand/raiseHand", data);
  },

  /**
   * 取消举手
   */
  lowerHand(data) {
    return Axios.post("/onlineGameRaiseHand/lowerHand", data);
  },
  /**
   * DM-取消举手
   */
  dmLowerHand(data) {
    return Axios.post("/onlineGameRaiseHand/dmLowerHand", data);
  },

  /**
   * DM分发工具
   */
  distributeTool(data) {
    return Axios.post("/onlineGameTool/distributeTool", data);
  },

  /**
   * 获得当前拼图列表（DM端）
   */
  getTrueJigsawList(data) {
    return Axios.post("/onlineGameJigsaw/getCurrentJigsawList", data);
  },

  /**
   * 获取电话列表
   */
  getCommunicateList(data) {
    return Axios.post("/onlineGameCommunicate/getCommunicateList", data);
  },

  /**
   * 获得投票列表
   */
  getVoteList(data) {
    return Axios.post("/onlineGameVote/getVoteList", data);
  },

  /**
   * 获得Roll玩家选择列表
   */
  getRollPlayerList(data) {
    return Axios.post("/onlineGameRoll/getRollPlayerList", data);
  },

  /**
   * 开始Roll
   */
  startRoll(data) {
    return Axios.post("/onlineGameRoll/startRoll", data);
  },

  /**
   * 获得Roll列表
   */
  getRollList(data) {
    return Axios.post("/onlineGameRoll/getRollList", data);
  },

  /**
   * 获取回合音频
   */
  getRoundAudioList(data) {
    return Axios.post("/onlineGameAudio/getRoundAudioList", data);
  },

  // onlineGameTool
  /**
   * 玩家查询工具
   */
  getToolList(data) {
    return Axios.post("/onlineGameTool/getToolList", data);
  },

  /**
   * DM端是否展示工具icon
   */
  async isShowToolIcon(query) {
    return await Axios.post("/onlineGameTool/isShowToolIcon", query);
  },
  /**
   * 答题
   */
  answerQuestion(data) {
    return Axios.post("/onlineGameQuestion/answerQuestion", data);
  },

  /**
   * 获得答题详情
   */
  getAnswerDetailList(data) {
    return Axios.post("/onlineGameQuestion/getAnswerDetailList", data);
  },

  /**
   * 获得答题列表
   */
  getQuestionList(data) {
    return Axios.post("/onlineGameQuestion/getQuestionList", data);
  },

  /**
   * 获得用户答过的题
   */
  getAnswerList(data) {
    return Axios.post("/onlineGameQuestion/getAnswerList", data);
  },

  /**
   * 投票
   */
  postVote(data) {
    return Axios.post("/onlineGameVote/vote", data);
  },

  /**
   * 获取电话列表
   */
  getCommunicateListe(data) {
    return Axios.post("/onlineGameCommunicate/getCommunicateListe", data);
  },

  /**
   * 获取电话
   */
  getCommunicate(data) {
    return Axios.post("/onlineGameCommunicate/getCommunicate", data);
  },

  /**
   * 打电话
   */
  startCommunicate(data) {
    return Axios.post("/onlineGameCommunicate/startCommunicate", data);
  },

  /**
   * DM移除座位
   */
  removeSeat(data) {
    return Axios.post("/onlineGame/removeSeat", data);
  },

  /**
   * 获得Roll
   */
  getRollItem(data) {
    return Axios.post("/onlineGameRoll/getRollItem", data);
  },

  /**
   * 玩家点击随机工具
   */
  rollClick(data) {
    return Axios.post("/onlineGameRoll/rollClick", data);
  },

  /**
   * 获取玩家邮件列表
   */
  getUserEmailList(data) {
    return Axios.post("/onlineGameEmail/getUserEmailList", data);
  },

  /**
   * 读邮件
   */
  readEmail(data) {
    return Axios.post("/onlineGameEmail/readEmail", data);
  },

  /**
   * 获得当前拼图
   */
  getCurrentJigsaw(data) {
    return Axios.post("/onlineGameJigsaw/getCurrentJigsaw", data);
  },

  /**
   * 获得玩家持有的拼图
   */
  getUserJigsawList(data) {
    return Axios.post("/onlineGameJigsaw/getUserJigsawList", data);
  },

  /**
   * 放置拼图
   */
  putJigsaw(data) {
    return Axios.post("/onlineGameJigsaw/putJigsaw", data);
  },

  /**
   * 取消放置拼图
   */
  takeJigsaw(data) {
    return Axios.post("/onlineGameJigsaw/takeJigsaw", data);
  },

  /**
   * 获得正确拼图
   */
  getTrueJigsaw(data) {
    return Axios.post("/onlineGameJigsaw/getTrueJigsaw", data);
  },
  /**
   * 查询玩家是否存在进行游戏
   */
  async checkUserCurrentGame(query) {
    return await Axios.post("/onlineGame/checkUserCurrentGame", query);
  },
  /**
   * 查询玩家是否本场玩家
   */
  async isThisGamePlayer(query) {
    return await Axios.post("/onlineGame/isThisGamePlayer", query);
  },
  /**
   * 进入房间并查看当前房间的用户
   */
  async getRoomInfo(query) {
    return await Axios.post("/onlineGame/getRoomInfo", query);
  },
  /**
   * 回合ID获取密码解谜信息
   */
  async getPasswordDecryptionByRoundId(query) {
    return await Axios.post("/roundPasswordDecryption/getPasswordDecryptionByRoundId", query);
  },
  /* 获取当前回合信息
  */
  async getCurrentRoundInfo(query) {
    return await Axios.post("/onlineGame/getCurrentRoundInfo", query);
  },
  /* 获取所有的尝试记录
   */
  async getAllGuess(query) {
    return await Axios.post("/onlineGamePasswordDecryption/getAllGuess", query);
  },
  /* 尝试一次密码锁
   */
  async addOneGuess(query) {
    return await Axios.post("/onlineGamePasswordDecryption/addOneGuess", query);
  },
  /* 获得当前的尝试状态
   */
  async getGuessStatus(query) {
    return await Axios.post("/onlineGamePasswordDecryption/getGuessStatus", query);
  },
};
