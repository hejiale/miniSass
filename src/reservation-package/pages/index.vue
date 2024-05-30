<template>
  <div class="container">
    <image
      :src="$iconFont.getIconName('reservation-bg')"
      class="container-bg"
      mode="aspectFill"
    ></image>
    <div class="container-content">
      <image
        :src="$iconFont.getIconName('reservation-logo')"
        class="container-content-logo"
      ></image>
      <image
        :src="$iconFont.getIconName('reservation-scanCode')"
        class="container-content-scanCode"
        show-menu-by-longpress
      ></image>
      <div class="container-content-topInputBox" v-if="!showSuccess">
        <span>姓名</span>
        <div class="container-content-topInputBox-input">
          <input
            placeholder="请输入您的姓名"
            placeholder-style="color: rgba(126, 26, 40, 0.5)"
            maxlength="20"
            v-model="name"
          />
        </div>
      </div>
      <div class="container-content-inputBox" v-if="!showSuccess">
        <span>手机号</span>
        <div class="container-content-topInputBox-input">
          <input
            placeholder="请输入您的手机号"
            placeholder-style="color: rgba(126, 26, 40, 0.5)"
            maxlength="20"
            type="number"
            v-model="phone"
          />
        </div>
      </div>
      <div class="container-content-inputSexBox" v-if="!showSuccess">
        <span>性别</span>
        <div class="container-content-inputSexBox-male" :class="{active: sex === 'MALE'}" @click="sex = 'MALE'">男</div>
        <div class="container-content-inputSexBox-female" :class="{active: sex === 'FEMALE'}" @click="sex = 'FEMALE'">女</div>
      </div>
      <div
        class="container-content-submitButton"
        :class="!canSubmit ? 'unActive' : ''"
        @click="onSubmit"
        v-if="!showSuccess"
      >
        提交报名信息
      </div>
      <span class="container-content-phone" @click="onCopy"
        >18913252295【复制】</span
      >
      <span class="container-content-note">LovePotion沉浸式互动剧场报名</span>
      <span class="container-content-topTitle">客服信息：</span>
      <span class="container-content-title">客服微信：</span>
      <image
        src="../static/image/reservation-success.png"
        class="container-content-successBox"
        v-if="showSuccess"
      ></image>
    </div>
    <div style="height: 10vh"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showSuccess: false,
      name: "",
      phone: "",
      sex: 'MALE'
    };
  },
  computed: {
    canSubmit() {
      return this.name.length && this.phone.length;
    },
  },
  methods: {
    onCopy() {
      uni.setClipboardData({
        data: "18913252295",
        success: () =>
          uni.showToast({
            title: "手机号已复制",
          }),
      });
    },
    async onSubmit() {
      if (this.name.length && this.phone.length) {
        try {
          await this.$api.addReservation({
            name: this.name,
            phone: this.phone,
            sex: this.sex
          });
          this.showSuccess = true;
        } catch (e) {}
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-bg {
    @include fiexcenter;
  }
  &-content {
    margin: 12.2vh 26rpx 0px 26rpx;
    position: relative;
    width: 93vw;
    height: 90vh;
    border-radius: 32rpx;
    background: rgba(255, 255, 255, 0.8);
    @include ver;
    align-items: center;
    &-logo {
      margin-top: 1vh;
      width: 34vw;
      height: 34vw;
    }
    &-title,
    &-topTitle {
      position: absolute;
      left: 9vw;
      font-family: Source Han Sans;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 0em;
      font-feature-settings: "kern" on;
      color: #7e1a28;
    }
    &-title {
      bottom: 21vh;
    }
    &-topTitle {
      bottom: 27vh;
    }
    &-scanCode {
      position: absolute;
      bottom: 6.7vh;
      width: 34vw;
      height: 16vh;
    }
    &-note {
      position: absolute;
      bottom: 2vh;
      font-family: Source Han Sans;
      font-size: 28rpx;
      font-weight: bold;
      font-feature-settings: "kern" on;
      color: #7e1a28;
    }
    &-phone {
      position: absolute;
      bottom: 27vh;
      font-family: 思源黑体;
      font-size: 28rpx;
      letter-spacing: 0em;
      font-feature-settings: "kern" on;
      color: #7e1a28;
    }
    &-inputBox,
    &-topInputBox,
    &-inputSexBox{
      position: absolute;
      width: 80.93vw;
      height: 124rpx;
      border-radius: 16rpx;
      background: #ffffff;
      @include hor;
      align-items: center;
      span {
        margin-left: 34rpx;
        font-family: Source Han Sans;
        font-size: 14px;
        font-weight: bold;
        font-feature-settings: "kern" on;
        color: #7e1a28;
        width: 88rpx;
        text-align: right;
      }
      &-input {
        margin-left: 24rpx;
        width: 55vw;
        height: 72rpx;
        border-radius: 8px;
        background: #ffebeb;
        @include hor;
        align-items: center;
        padding-left: 30rpx;
        input {
          font-family: 思源黑体;
          font-size: 28rpx;
          font-feature-settings: "kern" on;
          color: #7e1a28;
        }
      }
    }
    &-topInputBox {
      top: 17vh;
    }
    &-inputBox {
      top: 28vh;
    }
    &-inputSexBox{
      top: 39vh;
      &-male,&-female{
        width: 72rpx;
        height: 72rpx;
        border: 1px solid #ffebeb;
        @include hor-center-center;
        font-size: 14px;
        color: #7e1a28;
        margin-left: 24rpx;
        border-radius: 8px;
        box-sizing: border-box;
      }
      &-female{
        margin-left: 68rpx;
      }
      .active{
        background: #ffebeb;
      }
    }
    &-submitButton {
      position: absolute;
      top: 51vh;
      width: 80vw;
      height: 94rpx;
      border-radius: 8px;
      background: #ef4d6f;
      @include hor-center-center;
      font-family: Source Han Sans;
      font-size: 14px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0.42em;
      font-feature-settings: "kern" on;
      color: rgba(255, 255, 255, 0.8);
    }
    .unActive {
      background: #d0a3ac;
    }
    &-successBox {
      position: absolute;
      top: 25vh;
      width: 80vw;
      height: 18.4vh;
      z-index: 100;
    }
  }
}
</style>