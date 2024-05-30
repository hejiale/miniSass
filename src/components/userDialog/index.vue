<template>
  <div>
    <van-dialog
      title="提示"
      message="为保证您的正常使用，请使用手机端微信打开此小程序！"
      :show="show"
    ></van-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  created() {
    let systemInfo = wx.getSystemInfoSync();
   
    if (systemInfo.deviceOrientation === 'portrait' && systemInfo.windowWidth >= 600) {
      this.show = true;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>