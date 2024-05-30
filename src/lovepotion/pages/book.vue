<template>
  <div class="container" v-if="show">
    <view
      class="navigationBar"
      @click="onBack"
      :style="{ 'padding-top': menuReact.top + 'px' }"
    >
      <image src="../static/image/round-back.png" class="backIcon"></image>
      <span class="navigationBar-title">加入会员</span>
    </view>
    <image :src="$iconFont.getIconName('lp-book-bg')" mode="widthFix"></image>
    <div class="container-content pt15 pb15" @click="onUpload">
      <span class="container-content-title">头像</span>
      <div class="container-content-right">
        <image
          :src="avatar"
          v-if="avatar"
          class="container-content-right-head mr6"
          mode="aspectFill"
        ></image>
        <image
          src="../static/image/upload-pics.png"
          class="container-content-right-upload mr6"
          v-else
        ></image>
        <van-icon name="arrow" color="#C6B3B8" size="10" />
      </div>
    </div>
    <div class="container-content pt20 pb20">
      <span class="container-content-title">姓名</span>
      <div class="container-content-right">
        <input
          placeholder="请输入您的姓名"
          placeholder-class="placeholderClass"
          class="container-content-right-input mr6"
          v-model="name"
          maxlength="10"
          @input="onInput"
        />
        <van-icon name="arrow" color="#C6B3B8" size="10" />
      </div>
    </div>
    <div class="container-content pt20 pb20" @click="showPicker = true">
      <span class="container-content-title">性别</span>
      <div class="container-content-right">
        <input
          placeholder="请选择您的性别"
          placeholder-class="placeholderClass"
          class="container-content-right-input mr6"
          v-model="sex"
          disabled
        />
        <van-icon name="arrow" color="#C6B3B8" size="10" />
      </div>
    </div>
    <div class="container-content pt20 pb20">
      <span class="container-content-title">手机号</span>
      <div class="container-content-right">
        <input
          type="number"
          placeholder="请输入手机号"
          placeholder-class="placeholderClass"
          class="container-content-right-input mr6"
          v-model="phone"
        />
        <van-icon name="arrow" color="#C6B3B8" size="10" />
      </div>
    </div>
    <div
      class="sureButton"
      :style="{ opacity: canSubmit ? '1' : '0.5' }"
      @click="onSubmit"
    >
      确认加入
      <BindPhone v-if="!userInfo.phone && canSubmit" @on-success-authorize="onRefreshUserInfo"></BindPhone>
    </div>
    <van-action-sheet
      :show="showPicker"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showPicker = false"
    >
      <van-picker
        :columns="columns"
        :show-toolbar="true"
        @cancel="showPicker = false"
        @confirm="onSureSex"
      />
    </van-action-sheet>
    <div class="popSuccessBox" v-if="showBack">
      <image :src="$iconFont.getIconName('lp-go-answer')" class="popSuccessBox-tag" v-if="isAnswer" @click="onGoAnswer"></image>
      <image :src="$iconFont.getIconName('icon-go-buy')" class="popSuccessBox-tag" v-else-if="isBuy" @click="onGoBuy"></image>
      <image :src="$iconFont.getIconName('lp-go-match')" class="popSuccessBox-tag" v-else-if="isMatch" @click="onGoMatch"></image>
      <image :src="$iconFont.getIconName('icon-book-back')" class="popSuccessBox-tag" v-else  @click="onBack"></image>
    </div>
  </div>
