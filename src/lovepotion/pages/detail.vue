<template>
  <div class="container" v-if="activityDetail">
    <div class="container-titleBox" :style="titleStyle">
      <image class="container-titleBox-cover" v-if="opacity > 0"></image>
      <div class="container-titleBox-left">
        <image src="../static/image/detail-back.png" />
        <div class="container-titleBox-left-back" @click="onBack"></div>
        <div class="container-titleBox-left-share">
          <button open-type="share"></button>
        </div>
      </div>
    </div>
    <swiper
      class="container-swiperBox"
      :current="current"
      @change="onChangeSwiper"
    >
      <swiper-item v-for="v in activityDetail.url" :key="v">
        <image :src="v" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <div class="container-countBox">
      <span>{{ current + 1 }}/{{ activityDetail.url.length }}</span>
    </div>
    <image class="container-bg"></image>
    <div class="container-content">
      <div class="container-content-title">
        {{ activityDetail.title }}
      </div>
      <div class="container-content-time">
        <image
          src="../static/image/icon-date.png"
          class="container-content-place-tag"
        ></image>
        <span class="container-content-place-value"
          >活动时间：{{
            $dayjs(activityDetail.eventStartTime).format("YYYY-MM-DD HH:mm")
          }}</span
        >
        <image
          src="../static/image/right-arrow.png"
          class="container-content-place-arrow"
        ></image>
        <calendar
          :calendarTitle="activityUserInfo.title"
          :calendarDate="activityUserInfo.eventStartTime"
        ></calendar>
      </div>
      <div class="container-content-place" @click="onLocation">
        <image
          src="../static/image/icon-location.png"
          class="container-content-place-tag"
        ></image>
        <span class="container-content-place-value"
          >活动地点：{{ activityDetail.address }}</span
        >
        <image
          src="../static/image/right-arrow.png"
          class="container-content-place-arrow"
        ></image>
      </div>
      <parseHtml
        :content="activityDetail.content"
        class="container-content-htmlBox"
      ></parseHtml>
    </div>
    <!-- 活动已报名 -->
    <div
      class="container-bottomEndBox"
      v-if="activityDetail.reg"
      @click="onGoSuccessPage"
    >
      <image src="../static/image/icon-hasBook.png"></image>
    </div>
    <!-- 活动结束 -->
    <div
      class="container-bottomEndBox"
      v-else-if="activityDetail.lpActivityStatus === 'EVENT_ENDED'"
    >
      <image src="../static/image/activity-end.png"></image>
    </div>
    <!-- 活动开始 -->
    <div
      class="container-bottomEndBox"
      v-else-if="activityDetail.lpActivityStatus === 'EVENT_STARTED'"
    >
      <image src="../static/image/activity-begin.png"></image>
    </div>
    <!-- 活动报名截止 -->
    <div
      class="container-bottomEndBox"
      v-else-if="activityDetail.lpActivityStatus === 'REGISTRATION_CLOSED'"
    >
      <image src="../static/image/activity-close.png"></image>
    </div>
    <!-- 报名开始 -->
    <div
      class="container-bottomBox"
      v-else-if="activityDetail.lpActivityStatus === 'REGISTRATION_OPEN'"
    >
      <image
        class="button"
        src="../static/image/icon-book.png"
        :style="canDo"
        @click="isCheck ? (showMember = true) : ''"
        v-if="lpUserInfo.lpMembershipPackageId"
      ></image>
      <div v-else>
        <image
          class="container-bottomBox-left"
          src="../static/image/no-member-book.png"
          @click="isCheck ? (showBook = true) : ''"
          :style="canDo"
        ></image>
        <image
          class="right"
          src="../static/image/member-book.png"
          @click="onBuyMember"
          :style="canDo"
        ></image>
      </div>
      <BindPhone
        v-if="!userInfo.phone"
        @on-success-authorize="onRefreshUserInfo"
      ></BindPhone>
      <div class="container-bottomBox-top">
        <image
          src="../static/image/icon-check.png"
          v-if="isCheck"
          @click="onCheck(false)"
        ></image>
        <image
          src="../static/image/icon-unCheckBox.png"
          v-else
          @click="onCheck(true)"
        ></image>
        <span class="container-bottomBox-top-value" @click="onGoAgreement"
          >《LovePotion活动参与协议》</span
        >
      </div>
    </div>
    <!-- 非会员购买 -->
    <div class="popBookBox" v-if="showBook">
      <div class="popBookBox-bg" @click="showBook = false"></div>
      <div class="popBookBox-content">
        <image
          :src="$iconFont.getIconName('pop-book-bg')"
          class="popBookBox-content-bg"
        ></image>
        <div class="popBookBox-content-inputContent">
          <image
            :src="avatar"
            class="popBookBox-content-inputContent-avatar"
            @click="onUpload"
            v-if="avatar"
            mode="aspectFill"
          ></image>
          <image
            src="../static/image/upload-pics.png"
            class="popBookBox-content-inputContent-upload"
            @click="onUpload"
            v-else
          ></image>
          <div class="popBookBox-content-inputContent-inputBox">
            <input
              placeholder-class="placeholder"
              placeholder="请输入您的姓名"
              v-model="name"
              @input="onInput"
              maxlength="10"
            />
          </div>
          <div
            class="popBookBox-content-inputContent-inputBox"
            @click="showPicker = true"
          >
            <input
              placeholder-class="placeholder"
              placeholder="请选择您的性别"
              disabled
              v-model="sex"
            />
          </div>
          <div class="popBookBox-content-inputContent-inputBox">
            <input
              placeholder-class="placeholder"
              placeholder="请输入手机号"
              type="number"
              v-model="phone"
            />
          </div>
        </div>
        <div class="popBookBox-content-pay" :style="canDoPay" @click="onPay">
          ¥{{ activityDetail.price / 100 }}付费报名
        </div>
      </div>
    </div>
    <van-popup
      :show="showPicker"
      position="bottom"
      @click-overlay="showPicker = false"
      close-on-click-overlay
      round
    >
      <van-picker
        show-toolbar
        title="选择性别"
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onSureSex"
      />
    </van-popup>
    <!-- 会员购买 -->
    <div class="popMemberBox" v-if="showMember">
      <div class="popMemberBox-bg" @click="showMember = false"></div>
      <div class="popMemberBox-content">
        <image
          class="popMemberBox-content-bg"
          :src="$iconFont.getIconName('popMember-bg')"
        ></image>
        <div class="popMemberBox-content-title">是否以此信息身份参加活动?</div>
        <image
          src="../static/image/member-border.png"
          class="popMemberBox-content-border"
        ></image>
        <image
          class="popMemberBox-content-avatar"
          :src="lpUserInfo.avatar"
          mode="aspectFill"
        ></image>
        <span class="popMemberBox-content-info"
          >{{ lpUserInfo.name }} {{ $enums.LP_SEX.getName(lpUserInfo.sex) }}
          {{ lpUserInfo.phone }}</span
        >
        <div class="popMemberBox-content-left" @click="onShowOther">
          其他身份参加<image
            src="../static/image/letter-right-arrow.png"
            class="popMemberBox-content-left-arrow"
          ></image>
        </div>
        <div class="popMemberBox-content-right" @click="onSubmit">确定</div>
      </div>
    </div>
    <!-- 会员其他信息 -->
    <div class="popBookBox" v-if="showOther">
      <div class="popBookBox-bg" @click="showOther = false"></div>
      <div class="popBookBox-content">
        <image
          :src="$iconFont.getIconName('pop-book-bg')"
          class="popBookBox-content-bg"
        ></image>
        <div class="popBookBox-content-inputContent">
          <image
            :src="avatar"
            class="popBookBox-content-inputContent-avatar"
            @click="onUpload"
            v-if="avatar"
            mode="aspectFill"
          ></image>
          <image
            src="../static/image/upload-pics.png"
            class="popBookBox-content-inputContent-upload"
            @click="onUpload"
            v-else
          ></image>
          <div class="popBookBox-content-inputContent-inputBox">
            <input
              placeholder-class="placeholder"
              placeholder="请输入您的姓名"
              v-model="name"
              @input="onInput"
              maxlength="10"
            />
          </div>
          <div
            class="popBookBox-content-inputContent-inputBox"
            @click="showPicker = true"
          >
            <input
              placeholder-class="placeholder"
              placeholder="请选择您的性别"
              disabled
              v-model="sex"
            />
          </div>
          <div class="popBookBox-content-inputContent-inputBox">
            <input
              placeholder-class="placeholder"
              placeholder="请输入手机号"
              type="number"
              v-model="phone"
            />
          </div>
        </div>
        <div class="popBookBox-content-leftNone" @click="showOther = false">
          取消
        </div>
        <div class="popBookBox-content-right" @click="onOtherSubmit">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getMenuButtonRect } from "@/utils/index";
