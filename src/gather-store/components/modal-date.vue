<template>
  <div>
    <van-action-sheet
      :show="showCaledar"
      @click-overlay="showCaledar = false"
      z-index="1000"
    >
      <van-datetime-picker
        title="选择开局时间"
        :value="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showCaledar = false"
        @confirm="onConfirmDatePicker"
        :formatter="formatter"
        style="width: 100%"
        :safe-area-inset-bottom="false"
        :z-index="1000"
        :filter="filter"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { getdate } from "@/utils";
export default {
  props: {
    current: {
      type: String,
    },
  },
  data() {
    return {
      showCaledar: false,
      currentDate: null, //往后延一个小时
      minDate: null, //往后延一个小时
      maxDate: null,
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        }
        if (type === "month") {
          return `${value}月`;
        }
        if (type === "day") {
          return `${value}日`;
        }
        if (type === "hour") {
          return `${value}时`;
        }
        if (type === "minute") {
          return `${value}分`;
        }
        return value;
      },
    };
  },
  created() {
    this.onDoCurrentDate();
  },

  methods: {
    filter(type, options) {
      if (type === "minute") {
        return options.filter(
          (option) =>
            option === "00" ||
            option === "10" ||
            option === "20" ||
            option === "30" ||
            option === "40" ||
            option === "50"
        );
      }
      return options;
    },
    onConfirmDatePicker(event) {
      console.log(event);
      this.currentDate = event.detail;
      this.showCaledar = false;
      this.$emit("getCurrentDate", this.currentDate);
    },
    doDatePicker(event) {
      let that = this;

      // 处理所选时间
      let systemTime = moment(event.detail).minutes(); // 获取当前系统时间的分钟数
      let options = [0, 10, 20, 30, 40, 50];

      // 解决展开弹出层后，不滑动触发change事件，直接点击确定，获取到所展示的时间
      for (let i = 0; i < options.length; i++) {
        if (i !== 3) {
          if (options[i] < systemTime && systemTime <= options[i + 1]) {
            that.currentDate = moment(
              moment(event.detail).minute(options[i + 1])
            );
          } else if (systemTime === 0) {
            that.currentDate = moment(moment(event.detail).minute(options[0]));
          } else if (50 < systemTime) {
            that.currentDate = moment(moment(event.detail).minute(60));
          }
        }
      }
    },
    onDoCurrentDate() {
      let hour = new Date().setHours(new Date().getHours() + 1);
      let addHour = new Date(hour).setMinutes(new Date().getMinutes());
      let minute = new Date(addHour).getMinutes();

      if (minute > 0 && minute <= 10) {
        minute = 10;
      } else if (minute > 10 && minute <= 20) {
        minute = 20;
      } else if (minute > 20 && minute <= 30) {
        minute = 30;
      } else if (minute > 30 && minute <= 40) {
        minute = 40;
      } else if (minute > 40 && minute <= 50) {
        minute = 50;
      } else if (minute === 0 || minute > 50) {
        minute = 0;
        addHour = new Date().setHours(new Date().getHours() + 2);
      } else {
        minute = 0;
        addHour = new Date().setHours(new Date().getHours() + 1);
      }
      this.minDate = this.currentDate = new Date(addHour).setMinutes(minute);
      this.maxDate = new Date(getdate(-13)).getTime();
      this.$emit("getCurrentDate", this.currentDate);
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
  },
};
</script>

<style></style>
