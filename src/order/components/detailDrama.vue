<template>
  <div class="drama">
    <image
      :src="$filters.processImage(dramaObj.productImage, 160)"
      mode="aspectFill"
      lazy-load
    />
    <view class="drama-info">
      <span class="drama-info-title">
        {{ dramaObj.productName }}
      </span>
      <div class="drama-info-priceBox">
        <span>剧本价格：</span>
        <span>¥{{dramaObj.orderPrice/100}}</span>
        <!-- <span>¥{{dramaObj.originPrice/100}}</span> -->
      </div>
    </view>
    <div class="drama-count">x1</div>
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
  position: relative;
  image {
    width: rpx(46);
    height: rpx(64);
    border-radius: 8rpx;
  }
  &-info {
    @include ver;
    margin-left: rpx(8);
    width: 70%;
    &-title {
      font-size: rpx(16);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
      word-break: break-all;
    }
    &-priceBox{
      @include hor;
      align-items: center;
      margin-top: rpx(4);
      span:nth-child(1){
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }
      span:nth-child(2){
        margin-top: rpx(4);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #14C9C9;
        line-height: 14px;
        font-size: rpx(14);
      }
      // span:nth-child(3){
      //   font-size: rpx(14);
      //   font-family: PingFang SC-Regular, PingFang SC;
      //   font-weight: 400;
      //   color: #999999;
      //   line-height: 16px;
      //   text-decoration: line-through;
      //   margin-left: rpx(7);
      // }
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
  &-count{
    position: absolute;
    right: 0;
    top: 50%;
    border-radius: 6px;
    border: 1px solid #E9E9E9;
    font-size: rpx(11);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    padding: rpx(2) rpx(4);
    transform: translateY(-10px);
  }
}
</style>
