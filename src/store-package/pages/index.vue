<template>
  <div v-if="storeInfo">
    <div
      class="backBox"
      :style="{ top: `${menuRect.top - 8}px`, height: `${menuRect.height}px` }"
      @click.stop="onBack"
    >
      <van-icon name="arrow-left" color="#fff" size="24" />
    </div>
    <div class="topBox" v-if="showTop">
      <div
        class="topBox-backBox"
        :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
        @click="onBack"
      >
        <image
          src="../static/image/icon-back.png"
          class="topBox-backBox-back"
        />
        <span class="topBox-backBox-title">{{ storeInfo.storeName }}</span>
      </div>
    </div>
    <swiper
      class="swiperBannerBox"
      :current="current"
      @change="onChangeCurrent"
      @click.stop="onGoAlbum"
      v-if="storeInfo.imageList.length"
    >
      <swiper-item v-for="v in storeInfo.imageList" :key="v.id">
        <div class="swiperBannerBox-item">
          <image
            :src="v.fileUrl"
            class="swiperBannerBox-item-cover"
            mode="aspectFill"
            v-if="isImage(v.fileUrl)"
          />
          <video
            :src="v.fileUrl"
            :controls="false"
            autoplay
            loop
            :enable-progress-gesture="false"
            v-else
          />
        </div>
      </swiper-item>
    </swiper>
    <div class="swiperBannerBox" @click="onGoAlbum" v-else>
      <div class="swiperBannerBox-item">
        <image
          :src="storeInfo.storeDoorstep || storeInfo.storeLogo"
          class="swiperBannerBox-item-cover"
          mode="aspectFill"
        />
      </div>
    </div>
    <div class="numBox" v-if="storeInfo.imageList.length" @click="onGoAlbum">
      <image src="../static/image/image-tag.png" class="numBox-tag" />
      <span>{{ current + 1 }}/{{ storeInfo.imageList.length }}</span>
    </div>
    <div class="bg" v-if="storeInfo.cityStoreRank > 0">
      <div class="bg-titleBox">
        <image src="../static/image/icon-rank.png" />
        <span>“苏州市必玩门店排行榜第{{ storeInfo.cityStoreRank }}名”</span>
        <!-- <image src="../static/image/right-arrow.png" /> -->
      </div>
    </div>
    <view class="scrollBox">
      <!-- <image
        class="scrollBox-tag"
        :src="`../static/image/tag-${storeInfo.cityStoreRank}.png`"
        v-if="storeInfo.cityStoreRank > 0"
      /> -->
      <div
        class="scrollBox-content"
        :style="
          storeInfo.cityStoreRank > 0
            ? 'margin-top: 33.4vh;'
            : 'margin-top: 27.71vh;'
        "
      >
        <div class="scrollBox-content-infoBox">
          <image
            :src="storeInfo.storeLogo"
            class="scrollBox-content-infoBox-cover"
            mode="aspectFill"
          />
          <div class="scrollBox-content-infoBox-right">
            <div class="scrollBox-content-infoBox-right-title">
              {{ storeInfo.storeName }}
            </div>
            <div class="scrollBox-content-infoBox-right-rateBox" v-if="storeInfo.evaluateItem.comprehensiveScore">
              <image
                src="../static/image/icon-star.png"
                class="scrollBox-content-infoBox-right-rateBox-star"
              />
              <span class="scrollBox-content-infoBox-right-rateBox-rate">{{
                storeInfo.evaluateItem.comprehensiveScore
              }}</span>
              <div>{{ storeInfo.evaluateItem.environmentScore }}</div>
              <div>{{ storeInfo.evaluateItem.serviceScore }}</div>
              <div>{{ storeInfo.evaluateItem.dmScore }}</div>
            </div>
            <div class="scrollBox-content-infoBox-right-noneScore" v-else>
              暂无评分
            </div>
            <div class="scrollBox-content-infoBox-right-wantBox" v-if="storeInfo.wangCount || storeInfo.explosiveCount">
              <div class="mr4" v-if="storeInfo.wangCount">{{ storeInfo.wangCount}}人想去</div>
              <div v-if="storeInfo.explosiveCount">{{ storeInfo.explosiveCount }}人气值</div>
            </div>
          </div>
        </div>
        <div class="scrollBox-content-addressBox">
          <image
            :src="$iconFont.getIconName('address-bg')"
            class="scrollBox-content-addressBox-bg"
          />
          <div class="scrollBox-content-addressBox-address">
            <span>{{ storeInfo.address }}</span>
          </div>
          <div class="scrollBox-content-addressBox-wechat" @click="onWechat">
            <image src="../static/image/icon-wechat.png" />
            <span>微信</span>
          </div>
          <div class="scrollBox-content-addressBox-iphone" @click="onPhone">
            <image src="../static/image/icon-phone.png" />
            <span>电话</span>
          </div>
          <div
            class="scrollBox-content-addressBox-distance"
            @click="onLocation"
          >
            <image src="../static/image/icon-place.png" />
            <span>距离你所在位置{{ distance }}km</span>
            <van-icon name="arrow" color="#959AA5" size="12" class="arrow" />
          </div>
        </div>
        <div class="scrollBox-content-gameBox">
          <div class="scrollBox-content-gameBox-inputBox">
            <input
              placeholder="输入房间号加入游戏"
              type="number"
              placeholder-style="color: #5B371C;"
              v-model="gameNum"
            />
            <div
              class="scrollBox-content-gameBox-inputBox-clickButton"
              @click="onOpenGame"
            ></div>
          </div>
          <BindPhone v-if="!userInfor.phone" ref="BindPhone" @on-success-authorize="onRefreshUserInfo"/>
        </div>
        <div class="scrollBox-content-tabBar sticky">
          <div
            class="scrollBox-content-tabBar-item"
            @click="onChangeTab('dm')"
            v-if="storeInfo.storeDMCount > 0"
          >
            <div class="value" :class="tab === 'dm' ? 'activeStatus' : ''">
              DM
            </div>
            <div class="line" :class="tab === 'dm' ? 'active' : ''"></div>
            <div class="tag" :class="tab === 0 ? 'activeStatus' : ''">
              {{ storeInfo.storeDMCount || 0 }}
            </div>
          </div>
          <div
            class="scrollBox-content-tabBar-item"
            :class="tab === 'drama' ? 'activeStatus' : ''"
            @click="onChangeTab('drama')"
            v-if="storeInfo.storeDramaCount > 0"
          >
            <div class="value" :class="tab === 'drama' ? 'activeStatus' : ''">
              本店剧本
            </div>
            <div class="line" :class="tab === 'drama' ? 'active' : ''"></div>
            <div class="tag" :class="tab === 'drama' ? 'activeStatus' : ''">
              {{ storeInfo.storeDramaCount || 0 }}
            </div>
          </div>
          <div
            class="scrollBox-content-tabBar-item"
            :class="tab === 'introduce' ? 'activeStatus' : ''"
            @click="onChangeTab('introduce')"
          >
            <span
              class="value"
              :class="tab === 'introduce' ? 'activeStatus' : ''"
              >店铺介绍</span
            >
            <div
              class="line"
              :class="tab === 'introduce' ? 'active' : ''"
            ></div>
          </div>
          <div
            class="scrollBox-content-tabBar-moreBox"
            v-if="tab === 'dm' || tab === 'drama'"
            @click="onGoMore"
          >
            更多<van-icon name="arrow" />
          </div>
        </div>
        <scroll-view
          class="swiperDM-box"
          scroll-x
          @scroll="scroll"
          @scrolltoupper="curScrollRate = 0"
          @scrolltolower="curScrollRate = 1"
          v-if="tab === 'dm' && storeInfo.storeDMItemList.length"
        >
          <div
            class="swiperDM-box-item"
            v-for="(v, index) in storeInfo.storeDMItemList"
            :key="v.id"
            :style="
              index === storeInfo.storeDMItemList.length - 1
                ? 'margin-right: 6px'
                : ''
            "
          >
            <div class="swiperDM-box-item-coverBox">
              <image :src="v.avatar" class="cover" mode="aspectFill" />
              <div class="scoreBox">
                <span>{{ evaluateScore(v.evaluate) }}</span>
                <span>分</span>
              </div>
              <image src="../static/image/dm-corner.png" class="cornerBox"/>
            </div>
            <span class="title">{{ v.userName || '' }}</span>
          </div>
        </scroll-view>
        <scroll-view
          class="swiperDrama-box"
          scroll-x
          @scroll="scroll"
          @scrolltoupper="curScrollRate = 0"
          @scrolltolower="curScrollRate = 1"
          v-if="tab === 'drama' && storeInfo.storeRecommendDramaList.length"
        >
          <div
            class="swiperDrama-box-item"
            v-for="(v, index) in storeInfo.storeRecommendDramaList"
            :key="v.id"
            @click="onGoDramaDetail(v.id)"
            :style="
              index === storeInfo.storeRecommendDramaList.length - 1
                ? 'margin-right: 6px'
                : ''
            "
          >
            <div class="swiperDrama-box-item-coverBox">
              <image :src="v.dramaCover" class="cover" mode="aspectFill" />
              <div class="scoreBox">
                <span>{{ v.evaluate || 0 }}</span>
                <span>分</span>
              </div>
              <image
                :src="sellType(v.sellType)"
                v-if="sellType(v.sellType)"
                class="swiperDrama-box-item-coverBox-sellType"
              />
              <div class="shadowBox"></div>
            </div>
            <div class="title">
              {{ v.dramaName }}
            </div>
          </div>
        </scroll-view>
        <div
          class="scroll-views"
          v-if="
            (storeInfo.storeDMItemList.length > 3 && tab === 'dm') ||
            (storeInfo.storeRecommendDramaList.length > 4 && tab === 'drama')
          "
        >
          <div
            class="scroll-box"
            :style="{
              'margin-left': 88 * curScrollRate + 'rpx',
            }"
          ></div>
        </div>
        <div
          class="scrollBox-introduceBox"
          :class="isOpen ? '' : 'overflowLine'"
          v-if="tab === 'introduce'"
        >
          <span v-html="formatText"></span>
          <div
            class="scrollBox-introduceBox-openBox"
            v-if="formatText.length > 80"
            @click="onFold"
          >
            {{ isOpen ? "收起" : "...展开" }}
          </div>
        </div>
        <div class="scrollBox-content-tabBar sticky uPsticky">
          <div class="scrollBox-content-tabBar-item" @click="onChangeTab2(0)">
            <div class="value" :class="tab2 === 0 ? 'activeStatus' : ''">
              正在组局
            </div>
            <div class="line" :class="tab2 === 0 ? 'active' : ''"></div>
            <div
              class="tag"
              :class="tab2 === 0 ? 'activeStatus' : ''"
              v-if="gatherTotal > 0"
            >
              {{ gatherTotal }}
            </div>
          </div>
          <div class="scrollBox-content-tabBar-item" @click="onChangeTab2(1)">
            <div class="value" :class="tab2 === 1 ? 'activeStatus' : ''">
              评价
            </div>
            <div class="line" :class="tab2 === 1 ? 'active' : ''"></div>
            <div
              class="tag"
              :class="tab2 === 1 ? 'activeStatus' : ''"
              v-if="evaluateTotal > 0"
            >
              {{ evaluateTotal }}
            </div>
          </div>
        </div>
        <div
          class="listBox"
          v-if="tab2 === 0 && gatheringList.length"
          style="background: #fafafa"
        >
          <gatherBox
            :parama="v"
            :store="storeInfo"
            v-for="v in gatheringList"
            :key="v.id"
          ></gatherBox>
          <div class="endLoad" v-if="endLoad">~全部加载完了~</div>
        </div>
        <div style="padding: 0 12px" v-if="tab2 === 1 && evaluateList.length">
          <evaluateBox
            :parama="v"
            v-for="v in evaluateList"
            :key="v.id"
            @on-evaluate="onGoEvaluateDetail"
            @on-update="onUpdateEvaluate"
            @activeUser="onActiveUser"
          ></evaluateBox>
          <div class="endLoad" v-if="endLoad">~全部加载完了~</div>
        </div>
        <notcData
          position="absolute"
          v-if="
            (tab2 === 0 && !gatheringList.length) ||
            (tab2 === 1 && !evaluateList.length)
          "
          :note="tab2 === 0 ? '暂无组局' : '暂无评价'"
          :noteImg="tab2 === 0 ? 'city-gathering-gather-default':'dramatic-criticism'"
        />
      </div>
    </view>
    <div class="bottomBox" :class="isScroll ? 'menuMove' : 'menuMoveEnd'">
      <div class="bottomBox-menu" @click="onCollect">
        <image
          src="../static/image/menu-star-select.png"
          v-if="storeInfo.hasCollect"
        />
        <image src="../static/image/menu-star.png" v-else />
        <span>{{ storeInfo.hasCollect ? "已收藏" : "收藏" }}</span>
      </div>
      <div class="bottomBox-menu" @click="onWantPlay">
        <image
          src="../static/image/menu-add-select.png"
          v-if="storeInfo.hasWantRecord"
        />
        <image src="../static/image/menu-add.png" v-else />
        <span>{{ storeInfo.hasWantRecord ? "已想去" : "想去" }}</span>
      </div>
      <div class="bottomBox-menu" @click="onGoEvaluate">
        <image src="../static/image/menu-message.png" />
        <span>{{
          storeInfo.evaluateItem.hasComment ? "已评价" : "写评价"
        }}</span>
      </div>
      <div class="bottomBox-menu" @click="onGoGather">
        <image src="../static/image/menu-gather.png" />
        <span>发起组局</span>
      </div>
    </div>
  </div>
