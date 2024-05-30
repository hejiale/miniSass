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
        bgHeight: "100vh",
        color: "#000",
      },
      url: "",
    };
  },
  components: {
    navigationBar,
  },
  onLoad(options) {
    const { url, bankPhone, merchantId, storeId, amount } = options;

    this.url =
    url +
    "?merchantId=" +
    merchantId +
    "&bankPhone=" +
    bankPhone +
    "&storeId=" +
    storeId +
    "&amount=" + 
    amount;
    console.log(this.url)
  },
};
</script>
<style scoped>
</style>