<template>
  <!-- 剧本详情页导航栏，整合插件 -->
  <view class="detail-head-wrap">
    <!-- 标题栏 -->
    <view class="u-navbar u-navbar-fixed">
      <view class="nav-bg"></view>
      <view class="u-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="u-navbar-inner" :style="[navbarInnerStyle]">
        <view class="u-back-wrap">
          <view class="nav-left-icon">
            <image src="../static/image/top-back.png" class="nav-left-icon-bg"/>
            <div class="nav-left-icon-item" @click="backRoute"></div>
            <div class="nav-left-icon-item" @click="onShare"></div>
          </view>
        </view>
        <view class="nav-content" v-if="showDrama">
            <image class="share" :src="queryAppDramaDetailList.dramaCover" mode="aspectFill" />
            <view class="u-icon-wrap u-back-text u-line-1">
              <view
                v-if="queryAppDramaDetailList.dramaName"
              >{{ $filters.truncateText(queryAppDramaDetailList.dramaName, 8) || '' }}</view>
              <view class="score" v-if="queryAppDramaDetailList.scoreList[0].score != null && queryAppDramaDetailList.scoreList[1].score != null && queryAppDramaDetailList.scoreList[2].score != null">
                {{ queryAppDramaDetailList.juyouScoreAvg / 10 || 0 }}
                <text>分</text>
              </view>
              <view class="score" v-if="queryAppDramaDetailList.scoreList[0].score == null && queryAppDramaDetailList.scoreList[1].score == null && queryAppDramaDetailList.scoreList[2].score == null">
                {{ queryAppDramaDetailList.juyouScoreAvg / 10 || 0 }}
                <text>分</text>
              </view>
            </view>
          </view>
          <view v-else class="nav-title">剧本详情</view>
      </view>
    </view>
  </view>
</template>

<script>
import zIndex from "@/utils/zIndex";
const $u = {
  zIndex
};
// $u挂载到uni对象上
uni.$u = $u;
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
/**
 * detail-head-剧本详情导航栏
 * @property {String} navTitle 项目名称
 */
export default {
  components: {},
  data() {
    return {
      $u,
      changeNavBackground: false,
      swiperCur: 0,
      statusBarHeight: menuButtonInfo.top,
      showDrama: false
    };
  },
  props: {
    scrollTop: {
      type: [String, Number],
      default: 0
    },
    queryAppDramaDetailList: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  watch: {
    scrollTop(newValue, oldValue) {
      let top = newValue;
      this.showDrama = top > this.navbarHeight;
    }
  },
  computed: {
    // 导航栏内部盒子的样式
    navbarInnerStyle() {
      let style = {};
      style.height = menuButtonInfo.height + "px";
      return style;
    },
    // 整个导航栏的样式
    navbarStyle() {
      let style = {};
      style.zIndex = zIndex.navbar;
      style.background = "none";
      Object.assign(style, this.background);
      return style;
    },
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44;
      // #endif
      // #ifdef MP
      return systemInfo.platform == "ios" ? 44 : 48;
      // #endif
    }   
  },
  methods: {
    backRoute() {
      this.$emit('backIndex')
    },
    setStatusStyle(status) {
      // #ifdef H5
      return false;
      // #endif
      if (status == "light") {
        uni.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#000000",
          animation: {
            duration: 200,
            timingFunc: "easeIn"
          }
        });
        // #ifdef APP-PLUS
        plus.navigator.setStatusBarStyle("light");
        // #endif
      } else {
        uni.setNavigationBarColor({
          frontColor: "#fff",
          backgroundColor: "#ffffff",
          animation: {
            duration: 200,
            timingFunc: "easeIn"
          }
        });

        // #ifdef APP-PLUS
        plus.navigator.setStatusBarStyle("dark");
        // #endif
      }
    },
    onShare(){
      this.$emit('on-share')
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-left-icon {
  position: relative;
  display: flex;
  align-items: center;
  width: 176rpx;
  height: 64rpx;
  &-bg {
    @include abscenter;
  }
  &-item{
    display: flex;
    flex: 1;
    height: 100%;
    z-index: 1;
  }
}
.nav-content {
  margin-left: 16rpx;
  display: flex;
  align-items: center;
  .share {
    width: 48rpx;
    height: 64rpx;
    border-radius: 6rpx 6rpx 6rpx 6rpx;
    margin-right: 18rpx;
  }
  .u-icon-wrap {
    font-size: 28rpx;
    color: #ffffff;
  }
  .score {
    font-size: 26rpx;
    color: #fec635;
    margin-right: 5rpx;
    text {
      color: #ffffff;
    }
  }
}
@mixin vue-flex($direction: row) {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: $direction;
  /* #endif */
}
.detail-head-wrap {
  position: relative;
  // z-index: 100;
}

.u-navbar {
  width: 100%;
}

.u-navbar-fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 991;
  padding-bottom: 20rpx;
  .nav-bg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 980;
    width: 100%;
    height: 100%;
    background-color: #313131;
    // box-shadow: 0px 4px 6px rgba(140, 140, 140, 0.32);
  }
}

.u-status-bar {
  width: 100%;
}

.u-navbar-inner {
  @include vue-flex;
  position: relative;
  align-items: center;
  position: relative;
  z-index: 999;
}

.u-back-wrap {
  @include vue-flex;
  align-items: center;
  padding-left: 24rpx;
}

.nav-title{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: rgba($color: #fff, $alpha: .6);
}
</style>
