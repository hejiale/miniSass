<template>
  <view class="share-page">
    <wxml-to-canvas
      class="widget"
      :width="canvasWidth"
      :height="canvasHeight"
      v-if="show"
    ></wxml-to-canvas>
  </view>
</template>
<script>
const { wxml, style } = require("./DomData.js");
export default {
  props: {
    drama: {
      type: Object,
      default() {
        return {};
      },
    },
    isShowPoster: {
      type: Boolean,
      default: false,
    },
    evaluateData: {
      type: Object,
      default: null,
    },
    evaluateId: {
      type: Number,
      default () {
        return null
      }
    }
  },
  data() {
    return {
      canvasWidth: 320, // 默认canvas宽高
      canvasHeight: 480,
      widget: null,
      sunCode: null,
      canvasBg: null,
      show: false,
    };
  },
  async created() {
    wx.showLoading({ title: "海报生成中..." });

    await this.getSunCode();

    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.canvasWidth = res.screenWidth;
        //计算评论内容的高度 （还要判断是否有评论图片的情况）94图片高度
        this.canvasHeight = Math.max(this.getCommentHeight(), 38) + 384;

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
    // wxml 转 canvas
    async renderToCanvas() {
      let posterBottom = this.$iconFont.getIconName("poster-bottom");
      let evaluateBg = this.$iconFont.getIconName("scriptEvaluatePoster-bg");
      let evaluateStar = this.$iconFont.getIconName("evaluate-star");
      let evaluateGatherTag = this.$iconFont.getIconName(
        "scriptEvaluatePoster-tag"
      );
      let dictValue = this.drama.dramaThemeList
        .map((v) => v.dictValue)
        .join(" ");
      let time = `${this.drama.maleGamerNum}男${this.drama.femaleGamerNum}女 ${
        this.drama.gameTime
      }小时 ${this.$enums.EXCEED_Type.getName(this.drama.dramaAgeAppropriate)}`;
      let emoj =
        this.drama.dramaEvaluateType === "RECOMMEND"
          ? "evaluate-nice"
          : this.drama.dramaEvaluateType === "SO_SO"
          ? "evaluate-normal"
          : "evaluate-no";
      let emojText =
        this.drama.dramaEvaluateType === "RECOMMEND"
          ? "推荐"
          : this.drama.dramaEvaluateType === "SO_SO"
          ? "一般"
          : "不行";
      let arr = [];
      this.drama.scoreList.map((v) => {
        arr.push(`${v.dictValue}${v.score / 10}`);
      });
      let scoreText = arr.join(" ");

      let montageParma = {
        drama: this.drama,
        posterBottom: posterBottom,
        sunCode: this.sunCode,
        evaluateBg,
        evaluateStar,
        nameWords: this.getWords(0.048, 0.52, this.drama.dramaName, 1),
        evaluateData: this.evaluateData,
        evaluateGatherTag,
        dictValue,
        time,
        nickNameWords: this.getWords(
          0.0346,
          0.2,
          this.evaluateData.nickName,
          1
        ),
        emojImg: this.$iconFont.getIconName(emoj),
        emojText,
        scoreText,
        roleName: this.evaluateData.roleName
          ? `体验角色：${this.evaluateData.roleName}`
          : "",
      };
      let _wxml = wxml({ ...montageParma });

      //评论内容区高度
      const _style = style(
        this.canvasWidth,
        this.canvasHeight,
        this.getLineHeight(), //评论内容高度
        Math.max(this.getCommentHeight(), 38), //评论区图文高度
        this.evaluateData.roleName ? 20 : 0, //角色区高度
        this.evaluateData.roleName ? 62 : (this.getLineHeight() > 0 ? 32 : 0), //评论内容居上
        Math.min((Math.ceil(this.getLen(this.evaluateData.nickName) / 2) * 13) / this.canvasWidth, 0.2), //昵称字宽度比例
        this.getImageTop() > 0 ? (this.getImageTop() + (this.evaluateData.roleName || this.getLineHeight() > 0 ? 10: 28)) : (this.evaluateData.imageList ? 32: 0)
      );
      const p1 = this.widget.renderToCanvas({ wxml: _wxml, style: _style });
      p1.then((result) => {
        const p2 = this.widget.canvasToTempFilePath();
        p2.then((result) => {
          wx.hideLoading();
          this.$emit("update:isShowPoster", false);
          let path = result.tempFilePath;
          wx.showShareImageMenu({
            path: path,
          });
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    //获取太阳码
    async getSunCode() {
      try {
        //trial 体验版 release 正式版
        let res = await this.$api.getSunCode({
          page: "pageDetail/pages/scriptReview",
          dynamicId: `dramaId=${this.drama.id}&evaluateId=${this.evaluateId}`,
          envVersion: "trial",
        });
        this.sunCode = res.data;
      } catch (e) {}
    },
    getWords(fontScale, widthScale, text, maxLine) {
      //计算行数
      let fontSize = this.canvasWidth * fontScale;
      let nameWidth = this.canvasWidth * widthScale;
      let lineNum = Math.ceil(nameWidth / fontSize);
      let texts = text.split("");
      let line = Math.ceil(texts.length / lineNum);
      console.log(line);
      let words = [];
      if (line > maxLine) {
        texts.map((v, idx) => {
          if (idx < lineNum) {
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
    getLineHeight() {
      let fontSize = this.canvasWidth * 0.0373;
      let nameWidth = this.canvasWidth * 0.776;
      let lineNum = Math.ceil(nameWidth / fontSize);

      //计算包含字母和文字的长度
      let len = this.getLen(this.evaluateData.content);

      let line = Math.ceil(len / lineNum / 2);
      console.log(`${line}-------`);
      return Math.max(line * 20, 0);
    },
    //计算包含字母和文字的长度
    getLen(val) {
      let len = 0;
      for (var i = 0; i < val.length; i++) {
        var v = val.charAt(i);
        if (v.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    //计算评论内容的高度
    getCommentHeight() {
      return (
        this.getLineHeight() +
        (this.evaluateData.roleName ? 20 : 0) +
        (this.evaluateData.imageList
          ? (this.canvasWidth * 0.2506 * Math.ceil(this.evaluateData.imageList.length / 3))
          : 10) +
        (this.evaluateData.roleName ? 32 : 0) +
        (this.getLineHeight() > 0 ? 10 : 0) +
        (this.evaluateData.imageList ? 30 : 0) +
        (this.evaluateData.roleName ? 0: 18) +
        (this.evaluateData.imageList ? ((Math.ceil(this.evaluateData.imageList.length / 3) - 1) * 4): 0)
      );
    },
    //获取图片区域居上
    getImageTop() {
      return (
        this.getLineHeight() +
        (this.evaluateData.roleName ? 20 : 0) +
        (this.evaluateData.roleName ? 32 : 0) +
        (this.getLineHeight() > 0 ? (this.evaluateData.roleName ? 10: 32) : 0)
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.share-page {
  background: unset;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1000;
}
.widget {
  position: absolute;
  top: -10000px;
}
</style>