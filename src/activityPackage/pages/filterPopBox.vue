<template>
  <div class="filterPopBox">
    <div class="filterPopBox-searchBox" :style="'margin-top: ' + statusHeight + 'px;'">
      <image src="../static/image/search.png" />
      <input
        confirm-type="search"
        placeholder="输入剧本名/发行"
        v-model="keywords"
        @confirm="onSearch"
        @input="onInputSearch"
        @focus="onFocus"
      />
      <div @click="onSearch">搜索</div>
    </div>
    <div class="filterPopBox-filterBox">
      <filterParama
        ref="filterParama"
        :filterParama="filterParama"
        @on-reset="onReset"
        @on-filter="onFilter"
        @on-change="showPop = !showPop"
        @on-show-pop="onChangePop"
      />
      <image
        src="../static/image/icon-filter.png"
        class="filterPopBox-filterBox-filter"
        @click="onShowFilterPop"
      />
    </div>
    <div class="popBox" v-if="showPop">
      <div class="popBox-bg" @click="onClosePop"></div>
      <paramasPop
        ref="paramasPop"
        :type="filterType"
        :coreTypeList="coreTypeList"
        :organizerList="organizerList"
        @on-change="onGetParama"
      />
    </div>
  </div>
</template>
<script>
import filterParama from "./filterParama.vue";
import paramasPop from "./paramas.vue";
export default {
  props: {
    coreTypeList: {
      type: Array,
      default: [],
    },
    val: {
      type: Array,
      default: [],
    },
    organizerList: {
      type: Array,
      default: [],
    },
    statusHeight: {
      type: Number,
      default: 0
    }
  },
  components: {
    filterParama,
    paramasPop,
  },
  data() {
    return {
      keywords: null,
      showPop: false,
      filterType: 0,
      filterParama: []
    };
  },
  mounted() {
    this.filterParama = this.val;
  },
  watch: {
    val() {
      this.filterParama = this.val;
    },
  },
  methods: {
    onFocus(){
      this.showPop = false;
      this.$refs.filterParama.onCloseFilter();
    },
    onSearch() {
      this.$emit("on-search", this.keywords);
    },
    onShowFilterPop() {
      this.showPop = false;
      this.$emit("on-show");
    },
    onFilter(type) {
      this.filterType = type;
    },
    onChangePop(show) {
      this.showPop = show;
      if (show) {
        this.$nextTick((_) => {
          this.$refs.paramasPop.refresh(this.filterParama);
        });
      }
    },
    onClosePop() {
      this.showPop = false;
      this.$refs.filterParama.onCloseFilter();
    },
    onGetParama(val) {
      this.$emit("on-change", val);
      this.filterParama = val;
      this.showPop = false;
      this.$refs.filterParama.onCloseFilter();
    },
    onReset() {
      this.filterParama = [];
      this.$emit("on-change");
      this.$refs.filterParama.onCloseFilter();
    },
    onInputSearch() {
      if (!this.keywords.length) {
        this.$emit("on-search");
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.filterPopBox {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  // height: 17vh;
  background: #fff;
  z-index: 1;
  &-searchBox {
    margin: 0 rpx(12) 0 rpx(12);
    width: 63vw;
    height: 4.4vh;
    border: 1px solid #1cbc80;
    border-radius: 30px;
    background: #fff;
    @include hor;
    align-items: center;
    position: relative;
    image {
      position: absolute;
      left: 13px;
      width: rpx(18);
      height: rpx(18);
    }
    input {
      position: absolute;
      left: 9.8vw;
    }
    div:nth-child(3) {
      position: absolute;
      right: rpx(3);
      top: rpx(3);
      width: rpx(56);
      height: rpx(30);
      background: #1cbc80;
      border-radius: 48px;
      @include hor-center-center;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: rpx(30);
    }
  }
  &-filterBox {
    @include hor;
    align-items: center;
    padding: 1.4vh 3.2vw;
    &-filter {
      position: absolute;
      right: rpx(12);
      width: rpx(42);
      height: rpx(20);
    }
  }
}
.popBox {
  position: absolute;
  left: 0;
  right: 0;
  top: 16vh;
  height: 85vh;
  &-bg {
    background: rgba($color: #000000, $alpha: 0.6);
    @include abscenter;
  }
}
</style>