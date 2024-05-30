<template>
  <view>
    <div class="discover-container">
      <div class="fixedBg"></div>
      <navigation-bar :nav="customNav">
        <view slot="left">
          <view class="topNav">
            <van-tabs :active="tabsActive" swipeable @change="changeTabs">
              <van-tab
                  v-for="(item, index) in tabsList"
                  :key="index"
                  :name="item"
                  :title="item"
              ></van-tab>
            </van-tabs>
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
      <main class="discover-main">
        <div class="main-recommend" v-if="queryDynamicWithDramaPageList.length">
          <div class="recommend-list" v-for="(i,_) in queryDynamicWithDramaPageList" :key="_">
            <div class="author-info">
              <div class="author-left">
                <div class="avatar" @click="userDetailNavigator(i.createUserId)">
                  <image :src="i.avatar" mode="aspectFill"/>
                </div>
                <div class="text" @click="userDynamicDetailNavigator(i.id)">
                  <div class="name">{{i.nickName}}</div>
                  <div class="time-source"> {{ $filters.formatDynamicPublishTime(i.createdTime) }}发布于{{i.city || '未知'}}</div>
                </div>
              </div>
              <div class="author-right">
                <div class="oper" @click="showMoreOperationClick(i)">
                  <img src="../static/image/oper.png" alt="">
                </div>
              </div>
            </div>
            <div class="list-content">
              <div class="list-description" :class="i.overFlowOpen && 'hide'">
                <div style="white-space: pre-wrap" @click="userDynamicDetailNavigator(i.id)">
                  {{i.content || ''}}
                </div>
                <div class="tips" v-if="i.isOmit" :class="!i.overFlowOpen && 'expand'" @click="showinfo(i)">{{!i.overFlowOpen ? '收起' : '...全文'}}</div>
              </div>
              <div v-if="i.fileList.length > 0">
                <image-grid :images="i.fileList" size="25.8"></image-grid>
              </div>
              <div class="drama" v-if="i.joinServiceCode === 'DRAMA_CODE'" @click="userDynamicDetailNavigator(i.id)">
                <div class="drama-img">
                  <image class="couno" :src="i.dramaItem.dramaCover" mode="aspectFill" />
                  <image
                      class="couverImg"
                      v-if="i.sellType == 'REAL_SCENE'"
                      :src="$iconFont.getIconName('liveAction')"
                  />
                  <image
                      class="couverImg"
                      v-if="i.sellType == 'LIMITED'"
                      :src="$iconFont.getIconName('Citylimit')"
                  />
                  <image
                      class="couverImg"
                      v-if="i.sellType == 'EXCLUSIVE'"
                      :src="$iconFont.getIconName('exclusive')"
                  />
                </div>
                <div class="drama-text" >
                  <div class="drama-name">
                    <div class="name" v-if="i.dramaItem">{{ $filters.truncateText(i.dramaItem.dramaName, 12) }}</div>
                    <div class="want" @click="changeLoveStatus(i)" :class="activeClass">
                      <img :src="i.playStatus === 'WANT_PLAY' ? $iconFont.getIconName('aixin') : (i.playStatus === null ? $iconFont.getIconName('closeaixin') : '')" alt />
                      <span>{{ i.playStatus === "WANT_PLAY" ? "已想玩" : (i.playStatus === null ? "我想玩" : "") }}</span>
                    </div>
                  </div>
                  <div class="drama-type">
                    {{i.dramaItem.maleGamerNum}}男{{i.dramaItem.femaleGamerNum}}女 {{i.dramaItem.gameTime}}小时 |
                    <span class="dramatext" v-for="ite in i.dramaItem.dicts" :key="ite.id">{{ite.dictValue}}</span>
                  </div>
                </div>
              </div>
              <div class="drama" v-if="i.joinServiceCode === 'STORE_CODE'"  @click="userDynamicDetailNavigator(i.id)">
                <div class="drama-img-bang">
                  <image class="couno-bang" :src="i.storeItem.storeLogo" @click="storeDetailNavigator(i.storeItem.id)" mode="aspectFill" />
                </div>
                <div class="drama-text" >
                  <div class="drama-name">
                    <div class="name">{{ $filters.truncateText(i.storeItem.storeName, 8) }}</div>
                    <div style="color: #5F6572;" class="mr10">{{i.storeItem.districtName || ''}} | {{ $filters.metersTransferThousand(i.storeItem.distance) }}</div>
                  </div>
                  <div class="store-type">
                    <span v-if="i.storeItem.evaluateItem.comprehensiveScore" class="evaluate-score">{{i.storeItem.evaluateItem.comprehensiveScore}}</span>
                    <span v-else>暂无评</span>分
                    <span style="margin: 0 10rpx">人气值{{i.storeItem.explosiveCount}} | </span>
                    <span> {{i.storeItem.evaluateItem.recentTo || '0'}}近期去过</span>
                  </div>
                </div>
              </div>
              <div class="drama" v-if="i.joinServiceCode === 'HOT_RANK' || i.joinServiceCode === 'PRAISE_RANK'
                                  || i.joinServiceCode === 'GATHER_SUM_RANK' || i.joinServiceCode === 'FOCUS_RANK'"  @click="userDynamicDetailNavigator(i.id)">
                <div class="drama-img-bang">
                  <image class="couno-bang" :src="$iconFont.getIconName('paihangbang')" mode="aspectFill" />
                </div>
                <div class="drama-text" >
                  <div class="drama-name">
                    <div class="name">
                      <span v-if="i.joinServiceCode === 'HOT_RANK'">30天热榜</span>
                      <span v-if="i.joinServiceCode === 'PRAISE_RANK'">口碑榜</span>
                      <span v-if="i.joinServiceCode === 'GATHER_SUM_RANK'">人气总榜</span>
                      <span v-if="i.joinServiceCode === 'FOCUS_RANK'">期待榜</span>
                    </div>
                  </div>
                  <div class="drama-type">
                    <span v-if="i.joinServiceCode === 'HOT_RANK'">根据30天内最多组局开玩降序排序</span>
                    <span v-if="i.joinServiceCode === 'PRAISE_RANK'">根据总共最多推荐剧本降序排序</span>
                    <span v-if="i.joinServiceCode === 'GATHER_SUM_RANK'">根据总共组局数量降序排序</span>
                    <span v-if="i.joinServiceCode === 'FOCUS_RANK'">根据30天内最多想玩剧本降序排序</span>
                  </div>
                </div>
              </div>
              <div class="drama" v-if="i.joinServiceCode === 'WITH_USER_CODE'">
                <div class="drama-img" @click="userDynamicDetailNavigator(i.id)">
                  <div class="avatar">
                    <image :src="i.withUserItem.avatar" mode="aspectFill" />
                  </div>
                </div>
                <div class="drama-text" >
                  <div class="drama-name">
                    <div class="name">{{i.withUserItem.nickName}}</div>
                    <div class="want">
                      <div class="follow-gradient" v-if="i.withUserItem.id != userId" :class="{ already: i.withUserItem.isFocus }" @click="toggleFollowStatus(i.withUserItem)">
                        <div class="follow-confirm">{{ i.withUserItem.isFocus ? '已关注' : '+ 关注' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="drama" v-if="i.joinServiceCode === 'ACTIVITY_CODE'"  @click="userDynamicDetailNavigator(i.id)">
                <div class="drama-img">
                  <image class="couno" :src="i.activityPromotion.activityImg" mode="aspectFill" />
                </div>
                <div class="drama-text" >
                  <div class="drama-name">
                    <div class="name">{{ $filters.truncateText(i.activityPromotion.activityName, 10)}}</div>
                  </div>
                  <div class="drama-type" v-text="$filters.truncateText(i.activityPromotion.contentText, 15)">
                  </div>
                </div>
              </div>
              <div class="list-bottom">
                <input
                  placeholder="说说你的想法..."
                  disabled
                  @click="userDynamicDetailNavigator(i.id)"
                />
                <view class="flex" style="position: relative" @click="shareDynamicChoose(i)">
                    <img :src="$iconFont.getIconName('sharepl')" alt="">
                    <p>分享</p>
                    <button open-type="share"/>
                </view>
                <view class="flex">
                    <img  @click="toggleImage(i)"  :src="i.isPraise === true ? $iconFont.getIconName('mzan') : $iconFont.getIconName('kzan')" alt="">
                    <p v-text="$filters.quantityTransferThousand(i.praiseQuantity) != null ? $filters.quantityTransferThousand(i.praiseQuantity) : '点赞' "></p>
                </view>
                <view class="flex" @click="userDynamicDetailNavigator(i.id)">
                    <img :src="$iconFont.getIconName('pinglun')" alt="">
                    <p v-text="$filters.quantityTransferThousand(i.commentQuantity) != null ? $filters.quantityTransferThousand(i.commentQuantity) : '评论' "></p>
                </view>
              </div>
            </div>
            <van-action-sheet
                :show="i.showMore"
                :safe-area-inset-bottom="false"
                z-index="1000"
                close-on-click-overlay
                @close="showMoreOperationClick(i)"
                title="更多"
            >
              <div class="popBox">
                <div
                    class="menu"
                    @click="reportDynamic(i)"
                    v-if="userId !== i.createUserId"
                >
                  <image src="../static/image/icon-jubao.png" />
                  <span>举报</span>
                </div>
                <div
                    class="menu"
                    @click="userDynamicPublishNavigator(i.id)"
                    v-if="userId === i.createUserId"
                >
                  <image src="../static/image/icon-edit.png" />
                  <span>编辑</span>
                </div>
                <div
                    class="menu"
                    @click="deleteDynamic(i, _)"
                    v-if="userId === i.createUserId"
                >
                  <image src="../static/image/icon-delete.png" />
                  <span>删除</span>
                </div>
              </div>
            </van-action-sheet>
          </div>
        </div>
        <notcData noteImg="trendsImage" position="absolute" note="暂时还没有发布过动态" top="10vh" v-else/>
      </main>
      <div class="fix-side" @click="gofixSideImageUrl">
        <image :src="fixSideImageUrl" alt="" />
      </div>
    </div>
  </view>
</template>

<script>
import navigationBar from "@/components/navigation-bar";
import ImageGrid from "@/components/imageGrid/index.vue";
import notcData from "@/components/notc-data/index.vue";
import {
  userDetailNavigator,
  userDynamicDetailNavigator,
  userDynamicPublishNavigator,
} from "@/utils/navigator.js"

// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
  components: { navigationBar, ImageGrid, notcData },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
        bgBackground: "#fff",
      },
      currentPage: 1,
      userId: uni.getStorageSync("userInfo").id,
      isRefreshing: false,
      queryDynamicWithDramaPageList:[],
      queryDynamicWithDramaTotal:0,
      statusBarHeight: systemInfo.statusBarHeight,
      tabsList: ["关注", "推荐", "同城"],
      tabsActive: "推荐",
      recommendList: [],
      searchValue: "",
      loveStatus: false,
      iSinfo: false,
      timer: null,
      isFixSideImg: true,
      imageList:[],
      shareDynamicItem: null
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
    fixSideImageUrl() {
      return this.isFixSideImg
          ? this.$iconFont.getIconName('add')
          : this.$iconFont.getIconName('add-scroll');
    },
  },
  async onLoad() {
    let userInfo = await this.$checkLogin.getUserInfo();
    this.userId = userInfo.id;

    wx.hideShareMenu({
      success: function () {}
    })

    this.cityInfo = await this.$checkLogin.requestAuthorize();
    await this.queryDynamicWithDramaPage('RECOMMEND')
    await this.refresh();
  },
  async onShow() {
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }
    
    if(uni.getStorageSync('shouldRefresh')){
      this.currentPage = 1;
      this.refresh();
      uni.removeStorageSync('shouldRefresh')
    }
  },
  onShareAppMessage() {
    return {
      title: this.$filters.truncateText(this.shareDynamicItem.content, 50),
      path: `/dynamicDetail/pages/index?id=${this.shareDynamicItem.id}`,
      imageUrl: this.shareDynamicItem.fileList.length > 0 ? this.shareDynamicItem.fileList[0] : this.$iconFont.getIconName('juyou-share-default'),
    };
  },
  onReachBottom() {
    if (this.queryDynamicWithDramaPageList.length < this.queryDynamicWithDramaTotal) {
      this.currentPage++;
      this.refresh();
    } else {
      uni.showToast({
        title: "没有更多数据",
        icon: "none",
        duration: 2000,
      });
    }
  },
  onPageScroll(e) {
    clearTimeout(this.timer) // 每次滚动前 清除一次
    this.isFixSideImg = false
    this.timer = setTimeout(() => { 
    this.isFixSideImg = true; 
    }, 500);
  },
  methods: {
    userDetailNavigator,
    userDynamicDetailNavigator,
    userDynamicPublishNavigator,
    backRoute() {
      uni.navigateBack();
    },
    async refresh(){
      uni.showLoading({
        title: "加载中",
      });
      let dynamicCode;
      let cityId;
      switch(this.tabsActive) {
        case '同城':
          dynamicCode = 'SAME_CITY';
          cityId = uni.getStorageSync("cityInfo").cityId;
          break;
        case '关注':
          dynamicCode = 'FOCUS';
          break;
        case '推荐':
          dynamicCode = 'RECOMMEND';
          break;
      }
      await this.queryDynamicWithDramaPage(dynamicCode, cityId);
    },
    //动态点赞
    async toggleImage(i) {
      let status = "DISABLE";
      let dynamicType = 1;
      let dynamicId = i.id;
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
      } catch (err) {
        console.log(err);
      }
    },
    //剧圈动态点赞
    async userPraiseDynamic(status, dynamicType, dynamicId) {
      try {
        await this.$api.userPraiseDynamic({
          dynamicId: dynamicId,
          dynamicType: dynamicType,
          statusEnum: status,
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    //动态
    async queryDynamicWithDramaPage(dynamicType, cityId) {
      try {
        if (this.currentPage === 1) {
          this.queryDynamicWithDramaPageList = [];
        }
        let data = await this.$api.queryDynamicWithDramaPage({
          pageNo: this.currentPage,
          pageSize: 10,
          queryType: dynamicType,
          regionId: cityId || undefined,
          userId: uni.getStorageSync("userInfo").id,
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude")
        });
        this.queryDynamicWithDramaTotal = data.total;
        const maxLen = 80;
        const newline = 2;
        var dataList = data.records.map(item => {
          let isOmit = false;
          let overFlowOpen = true;
          if (item.joinServiceCode === 'WITH_USER_CODE') {
            item.withUserItem.createUserId = item.withUserItem.id;
          }
          if (item.content) {
            const rowTexts = item.content.split(/\n/) // 每行的内容
            // 超出最大行数
            if (rowTexts.length > newline) {
              isOmit = true
            }
            // 超出最大字数
            if (item.content.length > maxLen) {
              isOmit = true
            }
          }
          return {
            ...item,
            isOmit,
            overFlowOpen,
            showMore: false,
          };
        });

        this.queryDynamicWithDramaPageList = [
          ...this.queryDynamicWithDramaPageList,
          ...dataList,
        ];


        uni.hideLoading();
      } catch (e) {
        console.log(e)
        uni.hideLoading();
      }
    },
    // 切换关注状态
    async toggleFollowStatus(item) {
      await this.updateUserFocus(item);
    },
    async updateUserFocus(i) {
      i.isFocus = !i.isFocus;
      try {
        await this.$api.updateUserFocus({
          flag:i.isFocus,focusUserId:i.createUserId,userId:this.userId
        });

        this.queryDynamicWithDramaPageList.forEach((item) => {
          if (item.createUserId === i.createUserId) {
            item.isFocus = i.isFocus;
          }
        });
      } catch (e) {}
    },
    gofixSideImageUrl() {
      uni.navigateTo({
        url: "/dynamicDetail/pages/postupdates"
      });
    },
    // tabs切换触发
    changeTabs(e) {
      this.tabsActive = e.target.name;

      this.currentPage = 1;
      this.queryDynamicWithDramaPageList = []
      this.refresh();
    },
    changeLoveStatus(i) {
      // i.playStatus = !i.playStatus;
      if(i.playStatus == "WANT_PLAY"){
        i.playStatus = null
        this.cancelUserDramaPlayMP(i);
      } else if(i.playStatus == null){
        i.playStatus = "WANT_PLAY"
        this.updateUserDramaPlayMP(i);
      }
      this.$nextTick(() => {
        this.queryDynamicWithDramaPageList.forEach((item) => {
          if (item.dramaId === i.dramaId) {
            item.playStatus = i.playStatus;
          }
        });
      });
    },
    async updateUserDramaPlayMP(i) {
      try {
        await this.$api.updateUserDramaPlayMP({
          dramaId: i.dramaId,
          playStatus: "WANT_PLAY",
          userId: this.userId,
        });
      } catch (e) {}
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
    // 全文展开收起
    showinfo(i) {
      i.overFlowOpen = !i.overFlowOpen;
    },
    showMoreOperationClick(item) {
      item.showMore = !item.showMore;
    },
    deleteDynamic(item, index) {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该条动态吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              await that.$api.deleteDynamic({
                id: item.id,
                userId: that.userId,
              });
              that.queryDynamicWithDramaPageList.splice(index, 1);
            } catch (e) {
              console.log(e)
            }
          }
        },
      });
    },
    reportDynamic(item) {
      uni.setStorageSync("reportPublish", item)
      uni.setStorageSync("reportDetail", {
        'businessId': item.id,
        'feedBusiness': 'DYNAMIC_CIRCLE'
      })
      uni.navigateTo({
        url: "/report/pages/index",
      });
    },
    shareDynamicChoose(i) {
      this.shareDynamicItem = i;
    }
  },
};
</script>
<style lang="scss" scoped>
.topNav {
  display: flex;
  align-items: center; /* 这将确保所有子元素在交叉轴上居中对齐 */
  justify-content: space-between; /* 这将在子元素之间提供等距的间隔 */
}
 /deep/  van-icon {
  order: -1; /* 这将确保返回图标始终在左侧 */
}

