<template>
  <div class="container" v-if="orderInfo">
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
        <div class="container-note" v-if="haveDeliver">
          已发货
        </div>
        <div class="container-note" v-else>
          {{ $enums.CustomOrderStatus.getName(orderInfo.orderStatus) }}
        </div>
        <div
          class="container-subNote"
          v-if="orderInfo.orderStatus === 'NOT_PAY'"
        >
          <van-count-down :time="orderInfo.gmt" format="剩余 mm分ss秒 自动关闭" @finish="onFinishCountDown"/>
        </div>
        <div class="container-subNote" v-if="haveDeliver">
          <van-count-down :time="orderInfo.dateGmt" format="剩余 DD天HH小时 自动确认收货" @finish="onFinishCountDown"/>
        </div>
        <div class="container-addressBox" v-if="orderInfo.linkmanName">
          <addressObj :address="orderInfo" />
        </div>
        <div class="container-dramaBox">
          <drama :dramaObj="orderInfo" />
          <div class="container-dramaBox-priceBox">
            <span v-if="orderInfo.orderStatus === 'NOT_PAY'">待付款合计</span>
            <span
              v-else-if="
                orderInfo.orderStatus === 'CLOSE' ||
                orderInfo.orderStatus === 'REVERSE'
              "
              >已取消</span
            >
            <span v-else>已支付合计</span>
            <span
              v-if="
                orderInfo.orderStatus !== 'CLOSE' &&
                orderInfo.orderStatus !== 'REVERSE'
              "
              >¥{{ orderInfo.orderAmount / 100 }}</span
            >
          </div>
        </div>
        <div
          class="container-deliverBox"
          v-if="
            orderInfo.orderLogistics && orderInfo.orderLogistics.number &&
            orderInfo.orderLogistics.logisticsStatus !== 'DELIVERED'
          "
          @click="onCopy"
        >
          <span>物流编号：</span>
          <span>{{ orderInfo.orderLogistics.number }}</span>
          <div></div>
          <div>复制</div>
        </div>
        <div class="container-orderInfoBox">
          <div class="container-orderInfoBox-item">
            <span>付款人</span>
            <span>{{ orderInfo.buyerName }}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>商品类型</span>
            <span>{{ $enums.ProductType.getName(orderInfo.productType) }}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>联系方式</span>
            <span>{{ orderInfo.buyerPhone }}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>付款方式</span>
            <span>{{ $enums.PayType.getName(orderInfo.payType) }}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>订单编号</span>
            <span>{{ orderInfo.orderNum }}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>下单时间</span>
            <span>{{ orderInfo.createdTime }}</span>
          </div>
        </div>
        <div
          class="container-bottomBox"
          v-if="orderInfo.orderStatus === 'NOT_PAY'"
        >
          <div @click="cancelOrder">取消订单</div>
          <div @click="goPay">继续支付¥{{ orderInfo.orderAmount / 100 }}</div>
        </div>
        <div
          class="container-bottomDeliverBox"
          v-if="haveDeliver"
          @click="onDeliver"
        >
          确认收货
        </div>
      </view>
    </navigation-bar>
  </div>
