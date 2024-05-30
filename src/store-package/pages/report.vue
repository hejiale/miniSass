<template>
  <div class="container" v-if="evaluateDetail">
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
      举报中心
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
    </div>
    <div class="comment" v-if="evaluateDetail.comment">
      {{ evaluateDetail.comment }}
    </div>
    <div class="status" v-else>
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
    <div class="space"></div>
    <div class="title-box">举报类型</div>
    <div class="reportBox">
      <div
        v-for="menu in reportMenu"
        :key="menu.key"
        class="reportBox-item"
        :class="isActive(menu.key) ? 'active' : ''"
        @click="onChangeMenu(menu.key)"
      >
        {{ menu.value }}
      </div>
    </div>
    <div class="title-box mt14">上传图片凭证</div>
    <view class="uploadImgsBox" scroll-x>
      <div
        src=""
        v-for="(url, idx) in imageList"
        :key="url"
        class="uploadImgsBox-item"
      >
        <image
          :src="url"
          @click.stop="onPreView(idx)"
          v-if="isImage(url)"
          mode="aspectFill"
        />
        <image
          :src="url + '?x-oss-process=video/snapshot,t_1000,m_fast'"
          @click.stop="onPreView(idx)"
          v-else
          mode="aspectFill"
        />
        <image
          src="../static/image/icon-close.png"
          class="uploadImgsBox-item-close"
          @click="onDeleteImg(idx)"
        />
      </div>
      <div
        class="uploadImgsBox-add"
        @click="onUploadImage"
        v-if="imageList.length < 4"
      >
        <image
          src="../static/image/icon-camera.png"
          class="uploadImgsBox-add-icon"
        />
        <span class="uploadImgsBox-title">{{ uploadNote }}</span>
      </div>
    </view>
    <div class="title-box-none">举报原因描述</div>
    <div class="remark">
      <textarea
        placeholder="请描述举报具体原因"
        :maxlength="200"
        v-model="remark"
        auto-height
      />
      <div class="remark-numBox">{{ remark.length }}</div>
    </div>
    <div class="line"></div>
    <div class="saveButton" :class="enable ? 'active' : ''" @click="onSubmit">
      立即提交
    </div>
  </div>
