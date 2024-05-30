<template>
  <view v-if="info">
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <div class="topNav-backBox">
            <van-icon name="arrow-left" @click="backRoute" style="color: #000" size="16" />
          </div>
        </view>
      </view>
      <view slot="content">
        <div class="dramaBox">
          <image :src="$filters.processImage(info.dramaCoverImg, 160)" mode="aspectFill" v-if="info.dramaCoverImg" />
          <image :src="$filters.processImage(info.dramaCover, 160)" mode="aspectFill" v-else />
          <span>{{ info.dramaName }}</span>
          <div class="dramaBox-tags">
            <div class="dramaBox-tags-tag" v-for="it in info.dicts" :key="it.id">
              {{ it.dictValue }}
            </div>
          </div>
          <div class="dramaBox-price">¥{{ info.currentPrice / 100 }}/位</div>
        </div>
        <div class="dateBox">
          <image src="../static/image/icon-date.png" />
          <span>开场时间</span>
          <span>{{ $dayjs(info.gameStartTime).format("MM月DD日") }} {{ week
          }}{{ $dayjs(info.gameStartTime).format("HH:mm") }}</span>
        </div>
        <div class="phoneBox">
          <image src="../static/image/order-phone.png" />
          <span>手机号码</span>
          <input type="number" v-model="info.phone" placeholder="请输入..." placeholder-style="color:#e6e6e6"
            :disabled="info.orderStatus" />
          <!-- <van-icon name="arrow" size="14" class="arrow" /> -->
          <span>供店家紧急联系使用</span>
        </div>
        <div class="playerNumBox">
          <image class="playerNumBox-tag" src="../static/image/icon-people.png" />
          <span class="playerNumBox-title">上车人数</span>
          <span class="playerNumBox-note" v-if="needCount > 0 && info.isRevertSex">缺{{ needCount }}人</span>
          <span class="playerNumBox-note" v-if="!info.isRevertSex && needMaleOrFemale">缺{{ needMaleOrFemale }}</span>
          <span class="playerNumBox-memo">为保证玩家体验，请如实选择性别</span>
          <div class="playerNumBox-leftMale">
            男
            <image src="../static/image/Male.png" />
          </div>
          <div class="playerNumBox-leftFeMale">
            女
            <image src="../static/image/Female.png" />
          </div>
          <div class="playerNumBox-numBox">
            <div class="playerNumBox-numBox-left" @click="onChangeCount('male', 'reduce')">
              <image src="../static/image/icon-can-reduce.png" v-if="info.maleCount > 0 && !info.orderStatus" />
              <image src="../static/image/icon-disable-reduce.png" v-else />
            </div>
            <span class="playerNumBox-numBox-count">{{ info.maleCount }}</span>
            <div class="playerNumBox-numBox-right" @click="onChangeCount('male', 'plus')">
              <image src="../static/image/icon-disable-plus.png" v-if="maxMale || info.orderStatus" />
              <image src="../static/image/icon-can-plus.png" v-else />
            </div>
          </div>
          <div class="playerNumBox-numBox" style="top: 134px">
            <div class="playerNumBox-numBox-left" @click="onChangeCount('female', 'reduce')">
              <image src="../static/image/icon-can-reduce.png" v-if="info.femaleCount > 0 && !info.orderStatus" />
              <image src="../static/image/icon-disable-reduce.png" v-else />
            </div>
            <span class="playerNumBox-numBox-count">{{
              info.femaleCount
            }}</span>
            <div class="playerNumBox-numBox-right" @click="onChangeCount('female', 'plus')">
              <image src="../static/image/icon-disable-plus.png" v-if="maxFemale || info.orderStatus" />
              <image src="../static/image/icon-can-plus.png" v-else />
            </div>
          </div>
        </div>
        <div class="returnBox">
          <span class="returnBox-title">退款规则</span>
          <span class="returnBox-note mt6">· 预订成功后，平台暂不支持修改订单。</span>
          <span class="returnBox-note">· 如您有时间调整等需求，请联系商家进行协商。</span>
          <span class="returnBox-note">· 未达到开场人数要求支持随时申请免审核退款
            {{ $dayjs(info.gameStartTime).format("MM月DD日") }} {{ week
            }}{{
  $dayjs(info.gameStartTime).format("HH:mm")
}}
            前未达到开场人数要求，系统将自动退款。</span>
        </div>
        <div style="height: 177px"></div>
        <div class="bottomBox">
          <span>上车人数</span>
          <span>开场价格</span>
          <span>{{ totalPeople }}人</span>
          <span>¥{{ totalAmount }}</span>
          <div @click="onPay" v-if="info.orderStatus === 'NOT_PAY'">
            继续支付
          </div>
          <div @click="onPay" v-else>支付 ¥{{ totalAmount }}</div>
        </div>
      </view>
    </navigation-bar>
  </view>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import service from "../utils/index";
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
        navTitle: "立即上车",
      },
      info: null,
      userInfor: null,
      canSubmit: false,
    };
  },
  async onLoad() {
    this.queryInfo();
  },
  computed: {
    week() {
      if (!this.info) return "";
      return this.getWeek(this.info.gameStartTime);
    },
    totalPeople() {
      if (!this.info) return 0;
      return this.info.maleCount + this.info.femaleCount;
    },
    totalAmount() {
      if (!this.info) return 0;
      return (
        parseInt(this.info.maleCount + this.info.femaleCount) *
        parseFloat(this.info.currentPrice / 100)
      );
    },
    //缺人数
    needCount() {
      if (!this.info) return 0;
      return Math.max(
        this.info.maleGamerNum +
        this.info.femaleGamerNum -
        this.info.botMaleGamerNum -
        this.info.realMaleGamerNum -
        this.info.botFemaleGamerNum -
        this.info.realFemaleGamerNum -
        (this.info.maleCount + this.info.femaleCount),
        0
      );
    },
    needMaleOrFemale() {
      if (!this.info) {
        return null
      }
      let maleCount = this.info.maleGamerNum - this.info.botMaleGamerNum - this.info.realMaleGamerNum - this.info.maleCount;
      let femaleCount = this.info.femaleGamerNum - this.info.botFemaleGamerNum - this.info.realFemaleGamerNum - this.info.femaleCount;
      if (maleCount > 0 || femaleCount > 0) {
        return `${maleCount > 0 ? `${maleCount}男` : ''}${femaleCount > 0 ? `${femaleCount}女` : ''}`;
      }
      return null;
    },
    maxMale() {
      if (!this.info) return 0;
      //角色反转
      if (this.info.isRevertSex) {
        return (
          this.info.maleGamerNum +
          this.info.femaleGamerNum -
          this.info.botMaleGamerNum -
          this.info.realMaleGamerNum -
          this.info.botFemaleGamerNum -
          this.info.realFemaleGamerNum -
          (this.info.maleCount + this.info.femaleCount) ===
          0
        );
      }
      return (
        this.info.maleGamerNum -
        this.info.botMaleGamerNum -
        this.info.realMaleGamerNum -
        this.info.maleCount ===
        0
      );
    },
    maxFemale() {
      if (!this.info) return 0;
      //角色反转
      if (this.info.isRevertSex) {
        return (
          this.info.maleGamerNum +
          this.info.femaleGamerNum -
          this.info.botMaleGamerNum -
          this.info.realMaleGamerNum -
          this.info.botFemaleGamerNum -
          this.info.realFemaleGamerNum -
          (this.info.maleCount + this.info.femaleCount) ===
          0
        );
      }
      return (
        this.info.femaleGamerNum -
        this.info.botFemaleGamerNum -
        this.info.realFemaleGamerNum -
        this.info.femaleCount ===
        0
      );
    },
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onChangeCount(sex, type) {
      if (this.info.orderStatus) return;

      if (sex === "male") {
        if (type === "reduce") {
          if (this.info.maleCount === 0) return;
          this.info.maleCount--;
        } else {
          //角色反转
          if (this.info.isRevertSex) {
            if (
              this.info.maleGamerNum +
              this.info.femaleGamerNum -
              this.info.botMaleGamerNum -
              this.info.realMaleGamerNum -
              this.info.botFemaleGamerNum -
              this.info.realFemaleGamerNum -
              (this.info.maleCount + this.info.femaleCount) ===
              0
            )
              return;
          } else {
            if (
              this.info.maleGamerNum -
              this.info.botMaleGamerNum -
              this.info.realMaleGamerNum ===
              this.info.maleCount
            )
              return;
          }
          this.info.maleCount++;
        }
      } else {
        if (type === "reduce") {
          if (this.info.femaleCount === 0) return;
          this.info.femaleCount--;
        } else {
          //角色反转
          if (this.info.isRevertSex) {
            if (
              this.info.maleGamerNum +
              this.info.femaleGamerNum -
              this.info.botMaleGamerNum -
              this.info.realMaleGamerNum -
              this.info.botFemaleGamerNum -
              this.info.realFemaleGamerNum -
              (this.info.maleCount + this.info.femaleCount) ===
              0
            )
              return;
          } else {
            if (
              this.info.femaleGamerNum -
              this.info.botFemaleGamerNum -
              this.info.realFemaleGamerNum ===
              this.info.femaleCount
            )
              return;
          }

          this.info.femaleCount++;
        }
      }
    },
    /**
     * 转换日期
     */
    getWeek(dateString) {
      let date = new Date(dateString).getDay();
      var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      return "周" + weeks[date];
    },
    async onPay() {
      if (!this.info.phone) {
        return wx.showToast({
          title: "请填写手机号",
          icon: "none",
        });
      }
      if (this.info.maleCount === 0 && this.info.femaleCount === 0) {
        return wx.showToast({
          title: "请选择玩家人数",
          icon: "none",
        });
      }
      let form = {
        createOrderRequest: {
          lianlianUserType: "USER",
          optUserId: this.userInfor.id,
          payUserType: "USER",
          productId: this.info.productId,
          productName: this.info.productName,
          productType: "GATHERING_PRODUCT",
          quantity: this.info.maleCount + this.info.femaleCount,
          storeId: this.info.storeId,
          totalAmount:
            parseInt(this.info.maleCount + this.info.femaleCount) *
            parseFloat(this.info.currentPrice),
          userId: this.userInfor.id,
        },
        gatherOrderType: this.info.gatheringNo ? "MEMBER_JOIN" : "USER_CREATE",
        gatheringAddInfo: {
          botFemaleGamerNum: this.info.botFemaleGamerNum,
          botMaleGamerNum: this.info.botMaleGamerNum,
          content: this.info.content,
          gameStartTime: this.info.gameStartTime,
          gameTime: this.info.gameTime,
          isRevertSex: this.info.isRevertSex,
          originPrice: this.info.originPrice,
          storeProductId: this.info.gatheringNo ? this.info.productId : this.info.id,
          realFemaleGamerNum: this.info.femaleCount,
          realMaleGamerNum: this.info.maleCount,
          storeId: this.info.storeId,
        },
        gatheringMemberJoinInfo: {
          femaleGamerNum: this.info.femaleCount,
          maleGamerNum: this.info.maleCount,
          phone: this.info.phone,
          userId: this.userInfor.id,
          gatheringId: this.info.id,
          gatheringNo: this.info.gatheringNo,
        },
      };

      if (this.canSubmit) return;
      this.canSubmit = true;

      try {
        let data = {};
        if (!this.info.orderId) {
          if (this.info.gatheringNo) {
            data = await service.joinGathering(form);
          } else {
            data = await service.userCreateGathering(form);
          }
        }

        if (form.createOrderRequest.totalAmount > 0) {
          this.$checkLogin.orderPay(
            this.info.orderId || data.id,
            this.userInfor.id
          ).then(data=>{
            uni.showToast({
              title: "支付成功！",
            });
            setTimeout(() => {
              this.canSubmit = false;

              uni.setStorageSync('refreshGathering', true)

              if (this.info.gatheringNo) {
                uni.navigateBack();
              } else {
                uni.navigateBack({
                  delta: 2
                })
              }
            }, 500);
          }).catch(e=>{
            this.info["orderStatus"] = "NOT_PAY";
            this.info["orderId"] = this.info.orderId || data.id;
            this.canSubmit = false;
          })
        } else {
          uni.showToast({
            title: "支付成功！",
          });
          setTimeout(() => {
            uni.setStorageSync('refreshGathering', true)

            if (this.info.gatheringNo) {
              uni.navigateBack();
            } else {
              uni.navigateBack({
                delta: 2
              })
            }
          }, 500);
          this.canSubmit = false;
        }
      } catch (e) {
        this.canSubmit = false;
      }
    },
    async queryInfo() {
      this.userInfor = await this.$checkLogin.getUserInfo();

      //创建组局
      if (uni.getStorageSync("gatherInfo")) {
        this.info = {
          maleCount: 0,
          femaleCount: 0,
          phone: this.userInfor.phone,
          botMaleGamerNum: 0,
          botFemaleGamerNum: 0,
          realMaleGamerNum: 0,
          realFemaleGamerNum: 0,
          ...uni.getStorageSync("gatherInfo"),
        };
        uni.removeStorageSync("gatherInfo");
      }
      //加入组局
      if (uni.getStorageSync("gatherDetail")) {
        let gatherDetail = uni.getStorageSync("gatherDetail");
        this.info = {
          maleCount: gatherDetail.maleGamerNum || 0,
          femaleCount: gatherDetail.femaleGamerNum || 0,
          ...gatherDetail,
          currentPrice: gatherDetail.originPrice,
          maleGamerNum: gatherDetail.maleLimitNum,
          femaleGamerNum: gatherDetail.femaleLimitNum,
          phone: gatherDetail.phone || this.userInfor.phone
        };
        uni.removeStorageSync("gatherDetail");
      }
      console.log(this.info)
    },
  },
};
</script>
<style lang="scss">
.fixedBg {
  background: #f4f5f6;
  height: 100vh;
}

