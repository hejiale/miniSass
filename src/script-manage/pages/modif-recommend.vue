<template>
  <scroll-view scroll-y  @scrolltolower="reachBottom" class="scrollView" :style="isEditStatus ? 'bottom: 16.5vh':'bottom: 0'">
    <div v-for="it in form" :key="it.id" class="modify" @click.native="onSelect(it)">
      <view class="modify-titleImg">
        <image
          :src="$filters.processImage(it.dramaCover, 320)"
          mode="aspectFill"
          class="modify-titleImg-cover"
          lazy-load
        />
        <view class="titleImg-badge">
          <view class="titleImg-badge__bg" :class="it.sellType"></view>
          <view class="titleImg-badge__txt">{{
            $enums.SellType.getName(it.sellType)
          }}</view>
        </view>
        <div class="modify-titleImg-recommend" v-if="it.isRecommend">推荐</div>
      </view>
      <view class="modify-content">
        <view class="title">{{ it.dramaName }}</view>
        <scroll-view class="modify-content-tags" v-if="it.dramaThemes" scroll-x>
          <div
            class="modify-content-tags-item"
          >
            {{ it.gamerNum }}人
          </div>
          <view
            class="modify-content-tags-item"
            v-for="item in it.dramaThemes"
            :key="item.id"
          >
            {{ item.dictValue }}
          </view>
        </scroll-view>
        <div class="modify-content-price">
          <span class="mr4">¥</span>
          {{ it.dramaPrice ? it.dramaPrice/100: 0}}
        </div>
      </view>
      <div class="modify-topTag" v-if="it.isTop">
        <span>置顶</span>
      </div>
      <div class="modify-chooseTag" v-if="isEditStatus">
        <image src="../static/image/Subtract-true.png" v-if="selected(it)"/>
        <image src="../static/image/Subtract-false.png" v-else/>
      </div>
    </div>
    <div style="height:16px"></div>
  </scroll-view>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      editSelectDramas: []
    };
  },
  props: {
    form: {
      type: Array,
      default: [],
    },
    isEditStatus:{
      type: Boolean,
      default: false
    },
    isAll:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    selected(){
      return function(val){
        let index = this.editSelectDramas.findIndex(it=>it.id === val.id);
        return index !== -1;
      }
    }
  },
  methods: {
    changeStatus(){
      if(this.isAll){
        this.editSelectDramas = JSON.parse(JSON.stringify(this.form));
      }else{
        this.editSelectDramas = [];
      }
      this.$emit('on-change', this.editSelectDramas);
    },
    onSelect(it) {
      if(this.isEditStatus){
        this.onChangeTag(it)
      }else{
        this.$emit("on-select-drama", it);
      }
    },
    onChangeTag(drama) {
      let index = this.editSelectDramas.findIndex(it=>it.id === drama.id);
      if(index !== -1){
        this.editSelectDramas.splice(index, 1);
      }else{
        this.editSelectDramas.push(drama);
      }
      this.$emit('on-change', this.editSelectDramas);
    },
    reachBottom(){
      this.$emit('on-reachBottom')
    }
  },
};
</script>
<style lang="scss">
.scrollView{
  position: fixed;
  left: 0;
  right: 0;
  top: 18.6vh;
  bottom: 0;
}
.modify {
  display: flex;
  margin: rpx(0) rpx(16) rpx(16) rpx(16);
  background: #fff;
  border-radius: 16rpx;
  position: relative;
  &-titleImg {
    overflow: hidden;
    position: relative;
    width: rpx(72);
    height: rpx(94);
    border-radius: 8rpx;
    margin: 20rpx;
    &-cover {
      width: 100%;
      height: 100%;
    }
    /deep/.titleImg-badge {
      border-radius: 8rpx !important;
    }
    &-recommend{
      position: absolute;
      left: rpx(6);
      top: rpx(6);
      width: 28px;
      height: 16px;
      background: #FA5252;
      border-radius: 2px;
      font-size: rpx(11);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      @include hor-center-center;
    }
  }
  &-content {
    margin-top: 20rpx;
    padding-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 60%;
    min-width: 0;
    .title {
      @include text-overflow-line(1);
      width: 100%;
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
    }
    &-tags {
      display: flex;
      flex-wrap: wrap;
      height: 40rpx;
      margin-top: rpx(8);
      white-space: nowrap;
      &-item {
        display: inline-block;
        font-size: 22rpx;
        font-family: OPPOSans, OPPOSans-Regular;
        text-align: center;
        line-height: 40rpx;
        color: #666666;
        border-radius: 888px;
        background: rgba(153, 153, 153, 0.1);
        border-radius: 57px;
        margin-right: 12rpx;
        padding: 0 20rpx;
      }
    }
    &-price {
      @include hor;
      align-items: center;
      font-family: OPPOSans-Heavy, OPPOSans;
      color: #333333;
      line-height: 19px;
      margin-top: rpx(20);
      font-size: rpx(16);
    }
  }
  &-topTag {
    position: absolute;
    right: 10px;
    top: 10px;
    @include hor;
    align-items: center;
    width: 28px;
    height: 16px;
    background: #333333;
    border-radius: 2px;
    @include hor-center-center;
    span {
      font-size: rpx(11);
      color: #999999;
      line-height: 13px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
  &-chooseTag {
    position: absolute;
    top: rpx(27);
    right: rpx(0);
    padding: rpx(20);
    image {
      width: rpx(20);
      height: rpx(20);
    }
  }
}
</style>
