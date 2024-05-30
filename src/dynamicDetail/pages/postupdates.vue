<template>
  <div class="dynamic-container">
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left" class="custom-navigation">
        <view class="topNav">
          <van-icon
              name="arrow-left"
              @click="backRoute"
              style="color: #000"
              size="50rpx"
          />
        </view>
        <span class="custom-title">发布动态</span>
      </view>
    </navigation-bar>
    <div class="content-header">
      <main class="commit-main">
        <section class="commit-ctx">
          <div>
            <textarea
                v-model="messageonce"
                @blur="onBlurText"
                auto-height
                placeholder="分享你的有趣见闻～"
                :maxlength="1000"
            />
          </div>
          <div class="commit-ctx-numBox">{{messageonce.length}}</div>
        </section>

        <!-- 图片上传区域   @change="handleInput(item)"  :before-read="beforeRead"  -->

        <section>
          <van-uploader
              :file-list="fileList"
              @after-read="afterRead"
              @max-count="maxCount"
              multiple
              @deletable="true"
              @delete="onDelete"
              :show-upload="showPublishPhoto">
            <div class="custom-publish-photo" v-if="showPublishPhoto">
              <img :src="$iconFont.getIconName('dynamic-publish-photo')" />
              <p>{{customerPhotoText}}</p>
            </div>
          </van-uploader>
        </section>

      </main>
    </div>
    <div class="content-middle" v-if="!isJoinContent">
      <div class="all-left">关联内容</div>
      <div class="all-right" @click="allrightBut">
        <span>选择本次动态需要关联的内容</span>
        <img class="right-icon" :src="$iconFont.getIconName('arrowright')" alt/>
      </div>
    </div>
    <div class="content-middle" v-else>
      <div class="all-left" @click="allrightBut">
        <span v-if="storeId !== null">店铺</span>
        <span v-else-if="withDramaId !== null">剧本</span>
        <span v-else-if="withUserId !== null">用户</span>
        <span v-else-if="withInfoId !== null">资讯</span>
        <span v-else-if="withRankings !== null">排行榜</span>
        <img class="left-icon" :src="$iconFont.getIconName('arrowright')" alt/>
      </div>
      <div class="all-right" v-if="activeData !== null">
        <span class="choose-join" @click="chooseDynamic({id: activeData.joinType})">{{ $filters.truncateText(activeData.name, 15) }}</span>
        <img class="right-icon" :src="$iconFont.getIconName('arrowright')" alt/>
      </div>
    </div>
    <div class="bottom-box">
      <div class="popup-gradient" :style="publishDynamicDisable ? null : 'background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);'">
        <div class="popup-confirm" @click="addDynamicWithDrama" :style="publishDynamicDisable ? 'background: #D0D0D0' : 'background: #111111;'">确认</div>
      </div>
    </div>


    <van-overlay
        :z-index="100002"
        custom-style="background-color: rgba(98, 99, 100, 0.6) !important;"
        :show="experienceRole"
        @click="experienceRole = false"
    >
      <div class="experience-role" @click.stop>
        <select-experience
            :active-object="activeData"
            @closeExperienceRole="closeExperienceRole"
            @chooseDynamic="chooseDynamic"
        ></select-experience>
      </div>
    </van-overlay>

    <van-popup
        :show="showShop"
        :z-index="10000111"
        closeable
        round
        @click-overlay="showShop = false"
        @close="closePopup"
        close-on-click-overlay
        :close-icon="$iconFont.getIconName('dynamic-join-close')"
        position="bottom"
        :style="{ height: '75%' }"
    >
      <block v-if="currentPopupType === 1">
        <div class="popDramaBox">
          <div class="popDramaBox-title">关联剧本 ({{dramaTotal}})</div>
          <div class="popDramaBox-searchBox">
            <input v-model="nameKeyWord" @focus="onFocus" @input="onFocus" @blur="onSearch"/>
            <div class="popDramaBox-searchBox-placeholderBox" v-if="!nameKeyWord">
              <image src="../static/image/icon-search.png"/>
              <span>请输入关键字搜索</span>
            </div>
          </div>
          <div class="popDramaBox-filterBox">
            <div class="popDramaBox-filterBox-item">
              <span>题材：</span>
              <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
                <div class="popDramaBox-filterBox-item-scrolls-item" :class="dictParama === dic.id ? 'active':''" v-for="dic in dicts" :key="dic.id" @click="onSelectDict(dic.id)">{{dic.dictValue}}</div>
              </scroll-view>
            </div>
            <div class="popDramaBox-filterBox-item">
              <span>人数：</span>
              <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
                <div class="popDramaBox-filterBox-item-scrolls-item" :class="peopleParama === v ? 'active':''" v-for="v in peoples" :key="v"  @click="onSelectPeople(v)">{{v}}</div>
              </scroll-view>
            </div>
          </div>
          <scroll-view class="popDramaBox-listBox" scroll-y @scrolltolower="onLoadMore" v-if="dramaList.length">
            <div class="popDramaBox-listBox-item" v-for="(drama,index) in dramaList" :key="drama.id" >
              <div class="popDramaBox-listBox-item-cover">
                <image :src="$filters.processLogo(drama.dramaCover)" mode="aspectFill"/>
                <image
                    :src="sellType(drama.sellType)"
                    v-if="sellType(drama.sellType)"
                    class="popDramaBox-listBox-item-cover-sellType"
                />
              </div>
              <div class="popDramaBox-listBox-item-info">
                <span>{{ $filters.truncateText(drama.dramaName, 13) }}</span>
                <span>{{dictValue(drama.dramaThemeList)}}</span>
                <span>{{drama.maleGamerNum}}男{{drama.femaleGamerNum}}女 {{drama.gameTime}}小时</span>
              </div>
              <div class="shop-radio" @click="changeDrama(drama,index)">
                <div class="radio-group">
                  <image
                      v-if="drama.activeGroup || (isJoinContent && activeDataMock.joinType === 1 && activeDataMock.id === drama.id)"
                      class="radio"
                      :src="$iconFont.getIconName('selected-icon')"
                  />
                </div>
              </div>
            </div>
          </scroll-view>
          <notcData v-else/>
        </div>
      </block>
      <block v-if="currentPopupType === 2">
        <div class="popup-header">
          <div class="header-title">选择店铺</div>
          <div class="header-box">
            <div class="header-city" @click="userChooseCityNavigator(false)">
              <p>{{ cityInfo.city }}</p>
              <van-icon name="arrow-down"/>
            </div>
            <div class="header-search">
              <van-search @change="handleSearchChange" placeholder="请输入关键词搜索"/>
            </div>
          </div>
        </div>

        <scroll-view
            class="shop-content"
            style="height: 50vh;background: #fafafa"
            scroll-y
            @scrolltolower="loadMoreData"
            @refresherrestore="onRestore"
        >
          <div>
            <div
                class="shop-list"
                v-for="(i, _) in queryStoreDramaList"
                :key="_"
            >
              <div class="shop-img">
                <image
                    class="submit-icon"
                    :src="$filters.processLogo(i.storeLogo)"
                    mode="aspectFill"
                    alt
                />
              </div>
              <div class="shop-text">
                <div class="shop-name">{{ i.storeName }}</div>
                <div class="shop-address">
                  {{ distance(i) }}{{ i.address }}
                </div>
              </div>
              <div class="shop-radio" @click="changeShopRadio(i, _)">
                <div class="radio-group">
                  <image
                      v-if="i.activeGroup || (isJoinContent && activeDataMock.joinType === 2 && activeDataMock.id === i.id)"
                      class="radio"
                      :src="$iconFont.getIconName('selected-icon')"
                  />
                </div>
              </div>
            </div>
            <div v-if="!hasMoreData" class="no-more-data">没有更多数据了~</div>
          </div>
        </scroll-view>
      </block>
      <block v-if="currentPopupType === 3">
        <div class="popup-header">
          <div class="header-title">选择资讯</div>

          <div class="header-box">
            <div class="header-search">
              <van-search @change="handleSearchChange" placeholder="输入关键词搜索"/>
            </div>
          </div>
        </div>

        <scroll-view
            class="shop-content"
            style="height: 50vh;background: #fafafa"
            scroll-y="true"
            @scrolltolower="loadMoreData"
            @refresherrestore="onRestore"
        >
          <div>
            <div
                class="shop-list"
                v-for="(i, _) in officialDynamicListList"
                :key="_"
            >
              <div class="shop-img">
                <image
                    class="submit-icon"
                    :src="i.activityImg"
                    mode="aspectFill"
                    alt
                />
              </div>
              <div class="shop-text">
                <div class="shop-name">{{ $filters.truncateText(i.activityName, 13) }}</div>
                <div class="shop-address">
                  {{ $filters.truncateText(i.contentText,15) }}
                </div>
              </div>
              <div class="shop-radio" @click="changeofficialDynamicList(i, _)">
                <div class="radio-group">
                  <image
                      v-if="i.activeGroup || (isJoinContent && activeDataMock.joinType === 3 && activeDataMock.id === i.id)"
                      class="radio"
                      :src="$iconFont.getIconName('selected-icon')"
                  />
                </div>
              </div>
            </div>
            <div v-if="!hasMoreData" class="no-more-data">没有更多数据了~</div>
          </div>
        </scroll-view>
      </block>
      <block v-if="currentPopupType === 4">
        <div class="popup-header">
          <div class="header-title">选择用户</div>
          <div class="header-box">
            <div class="header-search">
              <van-search @change="handleSearchChange" placeholder="输入关键词搜索"/>
            </div>
          </div>
        </div>

        <scroll-view
            class="shop-content"
            style="height: 50vh"
            scroll-y
            @scrolltolower="loadMoreData"
            @refresherrestore="onRestore"
        >
          <div>
            <div class="related-content-container" >
              <div v-for="(item, index) in queryUserListList" :key="item.id" class="related-content">
                <span class="all-left">
                   <img :src="$filters.processLogo(item.avatar)" alt/>
                  {{item.nickName}}</span>
                <div class="all-right" @click="queryUserListButton(item, index)">
                  <div class="circleright">
                    <image
                        v-if="item.activeGroup || (isJoinContent && activeDataMock.joinType === 4 && activeDataMock.id === item.id)"
                        class="radio"
                        :src="$iconFont.getIconName('selected-icon')"
                    />

                  </div>

                </div>
                <div class="split-line"></div>

              </div>
            </div>
          </div>
        </scroll-view>
      </block>
      <block v-if="currentPopupType === 5">
        <div class="pupc-header">
          <div class="header-title">选择排行榜</div>
          <scroll-view style="height: 50vh" scroll-y="true"  class="shop-content">

            <view class="masonry">
              <view class="col">
                <view class="second-column-top-box"  @click="chooseRankType('HOT_RANK')">
                  <div style="position: relative; width: 100%; height: 204rpx">
