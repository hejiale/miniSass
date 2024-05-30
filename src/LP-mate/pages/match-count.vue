<template>
  <div class="container" v-if="lpUserInfo">
    <div class="container-fixed"></div>
    <image
      :src="$iconFont.getIconName('match-count-bg')"
      class="container-bg"
    ></image>
    <div class="navigationBar" :style="navBarStyle">
      <div class="navigationBar-left">
        <van-icon
          name="arrow-left"
          @click="backRoute"
          color="#000"
          size="50rpx"
        />
      </div>
      <div class="navigationBar-title">获取匹配次数</div>
    </div>
    <div class="container-residueBox">
      <image
        src="../static/image/residue-bg.png"
        class="container-residueBox-bg"
      ></image>
      <span class="container-residueBox-title">{{ matchTime }}次</span>
      <!-- <div class="container-residueBox-right">
        记录
        <van-icon name="arrow" color="#5F6572" size="28rpx" />
      </div> -->
      <span class="container-residueBox-note"
        >会员每日赠送的匹配次数会在当天24点重置，匹配时优先使用免费赠送的次数。</span
      >
    </div>
    <image
      class="container-openMember"
      src="../static/image/look-requirement.png"
      @click="onGoRequirement"
      v-if="lpUserInfo.lpMembershipPackageId"
    ></image>
    <image
      class="container-openMember"
      src="../static/image/open-member.png"
      @click="onOpenMember"
      v-else
    ></image>
    <div class="container-payBox">
      <span class="container-payBox-title">购买次数</span>
      <div class="container-payBox-priceBox">
        <div class="container-payBox-cell mr8" v-for="product in productList" :key="product.id" @click="onSelectProduct(product)">
          <image
            src="../static/image/match-price.png"
            class="container-payBox-cell-bg"
            v-if="payProduct.id === product.id"
          ></image>
          <image
            src="../static/image/match-none-price.png"
            class="container-payBox-cell-bg"
            v-else
          ></image>
          <span class="container-payBox-cell-title mt2">{{ product.productName }}</span>
          <span class="container-payBox-cell-price" :class="{active: payProduct.id === product.id}">{{ product.originPrice / 100 }}</span>
        </div>
      </div>
      <div class="container-payBox-cartBox">
        <image src="../static/image/icon-reduce.png" class="container-payBox-cartBox-caledute" v-if="cartCount > 0" @click="onCaledute('reduce')"></image>
        <image src="../static/image/icon-none-reduce.png" class="container-payBox-cartBox-caledute" v-else></image>
        <div class="container-payBox-cartBox-inputBox">
          <input v-model="cartCount" type="number" :disabled="payProduct === null"/>
        </div>
        <image src="../static/image/icon-plus.png" class="container-payBox-cartBox-caledute" @click="onCaledute('plus')" v-if="payProduct"></image>
        <image src="../static/image/icon-none-plus.png" class="container-payBox-cartBox-caledute" v-else></image>
      </div>
    </div>
    <div class="container-bottom">
      <image
        class="container-bottom-bg"
        src="../static/image/matchCount-bottom.png"
        v-if="cartCount > 0"
      ></image>
      <image
        class="container-bottom-bg"
        src="../static/image/matchCount-noneBottom.png"
        v-else
      ></image>
      <div class="container-bottom-valueBox">
        <span class="container-bottom-valueBox-title">合计:</span>
        <span class="container-bottom-valueBox-price ml6">{{ payPrice }}</span>
        <span class="container-bottom-valueBox-title">（{{ payCount }}次）</span>
      </div>
      <div class="container-bottom-pay" v-if="cartCount > 0" @click="onPay"></div>
    </div>
    <van-popup :show="showSuccess" position="center" round>
      <image :src="$iconFont.getIconName('buy-success')" class="pop-success" @click="backRoute"></image>
    </van-popup>
  </div>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import { getMenuButtonRect } from "@/utils/index";
