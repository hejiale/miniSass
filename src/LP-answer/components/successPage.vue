<template>
    <view class="successPage" scroll-y>
        <div class="successPage-title">测试完成！</div>
        <div class="successPage-text">LovePotion心理老师将根据您的选择为您制定DISC沟通风格地图，并根据测试结果为您个性化安排剧场体验内容。</div>
        <div class="successPage-text">我们将在活动现场给到您测试结果。</div>
        <div class="successPage-sure" @click="onBack">确定</div>
    </view>
  </template>
  <script>
  export default {
      components:{
      },
      data(){
        return {
        }
      },
      methods:{
        onBack(){
          uni.reLaunch({url: '/lovepotion/pages/index'})
        }
      }
  };
  </script>
  <style lang="scss" scoped>
  .successPage {
    position: fixed;
    left: 4vw;
    top: 12vh;
    width: 92vw;
    height: 86vh;
    border-radius: 16rpx;
    background: rgba(255, 255, 255, 0.8);
    z-index: 1;
    padding: 0px 44rpx;
    box-sizing: border-box;
    &-title {
      font-weight: 500;
      font-size: 42rpx;
      color: #EF4D6F;
      line-height: 45rpx;
      margin-top: 10vh;
      width: 100%;
      text-align: center;
    }
    &-text{
        margin-top: 36rpx;
        font-size: 30rpx;
        color: #7E1A28;
    }
    &-sure{
        margin-left: 50%;
        margin-top: 40vh;
        transform: translateX(-50%);
        width: 303rpx;
        height: 59rpx;
        background: #EF4D6F;
        border-radius: 14rpx;
        font-size: 30rpx;
        color: #fff;
        @include hor-center-center;
    }
  }
  </style>