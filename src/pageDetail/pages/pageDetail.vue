<template>
  <view>
    <custom-loading :visible="isLoading"></custom-loading>
    <view v-if="!isLoading">
      <!-- 导航栏 -->
      <detailHead
        :scrollTop="scrollTop"
        :queryAppDramaDetailList="queryAppDramaDetailList"
        @backIndex="backIndex"
        @on-share="isShowPoster = true"
      />
      <!-- 页面的其他内容 -->
      <div class="page-detail">
        <div
          class="detail-main"
          :style="{
            'margin-top': menuReact.top + menuReact.height + 20 + 'px',
          }"
        >
          <div class="base-info">
            <view
              class="border-view"
              :style="{ '--border-view-background': borderViewBackground }"
            >
              <image
                class="cover-pic"
                :src="queryAppDramaDetailList.dramaCover"
                mode="aspectFill"
                alt
              />
            </view>

            <image
              class="couverImg"
              v-if="queryAppDramaDetailList.sellType == 'REAL_SCENE'"
              :src="$iconFont.getIconName('liveAction')"
            />
            <image
              class="couverImg"
              v-if="queryAppDramaDetailList.sellType == 'LIMITED'"
              :src="$iconFont.getIconName('Citylimit')"
            />
            <image
              class="couverImg"
              v-if="queryAppDramaDetailList.sellType == 'EXCLUSIVE'"
              :src="$iconFont.getIconName('exclusive')"
            />

            <div class="right-info">
              <p class="title" v-if="queryAppDramaDetailList.dramaName">
                {{
                  $filters.truncateText(queryAppDramaDetailList.dramaName, 8)
                }}
              </p>
              <div class="time" v-if="queryAppDramaDetailList.publishDate">
                <img :src="$iconFont.getIconName('leftmao')" alt />
                {{
                  $filters.formatDate(queryAppDramaDetailList.publishDate || "")
                }}

                <div v-if="queryAppDramaDetailList.sellType == 'EXCLUSIVE'">
                  独家发行
                </div>
                <div v-if="queryAppDramaDetailList.sellType == 'REAL_SCENE'">
                  实景发行
                </div>
                <div v-if="queryAppDramaDetailList.sellType == 'LIMITED'">
                  城限发行
                </div>
                <img :src="$iconFont.getIconName('rightmao')" alt />
              </div>
              <div
                class="all-rankings"
                v-if="queryAppDramaDetailList.rankTypeList"
              >
                <div
                  class="month-hot"
                  v-if="
                    queryAppDramaDetailList.rankTypeList.includes('HOT_RANK')
                  "
                  @click="hotJump"
                >
                  <p style="font-size: 22rpx; color: #ffffff">30天热榜</p>
                  <van-icon name="arrow" color="#fff" size="10"/>
                </div>
                <div
                  class="month-hot"
                  v-if="
                    queryAppDramaDetailList.rankTypeList.includes(
                      'GATHER_SUM_RANK'
                    )
                  "
                  @click="gatherJump"
                >
                  <p style="font-size: 22rpx; color: #ffffff">人气总榜</p>
                  <van-icon name="arrow" color="#fff" size="10"/>
                </div>
                <div
                  class="month-hot"
                  v-if="
                    queryAppDramaDetailList.rankTypeList.includes('PRAISE_RANK')
                  "
                  @click="praiseJump"
                >
                  <p style="font-size: 22rpx; color: #ffffff">口碑榜</p>
                  <van-icon name="arrow" color="#fff" size="10"/>
                </div>
                <div
                  class="month-hot"
                  v-if="
                    queryAppDramaDetailList.rankTypeList.includes('FOCUS_RANK')
                  "
                  @click="focusJump"
                >
                  <p style="font-size: 22rpx; color: #ffffff">期待榜</p>
                  <van-icon name="arrow" color="#fff" size="10"/>
                </div>
              </div>

              <div class="month-hot-nul" v-if="isAllNull"></div>

              <div class="status">
                <span
                  v-for="item in queryAppDramaDetailList.dramaThemeList"
                  :key="item.id"
                  >{{ item.dictValue }}</span
                >
              </div>

              <div class="status">
                <span
                  >{{ queryAppDramaDetailList.maleGamerNum }}男{{
                    queryAppDramaDetailList.femaleGamerNum
                  }}女</span
                >
                <span>{{ queryAppDramaDetailList.gameTime }}小时</span>
                <span
                  v-if="
                    queryAppDramaDetailList.dramaAgeAppropriate == 'EXCEED_8'
                  "
                  >适龄8+</span
                >
                <span
                  v-if="
                    queryAppDramaDetailList.dramaAgeAppropriate == 'EXCEED_12'
                  "
                  >适龄12+</span
                >
                <span
                  v-if="
                    queryAppDramaDetailList.dramaAgeAppropriate == 'EXCEED_16'
                  "
                  >适龄16+</span
                >
                <span
                  v-if="
                    queryAppDramaDetailList.dramaAgeAppropriate == 'EXCEED_18'
                  "
                  >适龄18+</span
                >
              </div>

              <div class="btns">
                <div
                  class="btn1"
                  v-if="
                    queryAppDramaDetailList.playStatus == null ||
                    (queryAppDramaDetailList.playStatus == 'WANT_PLAY' &&
                      queryAppDramaDetailList.isEvaluate == false)
                  "
                >
                  <div @click="changeLoveStatus" :class="activeClass">
                    <img :src="loveImageUrl" alt />
                    <span>我想玩</span>
                  </div>
                  <div @click="handleStar">
                    <img :src="$iconFont.getIconName('wuxin')" alt />
                    <span>我玩过</span>
                  </div>
                </div>
                <div
                  class="btn2"
                  v-if="
                    queryAppDramaDetailList.playStatus == 'HAS_PLAY' &&
                    target.hasEvaluate == false
                  "
                  @click="goUrl(queryAppDramaDetailList)"
                >
                  <img :src="avatarImg" alt />
                  <span class="hasevaluatefls-one">暂无评价，去评价</span>
                  <van-icon name="arrow" color="#FFFFFF" size="12" />
                </div>
                <div
                  class="btn2"
                  v-if="
                    target.hasEvaluate &&
                    queryAppDramaDetailList.playStatus == 'HAS_PLAY'
                  "
                >
                  <img :src="avatarImg" alt />
                  <div @click.stop="showCustomModal">
                    <span class="has-evaluate">已评价 :</span>
                    <span class="hasevaluatefls">
                      {{
                        target.userEvaluateType === "RECOMMEND"
                          ? "推荐"
                          : target.userEvaluateType === "SO_SO"
                          ? "一般"
                          : target.userEvaluateType === "NOT_GOOD"
                          ? "不行"
                          : "未知"
                      }}
                    </span>
                    <span class="shuxian">｜</span>
                  </div>
                  <div @click.stop="isShowPoster = true">
                    <span class="has-evaluate">分享</span>
                    <van-icon name="arrow" color="#FFFFFF" size="12" />
                  </div>
                </div>
                <BindPhone
                  @on-show-authorize="onShowAuthorize"
                  @on-success-authorize="onSuccessAuthorize"
                  v-if="!userInfo.phone"
                  ref="BindPhone"
                ></BindPhone>
              </div>
            </div>
          </div>

          <p class="play-info" v-if="queryAppDramaDetailList.isBoxOffice">
            <span class="text-ben">票房本</span>
            <span class="text-style">本剧本已开通票房本，轻松在线开玩 !!!</span>
          </p>

          <div class="score-info">
            <div class="top-number">
              <div class="name">
                <span>剧游评分</span>
                <!-- 满分神作 -->
                <img
                  v-if="queryAppDramaDetailList.juyouScoreAvg === 100"
                  class="mf-szImg"
                  :src="$iconFont.getIconName('full-score-masterpiece')"
                  alt="满分神作"
                />

                <!-- 剧游必玩 -->
                <img
                  v-else-if="queryAppDramaDetailList.juyouScoreAvg >= 90"
                  class="mf-szImg"
                  :src="$iconFont.getIconName('must-play-drama-game')"
                  alt="剧游必玩"
                />

                <!-- 优质剧作 -->
                <img
                  v-else-if="
                    queryAppDramaDetailList.juyouScoreAvg >= 80 &&
                    queryAppDramaDetailList.juyouScoreAvg < 90
                  "
                  class="mf-szImg"
                  :src="$iconFont.getIconName('high-quality-plays')"
                  alt="优质剧作"
                />

                <!-- 值得一试 -->
                <img
                  v-else-if="
                    queryAppDramaDetailList.juyouScoreAvg >= 70 &&
                    queryAppDramaDetailList.juyouScoreAvg < 80
                  "
                  class="mf-szImg"
                  :src="$iconFont.getIconName('worth-a-try')"
                  alt="值得一试"
                />

                <!-- 水平在线 -->
                <img
                  v-else-if="
                    queryAppDramaDetailList.juyouScoreAvg >= 60 &&
                    queryAppDramaDetailList.juyouScoreAvg < 70
                  "
                  class="mf-szImg"
                  :src="$iconFont.getIconName('horizontal-online')"
                  alt="水平在线"
                />
              </div>

              <div class="number">
                <p style="margin-right: 12rpx">
                  {{ queryAppDramaDetailList.wantPlay || 0 }}人想玩
                </p>
                <p>{{ queryAppDramaDetailList.hasPlay || 0 }}人玩过</p>
              </div>
            </div>

            <div class="score-progress">
              <div class="score" @click="changeTabs('剧评')">
                <p
                  class="big"
                  v-if="
                    queryAppDramaDetailList.scoreList[0].score != null &&
                    queryAppDramaDetailList.scoreList[1].score != null &&
                    queryAppDramaDetailList.scoreList[2].score != null
                  "
                >
                  {{ queryAppDramaDetailList.juyouScoreAvg / 10 }}
                </p>
                <p
                  class="big"
                  v-if="
                    queryAppDramaDetailList.scoreList[0].score == null &&
                    queryAppDramaDetailList.scoreList[1].score == null &&
                    queryAppDramaDetailList.scoreList[2].score == null
                  "
                >
                  {{ queryAppDramaDetailList.juyouScoreAvg / 10 }}
                </p>
                <div class="flex-container">
                  <span class="pingfen">
                    {{
                      queryAppDramaDetailList.titleNumber.dramaEvaluateCount ||
                      0
                    }}人评价
                  </span>
                  <img
                    class="month_right"
                    :src="$iconFont.getIconName('arrowright')"
                    alt
                  />
                </div>
              </div>
              <div class="progress">
                <div
                  class="namemm"
                  v-for="item in queryAppDramaDetailList.scoreList"
                  :key="item.id"
                >
                  <p>{{ item.dictValue }}</p>
                  <div class="progress">
                    <van-progress
                      track-color="rgba(255, 255, 255, 0.1)"
                      color="rgba(255, 255, 255, 0.2)"
                      :show-pivot="false"
                      inactive
                      :percentage="item.score"
                    ></van-progress>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="author-introduction">
            <div class="top-area">
              <span class="title">作者与简介</span>
              <div class="all-right" @click="expand">
                <div v-if="!isExpanded">
                  <span>展开</span>
                  <van-icon name="arrow-down" size="12" class="right-icon" />
                </div>
                <div v-if="isExpanded">
                  <span>收起</span>
                  <van-icon name="arrow-up" size="12" class="right-icon" />
                </div>
              </div>
            </div>
            <scroll-view class="author author-scroll" scroll-x="true">
              <block
                v-for="(item, index) in queryAppDramaDetailList.authorItems"
                :key="index"
              >
                <view class="author-item">
                  <div>
                    <img
                      class="month_three"
                      :src="$iconFont.getIconName('zuozhe')"
                    />
                  </div>
                  <div class="name">作者：{{ item.authorName }}</div>
                  <!-- <div>
                    <img
                      class="month-four"
                      :src="$iconFont.getIconName('arrowright-white')"
                      alt
                    />
                  </div> -->
                </view>
              </block>
              <block
                v-for="(item, index) in queryAppDramaDetailList.publishers"
                :key="index"
              >
                <view class="author-item">
                  <div>
                    <img
                      class="month_three"
                      :src="$iconFont.getIconName('fahang')"
                    />
                  </div>
                  <div class="name">发行：{{ item.publisherName }}</div>
                  <!-- <div>
                    <img
                      class="month-four"
                      :src="$iconFont.getIconName('arrowright-white')"
                      alt
                    />
                  </div> -->
                </view>
              </block>
            </scroll-view>
            <p class="intro">{{ shortContent }}</p>
          </div>

          <div
            class="script-role"
            v-if="
              queryAppDramaDetailList.dramaRoleList &&
              queryAppDramaDetailList.dramaRoleList.length > 0
            "
          >
            <div class="top-area">
              <span class="title">剧本角色</span>
            </div>
            <scroll-view scroll-x="true" class="scroll-x">
              <ul class="playText-list" style="list-style: none">
                <li
                  class="playText-item"
                  v-for="(item, idx) in queryAppDramaDetailList.dramaRoleList"
                  :key="item.id"
                  @click="onPrviewRole(idx)"
                >
                  <image class="cover" :src="item.roleUrl" mode="aspectFill" />
                  <span
                    class="name"
                    v-if="queryAppDramaDetailList.dramaRoleList"
                    >{{ $filters.truncateText(item.roleName, 5) }}</span
                  >
                </li>
              </ul>
            </scroll-view>
          </div>
        </div>
        <!-- 底部内容切换 -->
        <div class="tabs-area" :style="{ 'z-index': showAuthorize ? -1 : 3 }">
          <div
            class="sticky-tabs"
            :style="{ top: menuReact.top + menuReact.height + 'px' }"
            id="tabs-area"
          >
            <ul class="custom-tabs">
              <li
                v-for="(item, index) in tabsList"
                :key="index"
                :class="{ active: active === item }"
                @click="changeTabs(item)"
              >
                {{ item }}
                <span class="info" v-if="getCount(item) > 0">{{
                  getCount(item)
                }}</span>
              </li>
            </ul>
          </div>
          <!-- 组局 -->
          <div v-if="active == '组局'">
            <div class="play-hot-ctx" v-if="dataList.length > 0">
              <p class="title">
                <img :src="$iconFont.getIconName('shandian')" alt />
                该剧本当前城市有<span style="color: #43e6bfff">{{
                  gatheringCountToday || 0
                }}</span
                >场正在组局
              </p>
              <gatherItem
                v-for="(item, index) in dataList"
                :key="index"
                :gather="item"
                @click.native="onGatherDetail(item)"
              ></gatherItem>
              <div class="footer-text" v-if="!this.hasMoreGather">
                没有更多了哦～
              </div>
              <div
                class="bottom-button"
                @click.stop="onGoGather"
                v-if="showBottom"
              >
                <image
                  class="groupImg"
                  :src="$iconFont.getIconName('groupButton')"
                />
                <span>发起组局</span>
              </div>
            </div>
            <div class="play-hot-ctx-no" v-else>
              <div class="content-wrapper">
                <div class="no-img">
                  <img :src="$iconFont.getIconName('GoGatherImg')" />
                </div>
                <div class="text">当前城市暂无组局～</div>
                <div class="gather-button" @click="onGoGather">发起组局</div>
              </div>
            </div>
          </div>
          <!-- 剧评 -->
          <div v-else-if="active == '剧评'">
            <p class="dramaId-text">剧本热评</p>
            <view
              class="hot-commit-tabs"
              :style="{ top: menuReact.top + menuReact.height + 50 + 'px' }"
            >
              <li
                class="hot-commit-item"
                :class="{
                  'item-selected': selectedItemId === item.dramaEvaluateType,
                }"
                v-for="item in dramaEvaluateCountItemList"
                :key="item.dramaEvaluateType"
                @click="scriptReview(item)"
              >
                <p class="hot_text">
                  {{ getEvaluateTypeText(item.dramaEvaluateType, item.count) }}
                </p>
              </li>
            </view>
            <div class="hot-commit-ctx" v-if="dataList.length > 0">
              <div v-for="(item, index) in dataList" :key="index">
                <!-- 组局组件 -->
                <commit-item
                  :queryAppDramaDetailList="queryAppDramaDetailList"
                  @update:deleteCommit="handleDeleteCommit(index)"
                  :userId="userInfo.id"
                  :commitList="item"
                  @update:praise="handlePraiseUpdate"
                  @on-update="onUpdateEvaluate(item, index, $event)"
                ></commit-item>
              </div>
              <div
                class="published"
                v-if="queryAppDramaDetailList.isEvaluate == true && showBottom"
                @click.stop="onGoEvaluateDetail"
              >
                <div>已发布评价</div>
              </div>
              <div
                class="published-no"
                v-if="queryAppDramaDetailList.isEvaluate == false && showBottom"
                @click="goUrl(queryAppDramaDetailList)"
              >
                <div class="content">
                  <p>发布评价</p>
                  <img :src="$iconFont.getIconName('brown-button')" alt />
                </div>
              </div>
            </div>
            <div class="play-hot-ctx-no" v-else>
              <div class="content-wrapper">
                <div class="no-img">
                  <img :src="$iconFont.getIconName('dramatic-criticism')" />
                </div>
                <div class="text-trends">暂无剧评</div>
                <div class="text">暂时还没有发布过评价～</div>
                <div
                  class="trends-button"
                  @click="goUrl(queryAppDramaDetailList)"
                  v-if="queryAppDramaDetailList.isEvaluate == false"
                >
                  发布评价
                </div>
              </div>
            </div>
          </div>
          <!-- 店铺 -->
          <div v-else-if="active == '店铺'">
            <template v-if="dataList.length > 0">
              <div
                v-for="(item, index) in dataList"
                :key="index"
                @click.native="gotoStoreDetail(item)"
              >
                <!-- 组局组件 -->
                <shop-item :detailstore="item"></shop-item>
              </div>
              <div class="footer-text" v-if="!this.hasMoreData">
                没有更多了哦～
              </div>
            </template>
            <div class="play-hot-ctx-no" v-else>
              <div class="content-wrapper">
                <div class="no-img">
                  <img :src="$iconFont.getIconName('storeName')" />
                </div>
                <div class="text">暂无优选门店～</div>
              </div>
            </div>
          </div>
          <!-- 动态 -->
          <div v-else-if="active == '动态'">
            <template v-if="dataList.length > 0">
              <div v-for="(item, index) in dataList" :key="index">
                <!-- 组局组件 -->
                <trends-item
                  :queryAppDramaDetailList="queryAppDramaDetailList"
                  :detailstore="item"
                  :userId="userInfo.id"
                  @update:delete="handleTrendsDelete(index)"
                  @update:trendsItem="handleTrendsItem(index)"
                  @trends-update="onUpdateTrends(item, index, $event)"
                ></trends-item>
              </div>
            </template>
            <div class="play-hot-ctx-no" v-else>
              <div class="content-wrapper">
                <div class="no-img">
                  <img :src="$iconFont.getIconName('trendsImage')" />
                </div>
                <div class="text-trends">暂无动态</div>
                <div class="text">快去发布专属你的第一条动态～</div>
              </div>
            </div>
          </div>
          <!-- 推荐 -->
          <div v-else-if="active == '推荐'">
            <div
              v-for="item in dataList"
              :key="item.id"
              @click="dramaDetailNavigator(item.id)"
            >
              <!-- 组局组件 -->
              <commend-item :recommend="item"></commend-item>
            </div>
          </div>
        </div>
        <van-overlay :show="showDialog" z-index="9" @click="showDialog = false">
          <div class="wrapper" @click.stop>
            <commit-dialog
              @confirm-click="handleConfirmClick"
              :showDialog="showDialog"
              @closePopup="closePopup"
            ></commit-dialog>
          </div>
        </van-overlay>
      </div>
      <sharePoster
        :drama="queryAppDramaDetailList"
        :isShowPoster.sync="isShowPoster"
        v-if="isShowPoster"
      ></sharePoster>
    </view>
  </view>
