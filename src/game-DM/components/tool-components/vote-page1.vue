<template>
  <div class="vote">
    <image class="bg" src="../../static/tool-bg.png" />
    <div class="vote-content">
      <div class="vote-content-title">
        <span>{{ title }}</span>
        <div class="close" @click="pageOneClose">
          <div></div>
        </div>
      </div>
      <scroll-view class="vote-content-scroll" scroll-y>
        <div class="que">
          <div class="que-title">
            <div class="que-title-left">
              {{ $enums.VoteType.getName(voteDetail.voteType) }}
            </div>
            <div class="que-title-right">
              {{ voteDetail.title }}
            </div>
          </div>
          <div
            class="que-label"
            v-for="item in voteDetail.options"
            :key="item.id"
          >
            {{ item.content }}
          </div>
        </div>
        <div
          class="box"
          v-for="(item, index) in voteDetail.optionsResult"
          :key="index"
        >
          <div class="box-text">
            {{ getRoleName(item.roleId) }}
          </div>
          <div class="box-answer">
            <div class="box-answer-left">
              {{ item.voteOptionIds[0] == -1 ? "回答中" : "已回答" }}
            </div>
            <div class="box-answer-right">
              <div>回答：</div>
              <div>
                <div
                  class="label"
                  v-for="it in getLabel(item.voteOptionIds)"
                  :key="it.id"
                >
                  {{ it.content ? it.content : "--" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <!-- <div class="btn">
        <div class="btn-border">
          <div class="btn-border-bg">
            <div>发给所有人</div>
          </div>
        </div>
        <div class="btn-border" @click="pageTypeTwo">
          <div class="btn-border-bg">
            <div>确认发放({{ 99 }})</div>
          </div>
        </div>
      </div> -->
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
    ...mapState("dm", [
      "murderMysteryOnlineRecordId",
      "voteDetail",
      "rolePlayersList",
    ]),
    getRoleName() {
      return function (id) {
        let name = null;
        this.rolePlayersList.map((v) => {
          if (v.roleId == id) name = v.roleName;
        });
        return name;
      };
    },
    getLabel() {
      return function (arr) {
        let label = [];
        this.voteDetail.options.map((v) => {
          if(arr.length && arr.includes(v.id)) {
            label.push(v)
          }
         
        });
        if (label.length) {
          return label;
        } else {
          return [{ id: 0, content: "--" }];
        }
      };
    },
  },
  methods: {
    pageOneClose() {
      this.$emit("update:pageOne", null);
    },
    // pageTypeTwo() {
    //   this.$emit("update:pageTwo", "votePageTwo");
    // },
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
// .voteClose {
//   animation-name: closeMove;
//   animation-duration: 0.2s;
// }
// .voteOpen {
//   width: 100vw;
//   height: 84.11vh;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   z-index: 10;
//   animation-name: move;
//   animation-duration: 0.2s;
// }
.vote {
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
        margin-bottom: 32rpx;
        margin-right: 12rpx;
        &-title {
          display: flex;
          margin-bottom: 32rpx;
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
        &-label {
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #b9aa84;
          line-height: 44rpx;
          margin-top: 10rpx;
        }
      }
      .box {
        margin-bottom: 16rpx;
        margin-right: 12rpx;
        padding: 28rpx 24rpx;
        background: #000000;
        &-text {
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #c1baaa;
          line-height: 29rpx;
          margin-bottom: 16rpx;
        }
        &-answer {
          display: flex;
          &-left {
            box-sizing: border-box;
            width: 92rpx;
            height: 32rpx;
            border: 1rpx solid #b9aa84;
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
            display: flex;
            justify-content: flex-start;
            div {
              font-size: 26rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #c1baaa;
              line-height: 30rpx;
              word-break: break-all;
            }
            .label {
              display: flex;
              flex-direction: column;
              margin-bottom: 8rpx;
            }
            .label:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    .btn {
      display: flex;
      justify-content: space-evenly;
      position: absolute;
      bottom: 48rpx;
      left: 0;
      right: 0;
      &-border {
        box-sizing: border-box;
        width: 172rpx;
        height: 52rpx;
        padding: 2rpx;
        border: 2rpx solid #ccbc91;
        &-bg {
          background: linear-gradient(
            180deg,
            rgba(204, 188, 145, 0) 0%,
            rgba(204, 188, 145, 0.2) 100%
          );
          div {
            font-size: 24rpx;
            font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
            font-weight: 800;
            color: #ccbc91;
            line-height: 44rpx;
            text-align: center;
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
