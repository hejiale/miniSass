<template>
  <div class="drama">
    <image
      :src="$filters.processImage(dramaObj.dramaCover, 160)"
      mode="aspectFill"
      lazy-load
    />
    <view class="drama-info">
      <span class="drama-info-title">
        {{ dramaObj.dramaName }}
      </span>
      <div class="drama-info-priceBox">
        <span>剧本价格：</span>
        <span>¥{{dramaObj.currentPrice/100}}</span>
        <span>¥{{dramaObj.originPrice/100}}</span>
      </div>
    </view>
  </div>
</template>
<script>
export default {
  props: {
    dramaObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.drama {
  background: #fff;
  display: flex;
  image {
    width: rpx(46);
    height: rpx(64);
    border-radius: 8rpx;
  }
  &-info {
    @include ver;
    margin-left: rpx(8);
    width: 80%;
    &-title {
      font-size: rpx(16);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }
    &-priceBox{
      @include hor;
      align-items: baseline;
      margin-top: rpx(8);
      span:nth-child(1){
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }
      span:nth-child(2){
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #14C9C9;
        line-height: 14px;
        font-size: rpx(14);
      }
      span:nth-child(3){
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
        text-decoration: line-through;
        margin-left: rpx(7);
      }
    }
    &-yunPrice{
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666;
      line-height: 18px;
      margin-top: rpx(4);
    }
    &-yunPrice::before{
      content: '运费：';
      color: #999;
    }
  }
}
</style>
