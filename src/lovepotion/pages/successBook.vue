<template>
  <div class="container">
    <image
      :src="$iconFont.getIconName('lp-book-success')"
      class="container-bg"
    ></image>
    <div class="container-titleBox" :style="titleStyle" @click="onBack">
      <image
        src="../static/image/round-back.png"
        class="container-titleBox-back"
      ></image>
      <span class="container-titleBox-title">成功报名</span>
    </div>
    <image
      :src="posterImg"
      class="container-posterBox"
      mode="heightFix"
    ></image>
    <image
      src="../static/image/fix-rule.png"
      class="container-rule"
      @click="showRule = true"
    ></image>
    <div class="container-save">
      <image
        src="../static/image/long-savePics.png"
      ></image>
      <album :posterImg="posterImg"></album>
    </div>
    <div class="container-bottomBox">
      <div class="container-bottomBox-calendar">
        <image src="../static/image/add-arrive.png"></image>
        <calendar :calendarTitle="activityUserInfo.title" :calendarDate="activityUserInfo.eventStartTime"></calendar>
      </div>
      <image src="../static/image/add-location.png" @click="onLocation"></image>
      <image
        src="../static/image/add-contact.png"
        @click="showContact = true"
      ></image>
    </div>
    <div style="height: 50px"></div>
    <div class="popRuleBox" v-if="showRule">
      <div class="popRuleBox-bg" @click="showRule = false"></div>
      <div class="popRuleBox-content">
        <image src="../static/image/pop-rule-top.png"></image>
        <div class="popRuleBox-content-scroll">
          <span class="popRuleBox-content-scroll-title">确认报名信息：</span>
          <span class="popRuleBox-content-scroll-value"
            >请在报名后仔细核对您提供的个人信息，确保姓名、联系方式等准确无误。如有错误，请尽早联系活动主办方进行更正。</span
          >
          <span class="popRuleBox-content-scroll-title2"
            >提前了解活动详情：</span
          >
          <span class="popRuleBox-content-scroll-value2"
            >在活动前，详细了解活动的时间、地点、议程安排以及其他相关信息。这有助于您更好地准备，并确保您不会错过任何重要环节。</span
          >
          <span class="popRuleBox-content-scroll-title3">携带必备物品：</span>
          <span class="popRuleBox-content-scroll-value3"
            >根据活动性质，准备必备物品如身份证、报名凭证、特定装备等。确保您在活动现场能够顺利参与，并有一个愉快的体验。</span
          >
          <span class="popRuleBox-content-scroll-title4"
            >关注活动社交媒体：</span
          >
          <span class="popRuleBox-content-scroll-value4"
            >若活动有相关的社交媒体账号或活动平台，请关注并保持与主办方的互动。这样您可以获取及时的活动更新、通知或变更信息。</span
          >
          <span class="popRuleBox-content-scroll-title5">注意签到时间：</span>
          <span class="popRuleBox-content-scroll-value5"
            >准时参加签到是参与活动的重要步骤。请提前安排好行程，确保您能在规定的签到时间内到达活动现场。</span
          >
          <image
            src="../static/image/pop-rule-bottom.png"
            class="popRuleBox-content-scroll-cover"
          ></image>
        </div>
      </div>
    </div>
    <van-popup
      :show="showContact"
      position="bottom"
      @click-overlay="showContact = false"
      close-on-click-overlay
      round
    >
      <customComponent></customComponent>
    </van-popup>
    <wxml-to-canvas
      class="widget"
      :width="canvasWidth"
      :height="canvasHeight"
    ></wxml-to-canvas>
  </div>
