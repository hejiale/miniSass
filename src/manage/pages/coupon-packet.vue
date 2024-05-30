<template>
  <view class="couponPacket">
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          style="color: #000"
          size="50rpx"
        />
      </view>
    </navigation-bar>
    <view class="tab">
      <span
        :class="couponTicketStatus == 'CAN_USE' ? 'isChick' : ''"
        @click="couponTicketStatus = 'CAN_USE'"
        >未使用</span
      >
      <span
        :class="couponTicketStatus == 'USED' ? 'isChick' : ''"
        @click="couponTicketStatus = 'USED'"
        >已使用</span
      >
      <span
        :class="couponTicketStatus == 'EXPIRED' ? 'isChick' : ''"
        @click="couponTicketStatus = 'EXPIRED'"
        >已过期</span
      >
    </view>
    <view class="tips">
      优惠券过锁定时间，将自动退回至未使用状态
    </view>
    <scroll-view class="content" scroll-y v-if="MyTicketList.length">
      <view
        class="content-item"
        v-for="item in MyTicketList"
        :key="item.id"
        @click="showUsableRange(item)"
      >
        <view class="content-item-left">
          <view class="content-item-left-name">
            <view>{{ item.couponName }}</view>
            <!-- <view v-if="item.couponType == 'FEE_CUT'">满999元可用</view> -->
          </view>
          <view
            class="content-item-left-restrict"
            :class="couponTicketStatus != 'CAN_USE' ? 'unUseLeft' : ''"
            v-if="couponTicketStatus !== 'USED'"
          >
            <span>适用商品：</span>
            <span>{{userTypeName(item)}}</span>
          </view>
          <view
            class="content-item-left-time"
            v-if="item.gmt > 86400000 && couponTicketStatus == 'CAN_USE'"
            >有效期至{{ item.useEndTime }}</view
          >
          <view
            class="content-item-left-time"
            :class="'today'"
            v-else-if="
              item.gmt < 86400000 &&
                item.gmt >= 0 &&
                item.couponUseStatus == 'NOT_USED'
            "
            >有效期剩余{{ getCountDown(item.gmt) }}</view
          >
          <view
            class="content-item-left-time"
            :class="couponTicketStatus != 'CAN_USE' ? 'unUseLeft' : ''"
            v-else-if="couponTicketStatus == 'USED'"
            >使用时间{{ item.useTime }}</view
          >
          <view
            class="content-item-left-time"
            :class="couponTicketStatus != 'CAN_USE' ? 'unUseLeft' : ''"
            v-else
            >过期时间{{ item.useEndTime }}</view
          >
          <view class="content-item-left-user" v-if="item.couponUseStatus == 'USED'">
            <span>{{ item.consumerNickname }} 已使用</span>
          </view>
        </view>
        <view class="content-item-right">
          <view
            class="content-item-right-price"
            :class="couponTicketStatus != 'CAN_USE' ? 'unUseRight' : ''"
            >￥<span>{{ item.cutPrice / 100 }}</span></view
          >
          <view
            class="content-item-right-type"
            :class="couponTicketStatus != 'CAN_USE' ? 'unUseRight' : ''"
            :style="item.couponUseStatus == 'LOCKED' ? 'margin-top:16rpx' : ''"
            >{{ $enums.CouponUseStatus.getName(item.couponUseStatus) }}</view
          >
          <view
            class="content-item-right-time"
            :class="'today'"
            v-if="item.lockTime < 86400000 && item.couponUseStatus == 'LOCKED'"
            >剩余 {{ getCountDown(item.lockTime) }}</view
          >
        </view>
      </view>
    </scroll-view>
    <notc-data v-else></notc-data>
    <button open-type="contact" class="content-btn">有问题，联系客服</button>
    <van-action-sheet
      :show="isUsableRange"
      :safe-area-inset-bottom="false"
      close-on-click-overlay
      @click-overlay="isUsableRange = false"
      class="usableRange"
    >
      <div class="usableRange">
        <div class="usableRange-title">
          适用商品
        </div>
        <div
          v-for="(item, index) in currentUsableRange"
          :key="index"
          class="usableRange-p"
        >
          {{ $enums.ProductType.getName(item.productType) }}：
          <template v-if="!item.isAll">
            <span v-for="(it, idx) in item.limitedProduct" :key="idx">{{
              it.productName +
                (idx + 1 < item.limitedProduct.length ? "、" : "")
            }}</span>
          </template>
          <template v-else>
            <span>全部商品</span>
          </template>
        </div>
        <div class="usableRange-btn" @click="isUsableRange = false">
          我知道了
        </div>
      </div>
    </van-action-sheet>
  </view>
