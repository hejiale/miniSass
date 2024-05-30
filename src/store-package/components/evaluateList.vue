<template>
  <div class="evaluateBox" @click.stop="onGoEvaluateDetail">
    <div class="evaluateBox-head" @click.stop="goUrl">
      <image :src="parama.avatar" mode="aspectFill" />
      <div v-if="parama.userId !== userInfo.id">
        <div class="evaluateBox-head-hasFocus" v-if="parama.focusId">已关注</div>
        <div class="evaluateBox-head-focus" v-else>+</div>
      </div>
    </div>
    <div class="evaluateBox-contentBox">
      <div class="evaluateBox-contentBox-title">{{ parama.nickName || '' }}</div>
      <div class="evaluateBox-contentBox-starBox">
        <image
          src="../static/image/icon-star.png"
          class="evaluateBox-contentBox-starBox-star"
        />
        <span class="evaluateBox-contentBox-starBox-score">{{
          parama.comprehensiveScore
        }}</span>
        <div class="evaluateBox-contentBox-starBox-values">
          环境: {{ parama.environmentScore }}
        </div>
        <div class="evaluateBox-contentBox-starBox-values">
          服务: {{ parama.serviceScore }}
        </div>
        <div class="evaluateBox-contentBox-starBox-values">
          DM: {{ parama.dmScore }}
        </div>
      </div>
      <div class="evaluateBox-contentBox-evaluateBox">
        <span>{{ parama.nickName || '' }}</span>
        <span>评价这家店铺：</span>
        <image :src="status" />
        <span>{{ statusText }}</span>
      </div>
      <div
        class="evaluateBox-contentBox-textBox"
        :class="isOpen ? '' : 'overflowLine'"
      >
        {{ parama.comment || '' }}
        <div
          class="evaluateBox-contentBox-textBox-openBox"
          v-if="parama.comment && parama.comment.length > 80"
          @click.stop="onFold"
        >
          {{ isOpen ? "收起" : "...展开" }}
        </div>
      </div>
      <div class="evaluateBox-contentBox-imageGridBox">
        <imageGrid :images="images" size="25.86"/>
      </div>
      <div class="evaluateBox-contentBox-dramaBox" v-if="parama.dramaDetailVo" @click.stop="onDramaDetail">
        <div class="evaluateBox-contentBox-dramaBox-coverBox">
          <image :src="parama.dramaDetailVo.dramaCover" mode="aspectFill" />
          <image
            :src="sellType(parama.dramaDetailVo.sellType)"
            v-if="sellType(parama.dramaDetailVo.sellType)"
            class="evaluateBox-contentBox-dramaBox-coverBox-sellType"
          />
        </div>
        <div class="evaluateBox-contentBox-dramaBox-right">
          <span class="evaluateBox-contentBox-dramaBox-right-title">{{
            parama.dramaDetailVo.dramaName
          }}</span>
          <div class="evaluateBox-contentBox-dramaBox-right-bottomBox">
            <div>{{ dictValue }}</div>
            <div></div>
            <div>
              {{ parama.dramaDetailVo.maleGamerNum }}男{{
                parama.dramaDetailVo.femaleGamerNum
              }}女 {{ parama.dramaDetailVo.gameTime }}小时
            </div>
          </div>
        </div>
        <div class="evaluateBox-contentBox-dramaBox-priceBox">
          ¥{{ parama.storeDramaPrice / 100 }}/位
        </div>
      </div>
    </div>
    <div class="evaluateBox-dateBox">
      {{ $dayjs(parama.createdTime).format("MM.DD HH:mm") }}
    </div>
    <div class="evaluateBox-noteBox" v-if="parama.hasGathered">
      通过剧游组局评价
    </div>
  </div>