</template>
<script>
import { getMenuButtonRect } from "@/utils/index";
import customComponent from "./custom/index.vue";
import service from "../utils/service";
import calendar from "@/components/requireAuth/calendar.vue";
import album from "@/components/requireAuth/photosAlbum.vue";
const { wxml, style } = require("./poster/DomData.js");
export default {
  components: {
    customComponent,
    calendar,
    album
  },
  data() {
    return {
      showRule: false,
      showContact: false,
      menuReact: null,
      canvasWidth: 294, // 默认canvas宽高
      canvasHeight: 554,
      widget: null,
      posterImg: null,
      activityUserInfo: null,
    };
  },
  computed: {
    titleStyle() {
      if (!this.menuReact) return null;
      return `padding-top: ${this.menuReact.top}px;`;
    },
  },
  async onLoad(options) {
    wx.showLoading({ title: "海报生成中..." });

    this.menuReact = await getMenuButtonRect();

    await this.queryActivityUserInfo(options.id, options.userId);

    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.canvasWidth = 294;
        this.canvasHeight = 554;
        this.show = true;

        // 数字容器宽度 动态设置
        setTimeout(() => {
          this.widget = this.selectComponent(".widget");
          this.renderToCanvas();
        }, 1000);
      },
    });
  },
  methods: {
    onBack() {
      uni.navigateBack();
    },
    // wxml 转 canvas
    async renderToCanvas() {
      let title = this.getWords(this.activityUserInfo.title, 1, 0.078, 1);
      console.log(title);
      let _wxml = wxml(this.activityUserInfo, title);

      const _style = style(this.canvasWidth, this.canvasHeight);
      const p1 = this.widget.renderToCanvas({ wxml: _wxml, style: _style });
      p1.then((result) => {
        const p2 = this.widget.canvasToTempFilePath();
        p2.then((result) => {
          wx.hideLoading();
          this.posterImg = result.tempFilePath;
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    onLocation() {
      uni.openLocation({
        longitude: this.activityUserInfo.longitude,
        latitude: this.activityUserInfo.latitude,
        address: this.activityUserInfo.address, //xxx
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    //查询人员活动详情
    async queryActivityUserInfo(lpActivityId, userId) {
      this.activityUserInfo = await service.activityUserDetail({
        lpActivityId,
        userId,
      });
    },
    //计算行数
    getWords(text, maxLine, fontSizeScale, widthScale) {
      let fontSize = this.canvasWidth * fontSizeScale;
      let nameWidth = this.canvasWidth * widthScale;
      let lineNum = Math.ceil(nameWidth / fontSize);
      let texts = text.split("");
      let line = Math.ceil(texts.length / lineNum);
      console.log(line);
      let words = [];
      if (line > maxLine) {
        texts.map((v, idx) => {
          if (idx < lineNum * maxLine - 2) {
            words.push(v);
          } else {
            words.push("...");
          }
        });
      } else {
        words = texts;
      }
      return words.join("");
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  @include ver;
  align-items: center;
  &-bg {
    @include fiexcenter;
    z-index: -1;
  }
  &-titleBox {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 1;
    @include hor;
    align-items: center;
    padding-bottom: 8rpx;
    &-back {
      width: 68rpx;
      height: 68rpx;
      padding-left: 24rpx;
    }
    &-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #000000;
    }
  }
  &-posterBox {
    margin-top: 254rpx;
    height: 68.22vh;
  }
  &-rule {
    position: fixed;
    right: 0px;
    top: 212rpx;
    width: 56rpx;
    height: 104rpx;
  }
  &-save {
    width: 176rpx;
    height: 34rpx;
    z-index: 1;
    position: relative;
  }
  &-bottomBox {
    margin-top: 64rpx;
    @include hor-center-center;
    &-calendar {
      position: relative;
    }
    image {
      width: 224rpx;
      height: 66rpx;
      margin-right: 8rpx;
    }
  }
}
.widget {
  position: absolute;
  top: -10000px;
  left: 20px;
  width: 294px;
  height: 554px;
}
.popRuleBox {
  @include fiexcenter;
  @include hor-center-center;
  z-index: 2;
  &-bg {
    @include abscenter;
    background: rgba(#000, 0.5);
  }
  &-content {
    position: absolute;
    image:nth-child(1) {
      width: 91.2vw;
      height: 96rpx;
    }
    &-scroll {
      @include ver;
      background: #fff;
      overflow-y: scroll;
      width: 91.2vw;
      padding: 0 30rpx;
      padding-bottom: 96rpx;
      border-bottom-left-radius: 40rpx;
      border-bottom-right-radius: 40rpx;
      box-sizing: border-box;
      max-height: 50vh;
      &-title,
      &-title2,
      &-title3,
      &-title4,
      &-title5 {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #2e323e;
        line-height: 32rpx;
        margin-top: 24rpx;
      }
      &-value,
      &-value2,
      &-value3,
      &-value4,
      &-value5 {
        margin-top: 8rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #5f6572;
        line-height: 32rpx;
      }
      &-cover {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;
        height: 96rpx;
      }
    }
  }
}
</style>