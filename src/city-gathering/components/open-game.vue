<template>
  <view class="enterRoom-model" v-if="isShowModel">
    <view class="enterRoom-model-bg" @click="isShowModel = false"></view>
    <view class="enterRoom-model-content">
      <view class="enterRoom-model-content-boxNew">
        <view class="enterRoom-model-content-boxNew-Hi">
          <image src="../static/image/open-game-title.png" />
        </view>
        <view class="enterRoom-model-content-boxNew-hint"
          >票房本店家先创建好房间，告知您房间号</view
        >
        <view class="enterRoom-model-content-boxNew-inp">
          <input type="number" v-model="roomNum" placeholder="输入房间号" />
        </view>
      </view>
      <div class="enterRoom-model-content-bottomBox">
        <div class="enterRoom-model-content-bottomBox-item" @click="isShowModel = false">取消</div>
        <div class="enterRoom-model-content-bottomBox-item" @click="toTicketService">确定加入房间</div>
      </div>
    </view>
  </view>
</template>
<script>
import service from "@/services/game.js";

export default {
  data() {
    return {
      isShowModel: false,
      roomNum: null,
      lastHomeInfo: null, //上一次房间信息
      confirming: false,
    };
  },
  props: {
    userInfor: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    //开启票房本房间
    async toTicketService() {
      this.$checkLogin.toTicketService(this.roomNum, this.userInfor.id).then(_=>{
        this.isShowModel = false;
        this.roomNum = null;
      }).catch(_=>{

      })
    },
  },
};
</script>
<style lang="scss" scoped>
.enterRoom-model {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: 1000;
  &-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: -1;
  }
  &-content {
    border-radius: rpx(8);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(180deg, #fff4d9 0%, #ffffff 31%);
    border-radius: 15px;
    border: 1px solid #ffffff;
    &-boxNew {
      display: flex;
      flex-direction: column;
      align-items: center;
      &-Hi {
        margin: rpx(20) rpx(24) rpx(4);
        width: 110rpx;
        height: 34rpx;
      }
      &-hint {
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5b371c;
        line-height: rpx(22);
        text-align: center;
      }
      &-inp {
        width: rpx(283);
        margin: rpx(24) rpx(17) rpx(28);
        position: relative;
        padding: 24rpx;
        background: #f5f5f5;
        border-radius: rpx(6);
        span {
          font-size: rpx(14);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: rpx(20);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &-btn {
        width: rpx(269);
        height: rpx(44);
        background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
        border-radius: rpx(40);
        margin: 0 rpx(24) rpx(16);
        font-size: rpx(16);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: rpx(44);
        text-align: center;
      }
    }
    &-already {
      display: flex;
      flex-direction: column;
      align-items: center;
      &-hint {
        margin: rpx(28) rpx(24);
        font-size: rpx(17);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2c2b3b;
        line-height: rpx(22);
        text-align: center;
      }
      &-btn {
        display: flex;
        margin: 0 rpx(16) rpx(16);
        :nth-child(1) {
          width: rpx(137);
          height: rpx(44);
          background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
          border-radius: 40px 40px 40px 40px;
          font-size: rpx(16);
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: rpx(44);
          text-align: center;
          margin-right: rpx(10);
        }
        :nth-child(2) {
          width: rpx(137);
          height: rpx(44);
          background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
          border-radius: 40px 40px 40px 40px;
          font-size: rpx(16);
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: rpx(44);
          text-align: center;
        }
      }
    }
    &-bottomBox {
      margin-top: 46rpx;
      width: 100%;
      height: 96rpx;
      border-top: 0.5px solid #cbccce;
      @include hor;
      &-item {
        width: 50%;
        height: 100%;
        @include hor-center-center;
      }
      div:nth-child(1) {
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #5f6572;
        border-right: 0.5px solid #cbccce;
      }
      div:nth-child(2) {
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #2e323e;
      }
    }
  }
}
</style>
