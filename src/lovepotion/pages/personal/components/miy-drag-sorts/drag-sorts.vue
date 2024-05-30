<template>
  <view
    class="drag-wrap"
    @touchmove.stop.prevent
  >
    <view
      class="drag-box"
      :style="{ 'height': areaHeight, 'width': areaWidth + 'px' }"
    >
      <view
        class="drag-area"
        id="drag-area"
        :change:flow="drag.paramUpdate"
        :flow="flowData"
      >
        <view
          class="add-wrap"
          @click="clickAdd"
          :style="{ 'top': lastY + 'px', 'left': lastX + 'px' }"
        >
          <slot name="last" v-if="showLast">
            <img-add
              :width="itemWidth + 'px'"
              :height="itemHeight + 'px'"
            ></img-add>
          </slot>
        </view>
        <view v-for="(item, index) in currentList" :key="index">
          <view
            class="drag-sort-item"
            :class="'drag-item-' + index"
            :data-idx="index"
            @touchstart="drag.mouseDown"
            @touchmove="drag.touchmove"
            @touchend="drag.touchend"
            @touchcancel="drag.touchcancel"
            :style="{
              'top': item.y + 'px',
              'left': item.x + 'px',
              'width': itemWidth + 'px',
              'height': itemHeight + 'px',
            }"
          >
            <view
              class="item-root"
              style="width: 100%; height: 100%"
              :class="{ 'drag-active': active === index }"
            >
              <!--放大和透明效果应用在item-root节点上，用在drag-sort-item上会导致无法撤销效果-->
              <view class="img-item" @longpress="drag.longpressItem">
                <image
                  class="pre-image"
                  :mode="imgMode"
                  @click="clickItem($event, index)"
                  :src="img_list[index][img_key]"
                ></image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <slot name="footer"></slot>
  </view>
</template>

<script>
/**
 * 可拖拽排序的图片列表
 * 事件:add 触发添加图片事件
 */
