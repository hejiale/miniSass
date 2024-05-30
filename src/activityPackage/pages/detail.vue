<template>
  <view class="container" v-if="isEndLoad">
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          style="color: #fff"
          size="50rpx"
        />
      </view>
      <view slot="content">
        <image
          mode="aspectFill"
          class="content-bg"
          :src="$filters.filterBlur(DetailsForm.dramaCover)"
        />
        <img
          :src="$iconFont.getIconName('icon-detail-bg')"
          alt=""
          class="fixedBg"
        />
        <scroll-view class="content" scroll-y>
          <div class="content-info">
            <img
              :src="$filters.processImage(DetailsForm.dramaCover, 320)"
              alt=""
              @click="handlePreview(DetailsForm.dramaCover)"
              class="content-info-cover"
              mode="aspectFill"
            />
            <span class="content-info-name">{{ DetailsForm.dramaName }}</span>
          </div>
          <view class="content-detail">
            <div class="content-detail-tag">
              <img src="../static/image/label-1.png" />
              <span
                >{{
                  DetailsForm.maleGamerNum
                    ? DetailsForm.maleGamerNum + "男"
                    : ""
                }}{{
                  DetailsForm.femaleGamerNum
                    ? DetailsForm.femaleGamerNum + "女"
                    : ""
                }}</span
              >
              <img src="../static/image/time.png" />
              <span>{{ DetailsForm.gameTime + "小时" }}</span>
              <img src="../static/image/age.png" />
              <span
                >适龄
                {{
                  $enums.DramaAgeAppropriate.getName(
                    DetailsForm.dramaAgeAppropriate
                  )
                }}</span
              >
            </div>
          </view>
          <div class="content-tagBox">
            <span class="content-tagBox-title">剧本类型</span>
            <scroll-view class="content-tagBox-tagList" scroll-x>
              <div
                v-for="(tag, idx) in DetailsForm.dicts"
                :key="idx"
                class="content-tagBox-tagList-tag"
              >
                {{ tag.dictValue }}
              </div>
            </scroll-view>
          </div>
          <div class="content-author">
            <div class="content-author-title">
              <span>作者/发行方</span>
              <span>{{ author }} / {{ publisherName }}</span>
            </div>
          </div>
          <div class="content-desc" style="padding-bottom: 180rpx">
            <div class="content-desc-title">
              <span>剧情简介</span>
              <!-- <span @click="onExpand">{{ isExpand ? "收起" : "展开" }}</span> -->
            </div>
            <expandContent
              :content="DetailsForm.content"
              :isShowArrow="false"
              :isShowExpand="false"
              @on-change-expand="onChangeExpand"
              ref="expandContent"
            ></expandContent>
            <scroll-view
              class="content-scroll"
              scroll-x
              v-if="DetailsForm.roleItems && DetailsForm.roleItems.length"
            >
              <view
                class="content-scroll-item"
                v-for="item in DetailsForm.roleItems"
                :key="item.id"
                @click="previewImage(item.roleUrl)"
              >
                <img
                  :src="$filters.processImage(item.roleUrl, 160)"
                  alt=""
                  mode="aspectFill"
                />
              </view>
            </scroll-view>
          </div>
        </scroll-view>
      </view>
    </navigation-bar>
  </view>
