<template>
   <view class="top">
     <view class="icons">
      <image src="../static/exit.png" @click="handleEnd"/>
      <image src="../static/refresh.png" @click="handleRefresh"/>
     </view>
   </view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "GameTop",
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...mapActions("player", [
      "getUserInfo", 
    ]),
    handleEnd() {
      wx.switchTab({
					url: "/pages/index/index",
			});
    },
    handleRefresh() {
      uni.showLoading();
      this.getUserInfo()
      setTimeout(()=>{
        uni.hideLoading();
      },500)
    }
  },
  watch: {},
}
</script>

<style lang="scss"  scoped>
.top {
  box-sizing: border-box;
  z-index: 20;
  position: relative;
  width: 100vw;
  padding-left: 17px;
  padding-right: 122px;
  .icons {
    display: flex;
    justify-content: space-between;
    image {
        width: 48px;
        height: 28px;
    }
  }
}
</style>