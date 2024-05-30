<template>
  <view>
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          color="#000"
          size="50rpx"
        />
      </view>
      <view slot="content">
        <img
          :src="$iconFont.getIconName('myStore-bg')"
          alt=""
          mode="widthFix"
          class="fixedBg"
        />
        <scroll-view scroll-y class="scroll">
          <uni-swiper-dot
            class="uni-swiper-dot-box"
            :current="currentNum"
            :info="shop"
            mode="round"
            :dotsStyles="dotsStyles"
            v-if="haveDate"
          >
            <swiper
              style="height: 1200rpx"
              :current="currentNum"
              @change="onChange"
            >
              <swiper-item v-for="item in shop" :key="item.storeNumber">
                <view class="code-top">
                  <div class="code-top-bg">
                    <img src="../static/image/myStore-bg-box.png" alt="" />
                  </div>
                  <div class="code-top-logo">
                    <img :src="$filters.processLogo(item.logo)" alt="" mode="aspectFill" />
                  </div>
                  <div class="code-top-storeInfo">
                    <span>{{ item.storeName }}</span>
                    <span
                      >{{ item.address || ""
                      }}{{ item.storeAddress || "" }}</span
                    >
                  </div>
                  <div class="code-top-qcCodeInfo">
                    <image
                      :src="item.qrCode"
                      @touchstart="gotouchstart(item.qrCode)"
                      @touchmove="gotouchmove"
                      @touchend="gotouchend"
                      mode="aspectFill"
                      lazy-load
                    />
                    <span class="code-top-qcCodeInfo-brief"
                      >长按识别，立即开启剧本杀</span
                    >
                    <van-button color="#0FC3C0" round @click="toMyStore(item)">
                      进入我的店铺
                    </van-button>
                  </div>
                </view>
              </swiper-item>
            </swiper>
          </uni-swiper-dot>
          <view class="code-top" v-else>
            <div class="code-top-bg">
              <img src="../static/image/myStore-bg-box.png" alt="" />
            </div>
            <div class="code-top-logo">
              <img class="gray" />
              <span>暂无信息</span>
            </div>
            <div class="code-top-qcCodeInfo">
              <image
                :src="$iconFont.getIconName('icon-noneStore')"
                mode="aspectFill"
                class="code-top-qcCodeInfo-none"
              />
              <span class="code-top-qcCodeInfo-brief">暂无店铺申请</span>
              <van-button
                color="#0FC3C0"
                round
                @click="toCreateStore()"
                style="margin-top: 160rpx"
              >
                申请店铺
              </van-button>
            </div>
          </view>
          <view class="share" v-if="haveDate">
            <div class="left"></div>
            <span class="middle">分享至</span>
            <div class="right"></div>
          </view>
          <view class="share-pop" v-if="haveDate">
            <view
              class="share-pop-item"
              @click="toFriend(currentNum)"
              style="margin-right: 100rpx"
            >
              <img src="../static/image/myStore-shareWechat.png" />
              <span>分享微信</span>
            </view>
            <view class="share-pop-item" @click="savePic()">
              <img src="../static/image/myStore-share.png" />
              <span>分享海报</span>
            </view>
          </view>
        </scroll-view>
      </view>
    </navigationBar>
  </view>
