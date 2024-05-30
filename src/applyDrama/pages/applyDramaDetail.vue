<template>
  <div class="container" v-if="endLoad">
    <div class="fixedBg"></div>
    <div
      class="container-backBox"
      :style="{
        height: '44px',
        'padding-top': statusBarHeight + 'px',
      }"
      @click="onBack"
    >
      <van-icon name="arrow-left" size="50rpx" color="#fff" />
    </div>
    <swiper
      class="container-productImg"
      indicator-dots
      indicator-active-color="#fff"
      @click="handlePreview(drama.urlList)"
    >
      <swiper-item v-for="url in drama.urlList" :key="url">
        <image :src="url" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <div class="container-productInfoBox">
      <div class="container-productInfoBox-topBox">
        <image
          class="container-productInfoBox-topBox-url"
          :src="drama.urlList[0]"
          mode="aspectFill"
        />
        <div class="container-productInfoBox-topBox-infoBox">
          <div class="container-productInfoBox-topBox-infoBox-name">
            {{ drama.dramaName }}
          </div>
          <div class="container-productInfoBox-topBox-infoBox-price">
            <span>{{ drama.currentPrice / 100 }}</span>
            <span>¥{{ drama.originPrice / 100 }}</span>
          </div>
        </div>
      </div>
      <div class="container-productInfoBox-subTitle">
        {{ drama.subTitle || "" }}
      </div>
      <div class="container-productInfoBox-note" v-if="drama.remark">{{ drama.remark }}</div>
    </div>
    <div class="container-detailBox">
      <div class="container-detailBox-title">详情</div>
      <div class="container-detailBox-htmlBox">
        <parseHtml
          :content="drama.detail"
          container-style="padding-top: 20px"
          lazy-load
          scroll-table
          selectable
          use-anchor
          style="width: 100%"
        ></parseHtml>
      </div>
    </div>
    <div v-if="applyEnd" class="container-bottomDisableBox">已结束</div>
    <div v-else-if="applyNoStart" @click="onPay" class="container-bottomBox">
      {{ applyNoStart }}
    </div>
    <div class="container-bottomBox" @click="onApply" v-else>
      {{
        noPayInfo &&
        noPayInfo.orderInfo &&
        noPayInfo.orderInfo[0].orderStatus === "PAYED"
          ? "填写申领信息"
          : `支付¥${totalPrice}`
      }}
    </div>
    <div style="height: 20px"></div>
  </div>