</template>

<script>
import navigationBar from "@/components/navigation-bar";
import notcData from "../../components/notc-data/index.vue";
import service from "../utils/service";
export default {
  components: {
    navigationBar,
    notcData,
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "店铺券包",
      },
      MyTicketList: [],
      couponTicketStatus: "CAN_USE",
      time: null,
      isUsableRange: false,
      currentUsableRange: null,
    };
  },
  async onShow() {
    await this.Userinfo();
    clearInterval(this.time);
    this.time = null;
    await this.getMyTicketList();
    await this.getGMT();
  },
  onHide() {
    clearInterval(this.time);
  },
  onUnload() {
    clearInterval(this.time);
  },
  watch: {
    couponTicketStatus() {
      uni.showLoading({
        title: "加载中...",
      });
      this.getMyTicketList().then(() => {
        uni.hideLoading();
      });
    },
  },
  computed: {
    overDay() {
      return function(item) {
        if (item) {
          return Math.ceil(
            this.$dayjs(item.useStartTime).diff(
              this.$dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              "day",
              true
            )
          );
        }
      };
    },
    diffTime() {
      return function(item) {
        if (item) {
          if (this.$dayjs(item.useStartTime) > Date.now()) return true;
          else return false;
        }
      };
    },
    getCountDown() {
      return function(data) {
        var time;
        var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((data % (1000 * 60)) / 1000);
        time =
          (hours < 10 ? "0" + hours : hours) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes) +
          ":" +
          (seconds < 10 ? "0" + seconds : seconds);
        return time;
      };
    },
    userTypeName(){
      return function(val){
        let arr = [];
        val.productApplicableVOList.map(v=>{
          if(v.isAll){
            arr.push(this.$enums.CustomProductType.getName(v.productType))
          }else{
            arr.push(`部分${this.$enums.CustomProductType.getName(v.productType)}`)
          }
        })
        return arr.join('、')
      }
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    async Userinfo() {
      let data = await this.$checkLogin.getUserInfo();
      this.userInfor = data;
    },
    //获取优惠券列表
    async getMyTicketList() {
      this.MyTicketList = [];
      let res = await service.myTicket({
        storeId: uni.getStorageSync("storeId"),
        couponTicketStatus: this.couponTicketStatus,
        targetType: "STORE",
      });
      res.map((v) => {
        v.gmt = this.$dayjs(v.useEndTime) - Date.now();
        if (v.couponUseStatus == "LOCKED") {
          v.lockTime = this.$dayjs(v.useEndTime) - Date.now() + 3600000;
        }
      });
      this.MyTicketList = res;
    },
    getGMT() {
      this.time = setInterval(() => {
        this.MyTicketList.map((v) => {
          v.gmt = v.gmt - 1000;
          if (v.lockTime) {
            v.lockTime = v.lockTime - 1000;
            if (v.lockTime <= 0 && this.couponTicketStatus == "CAN_USE") {
              this.getMyTicketList();
            }
          }
        });
      }, 1000);
    },
    showUsableRange(item) {
      this.currentUsableRange = item.productApplicableVOList;
      this.isUsableRange = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.couponPacket {
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rpx(8) rpx(51);
    span {
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: rpx(16);
    }
    .isChick {
      font-weight: 600;
      color: #333333;
    }
  }
  .tips {
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: rpx(14);
    padding: rpx(8) rpx(16);
  }
  .content {
    box-sizing: border-box;
    padding: rpx(16) rpx(16) rpx(40) rpx(16);
    // height: 85vh;
    flex: 1;
    overflow-y: auto;
    &-item {
      box-sizing: border-box;
      width: 100%;
      height: rpx(102);
      background: #ffffff;
      border-radius: rpx(8);
      margin-bottom: rpx(16);
      display: flex;
      position: relative;
      &-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: rpx(16);
        &-name {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          :nth-child(1) {
            @include text-overflow-line(1);
            flex: 1;
            font-size: rpx(14);
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #000000;
            margin-right: rpx(4);
          }
          :nth-child(2) {
            background: rgba(20, 201, 201, 0.1);
            border-radius: rpx(4);
            opacity: 1;
            border: 1px solid #14c9c9;
            font-size: rpx(12);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #14c9c9;
            line-height: rpx(12);
            padding: rpx(2) rpx(3);
          }
        }
        &-time {
          font-size: rpx(12);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: rpx(14);
        }
        &-user {
          :nth-child(1) {
            font-size: rpx(11);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #999;
          }
      }
        .today {
          color: #ff8c21;
        }
        &-restrict {
          font-size: rpx(12);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          display: flex;
          @include text-overflow-line(1);
          max-width: 60vw;
          span {
            white-space: pre;
          }
        }
      }
      &-right {
        width: rpx(96);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: rpx(11) rpx(14) rpx(11) rpx(20);
        position: relative;
        &-price {
          max-width: rpx(54);
          font-size: rpx(20);
          font-family: OPPOSans-Heavy, OPPOSans;
          color: #ff6721;
          line-height: 23px;
          display: flex;
          align-items: baseline;
          justify-content: center;
          text-align: center;
          span {
            font-size: rpx(26);
            font-family: OPPOSans-Heavy, OPPOSans;
          }
        }
        &-time {
          font-size: 11px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 13px;
          margin-top: rpx(1);
        }
        &-type {
          font-size: rpx(11);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: rpx(13);
          text-align: center;
          margin-top: rpx(16);
        }
        &-btn {
          width: rpx(64);
          height: rpx(26);
          background: #14c9c9;
          border-radius: rpx(13);
          text-align: center;
          line-height: rpx(26);
          font-size: rpx(12);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          margin-top: rpx(4);
        }
      }
      &-right::before {
        content: "";
        height: rpx(82);
        border-left: 1px #e6e6e6 dashed;
        position: absolute;
        left: rpx(0);
        top: rpx(6);
      }
      &-tag {
        position: absolute;
        width: rpx(44);
        height: rpx(20);
        border-radius: rpx(8) 0px rpx(8) 0px;
        font-size: rpx(11);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        line-height: rpx(20);
        text-align: center;
      }
      .WILLLOSE {
        color: #ff6721;
        background: rgba(255, 139, 33, 0.2);
      }
      .UNLOSE {
        color: #666666;
        background: #e9e9e9;
      }
      .CANUSE {
        color: #199e9e;
        background: rgba(20, 201, 201, 0.1);
      }
      .unUseLeft {
        color: #999999 !important;
      }
      .unUseRight {
        color: #666666;
      }
    }
    &-btn {
      position: fixed;
      bottom: rpx(28);
      left: rpx(16);
      right: rpx(16);
      height: rpx(44);
      border-radius: rpx(40);
      opacity: 1;
      border: 1px solid #14c9c9;
      font-size: 16px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #14c9c9;
      line-height: rpx(44);
      margin-top: rpx(33);
    }
    &-btn::after {
      display: none;
    }
  }
  .usableRange {
    display: flex;
    flex-direction: column;
    padding: rpx(20) rpx(16) rpx(28);
    &-title {
      font-size: 16px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 19px;
      text-align: center;
    }
    &-p {
      margin-top: rpx(8);
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
    }
    &-btn {
      width: 275px;
      height: 44px;
      background: #14c9c9;
      border-radius: 40px 40px 40px 40px;
      font-size: 16px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 44px;
      text-align: center;
      margin: 0 auto;
      margin-top: rpx(33);
    }
  }
}
</style>
