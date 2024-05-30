<template>
<div class="bg">
  <div class="shop-item">
    <img class="shop-avatar" :src="$filters.processLogo(detailstore.storeDoorstep)" alt />

    <!-- 右侧店铺信息 -->
    <div class="shop-info">
      <p class="name">{{$filters.truncateText(detailstore.storeName,8)}}</p>

      <div class="score-popularity">
        <div>
          <span class="scoreno" v-if="detailstore.evaluateItem.comprehensiveScore == null">暂无评分</span>
          <span class="score" v-if="detailstore.evaluateItem.comprehensiveScore != null">{{detailstore.evaluateItem.comprehensiveScore}}分</span>
          <span>人气值{{detailstore.explosiveCount}}</span>
        </div>

    <div class="area-distance">{{ detailstore.districtName || '' }}{{ distance }}</div>
      </div>
      <div class="playing" v-if="detailstore.gatheringCount != null">
        <img class="icon" :src="$iconFont.getIconName('zudui')" alt />
        {{detailstore.gatheringCount}}场剧本组局进行中
      </div>
      <div class="price">
        ￥{{detailstore.defaultDramaPrice / 100}}/位
        <span class="time-play" v-if="detailstore.evaluateItem.recentTo != null">{{detailstore.evaluateItem.recentTo}}人近期去过</span>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    detailstore: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  computed:{
    distance(){
      if(uni.getStorageSync('isLocation')){
        return ` | ${(this.detailstore.distance / 1000).toFixed(1)}km`
      }
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
.bg{
  // margin-top: 20rpx;
  background: #fafafaFF;
  width: 100%;
  display: flex;
  // height: 256rpx;
  justify-content: center;

 
.shop-item {
  margin-top: 16rpx;
  // margin: 16rpx 0;
  //  &:first-of-type{
  //    margin: 20rpx 0;
  // }
  width: calc(100% - 48rpx);
  height: 240rpx;
  background: #ffffff;
  border-radius: 18rpx;
  padding: 24rpx 30rpx;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  .shop-avatar {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
  }

  .shop-info {
    width: calc(100% - 200rpx);
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .name {
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e323e;
    }

    .score-popularity {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6572;
      .scoreno{
        font-size: 22rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #959AA5;
        line-height: 26rpx;
        letter-spacing: 0.6px;
      }
      .score {
        font-size: 26rpx;
        font-weight: 600;
        color: #ff6300;
        margin-right: 12rpx;
      }
    }

    .playing {
      width: 250rpx;
      height: 40rpx;
      border-radius: 5rpx;
      background: #ffefe5;
      position: relative;
      font-size: 22rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #fe7100;
      line-height: 40rpx;
      text-indent: 30rpx;
      margin-left: 24rpx;

      .icon {
        position: absolute;
        top: 0;
        left: -20rpx;
        width: 42rpx;
        height: 40rpx;
      }
    }

    .price {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6572;
      line-height: 28rpx;

      .time-play {
        font-size: 22rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        display: inline-block;
        background: #ffffff;
        border-radius: 8rpx;
        border: 1rpx solid #b2b2b2;
        margin-left: 8rpx;
        padding: 2rpx 8rpx;
      }
    }
  }
}
}

</style>