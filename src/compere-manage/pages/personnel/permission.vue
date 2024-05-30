<template>
  <div class="container">
    <div class="container-fixedBg"></div>
    <image
      :src="$iconFont.getIconName('bg-updateJob')"
      mode="widthFix"
      class="fixbg"
    />
    <span class="container-title">权限设置</span>
    <span class="container-memo">点击对应模块给予权限</span>
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
        <div class="menuBox">
          <div class="menuBox-item" v-for="(item, index) in menus" :key="index">
            <span>{{ item.data.name }}</span>
            <div class="menuBox-item-box">
              <div
                class="menuBox-item-box-menu"
                v-for="(it, idx) in item.children"
                :key="idx"
                @click="onChange(it)"
              >
                <div class="menuBox-item-box-menu-info">
                  <img :src="$iconFont.getIconName(it.data.icon)" alt="" />
                  <span>{{ it.data.name }}</span>
                </div>
                <image
                  src="../../static/image/icon-select.png"
                  class="menuBox-item-box-menu-selectBox"
                  v-if="it.data.checked"
                />
                <image
                  src="../../static/image/icon-unSelect.png"
                  class="menuBox-item-box-menu-selectBox"
                  v-else
                />
              </div>
            </div>
          </div>
        </div>
      </view>
    </navigation-bar>
  </div>
</template>
<script>
import { starBarHeight, titleBarHeight } from "@/utils";
import navigationBar from "@/components/navigation-bar";
import service from "../../utils/service";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      customNav: {
        bgHeight: "auto",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      menus: [],
      userInfor: null,
      titleBarHeight: 0,
      statusBarHeight: 0,
      permissionsList: [],
    };
  },
  async created() {
    this.userInfor = uni.getStorageSync("updateUser");
    uni.removeStorageSync("updateUser");
    this.statusBarHeight = await starBarHeight();
    this.titleBarHeight = await titleBarHeight();
    this.queryManageMenus();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onChange(item) {
      item.checked = !item.checked;
      item.data.checked = !item.data.checked;
      this.saveMethod();
    },
    //查询菜单列表
    async queryManageMenus() {
      try {
        let data = await service.getStoreUserPermissions({
          storeId: uni.getStorageSync("storeId"),
          userId: this.userInfor.userId,
        });
        this.menus = data;
      } catch (e) {}
    },
    //保存设置
    async saveMethod() {
      try {
        await service.setUserStorePermissions({
          storeId: uni.getStorageSync("storeId"),
          userId: this.userInfor.userId,
          permissionsList: this.menus,
        });
      } catch (e) {}
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-fixedBg {
    @include fiexcenter;
    background: #f4f5f6;
    z-index: -1;
  }
  &-title {
    position: fixed;
    left: rpx(16);
    top: 13vh;
    font-size: rpx(26);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 30px;
  }
  &-memo {
    position: fixed;
    left: rpx(16);
    top: 17.5vh;
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
  }
}
.fixbg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
.menuBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 20.5vh;
  bottom: 0;
  overflow-y: scroll;
  @include ver;
  align-items: center;
  width: 100%;
  border-radius: 32rpx;
  padding-top: 20rpx;
  &-item {
    margin-bottom: 28rpx;
    width: calc(100vw - 64rpx);
    background: #ffffff;
    border-radius: 16rpx;
    @include ver;
    span {
      margin: 20rpx 0 0 28rpx;
      font-size: 30rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 36rpx;
    }
    &-box {
      padding-left: 20rpx;
      padding-bottom: 34rpx;
      &-menu {
        margin-top: rpx(7);
        padding-top: 30rpx;
        width: 22vw;
        display: inline-block;
        position: relative;
        &-info {
          width: 100%;
          height: 100%;
          @include ver;
          align-items: center;
          img {
            width: 76rpx;
            height: 76rpx;
          }
          span {
            margin-left: 0px !important;
            margin-top: 12rpx !important;
            font-size: 24rpx;
            font-family: Inter-Regular, Inter;
            font-weight: 400;
            color: #333333;
          }
        }
        &-selectBox {
          position: absolute;
          right: rpx(6);
          top: 0rpx;
          width: rpx(18);
          height: rpx(18);
        }
      }
    }
  }
}
</style>
