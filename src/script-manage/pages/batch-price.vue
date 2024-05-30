<template>
  <view class="container">
    <image
      :src="$iconFont.getIconName('updateDramaPirce')"
      mode="widthFix"
      class="fixedBg"
    />
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000"
            size="50rpx"
          />
        </view>
      </view>
      <view slot="content">
        <div class="container-note">
          设置剧本价格，添加剧本时将默认为此价格对外展示
        </div>
        <div class="container-title">剧本价格</div>
        <div class="container-cellBox">
          <div class="container-cellBox-titleBox">
            <span>*</span>
            <span>盒装价格</span>
          </div>
          <div class="container-cellBox-inputBox">
            <span>¥</span>
            <input v-model="boxedPrice.standardPrice" @blur="onBlurBoxedPrice" type="digit"/>
          </div>
        </div>
        <div class="container-cellBox">
          <div class="container-cellBox-titleBox">
            <span>*</span>
            <span>城限价格</span>
          </div>
          <div class="container-cellBox-inputBox">
            <span>¥</span>
            <input v-model="limitedPrice.standardPrice" @blur="onBlurLimitPrice" type="digit"/>
          </div>
        </div>
        <div class="container-cellBox">
          <div class="container-cellBox-titleBox">
            <span>*</span>
            <span>独家价格</span>
          </div>
          <div class="container-cellBox-inputBox">
            <span>¥</span>
            <input v-model="exclusivePrice.standardPrice"  @blur="onBlurExclusiverPrice" type="digit"/>
          </div>
        </div>
        <div class="container-cellBox">
          <div class="container-cellBox-titleBox">
            <span>*</span>
            <span>实景价格</span>
          </div>
          <div class="container-cellBox-inputBox">
            <span>¥</span>
            <input v-model="realScenePrice.standardPrice" @blur="onBlurRealScenePrice" type="digit"/>
          </div>
        </div>
        <div class="container-bottomBox" @click="onSave">保存</div>
      </view>
    </navigation-bar>
  </view>
</template>
<script>
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar";
import service from "../utils/service";
export default {
  components: { notcData, navigationBar },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "剧本价格",
      },
      boxedPrice: {},
      limitedPrice: {},
      exclusivePrice: {},
      realScenePrice: {},
    };
  },
  onLoad() {
    this.queryPriceList();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onBlurBoxedPrice(e){
      this.boxedPrice.standardPrice = this.num(e.detail.value);
    },
    onBlurLimitPrice(e){
      this.limitedPrice.standardPrice = this.num(e.detail.value);
    },
    onBlurExclusiverPrice(e){
      this.exclusivePrice.standardPrice = this.num(e.detail.value);
    },
    onBlurRealScenePrice(e){
      this.realScenePrice.standardPrice = this.num(e.detail.value);
    },
    num(value) {
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字
      value = value.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
      value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      return value;
    },
    //查询价格列表
    async queryPriceList() {
      try {
        let data = await service.getStoreDramaStandardPrice({
          storeId: uni.getStorageSync("storeId"),
        });

        if (data.storeDramaStandardPriceList.length) {
          data.storeDramaStandardPriceList.map((it) => {
            if (it.sellType === "BOXED") {
              this.boxedPrice = {
                id: it.id,
                sellType: "BOXED",
                standardPrice: it.standardPrice/100,
              };
            } else if (it.sellType === "LIMITED") {
              this.limitedPrice = {
                id: it.id,
                sellType: "LIMITED",
                standardPrice: it.standardPrice/100,
              };
            } else if (it.sellType === "EXCLUSIVE") {
              this.exclusivePrice = {
                id: it.id,
                sellType: "EXCLUSIVE",
                standardPrice: it.standardPrice/100,
              };
            } else {
              this.realScenePrice = {
                id: it.id,
                sellType: "REAL_SCENE",
                standardPrice: it.standardPrice/100,
              };
            }
          });
        } else {
          this.boxedPrice = {
            sellType: "BOXED",
            standardPrice: "88",
          };
          this.limitedPrice = {
            sellType: "LIMITED",
            standardPrice: "88",
          };
          this.exclusivePrice = {
            sellType: "EXCLUSIVE",
            standardPrice: "88",
          };
          this.realScenePrice = {
            sellType: "REAL_SCENE",
            standardPrice: "88",
          };
        }
      } catch (e) {}
    },
    async onSave() {
      if (
        this.boxedPrice.standardPrice === '' ||
        this.limitedPrice.standardPrice === '' ||
        this.realScenePrice.standardPrice === '' ||
        this.exclusivePrice.standardPrice === ''
      ) {
        return wx.showToast({ title: "请输入所有价格", icon: "none" });
      }
      let storeDramaStandardPriceList = [];
      storeDramaStandardPriceList.push({
        id: this.boxedPrice.id,
        sellType: this.boxedPrice.sellType,
        standardPrice: parseFloat(this.boxedPrice.standardPrice)*100,
        storeId: uni.getStorageSync("storeId"),
      });
      storeDramaStandardPriceList.push({
        id: this.limitedPrice.id,
        sellType: this.limitedPrice.sellType,
        standardPrice: parseFloat(this.limitedPrice.standardPrice)*100,
        storeId: uni.getStorageSync("storeId"),
      });
      storeDramaStandardPriceList.push({
        id: this.exclusivePrice.id,
        sellType: this.exclusivePrice.sellType,
        standardPrice: parseFloat(this.exclusivePrice.standardPrice)*100,
        storeId: uni.getStorageSync("storeId"),
      });
      storeDramaStandardPriceList.push({
        id: this.realScenePrice.id,
        sellType: this.realScenePrice.sellType,
        standardPrice: parseFloat(this.realScenePrice.standardPrice)*100,
        storeId: uni.getStorageSync("storeId"),
      });
      
      try {
        await service.setStoreStandardPrice({
          storeId: uni.getStorageSync("storeId"),
          storeDramaStandardPriceList,
        });
        wx.showToast({title: '设置成功'})
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss">
.fixedBg {
  background: #fff;
}
.topNav {
  display: flex;
  align-items: center;
  /deep/image {
    vertical-align: super !important;
  }
}
.container {
  &-note {
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
    margin: rpx(10) 0 0 rpx(16);
  }
  &-title {
    font-size: rpx(16);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin: rpx(16) 0 0 rpx(16);
  }
  &-cellBox {
    @include hor;
    align-items: center;
    padding-left: rpx(16);
    padding-top: rpx(18);
    &-titleBox {
      span {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
      span:nth-child(1) {
        color: #fa5252;
      }
    }
    &-inputBox {
      @include hor;
      align-items: center;
      margin-left: rpx(16);
      width: 70vw;
      height: 46px;
      background: #f4f5f6;
      border-radius: 8px;
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #666666;
      span {
        margin-left: rpx(15);
      }
      input {
        margin-left: rpx(4);
      }
    }
  }
  &-bottomBox {
    margin-top: rpx(170);
    width: 73vw;
    margin-left: 13vw;
    height: 44px;
    background: #14c9c9;
    border-radius: 41px;
    font-size: rpx(16);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    @include hor-center-center;
  }
}
</style>