</template>
<script>
import { uniSwiperDot } from "@dcloudio/uni-ui";
import navigationBar from "../../components/navigation-bar/index.vue";
import service from '../utils/service'
export default {
  components: { navigationBar, uniSwiperDot },
  data() {
    return {
      customNav: {
        bgHeight: "100vh",
        navTitle: "我的店铺",
        color: "#000",
        hideBg: true,
        customizeLeft: true,
      },
      currentNum: 0,
      shop: null,
      timeOutEvent: 0,
      haveDate: true,
      tempFilePath: "",
      userInfor: null,
      dotsStyles: {
        backgroundColor: "rgba(255,255,255,0.5)",
        border: "1px rgba(255,255,255,0.5) solid",
        color: "#fff",
        selectedBackgroundColor: "rgba(255,255,255,1)",
        selectedBorder: "1px rgba(255,255,255,1) solid",
      }
    };
  },
  async onLoad(options) {
  },
  async onShow() {
    this.userInfor = await this.$checkLogin.getUserInfo();

    let data = await this.$api.getMyStoreQrCode({
      userId: this.userInfor.id
    });
    this.shop = data;
    const vm = this;
    if (this.shop && this.shop.length > 0) {
      this.haveDate = true;
      wx.downloadFile({
        url: this.shop[0].qrCode,
        success: (res) => {
          vm.tempFilePath = res.tempFilePath;
        },
      });
    } else {
      this.haveDate = false;
    }
  },
  // onShareTimeline(res){
  //     console.log('onShareTimeline',res)
  //     return {
  //         title: '测试小程序分享至朋友圈',
  //         path: '../test/test',
  //         imageUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594374964481&di=3ceba827e91e126012c43de3887a58c7&imgtype=0&src=http%3A%2F%2Fdmimg.5054399.com%2Fallimg%2Fpkm%2Fpk%2F13.jpg'
  //     }
  // },
  // onShareAppMessage: function(ops) {
  //     return {
  //         title: "分享卡片",
  //         path: '../test/test',
  //     }
  // },
  methods: {
    savePic() {
      const vm = this;
      wx.getSetting({
        success: (res) => {
          if (res.authSetting["scope.writePhotosAlbum"]) {
            wx.saveImageToPhotosAlbum({
              filePath: vm.tempFilePath,
              success() {
                uni.showToast({
                  title: "保存成功",
                  icon: "none",
                });
              },
              fail: (res) => {
              },
            });
          } else {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {},
              fail: (res) => {
                uni.showModal({
                  content: "请授权添加到相册",
                  title: "提示",
                  showCancel: false,
                  success() {
                    uni.openSetting({});
                  },
                });
              },
            });
          }
        },
      });
    },
    gotouchstart(url) {
      let that = this;
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
      this.timeOutEvent = setTimeout(function() {
        // that.previewImage(url);
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
      }, 600); //这里设置定时
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend() {
      clearTimeout(this.timeOutEvent);
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
      }
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gotouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },
    onChange(event) {
      this.currentNum = event.detail.current;

      const vm = this;
      wx.downloadFile({
        url: this.shop[event.detail.current].qrCode,
        success: (res) => {
          vm.tempFilePath = res.tempFilePath;
        },
      });
    },
    previewImage(url) {
      var current = url;
      wx.previewImage({
        current: current,
        urls: [current],
        showmenu: false,
      });
    },
    backRoute() {
      uni.navigateBack();
    },
    toFriend() {
      wx.showShareImageMenu({
        path: this.tempFilePath,
        success() {
          uni.showToast({
            title: "分享成功",
            icon: "none",
          });
        },
      });
    },
    async toMyStore(item) {
      try {
        uni.showLoading({ title: "加载中..." });
        if (item) {
          let data = await this.$api.getStoreHome({
            storeId: item.storeId,
            userId: this.userInfor.id
          });
          uni.setStorageSync("storeId", item.storeId);
          uni.setStorageSync("shopInfo", JSON.stringify(data));

          uni.reLaunch({
            url: "/manage/pages/index",
          });
          uni.hideLoading();
        }
      } catch (e) {
        uni.hideLoading();
      }
    },
    toCreateStore() {
      uni.navigateTo({
        url: "./store-entry",
      });
    },
    toCircle() {
      wx.showShareMenu({
        menus: ["shareAppMessage", "shareTimeline"],
        success: () => {
          // console.log("分享朋友圈success:", res);
        },
      });
    },
  },
};
</script>
<style lang="scss">
.fixedBg {
  @include fiexcenter;
}
.scroll {
  @include fiexcenter;
  top: 160rpx;
  height: calc(100vh - 160rpx);
}
.shop-card {
  width: 572rpx;
}
.code-top {
  margin: 162rpx 64rpx 0rpx 64rpx;
  border-radius: 50rpx;
  @include ver;
  position: relative;
  height: 940rpx;
  &-bg {
    @include abscenter;
    z-index: -1;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &-logo {
    position: absolute;
    left: 46rpx;
    top: -80rpx;
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
    overflow: hidden;
    @include hor-center-center;
    background: #fff;
    img {
      width: 100%;
      height: 100%;
    }
    .gray {
      background: #d9d9d9;
    }
    span {
      position: absolute;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
  }
  &-storeInfo {
    @include ver;
    margin: 128rpx 0 0 50rpx;
    width: 60%;
    :nth-child(1) {
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 36rpx;
      @include text-overflow;
    }
    :nth-child(2) {
      margin-top: 8rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 28rpx;
      @include text-overflow;
    }
  }
  &-qcCodeInfo {
    @include ver;
    align-items: center;
    image {
      width: 450rpx;
      height: 450rpx;
      margin-top: 12rpx;
      position: relative;
    }
    &-none {
      width: 256rpx !important;
      height: 256rpx !important;
      margin-top: 172rpx !important;
    }
    &-brief {
      font-size: 24rpx;
      font-family: OPPOSans, OPPOSans-Regular;
      font-weight: 400;
      text-align: LEFT;
      color: #8c9aa3;
      line-height: 32rpx;
      margin-bottom: 50rpx;
    }
    .van-button {
      width: 550rpx;
      height: 96rpx;
      margin: 0 100rpx 50rpx 100rpx;
    }
  }
}
.card {
  border-radius: 16rpx;
}

.entry-notc_data {
  min-height: 800rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.share {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 1);
  .left {
    margin-right: 32rpx;
    width: 54rpx;
    background: #fff;
    height: 2rpx;
  }
  .right {
    margin-left: 32rpx;
    width: 54rpx;
    background: #fff;
    height: 2rpx;
  }
  .middle {
    font-size: 24rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 32rpx;
  }
}
.share-pop {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
  padding-bottom: 100rpx;
  &-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    image {
      width: 88rpx;
      height: 88rpx;
    }
    span {
      font-size: 12px;
      font-family: OPPOSans, OPPOSans-Regular;
      font-weight: 400;
      text-align: LEFT;
      color: #fff;
      line-height: 16px;
      margin-top: 16rpx;
    }
  }
}
</style>
