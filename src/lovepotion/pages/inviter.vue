<template>
  <div class="container">
    <div class="container-inviteCodeBox">
      <span class="container-inviteCodeBox-value">{{ userInfo.juyouId }}</span>
    </div>
    <div class="container-inviteLinkBox">
      <button class="container-inviteLinkBox-button" open-type="share"></button>
      <image
        src="../static/image/button-invite.png"
        class="container-inviteLinkBox-invite"
      ></image>
    </div>
    <div class="container-inviteBannerBox">
      <image
        src="../static/image/icon-my-qrcode.png"
        class="container-inviteBannerBox-bg"
        mode="widthFix"
      ></image>
      <image :src="posterImg" class="container-inviteBannerBox-poster"></image>
      <div class="container-inviteBannerBox-save">
        <image src="../static/image/button-saveCode.png"></image>
        <album :posterImg="posterImg"></album>
      </div>
    </div>
    <div class="container-recordBox">
      <div class="container-recordBox-title">邀请记录</div>
      <div class="container-recordBox-item" v-for="i in recordList" :key="i">
        <div class="container-recordBox-item-top">
          <span>{{ i.createdTime }}</span>
          <span>{{ $filters.judgePhone(i.phone) }}</span>
        </div>
        <div class="container-recordBox-item-bottom">
          <div class="container-recordBox-item-bottom-avatarBox">
            <image
              :src="i.avatar"
              class="container-recordBox-item-bottom-avatarBox-head"
            ></image>
            <image
              src="../static/image/male.png"
              class="container-recordBox-item-bottom-avatarBox-sex"
              v-if="i.sex === 'MALE'"
            ></image>
            <image
              src="../static/image/female.png"
              class="container-recordBox-item-bottom-avatarBox-sex"
              v-if="i.sex === 'FEMALE'"
            ></image>
          </div>
          <div class="container-recordBox-item-bottom-infoBox" @click="onSeeRecord(i)">
            <div class="container-recordBox-item-bottom-infoBox-nameBox">
              <span class="container-recordBox-item-bottom-infoBox-nameBox-name">{{ i.name }}</span>
              <div
                class="container-recordBox-item-bottom-infoBox-nameBox-bottom"
                v-if="i.lpMembershipPackageId"
              >
                <image src="../static/image/icon-membership.png" class="container-recordBox-item-bottom-infoBox-nameBox-bottom-tag"></image>
                <span class="container-recordBox-item-bottom-infoBox-nameBox-bottom-title">{{ i.lpMembershipPackageName }}</span>
              </div>
              <div v-else class="container-recordBox-item-bottom-infoBox-nameBox-none">未开通服务</div>
            </div>
            <div class="container-recordBox-item-bottom-infoBox-right">会员记录
              <van-icon
                name="arrow"
                style="color: #FD5887"
                size="26rpx"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="container-recordBox-noMore" v-if="recordList.length > 0">
        ~全部加载完了~
      </div>
      <image
        src="../static/image/noRecord.png"
        class="noData"
        v-if="!recordList.length"
      ></image>
    </div>
    <wxml-to-canvas
      class="widget"
      :width="canvasWidth"
      :height="canvasHeight"
    ></wxml-to-canvas>
  </div>
