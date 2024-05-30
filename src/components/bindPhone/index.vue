<template>
  <div>
    <div class="authorizeButton" @click.stop="onAuthorize"></div>
    <van-action-sheet
      :show="sureAuthorizePhone"
      :safe-area-inset-bottom="false"
      z-index="1000"
    >
      <view class="phone-popup" :style="{ 'padding-bottom': paddingBottom }">
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
          <div class="mp-bottomBtn black phone-popup__btn">
            <div class="mp-bottomBtn__unAgreeBox" v-if="!isAgree" @click="onNote"></div>
            <button
              open-type="getPhoneNumber"
              @getphonenumber="getPhoneNumber"
            >
              <!-- <van-icon name="wechat" class="mr8" size="40rpx" /> -->
              <span>授权手机号码</span>
            </button>
          </div>
          <view class="phone-popup__bottom">
            <van-checkbox :value="isAgree" @change="onChange">同意</van-checkbox>
            <span
              >授权登录即表示已阅读并同意
              <span class="protocol" @click="readProtocol"
                >《用户协议》</span
              ></span
            >
          </view>
        </view>
      </view>
    </van-action-sheet>
    <van-action-sheet
      :show="sureAuthorizeName"
      :safe-area-inset-bottom="false"
      z-index="1000"
    >
      <view class="name-popup" :style="{ 'padding-bottom': paddingBottom }">
        <view class="name-popup__box">
          <span class="name-popup__box-title">获取您的昵称和头像</span>
          <span class="name-popup__box-note"
            >为了方便让朋友们识别您的身份，请授权您的头像和昵称</span
          >
          <van-cell
            custom-class="name-popup__box_cell"
            style="margin: 40rpx 40rpx 0 40rpx"
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
          <van-cell custom-class="name-popup__box_cell" style="margin: 0 40rpx">
            <template #title>
              <span class="name-popup__box_cell_left">昵称</span>
            </template>
            <input v-model="inputValue" placeholder="请输入昵称" maxlength="32" />
          </van-cell>
        </view>
        <div class="name-popup-memo">昵称限1-32个字符，一个汉字为2个字符</div>
        <div class="name-popup-bottomBox" v-if="canReject">
          <div class="name-popup-bottomBox-reject" @click="onReject">拒绝</div>
          <div class="name-popup-bottomBox-allow" @click="onSubmit">允许</div>
        </div>
        <div class="name-popup-bottomBox" v-else>
          <div class="name-popup-bottomBox-allowOnly" @click="onSubmit">允许</div>
        </div>
      </view>
    </van-action-sheet>
  </div>
</template>
<script>
import { uploadFile } from "@/utils";
import VanActionSheet from "@/wxcomponents/vant/action-sheet/index";
import VanIcon from "@/wxcomponents/vant/icon/index";
import VanCell from "@/wxcomponents/vant/cell/index";
export default {
  components: { VanActionSheet, VanIcon, VanCell },
  props: {
    paddingBottom: {
      type: String,
      default: "40rpx",
    },
    canReject:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sureAuthorizePhone: false,
      sureAuthorizeName: false,
      isComplete: false,
      uploadData: null,
      inputValue: null,
      userInfo: null,
      isAgree: false
    };
  },
  methods: {
    onNote(){
      uni.showToast({
        title: '请确保已阅读用户协议',
        icon: 'none'
      })
    },
    onChange(e){
      this.isAgree = e.detail;
    },
    onNote(){
      uni.showToast({
        title: '请勾选同意用户协议',
        icon: 'none'
      })
    },
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
        let res = await this.$api.mpBindPhone({
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
          dataSource: 'SAAS_MP'
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

      uploadFile(url).then(e=>{
        this.uploadData = e;
        wx.hideLoading();
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.phone-popup {
  @include hor-center-center;
  margin-top: rpx(47);
  &__box {
    text-align: center;
  }
  &__title {
    @include text-weight($font-larger);
    font-weight: bold;
    font-size: 40rpx;
    color: #363434;
  }
  &__instruction {
    color: $grey;
    font-size: 24rpx;
    color: #666;
  }
  &__btn {
    position: relative;
    bottom: 0;
    margin-top: rpx(28);
  }
  &__bottom {
    @include hor-center-center;
    margin-top: rpx(10);
    padding-bottom: 80rpx;
    font-size: 24rpx;
    color: #666;
    .protocol {
      color: #98b9cf;
      vertical-align: baseline !important;
    }
  }
  .mp-bottomBtn {
    @include hor-center-center;
    width: rpx(275);
    height: rpx(48);
    border-radius: rpx(40);
    font-size: $font-large;
    color: #fff;
    background-color: $black;
    box-shadow: 0 rpx(8) rpx(9) 0 rgba(128, 128, 128, 0.25);
    button{
      background: unset !important;
      color: #fff !important;
    }
    &__unAgreeBox{
      @include abscenter;
      z-index: 10;
    }
  }
  &__noteBox {
    margin-top: 40rpx;
    &-item {
      @include hor;
      align-items: center;
      margin-top: 12rpx;
      margin-left: 10%;
      span {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}
.name-popup {
  @include ver;
  &__box {
    @include ver;
    &-title {
      @include text-weight($font-larger);
      font-weight: bold;
      font-size: 30rpx;
      color: #363434;
      margin: 60rpx 0 0 60rpx;
    }
    &-note {
      font-size: 20rpx;
      color: #999;
      margin: 20rpx 0 0 60rpx;
    }
    &_cell {
      margin-left: 60rpx;
      &_left {
        font-size: 26rpx;
        color: #999;
        position: relative;
        &_photo-image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 80rpx;
        }
        &-button {
          @include abscenter;
          background: unset !important;
        }
      }
      input {
        font-weight: 400;
      }
    }
  }
  &-memo {
    font-size: 20rpx;
    margin: 16rpx 0 0 60rpx;
    color: #999;
  }
  &-bottomBox {
    margin-top: 80rpx;
    @include hor-center-center;
    &-reject {
      width: 35%;
      height: 80rpx;
      @include hor-center-center;
      color: #fff;
      background: #ccc;
      border-radius: 80rpx;
      font-size: 26rpx;
      font-weight: 400;
    }
    &-allow {
      margin-left: 10%;
      width: 35%;
      height: 80rpx;
      @include hor-center-center;
      color: #fff;
      background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
      border-radius: 80rpx;
      font-size: 26rpx;
      font-weight: 400;
    }
    &-allowOnly{
      width: 80%;
      height: 80rpx;
      @include hor-center-center;
      color: #fff;
      background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
      border-radius: 80rpx;
      font-size: 26rpx;
      font-weight: 400;
    }
  }
}
.authorizeButton {
  @include abscenter;
  z-index: 10;
}
// .cancelButton {
//   padding: 50rpx;
//   font-size: 24rpx;
//   color: #999;
// }
button::after {
  border: none !important;
}
</style>
