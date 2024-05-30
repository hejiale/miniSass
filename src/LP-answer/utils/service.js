import Axios from "axios";

export default {
  /**
   * LP-问卷列表
   */
  async queryQuestionnaireList(query) {
    return await Axios.post("/lpDisc/queryQuestionnaireList", query);
  },
  /**
   * LP-填写问卷
   */
  async userChoice(query) {
    return await Axios.post("/lpDisc/userChoice", query);
  },
  /**
   * LP-回查用户选项
   */
  async getUserChoice(query) {
    return await Axios.post("/lpDisc/getUserChoice", query);
  },
  /**
   * LP-用户查询
   */
  async queryLpUserMessage(query) {
    return await Axios.post("/LpUserMessage/queryLpUserMessage", query);
  },
}