<template>
  <scroll-view class="script" scroll-y @scrolltolower="reachBottom">
      <view class="script-items">
        <view
          v-for="item in form"
          :key="item.id"
          class="script-item"
        >
          <view
            :style="{position: 'relative'}"
          >
            <image
              :src="$filters.processImage(item.dramaCover, 194)"
              mode="aspectFill"
              lazy-load
            />
            <view class="titleImg-badge">
              <view class="titleImg-badge__bg" :class="item.sellType"></view>
              <view class="titleImg-badge__txt">{{
                $enums.SellType.getName(item.sellType)
              }}</view>
            </view>
          </view>
          <view
            class="script-item-title"
            >{{ item.dramaName }}</view
          >
          <div class="script-item-delete" @click="onDelete(item)" v-if="item.isInStore">取消</div>
          <div class="script-item-add" @click="onAdd(item)" v-else>添加</div>
        </view>
      </view>
  </scroll-view>
</template>
<script>
export default {
  components: {
  },
  props: {
    form: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  methods: {
    onAdd(item){
      this.$emit('on-add', item)
    },
    onDelete(item){
      this.$emit('on-delete', item)
    },
    reachBottom(){
      this.$emit('reachBottom')
    }
  },
};
</script>

<style lang="scss">
/deep/.titleImg-badge {
  border-bottom-right-radius: 8rpx !important;
}
.script{
  position: fixed;
  left: 0;
  right: 0;
  top: 18.7vh;
  bottom: 10.5vh;
}
.script-items {
  display: flex;
  flex-wrap: wrap;  
  .script-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0rpx 40rpx rpx(24) 40rpx;
    image {
      width: 22.6vw;
      height: 240rpx;
      border-radius: 16rpx;
    }
    &-title {
      margin-top: 16rpx;
      width: 22.6vw;
      height: rpx(16);
      font-size: 28rpx;
      text-align: center;
      line-height: 16px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      @include text-overflow-line(1);
    }
    &-add{
      margin-top: 16rpx;
      width: 52px;
      height: 24px;
      background: #14C9C9;
      border-radius: 13px;
      font-size: rpx(12);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      @include hor-center-center;
    }
    &-delete{
      margin-top: 16rpx;
      width: 52px;
      height: 24px;
      background: #E5E9ED;
      border-radius: 13px;
      font-size: rpx(12);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #4C5657;
      @include hor-center-center;
    }
  }
}
</style>
