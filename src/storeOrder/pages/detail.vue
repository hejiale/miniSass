<template>
  <view class="container" v-if="detailInfo">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('icon-order-bg')" mode="widthFix" />
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <div class="topNav-backBox">
            <van-icon
              name="arrow-left"
              @click="backRoute"
              style="color: #000"
              size="16"
            />
          </div>
        </view>
      </view>
      <view slot="content">
        <div class="container-gatherInfo" @click="onPhone" v-if="detailInfo.gatherOrderInfo.gatheringId">
          <image :src="detailInfo.productImage" class="container-gatherInfo-cover" mode="aspectFill"/>
          <span class="container-gatherInfo-title">{{detailInfo.productName}}</span>
          <span class="container-gatherInfo-date"
            >开局时间：{{$dayjs(detailInfo.gatherOrderInfo.gameStartTime).format('YYYY-MM-DD HH:mm')}}</span
          >
          <span class="container-gatherInfo-phone"
            >预约手机号：{{$filters.judgePhone(detailInfo.gatherOrderInfo.phone)}}</span
          >
          <div class="container-gatherInfo-bage" :class="detailInfo.sellType">
            {{ $enums.SellType.getName(detailInfo.sellType) }}
          </div>
          <span class="container-gatherInfo-status" :class="detailInfo.gatherOrderInfo.gatherStatus === 'SUCCESS' ? 'active':(detailInfo.gatherOrderInfo.gatherStatus === 'GATHERING' ?'gathering':'')">{{$enums.GatherStatusType.getName(detailInfo.gatherOrderInfo.gatherStatus)}}</span>
          <image src="../static/image/icon-phone.png" class="container-gatherInfo-phoneTag"/>
        </div>
        <div class="container-orderInfoBox">
          <span class="container-orderInfoBox-title">订单详情</span>
          <div class="container-orderInfoBox-item">
            <span>订单号</span>
            <span>{{detailInfo.orderNum}}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>付款方式</span>
            <span>微信支付</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>下单时间</span>
            <span>{{$dayjs(detailInfo.createdTime).format('YYYY-MM-DD HH:mm')}}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>玩家昵称</span>
            <span>{{detailInfo.buyerName || '' }}</span>
          </div>
          <div class="container-orderInfoBox-line"></div>
          <div class="container-orderInfoBox-item" v-if="detailInfo.gatherOrderInfo.gatheringId">
            <span>上车人数</span>
            <span>{{detailInfo.gatherOrderInfo.gamerNum}}人</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>订单总额</span>
            <span>¥{{detailInfo.orderAmount/100}}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>实际支付</span>
            <span style="color: #14C9C9">¥{{detailInfo.payAmount/100}}</span>
          </div>
          <div
            class="container-orderInfoBox-returnBox"
            @click="onCancelOrder"
            v-if="detailInfo.orderStatus === 'PAYED' && detailInfo && detailInfo.payAmount > 0"
          >
            取消订单
          </div>
        </div>
      </view>
    </navigation-bar>
    <modalPhone
      :isShowPhone.sync="isShowPhone"
      :phone="detailInfo.gatherOrderInfo.phone"
      v-if="isShowPhone"
    />
  </view>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service";
import modalPhone from '../components/modal-phone.vue'
export default {
  components: {
    navigationBar,
    modalPhone
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      detailInfo: null,
      orderId: null,
      isShowPhone: false,
      saving: false
    };
  },
  onLoad(options) {
    this.orderId = options.id;
    this.queryOrderDetail();
  },
  computed:{
    active(){
        if(!this.detailInfo)return false;
        return this.detailInfo.gatherOrderInfo.gatherStatus === 'SUCCESS';
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onPhone(){
      this.isShowPhone = true;
    },
    async onCancelOrder(){
      try {
        if (this.saving) return;
        this.saving = true;

        await service.kickOutMember({
          gatheringId: this.detailInfo.gatherOrderInfo.gatheringId,
          orderId: this.detailInfo.id,
          userId: this.detailInfo.buyerId,
        });
        
        this.saving = false;
        this.queryOrderDetail();
      } catch (e) {
        this.saving = false;
      }
    },
    async queryOrderDetail(){
      try{
        let res = await service.orderDetail({
          id: this.orderId,
          longitude: uni.getStorageSync("currentLongitude"),
          latitude: uni.getStorageSync("currentLatitude"),
        })
        this.detailInfo = res;
        this.customNav.navTitle = this.$enums.OrderStatus.getName(res.orderStatus)
        this.detailInfo.gmt = this.getCountDown(this.detailInfo.cutOffTime)
      }catch(e){}
    }
  },
};
</script>
<style>
.van-count-down{
  font-size: 12px !important;
  color: #faa21e !important;
  margin-left: 5px;
}
</style>
<style lang="scss">
.fixedBg {
  background: #f4f5f6;
  height: 100vh;
}
.topNav {
  display: flex;
  align-items: center;
  &-backBox {
    width: rpx(32);
    height: rpx(32);
    background: #ffffff;
    border-radius: 10px;
    @include hor-center-center;
  }
  /deep/image {
    vertical-align: super !important;
  }
}
.container {
  &-gatherInfo {
    margin: rpx(15);
    height: 94px;
    background: #ffffff;
    border-radius: 12px;
    position: relative;
    &-cover {
      position: absolute;
      left: rpx(15);
      top: rpx(15);
      width: rpx(48);
      height: rpx(64);
      border-radius: 6px;
    }
    &-title {
      position: absolute;
      left: rpx(73);
      top: rpx(15);
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 16px;
      @include text-overflow-line(1);
      width: 50%;
    }
    &-phoneTag{
      position: absolute;
      right: 15px;
      bottom: 15px;
      width: 24px;
      height: 24px;
    }
    &-date {
      position: absolute;
      left: rpx(73);
      top: rpx(40);
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
    &-phone {
      position: absolute;
      left: rpx(73);
      top: rpx(62);
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
    &-status {
      position: absolute;
      right: rpx(15);
      top: rpx(17);
      font-size: rpx(12);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #999999;
      line-height: 14px;
    }
    .active{
      color: #067AE5;
    }
    .gathering{
      color: #FAA21E;
    }
    &-bage {
      position: absolute;
      left: rpx(19);
      top: rpx(19);
      border-radius: 4px;
      font-size: rpx(10);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      padding: rpx(2) rpx(4);
    }
    .EXCLUSIVE {
      background: linear-gradient(90deg, #fe6989 50%, #ff928b 100%);
    }
    .BOXED {
      background: linear-gradient(90deg, #317bff 0%, #5754f1 100%);
    }
    .LIMITED {
      background: linear-gradient(90deg, #5655e6 50%, #3e86ff 100%);
    }
    .REAL_SCENE {
      background: linear-gradient(90deg, #ff7043 50%, #ffa726 100%);
    }
    .UNDETERMINED {
      background: linear-gradient(90deg, #c2c7cb 50%, #c2c7cb 100%);
    }
  }
  &-orderInfoBox {
    margin: rpx(15) rpx(15) rpx(20) rpx(15);
    background: #ffffff;
    border-radius: 16px;
    padding: rpx(15);
    &-title {
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 16px;
    }
    &-item {
      @include hor-between-center;
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #888888;
      line-height: 14px;
      margin-top: rpx(10);
    }
    &-line{
      margin: 15px 0;
      width: 100%;
      height: 1px;
      background: #E9E9E9;
    }
    &-returnBox {
      margin: rpx(30) rpx(15) 0 rpx(15);
      height: 40px;
      border-radius: 12px;
      border: 1px solid #ebebeb;
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      @include hor-center-center;
    }
  }
}
</style>