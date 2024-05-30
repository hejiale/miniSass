<template>
  <div class="gatherBox" @click="onGatherDetail">
    <div class="gatherBox-cover">
      <image :src="parama.dramaItem.dramaCover"  mode="aspectFill" />
      <image
        :src="sellType(parama.dramaItem.sellType)"
        v-if="sellType(parama.dramaItem.sellType)"
        class="gatherBox-cover-sellType"
      />
    </div>
    <div class="gatherBox-title">{{parama.dramaItem.dramaName}}</div>
    <div class="gatherBox-dicts">{{dictValue}}</div>
    <div class="gatherBox-people">{{parama.recommendCount || 0}}</div>
    <div class="gatherBox-storeBox">
      <div>店铺：{{store.storeName}}</div>
      <div></div>
      <div>{{distance}}km</div>
    </div>
    <div class="gatherBox-timeBox">开局：{{openDate}}</div>
    <div class="gatherBox-line"></div>
    <div class="gatherBox-bottomBox">
      <div class="gatherBox-bottomBox-left">
        <image
          :src="member.avatar"
          v-for="(member,index) in parama.gatheringMemberItemList"
          :key="member.id"
          class="gatherBox-bottomBox-left-cover"
          :style="index > 0 ? 'margin-left: -8px' : ''"
        />
        <span class="gatherBox-bottomBox-left-has">{{havePeople}}人已上车</span>
        <span class="gatherBox-bottomBox-left-need">差{{needMember}}</span>
      </div>
      <div class="gatherBox-bottomBox-right">¥{{parama.originPrice / 100}}/位</div>
    </div>
    <div class="gatherBox-rightTag" v-if="parama.gatherSuccessState">{{parama.gatherSuccessState}}</div>
  </div>
</template>
<script>
export default {
  props:{
    parama:{
      type: Object,
      default(){
        return {}
      }
    },
    store: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {
    };
  },
  computed:{
    havePeople(){
      return this.parama.botMaleGamerNum + this.parama.botFemaleGamerNum + this.parama.realMaleGamerNum + this.parama.realFemaleGamerNum;
    },
    needMember() {
      if (!this.parama) return "";

      if (this.parama.isRevertSex) {
        let needCount =
          this.parama.totalGamerNum -
          this.parama.realMaleGamerNum -
          this.parama.botMaleGamerNum -
          this.parama.realFemaleGamerNum -
          this.parama.botFemaleGamerNum;
        if (needCount > 0) {
          return `${needCount}人`;
        } else {
          return null;
        }
      }

      let femaleNum =
        this.parama.femaleLimitNum -
        this.parama.realFemaleGamerNum -
        this.parama.botFemaleGamerNum;
      let maleNum =
        this.parama.maleLimitNum -
        this.parama.realMaleGamerNum -
        this.parama.botMaleGamerNum;
      if (maleNum === 0 && femaleNum === 0) return null;

      return `${
        maleNum > 0 ? `${maleNum}男` : ""
      }${femaleNum > 0 ? `${femaleNum}女` : ""}`;
    },
    openDate() {
      if (!this.parama) return "";
      return `${this.$dayjs(this.parama.gameStartTime).format(
        "MM月DD日"
      )} ${this.fnTime(this.parama.gameStartTime) || this.getWeek(this.parama.gameStartTime)} ${this.$dayjs(
        this.parama.gameStartTime
      ).format("HH:mm")}`;
    },
    distance() {
      if (!uni.getStorageSync('isLocation') || !this.store) return "";
      return (this.store.distance / 1000).toFixed(2);
    },
    dictValue(){
      return this.parama.dramaItem.dicts.map(it=>it.dictValue).join(' ');
    },
    sellType() {
      return function (type) {
        if (type === "EXCLUSIVE") {
          return "../static/image/exclusive.png";
        } else if (type === "REAL_SCENE") {
          return "../static/image/real_scene.png";
        } else if (type === "LIMITED") {
          return "../static/image/limited.png";
        }
        return null;
      };
    }
  },
  methods:{
    onGatherDetail(){
      uni.navigateTo({
        url: `/gatherPlayer/pages/index?id=${this.parama.id}`
      })
    },
    /**
     * 转换日期
     */
    getWeek(dateString) {
      let date = new Date(dateString).getDay();
      var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      return "周" + weeks[date];
    },
    fnTime(time) {
      let d = new Date(time).setHours(0, 0, 0, 0);
      let today = new Date().setHours(0, 0, 0, 0);

      let obj = {
        "-86400000": "昨天",
        0: "今天",
        86400000: "明天",
      };
      return obj[d - today] || '';
    }
  }
};
</script>
<style lang="scss" scoped>
.gatherBox {
  margin-bottom: 20rpx;
  background: #ffffff;
  border-radius: 9px;
  position: relative;
  padding-bottom: 18rpx;
  &-cover {
    width: 156rpx;
    height: 228rpx;
    border-radius: 6px;
    margin-left: 24rpx;
    margin-top: 30rpx;
    position: relative;
    overflow: hidden;
    &-sellType {
      position: absolute;
      right: 8rpx;
      top: 8rpx;
      width: 60rpx;
      height: 32rpx;
    }
  }
  &-title {
    position: absolute;
    left: 224rpx;
    top: 32rpx;
    font-size: 32rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2e323e;
    line-height: 38rpx;
    @include text-overflow-line(1);
    width: 45%;
  }
  &-dicts {
    position: absolute;
    left: 224rpx;
    top: 88rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    line-height: 28rpx;
  }
  &-people {
    position: absolute;
    left: 224rpx;
    top: 130rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff7a00;
    line-height: 14px;
  }
  &-people::after {
    color: #5f6572;
    content: "人推荐";
  }
  &-storeBox {
    position: absolute;
    left: 224rpx;
    top: 170rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    line-height: 28rpx;
    @include hor;
    align-items: center;
    div:nth-child(1) {
      width: 80%;
      @include text-overflow-line(1);
    }
    div:nth-child(2) {
      width: 2rpx;
      height: 22rpx;
      background: #d9d9d9;
      margin: 0 10rpx;
      transform: translateY(2rpx);
    }
  }
  &-timeBox {
    position: absolute;
    left: 224rpx;
    top: 210rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    line-height: 28rpx;
  }
  &-line {
    margin: 30rpx 24rpx 16rpx 24rpx;
    height: 1rpx;
    background: rgba($color: #e9ebef, $alpha: 1);
  }
  &-bottomBox {
    @include hor-between-center;
    margin: 0 24rpx;
    &-left {
      &-cover {
        width: 32rpx;
        height: 32rpx;
        border: 1px solid #ffffff;
        border-radius: 32rpx;
      }
      &-has {
        margin-left: 12rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
      &-need {
        margin-left: 8rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff7a00;
      }
    }
    &-right {
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #fd2e2e;
      line-height: 28rpx;
    }
  }
  &-rightTag {
    position: absolute;
    right: 24rpx;
    top: 38rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #fd2e2e;
    line-height: 28rpx;
  }
  &-rightTag::before {
    content: "拼成率";
    color: #333333;
  }
}
</style>