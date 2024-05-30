<template>
  <div>
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <div class="backBox" @click="onBack">
          <van-icon name="arrow-left" color="#111111" size="20" />
        </div>
      </view>
      <view slot="content">
        <div class="bgBox"></div>
        <image src="../static/image/title.png" class="title" />
        <image src="../static/image/icon-bg.png" class="tag" />
        <div class="balanceBox">
          <div class="balanceBox-title">可提现金额</div>
          <div class="balanceBox_inputBox">
            <span>¥</span>
            <span>{{ merchantAmount.availableBalance || "0.00" }}</span>
            <div>
              结算中 ¥{{ merchantAmount.settlementIngBalance || "0.00" }}
            </div>
          </div>
          <div class="bottom" v-if="merchantBase.activate">
            <div @click="onUpdatePw">修改密码</div>
            <div class="ml12" @click="onWithdrawal">立即提现</div>
          </div>
          <div
            class="balanceBox-setPW"
            v-else-if="
              merchantBase.lianlianApplyStatus === 'PASS' &&
              !merchantBase.activate
            "
            @click="onSetPw"
          >
            设置密码
          </div>
          <div class="balanceBox-setPW" v-else @click="onApplyMerchant">
            开通商户
          </div>
        </div>
        <div class="balanceListBox">
          <span class="balanceListBox-title">提现明细</span>
          <div
            class="balanceListBox-rightFilter"
            @click="showDatePicker = true"
          >
            <span>{{ $dayjs(currentTime).format("YYYY年MM月") }}</span>
            <van-icon name="arrow-down" size="16" color="#999" />
          </div>
          <div class="balanceListBox-titleBox" v-if="list.length">
            <div
              v-for="it in titles"
              :key="it"
              class="balanceListBox-titleBox-item"
            >
              {{ it }}
            </div>
          </div>
          <scroll-view
            scroll-y
            class="balanceListBox-scrollView"
            @scrolltolower="onLoadMore"
          >
            <div
              v-for="v in list"
              :key="v"
              class="balanceListBox-scrollView-item"
            >
              <div class="balanceListBox-scrollView-item-li">
                {{ $dayjs(v.createdTime).format("MM月DD日") }}
                {{ $dayjs(v.createdTime).format("HH:mm") }}
              </div>
              <div class="balanceListBox-scrollView-item-li">
                ¥{{ v.amount }}
              </div>
              <div class="balanceListBox-scrollView-item-li">
                ¥{{ v.incomeAmount }}
              </div>
            </div>
          </scroll-view>
          <image
            src="../static/image/icon-empty.png"
            class="empty"
            v-if="!list.length"
          />
        </div>
      </view>
    </navigation-bar>
    <div class="noteBox">
      联系客服<button class="noteBox-button" open-type="contact" />
    </div>
    <van-action-sheet
      :show="showDatePicker"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showDatePicker = false"
    >
      <van-datetime-picker
        :value="currentTime"
        title="选择年月"
        :max-date="$dayjs(maxDate).valueOf()"
        :formatter="formatter"
        type="year-month"
        @cancel.native="showDatePicker = false"
        @confirm.native="onConfirmDate"
      />
    </van-action-sheet>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service";
