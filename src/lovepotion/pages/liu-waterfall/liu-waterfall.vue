<template>
  <view class="waterfall">
    <view
      v-for="(item, index) in columnData"
      :key="index"
      class="column"
      :style="{ width: columnWidth + 'px' }"
    >
      <view
        v-for="(childItem, childIndex) in item"
        :key="childIndex"
        style="width: 100%"
        :id="'item' + childItem.id"
        @click="onGoActivity(childItem)"
      >
        <view
          class="item"
          :style="
            'background-color:' +
            cardBgColor +
            ';margin-left:' +
            margin +
            'rpx;margin-bottom:' +
            margin +
            'rpx;border-radius:' +
            24 +
            'rpx;position: relative;'
          "
        >
          <image
            :src="childItem.url[0]"
            mode="aspectFill"
            lazy-load
            :style="{ height: '240px', width: '100%', 'border-radius': '12px' }"
          >
          </image>
          <view class="title-info">
            <view class="item-title">{{ childItem.title }}</view>
            <div class="title-info-bottom">
              <div
                class="title-info-bottom-close"
                v-if="childItem.lpActivityStatus === 'REGISTRATION_CLOSED'"
              >
                报名已截止
              </div>
              <div
                class="title-info-bottom-end"
                v-else-if="childItem.lpActivityStatus === 'EVENT_ENDED'"
              >
                活动已结束
              </div>
              <div
                class="title-info-bottom-start"
                v-else-if="childItem.lpActivityStatus === 'EVENT_STARTED'"
              >
                活动已开始
              </div>
              <div
                class="title-info-bottom-left"
                v-else-if="childItem.lpActivityStatus === 'REGISTRATION_OPEN'"
              >
                <image src="../../static/image/fire.png"></image>
                <span class="title-info-bottom-left-value">火热报名中</span>
              </div>
              <div class="title-info-bottom-right">
                {{ $dayjs(childItem.eventStartTime).format("YYYY-MM-DD") }}
              </div>
            </div>
            <div class="title-info-hasBook" v-if="childItem.reg">已报名</div>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    //数据源
    dataList: {
      type: Array,
      required: true,
      default: [],
    },
    //显示列数
    column: {
      type: Number,
      required: true,
      default: 2,
    },
    //卡片margin(rpx)
    margin: {
      type: Number,
      default: 10,
    },
    //卡片圆角(rpx)
    radius: {
      type: Number,
      default: 8,
    },
    //页面背景颜色
    bgColor: {
      type: String,
      default: "#edeef2",
    },
    //卡片背景颜色
    cardBgColor: {
      type: String,
      default: "#FFFFFF",
    },
  },
  data() {
    return {
      columnData: [],
      columnWidth: 0,
      loading: false,
    };
  },
  watch: {
    dataList: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        this.$nextTick(() => {
          this.setColumnWidth();
          this.setData();
        });
      },
    },
    column: {
      immediate: false,
      deep: true,
      handler(newValue) {
        this.$nextTick(() => {
          this.setColumnWidth();
          this.setData();
        });
      },
    },
  },
  methods: {
    //计算每列的高度
    getElemHeight(index) {
      this.$nextTick(() => {
        var arr = [];
        this.dataList.map((item, index) => {
          uni.getImageInfo({
            src: item.picUrl,
            success: (e) => {
              item.height =
                e.height * (this.columnWidth / (e.width - 5)) + "px";
              this.createSelectorQuery()
                .select("#item" + item.id)
                .boundingClientRect((res) => {
                  arr.push({
                    ...{
                      itemHeight: res.height,
                    },
                    ...item,
                  });
                  if (arr.length == this.dataList.length) {
                    this.columnData = this.distributeToNArrays(
                      arr,
                      this.column
                    );
                  }
                })
                .exec();
            },
          });
        });
      });
    },
    distributeToNArrays(arr, n) {
      let sums = new Array(n).fill(0);
      return arr.reduce(
        (arrays, item) => {
          let minSum = Math.min(...sums);
          let minIndex = sums.indexOf(minSum);
          arrays[minIndex].push(item);
          sums[minIndex] += item.itemHeight;
          return arrays;
        },
        new Array(n).fill().map(() => [])
      );
    },
    setColumnWidth() {
      let width = uni.getSystemInfoSync().windowWidth;
      this.columnWidth = Math.floor((width - 5) / this.column);
    },
    setData() {
      const resultArray = this.dataList.reduce(
        (acc, cur, index) => {
          const targetIndex = index % this.column;
          acc[targetIndex].push(cur);
          return acc;
        },
        Array.from(Array(this.column), () => [])
      );
      this.columnData = resultArray;
      this.getElemHeight();
    },
    onGoActivity(v) {
      uni.navigateTo({
        url: `/lovepotion/pages/detail?id=${v.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.waterfall {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: calc(100vw - 10rpx);
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item {
  overflow: hidden;
}

.title-info {
  padding: 0rpx 14rpx 20rpx 14rpx;
  &-bottom {
    margin-top: 20rpx;
    @include hor-between-center;
    &-left {
      @include hor;
      align-items: center;
      image {
        width: 24rpx;
        height: 24rpx;
      }
      &-value {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #f03131;
        line-height: 28rpx;
      }
    }
    &-close {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      color: #e5a629;
      line-height: 28rpx;
    }
    &-end {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      color: #969ba6;
      line-height: 28r px;
    }
    &-right {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      color: #979797;
      line-height: 26rpx;
    }
    &-start {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      color: #222;
      line-height: 28rpx;
    }
  }
  &-hasBook {
    position: absolute;
    top: 18rpx;
    right: 24rpx;
    width: 74rpx;
    height: 30rpx;
    background: #ff5485;
    border-radius: 2px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20rpx;
    color: #ffffff;
    @include hor-center-center;
  }
}

.item-title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 28rpx;
  color: #2e323e;
  line-height: 48rpx;
  @include text-overflow-line(2);
  margin-top: 8rpx;
}
</style>