.topNav {
  display: flex;
  align-items: center;

  &-backBox {
    width: rpx(32);
    height: rpx(32);
    background: #ffffff;
    border-radius: 10px;
    @include hor-center-center;
  }

  /deep/image {
    vertical-align: super !important;
  }
}

.dramaBox {
  margin: rpx(15);
  height: 12vh;
  background: #ffffff;
  border-radius: 12px;
  position: relative;

  image {
    position: absolute;
    left: rpx(15);
    top: rpx(15);
    width: rpx(50);
    height: rpx(68);
    border-radius: 6px;
  }

  span {
    position: absolute;
    left: rpx(75);
    top: rpx(17);
    font-size: rpx(14);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #1a1a1a;
    line-height: 16px;
  }

  &-tags {
    position: absolute;
    top: rpx(41);
    left: rpx(75);
    white-space: pre;

    &-tag {
      display: inline-block;
      height: 16px;
      background: #f4f5f6;
      border-radius: 8px;
      padding: 0 5px;
      margin-right: 5px;
      color: #999;
    }
  }

  &-price {
    position: absolute;
    left: rpx(75);
    top: rpx(62);
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #14c9c9;
    line-height: 16px;
  }
}

.dateBox {
  margin: rpx(15);
  height: 6.4vh;
  background: #ffffff;
  border-radius: 12px;
  position: relative;

  image {
    position: absolute;
    left: rpx(15);
    top: rpx(15);
    width: rpx(20);
    height: rpx(20);
  }

  span:nth-child(2) {
    position: absolute;
    left: rpx(45);
    top: rpx(15);
    font-size: rpx(13);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 22px;
  }

  span:nth-child(3) {
    position: absolute;
    right: rpx(15);
    top: rpx(15);
    font-size: rpx(13);
    color: #999999;
    line-height: 22px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
  }
}

