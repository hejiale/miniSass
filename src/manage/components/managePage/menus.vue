<template>
  <view>
    <scroll-view scroll-y class="content">
      <div class="content-menuBox">
        <div
          class="content-menuBox-item"
          v-for="(item, index) in menus"
          :key="index"
        >
          <span>{{ item.data.name }}</span>
          <div class="content-menuBox-item-box">
            <div
              class="content-menuBox-item-box-menu"
              v-for="(it, idx) in item.children"
              :key="idx"
              @click="onGoPage(it.data)"
            >
              <div class="content-menuBox-item-box-menu-info">
                <img :src="$iconFont.getIconName(it.data.icon)" alt="" />
                <span>{{ it.data.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
  </view>
</template>
<script>
import service from "../../utils/service"
export default {
  props:{
    merchantInfo:{
      type: Object,
      default(){
        return {}
      }
    }
  },
  components: {},
  data() {
    return {
      menus: [],
      shopInfo: {}, //店铺信息
    };
  },
  async created() {
    this.userInfor = await this.$checkLogin.getUserInfo();
    this.shopInfo = JSON.parse(uni.getStorageSync("shopInfo"));
    this.queryManageMenus();
  },
  methods: {
    //查询菜单列表
    async queryManageMenus() {
      try {
        let data = await service.getStoreUserFunctions({
          storeId: uni.getStorageSync("storeId"),
          userId: this.userInfor.id,
        });

        let index = data.findIndex((it) => it.data.name === "常用功能");
        if (index !== -1) {
          data.splice(index, 1);
          this.menus = data;
        } else {
          this.menus = data;
        }
      } catch (e) {}
    },
    async detailAction(item) {
      uni.navigateTo({
        url: item.url,
      });
    },
    async onGoPage(item) {
      if(item.path !== '--'){
        uni.navigateTo({
          url: item.path,
        });
      }else{
        if(item.name === '商户认证'){
          if(this.merchantInfo.platformApplyStatus){
            //需要区分是个人进件还是企业进件
            let store = JSON.parse(uni.getStorageSync('shopInfo'));
            if(this.merchantInfo.lianlianApplyType === 'BUSINESS'){
              uni.navigateTo({
                url: `/enterprise/pages/apply-detail?storeId=${store.id}&delta=${1}`,
              });
            }else{
              uni.navigateTo({
                url: `/individual/pages/apply-detail?storeId=${store.id}&delta=${1}`,
              });
            }
          }else{
            uni.navigateTo({
              url: `/incomingParts/pages/index`,
            });
          }
        }else{
          wx.showToast({
            icon:'none',
            title: '功能升级中'
          })
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  @include ver;
  width: 100%;
  align-items: center;
  height: 81vh;
  &-menuBox {
    z-index: 1;
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
          margin-top: 30rpx;
          width: 22vw;
          display: inline-block;
          position: relative;
          &-info {
            width: 100%;
            height: 100%;
            @include ver;
            align-items: center;
            img {
              width: rpx(38);
              height: rpx(38);
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
          &-bage {
            position: absolute;
            right: 6rpx;
            top: -10rpx;
          }
        }
      }
    }
  }
}
</style>
