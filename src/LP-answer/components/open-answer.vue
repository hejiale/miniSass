<template>
  <scroll-view class="answerPage" scroll-y>
    <div class="answerPage-numBox">{{ currentAnswer.titleSeq || 1 }}/20</div>
    <div class="answerPage-title">
      请选择下列描述中最符合你的和最不符合你 的，各选一项。
    </div>
    <answerQuestion :questions="currentAnswer.choiceItemList" ref="answerQuestion"></answerQuestion>
    <!-- <div class="answerPage-note">请完成本题后再浏览下一题</div> -->
    <div class="answerPage-bottom">
      <div
        class="answerPage-bottom-pre"
        @click="onGoPre"
        v-if="currentAnswer && currentAnswer.titleSeq > 1"
      >
        上一题
      </div>
      <div class="answerPage-bottom-next" @click="onGoNext" v-if="currentAnswer && currentAnswer.titleSeq < 20">下一题</div>
      <div class="answerPage-bottom-next" @click="onGoNext" v-if="currentAnswer && currentAnswer.titleSeq === 20">提交</div>
    </div>
    <div style="height: 48rpx"></div>
  </scroll-view>
</template>
  <script>
import answerQuestion from "../components/answerQuestion.vue";
import service from "../utils/service";
export default {
  components: {
    answerQuestion,
  },
  props:{
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      questions: [],
      currentAnswer: {},
      lpUserInfo: null,
    };
  },
  async mounted() {
    let userInfo = await this.$checkLogin.getUserInfo();

    this.lpUserInfo = await service.queryLpUserMessage({
      userId: userInfo.id,
    });

    await this.queryQuestionList();
    await this.getAnswer(this.level);
  },
  methods: {
    onGoPre() {
      let index = this.currentAnswer.titleSeq - 1;
      this.currentAnswer = this.questions[index - 1];
      this.getAnswer(this.currentAnswer.titleSeq);
    },
    onGoNext() {
      let that = this;

      this.$refs.answerQuestion.save(this.currentAnswer.titleSeq).then(_=>{
        if(this.currentAnswer.titleSeq === 20){
          this.$emit('finish')
        }else{
          this.$refs.answerQuestion.clear();
        
          let index = this.currentAnswer.titleSeq - 1;
          this.currentAnswer = this.questions[index + 1];

          this.getAnswer(this.currentAnswer.titleSeq);
        }
      }).catch(e=>{})
    },
    async queryQuestionList() {
      try {
        let res = await service.queryQuestionnaireList({});

        this.currentAnswer = res[this.level - 1];
        this.questions = res;
      } catch (e) {}
    },
    async getAnswer(seq){
      try{
        let res = await service.getUserChoice({lpUserId: this.lpUserInfo.id, questionnaireSeq: seq})

        if(res.questionnaireMId && res.questionnaireLId){
          this.$nextTick(_=>{
            this.$refs.answerQuestion.refresh(res.questionnaireMId, res.questionnaireLId)
          })
        }
      }catch(e){

      }
    }
  },
};
</script>
  <style lang="scss" scoped>
.answerPage {
  position: fixed;
  left: 4vw;
  top: 12vh;
  width: 92vw;
  height: 86vh;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1;
  padding: 0px 44rpx;
  box-sizing: border-box;
  &-numBox {
    margin: 30rpx 0px 10vh 50%;
    transform: translateX(-50%);
    width: 192rpx;
    height: 59rpx;
    background: #ef4d6f;
    border-radius: 14rpx 14rpx 14rpx 14rpx;
    @include hor-center-center;
    font-size: 30rpx;
    color: #fff;
  }
  &-title {
    font-weight: 700;
    font-size: 30rpx;
    color: #7e1a28;
    line-height: 45rpx;
    margin-top: 66rpx;
    margin-bottom: 63rpx;
  }
  &-note {
    margin: 12vh 0px 0rpx 50%;
    transform: translateX(-50%);
    width: 443rpx;
    height: 72rpx;
    background: #ef4d6f;
    border-radius: 14rpx 14rpx 14rpx 14rpx;
    @include hor-center-center;
    font-size: 30rpx;
    color: #fff;
  }
  &-bottom {
    @include hor;
    margin-top: 12vh;
    position: relative;
    &-pre {
      position: absolute;
      left: 20rpx;
      width: 192rpx;
      height: 59rpx;
      background: #ef4d6f;
      border-radius: 14rpx;
      font-size: 30rpx;
      color: #fff;
      @include hor-center-center;
    }
    &-next {
      position: absolute;
      right: 20rpx;
      width: 192rpx;
      height: 59rpx;
      background: #ef4d6f;
      border-radius: 14rpx;
      font-size: 30rpx;
      color: #fff;
      @include hor-center-center;
    }
  }
}
</style>