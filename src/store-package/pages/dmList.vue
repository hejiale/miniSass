<template>
  <div class="dmBox" v-if="isShow">
    <div
      class="backBox"
      :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
      @click="onBack"
    >
      <van-icon name="arrow-left" color="#000" size="24" />
    </div>
    <div class="dmBox-title" :style="{ top: `${menuRect.top}px` }">
      门店DM ({{ DM_total }})
    </div>
    <div class="dmBox-subTitle" :style="{ top: `${menuRect.top + 20}px` }">
      {{storeName}}
    </div>
    <scroll-view
      class="dmBox-listBox"
      scroll-y
      @scrolltolower="onLoadMore"
      v-if="dmList.length"
      :style="{ top: `${menuRect.top + 40}px` }"
    >
      <div
        class="dmBox-listBox-item"
        v-for="dm in dmList"
        :key="dm.userId"
      >
        <div class="dmBox-listBox-item-coverBox">
          <image
            :src="dm.avatar"
            mode="aspectFill"
          />
          <image class="dmBox-listBox-item-coverBox-cover" src="../static/image/dm-bg.png"/>
          <span class="dmBox-listBox-item-coverBox-scoreBox" v-if="dm.evaluate">{{dm.evaluate}}</span>
        </div>
        <span class="dmBox-listBox-item-name">{{ dm.userName }}</span>
      </div>
    </scroll-view>
    <notcData v-else />
  </div>
</template>
<script>
import { getMenuButtonRect } from "@/utils/index";
import service from '../utils/service';
export default {
  data() {
    return {
      pageNo: 1,
      dmList: [],
      DM_total: 0,
      storeId: null,
      menuRect: null,
      isShow: false,
      storeName: null
    };
  },
  async onLoad(options) {
    this.storeId = options.storeId;
    this.storeName = options.name;
    this.menuRect = await getMenuButtonRect();
    await this.queryDM_List();
  },
  methods: {
    onBack(){
      uni.navigateBack();
    },
    onLoadMore() {
      if (this.DM_total === this.dmList.length) return;
      
      this.pageNo++;
      this.queryDM_List();
    },
    async queryDM_List() {
      try {
        let data = await service.getStoreDMList({
          pageNo: this.pageNo,
          pageSize: 20,
          storeId: this.storeId,
          storeUserType: "DM",
        });
        if (this.pageNo === 1) this.dmList = [];

        if (data.records.length) {
          this.dmList.push(...data.records);
        }
        this.DM_total = data.total;
        this.isShow = true;
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.dmBox {
  margin-top: 30rpx;
  height: 85vh;
  background: #fff;
  border-radius: 32rpx;
  .backBox {
    position: fixed;
    left: 24rpx;
    @include ver;
    justify-content: center;
    z-index: 1;
  }
  &-title {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 38rpx;
    text-align: center;
    position: fixed;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  &-subTitle {
    margin-top: 4rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba($color: #444, $alpha: 0.4);
    line-height: 28rpx;
    text-align: center;
    position: fixed;
    margin-left: 50%;
    transform: translateX(-50%);
    @include text-overflow-line(1);
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #fafafa;
    padding: 24rpx;
    &-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 6rpx;
      margin-bottom: 24rpx;
      position: relative;
      &-coverBox {
        width: 30.66vw;
        height: 30.66vw;
        position: relative;
        border-radius: 56rpx;
        overflow: hidden;
        &-cover{
          @include abscenter;
          z-index: 1;
        }
        &-scoreBox{
          position: absolute;
          top: 16rpx;
          right: 16rpx;
          font-size: 36rpx;
          font-family: OPPOSans-Heavy, OPPOSans;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 42rpx;
          z-index: 1;
        }
        &-scoreBox::after{
          content: '分';
          font-size: 36rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 42rpx;
        }
      }
      &-name {
        font-size: 32rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        line-height: 38rpx;
        margin-top: 16rpx;
        width: 28vw;
        text-align: center;
        @include text-overflow-line(1);
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 24rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
</style>