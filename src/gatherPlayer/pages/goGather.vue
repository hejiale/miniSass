<template>
  <div class="container">
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <div class="topNav-backBox">
            <van-icon name="arrow-left" @click="backRoute" style="color: #000" size="16" />
          </div>
        </view>
      </view>
      <view slot="content">
        <div class="container-titleBox" @click="onSelectStoreName">
          <image src="../static/image/icon-store.png" class="container-titleBox-url" mode="aspectFill" />
          <span>{{ storeName }}</span>
          <!-- <span>选择店铺</span> -->
          <div class="container-titleBox-rightBox">
            <van-icon name="arrow" size="16" class="mr-4" />
          </div>
        </div>
        <div class="container-titleBox" :class="currentDrama ? 'drama' : ''" @click="onSelectDrama">
          <image src="../static/image/icon-drama.png" class="container-titleBox-url" mode="aspectFill" />
          <span>选择剧本</span>
          <div class="container-titleBox-rightBox">
            <van-icon name="arrow" size="16" class="mr-4" />
          </div>
        </div>
        <div class="container-dramaBox" v-if="currentDrama">
          <image :src="$filters.processImage(currentDrama.dramaItem.dramaCover, 160)" mode="aspectFill" />
          <div class="container-dramaBox-info">
            <span>{{ currentDrama.dramaItem.dramaName }}</span>
            <scroll-view class="container-dramaBox-info-tags" scroll-x>
              <div class="container-dramaBox-info-tags-tag">{{ currentDrama.dramaItem.maleGamerNum +
                currentDrama.dramaItem.femaleGamerNum }}人
              </div>
              <div class="container-dramaBox-info-tags-tag" v-for="it in currentDrama.dramaThemeList" :key="it.id">
                {{ it.dictValue }}
              </div>
            </scroll-view>
          </div>
          <div class="container-dramaBox-bage" :class="currentDrama.sellType">
            {{ $enums.SellType.getName(currentDrama.dramaItem.sellType) }}
          </div>
        </div>
        <div class="container-titleBox" @click="showCaledar = true">
          <image src="../static/image/icon-date.png" class="container-titleBox-url" mode="aspectFill" />
          <span>选择时间</span>
          <div class="container-titleBox-rightBox">
            <span v-if="currentDate" class="mr15">{{ $dayjs(currentDate).format("MM月DD日") }} {{ week }}
              {{ $dayjs(currentDate).format("HH:mm") }}</span>
            <van-icon name="arrow" size="16" class="mr-4" />
          </div>
        </div>
        <div class="container-titleBox">
          <image src="../static/image/icon-price.png" class="container-titleBox-url" mode="aspectFill" />
          <span>价格</span>
          <div class="container-titleBox-rightBox">
            <span>{{
              currentDrama && storeId ? `¥${currentDrama.currentPrice / 100}` : "待定"
            }}</span>
          </div>
        </div>
        <div class="container-remarkBox">
          <van-field :value="content" placeholder="请输入..." autosize type="textarea" maxlength="100" :border="false"
            @input="onInput" style="color: #999999" />
          <div class="container-remarkBox-clearBox" @click="onClearRemark">
            <image src="../static/image/icon-del.png" /> 清空
          </div>
          <span class="container-remarkBox-countBox">{{ content.length }}</span>
        </div>
      </view>
    </navigation-bar>
    <div class="container-bottomBox" @click="onPayOrder" :style="currentDrama && storeId ? '' : 'opacity: 0.6;'">
      <span class="container-bottomBox-title">发起组局</span> 
      <BindPhone
        @on-success-authorize="onSuccessAuthorize"
        v-if="!userInfo.phone"
      ></BindPhone>
    </div>
    <van-action-sheet :show="showCaledar" @click-overlay="showCaledar = false" z-index="1000">
      <van-datetime-picker title="选择开局时间" :value="currentDate" :min-date="minDate" :max-date="maxDate"
        @cancel="showCaledar = false" @confirm="onConfirmDatePicker" :formatter="formatter" style="width: 100%"
        :safe-area-inset-bottom="false" :z-index="1000" :filter="filter" />
    </van-action-sheet>
    <van-popup :show="showStore" closeable position="bottom" round @click-overlay="onClosePop" @close="onClosePop2">
      <view class="contentBox">
        <view class="storeName2">选择热玩店铺</view>
        <!-- 城市搜索 -->
        <view class="cityCheck">
          <view class="Box2" @click="changeCtty">
            <view class="uni-input">{{ cityInfo.city }}</view>
            <image class="iconDown" src="../static/image/downImage.png" />
          </view>
          <view class="inputBox">
            <van-search placeholder="搜索店铺" background="#f5f5f5" @change="onSearch" @search="onSearch" @clear="onSearch"
              :left-icon="$iconFont.getIconName('icon-searchDeep')" />
          </view>
        </view>
        <!-- banner 部分 -->
        <view class="bannerBox666">
          <scroll-view scroll-y class="bannerBox" @scrolltolower="onLoadMore">
            <view class="bannerItem" v-for="(item) in rwStoreList" :key="item.id" @click="addClickItem(item)">
              <image class="touxiang" :src="item.storeLogo"></image>
              <view class="minText">
                <view class="topWord">{{ item.storeName }}</view>
                <view class="juliwz">
                  <view class="juni">距你</view>
                  <view v-if="distance(item.distance)">{{ distance(item.distance) }}</view>
                  <view class="line"></view>
                  <view class="address">
                    {{ item.address }}
                  </view>
                </view>
                <view class="bottomWord">
                  {{ item.storeAddress == null ? '' : item.storeAddress }}
                </view>
              </view>
              <view class="rightIcon" :class="tabIndex == item.id ? 'activeColor' : ''"></view>
            </view>
          </scroll-view>
        </view>
        <view class="sureButtonBox">
          <view class="sureButton" @click="addClickQR">确认</view>
        </view>
      </view>
    </van-popup>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import { getdate } from "@/utils";
