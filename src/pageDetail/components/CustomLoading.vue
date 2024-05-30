<template>
  <view v-if="visible" class="loading-container">
    <view class="loading-spinner"></view>
    <text class="loading-text">{{ text }}</text>
  </view>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '加载中...',
    },
  },
};
</script>

<style>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #FFFFFF; /* 半透明背景 */
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ddd;
  border-top-color: #36e4bb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 10px;
  color: #1A1A1A;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
