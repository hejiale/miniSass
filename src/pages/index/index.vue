<template>
  <div class="home-page">
    <div
      class="navigationBar"
      :class="getDynamicClass"
      :style="navBarStyle"
    >
      <ul class="tab-list">
        <li class="tab-city tab-item" @click="changeCity">
          <span
            class="switch-city"
            :style="activeRankStyle"
          >
            {{ removeCitySuffix(cityIndex || "苏州市") }}</span
          >
          <van-icon name="arrow-down" size="12" :color="isDramaReviewActive ? '#5F6572':'#fff'"/>
        </li>
        <li
          class="tab-item"
          v-for="item in tabList"
          :key="item"
          :class="{ 'active-tab-item': item === activeItem }"
          :style="activeRankStyle"
          @click="changeActive(item)"
        >
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
    <view
      v-if="activeItem === '推荐'"
      class="main"
      :style="scrollStyleTop"
    >
      <div class="header-wrapper">
        <image class="active-bg" :src="middleBanner.info.bkUrl" mode="aspectFill"/>
        <image class="active-act" :src="middleBanner.info.actUrl" mode="aspectFill" @click="activityNavigator(middleBanner.jumpType, middleBanner.jumpPath)"/>
        <!-- 轮播图滚动，10s一变，白点 -->
        <swiper
          class="my-swipe"
          circular
          autoplay
          indicator-color="white"
        >
          <swiper-item
            v-for="item in indexBanner"
            :key="item.id"
            @click="activityNavigator(item.jumpType, item.jumpPath)"
          >
            <image
              class="swipeImage"
              :src="item.activityImg"
              mode="aspectFill"
            />
          </swiper-item>
        </swiper>
        <!-- 滚动弹幕区域 -->
        <ul
          class="barrage-area"
          v-if="checkPromotionData()"
          :style="{ 'margin-left': randomMarginLeft() }"
        >
          <li
            class="barrage"
            v-for="item in middleBanner.info.font.slice(0, 3)"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
        <ul
          class="barrage-area"
          v-if="checkPromotionData()"
          :style="{ 'margin-left': randomMarginLeft() }"
        >
          <li
            class="barrage"
            v-for="item in middleBanner.info.font.slice(3, 6)"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
        <ul
          class="barrage-area"
          v-if="checkPromotionData()"
          :style="{ 'margin-left': randomMarginLeft() }"
        >
          <li
            class="barrage"
            v-for="item in middleBanner.info.font.slice(6, 10)"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <!-- 同城组局 -->
      <div class="play-city-area single" v-if="gatherDisplayType === 'single'">
        <template>
          <div class="top-area">
            <div class="title">
              <span>同城组局</span>
              <span class="inner-hot">{{ total }}场热拼中</span>
            </div>

            <div class="all-right">
              <image class="right-icon" :src="getRightArrowIcon()" />
              <span @click="gatherListNavigator">全部{{ total }}</span>
            </div>
          </div>
          <swiper
            v-if="gather && gather.length"
            class="my-swipe-y"
            :vertical="4000"
            :autoplay="false"
            :disable-touch="true"
            indicator-color="white"
            circular
          >
            <view catchtouchmove="stopTouchMove">
              <swiper-item
                v-for="ite in gather"
                :key="ite.id"
                class="swiperItem"
              >
                <div class="bottom-area">
                  <van-skeleton title avatar :row="3" :loading="loading">
                    <div class="inner-bottom-area">
                      <image
                        class="avatar-one"
                        :src="ite.dramaItem.dramaCover"
                        mode="aspectFill"
                        @click="dramaDetailNavigator(ite.dramaItem.id)"
                      />
                      <image
                        class="avatar-img"
                        :src="getAvatarIcon(ite.dramaItem.sellType)"
                      />
                      <div
                        class="right-text-area"
                        @click="gatherDetailNavigator(ite.id)"
                      >
                        <div class="name-status">
                          <span class="name" v-if="ite.dramaItem.dramaName">{{
                            $filters.truncateText(ite.dramaItem.dramaName, 8)
                          }}</span>
                          <div class="assembly" v-if="ite.gatherSuccessState">
                            <span>
                              拼成率
                              <text style="color: red">{{
                                ite.gatherSuccessState
                              }}</text>
                            </span>
                          </div>
                        </div>

                        <div class="person-area">
                          <div
                            class="pic-overlap-area"
                            :key="item.id"
                            v-for="item in ite.gatheringMemberItemList.slice(
                              0,
                              4
                            )"
                          >
                            <img :src="item.avatar" class="avatar" alt />
                          </div>
                          <div class="person-right-text">
                            <span>
                              {{
                                ite.realFemaleGamerNum +
                                ite.realMaleGamerNum +
                                ite.botMaleGamerNum +
                                ite.botFemaleGamerNum
                              }}人已上车
                            </span>
                            <span
                              class="sub"
                              v-text="getDifferenceText(ite)"
                            ></span>
                          </div>
                        </div>
                        <div class="time">
                          开局：{{
                            formatGameTimeWithDay(
                              ite.gameStartTime,
                              ite.gameEndTime,
                              ite.dataRemark
                            )
                          }}
                        </div>
                        <div class="price">
                          价格：¥{{ ite.originPrice / 100 }}/位
                        </div>
                      </div>
                    </div>
                  </van-skeleton>
                </div>
              </swiper-item>
            </view>
          </swiper>
          <div class="bottom-area-min" v-else>
            当前城市暂时没有组局~
            <van-button @click="gatherListNavigator">发起组局</van-button>
          </div>
        </template>
      </div>
      <!-- 我的组局 同城组局 -->
      <div
        class="play-city-area multiple"
        :class="{ null: !gather.length }"
        v-else-if="gatherDisplayType === 'multiple'"
      >
        <template>
          <div class="my-zj" v-if="gather && gather.length">
            <div class="top-area">
              <div class="title">
                <div>我的组局</div>
                <div class="inner-hot" @click="gatherListNavigator">
                  <p>{{ playerTotal }}场拼场中</p>
                  <div class="all-right">
                    <image class="right-icon" :src="getRightArrowIcon()" alt />
                  </div>
                </div>
              </div>
            </div>
            <swiper
              class="my-swipe-y"
              :vertical="4000"
              :autoplay="true"
              :disable-touch="true"
              indicator-color="white"
              circular
            >
              <view catchtouchmove="stopTouchMove">
                <swiper-item
                  v-for="ite in playerGatheredGamePageList"
                  :key="ite.id"
                  class="swiperItem"
                >
                  <div class="bottom-area">
                    <van-skeleton title avatar :row="3" :loading="loading">
                      <div class="inner-bottom-area">
                        <div
                          class="text-area"
                          @click="gatherDetailNavigator(ite.id)"
                        >
                          <div class="tit my now-rap">
                            <img
                              class="area-icon"
                              src="../../static/image/index/dianpuhei.png"
                            />
                            <p>
                              {{
                                $filters.convertMetersToKilometers(
                                  ite.distance
                                )
                              }}km |
                              {{ $filters.truncateText(ite.storeName, 6) }}
                            </p>
                          </div>
                          <div class="tit my now-rap">
                            <img
                              class="area-icon"
                              src="../../static/image/index/shizhonghei.png"
                            />
                            <p>
                              {{
                                $filters.formatGameStartTime(ite.gameStartTime)
                              }}
                              {{ formatDay(ite.dataRemark) }}
                            </p>
                          </div>
                          <div
                            class="progress"
                            v-if="ite.gatherStatus == 'GATHERING'"
                          >
                            <div class="line" :style="[lineStyle(ite)]"></div>
                            <div class="imgs">
                              <div
                                v-for="(v, idx) in memberList(
                                  ite.gatheringMemberItemList
                                )"
                                :key="v.id"
                                :style="idx > 0 ? 'margin-left: -10px' : ''"
                              >
                                <img :src="v.avatar" alt />
                              </div>
                            </div>
                            <p>等{{ ite.lastFemale + ite.lastMale }}人</p>
                          </div>
                          <div
                            class="progress success"
                            v-if="ite.gatherStatus == 'SUCCESS'"
                          >
                            <div class="line"></div>
                            <div class="imgs">
                              <div
                                v-for="(v, idx) in memberList(
                                  ite.gatheringMemberItemList
                                )"
                                :key="v.id"
                                :style="idx > 0 ? 'margin-left: -10px' : ''"
                              >
                                <img :src="v.avatar" class="avatar" alt />
                              </div>
                            </div>
                            <p>拼场成功</p>
                          </div>
                          <div
                            class="time success"
                            v-html="
                              $filters.calculateTimeToEvent(ite.gameStartTime)
                            "
                          ></div>
                        </div>
                        <div
                          class="main-area"
                          @click="dramaDetailNavigator(ite.dramaItem.id)"
                        >
                          <image
                            class="avatar-one"
                            :src="ite.dramaItem.dramaCover"
                            mode="aspectFill"
                          />
                          <div class="main-right">
                            <div class="name">
                              {{
                                $filters.truncateText(
                                  ite.dramaItem.dramaName,
                                  8
                                )
                              }}
                            </div>
                            <div class="type">
                              <span
                                class="type-area"
                                v-for="v in ite.dramaItem.dramaThemeList"
                                :key="v.id"
                              >
                                {{ v.dictValue }}
                              </span>
                              …
                            </div>
                          </div>
                        </div>
                      </div>
                    </van-skeleton>
                  </div>
                </swiper-item>
              </view>
            </swiper>
          </div>
          <div class="tc-zj" v-if="gather && gather.length">
            <div class="top-area">
              <div class="title">
                <div>同城组局</div>
                <div class="inner-hot" @click="gatherListNavigator">
                  <p>{{ total }}场拼场中</p>
                  <div class="all-right">
                    <image class="right-icon" :src="getRightArrowIcon()" alt />
                  </div>
                </div>
              </div>
            </div>
            <swiper
              class="my-swipe-y"
              :vertical="4000"
              :autoplay="true"
              :disable-touch="true"
              indicator-color="white"
              circular
            >
              <view catchtouchmove="stopTouchMove">
                <swiper-item
                  v-for="ite in gather"
                  :key="ite.id"
                  class="swiperItem"
                >
                  <div class="bottom-area">
                    <van-skeleton title avatar :row="3" :loading="loading">
                      <div class="inner-bottom-area">
                        <div
                          class="main-area"
                          @click="dramaDetailNavigator(ite.dramaItem.id)"
                        >
                          <image
                            class="avatar-one"
                            :src="ite.dramaItem.dramaCover"
                            mode="aspectFill"
                          />
                          <image
                            class="avatar-img"
                            :src="getAvatarIcon(ite.dramaItem.sellType)"
                          />
                          <div class="main-right">
                            <div class="name" v-if="ite.dramaItem.dramaName">
                              {{
                                $filters.truncateText(
                                  ite.dramaItem.dramaName,
                                  8
                                )
                              }}
                            </div>
                            <div class="type">
                              <span
                                class="typetext"
                                v-for="item in ite.dramaItem.dramaThemeList.slice(
                                  0,
                                  4
                                )"
                                :key="item.id"
                              >
                                {{ item.dictValue }}
                              </span>
                            </div>
                            <div class="price">
                              ¥{{ ite.originPrice / 100 }}/位
                            </div>
                          </div>
                        </div>
                        <div
                          class="text-area"
                          @click="gatherDetailNavigator(ite.id)"
                        >
                          <div class="tit my now-rap">
                            <img
                              class="area-icon"
                              src="../../static/image/index/shop.png"
                            />
                            <p>
                              {{
                                $filters.convertMetersToKilometers(
                                  ite.distance
                                )
                              }}km |
                              {{ $filters.truncateText(ite.storeName, 6) }}
                            </p>
                          </div>
                          <div class="tit my now-rap">
                            <img
                              class="area-icon"
                              src="../../static/image/index/clock.png"
                            />
                            <p>
                              {{
                                $filters.formatGameStartTime(ite.gameStartTime)
                              }}
                              {{ formatDay(ite.dataRemark) }}
                            </p>
                          </div>
                          <div class="tit my now-rap">
                            <img
                              class="area-icon"
                              src="../../static/image/index/friend.png"
                            />
                            <div class="imgs">
                              <div
                                v-for="(v, idx) in memberList(
                                  ite.gatheringMemberItemList
                                )"
                                :key="v.id"
                                :style="idx > 0 ? 'margin-left: -10px' : ''"
                              >
                                <img :src="v.avatar" class="avatar" alt />
                              </div>
                            </div>
                            <p class="p">
                              <span v-if="ite.lastFemale + ite.lastMale > 0"
                                >等{{ ite.lastFemale + ite.lastMale }}人</span
                              ><span v-if="ite.gatherSuccessState">
                                拼成率
                                <text style="color: red">{{
                                  ite.gatherSuccessState
                                }}</text>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </van-skeleton>
                  </div>
                </swiper-item>
              </view>
            </swiper>
          </div>
          <div v-else>
            <div class="top-area">
              <div class="title">
                <span>同城组局</span>
                <span class="inner-hot">{{ total }}场热拼中</span>
              </div>

              <div class="all-right">
                <image class="right-icon" :src="getRightArrowIcon()" alt />
                <span @click="gatherListNavigator">全部{{ total }}</span>
              </div>
            </div>
            <div class="bottom-area-min">
              当前城市暂时没有组局~
              <van-button @click="gatherListNavigator">发起组局</van-button>
            </div>
          </div>
        </template>
      </div>
      <!-- 同城组局暂无数据 -->
      <div
        class="play-city-area null"
        v-else-if="gatherDisplayType === 'notData'"
      >
        <div class="top-area">
          <div class="title">
            <span>同城组局</span>
            <span class="inner-hot">{{ total }}场热拼中</span>
          </div>

          <div class="all-right">
            <image class="right-icon" :src="getRightArrowIcon()" alt />
            <span @click="gatherListNavigator">全部{{ total }}</span>
          </div>
        </div>
        <div class="bottom-area-min">
          当前城市暂时没有组局~
          <van-button @click="gatherListNavigator">发起组局</van-button>
          <BindPhone
            v-if="!userInfoMessage.phone"
            ref="BindPhone"
            @on-success-authorize="onRefreshUserInfo"
            paddingBottom="12vh"
          />
        </div>
      </div>
      <!-- 热本推荐 -->
      <div class="hot-new-area">
        <ul class="recommend-list" style="list-style: none">
          <li
            v-for="item in recommendList"
            :key="item.id"
            :class="{ 'active-recommend-item': item == recommendItem }"
            class="recommend-item"
            @click="changeRecommend(item)"
          >
            {{ item }}
          </li>
          <div class="all-right-city" @click="dramaListNavigator">
            <image class="right-icon-city" :src="getRightArrowIcon()" alt />
            <span>全部</span>
          </div>
        </ul>

        <scroll-view
          :scroll-left="scrollLeft"
          scroll-x="true"
          class="scroll-x"
          @scroll="scroll"
          @scrolltoupper="curScrollRate = 0"
          @scrolltolower="curScrollRate = 1"
        >
          <ul class="playText-list" style="list-style: none">
            <li
              class="playText-item"
              v-for="item in HotbookRecom"
              :key="item.id"
            >
              <image
                class="cover"
                :src="item.dramaCover"
                @click="dramaDetailNavigator(item.id)"
                mode="aspectFill"
              />
              <image
                class="coverno"
                v-if="item.dramaCover == null"
                mode="aspectFill"
              />
              <image
                class="coverno-bottom"
                v-if="item.dramaCover == null"
                mode="aspectFill"
              />
              <image
                class="coverno-img"
                :src="$iconFont.getIconName('juyouone')"
                v-if="item.dramaCover == null"
              />
              <image
                class="couverImg"
                v-if="item.sellType == 'REAL_SCENE'"
                :src="$iconFont.getIconName('liveAction')"
              />
              <image
                class="couverImg"
                v-if="item.sellType == 'LIMITED'"
                :src="$iconFont.getIconName('Citylimit')"
              />
              <image
                class="couverImg"
                v-if="item.sellType == 'EXCLUSIVE'"
                :src="$iconFont.getIconName('exclusive')"
              />
              <div class="score">{{ item.evaluate + "分" || "9.0分" }}</div>
              <span class="name">{{
                $filters.truncateText(item.dramaName, 5)
              }}</span>
            </li>
            <li class="playText-item" v-if="HotbookRecom.length >= 16">
              <div class="coverNone">
                <image
                  class="couverNone-img"
                  :src="HotbookRecom[0].dramaCover"
                />
                <span class="coverNone-text coverNone-text-all">全部</span>
                <span class="coverNone-text coverNone-text-look">查看</span>
              </div>
            </li>
          </ul>
        </scroll-view>

        <!-- 滚动条区域 -->
        <div class="scroll-views">
          <div
            class="scroll-box"
            :style="{
              'margin-left': 108 * curScrollRate + 'rpx',
            }"
          ></div>
        </div>
      </div>
      <!-- 剧圈动态 -->
      <view class="trends-area">
        <view class="dymaicTitle" :style="scrollStyleTop">
          <view class="title-discover">剧圈动态</view>
          <view class="all-right" @click="discoverListNavigator">
            <image class="right-icon" :src="getRightArrowIcon()" />
            <view class="right-text">发现更多</view>
          </view>
        </view>
        <view class="masonry">
          <view class="col">
            <view
              class="box"
              v-for="(item, index) in filteredHomePageDynamicList"
              :key="item.id"
            >
              <image
                class="default-pic"
                :src="item.fileUrl"
                mode="aspectFill"
                lazy-load="true"
                @click="
                  dynamicNavigator(item.dynamicType, item.id, item.detail)
                "
              />
              <image
                class="default-son"
                :src="$iconFont.getIconName('visit')"
                lazy-load="true"
                v-if="item.labelDicts == '亲情'"
              />
              <div class="default-box">
                <p class="font-hidden" v-if="item.content">
                  {{ item.content }}
                </p>
                <div class="vipRec">
                  <div class="kzanfont">
                    <div
                      style="
                        min-width: 150rpx;
                        display: flex;
                        align-items: center;
                      "
                    >
                      <image class="avatarvip" :src="item.avatar" />
                      <span class="viprectext">{{
                        $filters.truncateText(item.nickName, 6)
                      }}</span>
                    </div>
                    <div
                      style="
                        min-width: 100rpx;
                        display: flex;
                        align-items: center;
                        flex-direction: row-reverse;
                        position: relative;
                      "
                      @click="toggleImage(item, index)"
                    >
                      <span>{{ item.praiseQuantity }}</span>
                      <image
                        class="kzan"
                        :src="
                          item.isPraise === true
                            ? $iconFont.getIconName('mzan')
                            : $iconFont.getIconName('kzan')
                        "
                        alt
                      />
                      <BindPhone
                        v-if="!userInfoMessage.phone"
                        ref="BindPhone"
                        @on-success-authorize="onRefreshUserInfo"
                        paddingBottom="12vh"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </view>
          </view>
          <view class="col">
            <view
              class="second-column-top-box"
              @click="changeActive('跳转排行')"
            >
              <div style="position: relative; width: 100%; height: 204rpx">
                <!--                <p class="title">近期最多人玩</p>-->
                <image
                  class="sort-pic"
                  :src="$iconFont.getIconName('hot-list-discover')"
                  lazy-load="true"
                  mode="aspectFit"
                />
              </div>
              <div class="dramaTourRankings">
                <div
                  class="Rankings"
                  v-for="(item, index) in filterRankList"
                  :key="index"
                >
                  <span class="person-text-one"
                    >{{ index + 1 }}
                    {{ $filters.truncateText(item.dramaName, 10) }}</span
                  >
                </div>
                <div class="Rankings">
                  <span class="person-text-one">......</span>
                </div>
              </div>
            </view>
            <view
              class="box"
              v-for="(item, index) in filteredHomePageDynamicListtwo"
              :key="item.id"
            >
              <image
                class="default-pic"
                lazy-load="true"
                :src="item.fileUrl"
                mode="aspectFill"
                @click="
                  dynamicNavigator(item.dynamicType, item.id, item.detail)
                "
              />
              <image
                class="default-son"
                :src="$iconFont.getIconName('visit')"
                lazy-load="true"
                v-if="item.labelDicts == '亲情'"
              />
              <div class="default-box">
                <p class="font-hidden" v-if="item.content">
                  {{ item.content }}
                </p>
                <div class="vipRec">
                  <div style="display: flex" class="kzanfont">
                    <div
                      style="
                        min-width: 150rpx;
                        display: flex;
                        align-items: center;
                      "
                    >
                      <image class="avatarvip" :src="item.avatar" />
                      <span class="viprectext">{{
                        $filters.truncateText(item.nickName, 6)
                      }}</span>
                    </div>
                    <div
                      style="
                        min-width: 100rpx;
                        display: flex;
                        align-items: center;
                        flex-direction: row-reverse;
                        position: relative;
                      "
                    >
                      <span>{{ item.praiseQuantity }}</span>

                      <image
                        class="kzan"
                        :src="
                          item.isPraise === true
                            ? $iconFont.getIconName('mzan')
                            : $iconFont.getIconName('kzan')
                        "
                        alt
                        @click="toggleImage(item, index)"
                      />

                      <BindPhone
                        v-if="!userInfoMessage.phone"
                        ref="BindPhone"
                        @on-success-authorize="onRefreshUserInfo"
                        paddingBottom="12vh"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view
      class="ranking-main"
      v-if="activeItem === '排行榜'"
    >
      <rankingList :scrollTop="scrollTop"/>
    </view>
    <view
      class="drama-review-main"
      v-if="activeItem === '剧场回顾'"
    >
      <dramaReview
        ref="dramaReview"
        :userInfoMessage="userInfoMessage"
      />
    </view>
    <tabBar :active="0" v-show="true" />
  </div>
