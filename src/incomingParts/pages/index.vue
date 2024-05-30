<template>
  <div class="container">
    <div class="container-bg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #fff"
            size="50rpx"
          />
        </view>
      </view>
      <view slot="content">
        <view class="container-box top">
          <image
            :src="$iconFont.getIconName('icon-personal')"
            @click="onGoPersonal"
            lazy-load
            mode="widthFix"
          />
        </view>
        <view class="container-box">
          <image
            :src="$iconFont.getIconName('icon-company')"
            @click="onGoCompany"
            lazy-load
            mode="widthFix"
          />
        </view>
        <button class="container-btn" open-type="contact">
          <image
            :src="$iconFont.getIconName('icon-keFu')"
            lazy-load
            mode="widthFix"
          />
        </button>
      </view>
    </navigation-bar>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      merchantInfo: null,
      personalMerchantInfo: null,
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
    };
  },
  methods: {
    backRoute(){
      uni.navigateBack();
    },
    onGoPersonal() {
      uni.navigateTo({ url: `/individual/pages/merchant-apply?storeId=${uni.getStorageSync("storeId")}`});
    },
    onGoCompany() {
      uni.navigateTo({
        url: `/enterprise/pages/index?storeId=${uni.getStorageSync("storeId")}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  @include ver;
  align-items: center;
  &-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 35.7vh;
    background: linear-gradient(180deg, #4762f2 0%, rgba(71, 129, 242, 0) 100%);
    z-index: -1;
  }
  image {
    width: 91.46vw;
  }
  &-box {
    margin-bottom: 12px;
    view {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #888888;
      line-height: 20px;
      text-align: center;
    }
  }

  button {
    background: none;
    border: none;
    padding: 0;
    view {
      margin-top: rpx(8);
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #888888;
      line-height: 20px;
      text-align: center;
    }
  }
  button:after {
    display: none;
  }
  .top{
    margin-top: 4vh;
  }
}
</style>
