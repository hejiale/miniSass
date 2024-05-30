<template>
  <view class="container">
    <!-- 剧本banner 部分 -->
    <view>
      <view class="bannerJb">
        <view class="box">
          <image class="left" :src="hotPlayBan.dramaCover" mode="aspectFill"></image>
          <view class="bage">
            <image v-if="hotPlayBan.sellType == 'EXCLUSIVE'" class="imageBox" :src="$iconFont.getIconName('EXCLUSIVE')"></image>
            <image v-else-if="hotPlayBan.sellType == 'LIMITED'" class="imageBox" :src="$iconFont.getIconName('LIMITED')"></image>
            <image v-else-if="hotPlayBan.sellType == 'REAL_SCENE'" class="imageBox" :src="$iconFont.getIconName('REAL_SCENE')"></image>
          </view>
          <view class="mindel">
            <view class="titletext">{{ hotPlayBan.dramaName }}</view>
            <view class="mvStyle">
              <view class="text" v-for="(item, index) in hotPlayBan.dramaThemeList" :key="index">
                {{ item.dictValue }}
              </view>
            </view>
            <view style="display:flex">
              <view class="wmcount">{{ hotPlayBan.maleGamerNum }}男{{
                hotPlayBan.femaleGamerNum
              }}女</view>
              <view class="hotPlayHour">{{ hotPlayBan.gameTime }}小时</view>
            </view>
            <view class="zuoze">
              作者：{{ authorName }}
            </view>
            <view class="faxing">
              发行：{{ publisherName }}
            </view>
          </view>
          <image v-if="hotPlayBan.evaluateLevel == 'GOOD_SCORE'" class="rightLogo"
            :src="$iconFont.getIconName('youzhijz')">
          </image>
          <image v-if="hotPlayBan.evaluateLevel == 'NOT_BAD_SCORE'" class="rightLogo"
            :src="$iconFont.getIconName('zhideyis')">
          </image>
          <image v-if="hotPlayBan.evaluateLevel == 'EXCELLENT_SCORE'" class="rightLogo"
            :src="$iconFont.getIconName('jybiwan')">
          </image>
          <image v-if="hotPlayBan.evaluateLevel == 'FULL_SCORE'" class="rightLogo"
            :src="$iconFont.getIconName('manfenzw')">
          </image>
          <image v-if="hotPlayBan.evaluateLevel == 'PASS_SCORE'" class="rightLogo"
            :src="$iconFont.getIconName('suipzaix')">
          </image>
        </view>
        <view class="bottonBox" v-if="hotPlayBan.gatherCount">
          <view class="number">{{
            hotPlayBan.gatherCount == null ? "0" : hotPlayBan.gatherCount
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
    hotPlayBan: {
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
    authorName(){
      let arr =  this.hotPlayBan.authorItems.map(v=>v.authorName);
      return arr.join('&');
    },
    publisherName(){
      let arr =  this.hotPlayBan.publishers.map(v=>v.publisherName);
      return arr.join('&');
    }
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
* {
  background: #f5f6f8;
}

.container {
  margin-top: 16rpx;
  border-radius: 18rpx 18rpx 18rpx 18rpx;
  overflow: hidden;
  .bannerJb {
    // width: 702rpx;
    height: 100%;
    background: #ffffff;
    padding-bottom: 20rpx;
    .box {
      display: flex;
      // justify-content: space-between;
      position: relative;
    }

    .left {
      width: 168rpx;
      height: 224rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      opacity: 1;
      //   background-color: #36e4bb;
      margin: 30rpx 0rpx 0rpx 24rpx;
    }

    .rightLogo {
      width: 130rpx;
      height: 34rpx;
      position: absolute;
      right: 24rpx;
      top: 32rpx;
    }

    .mindel {
      margin-top: 28rpx;
      margin-left: 24rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6572;

      //   margin-left: -30rpx;
      .titletext {
        font-size: 32rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        margin-bottom: 14rpx;
        display: flex;
        justify-content: flex-start;
        width: 40vw;
        @include text-overflow-line(1);
      }

      .mvStyle {
        margin-top: 6rpx;
        display: flex;
        width: 164rpx;
        overflow: hidden;
        text-overflow: ellipsis;

        .text {
          white-space: nowrap;
          margin-right: 8rpx;
        }
      }

      .wmcount {
        margin-top: 6rpx;
      }

      .hotPlayHour {
        margin-left: 12rpx;
        margin-top: 6rpx;
      }

      .zuoze {
        margin-top: 6rpx;
        display: flex;
        width: 300rpx;
        @include text-overflow-line(1);
      }

      .faxing {
        margin-top: 6rpx;
        display: flex;
        width: 300rpx;
        @include text-overflow-line(1);
      }
    }

    .bottonBox {
      // width: 654rpx;
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
      margin: 30rpx 24rpx 0px 24rpx;

      .jiantou {
        width: 16rpx;
        height: 20rpx;
      }

      .number {
        margin-right: 4rpx;
        width: 30rpx;
      }

      .pczhong {
        margin-right: 12rpx;
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
}
</style>
