<template>
  <view>
    <view class="contentBox" @click.stop="onGoStoreDetail">
      <!-- header部分 -->
      <view class="header">
        <image class="touxiang" :src="$filters.processLogo(preferred.storeLogo)" mode="aspectFill"/>
        <view class="head_text">{{ preferred.storeName }}</view>
        <view class="points">
          <view class="scode">{{
            preferred.evaluateItem.comprehensiveScore == null
            ? 0
            : preferred.evaluateItem.comprehensiveScore
          }}</view>
          <view class="fen">分</view>
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
          <view class="areaBox">
            <view class="area">{{ preferred.districtName || '' }}</view>
            <view class="shuxian"></view>
            <view v-if="distance(preferred.distance)">{{ distance(preferred.distance) }}</view>
          </view>
        </view>
      </view>
      <!-- 精选剧本 -->
      <view v-if="preferred.storeRecommendDramaList.length > 0">
        <view class="jxSCRIPT">精选剧本</view>
        <scroll-view scroll-x="true" class="bannerBox">
          <view class="jbbox" v-for="(item) in preferred.storeRecommendDramaList" :key="item.dramaId" @click.stop="onDramaDetail(item.dramaId)">
            <image :src="item.dramaCover" mode="aspectFill"></image>
          </view>
        </scroll-view>
      </view>
      <!-- botron部分 -->
      <view v-if="preferred.gatheringCount > 0">
        <view class="bottomBtn">
          <view class="number">{{
            preferred.gatheringCount == null ? 0 : preferred.gatheringCount
          }}</view>
          <view class="pczhong">场拼局进行中</view>
          <van-icon name="arrow" class="jiantou"/>
        </view>
        <view class="bottomBox"></view>
      </view>
      <image src="../../static/image/has-go.png" class="hasTag" v-if="preferred.userStoreGatheredCount > 0"/>
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
      tabIndex: 0
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
    addClickbox(index) {
      this.tabIndex = index;
      this.$parent.changeBeforPlay(index);
    },
    onGoStoreDetail(){
      uni.navigateTo({
        url: `/store-package/pages/index?storeId=${this.preferred.id}`
      })
    },
    onDramaDetail(id){
      uni.navigateTo({
        url: `/pageDetail/pages/pageDetail?id=${id}`
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.contentBox {
  width: 93.3vw;
  height: auto;
  background: #ffffff;
  border-radius: 18rpx;
  margin-bottom: 16rpx;
  padding-bottom: 30rpx;
  position: relative;
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
      width: 50%;
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
        margin-right: 12rpx;
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
    margin-top: 18rpx;
    margin-left: 24rpx;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-bottom: 30rpx;
    white-space: nowrap;

    .jbbox {
      width: 132rpx;
      height: 176rpx;
      border-radius: 12rpx;
      display: inline-block;
      margin-right: 10rpx;
      overflow: hidden;
    }
  }

  .bottomBtn {
    width: 654rpx;
    height: 72rpx;
    background: #f5f6f8;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    opacity: 1;
    margin-left: 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e323e;
    .jiantou {
      width: 16rpx;
      height: 20rpx;
      transform: translateY(2rpx);
    }

    .number {
      margin-right: 4rpx;
    }

    .pczhong {
      margin-right: 12rpx;
    }
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
