<template>
  <view class="container">
    <!-- 剧本banner 部分 -->
    <view>
      <view class="bannerJb">
        <view class="box">
          <image class="left" :src="wangPlay.dramaCover" mode="aspectFill"></image>
          <view class="bage">
            <image v-if="wangPlay.sellType == 'EXCLUSIVE'" class="imageBox" :src="$iconFont.getIconName('EXCLUSIVE')"></image>
            <image v-else-if="wangPlay.sellType == 'LIMITED'" class="imageBox" :src="$iconFont.getIconName('LIMITED')"></image>
            <image v-else-if="wangPlay.sellType == 'REAL_SCENE'" class="imageBox" :src="$iconFont.getIconName('REAL_SCENE')"></image>
          </view>
          <view class="mindel">
            <view class="titletext">{{ wangPlay.dramaName }}</view>
            <view class="mvStyle">{{dictName}}</view>
            <view class="wmcount">{{ wangPlay.maleGamerNum }}男{{
              wangPlay.femaleGamerNum
            }}女</view>
            <view class="zuoze">
              作者：{{ authorName }}
            </view>
            <view class="faxing">
              发行：{{ publisherName }}
            </view>
          </view>
          <image v-if="wangPlay.evaluateLevel == 'GOOD_SCORE'" class="rightLogo" :src="$iconFont.getIconName('youzhijz')">
          </image>
          <image v-if="wangPlay.evaluateLevel == 'NOT_BAD_SCORE'" class="rightLogo"
            :src="$iconFont.getIconName('zhideyis')">
          </image>
          <image v-if="wangPlay.evaluateLevel == 'EXCELLENT_SCORE'" class="rightLogo"
            :src="$iconFont.getIconName('jybiwan')">
          </image>
          <image v-if="wangPlay.evaluateLevel == 'FULL_SCORE'" class="rightLogo" :src="$iconFont.getIconName('manfenzw')">
          </image>
          <image v-if="wangPlay.evaluateLevel == 'PASS_SCORE'" class="rightLogo" :src="$iconFont.getIconName('suipzaix')">
          </image>
        </view>
        <view class="bottonBox" v-if="wangPlay.gatherCount !== null">
          <view class="number">{{
            wangPlay.gatherCount == null ? "0" : wangPlay.gatherCount
          }}</view>
          <view class="pczhong">场拼局进行中</view>
          <image class="jiantou" src="../static/image/jiantouicon.png"></image>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    wangPlay: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    const vm = this;
    return {
      mvstylleList: [],
    };
  },
  computed:{
    dictName(){
      let arr = this.wangPlay.dicts.map(v=>v.dictValue);
      return arr.join(' ')
    },
    authorName(){
      let arr = this.wangPlay.authorItems.map(v=>v.authorName);
      return arr.join('&')
    },
    publisherName(){
      let arr = this.wangPlay.publishers.map(v=>v.publisherName);
      return arr.join('&')
    }
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
* {
  background: #f5f6f8;
}

.container {
  margin-top: 16rpx;
  padding-bottom: 40rpx;
  background: #ffffff;
  border-radius: 18rpx 18rpx 18rpx 18rpx;

  .bannerJb {
    width: 93.6vw;
    height: 100%;
    .box {
      display: flex;
      position: relative;
    }

    .left {
      width: 168rpx;
      height: 224rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      opacity: 1;
      margin: 30rpx 0rpx 0rpx 24rpx;
    }

    .rightLogo {
      position: absolute;
      right: 24rpx;
      top: 32rpx;
      width: 130rpx;
      height: 34rpx;
    }

    .mindel {
      margin-top: 28rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6572;
      width: 58vw;
      margin-left: 40rpx;
      .titletext {
        font-size: 32rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        margin-bottom: 14rpx;
        display: flex;
        justify-content: flex-start;
        @include text-overflow-line(1);
        width: 60%;
      }

      .mvStyle {
        margin-top: 6rpx;
        @include text-overflow-line(1);
      }

      .wmcount {
        margin-top: 6rpx;
      }

      .zuoze {
        margin-top: 6rpx;
        @include text-overflow-line(1);
      }

      .faxing {
        margin-top: 6rpx;
        @include text-overflow-line(1);
      }
    }

    .bottonBox {
      width: 86vw;
      height: 72rpx;
      background: #f5f6f8;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      margin-left: 24rpx;
      margin-top: 30rpx;

      .jiantou {
        width: 16rpx;
        height: 20rpx;
      }

      .number {
        margin-right: 4rpx;
      }

      .pczhong {
        margin-right: 12rpx;
      }
    }
  }
}
.bage {
      position: absolute;
      left: 124rpx;
      top: 30rpx;
    }

    .imageBox {
      width: 60rpx;
      height: 32rpx;
      margin-top: 8rpx;
      padding-right: 8rpx;
    }
</style>
