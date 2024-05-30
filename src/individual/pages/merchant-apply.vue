<template>
  <view>
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          size="50rpx"
          color="#000"
        />
      </view>
      <div slot="content" class="pb22">
        <view class="open-merchant__content mx16 mt20 p16">
          <view class="open-merchant__title">个人信息</view>
          <div class="open-merchant__note">建议与店主一致</div>
          <view class="open-merchant__group">
            <view class="open-merchant__cell" style="margin-top: 16px">
              <view class="open-merchant__cell--title">商户名称</view>
              <van-field
                :value="form.merchantName"
                placeholder="请输入商户名称"
                :error="isSubmit && !form.merchantName ? true : false"
                @input="onInput($event, 'merchantName')"
                clearable
              />
              <view class="open-merchant__cell--note">
                个体工商户传营业执照的名称
                (营业执照上名称是****或者无的，传经营者姓名) ，个人用户传姓名。
              </view>
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">联系方式</view>
              <van-field
                :value="form.merchantPhone"
                placeholder="请输入联系方式"
                :error="isSubmit && !form.merchantPhone ? true : false"
                @input="onInput($event, 'merchantPhone')"
                type="number"
                clearable
              />
              <!-- <view  class="open-merchant__cell--note">
                能随时联系到您，以及验证激活的手机号，建议与银行预留手机号一致。
              </view> -->
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">身份证</view>
              <van-field
                :value="form.identityNumber"
                placeholder="请填写身份证"
                :error="isSubmit && !form.identityNumber ? true : false"
                @input="onInput($event, 'identityNumber')"
                clearable
              />
            </view>
            <view class="open-merchant__cell apply__flex">
              <view class="open-merchant__cell--title">身份证是否长期有效</view>
              <van-switch
                size="20px"
                :checked="isLongTerm"
                @input="changeCheck"
                active-color="#14C9C9"
                inactive-color="#dcdee0"
              />
            </view>
            <view
              v-if="!isLongTerm"
              class="open-merchant__cell apply__date"
              @click="show = true"
            >
              <view class="open-merchant__cell--title">身份证有效期</view>
              <view
                class="finance-manage__times--date hor-start-center"
                @click="chooseDate"
              >
                <span class="mr4">{{
                  $dayjs(showDate).format("YYYY-MM-DD")
                }}</span>
                <img
                  style="width: 20px; height: 20px"
                  src="../static/image/down.png"
                  alt=""
                />
              </view>
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">身份证照片</view>
              <view class="hor-start-center">
                <view class="open-merchant__cell--box">
                  <van-uploader
                    :file-list="identityCardObverseList"
                    @after-read="identityCardObverseRead"
                    @delete="identityCardObverseDelete"
                    :max-count="1"
                    image-fit="aspectFit"
                  >
                    <image
                      src="../static/image/finance-head.png"
                      class="open-merchant__cell--box-tag"
                    />
                  </van-uploader>
                  <view class="open-merchant__cell--text">人像面</view>
                </view>
                <view class="open-merchant__cell--box">
                  <van-uploader
                    :file-list="identityCardReverseList"
                    @after-read="identityCardReverseRead"
                    @delete="identityCardReverseDelete"
                    :max-count="1"
                    image-fit="aspectFit"
                  >
                    <image
                      src="../static/image/finance-back.png"
                      class="open-merchant__cell--box-tag"
                    />
                  </van-uploader>
                  <view class="open-merchant__cell--text">国徽面</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="open-merchant__content mx16 mt16 p20">
          <view class="open-merchant__title">银行信息</view>
          <div class="open-merchant__note">
            银行开户人需与个人信息一致，不可填写企业银行卡
          </div>
          <view class="open-merchant__group">
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">银行卡号</view>
              <van-field
                :value="form.bankNo"
                placeholder="请输入卡号（复制输入银行卡号需删除空格）"
                :error="isSubmit && !form.bankNo ? true : false"
                @input="onInput($event, 'bankNo')"
                type="number"
                clearable
              />
              <!-- @blur="onBlurBankCard" -->
              <!-- @confirm="onBlurBankCard" -->
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">银行预留手机号</view>
              <van-field
                :value="form.bankPhone"
                placeholder="请输入银行预留手机号"
                :error="isSubmit && !form.bankPhone ? true : false"
                @input="onInput($event, 'bankPhone')"
                type="number"
                clearable
              />
            </view>
          </view>
        </view>

        <view class="hor-center-center mb32 mt32" v-if="isTimeOut">
          <view class="mp-unset-btn">{{ timeCount }}s后可重新发送验证码</view>
        </view>
        <view class="hor-center-center mb32 mt32" v-else>
          <view class="mp-btn" @click="onSubmit">确认提交</view>
        </view>
      </div>
    </navigationBar>
    <DateClick ref="dateCilck" :timeInfo.sync="showDate" />
    <van-popup :show="popupShow" round @click-overlay="onClosePop">
      <div class="box">
        <div class="box__title">请输入验证码</div>
        <div class="box__subTitle alignCenter">
          已向手机号 <span>{{ form.merchantPhone }}</span> 发送验证码
        </div>
        <div class="ys-verification">
          <input
            adjust-position="false"
            auto-blur="true"
            @input="onInputCode"
            @focus="onFocus"
            @blur="onBlur"
            maxlength="6"
          />
          <div
            v-for="item in 6"
            :key="item"
            class="input-wrapper"
            :style="
              code[item] || (item === 0 && isFocus)
                ? 'border-bottom: 1px solid #14C9C9;'
                : ''
            "
          >
            {{ code[item] || "" }}
          </div>
        </div>
        <div class="box__button" @click="vailateSmsCode">确认</div>
      </div>
    </van-popup>
  </view>
