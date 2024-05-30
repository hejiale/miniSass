<template>
  <div class="container">
    <navigation-bar :nav="customNav">
      <view slot="left" class="leftBar">
        <div class="backIcon">
          <van-icon
          name="arrow-left"
          @click="backRoute"
          style="color: #fff"
          size="50rpx"
        />
        </div>
        <div class="shareIcon">
          <button open-type="share"></button>
          <image src="../static/image/icon-share.png"></image>
        </div>
      </view>
    </navigation-bar>
    <image
      class="container-bg"
      :src="$iconFont.getIconName('love-answer-bg')"
      mode="aspectFill"
    ></image>
    <successPage v-if="isSuccess"></successPage>
    <openAnswerPage :level="level" v-else-if="isOpen && !isSuccess" @finish="onFinish"></openAnswerPage>
    <guidePage @open="onOpenAnswer" v-else></guidePage>
  </div>
</template>
<script>
import guidePage from "../components/guide.vue";
import openAnswerPage from "../components/open-answer.vue";
import navigationBar from "../../components/navigation-bar";
import successPage from "../components/successPage.vue";
export default {
  components: {
    guidePage,
    navigationBar,
    openAnswerPage,
    successPage
  },
  data() {
    return {
      customNav: {
        navTitle: "LovePotion",
        color: "#fff",
        hideBg: true,
        customizeLeft: true,
      },
      isOpen: false,
      isSuccess: false,
      level: 1
    };
  },
  onShareAppMessage() {
    return {
      title: "LovePotion",
      imageUrl: '../static/image/share-bg.png',
      path: `/lovepotion/pages/book?isAnswer=${true}`,
    };
  },
  onLoad(option){
    if(option.level){
      this.level = option.level;
      this.isOpen = true;
      this.isSuccess = false;
    }
    if(option.success){
      this.isSuccess = true;
    }

    wx.showShareMenu({
      menus: ["shareAppMessage"],
      success: () => {
      },
    });
  },
  methods: {
    backRoute() {
      uni.reLaunch({url: '/lovepotion/pages/index'})
    },
    onOpenAnswer(){
      this.isOpen = true;
    },
    onFinish(){
      this.isSuccess = true;
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-bg {
    @include fiexcenter;
    z-index: -1;
  }
}
.leftBar{
  @include hor;
  align-items: center;
}
.backIcon{
  padding: 0px 10rpx;
}
.shareIcon{
  width: 44rpx;
  height: 44rpx;
  padding: 0px 10rpx;
  background: unset !important;
  position: relative;
}
button{
  @include abscenter;
  background: unset !important;
}
button::after{
  border: unset !important;
}
</style>