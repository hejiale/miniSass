<template>
  <div>
    <navigationBar :nav="customNav">
      <view slot="content">
        <view class="contentBox" v-if="isShow">
          <img
            src="../static/image/icon-pay-success.png"
            alt=""
            v-if="payStatus.status"
          />
          <img src="../static/image/icon-pay-fail.png" alt="" v-else />
          <span>{{ payStatus.status ? "支付成功" : "支付失败" }}</span>
          <van-button
            open-type="launchApp"
            :app-parameter="
              `status=${payStatus.status}&id=${payStatus.id}`
            "
            @error="launchAppError"
            class="customButton"
            v-if="payStatus.status"
          >
            返回
          </van-button>
          <van-button
            class="customButton"
            @click="Userinfo"
            v-if="!payStatus.status"
          >
            重新下单
          </van-button>
          <van-button
            open-type="launchApp"
            :app-parameter="`status=${payStatus.status}&id=${payStatus.id}`"
            class="customButton"
            v-if="!payStatus.status"
            style="margin-top: 40rpx"
          >
            返回APP
          </van-button>
        </view>
        <BindPhone
          @on-success-authorize="onSuccessAuthorize"
          @on-fail-authorize="onCancelAuthorize"
          v-if="!userInfor.phone"
          ref="BindPhone"
        ></BindPhone>
      </view>
    </navigationBar>

  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar/index.vue";
import BindPhone from "@/components/bindPhone/index.vue";

export default {
  components: {
    BindPhone,
  },
  data() {
    return {
      text: "重新支付",
      options: {},
      payStatus: {
        status: false,
        id: null,
      },
      customNav: {
        bgHeight: "100vh",
        navTitle: "微信支付",
        color: "#333333",
        bg: this.$iconFont.getIconName("icon-pay-bg"),
        customizeLeft: true,
      },
      isShow: false,
      userInfor: null
    };
  },
  onLoad(options) {
    this.options = options;
    this.Userinfo();
  },
  methods: {
    onSuccessAuthorize() {
      this.Userinfo();
    },
    onCancelAuthorize() {
      this.isShow = true;
      this.payStatus.status = null;
    },
    //先判断是否绑定过小程序
    async Userinfo() {
      try {
        this.userInfor = await this.$checkLogin.getUserInfo(true);

        if (this.userInfor.phone) {
          if (this.userInfor.phone === this.options.phone) {
            uni.showLoading({ title: "加载中", mask: true });
            this.pay();
          } else {
            uni.showToast({
              title: "支付手机号不一致!",
              icon: "none",
            });
            this.isShow = true;
            this.payStatus.status = null;
          }
        } else {
          this.$refs.BindPhone.onAuthorize();
        }
      } catch (e) {}
    },
    async pay() {
      this.$checkLogin.orderPay(
        this.options.orderId,
        this.options.userId
      ).then(data=>{
        this.isShow = true;

        uni.showToast({
          title: "支付成功",
        });
        this.payStatus = {
          id: data,
          status: true,
        };
      }).catch(e=>{
        this.isShow = true;
        this.payStatus.status = null;
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.contentBox {
  @include ver;
  align-items: center;
  img {
    width: 170rpx;
    height: 170rpx;
    margin-top: 200rpx;
  }
  span {
    margin-top: 40rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 52rpx;
  }
  .customButton {
    @include hor-center-center;
    width: 380rpx;
    height: 96rpx;
    margin-top: 130rpx;
    background: #14c9c9;
    border-radius: 48rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 44rpx;
    /deep/.van-button {
      background: unset !important;
      border: none !important;
      color: #fff !important;
      font-size: 32rpx !important;
    }
  }
}

</style>