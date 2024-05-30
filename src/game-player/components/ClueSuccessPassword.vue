<template>
  <div class="passwordBox" @click="onClose">
    <span class="passwordBox-title">解谜成功!</span>
    <span class="passwordBox-note">恭喜{{roleName}}</span>
    <div
      class="passwordBox-inputBox"
      v-if="inputNum === 4"
      :style="[
        {
          'background-image': `url(${$iconFont.getIconName(
            'password-border'
          )})`,
        },
      ]"
    >
      <div
        class="passwordBox-inputBox-border"
        v-for="idx in inputNum"
        :key="idx"
        :style="[
          { 'margin-right': idx === inputNum - 1 ? '0px' : '' },
          {
            'background-image': `url(${$iconFont.getIconName('input-border')})`,
          },
        ]"
      >
        {{ password[idx] || "" }}
      </div>
    </div>
    <div
      class="passwordBox-inputMoreBox"
      v-else
      :style="[
        {
          'background-image': `url(${$iconFont.getIconName(
            'password-border'
          )})`,
        },
      ]"
    >
      <div
        class="passwordBox-inputMoreBox-moreBorder"
        v-for="idx in inputNum"
        :key="idx"
        :style="[
          { 'margin-right': idx === inputNum - 1 ? '0px' : '5px' },
          { 'width': inputNum === 5 ? '6.5vw' : '5.4vw' },
          {
            'background-image': `url(${$iconFont.getIconName('input-border')})`,
          },
        ]"
      >
        {{ password[idx] || "" }}
      </div>
    </div>
    <image class="passwordBox-successGif" :src="jigsawGif" />
    <image class="passwordBox-closeBox" src="../static/icon-close.png" />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props:{
    roleName:{
      type: String,
      default: ""
    }
  },
  data() {
    return {
      inputNum: 0,
      password: [],
      jigsawGif: null,
    };
  },
  computed: {
    ...mapState("player", [
      "userInfo",
      "userRole",
      "passwordInfo",
    ]),
  },
  created() {
    this.inputNum = this.passwordInfo.password.length;
    this.password = this.passwordInfo.password.split('');
    this.downloadGif();
  },
  methods: {
    onClose() {
      this.$emit("hide");
    },
    //预下载gif图
    downloadGif() {
      wx.downloadFile({
        url: this.$iconFont.getIconName("jigsaw-gif"),
        success: (res) => {
          this.jigsawGif = res.tempFilePath;
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.passwordBox {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background: rgba($color: #000000, $alpha: 0.8);
  &-title {
    position: absolute;
    top: 43px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #feeaa8;
    line-height: 18px;
  }
  &-note {
    position: absolute;
    top: 66px;
    left: 50%;
    width: 200px;
    transform: translateX(-50%);
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 13px;
    text-align: center;
  }
  &-inputBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 34vh;
    width: 40vw;
    height: 40vh;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    @include hor-center-center;
    &-border {
      width: 7vw;
      height: 23.7vh;
      margin-right: 14px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @include hor-center-center;
      font-size: 64px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2b3030;
      text-shadow: 0px 1px 2px #000000;
    }
  }
  &-inputMoreBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 34vh;
    width: 40vw;
    height: 40vh;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    @include hor-center-center;
    &-moreBorder {
      height: 22.6vh;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @include hor-center-center;
      font-size: 64px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2b3030;
      text-shadow: 0px 1px 2px #000000;
    }
  }
  &-closeBox {
    position: absolute;
    bottom: 44px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 17px;
  }
  &-successGif {
    @include fiexcenter;
  }
}
</style>