<template>
  <div class="ranking-container">
    <!-- <div class="fixedBg"></div> -->
    <!-- <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon
              name="arrow-left"
              @click="backRoute"
              :style="{ color: arrowLeftColor }"
              size="50rpx"
          />
        </view>
      </view>
      <view slot="content"></view>
    </navigation-bar> -->
    <scroll-view class="ranking-main" scroll-y @scroll="rankingScroll" :scroll-top="scrollViewTop" scroll-with-animation>
      <rankingList :jump="jump" :scrollTop="scrollTop" :navBg="navBg" @handleScrollTo="handleScrollTo" />
    </scroll-view>
  </div>
</template>

<script>
import navigationBar from "@/components/navigation-bar";
import rankingList from "../components/rankingList.vue";
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
  components: {
    navigationBar,
    rankingList
  },
  data() {
    return {
      customNav: {
        color: "#FFFFFF",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
        bgBackground: "#000000FF",
        navTitle: '排行榜'
      },
      jump:null,
      scrollTop: 0,
      statusBarHeight: systemInfo.statusBarHeight,
      navBg: { opacity: 0 },
      scrollViewTop: 0,
      old: {
        scrollViewTop: 0
      },
      arrowLeftColor: '#FFFFFF'
    };
  },
  watch: {
    scrollTop(newValue, oldValue) {
      let top = newValue;
      // console.log(newValue,'newValue');
      this.navBg = {
        opacity: top > this.navbarHeight ? 1 : top * 0.01,
        height: this.statusBarHeight + this.navbarHeight * 2 + "px",
      };
      let color;
      if (top > this.navbarHeight) {
        color = '#2E323E'
      }else {
        color = '#FFFFFF'
      }
      this.arrowLeftColor = color
      this.customNav.color = color;
    },
  },
  computed: {
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44;
      // #endif
      // #ifdef MP
      return systemInfo.platform == "ios" ? 44 : 48;
      // #endif
    },
  },
  onLoad(options) {
    this.jump = options.jump;
  },
  onShow() {

  },
  onPageScroll(e) {

  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    // .ranking-main滚动时的处理
    rankingScroll(e) {
      console.log(e,'rankingScroll');
      this.scrollTop = e.detail.scrollTop;
      this.old.scrollViewTop = e.detail.scrollTop
    },
    handleScrollTo() {
      console.log(123123);
      // 解决view层不同步的问题
      this.scrollViewTop = this.old.scrollViewTop
      this.$nextTick(function() {
        this.scrollViewTop = 0
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fixedBg {
  height: 100vh;
}

/deep/ .header {
  background: transparent;
}

.ranking-main {
  width: 100%;
  height: 100vh;
}
</style>