import CONF from "@/config";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      customNav: {
        bgHeight: "100vh",
        navTitle: "",
        color: "#fff",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      list: [],
      titles: ["提现时间", "提现金额", "到账金额"],
      merchantBase: {},
      merchantAmount: {},
      pageNo: 1,
      showDatePicker: false,
      maxDate: new Date(new Date()).getTime(),
      currentDate: null,
      currentTime: new Date().getTime(),
    };
  },
  async onShow() {
    this.pageNo = 1;
    await this.getMerchantBase();
    await this.queryList();
  },
  methods: {
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    onBack() {
      uni.navigateBack();
    },
    onLoadMore() {
      this.pageNo++;
      this.queryList();
    },
    //取现
    onWithdrawal() {
      uni.navigateTo({
        url: "./withdrawal",
      });
    },
    //设置密码
    onSetPw() {
      //需要区分是个人进件还是企业进件
      if(this.merchantBase.lianlianApplyType === 'BUSINESS'){
        uni.navigateTo({
          url: `/enterprise/pages/h5-page?url=${CONF.baseURL}/minih5/#/openApply&bankPhone=${this.merchantBase.bankPhone}&merchantId=${this.merchantBase.merchantId}&storeId=${this.merchantBase.sourceId}`,
        });
      }else{
        uni.navigateTo({
          url: `/individual/pages/h5-page?url=${CONF.baseURL}/minih5/#/openApply&bankPhone=${this.merchantBase.bankPhone}&merchantId=${this.merchantBase.merchantId}&storeId=${this.merchantBase.sourceId}`,
        });
      }
    },
    //修改密码
    onUpdatePw(){
      //需要区分是个人进件还是企业进件
      if(this.merchantBase.lianlianApplyType === 'BUSINESS'){
        uni.navigateTo({
          url: `/enterprise/pages/h5-page?url=${CONF.baseURL}/minih5/#/openApply&bankPhone=${this.merchantBase.bankPhone}&merchantId=${this.merchantBase.merchantId}&storeId=${this.merchantBase.sourceId}&reset=1`,
        });
      }else{
        uni.navigateTo({
          url: `/individual/pages/h5-page?url=${CONF.baseURL}/minih5/#/openApply&bankPhone=${this.merchantBase.bankPhone}&merchantId=${this.merchantBase.merchantId}&storeId=${this.merchantBase.sourceId}&reset=1`,
        });
      }
    },
    //开通商户
    onApplyMerchant(){
      if(this.merchantBase.platformApplyStatus){
        //需要区分是个人进件还是企业进件
        if(this.merchantBase.lianlianApplyType === 'BUSINESS'){
          uni.navigateTo({
            url: `/enterprise/pages/apply-detail?storeId=${uni.getStorageSync('storeId')}&delta=${1}`,
          });
        }else{
          uni.navigateTo({
            url: `/individual/pages/apply-detail?storeId=${uni.getStorageSync('storeId')}&delta=${1}`,
          });
        }
      }else{
        uni.navigateTo({
          url: `/incomingParts/pages/index`
        })
      }
    },
    onConfirmDate(e) {
      this.currentTime = e.detail;
      this.showDatePicker = false;
      this.pageNo = 1;
      this.queryList();
    },
    async getMerchantBase() {
      this.merchantBase = await service.getMerchantBase({
        storeId: uni.getStorageSync("storeId"),
      });
    },
    async queryList() {
      if (!this.merchantBase.merchantId) {
        return;
      }

      try {
        if (this.pageNo === 1) {
          this.list = [];
        }

        let data = await service.merchantTransferList({
          merchantId: this.merchantBase.merchantId,
          pageNo: this.pageNo,
          pageSize: 50,
          year: parseInt(this.$dayjs(this.currentTime).format("YYYY")),
          month: parseInt(this.$dayjs(this.currentTime).format("MM")),
        });
        if (this.pageNo === 1) {
          this.merchantAmount = {
            availableBalance: data.availableBalance,
            settlementIngBalance: data.settlementIngBalance,
          };
        }

        if (data.withdrawalPage.records && data.withdrawalPage.records.length) {
          this.list.push(...data.withdrawalPage.records);
        }
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.fixedBg {
  background: #f6f8f9 !important;
}
.backBox {
  width: 32px;
  height: 32px;
  @include hor-center-center;
}
.bgBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 32vh;
  background: linear-gradient(180deg, #aae9d2 0%, rgba(170, 233, 210, 0) 100%);
}
.tag {
  position: fixed;
  right: rpx(28);
  top: 10.6vh;
  width: rpx(88);
  height: rpx(128);
}
.title {
  position: fixed;
  left: rpx(22);
  top: 14vh;
  width: 71.7vw;
  height: 7.5vh;
  z-index: 1;
}
.balanceBox {
  position: fixed;
  top: 23.7vh;
  left: 12px;
  right: 12px;
  height: 25.2vh;
  background: #ffffff;
  border-radius: 8px;
  &-title {
    position: absolute;
    left: rpx(20);
    top: rpx(20);
    font-size: rpx(14);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 16px;
  }
  &_inputBox {
    position: absolute;
    left: rpx(20);
    right: rpx(20);
    top: 6vh;
    border-bottom: 1px solid #eeeeee;
    height: 40px;
    padding-bottom: 6px;
    @include hor;
    align-items: baseline;
    span:nth-child(1) {
      font-size: 22px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #111111;
      transform: translateY(-1px);
    }
    span:nth-child(2) {
      font-size: 36px;
      color: #111111;
      height: 100%;
      margin-left: 5px;
      width: 60%;
      font-family: OPPOSans-Heavy, OPPOSans;
      line-height: 42px;
    }
    div:nth-child(3) {
      position: absolute;
      right: rpx(0);
      bottom: rpx(12);
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #1cbc80;
      line-height: 16px;
    }
  }
  &-setPW {
    position: absolute;
    left: rpx(20);
    right: rpx(20);
    top: 17.3vh;
    height: 44px;
    background: rgba(28, 188, 128, 0.1);
    border-radius: 4px;
    @include hor-center-center;
    font-size: 15px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #1cbc80;
  }
  .bottom {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 17.3vh;
    @include hor;
    div {
      @include hor-center-center;
      flex: 1;
      height: 44px;
      border-radius: 4px;
      font-size: 15px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
    }
    div:nth-child(1) {
      background: #f4f4f4;
      color: #111111;
    }
    div:nth-child(2) {
      background: #1cb880;
      color: #fff;
    }
  }
}
.balanceListBox {
  position: fixed;
  left: rpx(12);
  right: rpx(12);
  top: 50.2vh;
  height: 37vh;
  background: #ffffff;
  border-radius: 8px;
  &-title {
    position: absolute;
    left: rpx(16);
    top: rpx(14);
    font-size: rpx(15);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #111111;
    line-height: 18px;
  }
  &-rightFilter {
    position: absolute;
    right: rpx(0);
    top: rpx(0);
    @include hor;
    align-items: center;
    padding: 16px 16px rpx(0) rpx(16);
    span {
      font-size: 13px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #111111;
      line-height: 15px;
    }
  }
  .empty {
    position: absolute;
    top: 14.4vh;
    left: 50%;
    width: rpx(92);
    height: rpx(80);
    transform: translateX(-50%);
  }
  &-titleBox {
    position: absolute;
    left: rpx(16);
    top: 5.7vh;
    right: rpx(16);
    @include hor;
    align-items: center;
    &-item {
      display: flex;
      flex: 1;
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    &-item:nth-child(1) {
      justify-content: flex-start;
    }
    &-item:nth-child(2),
    &-item:nth-child(3),
    &-item:nth-child(4) {
      justify-content: flex-end;
    }
  }
  &-scrollView {
    position: absolute;
    left: rpx(16);
    width: 85vw;
    top: 9.1vh;
    bottom: 0;
    &-item {
      @include hor;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      padding: 6px 0;
      &-li {
        display: flex;
        flex: 1;
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
      &-li:nth-child(1) {
        justify-content: flex-start;
      }
      &-li:nth-child(2) {
        color: #b58817;
      }
      &-li:nth-child(2),
      &-li:nth-child(3),
      &-li:nth-child(4) {
        justify-content: flex-end;
      }
    }
  }
}
.noteBox {
  position: fixed;
  left: 0;
  right: 0;
  padding: 4vh 0;
  bottom: 0;
  font-size: rpx(13);
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #1cbc80;
  text-align: center;
  &-button {
    @include abscenter;
    background: unset !important;
  }
  button::after {
    border: none !important;
  }
}
.noteBox::before {
  content: "有问题？";
  color: #666666;
}
</style>