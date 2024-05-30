<template>
  <div class="answerPage">
    <div class="answerPage-titleBox">
      <div class="answerPage-titleBox-item">描述</div>
      <div class="answerPage-titleBox-item">最符合(M)</div>
      <div class="answerPage-titleBox-item">最不符合(L)</div>
    </div>
    <div class="answerPage-question" v-for="v in answerQuestions" :key="v.id">
      <div class="answerPage-question-text">{{ v.choiceItem }}</div>
      <div
        class="answerPage-question-item"
        :class="{ select: matchs[0].id === v.id }"
        @click="onSelectLeft(v)"
      >
        <div
          class="answerPage-question-item-selectBox"
          v-if="matchs[0].id === v.id"
        >
          <van-icon name="success" color="#7E1A28" size="20" />
        </div>
      </div>
      <div
        class="answerPage-question-item"
        :class="{ select: matchs[1].id === v.id }"
        @click="onSelectRight(v)"
      >
        <div
          class="answerPage-question-item-selectBox"
          v-if="matchs[1].id === v.id"
        >
          <van-icon name="success" color="#7E1A28" size="20" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "../utils/service";
export default {
  props: {
    questions: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      answerQuestions: [],
      matchs: [
        { id: null },
        { id: null },
      ],
      lpUserInfo: null,
    };
  },
  async mounted() {
    let userInfo = await this.$checkLogin.getUserInfo();

    this.lpUserInfo = await service.queryLpUserMessage({
      userId: userInfo.id,
    });
    
  },
  watch: {
    questions: {
      handler(newVal) {
        //深拷贝
        this.answerQuestions = JSON.parse(JSON.stringify(this.questions));

        //默认不可用时
        if (this.disabled) {
          this.matchs = [
            { id: this.answerQuestions[0].id },
            { id: this.answerQuestions[2].id },
          ];
        }
      },
      immediate: true,
    },
  },
  methods: {
    onSelectLeft(v) {
      if (this.disabled) return;

      if (this.matchs[1].id === v.id) return;

      this.matchs[0].id = v.id;
    },
    onSelectRight(v) {
      if (this.disabled) return;

      if (this.matchs[0].id === v.id) return;

      this.matchs[1].id = v.id;
    },
    save(seq) {
      return new Promise(async (resolve, reject) => {
        if (this.matchs[0].id && this.matchs[1].id) {
          try {
            await service.userChoice({
              lpUserId: this.lpUserInfo.id,
              questionnaireLId: parseInt(this.matchs[1].id),
              questionnaireMId: parseInt(this.matchs[0].id),
              questionnaireSeq: seq,
            });
            resolve();
          } catch (e) {
            reject();
          }
        } else {
          uni.showModal({
            title: "提示",
            showCancel: false,
            content: "请完成本题后再浏览下一题",
          });
          reject();
        }
      });
    },
    clear() {
      this.matchs = [
        { id: null },
        { id: null },
      ];
    },
    refresh(questionnaireMId, questionnaireLId){
      this.matchs = [{id: questionnaireMId},{id: questionnaireLId}]
      console.log(this.matchs);
    }
  },
};
</script>
<style lang="scss" scoped>
.answerPage {
  width: 79.3vw;
  background: rgba(216, 216, 216, 0);
  border-radius: 14rpx;
  border: 2rpx solid #7e1a28;
  &-titleBox {
    margin-top: 36rpx;
    margin-bottom: 26rpx;
    @include hor;
    align-items: center;
    &-item {
      display: flex;
      flex: 1;
      justify-content: center;
      font-weight: 700;
      font-size: 30rpx;
      color: #7e1a28;
      line-height: 45rpx;
    }
  }
  &-question {
    @include hor;
    align-items: center;
    padding-right: 14rpx;
    box-sizing: border-box;
    &-item,
    &-text {
      display: flex;
      flex: 1;
      justify-content: center;
      width: 174rpx;
      height: 87rpx;
      background: rgba(216, 216, 216, 0);
      border-radius: 14rpx;
      border: 2rpx solid #7e1a28;
      margin-left: 14rpx;
      margin-bottom: 14rpx;
      @include hor-center-center;
      &-selectBox {
        background: #fff;
        width: 46rpx;
        height: 46rpx;
        @include hor-center-center;
        border-radius: 50%;
      }
    }
    .select {
      background: #7e1a28;
    }
    &-text {
      padding: 10rpx;
      box-sizing: border-box;
      font-size: 24rpx;
      color: #7e1a28;
      line-height: 35rpx;
      @include text-overflow-line(2);
    }
  }
}
</style>