import service from '../utils/index'
import BindPhone from "@/components/bindPhone/index.vue";
export default {
  components: { navigationBar,BindPhone },
  data() {
    return {
      userInfo: null,
      lat: null,
      lon: null,
      pageNo: 1,
      pageSize: 10,
      pages: null,
      storeId: null,
      storeName: "选择店铺",
      currentSelectStoreName: null, //当前选中的store 名称
      keywords: '', // 根据关键词搜索
      tabIndex: null, //当前选中的索引
      rwStoreList: [], //查询选择店铺列表
      cityInfo: uni.getStorageSync("cityInfo"),
      showStore: false,
      showCaledar: false,
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        }
        if (type === "month") {
          return `${value}月`;
        }
        if (type === "day") {
          return `${value}日`;
        }
        if (type === "hour") {
          return `${value}时`;
        }
        if (type === "minute") {
          return `${value}分`;
        }
        return value;
      },
      currentDate: null, //往后延一个小时
      minDate: null, //往后延一个小时
      maxDate: null,
      content: "",
      currentDrama: null,
      dramaId: null,
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "发起组局",
      },
    };
  },
  async onLoad(options) {
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.storeName = options.storeName;
    this.storeId = options.storeId;
    this.dramaId = options.dramaId;
    if (this.dramaId) {
      await this.queryDramaList();
    }
    await this.onDoCurrentDate();
  },
  async onShow() {
    if (uni.getStorageSync("gather-drama")) {
      this.currentDrama = uni.getStorageSync("gather-drama");
      this.dramaId = uni.getStorageSync("gather-drama").dramaId
      wx.removeStorageSync("gather-drama");
    }
    //城市是否不匹配，重新获取城市店铺列表
    let cacheCityInfo = await this.$checkLogin.requestAuthorize();;
    if (this.cityInfo.cityId !== cacheCityInfo.cityId) {
      this.cityInfo = cacheCityInfo;
      if (this.showStore) {
        this.pageNo = 1;
        this.queryStoreDrama();
      }
    }
  },
  computed: {
    distance() {
      return function (item) {
        if(uni.getStorageSync('isLocation')){
          if (item) {
            return (item / 1000).toFixed(2) + "km";
          } else {
            return "0km";
          }
        }
        return null;
      };
    },
    week() {
      return this.getWeek(this.currentDate);
    },
    // storeName() {
    //   return JSON.parse(uni.getStorageSync("shopInfo")).storeName;
    // },
  },
  methods: {
    async queryDramaList() {
      try {
        let res = await service.getStoreProductPage({
          pageSize: 1,
          pageNo: 1,
          productType: 'GATHERING_PRODUCT',
          storeId: this.storeId,
          dramaId: this.dramaId,
        });
        this.currentDrama = res.records[0]
      } catch (e) { }
    },
    onLoadMore() {
      if (this.pageNo >= this.pages) {
        uni.showToast({
          title: '已加载全部数据~',
          icon: 'none',
          duration: 1000
        });
      } else {
        uni.showLoading({
          title: "加载中...",
        }),
          this.pageNo++;
        this.queryStoreDrama().then(() => {
          uni.hideLoading();
        })
      }
    },
    addClickQR() {
      this.showStore = false
      this.storeId = this.tabIndex
      this.storeName = this.currentSelectStoreName
    
      if (this.dramaId) {
        this.queryDramaList()
      }
    },
    addClickItem(item) {
      if(item.id === this.tabIndex){
        this.tabIndex = null
        this.currentSelectStoreName = '选择店铺'
      }else{
        this.tabIndex = item.id
        this.currentSelectStoreName = item.storeName
      }
    },
    //查询热玩店铺列表
    async queryStoreDrama() {
      try {
        let res = await this.$api.storePage({
          cityId: this.cityInfo.cityId,
          storeNameKeyword: this.keywords,
          orderby: null,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          provinceId: null,
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude"),
          userId: uni.getStorageSync("userInfo").id,
          productType: 'GATHERING_PRODUCT',
          dramaId: this.dramaId
        });
        if (this.pageNo === 1) {
          this.rwStoreList = [];
        }
        this.rwStoreList = [...this.rwStoreList, ...res.records]
        this.pages = res.pages
      } catch (e) { }
    },
    // 选择城市
    changeCtty() {
      uni.navigateTo({
        url: "/gatherPlayer/goChoodeCity/index",
      });
    },

    onSearch(e) {
      this.rwStoreList = []
      this.pageNo = 1
      this.keywords = e.detail;
      this.queryStoreDrama()
    },
    onClosePop() {
      this.showStore = false
    },
    onClosePop2() {
      this.showStore = false
    },
    // 选择店铺
    onSelectStoreName() {
      this.rwStoreList = []
      this.pageNo = 1
      this.showStore = true
      this.queryStoreDrama()
    },
    backRoute() {
      uni.navigateBack();
    },
    onClearRemark() {
      this.content = "";
    },
    onInput(e) {
      this.content = e.detail;
    },
    onSelectDrama() {
      uni.navigateTo({
        url: `./selectDrama?isPlayer=true&storeId=${this.storeId}`,
      });
    },
    onPayOrder() {
      if (!this.currentDrama || !this.storeId || !this.userInfo.phone) return
      // 传参
      let form = {
        storeId: this.storeId,
        content: this.content,
        gameStartTime: this.$dayjs(this.currentDate).format('YYYY-MM-DD HH:mm:00'),
        ...this.currentDrama
      }
      uni.setStorageSync('gatherInfo', form);
      uni.navigateTo({
        url: `./payOrder`,
      });
    },
    filter(type, options) {
      if (type === "minute") {
        return options.filter(
          (option) =>
            option === "00" ||
            option === "10" ||
            option === "20" ||
            option === "30" ||
            option === "40" ||
            option === "50"
        );
      }
      return options;
    },
    onConfirmDatePicker(event) {
      this.currentDate = event.detail;
      this.showCaledar = false;
    },
    doDatePicker(event) {
      let that = this;

      // 处理所选时间
      let systemTime = moment(event.detail).minutes(); // 获取当前系统时间的分钟数
      let options = [0, 10, 20, 30, 40, 50];

      // 解决展开弹出层后，不滑动触发change事件，直接点击确定，获取到所展示的时间
      for (let i = 0; i < options.length; i++) {
        if (i !== 3) {
          if (options[i] < systemTime && systemTime <= options[i + 1]) {
            that.currentDate = moment(
              moment(event.detail).minute(options[i + 1])
            );
          } else if (systemTime === 0) {
            that.currentDate = moment(moment(event.detail).minute(options[0]));
          } else if (50 < systemTime) {
            that.currentDate = moment(moment(event.detail).minute(60));
          }
        }
      }
    },
    onDoCurrentDate() {
      let hour = new Date().setHours(new Date().getHours() + 1);
      let addHour = new Date(hour).setMinutes(new Date().getMinutes());
      let minute = new Date(addHour).getMinutes();

      if (minute > 0 && minute <= 10) {
        minute = 10;
      } else if (minute > 10 && minute <= 20) {
        minute = 20;
      } else if (minute > 20 && minute <= 30) {
        minute = 30;
      } else if (minute > 30 && minute <= 40) {
        minute = 40;
      } else if (minute > 40 && minute <= 50) {
        minute = 50;
      } else if (minute === 0 || minute > 50) {
        minute = 0;
        addHour = new Date().setHours(new Date().getHours() + 2);
      } else {
        minute = 0;
        addHour = new Date().setHours(new Date().getHours() + 1);
      }
      this.minDate = this.currentDate = new Date(addHour).setMinutes(minute);
      this.maxDate = new Date(getdate(-13)).getTime();
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
      return obj[d - today] || null;
    },
    async onSuccessAuthorize() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
  },
};
</script>
<style>
.van-cell {
  padding: unset !important;
}
</style>
<style lang="scss" scoped>

