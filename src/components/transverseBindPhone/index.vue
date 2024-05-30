<template>
  <div style="z-index: 10">
    <div class="authorizeButton" @click.stop="onAuthorize"></div>
    <view
      class="phone-popup"
      :style="{ 'padding-bottom': paddingBottom }"
      v-if="sureAuthorizePhone"
    >
      <view class="phone-popup__box">
        <view class="phone-popup__title mb12">欢迎登录剧游宝～</view>
        <view class="phone-popup__instruction">登录后享受更好的服务体验</view>
        <div class="phone-popup__noteBox">
          <div class="phone-popup__noteBox-item">
            <span>● 获取您的手机号（获取您的账户信息）</span>
            <van-icon
              name="success"
              size="32rpx"
              color="#999999"
              v-if="isComplete"
            />
          </div>
        </div>
        <button
          class="mp-bottomBtn black phone-popup__btn"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          <van-icon name="wechat" class="mr8" size="20rpx" />
          <span>授权手机号码</span>
        </button>
        <view class="phone-popup__bottom">
          <span
            >授权登录即表示已阅读并同意
            <span class="protocol" @click="readProtocol"
              >《用户协议》</span
            ></span
          >
        </view>
      </view>
    </view>
    <view
      class="name-popup"
      :style="{ 'padding-bottom': paddingBottom }"
      v-if="sureAuthorizeName"
    >
      <view class="name-popup__box">
        <span class="name-popup__box-title">获取您的昵称和头像</span>
        <span class="name-popup__box-note"
          >为了方便让朋友们识别您的身份，请授权您的头像和昵称</span
        >
        <van-cell
          custom-class="name-popup__box_cell"
          style="margin: 20rpx 20rpx 0 20rpx"
        >
          <template #title>
            <span class="name-popup__box_cell_left">头像</span>
          </template>
          <img
            :src="uploadData || '/static/image/icon_default-head.png'"
            class="name-popup__box_cell_left_photo-image"
            mode="aspectFill"
          />
          <button
            open-type="chooseAvatar"
            @chooseavatar="chooseavatar"
            class="name-popup__box_cell_left-button"
          ></button>
        </van-cell>
        <van-cell custom-class="name-popup__box_cell" style="margin: 0 20rpx">
          <template #title>
            <span class="name-popup__box_cell_left">昵称</span>
          </template>
          <input v-model="inputValue" placeholder="请输入昵称" />
        </van-cell>
        <div class="name-popup__box-memo">
          昵称限1-32个字符，一个汉字为2个字符
        </div>
        <div class="name-popup__box-bottomBox">
          <div class="name-popup__box-bottomBox-reject" @click="onReject">
            拒绝
          </div>
          <div class="name-popup__box-bottomBox-allow" @click="onSubmit">
            允许
          </div>
        </div>
      </view>
    </view>
  </div>
