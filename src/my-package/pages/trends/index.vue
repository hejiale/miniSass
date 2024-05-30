<template>
  <view v-if="personList">
    <!-- 头部区域 -->
    <scroll-view
      scroll-y="true"
      class="myheadBox"
      @scrolltolower="onLoadMore"
      @scroll="onScroll"
      :scroll-into-view="scrollInToView"
      :style="backgroundColor"
    >
      <!-- back -->
      <div
        class="backBox"
        :style="{
          'padding-top': menuRect.top + 'px',
          height: menuRect.height + 'px',
        }"
        id="top"
        @click="backRoute"
      >
        <van-icon name="arrow-left" size="24" color="#fff" />
      </div>
      <!-- 头像名称 -->
      <view class="avatarBox">
        <image class="avatar" :src="personList.avatar"></image>
        <view>
          <view class="useName">
            <span>{{ personList.nickName }}</span>
            <image
              v-if="personList.sex == 'MALE'"
              class="sex"
              src="@/static/image/mys/sexM.png"
            ></image>
            <image v-else class="sex" src="@/static/image/mys/sexW.png"></image
          ></view>
          <view class="text1">
            <view>粉丝</view>
            <view>{{ $filters.formatNum(personList.focusInfo.fansNum) }}</view>
            <view class="line"></view>
            <view>关注</view>
            <view>{{
              $filters.formatNum(personList.focusInfo.followerNum)
            }}</view>
            <view class="line"></view>
            <view>获赞</view>
            <view>{{ $filters.formatNum(personList.sumPraiseCount) }}</view>
          </view>
        </view>
      </view>
      <!-- 文字部分 -->
      <view>
        <view class="text66">
          <view class="guishudi">
            <view>IP属地:</view>
            <view class="jiangsu">{{ cityName }}</view>
          </view>
          <view class="personderi" @click="onEditDesc">
            <view v-if="personList.personSign">{{
              personList.personSign
            }}</view>
            <view v-else>这是一个还没有写自我介绍的小可爱</view>
            <image
              class="edit"
              src="@/static/image/mys/edit.png"
              v-if="userInfo.id == userId && !personList.personSign"
            ></image>
          </view>
        </view>
      </view>
      <!-- 想玩玩过去过想去的本 -->
      <view class="wantBen">
        <view @click="wantPlayben">
          <view class="number1">
            <view>{{ personList.wantPlayDramaNum }}</view>
            <image
              class="image1"
              src="../../static/image/arrow-right.png"
            ></image>
          </view>
          <view class="text1">想玩的本</view>
        </view>
        <view @click="wanguoBen">
          <view class="number2">
            <view>{{ personList.playedDramaNum }}</view>
            <image
              class="image2"
              src="../../static/image/arrow-right.png"
            ></image>
          </view>
          <view class="text2">玩过的本</view>
        </view>
        <view @click="addClickstored">
          <view class="number3">
            <view>{{ personList.playedStoreNum }}</view>
            <image
              class="image3"
              src="../../static/image/arrow-right.png"
            ></image>
          </view>
          <view class="text3">去过的店</view>
        </view>
        <view @click="addClickWantStore">
          <view class="number4">
            <view>{{ personList.wantPlayStoreNum }}</view>
            <image
              class="image4"
              src="../../static/image/arrow-right.png"
            ></image>
          </view>
          <view class="text4">想去的店</view>
        </view>
      </view>
      <!-- TA的店铺 -->
      <view class="jubensStore" @click="addClickAll" v-if="storeList.length">
        <image class="icon" src="../../static/image/icon-store.png"></image>
        <view>{{ userInfo.id == userId ? "我的店铺" : "TA的店铺" }}</view>
        <view class="checkall">查看全部</view>
        <image
          class="rightIcon"
          src="../../static/image/arrow-right.png"
        ></image>
        <view></view>
      </view>
      <!-- 底部滚动区域 -->
      <view class="myshowtime">
        <view class="tabs">
          <view
            class="dongtai"
            v-for="(item, index) in tabList"
            :key="index"
            :class="{ active: tabIndex == index }"
            @tap="tabtap(index)"
          >
            {{ item.name }}
            <view class="swiper_tab_line"></view>
          </view>
        </view>
        <!-- 剧评 -->
        <view v-if="tabIndex == 0" class="jupingBox">
          <view class="juping" v-for="(item, index) in jupingList" :key="index">
            <view @click="addClickItem(item)">
              <image
                class="jupingpic"
                :src="item.fileUrl"
                mode="aspectFill"
              ></image>
            </view>
            <view class="bottom">
              <view class="text">{{ item.content }}</view>
              <view class="bottomBox">
                <view class="date">{{
                  item.createdTime.substring(5, 10)
                }}</view>
                <view class="fabu">发布</view>
                <view
                  v-if="item.isPraise == true"
                  @click="addclickDianzan(item)"
                >
                  <image
                    class="dianzan"
                    src="../../static/image/dianzan.png"
                  ></image>
                </view>
                <view v-else @click="addclickDianzan(item)">
                  <image
                    class="dianzan"
                    src="../../static/image/zhan.png"
                  ></image>
                </view>
                <view class="number">{{ item.praiseQuantity }}</view>
              </view>
            </view>
          </view>
          <notcData
            position="absolute"
            note="暂时还没有发布过评价～"
            top="10vh"
            noteImg="dramatic-criticism"
            v-if="jupingList.length === 0"
          />
        </view>
        <!-- 动态 -->
        <view v-else-if="tabIndex == 1">
          <dynamic-state
            :userId="userId"
            ref="dynamic-state"
            @shareDynamic="onGetShareDynamic"
          ></dynamic-state>
        </view>
      </view>
    </scroll-view>
    <image
      class="headImage"
      mode="aspectFill"
      :src="
        personList.personalBackground
          ? personList.personalBackground 
          : $iconFont.getIconName('background')
      "
    >
    </image>
    <van-popup
      closeable
      @close="closeIcon"
      close-icon="close"
      :show="showPopup"
      position="bottom"
      round
      @click-overlay="showPopup = false"
      close-on-click-overlay
      class="userPopup"
    >
      <view class="contentdestance">
        <view class="titlebox">
          <view class="text">{{userInfo.id == userId ? '我':'TA'}}的名下有多家店铺</view>
        </view>
        <view
          class="mincontent"
          @click="addClickstoreItem(item)"
          v-for="(item, index) in storeList"
          :key="index"
        >
          <image
            class="txImage"
            :src="$filters.processLogo(item.storeLogo)"
            mode="aspectFill"
          ></image>
          <view class="text">{{ item.storeName }}</view>
          <view class="distance" v-if="distance(item.distance)">{{ distance(item.distance) }}</view>
          <van-icon name="arrow" color="#959AA5" size="12" class="arrow" />
        </view>
      </view>
    </van-popup>
    <div
      class="topBox"
      :style="{
        'padding-top': menuRect.top + 'px',
        height: menuRect.height + 50 + 'px',
      }"
      v-if="showTop"
    >
      <div class="topBox-titleBox" @click="backRoute">
        <van-icon name="arrow-left" size="22" />
        <image class="topBox-titleBox-avatar" :src="personList.avatar"></image>
        <view class="topBox-titleBox-useName">{{ personList.nickName }}</view>
      </div>
      <div class="topBox-tabBox">
        <view class="tabs">
          <view
            class="dongtai"
            v-for="(item, index) in tabList"
            :key="index"
            :class="{ active: tabIndex == index }"
            @tap="tabtap(index)"
          >
            {{ item.name }}
            <view class="swiper_tab_line"></view>
          </view>
        </view>
      </div>
    </div>
  </view>
