<template>
  <div>
    <image
      :src="$iconFont.getIconName('ranking-bg')"
      mode="widthFix"
      class="rankBg"
    />
    <div class="topBar" :style="topHeight">
      <div class="backBox" :style="{ top: menuReact.top + 'px' }" @click="onBack">
        <van-icon name="arrow-left" size="20" :color="scrollTop > 40 ? '#111':'#fff'" />
      </div>
      <div
        class="titleBox"
        :style="{ top: menuReact.top + 'px', height: menuReact.height + 'px',  color: scrollTop > 40 ? '#111':'#fff' }"
      >
        排行榜
      </div>
      <div class="ranking-tab">
        <div
          class="tab-item"
          v-for="(i, _) in tabList"
          :key="_"
          :class="{ 'active-tab-item': i === activeItem }"
          @click="changeActive(i)"
        >
          <span>{{ i }}</span>
        </div>
      </div>
    </div>
    <div class="ranking-image" :style="imageTop">
      <image :src="rankingImageUrl" mode="heightFix"></image>
    </div>
    <div class="ranking-main">
      <div
        class="ranking-list"
        v-for="(i, _) in rankingList"
        :key="_"
        @click="dramaDetailNavigator(i.id)"
      >
        <div class="top">
          <image v-if="_ === 0" :src="$iconFont.getIconName('top1')" />
          <image v-if="_ === 1" :src="$iconFont.getIconName('top2')" />
          <image v-if="_ === 2" :src="$iconFont.getIconName('top3')" />
        </div>
        <div class="list-image">
          <image class="primary" :src="i.dramaCover" mode="aspectFill" />
          <image
            class="position"
            v-if="i.sellType == 'LIMITED'"
            :src="$iconFont.getIconName('Citylimit')"
          />
          <image
            class="position"
            v-if="i.sellType == 'REAL_SCENE'"
            :src="$iconFont.getIconName('liveAction')"
          />
          <image
            class="position"
            v-if="i.sellType == 'EXCLUSIVE'"
            :src="$iconFont.getIconName('exclusive')"
          />
        </div>
        <div class="list-text">
          <div class="title">
            <div class="name">{{ $filters.truncateText(i.dramaName, 8) }}</div>
            <div class="right-img">
              <image
                v-if="i.evaluateLevel === 'FULL_SCORE'"
                :src="$iconFont.getIconName('manfenshenzuo')"
                alt="满分神作"
              />
              <image
                v-else-if="i.evaluateLevel === 'EXCELLENT_SCORE'"
                :src="$iconFont.getIconName('juyoubiwan')"
                alt="剧游必玩"
              />
              <image
                v-else-if="i.evaluateLevel === 'GOOD_SCORE'"
                :src="$iconFont.getIconName('youzhijuzuo')"
                alt="优质剧作"
              />
              <image
                v-else-if="i.evaluateLevel === 'NOT_BAD_SCORE'"
                :src="$iconFont.getIconName('zhideyishi')"
                alt="值得一试"
              />
              <image
                v-else-if="i.evaluateLevel === 'PASS_SCORE'"
                :src="$iconFont.getIconName('shuipingzaixian')"
                alt="水平在线"
              />
            </div>
          </div>
          <div class="sub-text">
            <span
              class="dramaText"
              v-for="ite in i.dramaThemeList"
              :key="ite.id"
              >{{ ite.dictValue }}</span
            >
          </div>
          <div class="sub-text">
            {{ i.maleGamerNum }}男{{ i.femaleGamerNum }}女 {{ i.gameTime }}小时
          </div>
          <div class="sub-author">
            <span>作者：</span>
            <div class="authorName">
              {{ joinAuthorNames(i.authorItems) }}
            </div>
          </div>
          <div class="publisher">
            <span class="publisherKey">发行：</span>
            <div class="publisherValue">
              {{ joinPublisherNames(i.publishers) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dramaDetailNavigator } from "@/utils/navigator";
import { getMenuButtonRect } from "@/utils/index";
export default {
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
    navBg: {
      type: Object,
      default: { opacity: 0 },
    },
    jump: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rankingList: [],
      tabList: ["30天热榜", "人气总榜", "口碑榜", "期待榜"],
      activeItem: "30天热榜",
      initialLeft: "100%", // 初始位置，从右侧开始
      isTransition: false,
      rankingHeight: 0,
      menuReact: null,
    };
  },
  computed: {
    rankingImageUrl() {
      let imageUrl = this.$iconFont.getIconName("hot-list-index");
      switch (this.activeItem) {
        case "30天热榜":
          imageUrl = this.$iconFont.getIconName("hot-list-index");
          break;
        case "人气总榜":
          imageUrl = this.$iconFont.getIconName("popularity-ranking");
          break;
        case "口碑榜":
          imageUrl = this.$iconFont.getIconName("wordMouth-list");
          break;
        case "期待榜":
          imageUrl = this.$iconFont.getIconName("lookingForward-list");
          break;
      }
      return imageUrl;
    },
    imageTop() {
      if (!this.menuReact) return;
      return `margin-top: ${this.menuReact.top + this.menuReact.height + 90}px`;
    },
    topHeight() {
      if (!this.menuReact) return;
      return `height: ${this.menuReact.top + this.menuReact.height + 50}px; background: ${this.scrollTop > 40 ? '#f2f2f2':'unset'}`;
    },
  },
  async mounted() {
    this.menuReact = await getMenuButtonRect();
    await this.changeActive(this.jump || this.activeItem);
  },
  methods: {
    onBack(){
      uni.navigateBack();
    },
    dramaDetailNavigator,
    joinAuthorNames(authorItems) {
      return authorItems.map((item) => item.authorName).join(" & ");
    },
    joinPublisherNames(publishers) {
      return publishers.map((item) => item.publisherName).join(" & ");
    },
    // 排行榜切换
    async changeActive(title) {
      this.$emit("handleScrollTo");
      this.activeItem = title;
      let data;

      this.rankingList = [];
      try {
        switch (title) {
          case "30天热榜":
            data = await this.$api.rankingList({ rankType: "HOT_RANK" });
            this.rankingList = data;
            break;
          case "人气总榜":
            data = await this.$api.rankingList({ rankType: "GATHER_SUM_RANK" });
            this.rankingList = data; // 更新对应的数组
            break;
          case "口碑榜":
            data = await this.$api.rankingList({ rankType: "PRAISE_RANK" });
            this.rankingList = data; // 更新对应的数组
            break;
          case "期待榜":
            data = await this.$api.rankingList({ rankType: "FOCUS_RANK" });
            this.rankingList = data; // 更新对应的数组
            break;
          default:
            // 如果不是上述任何一个榜单，可以设置默认行为或者不做任何事
            break;
        }
      } catch (e) {
        // 处理错误，可以通过调用错误提示方法或者设置错误状态
        console.error("Error loading ranking data: ", e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.rankBg {
  position: absolute;
  top: 0px;
}
.topBar {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  z-index: 10;
  .backBox {
    position: absolute;
    left: 0rpx;
    padding: 5px 12px;
    z-index: 1;
  }
  .titleBox {
    position: absolute;
    width: 100vw;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    @include hor-center-center;
  }
}
.ranking-tab {
  position: absolute;
  padding: 28rpx 0rpx 12rpx 24rpx;
  width: 100vw;
  display: flex;
  align-items: center;
  bottom: 0px;
  .tab-item {
    &:not(:last-child) {
      margin-right: 24rpx;
    }

    &.active-tab-item {
      span {
        font-weight: 600;
        color: #2e323e;
        background: #36e4bb;
      }
    }

    span {
      display: inline-block;
      font-size: 28rpx;
      font-weight: 400;
      padding: 12rpx 24rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      color: #5f6572;
      background: #ffffff;
    }
  }
}
.ranking-image {
  position: relative;
  width: 446rpx;
  height: 10.46vh;
  display: flex;
  margin-left: 32.53vw;
}

.ranking-main {
  background: #f2f2f2;
  padding: 24rpx;
  border-radius: 53rpx;
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  margin-top: 92rpx;
  min-height: 60vh;
  .ranking-list {
    background: #ffffff;
    border-radius: 18rpx;
    padding: 30rpx 24rpx;
    display: flex;
    position: relative;
    margin-bottom: 16rpx;

    .top {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 60rpx;
      height: 72rpx;
    }

    .list-image {
      width: 168rpx;
      height: 224rpx;
      position: relative;
      margin-right: 24rpx;

      .primary {
        width: 168rpx;
        height: 224rpx;
        border-radius: 12rpx;
      }

      .position {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 60rpx;
        height: 32rpx;
      }
    }

    .list-text {
      .title {
        margin-bottom: 14rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name {
          font-size: 32rpx;
          font-weight: 600;
          color: #2e323e;
        }

        .right-img {
          width: 130rpx;
          height: 34rpx;
        }
      }

      .sub-text {
        font-size: 24rpx;
        font-weight: 400;
        color: #5f6572;
        .dramaText {
          letter-spacing: 0.6px;
          margin-right: 6rpx;
        }

        &:not(:last-child) {
          margin-bottom: 6rpx;
        }
      }
      .publisher {
        font-size: 24rpx;
        font-weight: 400;
        color: #5f6572;
        margin-top: 6rpx;
        display: flex;
        justify-content: flex-start;
        width: 468rpx;
        .publisherKey {
          white-space: nowrap;
        }

        .publisherValue {
          display: flex;
          justify-content: flex-start;
          white-space: nowrap;
          overflow-x: scroll;
        }
      }
      .sub-author {
        margin-top: 6rpx;
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
        width: 468rpx;
        white-space: nowrap;
        font-size: 24rpx;
        font-weight: 400;
        color: #5f6572;

        .authorName {
          display: flex;
          justify-content: flex-start;
          overflow-x: scroll;
          .kong {
            width: 10rpx;
          }
        }

        &:not(:last-child) {
          margin-bottom: 6rpx;
        }
      }
    }
  }
}
</style>
