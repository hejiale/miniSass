<template>
  <view class="container">
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left" @click="backRoute" class="container-backBox">
        <image src="/static/image/icon-store.png" />
      </view>
      <div slot="content">
        <div class="container-content">
          <homePage :merchantInfo="merchantInfo" v-show="tabIndex === 0" @on-show-invite="showInvite = true" ref="homePage"/>
          <menusPage :merchantInfo="merchantInfo" v-show="tabIndex === 1" @on-show-invite="showInvite = true" ref="menusPage" />
        </div>
      </div>
    </navigationBar>
    <div class="container-tabBar">
      <div
        class="container-tabBar-tab"
        v-for="(item, index) in tabMenus"
        :key="item.name"
        @click="onChangeTab(index)"
      >
        <image
          class="container-tabBar-tab-icon"
          :src="tabIndex === index ? item.img : item.unImg"
        />
        <span
          class="container-tabBar-tab-title"
          :class="tabIndex === index ? 'selectColor' : ''"
          >{{ item.name }}</span
        >
      </div>
    </div>
    <div class="container-popContact">
      <button open-type="contact">
        <image :src="$iconFont.getIconName('icon-contact')" />
      </button>
    </div>
  </view>
</template>
<script>
import homePage from "../components/managePage/index.vue";
import menusPage from "../components/managePage/menus.vue";
import navigationBar from "../../components/navigation-bar/index.vue";
import service from "../utils/service"
export default {
  components: {
    menusPage,
    homePage,
    navigationBar,
  },
  data() {
    const vm = this;
    return {
      tabMenus: [
        {
          name: "领本",
          unImg: "../static/image/unSelect-home.png",
          img: "../static/image/select-home.png",
        },
        {
          name: "功能",
          unImg: "../static/image/unSelect-ability.png",
          img: "../static/image/select-ability.png",
        },
      ],
      tabIndex: 0,
      customNav: {
        bgHeight: "30vh",
        customizeLeft: true,
        customizeTitle: true,
        bg: vm.$iconFont.getIconName("icon-takeAway-bg")
      },
      userInfor: null,
      merchantInfo: null
    };
  },
  onLoad(){
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow(){
    //获取商户信息
    this.queryMerchantData();
    if(this.tabIndex === 0){
      this.$nextTick(_=>{
        this.$refs.homePage.queryStoreManageCount();
      })
    }
  },
  //分享邀请
  async onShareAppMessage() {
    let store = JSON.parse(uni.getStorageSync("shopInfo"));
    let res = await service.addStoreEmployeeInvite({});

    return {
      title: "邀请你成为员工",
      path: `/inviteAddidtant/pages/index?storeId=${
        store.storeId
      }&startTime=${new Date().getTime()}&totalTime=${1800000}&linkId=${
        res.id
      }`,
      imageUrl: this.$filters.processLogo(store.storeLogo),
    };
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 1) {
        this.customNav.bg = this.$iconFont.getIconName("manage-bg");
        this.customNav.bgHeight = "100vh";
      } else {
        this.customNav.bg = this.$iconFont.getIconName("icon-takeAway-bg");
        this.customNav.bgHeight = "30vh";
      }
    },
  },
  methods: {
    backRoute() {
      this.isBack = true;
      wx.reLaunch({
        url: "/pages/index/index",
      });
    },
    onChangeTab(index) {
      this.tabIndex = index;
    },
    async queryMerchantData(){
      try{
        let res = await service.getMerchantBase({storeId: uni.getStorageSync("storeId")})
        this.merchantInfo = res;
      }catch(e){}
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  &-backBox {
    @include hor;
    align-items: center;
    image {
      width: rpx(124);
      height: rpx(28);
      margin-left: rpx(6);
    }
  }
  &-content {
    padding-bottom: 130rpx;
    padding-top: rpx(5);
  }
  &-tabBar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 138rpx;
    background: #fff;
    @include hor;
    z-index: 1;
    &-tab {
      flex: 1;
      @include ver;
      align-items: center;
      &-icon {
        width: 24px;
        height: 24px;
        margin-top: 10px;
      }
      &-title {
        margin-top: 8rpx;
        font-size: 20rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #cccccc;
        line-height: 28rpx;
      }
      .selectColor {
        color: #14c9c9;
      }
    }
  }
  &-popContact {
    position: fixed;
    right: 0;
    bottom: 32vh;
    width: rpx(60);
    height: rpx(60);
    button {
      background: unset !important;
      padding: 0px !important;
      height: 100%;
    }
    button::after {
      border: none !important;
    }
    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
