<template>
  <div class="container">
    <div class="container-bg"></div>
    <div
      class="container-item"
      v-for="activity in activityList"
      :key="activity.id"
    >
      <image
        :src="activity.url[0]"
        class="container-item-cover"
        mode="aspectFill"
      ></image>
      <span class="container-item-name">{{ activity.title }}</span>
      <span class="container-item-time">{{ activity.eventStartTime }}</span>
      <div class="container-item-addressBox">
        <span class="container-item-addressBox-title">地址：</span>
        <span class="container-item-addressBox-value">{{
          activity.address
        }}</span>
      </div>
      <div
        class="container-item-invite"
        @click="onGoActivityDetail(activity.id)"
      >
        报名并邀请
      </div>
    </div>
    <div class="container-noData">我是有底线的~</div>
    <van-popup :show="showSuccess" position="center" round>
      <image
        src="../static/image/invite-success.png"
        class="pop-success"
        @click="onActivityDetail"
      ></image>
    </van-popup>
  </div>
</template>
<script>
import service from "../utils/service";
export default {
  data() {
    return {
      pageNo: 1,
      activityList: [],
      total: 0,
      lpUserId: null,
      userInfo: null,
      lpUserInfo: null,
      showSuccess: false,
      jumpId: null,
    };
  },
  async onLoad(options) {
    this.lpUserId = options.lpUserId;

    await this.getMemberInfo();
  },
  onShow() {
    this.queryActivityList();
  },
  onReachBottom() {
    if (this.total === this.activityList.length) return;

    this.pageNo++;
    this.queryActivityList();
  },
  methods: {
    //查询活动列表
    async queryActivityList() {
      let data = await service.LpActivityList({
        pageNo: this.pageNo,
        pageSize: 20,
        lpActivityStatus: "REGISTRATION_OPEN",
      });
      if (this.pageNo === 1) this.activityList = [];

      if (data.records.length) {
        this.activityList.push(...data.records);
      }
      this.total = data.total;
    },
    //查询会员信息
    async getMemberInfo() {
      this.userInfo = await this.$checkLogin.getUserInfo();

      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
    },
    //邀请
    async onGoActivityDetail(id) {
      this.jumpId = id;

      await service.lpUserInviteActiveInvite({
        inviteLpUserId: this.lpUserId,
        lpActiveId: id,
        lpUserId: this.lpUserInfo.id,
      });
      this.showSuccess = true;
    },
    onActivityDetail() {
      this.showSuccess = false;
      uni.navigateTo({ url: `/lovepotion/pages/detail?id=${this.jumpId}` });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-bg {
    @include fiexcenter;
    background: #f5f9fb;
    z-index: -1;
  }
  &-item {
    margin: 18rpx 0px 0px 24rpx;
    width: 702rpx;
    height: 320rpx;
    background: #ffffff;
    border-radius: 24rpx;
    position: relative;
    &-cover {
      position: absolute;
      left: 24rpx;
      top: 28rpx;
      width: 132rpx;
      height: 176rpx;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
    }
    &-name {
      position: absolute;
      left: 176rpx;
      top: 24rpx;
      font-weight: 600;
      font-size: 30rpx;
      color: #111111;
      @include text-overflow-line(1);
      width: 60vw;
    }
    &-time {
      position: absolute;
      left: 176rpx;
      top: 74rpx;
      font-size: 24rpx;
      color: #5f6572;
    }
    &-time::before {
      content: "时间：";
      color: #959aa5;
    }
    &-addressBox {
      position: absolute;
      left: 174rpx;
      top: 114rpx;
      @include hor;
      align-items: baseline;
      &-title {
        font-size: 24rpx;
        color: #959aa5;
      }
      &-value {
        font-size: 24rpx;
        color: #5f6572;
        width: 55vw;
      }
    }
    &-invite {
      position: absolute;
      right: 24rpx;
      bottom: 20rpx;
      width: 184rpx;
      height: 70rpx;
      border-radius: 35rpx;
      border: 1rpx solid #ff5485;
      border-radius: 35rpx;
      @include hor-center-center;
      font-size: 28rpx;
      color: #ff5485;
    }
  }
  &-noData {
    padding: 20rpx 0 60rpx 0;
    width: calc(100vw - 10rpx);
    color: #979797;
    font-size: 26rpx;
    text-align: center;
  }
}
.pop-success {
  width: 508rpx;
  height: 426rpx;
}
</style>