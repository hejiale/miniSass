<template>
  <scroll-view class="script" scroll-y @scrolltolower="reachBottom">
    <view class="script-items" v-if="isExist">
      <view
        v-for="item in form"
        :key="item.boxStoreApplyId"
        class="script-item"
        @click="onGoDetail(item)"
      >
        <image :src="item.dramaCover" mode="aspectFill" />
        <div class="script-item-infoBox">
          <div class="script-item-infoBox-title">{{ item.productName }}</div>
          <scroll-view class="script-item-infoBox-tags" scroll-x>
            <div
              v-for="dic in item.dicts"
              :key="dic.id"
              class="script-item-infoBox-tags-tag"
            >
              {{ dic.dictValue }}
            </div>
          </scroll-view>
          <div class="script-item-infoBox-author">
            作者：{{ authorName(item.authorItems) }}
          </div>
          <div class="script-item-infoBox-author">
            发行: {{ publisherName(item.publishers) }}
          </div>
        </div>
        <div class="script-item-hasAuthButton" v-if="item.applyStatus && item.applyStatus !== 'REJECT_AUTHORIZE'">
          {{ $enums.BoxStoreApplyStatus.getName(item.applyStatus)
          }}<van-icon name="success" size="14px" />
        </div>
        <div class="script-item-grayButton" v-else-if="hasEnd(item.endDate)">
          已结束
        </div>
        <div
          class="script-item-noteButton"
          v-else-if="countTime(item.startDate)"
        >
          {{ countTime(item.startDate) }}
        </div>
        <div class="script-item-applyButton" v-else>立即申领</div>
      </view>
    </view>
    <view class="script-items" v-else>
      <view
        v-for="item in form"
        :key="item.id"
        class="script-item"
        @click="onGoDetail(item)"
      >
        <image :src="item.dramaCover" mode="aspectFill" />
        <div class="script-item-infoBox">
          <div class="script-item-infoBox-title">{{ item.productName }}</div>
          <scroll-view class="script-item-infoBox-tags" scroll-x> 
            <div
              v-for="dic in item.dicts"
              :key="dic.id"
              class="script-item-infoBox-tags-tag"
            >
              {{ dic.dictValue }}
            </div>
          </scroll-view>
          <div class="script-item-infoBox-author">
            作者：{{ authorName(item.authorItems) }}
          </div>
          <div class="script-item-infoBox-author">
            发行: {{ publisherName(item.publishers) }}
          </div>
        </div>
        <div class="script-item-hasAuthButton" v-if="item.applyStatus && item.applyStatus !== 'REJECT_AUTHORIZE'">
          {{ $enums.BoxStoreApplyStatus.getName(item.applyStatus)
          }}<van-icon name="success" size="14px" />
        </div>
        <div class="script-item-grayButton" v-else-if="hasEnd(item.endDate)">
          已结束
        </div>
        <div
          class="script-item-noteButton"
          v-else-if="countTime(item.startDate)"
        >
          {{ countTime(item.startDate) }}
        </div>
        <div class="script-item-applyButton" v-else>立即申领</div>
      </view>
    </view>
  </scroll-view>