</template>
<script>
import { starBarHeight } from "@/utils";
import service from "../utils/service";
import parseHtml from "@/components/mp-html/components/mp-html/mp-html.vue";
export default {
  components: {
    parseHtml,
  },
  data() {
    return {
      statusBarHeight: 0,
      drama: {},
      isPower: false, //是否有申领权限
      options: null,
      applyStatus: null,
      endLoad: false,
      applyDetail: {},
      userInfo: null,
      noPayInfo: null, //未支付订单信息
    };
  },
  async onLoad(options) {
    this.options = options;
    this.statusBarHeight = await starBarHeight();
  },
  computed: {
    totalPrice() {
      return parseFloat(this.drama.currentPrice / 100);
    },
    //未开始的情况
    applyNoStart() {
      let time;
      if (this.applyDetail.startDate) {
        if (
          new Date(this.applyDetail.startDate).getTime() > new Date().getTime()
        ) {
          var leftTime = new Date(this.applyDetail.startDate) - new Date(); //计算剩余的毫秒数
          var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
          if (
            this.noPayInfo &&
            this.noPayInfo.orderInfo &&
            this.noPayInfo.orderInfo[0].orderStatus === "PAYED"
          ) {
            if (days > 0) {
              time = `已支付¥${parseFloat(
                this.drama.currentPrice / 100
              )}, ${days}天后可提交申领任务`;
            } else {
              var hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
              time = `已支付¥${parseFloat(
                this.drama.currentPrice / 100
              )}, ${hours}小时后可提交申领任务`;
            }
          } else {
            if (days > 0) {
              time = `${days}天后可提交申领任务，预付¥${parseFloat(
                this.drama.currentPrice / 100
              )}`;
            } else {
              var hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
              time = `${hours}小时后可提交申领任务，预付¥${parseFloat(
                this.drama.currentPrice / 100
              )}`;
            }
          }
        }
      }
      return time;
    },
    //已结束
    applyEnd() {
      if (this.applyDetail.endDate) {
        var formatComparedate = this.$dayjs(this.applyDetail.endDate).format("YYYYMMDD");
        var formatNowDate = this.$dayjs(new Date()).format("YYYYMMDD");

        if (formatComparedate - formatNowDate < 0) {
          return true;
        }
        return false;
      }
      return false;
    },
  },
  async onShow() {
    await this.getUserInfo();
    await this.queryApplyDetail();
    await this.queryDramaDetail();
    await this.checkOrder();
    this.endLoad = true;
  },
  methods: {
    onBack() {
      uni.navigateBack();
    },
    async onPay(){
      await this.checkOrder();

      //已支付
      if (
        this.noPayInfo &&
        this.noPayInfo.orderInfo &&
        this.noPayInfo.orderInfo[0].orderStatus === "PAYED"
      ) {
        return;
      }

      this.pay((orderId)=>{
        this.queryApplyDetail();
        this.checkOrder();
      })
    },
    async onApply() {
      await this.checkOrder();

      //已创单未支付的情况
      if (
        this.noPayInfo &&
        this.noPayInfo.orderInfo &&
        this.noPayInfo.orderInfo[0].orderStatus === "NOT_PAY"
      ) {
        uni.navigateTo({
          url: `/order/pages/detail?id=${this.noPayInfo.orderInfo[0].id}`,
        });
        return;
      }
      //已支付未申领
      if (
        this.noPayInfo &&
        this.noPayInfo.orderInfo &&
        this.noPayInfo.orderInfo[0].orderStatus === "PAYED"
      ) {
        uni.navigateTo({
          url: `./applyDrama?id=${this.drama.id}&orderInfoId=${this.noPayInfo.orderInfo[0].id}&delta=${2}`,
        });
        return;
      }

      this.pay((orderId)=>{
        uni.navigateTo({
          url: `./applyDrama?id=${this.drama.id}&orderInfoId=${orderId}&applyId=${this.options.applyId}&delta=${2}`,
        });
      })
    },
    async pay(callBack){
      this.$checkLogin.doPay(
        this.userInfo.id,
        this.drama.currentPrice,
        this.drama.productType,
        this.drama.productName,
        this.drama.id,
        'STORE_USER',
        "USER",
        1,
        null,
        uni.getStorageSync("storeId")
      ).then(data=>{
        uni.showToast({
          title: "支付成功！",
        });

        setTimeout(() => {
          callBack(data);
          }, 500);
      })
    },
    //查询商品详情
    async queryDramaDetail() {
      try {
        this.drama = await service.productDetail({
          id: this.options.id /*申领产品Id*/,
        });
      } catch (e) {}
    },
    //查询申领任务详情
    async queryApplyDetail() {
      try {
        this.applyDetail = await service.getBoxDramaApplyDetail({
          id: this.options.id /*申领产品Id*/,
        });
      } catch (e) {}
    },
    async getUserInfo() {
      try {
        this.userInfo = await this.$checkLogin.getUserInfo();
      } catch (e) {}
    },
    //检查未支付订单信息
    async checkOrder() {
      if (!this.options.applyId) {
        try {
          this.noPayInfo = await service.checkProductOrder({
            productId: this.options.id,
            storeId: uni.getStorageSync("storeId"),
            productType: 'APPLY_DRAMA_PRODUCT',
            userId: this.userInfo.id
          });
        } catch (error) {}
      }
    },
    handlePreview(url) {
      uni.previewImage({
          urls: [...url],
          longPressActions: {
              itemList: ['发送给朋友', '保存图片', '收藏'],
              success: function(data) {
              },
              fail: function(err) {
              }
          }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  &-backBox {
    position: fixed;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    padding: 20rpx;
    z-index: 10;
  }
  &-productImg {
    height: rpx(264);
  }
  &-productInfoBox {
    @include ver;
    background: #fff;
    padding: rpx(16);
    margin-top: rpx(8);
    &-topBox {
      @include hor;
      align-items: center;
      &-url {
        width: rpx(40);
        height: rpx(56);
        border-radius: 4px;
      }
      &-infoBox {
        @include ver;
        margin-left: rpx(8);
        &-name {
          font-size: rpx(16);
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000000;
          line-height: 22px;
        }
        &-price {
          @include hor;
          align-items: baseline;
          margin-top: rpx(8);
          span:nth-child(1) {
            font-size: rpx(22);
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #14c9c9;
          }
          span:nth-child(2) {
            margin-left: rpx(7);
            font-size: rpx(14);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            transform: translateY(-1px);
            text-decoration: line-through;
          }
          span:nth-child(1)::before {
            content: "¥";
            font-size: rpx(14);
          }
        }
      }
    }
    &-subTitle {
      margin-top: rpx(16);
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
      word-break: break-all;
    }
    &-note {
      margin-top: rpx(8);
      background: #f4f5f6;
      border-radius: 4px;
      padding: rpx(8);
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #849198;
      line-height: 14px;
      min-height: rpx(50);
      word-break: break-all;
    }
  }
  &-detailBox {
    margin-top: rpx(16);
    background: #fff;
    padding: rpx(16);
    &-title {
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 19px;
    }
    &-htmlBox {
    }
  }
  &-bottomBox {
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    bottom: rpx(28);
    height: 44px;
    background: #14c9c9;
    border-radius: 41px;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    @include hor-center-center;
  }
  &-bottomDisableBox{
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    bottom: rpx(28);
    height: 44px;
    background: #ccc;
    border-radius: 41px;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    @include hor-center-center;
  }
}
</style>
