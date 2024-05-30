<template>
  <view v-if="show">
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
        <view class="personzl" v-for="(item,index) in jubenList" :key="index">
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
        <div class="topBox-totalCountBox-count active">共计{{total}}家</div>
      </div>
    </view>
    <scroll-view
      v-if="conditionPageList.length > 0"
      scroll-y
      class="scrollBox"
      :style="{
        top: menuRect.top + menuRect.height + 50 + 'px',
      }"
    >
      <div style="height: 16px"></div>
      <preferred-store
        v-for="item in conditionPageList"
        :key="item.id"
        :preferred="item"
      ></preferred-store>
      <div style="height: 16px"></div>
    </scroll-view>
    <notcData position="absolute" note="暂无门店" top="30vh" v-if="conditionPageList.length === 0"  noteImg="storeName"/>
  </view>
</template>
<script>
import preferredStore from "./preferredStore.vue";
import { getMenuButtonRect } from "@/utils/index";
import notcData from "@/components/notc-data/index.vue";
export default {
  components: {
    preferredStore,
    notcData,
  },
  data() {
    return {
      conditionPageList: [],
      tabIndex: 0,
      jubenList: [
        { name: "去过的店"},
        { name: "想去的店"},
      ],
      pageNo: 1,
      menuRect: null,
      total: 0,
      show: false,
      userId: null
    };
  },
  async onLoad(option) {
    this.userId = option.userId;
    this.tabIndex = parseInt(option.index);
    this.menuRect = await getMenuButtonRect();
  },
  async onShow() {
    this.queryPreferredStore();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    addClickitem(index){
      this.tabIndex = index;
      this.pageNo = 1;
      this.queryPreferredStore();
    },
    // 查询优选门店列表筛选
    async queryPreferredStore() {
      try {
        let res = await this.$api.getPreferredStore({
          pageNo: this.pageNo,
          pageSize: 20,
          playStatus: this.tabIndex == 1 ? "WANT_PLAY" : null,
          beforeThere: this.tabIndex == 1 ? null : true,
          userId: this.userId,
          lon: uni.getStorageSync("currentLongitude"),
          lat: uni.getStorageSync("currentLatitude"),
        });
        if (this.pageNo == 1) {
          this.conditionPageList = [];
        }
        this.total = res.total;

        this.conditionPageList.push(...res.records);
        this.show = true;
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
    left: 27.4vw;
    @include hor;
  }
  .personzl {
    .personzlitem {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      margin-right: 10vw;
      transform: translateY(6rpx);
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
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 24rpx;
}
</style>