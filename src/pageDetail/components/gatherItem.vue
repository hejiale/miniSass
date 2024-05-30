<template>
  <div class="gatherItem">
    <div class="gatherItem-info">
      <image :src="gather.dramaCover" class="gatherItem-info-url" mode="aspectFill" />
      <view class="gatherItem-info-rightBox">
        <view class="dramaName">{{ gather.dramaName }}</view>
        <view class="moveType">
          <view class="moveTypeone" v-for="(item, index) in gather.dictValueList" :key="index">{{ item.dictValue }}
          </view>
        </view>
        <span class="tuijian">
          <view class="num">{{ gather.recommendCount == null ? 0 : gather.recommendCount }}</view>
          <view class="person">人推荐</view>
        </span>
        <span class="dianpu">
          <view class="dianpu2">店铺:</view>
          <view>
            <text class="dianpu1" :style="dianpuitem">{{ gather.storeName }} </text>
          </view>
          <view class="xian"></view>
          <view class="distance" v-if="distance">{{ distance }}km</view>
        </span>
        <span class="kaiju">{{ getDateStr(gather.gameStartTime) }}</span>
      </view>
      <view class="gatherItem-info-bage" :class="gather.dramaItem.sellType">
        <!-- {{ gather.sellType }} -->
        <image v-if="gather.sellType == 3" class="imageBox" :src="$iconFont.getIconName('EXCLUSIVE')"></image>
        <image v-else-if="gather.sellType == 2" class="imageBox" :src="$iconFont.getIconName('LIMITED')"></image>
        <image v-else-if="gather.sellType == 4" class="imageBox" :src="$iconFont.getIconName('REAL_SCENE')"></image>
      </view>
      <!-- <span class="gatherItem-info-status active" v-if="gather.gatherStatus === 'GATHERING' && gather.gatherLockStatus === 'LOCKED'">拼场成功</span> -->
      <view class="boxRight" v-if="gather.successRate !== null">
        <view>拼成率</view>
        <view class="one">{{ gather.successRate }}</view>
      </view>
    </div>
    <div class="gatherItem-line"></div>
    <div class="gatherItem-bottomBox">
      <div class="gatherItem-bottomBox-left">
        <image v-for="(member, idx) in gather.avatarList" :key="idx" :src="member" class="gatherItem-bottomBox-left-head"
               :style="idx > 0 ? 'margin-left: -8px;' : ''" />
        <span class="gatherItem-bottomBox-left-note">{{ gather.realPeople }}人已上车</span>
        <span class="gatherItem-bottomBox-left-people">{{
            needMaleOrFeMale2
          }}</span>
      </div>
      <div class="gatherItem-bottomBox-right">
        <span>¥</span>
        <span>{{ gather.originPrice / 100 }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dianpuitem: ''
    }
  },
  props: {
    gather: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
    week() {
      if (!this.gather) return "";
      return this.getWeek(this.gather.gameStartTime);
    },
    needMaleOrFeMale() {
      if (this.gather.isRevertSex) {
        let needCount =
            this.gather.totalGamerNum -
            this.gather.realMaleGamerNum -
            this.gather.botMaleGamerNum -
            this.gather.realFemaleGamerNum -
            this.gather.botFemaleGamerNum;
        if (needCount > 0) {
          return `差${needCount}人`;
        } else {
          return "";
        }
      }
      let male =
          this.gather.maleLimitNum -
          this.gather.realMaleGamerNum -
          this.gather.botMaleGamerNum >
          0
              ? `差${this.gather.maleLimitNum -
              this.gather.realMaleGamerNum -
              this.gather.botMaleGamerNum
              }男`
              : "";
      let female =
          this.gather.femaleLimitNum -
          this.gather.realFemaleGamerNum -
          this.gather.botFemaleGamerNum >
          0
              ? `${male.length ? "" : "差"}${this.gather.femaleLimitNum -
              this.gather.realFemaleGamerNum -
              this.gather.botFemaleGamerNum
              }女`
              : "";
      return male + female;
    },
    needMaleOrFeMale2() {
      if (this.gather.isOpposite) {
        return `空${this.gather.lackGamerNum}人`;
      } else {
        let parts = [];
        if (this.gather.lackManNum > 0) {
          parts.push(`${this.gather.lackManNum}男`);
        }
        if (this.gather.lackWomanNum > 0) {
          parts.push(`${this.gather.lackWomanNum}女`);
        }
        return parts.length > 0 ? `差${parts.join('')}` : '';
      }
    }
    ,
    getDateStr() {
      return function (date) {
        const gameStartTime = this.$dayjs(date);
        const now = this.$dayjs();
        const tomorrow = this.$dayjs().add(1, 'day');

        let dateStr = gameStartTime.format("MM月DD日");
        if (gameStartTime.isSame(now, 'day')) {
          dateStr = '今天';
        } else if (gameStartTime.isSame(tomorrow, 'day')) {
          dateStr = '明天';
        }

        return `开局：${dateStr} ${this.getWeek(gameStartTime)}${gameStartTime.format("HH:mm")}`;
      };
    },
    distance(){
      if(uni.getStorageSync('isLocation') && this.gather){
        return this.gather.distance;
      }
      return null;
    }
  },
  methods: {
    getWeek(date) {
      const week = ['日', '一', '二', '三', '四', '五', '六'];
      return '周' + week[this.$dayjs(date).day()];
    }
  },
};
</script>
<style lang="scss" scoped>
.gatherItem {
  background: #ffffff;
  border-radius: 16px;
  padding: rpx(15);
  margin-top: 16rpx;

  .boxRight {
    display: flex;
    justify-content: flex-start;
    position: absolute;
    right: 0rpx;
    top: 8rpx;
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #333333;

    .one {
      color: #fd2e2e;
    }
  }

  &-info {
    @include hor;
    position: relative;

    &-url {
      width: 156rpx;
      height: 208rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      opacity: 1;
    }

    &-bage {
      position: absolute;
      left: 95rpx;
      top: 5rpx;
      border-radius: 4px;
      font-size: rpx(10);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }

    .imageBox {
      width: 60rpx;
      height: 32rpx;
      margin-top: 8rpx;
      padding-right: 8rpx;
      box-sizing: border-box;
    }

    .EXCLUSIVE {
      background: linear-gradient(90deg, #fe6989 50%, #ff928b 100%);
    }

    .BOXED {
      background: linear-gradient(90deg, #317bff 0%, #5754f1 100%);
    }

    .LIMITED {
      background: linear-gradient(90deg, #5655e6 50%, #3e86ff 100%);
    }

    .REAL_SCENE {
      background: linear-gradient(90deg, #ff7043 50%, #ffa726 100%);
    }

    .UNDETERMINED {
      background: linear-gradient(90deg, #c2c7cb 50%, #c2c7cb 100%);
    }

    &-rightBox {
      margin-left: rpx(8);
      display: flex;
      @include ver;

      .dramaName {
        width: 44vw;
        font-size: 32rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #2E323E;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .moveType {
        display: flex;
        justify-content: flex-start;
        overflow-x: scroll;
        width: 300rpx;
        white-space: nowrap;
        margin-top: 12rpx;

        .moveTypeone {
          margin: 0 5rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          display: inline-block;
        }
      }

      span:nth-child(1) {
        font-size: rpx(14);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        line-height: 16px;
        width: 70%;
        @include text-overflow-line(1);
      }

      .tuijian {
        display: flex;
        justify-content: flex-start;

        .num {
          height: 34rpx;
          font-size: 24rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #FF7A00;
        }

        .person {
          font-size: 24rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #5F6572;
        }
      }

      span:nth-child(2) {
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
      }

      span:nth-child(3) {
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }

      span:nth-child(2) {
        // margin-top: rpx(16);
        margin-top: 12rpx;
      }

      span:nth-child(3) {
        margin-top: rpx(4);
      }

      .dianpu {
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        display: flex;
        justify-content: flex-start;
        margin-top: 5rpx;

        .dianpu2 {
          white-space: nowrap;
          margin-right: 15rpx;
          margin-top: 5rpx;
        }

        .dianpu1 {
          display: flex;
          justify-content: flex-start;
          width: 280rpx;
          margin-top: 6rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: block
        }

        .xian {
          width: 2rpx;
          height: 22rpx;
          background: #D9D9D9;
          border-radius: 0rpx 0rpx 0rpx 0rpx;
          opacity: 1;
          margin-top: 12rpx;
          margin-left: 12rpx;
          margin-right: 10rpx;
        }

        .distance {
          margin-top: 6rpx;
        }
      }

      .kaiju {
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #5F6572;
        margin-top: 6rpx;
      }
    }

    &-status {
      position: absolute;
      right: 0;
      top: 0;
      font-size: rpx(12);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #78c747;
      line-height: 14px;
    }

    .active {
      color: #067ae5;
    }

    .fail {
      color: #8c9aa3;
    }
  }

  &-line {
    width: 100%;
    height: 1px;
    background: #f0f0f0;
    margin-top: 15px;
  }

  &-bottomBox {
    margin-top: 16rpx;
    @include hor-between-center;

    &-left {
      &-head {
        width: 16px;
        height: 16px;
        border: 1px solid #ffffff;
        border-radius: 16px;
      }

      &-note {
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #666666;
      }

      &-people {
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #FF7A00;
        margin-left: 8rpx;
      }
    }

    &-right {
      display: flex;
      align-items: flex-end;

      span:nth-child(1) {
        font-size: rpx(16);
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #FD2E2E;
        // transform: translateY(-2rpx);
      }

      span:nth-child(2) {
        font-size: rpx(16);
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #FD2E2E;
      }

      span:nth-child(2)::after {
        content: "/位";
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #FD2E2E;
      }
    }
  }
}
</style>