<template>
  <div class="subBox">
    <scroll-view scroll-x class="scrollBox">
      <div
        class="scrollBox-item mr4"
        :class="!filterParama.length ? 'select' : ''"
        @click="onFilter(0)"
      >
        全部剧本
      </div>
      <div
        class="scrollBox-item mr4"
        :class="currentCoreType ? 'select' : ''"
        @click="onFilter(1)"
      >
        {{ currentCoreType || "剧本类型" }}
        <div
          :class="
            currentFilter === 1
              ? currentCoreType
                ? 'activeUpBorder'
                : 'upBorder'
              : currentCoreType
              ? 'activeBorder'
              : 'border'
          "
        ></div>
      </div>
      <div
        class="scrollBox-item mr4"
        :class="currentPlayer ? 'select' : ''"
        @click="onFilter(2)"
      >
        {{ currentPlayer || "剧本人数" }}
        <div
          :class="
            currentFilter === 2
              ? currentPlayer
                ? 'activeUpBorder'
                : 'upBorder'
              : currentPlayer
              ? 'activeBorder'
              : 'border'
          "
        ></div>
      </div>
      <!-- <div
        class="scrollBox-item mr4"
        :class="currentPlayTime ? 'select' : ''"
        @click="onFilter(3)"
      >
        {{ currentPlayTime || "剧本时长" }}
        <div
          :class="
            currentFilter === 3
              ? currentPlayTime
                ? 'activeUpBorder'
                : 'upBorder'
              : currentPlayTime
              ? 'activeBorder'
              : 'border'
          "
        ></div>
      </div> -->
      <div
        class="scrollBox-item mr4"
        :class="currentIsFirst ? 'select' : ''"
        @click="onFilter(3)"
      >
        {{ currentIsFirst || "是否首发" }}
        <div
          :class="
            currentFilter === 3
              ? currentIsFirst
                ? 'activeUpBorder'
                : 'upBorder'
              : currentIsFirst
              ? 'activeBorder'
              : 'border'
          "
        ></div>
      </div>
      <div
        class="scrollBox-item"
        :class="currentSellType ? 'select' : ''"
        @click="onFilter(4)"
      >
        {{ currentSellType || "发售类型" }}
        <div
          :class="
            currentFilter === 4
              ? currentSellType
                ? 'activeUpBorder'
                : 'upBorder'
              : currentSellType
              ? 'activeBorder'
              : 'border'
          "
        ></div>
      </div>
      <div
        class="scrollBox-item mr4"
        :class="currentOrganizer ? 'select' : ''"
        @click="onFilter(5)"
        style="margin-right: 0px"
      >
        {{ currentOrganizer || "主办方" }}
        <div
          :class="
            currentFilter === 5
              ? currentOrganizer
                ? 'activeUpBorder'
                : 'upBorder'
              : currentOrganizer
              ? 'activeBorder'
              : 'border'
          "
        ></div>
      </div>
    </scroll-view>
    <image
      src="../static/image/icon-vector.png"
      class="vector"
    />
  </div>
</template>
<script>
export default {
  props: {
    filterParama: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      currentFilter: 0,
    };
  },
  computed: {
    currentOrganizer() {
      let name = null;
      this.filterParama.map((it) => {
        if (it.type === "organizer" && it.value) {
          name = it.name;
        }
      });
      return name;
    },
    currentCoreType() {
      let name = null;
      this.filterParama.map((it) => {
        if (it.type === "coreType" && it.value) {
          name = it.name;
        }
      });
      return name;
    },
    currentPlayer() {
      let name = null;
      this.filterParama.map((it) => {
        if (it.type === "player" && it.value) {
          name = it.value;
        }
      });
      return name;
    },
    currentPlayTime() {
      let name = null;
      this.filterParama.map((it) => {
        if (it.type === "time" && it.value) {
          name = it.value;
        }
      });
      return name;
    },
    currentSellType() {
      let name = null;
      this.filterParama.map((it) => {
        if (it.type === "sellType" && it.value) {
          name = it.name;
        }
      });
      return name;
    },
    currentIsFirst() {
      let name = null;
      this.filterParama.map((it) => {
        if (it.type === "isFirst" && it.value) {
          name = it.value;
        }
      });
      return name;
    },
  },
  methods: {
    onFilter(type) {
      if (this.currentFilter === type) {
        if (type === 0) {
          this.currentFilter = 0;
          this.$emit("on-reset");
          this.$emit("on-show-pop", false);
        } else {
          this.currentFilter = -1;
          this.$emit("on-change");
        }
      } else {
        if (type !== 0) {
          this.currentFilter = type;
          this.$emit("on-show-pop", true);
        } else {
          this.currentFilter = 0;
          this.$emit("on-reset");
          this.$emit("on-show-pop", false);
        }
      }
      this.$emit("on-filter", type);
    },
    onCloseFilter() {
      this.currentFilter = -1;
    },
  },
};
</script>
<style lang="scss" scoped>
.subBox{
  width: 80.2vw;
  position: relative;
  @include hor;
  align-items: center;
  .vector {
    position: absolute;
    right: 0;
    width: rpx(5);
    height: rpx(30);
  }
}
.scrollBox {
  width: 100%;
  white-space: nowrap;
  &-item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    border-radius: 5px;
    // width: 21.8vw;
    padding: 0 rpx(10);
    height: rpx(30);
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    position: relative;
    margin-right: rpx(8);
    .border {
      margin-left: 1px;
      transform: translateY(3px);
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top: 5px solid #999;
    }
    .activeBorder {
      margin-left: 1px;
      transform: translateY(3px);
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top: 5px solid #1cbc80;
    }
    .upBorder {
      margin-left: 1px;
      transform: translateY(-2px);
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-bottom: 5px solid #999;
    }
    .activeUpBorder {
      margin-left: 1px;
      transform: translateY(-2px);
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-bottom: 5px solid #1cbc80;
    }
  }
  .select {
    background: #edfaf5;
    color: #1cbc80;
  }
}
</style>