<template>
  <div class="container">
    <image :src="$iconFont.getIconName('bg-updateJob')" mode="widthFix" class="container-fixbg" />
    <navigation-bar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          style="color: #000"
          size="50rpx"
        />
      </view>
      <view slot="content">
        <div class="container-titleBox">
          <span>修改职位</span>
          <span>重新选择你需要更改的职位</span>
        </div>
        <image
          mode="widthFix"
          class="container-menuBg"
          :src="$iconFont.getIconName('icon-shopDirector-select')"
          v-if="userInfo.storeUserType === 'SHOP_DIRECTOR'"
        />
        <image
          mode="widthFix"
          class="container-menuBg"
          :src="$iconFont.getIconName('icon-shopDirector')"
          @click="onSelectJob('SHOP_DIRECTOR')"
          v-else
        />
        <image
          mode="widthFix"
          class="container-menuBg"
          :src="$iconFont.getIconName('icon-employee-select')"
          v-if="userInfo.storeUserType === 'EMPLOYEE'"
        />
        <image
          mode="widthFix"
          class="container-menuBg"
          :src="$iconFont.getIconName('icon-employee')"
          @click="onSelectJob('EMPLOYEE')"
          v-else
        />
        <image
          mode="widthFix"
          class="container-menuBg"
          :src="$iconFont.getIconName('icon-dm-select')"
          v-if="userInfo.storeUserType === 'DM'"
        />
        <image
          mode="widthFix"
          class="container-menuBg"
          :src="$iconFont.getIconName('icon-dm')"
          @click="onSelectJob('DM')"
          v-else
        />
      </view>
    </navigation-bar>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import service from "../../utils/service";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      userInfo: {},
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
      },
    };
  },
  onLoad() {
    this.userInfo = uni.getStorageSync("updateUser");
    uni.removeStorageSync("updateUser");
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    async onSelectJob(type) {
      try {
        await service.setStoreUserRole({
          storeId: uni.getStorageSync("storeId"),
          userType: type,
          userId: this.userInfo.userId,
        });
        this.userInfo.storeUserType = type;
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-fixbg{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: -1;
  }
  &-titleBox {
    margin: rpx(16);
    @include ver;
    span:nth-child(1) {
      font-size: rpx(26);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 30px;
    }
    span:nth-child(2) {
      margin-top: rpx(6);
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
    }
  }
  &-menuBg {
    margin: 0 rpx(16) rpx(16) rpx(16);
    width: calc(100vw - 64rpx);
  }
}
</style>