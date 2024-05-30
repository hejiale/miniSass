<template>
  <view class="container" v-if="isEndLoad">
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          style="color: #fff"
          size="50rpx"
        />
      </view>
      <view slot="content">
        <image
          mode="aspectFill"
          class="content-bg"
          :src="$filters.filterBlur(detailsForm.dramaCover)"
        />
        <img
          :src="$iconFont.getIconName('icon-detail-bg')"
          alt=""
          class="fixedBg"
        />
        <scroll-view class="content" scroll-y>
          <div class="content-info">
            <div class="content-info-cover" @click="handlePreview(detailsForm.dramaCover)">
              <image
                :src="$filters.processImage(detailsForm.dramaCover, 320)"
                alt=""
                mode="aspectFill"
              />
              <div class="content-info-cover-tagBox"  v-if="detailsForm.activeLastCount !== null && detailsForm.activeLastCount > 0">
                  再开{{detailsForm.activeLastCount}}场
              </div>
              <div class="content-info-cover-tag"  v-if="detailsForm.activeLastCount !== null && detailsForm.activeLastCount === 0">
              </div>
            </div>
            <span class="content-info-name">{{ detailsForm.dramaName }}</span>
          </div>
          <view class="content-detail">
            <div class="content-detail-tag">
              <img src="../static/image/label-1.png" />
              <span
                >{{
                  detailsForm.maleGamerNum
                    ? detailsForm.maleGamerNum + "男"
                    : ""
                }}{{
                  detailsForm.femaleGamerNum
                    ? detailsForm.femaleGamerNum + "女"
                    : ""
                }}</span
              >
              <img src="../static/image/time.png" />
              <span>{{ detailsForm.gameTime + "小时" }}</span>
              <img src="../static/image/age.png" />
              <span
                >适龄
                {{
                  $enums.DramaAgeAppropriate.getName(
                    detailsForm.dramaAgeAppropriate
                  )
                }}</span
              >
            </div>
          </view>
          <div class="content-author">
            <div class="content-author-title">
              <span class="content-author-title-top">剧本类型</span>
            </div>
          </div>
          <scroll-view class="content-tagList" scroll-x>
            <div class="content-tagList-tag">
              {{ detailsForm.maxGamerNum }}人
            </div>
            <div
              v-for="(tag, idx) in detailsForm.dicts"
              :key="idx"
              class="content-tagList-tag"
            >
              {{ tag.dictValue }}
            </div>
          </scroll-view>
          <div class="content-author">
            <div class="content-author-title">
              <span class="content-author-title-top">作者/发行方</span>
              <div class="content-author-title-content">
                <span v-for="item in detailsForm.authorItems" :key="item.id"
                  >{{ item.authorName }}/
                </span>
                <span
                  v-for="(item, index) in detailsForm.publishers"
                  :key="item.id"
                  >{{
                    item.publisherName +
                      (index + 1 < detailsForm.publishers.length ? "/" : "")
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="content-desc" :style="'padding-bottom: 204rpx;'">
            <div class="content-desc-title">
              <span>剧情简介</span>
              <!-- <span @click="onExpand">{{ isExpand ? "收起" : "展开" }}</span> -->
            </div>
            <expandContent
              :content="detailsForm.content"
              :isShowArrow="false"
              :isShowExpand="false"
              @on-change-expand="onChangeExpand"
              ref="expandContent"
            ></expandContent>
            <scroll-view
              class="content-scroll"
              scroll-x
              v-if="detailsForm.dramaRoleList && detailsForm.dramaRoleList.length"
            >
              <view
                class="content-scroll-item"
                v-for="item in detailsForm.dramaRoleList"
                :key="item.id"
                @click="previewImage(item.roleUrl)"
              >
                <img
                  :src="$filters.processImage(item.roleUrl, 160)"
                  alt=""
                  mode="aspectFill"
                />
              </view>
            </scroll-view>
          </div>
          <div class="content-bottomBg">
            <img src="../static/image/icon-dramaDetail-buyBg.png" alt="" />
          </div>
        </scroll-view>
      </view>
    </navigation-bar>
    <div
      class="boxOfficePrice"
    >
      <div class="boxOfficePrice">
        <div
          class="boxOfficePrice-standard"
          @click="ticketPurchase"
          v-if="isApply && detailsForm.isHasBoxOfficeProduct"
        >
          {{
            detailsForm.currentPrice
              ? `￥${detailsForm.currentPrice / 100} 开场
              `
              : "免费"
          }}
        </div>
        <div
          class="boxOfficePrice-standard"
          @click="goApply"
          v-else-if="!isApply && detailsForm.isHasBoxOfficeProduct"
        >
          立即申领
        </div>
        <div class="boxOfficePrice-standard" v-else>
          正在努力准备
        </div>
      </div>
    </div>
    <van-action-sheet
      :show="couponPackage"
      :safe-area-inset-bottom="false"
      close-on-click-overlay
      @click-overlay="couponPackage = false"
    >
      <view class="couponPackage">
        <view class="couponPackage-price">
          <view class="couponPackage-price-left">开场价格</view>
          <view class="couponPackage-price-right">
            <span class="couponPackage-price-right-first"
              >￥{{ detailsForm.currentPrice / 100 || 0 }}</span
            >
            <view class="couponPackage-price-right-last">
              <span>实付</span>
              <span>
                ￥{{
                  currentCoupon
                    ? (detailsForm.currentPrice - currentCoupon.cutPrice) /
                        100 <
                      0
                      ? 0
                      : (detailsForm.currentPrice - currentCoupon.cutPrice) /
                        100
                    : detailsForm.currentPrice / 100
                }}</span
              >
            </view>
          </view>
        </view>
        <view class="couponPackage-tips"
          >若使用优惠券开本，未支付成功，优惠券将在半小时后退回</view
        >
        <scroll-view class="couponPackage-scroll" scroll-y>
          <view
            class="couponPackage-scroll-couponItemEmpty"
            @click="currentCoupon = null"
          >
            <view class="couponPackage-scroll-couponItemEmpty-name"
              >不使用券</view
            >
            <view class="couponPackage-scroll-couponItemEmpty-isChk">
              <image
                :src="
                  currentCoupon
                    ? '../static/image/unchecked.png'
                    : '../static/image/checked.png'
                "
              />
            </view>
          </view>
          <view
            class="couponPackage-scroll-couponItem"
            v-for="item in MyTicketList"
            :key="item.id"
            @click="onSelectCoupon(item)"
          >
            <view class="couponPackage-scroll-couponItem-left">
              <view class="couponPackage-scroll-couponItem-left-price">
                <span>￥</span><span>{{ item.cutPrice / 100 }}</span>
              </view>
              <view class="couponPackage-scroll-couponItem-left-type">{{
                "开本券"
              }}</view>
            </view>
            <view class="couponPackage-scroll-couponItem-middle">
              <view class="couponPackage-scroll-couponItem-middle-name">
                <view>{{ item.couponName }}</view>
                <!-- <view v-if="item.couponType == 'FEE_CUT'">满999元可用</view> -->
              </view>
              <view
                class="couponPackage-scroll-couponItem-middle-restrict"
                v-if="item.gmt > 86400000"
                >有效期至{{ item.useEndTime }}</view
              >
              <view
                class="couponPackage-scroll-couponItem-middle-restrict"
                :class="'today'"
                v-else-if="
                  item.gmt < 86400000 &&
                    item.gmt >= 0 &&
                    item.couponUseStatus == 'NOT_USED'
                "
                >有效期剩余{{ getCountDown(item.gmt) }}</view
              >
            </view>
            <view class="couponPackage-scroll-couponItem-right">
              <image
                :src="
                  currentCoupon.id == item.id
                    ? '../static/image/checked.png'
                    : '../static/image/unchecked.png'
                "
              />
            </view>
          </view>
          <view class="couponPackage-scroll-tips" v-if="notMyTicketList.length">
            不适用当前商品
          </view>
          <view
            class="couponPackage-scroll-couponItem"
            v-for="item in notMyTicketList"
            :key="item.id"
            style="opacity: 0.6;"
          >
            <view class="couponPackage-scroll-couponItem-left">
              <view class="couponPackage-scroll-couponItem-left-price">
                <span>￥</span><span>{{ item.cutPrice / 100 }}</span>
              </view>
              <view class="couponPackage-scroll-couponItem-left-type">{{
                "开本券"
              }}</view>
            </view>
            <view class="couponPackage-scroll-couponItem-middle">
              <view class="couponPackage-scroll-couponItem-middle-name">
                <view>{{ item.couponName }}</view>
                <!-- <view v-if="item.couponType == 'FEE_CUT'">满999元可用</view> -->
              </view>
              <view
                class="couponPackage-scroll-couponItem-middle-restrict"
                v-if="item.gmt > 86400000"
                >有效期至{{ item.useEndTime }}</view
              >
              <view
                class="couponPackage-scroll-couponItem-middle-restrict"
                :class="'today'"
                v-else-if="
                  item.gmt < 86400000 &&
                    item.gmt >= 0 &&
                    item.couponUseStatus == 'NOT_USED'
                "
                >有效期剩余{{ getCountDown(item.gmt) }}</view
              >
            </view>
          </view>
        </scroll-view>

        <!-- <view class="couponPackage-discounts">
          <span>优惠券</span>
          <span v-if="currentCoupon"
            >-￥{{ currentCoupon.cutPrice / 100 }}</span
          >
          <span
            v-else
            style="font-weight: 400;
      color: #999999;"
            >未选择优惠券</span
          >
        </view> -->
        <view class="couponPackage-btn" @click="onCreateRoom"
          >确认支付 ￥{{
            currentCoupon
              ? (detailsForm.currentPrice - currentCoupon.cutPrice) / 100 < 0
                ? 0
                : (detailsForm.currentPrice - currentCoupon.cutPrice) / 100
              : detailsForm.currentPrice / 100
          }}</view
        >
      </view>
    </van-action-sheet>
    <van-action-sheet
      :show="isContinueGame"
      :safe-area-inset-bottom="false"
      close-on-click-overlay
      @click-overlay="isContinueGame = false"
      class="continueGame"
    >
      <view class="continueGame-title">提示</view>
      <view class="continueGame-text"> {{ title }}</view>
      <view class="continueGame-btn">
        <view
          class="continueGame-btn-left"
          @click="isContinueGame = false"
          v-if="titleType != 'ORDER'"
          >取消</view
        >
        <button class="continueGame-btn-left" v-if="titleType == 'ORDER'">
          联系客服
        </button>
        <view
          class="continueGame-btn-right"
          @click="onOrderDetail"
          v-if="titleType == 'ORDER'"
          >去支付</view
        >
        <view
          class="continueGame-btn-right"
          @click="continueGame"
          v-if="titleType == 'GAME'"
          >回到房间</view
        >
        <view
          class="continueGame-btn-right"
          @click="isContinueGame = false"
          v-if="titleType == 'APPLY'"
          >继续申领</view
        >
      </view>
    </van-action-sheet>
  </view>
</template>
<script>
import navigationBar from "../../components/navigation-bar";
import vanImage from "@/wxcomponents/vant/image/index";
import BindPhone from "../../components/bindPhone/index.vue";
import expandContent from "../components/expandContent.vue";
import service from "../utils/service";
import gameService from "@/services/game.js"
export default {
  components: {
    navigationBar,
    vanImage,
    expandContent,
    BindPhone
  },
  data() {
    return {
      detailsForm: null,
      customNav: {
        bgHeight: "100vh",
        navTitle: "剧本详情",
        color: "#fff",
        hideBg: true,
        customizeLeft: true,
      },
      options: null,
      shopInfo: null,
      isExpand: false,
      userInfo: null,
      isContinueGame: false, //判断是否有进行中的游戏
      foundHome: false,
      isEndLoad: false, //全局加载完的标识
      canPay: false, //按钮重复点击flag
      couponPackage: false, //优惠券弹窗
      MyTicketList: [], //可使用优惠券列表
      notMyTicketList: [],
      currentCoupon: null, //当前选中的优惠券
      noPayInfo: null, //未支付订单信息
      murderMysteryOnlineRecord: null,
      isApply: false,
      msg: false,
      title: null,
      titleType: null
    };
  },
  async onLoad(OPTIONS) {
    this.options = OPTIONS;
    await this.getShopInfo(OPTIONS.storeId);
    await this.shopDetail(OPTIONS);
  },
  async onShow() {
    await this.Userinfo();
    await this.judgeIsApply();
    await this.getMyTicketList();
    await this.getGMT();
  },
  onShareAppMessage() {
    return {
      title: this.detailsForm.dramaName,
      path: `/scriptNavigation/pages/Details?scriptID=${this.detailsForm.id}&storeId=${this.shopInfo.id}`,
    };
  },
  computed: {
    getCountDown() {
      return function(data) {
        var time;
        var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((data % (1000 * 60)) / 1000);
        time =
          (hours < 10 ? "0" + hours : hours) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes) +
          ":" +
          (seconds < 10 ? "0" + seconds : seconds);
        return time;
      };
    },
  },
  watch: {
    couponPackage() {
      if (this.couponPackage) {
        this.currentCoupon = this.MyTicketList[0];
      } else {
        this.currentCoupon = null;
      }
    },
  },
  methods: {
    onSelectCoupon(v){
      this.currentCoupon = v;
    },
    async judgeIsApply() {
      let data = await service.dramaIsApply({
        dramaId: this.options.scriptID,
        storeId: uni.getStorageSync("storeId"),
      });
      this.isApply = data.isApply;
      this.msg = data.msg;
    },
    onExpand() {
      this.$refs.expandContent.onExpand();
    },
    onChangeExpand(isExpand) {
      this.isExpand = isExpand;
    },
    //检查未支付订单信息
    async checkOrder() {
      try {
        this.noPayInfo = await service.checkProductOrder({
          productId: this.detailsForm.productId,
          storeId: uni.getStorageSync("storeId"),
          productType: 'BOX_OFFICE_PRODUCT',
          userId: this.userInfo.id,
        });
      } catch (error) {}
    },
    async gamerStart(id) {
      this.murderMysteryOnlineRecord = await service.onlineGameStartGame({
        dmId: this.userInfo.id,
        dramaId: this.options.scriptID,
        orderId: id,
        storeId: uni.getStorageSync("storeId"),
      });
    },
    //支付/创建房间
    async onCreateRoom() {
      this.$checkLogin.doPay(
        this.userInfo.id,
        this.detailsForm.currentPrice,
        this.detailsForm.productType,
        this.detailsForm.dramaName,
        this.detailsForm.productId,
        'STORE_USER',
        "USER",
        1,
        null,
        uni.getStorageSync("storeId"),
        this.currentCoupon
      ).then(data=>{
        if (
          (this.currentCoupon &&
          this.detailsForm.currentPrice - this.currentCoupon.cutPrice <= 0) || this.detailsForm.currentPrice === 0
        ) {
          uni.navigateTo({
            url: `/game-DM/pages/index`,
          });
        }else{
          this.couponPackage = false;

          uni.showToast({
            title: "支付成功！",
          });
          // 查询开本状态，成功了就跳转DM房间
          this.getStatus() 
        }
      })
    },
    async ticketPurchase() {
      await this.checkOrder();
      //已创单未支付的情况
      if (
        this.noPayInfo &&
        this.noPayInfo.orderInfo &&
        this.noPayInfo.orderInfo[0].orderStatus === "NOT_PAY"
      ) {
        this.title = "存在待支付订单，是否继续支付";
        this.titleType = "ORDER";
        this.isContinueGame = true;
        uni.hideLoading();
        return;
      }

      let e = await gameService.checkUserCurrentGame({
        storeId: uni.getStorageSync("storeId"),
        userId: this.userInfo.id
      })
      if(e.flag && !e.isDM){
        wx.showToast({
          title: '你有正在玩的票房本',
          icon: 'none'
        })
        return;
      }
      
      if (this.foundHome) return;
      this.foundHome = true;
      //判断是否有未结束的游戏
      let userId = this.userInfo.id;
      let res = await service.onlineGameCheckOnlineGame({
        dmId: userId,
        storeId: uni.getStorageSync("storeId"),
      });

      if (res.murderMysteryOnlineRecord) {
        this.title = "有剧本正在游戏中，请关闭后再开本";
        this.titleType = "GAME";
        this.isContinueGame = true;
        this.foundHome = false;
        return;
      }
      this.foundHome = false;
      if (this.MyTicketList.length && this.detailsForm.currentPrice) {
        this.couponPackage = true;
      } else {
        this.onCreateRoom();
      }
    },
    goApply() {
      this.title = "若您已在其他渠道申领或已获得当前剧本请先咨询客服";
      this.titleType = "APPLY";
      this.isContinueGame = true;
    },
    async continueGame() {
      uni.navigateTo({
        url: `/game-DM/pages/index`,
      });
      this.isContinueGame = false;
    },
    //去订单页
    onOrderDetail() {
      uni.navigateTo({
        url: `/order/pages/detail?id=${this.noPayInfo.orderInfo[0].id}`,
      });
      this.isContinueGame = false;
    },
    //授权成功后，重新获取用户信息
    onSuccessAuthorize() {
      this.Userinfo();
    },
    async shopDetail(options) {
      let data = await service.dramaQueryDramaDetail({
        id: options.scriptID,
        productId: options.productId,
        storeId: uni.getStorageSync("storeId")
      });
      this.detailsForm = data;
      this.isEndLoad = true;
    },
    backRoute() {
      if (getCurrentPages().length === 1) {
        uni.reLaunch({
          url: '/manage/pages/index'
        })
      } else {
        uni.navigateBack();
      }
    },
    previewImage(url) {
      wx.previewImage({
        current: url,
        urls: this.detailsForm.dramaRoleList.map(it=>it.roleUrl),
        // showmenu: false,
        longPressActions: {
              itemList: ['发送给朋友', '保存图片', '收藏'],
              success: function(data) {
              },
              fail: function(err) {
              }
          }
      });
    },
    onCopy() {
      uni.setClipboardData({
        data: this.shopInfo.wxNumber,
        success: function() {
          uni.showToast({
            title: "微信号复制成功",
          });
        },
      });
    },
    async Userinfo() {
      let data = await this.$checkLogin.getUserInfo();
      this.userInfo = data;
    },
    async getShopInfo(storeId) {
      if (getCurrentPages().length === 1) {
        //切换店铺
        this.shopInfo = await this.$api.getStoreHome({
          storeId,
          userId: this.userInfo.id
        });
        uni.setStorageSync("storeId", this.shopInfo.id);
        uni.setStorageSync("shopInfo", JSON.stringify(this.shopInfo));
      } else {
        this.shopInfo = JSON.parse(uni.getStorageSync("shopInfo"));
      }
    },
    //获取优惠券列表
    async getMyTicketList() {
      let res = await service.myTicket({
        storeId: uni.getStorageSync("storeId"),
        // userId: this.userInfo.id,
        targetType: 'STORE',
        couponTicketStatus: "CAN_USE",
        // dramaId: this.detailsForm.id
      });
      this.MyTicketList = [];
      this.notMyTicketList = [];
      res.map((v) => {
        v.gmt = this.$dayjs(v.useEndTime) - Date.now();
        if (v.couponUseStatus == "LOCKED") {
          v.lockTime = this.$dayjs(v.updateTime) - Date.now() + 3600000;
        }
      });
      res.map((v) => {
        let canUse = v.productApplicableVOList.findIndex(
          (item) => item.productType == "BOX_OFFICE_PRODUCT" && item.isAll
        );
        if (
          v.couponUseStatus != "LOCKED" &&
          this.$dayjs(v.useStartTime) < Date.now()
        ) {
          if (canUse >= 0) {
            this.MyTicketList.push(v);
          } else {
            v.productApplicableVOList.map((val) => {
              val.limitedProduct.map((value) => {
                if (value.productId == this.detailsForm.productId) {
                  this.MyTicketList.push(v);
                }
              });
            });
          }
        }
      });
      let arr = [];
      this.MyTicketList.map((v) => {
        arr.push(v.id);
      });
      this.notMyTicketList = res.filter((v) => {
        return arr.indexOf(v.id) == -1;
      });
    },
    getGMT() {
      this.time = setInterval(() => {
        this.MyTicketList.map((v) => {
          v.gmt = v.gmt - 1000;
          if (v.lockTime) {
            v.lockTime = v.lockTime - 1000;
            if (v.lockTime <= 0 && this.couponTicketStatus == "CAN_USE") {
              this.getMyTicketList();
            }
          }
        });
      }, 1000);
    },
    async getStatus() {
      const delayTime =  1000*2
      uni.showLoading();
      let res = await service.onlineGameCheckOnlineGame({
        dmId: this.userInfo.id,
        storeId: uni.getStorageSync("storeId"),
      });
      if (res.murderMysteryOnlineRecord && res.murderMysteryOnlineRecord.id) {
         uni.hideLoading();
         // 清除定时器
          clearInterval(this.timer)
          uni.navigateTo({
            url: `/game-DM/pages/index`,
          });
      } else {
          // 清除定时器
          clearInterval(this.timer)
          this.timer = setInterval(() => {
              this.getStatus()
          }, delayTime)
      }
    },
    handlePreview(url) {
      uni.previewImage({
          urls: [url],
          longPressActions: {
              itemList: ['发送给朋友', '保存图片', '收藏'],
              success: function(data) {
              },
              fail: function(err) {
              }
          }
      });
    }
  }
}
</script>
<style lang="scss">
.fixedBg {
  background: unset !important;
}
.container {
  position: relative;
  width: 100%;
  overflow-x: hidden;
}
.navigation-bg {
  height: 60%;
}
.content {
  @include ver;
  align-items: center;
  &-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -2;
  }
  &-info {
    @include ver;
    align-items: center;
    &-cover {
      margin-top: 58rpx;
      width: 340rpx;
      height: 440rpx;
      border-radius: 16rpx;
      overflow: hidden;
      position: relative;
      &-tagBox{
        background-image: url('../static/image/list-tag-bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        right: 0;
        top: 0;
        width: rpx(72);
        height: rpx(19);
        font-size: 10px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        @include hor-center-center;
      }
      &-tagBox::after{
        font-family: PingFang SC-Semibold;
        content: '可1折';
      }
      &-tag{
        background-image: url('../static/image/list-tag.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        right: 0;
        top: 0;
        width: rpx(48);
        height: rpx(19);
      }
    }
    &-name {
      max-width: 80%;
      margin-top: 38rpx;
      font-size: 48rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      /* @include text-overflow-line(2); */
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  &-tagList {
    @include hor-center-center;
    margin: 18rpx 34rpx 0 34rpx;
    width: 90%;
    white-space: nowrap;
    &-tag {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 57px;
      font-size: 20rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      padding: 0 10rpx;
      margin-right: 12rpx;
    }
  }
  &-detail {
    margin-top: 18rpx;
    width: 100%;
    @include hor-center-center;
    color: #fff;
    font-size: 24rpx;
    font-family: OPPOSans-Regular, OPPOSans;
    font-weight: 400;
    &-tag {
      img {
        margin-left: 26rpx;
        width: 22rpx;
        height: 20rpx;
      }
      span {
        margin-left: 6rpx;
      }
    }
  }
  &-author {
    margin: 54rpx 34rpx 0 34rpx;
    &-title {
      @include ver;
      &-top {
        font-size: 32rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 32rpx;
      }
      &-content {
        display: flex;
        align-items: center;
        margin-top: 12rpx;
        flex-wrap: wrap-reverse;
        span {
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #cccccc;
          line-height: 32rpx;
        }
      }
    }
  }
  &-desc {
    margin: 50rpx 32rpx 0 32rpx;
    &-title {
      @include hor-between-center;
      :nth-child(1) {
        font-size: 32rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 32rpx;
      }
      :nth-child(2) {
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #14c9c9;
        line-height: 40rpx;
      }
    }
    /deep/.introduc {
      // .introduction {
      //   color: #cccccc !important;
      // }
      .unfold {
        background: unset !important;
        margin-left: 92% !important;
        span {
          color: #14c9c9 !important;
        }
      }
    }
  }
  &-videoBox {
    margin-left: rpx(16);
    padding-bottom: 240rpx;
    &-title {
      @include hor-between-center;
      :nth-child(1) {
        font-size: 32rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 32rpx;
      }
    }
    &-video {
      margin-top: rpx(16);
      border-radius: 8px;
      width: rpx(266);
      height: rpx(122);
    }
  }
  &-bottomBg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 260rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &-scroll {
    width: 100%;
    white-space: nowrap;
    margin-top: 42rpx;
    &-item {
      display: inline-block;
      width: 180rpx;
      height: 240rpx;
      margin-right: 24rpx;
      border-radius: 8rpx;
      overflow: hidden;
    }
  }
}
.bottom {
  position: fixed;
  left: 0;
  width: 100%;
  height: 180rpx;
  bottom: 0;
  z-index: 10;
  &-phone {
    position: absolute;
    top: 24rpx;
    left: 20rpx;
    width: 88rpx;
    height: 88rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &-price {
    position: absolute;
    right: 20rpx;
    top: 24rpx;
    width: 80%;
    height: 88rpx;
    border-radius: 82rpx;
    color: #fff;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    @include hor;
    align-items: center;
    justify-content: center;
  }
}
.boxOfficePrice {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  width: 100vw;
  height: rpx(96);
  bottom: 0;
  z-index: 10;
  background: #333333;
  border-radius: 24px 24px 0px 0px;
  &-standard {
    height: rpx(36);
    margin: rpx(16);
    background: #14c9c9;
    border-radius: rpx(41);
    font-size: rpx(16);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: rpx(36);
    text-align: center;
  }
}

.normal {
  background: #14c9c9;
}
.none {
  background: #cccccc;
}
.pop {
  @include ver;
  align-items: center;
  background: #ffffff;
  border-radius: 48rpx 48rpx 0px 0px;
  width: 100%;
  height: 360rpx;
  &-title {
    margin-top: 38rpx;
    font-size: 32rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 600;
  }
  &-wechat {
    @include hor-between-center;
    margin-top: 40rpx;
    width: 70%;
    &-right {
      @include hor;
      align-items: center;
      &-copy {
        margin-left: 20rpx;
        background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
        box-shadow: 0px 8px 9px 1px rgba(36, 237, 213, 0.25);
        border-radius: 10rpx;
        padding: 8rpx 20rpx;
        color: #fff;
        font-size: 20rpx;
        text-align: center;
      }
    }
  }
  :nth-child(3) {
    @include hor-center-center;
    position: fixed;
    left: 100rpx;
    right: 100rpx;
    bottom: 68rpx;
    height: 88rpx;
    background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
    box-shadow: 0px 8px 9px 1px rgba(36, 237, 213, 0.25);
    border-radius: 41rpx;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    z-index: 1;
  }
}
.fixedBg {
  @include fiexcenter;
}
.payPrice {
  font-size: rpx(20);
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: rpx(22);
  text-align: center;
  margin: rpx(27) auto rpx(25);
}
.payConfirm {
  width: rpx(275);
  height: rpx(44);
  background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
  box-shadow: 0 rpx(8) rpx(9) 0 rgba(36, 237, 213, 0.25);
  border-radius: rpx(41);
  font-size: rpx(16);
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: rpx(44);
  text-align: center;
  margin: 0 auto rpx(34);
}
.couponPackage {
  background: #f4f5f6;
  padding: rpx(16) rpx(16) rpx(34);
  box-sizing: border-box;
  &-scroll {
    max-height: rpx(500);
    margin-bottom: rpx(32);
    &-couponItem {
      width: 100%;
      height: rpx(70);
      background: #ffffff;
      border-radius: rpx(8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: rpx(14) rpx(17) rpx(13) rpx(18);
      margin-bottom: rpx(16);
      &-left {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        &-price {
          display: flex;
          align-items: baseline;
          font-family: OPPOSans-Heavy, OPPOSans;
          color: #ff6721;
          line-height: rpx(26);
          :nth-child(1) {
            font-size: rpx(20);
          }
          :nth-child(2) {
            font-size: rpx(26);
          }
        }
        &-type {
          font-size: rpx(11);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: rpx(13);
          text-align: center;
        }
      }
      &-middle {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0 rpx(16);
        &-name {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: rpx(3);
          :nth-child(1) {
            @include text-overflow-line(1);
            flex: 1;
            font-size: rpx(14);
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #000000;
            margin-right: rpx(4);
          }
          :nth-child(2) {
            background: rgba(20, 201, 201, 0.1);
            border-radius: rpx(4);
            opacity: 1;
            border: 1px solid #14c9c9;
            font-size: rpx(12);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #14c9c9;
            line-height: rpx(12);
            padding: rpx(2) rpx(3);
          }
        }
        &-restrict {
          font-size: rpx(12);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          display: flex;
          view {
            @include text-overflow-line(1);
            max-width: 40vw;
          }
        }
      }
      &-right {
        width: rpx(24);
        height: rpx(24);
      }
    }
    &-couponItemEmpty {
      width: 100%;
      height: rpx(70);
      background: #ffffff;
      border-radius: rpx(8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: rpx(14) rpx(17);
      margin-bottom: rpx(16);
      &-name {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: rpx(16);
      }
      &-isChk {
        width: rpx(24);
        height: rpx(24);
      }
    }
    &-tips {
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      margin: rpx(24) 0 rpx(8);
    }
  }
  &-discounts {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: rpx(14);
    line-height: rpx(16);
    font-family: PingFang SC-Regular, PingFang SC;
    :nth-child(1) {
      font-weight: 400;
      color: #000000;
    }
    :nth-child(2) {
      font-weight: 500;
      color: #fa5252;
    }
  }
  &-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: rpx(8);
    &-left {
      font-size: rpx(16);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: rpx(19);
    }
    &-right {
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      position: relative;
      &-first {
        color: #333333;
        margin-right: rpx(8);
        line-height: rpx(26);
        font-size: rpx(22);
      }
      &-last {
        display: inline-block;
        height: rpx(36);
        padding: 0 rpx(10);
        background: rgba(20, 201, 201, 0.1);
        border: 1px solid #14c9c9;
        border-radius: rpx(18);
        color: #14c9c9;
        :nth-child(1) {
          font-size: rpx(16);
          line-height: rpx(36);
        }
        :nth-child(2) {
          font-size: rpx(22);
          line-height: rpx(36);
        }
      }
    }
  }
  &-tips {
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    margin-bottom: rpx(16);
  }
  &-btn {
    width: rpx(283);
    height: rpx(44);
    background: #14c9c9;
    border-radius: rpx(41);
    font-size: rpx(16);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: rpx(44);
    text-align: center;
    margin: rpx(24) auto 0;
  }
}
.continueGame {
  .van-popup {
    background-color: #333333;
  }
  &-title {
    font-size: 16px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
    text-align: center;
    margin-top: rpx(18);
  }
  &-text {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    text-align: center;
    margin: rpx(16) rpx(16) rpx(25);
  }
  &-btn {
    display: flex;
    // justify-content: space-between;
    margin: 0 rpx(16) rpx(34);
    justify-content: space-between;
    &-left {
      box-sizing: border-box;
      width: rpx(164);
      height: rpx(44);
      border-radius: rpx(41);
      border: 1px solid #14c9c9;
      font-size: 16px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: rpx(44);
      text-align: center;
    }
    button {
      background: none;
      padding-left: none;
      padding-right: none;
    }
    &-left::after {
      display: none;
    }
    &-right {
      width: rpx(164);
      height: rpx(44);
      background: #14c9c9;
      border-radius: rpx(41);
      font-size: 16px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: rpx(44);
      text-align: center;
    }
  }
  &-tips {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    margin: 0 rpx(16);
  }
}
</style>
