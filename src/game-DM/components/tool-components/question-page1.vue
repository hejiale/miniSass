<template>
  <div class="question">
    <image class="bg" src="../../static/tool-bg.png" />
    <div class="question-content">
      <div class="question-content-title">
        <span>{{ title }}</span>
        <div class="close" @click="pageOneClose">
          <div></div>
        </div>
      </div>
      <scroll-view class="question-content-scroll" scroll-y>
        <div class="que">
          <div class="que-title">
            <div class="que-title-left">
              {{ $enums.QuestionType.getName(questionDetail.questionType) }}
            </div>
            <div class="que-title-right">
              {{ questionDetail.question }}
            </div>
          </div>
        </div>
        <div class="box">
          <div
            class="box-label"
            v-for="(item, index) in questionDetail.answerItemList"
            :key="index"
          >
            <span v-if="item.isTrue" :class="item.isTrue ? 'true' : ''"
              >正确答案：</span
            ><span :class="item.isTrue ? 'true' : ''">{{ item.content }}</span>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    title: {
      type: String,
    },
    currentType: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("dm", ["murderMysteryOnlineRecordId", "questionDetail"]),
  },
  methods: {
    pageOneClose() {
      this.$emit("update:pageOne", null);
    },
  },
};
</script>

<style lang="scss" scoped>
// @keyframes move {
//   0% {
//     transform: translateY(100%);
//   }
//   100% {
//     transform: translateY(0);
//   }
// }
// @keyframes closeMove {
//   0% {
//     transform: translateY(0);
//   }
//   100% {
//     transform: translateY(100%);
//   }
// }
// .questionClose {
//   animation-name: closeMove;
//   animation-duration: 0.2s;
// }
// .questionOpen {
//   width: 100vw;
//   height: 84.11vh;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   z-index: 10;
//   animation-name: move;
//   animation-duration: 0.2s;
// }
.question {
  width: 100vw;
  height: 84.11vh;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }
  &-content {
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    padding: 0 12rpx 136rpx 32rpx;
    position: relative;
    &-title {
      padding: 32rpx 0 36rpx;
      border-bottom: 2rpx solid #514c3c;
      text-align: center;
      position: relative;
      margin-bottom: 34rpx;
      margin-right: 32rpx;
      span {
        font-size: 36rpx;
        font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
        font-weight: 800;
        color: #ccbc91;
        line-height: 44rpx;
      }
      .close {
        width: 72rpx;
        height: 72rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        div {
          width: 24rpx;
          height: 24rpx;
          background: #ccbc91;
          -webkit-clip-path: polygon(
            20% 0%,
            0% 20%,
            30% 50%,
            0% 80%,
            20% 100%,
            50% 70%,
            80% 100%,
            100% 80%,
            70% 50%,
            100% 20%,
            80% 0%,
            50% 30%
          );
          clip-path: polygon(
            20% 0%,
            0% 20%,
            30% 50%,
            0% 80%,
            20% 100%,
            50% 70%,
            80% 100%,
            100% 80%,
            70% 50%,
            100% 20%,
            80% 0%,
            50% 30%
          );
        }
      }
    }
    &-scroll {
      height: 66vh;
      padding-top: 16rpx;
      .que {
        display: flex;
        flex-direction: column;
        margin-right: 12rpx;
        &-title {
          display: flex;
          &-left {
            box-sizing: border-box;
            width: 68rpx;
            height: 32rpx;
            border: 1rpx solid #c1baaa;
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #c1baaa;
            line-height: 28rpx;
            text-align: center;
            margin-right: 8rpx;
          }
          &-right {
            flex: 1;
            font-size: 26rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #c1baaa;
            line-height: 30rpx;
            word-break: break-all;
          }
        }
      }
      .box {
        margin-top: 48rpx;
        margin-right: 12rpx;
        padding: 28rpx 24rpx;
        background: #000000;
        &-label {
          span {
            font-size: 26rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #c1baaa;
            line-height: 44rpx;
            margin-bottom: 16rpx;
          }
          :last-child {
            margin-bottom: 0;
          }
          .true {
            color: #b9aa84;
          }
        }
      }
    }
  }
}
// 滚动条样式
/deep/ ::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8rpx !important;
  height: 1px !important;
  overflow: auto !important;
  background: #ccc !important;
  -webkit-appearance: auto !important;
  display: block;
}

/deep/ ::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  width: 8rpx !important;
  border-radius: 10px !important;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
  background: #615f56 !important;
}

/deep/ ::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  width: 2rpx !important;
  background: #373530 !important;
  border-radius: 20px !important;
}
</style>
