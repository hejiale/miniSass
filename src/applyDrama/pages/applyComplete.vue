<template>
  <div class="container" v-if="endLoad">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('bg-personnel')" mode="widthFix" />
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000"
            size="50rpx"
          />
        </view>
      </view>
      <view slot="content">
        <div class="container-tagBox">
            <image src="../static/image/icon-apply-complete.png" />
            <span v-if="isComplete">授权完成</span>
            <span v-else>授权完成，{{orderInfo.logisticsStatus === 'COLLECTED' ? '待收货': '待发货'}}</span>
        </div>
        <div class="container-statusBox" v-if="orderInfo.logisticsStatus !== 'DELIVERED' && (orderInfo.isGenerateDeliveryOrder === null || orderInfo.isGenerateDeliveryOrder === true)">
          <image
            :src="$iconFont.getIconName('apply-progress-4')"
            v-if="form && form.boxStoreApplyStatus === 'PASS_AUTHORIZE' && orderInfo.logisticsStatus === 'COLLECTED'"
            mode="widthFix"
          />
          <image
            :src="$iconFont.getIconName('apply-progress-3')"
            v-else-if="form && form.boxStoreApplyStatus === 'PASS_AUTHORIZE'"
            mode="widthFix"
          />
          <image
            :src="$iconFont.getIconName('apply-progress-2')"
            v-else-if="form && form.boxStoreApplyStatus === 'WAIT_AUTHORIZE'"
            mode="widthFix"
          />
          <image
            :src="$iconFont.getIconName('apply-progress-1')"
            mode="widthFix"
            v-else
          />
        </div>
        <div class="container-dramaBox">
          <drama :dramaObj="drama"/>
        </div>
        <div
          class="container-addressBox"
          v-if="form.linkmanName"
        >
          <addressObj :address="defaultAddress" />
        </div>
        <div
          class="container-orderNumBox"
          v-if="orderInfo && orderInfo.number && !isComplete"
        >
         <span>物流编号：</span> 
         <span>{{orderInfo.number}}</span>
         <div></div>
         <div>复制</div>
        </div>
        <div class="container-bottomButton">有问题，联系客服 <button open-type="contact"></button></div>
      </view>
    </navigation-bar>
  </div>
</template>
<script>
import drama from "../components/detailDrama.vue";
import addressObj from "../components/addressObj.vue";
import service from "../utils/service";
import navigationBar from "@/components/navigation-bar";
export default {
  components: {
    drama,
    addressObj,
    navigationBar,
  },
  data() {
    return {
      drama: null,
      form: {
        boxDramaQuestionResponse: [],
      },
      userInfor: null,
      endLoad: false,
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "",
      },
      defaultAddress: null,
      orderInfo: null,
    };
  },
  async onLoad(options) {
    await this.Userinfo();
    await this.queryProductDetail(options.id);

    //已申领详情
    await this.queryApplyDetail(options.applyId);
    await this.queryOrderDetail(options.applyId);
    this.endLoad = true;
  },
  computed:{
    isComplete(){
      return this.orderInfo.logisticsStatus === 'DELIVERED' || (this.orderInfo.isGenerateDeliveryOrder !== null && this.orderInfo.isGenerateDeliveryOrder === false);
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    //查询商品信息
    async queryProductDetail(id) {
      try {
        this.drama = await service.productDetail({
          id /*申领id*/,
        });
      } catch (e) {}
    },
    async Userinfo() {
      this.userInfor = await this.$checkLogin.getUserInfo();
    },
    //查询申领详情
    async queryApplyDetail(id) {
      try {
        let data = await service.getBoxStoreApplyCheckDetail({
          id,
        });

        let form = JSON.parse(
          JSON.stringify(data).replace(
            /"boxStoreAnswerItems"/g,
            '"boxDramaQuestionResponse"'
          )
        );
        form = JSON.parse(
          JSON.stringify(form).replace(/"question"/g, '"title"')
        );

        this.defaultAddress = {
          linkmanName: data.linkmanName,
          linkmanPhone: data.linkmanPhone,
          linkmanAddress: data.linkmanAddress,
          addressName: `${data.provinceName || ""}${data.cityName || ""}${
            data.districtName || ""
          }`,
        };
        this.form = form;
      } catch (e) {}
    },
    //查询订单详情
    async queryOrderDetail(id) {
      try {
        this.orderInfo = await service.queryBoxStoreApplyDetail({
          id,
        });
      } catch (e) {}
    },
  },
};
</script>
<style>
.van-cell {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.fixedBg {
  background: #f4f5f6;
  height: 100vh;
}
.container {
  padding-bottom: 68rpx;
  &-statusBox {
    margin: rpx(19) 32rpx 32rpx 32rpx;
    @include hor;
    align-items: center;
    image:nth-child(1) {
      width: calc(100vw - 40rpx);
    }
  }
  &-dramaBox {
    margin: 32rpx 32rpx 0 32rpx;
    padding: rpx(16);
    background: #ffffff;
    border-radius: 8px;
    &-note {
      margin-top: rpx(16);
      min-height: 67px;
      background: #f4f5f6;
      border-radius: 4px;
      padding: rpx(8);
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #849198;
      line-height: 14px;
    }
  }
  &-addressBox {
    margin: 32rpx;
    background: #ffffff;
    border-radius: 8px;
    @include ver;
    position: relative;
    &-title {
      padding: 32rpx 0 0 32rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 40rpx;
    }
    &-arrow {
      position: absolute;
      right: 16rpx;
      top: 50%;
      transform: translateY(-10px);
    }
  }
  &-orderNumBox {
    margin: 32rpx 32rpx 0 32rpx;
    height: 50px;
    background: #ffffff;
    border-radius: 8px;
    @include hor;
    align-items: center;
    span:nth-child(1) {
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
      padding-left: rpx(16);
    }
    span:nth-child(2) {
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
    }
    div:nth-child(3) {
      margin-left: 10px;
      width: 1px;
      height: 10px;
      background: #e9e9e9;
    }
    div:nth-child(4) {
      margin-left: 10px;
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5ec9c7;
      line-height: 18px;
    }
  }
  &-bottomButton {
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    bottom: rpx(28);
    height: 44px;
    border: 1px solid #14c9c9;
    border-radius: 41px;
    margin: auto;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #14c9c9;
    @include hor-center-center;
    button{
      @include abscenter;
      background: unset !important;
    }
    button::after{
      border: none !important;
    }
  }
  &-tagBox {
    @include ver;
    align-items: center;
    image {
      width: rpx(72);
      height: rpx(72);
    }
    span {
      margin-top: rpx(6);
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
    }
  }
  &-contactBox {
    width: 100vw;
    height: 20px;
    margin-top: rpx(24);
  }
}
</style>