.playerNumBox {
  margin: rpx(15);
  height: 21.4vh;
  background: #ffffff;
  border-radius: 12px;
  position: relative;

  &-tag {
    position: absolute;
    left: rpx(15);
    top: rpx(15);
    width: rpx(20);
    height: rpx(20);
  }

  &-title {
    position: absolute;
    left: rpx(45);
    top: rpx(15);
    font-size: rpx(13);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 22px;
  }

  &-note {
    position: absolute;
    right: rpx(15);
    top: rpx(15);
    font-size: rpx(13);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #faa21e;
    line-height: 22px;
  }

  &-memo {
    position: absolute;
    left: rpx(15);
    top: rpx(47);
    font-size: rpx(13);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }

  &-leftMale {
    position: absolute;
    left: rpx(15);
    top: rpx(89);
    width: rpx(53);
    height: rpx(25);
    border-radius: 18px;
    border: 1px solid #ebebeb;
    @include hor-center-center;
  }

  &-leftFeMale {
    position: absolute;
    left: rpx(15);
    top: rpx(134);
    width: rpx(53);
    height: rpx(25);
    border-radius: 18px;
    border: 1px solid #ebebeb;
    @include hor-center-center;
  }

  &-leftMale,
  &-leftFeMale {
    image {
      width: rpx(12);
      height: rpx(12);
      margin-left: 4px;
    }
  }

  &-numBox {
    position: absolute;
    right: rpx(15);
    top: rpx(89);
    @include hor;
    align-items: center;

    &-left,
    &-right {
      padding: 5px;
      @include hor-center-center;

      image {
        width: rpx(16);
        height: rpx(16);
      }
    }

    &-count {
      margin: 0 rpx(15);
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 22px;
    }
  }
}

