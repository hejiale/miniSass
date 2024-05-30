<template>
  <scroll-view scroll-y class="container">
    <div class="container-storeInfoBox">
      <div class="container-storeInfoBox-content">
        <div class="container-storeInfoBox-content-leftBox">
          <image :src="$filters.processLogo(shopInfo.storeLogo)" mode="aspectFill"/>
          <div class="container-storeInfoBox-content-leftBox-infoBox">
            <span>{{ shopInfo.storeName }}</span>
            <span>ID:{{ shopInfo.storeNumber || '' }}</span>
          </div>
        </div>
        <div
          v-if="!merchantInfo.commonApplyStatus"
          class="container-storeInfoBox-content-rightBox"
        >
          <div
            class="container-storeInfoBox-content-rightBox-openShop"
            @click="handleMerchant('start')"
          >
            商户认证
          </div>
          <span>认证后可对顾客发起收款和金额提现</span>
        </div>
        <div v-else class="container-storeInfoBox-content-rightBox">
          <div
            class="container-storeInfoBox-content-rightBox-openShop"
            @click="handleMerchant('end')"
          >
            {{ merchantStatus }}
          </div>
          <span>认证后可对顾客发起收款和金额提现</span>
        </div>
      </div>
      <div class="container-storeInfoBox-couponTag">
        <image src="../../static/image/icon-coupon.png" />
        <span>店铺卡券</span>
      </div>
      <div class="container-storeInfoBox-couponTagArrow" @click="onGoCoupon">
        <span>{{couponCount}}个待使用</span>
        <van-icon
          name="arrow"
          class="container-storeInfoBox-couponTagArrow-arrow"
        />
      </div>
    </div>
    <div class="container-noticeBox">
      <div class="container-noticeBox-top">
        <image src="../../static/image/icon-notice.png" />
        <span>店铺公告</span>
      </div>
      <span class="container-noticeBox-content">暂无公告</span>
    </div>
    <div class="container-applyBox">
      <div>
        <image
          :src="$iconFont.getIconName('icon-openDrama')"
          mode="aspectFill"
          @click="onGoMurderMystery"
        />
        <span class="title">开本</span>
        <span class="subTitle">已开{{manageCount.dramaRecordCount || 0}}场</span>
      </div>
      <div>
        <image
          :src="$iconFont.getIconName('icon-applyDrama')"
          mode="aspectFill"
          @click="onGoApply"
        />
        <span class="title">领本</span>
        <span class="subTitle">可领{{manageCount.unapplyDramaCount || 0}} 已领{{manageCount.applyDramaCount || 0}}</span>
      </div>
    </div>
    <div
      class="container-activityBox"
      v-if="activityList && activityList.length"
    >
      <div class="container-activityBox-tagBox">
        <img
          src="../../static/image/activity-tag.png"
          class="container-activityBox-tagBox-tag"
        />
        <span>限时活动</span>
      </div>
      <scroll-view class="container-activityBox-swiper" scroll-x>
        <div
          v-for="(item, index) in activityList"
          :key="index"
          class="container-activityBox-swiper-item"
          :style="index === 0 ? 'margin-left:20rpx': (index === 1 ? 'margin-right:32rpx' : '')"
          @click="onClickCoupon(item)"
        >
          <image
            :src="$iconFont.getIconName('activity-bg')"
            class="container-activityBox-swiper-item-bg"
            mode="aspectFill"
          />
          <div class="container-activityBox-swiper-item-infoBox">
            <div class="container-activityBox-swiper-item-infoBox-title">{{item.activityName}}</div>
            <div class="container-activityBox-swiper-item-infoBox-date">
              活动时间：{{$dayjs(item.activityStartTime).format("MM月DD日")}}-{{$dayjs(item.activityEndTime).format("MM月DD日")}}
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <div class="container-waitBox">
      <div class="container-waitBox-tagBox">
        <image src="../../static/image/icon-wait-tag.png" />
        <span>待处理</span>
      </div>
      <div class="container-waitBox-dataBox">
        <div class="container-waitBox-dataBox-item">
          <span style="color: #14c9c9">0</span>
          <div class="container-waitBox-dataBox-item-bottom">
            <span>小卖部</span>
            <van-icon
              name="arrow"
              size="22rpx"
              color="#ccc"
              style="padding-top: 3rpx"
            />
          </div>
        </div>
        <div class="container-waitBox-dataBox-item">
          <span style="color: #14c9c9">0</span>
          <div class="container-waitBox-dataBox-item-bottom">
            <span>剧本外卖</span>
            <van-icon
              name="arrow"
              size="22rpx"
              color="#ccc"
              style="padding-top: 3rpx"
            />
          </div>
        </div>
        <div class="container-waitBox-dataBox-item">
          <span style="color: #14c9c9">0</span>
          <div class="container-waitBox-dataBox-item-bottom">
            <span>组局数</span>
            <van-icon
              name="arrow"
              size="22rpx"
              color="#ccc"
              style="padding-top: 3rpx"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="container-waitBox" style="margin-top: 0">
      <div class="container-waitBox-tagBox">
        <image src="../../static/image/icon-week-tag.png" />
        <span>营收概况</span>
      </div>
      <div class="container-waitBox-dataBox">
        <div class="container-waitBox-dataBox-item">
          <span>0</span>
          <div class="container-waitBox-dataBox-item-bottom">
            <span>今日营收</span>
          </div>
        </div>
        <div class="container-waitBox-dataBox-item">
          <span>0</span>
          <div class="container-waitBox-dataBox-item-bottom">
            <span>本月营收</span>
            <van-icon
              name="arrow"
              size="22rpx"
              color="#ccc"
              style="padding-top: 3rpx"
            />
          </div>
        </div>
        <div class="container-waitBox-dataBox-item">
          <span>0</span>
          <div class="container-waitBox-dataBox-item-bottom">
            <span>进店人数(周)</span>
            <van-icon
              name="arrow"
              size="22rpx"
              color="#ccc"
              style="padding-top: 3rpx"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="container-menuBox">
      <div
        class="container-menuBox-item"
        v-for="(item, index) in menus"
        :key="index"
      >
        <div class="container-menuBox-item-titleBox">
          <image src="../../static/image/icon-commonFunctions.png" />
          <span>{{ item.data.name }}</span>
        </div>
        <div class="container-menuBox-item-box">
          <div
            class="container-menuBox-item-box-menu"
            v-for="(it, idx) in item.children"
            :key="idx"
            @click="onGoMenus(it.data)"
          >
            <div class="container-menuBox-item-box-menu-info">
              <img :src="$iconFont.getIconName(it.data.icon)" alt="" />
              <span>{{ it.data.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popCoupon" @click="popCoupon = false" v-if="popCoupon">
      <div class="popCoupon-content">
        <span>活动详情</span>
        <span>活动名称：{{currentAcitivty.activityName}}</span>
        <span>活动时间：{{$dayjs(currentAcitivty.activityStartTime).format("MM月DD日")}}至
          {{$dayjs(currentAcitivty.activityEndTime).format("MM月DD日")}}</span>
        <span>{{currentAcitivty.remark || ""}}</span>
        <span>进度：{{currentAcitivty.curNum}}/{{currentAcitivty.targetNum}}</span>
        <div>我知道了</div>
        <image src="../../static/image/pop-close.png"/>
      </div>
    </div>
  </scroll-view>
</template>
<script>
import service from "../../utils/service";
export default {
  props: {
    merchantInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      shopInfo: {},
      userInfor: null,
      menus: [],
      activityList: [],
      popCoupon: false,
      manageCount: {},
      couponCount: 0,
      currentAcitivty: null
    };
  },
  async created() {
    this.shopInfo = JSON.parse(uni.getStorageSync("shopInfo"));
    this.userInfor = await this.$checkLogin.getUserInfo();
    await this.queryMenus();
    await this.queryCouponActivity();
  },
  computed:{
    merchantStatus(){
      if(!this.merchantInfo)return "";
      if(this.merchantInfo.commonApplyStatus === 'ACTIVATE'){
        return '已认证'
      }else if(this.merchantInfo.commonApplyStatus === 'LIANLIAN_PASS'){
        return '待激活'
      }else if(this.merchantInfo.commonApplyStatus === "PLATFORM_PENDING" || this.merchantInfo.commonApplyStatus === 'LIANLIAN_PENDING'){
        return '审核中'
      }else if(this.merchantInfo.commonApplyStatus === 'REJECTED'){
        return '认证未通过'
      }
    }
  },
  methods: {
    onGoCoupon() {
      uni.navigateTo({
        url: "./coupon-packet",
      });
    },
    //查询常用功能菜单
    async queryMenus() {
      try {
        let data = await service.getStoreUserFunctions({
          storeId: uni.getStorageSync("storeId"),
          userId: this.userInfor.id,
        });

        let index = data.findIndex((it) => it.data.name === "常用功能");
        if(index !== -1){
          this.menus = [data[index]];
        }
        
      } catch (e) {}
    },
    onGoMenus(item) {
      if(item.path !== '--'){
        uni.navigateTo({
          url: item.path,
        });
      }else{
        wx.showToast({
          icon:'none',
          title: '功能升级中'
        })
      }
    },
    onClickCoupon(coupon){
      this.currentAcitivty = coupon;
      this.popCoupon = true;
    },
    onGoApply() {
      uni.navigateTo({
        url: "/applyDrama/pages/index",
      });
    },
    onGoMurderMystery() {
      uni.navigateTo({
        url: "/murderMysteryList/pages/index",
      });
    },
    handleMerchant(type) {
      if (type === "end") {
        //需要区分是个人进件还是企业进件
        if(this.merchantInfo.lianlianApplyType === 'BUSINESS'){
          uni.navigateTo({
            url: `/enterprise/pages/apply-detail?storeId=${this.merchantInfo.sourceId}&delta=${1}`,
          });
        }else{
          uni.navigateTo({
            url: `/individual/pages/apply-detail?storeId=${this.merchantInfo.sourceId}&delta=${1}`,
          });
        }
      } else if (type === "start") {
        uni.navigateTo({
          url: `/incomingParts/pages/index`,
        });
      }
    },
    //查询限时活动
    async queryCouponActivity() {
      try {
        let res = await service.getActivityInAction({
          storeId: uni.getStorageSync("storeId"),
          targetType: 'STORE',
          userId: this.userInfor.id
        });
        if (res.length) {
          this.activityList = res;
        }
      } catch (e) {}
    },
    async queryStoreManageCount(){
      try{
        this.manageCount = await service.getStoreDramaCount({
          id: uni.getStorageSync("storeId")
        })
        let res = await service.myTicket({couponTicketStatus: 'CAN_USE', storeId: uni.getStorageSync("storeId"), targetType: 'STORE'});
        this.couponCount = res ? res.length: 0
      }catch(e){}
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 81vh;
  &-storeInfoBox {
    margin: 0 32rpx;
    height: rpx(102);
    background: #ffffff;
    border-radius: 8px;
    position: relative;
    &-content {
      width: 100%;
      height: rpx(65);
      background: linear-gradient(136deg, #aaeddd 0%, #f4f1df 100%);
      border-radius: 8px;
      position: relative;
      &-leftBox {
        @include hor;
        align-items: center;
        position: absolute;
        left: rpx(10);
        top: rpx(14);
        image {
          width: rpx(36);
          height: rpx(36);
          border-radius: 36px;
        }
        &-infoBox {
          @include ver;
          margin-left: rpx(8);
          width: 50%;
          span:nth-child(1) {
            font-size: rpx(15);
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 18px;
            @include text-overflow-line(1);
          }
          span:nth-child(2) {
            font-size: rpx(11);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 13px;
            margin-top: rpx(2);
          }
        }
      }
      &-rightBox {
        position: absolute;
        right: rpx(10);
        top: rpx(13);
        @include ver;
        align-items: flex-end;
        &-openShop {
          width: rpx(86);
          height: rpx(26);
          background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
          border-radius: 16px;
          @include hor-center-center;
          font-size: rpx(12);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }
        span:nth-child(2) {
          font-size: rpx(9);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #14c9c9;
          line-height: 12px;
          margin-top: rpx(3);
        }
      }
    }
    &-couponTag {
      position: absolute;
      left: rpx(10);
      bottom: rpx(0);
      padding-bottom: rpx(10);
      @include hor;
      align-items: center;
      image {
        width: rpx(14);
        height: rpx(14);
      }
      span:nth-child(2) {
        margin-left: rpx(4);
        font-size: rpx(12);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
    }
    &-couponTagArrow {
      position: absolute;
      right: rpx(0);
      bottom: rpx(0);
      padding-bottom: rpx(11);
      padding-right: rpx(10);
      @include hor;
      align-items: center;
      span {
        font-size: rpx(11);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      &-arrow {
        color: #999999;
        transform: translateY(2rpx);
      }
    }
  }
  &-noticeBox {
    margin: rpx(16);
    padding: rpx(10);
    background: #fff;
    border-radius: 4px;
    @include ver;
    &-top {
      @include hor;
      align-items: center;
      image {
        width: rpx(18);
        height: rpx(18);
      }
      span {
        margin-left: rpx(6);
        font-size: rpx(15);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
      }
    }
    &-content {
      margin-top: rpx(8);
      font-size: rpx(11);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 13px;
      @include text-overflow-line(2);
    }
  }
  &-activityBox {
    margin: rpx(16);
    padding: rpx(10) 0;
    background: linear-gradient(180deg, #ffe5e5 0%, #ffffff 100%);
    border-radius: 8px;
    &-tagBox {
      @include hor;
      align-items: center;
      margin-left: rpx(10);
      &-tag {
        width: rpx(18);
        height: rpx(18);
      }
      span {
        margin-left: rpx(6);
        font-size: rpx(15);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        line-height: 18px;
      }
    }
    &-swiper {
      margin-top: rpx(10);
      overflow-x: scroll;
      white-space: nowrap;
      &-item {
        display: inline-block;
        width: 74.6vw;
        position: relative;
        margin-right: rpx(16);
        &-bg {
          width: 100%;
          height: 13.1vh;
        }
        &-infoBox {
          @include abscenter;
          padding: rpx(15);
          &-title {
            font-size: rpx(17);
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ee6155;
            @include text-overflow-line(2);
            word-break: break-all;
            white-space: pre-wrap;
          }
          &-date {
            margin-top: rpx(17);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
          }
        }
      }
    }
  }
  &-applyBox {
    margin: rpx(16);
    @include hor;
    align-items: center;
    position: relative;
    div {
      display: flex;
      flex: 1;
      position: relative;
      height: 8.3vh;
      .title {
        position: absolute;
        left: rpx(12);
        top: rpx(14);
        font-size: rpx(16);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 19px;
      }
      .subTitle {
        position: absolute;
        left: rpx(12);
        top: rpx(40);
        font-size: rpx(10);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        line-height: 12px;
      }
    }
    div:nth-child(2) {
      margin-left: rpx(15);
    }
  }
  &-waitBox {
    margin: rpx(16);
    background: #ffffff;
    border-radius: 8px;
    padding-bottom: rpx(10);
    &-tagBox {
      margin-left: rpx(10);
      padding-top: rpx(10);
      @include hor;
      align-items: center;
      image:nth-child(1) {
        width: rpx(22);
        height: rpx(22);
        padding-right: 12rpx;
      }
      span:nth-child(2) {
        font-size: rpx(16);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        transform: translateY(-2rpx);
      }
    }
    &-dataBox {
      margin-top: rpx(17);
      @include hor;
      align-items: center;
      &-item {
        @include ver;
        align-items: center;
        flex: 1;
        span:nth-child(1) {
          font-size: rpx(16);
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 19px;
        }
        &-bottom {
          @include hor;
          align-items: center;
          margin-top: 12rpx;
          span:nth-child(1) {
            font-size: 20rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: rpx(10);
          }
        }
      }
    }
  }
  &-menuBox {
    @include ver;
    align-items: center;
    margin: 0 rpx(16);
    border-radius: rpx(8);
    &-item {
      margin-bottom: 28rpx;
      width: 100%;
      background: #ffffff;
      border-radius: 16rpx;
      @include ver;
      &-titleBox {
        @include hor;
        align-items: center;
        margin: 20rpx 0 0 20rpx;
        image {
          width: rpx(18);
          height: rpx(18);
        }
        span {
          margin-left: rpx(6);
          font-size: 30rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          line-height: 36rpx;
          color: rgba(0, 0, 0, 0.9);
        }
      }
      &-box {
        padding-bottom: 32rpx;
        &-menu {
          margin-top: 30rpx;
          width: 25%;
          display: inline-block;
          position: relative;
          &-info {
            width: 100%;
            height: 100%;
            @include ver;
            align-items: center;
            img {
              width: 76rpx;
              height: 76rpx;
            }
            span {
              margin-left: 0px !important;
              margin-top: 12rpx !important;
              font-size: 24rpx;
              font-family: Inter-Regular, Inter;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
    }
  }
}
.popCoupon {
  @include fiexcenter;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  @include hor-center-center;
  &-content {
    width: 72vw;
    padding: rpx(24);
    background: #ffffff;
    border-radius: 16px;
    @include ver;
    position: relative;
    span:nth-child(1) {
      font-size: rpx(18);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      text-align: center;
    }
    span:nth-child(2), span:nth-child(3), span:nth-child(4), span:nth-child(5) {
      margin-top: rpx(16);
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
    div:nth-child(6) {
      margin-top: rpx(28);
      width: 100%;
      height: 44px;
      background: #14c9c9;
      border-radius: 40px;
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      @include hor-center-center;
    }
    image{
      position: absolute;
      bottom: -60px;
      width: rpx(36);
      height: rpx(36);
      margin-left: 30vw;
    }
  }
}
</style>
