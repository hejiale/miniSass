<template>
  <view class="applyDetail">
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          size="50rpx"
          color="#000"
        />
      </view>
      <div slot="content" class="pb22" v-if="detailInfo">
        <template v-if="commonApplyStatus === 'REJECTED'">
          <view class="applyDetail__fail">
            <view class="applyDetail__failIcon">
              <image src="@/static/image/icon-close.png" />
              <view class="result">审核未通过</view>
            </view>
            <view class="applyDetail__failReason">
              <span>未通过原因</span>
              <view class="text">
                <view
                  ><span v-if="detailInfo.feedback"
                    >{{ detailInfo.feedback }};</span
                  ><span v-if="detailInfo.lianlianFeedback">{{
                    detailInfo.lianlianFeedback
                  }}</span></view
                >
              </view>
            </view>
            <view class="hor-center-center mt32">
              <view
                class="mp-btn"
                @click="
                  handleOpen(
                    'common',
                    `./index?merchantApplyId=${
                      detailInfo.id
                    }&storeId=${
                      detailInfo.sourceId
                    }&delta=${1}&isUpdate=${true}`
                  )
                "
                >修改重新提交</view
              >
            </view>
          </view>
        </template>
        <template v-else>
          <view
            class="applyDetail__hint"
            v-if="
              commonApplyStatus === 'PLATFORM_PENDING' ||
              commonApplyStatus === 'LIANLIAN_PENDING'
            "
            ><image
              src="../static/image/icon-warning.png"
            />审核中，预计一个工作日</view
          >
          <view class="applyDetail__prompt"
            >流程：提交开户申请（资料审核）--设置提现密码--已完成</view
          >
          <view class="open-merchant__content mx16 px16 pb16">
            <view class="applyDetail__group pt16">
              <view>商户名称</view>
              <span>{{ detailInfo.merchantName || "" }}</span>
            </view>
            <view class="applyDetail__group pt16">
              <view>身份证</view>
              <span>{{ detailInfo.merchantBusinessPlatformApply.legalreptIdNo || "" }}</span>
            </view>
            <view class="applyDetail__group pt16">
              <view>联系方式</view>
              <span>{{ detailInfo.merchantPhone || "" }}</span>
            </view>
            <view class="applyDetail__group pt16">
              <view>银行卡号</view>
              <span>
                {{
                  detailInfo.bankNo
                    ? $filters.hideBankCard(detailInfo.merchantBusinessPlatformApply.linkedAcctName)
                    : ""
                }}</span
              >
            </view>
            <view class="applyDetail__group pt16">
              <view>状态</view>
              <span>{{ statusText }}</span>
            </view>
          </view>
          <view
            class="hor-center-center mt32"
            @click="handleOpen('h5Apply')"
            v-if="commonApplyStatus === 'LIANLIAN_PASS'"
          >
            <view class="mp-btn">设置提现密码</view>
          </view>
          <view
            class="hor-center-center mt32"
            @click="handleOpen('h5Reset')"
            v-else-if="detailInfo.activate"
          >
            <view class="mp-btn">重置提现密码</view>
          </view>
        </template>

        <div class="applyDetail__customer">
          <div class="img">
            <image src="../static/image/customer.png" mode="scaleToFill" />
            <button class="popBox-button" open-type="contact">联系客服</button>
          </div>
        </div>
      </div>
    </navigationBar>
  </view>
</template>

<script>
import navigationBar from "@/components/navigation-bar/index.vue";
import service from "../utils/service.js";
import CONF from "@/config";
export default {
  components: {
    navigationBar,
  },
  data() {
    const vm = this;
    return {
      customNav: {
        customizeLeft: true,
        bg: vm.$iconFont.getIconName("finance-bg"),
        navTitle: "商户信息",
        bgHeight: "780rpx",
        color: "#000",
      },
      detailInfo: null,
      statusText: "",
      commonApplyStatus: null,
      delta: null,
      isBack: false,
      storeId: null,
    };
  },
  computed: {},
  watch: {},
  onLoad(options) {
    this.delta = options.delta;
    this.storeId = options.storeId;
  },
  onShow() {
    this.getMerchantBase(this.storeId);
  },
  onUnload() {
    if (this.isBack) return;

    uni.navigateBack({
      delta: Number(this.delta),
    });
  },
  methods: {
    backRoute() {
      this.isBack = true;

      uni.navigateBack({
        delta: Number(this.delta),
      });
    },
    async getMerchantBase(storeId) {
      const res = await service.getMerchantBase({ storeId });
      this.detailInfo = res;

      const { commonApplyStatus } = res;
      if (
        commonApplyStatus === "PLATFORM_PENDING" ||
        commonApplyStatus === "LIANLIAN_PENDING"
      ) {
        this.statusText = "资料待审核";
      } else if (commonApplyStatus === "LIANLIAN_PASS") {
        this.statusText = "待设置提现密码";
      } else if (commonApplyStatus === "ACTIVATE") {
        this.statusText = "已完成";
      }
      this.commonApplyStatus = commonApplyStatus;
    },
    handleOpen(type, url) {
      if (type === "h5Apply") {
        uni.navigateTo({
          url: `./h5-page?url=${CONF.baseURL}/minih5/#/openApply&bankPhone=${this.detailInfo.bankPhone}&merchantId=${this.detailInfo.merchantId}&storeId=${this.detailInfo.sourceId}`,
        });
      } else if (type === "h5Reset") {
        uni.navigateTo({
          url: `./h5-page?url=${CONF.baseURL}/minih5/#/openApply&bankPhone=${this.detailInfo.bankPhone}&merchantId=${this.detailInfo.merchantId}&reset=1&storeId=${this.detailInfo.sourceId}`,
        });
      } else {
        this.isBack = true;
        // 跳转应用内页面
        uni.redirectTo({
          url,
        });
      }
    },
  },
};
</script>
<style lang='scss'>
.applyDetail {
  &__prompt {
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    margin: 8px 0;
    padding-left: 16px;
  }

  &__hint {
    width: 100%;
    padding: rpx(8) 0;
    background: #fef3e6;
    font-size: rpx(14);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ed7b2f;

    &.danger {
      background-color: rgba(255, 0, 0, 0.6);
      color: #fff;
    }

    image {
      margin-left: rpx(16);
      margin-right: rpx(8);
      width: rpx(22);
      height: rpx(22);
    }
  }

  &__group {
    font-size: 14px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
    span {
      display: inline-block;
      font-weight: 400;
      margin: 8px 0 4px;
    }
  }

  &__fail {
    text-align: center;
    margin-top: 57px;
  }

  &__failIcon {
    image {
      width: 72px;
      height: 72px;
    }

    .result {
      font-size: 14px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      margin-top: 6px;
    }
  }

  &__failReason {
    display: flex;
    justify-content: center;
    margin: 40px 0 84px;
    text-align: left;
    span {
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
      margin-right: 12px;
    }

    .text {
      vertical-align: middle;
      word-wrap: break-word;
      width: 60%;
      span {
        font-size: 12px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
    }
  }

  &__customer {
    position: fixed;
    right: 0;
    bottom: 21%;

    .img {
      position: relative;
      image {
        width: 60px;
        height: 60px;
      }

      button {
        position: absolute;
        left: 0;
        top: 0;
        width: 60px;
        height: 60px;
        opacity: 0;
        padding: 0;
      }
    }
  }
}
</style>