</template>
<script>
import navigationBar from "../../components/navigation-bar";
import vanImage from "@/wxcomponents/vant/image/index";
import expandContent from "./expandContent.vue";
import service from "../utils/service";
export default {
  components: {
    navigationBar,
    vanImage,
    expandContent,
  },
  data() {
    return {
      DetailsForm: {},
      customNav: {
        bgHeight: "100vh",
        navTitle: "剧本详情",
        color: "#fff",
        hideBg: true,
        customizeLeft: true,
      },
      options: null,
      isExpand: false,
      isDisabled: false,
      isEndLoad: false, //全局加载完的标识
    };
  },
  async onLoad(OPTIONS) {
    this.options = OPTIONS;
    await this.shopDetail(OPTIONS);
  },
  onShareAppMessage() {
    return {
      title: this.DetailsForm.dramaName,
      path: `/activityPackage/pages/detail?scriptID=${this.DetailsForm.id}`,
    };
  },
  computed: {
    author() {
      let arr = [];
      if (this.DetailsForm.authorItems) {
        this.DetailsForm.authorItems.map((it) => {
          arr.push(it.authorName);
        });
      }
      return arr.join("、");
    },
    publisherName() {
      let arr = [];
      if (this.DetailsForm.publishers) {
        this.DetailsForm.publishers.map((it) => {
          arr.push(it.publisherName);
        });
      }
      return arr.join("、");
    },
  },
  methods: {
    onExpand() {
      this.$refs.expandContent.onExpand();
    },
    onChangeExpand(isExpand) {
      this.isExpand = isExpand;
    },
    async shopDetail(OPTIONS) {
      let data = await service.exhibitionDramaDetail({
        id: OPTIONS.scriptID,
      });
      this.DetailsForm = data;
      this.isEndLoad = true;
    },
    backRoute() {
      if (getCurrentPages().length === 1) {
        uni.reLaunch({
          url: "/activityPackage/pages/index",
        });
      } else {
        uni.navigateBack();
      }
    },
    previewImage(url) {
      wx.previewImage({
        current: url,
        urls: this.DetailsForm.roleItems.map((it) => it.roleUrl),
        // showmenu: false,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },
    handlePreview(url) {
      uni.previewImage({
        urls: [url],
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },
  },
};
</script>
<style lang="scss">
.fixedBg {
  background: unset !important;
}
.container {
  position: relative;
  width: 100%;
  overflow-x: hidden;
}
.navigation-bg {
  height: 60%;
}
.content {
  @include ver;
  align-items: center;
  &-bg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -2;
  }
  &-info {
    @include ver;
    align-items: center;
    &-cover {
      margin-top: 58rpx;
      width: 340rpx;
      height: 440rpx;
      border-radius: 16rpx;
    }
    &-name {
      max-width: 80%;
      margin-top: 38rpx;
      font-size: 48rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  &-tagBox {
    margin: 40rpx 34rpx 0 34rpx;
    &-title {
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 32rpx;
    }
    &-tagList {
      @include hor-center-center;
      white-space: nowrap;
      margin-top: 16rpx;
      &-tag {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 57px;
        font-size: 22rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        padding: 4rpx 14rpx;
        margin-right: 12rpx;
        display: inline-block;
      }
    }
  }
  &-detail {
    margin-top: 18rpx;
    width: 100%;
    @include hor-center-center;
    color: #fff;
    font-size: 24rpx;
    font-family: OPPOSans-Regular, OPPOSans;
    font-weight: 400;
    &-tag {
      img {
        margin-left: 26rpx;
        width: 22rpx;
        height: 20rpx;
      }
      span {
        margin-left: 6rpx;
      }
    }
  }
  &-author {
    margin: 54rpx 34rpx 0 34rpx;
    &-title {
      @include ver;
      :nth-child(1) {
        font-size: 32rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 32rpx;
      }
      :nth-child(2) {
        margin-top: 12rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #cccccc;
        line-height: 32rpx;
        word-break: break-all;
      }
    }
  }
  &-desc {
    margin: 50rpx 32rpx 0 32rpx;
    &-title {
      @include hor-between-center;
      :nth-child(1) {
        font-size: 32rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 32rpx;
      }
      :nth-child(2) {
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #14c9c9;
        line-height: 40rpx;
      }
    }
    /deep/.introduc {
      .introduction {
        color: #cccccc !important;
      }
      .unfold {
        background: unset !important;
        margin-left: 92% !important;
        span {
          color: #14c9c9 !important;
        }
      }
    }
  }
  &-scroll {
    width: 100%;
    white-space: nowrap;
    margin-top: 42rpx;
    &-item {
      display: inline-block;
      width: 180rpx;
      height: 240rpx;
      margin-right: 24rpx;
      border-radius: 8rpx;
      overflow: hidden;
    }
  }
}
.normal {
  background: #14c9c9;
}
.fixedBg {
  @include fiexcenter;
}
</style>