/deep/.van-search__content {
  background: #F6F6F6;
}

/deep/.van-search {
  width: 568rpx;
  height: 72rpx;
  background: #F6F6F6;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  opacity: 1;
  margin-left: 26rpx;
  text-align: center;
}

.topNav {
  display: flex;
  align-items: center;

  &-backBox {
    width: rpx(32);
    height: rpx(32);
    background: #ffffff;
    border-radius: 10px;
    @include hor-center-center;
  }

  /deep/image {
    vertical-align: super !important;
  }
}

.container {
  &-titleBox {
    margin: rpx(15);
    background: #ffffff;
    border-radius: 12px;
    padding: rpx(15);
    @include hor;
    align-items: center;
    position: relative;

    &-url {
      width: rpx(17);
      height: rpx(16);
      border-radius: 6px;
    }

    span:nth-child(2) {
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 22px;
      margin-left: 10px;
      @include text-overflow-line(1);
      width: 60%;
    }

    &-rightBox {
      position: absolute;
      right: rpx(15);
      @include hor;
      align-items: center;

      span {
        font-size: rpx(13);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 22px;
      }
    }
  }

  .drama {
    border-radius: 12px 12px 0 0;
    margin-bottom: 0px;
  }

  &-dramaBox {
    background: #ffffff;
    padding: 0 rpx(15) rpx(15) rpx(15);
    margin: 0 rpx(15);
    @include hor;
    border-radius: 0 0 12px 12px;
    position: relative;

    image {
      width: rpx(50);
      height: rpx(68);
      border-radius: 6px;
    }

    &-info {
      margin: 10px 0 0 10px;
      @include ver;

      span:nth-child(1) {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 16px;
      }

      &-tags {
        margin-top: 15px;
        white-space: nowrap;
        width: 60vw;

        &-tag {
          display: inline-block;
          height: 16px;
          background: #f4f5f6;
          border-radius: 8px;
          padding: 0 5px;
          margin-right: 5px;
          color: #999;
        }
      }
    }

    &-bage {
      position: absolute;
      left: rpx(19);
      top: rpx(4);
      border-radius: 4px;
      font-size: rpx(10);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      padding: rpx(3) rpx(4);
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
  }

  &-remarkBox {
    position: relative;
    margin: rpx(15);
    height: 144px;
    background: #ffffff;
    border-radius: 12px;
    padding: rpx(15);

    &-clearBox {
      position: absolute;
      left: rpx(15);
      bottom: rpx(15);
      font-size: rpx(11);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #a3a3a3;
      line-height: 13px;

      image {
        width: rpx(16);
        height: rpx(16);
      }
    }

    &-countBox {
      position: absolute;
      right: rpx(15);
      bottom: rpx(15);
    }

    &-countBox::after {
      content: "/100";
      color: #999999;
    }
  }

  &-bottomBox {
    position: fixed;
    bottom: rpx(30);
    left: rpx(15);
    right: rpx(15);
    height: 48px;
    background: #14c9c9;
    border-radius: 16px;
    @include hor-center-center;
    &-title{
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }
  }
}

.contentBox {
  height: 1100rpx;
  width: 100%;

  .cityCheck {
    display: flex;
    justify-content: flex-start;
    margin-top: 38rpx;

    .Box2 {
      display: flex;
      justify-content: flex-start;
      margin-top: 20rpx;

      .uni-input {
        margin-left: 32rpx;
      }
    }

    .iconDown {
      width: 14rpx;
      height: 10rpx;
      margin-left: 2rpx;
      margin-top: 13rpx;
      margin-right: 34rpx;
    }

    .inputBox {
      position: relative;

      .input {
        margin-left: 26rpx;
        margin-top: -10rpx;
        text-align: center;
      }

      .inputIcon {
        width: 32rpx;
        height: 32rpx;
        position: absolute;
        left: 27%;
        top: 14%;
      }
    }
  }

  .storeName2 {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #2E323E;
    display: flex;
    justify-content: center;
    margin-top: 30rpx;
  }

  .rightIcon {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    opacity: 1;
    border: 2rpx solid #EEEEEE;
    margin-top: 56rpx;
    margin-left: 40rpx;
  }

  .activeColor {
    background-image: url('../static/image/checked.png');
    background-size: 100% 100%;
  }

  .bannerBox666 {
    position: fixed;

    .bannerBox {
      width: 750rpx;
      height: 750rpx;
      background: #FAFAFA;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      overflow: hidden;
      margin-top: 20rpx;

      .bannerItem {
        width: 702rpx;
        height: 162rpx;
        background: #FFFFFF;
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        opacity: 1;
        margin: 20rpx auto;
        display: flex;
        justify-content: flex-start;

        .touxiang {
          width: 112rpx;
          height: 112rpx;
          border-radius: 12rpx 12rpx 12rpx 12rpx;
          opacity: 1;
          // background-color: pink;
          margin: 24rpx 16rpx 26rpx 24rpx;
        }

        .minText {
          display: flex;
          flex-direction: column;
          margin-top: 24rpx;

          .topWord {
            width: 296rpx;
            font-size: 28rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #2E323E;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .juliwz {
            display: flex;
            justify-content: flex-start;
            margin-right: 36rpx;
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #959AA5;
            margin-top: 4rpx;

            .juni {
              white-space: nowrap;
            }

            .line {
              margin: 8rpx 12rpx 0 10rpx;
              width: 2rpx;
              height: 20rpx;
              background: #D9D9D9;
              border-radius: 0rpx 0rpx 0rpx 0rpx;
              opacity: 1;
            }

            .address {
              width: 200rpx;
              overflow-x: scroll;
              white-space: nowrap;
            }
          }

          .bottomWord {
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #959AA5;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            overflow-x: scroll;
            width: 400rpx;
          }
        }
      }
    }
  }

  .sureButtonBox {
    width: 702rpx;
    height: 88rpx;
    background: linear-gradient(180deg, #36E4BB 74%, #B7E436 100%);
    border-radius: 98rpx 98rpx 98rpx 98rpx;
    opacity: 1;
    position: fixed;
    bottom: 52rpx;
    left: 24rpx;
  }

  .sureButton {
    width: 686rpx;
    height: 80rpx;
    background: #111111;
    border-radius: 64rpx 64rpx 64rpx 64rpx;
    opacity: 1;
    font-size: 30rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 56rpx;
    left: 32rpx;
  }
}
</style>