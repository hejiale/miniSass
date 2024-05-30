<template>
  <div class="phone">
    <div class="phone-bg" @click="cancel"></div>
    <div class="phone-box">
      <div class="phone-box-info">
        <div class="phone-box-info-hand">
          <image :src="avatar" />
          <image src="../static/image/icon-female.png" />
        </div>
        <div class="phone-box-info-name">{{ nickName }}</div>
      </div>
      <div class="phone-box-num">{{ $filters.judgePhone(phone) }}</div>
      <div class="phone-box-btn" @click="onGoPhone">拨打电话</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShowPhone: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    nickName: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  methods: {
    onGoPhone() {
      wx.makePhoneCall({
        phoneNumber: this.phone,
      });
    },
    cancel() {
      this.$emit("update:isShowPhone", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes move {
  0% {
    bottom: -690rpx;
  }
  100% {
    bottom: 60rpx;
  }
}
.phone {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  &-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  &-box {
    box-sizing: border-box;
    position: absolute;
    bottom: 60rpx;
    left: 50%;
    transform: translate(-50%);
    width: 690rpx;
    padding: 40rpx;
    background: #ffffff;
    border-radius: 44rpx 44rpx 44rpx 44rpx;
    animation-name: move;
    animation-duration: 0.2s;
    &-info {
      @include hor-center-center;
      &-hand {
        width: 96rpx;
        height: 96rpx;
        position: relative;
        :nth-child(1) {
          border-radius: 50%;
        }
        :nth-child(2) {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      &-name {
        font-size: 32rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 38rpx;
        margin-left: 20rpx;
      }
    }
    &-num {
      font-size: 48rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 56rpx;
      text-align: center;
      margin: 40rpx 0 60rpx;
    }
    &-btn {
      height: 96rpx;
      background: #14c9c9;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 96rpx;
      text-align: center;
    }
  }
}
</style>
