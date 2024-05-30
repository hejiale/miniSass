<template>
  <div class="container">
    <navigationBar :nav="customNav">
      <view slot="content">
        <img
          :src="$iconFont.getIconName('myStore-bg')"
          alt=""
          mode="widthFix"
          class="fixedBg"
        />
        <div class="container-content" v-if="endLoad">
          <image
            class="container-content-cover"
            src="../static/image/icon-invite-bg.png"
          />
          <image
            :src="$filters.processLogo(storeInfo.storeLogo)"
            class="container-content-logo"
            mode="aspectFill"
          />
          <div class="container-content-title">{{ storeInfo.storeName }}</div>
          <div class="container-content-address">
            <image
              src="../static/image/icon-address.png"
              class="container-content-address-tag"
            />
            <span>{{ storeInfo.address }}</span>
          </div>
          <div class="container-content-infoBox" v-if="isExpress">
            <image
              src="../static/image/icon-info-bg.png"
              class="container-content-infoBox-cover"
            />
            <div class="container-content-infoBox-title">
              <span>邀请你成为员工</span>
            </div>
            <image
              src="../static/image/icon-error.png"
              class="container-content-infoBox-error"
            />
            <div class="container-content-infoBox-unInvite">邀请已失效</div>
          </div>
          <div class="container-content-infoBox" v-else-if="isMember">
            <image
              src="../static/image/icon-info-bg.png"
              class="container-content-infoBox-cover"
            />
            <div class="container-content-infoBox-title">
              <span>您已接受邀请</span>
            </div>
            <image
              src="../static/image/icon-success.png"
              class="container-content-infoBox-error"
            />
            <div class="container-content-infoBox-invite" @click="onEnterStore">
              进入门店
            </div>
          </div>
          <div class="container-content-infoBox" v-else>
            <image
              src="../static/image/icon-info-bg.png"
              class="container-content-infoBox-cover"
            />
            <div class="container-content-infoBox-title">
              <image
                src="../static/image/icon-invite.png"
                class="container-content-infoBox-title-tag"
              />
              <span>邀请你成为员工</span>
            </div>
            <div class="container-content-infoBox-value1">接受邀请后:</div>
            <div class="container-content-infoBox-value2">
              - 获得你的公开信息（昵称、头像等）
            </div>
            <div class="container-content-infoBox-value3">
              - 你可以参与店铺经营
            </div>
            <div class="container-content-infoBox-invite" @click="applyStore">
              接受邀请
            </div>
            <BindPhone
              @on-success-authorize="onSuccessAuthorize"
              v-if="!userInfo.phone"
            ></BindPhone>
          </div>
        </div>
      </view>
    </navigationBar>
    <userDialog />
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar/index.vue";
import BindPhone from "@/components/bindPhone/index.vue";
import userDialog from "@/components/userDialog/index.vue";
import service from "../utils/service"
export default {
  components: { navigationBar, BindPhone, userDialog },
  data() {
    return {
      storeInfo: null,
      userInfo: null,
      customNav: {
        navTitle: "邀请",
        bgBackground: "#F4F5F6",
        bgHeight: "100vh",
      },
      endLoad: false,
      isExpress: false, //是否已过期
      isMember: false, //是否店铺成员
      linkId: null,
      doStatus: false,
      options: null,
    };
  },
  async onLoad(options) {
    this.options = options;
    this.linkId = options.linkId;

    uni.showLoading();
    //查询是否店铺成员
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.getStoreInfo(options.storeId);
    await this.queryUserIsMember();
    //校验分享链接
    let res = await service.checkStoreEmployeeInvite({
      id: options.linkId,
    });

    if (!this.isMember) {
      //已过期 或 已被绑定
      var time = new Date().getTime();
      if (res.invite || time - options.startTime >= options.totalTime) {
        this.isExpress = true;
      }
    }
    this.endLoad = true;
    uni.hideLoading();
  },
  methods: {
    onEnterStore() {
      uni.setStorageSync("storeId", this.storeInfo.id);

      wx.switchTab({
        url: "/pages/index/index",
      });
    },
    //授权成功后，重新获取用户信息
    async onSuccessAuthorize() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
      this.applyStore();
    },
    async applyStore() {
      if (this.doStatus) return;
      this.doStatus = true;
      //申请成店铺成员
      uni.showLoading({
        title: "申请中...",
      });
      //校验分享链接
      let data = await service.checkStoreEmployeeInvite({
        id: this.linkId,
      });
      //已被使用   是否超时
      var time = new Date().getTime();
      if (
        data.invite ||
        time - this.options.startTime >= this.options.totalTime
      ) {
        this.isExpress = true;
        this.doStatus = false;
        uni.hideLoading();
        return;
      }
      try {
        //提交申请
        await service.addStoreUserApply({
          linkId: this.linkId,
          storeId: this.storeInfo.id,
          userId: this.userInfo.id,
          storeUserType: this.options.userType
        });
        //自动审核通过
        uni.hideLoading();
        uni.showToast({
          title: "申请成功!",
        });
        let that = this;
        setTimeout(() => {
          uni.setStorageSync("storeId", that.storeInfo.id);

          wx.switchTab({
            url: "/pages/index/index",
          });
        }, 1000);
      } catch (e) {
        uni.hideLoading();
        this.doStatus = false;
      }
    },
    //查询店铺信息
    async getStoreInfo(storeId) {
      try {
        let res = await this.$api.getStoreHome({
          storeId,
          lng: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude"),
          userId: this.userInfo.id
        });
        this.storeInfo = res;
      } catch (e) {}
    },
    //判断是否店铺成员
    async queryUserIsMember() {
      try {
        let res = await this.$api.checkIsStoreUser({
          storeId: this.storeInfo.id,
          userId: this.userInfo.id,
        });
        this.isMember = res;
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  &-content {
    @include ver;
    align-items: center;
    margin: rpx(69) rpx(28);
    position: relative;
    z-index: 2;
    &-cover {
      @include abscenter;
      z-index: -1;
    }
    &-logo {
      width: rpx(100);
      height: rpx(100);
      border-radius: 59px;
      margin-top: rpx(26);
    }
    &-title {
      margin-top: rpx(16);
      font-size: rpx(16);
      line-height: 18px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    &-address {
      @include hor-center-center;
      margin-top: rpx(8);
      &-tag {
        width: rpx(16);
        height: rpx(16);
      }
      span {
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #444444;
        width: 50%;
        @include text-overflow-line(1);
      }
    }
    &-infoBox {
      width: 94%;
      padding-bottom: rpx(23);
      position: relative;
      margin-top: rpx(34);
      &-cover {
        @include abscenter;
        z-index: -1;
      }
      &-title {
        margin-top: rpx(22);
        @include hor-center-center;
        &-tag {
          width: rpx(18);
          height: rpx(18);
          transform: translateY(-2px);
        }
        span {
          margin-left: rpx(9);
          font-size: rpx(18);
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 26px;
          text-align: center;
        }
      }
      &-value1 {
        margin: rpx(24) 0 0 rpx(25);
        font-size: rpx(13);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 15px;
      }
      &-value2,
      &-value3 {
        font-size: rpx(13);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        line-height: 24px;
        margin-left: rpx(25);
      }
      &-value2 {
        margin-top: rpx(8);
      }
      &-invite {
        margin: rpx(31) rpx(25) 0 rpx(25);
        height: 44px;
        border-radius: 22px 22px 22px 22px;
        font-size: rpx(16);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        @include hor-center-center;
        line-height: 44px;
        background: #333;
      }
      &-unInvite {
        margin: rpx(31) rpx(25) 0 rpx(25);
        height: 44px;
        border-radius: 22px 22px 22px 22px;
        font-size: rpx(16);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        @include hor-center-center;
        line-height: 44px;
        background: #999;
      }
      &-error {
        margin-top: rpx(31);
        width: rpx(72);
        height: rpx(72);
        margin-left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
.fixedBg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: rpx(378);
  z-index: 1;
}
</style>