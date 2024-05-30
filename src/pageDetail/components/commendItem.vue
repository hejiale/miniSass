<template>
  <div class="commend-item">
    <div class="inner-padding">
      <div class="top-info">
        <image class="avatar" :src="recommend.dramaCover" mode="aspectFill" />
        <view class="commend-item-info-bage" :class="recommend.sellType">
          <!-- {{ gather.sellType }} -->
          <image
            v-if="recommend.sellType == 'EXCLUSIVE'"
            class="imageBox"
            :src="$iconFont.getIconName('EXCLUSIVE')"
          ></image>
          <image
            v-else-if="recommend.sellType == 'LIMITED'"
            class="imageBox"
            :src="$iconFont.getIconName('LIMITED')"
          ></image>
          <image
            v-else-if="recommend.sellType == 'REAL_SCENE'"
            class="imageBox"
            :src="$iconFont.getIconName('REAL_SCENE')"
          ></image>
        </view>
        <div class="commend-right">
          <div class="right-one">
            <p class="name">{{ recommend.dramaName }}</p>
            <image
              v-if="recommend.evaluateType == 'GOOD_SCORE'"
              class="rightLogo"
              :src="$iconFont.getIconName('youzhijz')"
            >
            </image>
            <image
              v-if="recommend.evaluateType == 'NOT_BAD_SCORE'"
              class="rightLogo"
              :src="$iconFont.getIconName('zhideyis')"
            >
            </image>
            <image
              v-if="recommend.evaluateType == 'EXCELLENT_SCORE'"
              class="rightLogo"
              :src="$iconFont.getIconName('jybiwan')"
            >
            </image>
            <image
              v-if="recommend.evaluateType == 'FULL_SCORE'"
              class="rightLogo"
              :src="$iconFont.getIconName('manfenzw')"
            >
            </image>
            <image
              v-if="recommend.evaluateType == 'PASS_SCORE'"
              class="rightLogo"
              :src="$iconFont.getIconName('suipzaix')"
            >
            </image>
          </div>
          <div class="flex-container">
            <p
              class="status"
              v-for="item in recommend.dramaThemeList"
              :key="item.id"
            >
              {{ item.dictValue }}
            </p>
          </div>
          <p class="person-time">
            {{ recommend.maleGamerNum }}男{{ recommend.femaleGamerNum }}女
            {{ recommend.gameTime }}小时
          </p>
          <div class="flex-container">
            <p class="overflow">作者：{{ authorName }}</p>
          </div>

          <div class="flex-container">
            <p class="overflow">发行：{{ publisherName }}</p>
          </div>
        </div>
      </div>
      <div
        class="palying-bottom"
        v-if="recommend.nowDramaPlayingGatherCount != 0"
      >
        <span>{{ recommend.nowDramaPlayingGatherCount }}场拼局进行中</span>
        <img
          class="right-icon"
          :src="$iconFont.getIconName('arrowright')"
          alt
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recommend: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
    authorName() {
      let arr = this.recommend.authorItems.map((v) => v.authorName);
      return arr.join("&");
    },
    publisherName() {
      let arr = this.recommend.publishers.map((v) => v.publisherName);
      return arr.join("&");
    },
  },
};
</script>

<style lang="scss" scoped>
.commend-item {
  width: 100%;
  background: #ffffff;
  border-radius: 18rpx;
  padding: 24rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .inner-padding {
    flex-grow: 1; /* 使其填充剩余空间 */
    background: #ffffff; /* 设置内部元素的背景颜色 */
    border-radius: 18rpx; /* 如果需要，设置内部元素的圆角 */
    /* 继续添加其他样式 */
  }
  .palying-bottom {
    height: 72rpx;
    background: #f5f6f8;
    border-radius: 12rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e323e;
    margin-top: 30rpx;

    .right-icon {
      width: 16rpx;
      height: 20rpx;
      margin-left: 8rpx;
    }
  }

  .top-info {
    width: 100%;
    display: flex;
    position: relative;
    .avatar {
      width: 168rpx;
      height: 224rpx;
      border-radius: 12rpx;
      margin-right: 24rpx;
    }
    .imageBox {
      position: absolute;
      top: 8rpx;
      left: 102rpx;
      width: 60rpx;
      height: 32rpx;
    }

    .commend-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-around;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6572;
      position: relative;
      .right-one {
        display: flex;
        justify-content: space-between;
      }
      .rightLogo {
        position: absolute;
        right: 0px;
        top: 10rpx;
        width: 130rpx;
        height: 34rpx;
      }
      .flex-container {
        display: flex;
        width: 80%;
        .status {
          margin-right: 10rpx; //每个元素右侧10px间距
        }
        .overflow {
          @include text-overflow-line(1);
        }
      }
      .name {
        font-size: 32rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        width: 280rpx;
        @include text-overflow-line(1);
      }
    }
  }
}
</style>