.discover-container {
  padding-bottom: env(safe-area-inset-bottom);
}
.fixedBg {
  height: 100vh;
}
/deep/.header {
  background: #FFFFFF;
}
/deep/.header-left {
  padding: 20rpx 0!important;
}
/deep/ .van-ellipsis {
  z-index: 10 ;
}
/deep/.van-tabs {
  width: 392rpx;
  padding-bottom: 10rpx;
}
/deep/.van-tab {
  font-size: 32rpx;
  color: #959AA5;
  padding: 0;
}
/deep/.van-tabs__line {
  width: 96rpx!important;
  height: 16rpx;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  background: #36E4BB;
  bottom: 20%!important;
  z-index: 0.5;
}
/deep/.van-tab--active {
  font-size: 44rpx;
  font-weight: 600;
  color: #2E323E;
}
.main-recommend {
  padding: 32rpx;
  background: #FFFFFF;
}
.follow-gradient {
  width: 108rpx;
  height: 48rpx;
  background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);
  border-radius: 98rpx;
  padding: 4rpx 8rpx;
  box-sizing: border-box;
  // margin-right: 20rpx;
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
.recommend-list {
  margin-bottom: 34rpx;
  .author-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
    .author-left {
      display: flex;
      align-items: center;
      .avatar {
        width: 80rpx;
        height: 80rpx;
        background: #DAD9DC;
        margin-right: 20rpx;
        border-radius: 50%;
        image{
          border-radius: 50%;
        }
      }
      .text {
        .name {
          font-size: 30rpx;
          font-weight: 600;
          color: #2E323E;
          margin-bottom: 12rpx;
        }
        .time-source {
          font-size: 22rpx;
          color: #959AA5;
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
  .list-content {
    margin-left: 92rpx;
    .list-description {
      font-size: 28rpx;
      color: #2E323E;
      line-height: 38rpx;
      margin-bottom: 10rpx;
      position: relative;
      &.hide {
        word-break: break-word; //换行模式
        overflow: hidden;
        text-overflow: ellipsis; //修剪文字，超过2行显示省略号
        display: -webkit-box;
        -webkit-line-clamp: 2; //此处为上限行数
        -webkit-box-orient: vertical;
      }
      .tips {
        width: 90rpx;
        height: 40rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #4876AE;
        background: #FFFFFF;
        position: absolute;
        bottom: 0;
        right: 0;
        &.expand {
          position: initial;
          width: auto;
          display: flex;
          flex: 1;
          justify-content: flex-end;
        }
      }
    }
    .list-img {
      margin-bottom: 24rpx;
      display: flex;
      flex-wrap: wrap;
      image {
        border-radius: 24rpx;
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
            border-radius: 24rpx 0 0 24rpx;
          }
          &:nth-child(2) {
            border-radius: 0 24rpx 0 24rpx;
          }
        }
      }
      &.multiple {
        image {
          width: 194rpx;
          margin-right: 6rpx;
          margin-bottom: 6rpx;
          &:nth-child(3n) {
            margin-right: 0;
          }
          &:nth-child(1) {
            border-radius: 24rpx 0 0 0;
          }
          &:nth-child(3) {
            border-radius: 0 24rpx 0 0;
          }
          &:nth-child(7) {
            border-radius: 0 0 0 24rpx;
          }
          &:nth-child(9) {
            border-radius: 0 0 24rpx 0;
          }
        }
      }
    }
    .drama {
      background: #F5F6F8;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      height: 128rpx;
      margin-top: rpx(12);
      // margin-bottom: rpx(13);
      .drama-img {
        width: 96rpx;
        height: 128rpx;
        position:relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .couverImg{
          position: absolute;
          left: 0rpx;
          top: 0rpx;
          width: 60rpx;
          height: 32rpx;
        }
        .couno {
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
        padding: 22rpx 0px 22rpx 12rpx;
        .drama-name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10rpx;
          .name {
            font-size: 28rpx;
            font-weight: 600;
            color: #2E323E;
            @include text-overflow-line(1);
            width: 40%;
          }
          .want {
            display: flex;
            align-items: center;
            font-size: 26rpx;
            color: #959AA5;
            margin-right: 20rpx;
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
          align-content: center;
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
    .list-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: rpx(12);
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
      button {
        background: unset !important;
        @include abscenter;
      }
      button::after {
        border: none !important;
      }
    }
  }
}
.fix-side {
  position: fixed;
  z-index: 99;
  right: 0;
  bottom: 12vh;
  image {
    width: 82rpx;
    height: 120rpx;
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