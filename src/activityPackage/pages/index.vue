<template>
  <view class="homeContent">
    <div class="back" @click="onBack" :style="'top:' + statusHeight + 'px;'" v-if="statusHeight > 0"><image src="../static/image/icon-home.png"/></div>
    <div class="fixedBg"></div>
    <swiper
      class="homeContent-swiper"
      :current="currentBanner"
      @change="onChangeBanner"
      autoplay
    >
      <swiper-item v-for="it in swiperList" :key="it.id">
        <image :src="it.url" mode="aspectFill" @click="onPreView(it.url)" />
      </swiper-item>
    </swiper>
    <div class="homeContent-tag">
      <image src="../static/image/company-tag.png" />
    </div>
    <div class="listBox">
      <div class="listBox-searchBox">
        <image src="../static/image/search.png" />
        <input
          confirm-type="search"
          placeholder="输入剧本名/发行"
          v-model="keywords"
          @confirm="onSearch"
          @input="onInputSearch"
          @focus="onFocus"
        />
        <div @click="onSearch">搜索</div>
      </div>
      <div class="listBox-dramaBox">
        <div class="listBox-dramaBox-filterBox">
          <filterParama
            ref="filterParama"
            :filterParama="filterParama"
            @on-reset="onReset"
            @on-filter="onFilter"
            @on-change="showPop = !showPop"
            @on-show-pop="onChangePop"
          />
          <image
            src="../static/image/icon-filter.png"
            class="listBox-dramaBox-filterBox-filter"
            @click="onShowFilterPop"
          />
          <div class="popUpBox" v-if="showPop">
            <div class="popUpBox-bg" @click="onClosePop"></div>
            <paramasPop
              ref="paramasPop"
              :type="filterType"
              :coreTypeList="coreTypeList"
              :organizerList="organizerList"
              @on-change="onGetParama"
            />
          </div>
        </div>
        <div
          v-for="item in allDramaList"
          :key="item.dramaId"
          class="listBox-dramaBox-item"
          @click="onGoDetail(item)"
        >
          <image
            :src="item.dramaCover"
            class="listBox-dramaBox-item-cover"
            mode="aspectFill"
          />
          <image
            :src="sellTag(item.sellType)"
            class="listBox-dramaBox-item-sellImg"
          />
          <div class="listBox-dramaBox-item-num">
            {{ item.maxGamerNum }}人本
          </div>
          <div class="listBox-dramaBox-item-name">{{ item.dramaName }}</div>
          <div class="listBox-dramaBox-item-logoContent">
            <div class="listBox-dramaBox-item-logoContent-logoBox" v-if="item.organizerAvatar">
              <image :src="item.organizerAvatar" />
            </div>
            <div class="listBox-dramaBox-item-logoContent-title" v-if="item.organizerType">
              {{item.organizerType ? $enums.OrganizerType.getName(item.organizerType):''}}{{ item.organizerName ? `：${item.organizerName}`:'' }}
            </div>
          </div>
          <div class="listBox-dramaBox-item-publisherContent">
            <div class="listBox-dramaBox-item-publisherContent-logoBox" v-for="v in item.publisherItems" :key="v.id">
              <image :src="v.publisherLogo" v-if="v.publisherLogo"/>
              <span>{{ v.publisherName }}</span>
            </div>
          </div>
          <div class="listBox-dramaBox-item-typeBox">
            <span>{{
              (item.maleGamerNum ? item.maleGamerNum + "男" : "") +
              (item.femaleGamerNum ? item.femaleGamerNum + "女" : "")
            }}</span>
            <div class="listBox-dramaBox-item-typeBox-line"></div>
            <span>{{ item.gameTime + "小时" }}</span>
          </div>
          <scroll-view class="listBox-dramaBox-item-brief" scroll-x>
            <div
              v-for="tag in item.dramaThemeList"
              :key="tag.id"
              class="listBox-dramaBox-item-brief-span"
            >
              {{ tag.dictValue }}
            </div>
          </scroll-view>
          <image src="../static/image/icon-first.png" v-if="item.isFirst === 1" class="listBox-dramaBox-item-first"/>
          <image src="../static/image/icon-haveUse.png" v-if="item.isClaimed === 1" class="listBox-dramaBox-item-useTag"/>
        </div>
      </div>
      <notc-data
        note="没有找到相关剧本"
        v-if="!allDramaList.length"
      ></notc-data>
    </div>
    <filterPopBox
      v-if="showSticky"
      :val="filterParama"
      :coreTypeList="coreTypeList"
      :organizerList="organizerList"
      :statusHeight="statusHeight"
      @on-change="onGetParama"
      @on-search="onChangeSearch"
      @on-show="onShowFilterPop"
    />
    <van-action-sheet
      :show="showFilterPop"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showFilterPop = false"
    >
      <filterAllPop
        ref="filterAllPop"
        :coreTypeList="coreTypeList"
        :organizerList="organizerList"
        @on-close="onCloseFilterPop"
      />
    </van-action-sheet>
    <BindPhone
      @on-success-authorize="onSuccessAuthorize"
      ref="BindPhone"
      paddingBottom="5vh"
      :canReject="false"
      v-if="userInfor && !userInfor.phone"
    ></BindPhone>
  </view>
