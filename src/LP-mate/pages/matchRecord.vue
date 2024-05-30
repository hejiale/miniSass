<template>
  <div class="container">
    <div class="container-bg"></div>
    <div class="container-tabBar">
      <div
        class="container-tabBar-tab"
        v-for="(tab, index) in tabs"
        :key="tab"
        :class="{ active: current === index }"
        @click="current = index"
      >
        {{ tab }}
        <div class="line" v-if="current === index"></div>
        <span class="badge ml4" v-if="index === 2">{{ followCount.ifollowCount || '' }}</span>
        <span class="badge ml4" v-if="index === 3">{{ followCount.followMeCount || '' }}</span>
        <span class="badge ml4" v-if="index === 4">{{ followCount.mutualFollowCount || '' }}</span>
      </div>
    </div>
    <scroll-view
      class="container-inviteList"
      scroll-y
      v-if="current < 2"
      @scrolltolower="onLoadMore"
      refresher-enabled
      :refresher-triggered="refresher"
      @refresherrefresh="loadData"
    >
      <div
        class="container-inviteList-group"
        v-for="(item, index) in inviteList"
        :key="index"
        @click="onActivityDetail(item.lpActiveId)"
      >
        <div class="container-inviteList-group-title">
          {{ item.inviteTime }}
        </div>
        <div class="container-inviteList-group-item">
          <image
            :src="avatar(item)"
            class="container-inviteList-group-item-avatar"
            mode="aspectFill"
          ></image>
          <span class="container-inviteList-group-item-name">{{
            current === 0 ? item.lpUserName : item.inviteLpName
          }}</span>
          <span class="container-inviteList-group-item-right">{{
            current === 0 ? "邀请你一起参加" : "收到你的邀请"
          }}</span>
          <image
            :src="$filters.processLogo(item.pic)"
            class="container-inviteList-group-item-banner"
            mode="aspectFill"
          ></image>
          <span class="container-inviteList-group-item-title">{{
            item.title
          }}</span>
          <span class="container-inviteList-group-item-time"
            >时间：{{ item.eventStartTime }}</span
          >
          <div class="container-inviteList-group-item-addressBox">
            <span class="container-inviteList-group-item-addressBox-title"
              >地址：</span
            >
            <span class="container-inviteList-group-item-addressBox-value">{{
              item.address
            }}</span>
          </div>
          <div
            class="container-inviteList-group-item-expire"
            v-if="activityStatus(item).length"
          >
            {{ activityStatus(item) }}
          </div>
          <div
            class="container-inviteList-group-item-agree"
            v-else-if="item.isAgreed || item.reg"
          >
            {{ current === 0 ? "已报名" : "对方已同意" }}
          </div>
          <div
            class="container-inviteList-group-item-accept"
            v-else
            @click.stop="onAccept(item)"
          >
            {{ current === 0 ? "接受并报名" : "等待回应…" }}
          </div>
        </div>
      </div>
      <div class="container-inviteList-noMore" v-if="inviteList.length">
        我是有底线的~
      </div>
      <image
        src="../static/image/no-record.png"
        class="container-inviteList-noData"
        v-if="!inviteList.length"
      ></image>
    </scroll-view>
    <scroll-view
      class="container-focusList mt12"
      scroll-y
      v-else
      @scrolltolower="onLoadMore"
      refresher-enabled
      :refresher-triggered="refresher"
      @refresherrefresh="loadData"
    >
      <div
        class="container-focusList-item"
        v-for="(user, index) in focusList"
        :key="user.targetLpUserId"
        :class="{ mr5: index % 2 === 0, border: (user.isRead !== null && !user.isRead) }"
        @click="onUserDetail(user.userId)"
      >
        <image
          :src="user.avatar"
          class="container-focusList-item-head"
          mode="aspectFill"
        ></image>
        <div class="container-focusList-item-button" v-if="current === 2" @click.stop="onCancelFocus(user.targetLpUserId)">
          已关注
        </div>
        <div class="container-focusList-item-focusButton" v-if="current === 3" @click.stop="onFocus(user.targetLpUserId)">
          +关注
        </div>
        <div class="container-focusList-item-button" v-if="current === 4" @click.stop="onCancelFocus(user.targetLpUserId)">
          互相关注
        </div>
      </div>
      <div class="container-inviteList-noMore" v-if="focusList.length">
        我是有底线的~
      </div>
      <image
        src="../static/image/no-record.png"
        class="container-inviteList-noData"
        v-if="!focusList.length"
      ></image>
    </scroll-view>
    <van-popup :show="showDialog" position="center" round>
      <div class="dialogBox">
        <image src="../static/image/cancel-focus.png" class="dialogBox-bg"></image>
        <div class="dialogBox-button" @click="showDialog = false"></div>
        <div class="dialogBox-button" @click="cancelFocus"></div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import service from "../utils/service";
