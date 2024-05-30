<template>
  <div class="dynamic-container">
    <div class="fixedBg"></div>
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
    <main class="dynamic-main">
      <div class="author-info" >
        <div class="author-left" @click="userDetailNavigator(dynamicDetailObject.userItem.id)">
          <div class="avatar">
            <image class="avaimg" :src="dynamicDetailObject.userItem.avatar" mode="aspectFill"/>
          </div>
          <div class="text">
            <div class="name">{{ dynamicDetailObject.userItem.nickName }}</div>
          </div>
        </div>
        <div class="author-right">
          <div class="follow-gradient" v-if="dynamicDetailObject.userItem.id != userId"  :class="{ already: dynamicDetailObject.isFocus }" @click="toggleFollowStatus({isFocus: dynamicDetailObject.isFocus, focusUserId: dynamicDetailObject.userItem.id})">
            <div class="follow-confirm">{{ dynamicDetailObject.isFocus ? '已关注' : '关注' }}</div>
          </div>
          <div class="oper" @click="showMoreOperationClick()">
            <img src="../static/image/oper.png" alt="">
          </div>
        </div>
      </div>
      <div class="dynamic-description" v-if="dynamicDetailObject.content">
       {{dynamicDetailObject.content}}
      </div>
      <div v-if="dynamicDetailObject.fileList.length > 0" style="margin-bottom: 24rpx">
        <image-grid :images="dynamicDetailObject.fileList" size="30"></image-grid>
      </div>
      <div class="time-source">发布于{{$filters.formatDynamicPublishTime(dynamicDetailObject.createdTime)}} {{dynamicDetailObject.city || '未知'}}</div>
      <div class="drama" v-if="dynamicDetailObject.joinServiceCode === 'DRAMA_CODE'" >
        <div class="drama-img" @click="dramaDetailNavigator(dynamicDetailObject.dramaItem.id)">
          <image class="couno" :src="dynamicDetailObject.dramaItem.dramaCover" mode="aspectFill" />
          <image
              class="couverImg"
              v-if="dynamicDetailObject.sellType == 'REAL_SCENE'"
              :src="$iconFont.getIconName('liveAction')"
          />
          <image
              class="couverImg"
              v-if="dynamicDetailObject.sellType == 'LIMITED'"
              :src="$iconFont.getIconName('Citylimit')"
          />
          <image
              class="couverImg"
              v-if="dynamicDetailObject.sellType == 'EXCLUSIVE'"
              :src="$iconFont.getIconName('exclusive')"
          />
        </div>
        <div class="drama-text" >
          <div class="drama-name">
            <div class="name">{{ $filters.truncateText(dynamicDetailObject.dramaItem.dramaName, 8) }}</div>
            <div class="want" @click="changeLoveStatus(dynamicDetailObject)" :class="activeClass">
              <img :src="dynamicDetailObject.playStatus === 'WANT_PLAY' ? $iconFont.getIconName('aixin') : (dynamicDetailObject.playStatus === null ? $iconFont.getIconName('closeaixin') : '')" alt />
              <span>{{ dynamicDetailObject.playStatus === "WANT_PLAY" ? "已想玩" : (dynamicDetailObject.playStatus === null ? "我想玩" : "") }}</span>
            </div>
          </div>
          <div class="drama-type">
            {{dynamicDetailObject.dramaItem.maleGamerNum}}男{{dynamicDetailObject.dramaItem.femaleGamerNum}}女 {{dynamicDetailObject.dramaItem.gameTime}}小时 |
            <span class="dramatext" v-for="ite in dynamicDetailObject.dramaItem.dicts" :key="ite.id">{{ite.dictValue}}</span>
          </div>
        </div>
      </div>
      <div class="drama" v-if="dynamicDetailObject.joinServiceCode === 'STORE_CODE'" @click="storeDetailNavigator(dynamicDetailObject.storeItem.id)">
        <div class="drama-img-bang">
          <image class="couno-bang" :src="dynamicDetailObject.storeItem.storeLogo" @click="storeDetailNavigator(i.storeItem.id)" mode="aspectFill" />
        </div>
        <div class="drama-text" >
          <div class="drama-name">
            <div class="name">{{ $filters.truncateText(dynamicDetailObject.storeItem.storeName, 8) }}</div>
            <div>{{dynamicDetailObject.storeItem.districtName || ''}} | {{ $filters.metersTransferThousand(dynamicDetailObject.storeItem.distance) }}</div>
          </div>
          <div class="store-type">
            <span v-if="dynamicDetailObject.storeItem.evaluateItem.comprehensiveScore" class="evaluate-score">{{dynamicDetailObject.storeItem.evaluateItem.comprehensiveScore}}</span>
            <span v-else>暂无评</span>分
            <span style="margin: 0 10rpx">人气值{{dynamicDetailObject.storeItem.explosiveCount}} | </span>
            <span> {{dynamicDetailObject.storeItem.evaluateItem.recentTo || '0'}}近期去过</span>
          </div>
        </div>
      </div>
      <div class="drama" v-if="dynamicDetailObject.joinServiceCode === 'HOT_RANK' || dynamicDetailObject.joinServiceCode === 'PRAISE_RANK'
                                || dynamicDetailObject.joinServiceCode === 'GATHER_SUM_RANK' || dynamicDetailObject.joinServiceCode === 'FOCUS_RANK'" @click="rankListNavigator(dynamicDetailObject.joinServiceCode)">
        <div class="drama-img-bang">
          <image class="couno-bang" :src="$iconFont.getIconName('paihangbang')" mode="aspectFill" />
        </div>
        <div class="drama-text" >
          <div class="drama-name">
            <div class="name">
              <span v-if="dynamicDetailObject.joinServiceCode === 'HOT_RANK'">30天热榜</span>
              <span v-if="dynamicDetailObject.joinServiceCode === 'PRAISE_RANK'">口碑榜</span>
              <span v-if="dynamicDetailObject.joinServiceCode === 'GATHER_SUM_RANK'">人气总榜</span>
              <span v-if="dynamicDetailObject.joinServiceCode === 'FOCUS_RANK'">期待榜</span>
            </div>
          </div>
          <div class="drama-type">
            <span v-if="dynamicDetailObject.joinServiceCode === 'HOT_RANK'">根据30天内最多组局开玩降序排序</span>
            <span v-if="dynamicDetailObject.joinServiceCode === 'PRAISE_RANK'">根据总共最多推荐剧本降序排序</span>
            <span v-if="dynamicDetailObject.joinServiceCode === 'GATHER_SUM_RANK'">根据总共组局数量降序排序</span>
            <span v-if="dynamicDetailObject.joinServiceCode === 'FOCUS_RANK'">根据30天内最多想玩剧本降序排序</span>
          </div>
        </div>
      </div>
      <div class="drama" v-if="dynamicDetailObject.joinServiceCode === 'WITH_USER_CODE'">
        <div class="drama-img" @click="userDetailNavigator(dynamicDetailObject.withUserItem.id)">
          <div class="avatar">
            <image :src="dynamicDetailObject.withUserItem.avatar" mode="aspectFill" />
          </div>
        </div>
        <div class="drama-text" >
          <div class="drama-name">
            <div class="name">{{dynamicDetailObject.withUserItem.nickName}}</div>
            <div class="want">
              <div class="follow-gradient" v-if="dynamicDetailObject.withUserItem.id != userId" :class="{ already: dynamicDetailObject.withUserItem.isFocus }" @click="toggleFollowStatus({ isFocus: dynamicDetailObject.withUserItem.isFocus, focusUserId: dynamicDetailObject.withUserItem.id })">
                <div class="follow-confirm">{{ dynamicDetailObject.withUserItem.isFocus ? '已关注' : '+ 关注' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drama" v-if="dynamicDetailObject.joinServiceCode === 'ACTIVITY_CODE'" @click="activityDetailNavigator(dynamicDetailObject.activityPromotion.id)">
        <div class="drama-img">
          <image class="couno" :src="dynamicDetailObject.activityPromotion.activityImg" mode="aspectFill" />
        </div>
        <div class="drama-text" >
          <div class="drama-name">
            <div class="name">{{ $filters.truncateText(dynamicDetailObject.activityPromotion.activityName, 10)}}</div>
          </div>
          <div class="drama-type" v-text="$filters.truncateText(dynamicDetailObject.activityPromotion.contentText, 15)">
          </div>
        </div>
      </div>

      <div class="comment">
        <div class="title">最新评论  ({{newtotal}})</div>
        <!-- 评论内容 -->
        <view class="pinglunBox" v-for="(item, index) in commentList" :key="index">
          <image class="touxiang" :src="$filters.processLogo(item.avatar)"></image>
          <view class="textBox">
            <view class="title">{{ item.nickName || '' }}</view>
            <view class="text">{{ item.content || '' }}</view>
            <view class="time">{{ item.commentDate }}</view>
          </view>
        </view>
        <div class="comment-content" v-if="newtotal == 0"  >
          <div class="comment-null" >
            <img :src="$iconFont.getIconName('juyou-dynamic-detail-default')" mode="aspectFill" />
            <p class="p1">还没有人评论哦</p>
            <p class="p2">来发布第一个评论吧～</p>
          </div>
        </div>
      </div>
    </main>
    <!-- 底部 -->
    <view class="bottomBox">
      <view class="bottonBox" style="height: 8vh">
        <view class="inputBox">
          <view class="inputBox2" @click="addclickZkSS">
            <view class="text">展开说说吧...</view>
          </view>
          <view class="note_cover" v-if="focus"></view>
          <input-box v-if="focus"  :commit="focus" @submit="submitNote"
                     @blurCom="blurCom"></input-box>
        </view>
        <div style="position: relative; display: flex;">
          <image class="fenxiang" :src="$iconFont.getIconName('sharepl')" mode="heightFix"></image>
          <view class="fenxiang2">分享</view>
          <button open-type="share"/>
        </div>
        <view class="pingjiaBox" >
          <image class="pingjia" @click="addclickZkSS" :src="$iconFont.getIconName('pinglun')"></image>
          <view class="ingjia2">评价</view>
        </view>
        <view >
          <image class="dianzhan" @click="toggleImage(dynamicDetailObject)"   :src="dynamicDetailObject.isPraise === true ? $iconFont.getIconName('mzan') : $iconFont.getIconName('kzan')" alt=""></image>
        </view>
        <span class="num">{{$filters.quantityTransferThousand(dynamicDetailObject.praiseQuantity) != null ? $filters.quantityTransferThousand(dynamicDetailObject.praiseQuantity) : '点赞'}}</span>
      </view>
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
            v-if="userId !== dynamicDetailObject.userItem.id"
        >
          <image src="../static/image/icon-jubao.png" />
          <span>举报</span>
        </div>
        <div
            class="menu"
            @click="userDynamicPublishNavigator(userDynamicId)"
            v-if="userId === dynamicDetailObject.userItem.id"
        >
          <image src="../static/image/icon-edit.png" />
          <span>编辑</span>
        </div>
        <div
            class="menu"
            @click="deleteDynamic()"
            v-if="userId === dynamicDetailObject.userItem.id"
        >
          <image src="../static/image/icon-delete.png" />
          <span>删除</span>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service.js";
import inputBox from "../component/inputBox.vue";
import ImageGrid from "@/components/imageGrid/index.vue";
import {
  dramaDetailNavigator,
  storeDetailNavigator,
  activityDetailNavigator,
  userDetailNavigator,
  userDynamicPublishNavigator,
  rankListNavigator,
  discoverListNavigator,
} from "@/utils/navigator.js"
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
  components: {
    navigationBar,
    inputBox,
    ImageGrid
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
        bgBackground: "#fff",
        navTitle: '动态详情'
      },
      newtotal:0,
      userDynamicId:"",
      answer: null,
      parentId: null,
      praiseQuantity: null,
      content:null,
      focus: false,
      levelName:"",
      dynamicDetailObject: {},
      statusBarHeight: systemInfo.statusBarHeight,
      userId: null,
      recommendList: [],
      loveStatus: false,
      isComment: true,
      keywords: null,
      commentList: [],
      showCommentBox: false,
      showMore: false,
    };
  },
  computed: {
    loveImageUrl() {
      return this.loveStatus
          ? this.$iconFont.getIconName('aixin')
          : this.$iconFont.getIconName('closeaixin');
    },
    activeClass() {
      return this.loveStatus ? "active" : "";
    },
  },
  async onLoad(options) {
    if(options.scene){
      this.userDynamicId = options.scene;
    }
    if(options.id){
      this.userDynamicId = options.id;
    }
  },
  async onShow() {
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }
    
    uni.showLoading();

    this.showMore = false;
    let userInfo = await this.$checkLogin.getUserInfo();
    this.userId = userInfo.id;
    
    await this.dynamicDetail(this.userDynamicId);
    await this.queryDynamicCommentPage();
    uni.hideLoading();
  },
  onShareAppMessage() {
    return {
      title: this.$filters.truncateText(this.dynamicDetailObject.content, 50),
      path: `/dynamicDetail/pages/index?id=${this.dynamicDetailObject.id}`,
      imageUrl: this.dynamicDetailObject.fileList.length > 0 ? this.dynamicDetailObject.fileList[0] : this.$iconFont.getIconName('juyou-share-default'),
    };
  },
  onPageScroll(e) {

  },
  methods: {
    async toggleImage(i) {
      let status = "DISABLE";
      let dynamicType = 1;
      let dynamicId = i.userItem.id;
      if (i.isPraise == false) {
        status = "ENABLE";
      } else {
        status = "DISABLE";
      }
      try {
        await this.userPraiseDynamic(status, dynamicType, dynamicId);
        if (i.isPraise == false) {
          i.isPraise = true;
          i.praiseQuantity++;
        } else {
          i.isPraise = false;
          i.praiseQuantity--;
        }
        uni.setStorageSync('shouldRefresh', true);
      } catch (err) {
        console.log(err);
      }
    },
    //剧圈动态点赞
    async userPraiseDynamic(status, dynamicType, dynamicId) {
      try {
        let data = await this.$api.userPraiseDynamic({
          dynamicId: this.userDynamicId,
          dynamicType: dynamicType,
          statusEnum: status,
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    async toggleFollowStatus(item) {
      // 切换关注状态
      await this.updateUserFocus(item);
    },
    async updateUserFocus(i) {
      i.isFocus = !i.isFocus;
      try {
        let data = await this.$api.updateUserFocus({
          flag:i.isFocus,focusUserId:i.focusUserId,userId:this.userId
        });
        this.dynamicDetail(this.userDynamicId);
      } catch (e) {}
    },


    toggleCommentBox() {
      this.showCommentBox = !this.showCommentBox;
    },
    // 失焦，关闭软件盘
    blurCom() {
      console.log('失焦');
      this.focus = false
    },
    // 提交笔记
    async submitNote(val) {
      this.content = val
      await this.addUserDynamicComment()
       await this.queryDynamicCommentPage()
      this.pageNo = 1
      this.$nextTick(() => {
        this.focus = false
      })
    },
    addclickZkSS() {
      this.$nextTick(() => {
        this.focus = true
      }) //唤起软键盘
    },
    //发布评论
    async addUserDynamicComment() {
      try {
        let res = await service.addUserDynamicComment({
          content: this.content,
          userDynamicId: this.userDynamicId,
          userId: this.userId,
        });
      } catch (e) { }
    },
    dramaDetailNavigator,
    storeDetailNavigator,
    activityDetailNavigator,
    userDetailNavigator,
    userDynamicPublishNavigator,
    discoverListNavigator,
    rankListNavigator,
    //圈子-动态详情
    async dynamicDetail(id) {
      try {
        let data = await service.dynamicDetail({
          id: id,
          userId: this.userId,
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude")
        });
        this.dynamicDetailObject = data;
        if (data.userMemberLeve.levelName){
          this.levelName = data.userMemberLeve.levelName;
        }

      } catch (e) {
      }
    },
    //圈子-查询评论列表(分页)
    async queryDynamicCommentPage(id) {
      try {
        let data = await service.queryDynamicCommentPage({
          pageNo: 1,
          pageSize: 10,
          userDynamicId:this.userDynamicId
        });
        this.commentList = data.records;
        this.newtotal = data.total;
        console.log('2wangbin',this.commentList)

      } catch (e) {
      }
    },
    backRoute() {
      if (getCurrentPages().length === 1) {
        uni.switchTab({
          url: "/pages/index/index",
        });
      } else {
        uni.navigateBack();
      }
    },
    async changeLoveStatus(i) {
      if(i.playStatus == "WANT_PLAY"){
        i.playStatus = null
        await this.cancelUserDramaPlayMP(i);
        uni.setStorageSync('shouldRefresh', true);
      } else if(i.playStatus == null){
        i.playStatus = "WANT_PLAY"
        await this.updateUserDramaPlayMP(i);
        uni.setStorageSync('shouldRefresh', true);
      }
    },
    async cancelUserDramaPlayMP(i) {
      try {
        let data = await this.$api.cancelUserDramaPlayMP({
          dramaId: i.dramaId,
          playStatus: "WANT_PLAY",
          userId: this.userId,
        });
      } catch (e) {}
    },
    async updateUserDramaPlayMP(i) {
      try {
        let data = await this.$api.updateUserDramaPlayMP({
          dramaId: i.dramaId,
          playStatus: "WANT_PLAY",
          userId: this.userId,
        });
      } catch (e) {}
    },
    onSearch() {

    },
    onInputSearch() {

    },
    onFocus() {
      console.log('onFocus called');
      this.$refs.textInput.focus();
    },
    showMoreOperationClick() {
      this.showMore = !this.showMore;
    },
    deleteDynamic() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该条动态吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              await that.$api.deleteDynamic({
                id: that.dynamicDetailObject.id,
                userId: that.userId,
              });
              uni.setStorageSync('shouldRefresh', true);
              uni.navigateBack()
            } catch (e) {
              console.log(e)
            }
          }
        },
      });
    },
    reportDynamic() {
      uni.setStorageSync("reportPublish", {
        'avatar': this.dynamicDetailObject.userItem.avatar,
        'nickName': this.dynamicDetailObject.userItem.nickName,
        'content': this.dynamicDetailObject.content,
      })
      uni.setStorageSync("reportDetail", {
        'businessId': this.userDynamicId,
        'feedBusiness': 'DYNAMIC_CIRCLE'
      })
      uni.navigateTo({
        url: "/report/pages/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fixedBg {
  height: 100vh;
}

/deep/ .header {
  background: #FFFFFF;
}

.dynamic-container {
  background: #FFFFFF;
  height: 100vh;
}

.dynamic-main {
  padding: 0px 30rpx;
  background: #FFFFFF;

  .author-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;

    .author-left {
      display: flex;
      align-items: center;

      .avatar {
        width: 80rpx;
        height: 80rpx;
        background: #DAD9DC;
        margin-right: 20rpx;
        border-radius: 50%;

        .avaimg {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          border-radius: 50%;
        }
      }

      .text {
        .name {
          font-size: 30rpx;
          font-weight: 600;
          color: #2E323E;
          margin-bottom: 10rpx;
        }

        .source {
          font-size: 16rpx;

          .sp1 {
            display: inline-block;
            width: 70rpx;
            height: 26rpx;
            line-height: 26rpx;
            background: linear-gradient(90deg, #000000 0%, #333634 100%);
            border-radius: 98rpx 0 0 98rpx;
            color: #FFFFFF;
            text-align: center;
          }

          .sp2 {
            display: inline-block;
            width: 46rpx;
            height: 26rpx;
            line-height: 26rpx;
            background: linear-gradient(180deg, #FFFFFF 0%, #DBDBDB 69%);
            border-radius: 0 98rpx 98rpx 0;
            color: #000000;
            text-align: center;
          }
        }
      }
    }

    .author-right {
      display: flex;
      align-items: center;
      .oper {
        width: 42rpx;
        height: 42rpx;
      }
    }
  }

  .dynamic-description {
    font-size: 30rpx;
    color: #2E323E;
    line-height: 38rpx;
    margin-bottom: 30rpx;
    white-space: pre-wrap;
  }

  .dynamic-img {
    margin-bottom: 28rpx;
    display: flex;
    flex-wrap: wrap;

    image {
      border-radius: 12rpx;
    }

    &.one {
      image {
        width: 472rpx;
        // height: 630rpx;
      }
    }

    &.two {
      image {
        width: 232rpx;
        margin-right: 6rpx;

        &:nth-child(1) {
          border-radius: 12rpx 0 0 12rpx;
        }

        &:nth-child(2) {
          border-radius: 0 12rpx 0 12rpx;
        }
      }
    }

    &.multiple {
      image {
        width: 226rpx;
        margin-right: 6rpx;
        margin-bottom: 6rpx;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &:nth-child(1) {
          border-radius: 12rpx 0 0 0;
        }

        &:nth-child(3) {
          border-radius: 0 12rpx 0 0;
        }

        &:nth-child(7) {
          border-radius: 0 0 0 12rpx;
        }

        &:nth-child(9) {
          border-radius: 0 0 12rpx 0;
        }
      }
    }
  }

  .time-source {
    font-size: 24rpx;
    color: #959AA5;
    margin-bottom: 40rpx;
  }

  .drama {
    background: #F5F6F8;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    display: flex;
    align-items: center;
    height: 128rpx;
    margin-bottom: 28rpx;

    .drama-img {
      width: 96rpx;
      height: rpx(60);
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        border-radius: 12rpx;
      }
      .avatar {
        width: 64rpx;
        height: 64rpx;
        background: #DAD9DC;
        border-radius: 50%;

        image{
          border-radius: 50%;
        }
      }
    }
    .drama-img-bang{
      width: rpx(52);
      height: rpx(52);
      padding: rpx(6) 0 rpx(6) rpx(6);
      position:relative;
      display: flex;
      justify-content: center;
      .couverImg{
        position: absolute;
        left: 0rpx;
        top: 0rpx;
        width: 60rpx;
        height: 32rpx;
        border-radius: 12rpx;
      }
      .couno-bang {
        border-radius: 12rpx;
      }
    }
    .drama-text {
      flex: 1;
      padding: 22rpx 12rpx;

      .drama-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;

        .name {
          font-size: 28rpx;
          font-weight: 600;
          color: #2E323E;
        }

        .want {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: #959AA5;

          image {
            width: 36rpx;
            height: 36rpx;
            margin-right: 6rpx;
          }

          span {
            font-size: 26rpx;
            color: #959AA5;
          }

          &.active {
            span {
              color: #FA8E12;
            }
          }
        }
      }

      .drama-type {
        font-size: 24rpx;
        color: #959AA5;
        display: flex;
        .dramatext{
          letter-spacing: 0.6px;
          margin-left: 8rpx;
        }
      }
      .store-type {
        display: flex;
        height: 34rpx;
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #959AA5;
        line-height: 28rpx;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparen;

        .evaluate-score {
          height: 36rpx;
          font-size: 26rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #FF6300;
          margin-right: rpx(2);
        }
      }
    }
  }

  .comment {
    padding-top: 44rpx;
    border-top: 1px solid #F5F5F5;
    padding-bottom: 10vh;

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #2E323E;
    }
    .pinglunBox {
      display: flex;
      justify-content: flex-start;
      position: relative;
      // background-color: #B66440;

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
        color: #959AA5;
        margin-top: 50rpx;
        margin-left: 18rpx;
      }

      .text {
        font-size: 30rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2E323E;
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
        color: #2E323E;
        margin-left: 18rpx;
        margin-top: 14rpx;
        width: 480rpx;
        overflow: hidden;

        .huifu {
          font-size: 30rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #2E323E;
          white-space: nowrap
        }

        .otherperson {
          font-size: 30rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 350;
          color: #959AA5;
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
        color: #959AA5;
        padding-left: 18rpx;
        padding-top: 10rpx;
      }

      .dianzhanbox {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 34rpx;
        top: 44rpx;

        .num {
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959AA5;
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
    .comment-content {
      .comment-null {
        height: 400rpx;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        image {
          width: 120rpx;
          height: 120rpx;
          margin-bottom: 8rpx;
        }

        .p1 {
          width: 100%;
          font-size: 24rpx;
          color: #2E323E;
          margin-bottom: 8rpx;
        }

        .p2 {
          width: 100%;
          font-size: 24rpx;
          color: #959AA5;
        }
      }
    }
  }
}
.follow-gradient {
  width: 108rpx;
  height: 48rpx;
  background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);
  border-radius: 98rpx;
  padding: 4rpx 8rpx;
  margin-right: 40rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .follow-confirm {
    width: 100%;
    height: 44rpx;
    line-height: 44rpx;
    background: #111111;
    border-radius: 98rpx;
    font-size: 22rpx;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
  }

  &.already {
    background: #EBEBEB;

    .follow-confirm {
      background: #D6D6D6;
    }
  }
}
.bottomBox {
  position: fixed;
  left: 0;
  background: #FFFFFF;
  bottom: 0; /* 将底部设置为0，表示固定在底部 */
  width: 100%; /* 让它占满整个屏幕宽度 */
  box-sizing: border-box;
  z-index: 999; /* 可选：通过 z-index 控制堆叠顺序，确保在其他内容之上 */
  .bottonLine {
    width: 750rpx;
    background: #EBEBEB;
    border-radius: 0rpx 0rpx 0rpx 0rpx;
    opacity: 1;
    margin-top: 78rpx;
  }

  .bottonBox {
    display: flex;
    justify-content: flex-start;

    .inputBox {
      .inputBox2 {
        width: 246rpx;
        height: 66rpx;
        background: #F5F6F8;
        border-radius: 46rpx 46rpx 46rpx 46rpx;
        opacity: 1;
        margin-left: 32rpx;
        margin-top: 14rpx;
        display: flex;
        align-items: center;

        .text {
          margin-left: 24rpx;
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959AA5;
        }
      }
    }

    .fenxiang {
      height: 44rpx;
      width: 44rpx;
      margin-top: 24rpx;
      margin-left: 28rpx;
    }

    .fenxiang2 {
      margin-top: 26rpx;
      margin-left: 8rpx;
      margin-right: 40rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5F6572;
    }

    .pingjiaBox {
      display: flex;
      justify-content: flex-start;

      .ingjia2 {
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5F6572;
        margin-top: 26rpx;
      }
    }

    .pingjia {
      width: 44rpx;
      height: 44rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin-right: 8rpx;
      margin-top: 24rpx;
    }

    .num {
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5F6572;
      margin-top: 26rpx;
    }

    .dianzhan {
      width: 44rpx;
      height: 44rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin-left: 40rpx;
      margin-top: 24rpx;
      margin-right: 8rpx;
    }

    button {
      background: unset !important;
      @include abscenter;
    }
    button::after {
      border: none !important;
    }
  }
}


.dynamic-bottom {
  display: block;
  height: calc(94rpx + env(safe-area-inset-bottom));
  background: #FFFFFF;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0rpx -3rpx 4rpx 0rpx #EBEBEB;

  .fixed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20rpx auto 0 auto;
    width: calc(100% - 60rpx);

    input {
      width: 202rpx;
      height: 54rpx;
      border-radius: 94rpx;
      background: #F5F6F8;
      text-align: center;
    }

    .flex {
      display: flex;
      align-items: center;
    }

    img {
      width: 26rpx;
      height: 26rpx;
      margin-right: 6rpx;
    }

    p {
      font-size: 24rpx;
      color: #5F6572;
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
</style>