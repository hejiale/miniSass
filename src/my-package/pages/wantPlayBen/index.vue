<template>
  <view>
    <div class="fixedBg"></div>
    <view
      class="topBox"
      :style="{
        height: menuRect.top + menuRect.height + 50 + 'px',
      }"
    >
      <div
        class="topBox-back"
        :style="{
          top: menuRect.top + 'px',
        }"
      >
        <van-icon
          name="arrow-left"
          @click="backRoute"
          style="color: #000"
          size="50rpx"
        />
      </div>
      <div
        class="menuBox"
        :style="{
          top: menuRect.top + 'px',
        }"
      >
        <view class="personzl" v-for="(item, index) in jubenList" :key="index">
          <view
            @click="addClickitem(index)"
            class="personzlitem"
            :class="tabIndex == index ? 'active' : ''"
          >
            {{ item.name }}
            <view v-show="tabIndex == index" class="swiper-tab-line"></view>
          </view>
        </view>
      </div>
      <div class="topBox-totalCountBox">
        <div class="topBox-totalCountBox-count active">共计{{total}}本</div>
        <!-- <div class="topBox-totalCountBox-line"></div>
        <div class="topBox-totalCountBox-count">2本正在组局</div> -->
      </div>
    </view>
    <scroll-view
      scroll-y
      class="scrollBox"
      :style="{
        top: menuRect.top + menuRect.height + 50 + 'px',
      }"
      v-if="hotPlayBanList.length"
      @scrolltolower="onLoadMore"
    > 
      <div style="height: 16px"></div>
      <hotPlayBanner
        @click.native="gotoDetailJuBen(item)"
        v-for="item in hotPlayBanList"
        :key="item.id"
        :hotPlayBan="item"
      >
      </hotPlayBanner>
      <div style="height: 16px"></div>
    </scroll-view>
    <notcData note="暂无剧本" top="40vh" noteImg='city-gathering-drama-default' v-else/>
  </view>
</template>
<script>
import hotPlayBanner from "./hotPlayBanner.vue";
import { getMenuButtonRect } from "@/utils/index";
import notcData from "@/components/notc-data/index.vue";
export default {
  components: {
    hotPlayBanner,
    notcData
  },
  data() {
    return {
      pageNo: 1,
      tabIndex: 0,
      jubenList: [
        { name: "想玩的剧本", index: 0 },
        { name: "玩过的剧本", index: 1 },
      ],
      hotPlayBanList: [],
      menuRect: null,
      total: 0,
      userId: null
    };
  },
  async onLoad(option) {
    this.userId = option.userId;
    this.tabIndex = parseInt(option.index);
    this.menuRect = await getMenuButtonRect();
  },
  async onShow() {
    await this.queryDramaGatherPage();
  },
  methods: {
    onLoadMore() {
      this.pageNo++;
      this.queryDramaGatherPage();
    },
    addClickitem(index) {
      this.pageNo = 1;
      this.tabIndex = index;
      this.queryDramaGatherPage();
    },
    backRoute() {
      uni.navigateBack();
    },
    gotoDetailJuBen(item) {
      uni.navigateTo({
        url: "/pageDetail/pages/pageDetail?id=" + item.id,
      });
    },
    // 剧本信息及组局情况
    async queryDramaGatherPage() {
      console.log(this.tabIndex)
      try {
        if(this.pageNo == 1){
          this.hotPlayBanList = [];
        }
        let res = await this.$api.getDramaGatherPage({
          pageNo: this.pageNo,
          pageSize: 20,
          type: this.tabIndex == 0 ? 2 : 3,
          userId: this.userId,
        });
        this.total = res.total;
        
        if(res.records && res.records.length){
          this.hotPlayBanList.push(...res.records);
        }
      } catch (e) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.topBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0px;
  background: #fff;
  &-back {
    position: absolute;
    left: 0;
    @include hor-center-center;
    padding-left: 32rpx;
  }
  .menuBox {
    position: fixed;
    left: 96rpx;
    @include hor;
  }
  .personzl {
    .personzlitem {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      margin-right: 10vw;
      transform: translateY(8rpx);
    }
    .swiper-tab-line {
      width: 40rpx;
      height: 6rpx;
      background: #36e4bb;
      border-radius: 8rpx;
      margin: 6rpx auto;
    }
    .active {
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      transform: translateY(2rpx);
    }
  }
  &-totalCountBox {
    position: absolute;
    left: 40rpx;
    bottom: 36rpx;
    @include hor;
    align-items: center;
    &-count {
      font-size: 26rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959aa5;
    }
    &-line {
      margin: 0 12rpx;
      width: 2rpx;
      height: 16rpx;
      background: #d9d9d9;
    }
    .active {
      font-weight: 500;
      color: #2e323e;
    }
  }
}
.scrollBox {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 0;
}
</style>