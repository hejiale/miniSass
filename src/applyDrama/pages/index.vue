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
          <div class="container-tabBox-leftItem" :class="tab === 0 ? 'active':''" @click="onChangeTab(0)">可申领剧本<div class="container-tabBox-leftItem-bottom" :style="tab === 0 ? 'background: #14C9C9;':''"></div></div>
          <div class="container-tabBox-rightItem" :class="tab === 1 ? 'active':''" @click="onChangeTab(1)">已申领剧本<div class="container-tabBox-leftItem-bottom" :style="tab === 1 ? 'background: #14C9C9;':''"></div></div>
        </div>
        <modify
          :form="form"
          @reachBottom="onLoadMore"
          :isExist="tab === 0 ? false: true"
        />
        <notc-data top="20vh" v-if="!form.length"></notc-data>
      </view>
    </navigation-bar>
  </view>
</template>
<script>
import modify from "./dramaList.vue";
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service";
export default {
  components: { modify, notcData, navigationBar },
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
      total: 0,
      tab: 0
    };
  },
  onShow(){
    wx.showLoading();
    this.pageNo = 1;
    this.init();
  },
  methods: {
    onChangeTab(tab){
      this.tab = tab;
      this.pageNo = 1;
      this.form = [];
      this.init();
    },
    backRoute() {
      uni.navigateBack();
    },
    onSearch(e) {
      this.searchValue = e.detail;
      this.pageNo = 1;
      this.init();
    },
    onLoadMore() {
      this.pageNo++;
      this.init();
    },
    async init() {
      let data;
      if(this.tab === 0){
        data = await service.boxDramaApplyBListExpect({
          pageNo: this.pageNo /*当前页码*/,
          pageSize: this.pageSize /*分页大小*/,
          storeId: uni.getStorageSync("storeId"),
          productName: this.searchValue
        });
      }else{
        data = await service.boxDramaApplyBListExist({
          pageNo: this.pageNo /*当前页码*/,
          pageSize: this.pageSize /*分页大小*/,
          storeId: uni.getStorageSync("storeId"),
          productName: this.searchValue
        });
      }

      if (this.pageNo == 1) {
        this.form = [];
        this.total = data.total;
      }
      this.form.push(...data.records);
      wx.hideLoading();
    }
  },
};
</script>
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
  &-tabBox{
    @include hor-center-center;
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    top: 13vh;
    &-leftItem, &-rightItem{
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 19px;
      position: relative;
      @include ver;
      align-items: center;
      padding-bottom: 10px;
      &-bottom{
        position: absolute;
        bottom: 0;
        width: rpx(36);
        height: 4px;
        border-radius: 2px;
        background: transparent;
      }
    }
    .active{
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
    }
    &-rightItem{
      margin-left: rpx(80);
    }
  }
}
</style>