</template>
<script>
import notcData from "@/components/notc-data/index.vue";
import filterPopBox from "./filterPopBox.vue";
import filterParama from "./filterParama.vue";
import paramasPop from "./paramas.vue";
import filterAllPop from "./filterAllPop.vue";
import { windowHeight, safeBottom, systemInfo } from "@/utils";
import service from "../utils/service";
import BindPhone from "@/components/bindPhone/index.vue";
export default {
  components: {
    notcData,
    filterPopBox,
    filterParama,
    paramasPop,
    filterAllPop,
    BindPhone
  },
  data() {
    return {
      currentBanner: 0,
      isShowPop: false,
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      filterCount: 0,
      allDramaList: [],
      keywords: null,
      windowHeight: 0,
      safeHeight: 0,
      systemInfo: null,
      showSticky: false,
      showPop: false,
      filterType: 0,
      coreTypeList: [],
      organizerList: [],
      filterParama: [],
      showFilterPop: false,
      swiperList: [],
      userInfor: null,
      statusHeight: 0
    };
  },
  async created() {
    uni.clearStorageSync();
    wx.showLoading();

    this.userInfor = await this.$checkLogin.getUserInfo();

    await this.getBarHeight();
    await this.queryOrganizerType();
    this.systemInfo = await systemInfo();
    this.windowHeight = await windowHeight();
    this.safeHeight = await safeBottom();

    this.querySwiperList();
    this.queryAllDramaList();
    this.loadDramaCoreType();
    this.getExhibitionOrganizer();

    this.$nextTick(_=>{
      if(this.userInfor && !this.userInfor.phone && this.$refs.BindPhone){
        this.$refs.BindPhone.onAuthorize();
      }
    })
  },
  computed: {
    sellTag() {
      return function (type) {
        let src;
        switch (type) {
          case "BOXED":
            src = "../static/image/icon-tag-3.png";
            break;
          case "LIMITED":
            src = "../static/image/icon-tag-2.png";
            break;
          case "EXCLUSIVE":
            src = "../static/image/icon-tag-1.png";
            break;
          case "REAL_SCENE":
            src = "../static/image/icon-tag-4.png";
            break;
          default:
        }
        return src;
      };
    },
  },
  onShareAppMessage() {
    return {
      title: "",
      path: `/activityPackage/pages/index`,
    };
  },
  onReachBottom() {
    if(this.totalCount === this.allDramaList.length)return;

    this.pageNo++;
    this.queryAllDramaList();
  },
  onPageScroll(event) {
    let status =
      this.safeHeight === 0 && this.systemInfo.system.indexOf("iOS") !== -1
        ? 44
        : 0;
    if (event.scrollTop > this.windowHeight * 0.492 + status) {
      this.showSticky = true;
      this.showPop = false;
    } else {
      this.showSticky = false;
    }
    this.$refs.filterParama.onCloseFilter();
  },
  methods: {
    onBack(){
      uni.clearStorageSync();
      uni.reLaunch({
        url: '/pages/index/index'
      })
    },
    onPreView(url) {
      wx.previewImage({
        current: url,
        urls: this.swiperList.map((it) => it.url),
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },
    onShowFilterPop() {
      this.onFocus();
      this.showFilterPop = true;
      this.$nextTick((_) => {
        this.$refs.filterAllPop.show(this.filterParama);
      });
    },
    onCloseFilterPop(val) {
      this.filterParama = val || [];
      this.showFilterPop = false;
      this.pageNo = 1;
      this.queryAllDramaList();
    },
    onFocus(){
      this.showPop = false;
      this.$refs.filterParama.onCloseFilter();
    },
    onSearch() {
      this.pageNo = 1;
      this.queryAllDramaList();
    },
    onInputSearch(){
      if(!this.keywords.length){
        this.pageNo = 1;
        this.queryAllDramaList();
      }
    },
    onChangeSearch(val) {
      this.pageNo = 1;
      this.keywords = val;
      this.queryAllDramaList();
    },
    onChangeBanner(event) {
      this.currentBanner = event.detail.current;
    },
    //筛选层
    onChangePop(show) {
      this.showPop = show;
      if (show) {
        this.$nextTick((_) => {
          this.$refs.paramasPop.refresh(this.filterParama);
        });
      }
    },
    onFilter(type) {
      this.filterType = type;
    },
    onClosePop() {
      this.showPop = false;
      this.$refs.filterParama.onCloseFilter();
    },
    onGetParama(val) {
      this.filterParama = val || [];
      this.showPop = false;
      this.$refs.filterParama.onCloseFilter();
      this.pageNo = 1;
      this.queryAllDramaList();
    },
    onReset() {
      this.filterParama = [];
      this.pageNo = 1;
      this.queryAllDramaList();
    },
    onGoDetail(drama) {
      uni.navigateTo({
        url: "./detail" + "?scriptID=" + drama.dramaId,
      });
    },
    /**
     * 查询剧本列表
     */
    async queryAllDramaList() {
      //主办方
      let organizerId;
      if (this.filterParama.length) {
        if(this.filterParama.findIndex(v=>v.type === 'organizer') > -1){
          if (this.filterParama[this.filterParama.findIndex(v=>v.type === 'organizer')].value) {
            organizerId = this.filterParama[this.filterParama.findIndex(v=>v.type === 'organizer')].value;
          }
        }
      }
      //剧本题材
      let dramaThemeId;
      if (this.filterParama.length) {
        if(this.filterParama.findIndex(v=>v.type === 'coreType') > -1){
          if (this.filterParama[this.filterParama.findIndex(v=>v.type === 'coreType')].value) {
            dramaThemeId = this.filterParama[this.filterParama.findIndex(v=>v.type === 'coreType')].value;
          }
        }
      }
      //剧本人数
      let minGamerNum;
      let maxGamerNum;
      if (this.filterParama.length) {
        if(this.filterParama.findIndex(v=>v.type === 'player') > -1){
          if (this.filterParama[this.filterParama.findIndex(v=>v.type === 'player')].value) {
            switch (this.filterParama[this.filterParama.findIndex(v=>v.type === 'player')].value) {
              case "≤4人":
                minGamerNum = 4;
                maxGamerNum = 0;
                break;
              case "5人":
                minGamerNum = 5;
                maxGamerNum = 5;
                break;
              case "6人":
                minGamerNum = 6;
                maxGamerNum = 6;
                break;
              case "7人":
                minGamerNum = 7;
                maxGamerNum = 7;
                break;
              case "8人":
                minGamerNum = 8;
                maxGamerNum = 8;
                break;
              case "≥9人":
                minGamerNum = null;
                maxGamerNum = 9;
                break;
              default:
            }
          }
        }
      }
      //剧本时长
      // let maxTimeNum;
      // let minTimeNum;
      // if (this.filterParama.length) {
      //   if(this.filterParama.findIndex(v=>v.type === 'time') > -1){
      //     if (this.filterParama[this.filterParama.findIndex(v=>v.type === 'time')].value) {
      //       switch (this.filterParama[this.filterParama.findIndex(v=>v.type === 'time')].value) {
      //         case "2~4小时":
      //           maxTimeNum = 4;
      //           minTimeNum = 2;
      //           break;
      //         case "4~6小时":
      //           maxTimeNum = 6;
      //           minTimeNum = 4;
      //           break;
      //         case "6~8小时":
      //           maxTimeNum = 8;
      //           minTimeNum = 6;
      //           break;
      //         case "8~10小时":
      //           maxTimeNum = 10;
      //           minTimeNum = 8;
      //           break;
      //         case "10~12小时":
      //           maxTimeNum = 12;
      //           minTimeNum = 10;
      //           break;
      //         default:
      //           break;
      //       }
      //     }
      //   }
      // }
      //是否首发
      let isFirst;
      if (this.filterParama.length) {
        if(this.filterParama.findIndex(v=>v.type === 'isFirst') > -1){
          if (this.filterParama[this.filterParama.findIndex(v=>v.type === 'isFirst')].value) {
            isFirst = this.filterParama[this.filterParama.findIndex(v=>v.type === 'isFirst')].value === '是' ? 1 : 0;
          }
        }
      }
      //发售类型
      let sellType;
      if (this.filterParama.length) {
        if(this.filterParama.findIndex(v=>v.type === 'sellType') > -1){
          if (this.filterParama[this.filterParama.findIndex(v=>v.type === 'sellType')].value) {
            sellType = this.filterParama[this.filterParama.findIndex(v=>v.type === 'sellType')].value;
          }
        }
      }

      try {
        let data = await service.exhibitionDramaPage({
          pageNo: this.pageNo /*当前页码*/,
          pageSize: this.pageSize /*分页大小*/,
          keywords: this.keywords,
          exhibitionId: 1,
          dramaThemeList: dramaThemeId ? [dramaThemeId] : [],
          minGamerNum,
          maxGamerNum,
          // minTimeNum,
          // maxTimeNum,
          organizerId,
          isFirst,
          sellType
        });
        if (this.pageNo === 1) {
          this.allDramaList = [];
        }

        if (data.records && data.records.length) {
          this.allDramaList.push(...data.records);
        } 
        this.totalCount = data.total;
        wx.hideLoading();
      } catch (e) {
        wx.hideLoading();
      }
    },
    /**
     * 加载剧本类型字段
     */
    async loadDramaCoreType() {
      let data = await service.queryExhibitionDict({});

      let index = data.findIndex((it) => it.typeValue === "剧本题材");
      this.coreTypeList = data[index].dictList;
    },
    //获取主办方参数
    async getExhibitionOrganizer() {
      try {
        let data = await service.exhibitionOrganizerMap({ exhibitionId: 1 });
        this.organizerList = data.items;
      } catch (e) {}
    },
    //展会轮播图列表
    async querySwiperList() {
      try {
        let data = await service.exhibitionRotationChartList({
          exhibitionId: 1,
        });
        this.swiperList = data.records;
      } catch (e) {}
    },
    async onSuccessAuthorize(){
      this.userInfor = await this.$checkLogin.getUserInfo(true);
    },
    getBarHeight() {
      const res = wx.getMenuButtonBoundingClientRect()
      const statusHeight = res.top - 2; //胶囊距离顶部
      this.statusHeight = statusHeight
    },
    //展会主办方类型
    async queryOrganizerType(){
      try{
        let data = await service.exhibitionTypeList({});
        data.list.map(v=>{
          this.$enums.OrganizerType.list.push({
            value: v.organizerType,
            label: v.organizerTypeName
          })
        })
      }catch(e){}
    }
  },
};
</script>
<style lang="scss" scoped>
.homeContent {
  &-swiper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 58vh;
    image {
    }
  }
  &-tag {
    position: fixed;
    top: 45.5vh;
    right: rpx(12);
    width: rpx(68);
    height: rpx(23);
  }
}
.listBox {
  position: absolute;
  left: 0;
  right: 0;
  top: 49.3vh;
  bottom: 0;
  &-searchBox {
    margin: 0 rpx(12);
    width: 93.6vw;
    height: rpx(36);
    border: 1px solid #1cbc80;
    border-radius: 30px;
    background: #fff;
    @include hor;
    align-items: center;
    position: relative;
    image {
      position: absolute;
      left: 13px;
      width: rpx(18);
      height: rpx(18);
    }
    input {
      position: absolute;
      left: rpx(37);
      right: rpx(80);
    }
    div:nth-child(3) {
      position: absolute;
      right: rpx(3);
      top: rpx(3);
      width: rpx(56);
      height: rpx(30);
      background: #1cbc80;
      border-radius: 48px;
      @include hor-center-center;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: rpx(30);
    }
  }
  &-dramaBox {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    margin-top: rpx(10);
    background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 20%);
    &-filterBox {
      @include hor;
      align-items: center;
      padding: rpx(12);
      position: relative;
      &-filter {
        position: absolute;
        right: rpx(12);
        width: rpx(42);
        height: rpx(20);
      }
      .popUpBox {
        position: absolute;
        left: 0;
        right: 0;
        top: 6vh;
        height: 80vh;
        z-index: 10;
        &-bg {
          background: rgba($color: #000000, $alpha: 0.6);
          @include abscenter;
        }
      }
    }
    &-item {
      height: 16.8vh;
      background: #fff;
      border-radius: 8px;
      margin: 1vh 8px 0px 8px;
      position: relative;
      &-cover {
        margin: 11px 10px;
        width: 22.4vw;
        height: 14.4vh;
        border-radius: 4px;
        position: relative;
      }
      &-name {
        position: absolute;
        left: 27.7vw;
        top: 1.2vh;
        font-size: rpx(16);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #111111;
        line-height: rpx(19);
        @include text-overflow-line(1);
      }
      &-logoContent {
        @include hor;
        align-items: center;
        position: absolute;
        left: 27.5vw;
        top: 4.2vh;
        &-logoBox {
          width: rpx(21);
          height: rpx(21);
          border-radius: 30px;
          background: #fff;
          @include hor-center-center;
          overflow: hidden;
          z-index: 1;
          image {
            width: rpx(17);
            height: rpx(17);
            border-radius: 30px;
            border: 1rpx solid #e3dbc0;
          }
        }
        &-title {
          padding: 1px 4px 1px 8px;
          background: #EDE7D5;
          border-radius: 2px;
          font-size: rpx(11);
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5a4d21;
          margin-left: -4px;
        }
      }
      &-publisherContent{
        position: absolute;
        left: 27.7vw;
        top: 7.5vh;
        overflow-x: scroll;
        white-space: nowrap;
        width: 70%;
        &-logoBox {
          display: inline-flex;
          align-items: center;
          image {
            width: rpx(17);
            height: rpx(17);
            border-radius: 30px;
            border: 1px solid;
            border-image: linear-gradient(140deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1 1;
          }
          span{
            margin-left: rpx(4);
            margin-right: rpx(8);
            font-size: rpx(11);
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #111;
          }
        }
      }
      &-num {
        position: absolute;
        left: 15.4vw;
        top: 13vh;
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
      }
      &-sellImg {
        position: absolute;
        left: 16vw;
        top: 1.7vh;
        width: rpx(30);
        height: rpx(16);
      }
      &-typeBox {
        position: absolute;
        left: 27.7vw;
        top: 10.5vh;
        @include hor;
        align-items: center;
        span {
          font-size: rpx(11);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
        }
        &-line {
          width: 0.5px;
          height: rpx(15);
          background: #E2E2E2;
          margin: 0 6px;
        }
      }
      &-brief {
        position: absolute;
        left: 27.7vw;
        top: 13.2vh;
        @include hor;
        align-items: center;
        white-space: nowrap;
        width: 70%;
        &-span {
          padding: 2px 4px;
          border-radius: 4px 4px 4px 4px;
          font-size: rpx(11);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          display: inline-flex;
          align-items: center;
          margin-right: 4px;
          background: rgba(17, 17, 17, 0.1);
        }
      }
      &-first{
        position: absolute;
        right: 0;
        top: 0;
        width: rpx(32);
        height: rpx(18);
      }
      &-useTag{
        position: absolute;
        right: rpx(0);
        top: 0;
        width: rpx(74);
        height: rpx(74);
        z-index: 1;
      }
    }
  }
}
.back{
  position: fixed;
  left: 0;
  height: rpx(36);
  padding-left: rpx(20);
  @include hor-center-center;
  z-index: 1;
  image{
    width: 52px;
    height: 32px;
  }
}
</style>
