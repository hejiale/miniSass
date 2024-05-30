<template>
  <view>
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left" @click="backRoute">
        <van-icon name="arrow-left" size="50rpx" color="#000" />
      </view>
      <div slot="content">
        <div class="content">
          <div class="cellGroup">
            <div class="storeLogoBox">
              <view class="storeLogoBox-title"><span>*</span>门店logo</view>
              <span class="storeLogoBox-note">请上传小于5MB静态图片</span>
              <img
                :src="$filters.processLogo(storeInfo.storeLogo)"
                alt=""
                class="storeLogo"
                mode="aspectFill"
                v-if="storeInfo.storeLogo"
                @click="updateImgAction(false)"
              />
              <div v-else class="storeLogoBox-upload" @click="updateImgAction(false)">
                <img
                  src="../static/image/updateIcon.png"
                  alt=""
                  mode="aspectFill"
                />
              </div>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title"> <span>*</span>门店名称 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  maxlength="30"
                  :value="storeInfo.storeName"
                  placeholder="请输入"
                  @input="storeNameInput"
                />
              </view>
            </div>
            <div class="vancellStyle" @click="getLocation()">
              <view class="vancellStyle-title"> <span>*</span>店铺定位 </view>
              <div class="vancellStyle-value">
                {{ location ? location : "立即定位" }}
                <van-icon name="arrow" size="28rpx" color="#333" />
              </div>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title">门牌号 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  :value="location2"
                  placeholder="请输入"
                  @input="addressInput"
                />
              </view>
            </div>
          </div>
          <div class="memoSpan">店铺基础信息将在首页上展示</div>
          <div class="cellGroup">
            <div class="vancellStyle">
              <view class="vancellStyle-title"> <span>*</span>店铺电话 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  :value="storeInfo.telephone"
                  placeholder="请输入"
                  @input="phoneInput"
                />
              </view>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title"> <span>*</span>店铺微信 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  :value="storeInfo.wxNumber"
                  placeholder="请输入"
                  @input="wechatInput"
                />
              </view>
            </div>
          </div>
          <div class="memoSpan">
            联系方式将在店铺上显示，请确保店铺联系方式正确，否则您的客户无法联系到您
          </div>
          <div class="store-contentBox">
            <div class="store-contentBox-span"><span>*</span>照片墙</div>
            <div class="store-contentBox-pictureWall">
              <scroll-view scroll-x class="store-contentBox-pictureWall-scroll">
                <div
                  class="store-contentBox-pictureWall-scroll-item"
                  @click="updateImgAction(true)"
                >
                  
                  <img src="../static/image/storeInfo-addPic.png" alt="" />
                </div>
                <div
                  v-for="(it, idx) in storeInfo.imageList"
                  :key="idx"
                  class="store-contentBox-pictureWall-scroll-item"
                  @click.stop="onPreviewImg(idx)"
                >
                  <img :src="it" alt="" mode="aspectFill" v-if="isImage(it)"/>
                  <img src="../static/image/pre-media.png" alt="" mode="aspectFill" v-else/>
                  <van-icon
                    name="clear"
                    size="40rpx"
                    color="#000"
                    class="clearIcon"
                    @click="onClearImage(idx)"
                  />
                </div>
              </scroll-view>
            </div>
            <div
              class="store-contentBox-span hor-between-center"
              @click="onGoIntroduce"
            >
              <div><span>*</span>简介</div>
              <van-icon name="arrow" size="28rpx" color="#333" />
            </div>
            <p v-html="storeInfo.storeDescription"></p>
          </div>
          <div class="memoSpan">可介绍展示您的门店，吸引顾客</div>
          <view class="content-bottom" @click="saveAction">保存</view>
        </div>
      </div>
    </navigationBar>
  </view>
</template>

