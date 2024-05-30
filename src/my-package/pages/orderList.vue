<template>
  <view class="container">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('icon-order-bg')" mode="widthFix" />
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <div class="topNav-backBox">
            <van-icon name="arrow-left" @click="backRoute" style="color: #000" size="16" />
          </div>
          <van-search v-model="keywords" shape="round" placeholder="搜索商品名称"
            :left-icon="$iconFont.getIconName('icon-search')" @change="onSearch" @clear="onSearch" />
        </view>
      </view>
      <view slot="content">
        <div class="container-tabBox">
          <div v-for="(menu, idx) in menus" :key="menu.title" class="container-tabBox-tab"
            :style="idx === 4 ? 'margin-right:0' : ''" @click="onChangeTab(menu.type)">
            <span :class="gatherMemberOrderStatus === menu.type ? 'active' : ''">{{ menu.title }}</span>
            <div class="container-tabBox-tab-border" :class="gatherMemberOrderStatus === menu.type ? 'borderActive' : ''">
            </div>
          </div>
        </div>
        <scroll-view scroll-y class="container-listBox" @scrolltolower="reachBottom">
          <div v-for="item in list" :key="item.id" class="container-listBox-item" @click="onGoDetail(item)">
            <image src="../static/image/icon-store-tag.png" class="container-listBox-item-tag" />
            <span class="container-listBox-item-storeName">{{
              item.storeName
            }}</span>
            <div class="container-listBox-item-line"></div>
            <image :src="item.productImage" class="container-listBox-item-cover" mode="aspectFill" />
            <span class="container-listBox-item-title">{{
              item.productName
            }}</span>
            <span class="container-listBox-item-date"
              v-if="formatDate(showTime(item))">时间：{{ formatDate(showTime(item)) }}{{ $dayjs(showTime(item)).format("HH:mm") }}</span>
            <span class="container-listBox-item-date" v-else>时间：{{
              $dayjs(showTime(item)).format("YYYY-MM-DD HH:mm")
            }}</span>
            <span class="container-listBox-item-price">实付：¥{{ item.orderStatus === 'NOT_PAY' ? item.orderAmount / 100 :
              item.payAmount / 100 }}</span>
            <image src="../static/image/gather-tag.png" class="container-listBox-item-typeTag"
              v-if="item.productType === 'GATHERING_PRODUCT'" />
            <span class="container-listBox-item-payTime" v-if="item.orderStatus === 'NOT_PAY'"><van-count-down
                :time="item.gmt" format="剩余 mm:ss" @finish="onFinishCountDown" /></span>
            <span class="container-listBox-item-payStatus" :style="item.orderStatus !== 'NOT_PAY' ? 'right:15px' : ''">{{
              $enums.OrderStatus.getName(item.orderStatus)
            }}</span>
            <div class="container-listBox-item-bage" :class="item.sellType">
              {{ $enums.SellType.getName(item.sellType) }}
            </div>
            <div class="container-listBox-item-payButton" v-if="item.orderStatus === 'NOT_PAY'" @click.stop="goPay(item)">
              付款
            </div>
          </div>
          <div style="height:20px"></div>
        </scroll-view>
        <notc-data top="20vh" v-if="!list.length"></notc-data>
      </view>
    </navigation-bar>
  </view>