</template>

<script>
import navigationBar from "@/components/navigation-bar/index.vue";
import { uploadFile } from "@/utils";
import { isvalidMobile, validateIdCard } from "@/utils/validate.js";
import DateClick from "../components/date-click/index.vue";
import service from "../utils/service.js";

export default {
  components: {
    navigationBar,
    DateClick,
  },
  data() {
    const vm = this;
    return {
      customNav: {
        customizeLeft: true,
        bg: vm.$iconFont.getIconName("finance-bg"),
        navTitle: "个人进件申请",
        bgHeight: "780rpx",
        color: "#000",
      },
      form: {
        merchantName: null,
        merchantPhone: null, // 商户手机号
        identityNumber: null, // 商户个人身份证号
        bankNo: null, // 银行卡号
        bankPhone: null, // 银行预留手机号
        identityOccupation: "18", // 商户个人职业
        merchantType: "STORE", // 店铺类型
        identityAddress: "", // 商户个人地址
        sourceId: null,
      },
      identityCardObverseList: [], //身份证正面
      identityCardReverseList: [], //身份证反面
      failedReason: false,
      isSubmit: false,
      show: false,
      isLongTerm: false, // 是否长期有效
      showDate: new Date(), //身份证过期日期
      popupShow: false,
      amount: 6,
      code: [],
      currentIndex: 0,
      isFocus: false,
      delta: null,
      isTimeOut: false,
      timer: null,
      timeCount: 60,
      isUpdate: false,
    };
  },
  async onLoad(options) {
    this.delta = options.delta;
    this.isUpdate = options.isUpdate;
    const { merchantApplyId, storeId } = options;
    if (merchantApplyId) {
      this.getMerchantBase(storeId);
      this.form.merchantApplyId = Number(merchantApplyId);
    } else {
      this.form.identityAddress = JSON.parse(uni.getStorageSync('shopInfo')).address;
    }
    this.form.sourceId = storeId;
  },
  watch: {
    isLongTerm(v) {
      if (!v) {
        this.showDate = new Date();
      }
    },
  },
  methods: {
    onInput(event, key) {
      this.form[key] = event.detail;
    },
    onInputCode(val) {
      this.code = val.detail.value.split("");
    },
    onFocus() {
      this.isFocus = true;
    },
    onBlur() {
      this.isFocus = false;
    },
    toast(text) {
      uni.showToast({
        title: text,
        icon: "none",
      });
    },
    async onSubmit() {
      if (!this.form.merchantName) {
        return this.toast("商户名称");
      } else if (!this.form.merchantPhone) {
        return this.toast("请填写联系方式");
      } else if (!isvalidMobile(this.form.merchantPhone)) {
        return this.toast("请填写正确的联系电话");
      } else if (!this.form.identityNumber) {
        return this.toast("请填写身份证");
      } else if (this.identityCardObverseList.length === 0) {
        return this.toast("请上传身份证人像面");
      } else if (this.identityCardReverseList.length === 0) {
        return this.toast("请上传身份证国徽面");
      } else if (!this.form.bankNo) {
        return this.toast("请填写银行卡号");
      } else if (!isvalidMobile(this.form.bankPhone)) {
        return this.toast("请填写正确的银行预留手机号");
      }
      //发送手机验证码
      if (this.isSubmit) return;
      this.isSubmit = true;

      this.isTimeOut = true;
      this.timer = setInterval(() => {
        this.timeCount--;
        if (this.timeCount === 0) {
          this.timeCount = 60;
          this.isTimeOut = false;
          clearInterval(this.timer);
          this.timer = null;
          this.isSubmit = false;
        }
      }, 1000);

      try {
        await service.getCaptchaCode({ str: this.form.merchantPhone });
        this.popupShow = true;
      } catch (e) {
        this.isSubmit = false;
      }
    },
    //校验验证码
    async vailateSmsCode() {
      if (!this.code.length || this.code.length !== 6) {
        return this.toast("手机验证码输入格式有误！");
      }
      try {
        await service.getAvailableCode({
          phone: this.form.merchantPhone,
          smsCode: this.code.join(""),
        });
        this.onClosePop();
        this.doSubmit();
      } catch (e) {
        this.toast("手机验证码输入有误！");
      }
    },
    onClosePop() {
      this.code = [];
      this.popupShow = false;
      this.isSubmit = false;
    },
    async doSubmit() {
      wx.showLoading();

      let obj = validateIdCard(this.form.identityNumber);
      if (!obj.status) return this.toast(obj.msg);

      let parmas = {};
      if (!this.isLongTerm) {
        parmas.identityExpire = this.$dayjs(this.showDate).format("YYYYMMDD");
      } else {
        if (this.form.identityExpire) delete this.form.identityExpire;
      }
      parmas.identityFront = this.identityCardObverseList[0].url;
      parmas.identityBack = this.identityCardReverseList[0].url;
      parmas.isLongTerm = this.isLongTerm;

      try {
        if (this.form.merchantApplyId) {
          await service.merchantBaseUpdate({lianlianApplyType: 'PERSONAL', merchantBasePersonalCommitRequest: { ...this.form, ...parmas }});
          uni.navigateTo({
            url: `./apply-detail?storeId=${this.form.sourceId}&delta=${
              this.isUpdate ? 3 : this.delta || 2
            }`,
          });
        } else {
          await service.postMerchantBase({ ...this.form, ...parmas });
          uni.navigateTo({
            url: `./apply-detail?storeId=${this.form.sourceId}&delta=${
              this.isUpdate ? 3 : this.delta || 2
            }`,
          });
        }
      } finally {
        this.isSubmit = false;
        wx.hideLoading();
      }
    },
    identityCardObverseRead(event) {
      const { file } = event.detail;
      this.afterRead(file, "identityCardObverseList");
    },
    identityCardObverseDelete(event) {
      let url = event.detail.file.url;
      this.deleteFile(url, "identityCardObverseList");
    },
    identityCardReverseRead(event) {
      const { file } = event.detail;
      this.afterRead(file, "identityCardReverseList");
    },
    identityCardReverseDelete(event) {
      let url = event.detail.file.path;
      this.deleteFile(url, "identityCardReverseList");
    },
    afterRead(file, key) {
      uni.showLoading({ title: "上传中" });
      uploadFile(file.url).then((e) => {
        this[key].push({ url: e });
        uni.hideLoading();
      });
    },
    deleteFile(url, key) {
      let id;
      this[key].map((e, idx) => {
        if (e.url === url) {
          id = idx;
        }
      });
      this[key].splice(id, 1);
    },
    backRoute() {
      uni.navigateBack({
        delta: Number(this.delta),
      });
    },
    changeCheck({ detail }) {
      this.isLongTerm = detail;
    },
    chooseDate() {
      this.$refs.dateCilck.open();
    },
    async getMerchantBase(storeId) {
      const res = await service.getMerchantBase({ storeId });
      let copy = Object.assign({}, res); //
      delete copy.activate;
      delete copy.createdTime;
      delete copy.feedback;
      delete copy.id;
      delete copy.lianlianApplyStatus;
      delete copy.lianlianUserNo;
      delete copy.platformApplyStatus;
      delete copy.updatedTime;
      delete copy.merchantId;
      this.identityCardObverseList.push({ url: copy.identityFront });
      this.identityCardReverseList.push({ url: copy.identityBack });
      delete copy.identityFront;
      delete copy.identityBack;
      this.form = { ...this.form, ...copy };
      this.isLongTerm = this.form.isLongTerm;
      if (copy.identityExpire) {
        let d = copy.identityExpire.replace(
          /^(\d{4})(\d{2})(\d{2})$/,
          "$1-$2-$3"
        );
        let date = new Date(d);
        this.showDate = date.getTime();
      }
    },
  },
};
</script>
<style lang="scss">
.van-cell {
  padding-left: 0px !important;
}
.van-cell:after {
  left: 0px !important;
  right: 0px !important;
}
.apply {
  &__flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__date {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
}
.box {
  padding: 48rpx 0;
  width: 84vw;
  border-radius: 20px;
  box-sizing: border-box;
  text-align: center;
  &__title {
    font-size: 34rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #333;
    line-height: 44rpx;
  }
  &__subTitle {
    margin-top: 40rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
    @include hor-center-center;
    span {
      font-weight: 500;
      color: #000000;
      margin: 0 10rpx;
    }
  }
  &__button {
    margin-left: 10%;
    width: 80%;
    height: 44px;
    background: #14c9c9;
    border-radius: 40px;
    margin-top: 29px;
    font-size: 32rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    @include hor-center-center;
  }
}
.ys-verification {
  width: 100%;
  @include hor-center-center;
  margin-top: rpx(39);
  position: relative;
  .input-wrapper {
    width: 72rpx;
    height: 90rpx;
    margin-right: 20rpx;
    border-bottom: 1px solid #cccccc;
    font-size: 60rpx;
  }
  input {
    position: absolute;
    left: -100%;
    right: 0;
    top: 0;
    height: rpx(46);
    color: transparent;
  }
}
</style> 