<script>
import { uploadFile, judgeMediaType } from "@/utils";
import navigationBar from "../../components/navigation-bar/index.vue";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      showPopup: false,
      multiIndex: [0, 0],
      multiArray: [[], []],
      objectMultiArray: [],
      location: "",
      location2: "",
      area: null,
      latitude: "",
      longitude: "",
      cityName: "",
      proName: "",
      storeInfo: {}, //店铺信息
      customNav: {
        bgHeight: "30vh",
        navTitle: "店铺信息",
        color: "#000",
        bg: this.$iconFont.getIconName("icon-store-bg"),
        customizeLeft: true,
      },
    };
  },
  async onLoad() {
    await this.getStoreHomeData();
  },
  onShow() {
    if (uni.getStorageSync("store-content")) {
      this.storeInfo.storeDescription = uni.getStorageSync("store-content");
    }
  },
  computed:{
    isImage(){
      return function(v){
        if(judgeMediaType(v) === 'image'){
          return true;
        }
        return false;
      }
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
      uni.setStorageSync("store-content");
    },
    onGoIntroduce() {
      uni.navigateTo({
        url: `./editStoreDesc`,
      });
    },
    async getStoreHomeData() {
      try {
        let data = await this.$api.getUserStore({
          id: uni.getStorageSync("storeId"),
        });
        data.imageList = data.imageList.map(it=>it.fileUrl)
        this.storeInfo = data;
        this.location = data.address;
        this.location2 = data.storeAddress;
      } catch (e) {
        uni.showToast({
          title: e,
          icon: "none",
        });
      }
    },
    async getLocation() {
      const vm = this;
      if (
        !uni.getStorageSync("currentLongitude") ||
        !uni.getStorageSync("currentLatitude")
      ) {
        await this.$checkLogin.getUserLocation();
      } else {
        wx.chooseLocation({
          latitude: uni.getStorageSync("currentLatitude"),
          longitude: uni.getStorageSync("currentLongitude"),
          success: (res) => {
            vm.storeInfo.latitude = res.latitude;
            vm.storeInfo.longitude = res.longitude;
            vm.location = res.address;
            vm.changeAreaId(res.latitude, res.longitude);
          },
        });
      }
    },
    onClose() {
      this.showPopup = false;
    },
    updateImgAction(isPicWall) {
      const vm = this;
      let count = 1;
      if (isPicWall) {
        count = 12 - this.storeInfo.imageList.length;
        if (count <= 0) {
          uni.showToast({
            title: "照片墙最多上传12张",
            icon: "none",
          });
          return;
        }
      }

      uni.chooseMedia({
        count,
        success: async function (res) {
          uni.showLoading("上传中...");
          let promiseArr = [];
          for (let i = 0; i < res.tempFiles.length; i++) {
            promiseArr.push(vm.onUploadFile(res.tempFiles[i].tempFilePath, isPicWall));
          }
          Promise.all(promiseArr).then((_) => {
            uni.hideLoading();
          });
        },
      });
    },
    onUploadFile(url, isPicWall) {
      return new Promise((resolve) => {
        uploadFile(url).then((e) => {
          if (isPicWall) {
            this.storeInfo.imageList.unshift(e);
          } else {
            this.storeInfo.storeLogo = e;
          }
          resolve();
        });
      });
    },
    onPreImage(it) {
      wx.previewImage({
        current: it,
        urls: this.storeInfo.imageList,
        showmenu: false,
      });
    },
    onClearImage(idx) {
      const vm = this;
      uni.showModal({
        title: "提示",
        content: "您确定要删除吗？",
        success(res) {
          if (res.confirm) {
            vm.storeInfo.imageList.splice(idx, 1);
          }
        },
      });
    },
    storeNameInput(e) {
      this.storeInfo.storeName = e.detail.value;
    },
    phoneInput(e) {
      this.storeInfo.telephone = e.detail.value;
    },
    wechatInput(e) {
      this.storeInfo.wxNumber = e.detail.value;
    },
    addressInput(e) {
      this.location2 = e.detail.value;
    },
    citySelete(e) {
      this.showPopup = true;
    },
    saveAction() {
      if (!this.storeInfo.storeLogo) {
        uni.showToast({
          title: "请上传一张门店logo",
          icon: "none",
        });
      } else if (this.storeInfo.storeName.length == 0) {
        uni.showToast({
          title: "门店名称不能为空",
          icon: "none",
        });
      } else if (this.storeInfo.telephone.length == 0) {
        uni.showToast({
          title: "手机号不能为空",
          icon: "none",
        });
      } else if (this.storeInfo.wxNumber.length == 0) {
        uni.showToast({
          title: "微信号不能为空",
          icon: "none",
        });
      } else if (this.storeInfo.provinceId.length == 0) {
        uni.showToast({
          title: "请选择所在城市",
          icon: "none",
        });
      } else if (this.location.length == 0) {
        uni.showToast({
          title: "请选择店铺定位",
          icon: "none",
        });
      } else if (!this.storeInfo.storeDescription) {
        uni.showToast({
          title: "简介内容不能为空",
          icon: "none",
        });
      } else if (this.storeInfo.imageList.length == 0) {
        uni.showToast({
          title: "照片墙不能为空",
          icon: "none",
        });
      } else {
        this.submitStoreInfo();
      }
    },
    async submitStoreInfo() {
      uni.showLoading();
      try {
        await this.$api.updateMyStore({
          storeLogo: this.storeInfo.storeLogo,
          storeName: this.storeInfo.storeName,
          longitude: this.storeInfo.longitude,
          latitude: this.storeInfo.latitude,
          provinceId: this.storeInfo.provinceId,
          cityId: this.storeInfo.cityId,
          districtId: this.storeInfo.districtId,
          address: this.location,
          storeAddress: this.location2,
          telephone: this.storeInfo.telephone,
          wxNumber: this.storeInfo.wxNumber,
          storeDescription: this.storeInfo.storeDescription,
          imageList: this.storeInfo.imageList,
          id: uni.getStorageSync("storeId")
        });
        uni.hideLoading();
        uni.showToast({
          title: "提交成功",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 500);
      } catch (e) {}
    },
    //根据坐标转换省市区id
    async changeAreaId(latitude, longitude){
      try{
        let data = await this.$api.regionResolver({
          latitude,
          longitude
        })
        this.storeInfo.provinceId = data.provinceId;
        this.storeInfo.cityId = data.cityId;
        this.storeInfo.districtId = data.districtId;
      }catch(e){}
    },
    onPreviewImg(current){
      let sources = [];
      this.storeInfo.imageList.map((v) => {
        sources.push({
          url: v,
          type: judgeMediaType(v) === "image" ? "image" : "video",
          poster: judgeMediaType(v) === 'video' ? `${v}?x-oss-process=video/snapshot,t_1000,m_fast`: null
        });
      });
      uni.previewMedia({
        current,
        sources
      })
    }
  },
};
</script>
<style lang="scss">
.picker {
  background-color: #fff;
}
.cellGroup {
  background: #fff;
  margin: 0rpx 20rpx 20rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}
