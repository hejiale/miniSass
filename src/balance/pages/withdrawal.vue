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
        <div class="topBox">
          <span>到账方式</span>
          <span>{{$filters.hideBankCard(merchantBase.bankNo)}}</span>
        </div>
        <div class="balanceBox">
          <div class="balanceBox-title">提现金额</div>
          <div class="balanceBox-note">提现金额最少10元</div>
          <div class="balanceBox_inputBox">
            <span>¥</span>
            <input type="digit" v-model="inputPrice" focus confirm-type="done" @confirm="onGoWithdrawal" @input="onInputPrice"/>
          </div>
          <div class="balanceBox_bottom">
            <span>可提现金额 ¥{{merchantAmount.availableBalanceAvailable || ''}}</span>
            <div :style="merchantAmount.availableBalanceAvailable > 0 ? '':'opacity: 0.5;'" @click="onWithdrawalAll">全部提现</div>
          </div>
        </div>
      </view>
    </navigation-bar>
    <div class="sureBox" :style="canWithdraw ? '':'opacity: 0.5;'" @click="onGoWithdrawal">确定</div>
    <div class="noteBox">联系客服<button class="noteBox-button" open-type="contact"/></div>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import service from '../utils/service'
import CONF from "@/config";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      customNav: {
        bgHeight: "100vh",
        navTitle: "余额提现",
        color: "#111",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      inputPrice: "",
      merchantBase: {},
      merchantAmount: {}
    };
  },
  async onShow(){
    await this.getMerchantBase();
    await this.getMerchantAmount();
  },
  computed:{
    canWithdraw(){
      return parseFloat(this.inputPrice) >= 10;
    }
  },
  methods: {
    onBack() {
      uni.navigateBack();
    },
    onInputPrice(e){
      //正则表达试
			e.detail.value = (e.detail.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;

      if(parseFloat(e.detail.value) > this.merchantAmount.availableBalanceAvailable){
        this.inputPrice = this.merchantAmount.availableBalanceAvailable;
      }else{
        this.$nextTick(_=>{
          this.inputPrice = e.detail.value;
        })
      }
    },
    async getMerchantBase() {
      this.merchantBase = await service.getMerchantBase({ storeId: uni.getStorageSync('storeId') });
    },
    async getMerchantAmount(){
      try{
        let res = await service.merchantTransferList({merchantId: this.merchantBase.merchantId, pageNo: 1, pageSize: 1, year: 2023, month: 10});
        this.merchantAmount = {
          availableBalanceAvailable: res.availableBalance,
          settlementAvailableBalance: res.settlementIngBalance,
        };
      }catch(e){}
    },
    onWithdrawalAll(){
      if(this.merchantAmount.availableBalanceAvailable > 0){
        this.inputPrice = this.merchantAmount.availableBalanceAvailable;
      }
    },
    onGoWithdrawal(){
      if(parseFloat(this.inputPrice) >= 10){
        uni.navigateTo({
          url: `./h5Page?url=${CONF.baseURL}/minih5/#/verityPassword&bankPhone=${this.merchantBase.merchantPhone}&merchantId=${this.merchantBase.merchantId}&storeId=${this.merchantBase.sourceId}&amount=${parseFloat(this.inputPrice)*100}`
        })
        this.inputPrice = '';
      }else{
        uni.showToast({
          title: '提现金额最少10元',
          icon: 'none'
        })
      }
    }
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
.title {
  position: fixed;
  left: rpx(22);
  top: 14vh;
  width: 71.7vw;
  height: 7.5vh;
}
.topBox {
  position: absolute;
  left: 22px;
  right: 20px;
  top: 13.9vh;
  @include hor-between-center;
  span:nth-child(1) {
    font-size: rpx(15);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 18px;
  }
  span:nth-child(2) {
    font-size: rpx(15);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #111111;
    line-height: 18px;
  }
}
.balanceBox {
  position: fixed;
  top: 19.7vh;
  left: 12px;
  right: 12px;
  height: 18.4vh;
  background: #ffffff;
  border-radius: 8px;
  &-title {
    position: absolute;
    left: 20px;
    top: 20px;
    font-size: rpx(14);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 16px;
  }
  &_inputBox {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 6vh;
    border-bottom: 1px solid #eeeeee;
    height: 40px;
    padding-bottom: 5px;
    @include hor;
    align-items: baseline;
    span:nth-child(1) {
      font-size: 22px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #111111;
      transform: translateY(-1px);
    }
    input:nth-child(2) {
      font-size: 36px;
      color: #111111;
      height: 100%;
      margin-left: 5px;
      width: 80%;
    }
  }
  &_bottom {
    position: absolute;
    left: rpx(0);
    right: rpx(0);
    padding: rpx(20) rpx(20) rpx(14) rpx(20);
    bottom: 0;
    @include hor-between-center;
    span:nth-child(1) {
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    div:nth-child(2) {
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #1cbc80;
    }
  }
  &-note{
    position: absolute;
    left: 21.3vw;
    top: rpx(20);
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
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
  &-button{
    @include abscenter;
    background: unset !important;
  }
  button::after{
    border: none !important;
  }
}
.noteBox::before {
  content: "有问题？";
  color: #666666;
}
.sureBox{
  position: fixed;
  right: rpx(32);
  bottom: 12vh;
  width: rpx(96);
  height: rpx(58);
  background: #1CB880;
  border-radius: 4px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  @include hor-center-center;
}
</style>