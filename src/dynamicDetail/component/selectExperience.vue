<template>
  <div class="experience-dialog">
    <p class="title">关联内容选择</p>
    <p class="title-second">本次动态最多关联下方一条内容</p>
    <div v-for="(item, index) in dynamicArray" class="related-content-container" :key="item.id">
      <div class="related-content">
        <span class="all-left">{{ item.title }}</span>
        <div class="all-right" @click="chooseMock(item,index)">
          <span v-if="activeObject != null && activeObject.joinType === item.id">{{
              $filters.truncateText(activeObject.name, 15)
            }}</span>
          <span v-else>{{ item.checknow }}</span>
          <img class="right-icon" :src="$iconFont.getIconName('arrowright')" alt/>
        </div>
      </div>
      <div class="horizontal-line" v-if="index !== 4"></div>
    </div>
    <img class="close-icon" :src="$iconFont.getIconName('pgyclose')" @click="closeModal" alt/>
  </div>
</template>

<script>
export default {
  props: {
    experienceRole: Boolean,
    activeObject: Object,
  },
  data() {
    return {
      dynamicArray: [
        {
          id: 1,
          title: '关联剧本',
          checknow: '选择您体验的剧本'
        },
        {
          id: 2,
          title: '选择店铺',
          checknow: '选择您体验的剧本店铺'
        },
        {
          id: 3,
          title: '关联资讯',
          checknow: '选择您要关联的资讯'
        },
        {
          id: 4,
          title: '关联用户',
          checknow: '选择您要关联的用户'
        },
        {
          id: 5,
          title: '关联排行榜',
          checknow: '选择您要关联的排行榜'
        },
      ],
    };
  },
  computed: {},
  created() {

  },
  mounted() {
  },
  methods: {
    chooseMock(item, index) {
      // console.log('22',item, index);
      this.$emit("chooseDynamic", item);
    },
    closeModal() {
      this.$emit("closeExperienceRole");
    }
  }
};
</script>

<style lang="scss" scoped>
.experience-dialog {
  width: 100%;
  background: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  padding-top: 30rpx;
  padding-bottom: 98rpx;
  position: relative;
  height: 800rpx;

  .related-content-container {
    .horizontal-line {
      width: 710rpx;
      height: 0rpx;
      border-radius: 2rpx 2rpx 2rpx 2rpx;
      opacity: 1;
      border: 2rpx solid #F5F5F5;
      margin-left: auto;
    }

    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .related-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 750rpx;
      height: 120rpx;

      .all-left {
        margin-left: 40rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2E323E;
        line-height: 33rpx;
      }

      .all-right {
        margin-right: 40rpx;
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959AA5;
        line-height: 30rpx;

        .right-icon {
          width: 12rpx;
          height: 20rpx;
          margin-left: 8rpx;
        }
      }
    }
  }


  .close-icon {
    width: 52rpx;
    height: 52rpx;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
  }

  .title {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 38rpx;
    text-align: center;
  }

  .title-second {
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #959AA5;
    line-height: 28rpx;
    text-align: center;
    margin-bottom: 20rpx;
  }


}
</style>