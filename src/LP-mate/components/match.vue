<template>
    <div class="matchBox">
      <image
        src="../static/image/my-infomation.png"
        class="matchBox-fixInfo"
        @click="onGoPersonal"
      ></image>
      <image
        src="../static/image/match-requirements.png"
        class="matchBox-fixRequire"
        @click="onShowRequirement"
      ></image>
      <image
        :src="$iconFont.getIconName('match-record')"
        class="matchBox-fixRecord"
        @click="onGoRecord"
      ></image>
      <image
        :src="$iconFont.getIconName('get-count')"
        class="matchBox-fixCount"
        @click="onGoMatchCount"
      ></image>
      <div class="matchBox-fixStart" @click="onGoMatch">
        <image
        :src="$iconFont.getIconName('start-match')"
        ></image>
        <div class="matchBox-fixStart-countBox">剩余匹配次数：{{ matchTime }}次</div>
      </div>
    </div>
  </template>
  <script>
  export default {
    props:{
      userId: {
        type: String,
        default: null
      },
      matchTime: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
      };
    },
    methods: {
      onGoPersonal(){
        uni.navigateTo({url: `/lovepotion/pages/personal/index`})
      },
      onGoMatchCount(){
        uni.navigateTo({url: '/LP-mate/pages/match-count'})
      },
      onShowRequirement(){
        this.$emit('show-require');
      },
      onGoMatch(){
        this.$emit('match');
      },
      onGoRecord(){
        uni.navigateTo({url: '/LP-mate/pages/matchRecord'})
      }
    },
  };
  </script>
  <style lang="scss" scoped>
  .matchBox {
    &-fixInfo {
      position: fixed;
      right: 0px;
      top: 216rpx;
      width: 148rpx;
      height: 62rpx;
      z-index: 1;
    }
    &-fixRequire {
      position: fixed;
      right: 0px;
      top: 318rpx;
      width: 148rpx;
      height: 62rpx;
      z-index: 1;
    }
    &-fixRecord {
      position: fixed;
      left: 0px;
      bottom: 74rpx;
      width: 180rpx;
      height: 180rpx;
      z-index: 1;
    }
    &-fixCount {
      position: fixed;
      right: 0px;
      bottom: 74rpx;
      width: 180rpx;
      height: 180rpx;
      z-index: 1;
    }
    &-fixStart {
      position: fixed;
      left: 182rpx;
      bottom: 68rpx;
      width: 386rpx;
      height: 126rpx;
      z-index: 1;
      @include ver;
      align-items: center;
      &-countBox{
        position: absolute;
        bottom: 14rpx;
        padding: 0px 26rpx;
        height: 30rpx;
        background: rgba(255,255,255,0.2);
        box-shadow: 0rpx 2rpx 5rpx 0rpx rgba(0,0,0,0.09);
        border-radius: 15rpx;
        @include hor-center-center;
        font-weight: 500;
        font-size: 18rpx;
        color: #FFFFFF;
      }
    }
  }
  </style>   