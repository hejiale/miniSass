<template>
  <view class="container">
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
          <van-search
            v-model="searchValue"
            shape="round"
            placeholder="搜索剧本名称"
            :left-icon="$iconFont.getIconName('icon-search')"
            @search="onSearch"
            @clear="onSearch"
          />
        </view>
      </view>
      <view slot="content">
        <div class="container-tabBox">
          <div
            class="container-tabBox-leftItem"
            :class="tab === 0 ? 'active' : ''"
            @click="onChangeTab(0)"
          >
            全部
            <div
              class="container-tabBox-leftItem-bottom"
              :style="tab === 0 ? 'background: #14C9C9;' : ''"
            ></div>
          </div>
          <div
            class="container-tabBox-rightItem"
            :class="tab === 1 ? 'active' : ''"
            @click="onChangeTab(1)"
          >
            已付款
            <div
              class="container-tabBox-leftItem-bottom"
              :style="tab === 1 ? 'background: #14C9C9;' : ''"
            ></div>
          </div>
          <div
            class="container-tabBox-rightItem"
            :class="tab === 2 ? 'active' : ''"
            @click="onChangeTab(2)"
          >
            已取消
            <div
              class="container-tabBox-leftItem-bottom"
              :style="tab === 2 ? 'background: #14C9C9;' : ''"
            ></div>
          </div>
          <div class="container-tabBox-filterBox" @click="showFilter = true">
            <span>{{$enums.ProductType.getName(productType)}}</span>
            <van-icon name="arrow-down" size="16"/>
          </div>
        </div>
        <scroll-view class="scrollBox" scroll-y @scrolltolower="reachBottom">
          <div
            class="scrollBox-item"
            v-for="order in form"
            :key="order.id"
            @click="onClickDetail(order)"
          >
            <div class="scrollBox-item-title" :style="order.orderStatus === 'NOT_PAY' ? 'width: 65%;':'width: 80%;'">{{ order.productName }}</div>
            <div class="scrollBox-item-info mt8">
              <span>商品类型：</span>
              <span>{{ $enums.ProductType.getName(order.productType) }}</span>
            </div>
            <div class="scrollBox-item-info mt4">
              <span>订单号：</span>
              <span>{{ order.orderNum }}</span>
            </div>
            <div class="scrollBox-item-info mt4">
              <span>时间：</span>
              <span>{{ order.createdTime }}</span>
            </div>
            <div class="scrollBox-item-info mt4">
              <span>付款人：</span>
              <span>{{ order.buyerName }}</span>
            </div>
            <div class="scrollBox-item-status">
              <span class="wait" v-if="order.orderStatus === 'NOT_PAY'">{{
                $enums.OrderStatus.getName(order.orderStatus)
              }}</span>
              <span
                class="active"
                v-else-if="
                  order.orderStatus === 'USED' ||
                  order.orderStatus === 'SETTLEMENT'
                "
                >{{ $enums.OrderStatus.getName(order.orderStatus) }}</span
              >
              <span class="gray" v-else>{{
                haveDeliver(order) ? '已发货':$enums.OrderStatus.getName(order.orderStatus)
              }}</span>
              <span class="count" v-if="order.orderStatus === 'NOT_PAY'"><van-count-down :time="order.gmt" format="剩余 mm:ss" @finish="onFinishCountDown"/></span
              >
            </div>
            <div
              class="scrollBox-item-payButton"
              v-if="order.orderStatus === 'NOT_PAY'"
              @click.stop="goPay(order)"
            >
              付款
            </div>
          </div>
          <div style="height: 20px"></div>
        </scroll-view>
        <notc-data top="20vh" v-if="!form.length"></notc-data>
      </view>
    </navigation-bar>
    <van-action-sheet
      :show="showFilter"
      :actions="options"
      @select="onSelectFilter"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showFilter = false"
    />
  </view>