</template>
<script>
import drama from "../components/detailDrama.vue";
import service from "../utils/service";
import navigationBar from "@/components/navigation-bar";
import addressObj from "../components/addressObj.vue";
export default {
  components: {
    drama,
    navigationBar,
    addressObj,
  },
  data() {
    return {
      drama: null,
      userInfor: null,
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "订单详情",
      },
      orderInfo: null,
      options: null,
      timer: null
    };
  },
  async onLoad(options) {
    this.options = options;
    await this.Userinfo();
  },
  async onShow() {
    await this.queryOrderDetail(this.options.id);
  },
  computed:{
    haveDeliver(){
      if(!this.orderInfo){
        return false;
      }
      return this.orderInfo.orderStatus === 'PAYED' && this.orderInfo.orderLogistics && this.orderInfo.orderLogistics.number;
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    async Userinfo() {
      this.userInfor = await this.$checkLogin.getUserInfo();
    },
    onCopy(){
      uni.setClipboardData({
        data: this.orderInfo.orderLogistics.number,
        success: function () {
          uni.showToast({
            title: "复制成功",
          });
        },
      });
    },
    onFinishCountDown(){
      this.queryOrderDetail();
    },
    async queryOrderDetail(id) {
      try {
        this.orderInfo = await service.queryOrderDetail({ id });

        if (this.orderInfo.orderStatus === "NOT_PAY") {
          this.orderInfo.gmt =
            this.$dayjs(this.orderInfo.cutOffTime) - Date.now();
        }else if(this.orderInfo.orderLogistics && this.orderInfo.orderLogistics.deliveryTime){
          this.getDateCountDown();
        }
      } catch (e) {}
    },
    getDateCountDown() {
      let today = new Date(this.orderInfo.orderLogistics.deliveryTime);
	    let seven_milliseconds = today.getTime() + 1000*60*60*24*7;
      this.orderInfo.dateGmt = seven_milliseconds - new Date().getTime();
    },
    //取消订单
    async cancelOrder() {
      //校验是否创单人支付
      if(this.userInfor.id !== this.orderInfo.buyerId){
        return wx.showToast({
          title: '需订单创建人才能取消',
          icon: 'none'
        })
      }

      try {
        await service.cancelOrder({
          orderId: this.orderInfo.id,
        });
        this.queryOrderDetail(this.orderInfo.id);
        clearInterval(this.timer);
      } catch (e) {}
    },
    //继续支付
    async goPay() {
      //校验是否创单人支付
      if(this.userInfor.id !== this.orderInfo.buyerId){
        return wx.showToast({
          title: '需订单创建人支付',
          icon: 'none'
        })
      }

      this.$checkLogin.orderPay(
        this.orderInfo.id,
        this.userInfor.id
      ).then(data=>{
        uni.showToast({
          title: "支付成功！",
        });
        setTimeout(() => {
          this.queryOrderDetail(this.orderInfo.id);

          //申领商品
          if (this.orderInfo.productType === "APPLY_DRAMA_PRODUCT") {
            uni.navigateTo({
              url: `/applyDrama/pages/applyDrama?id=${this.orderInfo.productId}&orderInfoId=${this.orderInfo.id}`,
            });
          }else{
            this.getStatus();
          }
        }, 500);
      }).catch(e=>{
        
      })
    },
    //确认收货
    async onDeliver(){
      try{
        await service.storeApplyDramaWriteOff({
          id: this.orderInfo.orderLogistics.id
        })
        this.queryOrderDetail(this.orderInfo.id);
      }catch(e){}
    },
    async getStatus() {
      const delayTime =  1000*2
      uni.showLoading();
      let res = await service.onlineGameCheckOnlineGame({
        dmId: this.userInfor.id,
        storeId: uni.getStorageSync("storeId"),
      });
      if (res.murderMysteryOnlineRecord && res.murderMysteryOnlineRecord.id) {
         uni.hideLoading();
         // 清除定时器
          clearInterval(this.timer)
          uni.navigateTo({
            url: `/game-DM/pages/index`,
          });
      } else {
          // 清除定时器
          clearInterval(this.timer)
          this.timer = setInterval(() => {
              this.getStatus()
          }, delayTime)
      }
    }
  },
};
</script>
<style>
.van-cell {
  padding: 0 !important;
}
.van-count-down{
  font-size: 12px !important;
}
</style>
<style lang="scss" scoped>
.fixedBg {
  background: #f4f5f6;
  height: 100vh;
}
.container {
  padding-bottom: 68rpx;
  &-note {
    font-size: rpx(20);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 23px;
    margin-left: rpx(16);
    margin-top: rpx(16);
  }
  &-subNote {
    margin-top: rpx(8);
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 14px;
    margin-left: rpx(16);
  }
  &-dramaBox {
    margin: 32rpx 32rpx 0 32rpx;
    padding: rpx(16);
    background: #ffffff;
    border-radius: 8px;
    &-priceBox {
      @include hor-between-center;
      padding-top: rpx(10);
      margin-top: rpx(16);
      border-top: 1px solid #e6e6e6;
      span:nth-child(1) {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 16px;
      }
      span:nth-child(2) {
        font-size: rpx(14);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #14c9c9;
        line-height: 16px;
      }
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
  }
  &-orderInfoBox {
    margin: 32rpx;
    padding: rpx(16) rpx(16) rpx(4) rpx(16);
    background: #fff;
    border-radius: 8px;
    &-item {
      @include hor;
      align-items: center;
      margin-bottom: rpx(12);
      span:nth-child(1) {
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        line-height: 16px;
        width: rpx(50);
      }
      span:nth-child(2) {
        margin-left: rpx(14);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.9);
        line-height: 16px;
      }
    }
  }
  &-deliverBox {
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
  &-bottomBox {
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    bottom: rpx(28);
    @include hor-center-center;
    div {
      width: 44vw;
      height: 44px;
      border-radius: 41px;
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      @include hor-center-center;
    }
    div:nth-child(1) {
      background: #e5e9ed;
      color: #4c5657;
    }
    div:nth-child(2) {
      margin-left: rpx(15);
      background: #14c9c9;
      color: #ffff;
    }
  }
  &-bottomDeliverBox {
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    bottom: rpx(28);
    height: 44px;
    background: #14c9c9;
    border-radius: 40px;
    font-size: rpx(16);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    @include hor-center-center;
  }
}
</style>
