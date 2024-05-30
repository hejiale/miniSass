<template>
  <view
    class="nav-back"
    :style="{
      backgroundColor: bgColor === 'transparent' ? 'transparent' : '#ffffff',
    }"
  >
    <nav-base>
      <image
        @click="handleBack()"
        class="nav-back__icon nav-back__icon--left"
        :src="
          showIcon
            ? 'https://img.yangzhichang.com/yzc-wb/icon/back_icon.png'
            : ''
        "
        mode=""
      ></image>
      <view class="nav-back__right">
        <text class="nav-back__title">{{ title }}</text>
      </view>
    </nav-base>
  </view>
</template>

<script>
export default {
  name: "NavBack",
  props: {
    title: {
      type: String,
      default: "",
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    option: {
      type: String,
    },
    bgColor: {
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleBack() {
      uni.navigateBack();
    },
    
  },
};
</script>

<style lang="scss">
.nav-back {
  width: 100%;
  position: relative;
  z-index: 3;
  &__icon {
    width: 80rpx;
    min-width: 80rpx;
    height: 60rpx;
    &--left {
      margin-left: 23rpx;
    }
  }

  &__right {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__title {
    margin-right: 192rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 32rpx;
  }
}
</style>
