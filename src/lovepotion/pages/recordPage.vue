<template>
  <div class="container" v-if="inviter">
    <div class="container-fixedBg"></div>
    <div class="container-infoBox">
      <div class="container-infoBox-left">
        <div class="container-infoBox-left-avatarBox">
          <image
            :src="inviter.avatar"
            class="container-infoBox-left-avatarBox-head"
          ></image>
          <image
            src="../static/image/male.png"
            class="container-infoBox-left-avatarBox-sex"
            v-if="inviter.sex === 'MALE'"
          ></image>
          <image
            src="../static/image/female.png"
            class="container-infoBox-left-avatarBox-sex"
            v-if="inviter.sex === 'FEMALE'"
          ></image>
        </div>
        <span class="container-infoBox-left-name">{{ inviter.name }}</span>
      </div>
      <div class="container-infoBox-right">
        {{ $filters.judgePhone(inviter.phone) }}
      </div>
    </div>
    <div class="container-title">购买记录</div>
    <div class="container-item" v-for="(i,index) in recordList" :key="index">
      <span class="container-item-left">{{ i.createdTime }}</span>
      <span class="container-item-right">购买{{ i.lpMembershipPackageName}}会员</span>
    </div>
    <div class="container-noMore" v-if="recordList.length > 0">
      ~全部加载完了~
    </div>
    <image
      src="../static/image/noRecord.png"
      class="noData"
      v-if="!recordList.length"
    ></image>
  </div>
</template>
<script>
import service from '../utils/service'
export default {
  data() {
    return {
      inviter: null,
      recordList: []
    };
  },
  async onLoad() {
    this.inviter = uni.getStorageSync("inviter");
    uni.removeStorageSync("inviter");
    await this.queryRecordList();
  },
  methods:{
    async queryRecordList(){
      this.recordList = await service.getLpMembershipShoppingRecord({userId: this.inviter.userId})
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  &-fixedBg {
    @include fiexcenter;
    background: #F5F9FB;
    z-index: -1;
  }
  &-infoBox {
    @include hor-between-center;
    margin: 72rpx 24rpx 0px 24rpx;
    &-left {
      @include hor;
      align-items: center;
      &-avatarBox {
        position: relative;
        &-head {
          width: 76rpx;
          height: 76rpx;
          border-radius: 50%;
        }
        &-sex {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          right: 0px;
          bottom: 0px;
        }
      }
      &-name {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 26rpx;
        color: #2e323e;
        line-height: 30rpx;
        margin-left: 18rpx;
        width: 50vw;
        @include text-overflow-line(1);
      }
    }
    &-right {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #959aa5;
      line-height: 28rpx;
    }
  }
  &-title {
    margin: 60rpx 0px 8px 24rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #5f6572;
    line-height: 30rpx;
  }
  &-item {
    @include hor-between-center;
    padding: 28rpx 0px;
    margin: 0px 24rpx;
    border-bottom: 1rpx solid #e5e5e5;
    &-left {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #959aa5;
      line-height: 30rpx;
    }
    &-right {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #2e323e;
      line-height: 30rpx;
    }
  }
  &-noMore {
    @include hor-center-center;
    width: 100vw;
    height: 100rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #959aa5;
    line-height: 28rpx;
  }
  .noData {
    width: 202rpx;
    height: 48rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 10vh;
    padding-bottom: 30vh;
  }
}
</style>