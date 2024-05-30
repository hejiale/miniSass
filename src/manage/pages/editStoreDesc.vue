<template>
  <view>
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left" @click="backRoute">
        <van-icon name="arrow-left" size="50rpx" color="#000" />
      </view>
      <div slot="content">
        <div class="content">
          <div class="content-box">
            <div class="content-box-title">店铺简介</div>
            <div class="content-box-content">
              <div class="content-box-content-editor">
                <editor
                  id="editor"
                  class="cu-editor"
                  placeholder="请输入..."
                  @ready="onEditorReady"
                  v-if="storeInfo"
                ></editor>
              </div>
            </div>
          </div>
          <view class="content-bottom" @click="saveAction">保存</view>
        </div>
      </div>
    </navigationBar>
  </view>
</template>
<script>
import navigationBar from "../../components/navigation-bar/index.vue";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      customNav: {
        bgHeight: "30vh",
        navTitle: "店铺信息",
        color: "#000",
        bg: this.$iconFont.getIconName("icon-store-bg"),
        customizeLeft: true,
      },
      storeInfo: null,
      fileList: []
    };
  },
  onLoad() {
    this.getStoreHomeData();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onEditorReady() {
      const that = this;
      uni
        .createSelectorQuery()
        .in(this)
        .select("#editor")
        .context(function(res) {
          that.editorCtx = res.context;
          that.setValue(that.storeInfo.storeDescription);
        })
        .exec();
    },
    setValue(value) {
      if (this.editorCtx) {
        this.editorCtx.setContents({
          html: value,
          success: () => {},
        });
      }
    },
    saveAction() {
      this.editorCtx.getContents({
        success: (res) => {
          uni.setStorageSync("store-content", res.html);
          uni.navigateBack();
        },
      });
    },
    async getStoreHomeData() {
      try {
        let data = await this.$api.getUserStore({
          id: uni.getStorageSync("storeId"),
        });
        this.storeInfo = data;

        if (uni.getStorageSync("store-content")) {
          this.storeInfo.storeDescription = uni.getStorageSync("store-content");
        } else {
          if (!this.storeInfo.storeDescription) {
            this.storeInfo.storeDescription = "";
          }
        }
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss">
.content {
  @include ver;
  &-box {
    background: #fff;
    margin: 0rpx 20rpx 20rpx 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
    &-title {
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #363434;
      line-height: 40rpx;
      margin: 8rpx 20rpx 0 20rpx;
      padding: 24rpx 0;
      border-bottom: 2rpx solid #eeeeee;
    }
    &-content {
      margin: 36rpx 20rpx 36rpx 20rpx;
      background: #f5f5f5;
      height: 1000rpx;
      &-editor {
        margin: 0 20rpx 32rpx 20rpx;
        padding-top: 32rpx;
        .cu-editor {
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 40rpx;
          height: 59vh;
        }
      }
    }
  }
  .content-bottom {
    position: fixed;
    bottom: 60rpx;
    width: 80%;
    @include hor-center-center;
    height: 88rpx;
    background: #14c9c9;
    border-radius: 41px;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
</style>
