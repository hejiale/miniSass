<template>
  <view>
    <view class="discover-main" v-if="queryDynamicWithDramaPageList.length">
      <div
        class="recommend-list"
        v-for="(i, idx) in queryDynamicWithDramaPageList"
        :key="idx"
      >
        <div class="author-info" @click="gotoDynamicDetail(i)">
          <div class="author-left">
            <div class="avatar">
              <image :src="i.avatar" mode="aspectFill" />
            </div>
            <div class="text">
              <div class="name">{{ i.nickName }}</div>
              <div class="time-source">
                {{ i.createDate }}发布于{{ i.city || "未知" }}
              </div>
            </div>
          </div>
        </div>
        <div class="list-content">
          <div
            class="list-description"
            :class="!iSinfo ? 'hide' : ''"
            @click="gotoDynamicDetail(i)"
            v-if="i.content"
          >
            {{ i.content }}
            <div
              class="tips"
              :class="iSinfo && 'expand'"
              @click.stop="showinfo"
              v-if="moreLine(i.content)"
            >
              {{ iSinfo ? "收起" : "...全文" }}
            </div>
          </div>
          <image-grid :images="i.fileList" size="26.2"></image-grid>
          <div class="drama" v-if="i.joinServiceCode === 'DRAMA_CODE'">
            <div class="drama-img">
              <image
                class="couno"
                :src="i.dramaItem.dramaCover"
                mode="aspectFill"
              />
              <image
                class="couverImg"
                v-if="i.dramaItem.sellType == 'REAL_SCENE'"
                :src="$iconFont.getIconName('liveAction')"
              />
              <image
                class="couverImg"
                v-if="i.dramaItem.sellType == 'LIMITED'"
                :src="$iconFont.getIconName('Citylimit')"
              />
              <image
                class="couverImg"
                v-if="i.dramaItem.sellType == 'EXCLUSIVE'"
                :src="$iconFont.getIconName('exclusive')"
              />
            </div>
            <div class="drama-text">
              <div class="drama-name">
                <div class="name" v-if="i.dramaItem">
                  {{ $filters.truncateText(i.dramaItem.dramaName, 12) }}
                </div>
                <div
                  class="want"
                  @click="changeLoveStatus(i)"
                  :class="activeClass"
                >
                  <img
                    :src="
                      i.playStatus === 'WANT_PLAY'
                        ? $iconFont.getIconName('aixin')
                        : i.playStatus === null
                        ? $iconFont.getIconName('closeaixin')
                        : ''
                    "
                    alt
                  />
                  <span>{{
                    i.playStatus === "WANT_PLAY"
                      ? "已想玩"
                      : i.playStatus === null
                      ? "我想玩"
                      : ""
                  }}</span>
                </div>
              </div>
              <div class="drama-type">
                {{ i.dramaItem.maleGamerNum }}男{{
                  i.dramaItem.femaleGamerNum
                }}女 {{ i.dramaItem.gameTime }}小时 |
                <span
                  class="dramatext"
                  v-for="ite in i.dramaItem.dicts"
                  :key="ite.id"
                  >{{ ite.dictValue }}</span
                >
              </div>
            </div>
          </div>
          <div class="drama" v-if="i.joinServiceCode === 'STORE_CODE'">
            <div class="drama-img-bang">
              <image
                class="couno-bang"
                :src="i.storeItem.storeLogo"
                @click="storeDetailNavigator(i.storeItem.id)"
                mode="aspectFill"
              />
            </div>
            <div class="drama-text">
              <div class="drama-name">
                <div class="name">
                  {{ $filters.truncateText(i.storeItem.storeName, 8) }}
                </div>
                <div style="color: #5f6572">
                  {{ i.storeItem.districtName || "" }} |
                  {{ $filters.metersTransferThousand(i.storeItem.distance) }}
                </div>
              </div>
              <div class="store-type">
                <span
                  v-if="i.storeItem.evaluateItem.comprehensiveScore"
                  class="evaluate-score"
                  >{{ i.storeItem.evaluateItem.comprehensiveScore }}</span
                >
                <span v-else>暂无评</span>分
                <span style="margin: 0 10rpx"
                  >人气值{{ i.storeItem.explosiveCount }} |
                </span>
                <span>
                  {{ i.storeItem.evaluateItem.recentTo || "0" }}近期去过</span
                >
              </div>
            </div>
          </div>
          <div
            class="drama"
            v-if="
              i.joinServiceCode === 'HOT_RANK' ||
              i.joinServiceCode === 'PRAISE_RANK' ||
              i.joinServiceCode === 'GATHER_SUM_RANK' ||
              i.joinServiceCode === 'FOCUS_RANK'
            "
          >
            <div class="drama-img-bang">
              <image
                class="couno-bang"
                :src="$iconFont.getIconName('paihangbang')"
                mode="aspectFill"
              />
            </div>
            <div class="drama-text">
              <div class="drama-name">
                <div class="name">
                  <span v-if="i.joinServiceCode === 'HOT_RANK'">30天热榜</span>
                  <span v-if="i.joinServiceCode === 'PRAISE_RANK'">口碑榜</span>
                  <span v-if="i.joinServiceCode === 'GATHER_SUM_RANK'"
                    >人气总榜</span
                  >
                  <span v-if="i.joinServiceCode === 'FOCUS_RANK'">期待榜</span>
                </div>
              </div>
              <div class="drama-type">
                <span v-if="i.joinServiceCode === 'HOT_RANK'"
                  >根据30天内最多组局开玩降序排序</span
                >
                <span v-if="i.joinServiceCode === 'PRAISE_RANK'"
                  >根据总共最多推荐剧本降序排序</span
                >
                <span v-if="i.joinServiceCode === 'GATHER_SUM_RANK'"
                  >根据总共组局数量降序排序</span
                >
                <span v-if="i.joinServiceCode === 'FOCUS_RANK'"
                  >根据30天内最多想玩剧本降序排序</span
                >
              </div>
            </div>
          </div>
          <div class="drama" v-if="i.joinServiceCode === 'WITH_USER_CODE'">
            <div class="drama-img">
              <div class="avatar">
                <image :src="i.avatar" mode="aspectFill" />
              </div>
            </div>
            <div class="drama-text">
              <div class="drama-name">
                <div class="name">{{ i.nickName }}</div>
                <div class="want">
                  <div
                    class="follow-gradient"
                    v-if="i.createUserId != userInfo.id"
                    :class="{ already: i.isFocus }"
                    @click="toggleFollowStatus(i)"
                  >
                    <div class="follow-confirm">
                      {{ i.isFocus ? "已关注" : "+ 关注" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="drama" v-if="i.joinServiceCode === 'ACTIVITY_CODE'">
            <div class="drama-img">
              <image
                class="couno"
                :src="i.activityPromotion.activityImg"
                mode="aspectFill"
              />
            </div>
            <div class="drama-text">
              <div class="drama-name">
                <div class="name">
                  {{
                    $filters.truncateText(i.activityPromotion.activityName, 10)
                  }}
                </div>
              </div>
              <div
                class="drama-type"
                v-text="
                  $filters.truncateText(i.activityPromotion.contentText, 15)
                "
              ></div>
            </div>
          </div>
          <div class="list-bottom">
            <input
              placeholder="说说你的想法..."
              disabled
              @click="gotoDynamicDetail(i)"
            />
            <view class="flex">
              <img :src="$iconFont.getIconName('sharepl')" alt="" />
              <p>分享{{ i.shareQuantity || 0 }}</p>
              <button open-type="share" @click="onShare(i)" />
            </view>
            <view class="flex" @click.stop="toggleImage(idx)">
              <img
                :src="
                  i.isPraise === true
                    ? $iconFont.getIconName('mzan')
                    : $iconFont.getIconName('kzan')
                "
                alt=""
              />
              <p>点赞{{ i.praiseQuantity || 0 }}</p>
            </view>
            <view class="flex" @click="gotoDynamicDetail(i)">
              <img :src="$iconFont.getIconName('pinglun')" alt="" />
              <p>评论{{ i.commentQuantity || 0 }}</p>
            </view>
          </div>
        </div>
        <div class="oper" @click="onEditDynamic(i)">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </view>
    <div class="empty-recommend" v-else>
      <notcData
        noteImg="trendsImage"
        position="absolute"
        note="暂时还没有发布过动态"
        top="10vh"
      />
    </div>
    <van-action-sheet
      :show="showPop"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showPop = false"
      title="更多"
      @close="showPop = false"
    >
      <div class="popBox">
        <div
          class="menu"
          @click="onEdit"
          v-if="editDynamic.createUserId === userInfo.id"
        >
          <image src="../static/image/icon-edit.png" />
          <span>编辑</span>
        </div>
        <div
          class="menu"
          @click="onReport"
          v-if="editDynamic.createUserId !== userInfo.id"
        >
          <image src="../static/image/icon-jubao.png" />
          <span>举报</span>
        </div>
        <div class="menu" @click="removeDynamic" v-else>
          <image src="../static/image/icon-delete.png" />
          <span>删除</span>
        </div>
      </div>
    </van-action-sheet>
  </view>
</template>
<script>
import ImageGrid from "@/components/imageGrid/index";
import notcData from "@/components/notc-data/index.vue";
import { windowWidth } from "@/utils";
import service from "../utils/service";
import {
  userDetailNavigator,
  userDynamicDetailNavigator,
  userDynamicPublishNavigator,
} from "@/utils/navigator.js";
export default {
  props: {
    userId: {
      type: Number,
      default: null,
    },
  },
  components: { ImageGrid, notcData },
  data() {
    return {
      currentPage: 1,
      queryDynamicWithDramaPageList: [],
      iSinfo: false,
      screenWidth: 0,
      showPop: false,
      editDynamic: null,
      userInfo: null,
    };
  },
  async created() {
    this.screenWidth = await windowWidth();
  },
  computed: {
    moreLine() {
      return function (words) {
        if (!words) return false;

        let width = this.screenWidth * 0.8;
        let number = width / 14;
        if (words.length / number > 2) {
          return true;
        } else {
          return false;
        }
      };
    },
  },
  methods: {
    userDetailNavigator,
    userDynamicDetailNavigator,
    userDynamicPublishNavigator,
    //分享
    onShare(e) {
      this.$emit("shareDynamic", e);
    },
    onEdit() {
      uni.navigateTo({
        url: `/dynamicDetail/pages/postupdates?id=${this.editDynamic.id}`,
      });
    },
    //加载更多
    loadMore() {
      this.currentPage++;
      this.queryDynamicWithDramaPage();
    },
    //动态点赞
    async toggleImage(idx) {
      let item = JSON.parse(
        JSON.stringify(this.queryDynamicWithDramaPageList[idx])
      );

      try {
        await this.$api.userPraiseDynamic({
          dynamicId: item.id,
          dynamicType: 1,
          statusEnum: item.isPraise ? "DISABLE" : "ENABLE",
        });
        //刷新该条数据
        if (this.queryDynamicWithDramaPageList[idx].isPraise) {
          this.queryDynamicWithDramaPageList[idx].isPraise = false;
          this.queryDynamicWithDramaPageList[idx].praiseQuantity--;
        } else {
          this.queryDynamicWithDramaPageList[idx].isPraise = true;
          this.queryDynamicWithDramaPageList[idx].praiseQuantity++;
        }

        console.log(this.queryDynamicWithDramaPageList);
      } catch (err) {
        console.log(err);
      }
    },
    //动态
    async queryDynamicWithDramaPage() {
      try {
        this.userInfo = await this.$checkLogin.getUserInfo();

        let data = await this.$api.queryDynamicWithDramaPage({
          pageNo: this.currentPage,
          pageSize: 10,
          queryType: "SELF",
          userId: this.userInfo.id,
          publishUserId: this.userId,
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude"),
        });
        if (this.currentPage === 1) {
          this.queryDynamicWithDramaPageList = [];
        }
        if (data.records && data.records.length) {
          this.queryDynamicWithDramaPageList.push(...data.records);
        }

        uni.hideLoading();
      } catch (e) {
        uni.hideLoading();
      }
    },
    async toggleFollowStatus(item) {
      // 切换关注状态
      await this.updateUserFocus(item);
    },
    async updateUserFocus(i) {
      i.isFocus = !i.isFocus;
      try {
        await this.$api.updateUserFocus({
          flag: i.isFocus,
          focusUserId: i.createUserId,
          userId: this.userInfo.id,
        });
        this.queryDynamicWithDramaPage(); // 更新关注状态后刷新数据
        this.queryDynamicWithDramaPageList.forEach((item) => {
          if (item.createUserId === i.createUserId) {
            item.isFocus = i.isFocus;
          }
        });
      } catch (e) {}
    },
    // 全文展开收起
    showinfo() {
      this.iSinfo = !this.iSinfo;
    },
    gotoDynamicDetail(item) {
      uni.navigateTo({
        url: `/dynamicDetail/pages/index?id=${item.id}`,
      });
    },
    onEditDynamic(item) {
      this.editDynamic = item;
      this.showPop = true;
    },
    //删除
    removeDynamic() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该条动态吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              await service.deletDynamic({
                id: that.editDynamic.id,
                userId: that.userId,
              });
              let idx = that.queryDynamicWithDramaPageList.findIndex(
                (v) => v.id === that.editDynamic.id
              );
              that.queryDynamicWithDramaPageList.splice(idx, 1);

              that.showPop = false;
              that.editDynamic = null;
            } catch (e) {
              console.log(e);
            }
          }
        },
      });
    },
    //举报
    onReport() {
      this.showPop = false;
      uni.setStorageSync("reportPublish", this.editDynamic);
      uni.setStorageSync("reportDetail", {
        businessId: this.editDynamic.id,
        feedBusiness: "DYNAMIC_CIRCLE",
      });
      uni.navigateTo({
        url: "/report/pages/index",
      });
    },
    //想玩已完
    async changeLoveStatus(i) {
      if(i.playStatus == "WANT_PLAY"){
        i.playStatus = null
        await this.cancelUserDramaPlayMP(i);
      } else if(i.playStatus == null){
        i.playStatus = "WANT_PLAY"
        await this.updateUserDramaPlayMP(i);
      }
    },
    async cancelUserDramaPlayMP(i) {
      try {
        await this.$api.cancelUserDramaPlayMP({
          dramaId: i.dramaId,
          playStatus: "WANT_PLAY",
          userId: this.userInfo.id,
        });
      } catch (e) {}
    },
    async updateUserDramaPlayMP(i) {
      try {
        await this.$api.updateUserDramaPlayMP({
          dramaId: i.dramaId,
          playStatus: "WANT_PLAY",
          userId: this.userInfo.id,
        });
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.discover-container {
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
.discover-main {
  background: #fff;
  padding: 44rpx 0rpx;
  margin: 0 20rpx;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  min-height: 50vh;
}
.empty-recommend {
  background: #ffffff;
  height: 60vh;
}
.recommend-list {
  margin-bottom: 34rpx;
  position: relative;
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
        background: #dad9dc;
        margin-right: 20rpx;
        border-radius: 50%;

        image {
          border-radius: 50%;
        }
      }

      .text {
        .name {
          font-size: 30rpx;
          font-weight: 600;
          color: #2e323e;
          margin-bottom: 10rpx;
        }

        .time-source {
          font-size: 22rpx;
          color: #959aa5;
        }
      }
    }
  }
  .list-content {
    margin-left: 13.86vw;
    position: relative;
    .list-description {
      font-size: 28rpx;
      color: #2e323e;
      line-height: 38rpx;
      margin-bottom: 10rpx;
      position: relative;

      &.hide {
        @include text-overflow-line(2);
      }

      .tips {
        width: 90rpx;
        height: 40rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #4876ae;
        background: #ffffff;
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
    }

    .drama {
      background: #f5f6f8;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      height: 128rpx;
      margin-bottom: rpx(13);
      margin-top: 24rpx;
      .drama-img {
        width: 96rpx;
        height: 128rpx;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .couverImg {
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
          background: #dad9dc;
          border-radius: 50%;

          image {
            border-radius: 50%;
          }
        }
      }
      .drama-img-bang {
        width: rpx(52);
        height: rpx(52);
        padding: rpx(6) 0 rpx(6) rpx(6);
        position: relative;
        display: flex;
        justify-content: center;
        .couverImg {
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
            color: #2e323e;
            word-break: break-all;
            width: 50%;
          }
          .want {
            display: flex;
            align-items: center;
            font-size: 26rpx;
            color: #959aa5;
            image {
              width: 36rpx;
              height: 36rpx;
              margin-right: 6rpx;
            }
            span {
              font-size: 26rpx;
              color: #959aa5;
            }
            &.active {
              span {
                color: #fa8e12;
              }
            }
          }
        }
        .drama-type {
          font-size: 24rpx;
          color: #959aa5;
          display: flex;
          align-content: center;
          .dramatext {
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
          color: #959aa5;
          line-height: 28rpx;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparen;

          .evaluate-score {
            height: 36rpx;
            font-size: 26rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            color: #ff6300;
            margin-right: rpx(2);
          }
        }
      }
    }

    .list-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 28rpx;
      input {
        width: 202rpx;
        height: 54rpx;
        border-radius: 94rpx;
        background: #f5f6f8;
        text-align: center;
      }

      .flex {
        display: flex;
        align-items: center;
        position: relative;
        button {
          @include abscenter;
          background: unset !important;
        }
        button::after {
          border: none !important;
        }
      }

      img {
        width: 26rpx;
        height: 26rpx;
        margin-right: 6rpx;
      }

      p {
        font-size: 24rpx;
        color: #5f6572;
      }
    }
  }
  .oper {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 64rpx;
    height: 64rpx;
    @include hor-center-center;
    div {
      width: 8rpx;
      height: 8rpx;
      border-radius: 50%;
      background: #959aa5;
      margin-right: 8rpx;
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
  height: 24vh;
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