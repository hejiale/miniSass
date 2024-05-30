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
        <div class="container-gatherInfo" @click="onGatherDetail" v-if="detailInfo.gatherOrderInfo.gatheringId">
          <image
            :src="detailInfo.productImage"
            class="container-gatherInfo-cover"
            mode="aspectFill"
          />
          <span class="container-gatherInfo-title">{{
            detailInfo.productName
          }}</span>
          <span class="container-gatherInfo-date"
            >开局时间：{{
              $dayjs(detailInfo.gatherOrderInfo.gameStartTime).format(
                "YYYY-MM-DD HH:mm"
              )
            }}</span
          >
          <span class="container-gatherInfo-phone"
            >预约手机号：{{ detailInfo.gatherOrderInfo.phone }}</span
          >
          <div class="container-gatherInfo-bage" :class="detailInfo.sellType">
            {{ $enums.SellType.getName(detailInfo.sellType) }}
          </div>
          <span class="container-gatherInfo-status" :class="detailInfo.gatherOrderInfo.gatherStatus === 'SUCCESS' ? 'active':(detailInfo.gatherOrderInfo.gatherStatus === 'GATHERING' ?'gathering':'')">{{
            $enums.GatherStatusType.getName(
              detailInfo.gatherOrderInfo.gatherStatus
            )
          }}</span>
        </div>
        <div class="container-addressBox">
          <image
            src="../static/image/icon-store-tag.png"
            class="container-addressBox-tag"
          />
          <div class="container-addressBox-name">
            {{ detailInfo.storeName }}
          </div>
          <div class="container-addressBox-address">
            {{ detailInfo.storeAddress || "" }} {{ instance }}km
          </div>
          <image
            src="../static/image/icon-phone.png"
            class="container-addressBox-phone"
            @click="onPhone"
          />
          <image
            src="../static/image/icon-place.png"
            class="container-addressBox-place"
            @click="onLocation"
          />
        </div>
        <div class="container-orderInfoBox">
          <span class="container-orderInfoBox-title">订单详情</span>
          <div class="container-orderInfoBox-item">
            <span>订单号</span>
            <span>{{ detailInfo.orderNum }}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>付款方式</span>
            <span>微信支付</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>下单时间</span>
            <span>{{
              $dayjs(detailInfo.createdTime).format("YYYY-MM-DD HH:mm")
            }}</span>
          </div>
          <div class="container-orderInfoBox-item"  v-if="detailInfo.gatherOrderInfo.gatheringId">
            <span>上车人数</span>
            <span>{{ detailInfo.gatherOrderInfo.gamerNum }}人</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>订单总额</span>
            <span>¥{{ detailInfo.orderAmount / 100 }}</span>
          </div>
          <div class="container-orderInfoBox-item">
            <span>实际支付</span>
            <span style="color: #14c9c9"
              >¥{{
                detailInfo.orderStatus === "NOT_PAY"
                  ? detailInfo.orderAmount / 100
                  : detailInfo.payAmount / 100
              }}</span
            >
          </div>
          <div
            class="container-orderInfoBox-returnBox"
            @click="showDialog = true"
            v-if="
              detailInfo &&
              detailInfo.gatherOrderInfo.gatherStatus === 'GATHERING' &&
              detailInfo.gatherOrderInfo.gatherLockStatus === 'UNLOCKED' &&
              detailInfo.orderStatus === 'PAYED' &&
              detailInfo.payAmount > 0
            "
          >
            申请退款
          </div>
        </div>
        <div
          class="container-payTime"
          v-if="detailInfo.orderStatus === 'NOT_PAY'"
        >
          <van-count-down
            :time="detailInfo.gmt"
            format="mm:ss"
            @finish="onFinishCountDown"
          />
        </div>
        <div
          class="container-bottomBox"
          v-if="detailInfo.orderStatus === 'NOT_PAY'"
        >
          <div class="container-bottomBox-left" @click="cancelOrder">
            取消订单
          </div>
          <div class="container-bottomBox-right" @click.stop="goPay">
            ¥{{ detailInfo.orderAmount / 100 }} 继续支付
          </div>
        </div>
      </view>
    </navigation-bar>
    <van-action-sheet
      :show="showDialog"
      :safe-area-inset-bottom="false"
      close-on-click-overlay
      @click-overlay="onCancel"
    >
      <div class="popBox">
        <span class="popBox-title">选择退款原因</span>
        <div
          class="popBox-item"
          v-for="(item, idx) in checkList"
          :key="idx"
          :class="currentCheck === idx ? 'active' : ''"
          @click="onChangeCheck(idx)"
        >
          <span>{{ item }}</span>
          <van-checkbox
            :value="currentCheck === idx"
            shape="square"
            icon-size="16px"
            checked-color="#14C9C9"
          ></van-checkbox>
        </div>
        <div class="popBox-cancel" @click="onCancel">取消</div>
        <div class="popBox-sure" @click="onReturnMoney">确定退款</div>
      </div>
    </van-action-sheet>
  </view>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      pageNo: 1,
      pageSize: 20,
      showDialog: false,
      checkList: [
        "计划有变，没时间消费",
        "买错数量了",
        "商家联系退款",
        "商家不接待",
        "组局未拼成",
      ],
      currentCheck: null,
      detailInfo: null,
      orderId: null,
      canDo: false
    };
  },
  onLoad(options) {
    this.orderId = options.id;
    this.queryOrderDetail();
  },
  computed: {
    instance() {
      if (!this.detailInfo) return "";
      return (this.detailInfo.distance / 1000).toFixed(2);
    },
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onChangeCheck(idx) {
      this.currentCheck = idx;
    },
    onCancel() {
      this.showDialog = false;
      this.currentCheck = null;
    },
    onPhone() {
      wx.makePhoneCall({
        phoneNumber: this.detailInfo.storePhone,
      });
    },
    onLocation() {
      wx.openLocation({
        longitude: this.detailInfo.storeLongitude,
        latitude: this.detailInfo.storeLatitude,
        address: this.detailInfo.storeAddress,
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    onGatherDetail() {
      uni.navigateTo({
        url: `/gatherPlayer/pages/index?id=${this.detailInfo.gatherOrderInfo.gatheringId}`,
      });
    },
    async queryOrderDetail() {
      try {
        let res = await service.orderDetail({
          id: this.orderId,
          longitude: uni.getStorageSync("currentLongitude"),
          latitude: uni.getStorageSync("currentLatitude"),
        });
        this.detailInfo = res;
        this.customNav.navTitle = this.$enums.OrderStatus.getName(
          res.orderStatus
        );
        this.detailInfo.gmt = this.getCountDown(this.detailInfo.cutOffTime);
      } catch (e) {}
    },
    getCountDown(time) {
      return new Date(time).getTime() - new Date().getTime();
    },
    onFinishCountDown() {
      setTimeout(() => {
        this.queryOrderDetail();
      }, 500);
    },
    //继续支付
    async goPay() {
      this.$checkLogin.orderPay(
        this.detailInfo.id,
        this.detailInfo.buyerId
      ).then(data=>{
        setTimeout(() => {
          this.pageNo = 1;
          this.queryOrderDetail();
        }, 500);
      }).catch(e=>{
        
      })
    },
    async cancelOrder() {
      if(this.canDo)return;
      this.canDo = true;

      try {
        await service.cancelOrder({
          orderId: this.detailInfo.id,
        });

        wx.showToast({
          title: "取消订单成功",
        });
        this.canDo = false;
        this.queryOrderDetail();
      } catch (e) {
        this.canDo = false;
      }
    },
    //退款
    async onReturnMoney() {
      if(this.canDo)return;
      this.canDo = true;
      wx.showLoading();

      try {
        await service.leaveGathering({
          gatheringId: this.detailInfo.gatherOrderInfo.gatheringId,
          orderId: this.detailInfo.id,
          userId: this.detailInfo.buyerId,
          leaveNote: this.checkList[this.currentCheck],
        });
        this.showDialog = false;
        wx.showToast({
          title: "退款成功",
        });
        this.canDo = false;
        this.queryOrderDetail();
        wx.hideLoading();
      } catch (e) {
        wx.hideLoading();
        this.canDo = false;
      }
    },
  },
};
</script>
<style>
.van-count-down {
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
  &-addressBox {
    margin: rpx(15);
    background: #ffffff;
    border-radius: 16px;
    padding: rpx(15);
    position: relative;
    &-name {
      margin-left: 30px;
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 18px;
      width: 75%;
    }
    &-address {
      font-size: rpx(13);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #888888;
      line-height: 15px;
      width: 70%;
      margin-left: 30px;
      margin-top: 3px;
    }
    &-phone {
      margin-top: rpx(30);
      width: 100%;
      height: rpx(36);
    }
    &-place {
      position: absolute;
      right: rpx(15);
      top: rpx(15);
      width: rpx(36);
      height: rpx(36);
    }
    &-tag {
      position: absolute;
      left: rpx(15);
      top: rpx(15);
      width: rpx(18);
      height: rpx(18);
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
  &-payTime {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: rpx(106);
    font-size: rpx(12);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 14px;
    @include hor;
    align-items: center;
  }
  &-payTime::before {
    content: "剩余可支付时间 ";
    color: #000;
  }
  &-bottomBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 91px;
    background: #ffffff;
    @include hor-center-center;
    &-left {
      width: 43vw;
      height: 48px;
      border-radius: 16px;
      border: 1px solid #ebebeb;
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      @include hor-center-center;
    }
    &-right {
      margin-left: rpx(16);
      width: 43vw;
      height: 48px;
      background: #14c9c9;
      border-radius: 16px;
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      @include hor-center-center;
    }
  }
}
.popBox {
  width: 100vw;
  height: 478px;
  background: #ffffff;
  border-radius: 24px 24px 0px 0px;
  @include ver;
  align-items: center;
  &-title {
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 14px;
    padding-top: 20px;
    padding-bottom: 25px;
  }
  &-item {
    width: 92vw;
    height: 47px;
    border-radius: 12px;
    border: 1px solid #ebebeb;
    @include hor-between-center;
    margin-bottom: rpx(15);
    span {
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #1a1a1a;
      margin-left: rpx(15);
    }
  }
  .active {
    border: 1px solid #1a1a1a;
  }
  &-cancel {
    position: fixed;
    left: rpx(15);
    bottom: rpx(36);
    width: 43.7vw;
    height: 48px;
    background: #f7f7f7;
    border-radius: 16px;
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #999999;
    @include hor-center-center;
  }
  &-sure {
    position: fixed;
    right: rpx(15);
    bottom: rpx(36);
    width: 43.7vw;
    height: 48px;
    background: #1a1a1a;
    border-radius: 16px;
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    @include hor-center-center;
  }
}
</style>