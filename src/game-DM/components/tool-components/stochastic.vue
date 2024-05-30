<template>
  <div class="stochastic">
    <image class="bg" src="../../static/tool-bg.png" />
    <div class="stochastic-content">
      <div class="stochastic-content-title">
        <span>{{ title }}</span>
        <div class="close" @click="pageClose">
          <div></div>
        </div>
      </div>
      <scroll-view class="stochastic-content-scroll" scroll-y>
        <div class="box" v-for="item in rollList" :key="item.id">
          <div class="box-title">
            {{ item.title }}
          </div>
          <div style="margin-top: 20rpx" v-html="item.content"></div>
          <!-- <div class="box-text">
            {{ item.content }}
          </div>
          <div class="box-img">
            <image
              src="https://img0.baidu.com/it/u=1485244675,2501666230&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=608"
            />
          </div> -->
          <div class="box-btn">
            <div class="box-btn-border" @click="pageTypeOne(item)">
              <div class="box-btn-border-bg">
                <div>详情</div>
              </div>
            </div>
            <div
              class="box-btn-border"
              :class="'box-btn-border-send'"
              @click="pageTypeTwo(item)"
            >
              <div class="box-btn-border-bg">
                <div>发送</div>
              </div>
            </div>
            <!-- <div class="box-btn-border" v-else>
              <div class="box-btn-border-bg">
                <div>已发送</div>
              </div>
            </div> -->
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import service from "@/services/game.js";
export default {
  props: {
    title: {
      type: String,
    },
    currentType: {
      type: String,
    },
    pageOne: {
      type: String,
    },
  },
  data() {
    return {};
  },
  created() {
    this.queryRollList();
  },
  computed: {
    ...mapState("dm", [
      "murderMysteryOnlineRecordId",
      "stochasticDetail",
      "rollList",
    ]),
  },
  methods: {
    ...mapMutations("dm", ["setStochasticDetail"]),
    ...mapActions("dm", ["getStochasticRoleList", "queryRollList"]),

    pageClose() {
      this.$emit("update:currentType", null);
    },
    pageTypeOne(item) {
      this.setStochasticDetail(item);
      this.getStochasticRoleList({
        ...this.murderMysteryOnlineRecordId,
        rollId: item.id,
      });
      this.$emit("update:pageOne", "stochasticPageOne");
    },
    pageTypeTwo(item) {
      this.setStochasticDetail(item);
      this.getStochasticRoleList({
        ...this.murderMysteryOnlineRecordId,
        rollId: item.id,
      });
      this.$emit("update:pageTwo", "stochasticPageTwo");
    },

    // async queryList() {
    //   let res = await service.getRollList(this.murderMysteryOnlineRecordId);
    //   this.rollList = res;
    // },
    async sendVote(id) {
      uni.showLoading({
        title: "发送中",
      });
      await service.distributeTool({
        ...this.murderMysteryOnlineRecordId,
        toolType: "ROLL",
        toolId: id,
      });
      await this.queryRollList();
      uni.hideLoading();
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
// .stochasticClose {
//   animation-name: closeMove;
//   animation-duration: 0.2s;
// }
// .stochasticOpen {
//   width: 100vw;
//   height: 84.11vh;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   z-index: 10;
//   animation-name: move;
//   animation-duration: 0.2s;
// }
.stochastic {
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
      .box {
        margin-bottom: 32rpx;
        margin-right: 12rpx;
        padding: 26rpx 24rpx 30rpx;
        background: #000000;
        &-title {
          font-size: 32rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #ccbc91;
          line-height: 38rpx;
          text-align: center;
        }
        &-text {
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #c1baaa;
          line-height: 30rpx;
          margin-top: 20rpx;
          word-break: break-all;
        }
        &-img {
          width: 222rpx;
          height: 254rpx;
          margin-top: 32rpx;
        }
        &-btn {
          display: flex;
          justify-content: space-evenly;
          margin-top: 62rpx;
          &-border {
            box-sizing: border-box;
            width: 160rpx;
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
                font-size: 26rpx;
                font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
                font-weight: 800;
                color: #ccbc91;
                line-height: 44rpx;
                text-align: center;
              }
            }
            &-send {
              background: linear-gradient(
                180deg,
                rgba(204, 188, 145, 0) 0%,
                rgba(204, 188, 145, 0.6) 100%
              );
              div {
                color: #f3e6c1;
              }
            }
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