</template>

<script>
import tabBar from "@/components/tabBar/index.vue";
import rankingList from "./components/rankingList.vue";
import dramaReview from "./components/dramaReview.vue";
import BindPhone from "@/components/bindPhone/index.vue";
import {
  activityNavigator,
  dramaDetailNavigator,
  dramaListNavigator,
  dynamicNavigator,
  gatherDetailNavigator,
  gatherListNavigator,
  discoverListNavigator,
} from "@/utils/navigator";
import { getMenuButtonRect } from "@/utils/index";
export default {
  components: {
    tabBar,
    rankingList,
    dramaReview,
    BindPhone,
  },
  data() {
    return {
      userInfoMessage: null,
      timer: null,
      cityIndex: "",
      playerTotal: 0,
      pageNoDynamic: 1,
      cityId: null,
      city: null,
      showBackground: true,
      daysMap: {
        MONDAY: "周一",
        TUESDAY: "周二",
        WEDNESDAY: "周三",
        THURSDAY: "周四",
        FRIDAY: "周五",
        SATURDAY: "周六",
        SUNDAY: "周日",
      },
      promotionOrderList: [],
      indexBanner: [],
      middleBanner: {},
      HotbookRecom: [],
      rankingList: [],
      noMoreData: false,
      regionResolverList: [],
      total: 0,
      gather: [],
      activeItem: "推荐",
      tabList: ["推荐", "排行榜", "剧场回顾"],
      loading: true,
      recommendItem: "热本推荐",
      recommendList: ["热本推荐"],
      playTextList: [],
      curScrollRate: 0,
      homePageDynamicList: [],
      playerGatheredGamePageList: [],
      scrollLeft: 0,
      old: {
        scrollLeft: 0,
      },
      single: false,
      multiple: false,
      scrollTop: 0,
      endLoad: false,
      menuReact: null,
      activity: null
    };
  },

  computed: {
    /*组局展示类型*/
    gatherDisplayType() {
      if (!this.gather.length) {
        return "notData";
      }
      if (this.total > 0 && this.playerTotal > 0) {
        return "multiple";
      }
      if (this.total > 0 && this.playerTotal == 0) {
        return "single";
      }
      return "default"; // 或者任何其他默认类型
    },
    /*当前选项是否为剧评*/
    isDramaReviewActive() {
      return this.activeItem === "剧场回顾" || (this.activeItem === '排行榜' && this.scrollTop > 0);
    },
    filteredHomePageDynamicList: function () {
      var filterDynamic = this.homePageDynamicList.filter(
        (item, index) => index % 2 === 0
      );

      filterDynamic.forEach((item) => {
        if (item.dynamicType === 2) {
          item.avatar = this.$iconFont.getIconName("dynamic-avatar");
          item.nickName = "剧游宇宙官方";
        }
      });
      return filterDynamic;
    },
    filteredHomePageDynamicListtwo: function () {
      var filterDynamic = this.homePageDynamicList.filter(
        (item, index) => index % 2 === 1
      );
      filterDynamic.forEach((item) => {
        if (item.dynamicType === 2) {
          item.avatar = this.$iconFont.getIconName("dynamic-avatar");
          item.nickName = "剧游宇宙官方";
        }
      });
      return filterDynamic;
    },
    filterRankList: function () {
      this.rankingList.forEach((item) => {
        item.orderWeight =
          item.orderWeight > 10000
            ? (item.orderWeight / 10000).toFixed(1) + "万分"
            : item.orderWeight + "分";
      });
      return this.rankingList;
    },
    getDynamicClass() {
      let bgBackground;

      if (this.activeItem === "剧场回顾") {
        bgBackground = "#FFFFFF";
      } else if (this.activeItem === "排行榜") {
        // 当处于排行榜且滚动条位置大于导航栏高度时
        bgBackground =
          this.scrollTop > this.navbarHeight ? "#f2f2f2FF" : "#000000FF";
      } else {
        bgBackground = "#996fe7ff";
      }

      return this.activeItem === "排行榜"
        ? this.scrollTop > this.navbarHeight
          ? "ranking-scroll"
          : "ranking"
        : this.activeItem === "剧场回顾"
        ? "drama-review"
        : "";
    },
    memberList() {
      return function (list) {
        if (list && list.length > 6) {
          return list.splice(0, 6);
        }
        return list;
      };
    },
    navBarStyle(){
      if(!this.menuReact || !this.middleBanner.info)return;
      if(this.activeItem === '推荐'){
        return `padding-top: ${this.menuReact.top}px; background-image: url(${this.middleBanner.info.actBotUrl});background-size: 100% 100%;background-repeat: no-repeat;`
      }
      else if(this.activeItem === '排行榜'){
        return `padding-top: ${this.menuReact.top}px; background: ${this.scrollTop > 30 ? '#F2F2F2':'unset'};`
      }
      else{
        return `padding-top: ${this.menuReact.top}px; background: #fff;`
      }
    },
    scrollStyleTop(){
      if(!this.menuReact)return;
      return `top: ${this.menuReact.top + this.menuReact.height}px;`
    },
    activeRankStyle(){
      if(this.activeItem === '排行榜'){
        return `color: ${this.scrollTop > 30 ? '#2E323E;':'#fff'}`
      }else if(this.activeItem === '剧场回顾'){
        return 'color: #5F6572';
      }
      return '#fff';
    }
  },
  mounted() {
    this.loading = true;
  },
  async onLoad() {
    wx.showShareMenu({
        menus: ["shareAppMessage", "shareTimeline"],
        success: () => {
        },
      });
    if (uni.getStorageSync("isLogin") !== true) {
      await this.$checkLogin.getGrant();
    }
    this.menuReact = await getMenuButtonRect();
    this.userInfoMessage = await this.$checkLogin.getUserInfo();

    Promise.all([
      this.queryHotDrama(),
      this.rankingListone(),
      this.promotionList(),
      this.changeActive(this.activeItem),
      this.$nextTick(() => {
        if (this.$refs.dramaReview) {
          this.$refs.dramaReview.methodInChild();
        }
      }),
    ]).then(async (res) => {
      this.endLoad = true;
    });
  },
  onShow() {
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }
    //切换页面，刷新组局和剧评数据
    if (this.endLoad) {
      if (this.activeItem === "推荐") {
        this.getGatheringInfo();
      }
    }
  },
  onReachBottom() {
    if(this.activeItem === '推荐'){
      this.getMoreDynamic();
    }else if(this.activeItem === '剧场回顾'){
      this.getMoreDramaReview();
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    //跳转LovePotion
    onGoLP(){
      uni.navigateTo({
        url: '/lovepotion/pages/index'
      })
    },
    //定位后获取组局信息
    getGatheringInfo() {
      if (uni.getStorageSync("isLocation")) {
        uni.getStorage({
          key: "cityInfo",
          success: async (res) => {
            if (res.data) {
              this.cityIndex = res.data.city; // 赋值操作
              this.cityId = res.data.cityId; // 赋值操作
              await this.getCityGatheringInfo();
              await this.playerGatheredGamePage();
            }
          },
        });
      } else {
        this.$checkLogin.requestAuthorize().then((_) => {
          uni.getStorage({
            key: "cityInfo",
            success: async (res) => {
              if (res.data) {
                this.cityIndex = res.data.city; // 赋值操作
                this.cityId = res.data.cityId; // 赋值操作
                await this.getCityGatheringInfo();
                await this.playerGatheredGamePage();
              }
            },
          });
        });
      }
    },
    //重新授权
    async onRefreshUserInfo() {
      this.userInfoMessage = await this.$checkLogin.getUserInfo(true);
    },
    discoverListNavigator,
    removeCitySuffix(cityName) {
      let modifiedCityName = cityName.replace("市", "");
      if (modifiedCityName.length > 3) {
        return modifiedCityName.substring(0, 3) + "...";
      }
      return modifiedCityName;
    },
    changeCity() {
      if (uni.getStorageSync("isLocation")) {
        uni.navigateTo({
          url: `/gatherPlayer/goChoodeCity/index?city=${this.city}`,
        });
      } else {
        this.authorize();
      }
    },
    /*获取剧本角标*/
    getAvatarIcon(sellType) {
      const iconMap = {
        REAL_SCENE: "liveAction",
        LIMITED: "Citylimit",
        EXCLUSIVE: "exclusive",
      };
      let iconMapElement = iconMap[sellType];
      if (!iconMapElement) return "";
      return this.$iconFont.getIconName(iconMapElement);
    },
    /*获得右箭头Icon*/
    getRightArrowIcon() {
      return this.$iconFont.getIconName("arrowright");
    },
    /*差?人文本*/
    getDifferenceText(item) {
      if (item.dramaItem.isOpposite) {
        return "差" + (item.lastFemale + item.lastMale) + "人";
      } else {
        let text = "差";
        if (item.lastFemale > 0) text += item.lastFemale + "女";
        if (item.lastMale > 0) text += item.lastMale + "男";
        return text;
      }
    },
    /*组局日期特殊处理*/
    formatGameTimeWithDay(startTime, endTime, dataRemark) {
      // 替换日期格式以确保兼容性
      const compatibleStartTime = startTime.replace(/-/g, "/");
      const compatibleEndTime = endTime.replace(/-/g, "/");

      const formattedTime = this.$filters.formatGameTime(
        compatibleStartTime,
        compatibleEndTime
      );
      const day = this.formatDay(dataRemark);

      let dayLabel = day;
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const startDate = new Date(compatibleStartTime);
      if (startDate.toDateString() === today.toDateString()) {
        dayLabel = "今天";
      } else if (startDate.toDateString() === tomorrow.toDateString()) {
        dayLabel = "明天";
      }

      return `${formattedTime} ${dayLabel}`;
    },
    lineStyle(ite) {
      const widthPercent =
        ((ite.realFemaleGamerNum + ite.realMaleGamerNum) / ite.totalGamerNum) *
        100;
      return { width: `${widthPercent}%` }; // 设置宽度为计算出的百分比
    },
    //动态剧本详情页
    goScrdetails(id) {
      uni.navigateTo({
        url: "/pageDetail/pages/pageDetail?id=" + id,
      });
    },
    /*校验中部活动区数据*/
    checkPromotionData() {
      if(!this.promotionOrderList || this.promotionOrderList.length)return false;
      
      return this.promotionOrderList &&
          this.promotionOrderList.length > 1 &&
          this.promotionOrderList[1].activityPromotionList &&
          this.promotionOrderList[1].activityPromotionList[0].info &&
          this.promotionOrderList[1].activityPromotionList[0].info.font;
    },
    randomMarginLeft() {
      /*生成0到100之间的随机数*/
      const marginLeft = Math.random() * 100;
      return marginLeft + "rpx";
    },
    showImage(nick) {
      this.avatar = nick ? this.mzan : this.kzan;
    },

    async toggleImage(item, index) {
      if (!this.userInfoMessage.phone) {
        return;
      }
      let status = "DISABLE";
      let dynamicType = item.dynamicType;
      let dynamicId = item.id;
      if (item.isPraise == false) {
        status = "ENABLE";
      } else {
        status = "DISABLE";
      }
      try {
        await this.userPraiseDynamic(status, dynamicType, dynamicId);
        if (item.isPraise == false) {
          item.isPraise = true;
          item.praiseQuantity++;
        } else {
          item.isPraise = false;
          item.praiseQuantity--;
        }
      } catch (err) {
        console.log(err);
      }
    },
    stopTouchMove() {
      return false;
    },
    formatDay(separatedData) {
      let parts = separatedData.split(" ");
      if (this.daysMap.hasOwnProperty(parts[0].toUpperCase())) {
        parts[0] = this.daysMap[parts[0].toUpperCase()];
      }
      return parts.join(" ");
    },
    activityNavigator,
    dynamicNavigator,
    dramaDetailNavigator,
    dramaListNavigator,
    gatherListNavigator,
    gatherDetailNavigator,
    //授权隐私定位
    authorize() {
      wx.getPrivacySetting({
        success: (res) => {
          this.$checkLogin.requestAuthorize();
        },
      });
    },
    //玩家-我的组局列表
    async playerGatheredGamePage() {
      let that = this;
      try {
        let data = await this.$api.playerGatheredGamePage({
          cityId: uni.getStorageSync("cityInfo").cityId,
          userId: this.userInfoMessage.id,
          lat: uni.getStorageSync("currentLatitude"),
          lon: uni.getStorageSync("currentLongitude"),
          pageNo: 1,
          pageSize: 50,
        });
        this.playerGatheredGamePageList = data.records;
        this.playerTotal = data.total;
      } catch (e) {}
    },
    async getCityGatheringInfo() {
      this.loading = true;

      try {
        let data = await this.$api.getCityGatheringInfo({
          cityId: uni.getStorageSync("cityInfo").cityId,
          userId: this.userInfoMessage.id,
          lat: uni.getStorageSync("currentLatitude"),
          lon: uni.getStorageSync("currentLongitude"),
          pageNo: 1,
          pageSize: 50,
        });

        this.gather = data.records;
        this.total = data.total;
      } catch (e) {}
      this.loading = false;
    },
    async queryHotDrama() {
      try {
        this.HotbookRecom = await this.$api.queryHotDrama({});
      } catch (e) {}
    },
    async queryNewDrama() {
      try {
        let data = await this.$api.queryNewDrama({});
        this.HotbookRecom = data;
      } catch (e) {}
    },
    async rankingListone() {
      try {
        let data = await this.$api.rankingList({
          rankType: "HOT_RANK",
        });
        this.rankingList = data;
      } catch (e) {}
    },
    async homePageDynamicone() {
      uni.showLoading({});

      try {
        let data = await this.$api.homePageDynamic({
          userId: this.userInfoMessage.id,
          activitySceneEnum: "MINE_PROGRAM",
          pageNo: this.pageNoDynamic,
          pageSize: 4,
        });

        if (data.records.length === 0) {
          this.noMoreData = true;
          //无限循环
          this.homePageDynamicList.push(...this.homePageDynamicList);
        } else {
          this.homePageDynamicList.push(...data.records);
        }
      } catch (e) {
      } finally {
        // 隐藏加载提示
        uni.hideLoading();
      }
    },
    //剧圈动态点赞
    async userPraiseDynamic(status, dynamicType, dynamicId) {
      try {
        let data = await this.$api.userPraiseDynamic({
          dynamicId: dynamicId,
          dynamicType: dynamicType,
          statusEnum: status,
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    async getMoreDynamic() {
      if (this.noMoreData) {
        //无限循环
        this.homePageDynamicList.push(...this.homePageDynamicList);
      } else {
        this.pageNoDynamic++;
        this.homePageDynamicone();
      }
    },

    getMoreDramaReview() {
      this.$refs.dramaReview.loadMore();
    },

    /*首页轮播图列表*/
    async promotionList() {
      try {
        this.promotionOrderList = await this.$api.promotionList({
          sceneEnum: "MINE_PROGRAM",
          typeEnum: ["PAGE_INDEX_BANNER", "PAGE_MIDDLE_BANNER"],
        });
        this.activity = this.promotionOrderList[1].activityPromotionList[0];
        this.indexBanner = this.promotionOrderList[0].activityPromotionList;
        this.middleBanner = this.promotionOrderList[1].activityPromotionList[0];
      } catch (e) {}
    },
    // 顶部导航切换
    changeActive(e) {
      if (e === "跳转排行") {
        uni.navigateTo({
          url: "/rankingList/pages/index",
        });
      } else {
        this.scrollTop = 0;
        this.activeItem = e;

        if (this.activeItem === "推荐") {
          this.pageNoDynamic = 1;
          this.homePageDynamicList = [];
          this.noMoreData = false;
          this.homePageDynamicone();
          this.getGatheringInfo();
        }
      }
    },
    changeRecommend(e) {
      this.recommendItem = e;
      if (e === "热本推荐") {
        this.queryHotDrama();
      } else {
        this.queryNewDrama();
      }
      this.scrollLeft = this.old.scrollLeft;
      this.$nextTick(function () {
        this.scrollLeft = 0;
      });
    },
    // 滚动时的处理
    scroll(e) {
      this.old.scrollLeft = e.detail.scrollLeft;
      this.curScrollRate =
        parseFloat(e.detail.scrollLeft.toFixed(2)) /
        (e.detail.scrollWidth - 370);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  background: #f5f6f8;
  position: relative;
  .navigationBar {
    width: 100%;
    background-size: 100%;
    position: fixed;
    top: 0px;
    width: 100vw;
    z-index: 30;
    .tab-list {
      width: 100%;
      height: 72rpx;
      display: flex;
      align-items: center;
      list-style: none;
      padding-bottom: 10rpx;
      .tab-city {
        margin-left: 24rpx;
      }
      .tab-item {
        font-size: 30rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        margin-right: 32rpx;
        position: relative;
        &:last-child {
          margin-right: 0;
        }
        span {
          position: relative;
        }
      }
      .switch-city {
        width: 60rpx;
        height: 42rpx;
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        line-height: 35rpx;
      }
      .active-tab-item {
        font-size: 48rpx;
        font-weight: 600;
        &::before {
          content: "";
          width: 100%;
          height: 16rpx;
          background: #36e4bb;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }
  .main {
    width: 100%;
    position: absolute;
    left: 0px;
    padding-bottom: calc((env(safe-area-inset-bottom) + 50px));
    .header-wrapper {
      width: 100%;
      height: 27.7vh;
      background-size: 100% 100%;
      position: relative;
      box-sizing: border-box;
      .active-bg,
      .active-act {
        @include abscenter;
      }
      .active-act {
        z-index: 1;
      }
    }
    .my-swipe {
      width: 100%;
      box-sizing: border-box;
      height: 10.83vh;
      color: #f5f5f5ff;
      position: relative;
      z-index: 1;
      padding-top: 22rpx;
      swiper-item {
        .swipeImage {
          margin-left: 24rpx;
          height: 100%;
          width: 93.6vw;
          border-radius: 12rpx;
        }
      }

      .inner-image {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 132rpx;
        height: 30.88rpx;
        transform: translate(-50%, -50%);
      }
    }

    .barrage-area {
      width: 100%;
      display: flex;
      flex-direction: row;
      white-space: pre;
      margin-top: 10rpx;
      .barrage {
        font-size: 24rpx;
        display: inline-block;
        border-radius: 24rpx;
        padding: 6rpx 12rpx;
        background-color: rgba(245, 245, 245, 0.6);
        margin-left: 34rpx;
        margin-top: 12rpx;
        opacity: 0.5;
        animation: move 15s linear infinite;
        /*持续时间   就是动画运行时间*/
      }

      @keyframes move {
        0% {
          transform: translate(750rpx, 0);
        }

        50% {
          transform: translate(100rpx, 0);
        }

        100% {
          transform: translate(-750rpx, 0);
        }
      }
    }

    .play-city-area {
      display: flex;
      box-sizing: border-box;
      width: calc(100% - 48rpx);
      margin: 0 auto;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      position: relative;
      border: 1px solid #ffffffff;

      &.single,
      &.position,
      &.null {
        flex-direction: column;
        height: 308rpx;
        padding: 18rpx 24rpx 24rpx;
        background: linear-gradient(180deg, #ffe9e8 0%, #ffffff 34%);

        .top-area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50rpx;

          .title {
            font-size: 30rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #111111ff;
            margin-top: 18rpx;

            .inner-hot {
              width: 126rpx;
              height: 32rpx;
              text-align: center;
              line-height: 28rpx;
              display: inline-block;
              margin-left: 16rpx;
              background: linear-gradient(95deg, #ff7a00 0%, #fd2e2e 100%);
              border-radius: 0 16rpx 16rpx 16rpx;
              box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(248, 104, 63, 0.34);
              background-size: 100% 100%;
              font-size: 20rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
            }
          }

          .all-right {
            width: 200rpx;
            position: absolute;
            //  margin-top: 23rpx;
            top: 0rpx;
            right: 0rpx;
            padding-top: 20rpx;
            padding-right: 20rpx;
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba6;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;

            .right-icon {
              width: 12rpx;
              height: 20rpx;
              margin-left: 4rpx;
            }
          }
        }

        .bottom-area {
          width: 100%;
          margin-bottom: 36rpx;
          height: 288rpx;

          .inner-bottom-area {
            display: flex;
          }
        }
      }

      &.multiple {
        justify-content: space-between;

        > div {
          width: 46%;
          border-radius: 20rpx;
          padding: 18rpx 10rpx 12rpx 10rpx;

          .now-rap {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .top-area {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
              width: 100%;
              font-size: 28rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 600;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0;

              .inner-hot {
                display: flex;
                align-items: center;

                p {
                }
              }
            }

            .all-right {
              font-size: 24rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #969ba6;
              margin-left: 4rpx;

              .right-icon {
                width: 12rpx;
                height: 20rpx;
                vertical-align: initial;
              }
            }
          }

          &.my-zj {
            background: linear-gradient(180deg, #3c3c3c 0%, #1f1f1f 100%);

            .title {
              color: #ffffff;
              padding: 0 8rpx;

              .inner-hot {
                p {
                  font-size: 22rpx;
                  font-family: PingFang SC-Medium, PingFang SC;
                  font-weight: 400;
                  color: #ffffff;
                }
              }
            }

            .text-area {
              background: linear-gradient(
                134deg,
                rgba(255, 255, 255, 0.2) 0%,
                rgba(255, 255, 255, 0) 100%
              );
              border-radius: 12rpx;
              padding: 14rpx 12rpx;
              margin-bottom: 12rpx;

              .tit {
                font-size: 24rpx;
                font-weight: 400;
                color: #ffffff;
                display: flex;
                align-items: center;
                margin-bottom: 8rpx;

                image {
                  width: 30rpx;
                  height: 30rpx;
                  margin-right: 12rpx;
                }

                img {
                  width: 30rpx;
                  height: 30rpx;
                  margin-right: 12rpx;
                }
              }

              .progress {
                width: 100%;
                height: 44rpx;
                background: linear-gradient(
                  270deg,
                  rgba(255, 255, 255, 0.2) 0%,
                  #ffffff 100%
                );
                border-radius: 90rpx;
                border: 1rpx solid
                  linear-gradient(
                    180deg,
                    rgba(255, 255, 255, 1),
                    rgba(255, 255, 255, 0.14)
                  )
                  1 1;
                position: relative;
                display: flex;
                align-items: center;
                margin-bottom: 14rpx;

                .line {
                  width: 104rpx;
                  height: 44rpx;
                  border: 1rpx solid #f4883a;
                  border-radius: 90rpx;
                  background: linear-gradient(
                    270deg,
                    #f4883a 0%,
                    rgba(187, 95, 44, 0.8) 100%
                  );
                  position: absolute;
                  left: 0;
                  top: 0;
                }

                .imgs {
                  position: relative;
                  width: 100%;
                  opacity: 0.5;
                  margin-top: 2rpx;
                  @include hor;

                  image {
                    width: 40rpx;
                    height: 40rpx;
                    border-radius: 50%;
                    border: 2rpx solid #ffffff;
                    box-sizing: border-box;
                  }
                }

                p {
                  font-size: 22rpx;
                  color: #ffffff;
                  margin-left: 18rpx;
                  position: absolute;
                }

                &.success {
                  .line {
                    width: 100%;
                    background: linear-gradient(
                      270deg,
                      #36e467 0%,
                      rgba(23, 134, 54, 0.8) 100%
                    );
                    border: 1rpx solid #36e467;
                  }

                  p {
                    right: 18rpx;
                  }
                }
              }

              .time {
                font-size: 20rpx;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.6);
                text-align: center;

                span {
                  font-size: 22rpx;
                  font-weight: 600;
                  color: #f4883a;
                  vertical-align: initial;
                }

                &.success {
                  span {
                    color: #36e467;
                  }
                }
              }
            }

            .main-area {
              display: flex;
              align-items: center;
              height: 96rpx;
              background: #ffffff;
              border-radius: 12rpx;

              .avatar-one {
                width: 72rpx;
                height: 96rpx;
                border-radius: 12rpx;
              }

              .main-right {
                margin-left: 12rpx;

                .name {
                  font-size: 24rpx;
                  font-weight: 600;
                  color: #2e323e;
                  line-height: 28rpx;
                }

                .type {
                  font-size: 20rpx;
                  font-weight: 400;
                  color: #2e323e;
                }
                .type-area {
                  margin-right: 6rpx;
                  font-size: 20rpx;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: rgba(46, 50, 54, 0.6);
                  line-height: 23rpx;
                }
              }
            }
          }

          &.tc-zj {
            background: linear-gradient(180deg, #ffe9e8 0%, #ffffff 34%);

            .title {
              color: #2e323e;
              padding: 0 8rpx;

              .inner-hot {
                p {
                  text-align: center;
                  display: inline-block;
                  background: linear-gradient(95deg, #ff7a00 0%, #fd2e2e 100%);
                  border-radius: 0 16rpx 16rpx 16rpx;
                  box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(248, 104, 63, 0.34);
                  background-size: 100% 100%;
                  font-size: 22rpx;
                  font-family: PingFang SC-Medium, PingFang SC;
                  font-weight: 400;
                  color: #ffffff;
                  padding: 4rpx 6rpx;
                }
              }
            }

            .main-area {
              display: flex;
              align-items: center;
              margin-bottom: 12rpx;

              .avatar-one {
                width: 96rpx;
                height: 128rpx;
                border-radius: 12rpx;
                position: relative;
              }
              .avatar-img {
                position: absolute;
                left: 2rpx;
                top: 2rpx;
                width: 60rpx;
                height: 32rpx;
                border-radius: 0;
              }
              .main-right {
                margin-left: 18rpx;

                .name {
                  font-size: 28rpx;
                  font-weight: 600;
                  color: #2e323e;
                  line-height: 33rpx;
                  margin-bottom: 10rpx;
                }

                .type {
                  font-size: 24rpx;
                  font-weight: 400;
                  color: #959aa5;
                  line-height: 28rpx;
                  margin-bottom: 10rpx;
                  display: flex;
                  flex-wrap: nowrap; /* 防止子元素换行 */
                  align-items: center; /* 垂直居中对齐 */
                }
                .typetext {
                  margin-right: 8rpx !important; /* 在元素间添加一些右边距 */
                }

                .typetext:last-child {
                  margin-right: 0; /* 最后一个元素不需要右边距 */
                }

                .typetext span {
                  white-space: nowrap; /* 防止文本内容在span内换行 */
                }
                .price {
                  font-size: 24rpx;
                  font-weight: 400;
                  color: #959aa5;
                  line-height: 28rpx;
                }
              }
            }

            .text-area {
              background: #f5f6f8;
              border-radius: 12rpx;
              padding: 18rpx 12rpx;

              .tit {
                font-size: 24rpx;
                font-weight: 400;
                color: #5f6572;
                display: flex;
                align-items: center;
                margin-bottom: 8rpx;

                image {
                  width: 30rpx;
                  height: 30rpx;
                  margin-right: 12rpx;
                }

                .imgs {
                  position: relative;
                  width: 72rpx;
                  height: 32rpx;
                  overflow: hidden;
                  margin-right: 8rpx;

                  image {
                    width: 32rpx;
                    height: 32rpx;
                    border-radius: 50%;
                    border: 2rpx solid #ffffff;
                    position: absolute;
                    left: 0;
                    margin-left: 10rpx;
                    margin-right: 0;
                    @for $i from 1 through 99 {
                      &:nth-child(#{$i}) {
                        margin-left: #{($i - 1) * 10}rpx;
                      }
                    }
                  }
                }

                .p {
                  display: flex;

                  span {
                    display: flex;
                    font-size: 22rpx;
                    color: #2e323e;
                    margin-left: 8rpx;

                    em {
                      font-size: 22rpx;
                      color: #fd2e2e;
                    }
                  }
                }
              }

              .time {
                font-size: 20rpx;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.6);
                line-height: 23rpx;
                text-align: center;
                letter-spacing: 0.6px;

                span {
                  font-size: 22rpx;
                  font-weight: 600;
                  color: #f4883a;
                  vertical-align: initial;
                }
              }
            }
          }
        }
      }

      .bottom-area-max {
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        line-height: 30rpx;
        position: absolute;
        margin-top: 132rpx;
        margin-right: 120rpx;
        margin-left: 130rpx;
      }

      .bottom-area-min {
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        line-height: 30rpx;
        position: absolute;
        margin-top: 112rpx;
        // margin-right: 204rpx;
        margin-left: 200rpx;
      }

      /deep/ .van-button {
        display: flex;
        /* 创建一个 flex 容器 */
        justify-content: center;
        /* 居中主轴中的内容（水平方向） */
        align-items: center;
        /* 居中交叉轴上的内容（垂直方向）*/
        font-size: 22rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #111111;
        line-height: 28rpx;
        //width: 154rpx;
        height: 58rpx;
        background: #36e4bb;
        border-radius: 44rpx 44rpx 44rpx 44rpx;
        margin-top: 16rpx;
      }

      .my-swipe-y {
        margin-top: 18rpx;
        height: 308rpx;
        .swiperItem {
          height: 308rpx;
        }
      }

      .bottom-area {
        width: 100%;
        .inner-bottom-area {
          width: 100%;
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          height: 188rpx;

          .avatar-one {
            width: 132rpx;
            height: 188rpx;
            border-radius: 12rpx;
            position: relative;
            display: block;
            display: flex;
          }

          .avatar-img {
            position: absolute;
            left: 64rpx;
            top: 8rpx;
            width: 60rpx;
            height: 32rpx;
          }

          .right-text-area {
            width: calc(100% - 152rpx);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 20rpx;

            .name-status {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 24rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              .name {
                color: #2e323e;
                font-size: 34rpx;
                font-family: PingFang SC-Semibold, PingFang SC;
                font-weight: 600;
              }
            }

            .person-area {
              display: flex;

              .pic-overlap-area {
                display: flex;
                flex-direction: row;

                .avatar {
                  width: 32rpx;
                  height: 32rpx;
                  border-radius: 50%;
                  border: 2px solid #ffffff;
                  margin-right: -18rpx;
                }
              }

              .person-right-text {
                margin-left: 30rpx;

                .sub {
                  font-size: 24rpx;
                  margin-left: 8rpx;
                  font-family: PingFang SC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #ff7a00;
                }
              }
            }

            .time {
              display: flex;
            }

            .price {
              display: flex;
            }
          }
        }
      }
    }

    .hot-new-area {
      width: calc(100% - 48rpx);
      margin-left: 24rpx;
      height: 384rpx;
      box-sizing: border-box;
      margin-top: 18rpx;
      background: #ffffff;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      padding: 18rpx 18rpx 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .recommend-list {
        width: 100%;
        height: 72rpx;
        display: flex;
        align-items: center;
        // position: relative;

        .recommend-item {
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          margin-right: 36rpx;
        }

        .active-recommend-item {
          font-size: 30rpx;
          font-weight: 500;
          color: #2e323e;
        }

        .all-right-city {
          position: absolute;
          right: 0rpx;
          top: 0rpx;
          padding-top: 30rpx;
          padding-right: 18rpx;
          width: 200rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #969ba6;
          display: flex;
          align-items: center;
          flex-direction: row-reverse;

          .right-icon-city {
            width: 12rpx;
            height: 20rpx;
            margin-left: 4rpx;
          }
        }
      }

      .scroll-x {
        width: 100%;

        .playText-list {
          width: 100%;
          height: 258rpx;
          display: flex;
          flex-direction: row;

          &::-webkit-scrollbar {
            display: none;
          }

          .playText-item {
            width: 156rpx;
            height: 258rpx;
            margin-right: 12rpx;
            position: relative;
            display: flex;
            flex-direction: column;

            .cover {
              width: 156rpx;
              height: 208rpx;
              border-radius: 12rpx;
            }

            .coverno {
              width: 156rpx;
              height: 208rpx;
              border-radius: 12rpx;
              background: #f5f5f5ff;
              position: relative;
            }

            .coverno-bottom {
              width: 156rpx;
              height: 48rpx;
              background: linear-gradient(
                360deg,
                rgba(0, 0, 0, 0.6) 0%,
                rgba(9, 9, 9, 0) 100%
              );
              position: absolute;
              border-radius: 0 0 12rpx 12rpx;
              bottom: 20%;
              // left: 50%;
            }

            .coverno-img {
              position: absolute;
              top: 40%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 108.81rpx;
              height: 25.45rpx;
            }

            .coverNone {
              width: 156rpx;
              height: 208rpx;
              position: relative;

              .couverNone-img {
                border-radius: 12rpx;
                font-size: 24rpx;
              }
            }

            .coverNone::after {
              content: "";
              position: absolute;
              border-radius: 12rpx;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background-color: rgba(0, 0, 0, 0.7);
            }

            .coverNone-text {
              position: absolute;
              font-size: 24rpx;
              color: #ffffff;
              left: 50%;
              margin-top: 10rpx;
              transform: translate(-50%, -50%);
              z-index: 1;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              line-height: 28rpx;
              letter-spacing: 3px;
            }

            .coverNone-text-look {
              bottom: 50%;
            }

            .coverNone-text-all {
              top: 50%;
            }

            .couverImg {
              position: absolute;
              left: 88rpx;
              top: 8rpx;
              width: 60rpx;
              height: 32rpx;
            }

            .score {
              width: 100%;
              height: 48rpx;
              text-indent: 12rpx;
              line-height: 48rpx;
              background: linear-gradient(
                360deg,
                rgba(0, 0, 0, 0.8) 0%,
                rgba(9, 9, 9, 0) 100%
              );
              position: absolute;
              top: 160rpx;
              left: 0;
              font-size: 22rpx;
              font-family: OPPOSans-Heavy, OPPOSans;
              font-weight: 800;
              color: #ffffff;
              border-radius: 12rpx;
            }

            .name {
              font-size: 24rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #2e323e;
              line-height: 28rpx;
              margin-top: 16rpx;
            }
          }
        }
      }

      .scroll-views {
        width: 126rpx;
        height: 8rpx;
        background: #d2d2d2;
        border-radius: 12rpx;
        opacity: 0.5;
        margin-top: 20rpx;

        .scroll-box {
          width: 20rpx;
          height: 8rpx;
          background: #36e4bb;
          border-radius: 12rpx;
        }
      }
    }

    .trends-area {
      background: #f5f6f8;
      width: 100%;
    }

    .title, .dymaicTitle {
      display: flex;
      justify-content: space-between;
      //position: sticky;
      //z-index: 10;
      padding-bottom: 18rpx;
      align-items: center;
      .title-discover {
        font-size: 30rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        text-align: left;
      }
      .all-right {
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        .right-text {
          margin-right: 4rpx;
          font-size: 24rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #969aa4;
          line-height: 28rpx;
        }
        .right-icon {
          margin-right: 24rpx;
          width: 12rpx;
          height: 20rpx;
        }
      }
    }
    .dymaicTitle{
      padding: 44rpx 0px 24rpx 24rpx;
      background: #f5f6f8;
    }

    .masonry {
      display: flex;
      justify-content: space-between;
      padding: 32rpx 24rpx;
      padding-top: 0;
    }

    .col {
      width: 342rpx;
      height: 100%;

      .default-box {
        margin: 18rpx 0 66rpx 18rpx;

        width: 304rpx;
        height: 164rpx;
        position: relative;
        display: flex;
        flex-direction: column;

        // background-color: red;
        p {
          font-size: 28rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #2e323e;
          line-height: 33rpx;
          margin-bottom: 18rpx;
        }

        .vipRec {
          display: flex;
          justify-content: space-between;
          // margin-top: 18rpx;

          .kzanfont {
            width: 100%;
            margin-left: 30rpx;
            position: absolute;
            bottom: 34rpx;
            right: 0rpx;
            font-size: 22rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #939393;
            line-height: 26rpx;
            display: flex;
            // flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .avatarvip {
              width: 30rpx;
              height: 30rpx;
              border-radius: 50%;
              border: 2px solid #ffffff;
            }

            .viprectext {
              font-size: 22rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #969ba6;
              line-height: 26rpx;
            }

            .kzan {
              width: 28rpx;
              height: 28rpx;
              padding: 10rpx;
              transition: opacity 0.5s ease-in-out;

              &:active {
                opacity: 0.9;
              }
            }
          }
        }

        .font-hidden {
          word-break: break-word; //换行模式
          overflow: hidden;
          text-overflow: ellipsis; //修剪文字，超过2行显示省略号
          display: -webkit-box;
          -webkit-line-clamp: 2; //此处为上限行数
          -webkit-box-orient: vertical;
        }
      }
    }

    .default-pic {
      width: 100%;
      height: 376rpx;
      border-radius: 12rpx 12rpx 0 0;
    }

    .box {
      height: 540rpx;
      // overflow: auto;
      background: #fff;
      border-radius: 12rpx;
      margin-bottom: 18rpx;
      position: relative;

      .default-son {
        width: 60rpx;
        height: 32rpx;
        position: absolute;
        left: 16rpx;
        top: 16rpx;
      }
    }

    .second-column-top-box {
      height: 630rpx;
      width: 342rpx;
      background-color: #ffffffff;
      margin-bottom: 18rpx;
      border-radius: 12rpx;

      .sort-pic {
        width: 342rpx;
        height: 212rpx;
        position: absolute;
        top: 0;
        left: 0;
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
          color: #f83131ff;
        }

        .Rankings:nth-child(2) span {
          color: #ff7a00ff;
        }

        .Rankings:nth-child(3) span {
          color: #d27e1bff;
        }

        .Rankings:nth-child(n + 4):nth-child(-n + 10) span {
          color: #2e323eff;
        }
      }
    }
  }
}
.ranking-main {
  position: absolute;
  left: 0px;
  right: 0px;
  padding-bottom: calc((env(safe-area-inset-bottom) + 50px));
}
.drama-review-main {
  background: #ffffff;
  padding-bottom: calc((env(safe-area-inset-bottom) + 50px));
}
</style>
