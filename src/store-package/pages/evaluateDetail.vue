<template>
  <div class="container" v-if="endLoad">
    <div
      class="backBox"
      :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
      @click="onBack"
    >
      <van-icon name="arrow-left" color="#111" size="24" />
    </div>
    <div
      class="title"
      :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
    >
      店铺评价详情
    </div>
    <div class="titleBox">
      <div class="titleBox-left">
        <image
          :src="evaluateDetail.avatar"
          mode="aspectFill"
          class="titleBox-left-avatar"
        />
        <div class="titleBox-left-info">
          <span>{{ evaluateDetail.nickName || '' }}</span>
        </div>
      </div>
      <div class="titleBox-right">
        <div v-if="userInfo.id !== evaluateDetail.userId">
          <image
            src="../static/image/icon-has-focus.png"
            class="titleBox-right-focus"
            @click="evaluateRequest"
            v-if="evaluateDetail.focusId"
          />
          <image
            src="../static/image/icon-focus.png"
            class="titleBox-right-focus"
            @click="evaluateRequest"
            v-else
          />
        </div>
        <div class="titleBox-right-more" @click="onDoMore">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    <scroll-view scroll-y class="container-scrollBox">
      <div class="comment">{{ evaluateDetail.comment }}</div>
      <div class="status">
        <div class="status-left">
          <span class="status-left-storeName">{{ evaluateDetail.nickName || '' }}</span>
          <span class="status-left-note">评价这家店铺：</span>
          <image :src="status" class="status-left-tag" />
          <span class="status-left-tagText">{{
            statusText(evaluateDetail.summarizeEvaluate)
          }}</span>
        </div>
        <div class="status-right">
          <span
            >环境{{ evaluateDetail.environmentScore }} 服务{{
              evaluateDetail.serviceScore
            }}
            DM{{ evaluateDetail.dmScore }}</span
          >
        </div>
      </div>
      <div class="imageGridBox">
        <imageGrid :images="images" size="30.13"/>
      </div>
      <div class="dateBox">
        <span
          >发布于{{
            $dayjs(evaluateDetail.updatedTime).format("YYYY年MM月DD日")
          }}
          {{ $dayjs(evaluateDetail.updatedTime).format("HH:mm") }}
        </span>
        <span>{{ evaluateDetail.cityName }}</span>
        <div v-if="evaluateDetail.hasGathered"></div>
        <span v-if="evaluateDetail.hasGathered">通过剧游组局评价</span>
      </div>
      <div
        class="dramaBox"
        v-if="evaluateDetail.dramaDetailVo"
        @click="onGoDramaDetail"
      >
        <image
          :src="evaluateDetail.dramaDetailVo.dramaCover"
          class="dramaBox-cover"
          mode="aspectFill"
        />
        <span class="dramaBox-title">{{
          evaluateDetail.dramaDetailVo.dramaName
        }}</span>
        <div class="dramaBox-dictBox">
          <span
            >{{ evaluateDetail.dramaDetailVo.maleGamerNum }}男{{
              evaluateDetail.dramaDetailVo.femaleGamerNum
            }}女</span
          >
          <span>{{ evaluateDetail.dramaDetailVo.gameTime }}小时</span>
          <div></div>
          <span>{{ dictValue(evaluateDetail.dramaDetailVo.dicts) }}</span>
        </div>
        <div v-if="evaluateDetail.dramaDetailVo.playStatus !== 'HAS_PLAY'">
          <image
            src="../static/image/has-want-play.png"
            class="wantPlay"
            @click.stop="cancelPlayerWantPlay"
            v-if="evaluateDetail.dramaDetailVo.playStatus"
          />
          <image
            src="../static/image/want-play.png"
            class="wantPlay"
            @click.stop="addPlayerWantPlay"
            v-else
          />
        </div>
        <image
          :src="sellType(evaluateDetail.dramaDetailVo.sellType)"
          v-if="sellType(evaluateDetail.dramaDetailVo.sellType)"
          class="dramaBox-sellType"
        />
        <BindPhone
          v-if="!userInfo.phone"
          ref="BindPhone"
          @on-success-authorize="onRefreshUserInfo"
        />
      </div>
      <div class="dmBox" v-if="evaluateDetail.dmuserInfo.id">
        <image
          :src="evaluateDetail.dmuserInfo.avatar"
          class="dmBox-cover"
          mode="aspectFill"
        />
        <span>{{ evaluateDetail.dmuserInfo.nickName || "" }}</span>
        <image src="../static/image/icon-avater.png" class="dmBox-tag" />
      </div>
      <div style="height: 40px"></div>
    </scroll-view>
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
        <div class="menu" @click="onGoPoster">
          <image src="../static/image/upload-image.png" />
          <span>生成海报</span>
        </div>
        <div class="menu">
          <image src="../static/image/share-wechat.png" />
          <span>微信好友</span>
          <button open-type="share" @click.stop="showPop = false" />
        </div>
        <div
          class="menu"
          @click="onJubao"
          v-if="userInfo.id !== evaluateDetail.userId"
        >
          <image src="../static/image/icon-jubao.png" />
          <span>举报</span>
        </div>
        <div
          class="menu"
          @click="onEdit"
          v-if="userInfo.id === evaluateDetail.userId"
        >
          <image src="../static/image/icon-edit.png" />
          <span>编辑</span>
        </div>
        <div
          class="menu"
          @click="onDelete"
          v-if="userInfo.id === evaluateDetail.userId"
        >
          <image src="../static/image/icon-delete.png" />
          <span>删除</span>
        </div>
      </div>
    </van-action-sheet>
    <poster v-if="isShowPoster" :isShowPoster.sync="isShowPoster" :storeInfo="storeInfo"/>
  </div>
