<template>
  <div class="container">
    <div class="container-fixedBg"></div>
    <swiper
      class="container-swiperBox"
      previous-margin="24px"
      next-margin="12px"
      :current="current"
      @change="onChangeCurrent"
    >
      <swiper-item v-for="ship in memberShipPackageList" :key="ship.id">
        <div class="container-swiperBox-item">
          <div class="container-swiperBox-item-topBox">
            <image
              class="container-swiperBox-item-topBox-left"
              src="../static/image/memberCard-left.png"
            ></image>
            <div class="container-swiperBox-item-topBox-nameBox">
              {{ ship.name }}
            </div>
            <image
              class="container-swiperBox-item-topBox-right"
              src="../static/image/memberCard-right.png"
            ></image>
          </div>
          <div class="container-swiperBox-item-title">会员权益：</div>
          <scroll-view class="container-swiperBox-item-scrollView" scroll-y>
            <div
              v-for="(p, index) in ship.items"
              :key="index"
              class="container-swiperBox-item-scrollView-package"
            >
              <image
                :src="p.url"
                class="container-swiperBox-item-scrollView-package-url"
                mode="aspectFill"
              ></image>
              <div class="container-swiperBox-item-scrollView-package-info">
                <span class="container-swiperBox-item-scrollView-package-info-name">{{
                  p.name
                }}</span>
                <span class="container-swiperBox-item-scrollView-package-info-content">{{
                  p.content
                }}</span>
              </div>
            </div>
          </scroll-view>
        </div>
      </swiper-item>
    </swiper>
    <div class="container-bottomBox">
      <div class="container-bottomBox-buy" :style="canDo" @click="onPayMember">
        <span class="container-bottomBox-buy-left">加入会员支付</span>
        <span class="container-bottomBox-buy-tag">¥</span>
        <span class="container-bottomBox-buy-value">{{ price }}</span>
      </div>
      <div class="container-bottomBox-top">
        <image
          src="../static/image/icon-check.png"
          v-if="isCheck"
          @click="onCheck(false)"
        ></image>
        <image
          src="../static/image/icon-unCheckBox.png"
          v-else
          @click="onCheck(true)"
        ></image>
        <span class="container-bottomBox-top-value" @click="onGoAgreement"
          >《LovePotion活动参与协议》</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import service from "../utils/service";
export default {
  data() {
    return {
      isCheck: false,
      memberShipPackageList: [],
      current: 0,
      userInfo: null
    };
  },
  async onLoad() {
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.queryShipPackageList();
  },
  computed: {
    canDo() {
      return this.isCheck ? "opacity: 1;" : "opacity: 0.5;";
    },
    price(){
      if(!this.memberShipPackageList.length)return '';
        return this.memberShipPackageList[this.current].price / 100;
    }
  },
  methods: {
    onChangeCurrent(e){
        this.current = e.detail.current;
    },
    onCheck(status) {
      this.isCheck = status;
    },
    onGoAgreement() {
      uni.navigateTo({
        url: "./agreement",
      });
    },
    async queryShipPackageList() {
      let res = await service.lpMembershipPackageList({});
      this.memberShipPackageList = res.filter((v) => v.id !== null);
    },
    async onPayMember(){
       if(!this.isCheck)return;

       let ship = this.memberShipPackageList[this.current];

       this.$checkLogin.doPay(
        this.userInfo.id,
        ship.price,
        "LP_MEMBERSHIP_PRODUCT",
        ship.name,
        ship.productId,
        "USER",
        "USER",
        1
      ).then(_=>{
        uni.showToast({
          title: "购买会员成功！",
        });

        setTimeout(() => {
          uni.redirectTo({
            url: './buySuccess'
          })
        }, 500);
      }).catch(e=>{

      })
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-fixedBg {
    @include fiexcenter;
    background: #f5f9fb;
  }
  &-swiperBox {
    margin-top: 40rpx;
    height: calc(100vh - 300rpx);
    &-item {
      background: #ffffff;
      border-radius: 40rpx;
      margin-right: 12px;
      border: 2rpx solid #e6e6e6;
      padding: 68rpx 38rpx 0rpx 28rpx;
      height: calc(100% - 2rpx);
      box-sizing: border-box;
      overflow: hidden;
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
        color: #5F6572;
        line-height: 30rpx;
        letter-spacing: 1px;
        padding-bottom: 40rpx;
      }
      &-scrollView {
        height: 90%;
        &-package {
          @include hor;
          padding-bottom: 52rpx;
          &-url {
            width: 44rpx;
            height: 44rpx;
            border-radius: 8rpx;
            margin-top: 22rpx;
          }
          &-info {
            margin-left: 36rpx;
            @include ver;
            max-width: calc(100% - 80rpx);
            &-name {
              font-family: PingFang SC, PingFang SC;
              font-weight: 600;
              font-size: 28rpx;
              color: #2e323e;
              line-height: 33rpx;
              word-break: break-all;
            }
            &-content {
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
  }
  &-bottomBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 232rpx;
    background: #ffffff;
    box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(225, 34, 157, 0.1);
    z-index: 1;
    &-buy {
      margin: 24rpx 0px 0px 30rpx;
      width: 690rpx;
      height: 88rpx;
      background: #ff5485;
      border-radius: 24rpx;
      @include hor-center-center;
      &-left {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 30rpx;
        color: #ffffff;
        line-height: 35rpx;
      }
      &-tag {
        margin: 0px 8rpx;
        font-family: OPPOSans, OPPOSans;
        font-weight: bold;
        font-size: 22rpx;
        color: #ffffff;
        line-height: 26rpx;
        transform: translateY(4rpx);
      }
      &-value {
        font-family: OPPOSans, OPPOSans;
        font-size: 36rpx;
        color: #ffffff;
        line-height: 42rpx;
      }
    }
    &-top {
      position: absolute;
      left: 0rpx;
      bottom: 72rpx;
      @include hor;
      align-items: center;
      image {
        padding-left: 40rpx;
        padding-right: 16rpx;
        width: 32rpx;
        height: 32rpx;
      }
      &-value {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #61666d;
      }
      &-value::before {
        color: #2e323e;
        content: "我已阅读并同意";
      }
    }
  }
}
</style>