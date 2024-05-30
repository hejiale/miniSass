<template>
  <div class="stochastic">
    <image class="bg" src="../../static/tool-bg.png" />
    <div class="stochastic-content">
      <div class="stochastic-content-title">
        <span>{{ title }}</span>
        <div class="close" @click="pageOneClose">
          <div></div>
        </div>
      </div>
      <scroll-view class="stochastic-content-scroll" scroll-y>
        <div class="detail">
          <div class="detail-title">
            {{ stochasticDetail.title }}
          </div>
          <!-- <div class="detail-text">
            {{ stochasticDetail.content }}
          </div> -->
        </div>
        <div class="box" v-for="item in stochasticRoleList" :key="item.roleId">
          <div class="box-left">
            <div class="box-left-head">
              <div></div>
              <image :src="getRoleAvatar(item.roleId)" />
            </div>
          </div>
          <div class="box-right">
            <div class="box-right-name">{{ getRoleName(item.roleId) }}</div>
            <div class="box-right-status">
              <div>
                <span>状态：</span
                ><span :class="item.flag == 0 ? '' : 'success'">{{
                  item.flag == '0' ? "--" : item.flag == '-1' ? "失败" : "成功"
                }}</span>
              </div>
              <div>
                <span>成功概率：</span
                ><span>{{
                  Number(item.randomNum) ? item.randomNum + "%" : "--"
                }}</span>
              </div>
            </div>
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
    pageOne: {
      type: String,
    },
  },
  data() {
    return {};
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
      .detail {
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
      }
      .box {
        margin-top: 44rpx;
        margin-bottom: 32rpx;
        margin-right: 12rpx;
        padding: 16rpx 24rpx;
        background: #000000;
        display: flex;
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
        }
        &-right {
          display: flex;
          flex-direction: column;
          &-name {
            font-size: 32rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 35rpx;
          }
          &-status {
            margin-top: 16rpx;
            div {
              margin-right: 32rpx;
              display: inline-block;
              :nth-child(1) {
                font-size: 20rpx;
                font-family: PingFang SC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 22rpx;
              }
              :nth-child(2) {
                font-size: 20rpx;
                font-family: PingFang SC-Regular, PingFang SC;
                font-weight: 400;
                color: #afa076;
                line-height: 22rpx;
              }
              .success {
                color: #f3e5c1;
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