</template>
<script>
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service";
export default {
  components: {
    navigationBar,
    notcData
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
      menus: [
        { title: "全部", type: null },
        { title: "待付款", type: "NOT_PAY" },
        { title: "已付款", type: "PAYED" },
        { title: "已完成", type: "USED" },
        { title: "已退款", type: "REVERSE" },
      ],
      userInfo: null,
      list: [],
      gatherMemberOrderStatus: null,
      canChange: true
    };
  },
  async onLoad(options) {
    this.gatherMemberOrderStatus = options.type;
  },
  async onShow() {
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.queryOrderList();
  },
  computed: {
    formatDate() {
      return function (date) {
        return this.fnTime(date);
      }
    },
    showTime() {
      return function (item) {
        return item.createdTime;
      }
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onChangeTab(type) {
      if (!this.canChange) return;

      setTimeout(() => {
        this.canChange = false;

        this.gatherMemberOrderStatus = type;
        this.pageNo = 1;
        this.queryOrderList();
      }, 500)
    },
    onGoDetail(item) {
      uni.navigateTo({
        url: `./orderDetail?id=${item.id}`
      })
    },
    reachBottom() {
      this.pageNo++;
      this.queryOrderList();
    },
    onSearch(event) {
      this.keywords = event.detail;
      this.pageNo = 1;
      this.queryOrderList();
    },
    async queryOrderList() {
      if (this.pageNo === 1) {
        this.list = [];
      }
      try {
        let res = await service.orderList({
          orderStatus: this.gatherMemberOrderStatus,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          userId: this.userInfo.id,
          productName: this.keywords,
          productType: 'GATHERING_PRODUCT'
        });

        if (res.records && res.records.length) {
          res.records.map((v) => {
            if (v.orderStatus == "NOT_PAY") {
              v.gmt = this.getCountDown(v.cutOffTime);
            }
          });

          this.list.push(...res.records);
        }
        setTimeout(() => {
          this.canChange = true;
        }, 500)
      } catch (e) {
        this.canChange = true;
      }
    },
    onFinishCountDown() {
      setTimeout(() => {
        this.pageNo = 1;
        this.queryOrderList();
      }, 500);
    },
    getCountDown(time) {
      return new Date(time).getTime() - new Date().getTime();
    },
    //继续支付
    async goPay(order) {
      this.$checkLogin.orderPay(
        order.$orig.id,
        this.userInfo.id
      ).then(data=>{
        uni.showToast({
          title: "支付成功！",
        });
        setTimeout(() => {
          this.pageNo = 1;
          this.queryOrderList();
        }, 500);
      }).catch(e=>{
        
      })
    },
    fnTime(time) {
      let d = new Date(time).setHours(0, 0, 0, 0);
      let today = new Date().setHours(0, 0, 0, 0);

      let obj = {
        "-86400000": "昨天",
        0: "今天",
        86400000: "明天",
      };
      return obj[d - today] || null;
    },
  },
};
</script>
<style>
.van-count-down {
  font-size: 12px !important;
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

/deep/.van-search {
  height: rpx(36);
  padding: unset !important;
  border-radius: 10px;
  margin-left: rpx(16);
}

/deep/.van-search__content {
  background: #fff !important;
}

.container {
  &-tabBox {
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    top: 13.3vh;
    @include hor;
    justify-content: center;

    &-tab {
      margin-right: 9.8vw;
      position: relative;

      span {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #a3a3a3;
      }

      &-border {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -3px;
        height: 6px;
        background: unset;
      }
    }

    .active {
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 16px;
    }

    .borderActive {
      background: #14c9c9;
    }
  }

  &-listBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 18.3vh;

    &-item {
      margin: rpx(15);
      height: 130px;
      background: #ffffff;
      border-radius: 12px;
      position: relative;

      &-tag {
        position: absolute;
        left: rpx(15);
        top: rpx(16);
        width: rpx(18);
        height: rpx(18);
      }

      &-bage {
        position: absolute;
        left: rpx(19);
        top: rpx(59);
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

      &-typeTag {
        position: absolute;
        right: rpx(15);
        top: rpx(55);
        width: rpx(47);
        height: rpx(20);
      }

      &-storeName {
        position: absolute;
        left: rpx(38);
        top: rpx(15);
        font-size: rpx(14);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        width: 50%;
        @include text-overflow-line(1);
      }

      &-line {
        position: absolute;
        left: rpx(15);
        right: rpx(15);
        top: rpx(45);
        height: 1px;
        background: #e9e9e9;
      }

      &-cover {
        position: absolute;
        left: rpx(15);
        top: rpx(55);
        width: rpx(45);
        height: rpx(60);
        border-radius: 6px;
      }

      &-title {
        position: absolute;
        left: rpx(70);
        top: rpx(57);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        width: 55%;
        @include text-overflow-line(1);
      }

      &-date {
        position: absolute;
        left: rpx(70);
        top: rpx(77);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }

      &-price {
        position: absolute;
        left: rpx(70);
        top: rpx(97);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }

      &-payTime {
        position: absolute;
        right: rpx(15);
        top: rpx(17);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #888;
        line-height: 14px;
      }

      &-payStatus {
        position: absolute;
        right: rpx(75);
        top: rpx(17);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #faa21e;
        line-height: 20px;
      }

      &-payButton {
        position: absolute;
        right: rpx(15);
        top: rpx(87);
        width: 60px;
        height: 28px;
        background: #1a1a1a;
        border-radius: 8px;
        font-size: rpx(12);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        @include hor-center-center;
      }
    }
  }
}
</style>