</template>
<script>
import {checkContent} from "@/utils/index"
import { getMenuButtonRect } from "@/utils/index";
import { uploadFile } from "@/utils";
import service from "../utils/service";
import BindPhone from "@/components/bindPhone/index.vue";
export default {
  components: {
    BindPhone
  },
  data() {
    return {
      menuReact: null,
      showPicker: false,
      columns: this.$enums.LP_SEX.list,
      avatar: null,
      sex: null,
      name: null,
      phone: null,
      userInfo: null,
      showBack: false,
      inviteUserId: null,
      isBuy: false,
      isAnswer: null,
      isMatch: false,
      show: false
    };
  },
  async onLoad(option) {
    this.menuReact = await getMenuButtonRect();
    this.userInfo = await this.$checkLogin.getUserInfo();

    if(option.isBuy){
      this.isBuy = true;
    }
    if(option.isMatch){
      this.isMatch = true;
    }
    if(option.scene){
      //是否填问卷
      if(option.scene.includes('isAnswer')){
        this.isAnswer = true;
        return await this.getUserIsWrite();
      }else{
        this.inviteUserId = option.scene;
      }
    }
    //是否填问卷
    if(option.isAnswer){
      this.isAnswer = option.isAnswer;
      return await this.getUserIsWrite();
    }

    if(option.userId){
      this.inviteUserId = option.userId;
    }
    this.show = true;
  },
  computed: {
    canSubmit() {
      return this.sex && this.avatar && this.name && this.phone;
    },
  },
  methods: {
    onBack() {
      if(getCurrentPages().length > 1){
        uni.navigateBack();
      }else{
        uni.reLaunch({url: '/lovepotion/pages/index'})
      }
    },
    onGoBuy(){
      uni.redirectTo({
        url: './buyMember'
      })
    },
    onGoAnswer(){
      uni.reLaunch({url: `/LP-answer/pages/index`})
    },
    onGoMatch(){
      uni.redirectTo({url: '/LP-mate/pages/index'});
    },
    async onRefreshUserInfo(){
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
    async onInput(e){
      try{
        await checkContent(e.detail.value)
      }catch(e){
        this.name = "";
      }
    },
    onUpload() {
      let vm = this;
      uni.chooseMedia({
        count: 1,
        mediaType: ["image"],
        success: function (res) {
          uni.showLoading("上传中...");

          uploadFile(res.tempFiles[0].tempFilePath).then((e) => {
            vm.avatar = e;
            uni.hideLoading();
          });
        },
      });
    },
    onSureSex(e) {
      console.log(e.detail.index);
      this.sex = e.detail.value.text;
      this.showPicker = false;
    },
    async onSubmit() {
      if (this.sex && this.avatar && this.name && this.phone) {
        if(!this.userInfo.phone)return;
        
        await service.LpUserMessageSave({
          userId: this.userInfo.id,
          sex: this.$enums.LP_SEX.getValue(this.sex),
          name: this.name,
          phone: this.phone,
          avatar: this.avatar,
          inviteUserId: this.inviteUserId
        });
        this.showBack = true;
      }
    },
    async getUserIsWrite(){
      try{
        wx.showLoading();

        let lpUser = await service.queryLpUserMessage({
          userId: this.userInfo.id,
        });
        //已注册的情况
        if(lpUser){
          let res = await service.getUserIsWrite({id: lpUser.id})

          if(!res.isWrite && res.questionnaireSeq){
            uni.reLaunch({url: `/LP-answer/pages/index?level=${res.questionnaireSeq}`})
          }
          if(!res.isWrite && !res.questionnaireSeq){
            uni.reLaunch({url: `/LP-answer/pages/index`})
          }
          if(res.isWrite){
            uni.reLaunch({url: `/LP-answer/pages/index?success=true`})
          }
          wx.hideLoading();
          return;
        }
        this.show = true;
        wx.hideLoading();
      }catch(e){}
    }
  },
};
</script>
<style>
.placeholderClass {
  font-size: 30rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: #c6b3b8;
}
</style>
<style lang="scss" scoped>
.container {
  background: #fff;
  height: 100vh;
  &-content {
    margin: 0px 40rpx;
    @include hor-between-center;
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #5e2433;
    border-bottom: 1px solid #ede1e4;
    &-right {
      @include hor;
      align-items: center;
      &-input {
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #775b62;
        text-align: right;
      }
      &-upload {
        width: 104rpx;
        height: 104rpx;
      }
      &-head {
        width: 104rpx;
        height: 104rpx;
        border-radius: 50%;
      }
    }
  }
}
.sureButton {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 68rpx;
  width: 92vw;
  height: 88rpx;
  font-size: 34rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  @include hor-center-center;
  background: linear-gradient(90deg, #e64dff 0%, #ff5383 100%);
  border-radius: 12px 12px 12px 12px;
}
.navigationBar {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  @include hor;
  align-items: center;
  .backIcon {
    width: 68rpx;
    height: 68rpx;
    padding-left: 32rpx;
  }
  &-title {
    margin-left: 200rpx;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #a5445c;
  }
}
.popSuccessBox {
  @include fiexcenter;
  z-index: 10;
  @include hor-center-center;
  background: rgba($color: #000000, $alpha: 0.5);
  &-tag{
    width: 560rpx;
    height: 440rpx;
    position: absolute;
    z-index: 1;
  }
}
</style>