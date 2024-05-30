<template>
  <view class="contenBox">
    <div class="all" @click="onChangeDate()">
      <div
        class="item"
        :class="dateList[0].date === currentDate ? 'activeItem' : ''"
      >
        <span
          class="item-date"
          :class="dateList[0].date === currentDate ? 'active' : ''"
          >全部</span
        >
        <span
          class="item-count"
          :class="dateList[0].date === currentDate ? 'active' : ''"
          >{{ sum }}场</span
        >
      </div>
    </div>
    <image src="../static/image/icon-space.png" class="space"/>
    <scroll-view class="weekBox" scroll-x>
      <div
        class="item"
        :class="it.date === currentDate ? 'activeItem' : ''"
        :style="{'margin-right': weekList.length - 1 === idx ? '16px' : '', 'margin-left': idx === 0 ? '0px':'14px'} "
        v-for="(it, idx) in weekList"
        :key="idx"
        @click="onChangeDate(it.date)"
      >
        <span
          class="item-date"
          :class="it.date === currentDate ? 'active' : ''"
          >{{ month(it.date) }}</span
        >
        <span
          class="item-count"
          :class="it.date === currentDate ? 'active' : ''"
          >{{ month2(it.date) }}</span
        >
      </div>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    dateList: Array,
    sum: Number,
  },
  data() {
    return {
      currentDate: null,
    };
  },
  methods: {
    //切换日期
    onChangeDate(date) {
      if (date == null) {
        this.currentDate = null;
      } else {
        this.currentDate = date;
      }
      this.$parent.onChangeDate2(date);
    },
    fnTime(time) {
      let d = new Date(time).setHours(0, 0, 0, 0);
      let today = new Date().setHours(0, 0, 0, 0);

      let obj = {
        "-86400000": "昨天",
        0: "今天",
        86400000: "明天",
      };
      return obj[d - today] || null;
    },
    // async queryDateList() {
    //   try {
    //     let res = await this.$api.getUserGatheringOverviewByDate({
    //       storeId: uni.getStorageSync("storeId"),
    //     });
    //     this.dateList = res;
    //   } catch (e) {}
    // },
  },
  computed: {
    month() {
      return function (date) {
        if (this.fnTime(date)) {
          return this.fnTime(date);
        }
        this.datas = this.$dayjs(date).format("d");
        let weeks = ["日", "一", "二", "三", "四", "五", "六"];
        let day = this.$dayjs(date).format("d");
        if (day) {
          return "星期" + weeks[day];
        } else {
          console.error("时间格式错误");
        }
      };
    },
    month2() {
      return function (date) {
        return this.$dayjs(date).format("MM-DD");
      };
    },
    weekList() {
      return this.dateList.slice(1, this.dateList.length);
    },
  },
};
</script>

<style lang='scss' scoped>
.contenBox {
  @include hor;
  align-items: center;
  position: fixed;
  left: 0px;
  right: 0px;
  top: 16.13vh;
  z-index: 1;
  border-top: 1rpx solid #e9ebef;
  border-bottom: 1rpx solid #e9ebef;
}
.space{
  width: 12rpx;
  height: 120rpx;
  padding-left: 20rpx;
}
.all {
  @include ver;
  align-items: center;
}
.weekBox {
  white-space: nowrap;
  width: 78vw;
}
.item {
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  margin-left: rpx(14);
  background: unset;
  border-radius: 12px;
  padding: rpx(12) rpx(9);
  &-date {
    font-size: 26rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    line-height: 14px;
  }

  &-count {
    margin-top: rpx(12);
    font-size: 26rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    line-height: 14px;
  }

  .active {
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 600;
    color: #2e323e;
  }
}
.activeItem {
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 600;
  color: #2e323e;
}
</style>