<!--                    <p class="title">热门榜</p>-->
                    <image
                        class="sort-pic"
                        :src="$iconFont.getIconName('hot-rank-background')"
                        mode="aspectFit"

                    />
                    <div class="sort-pic-circle" >
                      <image
                          class="radio"
                          :src="$iconFont.getIconName('selected-icon')"
                          v-if="selectedButton === 'HOT_RANK'"
                      />
                    </div>
                  </div>
                  <div class="dramaTourRankings">
                    <div
                        class="Rankings"
                        v-for="(item, index) in rankingListList"
                        :key="index"
                    >
                      <span class="person-text-one">{{ index + 1 }} {{ $filters.truncateText(item.dramaName, 10) }}</span>
                    </div>
                    <div class="Rankings">
                      <span class="person-text-one">......</span>
                    </div>
                  </div>
                </view>
                <view class="second-column-top-box"  @click="chooseRankType('PRAISE_RANK')">
                  <div style="position: relative; width: 100%; height: 204rpx">
<!--                    <p class="title">口碑榜</p>-->
                    <image
                        class="sort-pic"
                        :src="$iconFont.getIconName('praise-rank-background')"
                        mode="aspectFit"

                    />
                    <div class="sort-pic-circle"   >
                      <image
                          class="radio"
                          :src="$iconFont.getIconName('selected-icon')"

                          v-if="selectedButton === 'PRAISE_RANK'"
                      />
                    </div>
                  </div>
                  <div class="dramaTourRankings">
                    <div
                        class="Rankings"
                        v-for="(item, index) in rankingListListSecond"
                        :key="index"
                    >
                      <span class="person-text-one">{{ index + 1 }} {{ $filters.truncateText(item.dramaName, 10) }}</span>
                    </div>
                    <div class="Rankings">
                      <span class="person-text-one">......</span>
                    </div>
                  </div>
                </view>
              </view>
              <view class="col">
                <view class="second-column-top-box"  @click="chooseRankType('GATHER_SUM_RANK')">
                  <div style="position: relative; width: 100%; height: 204rpx">