</template>
<script>
import {
  getMenuButtonRect
} from "@/utils/index";
import service from "../utils/service";
import BindPhone from "../../components/bindPhone/index.vue";
import poster from "../components/poster.vue";
import imageGrid from "@/components/imageGrid/index.vue";
export default {
  components: { BindPhone, poster, imageGrid },
  data() {
    return {
      menuRect: null,
      evaluateDetail: null,
      userInfo: null,
      showPop: false,
      endLoad: false,
      isShowPoster: false,
      canDo: false,
      storeInfo: null,
      canvasImgPortrait: false,
      canvasBg: null
    };
  },
  async onLoad(options) {
    this.evaluateId = options.id;
    this.menuRect = await getMenuButtonRect();
  },
  async onShow(){
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.queryEvaluateDetail();
  },
  computed: {
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
    dictValue() {
      return function (dicts) {
        let arr = dicts.map((v) => v.dictValue);
        return arr.join(" ");
      };
    },
    status() {
      if (!this.evaluateDetail) return "";
      if (this.evaluateDetail.summarizeEvaluate === "RECOMMEND") {
        return "../static/image/evaluate-nice.png";
      } else if (this.evaluateDetail.summarizeEvaluate === "SO_SO") {
        return "../static/image/evaluate-normal.png";
      } else {
        return "../static/image/evaluate-no.png";
      }
    },
    statusText() {
      return function (status) {
        if (status === "RECOMMEND") {
          return "超棒";
        } else if (status === "SO_SO") {
          return "一般";
        } else {
          return "不行";
        }
      };
    },
    images(){
      if(!this.evaluateDetail) return [];
      return this.evaluateDetail.attachments.map(v=>v.fileUrl);
    }
  },
  onShareAppMessage() {
    return {
      title: this.storeInfo.storeName,
      path: `/store-package/pages/evaluateDetail?id=${this.evaluateDetail.id}`,
      imageUrl: this.storeInfo.storeLogo
    };
  },
  methods: {
    onBack() {
      if (getCurrentPages().length === 1) {
        uni.switchTab({
          url: "/pages/index/index",
        });
      } else {
        uni.navigateBack();
      }
    },
    //刷新用户信息
    async onRefreshUserInfo() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
    //查询评价详情
    async queryEvaluateDetail() {
      try {
        this.evaluateDetail = await service.evaluateDetail({
          id: this.evaluateId,
        });
        this.queryStoreInfo(this.evaluateDetail.storeId);
        this.endLoad = true;
      } catch (e) {}
    },
    //关注
    async evaluateRequest() {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      if(this.canDo)return;
      this.canDo = true;

      try {
        await service.updateUserFocus({
          flag: this.evaluateDetail.focusId ? false : true,
          focusUserId: this.evaluateDetail.userId,
          userId: this.userInfo.id,
        });
        this.queryEvaluateDetail();
        this.canDo = false;
      } catch (e) {
        this.canDo = false;
      }
    },
    onDoMore() {
      if (!this.userInfo.phone) {
        this.$refs.BindPhone.onAuthorize();
        return;
      }
      this.showPop = true;
    },
    //举报
    async onJubao() {
      this.showPop = false;
      uni.setStorageSync("evaluateDetail", this.evaluateDetail);

      uni.navigateTo({
        url: "./report",
      });
    },
    //想玩
    async addPlayerWantPlay() {
      if (!this.userInfo.phone) {
        return;
      }
      if(this.canDo)return;
      this.canDo = true;

      try {
        await service.updateUserDramaPlayMP({
          playStatus: "WANT_PLAY",
          userId: this.userInfo.id,
          dramaId: this.evaluateDetail.dramaDetailVo.id,
        });
        this.queryEvaluateDetail();
        this.canDo = false;
      } catch (e) {
        this.canDo = false;
      }
    },
    //取消想玩
    async cancelPlayerWantPlay() {
      if(this.canDo)return;
      this.canDo = true;

      try {
        await service.cancelUserDramaPlayMP({
          playStatus: "WANT_PLAY",
          userId: this.userInfo.id,
          dramaId: this.evaluateDetail.dramaDetailVo.id,
        });
        this.queryEvaluateDetail();
        this.canDo = false;
      } catch (e) {
        this.canDo = false;
      }
    },
    onGoDramaDetail() {
      if (!this.userInfo.phone) {
        return;
      }
      uni.navigateTo({
        url: `/pageDetail/pages/pageDetail?id=${this.evaluateDetail.dramaDetailVo.id}`,
      });
    },
    //编辑
    onEdit() {
      this.showPop = false;
      uni.setStorageSync("store-info", this.storeInfo);
      uni.navigateTo({
        url: `./evaluate?id=${this.evaluateDetail.id}`,
      });
    },
    //删除
    onDelete() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该条评价吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              await service.evaluateOperation({
                id: that.evaluateDetail.id,
                status: "DISABLE",
                storeId: that.evaluateDetail.storeId
              });
              uni.navigateBack();
            } catch (e) {
              console.log(e)
            }
          }
        },
      });
    },
    //生成海报
    async onGoPoster(){
      this.showPop = false;
      this.isShowPoster = true;
    },
    //查询店铺信息
    async queryStoreInfo(storeId){
      try{
        this.storeInfo = await this.$api.getStoreHome({
          storeId,
          userId: this.userInfo.id,
        });
      }catch(e){

      }
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  height: 100vh;
  &-scrollBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 17.85vh;
  }
}
.backBox {
  position: fixed;
  left: 24rpx;
  @include ver;
  justify-content: center;
  z-index: 1;
}
.title {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  @include ver;
  justify-content: center;
  z-index: 1;
  font-size: 26rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #000000;
  line-height: 30rpx;
}
.titleBox {
  position: fixed;
  left: 32rpx;
  right: 0rpx;
  top: 192rpx;
  @include hor-between-center;
  &-left {
    @include hor;
    align-items: center;
    width: 70%;
    &-info {
      @include ver;
      align-items: center;
      margin-left: 18rpx;
      max-width: 80%;
      span {
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        line-height: 30rpx;
        @include text-overflow-line(1);
      }
      &-tag {
        width: 116rpx;
        height: 26rpx;
        margin-top: 4rpx;
      }
    }
    &-avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 64rpx;
    }
  }
  &-right {
    @include hor;
    align-items: center;
    position: relative;
    &-focus {
      width: 108rpx;
      height: 52rpx;
    }
    &-more {
      @include hor;
      align-items: center;
      margin-left: 20rpx;
      padding: 20rpx;
      div {
        width: 8rpx;
        height: 8rpx;
        background: #959aa5;
        border-radius: 8rpx;
        margin-right: 8rpx;
      }
    }
  }
}
.comment {
  font-size: 30rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #2e323e;
  line-height: 36rpx;
  padding: 0rpx 30rpx 0 30rpx;
  word-break: break-all;
}
.status {
  margin: 30rpx;
  padding: 18rpx 30rpx;
  background: #fff6ea;
  border-radius: 6px;
  border: 1px solid rgba(182, 100, 64, 0.2);
  @include hor-between-center;
  &-left {
    width: 68%;
    @include hor;
    align-items: center;
    &-storeName {
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #b66440;
      @include text-overflow-line(1);
      max-width: 25%;
    }
    &-note{
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #b66440;
    }
    &-tag {
      width: 40rpx;
      height: 40rpx;
    }
    &-tagText {
      margin-left: 8rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #b66440;
    }
  }
  &-right {
    @include hor;
    align-items: center;
    span {
      font-size: 20rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #b66440;
    }
  }
}
.imageGridBox{
  margin: 30rpx;
}
.dateBox {
  margin: 28rpx 30rpx 0 30rpx;
  @include hor;
  align-items: center;
  font-size: 24rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #959aa5;
  line-height: 28rpx;
  span:nth-child(2) {
    margin-left: 10rpx;
  }
  div:nth-child(3) {
    width: 1px;
    height: 22rpx;
    background: #d9d9d9;
    margin: 0 10rpx;
  }
}
.dramaBox {
  margin: 40rpx 30rpx 0 30rpx;
  width: calc(100vw - 60rpx);
  background: #f5f6f8;
  border-radius: 6px;
  position: relative;
  &-cover {
    width: 96rpx;
    height: 128rpx;
    border-radius: 6px;
  }
  &-title {
    position: absolute;
    left: 108rpx;
    top: 24rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2e323e;
    line-height: 32rpx;
  }
  &-dictBox {
    position: absolute;
    left: 108rpx;
    bottom: 22rpx;
    @include hor;
    align-items: center;
    span {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      line-height: 28rpx;
    }
    span:nth-child(2) {
      margin-left: 10rpx;
    }
    div:nth-child(3) {
      width: 1px;
      height: 22rpx;
      background: #d9d9d9;
      margin: 0 10rpx;
    }
  }
  .wantPlay {
    position: absolute;
    top: 26rpx;
    right: 18rpx;
    width: 120rpx;
    height: 36rpx;
  }
  &-sellType {
    position: absolute;
    left: 0rpx;
    top: 0rpx;
    width: 60rpx;
    height: 32rpx;
  }
}
.dmBox {
  margin: 18rpx 30rpx 0 30rpx;
  width: 148px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9ebef;
  position: relative;
  &-cover {
    width: 96rpx;
    height: 96rpx;
    border-radius: 6px;
  }
  span:nth-child(2) {
    position: absolute;
    left: 108rpx;
    top: 12rpx;
    font-size: 26rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e323e;
    line-height: 30rpx;
    @include text-overflow-line(1);
  }
  &-status {
    position: absolute;
    left: 108rpx;
    bottom: 12rpx;
    font-size: 22rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffa557;
    line-height: 26rpx;
  }
  &-status::before {
    content: "本次体验：";
    color: #959aa5;
  }
  &-tag {
    position: absolute;
    left: 6rpx;
    top: 6rpx;
    width: 32rpx;
    height: 32rpx;
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