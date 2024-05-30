<template>
  <!-- 导航栏 -->
  <view class="contentBox" @scroll="scrollEventFn">
    <!-- header部分 -->
    <view class="header">
      <image class="touxiang" :src="$filters.processLogo(preferred.storeLogo)" />
      <view class="head_text">{{ preferred.storeName }}</view>
      <view class="points">
        <view :class="preferred.evaluateItem.comprehensiveScore > 0 ? 'scode' : 'fen'">{{
            preferred.evaluateItem.comprehensiveScore > 0
                ? preferred.evaluateItem.comprehensiveScore
                : '暂无评'
          }}</view>
        <view class="fen" style="margin-right: 12rpx">分</view>
        <view class="renqi">人气值</view>
        <view class="rqscode">{{ preferred.explosiveCount }}</view>
      </view>
      <view class="haveBeenTo">
        <view class="beento">
          <view class="number">{{
            preferred.evaluateItem.recentTo == null ? 0 : preferred.evaluateItem.recentTo
          }}</view>
          <view class="been">人近期去过</view>
        </view>
        <view>
          <view class="areaBox">
            <view class="area">{{ preferred.districtName || '' }}</view>
            <view class="shuxian" v-if="distance(preferred.distance)"></view>
            <view v-if="distance(preferred.distance)">{{ distance(preferred.distance) }}</view>
          </view>
        </view>

      </view>
      <image src="../static/image/has-go.png" class="hasTag" v-if="preferred.userStoreGatheredCount > 0"/>

    </view>
    <!-- 精选剧本 -->
    <view v-if="preferred.storeRecommendDramaList.length > 0">
      <view class="jxSCRIPT">精选剧本</view>
      <scroll-view scroll-x="true" class="bannerBox">
        <view class="jbbox" v-for="(item, index) in preferred.storeRecommendDramaList" :key="index">
          <image :src="item.dramaCover" mode="aspectFill"></image>
          <image v-if="item.sellType == 'EXCLUSIVE'" class="logoimage" :src="$iconFont.getIconName('EXCLUSIVE')"></image>
          <image v-else-if="item.sellType == 'LIMITED'" class="logoimage" :src="$iconFont.getIconName('LIMITED')"></image>
          <image v-else-if="item.sellType == 'REAL_SCENE'" class="logoimage" :src="$iconFont.getIconName('REAL_SCENE')">
          </image>
        </view>
      </scroll-view>
    </view>
    <!-- botron部分 -->
    <view v-if="preferred.gatheringCount !== null">
      <view class="bottomBtn">
        <view class="number">{{
          preferred.gatheringCount == null ? 0 : preferred.gatheringCount
        }}</view>
        <view class="pczhong">场拼局进行中</view>
        <image class="jiantou" src="../static/image/jiantouicon.png"></image>
      </view>
      <view class="bottomBox"></view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    preferred: {
      type: Object,
      default() {
        return null;
      },
    }
  },
  data() {
    return {
    };
  },
  computed: {
    distance() {
      return function (item) {
        if(uni.getStorageSync('isLocation')){
          if (item) {
            return (item / 1000).toFixed(2) + "km";
          } else {
            return "0km";
          }
        }
        return null;
      };
    },
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.contentBox {
  // width: 93.6vw;
  height: auto;
  background: #ffffff;
  border-radius: 18rpx 18rpx 18rpx 18rpx;
  overflow: hidden;
  margin-top: 16rpx;

  .header {
    display: flex;
    justify-content: space-between;
    position: relative;

    .touxiang {
      width: 136rpx;
      height: 136rpx;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      opacity: 1;
      margin: 30rpx 24rpx 18rpx 24rpx;
      //   background-color: pink;
    }

    .head_text {
      position: absolute;
      left: 184rpx;
      top: 30rpx;
      font-size: 32rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2e323e;
      width: 314rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .points {
      position: absolute;
      left: 184rpx;
      top: 88rpx;
      display: flex;
      justify-content: space-between;

      .scode {
        margin-right: 4rpx;
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff7a00;
      }

      .fen {
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
      }

      .renqi {
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        margin-right: 4rpx;
      }

      .rqscode {
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff7a00;
      }
    }

    .haveBeenTo {
      display: flex;
      justify-content: space-between;
      width: 70%;
      position: absolute;
      left: 184rpx;
      top: 130rpx;

      .beento {
        display: flex;
        justify-content: space-between;

        .number {
          font-size: 26rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff7a00;
        }

        .been {
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          // margin-right: 160rpx;
        }
      }

      .areaBox {
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        align-items: center;

        .area {
          width: 100%;
          margin-right: 12rpx;
        }

        .shuxian {
          width: 2rpx;
          height: 22rpx;
          background: #d9d9d9;
          margin-right: 12rpx;
        }
      }
    }
  }

  .jxSCRIPT {
    font-size: 26rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e323e;
    // position: absolute;
    left: 18rpx;
    // top: 182rpx;
    margin-left: 18rpx;
    margin-top: 0rpx;
  }

  .bannerBox {
    width: 93%;
    height: 176rpx;
    // position: absolute;
    // left: 24rpx;
    // top: 236rpx;
    margin-top: 18rpx;
    margin-left: 24rpx;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-bottom: 30rpx;
    // background-color: #d9d9d9;
    white-space: nowrap;

    .jbbox {
      width: 132rpx;
      height: 176rpx;
      border-radius: 12rpx;
      display: inline-block;
      margin-right: 10rpx;
      position: relative;
      overflow: hidden;

      .logoimage {
        height: 32rpx;
        width: 60rpx;
        background-color: pink;
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        z-index: 10;
      }
    }
  }

  .bottomBtn {
    // width: 654rpx;
    height: 72rpx;
    background: #f5f6f8;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    opacity: 1;
    margin: 0px 24rpx 22rpx 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e323e;
    // background-color: #36e4bb;

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

  .bottomBox {
    height: 10rpx;
    width: 100%;
  }

  .hasTag{
    position: absolute;
    top: 0;
    right: 0;
    width: 136rpx;
    height: 136rpx;
    z-index: 2;
  }
}
</style>