import imgAdd from "./img_add.vue";
export default {
  name: "drag-sort",
  components: {
    imgAdd,
  },
  data: () => {
    return {
      rpxRatio: 1,
      pageWidth: 750, //通过接口得到
      currentList: [],
      areaWidth: 750,
      realMarginY: 0,
      realMarginX: 0,
      itemWidth: 206,
      itemHeight: 206,
      column: 1,
      version: 0,
      scrollTop: 0,
      lastX: 0,
      lastY: 0,
      active: -1,
    };
  },
  computed: {
    flowData: function () {
      return {
        allowDrag: this.allowDrag,
        currentList: this.currentList,
        itemWidth: this.itemWidth,
        itemHeight: this.itemHeight,
        realMarginY: this.realMarginY,
        realMarginX: this.realMarginX,
        column: this.column,
        version: this.version,
      };
    },
    areaHeight: function () {
      var itemCount = Number(this.img_list.length);
      if (this.showLast) {
        itemCount += 1;
      }
      var rowCount = Math.ceil(itemCount / this.column);
      return (
        rowCount * (this.itemHeight + this.realMarginY) -
        this.realMarginY +
        "px"
      );
    },
  },
  props: {
    img_list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否显示列表后的追加按钮
    showLast: {
      type: Boolean,
      default: true,
    },
    // 可拖动区域宽度，单位rpx
    width: {
      type: Number,
      default: 750,
    },
    // 可拖动区域高度，单位rpx
    height: {
      type: Number,
      default: 750,
    },
    // 图片父容器宽度，单位 rpx
    viewWidth: {
      type: Number,
      default: 300,
    },
    // 图片父容器高度，单位 rpx
    viewHeight: {
      type: Number,
      default: 300,
    },
    imgMode: {
      type: String,
      default: "aspectFit",
    },
    // 图片彼此横向间隔，单位rpx
    marginWidth: {
      type: Number,
      default: 18,
    },
    // 图片彼此纵向间隔，单位rpx
    marginHeight: {
      type: Number,
      default: 18,
    },
    // 是否允许拖动
    allowDrag: {
      type: Boolean,
      default: true,
    },
    img_key: {
      type: String,
      default: "path",
    },
    // 额外信息
    info: {
      type: Object,
      default: {},
    },
  },
  watch: {
    img_list: {
      handler() {
        this.initItems();
      },
      immediate: false,
    },
  },
  created() {
    this.pageWidth = uni.getSystemInfoSync().windowWidth;
    this.rpxRatio = this.pageWidth / 750;
    this.areaWidth = Math.round(this.width * this.rpxRatio);
    var marginX = this.marginWidth * this.rpxRatio;
    this.realMarginY = Math.floor(this.marginHeight * this.rpxRatio);
    this.itemWidth = Math.round(this.viewWidth * this.rpxRatio);
    this.itemHeight = Math.round(this.viewHeight * this.rpxRatio);
    this.column = Math.round(
      (this.areaWidth + marginX) / (this.itemWidth + marginX)
    );
    // 左右两侧紧贴父容器左右边界，故间隔宽度=剩余宽度/(column-1)
    this.realMarginX = Math.floor(
      (this.areaWidth - this.column * this.itemWidth) / (this.column - 1)
    );
    // 从img_list更新
    this.initItems();
    // console.log('areaWidth: ' + this.areaWidth + ', itemWidth: ' + this.itemWidth
    //     + ', itemHeight: ' + this.itemHeight + ' margin: '
    //     + this.realMarginX + '|' + this.realMarginY +', columns: ' + this.column);
  },
  mounted: function () {
    this.version += 1;
  },
  methods: {
    clickAdd(e) {
      this.$emit("add");
    },
    longpressItem(e) {
      this.$emit("longpressItem", e);
    },
    clickItem(e, index) {
      this.$emit("clickItem", e, index);
    },
    update_img_list(arr) {
      this.$emit("sortChange", arr);
    },
    setActive(index) {
      this.active = index;
    },
    setBoxScroll(val) {
      // 禁用跟随touchmove设置滚动，非常卡顿
      // this.scrollTop = val;
    },
    /**
     * 初始化条目
     * 依赖数据：currentList, column, itemHeight, realMarginY, itemWidth, realMarginX
     */
    initItems() {
      this.currentList = [];
      var itemList = [];
      for (var idx = 0; idx < this.img_list.length; idx++) {
        var item = this.img_list[idx];
        var top = 0;

        if(idx > 1){
          top = (Math.ceil((idx + 2) / this.column) - 1) * (this.itemHeight + this.realMarginY);
        }
        
        var left = ((idx+1) % this.column) * (this.itemWidth + this.realMarginX);
        item.order_num = idx;
        item.index = idx;
        item.y = top;
        item.x = left;
        item.initY = top;
        item.initX = left;
        itemList.push(item);
      }
      this.currentList = itemList;
  
      var itemLen = itemList.length;
      this.lastX =
        (itemLen % this.column) * (this.itemWidth + this.realMarginX);
      this.lastY =
        (Math.ceil((itemLen + 1) / this.column) - 1) *
        (this.itemHeight + this.realMarginY);
    },
  },
};
</script>

<script module="drag" lang="wxs" src="./drag_handle.wxs"></script>
<!-- <wxs src="./drag_handle.wxs" module="wxs" /> -->

<style lang='scss' scoped>
.drag-box {
    max-height: 70vh;
    overflow-y: scroll;
  .drag-area {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
.drag-sort-item {
  position: absolute !important;
  /* #ifdef MP-BAIDU */
  transform: none !important; /* 解决百度小程序给movable-view添加transfrom平移导致位置不正确问题 */
  /* #endif */
  display: flex;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  background-color: #fff;

  .item {
    position: relative;
    flex: 1;
    font-size: 16px;
  }
}
.drag-active {
  opacity: 0.8;
  transform: scale(1.1);
  z-index: 100;
}
.img-item {
  position: relative;
//   z-index: 10;
  height: 100%;
  width: 100%;

  .move-btn-box {
    height: 20%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
  }

  image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
}
.move-btn-box .move-btn {
  font-size: 28rpx;
  color: #fff;
  background-color: #1fa487;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}
.move-btn-box .move-right {
  background-color: #007aff;
}

.active {
  box-shadow: 0 0 40rpx #dddddd;
  z-index: 99;
}
.add-wrap {
}
</style>
