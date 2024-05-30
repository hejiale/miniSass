<template>
  <div class="webView">
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <web-view :src="url"></web-view>
    </navigationBar>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar/index.vue";

export default {
  data() {
    const vm = this;
    return {
      customNav: {
        customizeLeft: true,
        bg: vm.$iconFont.getIconName("finance-bg"),
        navTitle: "",
        bgHeight: "780rpx",
        color: "#000",
      },
      url: "",
    };
  },
  components: {
    navigationBar,
  },
  onLoad(options) {
    const { url, bankPhone, merchantId, reset, storeId } = options;
    if (reset) {
      this.url =
        url +
        "?merchantId=" +
        merchantId +
        "&bankPhone=" +
        bankPhone +
        "&storeId=" +
        storeId +
        "&t=" +
        Math.ceil(Math.random() * 100) +
        "&reset=" +
        reset;
    } else {
      this.url =
        url +
        "?merchantId=" +
        merchantId +
        "&bankPhone=" +
        bankPhone +
        "&storeId=" +
        storeId +
        "&t=" +
        Math.ceil(Math.random() * 100);
    }
    console.log(this.url);
  },
};
</script>
<style scoped>
</style>