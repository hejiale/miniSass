<template>
  <view class="data-screen-empty" :style="{ 'margin-top': top, 'position':  position}">
    <image
      :src="$iconFont.getIconName(noteImg)"
      class="data-screen-empty__icon"
    />
    <div v-if="clickTitle" @click="onClick" class="data-screen-empty__click">
      {{ clickTitle }}
    </div>
    <p class="data-screen-empty__tips">{{ note || "暂无数据" }}</p>
  </view>
</template>
<script>
export default {
  props: {
    note: {
      type: String,
      default: null,
    },
    noteImg: {
      type: String,
      default: 'noDataImg',
    },
    top: {
      type: String,
      default: "",
    },
    clickTitle: {
      type: String,
      default: null,
    },
    position: {
      type: String,
      default: 'fixed'
    }
  },
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$emit("on-click");
    },
  },
};
</script>
<style lang="scss">
.data-screen-empty {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: hidden;
  padding-bottom: 100rpx;
  z-index: 1;
  &__icon {
    width: 256rpx;
    height: 256rpx;
  }
  &__click {
    background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
    box-shadow: 0px 8px 9px 1px rgba(36, 237, 213, 0.25);
    border-radius: 8px;
    font-size: 32rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 32rpx;
    padding: 22rpx 36rpx;
    margin-bottom: 40rpx;
  }
  &__tips {
    text-align: LEFT;
    color: #8c9aa3;
    line-height: 36rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }

  &--absolute-center {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
