<template>
  <div class="dramaBox" v-if="isShow">
    <div
      class="backBox"
      :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
      @click="onBack"
    >
      <van-icon name="arrow-left" color="#000" size="24" />
    </div>
    <div class="dramaBox-title" :style="{ top: `${menuRect.top}px` }">
      门店剧本 ({{ dramaTotal }})
    </div>
    <div class="dramaBox-subTitle" :style="{ top: `${menuRect.top + 20}px` }">
      {{storeName}}
    </div>
    <div class="dramaBox-searchBox" :style="{ top: `${menuRect.top + 40}px` }">
      <input
        v-model="searchValue"
        @focus="onFocus"
        @input="onFocus"
        @blur="onSearch"
      />
      <div class="dramaBox-searchBox-placeholderBox" v-if="!isFocus">
        <image src="../static/image/icon-search.png" />
        <span>输入关键词搜索</span>
      </div>
    </div>
    <div class="dramaBox-filterBox" :style="{ top: `${menuRect.top + 70}px` }">
      <div class="dramaBox-filterBox-item">
        <span>题材：</span>
        <scroll-view scroll-x class="dramaBox-filterBox-item-scrolls">
          <div
            class="dramaBox-filterBox-item-scrolls-item"
            :class="dictParama === dic.id ? 'active' : ''"
            v-for="dic in dicts"
            :key="dic.id"
            @click="onSelectDict(dic.id)"
          >
            {{ dic.dictValue }}
          </div>
        </scroll-view>
      </div>
      <div class="dramaBox-filterBox-item">
        <span>人数：</span>
        <scroll-view scroll-x class="dramaBox-filterBox-item-scrolls">
          <div
            class="dramaBox-filterBox-item-scrolls-item"
            :class="peopleParama === v ? 'active' : ''"
            v-for="v in peoples"
            :key="v"
            @click="onSelectPeople(v)"
          >
            {{ v }}
          </div>
        </scroll-view>
      </div>
    </div>
    <scroll-view
      class="dramaBox-listBox"
      scroll-y
      @scrolltolower="onLoadMore"
      v-if="dramaList.length"
      :style="{ top: `${menuRect.top + 190}px` }"
    >
      <div
        class="dramaBox-listBox-item"
        v-for="drama in dramaList"
        :key="drama.id"
        @click="onGoDramaDetail(drama.dramaId)"
      >
        <div class="dramaBox-listBox-item-cover">
          <image
            :src="drama.dramaCover"
            mode="aspectFill"
          />
          <image
            :src="sellType(drama.sellType)"
            v-if="sellType(drama.sellType)"
            class="dramaBox-listBox-item-cover-sellType"
          />
        </div>
        <div class="dramaBox-listBox-item-info">
          <span>{{ drama.dramaName }}</span>
          <span>{{ dictValue(drama.dramaThemes) }}</span>
          <span
            >{{ drama.maleGamerNum }}男{{ drama.femaleGamerNum }}女
            {{ drama.gameTime }}小时</span
          >
          <span>{{ drama.content }}</span>
          <span>¥{{ drama.dramaPrice / 100 }}/位</span>
        </div>
      </div>
    </scroll-view>
    <notcData v-else top="30vh" />
  </div>
