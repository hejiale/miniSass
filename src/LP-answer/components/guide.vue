<template>
  <div>
    <scroll-view class="guidePage" scroll-y>
      <div class="guidePage-title">DISC沟通风格测试题：</div>
      <div class="guidePage-text">
        为了更好的在剧场为您提供个性化的服务，请您在剧场开始前耐心完成以下测试题。
      </div>
      <div class="guidePage-second-text">
        本测验的目的，在于寻找出您潜意识中存在而不易于被您平时觉察到的沟通特点。
        本测验共有20道题，每道题由四组形容词组成（每组形容词无好坏之分）：
      </div>
      <div class="guidePage-third-text">
        1、请仔细阅读每组形容词，并回顾过去在工作和生活中您是如何与人相处和行动的；
      </div>
      <div class="guidePage-third-text">
        2、从每道题的四组形容词中选择最能形容您的一个，在（答题纸上）“最符合”
        （M）一栏里用“√”做出标记，再从剩下的形容词中选择最不能形容您的一个，在（答题纸上）“最不符合”（L）一栏里用“√”做出标记；
      </div>
      <div class="guidePage-third-text">
        3、为力求您的数据真实确切，请直觉作答，并如实表达自己的兴趣与态度，不必顾忌到主试者或其他人的意见与立场。
      </div>
      <div class="guidePage-title mb14">例题：</div>
      <answerQuestion :questions="questions" :disabled="true"></answerQuestion>
      <div style="height: 68rpx"></div>
    </scroll-view>
    <div class="bottom" @click="onOpenAnswer">开始答题</div>
  </div>
</template>
<script>
import answerQuestion from "../components/answerQuestion.vue";
export default {
  components: {
    answerQuestion,
  },
  data() {
    return {
      questions: [
        { choiceItem: "好胜的， 竞争的", id: -1 },
        { choiceItem: "热情的， 易相处的", id: -2 },
        { choiceItem: "体谅的， 有同情心的", id: -3 },
        { choiceItem: "守纪律的， 自我约束的", id: -4 },
      ],
    };
  },
  methods:{
    onOpenAnswer(){
      this.$emit('open')
    }
  }
};
</script>
<style lang="scss" scoped>
.guidePage {
  position: fixed;
  left: 4vw;
  top: 12vh;
  width: 92vw;
  height: 74vh;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1;
  padding: 0px 44rpx;
  box-sizing: border-box;
  &-title {
    font-weight: 700;
    font-size: 30rpx;
    color: #7e1a28;
    line-height: 45rpx;
    margin-top: 66rpx;
  }
  &-text,
  &-second-text,
  &-third-text {
    margin-top: 32rpx;
    font-size: 30rpx;
    color: #7e1a28;
    line-height: 47rpx;
  }
  &-second-text,
  &-third-text {
    margin-top: 66rpx;
  }
}
.bottom {
  position: fixed;
  left: 4vw;
  width: 92vw;
  bottom: 5vh;
  height: 87rpx;
  background: #ef4d6f;
  border-radius: 14rpx 14rpx 14rpx 14rpx;
  font-size: 30rpx;
  color: #fff;
  @include hor-center-center;
}
</style>