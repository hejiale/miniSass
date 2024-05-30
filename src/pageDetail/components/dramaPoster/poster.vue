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
import { getImageSize } from "@/utils/index";
export default {
  props: {
    drama: {
      type: Object,
      default() {
        return {};
      },
    },
    isShowPoster:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canvasWidth: 320, // 默认canvas宽高
      canvasHeight: 480,
      widget: null,
      sunCode: null,
      canvasImgPortrait: false,
      canvasBg: null,
      show: false,
    };
  },
  async created() {
    wx.showLoading({ title: "海报生成中..." });

    await this.getSunCode();

    //先查询图片宽高尺寸
    this.canvasBg = this.drama.dramaCover;

    let info = await getImageSize(this.canvasBg);
    this.canvasImgPortrait =
      parseFloat(info.ImageWidth.value) < parseFloat(info.ImageHeight.value);

    console.log(this.canvasImgPortrait);
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.canvasWidth = res.screenWidth;
        this.canvasHeight =
          res.screenHeight * (this.canvasImgPortrait ? 0.65 : 0.45);
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
      //计算行数
      let fontSize = this.canvasWidth * 0.053;
      let nameWidth = this.canvasWidth * 0.7;
      let lineNum = Math.ceil(nameWidth / fontSize);
      let texts = this.drama.dramaName.split("");
      let line = Math.ceil(texts.length / lineNum);
      console.log(line);
      let words = [];
      if (line > 1) {
        texts.map((v, idx) => {
          if (idx < lineNum - 2) {
            words.push(v);
          } else {
            words.push("...");
          }
        });
      } else {
        words = texts;
      }
      let posterBottom = this.$iconFont.getIconName("poster-bottom");
      let darkBg = this.$iconFont.getIconName("icon-dark-bg");
      let time = `${this.drama.maleGamerNum}男${this.drama.femaleGamerNum}女 ${this.drama.gameTime}小时`;
      let dictValue = this.drama.dramaThemeList
        .map((v) => v.dictValue)
        .join(" ");

      let _wxml = wxml(
        this.canvasBg,
        posterBottom,
        this.sunCode,
        words.join(""),
        darkBg,
        time,
        dictValue
      );

      const _style = style(
        this.canvasWidth,
        this.canvasHeight,
        this.canvasImgPortrait
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
          page: "pageDetail/pages/pageDetail",
          dynamicId: this.drama.id,
          envVersion: "trial",
        });
        this.sunCode = res.data;
      } catch (e) {}
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