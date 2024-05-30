<template>
  <view class="jupingBox">
    <view class="juping" v-for="(item) in jupingList" :key="item.id">
      <view @click="addClickItem(item)">
        <image class="jupingpic" :src="item.fileUrl" mode="aspectFill"></image>
      </view>
      <view class="bottom">
        <view class="text">{{ item.content }}</view>
        <view class="bottomBox">
          <view class="date">{{ item.createdTime.substring(5, 10) }}</view>
          <view class="fabu">发布</view>
          <view v-if="item.isPraise == true" @click="addclickDianzan(item)">
            <image class="dianzan" src="../static/image/dianzan.png"></image>
          </view>
          <view v-else @click="addclickDianzan(item)">
            <image class="dianzan" src="../static/image/zhan.png"></image>
          </view>
          <view class="number">{{ item.praiseQuantity }}</view>
        </view>
      </view>
    </view>
    <notcData
      position="absolute"
      note="暂无剧评"
      top="10vh"
      noteImg="dramatic-criticism"
      v-if="jupingList.length === 0"
    />
  </view>
</template>
<script>
import notcData from "@/components/notc-data/index.vue";
export default {
  components: { notcData },
  data() {
    return {
      jupingList: [],
      pageNo: 1,
      userInfo: {}
    };
  },
  async onShow(){
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.pageNo = 1;
    await this.getmyDramaEvaluate();
  },
  methods: {
    async addclickDianzan(item) {
      if (item.isPraise == false) {
        await this.userPraiseDynamic(item.id);
        item.isPraise = true;
        item.praiseQuantity++;
      } else {
        await this.QXuserPraiseDynamic(item.id);
        item.isPraise = false;
        item.praiseQuantity--;
      }
    },
    addClickItem(item) {
      uni.navigateTo({
        url: `/pageDetail/pages/scriptReview?userId=${this.userInfo.id}&evaluateId=${item.id}&dramaId=${item.detail}`,
      });
    },
    //我的剧评
    async getmyDramaEvaluate() {
      try {
        if (this.pageNo === 1) {
          this.jupingList = [];
        }

        let res = await this.$api.myDramaEvaluate({
          pageNo: this.pageNo,
          pageSize: 10,
          userId: this.userInfo.id,
          publishUserId: this.userInfo.id,
        });
        if (res.records && res.records.length) {
          this.jupingList.push(...res.records);
        }
      } catch (e) {}
    },
    //点赞
    async userPraiseDynamic(dynamicId) {
      try {
        await this.$api.userPraiseDynamic({
          dynamicId,
          dynamicType: "3",
          statusEnum: "ENABLE",
        });
        uni.showToast({
          title: "点赞成功！",
          icon: "none",
        });
      } catch (e) {
        return false;
      }
    },
    // 取消点赞
    async QXuserPraiseDynamic(dynamicId) {
      try {
        await this.$api.userPraiseDynamic({
          dynamicId,
          dynamicType: "3",
          statusEnum: "DISABLE",
        });
        uni.showToast({
          title: "取消点赞",
          icon: "none",
        });
      } catch (e) {
        return false;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.jupingBox {
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 80rpx;
  min-height: 60vh;
  .juping {
    width: 360rpx;
    height: 672rpx;
    background: #ffffff;
    border-radius: 24rpx 24rpx 24rpx 24rpx;
    opacity: 1;
    margin-bottom: 16rpx;
    margin-left: 10rpx;

    .jupingpic {
      width: 360rpx;
      height: 496rpx;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      opacity: 1;
    }

    .bottom {
      display: flex;
      flex-direction: column;

      .text {
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        margin-top: 8rpx;
        margin-left: 14rpx;
        margin-right: 24rpx;
        @include text-overflow-line(2);
      }
    }

    .bottomBox {
      display: flex;
      justify-content: flex-start;
      margin-top: 12rpx;

      .date {
        white-space: nowrap;
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        margin-left: 14rpx;
        margin-right: 4rpx;
      }

      .fabu {
        white-space: nowrap;
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #5f6572;
      }

      .dianzan {
        height: 32rpx;
        width: 32rpx;
        margin-left: 138rpx;
        margin-right: 6rpx;
      }

      .number {
        font-size: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #666666;
        margin-top: 3rpx;
        transform: translateY(4rpx);
      }
    }
  }
}
</style>