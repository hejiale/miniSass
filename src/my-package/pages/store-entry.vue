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
              <view class="storeLogoBox-title">门店logo</view>
              <span class="storeLogoBox-note">请上传小于5MB静态图片</span>
              <img
                :src="form.storeLogo"
                alt=""
                class="storeLogo"
                mode="aspectFill"
                v-if="form.storeLogo"
                @click="changeLogo('storeLogo')"
              />
              <div
                v-else
                class="storeLogoBox-upload"
                @click="changeLogo('storeLogo')"
              >
                <img
                  src="../static/image/updateIcon.png"
                  alt=""
                  mode="aspectFill"
                />
              </div>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title"><span>*</span>门店名称</view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  maxlength="30"
                  v-model="form.storeName"
                  placeholder="请输入您的店铺名称"
                />
              </view>
            </div>
            <div class="vancellStyle" @click="getLocation()">
              <view class="vancellStyle-title"> <span>*</span>店铺定位 </view>
              <div
                class="vancellStyle-value"
                :style="!location ? 'color:gray' : ''"
              >
                {{ location ? location : "立即定位" }}
                <van-icon name="arrow" size="28rpx" color="#333" />
              </div>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title">门牌号</view>
              <view class="vancellStyle-value">
                <input type="text" v-model="location2" placeholder="请输入" />
              </view>
            </div>
            <div class="storeLogoBox" style="padding-bottom: 20rpx">
              <view class="storeLogoBox-title"><span>*</span>门头照</view>
              <span class="storeLogoBox-note">请上传小于5MB图片</span>
              <img
                :src="form.storeDoorstep"
                alt=""
                class="storeLogo"
                mode="aspectFill"
                v-if="form.storeDoorstep"
                @click="changeLogo('storeDoorstep')"
              />
              <div
                v-else
                class="storeLogoBox-upload"
                @click="changeLogo('storeDoorstep')"
              >
                <img
                  src="../static/image/updateIcon.png"
                  alt=""
                  mode="aspectFill"
                />
              </div>
            </div>
            <div class="storeLogoBox" style="padding-bottom: 32rpx">
              <image :src="$iconFont.getIconName('icon-store-example')" class="storeLogoBox-example" @click="onPreviewExample"/>
              <span class="storeLogoBox-note">1.需要把门店招牌上的门店名称拍摄完整。</span>
              <span class="storeLogoBox-note">2.门店名称需与填写的门店名称一致。</span>
              <span class="storeLogoBox-note">3.若无招牌，请将店名打印在纸上贴在门口拍照。</span>
            </div>
            <!-- <div class="vancellFlexStyle">
              <view class="vancellFlexStyle-title">店铺简介</view>
              <view class="vancellFlexStyle-value">
                <textarea 
                  auto-height
                  :value="form.storeDescription"
                  placeholder="请输入店铺简介..."
                  placeholder-style="color:gray;font-size: 13px;font-weight:400"
                  :maxlength="-1"
                  @blur="onBlurDescription"
                />
              </view>
            </div> -->
          </div>
          <div class="memoSpan">店铺基础信息将在首页上展示</div>
          <div class="cellGroup">
            <div class="vancellStyle">
              <view class="vancellStyle-title"> <span>*</span>店铺联系人 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  v-model="form.contacts"
                  placeholder="请输入"
                />
              </view>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title"> <span>*</span>店铺电话 </view>
              <view class="vancellStyle-value">
                <input type="text" v-model="phone" placeholder="请输入" />
              </view>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title"><span>*</span>店铺微信 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  v-model="form.wxNumber"
                  placeholder="请输入"
                />
              </view>
            </div>
          </div>
          <div class="memoSpan">
            联系方式将在店铺上显示，请确保店铺联系方式正确，否则您的客户无法联系到您
          </div>
          <div class="store-contentBox">
            <div class="storeLogoBox" style="padding-bottom: 20rpx">
              <view class="storeLogoBox-title"><span>*</span>营业执照</view>
              <span class="storeLogoBox-note">请上传小于5MB静态图片</span>
              <img
                :src="form.businessLicense"
                alt=""
                class="storeLogo"
                mode="aspectFill"
                v-if="form.businessLicense"
                @click="changeLogo('businessLicense')"
              />
              <div
                v-else
                class="storeLogoBox-upload"
                @click="changeLogo('businessLicense')"
              >
                <img
                  src="../static/image/updateIcon.png"
                  alt=""
                  mode="aspectFill"
                />
              </div>
            </div>
            <!-- <span class="store-contentBox-span"><span>*</span>营业执照</span>
            <span class="store-contentBox-note">请上传小于5MB静态图片</span>
            <van-uploader
              :file-list="fileList"
              @after-read="afterRead"
              class="store-contentBox-pictureWall"
              @delete="deleteImage"
              :max-count="1"
              :max-size="5120 * 1024"
              @oversize="onOversize"
              image-fit="aspectFit"
            /> -->
            <div class="vancellStyle">
              <view class="vancellStyle-title"><span>*</span>企业名称 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  v-model="form.businessName"
                  placeholder="请输入"
                />
              </view>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title"><span>*</span>法定代表 </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  v-model="form.legalPerson"
                  placeholder="请输入"
                />
              </view>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title"
                ><span>*</span>社会信用代码
              </view>
              <view class="vancellStyle-value">
                <input
                  type="text"
                  v-model="form.enterpriseCreditCode"
                  placeholder="请输入"
                />
              </view>
            </div>
            <div class="vancellStyle">
              <view class="vancellStyle-title">营业执照是否长期有效 </view>
              <view class="vancellStyle-value">
                <van-switch
                  :checked="form.isLongTime"
                  @change="changeSwitch"
                  active-color="#14c9c9"
                  inactive-color="#C5C5C5"
                  size="40rpx"
                />
              </view>
            </div>
            <div
              class="vancellStyle"
              style="align-items: baseline"
              v-if="!form.isLongTime"
            >
              <view class="vancellStyle-title">营业执照有效期 </view>
              <view class="vancellStyle-value">
                <view class="vancellStyle-value-time">
                  <view
                    class="vancellStyle-value-time-box"
                    @click="showValidFromDate = true"
                  >
                    {{ startCurrentTime ? startCurrentTime : "选择起始日期" }}
                    <image src="../static/image/arrow-right.png" />
                  </view>
                  <view
                    class="vancellStyle-value-time-box second"
                    @click="showValidToDate = true"
                  >
                    {{ endCurrentTime ? endCurrentTime : "选择终止日期" }}
                    <image src="../static/image/arrow-right.png" />
                  </view>
                </view>
              </view>
            </div>
          </div>
          <!-- <div
            class="cellGroup"
            style="margin-top: 32rpx"
            v-if="form.invitationCode"
          >
            <div class="vancellStyle">
              <view class="vancellStyle-title">店铺邀请码</view>
              <view class="vancellStyle-value">
                <input type="text" v-model="form.invitationCode" disabled />
              </view>
            </div>
          </div> -->
          <div class="memoSpan">
            请上传您带章的营业执照图片，申请入驻即代表您同意<span
              class="memoSpan-light"
              @click="agreeAction('服务协议')"
              >《服务协议》</span
            >和<span class="memoSpan-light" @click="agreeAction('隐私政策')"
              >《隐私政策》</span
            >
          </div>
          <view class="content-bottom" @click="addShop"
            >保存
            <BindPhone
              @on-success-authorize="onSuccessAuthorize"
              v-if="!userInfor.phone"
            ></BindPhone>
          </view>
        </div>
      </div>
    </navigationBar>
    <van-action-sheet :show="showValidFromDate" z-index="1000">
      <van-datetime-picker
        type="date"
        title="选择起始日期"
        v-model="form.validFromDate"
        @input="onInputStart"
        @cancel="showValidFromDate = false"
        @confirm="onConfirmStart"
        style="width: 100%"
        :safe-area-inset-bottom="false"
        :z-index="1000"
      />
    </van-action-sheet>
    <van-action-sheet :show="showValidToDate" z-index="1000">
      <van-datetime-picker
        type="date"
        title="选择终止日期"
        v-model="form.validToDate"
        @input="onInputEnd"
        @cancel="showValidToDate = false"
        @confirm="onConfirmEnd"
        style="width: 100%"
        :safe-area-inset-bottom="false"
        :z-index="1000"
      />
    </van-action-sheet>
  </view>