</template>
<script>
import { getMenuButtonRect } from "@/utils/index";
import notcData from "@/components/notc-data/index.vue";
export default {
  components:{
    notcData
  },
  data() {
    return {
      pageNo: 1,
      dramaList: [],
      dramaTotal: 0,
      dicts: [],
      peoples: ["全部", "≤4人", "5人", "6人", "7人", "8人", "≥9人"],
      dictParama: null,
      peopleParama: "全部",
      searchValue: "",
      storeId: null,
      storeName: null,
      menuRect: null,
      isShow: false,
      isFocus: false,
    };
  },
  async onLoad(options) {
    this.storeId = options.storeId;
    this.storeName = options.name;
    await this.getDicts();
    this.menuRect = await getMenuButtonRect();
    await this.queryDramaList();
  },
  computed: {
    dictValue() {
      return function (dicts) {
        let arr = dicts.map((v) => v.dictValue);
        return arr.join(" ");
      };
    },
    sellType() {
      return function (type) {
        if (type === "EXCLUSIVE") {
          return "../static/image/exclusive.png";
        } else if (type === "REAL_SCENE") {
          return "../static/image/real_scene.png";
        } else if (type === "LIMITED") {
          return "../static/image/limited.png";
        }
        return null;
      };
    },
  },
  methods: {
    onBack(){
      uni.navigateBack();
    },
    onLoadMore() {
      if (this.dramaTotal === this.dramaList.length) return;
      this.pageNo++;
      this.queryDramaList();
    },
    onFocus() {
      this.isFocus = true;
    },
    onSearch() {
      if (!this.searchValue) {
        this.isFocus = false;
      }
      this.pageNo = 1;
      this.queryDramaList();
    },
    onSelectDict(v) {
      if (this.dictParama === v) {
        this.dictParama = null;
      } else {
        this.dictParama = v;
      }
      this.pageNo = 1;
      this.queryDramaList();
    },
    onSelectPeople(v) {
      if (this.peopleParama === v) {
        this.peopleParama = "全部";
      } else {
        this.peopleParama = v;
      }
      this.pageNo = 1;
      this.queryDramaList();
    },
    async getDicts() {
      try {
        let data = await this.$api.queryDictList({
          dictType: "DRAMA",
        });
        data.map((v) => {
          if (v.dictType === "DRAMA") {
            this.dicts = v.dictList;
          }
        });
        this.dicts.unshift({ dictValue: "全部", id: null });
        setTimeout(() => {
          this.isShow = true;
        }, 0);
      } catch (e) {}
    },
    async queryDramaList() {
      let minGamerNum, maxGamerNum;
      switch (this.peopleParama) {
        case "≤4人":
          minGamerNum = 4;
          maxGamerNum = 0;
          break;
        case "5人":
          minGamerNum = 5;
          maxGamerNum = 5;
          break;
        case "6人":
          minGamerNum = 6;
          maxGamerNum = 6;
          break;
        case "7人":
          minGamerNum = 7;
          maxGamerNum = 7;
          break;
        case "8人":
          minGamerNum = 8;
          maxGamerNum = 8;
          break;
        case "≥9人":
          minGamerNum = null;
          maxGamerNum = 9;
          break;
        default:
          minGamerNum = null;
          maxGamerNum = null;
          break;
      }
      try {
        let data = await this.$api.queryStoreDramaPage({
          pageNo: this.pageNo,
          pageSize: 10,
          storeId: this.storeId,
          dramaThemeIdList: this.dictParama ? [this.dictParama] : null,
          minGamerNum,
          maxGamerNum,
          dramaName: this.searchValue,
        });
        if (this.pageNo === 1) this.dramaList = [];

        if (data.records.length) {
          this.dramaList.push(...data.records);
        }
        this.dramaTotal = data.total;
      } catch (e) {}
    },
    //剧本详情
    onGoDramaDetail(id){
      uni.navigateTo({
        url: `/pageDetail/pages/pageDetail?id=${id}`,
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.dramaBox {
  margin-top: 30rpx;
  height: 85vh;
  background: #fff;
  border-radius: 32rpx;
  .backBox {
    position: fixed;
    left: 24rpx;
    @include ver;
    justify-content: center;
    z-index: 1;
  }
  &-title {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 38rpx;
    text-align: center;
    position: fixed;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  &-subTitle {
    margin-top: 4rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba($color: #444, $alpha: 0.4);
    line-height: 28rpx;
    text-align: center;
    position: fixed;
    margin-left: 50%;
    transform: translateX(-50%);
    @include text-overflow-line(1);
  }
  &-searchBox {
    margin-left: 32rpx;
    margin-top: 20rpx;
    width: calc(100vw - 64rpx);
    height: 60rpx;
    background: #f5f6f8;
    border-radius: 30rpx;
    @include hor-center-center;
    position: fixed;
    top: 20vh;
    &-placeholderBox {
      image {
        width: 32rpx;
        height: 32rpx;
      }
      span {
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
      }
    }
    input {
      position: absolute;
      left: 40rpx;
      right: 40rpx;
      text-align: center;
    }
  }
  &-filterBox {
    @include ver;
    padding: 50rpx 0;
    margin-left: 40rpx;
    position: fixed;
    &-item {
      @include hor;
      align-items: center;
      margin-bottom: 20rpx;
      &-scrolls {
        white-space: nowrap;
        width: 85vw;
        &-item {
          display: inline-flex;
          padding: 8rpx 28rpx;
          background: unset;
          border-radius: 12px;
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #2e323e;
        }
        .active {
          background: rgba($color: #36e4bb, $alpha: 0.1);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #36e4bb;
        }
      }
    }
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #fafafa;
    padding: 0 24rpx;
    &-item {
      margin-top: 20rpx;
      width: 93.6vw;
      background: #ffffff;
      border-radius: 6px;
      @include hor;
      position: relative;
      &-cover {
        width: 168rpx;
        height: 224rpx;
        border-radius: 6px;
        margin: 24rpx;
        position: relative;
        overflow: hidden;
        &-sellType {
          position: absolute;
          right: 8rpx;
          top: 8rpx;
          width: 60rpx;
          height: 32rpx;
        }
      }
      &-info {
        margin-left: 18rpx;
        margin-top: 30rpx;
        @include ver;
        width: 60%;
        span:nth-child(1) {
          font-size: 32rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2e323e;
          line-height: 38rpx;
          @include text-overflow-line(1);
        }
        span:nth-child(2) {
          margin-top: 14rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 28rpx;
          color: #5f6572;
        }
        span:nth-child(3) {
          margin-top: 10rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          line-height: 28rpx;
        }
        span:nth-child(4) {
          @include text-overflow-line(1);
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          line-height: 38rpx;
          margin-top: 6rpx;
        }
        span:nth-child(5) {
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #5f6572;
          line-height: 30rpx;
          margin-top: 6rpx;
        }
      }
    }
  }
}
</style>