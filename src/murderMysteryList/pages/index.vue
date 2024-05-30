<template>
  <div class="container">
    <navigationBar :nav="customNav">
      <view slot="left" class="customLeftBox">
        <van-icon
          name="arrow-left"
          size="44rpx"
          color="#000"
          @click="backRoute"
        />
        <div
          class="container-searchBar"
          :style="{ top: statusBarHeight + 'px' }"
        >
          <van-icon
            name="search"
            size="40rpx"
            color="#999"
            style="margin-left: 20rpx"
          />
          <input
            placeholder="搜索商品"
            @blur="onSearch"
            confirm-type="search"
          />
        </div>
      </view>
      <div slot="content" class="content">
        <div class="container-playingBox" v-if="showPlayBox">
          <div
            class="container-playingBox-item"
            @click="onGoTicket"
          >
            <div class="container-playingBox-item-titleImg">
              <image
                :src="$filters.processImage(playingInfo.dramaItem.dramaCover, 160)"
                mode="aspectFill"
                lazy-load
              />
            </div>
            <div class="container-playingBox-item-infoBox">
              <span class="container-playingBox-item-infoBox-name">{{
                playingInfo.dramaItem.dramaName
              }}</span>
              <scroll-view
                class="container-playingBox-item-infoBox-tags"
                v-if="playingInfo.dramaItem.dicts"
                scroll-x
              >
                <div
                  class="container-playingBox-item-infoBox-tags-item"
                  v-for="(it, index) in playingInfo.dramaItem.dicts"
                  :key="it.id"
                  v-show="index < 5"
                >
                  {{ it.dictValue }}
                </div>
              </scroll-view>
            </div>
            <div class="container-playingBox-item-rightBox">
              游戏中...
            </div>
          </div>
        </div>

        <div class="container-record"  @click="onOrder">
          <span class="container-record-text">店家开本记录</span>
          <div class="container-record-icon">
            <span>查看全部</span>
            <img src="../static/image/arrows-left.png" alt="" />
          </div>
        </div>
        <!-- <div class="container-tab">
          <div class="container-tab-item" @click="tabChang">
            <span :class="isApply ? '' : 'isApply'">全部剧本</span>
            <span v-if="!isApply"></span>
          </div>
          <div class="container-tab-item">
            <span @click="tabChang" :class="isApply ? 'isApply' : ''"
              >已授权剧本</span
            >
            <span v-if="isApply"></span>
          </div>
        </div> -->
        <scroll-view
          scroll-y
          class="container-scroll"
          @scrolltolower="scrollLower"
        >
          <div class="container-scroll-listBox" v-if="dramaList.length">
            <div
              class="container-scroll-listBox-item"
              v-for="item in dramaList"
              :key="item.id"
              @click="toDetails(item)"
            >
              <div class="container-scroll-listBox-item-titleImg">
                <image
                  :src="$filters.processImage(item.dramaCover, 320)"
                  mode="aspectFill"
                  lazy-load
                />
                <div class="container-scroll-listBox-item-titleImg-tagBox" v-if="item.activeLastCount !== null && item.activeLastCount > 0">
                  再开{{item.activeLastCount}}场
                </div>
                <div class="container-scroll-listBox-item-titleImg-tag"  v-if="item.activeLastCount !== null && item.activeLastCount === 0">
                </div>
              </div>
              <span class="container-scroll-listBox-item-dramaName">{{
                item.dramaName
              }}</span>
              <div class="container-scroll-listBox-item-priceBox">
                <span
                  v-if="item.currentPrice"
                  class="container-scroll-listBox-item-priceBox-tag"
                  >¥</span
                >
                <span
                  v-if="item.currentPrice"
                  class="container-scroll-listBox-item-priceBox-value"
                  >{{ item.currentPrice ? item.currentPrice / 100 : "0" }}</span
                >
                <span
                  v-else
                  class="container-scroll-listBox-item-priceBox-value"
                  >{{item.currentPrice === 0 ? '免费':'--'}}</span
                >
                <span class="container-scroll-listBox-item-priceBox-title"
                  >/场</span
                >
              </div>
            </div>
          </div>
          <notcData top="20vh" v-else />
        </scroll-view>
      </div>
    </navigationBar>
  </div>