</template>
<script>
const { wxml, style } = require("./poster/inviteData.js");
import service from "../utils/service.js";
import album from "@/components/requireAuth/photosAlbum.vue";
export default {
  components: {
    album,
  },
  data() {
    return {
      recordList: [],
      canvasWidth: 207, // 默认canvas宽高
      canvasHeight: 301,
      widget: null,
      posterImg: null,
      userInfo: null,
      sunCode: null,
      lpUserInfo: null,
    };
  },
  onShareAppMessage() {
    return {
      title: "和我一起来探索LovePotion吧！",
      path: `/lovepotion/pages/book?userId=${this.userInfo.id}`,
      imageUrl: this.$iconFont.getIconName("lp-share"),
    };
  },
  async onLoad() {
    wx.hideShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
    wx.showLoading();

    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.getMyInviteList();

    // 获取设备信息
    wx.getSystemInfo({
      success: async (res) => {
        await this.querySunCode();
        await this.getMemberInfo();

        this.canvasWidth = 207;
        this.canvasHeight = 301;

        // 数字容器宽度 动态设置
        setTimeout(() => {
          this.widget = this.selectComponent(".widget");
          this.renderToCanvas();
        }, 1000);
      },
    });
  },
  methods: {
    // wxml 转 canvas
    async renderToCanvas() {
      let _wxml = wxml(this.sunCode, this.lpUserInfo);

      const _style = style(this.canvasWidth, this.canvasHeight);

      const p1 = this.widget.renderToCanvas({ wxml: _wxml, style: _style });

      p1.then((result) => {
        const p2 = this.widget.canvasToTempFilePath();
        p2.then((result) => {
          this.posterImg = result.tempFilePath;
          wx.hideLoading();
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    async querySunCode() {
      let res = await service.sunCodeGenerate({
        page: "lovepotion/pages/book",
        userId: this.userInfo.id,
        versionType: "TRIAL",
      });
      this.sunCode = res.data;
    },
    async getMemberInfo() {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
    },
    async getMyInviteList() {
      let res = await service.getMyInviteList({ userId: this.userInfo.id });
      this.recordList = res || [];
    },
    onSeeRecord(e){
      uni.setStorageSync('inviter', e);
      uni.navigateTo({url: './recordPage'})
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-inviteCodeBox {
    background: url("../static/image/icon-invite-code.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 686rpx;
    height: 88rpx;
    margin: 50rpx 0px 0px 32rpx;
    position: relative;
    @include hor;
    align-items: center;
    &-value {
      position: absolute;
      right: 34rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 26rpx;
      color: #2e323e;
    }
  }
  &-inviteLinkBox {
    background: url("../static/image/icon-invite-link.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 686rpx;
    height: 88rpx;
    margin: 36rpx 0px 0px 32rpx;
    position: relative;
    &-invite {
      position: absolute;
      top: 14rpx;
      right: 16rpx;
      width: 178rpx;
      height: 62rpx;
    }
    &-button {
      position: absolute;
      top: 14rpx;
      right: 16rpx;
      width: 178rpx;
      height: 62rpx;
      background: unset !important;
      z-index: 1;
    }
    button {
      border: unset !important;
    }
  }
  &-inviteBannerBox {
    position: relative;
    @include ver;
    align-items: center;
    width: 686rpx;
    height: 836rpx;
    margin: 36rpx 0px 0px 32rpx;
    background: #f9f9f9;
    border-radius: 24rpx;
    &-bg {
      width: 100%;
    }
    &-poster {
      width: 414rpx;
      height: 602rpx;
    }
    &-save {
      position: absolute;
      bottom: 40rpx;
      width: 178rpx;
      height: 62rpx;
    }
  }
  &-recordBox {
    width: 100vw;
    background: linear-gradient(180deg, #ffffff 0%, #f5f9fb 15%);
    &-title {
      margin: 60rpx 0px 0px 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #5f6572;
      line-height: 30rpx;
      padding-bottom: 24rpx;
    }
    &-item {
      position: relative;
      margin: 18rpx 16rpx 0px 16rpx;
      padding: 26rpx;
      background: #ffffff;
      border-radius: 18rpx 18rpx 18rpx 18rpx;
      @include ver;
      &-top {
        @include hor-between-center;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #959aa5;
        line-height: 28rpx;
      }
      &-bottom {
        @include hor;
        align-items: center;
        margin-top: 24rpx;
        &-avatarBox {
          position: relative;
          &-head {
            width: 76rpx;
            height: 76rpx;
            border-radius: 50%;
          }
          &-sex {
            width: 32rpx;
            height: 32rpx;
            position: absolute;
            right: 0px;
            bottom: 0px;
          }
        }
        &-infoBox{
          margin-left: 18rpx;
          @include hor-between-center;
          flex: 1;
          &-nameBox{
            @include ver;
            &-name{
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              font-size: 26rpx;
              color: #2E323E;
              line-height: 30rpx;
            }
            &-bottom {
              min-width: 120rpx;
              padding-right: 10rpx;
              background: linear-gradient( 90deg, #E07B98 0%, #FF5485 100%);
              border-radius: 16rpx;
              border: 1rpx solid rgba(255,255,255,0.5);
              box-sizing: border-box;
              margin-top: 6rpx;
              height: 32rpx;
              display: flex;
              align-items: center;
              &-tag{
                width: 32rpx;
                height: 32rpx;
              }
              &-title{
                margin-left: 8rpx;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 22rpx;
                color: #FFFFFF;
              }
            }
            &-none{
              margin-top: 6rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 22rpx;
              color: #959aa5;
              line-height: 26rpx;
            }
          }
          &-right{
            @include hor;
            align-items: center;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #FD5887;
            line-height: 28rpx;
          }
        }
      }
    }
    &-noMore {
      @include hor-center-center;
      width: 100vw;
      height: 100rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #959aa5;
      line-height: 28rpx;
    }
  }
  .noData {
    width: 202rpx;
    height: 48rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 10vh;
    padding-bottom: 30vh;
  }
}
.widget {
  position: absolute;
  top: -10000px;
  left: 20px;
  width: 294px;
  height: 554px;
}
</style>