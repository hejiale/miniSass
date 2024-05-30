<template>
  <div class="drama-review-container">
    <div class="drama-review-tab" :style="topStyle">
      <div
        class="tab-item"
        v-for="(i, _) in tabList"
        :key="_"
        :class="{ 'active-tab-item': i == activItem }"
        @click="changeActive(i)"
      >
        <span>{{ i }}</span>
      </div>
    </div>
    <div class="main-hot" :style="scriptTop">
        <comDramaReview
          @on-update="onUpdate"
          :userInfoMessage="userInfoMessage"
          :comDramaReviewData="recommendEvaluatePageList"
        />
    </div>
  </div>
</template>
<script>
import comDramaReview from "@/components/comDramaReview/index.vue";
import { getMenuButtonRect } from "@/utils/index";
export default {
  components: {
    comDramaReview,
  },
  props: {
    userInfoMessage: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      tabList: ["热门", "最新"],
      activItem: "热门",
      queryDynamicWithDramaPageList: [],
      recommendEvaluateTotal: null,
      recommendEvaluatePageList: [],
      currentPage: 1,
      shareDynamicItem: null,
      menuReact: null
    };
  },
  computed: {
    topStyle(){
      if(!this.menuReact)return;
      return `top: ${this.menuReact.top + this.menuReact.height + 9}px;`;
    },
    scriptTop(){
      if(!this.menuReact)return;
      return `margin-top: ${this.menuReact.top + this.menuReact.height + 80}px;`;
    }
  },
  async mounted() {
    this.menuReact = await getMenuButtonRect();
    await this.recommendEvaluate();
  },
  methods: {
    shareDynamicChoose(i) {
      this.shareDynamicItem = i;
    },
    // 剧评切换切换
    async changeActive(item) {
      this.currentPage = 1;
      this.activItem = item;
      let data;
      try {
        switch (item) {
          case "热门":
            data = await this.$api.recommendEvaluate({
              pageNo: this.currentPage,
              pageSize: 10,
              userId: this.userInfoMessage.id,
              pageIndexType: 1,
            });
            data.records.map((v) => {
              v.showMore = false;
              v.iSinfo = false;
            });
            this.recommendEvaluatePageList = data.records;
            break;
          case "最新":
            data = await this.$api.recommendEvaluate({
              pageNo: this.currentPage,
              pageSize: 10,
              userId: this.userInfoMessage.id,
              pageIndexType: 2,
            });
            data.records.map((v) => {
              v.showMore = false;
              v.iSinfo = false;
            });
            this.recommendEvaluatePageList = data.records; // 更新对应的数组
            break;
        }
      } catch (e) {
        // 处理错误，可以通过调用错误提示方法或者设置错误状态
        // console.error("Error loading ranking data: ", e);
      }
    },
    //
    async methodInChild() {
      this.recommendEvaluatePageList = [];
      let item = this.activItem;
      let data;
      try {
        switch (item) {
          case "热门":
            data = await this.$api.recommendEvaluate({
              pageNo: 1,
              pageSize: 10,
              userId: this.userInfoMessage.id,
              pageIndexType: 1,
            });
            data.records.map((v) => {
              v.showMore = false;
              v.iSinfo = false;
            });
            this.recommendEvaluatePageList = data.records;
            break;
          case "最新":
            data = await this.$api.recommendEvaluate({
              pageNo: 1,
              pageSize: 10,
              userId: this.userInfoMessage.id,
              pageIndexType: 2,
            });
            data.records.map((v) => {
              v.showMore = false;
              v.iSinfo = false;
            });
            this.recommendEvaluatePageList = data.records; // 更新对应的数组
            break;
        }
      } catch (e) {
        // 处理错误，可以通过调用错误提示方法或者设置错误状态
        console.error("Error loading ranking data: ", e);
      }
    },
    onUpdate() {
      // this.recommendEvaluate();
    },
    async recommendEvaluate() {
      try {
        let data = await this.$api.recommendEvaluate({
          pageNo: this.currentPage,
          pageSize: 10,
          userId: this.userInfoMessage.id,
          pageIndexType: 1,
        });
        data.records.map((v) => {
          v.showMore = false;
          v.iSinfo = false;
        });
        this.recommendEvaluateTotal = data.total;

        this.recommendEvaluatePageList = [
          ...this.recommendEvaluatePageList,
          ...data.records,
        ];

        uni.hideLoading();
      } catch (e) {
        uni.hideLoading();
      }
    },
    // 到达底部时触发
    loadMore() {
      if (this.recommendEvaluatePageList.length < this.recommendEvaluateTotal) {
        this.currentPage++;
        uni.showLoading({
          title: "加载中",
        });
        this.recommendEvaluate();
      } else {
        uni.showToast({
          title: "没有更多数据",
          icon: "none",
          duration: 2000,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.drama-review-container {
  padding-bottom: env(safe-area-inset-bottom);
  min-height: 90vh;
}
.drama-review-tab {
  position: fixed;
  top: 0;
  z-index: 9;
  padding: 28rpx 0px;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  z-index: 1;

  .tab-item {
    margin-left: 24rpx;

    &.active-tab-item {
      span {
        font-weight: 600;
        color: #ffffff;
        background: #2e323e;
        border: none;
      }
    }

    span {
      display: inline-block;
      font-size: 28rpx;
      font-weight: 400;
      color: #5f6572;
      padding: 12rpx 24rpx;
      background: #f5f6f8;
      border-radius: 16rpx;
      border: 2rpx solid #f0f0f1;
    }
  }
}

.main-hot {
  padding: 28rpx 24rpx;
  background: #ffffff;
}
</style>