</template>
<script>
import { getMenuButtonRect, judgeMediaType, uploadFile } from "@/utils/index";
import service from "../utils/service";
export default {
  data() {
    return {
      menuRect: null,
      userInfo: null,
      evaluateDetail: null,
      storeInfo: null,
      reportMenu: [],
      imageList: [],
      remark: "",
      feedType: null,
      canDo: false
    };
  },
  async onLoad() {
    this.evaluateDetail = uni.getStorageSync("evaluateDetail");
    this.storeInfo = uni.getStorageSync("store-info");
    // uni.removeStorageSync('evaluateDetail');
    // uni.removeStorageSync('store-info');

    this.userInfo = await this.$checkLogin.getUserInfo();
    this.menuRect = await getMenuButtonRect();
    await this.getFeedType();
  },
  computed: {
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
    isImage() {
      return function (v) {
        return judgeMediaType(v) === "image";
      };
    },
    videoPoster() {
      return function (url) {
        return `${url}?x-oss-process=video/snapshot,t_1000,m_fast`;
      };
    },
    uploadNote() {
      return this.imageList.length < 6
        ? this.imageList.length > 0
          ? `可再加${4 - this.imageList.length}张`
          : "上传图片"
        : "";
    },
    isActive() {
      return function (type) {
        return this.feedType === type ? true : false;
      };
    },
    enable() {
      if (this.imageList.length && this.feedType) {
        return true;
      }
      return false;
    },
  },
  methods: {
    onBack() {
      uni.navigateBack();
    },
    onChangeMenu(type) {
      if (this.feedType === type) {
        this.feedType = null;
      } else {
        this.feedType = type;
      }
    },
    onUploadImage() {
      const vm = this;
      let count = 4 - this.imageList.length;
      if (count <= 0) {
        uni.showToast({
          title: "最多上传4张",
          icon: "none",
        });
        return;
      }

      uni.chooseMedia({
        count,
        success: async function (res) {
          uni.showLoading("上传中...");
          let promiseArr = [];
          for (let i = 0; i < res.tempFiles.length; i++) {
            promiseArr.push(vm.onUploadFile(res.tempFiles[i].tempFilePath));
          }
          Promise.all(promiseArr).then((_) => {
            uni.hideLoading();
          });
        },
      });
    },
    onUploadFile(url) {
      return new Promise((resolve) => {
        uploadFile(url).then((e) => {
          this.imageList.unshift(e);
          resolve();
        });
      });
    },
    onDeleteImg(idx) {
      this.imageList.splice(idx, 1);
    },
    onPreView(current) {
      let sources = [];
      this.imageList.map((v) => {
        sources.push({
          url: v,
          type: judgeMediaType(v) === "image" ? "image" : "video",
          poster:
            judgeMediaType(v) === "video"
              ? `${v}?x-oss-process=video/snapshot,t_1000,m_fast`
              : null,
        });
      });
      uni.previewMedia({
        current,
        sources,
      });
    },
    onSubmit() {
      if (this.feedType && this.imageList.length) {
        this.addReportRequest();
      }
    },
    async getFeedType() {
      try {
        this.reportMenu = await service.getFeedType({});
      } catch (e) {}
    },
    async addReportRequest() {
      if(this.canDo)return;
      this.canDo = true;

      try {
        await service.addUserFeedBackRecord({
          businessId: this.evaluateDetail.id,
          content: this.remark,
          feedBusiness: "STORE_EVALUATE",
          feedType: this.feedType,
          fileList: this.imageList,
          userId: this.userInfo.id,
        });
        wx.showToast({
          title: "举报成功",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
      } catch (e) {
        this.canDo = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  padding-bottom: 80rpx;
}
.backBox {
  position: absolute;
  left: 24rpx;
  @include ver;
  justify-content: center;
  z-index: 1;
}
.title {
  position: absolute;
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
  margin: 192rpx 30rpx 0 30rpx;
  @include hor-between-center;
  &-left {
    @include hor;
    align-items: center;
    width: 70%;
    &-info {
      @include ver;
      align-items: center;
      margin-left: 18rpx;
      max-width: 70%;
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
}
.comment {
  margin: 18rpx 30rpx 0rpx 30rpx;
  @include text-overflow-line(2);
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: #2e323e;
  line-height: 32rpx;
}
.status {
  margin: 18rpx 30rpx 0rpx 30rpx;
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
.space {
  margin-top: 24rpx;
  width: 100vw;
  height: 20rpx;
  background: #fafafa;
}
.title-box,
.title-box-none {
  margin: 52rpx 0px 0px 24rpx;
  font-size: 30rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #2e323e;
  line-height: 36rpx;
}
.title-box::before {
  content: "*";
  color: #f44949;
}
.mt14 {
  margin-top: 28rpx !important;
}
.reportBox {
  padding: 24rpx 24rpx 0 24rpx;
  &-item {
    padding: 12rpx 24rpx;
    background: #f9f9f9;
    border-radius: 38rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #959aa5;
    margin-right: 24rpx;
    margin-bottom: 24rpx;
    display: inline-flex;
  }
  .active {
    color: #fff;
    background: #14c9c9;
  }
}
.remark {
  margin: 24rpx;
  background: #f6f6f6;
  border-radius: 28rpx;
  position: relative;
  min-height: 240rpx;
  textarea {
    padding: 24rpx 0rpx 48rpx 24rpx;
    width: calc(100% - 80rpx);
    font-size: 30rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #2e323e;
    line-height: 36rpx;
  }
  &-numBox {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #959aa5;
    line-height: 28rpx;
  }
  &-numBox::after {
    content: "/200";
  }
}
.uploadImgsBox {
  white-space: nowrap;
  padding: 24rpx 26rpx 0 26rpx;
  width: calc(100vw - 52rpx);
  overflow-x: scroll;
  &-item {
    position: relative;
    display: inline-block;
    width: 240rpx;
    height: 240rpx;
    margin-right: 10rpx;
    image {
      border-radius: 28rpx;
    }
    &-close {
      position: absolute;
      right: -6rpx;
      top: -6rpx;
      width: 36rpx;
      height: 36rpx;
    }
  }
  &-add {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 240rpx;
    height: 240rpx;
    background: #f6f6f6;
    border-radius: 14px;
    transform: translateY(12rpx);
    &-icon {
      width: 60rpx;
      height: 60rpx;
      margin-top: 64rpx;
    }
    &-title {
      font-size: 30rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2e323e;
      line-height: 30rpx;
    }
  }
}
.line {
  width: 100vw;
  height: 1px;
  background: #eeeeee;
  margin-top: 48rpx;
}
.saveButton {
  margin: 20rpx 32rpx 0 32rpx;
  height: 80rpx;
  background: #d0d0d0;
  border-radius: 32px;
  font-size: 30rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  @include hor-center-center;
}
.active {
  background: #14c9c9;
}
</style>
    