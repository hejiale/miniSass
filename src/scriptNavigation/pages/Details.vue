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
          <div class="content-author">
            <div class="content-author-title">
              <span>剧本类型</span>
            </div>
          </div>
          <scroll-view class="content-tagList" scroll-x>
            <div
              v-for="(tag, idx) in DetailsForm.dicts"
              :key="idx"
              class="content-tagList-tag"
            >
              {{ tag.dictValue }}
            </div>
          </scroll-view>
          <div class="content-author">
            <div class="content-author-title">
              <span>作者/发行方</span>
              <span>{{ author }} / {{ publisherName }}</span>
            </div>
          </div>
          <div
            class="content-desc"
            style="padding-bottom: 180rpx;"
          >
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
          <div class="content-bottomBg">
            <img src="../static/image/icon-dramaDetail-buyBg.png" alt="" />
          </div>
        </scroll-view>
      </view>
    </navigation-bar>
    <div class="bottom" @click="showPhone = true">
      <div class="bottom-price normal">
        {{
          DetailsForm.dramaPrice
            ? `￥${DetailsForm.dramaPrice / 100} 购票`
            : "免费"
        }} 联系店家打本

        <!-- <BindPhone
          @on-success-authorize="onSuccessAuthorize"
          v-if="!userInfor.phone"
        ></BindPhone> -->
      </div>
    </div>
    <van-action-sheet
      :show="showPhone"
      :safe-area-inset-bottom="false"
      close-on-click-overlay
      @click-overlay="showPhone = false"
    >
      <div class="pop">
        <span class="pop-title">联系店家</span>
        <div class="pop-wechat">
          <span>店铺微信</span>
          <div class="pop-wechat-right" @click="onCopy">
            <span>{{ shopInfo.wxNumber }}</span>
            <div class="pop-wechat-right-copy">复制</div>
          </div>
        </div>
        <div @click="onMakePhone">立即呼叫</div>
      </div>
    </van-action-sheet>
    <userDialog />
  </view>
</template>
<script>
import navigationBar from "../../components/navigation-bar";
import vanImage from "@/wxcomponents/vant/image/index";
// import BindPhone from "../../components/bindPhone/index.vue";
import expandContent from "./expandContent.vue";
import userDialog from "@/components/userDialog/index.vue";
export default {
  components: {
    navigationBar,
    vanImage,
    expandContent,
    // BindPhone,
    userDialog,
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
      showPhone: false,
      shopInfo: null,
      isExpand: false,
      isDisabled: false,
      userInfor: null,
      isEndLoad: false, //全局加载完的标识
    };
  },
  async onLoad(OPTIONS) {
    this.options = OPTIONS;
    await this.Userinfo();
    await this.getShopInfo(OPTIONS.storeId);
    await this.shopDetail(OPTIONS);
  },
  onShareAppMessage() {
    return {
      title: this.DetailsForm.dramaName,
      path: `/scriptNavigation/pages/Details?scriptID=${this.DetailsForm.id}&storeId=${this.shopInfo.id}`,
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
    //授权成功后，重新获取用户信息
    // onSuccessAuthorize() {
    //   this.Userinfo(true);
    // },
    async shopDetail(OPTIONS) {
      let data = await this.$api.getStoreDrama({
        dramaId: OPTIONS.scriptID
      });
      this.DetailsForm = data;
      this.isEndLoad = true;
    },
    backRoute() {
      if (getCurrentPages().length === 1) {
        wx.switchTab({
          url: "/pages/index/index",
        });
      } else {
        uni.navigateBack();
      }
    },
    previewImage(url) {
      wx.previewImage({
        current: url,
        urls: this.DetailsForm.roleItems.map(it=>it.roleUrl),
        // showmenu: false,
        longPressActions: {
              itemList: ['发送给朋友', '保存图片', '收藏'],
              success: function(data) {
              },
              fail: function(err) {
              }
          }
      });
    },
    onMakePhone() {
      this.showPhone = false;
      uni.makePhoneCall({
        phoneNumber: this.shopInfo.telephone,
      });
    },
    onCopy() {
      uni.setClipboardData({
        data: this.shopInfo.wxNumber,
        success: function () {
          uni.showToast({
            title: "微信号复制成功",
          });
        },
      });
    },
    async Userinfo(needRefresh) {
      let data = await this.$checkLogin.getUserInfo(needRefresh);
      this.userInfor = data;
    },
    async getShopInfo(storeId) {
      if (getCurrentPages().length === 1) {
        //切换店铺
        this.shopInfo = await this.$api.getStoreHome({
          storeId,
          userId: this.userInfor.id
        });
        uni.setStorageSync("storeId", this.shopInfo.id);
        uni.setStorageSync("shopInfo", JSON.stringify(this.shopInfo));
      } else {
        this.shopInfo = JSON.parse(uni.getStorageSync("shopInfo"));
      }
    },
    handlePreview(url) {
      uni.previewImage({
          urls: [url],
          longPressActions: {
              itemList: ['发送给朋友', '保存图片', '收藏'],
              success: function(data) {
              },
              fail: function(err) {
              }
          }
      });
    }
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
    position: absolute;
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
  &-tagList {
    @include hor-center-center;
    margin: 20rpx 34rpx 0 34rpx;
    width: 90%;
    white-space: nowrap;
    &-tag {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 57px;
      font-size: 20rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      padding: 0 10rpx;
      margin-right: 12rpx;
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
  &-bottomBg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 260rpx;
    img {
      width: 100%;
      height: 100%;
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
.bottom {
  position: fixed;
  left: 0;
  width: 100%;
  height: 180rpx;
  bottom: 0;
  z-index: 10;
  @include hor-center-center;
  &-price {
    width: 80%;
    height: 88rpx;
    border-radius: 82rpx;
    color: #fff;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    @include hor-center-center;
  }
}
.normal {
  background: #14c9c9;
}
.pop {
  @include ver;
  align-items: center;
  background: #ffffff;
  border-radius: 48rpx 48rpx 0px 0px;
  width: 100%;
  height: 360rpx;
  &-title {
    margin-top: 38rpx;
    font-size: 32rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 600;
  }
  &-wechat {
    @include hor-between-center;
    margin-top: 40rpx;
    width: 70%;
    &-right {
      @include hor;
      align-items: center;
      &-copy {
        margin-left: 20rpx;
        background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
        box-shadow: 0px 8px 9px 1px rgba(36, 237, 213, 0.25);
        border-radius: 10rpx;
        padding: 8rpx 20rpx;
        color: #fff;
        font-size: 20rpx;
        text-align: center;
      }
    }
  }
  :nth-child(3) {
    @include hor-center-center;
    position: fixed;
    left: 100rpx;
    right: 100rpx;
    bottom: 68rpx;
    height: 88rpx;
    background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
    box-shadow: 0px 8px 9px 1px rgba(36, 237, 213, 0.25);
    border-radius: 41rpx;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    z-index: 1;
  }
}
.fixedBg {
  @include fiexcenter;
}
</style>
