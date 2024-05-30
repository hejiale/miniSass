<template>
  <div class="container">
    <div class="container-bg"></div>
    <div
      class="container-titleBox"
      :style="titleStyle"
      @click="onBack"
    >
      <image
        src="../static/image/round-back.png"
        class="container-titleBox-back"
      ></image>
      <span class="container-titleBox-title" :style="textStyle">Love potion</span>
      <image class="container-titleBox-cover" v-if="opacity > 0"></image>
    </div>
    <swiper
      class="container-swiperBox"
      :current="swiperCurrent"
      @change="onChangeSwiper"
      :autoplay="true"
    >
      <swiper-item
        class="container-swiperBox-item"
        v-for="(v, idx) in bannerList"
        :key="idx"
      >
        <image :src="v.mainUrl" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <scroll-view
      class="container-scrollBox"
      scroll-x
      @scrolltolower="onScrollRight"
      :scroll-left="scrollLeft"
      scroll-with-animation
      v-if="bannerList.length > 1 && showScroll"
    >
      <div
        class="container-scrollBox-item mr8"
        v-for="(v, idx) in bannerList"
        :key="idx"
        :id="'img-' + idx"
        @click="onClickSubImg(idx)"
      >
        <image
          :src="
            swiperCurrent === idx
              ? '../static/image/bg-border.png'
              : '../static/image/un-bg-border.png'
          "
          class="container-scrollBox-item-border"
          :class="{activeBorder: swiperCurrent === idx}"
        />
        <image
          :src="v.subUrl"
          mode="aspectFill"
          class="container-scrollBox-item-cover"
        />
      </div>
    </scroll-view>
    <view
      class="container-scrollFixBox"
      v-if="bannerList.length > 1 && !showScroll"
    >
      <div
        class="container-scrollBox-item"
        :class="{mr8: idx < 4}"
        v-for="(v, idx) in bannerList"
        :key="idx"
        :id="'img-' + idx"
        @click="onClickSubImg(idx)"
      >
        <image
          :src="
            swiperCurrent === idx
              ? '../static/image/bg-border.png'
              : '../static/image/un-bg-border.png'
          "
          class="container-scrollBox-item-border"
          :class="{activeBorder: swiperCurrent === idx}"
        />
        <image
          :src="v.subUrl"
          mode="aspectFill"
          class="container-scrollBox-item-cover"
        />
      </div>
    </view>
    <image
      src="../static/image/cover-border.png"
      class="container-boderBg"
    ></image>
    <div class="container-infoBox" v-if="lpUserInfo">
      <image
        :src="$iconFont.getIconName('lp-activity-border')"
        class="container-infoBox-bg"
      ></image>
      <div class="container-infoBox-avatarBox">
        <image
          :src="lpUserInfo.avatar"
          class="container-infoBox-avatarBox-avatar"
          mode="aspectFill"
        ></image>
        <image
          src="../static/image/avatar-border.png"
          class="container-infoBox-avatarBox-cover"
        ></image>
        <image
          src="../static/image/male.png"
          class="container-infoBox-avatarBox-sex"
          v-if="lpUserInfo.sex === 'MALE'"
        ></image>
        <image
          src="../static/image/female.png"
          class="container-infoBox-avatarBox-sex"
          v-if="lpUserInfo.sex === 'FEMALE'"
        ></image>
      </div>
      <div class="container-infoBox-content">
        <div class="container-infoBox-content-top">
          <span class="container-infoBox-content-top-title">{{
            lpUserInfo.name
          }}</span>
        </div>
        <div
          class="container-infoBox-content-bottom"
          v-if="lpUserInfo.lpMembershipPackageId"
        >
         <image src="../static/image/icon-membership.png" class="container-infoBox-content-bottom-tag"></image>
         <span class="container-infoBox-content-bottom-title">{{ lpUserInfo.lpMembershipPackageName }}</span>
        </div>
        <div
          class="container-infoBox-content-noPay"
          v-else
        >
          未开通会员
        </div>
      </div>
      <image
        src="../static/image/icon-personal.png"
        class="container-infoBox-tag"
        @click.stop="onGoPersonal"
      ></image>
      <div class="container-infoBox-expiraDay" v-if="lpUserInfo.lpMembershipPackageId">有效期：{{ lpUserInfo.expirationDay }}天</div>
      <div class="container-infoBox-membershipBox" v-if="lpUserInfo.lpMembershipPackageId" @click="onGoMemberEquity">查看会员权益</div>
      <div class="container-infoBox-buyBox" @click="onBuyMember" v-else>购买会员</div>
      <div class="container-infoBox-inviteBox" @click="onInvite">邀请好友</div>
    </div>
    <image
      class="container-levelBg"
      :src="$iconFont.getIconName('member-level-bg')"
      @click="onGoBook"
      v-else
    >
    <BindPhone v-if="!userInfo.phone" @on-success-authorize="onRefreshUserInfo"></BindPhone>
    </image>
    <div class="container-middleBox">
      <image :src="$iconFont.getIconName('love-game')" class="mr5" mode="widthFix" @click="onOpenGame"/>
      <image :src="$iconFont.getIconName('love-match')" mode="widthFix" @click="onMatch"/>
      <BindPhone v-if="!userInfo.phone" @on-success-authorize="onRefreshUserInfo"></BindPhone>
    </div>
    <div class="container-activityBox">
      <image
        :src="$iconFont.getIconName('lp-activity-bg')"
        class="container-activityBox-bg"
      ></image>
      <div class="container-activityBox-list" v-if="activityList.length">
        <waterFall :dataList="activityList"></waterFall>
        <div class="container-activityBox-list-noData">我是有底线的~</div>
      </div>
      <image
        :src="$iconFont.getIconName('empty-activity')"
        class="container-activityBox-empty"
        v-else
      ></image>
    </div>
    <van-popup :show="showOpenGame" @close="onCancelJoin" custom-style="background: unset;">
      <div class="popOpenGameBox">
        <image :src="$iconFont.getIconName('love-openGame')" class="popOpenGameBox-bg"/>
        <div class="popOpenGameBox-cancel" @click="onCancelJoin">取消</div>
        <div class="popOpenGameBox-sure" @click="onSureJoin">确定加入房间</div>
        <div class="popOpenGameBox-line"></div>
        <div class="popOpenGameBox-space"></div>
        <div class="popOpenGameBox-inputBox">
          <input placeholder="输入房间号" type="number" v-model="gameNumber" maxlength="9"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import service from "../utils/service";