.phoneBox {
  margin: rpx(15);
  height: 10.3vh;
  background: #ffffff;
  border-radius: 12px;
  position: relative;

  image {
    position: absolute;
    left: rpx(15);
    top: rpx(16);
    width: rpx(20);
    height: rpx(20);
  }

  span:nth-child(2) {
    position: absolute;
    left: rpx(45);
    top: rpx(16);
    font-size: rpx(13);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 22px;
  }

  input:nth-child(3) {
    position: absolute;
    // right: rpx(35);
    right: rpx(15);
    top: rpx(15);
    font-size: rpx(13);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #999999;
    line-height: 22px;
    text-align: right;
  }

  // .arrow {
  //   position: absolute;
  //   top: rpx(20);
  //   right: rpx(15);
  // }
  span:nth-child(4) {
    position: absolute;
    left: rpx(15);
    top: rpx(50);
    font-size: rpx(13);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }
}

.returnBox {
  margin: 15px;
  height: 147px;
  background: #ffffff;
  border-radius: 16px;
  padding: rpx(15);
  @include ver;

  &-title {
    font-size: rpx(14);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #1a1a1a;
    line-height: 22px;
  }

  &-note {
    font-size: rpx(13);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}

.bottomBox {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 21.8vh;
  background: #ffffff;
  border-radius: 24px 24px 0px 0px;
  z-index: 1;

  span:nth-child(1) {
    position: absolute;
    left: rpx(16);
    top: rpx(25);
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 16px;
  }

  span:nth-child(2) {
    position: absolute;
    left: rpx(16);
    top: rpx(61);
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 16px;
  }

  span:nth-child(3) {
    position: absolute;
    right: rpx(16);
    top: rpx(25);
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #14c9c9;
    line-height: 16px;
  }

  span:nth-child(4) {
    position: absolute;
    right: rpx(16);
    top: rpx(61);
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #14c9c9;
    line-height: 16px;
  }

  div:nth-child(5) {
    position: absolute;
    left: rpx(15);
    right: rpx(15);
    bottom: rpx(28);
    height: 48px;
    background: #14c9c9;
    border-radius: 16px;
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    @include hor-center-center;
  }
}
</style>