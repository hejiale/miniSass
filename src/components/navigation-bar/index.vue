<template>
  <!-- 动态设置导航栏高度,背景色 -->
  <view class="navigation-bar" :style="{ height: nav.bgHeight, background: nav.bgBackground }">
    <!-- 动态设置了元素的高度,顶部的内边距 定位方式定义了一个默认的absolute-->
    <view class="header" :style="{ height: titleBarHeight + 'px','padding-top': statusBarHeight + 'px',position: nav.position || 'absolute', 'z-index': nav.zIndex || 100}">
      <view class="header-left">
        <!-- 声明条件插槽 -->
        <slot v-if="nav.customizeLeft" name="left"></slot>
      </view>
      <!-- 条件渲染span -->
      <view class="header-title" v-if="!nav.customizeTitle" :style="{ color: nav.color, 'font-weight': nav.weight }" >
        <span>{{ nav.navTitle }}</span>
      </view>
      <view v-if="nav.customizeSearchBar">
        <slot name="searchBar"/>
      </view>
    </view>

    <view class="navigation-bar-content" v-if="nav.fix" :style="{ 'top': titleBarHeight + statusBarHeight + 'px' }"  >
      <slot name="content"></slot>
    </view>
    <view v-else :style="{ 'padding-top': titleBarHeight + statusBarHeight + 'px' }" >
      <slot name="content"></slot>
    </view>

    <img v-if="!nav.hideBg" class="navigation-bg-shopInfo" :style="{ height: nav.bgHeight }" :src="nav.bg"/>
  </view>
</template>
<script>
export default {
  props: ["nav"],
  data() {
    return {
      statusBarHeight: 0,
      titleBarHeight: 0,
    };
  },
  created() {
    let that = this;
    uni.getSystemInfo({
      success: function (res) {
        /*检查设备的型号是否包含字符串 "iPhone"*/
        if (res.model.indexOf("iPhone") !== -1) {
          that.titleBarHeight = 44;
        } else {
          that.titleBarHeight = 48;
        }
        that.statusBarHeight = res.statusBarHeight;
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.navigation-bar {
  /* 占据父类元素所有宽度 */
  width: 100%;
  /* 使其完全覆盖元素，无论图像的原始尺寸如何 */
  background-size: 100% 100%;
  &-content{
    /* 固定定位 不随页面滚动*/
    position: fixed;
    /* 被拉伸以填充整个浏览器窗口的宽度 确保元素在垂直方向上贴近浏览器窗口的底部*/
    left: 0;
    right: 0;
    bottom: 0;
  }
}

/* flex布局居中对齐，与父元素距离为0，宽度占满 如果有堆叠放在最上面 */
.header {
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
}

.header .header-title {
  position: absolute;
  color: #000000;
  font-size: 32rpx;
  font-weight: 600;
  font-family: PingFang SC-Semibold, PingFang SC;
  left: 50%;
  width: 50%;
  transform: translateX(-50%);
  @include text-overflow-line(1);
  text-align: center;
}

/* 内边距设置为20rpx避免内容直接贴近元素边界 */
.header-left {
  position: absolute;
  left: 0;
  padding: 20rpx;
}
</style>
