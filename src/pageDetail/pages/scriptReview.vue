<template>
  <view class="contentBox" v-if="isShow">
    <navigation-bar :nav="customNav">
      <view slot="left">
        <div class="backBox" @click="addClickBack">
          <van-icon name="arrow-left" color="#111111" size="20" />
          <view class="titleText">剧评详情</view>
        </div>
      </view>
      <view slot="content"> </view>
    </navigation-bar>
    <!-- banner滚动区域 -->
    <scroll-view @scrolltolower="onLoadMore" class="banner" scroll-y>
      <view class="bannerBox">
        <image
          class="touxiang"
          :src="dramaEvaluateItem.avatar"
          mode="aspectFill"
        ></image>
        <view class="text">{{
          $filters.truncateText(dramaEvaluateItem.nickName, 7)
        }}</view>
        <view
          v-if="dramaEvaluateItem.userId != userId"
          :class="{ already: dramaEvaluateItem.isFocus }"
          @click="toggleFollowStatus(dramaEvaluateItem)"
        >
          <image
            v-if="showFocusIcon"
            class="guanzhu"
            :src="
              dramaEvaluateItem.isFocus
                ? '../static/image/yiguanzhu.png'
                : '../static/image/guanzhu.png'
            "
          ></image>
        </view>
        <view class="open" @click="showMoreOperationClick()">
          <img src="../static/image/moreScriptReview.png" alt="" />
        </view>
      </view>
      <!-- banner -->
      <view class="bannerbox">
        <div v-if="dramaEvaluateItem.roleName" class="role">
          体验角色：{{
            dramaEvaluateItem.roleName == null
              ? "--"
              : dramaEvaluateItem.roleName
          }}
        </div>
        <p
          class="text2"
          v-if="
            dramaEvaluateItem.evaluateStringType &&
            dramaEvaluateItem.evaluateStringType.deduce
          "
        >
          剧本演绎:{{ dramaEvaluateItem.evaluateStringType.deduce }}
        </p>
        <p
          class="text2"
          v-if="
            dramaEvaluateItem.evaluateStringType &&
            dramaEvaluateItem.evaluateStringType.plot
          "
        >
          剧本情节:{{ dramaEvaluateItem.evaluateStringType.plot }}
        </p>
        <p
          class="text2"
          v-if="
            dramaEvaluateItem.evaluateStringType &&
            dramaEvaluateItem.evaluateStringType.story
          "
        >
          剧情故事:{{ dramaEvaluateItem.evaluateStringType.story }}
        </p>
        <p
          class="text2"
          v-if="
            dramaEvaluateItem.evaluateStringType &&
            dramaEvaluateItem.evaluateStringType.substance
          "
        >
          剧本内容:{{ dramaEvaluateItem.evaluateStringType.substance }}
        </p>
        <view class="text2" v-if="dramaEvaluateItem">
          {{ dramaEvaluateItem.content }}
        </view>
        <view class="tuijianBox">
          <view class="tuijianBox-nameBox"
            ><span>{{ dramaEvaluateItem.nickName }}</span
            >评价这部剧本:</view
          >
          <view
            class="textTJ"
            v-if="dramaEvaluateItem.dramaEvaluateType == 'RECOMMEND'"
            ><img
              class="image"
              :src="$iconFont.getIconName('recommended-emoji')"
              alt=""
            />
            推荐</view
          >
          <view
            class="textTJ"
            v-if="dramaEvaluateItem.dramaEvaluateType == 'SO_SO'"
            ><img
              class="image"
              :src="$iconFont.getIconName('general-facial-expressions')"
              alt=""
            />
            一般</view
          >
          <view
            class="textTJ"
            v-if="dramaEvaluateItem.dramaEvaluateType == 'NOT_GOOD'"
            ><img
              class="image"
              :src="$iconFont.getIconName('no-expression')"
              alt=""
            />
            不行</view
          >
          <div class="tuijianBox-right">
            <view
              class="text3"
              v-for="(item, index) in dramaEvaluateItem.scoreList"
              :key="index"
            >
              <view class="dictValue">{{ item.dictValue }}</view>
              <view>{{ item.score / 10 }}</view>
            </view>
          </div>
        </view>
        <!-- banner 图片 -->
        <view class="inagebox" v-if="dramaEvaluateItem.imageList.length">
          <imageGrid :images="dramaEvaluateItem.imageList" size="30" />
        </view>
      </view>
      <!-- 发布时间 -->
      <view class="fbBox">
        <text class="fbTime" v-if="dramaInfo.updateTime">{{
          formatDateTime(dramaInfo.updateTime)
        }}</text>

        <text class="province">{{ dramaEvaluateItem.cityName }}</text>
        <text class="line" v-if="dramaEvaluateItem.hasGathered"></text>
        <view class="pingjia" v-if="dramaEvaluateItem.hasGathered"
          >通过剧游组局评价</view
        >
      </view>
      <!-- 我想玩 -->
      <view class="xiangwan" @click.stop="onDramaDetail">
        <image
          class="touxiang2"
          :src="dramaInfo.dramaCover"
          mode="aspectFill"
        ></image>
        <view class="rightText">
          <view class="text">{{ dramaInfo.dramaName }}</view>
          <view class="permvtype">
            <view
              >{{ dramaInfo.maleGamerNum }}男{{
                dramaInfo.femaleGamerNum
              }}女</view
            >
            <view>{{ dramaInfo.gameTime }}小时</view>
            <view class="line2"></view>
            <view v-for="(item, index) in dramaInfo.scoreList" :key="index">
              <text class="texe">{{ item.dictValue }}</text>
            </view>
          </view>
        </view>
        <view
          @click.stop="addclickwangPlay"
          v-if="dramaInfo.playStatus == null"
        >
          <image class="wantplay" src="../static/image/woxiangwan.png"> </image>
        </view>
        <view
          @click.stop="addclickAwant"
          v-if="dramaInfo.playStatus == 'WANT_PLAY'"
        >
          <image class="wantplay" src="../static/image/yxwang2.png"> </image>
        </view>
      </view>
      <!-- 超棒 -->

      <view class="Box" v-if="storeCommentRespnse.storeName">
        <view class="tiyanBox">
          <image
            class="touxiang3"
            :src="storeCommentRespnse.avatarStr"
            mode="aspectFill"
          ></image>
          <view class="textBox2">
            <view class="title"
              >{{
                storeCommentRespnse.storeName == null
                  ? "--"
                  : storeCommentRespnse.storeName
              }}
            </view>
            <view class="now">
              <view class="currenttext">本次体验</view>
              <view class="nice">{{ totalStoreScore }}</view>
            </view>
          </view>
        </view>
        <view class="tiyanBox" v-if="dmCommentRespnse.dmName">
          <image
            class="touxiang3"
            :src="dmCommentRespnse.avatarStr"
            mode="aspectFill"
          ></image>
          <view class="textBox2">
            <view class="title">{{
              dmCommentRespnse.dmName == null ? "--" : dmCommentRespnse.dmName
            }}</view>
            <view class="now">
              <view class="currenttext">本次体验</view>
              <view class="nice">{{ totalDMScore }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 最新评论 -->
      <view v-if="total > 0">
        <view class="newreview">
          <text>最新评论</text>
          <text>({{ total }})</text>
        </view>
        <!-- 评论内容 -->
        <view
          class="pinglunBox"
          v-for="(item, index) in pinglunList"
          :key="index"
        >
          <image class="touxiang" :src="$filters.processLogo(item.avatar)"></image>
          <view class="textBox">
            <view class="title">{{ item.nickname || '' }}</view>
            <view
              @tap="addClickcontent(item)"
              class="text"
              v-if="item.parentId == -1"
              >{{ item.content }}</view
            >
            <view class="texthuifu" v-else-if="item.parentId !== -1">
              <view class="huifu">回复</view>
              <view class="otherperson">{{ item.parentName }}:</view>
              <view class="contentother">{{ item.content || '' }}</view>
            </view>
            <view class="time">{{ item.updatedTime }}</view>
          </view>
          <view class="dianzhanbox" @click="addClickDianzan(item, index)">
            <view>
              <image
                v-if="item.hasFabulous == false"
                class="dianzhan"
                src="../static/image/zhan.png"
              >
              </image>
              <image v-else class="dianzhan" src="../static/image/dianzan.png">
              </image>
            </view>
            <view class="num">{{ item.praiseQuantity }}</view>
          </view>
        </view>
      </view>
      <view v-else>
        <view class="no-all">
          <image
            class="nomorePic"
            :src="$iconFont.getIconName('No-comments')"
          ></image>
          <view class="nomorePerson">还没有人评论哦</view>
        </view>
      </view>
    </scroll-view>
    <!-- 底部 -->
    <view class="bottomBox">
      <view class="bottonBox">
        <view class="inputBox" @click="addclickZkSS">
          <view class="inputBox2" :value="file_vlue">
            <view class="text">展开说说吧...</view>
          </view>
          <view class="note_cover" v-if="focus"></view>
          <input-box
            v-show="focus"
            :details="detailInfo.idea_name"
            :commit="focus"
            @submit="submitNote"
            @blurCom="blurCom"
          ></input-box>
        </view>
        <div class="shareBox">
          <image
            class="fenxiang"
            src="../static/image/zhuanfa.png"
            mode="heightFix"
            @click="addClidfenxiang"
          ></image>
          <view class="fenxiang2" @click="addClidfenxiang">分享</view>
        </div>
        <view class="pingjiaBox" @click="addClickPJ">
          <image class="pingjia" src="../static/image/liaotian.png"></image>
          <view class="ingjia2">评价</view>
        </view>
        <view @click="addClickDianzhan(dramaEvaluateItem)" class="dianzanBox">
          <image
            class="dianzhan"
            :src="
              dramaEvaluateItem.hasFabulous === true
                ? $iconFont.getIconName('mzan')
                : $iconFont.getIconName('kzan')
            "
            alt=""
          ></image>
          <span class="num">{{
            $filters.quantityTransferThousand(dramaEvaluateItem.praiseQuantity) != null
              ? $filters.quantityTransferThousand(dramaEvaluateItem.praiseQuantity)
              : "点赞"
          }}</span>
        </view>
      </view>
      <BindPhone
        v-if="!userInfo.phone"
        ref="BindPhone"
        @on-success-authorize="onRefreshUserInfo"
      />
    </view>
    <van-action-sheet
      :show="showMore"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @close="showMoreOperationClick()"
      title="更多"
    >
      <div class="popBox">
        <div
          class="menu"
          @click="reportDynamic()"
          v-if="userInfo.id != dramaEvaluateItem.userId"
        >
          <image src="../static/image/icon-jubao.png" />
          <span>举报</span>
        </div>
        <div
          class="menu"
          @click="editDynamic()"
          v-if="userInfo.id == dramaEvaluateItem.userId"
        >
          <image src="../static/image/icon-edit.png" />
          <span>编辑</span>
        </div>
        <div
          class="menu"
          @click="deleteDynamic()"
          v-if="userInfo.id == dramaEvaluateItem.userId"
        >
          <image src="../static/image/icon-delete.png" />
          <span>删除</span>
        </div>
      </div>
    </van-action-sheet>
    <poster
      v-if="isShowPoster"
      :isShowPoster.sync="isShowPoster"
      :drama="dramaInfo"
      :evaluateId="evaluateId"
      :evaluateData="dramaEvaluateItem"
    />
  </view>
</template>
<script>
import service from "../utils/service.js";
import inputBox from "./inputBox.vue";
import navigationBar from "@/components/navigation-bar";
import poster from "../components/evaluatePoster/poster.vue";
import BindPhone from "../../components/bindPhone/index.vue";
import imageGrid from "@/components/imageGrid/index.vue";
export default {
  components: {
    inputBox,
    navigationBar,
    poster,
    BindPhone,
    imageGrid,
  },
  data() {
    return {
      showMore: false,
      userInfo: null,
      parentAvatar: null,
      parentName: null,
      parentId: null,
      file_vlue: "",
      dramaInfo: {},
      dramaEvaluateItem: {},
      showFocusIcon: true,
      storeCommentRespnse: {},
      dmCommentRespnse: {},
      pinglunList: [],
      total: "",
      evaluateId: "",
      evaluateId2: "",
      dramaId: "",
      focus: false,
      pageNo: 1,
      pageSize: 10,
      answer: null,
      praiseQuantity: null,
      customNav: {
        customizeTitle: true,
        bgHeight: "auto",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      isShowPoster: false,
      isShow: false,
      fabulousIndex: -1
    };
  },
  onLoad(options) {
    wx.showLoading();
    if (options.scene) {
      let scene = decodeURIComponent(options.scene).split("&");
      this.dramaId = scene[0].split("=")[1];
      this.evaluateId = scene[1].split("=")[1];
    } else {
      this.dramaId = options.dramaId;
      this.evaluateId = options.evaluateId;
    }
  },
  computed: {
    totalStoreScore() {
      // 计算总分
      const total =
        this.storeCommentRespnse.dmScore +
        this.storeCommentRespnse.environmentScore +
        this.storeCommentRespnse.serviceScore;

      // 根据总分返回相应的评价
      if (total === 0) {
        return "暂无评分";
      } else if (total > 270) {
        return "超棒";
      } else if (total > 210) {
        return "一般";
      } else {
        return "不行";
      }
    },
    totalDMScore() {
      // 计算总分
      const total =
        this.dmCommentRespnse.deduceScore +
        this.dmCommentRespnse.professionalScore +
        this.dmCommentRespnse.serviceScore;

      // 根据总分返回相应的评价
      if (total === 0) {
        return "暂无评分";
      } else if (total > 270) {
        return "超棒";
      } else if (total > 210) {
        return "一般";
      } else {
        return "不行";
      }
    },
  },
  async onShow() {
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }

    if (uni.getStorageSync("updateEvaluateId")) {
      this.evaluateId = uni.getStorageSync("updateEvaluateId");
      uni.removeStorageSync("updateEvaluateId");
    }
    this.pageNo = 1;
    this.showMore = false;
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.userId = this.userInfo.id;
    await this.getDramaEvaluateComment();
    await this.getDramaEvaluatePage();
  },
  methods: {
    deleteDynamic() {
      console.log(
        this.dramaEvaluateItem.dramaId,
        this.dramaEvaluateItem.evaluateId
      );
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该条剧评吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              await that.$api.deleteDramaEvaluate({
                dramaId: that.dramaEvaluateItem.dramaId,
                id: that.dramaEvaluateItem.evaluateId,
              });
              uni.setStorageSync("shouldRefresh", true);
              uni.navigateBack();
            } catch (e) {
              console.log(e);
            }
          }
        },
      });
    },
    reportDynamic() {
      uni.setStorageSync("reportPublish", {
        avatar: this.dramaEvaluateItem.avatar,
        nickName: this.dramaEvaluateItem.nickName,
        content: this.dramaEvaluateItem.content,
      });
      uni.setStorageSync("reportDetail", {
        businessId: this.dramaEvaluateItem.evaluateId,
        feedBusiness: "DRAMA_COMMENT",
      });
      uni.navigateTo({
        url: "/report/pages/index",
      });
    },
    showMoreOperationClick() {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      this.showMore = !this.showMore;
    },
    async onRefreshUserInfo() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
    async toggleFollowStatus(item) {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      // 切换关注状态
      await this.updateUserFocus(item);
    },
    async updateUserFocus(i) {
      try {
        await this.$api.updateUserFocus({
          flag: !i.isFocus,
          focusUserId: i.userId,
          userId: this.userId,
        });
        i.isFocus = !i.isFocus;
      } catch (e) {}
    },
    formatDateTime(dateTimeString) {
      const dateTimeStringFormatted = dateTimeString.replace(/-/g, "/");
      const date = new Date(dateTimeStringFormatted);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `发布于${year}-${month}-${day} ${hours}:${minutes}`;
    },
    addclickwangPlay() {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      this.updateUserDramaPlayMP();
      this.getDramaEvaluateComment();
    },
    addclickAwant() {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      this.cancelUserDramaPlayMP();
      this.getDramaEvaluateComment();
    },
    async updateUserDramaPlayMP() {
      try {
        let data = await service.updateUserDramaPlayMP({
          dramaId: this.dramaId,
          playStatus: "WANT_PLAY",
          userId: this.userInfo.id,
        });
        wx.hideLoading();
      } catch (e) {}
    },
    async cancelUserDramaPlayMP() {
      try {
        let data = await service.cancelUserDramaPlayMP({
          dramaId: this.dramaId,
          playStatus: null,
          userId: this.userInfo.id,
        });
      } catch (e) {}
    },
    onPreView(imageUrl) {
      uni.previewImage({
        urls: this.dramaEvaluateItem.imageList, // 需要预览的图片链接列表
        current: imageUrl, // 当前显示图片的链接
      });
    },
    onDramaDetail() {
      uni.navigateTo({
        url: `/pageDetail/pages/pageDetail?id=${this.dramaInfo.id}`,
      });
    },
    async addClickDianzhan(i) {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      let status = "DISABLE";
      let dynamicType = 3;
      let dynamicId = i.evaluateId;
      if (i.hasFabulous == false) {
        status = "ENABLE";
      } else {
        status = "DISABLE";
      }
      try {
        await this.userPraiseDynamic(status, dynamicType, dynamicId);
        if (i.hasFabulous == false) {
          i.hasFabulous = true;
          i.praiseQuantity++;
        } else {
          i.hasFabulous = false;
          i.praiseQuantity--;
        }
      } catch (err) {
        console.log(err);
      }
    },
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
    addClickcontent(item) {
      console.log("item", item);
      this.focus = true;
      this.answer = item.parentId;
      this.parentId = item.id;
      this.praiseQuantity = item.praiseQuantity;
      this.parentAvatar = item.avatar;
      this.parentName = item.nickname;
    },
    addClidfenxiang() {
      this.isShowPoster = true;
    },
    addClickPJ() {
      if (!this.userInfo.phone) return;
      this.$nextTick(() => {
        this.focus = true;
      }); //唤起软键盘
    },
    onLoadMore() {
      if (!this.pinglunList.length) return;

      if (this.pinglunList.length >= this.total) {
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
          this.getDramaEvaluatePage().then(() => {
            uni.hideLoading();
          });
      }
    },
    addclickZkSS() {
      if (!this.userInfo.phone) return;
      this.$nextTick(() => {
        this.focus = true;
      }); //唤起软键盘
    },
    // 失去焦点
    // 失焦，关闭软件盘
    blurCom() {
      console.log("失焦");
      this.focus = false;
    },
    // 提交笔记
    async submitNote(val) {
      if (!val || !val.length) return;

      if (this.answer == -1) {
        this.content = val;
        await this.publishDramaEvaluateComment();
        this.pageNo = 1;
        await this.getDramaEvaluatePage();
      } else {
        this.parentId = null;
        this.praiseQuantity = null;
        this.content = val;
        await this.publishDramaEvaluateComment();
        this.pageNo = 1;
        await this.getDramaEvaluatePage();
      }
      this.$nextTick(() => {
        this.focus = false;
      });
    },
    // 评论列表点赞
    async addClickDianzan(item, index) {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      this.fabulousIndex = index;
      this.evaluateId2 = item.id;

      if (this.pinglunList[index].hasFabulous == true) {
        this.getcancelFabulous();
      } else {
        this.getfabulous();
      }
    },
    addClickBack() {
      if (getCurrentPages().length === 1) {
        uni.switchTab({
          url: "/pages/index/index",
        });
      } else {
        uni.navigateBack();
      }
    },
    onSearch() {},
    async publishDramaEvaluateComment() {
      try {
        let res = await service.publishDramaEvaluateComment({
          content: this.content,
          evaluateId: this.evaluateId,
          userId: this.userId,
          parentName: this.parentName,
          parentId: this.parentId,
          praiseQuantity: null,
          parentAvatar: this.parentAvatar,
        });
      } catch (e) {}
    },
    async getDramaEvaluateComment() {
      try {
        let res = await service.queryDramaEvaluateComment({
          dramaId: this.dramaId,
          evaluateId: this.evaluateId,
          userId: this.userId,
        });
        this.dramaInfo = res.dramaInfo;
        this.dramaEvaluateItem = res.dramaEvaluateItem;
        this.storeCommentRespnse = res.storeCommentResponse;
        this.dmCommentRespnse = res.dmCommentRespnse;
        if (this.userId === this.dramaEvaluateItem.userId) {
          this.showFocusIcon = false;
        }
      } catch (e) {}
    },
    async getDramaEvaluatePage() {
      try {
        let res = await service.queryDramaEvaluateCommentByEvaluateId({
          id: this.evaluateId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          pages: null,
          parentId: null,
          userId: this.userId,
        });
        if(res.records.length){
          this.pinglunList.push(...res.records);
        }
        this.total = res.total;
        this.isShow = true;
        wx.hideLoading();
      } catch (e) {}
    },
    async getfabulous() {
      if (!this.userInfo.phone) return;
      try {
        let res = await service.fabulous({
          evaluateId: this.evaluateId2,
          userId: this.userId,
        });
        this.pinglunList[this.fabulousIndex].hasFabulous = true;
        this.pinglunList[this.fabulousIndex].praiseQuantity++;

        if (res == true) {
          uni.showToast({
            title: "点赞成功！",
            icon: "none",
          });
        }
      } catch (e) {}
    },
    async getcancelFabulous() {
      if (!this.userInfo.phone) return;
      try {
        let res = await service.cancelFabulous({
          evaluateId: this.evaluateId2,
          userId: this.userId,
        });
        this.pinglunList[this.fabulousIndex].hasFabulous = false;
        this.pinglunList[this.fabulousIndex].praiseQuantity--;

        if (res == true) {
          uni.showToast({
            title: "取消点赞",
            icon: "none",
          });
        }
      } catch (e) {}
    },
    editDynamic() {
      uni.setStorageSync("editDrama", {
        dramaCover: this.dramaInfo.dramaCover,
        dramaId: this.dramaInfo.id,
        dramaName: this.dramaInfo.dramaName,
        evaluateId: this.evaluateId,
        edit: 2,
      });
      uni.navigateTo({
        url: `/pageDetail/pages/index`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.van-field__control {
  width: 246rpx;
  height: 66rpx;
  background: #f5f6f8;
  border-radius: 46rpx 46rpx 46rpx 46rpx;
  opacity: 1;
  margin-left: 32rpx;
}

/deep/ .van-cell:after {
  position: relative;
}

.contentBox {
  height: 100vh;
  width: 750rpx;

  .backBox {
    display: flex;
    justify-content: flex-start;

    .titleText {
      margin-left: 264rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
    }
  }

  .bottomBox {
    position: fixed;
    bottom: 72rpx;
  }

  .header {
    display: flex;
    justify-content: flex-start;

    .backIcon {
      width: 64rpx;
      height: 74rpx;
      position: fixed;
      left: 14rpx;
      top: 108rpx;
    }

    .jptitle {
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      position: fixed;
      top: 120rpx;
      left: 322rpx;
    }
  }

  .banner {
    height: calc(100vh - 21vh);
    width: 750rpx;
    position: fixed;
    top: 180rpx;
    margin-bottom: 200rpx;

    .bannerBox {
      display: flex;
      justify-content: flex-start;

      .touxiang {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-left: 30rpx;
      }
      .open {
        width: 40rpx;
        height: 8rpx;
        position: absolute;
        right: 30rpx;
      }

      .text {
        width: 40vw;
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        line-height: 64rpx;
        margin-left: 18rpx;
        @include text-overflow-line(1);
      }
      .guanzhu {
        width: 100rpx;
        height: 48rpx;
        border-radius: 27rpx 27rpx 27rpx 27rpx;
        opacity: 1;
        position: absolute;
        right: 110rpx;
      }
    }
  }

  .bannerbox {
    .role {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #4b577c;
      line-height: 36rpx;
      padding: 40rpx 0px 0px 30rpx;
      @include text-overflow-line(1);
      width: 90vw;
    }
    .text2 {
      width: 690rpx;
      height: auto;
      font-size: 30rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      margin: 24rpx 30rpx 30rpx 30rpx;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }

  .fbBox {
    display: flex;
    justify-content: flex-start;
    margin-left: 30rpx;
    margin-top: 28rpx;
    .fbTime {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      margin-right: 10rpx;
    }

    .province {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      margin-right: 10rpx;
    }

    .line {
      width: 2rpx;
      height: 22rpx;
      background: #d9d9d9;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin-right: 10rpx;
      margin-top: 6rpx;
    }

    .pingjia {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      // margin: 5rpx 10rpx 0rpx 10rpx;
    }
  }

  .tuijianBox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 auto;
    width: 690rpx;
    height: 72rpx;
    background: #fff6ea;
    border-radius: 12rpx;
    position: relative;
    &-nameBox {
      @include hor;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #b66440;
      padding: 18rpx 10rpx 18rpx 24rpx;
      span:nth-child(1) {
        @include text-overflow-line(1);
        max-width: 20vw;
      }
    }
    .textTJ {
      font-size: 26rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #b66440;
      padding: 18rpx 0rpx;
      @include hor;
      align-items: center;
      .image {
        width: 40rpx;
        height: 40rpx;
      }
    }
    &-right {
      position: absolute;
      right: 32rpx;
      @include hor;
      align-items: center;
    }
    .text3 {
      font-size: 20rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #b66440;
      white-space: nowrap;
      display: flex;
      justify-content: flex-start;

      .dictValue {
        margin-left: 5rpx;
      }
    }
  }

  .inagebox {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 34rpx 30rpx 0rpx 30rpx;

    .image {
      width: 226rpx;
      height: 226rpx;
      border-radius: 12rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin: 0 6rpx 6rpx 0rpx;
    }
  }

  .xiangwan {
    width: 690rpx;
    height: 128rpx;
    background: #f5f6f8;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    opacity: 1;
    margin: 40rpx auto;
    display: flex;
    justify-content: flex-start;
    position: relative;

    .touxiang2 {
      width: 96rpx;
      height: 128rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      opacity: 1;
    }

    .logoIcon {
      width: 60rpx;
      height: 32rpx;
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      opacity: 1;
      position: absolute;
      left: 0;
      top: 0;
    }

    .rightText {
      display: flex;
      flex-direction: column;

      .text {
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        margin-top: 24rpx;
        margin-left: 12rpx;
      }

      .permvtype {
        display: flex;
        justify-content: flex-start;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        margin-top: 8rpx;
        margin-left: 12rpx;
      }

      .line2 {
        width: 2rpx;
        height: 22rpx;
        background: #d9d9d9;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        opacity: 1;
        margin-top: 6rpx;
        margin-left: 8rpx;
        margin-right: 8rpx;
      }

      .texe {
        padding-left: 5rpx;
      }
    }

    .wantplay {
      width: 120rpx;
      height: 36rpx;
      // background-color: #ccc;
      position: absolute;
      top: 26rpx;
      right: 18rpx;
    }
  }

  .Box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .no-all {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 108rpx 0px;
    box-sizing: border-box;
    .nomorePic {
      width: 108rpx;
      height: 108rpx;
      .nomorePerson {
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        margin-left: 288rpx;
      }
    }
  }

  .tiyanBox {
    display: flex;
    justify-content: flex-start;
    width: 330rpx;
    height: 96rpx;
    background: #ffffff;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    opacity: 1;
    border: 1rpx solid #e9ebef;
    margin-left: 30rpx;

    .touxiang3 {
      width: 96rpx;
      height: 96rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      opacity: 1;
      background-color: #ccc;
    }

    .textBox2 {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        padding-left: 12rpx;
        padding-top: 12rpx;
        width: 200rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .now {
        display: flex;
        justify-content: flex-start;
      }

      .currenttext {
        font-size: 22rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        padding-top: 6rpx;
        padding-left: 12rpx;
      }

      .nice {
        font-size: 22rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffa557;
        padding-top: 6rpx;
        padding-left: 12rpx;
      }
    }
  }

  .newreview {
    font-size: 34rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2e323e;
    padding: 44rpx 0px 0px 30rpx;
    border-top: 2rpx solid #f5f5f5;
  }

  .pinglunBox {
    display: flex;
    justify-content: flex-start;
    position: relative;
    .touxiang {
      height: 80rpx;
      width: 80rpx;
      border-radius: 50%;
      background-color: #ccc;
      margin-top: 44rpx;
      margin-left: 30rpx;
    }

    .title {
      font-size: 30rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #959aa5;
      margin-top: 50rpx;
      margin-left: 18rpx;
    }

    .text {
      font-size: 30rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      margin-left: 18rpx;
      margin-top: 14rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 480rpx;
    }

    .texthuifu {
      width: 480rpx;
      display: flex;
      justify-content: flex-start;
      font-size: 30rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      margin-left: 18rpx;
      margin-top: 14rpx;
      width: 480rpx;
      overflow: hidden;

      .huifu {
        font-size: 30rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        white-space: nowrap;
      }

      .otherperson {
        font-size: 30rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 350;
        color: #959aa5;
        white-space: nowrap;
      }

      .contentother {
        margin-left: 10rpx;
      }
    }

    .time {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      padding-left: 18rpx;
      padding-top: 10rpx;
    }

    .dianzhanbox {
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 10rpx;
      top: 44rpx;
      padding: 0px 20rpx;

      .num {
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        margin-left: 6rpx;
        margin-top: 8rpx;
      }

      .dianzhan {
        width: 26rpx;
        height: 27rpx;
        opacity: 1;
      }
    }
  }

  .bottonLine {
    width: 750rpx;
    height: 2rpx;
    background: #ebebeb;
    border-radius: 0rpx 0rpx 0rpx 0rpx;
    opacity: 1;
    margin-top: 78rpx;
  }

  .bottonBox {
    display: flex;
    align-items: center;

    .inputBox {
      .inputBox2 {
        width: 32vw;
        height: 66rpx;
        background: #f5f6f8;
        border-radius: 46rpx;
        margin-left: 32rpx;
        display: flex;
        align-items: center;

        .text {
          margin-left: 24rpx;
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
        }
      }
    }

    .shareBox {
      @include hor;
      align-items: center;
      margin-left: 40rpx;
      .fenxiang {
        height: 44rpx;
        width: 44rpx;
      }

      .fenxiang2 {
        margin-left: 8rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
      }
    }

    .pingjiaBox {
      display: flex;
      margin-left: 40rpx;

      .ingjia2 {
        margin-left: 8rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
      }
      .pingjia {
        width: 44rpx;
        height: 44rpx;
      }
    }

    .dianzanBox {
      margin-left: 40rpx;
      .num {
        margin-left: 8rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
      }

      .dianzhan {
        width: 44rpx;
        height: 44rpx;
      }
    }
  }

  .popBox {
    height: 15vh;
    .menu {
      position: absolute;
      left: 32rpx;
      top: 120rpx;
      width: 100rpx;
      @include ver;
      align-items: center;
      image {
        width: 100rpx;
        height: 100rpx;
      }
      span {
        margin-top: 16rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        line-height: 28rpx;
        text-align: center;
        width: 100%;
      }
      button {
        background: unset !important;
        @include abscenter;
      }
      button::after {
        border: none !important;
      }
    }
    .menu:nth-child(2) {
      left: 172rpx;
    }
    .menu:nth-child(3) {
      left: 312rpx;
    }
    .menu:nth-child(4) {
      left: 452rpx;
    }
  }
}
</style>
