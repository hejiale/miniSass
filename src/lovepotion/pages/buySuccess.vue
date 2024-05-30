<template>
  <div class="container" v-if="memberPackage">
    <div class="container-fixedBg"></div>
    <div class="container-customerBox">
      <image :src="customer.qrCode" class="container-customerBox-head"></image>
      <div class="container-customerBox-infoBox">
        <span class="container-customerBox-infoBox-title"
          >添加您的专属LovePotion客服 {{ customer.name }}</span
        >
        <div class="container-customerBox-infoBox-contactBox">
          <image
            src="../static/image/memberShip-wechat.png"
            class="container-customerBox-infoBox-contactBox-tag"
          ></image>
          <span class="container-customerBox-infoBox-contactBox-number"
            >微信号：{{ customer.wxNumber }}</span
          >
          <span
            class="container-customerBox-infoBox-contactBox-copy"
            @click="onCopy"
            >「复制」</span
          >
        </div>
      </div>
    </div>
    <image
      class="container-blurBox"
      :src="$iconFont.getIconName('memberShip-cover')"
    ></image>
    <span class="container-title">恭喜！您已成功购买 LovePotion</span>
    <span class="container-subTitle">{{
      lpUserInfo.lpMembershipPackageName
    }}</span>
    <span class="container-note">恭喜你已解锁 {{ memberPackage.items.length }} 项会员特权</span>
    <div class="container-shipBox">
      <div class="container-shipBox-topBox">
        <image
          class="container-shipBox-topBox-left"
          src="../static/image/memberCard-left.png"
        ></image>
        <div class="container-shipBox-topBox-nameBox">
          {{ lpUserInfo.lpMembershipPackageName }}
        </div>
        <image
          class="container-shipBox-topBox-right"
          src="../static/image/memberCard-right.png"
        ></image>
      </div>
      <div class="container-shipBox-title">会员权益：</div>
      <div
        v-for="(p, index) in memberPackage.items"
        :key="index"
        class="container-shipBox-package"
      >
        <image :src="p.url" class="container-shipBox-package-url"></image>
        <div class="container-shipBox-package-info">
          <span class="container-shipBox-package-info-name">{{ p.name }}</span>
          <span class="container-shipBox-package-info-content">{{
            p.content
          }}</span>
        </div>
      </div>
    </div>
    <div style="height: 50px"></div>
  </div>
</template>
<script>
import service from "../utils/service.js";
export default {
  data() {
    return {
      customer: null,
      userInfo: null,
      lpUserInfo: null,
      memberPackage: null,
    };
  },
  async onLoad() {
    this.userInfo = await this.$checkLogin.getUserInfo(true);
    await this.queryCustomer();
    await this.getMemberInfo();
    await this.queryPackageDetail();
  },
  methods: {
    onCopy() {
      wx.setClipboardData({
        data: this.customer.wxNumber,
        success: function () {
          uni.showToast({
            title: "复制成功",
          });
        },
      });
    },
    async queryCustomer() {
      this.customer = await service.getLpCustomer({});
    },
    async getMemberInfo() {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
    },
    async queryPackageDetail() {
      this.memberPackage = await service.getPackageDetail({
        id: this.lpUserInfo.lpMembershipPackageId,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  @include ver;
  align-items: center;
  &-fixedBg {
    @include fiexcenter;
    background: #f5f6f8;
    z-index: -1;
  }
  &-customerBox {
    margin-top: 24rpx;
    width: 668rpx;
    height: 200rpx;
    background: url("../static/image/memberShip-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    @include hor;
    align-items: center;
    &-head {
      margin-left: 50rpx;
      width: 88rpx;
      height: 88rpx;
      border: 2rpx solid #e7e7e7;
      border-radius: 50%;
    }
    &-infoBox {
      @include ver;
      margin-left: 24rpx;
      &-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 26rpx;
        color: #959aa5;
        line-height: 30rpx;
        letter-spacing: 1px;
        @include text-overflow-line(2);
        width: 90%;
      }
      &-contactBox {
        margin-top: 12rpx;
        @include hor;
        align-items: center;
        &-tag {
          width: 40rpx;
          height: 40rpx;
        }
        &-number {
          margin-left: 4rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 26rpx;
          color: #5f6572;
          line-height: 30rpx;
        }
        &-copy {
          color: #4a6fbe;
          font-size: 26rpx;
          font-weight: 500;
        }
      }
    }
  }
  &-blurBox {
    margin-left: 410rpx;
    width: 340rpx;
    height: 340rpx;
  }
  &-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 40rpx;
    color: #2e323e;
    line-height: 47rpx;
    letter-spacing: 1px;
    margin-top: -200rpx;
  }
  &-subTitle {
    margin-top: 20rpx;
    width: 100%;
    text-align: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 40rpx;
    color: #ff5485;
    line-height: 47rpx;
    letter-spacing: 1px;
  }
  &-subTitle::after {
    content: "服务";
    color: #2e323e;
  }
  &-note {
    margin-top: 92rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 28rpx;
    color: #52404c;
    line-height: 33rpx;
    transform: translateX(-53%);
  }
  &-shipBox {
    margin-top: 48rpx;
    width: 686rpx;
    padding-bottom: 50rpx;
    background: #ffffff;
    border-radius: 40rpx;
    border: 2rpx solid #e6e6e6;
    position: relative;
    &-topBox {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      @include hor;
      &-left {
        position: absolute;
        left: -24rpx;
        width: 26rpx;
        height: 40rpx;
      }
      &-nameBox {
        height: 40rpx;
        background: #2e323e;
        padding: 0px 10rpx;
        @include hor-center-center;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #ffffff;
      }
      &-right {
        position: absolute;
        right: -24rpx;
        width: 26rpx;
        height: 40rpx;
      }
    }
    &-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 26rpx;
      color: #5f6572;
      line-height: 30rpx;
      letter-spacing: 1px;
      margin: 68rpx 0px 0px 26rpx;
      padding-bottom: 40rpx;
    }
    &-package {
      @include hor;
      padding-bottom: 52rpx;
      &-url {
        margin-top: 22rpx;
        margin-left: 38rpx;
        width: 44rpx;
        height: 44rpx;
        border-radius: 8rpx;
      }
      &-info {
        margin-left: 36rpx;
        @include ver;
        &-name {
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 28rpx;
          color: #2e323e;
          line-height: 33rpx;
          width: 516rpx;
          word-break: break-all;
        }
        &-content {
          width: 516rpx;
          margin-top: 8rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #979797;
          line-height: 28rpx;
          word-break: break-all;
        }
      }
    }
  }
}
</style>