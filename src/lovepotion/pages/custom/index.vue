<template>
  <div class="popContact">
    <div class="popContact-title">未开通会员服务，联系客服咨询购买</div>
    <div class="popContact-value" @click="onPhone">
      <div class="popContact-value-left">{{ customInfo.phone }}</div>
      <div class="popContact-value-right">【拨打】</div>
    </div>
    <div class="popContact-value" @click="onCopy">
      <div class="popContact-value-left2">{{ customInfo.wxNumber }}</div>
      <div class="popContact-value-right">【复制】</div>
    </div>
    <image
      class="popContact-wechat"
      :src="customInfo.qrCode"
      show-menu-by-longpress
    ></image>
    <div class="popContact-note">扫码添加客服</div>
  </div>
</template>
<script>
import service from "../../utils/service";
export default {
  data() {
    return {
      customInfo: null,
    };
  },
  async created() {
    this.customInfo = await service.getLpCustomer({});
  },
  methods: {
    onPhone() {
      wx.makePhoneCall({
        phoneNumber: this.customInfo.phone,
      });
    },
    onCopy() {
      wx.setClipboardData({
        data: this.customInfo.wxNumber,
        success: () =>
          uni.showToast({
            title: "已复制",
          }),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.popContact {
  @include ver;
  align-items: center;
  width: 100vw;
  height: 656rpx;
  background: #ffffff;
  &-title {
    margin-top: 44rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #000000;
    line-height: 38rpx;
    padding-bottom: 32rpx;
  }
  &-value {
    @include hor-between-center;
    margin-top: 44rpx;
    width: 89.3vw;
    &-left,
    &-left2 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #5f6572;
      line-height: 30rpx;
      height: 36rpx;
    }
    &-right {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #525BA4;
      line-height: 30rpx;
    }
    &-left::before {
      content: "客服电话：";
      color: #5f6572;
    }
    &-left2::before {
      content: "客服微信：";
      color: #5f6572;
    }
  }
  &-wechat {
    margin-top: 54rpx;
    width: 228rpx;
    height: 228rpx;
  }
  &-note {
    margin-top: 12rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #5f6572;
    line-height: 28rpx;
  }
}
</style>