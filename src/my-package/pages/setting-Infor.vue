<template>
  <view>
    <div class="fixedBg"></div>
    <van-cell-group>
      <van-cell is-link custom-class="personal-avatar_cell" @click="onGoPerson">
        <template #title>
          <span @click="personzl" class="cell-label_left">个人资料</span>
        </template>
      </van-cell>
      <van-cell
        is-link
        custom-class="custom-content_cell"
        value-class="cell-label_right"
        @click="onGoStoreApply"
      >
        <template #title>
          <span class="cell-label_left">商家认证</span>
        </template>
      </van-cell>
      <van-cell is-link custom-class="personal-avatar_cell">
        <template slot="title">
          <span class="my-box-content-cell-span">联系客服</span>
        </template>
        <button open-type="contact" />
      </van-cell>
    </van-cell-group>
  </view>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    onGoPerson() {
      uni.navigateTo({
        url: `/my-package/pages/personal-Infor`,
      });
    },
    onGoStoreApply(){
        uni.navigateTo({
        url: `/my-package/pages/sub-setting`,
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.photo-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 80rpx;
}

.cell-label_left {
  color: rgba(54.19, 52.38, 52.38, 1);
}

.cell-label_right {
  color: rgba(54.19, 52.38, 52.38, 1) !important;
  font-size: 28rpx;
  font-weight: 600;
  text-align: right;
  line-height: 40rpx;
}

.cell-label_rightHolder {
  color: #999;
  font-size: 28rpx;
  font-weight: 600;
  text-align: right;
  line-height: 40rpx;
}

.personal-avatar_cell {
  height: 128rpx;
  position: relative;

  button {
    @include abscenter;
    background: unset !important;
  }

  button:after {
    border: none !important;
  }
}

.van-cell {
  border: 0 solid #fff !important;
}

/deep/.van-cell {
  .van-icon {
    color: #000;
  }
}

.van-cell:after {
  border: 0 solid #fff !important;
}

.custom-content_cell {
  background: #fff !important;
}

/deep/.van-cell__value {
  @include text-overflow-line(1);
  font-size: 28rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
</style>
  