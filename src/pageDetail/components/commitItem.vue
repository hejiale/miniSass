<template>
  <div class="commit-item">
    <div class="avatar-container">
      <img
        class="avatar"
        :src="commitList.avatar"
        alt=""
        @click="userDetailNavigator(commitList.createUserId)"
      />
      <div v-if="userId != commitList.userId" @click.stop="onFocus(commitList)">
        <div class="avatar-focus" v-if="commitList.isFocus == false">+</div>
        <div class="avatar-hasFocus" v-if="commitList.isFocus == true">
          已关注
        </div>
      </div>
    </div>
    <!-- 右侧评论区域 -->
    <div class="right-commit-area">
      <div class="name-vip" @click="addClickJBRP(commitList)">
        <div class="flex">
          <span class="name">{{ $filters.truncateText(commitList.nickName, 7) }}</span>
        </div>
        <span class="commit-ctx">{{
          $dayjs(commitList.evaluateTime).format('MM.DD HH:mm')
        }}</span>
      </div>

      <div class="time-status">
        <span class="status">
          <div v-for="item in commitList.scoreList" :key="item.id">
            {{ item.dictValue }}:{{ item.score / 10 }}
          </div>

          <!--情感9 历史9 惊悚8-->
        </span>
        <span class="evaluation-content" v-if="commitList.hasGathered == true"
          >通过剧游组局评价</span
        >
      </div>
      <view @click="addClickJBRP(commitList)">
        <p class="content-commit">
          {{ $filters.truncateText(commitList.nickName, 7) }}评价这部剧本：
          <span v-if="commitList.dramaEvaluateType == 'SO_SO'">
            <img
              class="image"
              :src="$iconFont.getIconName('general-facial-expressions')"
              alt=""
            />
            一般</span
          >
          <span v-else-if="commitList.dramaEvaluateType == 'RECOMMEND'">
            <img
              class="image"
              :src="$iconFont.getIconName('recommended-emoji')"
              alt=""
            />
            推荐</span
          >
          <span v-else-if="commitList.dramaEvaluateType == 'NOT_GOOD'">
            <img
              class="image"
              :src="$iconFont.getIconName('no-expression')"
              alt=""
            />
            不行</span
          >
        </p>
        <p
          class="content-commit-min mt2"
          v-if="
            commitList.evaluateStringType.deduce != null &&
            commitList.evaluateStringType.deduce != ''
          "
        >
          剧本演绎： {{ commitList.evaluateStringType.deduce }}
        </p>
        <p
          class="content-commit-min mt2"
          v-if="
            commitList.evaluateStringType.plot != null &&
            commitList.evaluateStringType.plot != ''
          "
        >
          剧本情节： {{ commitList.evaluateStringType.plot }}
        </p>
        <p
          class="content-commit-min mt2"
          v-if="
            commitList.evaluateStringType.story != null &&
            commitList.evaluateStringType.story != ''
          "
        >
          剧情故事： {{ commitList.evaluateStringType.story }}
        </p>
        <p
          class="content-commit-min mt2"
          v-if="
            commitList.evaluateStringType.substance != null &&
            commitList.evaluateStringType.substance != ''
          "
        >
          剧本内容： {{ commitList.evaluateStringType.substance }}
        </p>
        <div class="content-commit-min mt10" :class="isOpen ? '' : 'overflowLine'">
          {{ commitList.content }}
          <div
          class="content-commit-min-openBox"
          v-if="commitList.content.length > 80"
          @click.stop="onFold"
        >
          {{ isOpen ? "收起" : "...展开" }}
        </div>
        </div>
      </view>
      <div class="experience-ctx">
        <div class="default role" v-if="commitList.roleName">
          <img class="image" :src="$iconFont.getIconName('myava')" alt="" />
          <span>体验角色：{{ $filters.truncateText(commitList.roleName, 7) }}</span>
        </div>
        <div class="default shop" v-if="commitList.storeName" @click="onGoStoreDetail">
          <img class="image" :src="$iconFont.getIconName('dianpu')" alt="" />
          <span>{{ $filters.truncateText(commitList.storeName, 7) }}</span>
          <img class="icon" :src="$iconFont.getIconName('arrowright')" alt="" />
        </div>
      </div>
      <div v-if="commitList.imageList.length > 0" class="mt10">
        <image-grid :images="commitList.imageList" size="25"></image-grid>
      </div>
      <view class="like-sharing">
        <view class="flex" @click="addClickJBRP(commitList)">
          <img :src="$iconFont.getIconName('sharepl')" alt="" />
          <p>分享</p>
        </view>
        <view class="flex"  @click="toggleImage(commitList)">
          <img
            :src="
              commitList.hasFabulous === true
                ? $iconFont.getIconName('mzan')
                : $iconFont.getIconName('kzan')
            "
            alt=""
          />
          <p
            v-text="
              $filters.quantityTransferThousand(commitList.praiseQuantity) != null
                ? $filters.quantityTransferThousand(commitList.praiseQuantity)
                : '点赞'
            "
          ></p>
        </view>
        <view class="flex" @click="addClickJBRP(commitList)">
          <img :src="$iconFont.getIconName('pinglun')" alt="" />
          <p>评论{{ commitList.nowCommentCount }}</p>
        </view>
        <view class="flex" @click="showMoreOperationClick(commitList)">
          <img
            style="width: 14rpx; height: 34rpx"
            src="../static/image/moreOptions.png"
            alt=""
          />
        </view>
      </view>
    </div>

    <van-action-sheet
      :show="showMore"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @close="showMoreOperationClick(commitList)"
      title="更多"
    >
      <div class="popBox">
        <div
          class="menu"
          @click="reportDynamic(commitList)"
          v-if="userId != commitList.userId"
        >
          <image src="../static/image/icon-jubao.png" />
          <span>举报</span>
        </div>
        <div
          class="menu"
          @click="dramaReviewEditor(commitList.evaluateId)"
          v-if="userId == commitList.userId"
        >
          <image src="../static/image/icon-edit.png" />
          <span>编辑</span>
        </div>
        <div
          class="menu"
          @click="deleteDynamic(commitList)"
          v-if="userId == commitList.userId"
        >
          <image src="../static/image/icon-delete.png" />
          <span>删除</span>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import {
  userDetailNavigator,
  userDynamicPublishNavigator,
} from "@/utils/navigator.js";
import ImageGrid from "@/components/imageGrid/index.vue";
export default {
  components: { ImageGrid },
  props: {
    commitList: {
      type: Object,
      default() {
        return null;
      },
    },
    queryAppDramaDetailList: {
      type: Object,
      default() {
        return null;
      },
    },
    userId: {
      type: String,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      showMore: false,
      isOpen: false
    };
  },
  methods: {
    userDetailNavigator,
    userDynamicPublishNavigator,
    userDetailUrl(id) {
      let url = `/my-package/pages/trends/index?userId=${id}`;
      // 使用uni.navigateTo进行跳转
      uni.navigateTo({
        url: url,
      });
    },
    dramaReviewEditor(item) {
      uni.setStorageSync('editDrama', {
        dramaCover: this.queryAppDramaDetailList.dramaCover,
        dramaId: this.queryAppDramaDetailList.id,
        dramaName: this.queryAppDramaDetailList.dramaName,
        evaluateId: item,
        edit: 2
      });
      uni.navigateTo({
        url: `/pageDetail/pages/index`,
      });
    },
    addClickJBRP(item) {
      console.log("----------->剧本热评", item);
      uni.navigateTo({
        url: `/pageDetail/pages/scriptReview?userId=${item.userId}&evaluateId=${item.evaluateId}&dramaId=${item.dramaId}`,
      });
    },
    reportDynamic(commitList) {
      uni.setStorageSync("reportPublish", commitList);
      uni.setStorageSync("reportDetail", {
        businessId: commitList.evaluateId,
        feedBusiness: "DYNAMIC_CIRCLE",
      });
      uni.navigateTo({
        url: "/report/pages/index",
      });
    },
    onFold() {
      this.isOpen = !this.isOpen;
    },
    async deleteDynamic(commitList) {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该条剧评吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              let data = await that.$api.deleteDramaEvaluate({
                dramaId: commitList.dramaId,
                id: commitList.evaluateId,
              });
              that.$emit("update:deleteCommit");
              that.showMore = false;
            } catch (e) {
              console.log(e);
            }
          }
        },
      });
    },
    //动态点赞
    async toggleImage(i) {
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
        console.log("232", i.hasFabulous);
        this.$emit("update:praise", {
          dynamicId: dynamicId,
          newHasFabulous: !this.commitList.hasFabulous,
          newPraiseQuantity:
            this.commitList.praiseQuantity +
            (this.commitList.hasFabulous ? -1 : 1),
        });
      } catch (err) {
        console.log(err);
      }
    },
    showMoreOperationClick(commitList) {
      this.showMore = !this.showMore;
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
    async onFocus(i) {
      console.log("3wcc", i);
      try {
        let userInfo = await this.$checkLogin.getUserInfo();
        this.$emit("on-update", {
          isFocus: !this.commitList.isFocus,
          focusUserId: this.commitList.userId,
          userId: userInfo.id,
        });
      } catch (e) {}
    },
    //跳转店铺详情
    onGoStoreDetail(){
      uni.navigateTo({
        url: `/store-package/pages/index?storeId=${this.commitList.storeId}`
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.commit-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-bottom: 52rpx;
  .avatar-container {
    position: relative;
    display: inline-block; /* 或者 'flex'，根据需要调整 */
    margin-right: 16rpx; /* 从.avatar移至这里 */
  }

  .avatar {
    width: 84rpx;
    height: 84rpx;
    border-radius: 50%;
  }

  .avatar-focus {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 36rpx;
    height: 26rpx;
    background: #36e4bb;
    border-radius: 28px;
    font-size: 22rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 19rpx;
    left: 50%; /* 水平居中 */
    transform: translate(-50%, -50%); /* 微调位置，使其垂直居中 */
  }
  .avatar-hasFocus {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 56rpx;
    height: 26rpx;
    background: #36e4bb;
    border-radius: 28px;
    font-size: 16rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 19rpx;
    left: 50%; /* 水平居中 */
    transform: translate(-50%, -50%); /* 微调位置，使其垂直居中 */
  }

  .right-commit-area {
    width: calc(100% - 100rpx);
    display: flex;
    flex-direction: column;

    .name-vip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .flex {
        display: flex;
        align-items: center;
      }
      .name {
        font-size: 30rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        margin-right: 6rpx;
      }

      .vip {
        display: flex;
        align-items: center;
        width: 116rpx;
        height: 26rpx;
        line-height: 26rpx;
        border-radius: 13rpx;
        border: 1rpx solid #ffb2b0;
        span {
          width: 48rpx;
          display: inline-block;
          font-size: 16rpx;
          font-family: FZZhengHeiS-B-GB-Regular, FZZhengHeiS-B-GB;
          font-weight: 400;
          color: #ff557a;
          background: #fff2f0;
          border-radius: 0 13rpx 13rpx 0;
          text-align: center;
          &:first-child {
            width: 68rpx;
            color: #fff;
            background: linear-gradient(90deg, #ff946c 0%, #ff5479 100%);
            border-radius: 13rpx 0 0 13rpx;
          }
        }
      }

      .commit-ctx {
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        line-height: 28rpx;
      }
    }

    .time-status {
      margin-top: 10rpx;
      margin-bottom: 18rpx;
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #959aa5;
      .status {
        display: flex;
        margin-top: 6rpx;
        font-size: 22rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        line-height: 26rpx;
        div {
          width: 84rpx;
          margin-right: 12rpx;
        }
      }
    }

    .content-commit {
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      line-height: 33rpx;
      margin-bottom: 24rpx;
    }
    .image {
      width: 40rpx;
      height: 40rpx;
    }
    .content-commit-min {
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      line-height: 40rpx;
      position: relative;
      word-break: break-all;
      &-openBox {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #4876ae;
        background: #fff;
        height: 42rpx;
        display: flex;
        flex-direction: column-reverse;
      }
    }
    .overflowLine {
        @include text-overflow-line(2);
      }

    .experience-ctx {
      display: flex;
      margin-top: 18rpx;

      .default {
        padding: 10rpx 10rpx 8rpx;
        font-size: 22rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #5f6572;
        line-height: 26rpx;
        border-radius: 23rpx;
        border: 1rpx solid #cdd1d5;
        display: flex;
        align-items: center;
        margin-right: 18rpx;
        .image {
          width: 27rpx;
          height: 27rpx;
          margin-right: 6rpx;
        }
        .icon {
          margin-left: 6rpx;
          width: 12rpx;
          height: 20rpx;
        }
      }
    }
    .like-sharing {
      margin-top: 40rpx;
      display: flex;
      .flex {
        display: flex;
        align-items: center;
      }
      .flex:nth-child(1) {
        margin-left: 20rpx;
      }
      .flex:nth-child(1),
      .flex:nth-child(2),
      .flex:nth-child(3) {
        margin-right: 12.8vw;
      }
      img {
        width: 32rpx;
        height: 32rpx;
        margin-right: 6rpx;
      }
      p {
        font-size: 24rpx;
        color: #5f6572;
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