</template>
<script>
import service from "../utils/service";
export default {
  components: {},
  props: {
    form: {
      type: Array,
      default: [],
    },
    isExist: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      payInfo: null,
    };
  },
  computed: {
    authorName() {
      return function (authors) {
        let arr = authors.map((it) => it.authorName);
        return arr.join("/");
      };
    },
    publisherName() {
      return function (publishers) {
        let arr = publishers.map((it) => it.publisherName);
        return arr.join("/");
      };
    },
    noStart() {
      return function (date) {
        if (new Date().getTime() < new Date(date).getTime()) {
          return true;
        }
        return false;
      };
    },
    hasEnd() {
      return function (date) {
        var formatComparedate = this.$dayjs(date).format("YYYYMMDD");
        var formatNowDate = this.$dayjs(new Date()).format("YYYYMMDD");

        if (formatComparedate - formatNowDate < 0) {
          return true;
        }
        return false;
      };
    },
    countTime() {
      return function (date) {
        let time;
        if (new Date().getTime() < new Date(date).getTime()) {
          var leftTime = new Date(date) - new Date(); //计算剩余的毫秒数
          var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
          if (days > 0) {
            time = `${days}天后可领`;
          } else {
            var hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
            time = `${hours}小时后可领`;
          }
        }
        return time;
      };
    },
  },
  methods: {
    async onGoDetail(item) {
      await this.queryProductOrderInfo(item.id);
      
      //已授权
      if (item.applyStatus === "PASS_AUTHORIZE") {
        uni.navigateTo({
          url: `./applyComplete?id=${item.id}&applyId=${item.boxStoreApplyId}`,
        });
      }
      //待授权
      else if (item.applyStatus === "WAIT_AUTHORIZE") {
        uni.navigateTo({
          url: `./applyDrama?id=${item.id}&applyId=${item.boxStoreApplyId}`,
        });
      } else {
        //已支付未填写
        if (
          this.payInfo &&
          this.payInfo.orderInfo &&
          this.payInfo.orderInfo[0].orderStatus === "PAYED"
        ) {
          if(new Date().getTime() < new Date(item.startDate).getTime()){
            uni.navigateTo({
              url: `./applyDramaDetail?id=${item.id}`,
            });
          }else{
            uni.navigateTo({
              url: `./applyDrama?id=${item.id}&orderInfoId=${this.payInfo.orderInfo[0].id}`,
            });
          }
        } else {
          uni.navigateTo({
            url: `./applyDramaDetail?id=${item.id}`,
          });
        }
      }
    },
    reachBottom() {
      this.$emit("reachBottom");
    },
    //查询该商品订单信息
    async queryProductOrderInfo(id) {
      try {
        let data = await this.$checkLogin.getUserInfo();
        this.payInfo = await service.checkProductOrder({
          productId: id,
          storeId: uni.getStorageSync("storeId"),
          productType: 'APPLY_DRAMA_PRODUCT',
          userId: data.id
        });
      } catch (e) {}
    },
  },
};
</script>

<style lang="scss">
/deep/.titleImg-badge {
  border-bottom-right-radius: 8rpx !important;
}
.script {
  position: fixed;
  left: 0;
  right: 0;
  top: 18.7vh;
  bottom: 0;
}
.script-items {
  display: flex;
  flex-wrap: wrap;
  .script-item {
    @include hor;
    align-items: center;
    margin: 0rpx 30rpx rpx(16) 30rpx;
    width: calc(100vw - 60rpx);
    position: relative;
    background: #fff;
    border-radius: 8px;
    image {
      width: rpx(72);
      height: rpx(94);
      border-radius: rpx(4);
      margin: 20rpx;
    }
    &-infoBox {
      @include ver;
      width: 80%;
      &-title {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 16px;
        word-break: break-all;
        @include text-overflow-line(1);
        width: 60%;
      }
      &-tags {
        @include hor;
        align-items: center;
        margin-top: 8px;
        white-space: nowrap;
        width: 65vw;
        &-tag {
          padding: 0 10rpx;
          height: 16px;
          background: rgba(153, 153, 153, 0.1);
          border-radius: 57px;
          font-size: 20rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          margin-right: 10rpx;
          display: inline-block;
        }
      }
      &-author {
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-top: 16rpx;
        @include text-overflow-line(1);
        width: 60%;
      }
    }
    &-applyButton {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 76px;
      height: 30px;
      background: #14c9c9;
      border-radius: 17px;
      font-size: rpx(12);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      @include hor-center-center;
    }
    &-grayButton {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 76px;
      height: 30px;
      background: #cccccc;
      border-radius: 17px;
      font-size: rpx(12);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      @include hor-center-center;
    }
    &-hasAuthButton {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 76px;
      height: 30px;
      border-radius: 17px;
      border: 1px solid #14c9c9;
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #14c9c9;
      @include hor-center-center;
    }
    &-noteButton {
      position: absolute;
      right: 10px;
      bottom: 0px;
      width: 76px;
      height: 30px;
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #14c9c9;
      line-height: 14px;
    }
  }
}
</style>
