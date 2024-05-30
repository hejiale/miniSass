<template>
  <div class="container">
    <div class="container-fixedBg"></div>
    <image
      :src="$iconFont.getIconName('bg-invite')"
      mode="widthFix"
      class="fixbg"
    />
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
        <div class="container-title">邀请店员</div>
        <div class="container-memo">
          发送邀请链接加入店铺（链接有效时间为30分钟）一条链接仅可有以为人员被加入，人员权限可在邀请成功后自由添加。
        </div>
        <div class="menus">
          <div class="container-menusBox" @click="onSelectType('SHOP_DIRECTOR')">
            <div class="container-menusBox-img">
              <image :src="$iconFont.getIconName(menus[0])" mode="widthFix" />
              <button
                class="container-menusBox-send"
                open-type="share"
              ></button>
            </div>
          </div>
          <div class="container-menusBox" @click="onSelectType('EMPLOYEE')">
            <div class="container-menusBox-img">
              <image :src="$iconFont.getIconName(menus[1])" mode="widthFix" />
              <button
                class="container-menusBox-send"
                open-type="share"
              ></button>
            </div>
          </div>
        </div>
        <div class="container-menusBox bottom" @click="onSelectType('DM')">
          <div class="container-menusBox-img">
            <image :src="$iconFont.getIconName(menus[2])" mode="widthFix" />
            <button class="container-menusBox-send" open-type="share"></button>
          </div>
        </div>
      </view>
    </navigation-bar>
  </div>
</template>
<script>
import { starBarHeight, titleBarHeight } from "@/utils";
import navigationBar from "@/components/navigation-bar";
import service from '../utils/service';
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
      userInfor: null,
      titleBarHeight: 0,
      statusBarHeight: 0,
      menus: ["invite-shopDirector", "invite-employee", "invite-dm"],
      inviteType: null
    };
  },
  async created() {
    this.statusBarHeight = await starBarHeight();
    this.titleBarHeight = await titleBarHeight();
    this.userInfor = await this.$checkLogin.getUserInfo();
  },
  async onShareAppMessage() {
    let store = JSON.parse(uni.getStorageSync("shopInfo"));
    let res = await service.addStoreEmployeeInvite({});

    return {
      title: `邀请你成为${this.$enums.StoreEmployeeType.getName(this.inviteType)}`,
      path: `/inviteAddidtant/pages/index?storeId=${
        store.id
      }&startTime=${new Date().getTime()}&totalTime=${1800000}&linkId=${
        res.id
      }&userType=${this.inviteType}`,
      imageUrl: this.$filters.processLogo(store.storeLogo),
    };
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onSelectType(type){
      this.inviteType = type
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  @include ver;
  &-fixedBg {
    @include fiexcenter;
    background: #f4f5f6;
    z-index: -1;
  }
  &-title {
    margin-left: rpx(30);
    margin-top: 16px;
    font-size: rpx(26);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 30px;
  }
  &-memo {
    margin-left: rpx(30);
    margin-top: 6px;
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    width: rpx(175);
  }
  .menus {
    @include hor;
    align-items: center;
  }
  &-menusBox {
    &-img {
      width: 50vw;
      position: relative;
      image {
        width: 100%;
        height: 100%;
      }
    }
    &-send {
      @include abscenter;
    }
    button {
      background: unset !important;
    }
    button::after {
      border: none !important;
    }
  }
  .bottom{
    margin-top: -70rpx;
  }
}
.fixbg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
}
</style>