export default {
  data() {
    return {
      tabs: ["收到的邀请", "发出的邀请", "我关注的", "关注我的", "互相关注"],
      current: 0,
      pageNo: 1,
      userInfo: null,
      lpUserInfo: null,
      inviteList: [],
      focusList: [],
      followCount: null,
      showDialog: false,
      cancelId: null,
      refresher: true
    };
  },
  async onShow(){
    await this.getMemberInfo();
    await this.loadData();
  },
  watch: {
    current() {
      this.loadData();
    },
  },
  computed: {
    activityStatus() {
      return function (item) {
        return this.$enums.LP_ACTIVITY_STATUS.getName(item.lpActivityStatus);
      };
    },
    avatar() {
      return function (item) {
        return this.current === 0 ? item.lpUserAvatar : item.inviteLpAvatar;
      };
    },
  },
  methods: {
    loadData(){
      this.refresher = true;
      this.pageNo = 1;
      this.inviteList = [];
      this.focusList = [];

      if (this.current > 1) {
        this.queryFocusList();
      } else {
        this.queryInviteList(); 
      }
      this.queryFocusCount();
    },
    //加载更多
    onLoadMore() {
      this.pageNo++;
      if (this.current > 1) {
        this.queryFocusList();
      } else {
        this.queryInviteList();
      }
    },
    //查询邀请列表
    async queryInviteList() {
      let res = await service.InviteActiveListByTable({
        lpInvitationStatus:
          this.current === 0 ? "RECEIVED_INVITATION" : "SENT_INVITATION",
        lpUserId: this.lpUserInfo.id,
        pageNo: this.pageNo,
        pageSize: 20,
      });
      
      setTimeout(()=>{
        this.refresher = false;

        if(this.pageNo === 1)this.inviteList = [];

        if (res.records.length) {
          this.inviteList.push(...res.records);
        }
      },1000)
    },
    //查询会员信息
    async getMemberInfo() {
      this.userInfo = await this.$checkLogin.getUserInfo();

      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
    },
    //接受邀请
    async onAccept(item) {
      if(this.current === 0){
        uni.navigateTo({url: `/lovepotion/pages/detail?id=${item.$orig.lpActiveId}&inviteUserId=${item.$orig.lpUserId}`})
      }
    },
    async onActivityDetail(id){
      uni.navigateTo({url: `/lovepotion/pages/detail?id=${id}`});
    },
    //查询关注列表
    async queryFocusList() {
      let res = await service.followListByTab({
        lpFollowStatus:
          this.current === 2
            ? "I_FOLLOW"
            : this.current === 3
            ? "FOLLOWS_ME"
            : "MUTUAL_FOLLOW",
        lpUserId: this.lpUserInfo.id,
        pageNo: this.pageNo,
        pageSize: 20,
      });
      
      setTimeout(()=>{
        this.refresher = false;

        if(this.pageNo === 1)this.focusList = [];

        if (res.records.length) {
          this.focusList.push(...res.records);
        }
      },1000)
    },
    //查询关注数量
    async queryFocusCount(){
       this.followCount = await service.followCount({lpUserId: this.lpUserInfo.id})
    },
    async onUserDetail(id){
      uni.navigateTo({url: `/LP-mate/pages/infomation?userId=${id}&useSelf=${this.lpUserInfo.id}`})
    },
    onCancelFocus(id){
      this.showDialog = true;
      this.cancelId = id;
    },
    async onFocus(id){
      await service.lpUserFollowFocus({followLpUserId: id, lpUserId: this.lpUserInfo.id});
      this.pageNo = 1;
      await this.queryFocusList();
      await this.queryFocusCount();
    },
    async cancelFocus(){
      this.showDialog = false;
      await service.lpUserFollowCancelFocus({followLpUserId: this.cancelId, lpUserId: this.lpUserInfo.id});
      this.pageNo = 1;
      await this.queryFocusList();
      await this.queryFocusCount();
    }
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
  &-tabBar {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    padding-top: 40rpx;
    border-bottom: 1rpx solid #efefef;
    white-space: nowrap;
    overflow-x: scroll;
    &-tab {
      display: inline-flex;
      margin-right: 48rpx;
      font-size: 30rpx;
      color: #959aa5;
      padding-bottom: 12rpx;
      position: relative;
    }
    &-tab:nth-child(1) {
      padding-left: 24rpx;
    }
    .active {
      font-weight: 600;
      color: #2e323e;
    }
    .line {
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 32rpx;
      height: 4rpx;
      background: #2e323e;
      border-radius: 12rpx;
    }
    .badge {
      margin-top: -4rpx;
      font-size: 24rpx;
      color: #959aa5;
    }
  }
  &-inviteList,
  &-focusList {
    position: fixed;
    left: 18rpx;
    width: 714rpx;
    bottom: 0px;
    top: 98rpx;
    &-group {
      &-title {
        font-size: 22rpx;
        color: #959aa5;
        line-height: 26rpx;
        padding-top: 48rpx;
        width: 100%;
        text-align: center;
      }
      &-item {
        width: 100%;
        height: 384rpx;
        background: #ffffff;
        border-radius: 16rpx;
        margin-top: 18rpx;
        position: relative;
        &-avatar {
          width: 36rpx;
          height: 36rpx;
          border-radius: 50%;
          position: absolute;
          left: 24rpx;
          top: 30rpx;
        }
        &-name {
          position: absolute;
          left: 68rpx;
          top: 28rpx;
          font-weight: 500;
          font-size: 28rpx;
          color: #2e323e;
        }
        &-right {
          position: absolute;
          top: 28rpx;
          right: 24rpx;
          font-size: 28rpx;
          color: #ff5485;
        }
        &-banner {
          position: absolute;
          left: 24rpx;
          top: 96rpx;
          width: 132rpx;
          height: 176rpx;
          border-radius: 8rpx;
        }
        &-title {
          position: absolute;
          left: 176rpx;
          top: 92rpx;
          font-weight: 600;
          font-size: 30rpx;
          color: #111111;
          @include text-overflow-line(1);
          width: 70%;
        }
        &-time {
          font-size: 24rpx;
          color: #959aa5;
          position: absolute;
          left: 176rpx;
          top: 142rpx;
        }
        &-addressBox {
          position: absolute;
          left: 176rpx;
          top: 182rpx;
          @include hor;
          align-items: baseline;
          &-title {
            font-size: 24rpx;
            color: #959aa5;
          }
          &-value {
            font-size: 24rpx;
            color: #959aa5;
            width: 60vw;
          }
        }
        &-accept {
          position: absolute;
          right: 24rpx;
          bottom: 22rpx;
          width: 184rpx;
          height: 70rpx;
          border-radius: 35rpx;
          @include hor-center-center;
          border: 1rpx solid #ff5485;
          font-size: 28rpx;
          color: #ff5485;
        }
        &-agree {
          position: absolute;
          right: 24rpx;
          bottom: 22rpx;
          width: 184rpx;
          height: 70rpx;
          border-radius: 35rpx;
          @include hor-center-center;
          border: 1rpx solid #2e323e;
          font-size: 28rpx;
          color: #2e323e;
        }
        &-expire{
          position: absolute;
          right: 24rpx;
          bottom: 22rpx;
          width: 184rpx;
          height: 70rpx;
          border-radius: 35rpx;
          @include hor-center-center;
          border: 1rpx solid #959AA5;
          font-size: 28rpx;
          color: #959AA5;
        }
      }
    }
    &-noMore {
      padding: 20rpx 0 60rpx 0;
      width: calc(100vw - 10rpx);
      color: #979797;
      font-size: 26rpx;
      text-align: center;
    }
    &-noData {
      margin-top: 350rpx;
      width: 280rpx;
      height: 248rpx;
      margin-left: 236rpx;
    }
    &-item {
      position: relative;
      display: inline-flex;
      width: calc((100% - 10rpx) / 2);
      height: 464rpx;
      background: #dbdbdb;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      margin-bottom: 10rpx;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      &-head {
        width: 342rpx;
        height: 456rpx;
        border-radius: 20rpx;
      }
      &-button {
        padding: 14rpx 24rpx;
        background: #f7f7f7;
        box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(119, 119, 119, 0.25);
        border-radius: 32rpx;
        border: 2rpx solid #ffffff;
        font-weight: 500;
        font-size: 28rpx;
        color: #959aa5;
        @include hor-center-center;
        position: absolute;
        bottom: 24rpx;
        left: 110rpx;
      }
      &-focusButton {
        width: 130rpx;
        height: 64rpx;
        border-radius: 32rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #fff;
        @include hor-center-center;
        position: absolute;
        bottom: 24rpx;
        left: 110rpx;
        background: #ff5485;
        box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(241, 83, 128, 0.58);
        border: 2rpx solid #ffa7a7;
      }
      &-bothFocus {
      }
    }
    .border{
      background: #FF5485;
    }
  }
}
.dialogBox{
  position: relative;
  width: 576rpx;
  height: 340rpx;
  &-bg{
    @include abscenter;
  }
  &-button{
    position: absolute;
    bottom: 0px;
    width: 50%;
    height: 100rpx;
  }
  &-button:nth-child(2){
    left: 0px;
  }
  &-button:nth-child(3){
    right: 0px;
  }
}
</style>