</template>
<script>
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service";
export default {
  components: { notcData, navigationBar },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: 'fixed'
      },
      pageNo: 1,
      pageSize: 50,
      searchValue: "",
      form: [],
      tab: 0,
      userInfo: null,
      showFilter: false,
      options: [
        {name: '全部商品'},
        {name: '票房商品'},
        {name: '申领剧本商品'}
      ],
      productType: null,
      timer: null
    };
  },
  async onLoad(options) {
    this.productType = options.productType;
  },
  async onShow(){
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.queryOrderList();
  },
  computed: {
    haveDeliver(){
      return function(data){
        return data.orderStatus === 'PAYED' && data.orderLogistics && data.orderLogistics.number;
      }
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onSearch(e) {
      this.searchValue = e.detail;
      this.pageNo = 1;
      this.queryOrderList();
    },
    onChangeTab(tab) {
      this.tab = tab;
      this.pageNo = 1;
      this.queryOrderList();
    },
    reachBottom() {
      this.pageNo++;
      this.queryOrderList();
    },
    onClickDetail(order) {
      uni.navigateTo({
        url: `./detail?id=${order.id}`,
      });
    },
    async queryOrderList() {
      uni.showLoading();

      try {
        let data = await service.queryOrderList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          storeId: uni.getStorageSync("storeId"),
          userId: this.userInfo.id,
          productType: this.productType,
          productName: this.searchValue,
          orderOptType: 'EXPENDITURE',
          orderStatusList:
            this.tab === 0
              ? null
              : this.tab === 1
              ? ["PAYED", "USED", "SETTLEMENT"]
              : ["REVERSE", "CLOSE"],
        });
        if (this.pageNo === 1) {
          this.form = [];
        }

        data.records.map((v) => {
          if (v.orderStatus == "NOT_PAY") {
            v.gmt = this.$dayjs(v.cutOffTime) - Date.now();
          }
        });
        if (data.records.length) {
          this.form.push(...data.records);
        }
        uni.hideLoading();
      } catch (e) {
        uni.hideLoading();
      }
    },
    //继续支付
    async goPay(order) {
      //校验是否创单人支付
      if(this.userInfo.id !== order.buyerId){
        return wx.showToast({
          title: '需订单创建人支付',
          icon: 'none'
        })
      }

      this.$checkLogin.orderPay(
        order.id,
        this.userInfo.id
      ).then(data=>{
        uni.showToast({
          title: "支付成功！",
        });

        setTimeout(() => {
          this.pageNo = 1;
          this.queryOrderList();

          if(order.productType === 'APPLY_DRAMA_PRODUCT'){
              uni.navigateTo({
                url: `/applyDrama/pages/applyDrama?id=${order.productId}&orderInfoId=${order.id}`,
            });
          }else{
            this.getStatus();
          }
        }, 500);
      }).catch(e=>{
        
      })
    },
    async getStatus() {
      const delayTime =  1000*2
      uni.showLoading();
      try{
        let res = await service.onlineGameCheckOnlineGame({
          dmId: this.userInfo.id,
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
      }catch(e){
        uni.hideLoading();
      }
    },
    onSelectFilter(e){
      this.$enums.ProductType.list.map(v=>{
        if(v.label === e.detail.name){
          this.productType = v.value;
        }
      })
      this.showFilter = false;
      this.pageNo = 1;
      this.queryOrderList();
    },
    onFinishCountDown(){
      this.pageNo = 1;
      this.queryOrderList();
    }
  },
};
</script>
<style>
.van-count-down{
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
  /deep/image {
    vertical-align: super !important;
  }
}
/deep/.van-search {
  height: rpx(36);
  padding: unset !important;
  border-radius: 60px;
  margin-left: rpx(16);
}
/deep/.van-search__content {
  background: #fff !important;
}
.container {
  &-tabBox {
    @include hor;
    align-items: center;
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    top: 13vh;
    &-filterBox {
      position: absolute;
      right: rpx(0);
      top: 0;
      @include hor;
      align-items: center;
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333;
      line-height: 19px;
    }
    &-leftItem,
    &-rightItem {
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 19px;
      position: relative;
      @include ver;
      align-items: center;
      padding-bottom: 10px;
      margin-right: rpx(20);
      &-bottom {
        position: absolute;
        bottom: 0;
        width: rpx(36);
        height: 4px;
        border-radius: 2px;
        background: transparent;
      }
    }
    .active {
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
    }
  }
}
.scrollBox {
  position: fixed;
  left: rpx(15);
  top: 19vh;
  bottom: 0;
  width: calc(100vw - 60rpx);
  @include ver;
  align-items: center;
  &-item {
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: rpx(16);
    padding: rpx(10);
    position: relative;
    &-title {
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 19px;
      word-break: break-all;
    }
    &-info {
      @include hor;
      align-items: center;
      span {
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 14px;
      }
      span:nth-child(1) {
        color: #333333;
      }
      span:nth-child(2) {
        color: #999;
      }
    }
    &-status {
      position: absolute;
      right: rpx(10);
      top: rpx(10);
      @include hor;
      align-items: center;
      span {
        font-size: rpx(12);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 14px;
      }
      .wait {
        color: #faa21e;
      }
      .active {
        color: #14c9c9;
      }
      .gray {
        color: #999999;
      }
      .count {
        margin-left: rpx(4);
      }
    }
    &-payButton {
      position: absolute;
      right: rpx(10);
      bottom: rpx(10);
      width: 84px;
      height: 30px;
      background: #14c9c9;
      border-radius: 17px;
      font-size: rpx(13);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      @include hor-center-center;
    }
  }
}
</style>
