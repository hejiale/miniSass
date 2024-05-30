<template>
  <view class="uni-tab-bar">
    <view class="scrollClass" v-for="(tab, index) in tabBars" :key="tab.id" :style="scrollStyle">
      <view class="swiper-tab-list" :class="{ active: tabIndex == index }" @tap="tabtap(index)" :style="scrollItemStyle">
        <view>{{ tab.name }} {{ tab.num ? tab.num : "" }}</view>
        <view class="swiper-tab-line"></view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    tabBars: Array,
    tabIndex: Number,
    scrollStyle: {
      type: String,
      default: "",
    },
    scrollItemStyle: {
      type: String,
      default: "",
    },
  },
  methods: {
    //点击切换导航
    tabtap(index) {
      // this.tabIndex = index;
      this.$emit("tabtap", index);
    },
  },
};
</script>

<style lang='scss' scoped>
.uni-swiper-tab {
  border-bottom: 6rpx solid #eeeeee;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.scrollClass {
  display: inline-block;
  // width: 200rpx;
  margin-right: 64rpx;
  white-space: nowrap;
}

.swiper-tab-list {
  display: inline-block;
  font-size: 30rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #959aa5;
  text-align: center;
}

.uni-tab-bar {
  // height: 90rpx;
  // line-height: 60rpx;
  display: flex;
  justify-content: space-around;
}

.uni-tab-bar .active {
  font-size: 30rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #2e323e;
}

.active .swiper-tab-line {
  width: 36rpx;
  height: 6rpx;
  background: #36e4bb;
  border-radius: 8rpx 8rpx 8rpx 8rpx;
  opacity: 1;
  margin: auto;
}
</style>