.vancellStyle {
  @include hor-between-center;
  margin: 0 20rpx;
  height: 120rpx;
  &-title {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
    span:nth-child(1) {
      color: #fa5252;
    }
  }
  &-value {
    @include hor;
    font-size: 28rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 40rpx;
    justify-content: flex-end;
    width: 75%;
    input {
      text-align: right;
      width: 100%;
    }
  }
}
.storeLogoBox {
  @include ver;
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx 16rpx 0 0;
  &-title {
    margin-top: 34rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 40rpx;
    span {
      color: #fa5252;
    }
  }
  &-note {
    margin-top: 4rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 40rpx;
  }
  .storeLogo {
    width: 160rpx;
    height: 160rpx;
    margin-top: 14rpx;
    border-radius: 16rpx;
  }
  &-upload {
    margin-top: 14rpx;
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
  }
}
.memoSpan {
  margin: 12rpx 20rpx 28rpx 20rpx;
  font-size: 24rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 36rpx;
}
.store-contentBox {
  @include ver;
  margin: 0 20rpx 0 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding-bottom: 50rpx;
  &-span {
    margin: 40rpx 32rpx 0 32rpx;
    @include hor;
    align-items: center;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 40rpx;
    span {
      color: #fa5252;
    }
  }
  p {
    margin: 32rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 40rpx;
  }
  &-content {
    margin: 20rpx;
    background: #f5f5f5;
    height: 200rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }
  &-pictureWall {
    @include hor;
    align-items: center;
    margin-left: 20rpx;
    &-scroll {
      @include hor;
      align-items: center;
      margin-top: 40rpx;
      width: 100%;
      white-space: nowrap;
      &-item {
        display: inline-block;
        margin-right: 22rpx;
        padding: 8px;
        position: relative;
        img {
          width: 96rpx;
          height: 96rpx;
          border-radius: 16rpx;
        }
        .clearIcon {
          position: absolute;
          right: -4rpx;
          top: 0rpx;
        }
      }
    }
  }
}
.content {
  padding-bottom: 100rpx;
  &-bottom {
    width: 80%;
    @include hor-center-center;
    height: 88rpx;
    background: #14c9c9;
    border-radius: 41px;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
/deep/.van-cell {
  background: unset !important;
}
</style>