import { getMenuButtonRect,windowWidth } from "@/utils/index";
import BindPhone from "@/components/bindPhone/index.vue";
import waterFall from "./liu-waterfall/liu-waterfall.vue";
export default {
  components:{
    BindPhone,
    waterFall
  },
  data() {
    return {
      scrollLeft: 0,
      swiperCurrent: 0,
      userInfo: null,
      lpUserInfo: null,
      activityList: [],
      pageNo: 1,
      bannerList: [],
      menuReact: null,
      opacity: 0,
      total: 0,
      screenWidth: 0,
      showOpenGame: false,
      gameNumber:null
    };
  },
  async onLoad() {
    wx.showLoading();

    wx.showShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
      success: () => {
      },
    });
    this.menuReact = await getMenuButtonRect();
    this.screenWidth = await windowWidth();
  },
  async onShow() {
    this.pageNo = 1;
    this.userInfo = await this.$checkLogin.getUserInfo();

    await this.getMemberInfo();
    await this.queryBannerList();
    await this.queryActivityList();
    wx.hideLoading();
  },
  onReachBottom() {
    if(this.total === this.activityList.length)return;
    
    this.pageNo++;
    this.queryActivityList();
  },
  onPageScroll(e){
    this.opacity = Math.min(e.scrollTop / 90, 0.86);
  },
  computed:{
    titleStyle(){
      if(!this.menuReact)return null;
      return `padding-top: ${this.menuReact.top}px;`;
    },
    textStyle(){
      return `color: ${this.opacity > 0 ? '#000':'#fff'}`;
    },
    showScroll(){
      return this.bannerList.length > 5;
    }
  },
  methods: {
    onBack() {
      if(getCurrentPages().length === 1){
        uni.switchTab({
          url: '/pages/index/index'
        })
      }else{
        uni.navigateBack();
      }
    },
    onOpenGame(){
      if(!this.userInfo.phone)return;
      this.showOpenGame = true;
    },
    onBuyMember(){
      uni.navigateTo({url: './buyMember'})
    },
    onMatch(){
      if(this.lpUserInfo){
        uni.navigateTo({url: '/LP-mate/pages/index'})
      }else{
        uni.navigateTo({
          url: `./book?isMatch=true`,
        });
      }
    },
    onGoMemberEquity(){
      uni.navigateTo({
        url: './memberEquity'
      })
    },
    onScrollRight() {},
    onInvite(){
      uni.navigateTo({url: './inviter'})
    },
    onClickSubImg(idx) {
      this.swiperCurrent = idx;
      this.scrollLeft = 63 * idx + (idx - 1) * 8;
    },
    onChangeSwiper(v) {
      this.swiperCurrent = v.detail.current;
      this.scrollLeft = 63 * v.detail.current + (v.detail.current - 1) * 8;
    },
    onGoBook() {
      uni.navigateTo({
        url: "./book",
      });
    },
    //重新授权
    async onRefreshUserInfo() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
    async getMemberInfo() {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
    },
    onGoPersonal() {
      uni.navigateTo({
        url: "./personal/index",
      });
    },
    /**
     * 查询轮播列表
     */
    async queryBannerList() {
      let data = await service.lpBannerList({
        pageNo: this.pageNo,
        pageSize: 100,
      });
      this.bannerList = [];

      if (data.records.length) {
        this.bannerList.push(...data.records);
      }
    },
    /**
     * 查询活动列表
     */
    async queryActivityList() {
      let data = await service.LpActivityList({
        pageNo: this.pageNo,
        pageSize: 10,
        userId: this.userInfo.id,
      });

      if (this.pageNo === 1) this.activityList = [];

      if (data.records.length) {
        this.activityList.push(...data.records);
      }
      this.total = data.total;
    },
    onCancelJoin(){
      this.showOpenGame = false;
      this.gameNumber = null;
    },
    onSureJoin(){
      this.$checkLogin.toTicketService(this.gameNumber, this.userInfo.id).then(_=>{
        this.showOpenGame = false;
        this.gameNumber = null;
      }).catch(_=>{

      })
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  &-bg {
    @include fiexcenter;
    background: #fae8f5;
    z-index: -1;
  }
  &-titleBox {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 2;
    @include hor;
    align-items: center;
    padding-bottom: 20rpx;
    &-back {
      width: 68rpx;
      height: 68rpx;
      padding-left: 24rpx;
    }
    &-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #fff;
      text-shadow: 0px 1px 3px rgba(0,0,0,0.25);
    }
    &-cover{
      @include abscenter;
      z-index: -1;
      backdrop-filter: blur(10px);
    }
  }
  &-swiperBox {
    width: 100vw;
    height: 1000rpx;
  }
  &-scrollBox, &-scrollFixBox {
    position: absolute;
    left: 18rpx;
    right: 18rpx;
    top: 754rpx;
    @include hor;
    width: calc(100vw - 36rpx);
    white-space: nowrap;
    z-index: 1;
    &-item {
      display: inline-flex;
      width: 126rpx;
      height: 220rpx;
      position: relative;
      box-sizing: border-box;
      &-cover{
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;
        border-radius: 8px;
        width: 100%;
        height: 168rpx;
      }
      &-border{
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 1;
        height: 168rpx;
      }
      .activeBorder{
        height: 178rpx;
      }
    }
  }
  &-scrollFixBox{
    @include hor-center-center;
  }
  &-boderBg {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 924rpx;
    height: 150rpx;
  }
  &-infoBox {
    margin-top: -16rpx;
    margin-left: 20rpx;
    width: 710rpx;
    height: 288rpx;
    position: relative;
    padding: 32rpx 24rpx;
    box-sizing: border-box;
    z-index: 1;
    @include hor;
    &-bg {
      @include abscenter;
      z-index: -1;
    }
    &-avatarBox {
      width: 84rpx;
      height: 84rpx;
      position: relative;
      &-avatar {
        width: 84rpx;
        height: 84rpx;
        border-radius: 50%;
        border: 2rpx solid #fff;
      }
      &-cover {
        @include abscenter;
      }
      &-sex {
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 28rpx;
        height: 28rpx;
      }
    }
    &-content {
      @include ver;
      margin-left: 14rpx;
      &-top {
        @include hor;
        align-items: center;
        &-title {
          font-family: PingFang SC, PingFang SC;
          line-height: 44rpx;
          @include text-overflow-line(1);
          max-width: 30vw;
          font-weight: 500;
          font-size: 34rpx;
          color: #FFFFFF;
          line-height: 40rpx;
        }
      }
      &-bottom {
        min-width: 120rpx;
        padding-right: 14rpx;
        background: linear-gradient( 90deg, #E07B98 0%, #FF5485 100%);
        border-radius: 16rpx;
        border: 1rpx solid rgba(255,255,255,0.5);
        box-sizing: border-box;
        margin-top: 8rpx;
        height: 32rpx;
        display: flex;
        align-items: center;
        &-tag{
          width: 32rpx;
          height: 32rpx;
        }
        &-title{
          margin-left: 8rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 22rpx;
          color: #FFFFFF;
        }
      }
      &-noPay {
        margin-top: 8rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 22rpx;
        color: rgba(255,255,255,0.8);
        line-height: 26rpx;
        line-height: 28rpx;
        @include hor;
        align-items: center;
        image {
          margin-left: 8rpx;
          width: 20rpx;
          height: 20rpx;
        }
      }
    }
    &-expiraDay{
      position: absolute;
      left: 56rpx;
      bottom: 104rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 20rpx;
      color: rgba($color: #fff, $alpha: 0.8);
      line-height: 23rpx;
    }
    &-tag{
      position: absolute;
      right: 0px;
      top: 0px;
      width: 184rpx;
      height: 46rpx;
      z-index: 1;
    }
    &-buyBox{
      position: absolute;
      left: 24rpx;
      bottom: 32rpx;
      width: 200rpx;
      height: 64rpx;
      background: #FF5485;
      border-radius: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      color: #FFFFFF;
      @include hor-center-center;
    }
    &-inviteBox{
      position: absolute;
      left: 268rpx;
      bottom: 0rpx;
      padding: 48rpx 0px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      color: #FFFFFF;
      line-height: 28rpx;
    }
    &-membershipBox{
      position: absolute;
      left: 24rpx;
      bottom: 32rpx;
      width: 200rpx;
      height: 64rpx;
      background: #FFFFFF;
      border-radius: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      color: #FF5485;
      @include hor-center-center;

    }
  }
  &-middleBox{
    margin: 10rpx 20rpx;
    @include hor;
    position: relative;
    image{
      display: flex;
      flex: 1;
    }
  }
  &-activityBox {
    margin-top: 18rpx;
    width: 100vw;
    position: relative;
    display: flex;
    &-bg {
      width: 100vw;
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      height: 750rpx;
    }
    &-empty {
      position: absolute;
      top: 300rpx;
      width: 304rpx;
      height: 304rpx;
      left: 50%;
      transform: translateX(-50%);
    }
    &-list {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin-top: 100rpx;
      z-index: 1;
      background: #f3f3f3;
      &-noData{
        padding: 20rpx 0 60rpx 0;
        width: calc(100vw - 10rpx);
        color: #979797;
        font-size: 26rpx;
        text-align: center;
      }
    }
  }
  &-levelBg {
    margin-top: -16rpx;
    margin-left: 20rpx;
    width: 710rpx;
    height: 224rpx;
    z-index: 1;
    position: relative;
  }
}
.popOpenGameBox{
  position: relative;
  width: 596rpx;
  height: 456rpx;
  &-bg{
    @include abscenter;
  }
  &-cancel{
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 96rpx;
    width: 50%;
    border-radius: 30rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 30rpx;
    color: #979797;
    @include hor-center-center;
  }
  &-sure{
    position: absolute;
    right: 0px;
    bottom: 0px;
    height: 96rpx;
    width: 50%;
    border-radius: 30rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 30rpx;
    color: #4E305B;
    @include hor-center-center;
  }
  &-space{
    position: absolute;
    left: 0px;
    right: 0px;
    height: 1rpx;
    bottom: 99rpx;
    background: rgba($color: #CBCCCE, $alpha: .3);
  }
  &-line{
    position: absolute;
    left: 50%;
    width: 1rpx;
    height: 99rpx;
    bottom: 0rpx;
    background: rgba($color: #CBCCCE, $alpha: .3);
  }
  &-inputBox{
    position: absolute;
    left: 48rpx;
    right: 48rpx;
    bottom: 148rpx;
    width: 504rpx;
    height: 88rpx;
    background: #F6F6F6;
    border-radius: 12rpx;
    padding: 24rpx;
    box-sizing: border-box;
    input{
      font-size: 28rpx;
    }
  }
}
.popNoteBox{
  position: relative;
  width: 418rpx;
  height: 310rpx;
  &-bg{
    @include abscenter;
  }
}
</style>