<!--                    <p class="title">人气总榜</p>-->
                    <image
                        class="sort-pic"
                        :src="$iconFont.getIconName('gather-sum-rank-background')"
                        mode="aspectFit"
                    />
                    <div class="sort-pic-circle">
                      <image
                          class="radio"
                          :src="$iconFont.getIconName('selected-icon')"

                          v-if="selectedButton === 'GATHER_SUM_RANK'"
                      />
                    </div>
                  </div>
                  <div class="dramaTourRankings">
                    <div
                        class="Rankings"
                        v-for="(item, index) in rankingListListThird"
                        :key="index"
                    >
                      <span class="person-text-one">{{ index + 1 }} {{ $filters.truncateText(item.dramaName, 10) }}</span>
                    </div>
                    <div class="Rankings">
                      <span class="person-text-one">......</span>
                    </div>
                  </div>
                </view>
                <view class="second-column-top-box"  @click="chooseRankType('FOCUS_RANK')">
                  <div style="position: relative; width: 100%; height: 204rpx">
<!--                    <p class="title">期待榜</p>-->
                    <image
                        class="sort-pic"
                        :src="$iconFont.getIconName('focus-rank-background')"
                        mode="aspectFit"
                    />
                    <div class="sort-pic-circle">
                      <image
                          class="radio"
                          :src="$iconFont.getIconName('selected-icon')"

                          v-if="selectedButton === 'FOCUS_RANK'"
                      />
                    </div>
                  </div>
                  <div class="dramaTourRankings">
                    <div
                        class="Rankings"
                        v-for="(item, index) in rankingListListFourth"
                        :key="index"
                    >
                      <span class="person-text-one">{{ index + 1 }} {{ $filters.truncateText(item.dramaName, 10) }}</span>
                    </div>
                    <div class="Rankings">
                      <span class="person-text-one">......</span>
                    </div>
                  </div>
                </view>
              </view>
            </view>


          </scroll-view>

        </div>

      </block>
      <div class="popup-bottom">
        <div class="popup-gradient">
          <div class="popup-confirm" @click="handlePopupConfirm">确认</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service.js";
import {uploadMultipleFiles, checkContent} from "@/utils";
import SelectExperience from "../component/selectExperience.vue";
import notcData from "@/components/notc-data/index.vue";
import {
  userChooseCityNavigator,
  discoverListNavigator,
} from "@/utils/navigator.js"

// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
  components: {notcData, SelectExperience, navigationBar},
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
        bgBackground: "#F6F8F9",
        customTitle: true,
        weight: 400,
      },
      userId:uni.getStorageSync("userInfo").id,
      withRankings:null,
      canDo: false,
      selectedButton: null,
      withInfoIdmock:"",
      evaluateDrama: null,
      dictParama: null,
      dramaTotal: 0,
      dicts: [],
      peopleParama: "全部",
      peoples: ["全部", "≤4人", "5人", "6人", "7人", "8人", "≥9人"],
      dramaList: [],
      queryUserListList:[],
      rankingListList:[],
      officialDynamicListList:[],
      rankingListListSecond:[],
      rankingListListThird:[],
      rankingListListFourth:[],
      withUserId: null,
      withUserIdmock:"",
      cityInfo: uni.getStorageSync("cityInfo"),
      rankingList: [],
      showShop: false,
      currentPopupType: "",
      experienceRole: false,
      maxCount: 9, // 最多上传6张图片
      fileList: [],
      fileListtwo: [],
      queryStoreDramaList: [],
      statusBarHeight: systemInfo.statusBarHeight,
      recommendList: [],
      loveStatus: false,
      isComment: true,
      keywords: null,
      messageonce: "",
      shopSearchValue: null,
      pageNo: 1,
      hasMoreData: true,
      storeIdmock: "",
      storename: "",
      storeId: null,
      withInfoId: null,
      withDramaIdmock:"",
      withDramaId: null,
      content:"",
      withRankType: null,
      /*关联信息选中时数据*/
      activeDataMock: null,
      /*关联数据选中后*/
      activeData: null,
      /*是否关联内容标识*/
      isJoinContent: false,
      /*剧本相关查询条件*/
      nameKeyWord: null,
      dynamicId: null,
      customerPhotoText: '上传图片',
      showPublishPhoto: true,
    };
  },
  watch: {},
  computed: {
    dictValue() {
      return function (dicts) {
        // console.log('dicts',dicts)
        let arr = dicts.map((v) => v.dictValue);
        return arr.join(" ");
      };
    },
    loveImageUrl() {
      return this.loveStatus
          ? this.$iconFont.getIconName('aixin')
          : this.$iconFont.getIconName('closeaixin');
    },
    activeClass() {
      return this.loveStatus ? "active" : "";
    },
    publishDynamicDisable() {
      return this.messageonce.trim().length === 0 && this.fileListtwo.length <= 0;
    },
    distance(){
      return function(item){
        if(uni.getStorageSync('isLocation')){
          if(item){
            return `距你${item.distance.toFixed(1)}km  |  `;
          }
        }
        return '';
      }
    }
  },
  onLoad(options) {
    //是否时编辑情况下进入页面
    this.dynamicId = options.id;
    if (this.dynamicId) {
      this.reverseDisplayDynamicDetail();
    }
  },
  onShow() {
    if (uni.getStorageSync('temporaryCity')) {
      this.cityInfo = uni.getStorageSync('temporaryCity');
      uni.removeStorageSync('temporaryCity');
      this.pageNo = 1;
      this.queryStoreDrama();
    }
  },
  onPageScroll(e) {

  },
  methods: {
    userChooseCityNavigator,
    discoverListNavigator,
    //选择排行榜类型
    chooseRankType(rankTypeCode) {
      if (this.activeDataMock != null && this.activeDataMock.joinType === 5 && this.activeDataMock.id === rankTypeCode) {
        this.selectedButton = null;
        this.isJoinContent = false;
        this.activeDataMock = null;
      } else {
        this.withRankType = 5;
        this.selectedButton = rankTypeCode;
        this.activeDataMock = {
          id: rankTypeCode,
          joinType: 5,
        };
        switch (rankTypeCode) {
          case 'HOT_RANK': this.activeDataMock.name = '热门榜'; break;
          case 'PRAISE_RANK': this.activeDataMock.name = '口碑榜'; break;
          case 'GATHER_SUM_RANK': this.activeDataMock.name = '人气总榜'; break;
          case 'FOCUS_RANK': this.activeDataMock.name = '期待榜'; break;
        }
        this.isJoinContent = true;
      }
    },
    // 选择用户单选框值改变时触发
    queryUserListButton(item, index) {
      if (this.activeDataMock != null && this.activeDataMock.joinType === 4 && this.activeDataMock.id === item.id) {
        this.withDramaIdmock = null;
        this.isJoinContent = false;
        item.activeGroup = false;
        this.activeDataMock = null;
      } else {
        this.withUserIdmock = item.id;
        this.activeDataMock = {
          id: item.id,
          name: item.nickName,
          joinType: 4,
        };
        this.isJoinContent = true;
        this.queryUserListList.forEach((shop, item) => {
          this.$set(shop, "activeGroup", item === index);
        });
      }
    },
    // 选择店铺单选框值改变时触发
    changeShopRadio(i, index) {
      if (this.activeDataMock != null && this.activeDataMock.joinType === 2 && this.activeDataMock.id === i.id) {
        this.withDramaIdmock = null;
        this.isJoinContent = false;
        i.activeGroup = false;
        this.activeDataMock = null;
      } else {
        this.activeDataMock = {
          id: i.id,
          name: i.storeName,
          joinType: 2,
        };
        this.storeIdmock = i.id;
        this.isJoinContent = true;
        this.queryStoreDramaList.forEach((shop, i) => {
          this.$set(shop, "activeGroup", i === index);
        });
      }
    },
    // 选择剧本单选框值改变时触发
    changeDrama(drama,index) {
      if (this.activeDataMock !== null && this.activeDataMock.joinType === 1 && this.activeDataMock.id === drama.id) {
        this.withDramaIdmock = null;
        this.isJoinContent = false;
        drama.activeGroup = false;
        this.activeDataMock = null;
      } else {
        this.withDramaIdmock = drama.id;
        this.activeDataMock = {
          id: drama.id,
          name: drama.dramaName,
          joinType: 1,
        };
        this.isJoinContent = true;
        this.withDramaId = this.withDramaIdmock;
        this.dramaList.forEach((shop, drama) => {
          this.$set(shop, "activeGroup", drama === index);
        });
      }
    },
    //选择资讯
    changeofficialDynamicList(i, index) {

      if (this.activeDataMock != null && this.activeDataMock.joinType === 3 &&  this.activeDataMock.id === i.id) {
        this.withDramaIdmock = null;
        this.isJoinContent = false;
        i.activeGroup = false;
        this.activeDataMock = null;
      } else {
        this.withInfoIdmock = i.id;
        this.activeDataMock = {
          id: i.id,
          name: i.activityName,
          joinType: 3,
        };
        this.isJoinContent = true;
        this.officialDynamicListList.forEach((shop, i) => {
          this.$set(shop, "activeGroup", i === index);
        });
      }
    },
    /*剧本名字搜索框失去焦点*/
    onSearch() {
      this.pageNo = 1;
      this.queryDramaList();
    },
    //校验输入内容是否合规
    async onBlurText(e){
      try{
        await checkContent(e.detail.value);
      }catch(e){
        this.messageonce = "";
      }
    },
    onSelectDict(v) {
      if (this.dictParama === v) {
        this.dictParama = null;
      } else {
        this.dictParama = v;
      }
      this.pageNo = 1;
      this.queryDramaList();
    },
    onSelectPeople(v) {
      if (this.peopleParama === v) {
        this.peopleParama = "全部";
      } else {
        this.peopleParama = v;
      }
      this.pageNo = 1;
      this.queryDramaList();
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
    onLoadMore() {
      if (this.showShop && this.currentPopupType == 1) {
        if (this.dramaTotal === this.dramaList.length) return;

        this.pageNo++;
        this.queryDramaList();
      } else {
        if (this.DM_total === this.dmList.length) return;

        // this.pageNo++;
      }
    },
    async getDicts() {
      try {
        let data = await this.$api.queryDictList({
          dictType: "DRAMA",
        });
        data.map((v) => {
          if (v.dictType === "DRAMA") {
            this.dicts = v.dictList;
          }
        });
        this.dicts.unshift({ dictValue: "全部", id: null });
      } catch (e) {}
    },
    //关联剧本
    async queryDramaList() {
      let minGamerNum, maxGamerNum;
      switch (this.peopleParama) {
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
          minGamerNum = null;
          maxGamerNum = null;
          break;
      }
      try {
        let data = await service.queryDramaPage({
          type: 1,
          pageNo: this.pageNo,
          pageSize: 10,
          minGamerNum,
          maxGamerNum,
          dramaNameKeyword: this.nameKeyWord,
          dictIds: this.dictParama ? [this.dictParama] : null,
        });
        if (this.pageNo === 1 || data.total === 0) {
          this.dramaList = [];
        }
        if (data.records.length) {
          this.dramaList = [...this.dramaList, ...data.records];
        }
        this.dramaTotal = data.total;
      } catch (e) {}
    },
    //关联用户
    async queryUserList() {
      try {
        let data = await service.queryUserList({
          pageSize: 10,
          userStatus: "ENABLED",
          pageNo: this.pageNo,
          keywords: this.nameKeyWord,
        });
        if (this.pageNo === 1 || data.total === 0) {
          this.queryUserListList = [];
        }
        if (data.records.length) {
          this.queryUserListList = [...this.queryUserListList, ...data.records];
        }
        // 如果返回的数据为空，表示没有更多数据了
        if (data.records.length === 0 || data.pages === data.current) {
          this.hasMoreData = false;
        }
      } catch (e) {
      }
    },
    //关联资讯
    async officialDynamicList() {
      try {
        let data = await service.officialDynamicList({
          typeEnum: 1,
          pageSize: 10,
          pageNo: this.pageNo,
          keyWord: this.nameKeyWord,
          statusEnum: 'ENABLE'
        });
        if (this.pageNo === 1 || data.total === 0) {
          this.officialDynamicListList = [];
        }
        if (data.records.length) {
          this.officialDynamicListList = [...this.officialDynamicListList, ...data.records];
        }
        // 如果返回的数据为空，表示没有更多数据了
        if (data.records.length === 0 || data.pages === data.current) {
          this.hasMoreData = false;
        }
      } catch (e) {
      }
    },
    //关联店铺
    async queryStoreDrama() {
      try {
        let data = await service.queryStoreDrama({
          keyWord: this.shopSearchValue,
          pageNo: this.pageNo,
          pageSize: 10,
          cityId: this.cityInfo.cityId,
          userLatitude: uni.getStorageSync("currentLatitude"),
          userLongitude: uni.getStorageSync("currentLongitude"),
        });
        if (this.pageNo === 1 || data.total === 0) {
          this.queryStoreDramaList = [];
        }
        if (data.records.length) {
          this.queryStoreDramaList = [...this.queryStoreDramaList, ...data.records];
        }
        // 如果返回的数据为空，表示没有更多数据了
        if (data.records.length === 0 || data.pages === data.current) {
          this.hasMoreData = false;
        }
      } catch (e) {
      }
    },
    async loadMoreData() {
      if (!this.hasMoreData) {
        // 如果没有更多数据，直接返回
        return;
      }
      try {
        // 发起请求，获取下一页的数据
        this.pageNo += 1;
        switch (this.currentPopupType) {
          case 2:
            await this.queryStoreDrama();
            break
          case 3:
            await this.officialDynamicList();
            break;
          case 4:
            console.log("滚动时间进来了")
            await this.queryUserList();
            break;
        }
      } catch (e) {
        console.error("加载更多数据失败", e);
      }
    },
    async handleSearchChange(e) {
      this.pageNo = 1;
      this.hasMoreData = true; // 设置为还有更多数据

      switch (this.currentPopupType) {
        case 2:
          this.shopSearchValue = e.detail;
          await this.queryStoreDrama();
          break;
        case 3:
          this.nameKeyWord = e.detail;
          await this.officialDynamicList();
          break;
        case 4:
          this.nameKeyWord = e.detail;
          await this.queryUserList();
          break;
      }
    },
    closePopup() {
      this.showShop = false;
      this.pageNo = 1;
      this.nameKeyWord = null;
      this.hasMoreData = true;
      this.currentPopupType = "";
    },
    async addDynamicWithDrama() {
      if(this.messageonce.trim().length === 0 && this.fileListtwo.length <= 0){
        return;
      }
      wx.showLoading();
      if(this.canDo)return;
      this.canDo = true;

      try {
        let data = await service.addDynamicWithDrama({
          id: this.dynamicId || undefined,
          city: uni.getStorageSync("cityInfo").city || this.cityInfo.city,
          content: this.messageonce,
          fileList: this.fileListtwo || undefined,
          isShowAddress: this.cityInfo && uni.getStorageSync("currentLongitude") ? true : false,
          userId: this.userId,
          withDramaId: this.withDramaId || undefined,
          withInfoId: this.withInfoId || undefined,
          withRankings: this.withRankings || undefined,
          withStoreId: this.storeId || undefined,
          withUserId: this.withUserId || undefined
        });
        wx.showToast({
          title: "发布成功！",
          icon: "none",
        });
        uni.setStorageSync('shouldRefresh', true);
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (e) {
        this.canDo = false;
        wx.hideLoading();
      }
    },
    handlePopupConfirm() {
      this.storeId = null;
      this.withInfoId = null;
      this.withDramaId = null;
      this.withRankings = null;
      this.withUserId = null;
      this.activeData = this.activeDataMock;
      if (this.currentPopupType === 1) {
        this.withDramaId = this.withDramaIdmock;
        this.showShop = false;
        this.experienceRole = false;
      }
      if (this.currentPopupType === 2) {
        this.storeId = this.storeIdmock;
        this.showShop = false;
        this.experienceRole = false;
      }
      if (this.currentPopupType === 3) {
        this.withInfoId = this.withInfoIdmock;
        this.showShop = false;
        this.experienceRole = false;
      }
      if (this.currentPopupType === 4) {
        this.withUserId = this.withUserIdmock;
        this.showShop = false;
        this.experienceRole = false;
      }
      if (this.currentPopupType === 5) {
        this.withRankings = this.selectedButton;
        this.showShop = false;
        this.experienceRole = false;
      }
    },
    chooseDynamic(item) {
      this.currentPopupType = item.id;
      if (this.currentPopupType == 2) {
        this.pageNo = 1;
        this.shopSearchValue = null;
        this.queryStoreDramaList = []; // 清空数据列表
        this.hasMoreData = true; // 设置为还有更多数据
        this.queryStoreDrama(); // 触发加载更多数据
        this.currentPopupType = 2;
        this.showShop = true;
      } else if (this.currentPopupType == 1) {
        this.getDicts();
        this.queryDramaList();
        this.showShop = true;
      } else if (this.currentPopupType == 3) {
        this.officialDynamicList();
        this.showShop = true;
      } else if (this.currentPopupType == 4) {
        // this.rankingListone();
        this.queryUserList();
        this.showShop = true;
      } else if (this.currentPopupType == 5) {
        this.fetchRankingLists();
        this.showShop = true;
      }

    },
    //关联排行榜
    async fetchRankingLists() {
      try {
        const requests = [
          service.rankingList({ rankType: "HOT_RANK" }),
          service.rankingList({ rankType: "PRAISE_RANK" }),
          service.rankingList({ rankType: "GATHER_SUM_RANK" }),
          service.rankingList({ rankType: "FOCUS_RANK" })
        ];

        const [data1, data2, data3, data4] = await Promise.all(requests);

        this.rankingListList = data1;
        this.rankingListListSecond = data2;
        this.rankingListListThird = data3;
        this.rankingListListFourth = data4;
      } catch (e) {
        console.error(e);
      }
    },
    closeExperienceRole() {
      // 处理关闭弹窗事件
      this.experienceRole = false;
    },
    allrightBut() {
      this.experienceRole = true;
    },
    backRoute() {
      uni.navigateBack();
    },
    afterRead(detail) {
      const sizes = detail.detail.file.map((item) => item.size);
      const newTotalSize = sizes.reduce((total, size) => total + size, 0);
      const singleImageSizeLimit = 10 * 1024 * 1024; // 10MB
      const maxImageCount = 9;
      const uploadedImageCount = this.fileList.length;
      const totalImageCount = uploadedImageCount + detail.detail.file.length;
      if (totalImageCount > maxImageCount) {
        uni.showToast({
          title: "图片数量不能超过9张",
          icon: "none",
          duration: 2000,
        });
      } else if (sizes.some((size) => size > singleImageSizeLimit)) {
        uni.showToast({
          title: "单张图片大小不能超过1MB",
          icon: "none",
          duration: 2000,
        });
      } else if (newTotalSize > maxImageCount * singleImageSizeLimit) {
        uni.showToast({
          title: "总图片大小不能超过9MB",
          icon: "none",
          duration: 2000,
        });
      } else {
        const filePathsToUpload = detail.detail.file.map(
            (item) => item.tempFilePath
        );
        detail.detail.file.map((item) => item.size);
        uploadMultipleFiles(filePathsToUpload)
            .then((responseData) => {
              responseData.forEach((fileData) => {
                if (fileData && fileData.fileUrl) {
                  this.fileList.push({
                    url: fileData.fileUrl,
                  });
                  this.fileListtwo.push(
                     fileData.fileUrl,
                  );
                  this.calculatePhotoSize();
                }
              });
            })
            .catch((error) => {
              uni.showToast({
                title: `上传失败: ${error}`,
                duration: 2000,
                icon: "none",
              });
            });
      }
    },
    // 删除图片的方法
    onDelete(index, detail) {
      // 处理删除图片逻辑
      this.fileList.splice(index.detail.index, 1);
      this.fileListtwo.splice(index.detail.index, 1);
      this.calculatePhotoSize();
    },
    changeLoveStatus() {
      this.loveStatus = !this.loveStatus;
    },
    /*编辑时回显动态数据*/
    async reverseDisplayDynamicDetail() {
      try {
        let data = await service.dynamicDetail({
          id: this.dynamicId,
          userId: this.userId,
        });

        if (data.fileList.length > 0) {
          data.fileList.map(item => this.fileList.push({url: item,}));
          this.fileListtwo = data.fileList;
          this.calculatePhotoSize();
        }
        this.messageonce = data.content;
        let activeData = {};
        if (data.joinServiceCode !== null) {
          this.isJoinContent = true;
          switch (data.joinServiceCode) {
            case 'DRAMA_CODE':
              this.withDramaId = data.dramaItem.id;
              activeData = {
                id: data.dramaItem.id,
                joinType: 1,
                name: data.dramaItem.dramaName,
              };
              break;
            case 'STORE_CODE':
              this.storeId = data.storeId;
              activeData = {
                id: data.storeId,
                joinType: 2,
                name: data.storeItem.storeName,
              };
              break;
            case 'ACTIVITY_CODE':
              this.withInfoId = data.activityPromotion.id;
              activeData = {
                id: data.activityPromotion.id,
                joinType: 3,
                name: data.activityPromotion.activityName,
              }
              break;
            case 'WITH_USER_CODE':
              this.withUserId = data.withUserItem.id;
              activeData = {
                id: data.withUserItem.id,
                joinType: 4,
                name: data.withUserItem.nickName,
              }
              break;
            default:
              this.withRankType = 5;
              this.selectedButton = data.joinServiceCode;
              activeData = {
                id: data.joinServiceCode,
                joinType: 5,
              };
              switch (data.joinServiceCode) {
                case 'HOT_RANK': activeData.name = '热门榜'; break;
                case 'PRAISE_RANK': activeData.name = '口碑榜'; break;
                case 'GATHER_SUM_RANK': activeData.name = '人气总榜'; break;
                case 'FOCUS_RANK': activeData.name = '期待榜'; break;
              }
              break;
          }
          this.activeData = activeData;
          this.activeDataMock = activeData;
        }
      } catch (e) {}
    },
    calculatePhotoSize() {
      this.customerPhotoText = this.fileList.length > 0 ? `可再加${9 - this.fileList.length}张` : '上传图片';
      this.showPublishPhoto = this.fileList.length < this.maxCount;
    }
  },
};
</script>
<style lang="scss" scoped>
.fixedBg {
  height: 100vh;
  background: #F6F8F9;
}

/deep/ .header {
  background: #F6F8F9;
}

/deep/ .van-search__field {
  display: flex;
  align-items: center;
}

/deep/ .van-popup__close-icon .van-icon--image{
  width: 45rpx;
  height: 45rpx;
}

.dynamic-container {

  .custom-navigation {
    display: flex;
    align-items: center;

    .custom-title {
      margin-left: 34vw;
      height: 36rpx;
      font-size: 26rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #000000;
      font-family: PingFang SC-Semibold, PingFang SC;
    }
  }


  .popDramaBox {
    margin-top: 30rpx;
    height: 75vh;
    background: #fff;
    border-radius: 32rpx;
    &-title {
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 38rpx;
      text-align: center;
    }
    &-subTitle {
      margin-top: 4rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba($color: #444, $alpha: 0.4);
      line-height: 28rpx;
      text-align: center;
    }
    &-searchBox {
      margin-left: 32rpx;
      margin-top: 38rpx;
      width: calc(100vw - 64rpx);
      height: 72rpx;
      background: #f5f6f8;
      border-radius: 30rpx;
      @include hor-center-center;
      position: relative;
      &-placeholderBox {
        image {
          width: 32rpx;
          height: 32rpx;
        }
        span {
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
        }
      }
      input {
        position: absolute;
        left: 40rpx;
        right: 40rpx;
        text-align: center;
      }
    }
    &-filterBox {
      @include ver;
      padding: 50rpx 0;
      margin-left: 40rpx;
      &-item {
        @include hor;
        align-items: center;
        margin-bottom: 20rpx;
        &-scrolls {
          white-space: nowrap;
          width: 85vw;
          &-item {
            display: inline-flex;
            padding: 8rpx 28rpx;
            background: unset;
            border-radius: 12px;
            font-size: 26rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #2e323e;
          }
          .active {
            background: rgba($color: #36e4bb, $alpha: 0.1);
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #36e4bb;
          }
        }
      }
    }
    &-listBox {
      position: fixed;
      left: 0px;
      right: 0px;
      bottom: 0px;
      top: 34vh;
      height: 50vh;
      background: #fafafa;
      padding: 0 24rpx;
      &-item {
        margin-top: 20rpx;
        width: 93.6vw;
        background: #ffffff;
        border-radius: 6px;
        @include hor;
        position: relative;
        &-cover {
          width: 108rpx;
          height: 144rpx;
          border-radius: 12rpx;
          margin: 24rpx;
          overflow: hidden;
          position: relative;
          &-sellType {
            position: absolute;
            right: 0rpx;
            top: 0rpx;
            width: 60rpx;
            height: 32rpx;
          }
        }
        &-info {
          margin: rpx(12) 0;
          justify-content: space-around;
          @include ver;
          width: 80%;
          span:nth-child(1) {
            margin-top: rpx(3);
            font-size: 32rpx;
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #2e323e;
            height: rpx(22);
            white-space: nowrap;
            line-height: 38rpx;
            @include text-overflow-line(1);
          }
          span:nth-child(2) {
            margin-top: 14rpx;
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #959aa5;
            line-height: 28rpx;
          }
          span:nth-child(3) {
            margin-top: 10rpx;
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #959aa5;
            line-height: 28rpx;
          }
        }
        .shop-radio {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 24rpx;

          .radio-group {
            width: 48rpx;
            height: 48rpx;
            text-align: center;
            background: #f6f6f6;
            border-radius: 50%;
            border: 2rpx solid #eeeeee;
            display: flex;
            align-items: center;
            justify-content: center;
            .radio {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
        }
        &-status {
          position: absolute;
          right: 24rpx;
          top: 50%;
          transform: translateY(-50%);
          border: 2rpx solid #D2D2D2FF;
          border-radius: 50%;
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
  .pup-header {
    padding: 30rpx 30rpx 20rpx 30rpx;

    .header-title {
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #2e323e;
      margin-bottom: 38rpx;

      &.evaluate {
        margin-bottom: 4rpx;
      }
    }




  }
  .pupc-header {
    padding: 30rpx 30rpx 20rpx 30rpx;

    .header-title {
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #2e323e;
      margin-bottom: 38rpx;

      &.evaluate {
        margin-bottom: 4rpx;
      }
    }
    .masonry {
      display: flex;
      justify-content: space-between;
      .col{
        //width: 342rpx;
        width: calc(100vw - 24rpx);
        height: 100%;
        .second-column-top-box {
          height: 630rpx;
          background-color: #ffffffff;
          margin-right: 18rpx;
          margin-bottom: 24rpx;
          border-radius: 12rpx;
          position: relative;

          .sort-pic {
            width: 342rpx;
            height: 204rpx;
            position: absolute;
            top: 0;
            left: 0;
          }
           .sort-pic-circle{
             width: 48rpx;
             height: 48rpx;
             background: #FFFFFF;
             border-radius: 50%;
             opacity: 1;
             position: absolute;
             right: rpx(10);
             top: rpx(10);
           }
          .title {
            font-size: 40rpx;
            font-family: Alibaba PuHuiTi 2-85 Bold, Alibaba PuHuiTi 20;
            font-weight: normal;
            color: #ffffff;
            position: relative;
            z-index: 100;
            width: 100%;
            text-align: center;
            padding-top: 102rpx;
          }

          .dramaTourRankings {
            width: 100%;
            height: 426rpx;
            margin-top: 22rpx;
            position: absolute;

            .Rankings {
              display: flex;
              justify-content: space-between;
              // padding: 0 18rpx;
              font-size: 24rpx;
              margin-top: 2rpx;
              width: 342rpx;

              .person-text-one {
                margin-left: 18rpx;
              }

              .person-text {
                margin-right: 18rpx;
                font-size: 24rpx;
                color: #959aa5ff !important;
              }
            }

            .Rankings:nth-child(1) span {
              color: #f05151ff;
            }

            .Rankings:nth-child(2) span {
              color: #ff7a00ff;
            }

            .Rankings:nth-child(3) span {
              color: #c2875cff;
            }

            .Rankings:nth-child(n + 4):nth-child(-n + 10) span {
              color: #2e323eff;
            }
          }
        }
      };
    }



  }
  .popup-header {
    padding: 30rpx 30rpx 20rpx 30rpx;

    .title-second {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959AA5;
      line-height: 28rpx;
      text-align: center;
    }

    .header-title {
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #2e323e;
      margin-bottom: 38rpx;

      &.evaluate {
        margin-bottom: 4rpx;
      }
    }

    .header-subtitle {
      text-align: center;
      font-size: 28rpx;
      color: #444444;
    }

    .header-box {
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-city {
        display: flex;
        align-items: center;
        margin-right: 34rpx;

        p {
          font-size: 30rpx;
          font-weight: 500;
          color: #2e323e;
          margin-right: 8rpx;
        }
      }

      .header-search {
        flex: 1;

        /deep/ .van-search {
          padding: 0;

          .van-search__content {
            width: calc(100% - 64rpx);
            height: 72rpx;
            background: #F5F6F8;
            border-radius: 38rpx 38rpx 38rpx 38rpx;
            opacity: 1;
          }
        }
      }
    }
  }

  .shop-content {
    .related-content-container {
      .horizontal-line {
        width: 710rpx;
        height: 67vh;
        border-radius: 2rpx 2rpx 2rpx 2rpx;
        opacity: 1;
        border: 2rpx solid #F5F5F5;
        margin-left: auto;
      }

      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .related-content {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 750rpx;
        height: 120rpx;
        padding-bottom: 27rpx;

        .all-left {
          margin-left: 32rpx;
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2E323E;
          line-height: 33rpx;
          img{
            width: 80rpx;height: 80rpx;
            border-radius: 50%;
            margin-right: 20rpx;
          }
        }

        .all-right {
          margin-right: 40rpx;
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959AA5;
          line-height: 30rpx;

          .circleright {
            width: 48rpx;
            height: 48rpx;
            background: #F6F6F6;
            border-radius: 50%;
            opacity: 1;
            border: 2rpx solid #EEEEEE;
            .radio {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }

          .right-icon {
            width: 12rpx;
            height: 20rpx;
            margin-left: 4rpx;
          }
        }
      }

      .split-line {
        position: absolute;
        width: 618rpx;
        height: 0rpx;
        border-radius: 2rpx;
        opacity: 1;
        border: 2rpx solid #F5F5F5;
        bottom: 27rpx;
        left: 132rpx;
      }
    }
    padding: 20rpx 0;
    max-height: 53vh;
    // overflow-y: scroll;
    .no-more-data {
      text-align: center;
      padding: 10px 0;
      color: #999;
      font-size: 14px;
      background-color: #f5f5f5;
    }

    .shop-list {
      background: #ffffff;
      border-radius: 12rpx;
      height: 162rpx;
      margin: 0 24rpx; /* 左右各添加 24rpx 的空白 */
      padding: 0 24rpx;
      //   width: calc(100vw - 48rpx); /* 考虑左右两侧各 24rpx 的空白 */
      //   padding:0 24rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .shop-img {
        width: 112rpx;
        height: 112rpx;
        border-radius: 12rpx;
        margin-right: 16rpx;

        image {
          width: 100%;
          height: 100%;
          border-radius: 12rpx;
        }
      }

      .shop-text {
        width: 65%;
        margin-right: 40rpx;

        .shop-name {
          font-size: 28rpx;
          font-weight: 500;
          color: #2e323e;
          line-height: 33rpx;
          margin-bottom: 10rpx;
        }

        .shop-address {
          font-size: 24rpx;
          color: #959aa5;
        }
      }

      .shop-radio {
        .radio-group {
          width: 48rpx;
          height: 48rpx;
          text-align: center;
          background: #f6f6f6;
          border-radius: 50%;
          border: 2rpx solid #eeeeee;
          display: flex;
          align-items: center;
          justify-content: center;

          .radio {
            vertical-align: middle;
          }
        }
      }
    }
  }

  .popup-bottom {
    padding: 20rpx 32rpx;

    .popup-gradient {
      width: 100%;
      height: 88rpx;
      border-radius: 98rpx;
      background: linear-gradient(180deg, #36E4BB 74%, #B7E436 100%);
      padding: 4rpx 8rpx;
      box-sizing: border-box;

      .popup-confirm {
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        background: #111111;
        border-radius: 98rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
      }
    }
  }


  .experience-role {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 48vh;
  }

  .bottom-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 182rpx;
    background: #FFFFFF;
    z-index: 100; /* 确保盒子在其他元素之上 */
    .popup-gradient {
      width: 100%;
      height: 88rpx;
      margin-top: rpx(10);
      //background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);
      border-radius: 98rpx;
      padding: 4rpx 8rpx;
      box-sizing: border-box;

      .popup-confirm {
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        //background: #111111;
        border-radius: 98rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
      }
    }
    .buttonbox {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20rpx auto 0;
      width: 686rpx;
      height: 80rpx;
      background: #D0D0D0;
      border-radius: 64rpx;
      opacity: 1;

      span {
        font-size: 30rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 35rpx;
      }
    }
  }

  padding-bottom: env(safe-area-inset-bottom);

  .content-header {
    .commit-main {
      width: 100%;
      border-radius: 40rpx;
      padding: 32rpx 40rpx;
      box-sizing: border-box;
    }

    margin-top: 26rpx;
    width: 750rpx;
    background: #FEFEFE;
    border-radius: 40rpx 40rpx 40rpx 40rpx;
    opacity: 1;

    .commit-ctx {
      border-radius: 40rpx;
      position: relative;

      textarea {
        min-height: 470rpx !important;
        padding-bottom: 20rpx;
        width: 100% !important;
      }
      &-numBox {
        position: absolute;
        right: 0rpx;
        bottom: -10rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        line-height: 28rpx;
      }
      &-numBox::after {
        content: "/1000";
        color: "#959AA5";
      }
    }

    .custom-publish-photo {
      width: 180rpx;
      height: 180rpx;
      background: #F6F6F6;
      border-radius: 28rpx;
      @include ver-center-center;
      image {
        width: 80rpx;
        height: 80rpx;
      }
      p {
        height: 36rpx;
        font-size: 26rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #2E323E;
        line-height: 30rpx;
      }
    }
  }

  .content-middle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120rpx;
    background: #FEFEFE;
    border-radius: 40rpx 40rpx 40rpx 40rpx;
    margin-top: 18rpx;
    padding-bottom: 200rpx;

    .selected {
      width: 200rpx;
      height: 100rpx;
    }

    .all-left {
      height: 40rpx;
      font-size: 28rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      color: #2E323E;
      line-height: 33rpx;
      margin-left: 24rpx;

      .left-icon {
        height: rpx(10);
        width: rpx(8);
        margin-left: rpx(4);
      }
    }

    .all-right {
      height: 34rpx;
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959AA5;
      line-height: 28rpx;
      margin-right: 24rpx;

      .right-icon {
        width: 12rpx;
        height: 20rpx;
        margin-left: 8rpx;
      }
      .choose-join {
        height: 36rpx;
        font-size: 26rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #2E323E;
        line-height: 30rpx;
      }
    }

  }
}

</style>