</template>
<script>
import service from "../utils/service";
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar/index.vue";
import { starBarHeight } from "@/utils";
export default {
  components: {
    notcData,
    navigationBar,
  },
  data(vm) {
    return {
      isApply: true,
      keywords: "",
      statusBarHeight: 0,
      dramaList: [],
      pageNo: 1,
      pageSize: 20,
      userInfor: {},
      playingInfo: null,
      showPlayBox: false,
      endLoad: false,
      customNav: {
        bgHeight: "30vh",
        customizeLeft: true,
        customizeTitle: true,
        customizeSearchBar: false,
        navTitle: "",
        color: "#000",
        position: "fixed",
        bg: vm.$iconFont.getIconName("icon-takeAway-bg"),
        fix: true,
      },
    };
  },
  async onLoad() {
    this.statusBarHeight = await starBarHeight();
    await this.getUserInfo();
  },
  async onShow() {
    if (this.isApply) {
      await this.queryDramaApplyList();
    } else {
      await this.queryDramaList();
    }
    await this.queryIsPlaying();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onOrder() {
      uni.navigateTo({
        url: `/order/pages/index?productType=BOX_OFFICE_PRODUCT`,
      });
    },
    tabChang() {
      this.isApply = !this.isApply;
      this.pageNo = 1;
      this.endLoad = false;
      if (this.isApply) {
        this.queryDramaApplyList();
      } else {
        this.queryDramaList();
      }
    },
    scrollLower() {
      if (this.endLoad) return;

      this.pageNo++;
      if (this.isApply) {
        this.queryDramaApplyList();
      } else {
        this.queryDramaList();
      }
    },
    onSearch(keyword) {
      this.keywords = keyword.detail.value;
      this.pageNo = 1;
      this.endLoad = false;
      if (this.isApply) {
        this.queryDramaApplyList();
      } else {
        this.queryDramaList();
      }
    },
    toDetails(item) {
      uni.navigateTo({
        url: `./Details?scriptID=${item.dramaId}&productId=${item.id}`,
      });
    },
    onGoTicket() {
      uni.navigateTo({
        url: '/game-DM/pages/index'
      })
    },
    async queryDramaList() {
      try {
        let data = await service.productGetList({
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          productName: this.keywords,
          productType: "BOX_OFFICE_PRODUCT",
          isPutOn: true,
          storeId: uni.getStorageSync("storeId"),
        });
        if (this.pageNo == 1) {
          this.dramaList = [];
        }
        if (data.records.length < this.pageSize) {
          this.endLoad = true;
        }
        this.dramaList.push(...data.records);
        wx.hideLoading();
      } catch (e) {
        wx.hideLoading();
      }
    },
    async queryDramaApplyList() {
      try {
        let data = await service.getAuthorizedBoxProductList({
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          productName: this.keywords,
          storeId: uni.getStorageSync("storeId"),
        });
        if (this.pageNo == 1) {
          this.dramaList = [];
        }
        if (data.records.length < this.pageSize) {
          this.endLoad = true;
        }
        this.dramaList.push(...data.records);
        wx.hideLoading();
      } catch (e) {
        wx.hideLoading();
      }
    },
    async queryIsPlaying() {
      try {
        let data = await service.getStoreCurrentGame({
          storeId: uni.getStorageSync("storeId"),
        })
        let index = data.findIndex(it=>it.murderMysteryOnlineRecord.dmId === this.userInfor.id);

        if(index !== -1){
          this.playingInfo = data[index];
          this.showPlayBox = true;
        }else{
          this.playingInfo = null;
          this.showPlayBox = false;
        }
      } catch (e) {}
    },
    async getUserInfo() {
      try {
        this.userInfor = await this.$checkLogin.getUserInfo();
      } catch (e) {}
    },
    /**
     * 转换日期
     */
    getWeek(dateString) {
      dateString = dateString.replace(/-/g, "/");
      let date = new Date(dateString).getDay();
      var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      return "周" + weeks[date];
    },
    fnTime(time) {
      time = time.replace(/-/g, "/");
      let d = new Date(time).setHours(0, 0, 0, 0);
      let today = new Date().setHours(0, 0, 0, 0);

      let obj = {
        "-86400000": "昨天",
        0: "今天",
        86400000: "明天",
      };
      return obj[d - today] || null;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  .customLeftBox {
    @include hor;
    align-items: center;
    span {
      font-size: 15px;
    }
  }
  &-searchBar {
    margin-left: 32rpx;
    width: 56vw;
    height: 72rpx;
    background: #fff;
    border-radius: 72rpx;
    @include hor;
    align-items: center;
    input {
      font-size: 28rpx;
    }
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &-playingBox {
    margin: rpx(16) rpx(16) 0 rpx(16);
    padding: rpx(16) rpx(16);
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(224, 224, 224, 0.25);
    border-radius: 8px;
    padding: rpx(10);
    box-sizing: border-box;
    &-item {
      @include hor;
      position: relative;
      &-titleImg {
        position: relative;
        width: rpx(48);
        height: rpx(48);
        margin-right: 20rpx;
        image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
      &-infoBox {
        @include ver;
        justify-content: center;
        &-name {
          @include text-overflow-line(1);
          width: 50vw;
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 32rpx;
        }
        &-tags {
          display: flex;
          flex-wrap: wrap;
          height: 40rpx;
          margin-top: 16rpx;
          white-space: nowrap;
          width: 70vw;
          &-item {
            display: inline-block;
            font-size: 20rpx;
            font-family: OPPOSans, OPPOSans-Regular;
            text-align: center;
            line-height: 40rpx;
            color: #999999;
            border-radius: 4rpx;
            background: #f5f5f5;
            margin-right: 12rpx;
            padding: 0 10rpx;
          }
        }
      }
      &-rightBox {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 11px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #14c9c9;
        line-height: 12px;
        background: rgba(20, 201, 201, 0.2);
        border-radius: 4px 4px 4px 4px;
        padding: rpx(4);
      }
    }
    &-item:nth-child(2) {
      margin-top: rpx(16);
    }
    &-item:nth-child(3) {
      margin-top: rpx(16);
    }
  }
  &-record {
    margin: rpx(16) rpx(16) 0;
    padding: rpx(16);
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-text {
      font-size: 14px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
    }
    &-icon {
      display: flex;
      align-items: center;
      span {
        font-size: 12px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: rpx(2);
      }
      img {
        width: rpx(12);
        height: rpx(12);
      }
    }
  }
  &-tab {
    margin-top: rpx(16);
    display: flex;
    justify-content: space-evenly;
    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      // padding: 0 rpx(66);
      span:nth-child(1) {
        font-size: 16px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 19px;
        text-align: center;
      }
      span:nth-child(2) {
        width: 36px;
        height: 4px;
        background: #14c9c9;
        border-radius: 2px 2px 2px 2px;
        margin-top: rpx(4);
      }
      .isApply {
        color: #000000 !important;
        font-weight: 600 !important;
      }
    }
  }
  &-scroll {
    flex: 1;
    margin-top: rpx(24);
    overflow: hidden;
    &-listBox {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 rpx(16) rpx(16);
      &-item {
        // margin: 0 0 40rpx 40rpx;
        margin-bottom: rpx(24);
        display: inline-block;
        // width: 26%;
        position: relative;
        &-titleImg {
          width: 200rpx;
          height: 260rpx;
          position: relative;
          image {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
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
        &-dramaName {
          width: 200rpx;
          margin-top: 12rpx;
          font-size: 28rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          @include text-overflow-line(1);
        }
        &-priceBox {
          @include hor;
          align-items: baseline;
          &-tag {
            font-size: 20rpx;
            font-family: OPPOSans-Heavy, OPPOSans;
            color: #14c9c9;
          }
          &-value {
            font-size: 28rpx;
            font-family: OPPOSans-Heavy, OPPOSans;
            color: #14c9c9;
          }
          &-title {
            font-size: 18rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }
    &-listBox::after {
      content: "";
      width: 200rpx;
    }
  }
}
</style>