</template>
<script>
import navigationBar from "../../components/navigation-bar/index.vue";
import { uploadFile } from "@/utils";
import BindPhone from "../../components/bindPhone/index.vue";
import service from '../utils/service'
const formDetail = {
  storeLogo: "" /*店铺Logo*/,
  storeName: "" /*店铺名称*/,
  longitude: 1.0 /*经度*/,
  latitude: 1.0 /*纬度*/,
  provinceId: 1 /*省Id*/,
  cityId: 1 /*城市Id*/,
  address: "" /*详细地址*/,
  wxNumber: "" /*微信号[可选]*/,
  contacts: "",
  businessLicense: "" /**/, // 营业执照列表
  businessName: "", //企业名称
  legalPerson: "", //法定代表
  enterpriseCreditCode: "", //社会信用代码
  isLongTime: false, //营业执照是否长期有效
  validFromDate: null,
  validToDate: null,
  // invitationCode: null,
  storeDoorstep: "", //商铺门头照
  storeDescription: "",
};
export default {
  components: { navigationBar, BindPhone },
  data() {
    const vm = this;
    return {
      customNav: {
        bgHeight: "30vh",
        navTitle: "入驻信息",
        color: "#000",
        bg: this.$iconFont.getIconName("icon-store-bg"),
        customizeLeft: true,
      },
      userInfor: { phone: null },
      fileList: [],
      uploadDataUrl: "",
      location: "",
      location2: "",
      phone: "",
      phoneUser: "",
      form: vm.$_.clone(formDetail),
      showValidFromDate: false,
      showValidToDate: false,
      startCurrentTime: "",
      endCurrentTime: "",
    };
  },
  async onLoad(option) {
    this.getUserInfor();
  },
  methods: {
    onPreviewExample(){
      wx.previewImage({
        current: this.$iconFont.getIconName('icon-store-example'),
        urls: [this.$iconFont.getIconName('icon-store-example')],
        showmenu: false,
      })
    },
    onBlurDescription(event){
      this.form.storeDescription = event.detail.value;
    },
    onOversize() {
      uni.showToast({
        title: "文件大小不能超过 5M",
        icon: "none",
        duration: 2000,
      });
    },
    agreeAction(e) {
      if (e == "服务协议") {
        uni.navigateTo({
          url: "./agreeIndex",
        });
      } else {
        uni.navigateTo({
          url: "./privaryIndex",
        });
      }
    },
    backRoute() {
      if (getCurrentPages().length === 1)
        wx.switchTab({
          url: "/pages/index/index",
        });
      else uni.navigateBack();
    },
    async getLocation() {
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
            this.form.latitude = res.latitude;
            this.form.longitude = res.longitude;
            this.location = res.address;
            this.changeAreaId(res.latitude, res.longitude);
          },
        });
      }
    },
    detailAddress() {
      uni.navigateTo({
        url: "./edit-shop",
      });
    },
    async getUserInfor(needRefresh) {
      let data = await this.$checkLogin.getUserInfo(needRefresh);
      this.userInfor = data;
      this.phone = data.phone;
      this.form.wxNumber = data.wxNumber || data.phone;
      this.form.contacts = data.nickName;
    },
    //授权成功后，重新获取用户信息
    onSuccessAuthorize() {
      this.getUserInfor(true);
    },
    async afterRead(event) {
      let file = await this.uploadFile(event.detail.file.url);
      this.fileList.push({ url: file });
    },
    deleteImage(event) {
      let id;
      this.fileList.map((e, idx) => {
        if (e.url === event.detail.file.url) {
          id = idx;
        }
      });
      this.fileList.splice(id, 1);
    },
    changeSwitch(e) {
      this.form.isLongTime = e.detail;

      this.form.validFromDate = null;
      this.form.validToDate = null;
      this.startCurrentTime = "";
      this.endCurrentTime = "";
    },
    onInputStart(event) {
      this.form.validFromDate = event.detail;
    },
    onConfirmStart() {
      this.showValidFromDate = false;
      this.startCurrentTime = this.$dayjs(this.form.validFromDate).format('YYYY年MM月DD日')
    },
    onInputEnd(event) {
      this.form.validToDate = event.detail;
    },
    onConfirmEnd() {
      this.showValidToDate = false;
      this.endCurrentTime = this.$dayjs(this.form.validToDate).format('YYYY年MM月DD日')
    },
    
    async addShop() {
      if (!this.userInfor.phone) return;

      if (
        !(
          this.form.storeName &&
          this.form.wxNumber &&
          this.form.businessName &&
          this.form.legalPerson &&
          this.location &&
          this.form.contacts &&
          this.form.enterpriseCreditCode &&
          this.form.businessLicense &&
          this.phone
        )
      ) {
        uni.showToast({
          title: "请输入必填的数据",
          icon: "none",
        });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: "请输入正确的手机号",
          icon: "none",
        });
        return;
      }
      if (!/[a-zA-Z\d_-]{1,19}$/.test(this.form.wxNumber)) {
        uni.showToast({
          title: "请输入正确的微信号",
          icon: "none",
        });
        return;
      }

      try {
        await service.addStoreApply({
          storeLogo: this.form.storeLogo,
          storeName: this.form.storeName,
          longitude: this.form.longitude,
          latitude: this.form.latitude,
          provinceId: this.form.provinceId,
          cityId: this.form.cityId,
          districtId: this.form.districtId,
          address: this.location,
          storeAddress: this.location2,
          wxNumber: this.form.wxNumber,
          businessName: this.form.businessName,
          legalPerson: this.form.legalPerson,
          enterpriseCreditCode: this.form.enterpriseCreditCode,
          isLongTime: this.form.isLongTime,
          businessLicense: this.form.businessLicense,
          contacts: this.form.contacts,
          telephone: this.phone,
          validFromDate: this.form.validFromDate
            ? this.$dayjs(this.form.validFromDate).format("YYYY-MM-DD 00:00:00")
            : "",
          validToDate: this.form.validToDate
            ? this.$dayjs(this.form.validToDate).format("YYYY-MM-DD 00:00:00")
            : "",
          // invitationCode: this.form.invitationCode,
          storeDoorstep: this.form.storeDoorstep,
          applicantUserId: this.userInfor.id,
          dataSource: "SAAS_MP",
          storePicList: this.fileList.map((it) => it.url),
          storeDescription: this.form.storeDescription
        });
        uni.showToast({
          title: "申请成功",
          icon: "none",
        });
        //跳转回上一页
        setTimeout(function () {
          if (getCurrentPages().length === 1)
            wx.switchTab({
              url: "/pages/index/index",
            });
          else uni.navigateBack();
        }, 300);
        this.form = this.$_.clone(formDetail);
        this.location = "";
        this.location2 = "";
      } catch (e) {
        uni.showToast({
          title: e,
          icon: "none",
        });
      }
    },
    changeLogo(key) {
      const vm = this;
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          vm.onUploadFile(res.tempFilePaths[0], key);
        },
      });
    },
    //普通上传
    onUploadFile(url, key) {
      const vm = this;
 
      uni.showLoading({ title: "上传中" });

      uploadFile(url).then(e=>{
        if(key === 'businessLicense'){
          uni.showLoading({ title: "正在自动识别" });
          vm.checkCreditCode(e)
        }else{
          vm.form[key] = e;
          uni.hideLoading();
        }
      })
    },
    //根据坐标转换省市区id
    async changeAreaId(latitude, longitude){
      try{
        let data = await this.$api.regionResolver({
          latitude,
          longitude
        })
        this.form.provinceId = data.provinceId;
        this.form.cityId = data.cityId;
        this.form.districtId = data.districtId;
      }catch(e){}
    },
    async checkCreditCode(code){
      try{
        let res = await service.checkCreditCode({
          str: code
        })
        if(res){
          this.form['businessLicense'] = code;
          this.form['businessName'] = res.companyName;
          this.form['legalPerson'] = res.legalPerson;
          this.form['enterpriseCreditCode'] = res.creditCode;
          this.form['isLongTime'] = res.isLongTime;
          this.startCurrentTime = res.validPeriod.split('至')[0];
          this.endCurrentTime = res.validPeriod.split('至')[1];
          this.form['validFromDate'] = res.validFromDate;
          this.form['validToDate'] = res.validToDate;
          uni.hideLoading();
        }else{
          this.form['businessLicense'] = "";
          this.form['businessName'] = "";
          this.form['legalPerson'] = "";
          this.form['enterpriseCreditCode'] = "";
          this.form['isLongTime'] = "";
          this.startCurrentTime = "";
          this.endCurrentTime = "";
          this.form['validFromDate'] = "";
          this.form['validToDate'] = "";

          uni.hideLoading();
          uni.showToast({
            title: '识别失败，请重传图片后尝试 ',
            icon: 'none',
            duration: 3000
          })
        }
        
      }catch(e){}
    }
  },
};
</script>
<style lang="scss" scoped>
.cellGroup {
  background: #fff;
  margin: 0rpx 32rpx 32rpx 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
}
.vancellStyle {
  @include hor-between-center;
  margin: 0 20rpx;
  padding: 16px 0;
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
    width: 50vw;
    input {
      text-align: right;
      color: #666666 !important;
      width: 100%;
    }
    &-time {
      display: flex;
      flex-direction: column;
      position: relative;
      min-width: 40vw;
      &-box {
        @include hor;
        align-items: center;
        font-size: 28rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #cccccc;
        line-height: 40rpx;
        justify-content: flex-end;
      }
      image {
        width: rpx(14);
        height: rpx(14);
        margin-left: rpx(8);
      }
      .second {
        margin-top: rpx(16);
      }
    }
  }
}
.vancellFlexStyle {
  @include ver;
  margin: 0 20rpx;
  padding: 16px 0;
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
    line-height: 40rpx;
    min-height: 100px;
    border:1px solid #999;
    border-radius: 16rpx;
    margin-top: 10rpx;
    padding: 20rpx;
    textarea {
      color: #333 !important;
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
  &-example{
    width: rpx(80);
    height: rpx(80);
    margin-top: rpx(6);
    margin-bottom: rpx(8);
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
  &-pictureWall {
    margin-top: 14rpx;
  }
}
.memoSpan {
  margin: 12rpx 32rpx 28rpx 32rpx;
  font-size: 24rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 36rpx;
  &-light {
    color: #14c9c9;
  }
}
.store-contentBox {
  @include ver;
  margin: 0 32rpx;
  background: #fff;
  border-radius: 16rpx;
  // padding-bottom: rpx(16);
  &-span {
    margin: 32rpx 0 0 20rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 40rpx;
    span {
      color: #fa5252;
    }
  }
  &-note {
    margin-left: 20rpx;
    margin-top: 4rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 40rpx;
  }
  &-content {
    margin: 20rpx;
    background: #f5f5f5;
    height: 200rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }
}
.content {
  padding-bottom: 100rpx;
  &-bottom {
    position: relative;
    width: 80%;
    @include hor-center-center;
    height: 88rpx;
    background: #14c9c9;
    border-radius: 41px;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin: 0 auto;
  }
}
/deep/.van-cell {
  background: unset !important;
}
</style>