import service from "../utils/service";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "获取匹配次数",
      },
      menuReact: {},
      userInfo: null,
      lpUserInfo: null,
      matchTime: 0,
      cartCount: 0,
      productList: [],
      payProduct: null,
      showSuccess: false
    };
  },
  async onShow() {
    await this.getProductList();
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.menuReact = await getMenuButtonRect();
    await this.getMemberInfo();
  },
  computed: {
    navBarStyle() {
      return `padding-top: ${this.menuReact.top || 44}px`;
    },
    payPrice(){
      if(!this.payProduct)return 0;

      let money = String(((this.payProduct.originPrice / 100) * this.cartCount));
      if(money.indexOf('.') !== -1){
        return money.substring(0, money.indexOf(".")+3);
      }
      return money;
    },
    payCount(){
      if(!this.payProduct)return 0;
      return (this.payProduct.productName.replace('次卡','')) * this.cartCount;
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onSelectProduct(product){
      this.payProduct = product;
    },
    onCaledute(type){
      if(type === 'reduce'){
        this.cartCount--;
      }else{
        this.cartCount++;
      }
    },
    //查询会员信息
    async getMemberInfo() {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
      await this.getMatchingTime();
    },
    onGoRequirement() {
      uni.navigateTo({ url: "/lovepotion/pages/memberEquity" });
    },
    onOpenMember(){
      uni.navigateTo({ url: "/lovepotion/pages/buyMember" });
    },
    async getMatchingTime() {
      this.matchTime = await service.remainingMatchingTimes({
        id: this.lpUserInfo.id,
      });
    },
    async getProductList(){
      this.productList = await service.feeCountProduct({});
    },
    onPay(){
      let money = (this.payProduct.originPrice * this.cartCount);

      this.$checkLogin.doPay(this.userInfo.id, money, this.payProduct.productType, this.payProduct.productName, this.payProduct.id, 'USER', 'USER', this.cartCount).then(orderId=>{
        this.showSuccess = true;
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-fixed {
    @include fiexcenter;
    background: #f5f9fb;
    z-index: -1;
  }
  &-bg {
    height: 414rpx;
    width: 100vw;
    z-index: -1;
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .navigationBar {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    @include hor;
    align-items: center;
    &-left {
      padding: 8rpx 16rpx;
    }
    &-title {
      font-size: 26rpx;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &-residueBox {
    position: relative;
    margin-left: 16rpx;
    margin-top: 220rpx;
    width: 718rpx;
    height: 194rpx;
    &-bg {
      @include abscenter;
    }
    &-title {
      position: absolute;
      left: 24rpx;
      top: 40rpx;
      font-size: 30rpx;
      font-weight: 400;
      color: #2e323e;
    }
    &-title::before {
      content: "剩余次数：";
      font-weight: 400;
    }
    &-note {
      position: absolute;
      left: 24rpx;
      bottom: 24rpx;
      font-size: 24rpx;
      color: #959aa5;
    }
    &-right {
      position: absolute;
      top: 40rpx;
      right: 32rpx;
      @include hor;
      align-items: center;
      font-size: 28rpx;
      color: #5f6572;
    }
  }
  &-openMember {
    width: 556rpx;
    height: 84rpx;
    margin: 44rpx 0px 0px 82rpx;
  }
  &-payBox {
    margin-top: 64rpx;
    width: 100vw;
    height: 100vh;
    background: #fff;
    border-radius: 28rpx 28rpx 0px 0px;
    padding: 28rpx 40rpx;
    box-sizing: border-box;
    &-title {
      font-weight: 500;
      font-size: 30rpx;
      color: #121212;
    }
    &-priceBox {
      @include hor;
      align-items: center;
      margin-top: 44rpx;
    }
    &-cell {
      @include ver;
      align-items: center;
      width: 216rpx;
      height: 250rpx;
      position: relative;
      &-bg {
        @include abscenter;
      }
      &-title {
        font-weight: 500;
        font-size: 26rpx;
        color: #ffffff;
        line-height: 30rpx;
        z-index: 1;
      }
      &-price {
        margin-top: 58rpx;
        font-weight: 600;
        font-size: 52rpx;
        color: #2e323e;
        z-index: 1;
        position: relative;
      }
      &-price::before {
        content: "¥";
        font-size: 24rpx;
        font-weight: 600;
        position: absolute;
        left: -20rpx;
        bottom: 8rpx;
      }
    }
    .active{
      color: #FF5485;
    }
    &-cartBox{
      margin-top: 22rpx;
      width: 232rpx;
      height: 110rpx;
      background: #F1F1F1;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      border: 4rpx solid #F1F1F1;
      @include hor-center-center;
      &-caledute{
        width: 20rpx;
        height: 20rpx;
        padding: 30rpx 20rpx;
      }
      &-inputBox{
        width: 104rpx;
        height: 56rpx;
        background: #FFFFFF;
        border-radius: 8rpx;
        @include hor-center-center;
        padding: 0px 8rpx;
        box-sizing: border-box;
        input{
          text-align: center;
        }
      }
    }
  }
  &-bottom {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 202rpx;
    border-top: 2rpx solid #eeeeee;
    &-bg {
      position: absolute;
      left: 24rpx;
      width: 702rpx;
      top: 22rpx;
      height: 92rpx;
    }
    &-valueBox {
      position: absolute;
      left: 65rpx;
      top: 42rpx;
      z-index: 1;
      @include hor;
      align-items: baseline;
      &-title {
        font-size: 26rpx;
        color: #2c2527;
      }
      &-price {
        font-family: OPPOSans, OPPOSans;
        font-weight: 800;
        font-size: 40rpx;
        color: #2c2527;
      }
      &-price::before {
        content: "¥";
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 30rpx;
        color: #2c2527;
        margin-right: 6rpx;
      }
    }
    &-pay{
      position: absolute;
      right: 0px;
      width: 34vw;
      height: 60%;
    }
  }
}
.pop-success{
  width: 508rpx;
  height: 426rpx;
}
</style>