</template>
<script>
import dynamicState from "../../components/dynamicState.vue";
import notcData from "@/components/notc-data/index.vue";
import { getMenuButtonRect, windowHeight, getColor } from "@/utils/index";
export default {
  components: {
    dynamicState,
    notcData,
  },
  data() {
    return {
      showPopup: false,
      jupingList: [],
      tabList: [{ name: "剧评" }, { name: "动态" }],
      personList: null, // 个人信息列表
      storeList: [], //店铺列表
      customNav: {
        bgHeight: "100vh",
        navTitle: "",
        color: "#fff",
        hideBg: true,
        customizeLeft: true,
      },
      tabIndex: 0,
      dynamicId: null,
      userId: null,
      pageNo: 1,
      showTop: false,
      menuRect: null,
      windowHeight: 0,
      shareDynamic: null,
      userInfo: null,
      scrollInToView: null,
      canScroll: true,
      bgColor: ''
    };
  },
  computed: {
    distance() {
      return function (item) {
        if(uni.getStorageSync('isLocation')){
          if (item) {
            return `距离你${(item / 1000).toFixed(0)}km`;
          } else {
            return "距离你0km";
          }
        }
        return null;
      };
    },
    cityName() {
      if(!this.personList) return "";
      return this.personList.authCityName || "未知";
    },
    backgroundColor(){
      return `background: linear-gradient(180deg, rgba(${this.bgColor},0.8) 0%, rgba(${this.bgColor}) 100%`;
    },
  },
  async onLoad(options) {
    this.userId = options.userId;
    this.userInfo = await this.$checkLogin.getUserInfo();

    wx.hideShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });

    this.menuRect = await getMenuButtonRect();
    this.windowHeight = await windowHeight();
  },
  async onShow() {
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }
    
    await this.gethomePageRoleDetail();

    //刷新列表
    if (this.tabIndex === 0) {
      this.pageNo = 1;
      await this.getmyDramaEvaluate();
    } else {
      this.$refs["dynamic-state"].currentPage = 1;
      this.$refs["dynamic-state"].queryDynamicWithDramaPage();
    }
  },
  onShareAppMessage(event) {
    if (event.from === "button") {
      return {
        title: this.shareDynamic.content.substring(0, 20),
        path: `/dynamicDetail/pages/index?id=${this.shareDynamic.id}`,
        imageUrl:
          this.shareDynamic.fileList.length > 0
            ? this.shareDynamic.fileList[0]
            : this.$iconFont.getIconName("juyou-share-default"),
      };
    }
  },
  methods: {
    onGetShareDynamic(e) {
      this.shareDynamic = e;
    },
    onEditDesc() {
      if (this.userInfo.id != this.userId) return;

      uni.navigateTo({
        url: "/my-package/pages/editUserDesc",
      });
    },
    onScroll(event) {
      if (!this.canScroll) return;

      if (event.detail.scrollTop > this.windowHeight * 0.4) {
        this.showTop = true;
      } else {
        this.showTop = false;
      }
    },
    onLoadMore() {
      if (this.tabIndex === 0) {
        this.pageNo++;
        this.getmyDramaEvaluate();
      } else {
        this.$refs["dynamic-state"].loadMore();
      }
    },
    addClickWantStore() {
      uni.navigateTo({
        url: `/my-package/pages/shopVisited/index?index=${1}&userId=${
          this.userId
        }`,
      });
    },
    //跳转B端
    addClickstoreItem(item) {
      if (this.userInfo.id == this.userId) {
        this.goBToB(item);
      } else {
        uni.navigateTo({
          url: `/store-package/pages/index?storeId=${item.id}`,
        });
      }
    },
    //跳转B端
    async goBToB(item) {
      try {
        uni.showLoading();

        if (item) {
          let data = await this.$api.getStoreHome({
            storeId: item.id,
            userId: this.userInfo.id,
          });
          uni.setStorageSync("storeId", item.id);
          uni.setStorageSync("shopInfo", JSON.stringify(data));

          uni.reLaunch({
            url: "/manage/pages/index",
          });
          uni.hideLoading();
        }
      } catch (e) {
        uni.hideLoading();
      }
    },
    addClickstored() {
      uni.navigateTo({
        url: `/my-package/pages/shopVisited/index?index=${0}&userId=${
          this.userId
        }`,
      });
    },
    wantPlayben() {
      uni.navigateTo({
        url: `/my-package/pages/wantPlayBen/index?index=${0}&userId=${
          this.userId
        }`,
      });
    },
    wanguoBen() {
      uni.navigateTo({
        url: `/my-package/pages/wantPlayBen/index?index=${1}&userId=${
          this.userId
        }`,
      });
    },
    addClickAll() {
      this.showPopup = true;
    },
    closeIcon() {
      this.showPopup = false;
    },
    addClickItem(item) {
      uni.navigateTo({
        url: `/pageDetail/pages/scriptReview?userId=${this.userId}&evaluateId=${item.id}&dramaId=${item.detail}`,
      });
    },
    async addclickDianzan(item, e) {
      this.dynamicId = item.id;
      if (item.isPraise == false) {
        await this.userPraiseDynamic();
        item.isPraise = true;
        item.praiseQuantity++;
      } else {
        await this.QXuserPraiseDynamic();
        item.isPraise = false;
        item.praiseQuantity--;
      }
    },
    //点赞
    async userPraiseDynamic() {
      try {
        await this.$api.userPraiseDynamic({
          dynamicId: this.dynamicId,
          dynamicType: "3",
          statusEnum: "ENABLE",
        });
        uni.showToast({
          title: "点赞成功！",
          icon: "none",
        });
      } catch (e) {
        return false;
      }
    },
    // 取消点赞
    async QXuserPraiseDynamic() {
      try {
        await this.$api.userPraiseDynamic({
          dynamicId: this.dynamicId,
          dynamicType: "3",
          statusEnum: "DISABLE",
        });
        uni.showToast({
          title: "取消点赞",
          icon: "none",
        });
      } catch (e) {
        return false;
      }
    },
    //我的剧评
    async getmyDramaEvaluate() {
      try {
        if (this.pageNo === 1) {
          this.jupingList = [];
        }

        let res = await this.$api.myDramaEvaluate({
          pageNo: this.pageNo,
          pageSize: 10,
          userId: this.userInfo.id,
          publishUserId: this.userId,
        });
        if (res.records && res.records.length) {
          this.jupingList.push(...res.records);
        }
      } catch (e) {}
    },
    //角色下个人信息主页
    async gethomePageRoleDetail() {
      try {
        let res = await this.$api.homePageRoleDetail({
          userId: this.userId,
          lat: uni.getStorageSync("currentLatitude"), //用户-经度
          lon: uni.getStorageSync("currentLongitude"), //	用户-纬度
        });
        this.personList = res;

        this.storeList = [];

        if(res.userStoreGroups){
          res.userStoreGroups.map((v) => {
            this.storeList.push(...v.storeList);
          });
        }
        
        this.bgColor = await getColor(
          res.personalBackground || this.$iconFont.getIconName("background")
        );
      } catch (e) {}
    },
    tabtap(index) {
      this.canScroll = false;
      this.scrollInToView = "top";
      this.tabIndex = index;
      this.showTop = false;

      if (index === 0) {
        this.$nextTick((_) => {
          this.pageNo = 1;
          this.getmyDramaEvaluate();
        });
      } else {
        this.$nextTick((_) => {
          this.$refs["dynamic-state"].currentPage = 1;
          this.$refs["dynamic-state"].queryDynamicWithDramaPage();
        });
      }
      setTimeout(() => {
        this.canScroll = true;
      }, 1000);
    },
    backRoute() {
      uni.navigateBack();
    },
  },
};
</script>
<style lang="scss" scoped>
.contentdestance {
  background: linear-gradient(180deg, #fffaf1 0%, #ffffff 20%);
  max-height: 80vh;
  min-height: 50vh;
  .titlebox {
    display: flex;
    padding-top: 44rpx;
    .text {
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #000000;
      white-space: nowrap;
      margin-left: 222rpx;
    }
    .closeIcon {
      width: 45rpx;
      height: 45rpx;
      margin-left: 156rpx;
    }
  }
  .mincontent {
    display: flex;
    align-items: center;
    overflow-y: scroll;
    padding: 40rpx 0;
    position: relative;
    .txImage {
      width: 52rpx;
      height: 52rpx;
      border-radius: 50%;
      opacity: 1;
      border: 2rpx solid #dfdfdf;
      margin-left: 40rpx;
      margin-right: 12rpx;
    }
    .text {
      font-size: 28rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      color: #2e323e;
      width: 250rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .distance {
      font-size: 26rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      position: absolute;
      right: 64rpx;
    }
    .arrow {
      transform: translateY(4rpx);
      position: absolute;
      right: 40rpx;
    }
  }
}
.myheadBox {
  width: 100vw;
  height: 100vh;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  position: fixed;
  top: 0;
  bottom: 0;
  .backBox {
    padding-left: 30rpx;
    @include hor;
    align-items: center;
  }
  .avatarBox {
    display: flex;
    justify-content: flex-start;
    .avatar {
      width: 124rpx;
      height: 124rpx;
      background: #dad9dc;
      box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.2);
      border-radius: 70rpx 70rpx 70rpx 70rpx;
      opacity: 1;
      border: 4rpx solid #ffffff;
      margin: 82rpx 24rpx 28rpx 32rpx;
    }

    .useName {
      width: 60vw;
      margin-top: 100rpx;
      margin-bottom: 8rpx;
      @include hor;
      align-items: center;
      span {
        max-width: 80%;
        font-size: 36rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        @include text-overflow-line(1);
      }
      .sex {
        margin-left: 12rpx;
        height: 32rpx;
        width: 32rpx;
      }
    }

    .text1 {
      font-size: 22rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      justify-content: flex-start;
      width: 100%;
      margin-top: 4rpx;

      .line {
        width: 0rpx;
        height: 18rpx;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        opacity: 0.3;
        border: 2rpx solid #ffffff;
        margin: 6rpx 12rpx;
      }

      .copy {
        width: 32rpx;
        height: 32rpx;
        margin-right: 28rpx;
        margin-left: 4rpx;
      }
    }
  }
  .text66 {
    width: 100%;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    margin-left: 32rpx;
    word-break: break-all;
    width: 90vw;
    .personderi {
      display: flex;
      justify-content: flex-start;
      margin-top: 14rpx;
      margin-bottom: 40rpx;
    }

    .guishudi {
      font-size: 26rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      justify-content: flex-start;

      .jiangsu {
        margin-right: 28rpx;
        margin-left: 6rpx;
      }
    }

    .edit {
      width: 36rpx;
      height: 36rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin-left: 2rpx;
    }
  }
  .wantBen {
    display: flex;
    justify-content: flex-start;

    .number1 {
      display: flex;
      justify-content: flex-start;
      font-size: 36rpx;
      font-family: OPPOSans, OPPOSans;
      font-weight: 800;
      color: #ffffff;
      margin-left: 32rpx;

      .image1 {
        width: 20rpx;
        height: 20rpx;
        margin-left: 20rpx;
        margin-top: 14rpx;
      }
    }

    .text1 {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-left: 32rpx;
      margin-top: 2rpx;
      margin-right: 68rpx;
    }

    .number2 {
      display: flex;
      justify-content: flex-start;
      font-size: 36rpx;
      font-family: OPPOSans, OPPOSans;
      font-weight: 800;
      color: #ffffff;

      .image2 {
        width: 20rpx;
        height: 20rpx;
        margin-left: 20rpx;
        margin-top: 14rpx;
      }
    }

    .text2 {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-right: 68rpx;
      margin-top: 2rpx;
    }

    .number3 {
      display: flex;
      justify-content: flex-start;
      font-size: 36rpx;
      font-family: OPPOSans, OPPOSans;
      font-weight: 800;
      color: #ffffff;
      margin-right: 68rpx;

      .image3 {
        width: 20rpx;
        height: 20rpx;
        margin-left: 20rpx;
        margin-top: 14rpx;
      }
    }

    .text3 {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-right: 68rpx;
      margin-top: 2rpx;
    }

    .number4 {
      display: flex;
      justify-content: flex-start;
      font-size: 36rpx;
      font-family: OPPOSans, OPPOSans;
      font-weight: 800;
      color: #ffffff;

      .image4 {
        width: 20rpx;
        height: 20rpx;
        margin-left: 20rpx;
        margin-top: 14rpx;
      }
    }

    .text4 {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-top: 2rpx;
    }
  }
  .jubensStore {
    width: 730rpx;
    height: 120rpx;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.04) 100%
    );
    border-radius: 44rpx 44rpx 44rpx 44rpx;
    opacity: 1;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    margin-left: 10rpx;
    margin-top: 32rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #ffffff;

    .checkall {
      font-size: 28rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-left: 45vw;
    }

    .rightIcon {
      width: 28rpx;
      height: 24rpx;
      margin-left: 14rpx;
    }

    .icon {
      width: 40rpx;
      height: 40rpx;
      margin-left: 30rpx;
      margin-right: 8rpx;
    }
  }
  .myshowtime {
    width: 100vw;
    background: linear-gradient(180deg, #fafafa 6%, #ffffff 13%);
    opacity: 1;
    border-radius: 50rpx 50rpx 0rpx 0rpx;
    margin-top: 32rpx;
    .jupingBox {
      width: 100vw;
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 80rpx;
      min-height: 60vh;
      .juping {
        width: 360rpx;
        height: 672rpx;
        background: #ffffff;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        opacity: 1;
        margin-bottom: 16rpx;
        margin-left: 10rpx;

        .jupingpic {
          width: 360rpx;
          height: 496rpx;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          opacity: 1;
        }

        .bottom {
          display: flex;
          flex-direction: column;

          .text {
            font-size: 30rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #2e323e;
            margin-top: 8rpx;
            margin-left: 14rpx;
            margin-right: 24rpx;
            @include text-overflow-line(2);
          }
        }

        .bottomBox {
          display: flex;
          justify-content: flex-start;
          margin-top: 12rpx;

          .date {
            white-space: nowrap;
            font-size: 24rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #5f6572;
            margin-left: 14rpx;
            margin-right: 4rpx;
          }

          .fabu {
            white-space: nowrap;
            font-size: 24rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #5f6572;
          }

          .dianzan {
            height: 32rpx;
            width: 32rpx;
            margin-left: 138rpx;
            margin-right: 6rpx;
          }

          .number {
            font-size: 24rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #666666;
            margin-top: 3rpx;
            transform: translateY(4rpx);
          }
        }
      }
    }
  }
}
.tabs .active {
  font-size: 34rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  color: #2e323e;
}
.tabs {
  display: flex;
  justify-content: flex-start;
  font-size: 30rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  color: #959aa5;
  padding: 40rpx 40rpx 16rpx 40rpx;
  .dongtai {
    margin-right: 38rpx;
  }
  .active .swiper_tab_line {
    width: 12rpx;
    height: 4rpx;
    background: #2e323e;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    opacity: 1;
    margin: 0 auto;
  }
}
.headImage {
  width: 100vw;
  height: 60vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
}
.none-juping {
  position: relative;
  height: 50vh;
  background: #fff;
}
.topBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  background: #fff;
  &-titleBox {
    position: absolute;
    left: 30rpx;
    @include hor;
    align-items: center;
    &-avatar {
      width: 56rpx;
      height: 56rpx;
      margin-left: 20rpx;
      border-radius: 50%;
      border: 4rpx solid #fff;
    }
    &-useName {
      margin-left: 12rpx;
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      max-width: 50vw;
      @include text-overflow-line(1);
    }
  }
  &-tabBox {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
  