</template>
<script>
import imageGrid from "@/components/imageGrid/index.vue";
import service from "../utils/service";
export default {
  components: { imageGrid },
  props: {
    parama: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isOpen: false,
      userInfo: null
    };
  },
  computed: {
    dictValue() {
      if (!this.parama.dramaDetailVo) return "";
      return this.parama.dramaDetailVo.dicts
        .map((it) => it.dictValue)
        .join(" ");
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
    status() {
      if (this.parama.summarizeEvaluate === "RECOMMEND") {
        return "../static/image/evaluate-nice.png";
      } else if (this.parama.summarizeEvaluate === "SO_SO") {
        return "../static/image/evaluate-normal.png";
      } else {
        return "../static/image/evaluate-no.png";
      }
    },
    statusText() {
      if (this.parama.summarizeEvaluate === "RECOMMEND") {
        return "超棒";
      } else if (this.parama.summarizeEvaluate === "SO_SO") {
        return "一般";
      } else {
        return "不行";
      }
    },
    images(){
      if(!this.parama) return [];
      return this.parama.attachments.map(v=>v.fileUrl);
    }
  },
  async mounted() {
    this.userInfo = await this.$checkLogin.getUserInfo();
  },
  methods: {
    onFold() {
      this.isOpen = !this.isOpen;
    },
    onGoEvaluateDetail() {
      this.$emit("on-evaluate", this.parama.id);
    },
    async goUrl() {
      if (uni.getStorageSync("isLogin") == true) {
        await this.onFocus();
      } else {
        await this.$checkLogin.getGrant();
      }
    },
    async onFocus() {
      try {
        let userInfo = await this.$checkLogin.getUserInfo();
        if(userInfo.phone){
          await service.updateUserFocus({
            flag: this.parama.focusId ? false : true,
            focusUserId: this.parama.userId,
            userId: userInfo.id,
          });
          this.$emit("on-update");
        }else{
          this.$emit('activeUser')
        }
      } catch (e) {}
    },
    onDramaDetail(){
      uni.navigateTo({
        url: `/pageDetail/pages/pageDetail?id=${this.parama.dramaDetailVo.id}`,
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.evaluateBox {
  position: relative;
  @include hor;
  padding-bottom: 30rpx;
  &-head {
    margin: 20rpx 0 0 0rpx;
    position: relative;
    width: 84rpx;
    height: 84rpx;
    image {
      border-radius: 84rpx;
    }
    &-focus {
      position: absolute;
      bottom: -12rpx;
      width: 36rpx;
      height: 24rpx;
      left: 50%;
      transform: translateX(-50%);
      background: #36e4bb;
      border-radius: 28px;
      @include hor-center-center;
      font-size: 22rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 0rpx;
    }
    &-hasFocus {
      position: absolute;
      bottom: -12rpx;
      width: 56rpx;
      height: 26rpx;
      left: 50%;
      transform: translateX(-50%);
      background: #36e4bb;
      border-radius: 28px;
      @include hor-center-center;
      font-size: 16rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 0rpx;
    }
  }
  &-contentBox {
    margin: 20rpx 0 0 18rpx;
    width: 80vw;
    &-title {
      font-size: 30rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      line-height: 36rpx;
      @include text-overflow-line(1);
      width: 70%;
    }
    &-starBox {
      margin-top: 8rpx;
      @include hor;
      align-items: baseline;
      &-star {
        width: 16rpx;
        height: 16rpx;
      }
      &-score {
        font-size: 26rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ff6300;
        line-height: 30rpx;
        margin-left: 4rpx;
        margin-right: 20rpx;
      }
      &-values {
        font-size: 22rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6572;
        line-height: 26rpx;
        margin-right: 12rpx;
      }
    }
    &-evaluateBox {
      margin-top: 20rpx;
      @include hor;
      align-items: center;
      span:nth-child(1){
        max-width: 40%;
        @include text-overflow-line(1);
      }
      image {
        width: 40rpx;
        height: 40rpx;
      }
      span:nth-child(3) {
        margin-left: 8rpx;
        font-size: 26rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        line-height: 30rpx;
      }
    }
    &-textBox {
      margin-top: 20rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      line-height: 32rpx;
      width: 100%;
      position: relative;
      word-break: break-all;
      &-openBox {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #4876ae;
        background: #fff;
        height: 42rpx;
        display: flex;
        flex-direction: column-reverse;
      }
    }
    &-imageGridBox{
      margin-top: 24rpx;
    }
    .overflowLine {
      @include text-overflow-line(4);
    }
    &-dramaBox {
      margin-top: 18rpx;
      width: 100%;
      height: 7.88vh;
      background: #f5f6f8;
      border-radius: 6px;
      @include hor;
      position: relative;
      &-coverBox {
        width: 96rpx;
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        &-sellType {
          position: absolute;
          left: 0rpx;
          top: 0rpx;
          width: 60rpx;
          height: 32rpx;
        }
      }
      &-right {
        @include ver;
        margin: 24rpx 0 0 12rpx;
        width: 80%;
        &-title {
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2e323e;
          line-height: 32rpx;
          @include text-overflow-line(1);
          width: 70%;
        }
        &-bottomBox {
          @include hor;
          margin-top: 10rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          line-height: 28rpx;
          div:nth-child(1) {
            @include text-overflow-line(1);
          }
          div:nth-child(2) {
            width: 2rpx;
            height: 22rpx;
            background: #d9d9d9;
            margin: 0 8rpx;
            transform: translateY(2px);
          }
        }
      }
      &-priceBox {
        position: absolute;
        right: 18rpx;
        top: 22rpx;
        padding: 6rpx 12rpx;
        background: #f94c4c;
        border-radius: 16px;
        @include hor-center-center;
        font-size: 20rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
  &-dateBox {
    position: absolute;
    right: 0rpx;
    top: 26rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #959aa5;
    line-height: 28rpx;
  }
  &-noteBox {
    position: absolute;
    right: 0rpx;
    top: 62rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    padding: 0 6rpx;
    background: #f6f6f6;
    border-radius: 4rpx;
  }
}
</style>