<template>
  <view style="height: 100vh; overflow-x: hidden; background: #f7f7f7">
    <navigationBar :nav="customNav">
      <view slot="left">
        <van-icon name="arrow-left" @click="backRoute" size="46rpx" />
      </view>
      <view slot="title">
        <span class="navigation-title">店铺审核</span>
      </view>
      <view slot="content">
        <div class="tabMenuBox">
          <div
            class="tabMenuBox-menu"
            :class="activeNum === 0 ? 'active' : ''"
            @click="onChange(0)"
          >
            全部
          </div>
          <div
            class="tabMenuBox-menu"
            :class="activeNum === 1 ? 'active' : ''"
            @click="onChange(1)"
          >
            待审核
          </div>
          <div
            class="tabMenuBox-menu"
            :class="activeNum === 2 ? 'active' : ''"
            @click="onChange(2)"
          >
            已通过
          </div>
          <div
            class="tabMenuBox-menu"
            :class="activeNum === 3 ? 'active' : ''"
            @click="onChange(3)"
          >
            未通过
          </div>
        </div>
        <scroll-view scroll-y class="scroll">
          <view class="tab-content" v-if="shopList && shopList.length">
            <view
              class="shop-list"
              v-for="item in shopList"
              :key="item.storeId"
            >
              <shop-card
                :showName="item.storeName"
                :address="item.address"
                :isKm="[false, true]"
                :storeLogo="$filters.processLogo(item.storeLogo)"
                background="#fff"
              >
                <span slot="title-right">
                  <view class="title-right_button">
                    <van-button
                      size="mini"
                      round
                      :color="
                        item.storeApplyStatus === 'WAIT_AUDIT'
                          ? '#FAA21E'
                          : item.storeApplyStatus === 'PASS'
                          ? '#14C9C9 '
                          : '#FA5252'
                      "
                      >{{
                        $enums.StoreApplyStatus.getName(item.storeApplyStatus)
                      }}</van-button
                    >
                  </view>
                </span>
              </shop-card>
              <div v-if="item.storeApplyStatus === 'REJECT'" class="shop-list-rejectText">未通过理由：{{item.auditRemark}}</div>
            </view>
            <div style="height: 20px"></div>
          </view>
          <notc-data v-if="!shopList || !shopList.length"></notc-data>
        </scroll-view>
      </view>
    </navigationBar>
  </view>
</template>

<script>
import shopCard from "../components/shop-card";
import navigationBar from "../../components/navigation-bar/index.vue";
import notcData from "../../components/notc-data/index.vue";
import service from '../utils/service'
export default {
  components: {
    shopCard,
    navigationBar,
    notcData,
  },
  data() {
    return {
      shopList: null,
      activeNum: 0,
      customNav: {
        bgHeight: "100%",
        navTitle: "店铺审核",
        color: "#000",
        customizeTitle: true,
        customizeLeft: true,
        hideBg: true,
        bgBackground: "#f5f5f5",
      },
      userInfo: null
    };
  },
  async mounted() {
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.init();
  },
  methods: {
    async init(storeApplyStatus) {
      let form = {};
      if (storeApplyStatus) {
        form = {
          storeApplyStatus: storeApplyStatus,
        };
      }
      let data = await service.queryMyStoreApplyPage({
        userId: this.userInfo.id,
        ...form,
      });
      this.shopList = data;
    },
    backRoute() {
      uni.navigateBack();
    },
    onChange(event) {
      this.activeNum = event;
      switch (event) {
        case 0:
          this.init();
          break;
        case 1:
          this.init("WAIT_AUDIT");
          break;
        case 2:
          this.init("PASS");
          break;
        case 3:
          this.init("REJECT");
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.van-tabs {
  padding: 20rpx 0;
  .van-tabs__nav {
    border: none;
  }
}
.title-right_button {
  display: flex;
  align-items: center;
  justify-content: center;
  .van-button {
    // margin-right: 20rpx;
    border-radius: 8rpx;
  }
}
.van-tabdefault {
  // border: 2rpx solid #fff !important;
  // color: #8C9AA3 !important;
  // background: #fff;
  // color: rgba(140,154,163,1);
  // font-size: 28rpx !important;
  // font-weight: 400 !important;
  // font-family: "OPPOSans" !important;
}
.van-tabactive {
  // border-radius: 888rpx !important;
  color: #fff !important;
}
.tab-content {
  height: 100%;
  // width: 100%;
  // padding: 0 5%;
  background: #f7f7f7;
  margin: 0 20rpx;
  .shop-top {
    // height: 38rpx;
  }
  .shop-list {
    margin-top: 28rpx;
    background: #fff;
    padding-bottom: rpx(10);
    &-rejectText{
      padding: rpx(6) rpx(10);
      background: #f6f6f6;
      color: #666;
      font-size: rpx(12);
      margin: rpx(0) rpx(5);
      border-radius: rpx(4);
      word-break: break-all;
    }
  }
}
.tabs-ticketing {
  min-height: 100vh;
  background: #fff;
}
.tabMenuBox {
  @include hor;
  align-items: center;
  margin-top: 26rpx;
  &-menu {
    display: flex;
    flex: 1;
    font-size: 36rpx;
    line-height: 40rpx;
    text-align: center;
    justify-content: center;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
}
.active {
  font-family: PingFang SC-Semibold, PingFang SC;
  font-weight: 600;
  color: #14c9c9;
}
.scroll {
  position: fixed;
  left: 0;
  right: 0;
  top: 16vh;
  bottom: 0;
}
</style>
