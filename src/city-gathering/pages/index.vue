<template>
  <view v-if="isShow">
    <!-- 头部搜索部分 -->
    <navigationBar :nav="customNav">
      <view slot="left" style="display: flex">
        <view class="cityCheck">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000; margin-right: 20rpx"
            size="50rpx"
          />
          <view class="Box2" @click="changeCtty">
            <view class="uni-input">{{ cityInfo.city }}</view>
            <image class="iconDown" src="../static/image/downImage.png" />
          </view>
          <view class="searchBox">
            <input
              type="text"
              v-model="dramaNameKeyword"
              @focus="isFoucs = true"
              @blur="onSearchBlur"
              @confirm="onSearch"
              confirm-type="search"
            />
            <div class="searchBox-placeholder" v-if="!isFoucs">
              <image src="../static/image/icon-search.png" />
              <span>输入关键词搜索</span>
            </div>
          </view>
        </view>
      </view>
    </navigationBar>
    <!-- tab 栏 -->
    <head-tabar
      :tabBars="tabBars"
      :tabIndex="tabIndex"
      @tabtap="tabtap"
      class="headTabar"
    ></head-tabar>
    <searchWeek
      v-show="tabIndex === 0"
      :dateList="dateList"
      :sum="sum"
      ref="Child"
    ></searchWeek>
    <!-- search 栏 -->
    <search-place
      v-show="tabIndex === 0"
      class="searchPlace2"
      :style="searchPlace2"
      @searchCategory="categoryId"
      :ids="ids"
      :regionType="regionType"
      :screenBox="screenBox"
      :showSyntheticSort="showSyntheticSort"
      ref="searchPlace"
    >
    </search-place>
    <view v-show="tabIndex === 2">
      <hotPlay
        @onChange="onChangeNum"
        ref="hotPlay"
      ></hotPlay>
    </view>
    <!-- 优选门店 -->
    <view v-show="tabIndex === 1">
      <preferredStorehead
        :ids="ids"
        :regionType="regionType"
        @searchCategoryYX="categoryIdYX"
        @searchCategoryYXZH="categoryIdYXZh"
        ref="preferredStorehead"
      ></preferredStorehead>
    </view>
    <scroll-view
      @scroll="onScroll"
      :class="'content' + ' ' + topBarClass"
      scroll-y
      @scrolltolower="onLoadMore"
      :scroll-top="scrollTop"
    >
      <view v-show="tabIndex === 0">
        <gatherItem
          v-for="(item, index) in gatheringList"
          :key="index"
          :gather="item"
          :index="index"
          @click.native="onGatherDetail(item)"
        >
        </gatherItem>
        <div
          class="content"
          @click="onGoGather"
          v-if="!gatheringList.length"
        >
          <view class="nomatchingstores">
            <image
              class="drama-default"
              style="top: 40vh"
              :src="$iconFont.getIconName('city-gathering-gather-default')"
            />
            <view class="noStores">当前城市暂时没有组局～</view>
            <view class="drama-join" style="top: 55vh" @click="onGoGather"></view>
            <view class="drama-join" style="top: 55vh">
              <span>发起组局</span>
            </view>
          </view>
        </div>
      </view>
      <view v-show="tabIndex === 1">
        <view v-if="conditionPageList.length > 0">
          <preferredStore
            @scroll="scrollEventFn"
            v-for="(item, index2) in conditionPageList"
            :key="index2"
            :preferred="item"
            :ids="ids"
            :regionType="regionType"
            @searchCategoryYX="categoryIdYX"
            @searchCategoryYXZH="categoryIdYXZh"
            @click.native="gotoStoreDetail(item)"
          ></preferredStore>
        </view>
        <view v-else class="nomatchingstores">
          <image
            class="drama-default"
            style="top: 640rpx"
            :src="$iconFont.getIconName('city-gathering-store-default')"
          ></image>
          <view class="noStores">暂无优选门店～</view>
        </view>
      </view>
      <!-- 剧本信息及组局情况 -->
      <view v-show="tabIndex === 2">
        <view v-if="hotPlayBanList.length > 0">
          <hotPlayBanner
            @click.native="gotoDetailJuBen(item)"
            v-for="(item, index4) in hotPlayBanList"
            :key="index4"
            :hotPlayBan="item"
          >
          </hotPlayBanner>
        </view>
        <view v-else class="nomatchingstores">
          <image
            style="top: 640rpx"
            class="drama-default"
            :src="$iconFont.getIconName('city-gathering-drama-default')"
          />
          <view class="drama-content" style="left: 252rpx; top: 816rpx"
            >暂无热玩剧本推荐～</view
          >
        </view>
      </view>
      <view v-show="tabIndex == 3">
        <view v-if="hotPlayBanList.length > 0">
          <wangPlay
            @click.native="gotoDetailIwant(item)"
            v-for="(item, index5) in hotPlayBanList"
            :key="index5"
            :wangPlay="item"
          ></wangPlay>
        </view>
        <view v-else class="nomatchingstores">
          <image
            class="drama-default"
            style="top: 480rpx"
            :src="$iconFont.getIconName('city-gathering-drama-default')"
          />
          <view class="drama-title" style="top: 666rpx">暂无剧本</view>
          <view class="drama-content" style="top: 716rpx"
            >你还没有收集想玩的剧本</view
          >
          <view class="drama-join" style="top: 808rpx" @click="tabtap(2)">
            <span>发现剧本</span>
          </view>
        </view>
      </view>
      <div style="height: 15vh"></div>
    </scroll-view>
    <!-- 当前场数 -->
    <view class="parentChang" v-show="tabIndex == 0">
      <view class="test">
        <image class="icon" src="../static/image/iconsan.png"></image>
        <view>当前日期条件下有</view>
        <view class="number">{{ gatheringCountToday }}场</view>
        <view>组局拼场中</view>
      </view>
    </view>
    <view>
      <view class="myGather2">
        <view class="myzujuBox" @click="onGoMyGather">
          <image class="zujuimage" src="../static/image/myzuju.png"></image>
          <view class="myzuju">我的组局</view>
        </view>

        <view class="fqzujuBox" @click="onGoGather">
          <image class="fqzujuImage" src="../static/image/zuju.png"></image>
          <view class="fqzuju">发起组局</view>
        </view>

        <view class="fqzujuBox" @click="onEnterHome">
          <image class="fqzujuImage" src="../static/image/icon2.png"></image>
          <view class="piaofangben">票房本</view>
        </view>

        <BindPhone
          @on-success-authorize="onSuccessAuthorize"
          v-if="!userInfor.phone"
          ref="bindPhone"
        ></BindPhone>
      </view>
    </view>
    <enterRoom ref="enterRoom" :userInfor="userInfor" />
  </view>