</template>
<script>
import CustomLoading from "../components/CustomLoading.vue";
import CommitItem from "../components/commitItem.vue";
import ShopItem from "../components/shopItem.vue";
import TrendsItem from "../components/trendsItem.vue";
import CommendItem from "../components/commendItem.vue";
import CommitDialog from "../components/commitDialog.vue";
import gatherItem from "../components/gatherItem.vue";
import service from "../utils/service.js";
import BindPhone from "@/components/bindPhone/index.vue";
import sharePoster from "../components/dramaPoster/poster.vue";
import { dramaDetailNavigator } from "@/utils/navigator";
import $iconFont from "@/utils/icon-font";
import detailHead from "../components/detailHead.vue";
import { getMenuButtonRect, windowHeight } from "@/utils/index";
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();

export default {
  data() {
    return {
      id: "",
      userInfo: {},
      isLoading: true,
      selectedItemId: "ALL",
      dramaEvaluateType: "ALL",
      titleNumber: {},
      avatarImg: uni.getStorageSync("userInfo").avatar,
      evaluateTypeMap: {
        RECOMMEND: "推荐",
        SO_SO: "一般",
        NOT_GOOD: "不行",
        SAMECITY: "同城",
        ALL: "全部",
      },
      target: {},
      loveStatus: false,
      isClickStar: false,
      isExpanded: false,
      fullContent: "",
      queryAppDramaDetailList: {},
      pageNo: 1,
      dataList: [],
      isRefresherTriggered: false, // 控制下拉刷新的状态
      dramaEvaluateCountItemList: [],
      gatheringCountToday: null,
      YMD: "",
      TMD_14: "",
      active: "组局",
      tabsList: ["组局", "剧评", "店铺", "动态", "推荐"],
      activeHotCommit: 1,
      hotCommitList: ["全部", "同城", "推荐", "一般"],
      showDialog: false,
      proList: [
        { title: "逻辑性", value: 50 },
        { title: "故事性", value: 60 },
        { title: "体验感", value: 70 },
      ],
      scrollTop: 0,
      statusBarHeight: systemInfo.statusBarHeight,
      isShowPoster: false,
      showAuthorize: false,
      menuReact: null,
      cityInfo: null,
      barTop: 0,
      screenHeight: 0
    };
  },
  components: {
    TrendsItem,
    CommitItem,
    ShopItem,
    CommendItem,
    CommitDialog,
    gatherItem,
    CustomLoading,
    BindPhone,
    sharePoster,
    detailHead,
  },
  computed: {
    $iconFont() {
      return $iconFont;
    },
    borderViewBackground() {
      if (this.queryAppDramaDetailList.sellType === "REAL_SCENE") {
        return "linear-gradient(90deg, rgba(67, 151, 246, 1), rgba(83, 182, 247, 1))";
      } else if (this.queryAppDramaDetailList.sellType === "EXCLUSIVE") {
        return "linear-gradient(90deg, rgba(254, 93, 54, 1), rgba(248, 144, 84, 1))";
      } else if (this.queryAppDramaDetailList.sellType === "LIMITED") {
        return "linear-gradient(90deg, rgba(235, 202, 108, 1), rgba(249, 223, 148, 1))";
      }

      // 默认背景
      // return 'linear-gradient(90deg, rgba(67, 151, 246, 1), rgba(83, 182, 247, 1))';
    },
    isAllNull() {
      // 检查 rankTypeList 数组中的每个值是否都为 null
      return (
        this.queryAppDramaDetailList.rankTypeList &&
        this.queryAppDramaDetailList.rankTypeList.every((item) => item === null)
      );
    },
    shortContent() {
      if (this.isExpanded) {
        return this.fullContent;
      } else {
        return this.fullContent.slice(0, 45) + "...";
      }
    },
    loveImageUrl() {
      return this.isActive
        ? this.$iconFont.getIconName("aixin")
        : this.$iconFont.getIconName("closeaixin");
    },
    isActive() {
      return (
        this.loveStatus ||
        (this.queryAppDramaDetailList.playStatus &&
          this.queryAppDramaDetailList.playStatus == "WANT_PLAY")
      );
    },
    activeClass() {
      return this.isActive ? "active" : "";
    },
    getCount() {
      return function (item) {
        if (item === "组局") {
          return this.titleNumber.gatherCount;
        } else if (item === "剧评") {
          return this.titleNumber.dramaEvaluateCount;
        } else if (item === "店铺") {
          return this.titleNumber.storePlayCount;
        } else if (item === "动态") {
          return this.titleNumber.dynamicCircleCount;
        }
      };
    },
    showBottom(){
      if(this.barTop > this.screenHeight){
        if(this.scrollTop > (this.barTop - this.screenHeight + 150)){
          return true;
        }
      }else{
        if(this.scrollTop > 150){
          return true;
        }
      }
      return false;
    }
  },
  async onLoad(options) {
    this.screenHeight = await windowHeight();
    this.cityInfo = await this.$checkLogin.requestAuthorize();
    this.menuReact = await getMenuButtonRect();

    let date = new Date();
    this.YMD = this.$dayjs(date).format("YYYY-MM-DD");
    this.TMD_14 = this.$dayjs().add(13, "day").format("YYYY-MM-DD");

    if (options.id) {
      this.id = parseInt(options.id);
    }
    if (options.scene) {
      this.id = parseInt(options.scene);
    }

    this.userInfo = await this.$checkLogin.getUserInfo();

    this.isLoading = true; // 开始加载数据
    try {
      await this.queryAppDramaDetail();
      await this.ifExistMyEvaluate();
    } catch (error) {
      console.error("加载数据时出错:", error);
    } finally {
      this.isLoading = false; // 数据加载完成
    }
    await this.$checkLogin.requestAuthorize();
    await this.refresh();
  },
  async onShow() {
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }

    if (uni.getStorageSync("shouldRefresh")) {
      await this.queryAppDramaDetail();
      await this.ifExistMyEvaluate();
      await this.refresh();
      uni.removeStorageSync("shouldRefresh");
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onReachBottom() {
    this.onLoadMore();
  },
  methods: {
    //动态计算tabBar位置
    doCaluateTabBar(){
      let that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('#tabs-area').boundingClientRect(function(res){
        that.barTop = res.top + res.height;
      }).exec()
    },
    dramaDetailNavigator,
    onPrviewRole(current) {
      let sources = [];
      this.queryAppDramaDetailList.dramaRoleList.map((v) => {
        sources.push({
          url: v.roleUrl,
          type: "image",
        });
      });
      uni.previewMedia({
        current,
        sources,
      });
    },
    hotJump() {
      let hot = "30天热榜";
      uni.navigateTo({
        url: `/rankingList/pages/index?jump=${hot}`,
      });
    },
    gatherJump() {
      let hot = "人气总榜";
      uni.navigateTo({
        url: `/rankingList/pages/index?jump=${hot}`,
      });
    },
    praiseJump() {
      let hot = "口碑榜";
      uni.navigateTo({
        url: `/rankingList/pages/index?jump=${hot}`,
      });
    },
    focusJump() {
      let hot = "期待榜";
      uni.navigateTo({
        url: `/rankingList/pages/index?jump=${hot}`,
      });
    },
    backIndex() {
      if (getCurrentPages().length === 1) {
        uni.switchTab({
          url: `/pages/index/index`,
        });
      } else {
        uni.navigateBack();
      }
    },
    //授权成功后，重新获取用户信息
    onShowAuthorize(isShow) {
      this.showAuthorize = isShow;
    },
    async onSuccessAuthorize() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
    handlePraiseUpdate({ dynamicId, newHasFabulous, newPraiseQuantity }) {
      if (!this.userInfo.phone) return;
      this.dataList.forEach((item, index) => {
        if (item.evaluateId === dynamicId) {
          this.$set(this.dataList, index, {
            ...item,
            hasFabulous: newHasFabulous,
            praiseQuantity: newPraiseQuantity,
          });
        }
      });
    },
    handleTrendsItem(index) {
      this.dataList[index].isPraise = !this.dataList[index].isPraise;
      this.dataList[index].praiseQuantity = this.dataList[index].isPraise
        ? this.dataList[index].praiseQuantity + 1
        : this.dataList[index].praiseQuantity - 1;
    },
    async handleTrendsDelete(index) {
      this.dataList.splice(index, 1);
      await this.queryAppDramaDetail();
    },
    async handleDeleteCommit(index) {
      this.dataList.splice(index, 1);
      await this.queryAppDramaDetail();
    },
    async scriptReview(i) {
      this.pageNo = 1;
      this.dataList = [];

      this.selectedItemId = i.dramaEvaluateType;
      if (this.selectedItemId == "ALL") {
        this.queryDramaEvaluatePageAndCount();
      } else if (this.selectedItemId == "RECOMMEND") {
        this.queryDramaEvaluatePageAndCount();
      } else if (this.selectedItemId == "SO_SO") {
        this.queryDramaEvaluatePageAndCount();
      } else if (this.selectedItemId == "NOT_GOOD") {
        this.queryDramaEvaluatePageAndCount();
      } else if (this.selectedItemId == "SAMECITY") {
        if (!uni.getStorageSync("isLocation")) {
          await this.$checkLogin.requestAuthorize();
        }
        await this.queryDramaEvaluatePageAndCount();
      }
    },
    onUpdateEvaluate(item, index, eventData) {
      if (!this.userInfo.phone) {
        this.$refs["BindPhone"].onAuthorize();
        return;
      }
      item.isFocus = eventData.isFocus;
      console.log("onUpdateEvaluate called", eventData); // 添加调试日志
      this.onEvaluate(eventData);
    },
    async onEvaluate(eventData) {
      try {
        console.log("onEvaluate called with", eventData); // 添加调试日志
        const response = await service.updateUserFocus({
          flag: eventData.isFocus,
          focusUserId: eventData.focusUserId,
          userId: eventData.userId,
        });
        console.log("updateUserFocus response", response); // 记录响应
      } catch (e) {
        console.error("Error in onEvaluate:", e); // 记录错误
      }
    },
    //动态关注
    onUpdateTrends(item, index, eventData) {
      if (!this.userInfo.phone) {
        this.$refs["BindPhone"].onAuthorize();
        return;
      }
      item.isFocus = eventData.isFocus;
      console.log("onUpdateEvaluate called", eventData); // 添加调试日志
      this.onEvaluate(eventData);
    },
    async onTrends(eventData) {
      try {
        console.log("onEvaluate called with", eventData); // 添加调试日志
        const response = await service.updateUserFocus({
          flag: eventData.isFocus,
          focusUserId: eventData.focusUserId,
          userId: eventData.userId,
        });
        console.log("updateUserFocus response", response); // 记录响应
      } catch (e) {
        console.error("Error in onEvaluate:", e); // 记录错误
      }
    },
    async onGoGather() {
      uni.navigateTo({
        url: `/gatherPlayer/pages/goGather?dramaId=${this.id}`,
      });
    },
    onGatherDetail(item) {
      uni.navigateTo({
        url: `/gatherPlayer/pages/index?id=${item.id}`,
      });
    },
    getEvaluateTypeText(type, count) {
      if (type === "ALL") {
        // 如果类型是 'ALL'，只返回 '全部'
        return "全部";
      } else {
        // 否则返回映射的文本值和数量
        return `${this.evaluateTypeMap[type] || type}(${count})`;
      }
    },
    //查看评价详情
    onGoEvaluateDetail() {
      uni.navigateTo({
        url: `/pageDetail/pages/scriptReview?userId=${this.userInfo.id}&evaluateId=${this.target.evaluateId}&dramaId=${this.queryAppDramaDetailList.id}`,
      });
    },
    showCustomModal() {
      uni.showModal({
        content: "是否确认取消“已玩过”？",
        showCancel: true,
        cancelText: "暂不",
        confirmText: "确认取消",
        success: (res) => {
          // 注意这里使用了箭头函数
          if (res.confirm) {
            console.log("用户点击确认取消");
            this.cancelUserDramaPlayMP("HAS_PLAY");
          } else if (res.cancel) {
            console.log("用户点击暂不");
          }
        },
      });
    },
    gotoStoreDetail(item) {
      uni.navigateTo({
        url: `/store-package/pages/index?storeId=${item.id}`,
      });
    },
    async goUrl(e) {
      let playStatus = "HAS_PLAY";
      await this.updateUserDramaPlayMP(playStatus);

      uni.setStorageSync("editDrama", {
        dramaCover: e.dramaCover,
        dramaId: e.id,
        dramaName: e.dramaName,
      });

      uni.navigateTo({
        url: `/pageDetail/pages/index`,
      });
    },
    handleConfirmClick(data) {
      if (!this.userInfo.phone) {
        this.$refs["BindPhone"].onAuthorize();
        return;
      }
      // 在这里处理子组件触发的事件，data是子组件传递的数据
      if (data != null) {
        uni.setStorageSync("editDrama", {
          dramaCover: this.queryAppDramaDetailList.dramaCover,
          dramaId: this.queryAppDramaDetailList.id,
          dramaName: this.queryAppDramaDetailList.dramaName,
          activeIndex: data,
        });

        this.showDialog = false;

        uni.navigateTo({
          url: `/pageDetail/pages/index`,
        });
      } else {
        wx.showToast({
          title: "给剧本打个分吧！",
          icon: "none",
        });
      }
    },
    expand() {
      this.isExpanded = !this.isExpanded;
      this.isClamped = false;
      this.$nextTick(_=>{
        this.doCaluateTabBar();
      })
    },
    changeLoveStatus() {
      if (this.queryAppDramaDetailList.playStatus == null) {
        this.loveStatus = !this.loveStatus;
      } else {
        this.loveStatus = false;
      }
      let playStatus = "WANT_PLAY";
      if (this.loveStatus && this.queryAppDramaDetailList.playStatus == null) {
        // 如果 loveStatus 为 true, 调用 updateUserDramaPlayMP
        this.updateUserDramaPlayMP(playStatus);
        this.queryAppDramaDetail();
      } else {
        // 如果 loveStatus 为 false, 调用 cancelUserDramaPlayMP
        this.cancelUserDramaPlayMP(playStatus);
        this.queryAppDramaDetail();
      }
    },
    //小程序-用户剧本杀玩耍-更新
    async updateUserDramaPlayMP(playStatus) {
      try {
        let data = await service.updateUserDramaPlayMP({
          dramaId: this.id,
          playStatus: playStatus,
          userId: this.userInfo.id,
        });
        this.ifExistMyEvaluate();
        this.queryAppDramaDetail();
      } catch (e) {}
    },
    //小程序-用户剧本杀玩耍-取消想玩、已玩
    async cancelUserDramaPlayMP(playStatus) {
      try {
        let data = await service.cancelUserDramaPlayMP({
          dramaId: this.id,
          playStatus: playStatus,
          userId: this.userInfo.id,
        });
        this.ifExistMyEvaluate();
        this.queryAppDramaDetail();
      } catch (e) {}
    },
    handleStar() {
      this.showDialog = true;
      this.isClickStar = true;
      let playStatus = "HAS_PLAY";
      this.updateUserDramaPlayMP(playStatus);
      this.ifExistMyEvaluate();
      this.queryAppDramaDetail();
    },
    closePopup() {
      this.showDialog = false;
    },
    // tabs切换触发
    changeTabs(i) {
      wx.pageScrollTo({
        scrollTop: 200,
        duration: 300,
      });
      this.active = i;
      this.refresh();
      // 刷新数据
      this.queryAppDramaDetail(true);
    },
    refresh() {
      this.pageNo = 1;
      this.dataList = [];

      if (this.active == "组局") {
        this.queryGatherList();
      } else if (this.active == "动态") {
        this.getDramaDetailJoinDynamic();
      } else if (this.active == "推荐") {
        this.getDramaDetailRecommend();
      } else if (this.active == "店铺") {
        this.loadDramaDetailStoreData();
      } else if (this.active == "剧评") {
        this.selectedItemId = "ALL";
        this.queryDramaEvaluatePageAndCount();
      }
      this.$nextTick(_=>{
        this.doCaluateTabBar();
      })
    },
    onLoadMore() {
      this.pageNo++;

      if (this.active == "组局") {
        this.queryGatherList();
      } else if (this.active == "动态") {
        this.getDramaDetailJoinDynamic();
      } else if (this.active == "店铺") {
        this.loadDramaDetailStoreData();
      } else if (this.active == "剧评") {
        this.queryDramaEvaluatePageAndCount();
      }
    },
    //圈子-查询动态圈列表（分页）
    async getDramaDetailJoinDynamic() {
      try {
        let data = await service.getDramaDetailJoinDynamic({
          pageNo: this.pageNo,
          pageSize: 10,
          dramaId: this.id,
          userId: this.userInfo.id,
        });

        if (data.records && data.records.length) {
          this.dataList.push(...data.records);
        }
      } catch (e) {}
    },
    async queryGatherList() {
      try {
        let data = await service.getGatheringList2({
          dramaId: this.id,
          userLatitude: uni.getStorageSync("currentLatitude"), //用户-经度
          userLongitude: uni.getStorageSync("currentLongitude"), //	用户-纬度
          pageNo: this.pageNo, // 使用当前页码请求数据
          pageSize: 10,
        });

        this.gatheringCountToday = data.gatheringCountToday;

        if (data.list.records && data.list.records.length) {
          this.dataList.push(...data.list.records); // 否则追加到旧数据之后
        }
      } catch (e) {
        console.error(e);
      }
    },
    //查询是否评价
    async ifExistMyEvaluate() {
      try {
        let data = await service.ifExistMyEvaluate({
          dramaId: this.id,
          userId: this.userInfo.id,
        });
        this.target = data;
      } catch (e) {}
    },
    //剧本详情 - 相关推荐
    async getDramaDetailRecommend() {
      try {
        let data = await service.getDramaDetailRecommend({
          cityId: this.cityInfo.cityId,
          id: this.id,
        });
        this.dataList = data;
      } catch (e) {}
    },
    //剧本评价-查询评价列表分页与统计结果
    async queryDramaEvaluatePageAndCount() {
      try {
        let params = {
          cityId: this.cityInfo.cityId,
          dramaId: this.id,
          pageNo: this.pageNo,
          pageSize: 10,
          userId: this.userInfo.id,
          dramaEvaluateType:
            this.selectedItemId == "ALL" ? undefined : this.selectedItemId,
        };

        let data = await service.queryDramaEvaluatePageAndCount(params);

        if (data.itemPageInfo.records && data.itemPageInfo.records.length) {
          this.dataList.push(...data.itemPageInfo.records);
        }

        this.dramaEvaluateCountItemList = data.dramaEvaluateCountItemList;
        const newItem = { dramaEvaluateType: "ALL" };
        this.dramaEvaluateCountItemList.unshift(newItem);
      } catch (e) {}
    },
    async loadDramaDetailStoreData() {
      try {
        let data = await service.queryDramaDetailStore({
          dramaId: this.id,
          lat: uni.getStorageSync("currentLatitude"),
          lon: uni.getStorageSync("currentLongitude"),
          pageNo: this.pageNo, // 使用当前页码请求数据
          pageSize: 10,
        });

        if (data.records && data.records.length) {
          this.dataList.push(...data.records); // 否则追加到旧数据之后
        }
      } catch (e) {
        console.error(e);
      }
    },
    //剧圈详情
    async queryAppDramaDetail(onlyloadCount) {
      try {
        let data = await service.queryAppDramaDetail({
          id: this.id,
          userId: this.userInfo.id,
        });
        if (!onlyloadCount) {
          this.queryAppDramaDetailList = data;
          this.fullContent = this.queryAppDramaDetailList.contentStr;
        }
        //仅刷新数量
        this.titleNumber = data.titleNumber;

        wx.hideLoading();
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.month_right {
  width: 12rpx;
  height: 18rpx;
}
.author-item {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;

  .name {
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}
.wrapper {
  width: 702rpx;
  height: 686rpx;
  background: #ffffff;
  border-radius: 40rpx 40rpx 40rpx 40rpx;
  position: absolute;
  bottom: 48rpx;
  left: 24rpx;
}
.page-detail {
  background: linear-gradient(
    180deg,
    rgba(49, 49, 49, 1) 0%,
    rgba(44, 44, 44, 1) 100%
  );
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  .detail-main {
    width: 100%;
    position: relative;
    z-index: 2;
    .base-info {
      width: calc(100% - 48rpx);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      position: relative;

      .border-view {
        width: 228rpx;
        height: 304rpx;
        border-radius: 12rpx;
        margin-right: 24rpx;
        position: relative;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 228rpx;
          height: 304rpx;
          background: var(--border-view-background);
          border-radius: 12rpx;
          z-index: -1;
        }
      }

      .cover-pic {
        width: 226rpx;
        height: 302rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 12rpx;
        opacity: 1;
      }

      .couverImg {
        position: absolute;
        left: 170rpx;
        top: 0rpx;
        width: 60rpx;
        height: 34rpx;
      }

      .right-info {
        width: calc(100% - 252rpx);
        display: flex;
        flex-direction: column;

        .title {
          font-size: 40rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 1rpx;
        }

        .time {
          display: flex;
          align-items: center;
          /* 确保所有子元素在行内垂直居中 */
          font-size: 20rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffe39c;
          line-height: 23rpx;
          margin-top: 4rpx;

          div {
            margin-left: 10rpx;
          }

          img {
            vertical-align: middle;
            width: 12rpx;
            height: 8rpx;
          }
        }
        .all-rankings {
          width: 57vw;
          white-space: nowrap;
          overflow-x: scroll;
          display: flex;
        }

        .month-hot {
          margin-right: 20rpx;
          width: 128rpx;
          background: linear-gradient(109deg, #ea9a3c 0%, #f03131 100%);
          border-radius: 8rpx;
          margin-top: 34rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4rpx 8rpx;
          box-sizing: border-box;
        }
        .month-hot-nul {
          width: 128rpx;
          height: 60rpx;
        }

        .status {
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 28rpx;
          margin-top: 8rpx;
          color: rgba(255, 255, 255, 0.6);
        }

        .status > span {
          margin-left: 8rpx;
        }

        .btns {
          margin-top: 24rpx;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          position: relative;

          > div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
          }

          .btn1 div {
            width: 210rpx;
            height: 60rpx;
            border-radius: 16rpx;
            background: rgb(107, 107, 107);
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: none;
            font-size: 26rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;

            &.active {
              background-color: #454545;
              color: #fec635;
            }

            img {
              width: 36rpx;
              height: 36rpx;
              margin-right: 6rpx;
            }
          }

          .btn2 {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 60rpx;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.1) 20%,
              rgba(255, 255, 255, 0) 100%
            );
            border: 2rpx solid;
            border-left: none;
            border-right: none;
            border-image: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.1) 20%,
                rgba(255, 255, 255, 0)
              )
              2 2;
            box-sizing: border-box;

            img {
              border-radius: 50%;
              width: 60rpx;
              height: 60rpx;
              margin-right: 20rpx;
            }

            .has-evaluate {
              font-size: 24rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.8);
              line-height: 28rpx;
              letter-spacing: 0.6rpx;
            }
            .hasevaluatefls-one {
              font-size: 24rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 28rpx;
            }
            .hasevaluatefls {
              font-size: 24rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 28rpx;
              letter-spacing: 0.6rpx;
              margin-right: 12rpx;
              margin-left: 12rpx;
            }
            .shuxian {
              color: rgba(255, 255, 255, 0.2);
              opacity: 1;
              width: 2rpx;
              height: 22rpx;
              margin-right: 12rpx;
            }

            /deep/ .van-icon {
              margin-top: 4rpx;
            }
          }
        }
      }
    }

    .play-info {
      width: calc(100% - 48rpx);
      margin: 40rpx 24rpx 0 24rpx;
      height: 66rpx;
      background: linear-gradient(
        116deg,
        rgba(255, 233, 176, 0.1) 0%,
        rgba(255, 233, 176, 0) 100%
      );
      border-radius: 16rpx;
      box-sizing: border-box;
      opacity: 1;
      border: 1rpx solid rgba(215, 193, 135, 0.4);
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffe39c;
      display: flex;
      align-items: center;
      padding-left: 22rpx;

      .text-ben {
        display: inline-block;
        width: 62rpx;
        height: 26rpx;
        border-radius: 4rpx;
        opacity: 0.6;
        border: 1rpx solid #ffe39c;
        text-align: center;
        line-height: 26rpx;
        margin-right: 12rpx;
        font-size: 18rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffe39c;
      }
      .text-style {
        display: inline;
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: rgba(255, 227, 156, 0.8);
        line-height: 28rpx;
      }
    }

    .score-info {
      width: calc(100% - 48rpx);
      margin: 20rpx 24rpx;
      padding: 20rpx 24rpx 26rpx;
      // height: 192rpx;
      background: #262626;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      .top-number {
        display: flex;
        justify-content: space-between;
        margin-bottom: 18rpx;

        .name {
          font-size: 24rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          line-height: 28rpx;

          .mf-szImg {
            width: 130rpx;
            height: 34rpx;
            margin-left: 8rpx;
          }
        }

        .number {
          font-size: 22rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
        }
      }

      .score-progress {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .score {
          display: flex;
          flex-direction: column;
          font-size: 20rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          justify-content: center;
          // margin-left: 46rpx;
          text-align: center;

          .big {
            font-size: 52rpx;
            font-family: OPPOSans, OPPOSans;
            font-weight: 800;
            color: #fec635;
            line-height: 61rpx;
          }
          .flex-container {
            display: flex;
            align-items: center; /* 确保垂直居中 */
          }

          .pingfen {
            white-space: nowrap;
            font-size: 22rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.6);
            line-height: 26rpx;
          }
          .month_right {
            width: 10rpx;
            height: 18rpx;
            margin-left: 4rpx;
          }
        }

        .progress {
          // width: 100%;

          .namemm {
            display: flex;
            // flex-direction: column;
            justify-content: space-between;
            align-items: center;
            font-size: 12rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            margin-bottom: 4rpx;

            p {
              font-size: 20rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: rgba(255, 255, 255, 0.4);
              line-height: 23rpx;
              margin-right: 8rpx;
            }

            .progress {
              width: 300rpx;
            }
          }
        }
      }
    }

    .author-introduction {
      display: flex;
      flex-direction: column;
      width: calc(100% - 48rpx);
      margin: 40rpx auto 0 auto;

      // overflow: hidden;
      .author {
        margin-top: 24rpx;
        display: flex;
        align-items: center;
        white-space: nowrap; // 滚动必须加的属性

        // width: max-content;
        // transition: transform 0.5s ease;
        &-item {
          height: 46rpx;
          opacity: 1;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.1);
          padding: 6rpx 12rpx;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 42rpx;
          border: 2rpx solid;

          .month_three {
            width: 34rpx;
            height: 34rpx;
            margin-right: 12rpx;
          }

          .month-four {
            margin-left: 8rpx;
            margin-bottom: 6rpx;
            height: 18rpx;
            width: 18rpx;
          }

          &:not(:last-child) {
            margin-right: 20rpx;
          }
        }
      }

      .intro {
        font-size: 30rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 35rpx;
        margin-top: 24rpx;
        padding-bottom: 20rpx;
      }
      /* 限制文本行数 */
      .text-clamp {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2; /* 显示两行 */
      }

      /* 展开文本 */
      .text-expand {
        display: block;
      }

      .top-area {
        //width: 100%;
        //padding-right: 24rpx;
        display: flex;
        justify-content: space-between;

        .title {
          font-size: 34rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }

        .all-right {
          font-size: 24rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          line-height: 28rpx;
          .right-icon {
            // transform: translateY(2px);
          }
        }
      }
    }

    // 作者与简介
    .script-role {
      display: flex;
      flex-direction: column;
      width: calc(100% - 48rpx);
      margin-left: 24rpx;
      margin-top: 40rpx;

      .top-area {
        //width: 100%;
        //padding-right: 24rpx;
        display: flex;
        justify-content: space-between;

        .title {
          font-size: 34rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }

        .all-right {
          //padding-right: 24rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          @include hor;
          align-items: center;

          .right-icon {
            width: 15rpx;
            height: 20rpx;
            margin-left: 10rpx;
            transform: translateY(2rpx);
          }
        }
      }

      .scroll-x {
        width: 100%;
        margin-top: 24rpx;
        overflow-x: scroll;
        // padding-right: 24rpx;
        box-sizing: border-box;
        padding-bottom: 20rpx;

        .playText-list {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;

          .playText-item {
            width: 162rpx;
            margin-right: 16rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .cover {
              width: 162rpx;
              height: 216rpx;
              margin-bottom: 24rpx;
              border-radius: 12rpx;
            }

            .name {
              font-size: 26rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              text-align: center;
            }
          }
        }
      }
    }
  }

  .tabs-area {
    position: relative;
    z-index: 3;
    width: 100%;
    background: #fafafa;
    border-radius: 24rpx 24rpx 0 0;
    padding-bottom: 100rpx;
    .sticky-tabs {
      position: sticky !important;
      z-index: 2;
      .custom-tabs {
        border-radius: 24rpx 24rpx 0 0;
        list-style-type: none;
        padding: 34rpx 48rpx;
        box-sizing: border-box;
        margin: 0;
        display: flex;
        background-color: #ffffff;
        overflow: auto;
        white-space: nowrap;
        height: 110rpx;
      }

      .custom-tabs li {
        font-size: 30rpx;
        font-weight: 400;
        color: #959aa5; /* 默认颜色 */
        line-height: 35rpx;
        margin-right: 88rpx;
        position: relative;
        /* 您可以在这里添加padding，如果每个标签需要内部空间 */
      }

      .custom-tabs li.active {
        font-size: 32rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        line-height: 38rpx;
        position: relative;
      }
      .custom-tabs li.active::after {
        content: "";
        display: block;
        width: 32rpx;
        height: 6rpx;
        background: #36e4bb;
        border-radius: 3rpx;
        position: absolute;
        left: 50%;
        top: 51rpx;
        transform: translateX(-50%);
        opacity: 1;
      }

      .custom-tabs .info {
        font-size: 18rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #959aa5;
        line-height: 21rpx;
        border-radius: 10px;
        position: absolute;
        top: 1px;
        left: 33px;
      }
    }
    .play-hot-ctx-no {
      width: 100%;
      // height: 81vh;
      display: flex;
      padding-top: 178rpx;
      box-sizing: border-box;

      flex-direction: column;
      .content-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .no-img {
        width: 176rpx;
        height: 176rpx;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .text-trends {
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        line-height: 35rpx;
        margin-bottom: 8rpx;
        text-align: center;
      }
      .text {
        font-size: 28rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        line-height: 33rpx;
        margin-bottom: 56rpx;
        text-align: center;
      }
      .trends-button {
        width: 356rpx;
        height: 94rpx;
        background: #2e323e;
        border-radius: 46rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #36e4bbff;
      }
      .gather-button {
        width: 220rpx;
        height: 80rpx;
        background: #2e323e;
        border-radius: 46rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #36e4bbff;
      }
    }

    .play-hot-ctx {
      width: calc(100% - 48rpx);
      padding: 22rpx 24rpx;
      display: flex;
      flex-direction: column;
      position: relative;
      .footer-text {
        width: 100%;
        text-align: center;
        margin-top: 12rpx;
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        line-height: 28rpx;
      }
      .bottom-button {
        z-index: 99;
        position: fixed; // 使用绝对定位
        bottom: 68rpx; // 距离底部210rpx
        left: 50%; // 左侧定位到50%，配合transform实现居中
        transform: translateX(-50%); // 向左移动元素宽度的50%来实现居中
        display: flex; /* 使用Flexbox布局 */
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */
        padding: 10px 0;
        .groupImg {
          width: 304rpx;
          height: 80rpx;
        }

        span {
          position: absolute;
          top: 38rpx;
          font-size: 28rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 33rpx;
          text-align: center; /* 文字居中 */
          /* 如果需要，添加额外的样式以匹配设计 */
        }
      }
      .title {
        img {
          width: 28rpx;
          height: 28rpx;
          margin-right: 4rpx;
        }
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        line-height: 0.4375rem;
        height: 0.95rem;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0) 1%,
          #ffffff 25%
        );
      }
    }
    .hot-commit-tabs {
      display: block; /* scroll-view 默认是块级元素 */
      white-space: nowrap; /* 强制所有项目在一行显示，允许滚动 */
      overflow-x: auto; /* 允许水平方向滚动 */
      padding-bottom: 40rpx;
      position: sticky;
      z-index: 1;
      background: #fafafa;
      padding-top: 30rpx;
      .hot-commit-item {
        font-size: 24rpx;
        font-weight: 500;
        color: #2e323e;
        border-radius: 112rpx;
        border: 1rpx solid #d8dade;
        padding: 10rpx 30rpx;
        justify-content: space-around;
        box-sizing: border-box;
        align-items: center;
        display: inline-flex; /* inline-flex 也可以，但 inline-block 在这里可能更合适 */
        margin-left: 24rpx;
        p {
          font-size: 24rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #2e323e;
        }

        .hot_text {
          white-space: nowrap;
          font-weight: 500;
        }

        .num {
          color: #959aa5;
        }
      }
      .item-selected {
        font-size: 24rpx;
        font-weight: 500;
        color: #2e323e;
        border-radius: 112rpx;
        padding: 10rpx 30rpx;
        justify-content: space-around;
        box-sizing: border-box;
        align-items: center;
        display: inline-flex; /* inline-flex 也可以，但 inline-block 在这里可能更合适 */
        opacity: 1;
        background: #f1fffc;
        border: 1rpx solid #36e4bb;
        p {
          font-size: 24rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #2e323e;
        }

        .hot_text {
          white-space: nowrap;
          font-weight: 500;
        }

        .num {
          color: #959aa5;
        }
      }
    }
    .dramaId-text {
      font-size: 30rpx;
      font-weight: 500;
      color: #2e323e;
      margin: 20rpx 24rpx 0rpx 24rpx;
    }
    // 剧评
    .hot-commit-ctx {
      padding: 22rpx 24rpx;

      > p {
        font-size: 30rpx;
        font-weight: 500;
        color: #2e323e;
        margin-top: 20rpx;
        margin-bottom: 30rpx;
      }

      .hot-commit-tabs {
        display: block; /* scroll-view 默认是块级元素 */
        white-space: nowrap; /* 强制所有项目在一行显示，允许滚动 */
        overflow-x: auto; /* 允许水平方向滚动 */
        margin-bottom: 40rpx;

        .hot-commit-item {
          font-size: 24rpx;
          font-weight: 500;
          color: #2e323e;
          border-radius: 112rpx;
          border: 1rpx solid #d8dade;
          padding: 10rpx 30rpx;
          justify-content: space-around;
          box-sizing: border-box;
          align-items: center;
          display: inline-flex; /* inline-flex 也可以，但 inline-block 在这里可能更合适 */
          margin-right: 18rpx;
          p {
            font-size: 24rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #2e323e;
          }

          .hot_text {
            white-space: nowrap;
            font-weight: 500;
          }

          .num {
            color: #959aa5;
          }
        }
        .item-selected {
          font-size: 24rpx;
          font-weight: 500;
          color: #2e323e;
          border-radius: 112rpx;
          padding: 10rpx 30rpx;
          justify-content: space-around;
          box-sizing: border-box;
          align-items: center;
          display: inline-flex; /* inline-flex 也可以，但 inline-block 在这里可能更合适 */
          margin-right: 18rpx;
          opacity: 1;
          background: #f1fffc;
          border: 1rpx solid #36e4bb;
          p {
            font-size: 24rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #2e323e;
          }

          .hot_text {
            white-space: nowrap;
            font-weight: 500;
          }

          .num {
            color: #959aa5;
          }
        }
      }
      .published {
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
        position: fixed; // 使用绝对定位
        bottom: 68rpx; // 距离底部210rpx
        left: 50%; // 左侧定位到50%，配合transform实现居中
        transform: translateX(-50%); // 向左移动元素宽度的50%来实现居中
        display: flex;
        align-items: center;
        justify-content: center;
        width: 304rpx;
        height: 80rpx;
        background: #ffffff;
        border-radius: 44rpx 44rpx 44rpx 44rpx;
        opacity: 1;
        border: 2rpx solid #cdd1d5;
        font-size: 28rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        line-height: 33rpx;
        z-index: 99;
      }
      .published-no {
        position: fixed; // 使用绝对定位
        bottom: 68rpx; // 距离底部210rpx
        left: 50%; // 左侧定位到50%，配合transform实现居中
        transform: translateX(-50%); // 向左移动元素宽度的50%来实现居中
        width: 304rpx; // 图片宽度
        height: 80rpx; // 图片高度
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99;

        .content {
          position: relative; // 使 img 绝对定位于此容器内
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          font-size: 28rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 33rpx;
          p {
            position: absolute;
            top: 20%;
          }
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1; // 确保图片在文字之下
          }
        }
      }
      .hot-commit-list {
        margin-bottom: 50rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    //店铺
    .scroll-view {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 90vh;
      position: relative;
    }
    .footer-text {
      width: 100%;
      text-align: center;
      margin-top: 6rpx;
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      line-height: 28rpx;
    }
  }
}
</style>