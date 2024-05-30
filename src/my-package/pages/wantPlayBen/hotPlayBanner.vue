<template>
  <view class="container">
    <!-- 剧本banner 部分 -->
    <view>
      <view class="bannerJb">
        <view class="box">
          <image class="left" :src="hotPlayBan.dramaCover" mode="aspectFill"></image>
          <view class="mindel">
            <view class="titletext">{{ hotPlayBan.dramaName }}</view>
            <view class="mvStyle">{{dictName(hotPlayBan.dramaThemeList)}}</view>
            <view class="wmcount">{{ hotPlayBan.maleGamerNum }}男{{
              hotPlayBan.femaleGamerNum
            }}女 {{hotPlayBan.gameTime}}小时</view>
            <view class="zuoze">
              <view>作者：</view>
              <view class="zuozheName">
                {{ authorName(hotPlayBan.authorItems) }}
              </view>
            </view>
            <view class="faxing">
              <view class="fxkey">发行：</view>
              <view class="fxvalue">
                {{ publisherName(hotPlayBan.publishers) }}
              </view>
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
        <view class="bottonBox" v-if="hotPlayBan.gatherCount > 0">
          <view class="number">{{
            hotPlayBan.gatherCount
          }}</view>
          <view class="pczhong">场拼局进行中</view>
          <image class="jiantou" src="@/static/image/jiantouicon.png"></image>
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
    dictName(){
      return function(dicts){
        let arr = dicts.map(v=>v.dictValue);
        return arr.join('&');
      }
    },
    authorName(){
      return function(authors){
        let arr = authors.map(v=>v.authorName);
        return arr.join('&');
      }
    },
    publisherName(){
      return function(publishers){
        let arr = publishers.map(v=>v.publisherName);
        return arr.join('&');
      }
    }
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin-bottom: 16rpx;
  background: #ffffff;
    border-radius: 18rpx;
    padding-bottom: 30rpx;
    width: 93.3vw;

  .bannerJb {
    
    .box {
      display: flex;
      position: relative;
    }

    .left {
      width: 168rpx;
      height: 224rpx;
      border-radius: 12rpx;
      margin: 30rpx 0rpx 0rpx 24rpx;
    }

    .rightLogo {
      width: 130rpx;
      height: 34rpx;
      position: absolute;
      top: 32rpx;
      right: 24rpx;
    }

    .mindel {
      display: flex;
      flex: 1;
      margin-left: 24rpx;
      flex-direction: column;
      margin-top: 28rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6572;
      .titletext {
        font-size: 32rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        margin-bottom: 14rpx;
        display: flex;
        width: 280rpx;
        @include text-overflow-line(1);
      }

      .mvStyle {
        margin-top: 6rpx;
      }

      .wmcount {
        margin-top: 6rpx;
      }

      .zuoze {
        margin-top: 6rpx;
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
        width: 300rpx;
        overflow-x: scroll;
        white-space: nowrap;

        .zuozheName {
          display: flex;
          justify-content: flex-start;
        }
      }

      .faxing {
        margin-top: 6rpx;
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
        width: 300rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        .fxvalue {}
      }
    }

    .bottonBox {
      width: 654rpx;
      height: 72rpx;
      background: #f5f6f8;
      border-radius: 12rpx;
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
        width: 30rpx;
      }

      .pczhong {
        margin-right: 12rpx;
      }
    }
  }
}
</style>