import { checkContent } from "@/utils/index";
import { uploadFile } from "@/utils";
import service from "../utils/service";
import parseHtml from "../../components/mp-html/components/mp-html/mp-html.vue";
import BindPhone from "@/components/bindPhone/index.vue";
import calendar from "@/components/requireAuth/calendar.vue";
export default {
  components: {
    parseHtml,
    BindPhone,
    calendar,
  },
  data() {
    return {
      activityId: null,
      menuReact: null,
      userInfo: null,
      isCheck: false,
      showPicker: false,
      showBook: false,
      showMember: false,
      showOther: false,
      sex: null,
      phone: null,
      name: null,
      avatar: null,
      activityDetail: null,
      canPay: false,
      lpUserInfo: null,
      opacity: 0,
      current: 0,
      inviteUserId: null
    };
  },
  async onLoad(option) {
    this.activityId = option.id;

    if(option.inviteUserId){
      this.inviteUserId = option.inviteUserId
    }

    this.menuReact = await getMenuButtonRect();
  },
  async onShow() {
    this.userInfo = await this.$checkLogin.getUserInfo();

    await this.queryActivityDetail();
    await this.getMemberInfo();
  },
  onShareAppMessage() {
    return {
      title: this.activityDetail.title,
      path: `/lovepotion/pages/detail?id=${this.activityDetail.id}`,
      imageUrl: this.activityDetail.url[0],
    };
  },
  onPageScroll(e) {
    this.opacity = Math.min(e.scrollTop / 90, 0.86);
  },
  computed: {
    columns() {
      return this.$enums.LP_SEX.list;
    },
    canSubmit() {
      return this.sex && this.name && this.phone
        ? "opacity: 1;"
        : "opacity: 0.5;";
    },
    canDo() {
      return this.isCheck ? "opacity: 1;" : "opacity: 0.5;";
    },
    titleStyle() {
      if (!this.menuReact) return null;
      return `padding-top: ${this.menuReact.top}px;`;
    },
    canDoPay() {
      return this.name && this.sex && this.phone
        ? "opacity: 1;"
        : "opacity: 0.5;";
    },
  },
  methods: {
    onBack() {
      if (getCurrentPages().length === 1) {
        uni.reLaunch({
          url: "/lovepotion/pages/index",
        });
      } else {
        uni.navigateBack();
      }
    },
    onChangeSwiper(e) {
      this.current = e.detail.current;
    },
    onGoAgreement() {
      uni.navigateTo({
        url: "./agreement",
      });
    },
    async onInput(e) {
      try {
        await checkContent(e.detail.value);
      } catch (e) {
        this.name = "";
      }
    },
    onCheck(status) {
      this.isCheck = status;
    },
    onShowOther() {
      this.showMember = false;
      this.showOther = true;
    },
    onLocation() {
      uni.openLocation({
        longitude: this.activityDetail.longitude,
        latitude: this.activityDetail.latitude,
        address: this.activityDetail.address, //xxx
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    async getMemberInfo() {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
    },
    onUpload() {
      let vm = this;
      uni.chooseMedia({
        count: 1,
        mediaType: ["image"],
        success: function (res) {
          uni.showLoading("上传中...");

          uploadFile(res.tempFiles[0].tempFilePath).then((e) => {
            vm.avatar = e;
            uni.hideLoading();
          });
        },
      });
    },
    //跳转票根页面
    onGoSuccessPage() {
      uni.navigateTo({
        url: `./successBook?id=${this.activityDetail.id}&userId=${this.userInfo.id}`,
      });
    },
    onSureSex(e) {
      this.sex = e.detail.value.text;
      this.showPicker = false;
    },
    //已有会员信息做活动报名
    async onSubmit() {
      if (this.canPay) return;
      this.canPay = true;

      await service.LpActivityUserMemberReg({
        lpUserId: this.lpUserInfo.id,
        sex: this.lpUserInfo.sex,
        name: this.lpUserInfo.name,
        phone: this.lpUserInfo.phone,
        avatar: this.lpUserInfo.avatar,
        lpActivityId: this.activityDetail.id,
        inviteLpUserId: this.inviteUserId
      });
      uni.showToast({
        title: "报名成功！",
      });

      setTimeout(() => {
        this.showMember = false;
        this.canPay = false;
        this.onGoSuccessPage();
      }, 500);
    },
    //会员其他信息做活动报名
    async onOtherSubmit() {
      if (!this.name || !this.sex || !this.phone) return;

      if (this.canPay) return;
      this.canPay = true;

      await service.LpActivityUserMemberReg({
        lpUserId: this.lpUserInfo.id,
        sex: this.$enums.LP_SEX.getValue(this.sex),
        name: this.name,
        phone: this.phone,
        avatar: this.avatar,
        lpActivityId: this.activityDetail.id,
        inviteLpUserId: this.inviteUserId
      });
      uni.showToast({
        title: "报名成功！",
      });

      setTimeout(() => {
        this.showOther = false;
        this.onGoSuccessPage();
        this.canPay = false;
      }, 500);
    },
    //非会员支付报名
    async onPay() {
      if (!this.name || !this.sex || !this.phone) return;

      this.$checkLogin.doPay(
        this.userInfo.id,
        this.activityDetail.price,
        "LP_ACTIVITY_PRODUCT",
        this.activityDetail.title,
        this.activityDetail.productId,
        "USER",
        "USER",
        1,
        {
          avatar: this.avatar,
          lpActivityId: this.activityDetail.id,
          name: this.name,
          phone: this.phone,
          sex: this.$enums.LP_SEX.getValue(this.sex),
          inviteLpUserId: this.inviteUserId
        }
      ).then(_=>{
        uni.showToast({
          title: "报名成功！",
        });

        setTimeout(() => {
          this.showBook = false;
          this.onGoSuccessPage();
        }, 500);
      }).catch(e=>{

      })
    },
    //查询活动详情
    async queryActivityDetail() {
      this.activityDetail = await service.LpActivityDetail({
        activityId: this.activityId,
        userId: this.userInfo.id,
      });
    },
    //重新授权
    async onRefreshUserInfo() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
    onBuyMember() {
      if (!this.isCheck) return;

      if(this.lpUserInfo){
        uni.navigateTo({
          url: "./buyMember",
        });
      }else{
        uni.navigateTo({
          url: `./book?isBuy=1`,
        });
      }
    },
  },
};
</script>
<style>
.placeholder {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 30rpx;
  color: #775b62;
}
</style>
<style lang="scss" scoped>
.container {
  &-titleBox {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    @include hor;
    align-items: center;
    z-index: 2;
    padding-bottom: 20rpx;
    background: linear-gradient(180deg, #ff5485 0%, rgba(255, 84, 133, 0) 100%);
    &-left {
      width: 176rpx;
      height: 64rpx;
      margin-left: 24rpx;
      position: relative;
      @include hor;
      image {
        @include abscenter;
        z-index: -1;
      }
      &-back,
      &-share {
        display: flex;
        flex: 1;
        position: relative;
        button {
          background: transparent;
        }
        button::after {
          border: none !important;
        }
      }
    }
    &-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #000000;
      text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
    }
    &-cover {
      @include abscenter;
      z-index: -1;
      backdrop-filter: blur(10px);
    }
  }
  &-swiperBox {
    width: 100vw;
    height: 61.57vh;
  }
  &-countBox {
    position: absolute;
    right: 24rpx;
    top: 55.78vh;
    width: 90rpx;
    height: 42rpx;
    background: url("../static/image/icon-image-count.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    @include hor-center-center;
    span {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 20rpx;
      color: #ffffff;
      margin-left: 30rpx;
    }
  }
  &-content {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 59.6vh;
    background: #ffffff;
    z-index: 1;
    border-radius: 24rpx;
    padding: 40rpx 32rpx;
    box-sizing: border-box;
    @include ver;
    align-items: flex-start;
    &-title {
      font-size: 36rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      line-height: 42rpx;
      padding-bottom: 8rpx;
      word-break: break-all;
    }
    &-time,
    &-place {
      @include hor;
      align-items: center;
      height: 28px;
      background: #f9f9f9;
      border-radius: 21px;
      margin-top: 24rpx;
      position: relative;
      &-tag {
        width: 32rpx;
        height: 32rpx;
        margin-left: 16rpx;
      }
      &-arrow {
        width: 16rpx;
        height: 16rpx;
        padding-right: 20rpx;
      }
      &-value {
        margin-left: 12rpx;
        font-size: 26rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #575b66;
        padding-right: 8rpx;
        max-width: 70vw;
        @include text-overflow-line(1);
      }
      &-button {
        @include abscenter;
        background: unset !important;
      }
      button::after {
        border: unset !important;
      }
    }
    &-htmlBox {
      margin-top: 48rpx;
      width: 100vw;
      margin-left: -32rpx;
      border-top: 8rpx solid #f6f7f9;
      padding-bottom: 20vh;
      word-break: break-all;
    }
  }
  &-bottomEndBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #ffffff;
    z-index: 1;
    border-top: 2rpx solid #d6d9e0;
    @include hor-center-center;
    padding-top: 32rpx;
    padding-bottom: 56rpx;
    image {
      width: 670rpx;
      height: 88rpx;
    }
  }
  &-bottomBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 248rpx;
    background: #ffffff;
    z-index: 1;
    border-top: 1px solid #d6d9e0;
    &-left {
      position: absolute;
      left: 40rpx;
      top: 28rpx;
      width: 41.3vw;
      height: 88rpx;
    }
    .right {
      position: absolute;
      right: 40rpx;
      top: 28rpx;
      width: 41.3vw;
      height: 88rpx;
    }
    .button {
      position: absolute;
      left: 40rpx;
      width: 670rpx;
      top: 28rpx;
      height: 88rpx;
    }
    &-top {
      position: absolute;
      left: 0rpx;
      bottom: 72rpx;
      @include hor;
      align-items: center;
      image {
        padding-left: 40rpx;
        padding-right: 16rpx;
        width: 32rpx;
        height: 32rpx;
      }
      &-value {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #61666d;
      }
      &-value::before {
        color: #2e323e;
        content: "我已阅读并同意";
      }
    }
  }
}
.popBookBox {
  @include fiexcenter;
  @include hor-center-center;
  z-index: 2;
  &-bg {
    @include abscenter;
    background: rgba(#000, 0.5);
  }
  &-content {
    position: absolute;
    width: 82.66vw;
    height: 1018rpx;
    &-bg {
      @include abscenter;
    }
    &-inputContent {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      top: 234rpx;
      @include ver;
      align-items: center;
      &-upload {
        width: 144rpx;
        height: 144rpx;
      }
      &-avatar {
        width: 144rpx;
        height: 144rpx;
        border-radius: 50%;
      }
      &-inputBox {
        margin-top: 36rpx;
        width: 72vw;
        height: 96rpx;
        background: rgba(255, 255, 255, 0.79);
        border-radius: 8px;
        padding: 28rpx 32rpx;
        box-sizing: border-box;
        input {
          color: #834658;
          font-size: 30rpx;
        }
      }
    }
    &-left,
    &-leftNone {
      position: absolute;
      left: 38rpx;
      bottom: 84rpx;
      width: 34vw;
      height: 92rpx;
      background: #ffffff;
      border-radius: 50px;
      border: 1px solid #ff5485;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 30rpx;
      color: #ff5485;
      @include hor-center-center;
    }
    &-leftNone {
      border: 1px solid #e7e7e7;
      color: #999999;
    }
    &-right {
      position: absolute;
      right: 38rpx;
      bottom: 84rpx;
      width: 34vw;
      height: 92rpx;
      background: #ff5485;
      border-radius: 50px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 30rpx;
      color: #ffffff;
      @include hor-center-center;
    }
    &-pay {
      position: absolute;
      left: 38rpx;
      right: 38rpx;
      bottom: 84rpx;
      width: 72vw;
      height: 92rpx;
      background: #ff5485;
      border-radius: 50px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 30rpx;
      color: #ffffff;
      @include hor-center-center;
    }
  }
}
.popMemberBox {
  @include fiexcenter;
  @include hor-center-center;
  z-index: 2;
  &-bg {
    @include abscenter;
    background: rgba(#000, 0.5);
  }
  &-content {
    position: absolute;
    width: 620rpx;
    height: 560rpx;
    @include ver;
    align-items: center;
    &-bg {
      @include abscenter;
    }
    &-title {
      position: absolute;
      top: 40rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 32rpx;
      color: #000000;
      line-height: 38rpx;
    }
    &-border {
      position: absolute;
      top: 106rpx;
      width: 228rpx;
      height: 228rpx;
      z-index: 2;
    }
    &-avatar {
      position: absolute;
      top: 148rpx;
      width: 144rpx;
      height: 144rpx;
      border-radius: 50%;
    }
    &-info {
      position: absolute;
      top: 328rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 26rpx;
      color: #7d245a;
      line-height: 30rpx;
    }
    &-left {
      position: absolute;
      left: 40rpx;
      bottom: 40rpx;
      width: 256rpx;
      height: 92rpx;
      background: #ffffff;
      border-radius: 50px;
      border: 1px solid #e7e7e7;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 30rpx;
      color: #999999;
      @include hor-center-center;
      &-arrow {
        width: 16rpx;
        height: 16rpx;
        margin-left: 8rpx;
      }
    }
    &-right {
      position: absolute;
      right: 40rpx;
      bottom: 40rpx;
      width: 256rpx;
      height: 92rpx;
      background: #ff5485;
      border-radius: 50px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 30rpx;
      color: #ffffff;
      @include hor-center-center;
    }
  }
}
</style>