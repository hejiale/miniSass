<template>
  <div class="stochastic">
    <image class="bg" src="../../static/tool-bg.png" />
    <div class="stochastic-content">
      <div class="stochastic-content-title">
        <span>{{ title }}</span>
        <div class="close" @click="pageTwoClose">
          <div></div>
        </div>
      </div>
      <scroll-view class="stochastic-content-scroll" scroll-y>
        <div class="prob">
          <div class="prob-text">请输入成功几率</div>
          <div class="prob-inp">
            <input type="number" v-model="prod" />
            <span>%</span>
          </div>
        </div>
        <div class="box" v-for="item in stochasticRoleList" :key="item.roleId">
          <div class="box-left">
            <div class="box-left-head">
              <div></div>
              <image :src="getRoleAvatar(item.roleId)" />
            </div>
            <div class="box-left-name">
              {{ getRoleName(item.roleId) }}
            </div>
          </div>
          <div class="box-right">
            <div
              class="box-right-prob"
              v-if="Number(item.randomNum) || item.randomNum == 0"
            >
              {{ item.randomNum }}%
            </div>
            <div
              class="box-right-border"
              @click="send(item)"
              v-if="!item.isSend"
            >
              <div class="box-right-border-bg" :class="'box-right-border-send'">
                <div>发送</div>
              </div>
            </div>
            <div class="box-right-border" v-else>
              <div class="box-right-border-bg">
                <div>已发送</div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import service from "@/services/game.js";
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
    return {
      prod: null,
    };
  },
  computed: {
    ...mapState("dm", [
      "murderMysteryOnlineRecordId",
      "stochasticDetail",
      "stochasticRoleList",
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
    getRoleAvatar() {
      return function (id) {
        let avatar = null;
        this.rolePlayersList.map((v) => {
          if (v.roleId == id) avatar = v.roleAvatar;
        });
        return avatar;
      };
    },
  },
  methods: {
    ...mapActions("dm", ["queryRollList"]),
    pageTwoClose() {
      this.$emit("update:pageTwo", null);
      this.prod = null;
    },
    async send(item) {
      if (!Number(this.prod) && this.prod != 0) {
        uni.showToast({
          title: "请输入概率",
          icon: "none",
        });
        return;
      } else if (Number(this.prod) > 100 || Number(this.prod) < 0) {
        uni.showToast({
          title: "请输入正确概率",
          icon: "none",
        });
        return;
      }
      uni.showLoading({
        title: "发送中",
      });
      await service.startRoll({
        ...this.murderMysteryOnlineRecordId,
        randomNum: Number(this.prod),
        rollId: this.stochasticDetail.id,
        userId: item.userId,
      });
      await service.distributeTool({
        ...this.murderMysteryOnlineRecordId,
        toolType: "ROLL",
        toolId: this.stochasticDetail.id,
        userId: item.userId,
      });
      this.stochasticRoleList.map((v) => {
        if (v.roleId == item.roleId) {
          v.randomNum = this.prod;
        }
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
      .prob {
        &-text {
          font-size: 26rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ccbc91;
          line-height: 29rpx;
          text-align: center;
        }
        &-inp {
          box-sizing: border-box;
          width: 234rpx;
          height: 72rpx;
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          margin: 26rpx auto 0;
          padding: 0 50rpx 0 68rpx;
          input {
            flex: 1;
            height: 100%;
            font-size: 40rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #c1baaa;
            line-height: 44rpx;
          }
          span {
            font-size: 32rpx;
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #c1baaa;
            line-height: 72rpx;
          }
        }
      }
      .box {
        margin-top: 38rpx;
        margin-bottom: 20rpx;
        margin-right: 12rpx;
        padding: 22rpx 36rpx 24rpx;
        background: #000000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-left {
          display: flex;
          align-items: center;
          &-head {
            width: 64rpx;
            height: 64rpx;
            margin-right: 28rpx;
            position: relative;
            div {
              width: 60rpx;
              height: 60rpx;
              border-radius: 50%;
              border: 2rpx solid rgba(255, 255, 255, 0.4);
              position: absolute;
            }
            image {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          &-name {
            font-size: 32rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 35rpx;
          }
        }
        &-right {
          display: flex;
          align-items: center;
          &-prob {
            font-size: 32rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 35rpx;
            margin-right: 24rpx;
          }
          &-border {
            box-sizing: border-box;
            width: 168rpx;
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
                color: #afa076;
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
