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
          <view class="open-merchant__title">企业信息</view>
          <view class="open-merchant__group">
            <view class="open-merchant__cell" style="margin-top: 16px">
              <view class="open-merchant__cell--title">企业名称</view>
              <van-field
                :value="form.merchantName"
                placeholder="请输入企业名称"
                :error="isSubmit && !form.merchantName ? true : false"
                @input="onInput($event, 'merchantName')"
                clearable
              />
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">企业联系方式</view>
              <van-field
                :value="form.merchantPhone"
                placeholder="请输入企业联系方式"
                :error="isSubmit && !form.merchantPhone ? true : false"
                @input="onInput($event, 'merchantPhone')"
                type="number"
                clearable
              />
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">法人姓名</view>
              <van-field
                :value="form.legalreptName"
                placeholder="请输入法人姓名"
                :error="isSubmit && !form.legalreptName ? true : false"
                @input="onInput($event, 'legalreptName')"
                clearable
              />
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">法人手机号</view>
              <van-field
                :value="form.legalreptPhone"
                placeholder="请输入法人手机号"
                :error="isSubmit && !form.legalreptPhone ? true : false"
                @input="onInput($event, 'legalreptPhone')"
                type="number"
                clearable
              />
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">法定代表人身份证</view>
              <van-field
                :value="form.legalreptIdNo"
                placeholder="请填写法定代表人身份证"
                :error="isSubmit && !form.legalreptIdNo ? true : false"
                @input="onInput($event, 'legalreptIdNo')"
                clearable
              />
            </view>
            <view class="open-merchant__cell apply__flex">
              <view class="open-merchant__cell--title">身份证是否长期有效</view>
              <van-switch
                size="20px"
                :checked="isLegalreptLongTerm"
                @input="changeCheck"
                active-color="#14C9C9"
                inactive-color="#dcdee0"
              />
            </view>
            <view
              v-if="!isLegalreptLongTerm"
              class="open-merchant__cell apply__date"
              @click="show = true"
            >
              <view class="open-merchant__cell--title">身份证有效期</view>
              <view
                class="finance-manage__times--date hor-start-center"
                @click="chooseDate(false)"
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
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">注册邮箱</view>
              <van-field
                :value="form.regEmail"
                placeholder="请填写注册邮箱"
                :error="isSubmit && !form.regEmail ? true : false"
                @input="onInput($event, 'regEmail')"
                clearable
              />
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">企业地址</view>
              <van-field
                :value="form.address"
                placeholder="请填写企业地址"
                :error="isSubmit && !form.address ? true : false"
                @input="onInput($event, 'address')"
                clearable
              />
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">统一社会信用代码</view>
              <van-field
                :value="form.idNo"
                placeholder="请填写统一社会信用代码"
                :error="isSubmit && !form.idNo ? true : false"
                @input="onInput($event, 'idNo')"
                clearable
              />
            </view>
            <view class="open-merchant__cell apply__flex">
              <view class="open-merchant__cell--title">营业执照是否长期有效</view>
              <van-switch
                size="20px"
                :checked="isLongTerm"
                @input="changeEnterCheck"
                active-color="#14C9C9"
                inactive-color="#dcdee0"
              />
            </view>
            <view
              v-if="!isLongTerm"
              class="open-merchant__cell apply__date"
              @click="show = true"
            >
              <view class="open-merchant__cell--title">营业执照有效期</view>
              <view
                class="finance-manage__times--date hor-start-center"
                @click="chooseDate(true)"
              >
                <span class="mr4">{{
                  $dayjs(showEnterDate).format("YYYY-MM-DD")
                }}</span>
                <img
                  style="width: 20px; height: 20px"
                  src="../static/image/down.png"
                  alt=""
                />
              </view>
            </view>
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title"
                >营业执照</view
              >
              <view class="hor-start-center">
                <view class="open-merchant__cell--box">
                  <van-uploader
                    :file-list="unifiedCodeUrlList"
                    @after-read="unifiedCodeUrlRead"
                    @delete="unifiedCodeUrlDelete"
                    :max-count="1"
                    image-fit="aspectFit"
                  >
                    <image
                      src="../static/image/updateIcon.png"
                      class="open-merchant__cell--box-tag"
                    />
                  </van-uploader>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="open-merchant__content mx16 mt16 p20">
          <view class="open-merchant__title">银行信息</view>
          <div class="open-merchant__note">银行开户人需与企业信息一致</div>
          <view class="open-merchant__group">
            <view class="open-merchant__cell">
              <view class="open-merchant__cell--title">对公账户名</view>
              <van-field
                :value="form.linkedAcctName"
                placeholder="请输入对公账户名"
                :error="isSubmit && !form.linkedAcctName ? true : false"
                @input="onInput($event, 'linkedAcctName')"
                type="number"
                clearable
              />
            </view>
            <view class="open-merchant__cell" @click="onChooseBank">
              <view class="open-merchant__cell--title">对公账户开户行名</view>
              <van-cell is-link>
                <view slot="title">
                  <view v-if="form.linkedBrBankName" class="open-merchant__cell--value">{{form.linkedBrBankName}}</view>
                  <view v-else class="open-merchant__cell--placeholder">请选择开户银行</view>
                </view>
              </van-cell>
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
    <DateClick ref="dateCilck" @updateDate="onUpdateDate" />
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
import { isvalidMobile, validateIdCard, isvalidEmail } from "@/utils/validate.js";
import DateClick from "../components/date-click";
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
        navTitle: "企业进件申请",
        bgHeight: "780rpx",
        color: "#000",
      },
      form: {
        merchantName: null, //企业名称
        merchantPhone: null, // 商户手机号
        address: null,//企业地址
        regEmail: null, //注册邮箱
        legalreptName: null, //法人姓名
        legalreptIdExp: null, //法定代表人身份证到期日
        legalreptIdNo: null, // 法定代表人身份证号
        legalreptPhone: null, // 法定代表人手机号
        idEmblem: null, //企业用户法人身份证国徽面
        idPortrait: null, // 企业用户法人身份证人像面
        idNo: null, //营业执照统一社会信用代码号码
        idExp: null, //营业执照有效期
        unifiedCodeUrl: null, //营业执照照片
        linkedAcctName: null, //对公账户名
        linkedBankCode: null, //银行编码
        linkedBrBankName: null, //对公账户开户行名
        linkedBrBankNo: null, //对公账户开户行号
        merchantType: 'STORE',
        sourceId: null
      },
      isLegalreptLongTerm: false, //法定代表人身份证到期日是否长期有效
      isLongTerm: false, //是否长期有效
      unifiedCodeUrlList: [], //统一社会信用代码证Url
      identityCardObverseList: [], //身份证正面
      identityCardReverseList: [], //身份证反面
      isSubmit: false,
      showDate: new Date(), //身份证过期日期
      showEnterDate: new Date(), //营业执照过期日期
      popupShow: false,
      code: [],
      isFocus: false,
      delta: null,
      isTimeOut: false,
      timer: null,
      timeCount: 60,
      isChooseEnterprise: false
    };
  },
  async onLoad(options) {
    this.delta = options.delta;

    const { merchantApplyId, storeId } = options;

    if (merchantApplyId) {
      this.getMerchantBase(storeId);
      this.form.merchantApplyId = Number(merchantApplyId);
    }
    this.form.sourceId = storeId;
  },
  onShow(){
    if(uni.getStorageSync('subBank')){
      let bank = uni.getStorageSync('subBank');
      this.form.linkedBrBankName = bank.brabank_name;
      this.form.linkedBankCode = bank.bankCode;
      this.form.linkedBrBankNo = bank.cnaps_code;
      uni.removeStorageSync('subBank');
    }
  },
  watch: {
    isLegalreptLongTerm(v) {
      if (!v) {
        this.showDate = new Date();
      }
    },
    isLongTerm(v) {
      if (!v) {
        this.showEnterDate = new Date();
      }
    },
  },
  methods: {
    onChooseBank(){
      uni.navigateTo({
        url: './subBank'
      })
    },
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
        return this.toast("企业名称");
      } else if (!this.form.merchantPhone) {
        return this.toast("请填写企业联系方式");
      } else if (!isvalidMobile(this.form.merchantPhone)) {
        return this.toast("请填写正确的企业联系方式");
      } else if (!this.form.legalreptIdNo) {
        return this.toast("请填写法定代表人身份证号");
      } else if (this.identityCardObverseList.length === 0) {
        return this.toast("请上传身份证人像面");
      } else if (this.identityCardReverseList.length === 0) {
        return this.toast("请上传身份证国徽面");
      } else if (!this.form.legalreptPhone) {
        return this.toast("请填写法定代表人手机号");
      } else if (!isvalidMobile(this.form.legalreptPhone)) {
        return this.toast("请填写正确法定代表人手机号");
      } else if (!this.form.address) {
        return this.toast("请填写企业地址");
      } else if (!this.form.regEmail) {
        return this.toast("请填写注册邮箱");
      } else if (!isvalidEmail(this.form.regEmail)) {
        return this.toast("注册邮箱格式有误！");
      } else if (!this.form.legalreptName) {
        return this.toast("请填写法人姓名");
      } else if (!this.form.idNo) {
        return this.toast("请填写营业执照统一社会信用代码");
      } else if (!this.form.linkedAcctName) {
        return this.toast("请填写对公账户名");
      } else if (!this.form.linkedBrBankName) {
        return this.toast("请选择对公账户开户行");
      } else if (!this.unifiedCodeUrlList.length) {
        return this.toast("请上传营业执照");
      }
      //发送手机验证码
      if (this.isSubmit) return;
      this.isSubmit = true;

      this.isTimeOut = true;
      this.timer = setInterval(() => {
        this.timeCount--;
        if (this.timeCount === 0) {
          this.onResetTimer();
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
      this.onResetTimer();
    },
    async doSubmit() {
      wx.showLoading();

      let obj = validateIdCard(this.form.legalreptIdNo);
      if (!obj.status) return this.toast(obj.msg);

      let parmas = {};
      if (!this.isLegalreptLongTerm) {
        parmas.legalreptIdExp = this.$dayjs(this.showDate).format("YYYYMMDD");
      } else {
        if (this.form.legalreptIdExp) delete this.form.legalreptIdExp;
      }
      if (!this.isLongTerm) {
        parmas.idExp = this.$dayjs(this.showEnterDate).format("YYYYMMDD");
      } else {
        if (this.form.isLongTerm) delete this.form.idExp;
      }
      parmas.idPortrait = this.identityCardObverseList[0].url;
      parmas.idEmblem = this.identityCardReverseList[0].url;
      parmas.unifiedCodeUrl = this.unifiedCodeUrlList[0].url;
      parmas.isLegalreptLongTerm = this.isLegalreptLongTerm;
      parmas.isLongTerm = this.isLongTerm;

      try {
        if(this.form.merchantApplyId){
          await service.merchantBaseUpdate({lianlianApplyType: 'BUSINESS', merchantBaseBusinessCommitRequest: { ...this.form, ...parmas }} );
        }else{
          await service.merchantBusinessBaseCommit({ ...this.form, ...parmas });
        }
        
        uni.redirectTo({
          url: `./apply-detail?storeId=${this.form.sourceId}`
        })
      } catch(e) {
        wx.hideLoading();
      }
    },
    //身份证正面
    identityCardObverseRead(event) {
      const { file } = event.detail;
      this.afterRead(file, "identityCardObverseList");
    },
    identityCardObverseDelete(event) {
      let url = event.detail.file.url;
      this.deleteFile(url, "identityCardObverseList");
    },
    //身份证反面
    identityCardReverseRead(event) {
      const { file } = event.detail;
      this.afterRead(file, "identityCardReverseList");
    },
    identityCardReverseDelete(event) {
      let url = event.detail.file.path;
      this.deleteFile(url, "identityCardReverseList");
    },
    //统一社会信用代码
    unifiedCodeUrlRead(event) {
      const { file } = event.detail;
      this.afterRead(file, "unifiedCodeUrlList");
    },
    unifiedCodeUrlDelete(event) {
      let url = event.detail.file.path;
      this.deleteFile(url, "unifiedCodeUrlList");
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
      this.isLegalreptLongTerm = detail;
    },
    changeEnterCheck({ detail }) {
      this.isLongTerm = detail;
    },
    chooseDate(v) {
      this.isChooseEnterprise = v;
      this.$refs.dateCilck.open();
    },
    onUpdateDate(val){
      if(this.isChooseEnterprise){
        this.showEnterDate = val;
      }else{
        this.showDate = val;
      }
    },
    async getMerchantBase(storeId) {
      const res = await service.getMerchantBase({ storeId });
      
      this.form = {
        merchantName: res.merchantName, //企业名称
        merchantPhone: res.merchantPhone, // 商户手机号
        address: res.identityAddress,//企业地址
        regEmail: res.merchantBusinessPlatformApply.regEmail, //注册邮箱
        legalreptName: res.merchantBusinessPlatformApply.legalreptName, //法人姓名
        legalreptIdNo: res.merchantBusinessPlatformApply.legalreptIdNo, // 法定代表人身份证号
        legalreptPhone: res.merchantBusinessPlatformApply.legalreptPhone, // 法定代表人手机号
        idNo: res.merchantBusinessPlatformApply.idNo, //营业执照统一社会信用代码号码
        linkedAcctName: res.merchantBusinessPlatformApply.linkedAcctName, //对公账户名
        linkedBankCode: res.merchantBusinessPlatformApply.linkedBankCode, //银行编码
        linkedBrBankName: res.merchantBusinessPlatformApply.linkedBrBankName, //对公账户开户行名
        linkedBrBankNo: res.merchantBusinessPlatformApply.linkedBrBankNo, //对公账户开户行号
        merchantType: res.merchantType,
        sourceId: res.sourceId,
        merchantApplyId: res.id
      }
      
      this.identityCardObverseList.push({ url: res.merchantBusinessPlatformApply.idPortrait });
      this.identityCardReverseList.push({ url: res.merchantBusinessPlatformApply.idEmblem });
      this.unifiedCodeUrlList.push({ url: res.merchantBusinessPlatformApply.unifiedCodeUrl });
      this.isLongTerm = res.merchantBusinessPlatformApply.idExp === '99991231';
      this.isLegalreptLongTerm = res.merchantBusinessPlatformApply.legalreptIdExp === '99991231';

      if (!this.isLegalreptLongTerm) {
        let d = res.merchantBusinessPlatformApply.legalreptIdExp.replace(
          /^(\d{4})(\d{2})(\d{2})$/,
          "$1-$2-$3"
        );
        this.showDate = new Date(d).getTime();
      }
      if (!this.isLongTerm) {
        let d = res.merchantBusinessPlatformApply.idExp.replace(
          /^(\d{4})(\d{2})(\d{2})$/,
          "$1-$2-$3"
        );
        this.showEnterDate = new Date(d).getTime();
      }
    },
    onResetTimer(){
      clearInterval(this.timer);
      this.timer = null;
      this.timeCount = 60;
      this.isTimeOut = false;
      this.isSubmit = false;
    }
  },
};
</script>
<style lang="scss">
.van-cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
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