</template>
<script>
import gatherBox from "../components/gatherList.vue";
import evaluateBox from "../components/evaluateList.vue";
import service from "../utils/service";
import gameService from "@/services/game.js";
import notcData from "@/components/notc-data/index.vue";
import BindPhone from "../../components/bindPhone/index.vue";
import {
  getMenuButtonRect,
  windowHeight,
  judgeMediaType,
} from "@/utils/index";
export default {
  components: {
    gatherBox,
    evaluateBox,
    notcData,
    BindPhone
  },
  data() {
    return {
      current: 0,
      tab: "dm",
      tab2: 0,
      curScrollRate: 0,
      showTop: false,
      menuRect: null,
      windowHeight: 0,
      isOpen: false,
      isScroll: false,
      timer: null,
      userInfor: null,
      storeInfo: null,
      gatheringList: [],
      evaluateList: [],
      gameNum: null,
      confirming: false,
      pageNo: 1,
      gatherTotal: 0,
      evaluateTotal: 0,
      endLoad: false,
      firstShow: false,
      canDo: false
    };
  },
  async onLoad(options) {
    console.log(options)
    this.menuRect = await getMenuButtonRect();
    this.windowHeight = await windowHeight();
    await this.Userinfo();

    if(options.storeId){
      await this.queryStoreDetail(options.storeId);
    }
    //分享海报过来
    if(options.scene){
      await this.queryStoreDetail(options.scene);
    }
    //查询组局
    await this.queryGatheringList();
  },
  onShow() {
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }
    if (this.firstShow) {
      this.queryStoreDetail(this.storeInfo.id);
      this.pageNo = 1;
      if (this.tab2 === 0) {
        this.queryGatheringList();
      } else {
        this.queryEvaluateList();
      }
    }
    //支付回调延迟问题
    if(uni.getStorageSync('refreshGathering')){
      uni.removeStorageSync('refreshGathering');
      setTimeout(()=>{
        if (this.tab2 === 0) {
          this.queryGatheringList();
        } 
      },500)
    }
  },
  onReachBottom() {
    if (this.endLoad) return;

    this.pageNo++;
    if (this.tab2 === 0) {
      this.queryGatheringList();
    } else {
      this.queryEvaluateList();
    }
  },
  onPageScroll(e) {
    if (
      e.scrollTop >
      this.windowHeight * (this.storeInfo.cityStoreRank > 0 ? 0.6145 : 0.55148)
    ) {
      this.showTop = true;
    } else {
      this.showTop = false;
    }
    this.isScroll = true;

    //监听滚动结束
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.isScroll = false;
    }, 500);
  },
  onShareAppMessage() {
    return {
      title: this.storeInfo.storeName,
      path: `/store-package/pages/index?storeId=${this.storeInfo.id}`,
      imageUrl: this.storeInfo.storeLogo
    };
  },
  computed: {
    isImage() {
      return function (v) {
        if (v) {
          if (judgeMediaType(v) === "image") {
            return true;
          }
          return false;
        }
      };
    },
    formatText() {
      if (!this.storeInfo) return "";
      return this.storeInfo.storeDescription;
    },
    distance() {
      if (!uni.getStorageSync('isLocation') || !this.storeInfo) return "";
      return (this.storeInfo.distance / 1000).toFixed(2);
    },
    sellType() {
      return function (type) {
        if (type === "EXCLUSIVE") {
          return "../static/image/exclusive.png";
        } else if (type === "REAL_SCENE") {
          return "../static/image/real_scene.png";
        } else if (type === "LIMITED") {
          return "../static/image/limited.png";
        }
        return null;
      };
    },
    evaluateScore(){
      return function(score){
        if(!score)return 0;
        return score.toFixed(1);
      }
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
    async onRefreshUserInfo(){
      this.userInfor = await this.$checkLogin.getUserInfo(true);
    },
    onChangeCurrent(event) {
      this.current = event.detail.current;
    },
    onChangeTab(v) {
      this.tab = v;
      this.curScrollRate = 0;
    },
    onChangeTab2(v) {
      this.tab2 = v;
      this.pageNo = 1;

      if (v === 0) {
        this.queryGatheringList();
      } else {
        this.queryEvaluateList();
      }
    },
    onActiveUser(){
      this.$refs.BindPhone.onAuthorize();
    },
    onUpdateEvaluate(){
      this.pageNo = 1;
      this.queryEvaluateList();
    },
    // 滚动时的处理
    scroll(e) {
      this.curScrollRate =
        parseFloat(e.detail.scrollLeft.toFixed(2)) /
        (e.detail.scrollWidth - 370);
    },
    //展开店铺介绍
    onFold() {
      this.isOpen = !this.isOpen;
    },
    //开启房间
    async onOpenGame() {
      //开启票房本房间
      if (!this.gameNum) return;
      if (this.confirming) return;
      this.confirming = true;

      try {
        let lastHomeInfo = await gameService.checkUserCurrentGame({
          userId: this.userInfor.id,
          storeId: this.storeInfo.id,
        });

        if (lastHomeInfo.roomId) {
          if (lastHomeInfo.roomId && lastHomeInfo.roomId != this.gameNum) {
            uni.showToast({
              title: "需主持人结束旧房间才可进入新房间，房间最多存在12小时",
              icon: "none",
            });
            this.confirming = false;
          } else {
            if (lastHomeInfo.isDM) {
              uni.navigateTo({
                url: `/game-DM/pages/index?storeId=${lastHomeInfo.storeId}`,
              });
            } else {
              uni.navigateTo({
                url: `/game-player/pages/index?roomId=${lastHomeInfo.roomId}&id=${lastHomeInfo.recordId}&storeId=${lastHomeInfo.storeId}`,
              });
            }

            this.gameNum = null;
            this.confirming = false;
          }
        } else {
          try {
            let roomInfo = await gameService.getRoomInfo({
              roomId: this.gameNum,
              userId: this.userInfor.id,
            });
            if (
              roomInfo.roomStatus === "CREATING" ||
              roomInfo.roomStatus === "PLAYING"
            ) {
              uni.navigateTo({
                url: `/game-player/pages/index?id=${roomInfo.recordId}&roomId=${roomInfo.roomId}&storeId=${roomInfo.storeId}`,
              });
            } else {
              uni.showToast({
                title: "房间已关闭",
                icon: "none",
              });
            }

            this.gameNum = null;
            this.confirming = false;
          } catch (e) {
            this.confirming = false; 
          }
        }
      } catch (e) {
        this.confirming = false;
      }
    },
    //请求店铺详情
    async queryStoreDetail(storeId) {
      try {
        let data = await this.$api.getStoreHome({
          storeId,
          userId: this.userInfor.id,
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude"),
        });
        //图片视频排序
        if (data.imageList.length) {
          let arr = [];
          let videos = data.imageList.filter(
            (v) => judgeMediaType(v.fileUrl) !== "image"
          );
          let images = data.imageList.filter(
            (v) => judgeMediaType(v.fileUrl) === "image"
          );
          arr.push(...videos, ...images);
          data.imageList = arr;
        }
        if (data.storeDMCount === 0 && data.storeDramaCount > 0) {
          this.tab = "drama";
        }
        if (data.storeDMCount === 0 && data.storeDramaCount === 0) {
          this.tab = "introduce";
        }

        this.storeInfo = data;
        this.evaluateTotal = data.evaluateItem.evaluateCount;

        setTimeout(() => {
          this.firstShow = true;
        }, 1000);
      } catch (e) {
        console.log(e);
      }
    },
    //获取用户信息
    async Userinfo() {
      this.userInfor = await this.$checkLogin.getUserInfo();
    },
    onLocation() {
      wx.openLocation({
        longitude: this.storeInfo.longitude,
        latitude: this.storeInfo.latitude,
        address: this.storeInfo.storeAddress, //xxx
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    async onPhone() {
      wx.makePhoneCall({
        phoneNumber: this.storeInfo.telephone,
      });
    },
    onWechat() {
      uni.setClipboardData({
        data: this.storeInfo.wxNumber,
        success() {
          uni.showToast({
            title: "微信号复制成功",
          });
        },fail(e){
          console.log(e)
        }
      });
    },
    onGoAlbum() {
      uni.setStorageSync("store-detail", JSON.stringify(this.storeInfo));
      uni.navigateTo({ url: "./album" });
    },
    //查询组局列表
    async queryGatheringList() {
      try {
        let data = await service.getGatheringList({
          pageNo: this.pageNo,
          pageSize: 10,
          cityId: this.storeInfo.cityId,
          storeId: this.storeInfo.id,
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude"),
        });
        if (this.pageNo === 1) {
          this.gatheringList = [];
          this.endLoad = false;
        }
        if (data.records.length) {
          this.gatheringList.push(...data.records);

          if (data.records.length < 10) {
            this.endLoad = true;
          }
        }
        this.gatherTotal = data.total;
      } catch (e) {}
    },
    //查询店铺评价列表
    async queryEvaluateList() {
      try {
        let data = await service.evaluatePageList({
          pageNo: this.pageNo,
          pageSize: 10,
          storeId: this.storeInfo.id,
          userId: this.userInfor.id,
        });
        if (this.pageNo === 1) {
          this.evaluateList = [];
          this.endLoad = false;
        }
        if (data.records.length) {
          this.evaluateList.push(...data.records);

          if (data.records.length < 10) {
            this.endLoad = true;
          }
        }
        this.evaluateTotal = data.total;
      } catch (e) {}
    },
    //收藏
    async onCollect() {
      if(!this.userInfor.phone){
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      if(this.canDo)return;
      this.canDo = true;

      try {
        await service.storePlayFocus({
          playStatus: "COLLECT",
          status: this.storeInfo.hasCollect ? "DISABLE" : "ENABLE",
          storeId: this.storeInfo.id,
          userId: this.userInfor.id,
        });
        this.storeInfo.hasCollect = this.storeInfo.hasCollect ? false : true;
        this.canDo = false;
      } catch (e) {
        this.canDo = false;
      }
    },
    //想去
    async onWantPlay() {
      if(!this.userInfor.phone){
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      if(this.canDo)return;
      this.canDo = true;

      try {
        await service.storePlayFocus({
          playStatus: "WANT_PLAY",
          status: this.storeInfo.hasWantRecord ? "DISABLE" : "ENABLE",
          storeId: this.storeInfo.id,
          userId: this.userInfor.id,
        });
        this.queryStoreDetail(this.storeInfo.id);
        this.canDo = false;
      } catch (e) {
        this.canDo = false;
      }
    },
    //发起组局
    onGoGather() {
      if(!this.userInfor.phone){
        this.$refs.BindPhone.onAuthorize();
        return;
      }

      uni.navigateTo({
        url: `/gatherPlayer/pages/goGather?storeId=${this.storeInfo.id}&storeName=${this.storeInfo.storeName}`,
      });
    },
    //发起评价
    onGoEvaluate() {
      if(!this.userInfor.phone){
        this.$refs.BindPhone.onAuthorize();
        return;
      }

      uni.setStorageSync("store-info", this.storeInfo);

      if (this.storeInfo.evaluateItem.hasComment) {
        uni.navigateTo({
          url: `./evaluate?id=${this.storeInfo.evaluateItem.hasComment}`,
        });
      } else {
        uni.navigateTo({
          url: "./evaluate",
        });
      }
    },
    //查看评价详情
    onGoEvaluateDetail(id) {
      uni.setStorageSync("store-info", this.storeInfo);
      uni.navigateTo({
        url: `./evaluateDetail?id=${id}`,
      });
    },
    //更多DM或剧本
    onGoMore() {
      if (this.tab === 'dm') {
        uni.navigateTo({
          url: `./dmList?storeId=${this.storeInfo.id}&name=${this.storeInfo.storeName}`,
        });
      } else {
        uni.navigateTo({
          url: `./dramaList?storeId=${this.storeInfo.id}&name=${this.storeInfo.storeName}`,
        });
      }
    },
    //剧本详情
    onGoDramaDetail(id) {
      uni.navigateTo({
        url: `/pageDetail/pages/pageDetail?id=${id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.scrollBox {
  position: relative;
  &-tag {
    width: 106rpx;
    height: 126rpx;
    position: absolute;
    left: 40rpx;
    top: -92rpx;
  }
  &-content {
    border-radius: 20px;
    background: #fff;
    z-index: 1;
    &-infoBox {
      @include hor;
      padding-top: 48rpx;
      margin-left: 40rpx;
      &-cover {
        width: 100rpx;
        height: 100rpx;
        border-radius: 6px;
        border: 1px solid #dfdfdf;
      }
      &-right {
        @include ver;
        margin-left: 24rpx;
        &-title {
          width: 74vw;
          font-size: 38rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2e323e;
          @include text-overflow-line(2);
        }
        &-rateBox {
          @include hor;
          align-items: baseline;
          margin-top: 5px;
          &-star {
            width: 8px;
            height: 8px;
          }
          &-rate {
            margin-left: 2px;
            margin-right: 16rpx;
            color: #ff6300;
            font-size: 34rpx;
            font-family: OPPOSans-Heavy, OPPOSans;
            color: #ff6300;
            line-height: 40rpx;
          }
          div:nth-child(3) {
            color: #ff6300;
            font-size: 11px;
            margin-right: 6px;
          }
          div:nth-child(3)::before {
            content: "环境: ";
            color: #5f6572;
          }
          div:nth-child(4) {
            color: #ff6300;
            font-size: 11px;
            margin-right: 6px;
          }
          div:nth-child(4)::before {
            content: "服务: ";
            color: #5f6572;
          }
          div:nth-child(5) {
            color: #ff6300;
            font-size: 11px;
            margin-right: 6px;
          }
          div:nth-child(5)::before {
            content: "DM: ";
            color: #5f6572;
          }
        }
        &-noneScore{
          margin-top: 16rpx;
          font-size: 22rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #959AA5;
        }
        &-wantBox {
          @include hor;
          align-items: center;
          margin-top: 10rpx;
          div {
            color: #5f6572;
            line-height: 14px;
            background: #f5f5f5;
            border-radius: 8px;
            padding: 8rpx 16rpx;
            border-radius: 8px;
            font-size: 20rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #2e323e;
          }
        }
      }
    }
    &-addressBox {
      margin: 9px 0 0 3.2vw;
      width: 93.2vw;
      height: 152rpx;
      position: relative;
      border-radius: 18rpx;
      overflow: hidden;
      &-bg {
        @include abscenter;
      }
      &-address {
        @include hor;
        align-items: center;
        padding: 18px 0 0 12px;
        width: 60vw;
        position: relative;
        span {
          @include text-overflow-line(1);
          font-size: 30rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2e323e;
          line-height: 36rpx;
        }
      }
      &-wechat {
        @include ver;
        align-items: center;
        position: absolute;
        top: 30rpx;
        right: 24rpx;
        image {
          width: 52rpx;
          height: 52rpx;
        }
        span {
          margin-top: 2px;
          font-size: 20rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #82909c;
          line-height: 24rpx;
        }
      }
      &-iphone {
        @include ver;
        align-items: center;
        position: absolute;
        top: 30rpx;
        right: 120rpx;
        image {
          width: 52rpx;
          height: 52rpx;
        }
        span {
          margin-top: 2px;
          font-size: 20rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #82909c;
          line-height: 24rpx;
        }
      }
      &-distance {
        position: absolute;
        left: 24rpx;
        top: 86rpx;
        @include hor;
        align-items: center;
        image {
          margin-right: 8rpx;
          width: 20rpx;
          height: 24rpx;
        }
        span {
          color: #959aa5;
          font-size: 22rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          line-height: 26rpx;
        }
        .arrow {
          transform: translateY(2rpx);
        }
      }
    }
    &-tabBar {
      margin-top: 46rpx;
      padding: 0rpx 24rpx 0 46rpx;
      @include hor;
      align-items: center;
      &-item {
        @include ver;
        align-items: center;
        position: relative;
        margin-right: 64rpx;
        .value {
          font-size: 30rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          line-height: 36rpx;
          position: relative;
        }
        .line {
          margin-top: 6rpx;
          width: 32rpx;
          height: 6rpx;
          background: #fff;
          border-radius: 2px;
        }
        .active {
          background: #36e4bb;
        }
        .activeStatus {
          color: #2e323e !important;
          font-size: 32rpx;
          font-family: PingFang SC-Medium, PingFang SC !important;
          font-weight: 500 !important;
        }
        .tag {
          position: absolute;
          left: 100%;
          top: -10rpx;
          font-size: 18rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #959aa5;
        }
      }
      &-moreBox {
        position: absolute;
        top: 8rpx;
        right: 24rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        line-height: 28rpx;
      }
    }
    .sticky {
      position: sticky;
      top: 12.8vh;
      background: #fff;
      z-index: 100;
      padding-bottom: 12rpx;
    }
    .uPsticky {
      top: 12vh !important;
      padding-top: 2rpx;
    }
    &-gameBox {
      margin: 18rpx 24rpx 0 24rpx;
      height: 210rpx;
      background: url("../static/image/play-bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
      &-inputBox {
        position: absolute;
        left: 24rpx;
        right: 24rpx;
        bottom: 36rpx;
        background: url("../static/image/play-input-bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 76rpx;
        input {
          position: absolute;
          left: 40rpx;
          top: 0px;
          bottom: 0px;
          width: 50%;
          height: 100%;
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5b371c;
        }
        &-clickButton {
          position: absolute;
          right: 0;
          height: 100%;
          width: 36%;
          z-index: 1;
        }
      }
    }
  }
  &-introduceBox {
    padding-top: 24rpx;
    margin: 0 24rpx;
    font-size: 30rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #2e323e;
    line-height: 36rpx;
    word-break: break-all;
    position: relative;
    &-openBox {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #4876ae;
      background: #fff;
      line-height: 32rpx;
      height: 42rpx;
      display: flex;
      flex-direction: column-reverse;
    }
  }
  .overflowLine {
    @include text-overflow-line(4);
  }
}
.bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 28.94vh;
  height: 168rpx;
  background: linear-gradient(90deg, #f6d7b7 0%, #ffeddd 100%);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  &-titleBox {
    position: absolute;
    left: 40rpx;
    top: 20rpx;
    right: 40rpx;
    image:nth-child(1) {
      width: 96rpx;
      height: 36rpx;
    }
    span {
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #935d36;
    }
    image:nth-child(3) {
      position: absolute;
      top: 10rpx;
      right: 0px;
      width: 24rpx;
      height: 24rpx;
      transform: translateY(2rpx);
    }
  }
}
.backBox {
  position: absolute;
  left: 0rpx;
  @include ver;
  justify-content: center;
  z-index: 1;
  padding: 20rpx 30rpx 20rpx 20rpx;
}
.numBox {
  position: absolute;
  right: 16px;
  top: 24.63vh;
  padding: 0px 5px;
  height: 19px;
  min-width: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  @include hor-center-center;
  align-items: center;
  &-tag {
    width: 13px;
    height: 13px;
  }
  span:nth-child(2) {
    margin-left: 3px;
    font-size: 10px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
  }
}
.swiperBannerBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 33.13vh;
  &-item {
    width: 100%;
    height: 100%;
    position: relative;
    @include hor-center-center;
    &-cover {
      @include abscenter;
    }
    image:nth-child(2) {
      width: 36px;
      height: 36px;
      z-index: 1;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }
}
.swiperDM-box {
  white-space: nowrap;
  padding-top: 24rpx;
  &-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-left: 12rpx;
    width: 184rpx;
    &-coverBox {
      position: relative;
      overflow: hidden;
      border-radius: 6px;
      width: 184rpx;
      height: 184rpx;
      @include hor-center-center;
      .cover {
        @include abscenter;
        border: 1px solid #d2d2d2;
        box-sizing: border-box;
      }
      .shadow {
        @include abscenter;
        background: rgba(24, 24, 24, 0.53);
        backdrop-filter: blur(4px);
        z-index: 1;
      }
      .note {
        position: absolute;
        width: 8.8vw;
        height: 74rpx;
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        letter-spacing: 3px;
        z-index: 1;
        white-space: normal;
      }
      .scoreBox {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        display: flex;
        z-index: 1;
        span:nth-child(1) {
          font-size: 26rpx;
          font-family: OPPOSans-Heavy, OPPOSans;
          color: #ffffff;
          line-height: 15px;
        }
        span:nth-child(2) {
          margin-left: 4rpx;
          font-size: 20rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          color: #ffffff;
          line-height: 12px;
          transform: translateY(6rpx);
        }
      }
      .cornerBox{
        position: absolute;
        right: 0;
        top: 0;
        width: 160rpx;
        height: 160rpx;
      }
    }
    .title {
      margin-top: 16rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      line-height: 14px;
      @include text-overflow-line(1);
      width: 90%;
      white-space: normal;
      text-align: center;
    }
  }
}
.swiperDrama-box {
  white-space: nowrap;
  &-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-left: 12rpx;
    width: 156rpx;
    &-coverBox {
      position: relative;
      overflow: hidden;
      border-radius: 6px;
      width: 156rpx;
      height: 228rpx;
      @include hor-center-center;
      .cover {
        @include abscenter;
      }
      .shadow {
        @include abscenter;
        background: rgba(24, 24, 24, 0.53);
        backdrop-filter: blur(4px);
        z-index: 1;
      }
      .note {
        position: absolute;
        width: 8.8vw;
        height: 74rpx;
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        letter-spacing: 6rpx;
        z-index: 1;
        white-space: normal;
        transform: translateX(6rpx);
      }
      .scoreBox {
        position: absolute;
        bottom: 8rpx;
        left: 8rpx;
        display: flex;
        z-index: 1;
        span:nth-child(1) {
          font-size: 26rpx;
          font-family: OPPOSans-Heavy, OPPOSans;
          color: #ffffff;
          line-height: 15px;
        }
        span:nth-child(2) {
          margin-left: 4rpx;
          font-size: 20rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 12px;
          transform: translateY(6rpx);
        }
      }
      &-sellType {
        position: absolute;
        right: 8rpx;
        top: 8rpx;
        width: 60rpx;
        height: 32rpx;
      }
      .shadowBox{
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: 48rpx;
        background: linear-gradient(360deg, rgba(0,0,0,0.8) 0%, rgba(9,9,9,0) 100%);
      }
    }
    .title {
      margin-top: 16rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      line-height: 14px;
      @include text-overflow-line(1);
      width: 90%;
      text-align: center;
      white-space: normal;
    }
  }
}
.scroll-views {
  width: 126rpx;
  height: 8rpx;
  background: rgba($color: #d2d2d2, $alpha: 0.5);
  border-radius: 12rpx;
  margin-top: 20rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  .scroll-box {
    width: 38rpx;
    height: 8rpx;
    background: #36e4bb;
    border-radius: 12rpx;
  }
}
.bottomBox {
  position: fixed;
  left: 80rpx;
  right: 80rpx;
  bottom: 4.18vh;
  height: 112rpx;
  background: rgba(46, 50, 62, 0.8);
  border-radius: 28px;
  @include hor-center-center;
  z-index: 101;
  backdrop-filter: blur(9px);
  &-menu {
    margin-right: 40rpx;
    @include ver;
    align-items: center;
    image {
      width: 82rpx;
      height: 44rpx;
    }
    span {
      margin-top: 4rpx;
      font-size: 20rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 12px;
    }
  }
}
.listBox {
  padding: 24rpx 24rpx 0 24rpx;
}
.topBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 12.8vh;
  background: #fff;
  z-index: 100;
  &-backBox {
    position: absolute;
    left: 24rpx;
    width: 60vw;
    @include hor;
    align-items: center;
    &-back {
      width: 36rpx;
      height: 36rpx;
    }
    &-title {
      font-size: 32rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2e323e;
      margin-left: 24rpx;
      @include text-overflow-line(1);
      width: 90%;
    }
  }
}
.menuMove {
  transform: translateY(rpx(100));
  transition: 0.4s;
}
.menuMoveEnd {
  transform: translateY(rpx(0));
  transition: 0.4s;
}
.endLoad {
  height: 14vh;
  color: lightgray;
  font-size: 24rpx;
  text-align: center;
}
/deep/.data-screen-empty{
  padding-bottom: 12vh !important;
}
</style>