<template>
  <div class="container" v-if="storeInfo">
    <div
      class="backBox"
      :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
      @click="onBack"
    >
      <van-icon name="arrow-left" color="#000" size="24" />
    </div>
    <div
      class="titleBox"
      :style="{ top: `${menuRect.top}px` }"
    >
      <div class="titleBox-title">
        门店相册 ({{ storeInfo.imageList.length }})
      </div>
      <div class="titleBox-storeName">{{ storeInfo.storeName }}</div>
    </div>
    <scroll-view scroll-y class="container-listBox" v-if="storeInfo.imageList.length">
      <div
        class="container-listBox-item"
        v-for="(v,idx) in storeInfo.imageList"
        :key="v.id"
        @click="onPreView(idx)"
      >
        <image :src="v.fileUrl" mode="aspectFill" v-if="isImage(v.fileUrl)" />
        <image
          :src="v.fileUrl + '?x-oss-process=video/snapshot,t_1000,m_fast'"
          mode="aspectFill"
          v-else
        />
        <image
          src="../static/image/icon-play.png"
          class="container-listBox-item-playIcon"
          v-if="!isImage(v.fileUrl)"
        />
      </div>
    </scroll-view>
    <notcData top="20vh" note="店铺暂未上传" v-else/>
  </div>
</template>
<script>
import { getMenuButtonRect, judgeMediaType } from "@/utils/index";
import notcData from "@/components/notc-data/index.vue";
export default {
  components:{
    notcData
  },
  data() {
    return {
      menuRect: null,
      storeInfo: null,
    };
  },
  async onLoad() {
    this.menuRect = await getMenuButtonRect();
    this.storeInfo = JSON.parse(uni.getStorageSync("store-detail"));
  },
  computed: {
    isImage() {
      return function (v) {
        if (v) {
          if (judgeMediaType(v) === "image") {
            return true;
          }
          return false;
        }
      };
    },
  },
  methods: {
    onBack(){
      uni.navigateBack();
    },
    onPreView(index) {
      let sources = [];
      this.storeInfo.imageList.map((v) => {
        sources.push({
          url: v.fileUrl,
          type: judgeMediaType(v.fileUrl) === "image" ? "image" : "video",
          poster: judgeMediaType(v.fileUrl) === 'video' ? `${v.fileUrl}?x-oss-process=video/snapshot,t_1000,m_fast`: null
        });
      });
      uni.previewMedia({
        current: index,
        sources,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  .backBox {
    position: absolute;
    left: 24rpx;
    @include ver;
    justify-content: center;
    z-index: 1;
  }
  .titleBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @include ver;
    align-items: center;
    &-title {
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      line-height: 38rpx;
    }
    &-storeName {
      margin-top: 10rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      line-height: 28rpx;
      @include text-overflow-line(1);
    }
  }
  &-listBox {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    bottom: 0;
    top: 12.2vh;
    &-item {
      display: inline-block;
      width: 45.6vw;
      height: 45.6vw;
      margin-right: 18rpx;
      margin-bottom: 12rpx;
      border-radius: 12rpx;
      overflow: hidden;
      position: relative;
      &-playIcon {
        width: 72rpx;
        height: 72rpx;
        position: absolute;
        left: calc(50% - 36rpx);
        top: calc(50% - 36rpx);
      }
    }
  }
}
</style>