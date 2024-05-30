<template>
  <div class="commit-page">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('bgtp')" mode="widthFix" />
    </div>
    <view class="nav-bg" :style="[navBg]"></view>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000"
            size="50rpx"
          />
        </view>
      </view>
      <view slot="content"></view>
    </navigation-bar>
    <div
      class="user-btn"
      :style="{
        position: 'sticky',
        top: statusBarHeight + navbarHeight + 10 + 'px',
      }"
    >
      <div class="user">
        <img class="avatar" :src="dramaCover" alt mode="aspectFill"/>
        <span>{{dramaName}}</span>
      </div>
      <div class="savedraft" @click="showCustomModal" v-if="edit == null">
        <span>存草稿</span>
      </div>
      <div
        class="submit"
        @click="addBefore"
        :disabled="isSubmitDisabled"
        v-if="edit == null"
      >
        <span>发布</span>
      </div>
      <div
          class="submit"
          @click="addBefore"
          :disabled="isSubmitDisabled"
          v-if="edit == 2"
      >
        <span>修改</span>
      </div>
    </div>
    <header class="commit-header">
      <ul class="commit-list">
        <li
          class="commit-item"
          @click="toggleActive(item, index)"
          :class="{ 'active-commit': activeIndex === index }"
          v-for="(item, index) in commitList"
          :key="index"
        >
          <img
            :src="activeIndex === index ? item.activeImgUrl : item.imgUrl"
            alt
          />
          <span class="name">{{ item.label }}</span>
        </li>
      </ul>
      <ul class="score-list">
        <li class="score-item">
          <span class="name">{{ queryDramaDictList[0].dictValue }}</span>
          <!--       v-model="themefirst" -->
          <van-rate
            :value="themefirst"
            :icon="$iconFont.getIconName('full-star')"
            :void-icon="$iconFont.getIconName('none-star')"
            allow-half
            @change="onChangefirst"
          />
          <p class="score">
            {{ scoreFirst }}分
            <span v-if="scoreFirst >= 9">超赞！</span>
          </p>
          <!-- <span class="score">{{scoreFirst}}分</span> -->
        </li>
        <li class="score-item">
          <span class="name">{{ queryDramaDictList[1].dictValue }}</span>
          <van-rate
            :value="themesecond"
            :icon="$iconFont.getIconName('full-star')"
            :void-icon="$iconFont.getIconName('none-star')"
            allow-half
            @change="onChangesecond"
          />
          <p class="score">
            {{ scoreSecond }}分
            <span v-if="scoreSecond >= 9">超赞！</span>
          </p>
        </li>
        <li class="score-item">
          <span class="name">{{ queryDramaDictList[2].dictValue }}</span>
          <van-rate
            :value="themethird"
            :icon="$iconFont.getIconName('full-star')"
            :void-icon="$iconFont.getIconName('none-star')"
            allow-half
            @change="onChangethird"
          />
          <p class="score">
            {{ scoreThird }}分
            <span v-if="scoreThird >= 9">超赞！</span>
          </p>
        </li>
      </ul>
    </header>
    <main class="commit-main">
      <ul class="status">
        <li
          class="status-item"
          :class="{ 'active-status': isActive(item.content) }"
          v-for="item in status"
          :key="item.content"
          @click="handleStatus(item.content)"
        >
          {{ item.content }}
        </li>
      </ul>
      <section class="commit-ctx">
        <div v-if="isActive('剧本情节')">
          <van-field
            :label="'剧本情节' + ':'"
            v-model="plot"
            @change="onInputChange('剧本情节', $event.detail, 'plot')"
            rows="2"
            autosize
            type="textarea"
            label-class="label-style"
          />
        </div>
        <div v-if="isActive('剧情故事')">
          <van-field
            :label="'剧情故事' + ':'"
            v-model="story"
            @change="onInputChange('剧情故事', $event.detail, 'story')"
            rows="2"
            autosize
            type="textarea"
            label-class="label-style"
          />
        </div>
        <div v-if="isActive('剧本内容')">
          <van-field
            :label="'剧本内容' + ':'"
            v-model="substance"
            @change="onInputChange('剧本内容', $event.detail, 'substance')"
            rows="2"
            autosize
            type="textarea"
            label-class="label-style"
          />
        </div>
        <div v-if="isActive('剧本演绎')">
          <van-field
            :label="'剧本演绎' + ':'"
            v-model="deduce"
            @change="onInputChange('剧本演绎', $event.detail, 'deduce')"
            rows="2"
            autosize
            type="textarea"
            label-class="label-style"
          />
        </div>
        <div>
          <van-field
            v-model="messageonce"
            @change="onInputChange('messageonce', $event.detail, 'messageonce')"
            rows="5"
            autosize
            type="textarea"
            input-class="textarea"
            :maxlength="5000"
            show-word-limit
          />
        </div>
      </section>
      <section>
        <!-- 图片上传组件 -->
        <van-uploader
          :file-list="fileList"
          @after-read="afterRead"
          @max-count="maxCount"
          multiple
          @deletable="true"
          @delete="onDelete"
          :show-upload="showUpload"
        />
      </section>
      <section class="other-tools">
        <div
          class="tool"
          v-for="item in tools"
          :key="item.id"
          @click="handleTool(item.rid)"
        >
          <div class="top-info">
            <img class="icon1" :src="item.imge" alt />
            <span class="title">{{ $filters.truncateText(item.name,6) }}</span>
            <img
              class="right-icon"
              :src="$iconFont.getIconName('arrowright')"
            />
          </div>
          <p class="intro">{{ item.message }}</p>
        </div>
      </section>
    </main>
    <van-overlay
      :z-index="100003"
      custom-style="background-color: rgba(98, 99, 100, 0.6) !important;"
      :show="showDialog"
    >
      <div class="wrapper" @click.stop>
        <add-role
          @addRoleName="handleAddRoleName"
          @close="closeChildComponent"
        ></add-role>
      </div>
    </van-overlay>
    <van-overlay
      :z-index="100002"
      custom-style="background-color: rgba(98, 99, 100, 0.6) !important;"
      :show="experienceRole"
      @click="experienceRole = false"
    >
      <div class="experience-role" @click.stop>
        <select-experience
          @closeExperienceRole="closeExperienceRole"
          @onPlusClick="handlePlusClick"
          @selectedRoles="handleSelectedRoles"
          :dramaId="dramaId"
        ></select-experience>
      </div>
    </van-overlay>
    <!-- 店铺选择弹窗 -->
    <van-popup
      :show="showShop"
      closeable
      round
      @click-overlay="showShop = false"
      @close="closePopup"
      close-on-click-overlay
      close-icon="close"
      position="bottom"
      :style="{ height: '75vh' }"
    >
      <block v-if="currentPopupType === 'chooseShop'">
        <div class="popup-header">
          <div class="header-title">选择玩本店铺</div>
          <div class="header-box">
            <div class="header-city" @click="userChooseCityNavigator(false)">
              <p>{{cityInfo.city}}</p>
              <van-icon name="arrow-down"/>
            </div>
            <div class="header-search">
              <!--              v-model="shopSearchValue" -->
              <van-search  placeholder="搜索店铺" @search="handleSearchChange" />
            </div>
          </div>
        </div>

        <scroll-view
          class="shop-content"
          style="height: 100%"
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
                <div class="shop-name">{{ $filters.truncateText(i.storeName,7) }}</div>
                <div class="shop-address">
                  {{ formatDistance(i.distance) }}{{ i.address }}
                </div>
              </div>
              <div class="shop-radio" @click="changeShopRadio(i, _)">
                <div class="radio-group">
                  <image
                    v-if="i.activeGroup"
                    class="radio"
                    :src="$iconFont.getIconName('selected-icon')"
                  />
                </div>
              </div>
            </div>
            <notcData v-if="!queryStoreDramaList.length" position="absolute" note="暂无门店" noteImg="storeName"/>
          </div>
        </scroll-view>
      </block>
      <block v-if="currentPopupType === 'dmEvaluate'">
        <div class="popup-header">
          <div class="header-title evaluate">本次DM带本体验如何?</div>
          <div class="header-subtitle">
            分享你的玩本体验，为优秀的DM加油打气
          </div>
        </div>
          <div class="rate-content" >
            <div class="rate-content-no" v-if="queryStoreUserPageList.length == 0">
              该店铺暂无DM~
            </div>
            <scroll-view scroll-x="true" class="scroll-x">
              <ul class="playText-list">
                <li
                    class="playText-item"
                    v-for="(item, index) in queryStoreUserPageList"
                    :key="item.id"
                    :style="{'margin-left': index === 0 ? '30px':''}"
                >
                  <image class="cover" :src="item.avatar" mode="aspectFill" />
                  <span class="name" v-if="item.userName"
                  >{{ $filters.truncateText(item.userName, 4) }}
                </span>
                  <span class="name" v-if="item.userName == null">剧游用户 </span>
                  <img
                      class="select-icon"
                      :src="
                    selectedDM[index] ? selectedIconPath : unselectedIconPath
                  "
                      @click="toggleSelectDM(item, index)"
                  />
                </li>
              </ul>
            </scroll-view>
            <section v-if="hasSelectedDM">
              <div class="rate-list" v-for="(i, _) in dmRateList" :key="_">
                <span class="name">{{ i.name }}</span>
                <van-rate
                    :value="i.rateValue"
                    allow-half
                    :size="20"
                    color="#FE5C35FF"
                    void-icon="star"
                    void-color="#CECECEFF"
                    @change="onChangeDmRate($event, _)"
                />
                <p v-if="i.score !== 0" class="score">
                  {{ i.score }}分
                  <span v-if="i.score >= 9">超赞！</span>
                </p>
              </div>
            </section>
          </div>


      </block>
      <block v-if="currentPopupType === 'shopEvaluate'">
        <div class="popup-header">
          <div class="header-title evaluate">本次在该店的体验如何?</div>
          <div class="header-subtitle">分享你的店铺体验，帮助更多玩家选店</div>
        </div>
        <div class="rate-content">
          <div class="rate-list" v-for="(i, _) in shopRateList" :key="_">
            <span class="name">{{ i.name }}</span>
            <van-rate
              v-model="i.rateValue"
              allow-half
              :size="20"
              color="#FE5C35FF"
              void-icon="star"
              void-color="#CECECEFF"
              @change="onChangeShopRate(i, $event, _)"
            />
            <p v-if="i.score !== 0" class="score">
              {{ i.score }}分
              <span v-if="i.score >= 9">超赞！</span>
            </p>
          </div>
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
import addRole from "../components/addRole.vue";
import SelectExperience from "../components/selectExperience.vue";
import service from "../utils/service.js";
import { uploadMultipleFiles } from "@/utils";
import notcData from "@/components/notc-data/index.vue";
import {
  userChooseCityNavigator,
} from "@/utils/navigator.js"
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
  components: { navigationBar, addRole, SelectExperience, notcData },
  data() {
    return {
      evaluateId:null,
      edit:null,
      roleId:null,
      showUpload: true,
      userInfoMessage:null,
      cityInfo:uni.getStorageSync("cityInfo"),
      otherRoleName:null,
      userNameDM: null,
      deduceScoremock: 0,
      professionalScoremock: 0,
      deduceScore: 0,
      dmServiceScore: 0,
      professionalScore: 0,
      dmId:null,
      dmNickname:null,
      dmIdmock: null,
      userIdmock: null,
      selectedDM: [],
      selectedIconPath: this.$iconFont.getIconName("selectgou"),
      unselectedIconPath: this.$iconFont.getIconName("circlepingjia"),
      themefirst: "",
      themesecond: "",
      themethird: "",
      queryDraftsSecondList: {},
      queryStoreUserPageList: [],
      queryTotal:1,
      summarizeEvaluate: null,
      triggered: false,
      serviceScore: 0,
      serviceDMmock:null,
      environmentScore: 0,
      dmScore: 0,
      storeIdmock: null,
      storeId: null,
      storename: "",
      pageNo: 1,
      isSubmitDisabled: true,
      queryStoreDramaList: [],
      plot: "",
      story: "",
      substance: "",
      deduce: "",
      dramaEvaluateType: "",
      firList: [],
      remainingCharacters: 5000, // 总字符数限制
      scoreFirst: 0,
      fileList: [],
      fileListmock:[],
      scoreSecond: 0,
      scoreThird: 0,
      messageonce: "",
      queryDramaDictList: [],
      parentRoleName: "", // 用于保存子组件传递的 roleName 值
      first: "情感",
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
        bgBackground:
          "linear-gradient(357deg, rgba(28, 184, 90, 0) 0%, rgba(220, 232, 255, 0.41) 100%)",
      },
      commitList: [
        {
          imgUrl: this.$iconFont.getIconName("no"),
          activeImgUrl: this.$iconFont.getIconName("no-active"),
          label: "不行",
        },
        {
          imgUrl: this.$iconFont.getIconName("generally"),
          activeImgUrl: this.$iconFont.getIconName("generally-active"),
          label: "一般",
        },
        {
          imgUrl: this.$iconFont.getIconName("recommend"),
          activeImgUrl: this.$iconFont.getIconName("recommend-active.png"),
          label: "推荐",
        },
      ],
      activeIndex: null,
      activeStatus: [],
      status: [
        { content: "剧本情节" },
        { content: "剧情故事" },
        { content: "剧本内容" },
        { content: "剧本演绎" },
      ],
      //   status: ["剧本情节", "剧情故事", "剧本内容", "剧本演绎"],
      tools: [
        {
          id: 1,
          name: "体验角色",
          message: "选择您体验的剧本角色",
          rid: 1,
          imge: this.$iconFont.getIconName("charter"),
          selimge: this.$iconFont.getIconName("selectcharter"),
        },
        {
          id: 2,
          name: "关联店铺",
          message: "选择关联您本次打本店铺",
          rid: 2,
          imge: this.$iconFont.getIconName("avater"),
          selimge: this.$iconFont.getIconName("selectavater"),
        },
        {
          id: 3,
          name: "DM评价",
          message: "请对本次剧本DM评价",
          rid: 3,
          imge: this.$iconFont.getIconName("houseing"),
          selimge: this.$iconFont.getIconName("selecthouseing"),
        },
        {
          id: 4,
          name: "店铺评分",
          message: "对本次打本店铺进行评价",
          rid: 4,
          imge: this.$iconFont.getIconName("staring"),
          selimge: this.$iconFont.getIconName("selectstaring"),
        },
      ],
      showDialog: false,
      experienceRole: false,
      maxCount: 6, // 最多上传6张图片
      maxSize: 10 * 1024 * 1024, // 单个文件最大10MB
      statusBarHeight: systemInfo.statusBarHeight,
      navBg: { opacity: 0 },
      scrollTop: 0,
      queryDramaRoleOtherList: [],
      showShop: false,
      shopSearchValue: null,
      dramaId:null,
      dramaCover:null,
      dramaName:null,
      shopList: [
        {
          imgUrl: this.$iconFont.getIconName("fabubutton"),
          name: "沉浸式剧本杀店",
          distance: "3.6",
          address: "苏绣路苏州中心·星悦汇商场2楼209-210号",
        },
        {
          imgUrl: this.$iconFont.getIconName("fabubutton"),
          name: "沉浸式剧本杀店",
          distance: "3.6",
          address: "苏绣路苏州中心·星悦汇商场2楼209-210号",
        },
        {
          imgUrl: this.$iconFont.getIconName("fabubutton"),
          name: "沉浸式剧本杀店",
          distance: "3.6",
          address: "苏绣路苏州中心·星悦汇商场2楼209-210号",
        },
        {
          imgUrl: this.$iconFont.getIconName("fabubutton"),
          name: "沉浸式剧本杀店",
          distance: "3.6",
          address: "苏绣路苏州中心·星悦汇商场2楼209-210号",
        },
        {
          imgUrl: this.$iconFont.getIconName("fabubutton"),
          name: "沉浸式剧本杀店",
          distance: "3.6",
          address: "苏绣路苏州中心·星悦汇商场2楼209-210号",
        },
      ],
      currentPopupType: "",
      dmRateList: [
        { name: "专业", rateValue: 0, score: 0 },
        { name: "演绎", rateValue: 0, score: 0 },
        { name: "服务", rateValue: 0, score: 0 },
      ],
      shopRateList: [
        { name: "环境", rateValue: 0, score: 0 },
        { name: "服务", rateValue: 0, score: 0 },
        { name: "D M", rateValue: 0, score: 0 },
      ],
      canSubmit: true
    };
  },
  watch: {
    scrollTop(newValue, oldValue) {
      let top = newValue;
      this.navBg = {
        opacity: top > this.navbarHeight ? 1 : top * 0.01,
        height: this.statusBarHeight + this.navbarHeight * 2 + "px",
      };
    },
  },
  computed: {
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44;
      // #endif
      // #ifdef MP
      return systemInfo.platform == "ios" ? 44 : 48;
      // #endif
    },
    hasSelectedDM() {
      // 判断是否至少有一个图片被选中
      return this.selectedDM.some((selected) => selected);
    },
  },
  async onLoad() {
    let options = uni.getStorageSync('editDrama');
    this.dramaId = options.dramaId;
    this.dramaCover = options.dramaCover;
    this.dramaName = options.dramaName;
    this.activeIndex = options.activeIndex;

    if (this.activeIndex == 0) {
      this.dramaEvaluateType = "NOT_GOOD";
    } else if (this.activeIndex == 1) {
      this.dramaEvaluateType = "SO_SO";
    } else if (this.activeIndex == 2) {
      this.dramaEvaluateType = "RECOMMEND";
    }

    await this.queryDramaDict();
    await this.queryDraftsSecond();

    if (options.edit == 2) {
      this.edit = options.edit;
      this.evaluateId = options.evaluateId;
      await this.getDramaEvaluateComment(options.evaluateId)
    }
    uni.removeStorageSync('editDrama')
  },
  async onShow() {
    if (uni.getStorageSync('temporaryCity')) {
      this.cityInfo = uni.getStorageSync('temporaryCity');
      uni.removeStorageSync('temporaryCity');
      this.pageNo = 1;
      await this.queryStoreDrama();
    }

    this.userInfoMessage = await this.$checkLogin.getUserInfo();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    async getDramaEvaluateComment(evaluateId) {
      try {
        let data = await service.queryDramaEvaluateComment({
          dramaId: this.dramaId,
          evaluateId: evaluateId,
          userId: this.userInfoMessage.id,
        });
        
        if (data.dramaEvaluateItem.dramaEvaluateType === "RECOMMEND") {
          this.activeIndex = 2;
          this.dramaEvaluateType = "RECOMMEND";
        } else if (data.dramaEvaluateItem.dramaEvaluateType === "SO_SO") {
          this.activeIndex = 1;
          this.dramaEvaluateType = "SO_SO";
        } else if (data.dramaEvaluateItem.dramaEvaluateType === "NOT_GOOD") {
          this.activeIndex = 0;
          this.dramaEvaluateType = "NOT_GOOD";
        }
        this.themefirst = data.dramaEvaluateItem.scoreList[0].score / 20;
        this.themesecond = data.dramaEvaluateItem.scoreList[1].score / 20;
        this.themethird = data.dramaEvaluateItem.scoreList[2].score / 20;
        this.scoreFirst = data.dramaEvaluateItem.scoreList[0].score / 10;
        this.scoreSecond = data.dramaEvaluateItem.scoreList[1].score / 10;;
        this.scoreThird = data.dramaEvaluateItem.scoreList[2].score / 10;;
        // 使用map将链接数组转为对象数组
        if(data.dramaEvaluateItem.imageList != null){
          let transformedIssueImagesStrUrlList = data.dramaEvaluateItem.imageList.map(
              (url) => {
                return { url: url };
              }
          );
          this.fileList = transformedIssueImagesStrUrlList;
          this.fileListmock = data.dramaEvaluateItem.imageList;
          if(this.fileListmock.length >= 6){
            this.showUpload = false;
          }else {
            this.showUpload = true;
          }
        }
        if (data.dramaEvaluateItem.evaluateStringType.deduce == "" || data.dramaEvaluateItem.evaluateStringType.deduce == null) {
          const index = this.activeStatus.indexOf("剧本演绎");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧本演绎")) {
            this.deduce = data.dramaEvaluateItem.evaluateStringType.deduce;
            this.activeStatus.push("剧本演绎");
          }
        }
        if (data.dramaEvaluateItem.evaluateStringType.plot == "" || data.dramaEvaluateItem.evaluateStringType.plot == null) {
          const index = this.activeStatus.indexOf("剧本情节");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧本情节")) {
            this.plot = data.dramaEvaluateItem.evaluateStringType.plot;
            this.activeStatus.push("剧本情节");
          }
        }
        if (data.dramaEvaluateItem.evaluateStringType.story == "" || data.dramaEvaluateItem.evaluateStringType.story == null) {
          const index = this.activeStatus.indexOf("剧情故事");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧情故事")) {
            this.story = data.dramaEvaluateItem.evaluateStringType.story;
            this.activeStatus.push("剧情故事");
          }
        }
        if (data.dramaEvaluateItem.evaluateStringType.substance == "" || data.dramaEvaluateItem.evaluateStringType.substance == null) {
          const index = this.activeStatus.indexOf("剧本内容");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧本内容")) {
            this.substance = data.dramaEvaluateItem.evaluateStringType.substance;
            this.activeStatus.push("剧本内容");
          }
        }
        if (data.storeCommentResponse.storeId != null) {
          this.storeId = data.storeCommentResponse.storeId;
          this.tools[1].name = data.storeCommentResponse.storeName;
          this.tools[1].imge = this.tools[1].selimge;
        }
        if (data.dramaEvaluateItem.roleId != null) {
          this.roleId = data.dramaEvaluateItem.roleId;
          this.tools[0].name = data.dramaEvaluateItem.roleName;
          this.tools[0].imge = this.tools[0].selimge;
        }
        if (data.dramaEvaluateItem.otherRoleName != null) {
          this.otherRoleName = data.dramaEvaluateItem.otherRoleName;
          this.tools[0].name = data.dramaEvaluateItem.otherRoleName;
          this.tools[0].imge = this.tools[0].selimge;
        }
        
        if (data.dmCommentRespnse.dmId != null) {
          this.dmId = data.dmCommentRespnse.dmId;
          this.dmNickname = data.dmCommentRespnse.dmName;
          this.deduceScore = data.dmCommentRespnse.deduceScore / 10;
          this.professionalScore = data.dmCommentRespnse.professionalScore /10 ;
          this.dmServiceScore = data.dmCommentRespnse.serviceScore / 10 ;
          this.tools[2].name = data.dmCommentRespnse.dmName;
          this.tools[2].imge = this.tools[2].selimge;
          this.userId = data.dmCommentRespnse.dmUserId;
        }
        
        if (
            data.storeCommentResponse.dmScore != null &&
            data.storeCommentResponse.environmentScore != null &&
            data.storeCommentResponse.serviceScore != null
        ) {
          if(data.storeCommentResponse.dmScore !== 0 || data.storeCommentResponse.environmentScore !== 0 || data.storeCommentResponse.serviceScore !== 0){
            const averageScore =
              (data.storeCommentResponse.dmScore / 10 +
                  data.storeCommentResponse.environmentScore / 10 +
                  data.storeCommentResponse.serviceScore / 10) /
              3;
            
            this.environmentScore = data.storeCommentResponse.environmentScore / 10;
            this.serviceScore = data.storeCommentResponse.serviceScore /10 ;
            this.dmScore = data.storeCommentResponse.dmScore / 10 ;
            this.tools[3].imge = this.tools[3].selimge;
            this.tools[3].name = averageScore.toFixed(1) + "分";
            if (averageScore === 10) {
              this.summarizeEvaluate = "RECOMMEND";
            } else if (averageScore >= 7 && averageScore < 10) {
              this.summarizeEvaluate = "SO_SO";
            } else {
              this.summarizeEvaluate = "NOT_GOOD";
            }
          }
        }
        if (data.dramaEvaluateItem.content != null) {
          this.messageonce = data.dramaEvaluateItem.content;
        }
      } catch (e) {}
    },
    userChooseCityNavigator,
    formatDistance(distance) {
      // 将传入的距离转换为浮点数，然后保留一位小数
      if(uni.getStorageSync('isLocation')){
        return `距你${parseFloat(distance).toFixed(1)}km | `;
      }
      return '';
    },
    toggleSelectDM(item, index) {
      console.log("231", item.userName);
      // 如果点击的index已经被选中了，那么取消选中状态并返回
      if (this.selectedDM[index]) {
        this.$set(this.selectedDM, index, false);
        return;
      }
      // 先取消所有的选中状态
      for (let i = 0; i < this.selectedDM.length; i++) {
        this.$set(this.selectedDM, i, false);
      }
      // 然后只选中当前的图片
      this.$set(this.selectedDM, index, true);
      if ((this.selectedDM[index] = true)) {
        this.dmIdmock = item.id;
        this.storeIdmock = item.storeId;
        this.userIdmock = item.userId;
        this.userNameDM = item.userName;
      } else {
        this.dmIdmock = null;
        this.storeIdmock = null;
        this.userIdmock = null;
        this.userNameDM = null;
      }
      this.dmRateList = [
        { name: "专业", rateValue: 0, score: 0 },
        { name: "演绎", rateValue: 0, score: 0 },
        { name: "服务", rateValue: 0, score: 0 },
      ]

      this.deduceScoremock = 0;
      this.professionalScoremock = 0;
      this.serviceDMmock = 0;
    },
    //查询草稿箱
    async queryDraftsSecond() {
      try {
        let data = await service.queryDraftsSecond({
          dramaId: this.dramaId,
          id: this.userInfoMessage.id,
        });
          if (data.issueDramaEvaluateType === "RECOMMEND") {
            this.activeIndex = 2;
            this.dramaEvaluateType = "RECOMMEND";
          } else if (data.issueDramaEvaluateType === "SO_SO") {
            this.activeIndex = 1;
            this.dramaEvaluateType = "SO_SO";
          } else if (data.issueDramaEvaluateType === "NOT_GOOD") {
            this.activeIndex = 0;
            this.dramaEvaluateType = "NOT_GOOD";
          }
          this.themefirst = data.issueScore1 / 20;
          this.themesecond = data.issueScore2 / 20;
          this.themethird = data.issueScore3 / 20;
          this.scoreFirst = data.issueScore1 / 10;
          this.scoreSecond = data.issueScore2 / 10;
          this.scoreThird = data.issueScore3 / 10;

          // 使用map将链接数组转为对象数组
        if(data.issueImagesStrUrlList != null){
          let transformedIssueImagesStrUrlList = data.issueImagesStrUrlList.map(
              (url) => {
                return { url: url };
              }
          );
          this.fileList = transformedIssueImagesStrUrlList;
          this.fileListmock = data.issueImagesStrUrlList;
          if(this.fileListmock.length >= 6){
            this.showUpload = false;
          }else {
            this.showUpload = true;
          }
        }



        if (data.stringTypeDeduce == "" || data.stringTypeDeduce == null) {
          const index = this.activeStatus.indexOf("剧本演绎");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧本演绎")) {
            this.deduce = data.stringTypeDeduce;
            this.activeStatus.push("剧本演绎");
          }
        }


        if (data.stringTypePlot == "" || data.stringTypePlot == null) {
          const index = this.activeStatus.indexOf("剧本情节");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧本情节")) {
            this.plot = data.stringTypePlot;
            this.activeStatus.push("剧本情节");
          }
        }

        if (data.stringTypeStory == "" || data.stringTypeStory == null) {
          const index = this.activeStatus.indexOf("剧情故事");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧情故事")) {
            this.story = data.stringTypeStory;
            this.activeStatus.push("剧情故事");
          }
        }

        if (data.stringTypeSubstance == "" || data.stringTypeSubstance == null) {
          const index = this.activeStatus.indexOf("剧本内容");
          if (index !== -1) {
            this.activeStatus.splice(index, 1);
          }
        } else {
          if (!this.activeStatus.includes("剧本内容")) {
            this.substance = data.stringTypeSubstance;
            this.activeStatus.push("剧本内容");
          }
        }

          if (data.storeId != null) {
            this.storeId = data.storeId;
            this.tools[1].name = data.storeName;
            this.tools[1].imge = this.tools[1].selimge;
          }
          if (data.roleId != null) {
            this.roleId = data.roleId;
            this.tools[0].name = data.roleName;
            this.tools[0].imge = this.tools[0].selimge;
          }
        if (data.otherRoleName != null) {
          this.otherRoleName = data.otherRoleName;
          this.tools[0].name = data.otherRoleName;
          this.tools[0].imge = this.tools[0].selimge;
        }
          if (data.dmId != null) {
            this.dmId = data.dmId;
            this.dmNickname = data.dmNickname;
            this.deduceScore = data.dmDeduceScore / 10;
            this.professionalScore = data.dmProfessionalScore /10 ;
            this.dmServiceScore = data.dmServiceScore / 10 ;
            this.tools[2].name = data.dmNickname;
            this.tools[2].imge = this.tools[2].selimge;
            this.userId = data.dmUserId;
          }
          
          if (
            data.storeDmScore != null &&
            data.storeEnvironmentScore != null &&
            data.storeServiceScore != null
          ) {
            const averageScore =
              (data.storeDmScore / 10 +
                data.storeEnvironmentScore / 10 +
                data.storeServiceScore / 10) /
              3;
            this.environmentScore = data.storeEnvironmentScore / 10;
            this.serviceScore = data.storeServiceScore /10 ;
            this.dmScore = data.storeDmScore / 10 ;
            this.tools[3].imge = this.tools[3].selimge;
            this.tools[3].name = averageScore.toFixed(1) + "分";
            if (averageScore === 10) {
              this.summarizeEvaluate = "RECOMMEND";
            } else if (averageScore >= 7 && averageScore < 10) {
              this.summarizeEvaluate = "SO_SO";
            } else {
              this.summarizeEvaluate = "NOT_GOOD";
            }
          }
          if (data.issueContent != null) {
            this.messageonce = data.issueContent;
          }
      } catch (e) {}
    },
    onRestore() {
      this.triggered = "restore"; // 需要重置
    },
    async loadMoreData() {
      this.pageNo++;
      this.queryStoreDrama();
    },
    backRoute() {
      uni.navigateBack({
        delta: 1,
      });
    },
    afterRead(detail) {
      const sizes = detail.detail.file.map((item) => item.size);
      const newTotalSize = sizes.reduce((total, size) => total + size, 0);
      const singleImageSizeLimit = 10 * 1024 * 1024; // 10MB
      const maxImageCount = 6;
      const uploadedImageCount = this.fileList.length;
      const totalImageCount = uploadedImageCount + detail.detail.file.length;
      if (totalImageCount > maxImageCount) {
        uni.showToast({
          title: "图片数量不能超过6张",
          icon: "none",
          duration: 2000,
        });
      } else if (sizes.some((size) => size > singleImageSizeLimit)) {
        uni.showToast({
          title: "单张图片大小不能超过10MB",
          icon: "none",
          duration: 2000,
        });
      } else if (newTotalSize > maxImageCount * singleImageSizeLimit) {
        uni.showToast({
          title: "总图片大小不能超过60MB",
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
            responseData.flat().forEach((fileData) => {
              if (fileData && fileData.fileUrl) {
                this.fileList.push({
                  url: fileData.fileUrl,
                });
                this.fileListmock.push(fileData.fileUrl);
                console.log('54254',this.fileList.length)
                if(this.fileListmock.length >= 6){
                  this.showUpload = false;
                }else {
                  this.showUpload = true;
                }
              }
            });
          })
          .catch((error) => {
            uni.showToast({
              title: `上传失败: ${error}`,
              duration: 2000,
              icon: "none",
            });
          })
      }
    },
    // 删除图片的方法
    onDelete(event) {
      const { index } = event.detail;
      this.fileList.splice(index, 1);
      if (this.fileListmock) {
        this.fileListmock.splice(index, 1);
      }
      if(this.fileListmock.length >= 6){
        this.showUpload = false;
      }else {
        this.showUpload = true;
      }
    },

    onChangefirst(themefirst) {
      this.scoreFirst = themefirst.detail * 2;
    },
    onChangesecond(themesecond) {
      this.scoreSecond = themesecond.detail * 2;
    },
    onChangethird(themethird) {
      this.scoreThird = themethird.detail * 2;
    },
    onChangeDmRate(e, index) {
      this.dmRateList[index].rateValue = e.detail;
      this.dmRateList[index].score = e.detail * 2;

      this.deduceScoremock = this.dmRateList[0].score;
      this.professionalScoremock = this.dmRateList[1].score;
      this.serviceDMmock = this.dmRateList[2].score;
    },
    onChangeShopRate(i, e, index) {
      this.shopRateList[index].rateValue = e.detail;
      this.shopRateList[index].score = e.detail * 2;
    },
    handlePopupConfirm() {
      if (this.currentPopupType === "chooseShop") {
        if (this.storeIdmock) {
          // 检查是否选择了店铺
          this.storeId = this.storeIdmock;
          this.tools[1].name = this.$filters.truncateText(this.storename,7);
          this.tools[1].imge = this.tools[1].selimge;
        } else {
          this.tools[1].name = '关联店铺';
          this.tools[1].imge = this.$iconFont.getIconName("avater");
          this.storeId = null;
        }
        //清空DM 和 店铺评价
        this.clearDMInfo();
      } else if (this.currentPopupType === "dmEvaluate") {
        this.dmId = this.dmIdmock;
        this.dmNickname = this.userNameDM;
        // this.storeId = this.storeIdmock;
        this.userId = this.userIdmock;
        this.professionalScore = this.professionalScoremock;
        this.deduceScore = this.deduceScoremock;
        this.dmServiceScore = this.serviceDMmock;
        this.tools[2].name = this.userNameDM;
         this.tools[2].imge = this.tools[2].selimge;
      } else if (this.currentPopupType === "shopEvaluate") {
        this.environmentScore = this.shopRateList[0].score;
        this.serviceScore = this.shopRateList[1].score;
        this.dmScore = this.shopRateList[2].score;
        const averageScore =
          (this.shopRateList[0].score +
            this.shopRateList[1].score +
            this.shopRateList[2].score) /
          3;
        this.tools[3].imge = this.tools[3].selimge;
        this.tools[3].name = averageScore.toFixed(1) + "分";
        if (averageScore === 10) {
          this.summarizeEvaluate = "RECOMMEND";
        } else if (averageScore >= 7 && averageScore < 10) {
          this.summarizeEvaluate = "SO_SO";
        } else {
          this.summarizeEvaluate = "NOT_GOOD";
        }
        this.showShop = false;
      }
      this.closePopup();
    },
    //清空DM 和 店铺评价
    clearDMInfo(){
      this.dmId = null;
      this.dmIdmock = null;
      this.dmNickname = null;
      this.userNameDM = null;
      this.userIdmock = null;
      this.userId = null;
      this.selectedDM = [];
      this.professionalScore = 0;
      this.professionalScoremock = 0;
      this.deduceScore = 0;
      this.deduceScoremock = 0;
      this.dmServiceScore = 0;
      this.serviceDMmock = 0;
      this.dmRateList = [
        { name: "专业", rateValue: 0, score: 0 },
        { name: "演绎", rateValue: 0, score: 0 },
        { name: "服务", rateValue: 0, score: 0 },
      ]
      this.shopRateList = [
        { name: "环境", rateValue: 0, score: 0 },
        { name: "服务", rateValue: 0, score: 0 },
        { name: "D M", rateValue: 0, score: 0 },
      ]
      this.tools[2].imge = this.$iconFont.getIconName("houseing")
      this.tools[3].imge = this.$iconFont.getIconName("staring")
      this.tools[2].name =  'DM评价';
      this.tools[3].name = '店铺评分';
      this.environmentScore =  0;
      this.serviceScore = 0;
      this.dmScore = 0;
    },
    closeExperienceRole() {
      // 处理关闭弹窗事件
      this.experienceRole = false;
    },
    handleAddRoleName(roleName) {
      if(roleName){
        this.tools[0].name = roleName;
        this.otherRoleName = roleName;
        this.roleId = null;
        this.tools[0].imge = this.tools[0].selimge;
        this.experienceRole = false;
        this.showDialog = false;
      } else {
        this.tools[0].name = '体验角色';
        this.otherRoleName = null;
        this.roleId = null;
        this.tools[0].imge = this.$iconFont.getIconName("charter");
        this.experienceRole = false;
        this.showDialog = false
        this.tools[0].id = 1
      }
    },
    handleSelectedRoles(selectedRoles) {
      // 在这里处理选中的数据，selectedRoles 就是子组件传递的选中数据
      if (selectedRoles.length > 0) {
        const firstSelectedRole = selectedRoles[0]; // 获取第一个被选中的角色
        this.roleId = firstSelectedRole.id;
        this.otherRoleName = null;
        this.tools[0].name = firstSelectedRole.roleName;
        this.tools[0].imge = this.tools[0].selimge;
        this.tools[0].id = firstSelectedRole.id;
      }  else {
        this.roleId = null;
        // this.otherRoleName = null;
        this.tools[0].name = '体验角色';
        this.tools[0].imge = this.$iconFont.getIconName("charter");
        this.tools[0].id = 1
      }
      this.experienceRole = false;
    },
    closeChildComponent() {
      // 在这里执行关闭子组件的操作
      // this.otherRoleName = null;
      this.showDialog = false;
    },
    //关联店铺
    async queryStoreDrama() {
      try {
        let data = await service.queryStoreDrama({
          cityId: this.cityInfo.cityId,
          keyWord: this.shopSearchValue,
          pageNo: this.pageNo,
          pageSize: 10,
          userLatitude: uni.getStorageSync("currentLatitude"),
          userLongitude: uni.getStorageSync("currentLongitude"),
        });
        if(data.records.length){
          this.queryStoreDramaList.push(...data.records);
        }
      } catch (e) {}
    },
    handlePlusClick() {
      this.showDialog = true; // 显示对话框
    },
    async handleSearchChange(e) {
      console.log(e)
      this.shopSearchValue = e.detail;
      this.pageNo = 1;
      this.queryStoreDramaList = []; // 清空数据列表
      await this.queryStoreDrama(); // 执行查询
    },
    handleTool(rid) {
      if (rid == 1) {
        this.experienceRole = true;
      } else if (rid === 2) {
        // 如果用户已经选择了店铺，则执行打开弹窗的逻辑
        this.pageNo = 1;

        this.shopSearchValue = null;
        this.queryStoreDramaList = []; // 清空数据列表
        this.currentPopupType = "chooseShop";
        this.showShop = true;
        this.queryStoreDrama().then(() => {
          this.setShopActiveGroup(); // 确保数据加载后再调用
        });
      } else if (rid === 3) {
        if (this.storeId) {
          this.currentPopupType = "dmEvaluate";
          
          this.queryStoreUserPage().then(() => {
            if(this.queryTotal > 0){
              this.dmRateList = [
                { name: "专业", rateValue: this.professionalScore / 2, score: this.professionalScore },
                { name: "演绎", rateValue: this.deduceScore / 2, score: this.deduceScore },
                { name: "服务", rateValue: this.dmServiceScore / 2, score: this.dmServiceScore },
              ]
              this.$set(this.selectedDM, this.queryStoreUserPageList.findIndex(v=>v.userId === this.dmId), true);
              
              this.dmIdmock = this.dmId;
              this.userNameDM = this.dmNickname;
              this.userIdmock = this.userId;
              this.deduceScoremock = this.dmRateList[0].score;
              this.professionalScoremock = this.dmRateList[1].score;
              this.serviceDMmock = this.dmRateList[2].score;
              this.showShop = true;
            } else {
              uni.showToast({
                title: "该店铺暂无DM～",
                icon: "none",
              });
            }
          });
        } else {
          // 如果用户没有选择店铺，则显示提示消息
          uni.showToast({
            title: "请先选择关联店铺",
            icon: "none",
          });
        }
      } else if (rid === 4) {
        if (this.storeId) {
          this.currentPopupType = "shopEvaluate";
          this.shopRateList = [
            { name: "环境", rateValue: this.environmentScore / 2, score: this.environmentScore },
            { name: "服务", rateValue: this.serviceScore / 2, score: this.serviceScore },
            { name: "D M", rateValue: this.dmScore / 2, score: this.dmScore },
          ]
          this.showShop = true;
        } else {
          // 如果用户没有选择店铺，则显示提示消息
          uni.showToast({
            title: "请先选择关联店铺",
            icon: "none",
          });
        }
      }
    },
    closePopup() {
      this.showShop = false;
      this.currentPopupType = "";
      this.shopList.forEach((item) => {
        item.activeGroup = false;
      });
      this.dmRateList.forEach((item) => {
        item.rateValue = 0;
        item.score = 0;
      });
      this.shopRateList.forEach((item) => {
        item.rateValue = 0;
        item.score = 0;
      });
    },
    toggleActive(item, index) {
      this.activeIndex = index;
      if (item.label === "推荐") {
        this.dramaEvaluateType = "RECOMMEND";
      } else if (item.label === "一般") {
        this.dramaEvaluateType = "SO_SO";
      } else if (item.label === "不行") {
        this.dramaEvaluateType = "NOT_GOOD";
      }
    },
    isActive(content) {
      return this.activeStatus.some((item) => item === content);
    },
    handleStatus(content) {
      if (this.isActive(content)) {
        const index = this.activeStatus.findIndex((item) => item === content);
        this.activeStatus.splice(index, 1);
        // 清空对应输入框的数据
        switch (content) {
          case "剧本情节":
            this.plot = "";
            break;
          case "剧情故事":
            this.story = "";
            break;
          case "剧本内容":
            this.substance = "";
            break;
          case "剧本演绎":
            this.deduce = "";
            break;
        }
      } else {
        this.activeStatus.push(content);
      }
    },
    onInputChange(content, value, property) {
      if (property === "messageonce" && value.length > 5000) {
        // 如果超过了限制长度，截取前 5000 个字符
        value = value.substring(0, 5000);
      }
      // 处理输入框的数据
      switch (content) {
        case "剧本情节":
          this.plot = value;
          break;
        case "剧情故事":
          this.story = value;
          break;
        case "剧本内容":
          this.substance = value;
          break;
        case "剧本演绎":
          this.deduce = value;
          break;
        case "messageonce":
          this.messageonce = value;
          break;
      }
    },
    calculateMaxlength() {
      // 计算所有输入框文字长度的总和
      let totalLength = 0;

      if (this.plot) {
        totalLength += this.plot.length;
      }

      // 计算其他输入框的文字长度并累加到总和

      // 返回总和作为最底下输入框的 maxlength
      return totalLength;
    },
    //查询店铺成员
    async queryStoreUserPage() {
      try {
        let data = await service.queryStoreUserPage({
          pageNo: 1,
          pageSize: 50,
          // storeId: "109",
          storeId:this.storeId,
          storeUserType: "DM",
        });
        this.queryStoreUserPageList = data.records;
        this.queryTotal = data.total;
      } catch (e) {}
    },
    //剧本详情-获取剧本标签
    async queryDramaDict() {
      try {
        let data = await service.queryDramaDict({
          id: this.dramaId,
        });
        this.queryDramaDictList = data;
      } catch (e) {}
    },
    saveDraftbefore(){
      let params = {}
      params.dramaEvaluateIssueRequest ={
        content: this.messageonce,
        dramaEvaluateType: this.dramaEvaluateType,
        dramaEvaluteStringTypeRequest: {
          deduce: this.deduce,
          dramaEvaluteId: this.dramaId,
          plot: this.plot,
          story: this.story,
          substance: this.substance,
        },
        imageList: this.fileListmock,
        scoreList: [
          {
            dictId: this.queryDramaDictList[0].id,
            score: this.scoreFirst * 10,
          },
          {
            dictId: this.queryDramaDictList[1].id,
            score: this.scoreSecond * 10,
          },
          {
            dictId: this.queryDramaDictList[2].id,
            score: this.scoreThird * 10,
          },
        ],
      }
      if(this.storeId != null) {
        params.storeEvaluate = {
          dmScore: this.dmScore * 10,
          environmentScore: this.environmentScore * 10,
          serviceScore: this.serviceScore * 10,
          evaluationSource: "DRAMA_ASSOCIATION_EVALUATE",
          storeId: this.storeId,
          dmId: this.userId,
          dramaId: this.dramaId,
        }
        params.storeId = this.storeId;
      }
      if(this.dmId != null){
        params.dmCommentRecordDTO = {
          deduceScore: this.deduceScore * 10,
          professionalScore: this.professionalScore * 10,
          serviceScore: this.dmServiceScore * 10,
          dmId: this.userId,
          dmNickname:this.dmNickname,
          storeId: this.storeId,
          userId: this.userId,
        }
      }

      if(this.edit == 2){
        params.evaluateId = this.evaluateId;
      }

      params.dramaId =  this.dramaId;
      params.userId = this.userInfoMessage.id;
      params.cityId = this.cityInfo.cityId;

      if(this.roleId != null){
        params.roleId = this.roleId;
      }
      if(this.otherRoleName != null){
        params.otherRoleName = this.otherRoleName;
      }
      return params;
    },
    showCustomModal() {
      uni.showModal({
        content: '是否保存您本次评价内容到草稿箱',
        showCancel: true,
        cancelText: '不保存',
        confirmText: '确认保存',
        success: (res) => { // 注意这里使用了箭头函数
          if (res.confirm) {
            this.addsaveDraftBefore();
          } else if (res.cancel) {
            console.log('用户点击暂不');
          }
        }
      });
    },
    addsaveDraftBefore(){
      if (
          this.scoreFirst > 0 &&
          this.scoreSecond > 0 &&
          this.scoreThird > 0 &&
          this.dramaEvaluateType
      ) {
        this.saveDraft();
      } else {
        wx.showToast({
          title: '给剧本打个分吧！',
          icon: 'none'
        })
      }
    },
    //存草稿箱
    async saveDraft() {
      try {
        let params = this.saveDraftbefore();
        await service.addDrafts(params);
        uni.showToast({
          title: '操作成功',
          icon: 'none'
        });
        uni.setStorageSync('shouldRefresh', true);
        setTimeout(()=>{
          uni.navigateBack();
        },500)
      } catch (e) {}
    },
   addBefore(){
     if (
         this.scoreFirst > 0 &&
         this.scoreSecond > 0 &&
         this.scoreThird > 0 &&
         this.dramaEvaluateType
     ) {
       if(this.edit == null){
         this.addDramaEvaluate();
       }
       if(this.edit == 2){
         this.editDramaEvaluate();
       }
     } else {
       wx.showToast({
         title: '给剧本打个分吧！',
         icon: 'none'
       })
     }
   },
    //剧本评价-编辑评价
    async editDramaEvaluate() {
      if(!this.canSubmit)return;
      this.canSubmit = false;

      try {
        let params = this.saveDraftbefore();
        let data = await this.$api.updateDramaEvaluate(params);

        wx.showToast({
          title: "评价成功！",
          icon: "none",
        });
        uni.setStorageSync('shouldRefresh', true);
        
        setTimeout(() => {
          uni.setStorageSync('updateEvaluateId', data)
          uni.navigateBack();
        }, 1000);
      } catch (e) {
        this.canSubmit = true;
        // 请求失败的逻辑
        console.error('Error:', e);
      }
    },
    //剧本评价-发布评价
    async addDramaEvaluate() {
      if(!this.canSubmit)return;
      this.canSubmit = false;

      try {
        let params = this.saveDraftbefore();
        await service.addDramaEvaluate(params);

        uni.setStorageSync('shouldRefresh', true);
        wx.showToast({
          title: "评价成功！",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (e) {
        this.canSubmit = true;
        // 请求失败的逻辑
        console.error('Error:', e);
      }
    },
    setShopActiveGroup() {
      this.queryStoreDramaList.forEach(shop => {
        this.$set(shop, "activeGroup", shop.id === this.storeIdmock);
      });
    },
// 选择店铺单选框值改变时触发
    changeShopRadio(selectedShop, index) {
      // 检查是否已选中同一个店铺
      if (this.storeIdmock === selectedShop.id) {
        // 如果已选中，再次点击取消选择
        this.storeIdmock = null;
        this.storename = '';
        this.queryStoreDramaList.forEach(shop => {
          this.$set(shop, "activeGroup", false); // 取消所有店铺的选中状态
        });
      } else {
        // 如果未选中或选择了不同店铺，更新选中状态
        this.storeIdmock = selectedShop.id;
        this.storename = selectedShop.storeName;
        this.queryStoreDramaList.forEach((shop, shopIndex) => {
          this.$set(shop, "activeGroup", shopIndex === index); // 只将点击的店铺设置为选中状态
        });
      }
    },
  },
};
</script>
<style lang="scss" >
.uni-navi-bar .uni-navi-right {
  display: none !important;
}
</style>
<style lang="scss" scoped>
.fixedBg {
  height: 100vh;
}
.nav-bg {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  width: 100%;
  background: #dff1ea;
  box-shadow: 0px 4px 6px rgba(140, 140, 140, 0.32);
}
.label-style {
  width: 294rpx;
  height: 44rpx;
  font-size: 32rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #959aa5;
  line-height: 38rpx;
}
.commit-page {
  .wrapper {
    width: calc(100% - 154rpx);
    position: absolute;
    left: 76rpx;
    top: 542rpx;
  }

  .experience-role {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .user-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    padding: 0 32rpx;
    box-sizing: border-box;
    .user {
      width: calc(100% - 180rpx);
      display: flex;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2e323e;

      .back-icon {
        width: 14rpx;
        height: 26rpx;
        margin-right: 14rpx;
      }

      .avatar {
        width: 48rpx;
        height: 64rpx;
        margin-right: 18rpx;
        border-radius: 6rpx 6rpx 6rpx 6rpx;
      }
    }
    .savedraft {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100rpx;
      height: 48rpx;
      background: #ffffff;
      border-radius: 27rpx;
      opacity: 1;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      line-height: 28rpx;
    }

    .submit {
      margin-left: 24rpx;
      width: 106rpx;
      height: 50rpx;
      background: #2e323e;
      border-radius: 40rpx;
      opacity: 1;
      line-height: 28rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      border: 2px solid #37e4bbff;

      .submit-icon {
        width: 108rpx;
        height: 52rpx;
      }
    }
  }
  .commit-header {
    width: 100%;
    box-sizing: border-box;
    // background: linear-gradient(357deg, rgba(28, 184, 90, 0) 0%, rgba(220, 232, 255, 0.41) 100%);
    padding: 20rpx 32rpx 0;

    .commit-list {
      margin-top: 52rpx;
      width: 100%;
      display: flex;
      justify-content: space-around;

      .commit-item {
        width: 182rpx;
        height: 212rpx;
        background: #f3f3f4;
        border-radius: 32rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &.active-commit {
          border: 2rpx solid #36e4bb;
          background: #effffb;
          .name {
            color: #2e323e;
          }
        }
        img {
          width: 64rpx;
          height: 64rpx;
          margin-bottom: 12rpx;
        }

        .name {
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          line-height: 33rpx;
        }
      }
    }

    .score-list {
      display: flex;
      flex-direction: column;
      padding-left: 38rpx;
      margin-top: 20rpx;

      .score-item {
        display: flex;
        align-items: center;
        margin-bottom: 14rpx;
        .score {
          font-size: 28rpx;
          font-weight: 500;
          line-height: 33rpx;
          background: linear-gradient(180deg, #fe9535 0%, #fe5c35 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 24rpx;
          margin-top: 5rpx;
          span {
            margin-left: 12rpx;
            vertical-align: initial;
          }
        }
        .name {
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #2e323e;
          margin-right: 52rpx;
        }
      }
    }
  }

  .commit-main {
    // position: absolute;
    // top: 690rpx;
    // left: 0;
    width: 100%;
    border-radius: 24rpx;
    background: #fefefe;
    padding: 32rpx 40rpx;
    box-sizing: border-box;

    .status {
      width: 100%;
      display: flex;
      justify-content: space-around;

      .status-item {
        width: 152rpx;
        height: 54rpx;
        text-align: center;
        line-height: 54rpx;
        border-radius: 31rpx;
        border: 2rpx solid #e9ebef;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
      }

      .active-status {
        color: #36e4bb;
        border: 2rpx dotted #36e4bb;
      }
    }
    .commit-ctx {
      /deep/.van-cell:after {
        display: none;
      }
      /deep/.textarea {
        min-height: 400rpx !important;
      }
    }
    .other-tools {
      width: calc(100% - 20rpx);
      height: 308rpx;
      padding: 44rpx 10rpx;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      box-sizing: border-box;
      border-top: 2rpx solid #eeeeee;
      background: linear-gradient(180deg, #fbfbfb 0%, #ffffff 56%);
      .special-title {
        margin-right: 47rpx;
      }
      .tool {
        max-width: 50%;
        height: 120rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

        .top-info {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;

          .icon1 {
            width: 32rpx;
            height: 32rpx;
            margin-right: 12rpx;
          }

          .right-icon {
            width: 16rpx;
            height: 20rpx;
            margin-left: 10rpx;
          }
        }

        .title {
          font-size: 26rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #2e323e;
        }

        .intro {
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          margin-top: 12rpx;
        }
      }
    }
  }
  .popup-header {
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
    .header-subtitle {
      text-align: center;
      font-size: 28rpx;
      color: #444444;
    }
    .header-box {
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
        /deep/.van-search {
          padding: 0;
          .van-search__content {
            border-radius: 16rpx;
            background: #f6f6f6;
          }
        }
      }
    }
  }
  .shop-content {
    background: #fafafa;
    padding: 20rpx 0;
    height: 53vh !important;
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
            width: 40rpx;
            height: 40rpx;
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
      background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);
      border-radius: 98rpx;
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
  .rate-content-no{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 34rpx;
    font-weight: 500;
    color: #2e323e;
  }
  .rate-content {
    .scroll-x {
      width: 100%;
      margin-bottom: 30rpx;
      // margin-top: 12rpx;
      // overflow-x: scroll;
      // padding-right: 12rpx;
      box-sizing: border-box;

      .playText-list {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        .playText-item {
          position: relative;
          // width: 162rpx;
          margin-right: 60rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .select-icon {
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            top: 24rpx;
            right: 24rpx;
          }
          .cover {
            width: 200rpx;
            height: 200rpx;
            border-radius: 40rpx 40rpx 40rpx 40rpx;
            opacity: 1;
            border: 2rpx solid #d2d2d2;
            margin-bottom: 16rpx;
          }

          .name {
            font-size: 26rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: black;
            text-align: center;
          }
        }
      }
    }
    background: #ffffff;
    padding: 60rpx 0;
    .rate-list {
      display: flex;
      align-items: center;
      margin: 32rpx 0rpx 32rpx 74rpx;
      // margin-bottom: 32rpx;
      .name {
        margin-right: 52rpx;
        font-size: 28rpx;
        color: #2e323e;
      }
      /deep/.van-rate__item {
        padding-right: 22rpx;
        &:last-child {
          padding-right: 0;
        }
      }
      .score {
        font-size: 28rpx;
        font-weight: 500;
        line-height: 33rpx;
        background: linear-gradient(180deg, #fe9535 0%, #fe5c35 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-left: 24rpx;
        margin-top: 5rpx;
        span {
          margin-left: 12rpx;
          vertical-align: initial;
        }
      }
    }
  }
}
</style>