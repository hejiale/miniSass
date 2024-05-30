<template>
  <div class="introduc">
    <rich-text
      :nodes="formatRichText(content)"
      class="introduction"
      :style="introduceStyle"
    ></rich-text>
    <!-- <div
      class="unfold"
      @click="onExpand"
      v-if="isExpand && isShowExpand && content.length"
    >
      <img
        v-show="isShowArrow"
        src="../static/image/icon-clue-uparrow.png"
        alt=""
      />
      <span>收起</span>
    </div>
    <div
      class="unfold"
      @click="onExpand"
      v-if="!isExpand && isShowExpand && content.length"
    >
      <img
        v-show="isShowArrow"
        src="../static/image/icon-arrow-down.png"
        alt=""
      />
      <span>展开</span>
    </div> -->
  </div>
</template>
<script>
import { formatRichText } from "@/utils";
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
    minLine: {
      type: Number,
      default: 2,
    },
    isShowArrow: {
      type: Boolean,
      default: true,
    },
    isShowExpand: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formatRichText,
      isExpand: false,
    };
  },
  computed: {
    introduceStyle() {
      return this.isExpand
        ? "height: auto;"
        : `max-height: 80rpx;-webkit-line-clamp: ${this.minLine};`;
    },
  },
  methods: {
    onExpand() {
      this.isExpand = !this.isExpand;
      this.$emit("on-change-expand", this.isExpand);
    },
  },
};
</script>
<style lang="scss" scoped>
.introduc {
  position: relative;
  margin-top: 23rpx;
  @include ver;
  .introduction {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(0, 0, 0, 0.7);
    line-height: 40rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
  }
  .unfold {
    // position: absolute;
    // bottom: 0;
    // right: 5rpx;
    height: 40rpx;
    @include hor;
    align-items: center;
    background: #ffffff;
    margin-left: 86%;
    img {
      width: 24rpx;
      height: 24rpx;
    }
    span {
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #d0a03e;
    }
  }
}
</style>