</template>
<script>
import { uploadFile } from "@/utils";
import VanPopup from "@/wxcomponents/vant/popup/index";
import VanIcon from "@/wxcomponents/vant/icon/index";
import VanCell from "@/wxcomponents/vant/cell/index";
export default {
  components: { VanPopup, VanIcon, VanCell },
  props: {
    paddingBottom: {
      type: String,
      default: "20rpx",
    },
  },
  data() {
    return {
      sureAuthorizePhone: false,
      sureAuthorizeName: false,
      isComplete: false,
      uploadData: null,
      inputValue: null,
      userInfo: null,
    };
  },
  methods: {
    onInput(e) {
      this.inputValue = e.detail.value;
    },
    async onAuthorize() {
      let data = await this.$checkLogin.getUserInfo();
      this.uploadData = data.avatar;
      this.inputValue = data.nickName;
      this.userInfo = data;

      this.$emit("on-show-authorize", true);
      this.sureAuthorizeName = true;
    },
    //暂不授权
    onReject() {
      this.$emit("on-show-authorize", false);
      this.sureAuthorizeName = false;
    },
    //授权手机号
    async getPhoneNumber(e) {
      if (!e.detail.code) {
        uni.showToast({
          title: "授权失败，请重试！",
          icon: "none",
        });
        return;
      }
      wx.showLoading({
        title: "授权中...",
      });

      try {
        let res= await this.$api.mpBindPhone({
          code: e.detail.code,
          userId: this.userInfo.id,
        });

        this.isComplete = true;
        this.sureAuthorizePhone = false;
        //重置token
        uni.setStorageSync('SID', JSON.stringify(res.saTokenInfo))
        this.$emit("on-success-authorize");
        this.$emit("on-show-authorize", false);

        uni.showToast({
          title: "授权成功！",
          icon: "none",
        });
      } catch (e) {
        uni.showToast({
          title: "授权失败，请重试！",
          icon: "none",
        });
      }
    },
    //授权个人信息
    chooseavatar(e) {
      this.uploadFile(e.detail.avatarUrl);
    },
    //保存昵称头像
    async onSubmit() {
      if (!this.uploadData) {
        uni.showToast({
          title: "请上传头像！",
          icon: "none",
        });
        return;
      }
      if (!this.inputValue) {
        uni.showToast({
          title: "请填写昵称！",
          icon: "none",
        });
        return;
      }
      try {
        await this.$api.updateUserWxMessage({
          avatar: this.uploadData /*昵称*/,
          nickName: this.inputValue /*头像*/,
          id: this.userInfo.id,
        });
        wx.showToast({
          title: "授权信息成功！",
        });
        let that = this;
        setTimeout(() => {
          that.sureAuthorizeName = false;
          that.sureAuthorizePhone = true;
        }, 1000);
      } catch (e) {}
    },
    readProtocol() {
      uni.navigateTo({
        url: "/my-package/pages/agreeIndex",
      });
    },
    uploadFile(url) {
      uni.showLoading({ title: "上传中" });

      uploadFile(url).then((e) => {
        this.uploadData = e;
        wx.hideLoading();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.phone-popup {
  @include hor-center-center;
  @include fiexcenter;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.2);
  &__box {
    @include ver;
    width: 300px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
    width: 40%;
    height: 80%;
    background: #fff;
    padding: 0 20px;
  }
  &__title {
    margin-top: 20rpx;
    @include text-weight($font-larger);
    font-weight: bold;
    font-size: 20rpx;
    color: #363434;
  }
  &__instruction {
    color: $grey;
    font-size: 12rpx;
    color: #666;
  }
  &__btn {
    position: relative;
    bottom: 0;
    margin-top: 14rpx;
  }
  &__bottom {
    @include hor-center-center;
    margin-top: 10rpx;
    padding-bottom: 40rpx;
    font-size: 12rpx;
    color: #666;
    .protocol {
      color: #98b9cf;
      vertical-align: baseline !important;
    }
  }
  .mp-bottomBtn {
    @include hor-center-center;
    width: 60%;
    height: 30rpx;
    border-radius: rpx(40);
    font-size: 10rpx;
    color: #fff;
    background-color: $black;
    box-shadow: 0 rpx(8) rpx(9) 0 rgba(128, 128, 128, 0.25);
    margin-bottom: 0;
  }
  &__noteBox {
    margin-top: 20rpx;
    &-item {
      @include hor;
      align-items: center;
      margin-top: 6rpx;
      margin-left: 10%;
      span {
        font-size: 12rpx;
        color: #666;
      }
    }
  }
}
.name-popup {
  @include fiexcenter;
  @include ver;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
  &__box {
    @include ver;
    width: 300px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
    width: 40%;
    height: 80%;
    background: #fff;
    border-radius: 10px;
    &-title {
      @include text-weight($font-larger);
      font-weight: bold;
      font-size: 15rpx;
      color: #363434;
      margin: 10px 0 0 10px;
    }
    &-note {
      font-size: 10rpx;
      color: #999;
      margin: 10rpx 0 0 30rpx;
    }
    &_cell {
      margin-left: 30rpx;
      &_left {
        font-size: 13rpx;
        color: #999;
        position: relative;
        &_photo-image {
          width: 20rpx;
          height: 20rpx;
          border-radius: 80rpx;
        }
        &-button {
          @include abscenter;
          background: unset !important;
        }
      }
      input {
        font-weight: 400;
        font-size: 12rpx;
      }
    }
    &-memo {
      font-size: 10rpx;
      margin: 8rpx 0 0 30rpx;
      color: #999;
    }
    &-bottomBox {
      margin-top: 40rpx;
      @include hor-center-center;
      &-reject {
        width: 35%;
        height: 40rpx;
        @include hor-center-center;
        color: #fff;
        background: #ccc;
        border-radius: 80rpx;
        font-size: 13rpx;
        font-weight: 400;
      }
      &-allow {
        margin-left: 10%;
        width: 35%;
        height: 40rpx;
        @include hor-center-center;
        color: #fff;
        background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
        border-radius: 80rpx;
        font-size: 13rpx;
        font-weight: 400;
      }
    }
  }
}
.authorizeButton {
  @include abscenter;
}
button::after {
  border: none !important;
}
</style>
