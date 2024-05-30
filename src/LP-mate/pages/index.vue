<template>
  <div class="container">
    <navigation-bar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          color="#fff"
          size="50rpx"
        />
      </view>
    </navigation-bar>
    <matchBox @match="onMatch" :userId="userInfo.id" :matchTime="matchTime" @show-require="onShowRequire"></matchBox>
    <ring :LpUserId="lpUserInfo.id"></ring>
    <van-popup
      :show="showPopup"
    >
      <div class="popBox">
        <image :src="$iconFont.getIconName('icon-uploading')" class="popBox-bg" v-if="lpUserInfo.lpMatchApplyStatus === 'WAIT_AUDIT'"></image>
        <image :src="$iconFont.getIconName('upload-fail')" class="popBox-bg" @click="onUpload" v-else-if="lpUserInfo.lpMatchApplyStatus === 'NO_PASS'" ></image>
        <image src="../static/image/icon-close.png" class="popBox-close" @click="backRoute"></image>
      </div>
    </van-popup>
    <van-popup :show="showRequire" position="right" @click-overlay="showRequire = false" close-on-click-overlay>
      <requirements @hide="showRequire = false" ref="requirements"></requirements>
    </van-popup>
    <van-popup :show="showMatchResult" position="center">
      <matchResult ref="matchResult" @refreshTime="getMatchingTime" :lpUserId="lpUserInfo.id" @hide="onHideMatch" @goFilter="onGoFilter"></matchResult>
    </van-popup>
    <van-popup :show="noMatchDialog" position="center" @click-overlay="noMatchDialog = false" close-on-click-overlay>
      <div class="noMatchDialog">
        <image src="../static/image/noneCount-note.png" class="noMatchDialog-bg" @click="onBuyCount"></image>
        <image src="../static/image/icon-close.png" class="noMatchDialog-close" @click="noMatchDialog = false"></image>
      </div>
    </van-popup>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import matchBox from "../components/match.vue";
import ring from "../components/ring-components/index.vue";
import requirements from "../components/matchingRequemts.vue";
import matchResult from "../components/matchResult.vue";
import { uploadFile } from "@/utils";
import service from "../utils/service";
export default {
  components: {
    navigationBar,
    matchBox,
    ring,
    requirements,
    matchResult
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "",
      },
      showPopup: false,
      showMatchResult: false,
      userInfo: null,
      lpUserInfo: {},
      matchTime: 0,
      showRequire: false,
      noMatchDialog: false
    };
  },
  async onShow(){
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.getMemberInfo();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onBuyCount(){
      this.noMatchDialog = false;
      uni.navigateTo({url: '/LP-mate/pages/match-count'})
    },
    onShowRequire(){
      this.showRequire = true;
      this.$nextTick(_=>{
        this.$refs['requirements'].refreshData();
      })
    },
    onGoFilter(){
      this.showMatchResult = false;
      this.onShowRequire();
    },
    onUpload(){
      let vm = this;
      uni.chooseMedia({
        count: 1,
        mediaType: ["image"],
        success: function (res) {
          uni.showLoading("上传中...");

          uploadFile(res.tempFiles[0].tempFilePath).then((e) => {
            vm.lpUserInfo.avatar = e;
            vm.save();
            uni.hideLoading();
          });
        },
      });
    },
    //查询会员信息
    async getMemberInfo() {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
      if(this.lpUserInfo.lpMatchApplyStatus !== 'PASS'){
        this.showPopup = true;
      }
      this.getMatchingTime();
      wx.hideLoading();
    },
    //保存信息
    async save() {
      await service.LpUserMessageSave({
        ...this.lpUserInfo,
        ...{avatar: this.lpUserInfo.avatar},
      });
      this.getMemberInfo();
    },
    async getMatchingTime(){
      this.matchTime = await service.remainingMatchingTimes({id: this.lpUserInfo.id});
    },
    onMatch(){
      if(this.matchTime > 0){
        this.showMatchResult = true;
        this.$nextTick(_=>{
          this.$refs['matchResult'].reload();
        })
      }else{
        this.noMatchDialog = true;
      }
    },
    onHideMatch(){
      this.showMatchResult = false;
      this.getMatchingTime();
    }
  },
};
</script>
<style>
.van-popup{
  background: unset !important;
}
</style>
<style lang="scss" scoped>
.container {
}
.popBox{
  position: relative;
  &-bg{
    width: 600rpx;
    height: 774rpx;
  }
  &-close{
    margin-top: 100rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 60rpx;
    height: 60rpx;
  }
}
.noMatchDialog{
  @include ver;
  align-items: center;
  &-bg{
    width: 508rpx;
    height: 366rpx;
  }
  &-close{
    margin-top: 152rpx;
    width: 60rpx;
    height: 60rpx;
  }
}
</style>   