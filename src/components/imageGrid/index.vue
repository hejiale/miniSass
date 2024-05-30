<template>
  <div class="image-grid">
    <div
      class="singleImageBox"
      v-if="images.length === 1"
      @click.stop="onPreView(0)"
    >
      <image
        :src="images[0]"
        v-if="isImage(images[0])"
        :class="isPortrait ? 'portrait' : 'land'"
        mode="aspectFill"
      />
      <image
        :src="videoPoster(images[0])"
        mode="aspectFill"
        v-else
        :class="isPortrait ? 'portrait' : 'land'"
      />
    </div>
    <div
      class="imageListBox-two"
      v-if="images.length === 2"
    >
      <div v-for="(v, idx) in images" :key="idx" :style="{'width': size + 'vw', 'height': size + 'vw'}">
        <image
          :src="v"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-if="isImage(v)"
        />
        <image
          :src="videoPoster(v)"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-else
        />
      </div>
    </div>
    <div
      class="imageListBox-three"
      v-if="images.length === 3"
    >
      <div
        v-for="(v, idx) in images"
        :key="idx"
        :style="{'margin-right': idx === 2 ? 0: 3 + 'px', 'width': size + 'vw', 'height': size + 'vw'}"
      >
        <image
          :src="v"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-if="isImage(v)"
        />
        <image
          :src="videoPoster(v)"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-else
        />
      </div>
    </div>
    <div class="imagesBoxFour" v-if="images.length === 4">
      <div v-for="(v, idx) in images" :key="idx">
        <image
          :src="v"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-if="isImage(v)"
        />
        <image
          :src="videoPoster(v)"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-else
        />
      </div>
    </div>
    <div class="imageListBox-six" v-if="images.length > 4 && images.length <= 6">
      <div
        v-for="(v, idx) in images"
        :key="idx"
        @click.stop="onPreView(idx)"
        :style="{'margin-right': idx === 2 || idx === 5 ? 0: 3 + 'px', 'width': size + 'vw', 'height': size + 'vw'}"
      >
        <image :src="v" mode="aspectFill" v-if="isImage(v)" />
        <image :src="videoPoster(v)" mode="aspectFill" v-else />
      </div>
    </div>
    <div class="imageListBox-more" v-if="images.length > 6">
      <div
        v-for="(v, idx) in images"
        :key="v.id"
        @click.stop="onPreView(idx)"
        :style="{'margin-right': idx === 2 || idx === 5 || idx === 8 ? 0: 3 + 'px', 'width': size + 'vw', 'height': size + 'vw'}"
      >
        <image :src="v" mode="aspectFill" v-if="isImage(v)" />
        <image :src="videoPoster(v)" mode="aspectFill" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { judgeMediaType, getImageSize, getVideoSize } from "@/utils/index";

export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: 0
    }
  },
  computed: {
    isImage() {
      return function (v) {
        return judgeMediaType(v) === "image";
      };
    },
    videoPoster() {
      return function (url) {
        return `${url}?x-oss-process=video/snapshot,t_1000,m_fast`;
      };
    },
  },
  data() {
    return {
      isPortrait: false,
    };
  },
  mounted(){
    this.judgeIsPortrait();
  },
  methods: {
    async judgeIsPortrait() {
      if (this.images.length === 1) {
        //判断图片是否竖向
        let url = this.imagess[0];
        if (judgeMediaType(url) === "video") {
          let info = await getVideoSize(url);
          this.isPortrait =
            parseFloat(info.videoWidth) < parseFloat(info.videoHeight);
        } else {
          let info = await getImageSize(url);
          this.isPortrait =
            parseFloat(info.ImageWidth.value) <
            parseFloat(info.ImageHeight.value);
        }
      }
    },
    onPreView(current) {
      uni.setStorageSync('isPrview', true);
      
      let sources = [];
      this.images.map((v) => {
        sources.push({
          url: v,
          type: judgeMediaType(v) === "image" ? "image" : "video",
          poster:
            judgeMediaType(v) === "video"
              ? `${v}?x-oss-process=video/snapshot,t_1000,m_fast`
              : null,
        });
      });
      uni.previewMedia({
        current,
        sources,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.image-grid {
  .singleImageBox {
    .land {
      width: 60vw;
      height: 60vw;
      border-radius: 24rpx;
    }
    .portrait {
      width: 52.53vw;
      height: 36.57vh;
      border-radius: 24rpx;
    }
  }
  .imageListBox-two {
    white-space: nowrap;
    div {
      margin-right: 6rpx;
      overflow: hidden;
      display: inline-block;
    }
    div:nth-child(1) {
      border-top-left-radius: 24rpx;
      border-bottom-left-radius: 24rpx;
    }
    div:nth-child(2) {
      border-top-right-radius: 24rpx;
      border-bottom-right-radius: 24rpx;
    }
  }
  .imageListBox-three {
    white-space: nowrap;
    div {
      overflow: hidden;
      display: inline-block;
    }
    div:nth-child(1) {
      border-top-left-radius: 32rpx;
      border-bottom-left-radius: 32rpx;
    }
    div:nth-child(3) {
      border-top-right-radius: 32rpx;
      border-bottom-right-radius: 32rpx;
    }
  }
  .imagesBoxFour {
    width: 54vw;
    div {
      width: 25.86vw;
      height: 25.86vw;
      margin-right: 6rpx;
      overflow: hidden;
      display: inline-block;
    }
    div:nth-child(1) {
      border-top-left-radius: 24rpx;
    }
    div:nth-child(2) {
      border-top-right-radius: 24rpx;
    }
    div:nth-child(3) {
      border-bottom-left-radius: 24rpx;
    }
    div:nth-child(4) {
      border-bottom-right-radius: 24rpx;
    }
  }
  .imageListBox-six {
    div {
      display: inline-block;
      overflow: hidden;
    }
    div:nth-child(1) {
      border-top-left-radius: 12rpx;
    }
    div:nth-child(3) {
      border-top-right-radius: 12rpx;
    }
    div:nth-child(4) {
      border-bottom-left-radius: 12rpx;
    }
    div:nth-child(6) {
      border-bottom-right-radius: 12rpx;
    }
  }
  .imageListBox-more {
    div {
      display: inline-block;
      overflow: hidden;
    }
    div:nth-child(1) {
      border-top-left-radius: 12rpx;
    }
    div:nth-child(3) {
      border-top-right-radius: 12rpx;
    }
    div:nth-child(7) {
      border-bottom-left-radius: 12rpx;
    }
    div:nth-child(9) {
      border-bottom-right-radius: 12rpx;
    }
  }
}
</style>