</template>
<script>
import { safeHeight } from "@/utils/index";
import gatherItem from "../components/gatherItem.vue";
import headTabar from "../components/headTabar.vue";
import searchPlace from "../components/searchPlace.vue";
import searchWeek from "../components/searchWeek.vue";
import BindPhone from "@/components/bindPhone/index.vue";
import preferredStore from "../components/preferred-store.vue";
import preferredStorehead from "../components/preferredStorehead.vue";
import hotPlay from "../components/hotPlay.vue";
import hotPlayBanner from "../components/hotPlayBanner.vue";
import wangPlay from "../components/wangPlay.vue";
import navigationBar from "@/components/navigation-bar/index.vue";
import enterRoom from "../components/open-game.vue";
export default {
  components: {
    gatherItem,
    BindPhone,
    headTabar,
    searchPlace,
    searchWeek,
    preferredStore,
    preferredStorehead,
    hotPlay,
    hotPlayBanner,
    wangPlay,
    navigationBar,
    enterRoom,
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
        zIndex: 1,
      },
      showzujuButton: true,
      searchPlace2: "",
      typeNumber: 1,
      hotPlayBanList: [],
      sortType: 1, // 综合排序
      beforeThere: null,
      wantPlay: null,
      pageNo: 1,
      pageSize: 10,
      pages: null,
      pageNoYX: 1,
      pageSizeYX: 10,
      pagesYX: null,
      pageNoJB: 1,
      pageSizeJB: 10,
      pagesJb: null,
      timer: null,
      order_by: null, //综合排序
      play_status: null, // 只看想玩的
      play_notStatus: null, // 不看玩过的
      time_type: null, //筛选时间
      sell_type: null, //筛选发售方式
      dict_idsList: null, //筛选类型
      screenBox: false,
      showSyntheticSort: false,
      category_id: "",
      category_id_yx: null,
      ids: "",
      regionType: "3",
      sum: "",
      cityInfo: {},
      gatheringCountToday: 0, //当前日期下有多少场拼单组局
      datas: "",
      list: [
        {
          name: "关注点，在于这是一条没用的信息哦1",
        },
        {
          name: "关注点，在于这是一条没用的信息哦2",
        },
        {
          name: "关注点，在于这是一条没用的信息哦3",
        },
      ],
      tabIndex: 0, // 选中的
      tabBars: [
        {
          name: "同城组局",
          id: "guanzhu",
        },
        {
          name: "优选门店",
          id: "tuijian",
        },
        {
          name: "热玩剧本",
          id: "tiyu",
        },
        {
          name: "我想玩的",
          id: "woxiang",
        },
      ],
      contData: [],
      time: "12:01",
      topBarClass: '',
      bottomHeight: "",
      gatheringList: [],
      conditionPageList: [],
      userInfor: null,
      currentDate: null,
      dateList: [],
      isShow: false,
      merchantBase: null,
      dictIdsArr: [],
      minGamerNum: null, //最小玩家
      maxGamerNum: null, //最大玩家
      dramaNameKeyword: "",
      scrollTop: "",
      showEnterHome: false,
      isFoucs: false,
      condition: [],
    };
  },
  async onLoad() {
    if (uni.getStorageSync("gatherTabIndex")) {
      this.tabIndex = uni.getStorageSync("gatherTabIndex");
      uni.removeStorageSync("gatherTabIndex");
    }

    this.userInfor = await this.$checkLogin.getUserInfo();
    // 使用 city 参数
    wx.showLoading();
    this.bottomHeight = `bottom: ${(await safeHeight()) + 50}px`;
  },
  async onShow() {
    this.cityInfo = await this.$checkLogin.requestAuthorize();
    this.ids = this.cityInfo.cityId;
    if(uni.getStorageSync('refreshCity')){
      if(this.$refs.searchPlace){
        this.$refs.searchPlace.clear();
      }
      if(this.$refs.preferredStorehead){
        this.$refs.preferredStorehead.clear();
      }
      uni.setStorageSync('refreshCity');
    }
    await this.tabtap(this.tabIndex);
  },
  computed: {
    month() {
      return function (date) {
        if (this.fnTime(date)) {
          return this.fnTime(date);
        }
        this.datas = this.$dayjs(date).format("d");
        let weeks = ["日", "一", "二", "三", "四", "五", "六"];
        let day = this.$dayjs(date).format("d");
        if (day) {
          return "星期" + weeks[day];
        } else {
          console.error("时间格式错误");
        }
      };
    },
    month2() {
      return function (date) {
        return this.$dayjs(date).format("MM-DD");
      };
    },
  },
  methods: {
    onEnterHome() {
      this.$refs.enterRoom.isShowModel = true;
    },
    scrollEventFn() {
      console.log(刷新了2);
    },
    gotoDetailJuBen(item) {
      uni.navigateTo({
        url: "/pageDetail/pages/pageDetail?id=" + item.id,
      });
    },
    gotoDetailIwant(item) {
      uni.navigateTo({
        url: "/pageDetail/pages/pageDetail?id=" + item.id,
      });
    },
    changeCtty() {
      if (uni.getStorageSync("isLocation")) {
        uni.navigateTo({
          url: "/gatherPlayer/goChoodeCity/index",
        });
      } else {
        wx.getPrivacySetting({
          success: (res) => {
            this.$checkLogin.requestAuthorize();
          },
        });
      }
    },
    onScroll(e) {
      this.showzujuButton = false;
      clearTimeout(this.timer); //这里必须要每次滚动前 清除一次
      this.timer = setTimeout(() => {
        this.showzujuButton = true;
      }, 500);
    },
    addClickzuju() {
      console.log("发起组局");
      uni.navigateTo({
        url: "/gatherPlayer/pages/goGather",
      });
    },
    onChangeNum(value) {
      this.condition = value;
      this.pageNoJB = 1;
      this.hotPlayBanList = [];
      //人数
      if (value.findIndex((v) => v.type === "人数") !== -1) {
        this.maxGamerNum =
          value[value.findIndex((v) => v.type === "人数")].form.maxGamerNum;
        this.minGamerNum =
          value[value.findIndex((v) => v.type === "人数")].form.minGamerNum;
      }

      //题材
      if (value.findIndex((v) => v.type === "剧本题材") !== -1) {
        if (value[value.findIndex((v) => v.type === "剧本题材")].form.id) {
          this.dictIdsArr = [
            value[value.findIndex((v) => v.type === "剧本题材")].form.id,
          ];
        } else {
          this.dictIdsArr = [];
        }
      }

      this.queryDramaGatherPage();
    },
    changeBeforPlay(index) {
      this.pageNoYX = 1;
      this.conditionPageList = [];
      if (index == 1) {
        this.beforeThere = true;
        this.wantPlay = null;
      } else if (index == 2) {
        this.beforeThere = null;
        this.wantPlay = true;
      } else {
        this.beforeThere = null;
        this.wantPlay = null;
      }
      this.queryPreferredStore();
    },
    onSearchBlur() {
      if (this.dramaNameKeyword && this.dramaNameKeyword.length) {
        this.isFoucs = true;
      } else {
        this.isFoucs = false;
      }
    },
    onSearch() {
      if (this.tabIndex == 0) {
        this.gatheringList = [];
        this.pageNo = 1;
        this.queryGatherList();
      } else if (this.tabIndex == 1) {
        this.pageNoYX = 1;
        this.conditionPageList = [];
        this.queryPreferredStore();
      } else if (this.tabIndex == 2) {
        this.pagesJb = 1;
        this.hotPlayBanList = [];
        this.queryDramaGatherPage();
      } else {
        this.pagesJb = 1;
        this.hotPlayBanList = [];
        this.queryWantPlayDramaPage();
      }
    },
    SXtextMthod(SXtextMthod) {
      this.pageNo = 1;
      this.gatheringList = [];
      this.order_by = SXtextMthod + 1;
      this.queryGatherList();
      this.showSyntheticSort = false;
    },
    onLoadMore() {
      if (this.tabIndex == 0) {
        if (this.pageNo >= this.pages) {
          uni.showToast({
            title: "已加载全部数据~",
            icon: "none",
            duration: 1000,
          });
        } else {
          uni.showLoading({
            title: "加载中...",
          }),
            this.pageNo++,
            this.queryGatherList().then(() => {
              uni.hideLoading();
            });
        }
      } else if (this.tabIndex == 1) {
        if (this.pageNoYX >= this.pagesYX) {
          uni.showToast({
            title: "已加载全部数据~",
            icon: "none",
            duration: 1000,
          });
        } else {
          uni.showLoading({
            title: "加载中...",
          }),
            this.pageNoYX++,
            this.queryPreferredStore().then(() => {
              uni.hideLoading();
            });
        }
      } else if (this.tabIndex == 2) {
        if (this.pageNoJB >= this.pagesJb) {
          uni.showToast({
            title: "已加载全部数据~",
            icon: "none",
            duration: 1000,
          });
        }
        uni.showLoading({
          title: "加载中...",
        }),
          this.pageNoJB++,
          this.queryDramaGatherPage().then(() => {
            uni.hideLoading();
          });
      } else if (this.tabIndex == 3) {
        if (this.pageNoJB >= this.pagesJb) {
          uni.showToast({
            title: "已加载全部数据~",
            icon: "none",
            duration: 1000,
          });
        } else {
          uni.showLoading({
            title: "加载中...",
          }),
            this.pageNoJB++,
            this.queryWantPlayDramaPage().then(() => {
              uni.hideLoading();
            });
        }
      }
    },
    screenBoxM1() {
      this.showSyntheticSort = false;
      this.screenBox = !this.screenBox;
    },
    closeSearchBox() {
      this.showSyntheticSort = false;
      this.screenBox = false;
    },
    // 点击筛选
    screenBoxM(a, b, c, d) {
      this.pageNo = 1;
      this.gatheringList = [];
      this.screenBox = !this.screenBox;
      this.time_type = a;
      if (b !== null) {
        if (b == 1) {
          this.play_status = 1;
          this.play_notStatus = null;
        } else {
          this.play_notStatus = 1;
          this.play_status = null;
        }
      } else {
        this.play_status = null;
        this.play_notStatus = null;
      }

      this.sell_type = c;
      this.dict_idsList = d;
      if (this.dict_idsList.length == 0 && this.dict_idsList) {
        this.dict_idsList = null;
      }
      console.log("----->", this.dict_idsList);
      this.queryGatherList();
    },
    // 点击综合排序
    syntheticSort() {
      this.screenBox = false;
      this.showSyntheticSort = !this.showSyntheticSort;
    },
    categoryId(date) {
      this.pageNo = 1;
      this.gatheringList = [];
      this.category_id = date;
      this.queryGatherList();
    },
    playNotStatus() {
      this.playNotStatus = "";
    },
    categoryIdYX(date) {
      this.pageNoYX = 1;
      this.category_id_yx = date;
      this.queryPreferredStore();
      console.log("子组件地址数据已返回：", date);
    },
    categoryIdYXZh(date) {
      this.pageNoYX = 1;
      this.sortType = date;
      this.queryPreferredStore();
    },
    async tabtap(index) {
      this.tabIndex = index;
      this.dramaNameKeyword = null;
      this.isFoucs = false;
      this.changeStyle();

      if (index === 0) {
        this.pageNo = 1;
        this.gatheringList = [];
        await this.queryGatherList();
        await this.queryDateList();
      } else if (index === 1) {
        this.pageNoYX = 1;
        this.conditionPageList = [];
        await this.queryPreferredStore();
      } else if (index === 2) {
        this.typeNumber = 1;
        this.pageNoJB = 1;
        this.hotPlayBanList = [];
        await this.queryDramaGatherPage();
      } else if (index === 3) {
        this.typeNumber = 2;
        this.pageNoJB = 1;
        this.hotPlayBanList = [];
        await this.queryWantPlayDramaPage();
      }
      this.isShow = true;
      wx.hideLoading();
      this.contData = this.list[index];
    },
    changeStyle(){
      if (this.tabIndex === 0) {
        this.topBarClass = `active`;
      } else if (this.tabIndex === 1) {
        this.topBarClass = `store`;
      } else if (this.tabIndex === 2) {
        this.topBarClass = `drama`;
      } else if (this.tabIndex === 3) {
        this.topBarClass = `wantPlay`;
      }
    },
    bindPickerChange: function (e) {
      console.log("picker发送选择改变，携带值为", e.detail.value);
      this.index = e.detail.value;
    },
    //授权成功后，重新获取用户信息
    async onSuccessAuthorize() {
      this.userInfor = await this.$checkLogin.getUserInfo(true);
    },
    onGoGather() {
      if (!this.userInfor.phone) return;
      uni.navigateTo({
        url: "/gatherPlayer/pages/goGather",
      });
    },
    onGatherDetail(item) {
      uni.navigateTo({
        url: `/gatherPlayer/pages/index?id=${item.id}`,
      });
    },
    gotoStoreDetail(item) {
      uni.navigateTo({
        url: `/store-package/pages/index?storeId=${item.id}`,
      });
    },
    //切换日期
    onChangeDate2(date) {
      this.pageNo = 1;
      this.gatheringList = [];
      if (date == null) {
        this.currentDate = null;
      } else {
        this.currentDate = date;
      }
      this.queryGatherList();
    },
    //查询组局列表
    async queryGatherList() {
      try {
        let list = await this.$api.getGatheringList2({
          date: this.currentDate,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          cityId: this.cityInfo.cityId,
          userLatitude: uni.getStorageSync("currentLatitude"), //用户-经度
          userLongitude: uni.getStorageSync("currentLongitude"), //	用户-纬度
          operatorType: "USER",
          keyWord: this.dramaNameKeyword, //模糊查询
          districtId: this.category_id, //区域Id
          timeType: this.time_type, //筛选时间日期
          playStatus: this.play_status, //筛选想玩的剧本
          playNotStatus: this.play_notStatus,
          sellType: this.sell_type, //筛选发售方式
          dictIdsList: this.dict_idsList, //筛选类型
          orderBy: this.order_by,
          userId: this.userInfor.id,
        });
        this.gatheringCountToday = list.gatheringCountToday;
        this.sum = list.gatheringCountNum;
        this.pages = list.list.pages;

        this.gatheringList = [...this.gatheringList, ...list.list.records];
      } catch (e) {}
    },
    //查询日期
    async queryDateList() {
      try {
        let res = await this.$api.getUserGatheringOverviewByDate({
          // storeId: uni.getStorageSync("userInfo"),
        });
        this.dateList = res;
      } catch (e) {}
    },
    // 查询热门城市
    async queryHotCity() {
      try {
        let res = await this.$api.getRegionResolver({
          longitude: uni.getStorageSync("currentLongitude"),
          latitude: uni.getStorageSync("currentLatitude"),
        });
        this.ids = res.cityId;
      } catch (e) {}
    },
    // 查询优选门店列表筛选
    async queryPreferredStore() {
      try {
        this.userInfo = await this.$checkLogin.getUserInfo();
        let res = await this.$api.getPreferredStore({
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude"),
          pageNo: this.pageNoYX,
          pageSize: this.pageSizeYX,
          cityId: this.ids,
          beforeThere: this.beforeThere,
          wantPlay: this.wantPlay,
          userId: this.userInfor.id,
          districtId: this.category_id_yx,
          sortType: this.sortType, //综合排序
          storeNameKeyword: this.dramaNameKeyword, //关键词
        });
        this.pagesYX = res.pages;
        if (this.pageNoYX === 1) {
          this.conditionPageList = [];
        }
        this.conditionPageList.push(...res.records);
      } catch (e) {}
    },
    // 剧本信息及组局情况
    async queryDramaGatherPage() {
      try {
        let res = await this.$api.getDramaGatherPage({
          cityId: this.ids, //城市Id
          pageNo: this.pageNoJB,
          pageSize: this.pageSizeJB,
          type: 1, //查询类型
          dictIds: this.dictIdsArr,
          maxGamerNum: this.maxGamerNum, //最大玩家
          minGamerNum: this.minGamerNum, //最小玩家
          dramaNameKeyword: this.dramaNameKeyword, //关键词
        });
        this.pagesJb = res.pages;

        this.hotPlayBanList = [...this.hotPlayBanList, ...res.records];
      } catch (e) {}
    },
    // 我想玩的
    async queryWantPlayDramaPage() {
      try {
        let res = await this.$api.getDramaGatherPage({
          cityId: this.ids, //城市Id
          pageNo: this.pageNoJB,
          pageSize: this.pageSizeJB,
          type: 2, //查询类型
          dramaNameKeyword: this.dramaNameKeyword, //关键词
        });
        this.pagesJb = res.pages;

        this.hotPlayBanList = [...this.hotPlayBanList, ...res.records];
      } catch (e) {}
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
    onGoMyGather() {
      if (!this.userInfor.phone) return;
      uni.navigateTo({
        url: `/gatherPlayer/pages/myGather`,
      });
    },
    backRoute() {
      uni.navigateBack();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.van-search__content {
  background: #f6f6f6;
  width: rpx(200);
  height: rpx(30);
  border-radius: rpx(15);
  display: flex;
  align-items: center;
}

.fixedTop {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
.weekBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 16.13vh;
  white-space: pre;

  &-item {
    @include ver;
    align-items: center;
    margin-left: rpx(14);
    background: unset;
    border-radius: 12px;
    padding: rpx(12) rpx(9);

    &-date {
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 14px;
    }

    &-count {
      margin-top: rpx(12);
      font-size: rpx(12);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 14px;
    }

    .active {
      color: #fff;
    }
  }

  .activeItem {
    background: linear-gradient(180deg, #000000 0%, #000000 100%);
  }
}
.content {
  position: fixed;
  left: 0rpx;
  top: 31vh;
  width: 100vw;
  height: 70vh;
  padding: 0px 30rpx;
  background: #f5f6f8;
  box-sizing: border-box;
  .nomatchingstores {
    display: flex;
    justify-content: center;

    .iconImg {
      width: 88rpx;
      height: 116rpx;
      opacity: 1;
      border: 4rpx solid #e9e9e9;
      position: fixed;
      left: 330rpx;
      top: 732rpx;
    }

    .noStores {
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      position: fixed;
      top: 816rpx;
    }

    .Initiatinggroup {
      width: 222rpx;
      height: 80rpx;
      background: #36e4bb;
      border-radius: 46rpx 46rpx 46rpx 46rpx;
      opacity: 1;
      font-size: 28rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #111111;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 262rpx;
      top: 970rpx;
    }

    .noMore {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      position: fixed;
      left: 305rpx;
      top: 1400rpx;
    }
    .drama-default {
      width: rpx(88);
      height: rpx(88);
      opacity: 1;
      position: fixed;
      left: rpx(144);
    }

    .drama-title {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      line-height: 35rpx;
      position: fixed;
    }

    .drama-content {
      font-size: 28rpx;
      position: fixed;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #5f6572;
      line-height: 33rpx;
    }

    .drama-join {
      width: 220rpx;
      height: 80rpx;
      background: #2e323e;
      border-radius: 46rpx;
      opacity: 1;
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #36e4bb;
        line-height: 33rpx;
      }
    }
  }
}
.active {
  top: 31.5vh;
  height: 70vh;
}
.store {
  top: 21vh;
  height: 79vh;
}
.drama {
  top: 26vh;
  height: 74vh;
}
.wantPlay {
  top: 16vh;
  height: 84vh;
}
.parentChang {
  height: 76rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 1%, #ffffff 25%);
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  top: 28.5vh;
  border-radius: 0rpx 0rpx 28rpx 28rpx;
  z-index: 2;
  .test {
    font-size: 26rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e323e;
    display: flex;
    justify-content: flex-start;
    padding: 20rpx 24rpx;

    .icon {
      width: 28rpx;
      height: 28rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin: 7rpx 8rpx 0rpx 0rpx;
    }

    .number {
      font-size: 26rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #36e4bb;
    }
  }
}
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.myGather {
  position: fixed;
  left: 15px;
  width: rpx(88);
  height: 48px;
  background: #1a1a1a;
  border-radius: 16px;
  @include hor-center-center;
  font-size: rpx(14);
  font-family: PingFang SC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  z-index: 1;
  margin-bottom: 5px;
}

.myGather2 {
  position: fixed;
  left: 80rpx;
  bottom: 84rpx;
  width: 78.4vw;
  height: 6.89vh;
  background: rgba(39, 44, 42, 0.9);
  border-radius: 56rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .myzujuBox {
    display: flex;
    flex-direction: column;
    margin-left: 82rpx;

    .zujuimage {
      width: 82rpx;
      height: 44rpx;
    }

    .myzuju {
      font-size: 20rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-top: 4rpx;
    }
  }

  .fqzujuBox {
    display: flex;
    flex-direction: column;
    margin-left: 88rpx;

    .fqzujuImage {
      width: 82rpx;
      height: 44rpx;
    }

    .piaofangben {
      font-size: 20rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-left: 16rpx;
      margin-top: 4rpx;
    }

    .fqzuju {
      font-size: 20rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-top: 4rpx;
    }
  }

  .myBureau {
    font-size: 28rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #111111;
    margin-left: 54rpx;
    width: 50%;
    border-radius: 0rpx 40rpx 40rpx 0rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: rgba(255, 255, 255, 0.73);
  }

  .InitiatingGroup {
    width: 50%;
    font-size: 28rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #111111;
    background: #36e4bb;
    border-radius: 0rpx 40rpx 40rpx 0rpx;
    height: 80rpx;
    line-height: 80rpx;
    padding-left: 56rpx;
  }
}

.open {
  position: fixed;
  right: 15px;
  width: rpx(242);
  height: 48px;
  background: #14c9c9;
  border-radius: 16px;
  @include hor-center-center;
  font-size: rpx(14);
  font-family: PingFang SC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  z-index: 1;
  margin-bottom: 32rpx;
}

.selectaAction {
  margin: 200rpx;
}

.cityCheck {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 30rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  .Box2 {
    display: flex;
    justify-content: flex-start;

    .uni-input {
      max-width: 100rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .iconDown {
    width: 14rpx;
    height: 10rpx;
    margin-left: 2rpx;
    margin-top: 13rpx;
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

  .searchBox {
    margin-left: 28rpx;
    width: 40vw;
    height: 60rpx;
    background: #f5f6f8;
    border-radius: 15px;
    @include hor-center-center;
    position: relative;
    &-placeholder {
      image {
        width: 32rpx;
        height: 32rpx;
      }
      span {
        font-size: 26rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #959aa5;
      }
    }
    input {
      @include abscenter;
      text-align: center;
    }
  }
}

.headTabar {
  position: fixed;
  left: 40rpx;
  top: 12.43vh;
}

.searchPlace2 {
  position: fixed;
  top: 25.86vh;
  z-index: 9;
}
</style>