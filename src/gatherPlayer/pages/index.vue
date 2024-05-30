<template>
  <view v-if="gatherDetail">
    <div class="fixedBg"></div>
    <navigation-bar :nav="customNav">
      <view slot="left" @click="onBack">
        <view class="topNav">
          <image src="../static/image/icon-back.png" />
        </view>
      </view>
      <view slot="content">
        <image
          mode="aspectFill"
          class="bg"
          :src="$filters.filterBlur(gatherDetail.dramaCoverImg)"
        />
        <div
          class="content"
          :style="!isFail ? 'bottom: 90px;' : 'bottom: 0px;'"
        >
          <div class="content-dramaBox">
            <image
              :src="gatherDetail.dramaCoverImg"
              class="content-dramaBox-cover"
              mode="aspectFill"
            />
            <div class="content-dramaBox-infoBox">
              <span class="content-dramaBox-infoBox-title">{{
                gatherDetail.productName
              }}</span>
              <scroll-view class="content-dramaBox-infoBox-tags" scroll-x>
                <div
                  class="content-dramaBox-infoBox-tags-tag"
                  v-for="tag in gatherDetail.dicts"
                  :key="tag.id"
                >
                  {{ tag.dictValue }}
                </div>
              </scroll-view>
              <div class="content-dramaBox-infoBox-typeBox">
                <div class="content-dramaBox-infoBox-typeBox-item">
                  <image src="../static/image/icon-people.png" />
                  <span
                    >{{ gatherDetail.maleLimitNum }}男{{
                      gatherDetail.femaleLimitNum
                    }}女</span
                  >
                </div>
                <div class="content-dramaBox-infoBox-typeBox-item">
                  <image src="../static/image/icon-time.png" />
                  <span>{{ gatherDetail.gameTime }}小时</span>
                </div>
                <div
                  class="content-dramaBox-infoBox-typeBox-item"
                  v-if="gatherDetail.isRevertSex"
                >
                  <image src="../static/image/icon-fanchuan.png" />
                  <span>可反串</span>
                </div>
              </div>
              <div class="content-dramaBox-infoBox-price">
                ¥{{ gatherDetail.originPrice / 100 }}
              </div>
            </div>
            <div class="content-dramaBox-bage" :class="gatherDetail.sellType">
              {{ $enums.SellType.getName(gatherDetail.sellType) }}
            </div>
            <!-- <div
              class="content-dramaBox-status"
              :class="
                gatherDetail.gatherStatus === 'SUCCESS' ||
                (gatherDetail.gatherStatus === 'GATHERING' &&
                  gatherDetail.gatherLockStatus === 'LOCKED')
                  ? 'active'
                  : isFail
                  ? 'fail'
                  : ''
              "
            >
              {{
                gatherDetail.gatherStatus === "GATHERING" &&
                gatherDetail.gatherLockStatus === "LOCKED"
                  ? "拼场成功 "
                  : $enums.GatherStatusType.getName(gatherDetail.gatherStatus)
              }}
            </div> -->
            <div
              class="content-dramaBox-status"
              :class="
                gatherDetail.gatherStatus === 'SUCCESS'
                  ? 'active'
                  : isFail
                  ? 'fail'
                  : ''
              "
            >
              {{
                $enums.GatherStatusType.getName(gatherDetail.gatherStatus)
              }}
            </div>
          </div>
          <div class="content-noteBox">
            <span>本局说明</span>
            <span>{{ gatherDetail.content }}</span>
          </div>
          <div class="content-gatherBox" :style="isFail ? 'padding: 15px' : ''">
            <div class="content-gatherBox-timeBox">
              <span class="content-gatherBox-timeBox-time"
                >开场时间：{{ openDate }}</span
              >
              <div class="content-gatherBox-timeBox-bottom">
                <div
                  class="content-gatherBox-timeBox-bottom-left"
                  v-if="!gatherDetail.isRevertSex"
                >
                  不可反串
                </div>
                <div class="content-gatherBox-timeBox-bottom-left" v-else>
                  可反串
                </div>
                <span
                  class="content-gatherBox-timeBox-bottom-count"
                  v-if="needMember"
                  >{{ needMember }}</span
                >
                <span class="content-gatherBox-timeBox-bottom-all" v-else
                  >已满员</span
                >
              </div>
            </div>
            <div class="content-gatherBox-userBox">
              <div class="content-gatherBox-userBox-box" v-if="gatherDetail.gatherStatus === 'GATHERING'">
                <div class="content-gatherBox-userBox-box-item">
                  <div class="content-gatherBox-userBox-box-item-avater">
                    <image
                      src="../static/image/addUser.png"
                      class="content-gatherBox-userBox-box-item-avater-head"
                    />
                  </div>
                  <span>邀请</span>
                  <button
                    open-type="share"
                    class="content-gatherBox-userBox-box-item-share"
                  ></button>
                </div>
              </div>
              <div
                class="content-gatherBox-userBox-box"
                v-for="(member, index) in gatherDetail.gatheringMemberItemList"
                :key="index"
              >
                <div
                  class="content-gatherBox-userBox-box-item"
                  :style="(gatherDetail.gatherStatus === 'GATHERING' && index === 3) || (gatherDetail.gatherStatus !== 'GATHERING' && index === 4) ? 'margin-right:0' : ''"
                >
                  <div
                    class="content-gatherBox-userBox-box-item-avater"
                    v-if="member.avatar"
                  >
                    <image
                      :src="member.avatar"
                      class="content-gatherBox-userBox-box-item-avater-head"
                      mode="aspectFill"
                      lazy-load
                    />
                    <image
                      src="../static/image/Male.png"
                      alt=""
                      class="content-gatherBox-userBox-box-item-avater-sex"
                      v-if="member.sex === 'MALE'"
                    />
                    <image
                      src="../static/image/Female.png"
                      alt=""
                      class="content-gatherBox-userBox-box-item-avater-sex"
                      v-else
                    />
                  </div>
                  <span style="color: #1a1a1a">{{ member.nickName }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="content-addressBox">
            <image
              src="../static/image/icon-address.png"
              class="content-addressBox-tag"
            />
            <div class="content-addressBox-name">
              {{ storeName }}
            </div>
            <image
              src="../static/image/icon-phone.png"
              class="content-addressBox-phone"
              @click="onPhone"
            />
            <image
              src="../static/image/icon-place.png"
              class="content-addressBox-place"
              @click="onLocation"
            />
          </div>
          <div class="content-returnBox">
            <span class="content-returnBox-title">退款规则</span>
            <span class="content-returnBox-note mt6"
              >· 预订成功后，平台暂不支持修改订单。</span
            >
            <span class="content-returnBox-note"
              >· 如您有时间调整等需求，请联系商家进行协商。</span
            >
            <span class="content-returnBox-note"
              >· 未达到开场人数要求支持随时申请免审核退款
              {{ returnDate }} 前未达到开场人数要求，系统将自动退款。</span
            >
          </div>
        </div>
      </view>
    </navigation-bar>
    <div class="bottomBox" v-if="isJoinGather !== -1 || !isFail">
      <div
        class="bottomBox-button"
        v-if="isJoinGather !== -1"
        @click="onGoOrderDetail"
      >
        查看订单详情
      </div>
      <div
        class="bottomBox-button"
        v-else-if="gatherDetail.orderStatus === 'NOT_PAY'"
        @click="onGoGather"
      >
        继续支付
      </div>
      <div class="bottomBox-button disable" v-else-if="lockedGather">
        已锁车 无法上车
      </div>
      <div class="bottomBox-button disable" v-else-if="isExpire">已过期</div>
      <div class="bottomBox-button" @click="onGoGather" v-else>
        ¥{{ gatherDetail.originPrice / 100 }} 上车
      </div>
      <BindPhone
        @on-success-authorize="onSuccessAuthorize"
        v-if="!userInfo.phone"
      ></BindPhone>
    </div>
  </view>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import BindPhone from "@/components/bindPhone/index.vue";
import service from "../utils/index";
export default {
  components: {
    navigationBar,
    BindPhone,
  },
  data() {
    return {
      customNav: {
        bgHeight: "100vh",
        navTitle: "组局详情",
        color: "#fff",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      gatherId: null,
      gatherDetail: null,
      userInfo: null,
    };
  },
  async onLoad(options) {
    if (getCurrentPages().length === 1) {
      uni.clearStorageSync();
    }
    this.gatherId = options.id;
  },
  async onShow() {
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.queryGatherDetail();
    await this.queryNotPayInfo();
    
    //因为支付回调的问题，需要再重新刷新一遍
    if(uni.getStorageSync('refreshGathering')){
      uni.removeStorageSync('refreshGathering')
      let that = this;
      setTimeout(async ()=>{
        await that.queryGatherDetail();
        await that.queryNotPayInfo();
      },2000)
    }
  },
  onShareAppMessage(res) {
    let need;
    if (this.gatherDetail.isRevertSex) {
      let count =
        this.gatherDetail.totalGamerNum -
        this.gatherDetail.botMaleGamerNum -
        this.gatherDetail.botFemaleGamerNum -
        this.gatherDetail.realMaleGamerNum -
        this.gatherDetail.realFemaleGamerNum;
      need = `${count}人`;
    } else {
      let maleNum =
        this.gatherDetail.maleLimitNum -
        this.gatherDetail.botMaleGamerNum -
        this.gatherDetail.realMaleGamerNum;
      let femaleNum =
        this.gatherDetail.femaleLimitNum -
        this.gatherDetail.botFemaleGamerNum -
        this.gatherDetail.realFemaleGamerNum;
      need = `${maleNum}男${femaleNum}女`;
    }

    let dicts = this.gatherDetail.dicts.map((it) => it.dictValue);

    return {
      title: `${this.$dayjs(this.gatherDetail.gameStartTime).format(
        "YYYY年MM月DD日"
      )} ${this.getWeek(this.gatherDetail.gameStartTime)} ${this.$dayjs(
        this.gatherDetail.gameStartTime
      ).format("HH:mm")} 等${need}【${
        this.gatherDetail.productName
      }】 ${dicts.join("，")}， 剧本时长：${this.gatherDetail.gameTime}小时`,
      path: `/gatherPlayer/pages/index?id=${this.gatherId}`,
      imageUrl: this.gatherDetail.dramaCoverImg,
    };
  },
  computed: {
    openDate() {
      if (!this.gatherDetail) return "";
      return `${this.$dayjs(this.gatherDetail.gameStartTime).format(
        "MM月DD日"
      )} ${this.getWeek(this.gatherDetail.gameStartTime)} ${this.$dayjs(
        this.gatherDetail.gameStartTime
      ).format("HH:mm")}`;
    },
    returnDate() {
      if (!this.gatherDetail) return "";
      return `${this.$dayjs(this.gatherDetail.gameStartTime).format(
        "MM月DD日"
      )} ${this.$dayjs(this.gatherDetail.gameStartTime).format("HH:mm")} ${
        this.fnTime(this.gatherDetail.gameStartTime)
          ? `(${this.fnTime(this.gatherDetail.gameStartTime)})`
          : ""
      }`;
    },
    storeName() {
      if (!this.gatherDetail || !uni.getStorageSync('isLocation')) return "";
      return `${this.gatherDetail.storeAddress} ${(
        this.gatherDetail.distance / 1000
      ).toFixed(0)}km`;
    },
    needMember() {
      if (!this.gatherDetail) return "";

      if (this.gatherDetail.isRevertSex) {
        let needCount =
          this.gatherDetail.totalGamerNum -
          this.gatherDetail.realMaleGamerNum -
          this.gatherDetail.botMaleGamerNum -
          this.gatherDetail.realFemaleGamerNum -
          this.gatherDetail.botFemaleGamerNum;
        if (needCount > 0) {
          return `${needCount}人`;
        } else {
          return null;
        }
      }

      let femaleNum =
        this.gatherDetail.femaleLimitNum -
        this.gatherDetail.realFemaleGamerNum -
        this.gatherDetail.botFemaleGamerNum;
      let maleNum =
        this.gatherDetail.maleLimitNum -
        this.gatherDetail.realMaleGamerNum -
        this.gatherDetail.botMaleGamerNum;
      if (maleNum === 0 && femaleNum === 0) return null;

      return `${
        maleNum > 0 ? `${maleNum}男` : ""
      }${femaleNum > 0 ? `${femaleNum}女` : ""}`;
    },
    isJoinGather() {
      if (!this.gatherDetail) return -1;

      return this.gatherDetail.gatheringMemberItemList.findIndex(
          (e) => e.userId === this.userInfo.id
        );
    },
    lockedGather() {
      if (!this.gatherDetail) return false;
      return this.gatherDetail.gatherLockStatus === "LOCKED";
    },
    isExpire() {
      if (!this.gatherDetail) return false;
      return (
        new Date().getTime() >
          new Date(this.gatherDetail.gameStartTime).getTime() &&
        this.gatherDetail.gatherStatus === "GATHERING"
      );
    },
    isFail() {
      if (!this.gatherDetail) return false;
      return (
        this.gatherDetail.gatherStatus === "FAIL" ||
        this.gatherDetail.gatherStatus === "DISMISS"
      );
    },
  },
  methods: {
    onBack() {
      if (getCurrentPages().length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({
          url: "/pages/index/index",
        });
      }
    },
    onPhone() {
      wx.makePhoneCall({
        phoneNumber: this.gatherDetail.storePhone,
      });
    },
    onLocation() {
      wx.openLocation({
        longitude: this.gatherDetail.storeLongitude,
        latitude: this.gatherDetail.storeLatitude,
        address: this.gatherDetail.storeAddress, //xxx
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    //授权成功后，重新获取用户信息
    async onSuccessAuthorize() {
      this.userInfo = await this.$checkLogin.getUserInfo(true);
    },
    //加入组局
    onGoGather() {
      uni.setStorageSync("gatherDetail", this.gatherDetail);
      uni.navigateTo({
        url: "/gatherPlayer/pages/payOrder",
      });
    },
    onGoOrderDetail() {
      let index = this.gatherDetail.gatheringMemberItemList.findIndex(it=>it.userId === this.userInfo.id);
      uni.navigateTo({
        url: `/my-package/pages/orderDetail?id=${this.gatherDetail.gatheringMemberItemList[index].orderId}`,
      });
    },
    //获取该用户组局内的未支付订单信息
    async queryNotPayInfo(){
      try{
        let res = await service.getGatherNotPayOrderInfo({
          gatheringId: this.gatherId,
          userId: this.userInfo.id
        })
        if(res){
          this.gatherDetail = Object.assign(this.gatherDetail, res.orderInfo, {orderId: res.orderInfo.id}, {maleGamerNum: parseInt(res.maleGamerNum), femaleGamerNum: parseInt(res.femaleGamerNum)});
        }
      }catch(e){}
    },
    //查询组局详情
    async queryGatherDetail() {
      try {
        this.gatherDetail = await service.getGatheringDetail({
          gatheringId: this.gatherId,
          operatorType: "USER",
          userId: this.userInfo.id,
          longitude: uni.getStorageSync("currentLongitude"),
          latitude: uni.getStorageSync("currentLatitude"),
        });
        let gatheringMemberItemList = JSON.parse(
          JSON.stringify(this.gatherDetail.gatheringMemberItemList)
        );
        
        let members = [];
        //机器人占位
        for (let i = 0; i < this.gatherDetail.botMaleGamerNum; i++) {
          members.push({
            sex: "MALE",
            avatar: "../static/image/default-head.png",
            nickName: "线下玩家",
          });
        }
        for (let i = 0; i < this.gatherDetail.botFemaleGamerNum; i++) {
          members.push({
            sex: "FEMALE",
            avatar: "../static/image/default-head.png",
            nickName: "线下玩家",
          });
        }
        //已上坐人占位
        if (gatheringMemberItemList.length) {
          gatheringMemberItemList.map((member) => {
            for (let i = 0; i < member.femaleGamerNum; i++) {
              members.push({
                sex: "FEMALE",
                avatar: member.avatar,
                nickName: member.nickName,
                userId: member.userId,
                orderId: member.orderId,
                gatheringId: member.gatheringId
              });
            }
            for (let i = 0; i < member.maleGamerNum; i++) {
              members.push({
                sex: "MALE",
                avatar: member.avatar,
                nickName: member.nickName,
                userId: member.userId,
                orderId: member.orderId,
                gatheringId: member.gatheringId
              });
            }
          });
        }
        this.gatherDetail.gatheringMemberItemList = members;
      } catch (e) {}
    },
    /**
     * 转换日期
     */
    getWeek(dateString) {
      let date = new Date(dateString).getDay();
      var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      return "周" + weeks[date];
    },
    fnTime(time) {
      let d = new Date(time).setHours(0, 0, 0, 0);
      let today = new Date().setHours(0, 0, 0, 0);

      let obj = {
        "-86400000": "昨天",
        0: "今天",
        86400000: "明天",
      };
      return obj[d - today] || null;
    },
    // async queryStoreInfo(storeId) {
    //   try {
    //     let res = await this.$api.getStoreHome({
    //       storeId,
    //     });
    //     uni.setStorageSync("storeId", res.id);
    //     uni.setStorageSync("shopInfo", JSON.stringify(res));
    //   } catch (e) {}
    // },
  },
};
</script>
<style lang="scss" scoped>
.bg {
  @include fiexcenter;
}
.topNav {
  width: 64rpx;
  height: 64rpx;
}
.content {
  position: fixed;
  left: 0;
  right: 0;
  top: 13.8vh;
  padding: 1.8vh 4vw;
  border-radius: 20px 20px 0 0;
  overflow-y: scroll;
  background: linear-gradient(
    180deg,
    rgba(247, 247, 247, 0.7) 0%,
    rgba(244, 245, 246, 0.8) 4%,
    #f4f5f6 13%,
    #f4f5f6 100%
  );
  &-dramaBox {
    @include hor;
    position: relative;
    &-cover {
      width: rpx(92);
      height: rpx(122);
      border-radius: 8px;
    }
    &-infoBox {
      @include ver;
      margin-left: rpx(10);
      &-title {
        margin-top: 6px;
        font-size: rpx(16);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 19px;
      }
      &-tags {
        @include hor;
        align-items: center;
        margin-top: rpx(12);
        white-space: nowrap;
        width: 60vw;
        &-tag {
          display: inline-block;
          margin-right: 5px;
          padding: 2px 6px;
          background: #ffffff;
          border-radius: 57px;
          font-size: rpx(10);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 16px;
        }
      }
      &-typeBox {
        margin-top: rpx(10);
        @include hor;
        align-items: center;
        &-item {
          @include hor;
          align-items: center;
          margin-right: 15px;
          image {
            width: rpx(14);
            height: rpx(14);
          }
          span {
            margin-left: 5px;
            font-size: rpx(11);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 13px;
          }
        }
      }
      &-price {
        margin-top: 16px;
        font-size: rpx(14);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 16px;
      }
      &-price::before {
        content: "价格：";
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
    &-status {
      position: absolute;
      right: 0;
      bottom: 0px;
      background: #faa21e;
      box-shadow: 0px 2px 4px 0px rgba(250, 162, 30, 0.5);
      border-radius: 6px;
      padding: 5px 11px;
      font-size: rpx(12);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      @include hor-center-center;
    }
    .active {
      background: #067ae5;
      box-shadow: 0px 2px 4px 0px rgba(6, 122, 229, 0.5);
    }
    .fail {
      background: #fa5252;
      box-shadow: 0px 2px 4px 0px rgba(250, 82, 82, 0.5);
    }
    &-bage {
      position: absolute;
      left: rpx(4);
      top: rpx(4);
      border-radius: 4px;
      font-size: rpx(10);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      padding: rpx(2) rpx(4);
    }
    .EXCLUSIVE {
      background: linear-gradient(90deg, #fe6989 50%, #ff928b 100%);
    }
    .BOXED {
      background: linear-gradient(90deg, #317bff 0%, #5754f1 100%);
    }
    .LIMITED {
      background: linear-gradient(90deg, #5655e6 50%, #3e86ff 100%);
    }
    .REAL_SCENE {
      background: linear-gradient(90deg, #ff7043 50%, #ffa726 100%);
    }
    .UNDETERMINED {
      background: linear-gradient(90deg, #c2c7cb 50%, #c2c7cb 100%);
    }
  }
  &-noteBox {
    background: #ffffff;
    border-radius: 16px;
    padding: rpx(15);
    margin-top: 15px;
    @include ver;
    span:nth-child(1) {
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 22px;
    }
    span:nth-child(2) {
      margin-top: 5px;
      font-size: rpx(13);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 15px;
    }
  }
  &-gatherBox {
    margin-top: rpx(15);
    background: #ffffff;
    border-radius: 16px;
    padding: 1.8vh 4vw 0 4vw;
    &-timeBox {
      @include ver;
      background: #f7f7fa;
      border-radius: 12px;
      padding: 1.2vh 2.6vw;
      border-image: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.4),
          rgba(255, 255, 255, 0.1)
        )
        1 1;
      &-time {
        font-size: rpx(16);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 19px;
      }
      &-bottom {
        @include hor-between-center;
        margin-top: 10px;
        &-left {
          width: 56px;
          height: 21px;
          background: #faa21e;
          border-radius: 4px 4px 4px 4px;
          @include hor-center-center;
          font-size: 12px;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
        }
        &-count {
          margin-left: 15px;
          font-size: rpx(12);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #fb2f2f;
          line-height: 14px;
        }
        &-count::before {
          content: "空";
          color: #1a1a1a;
        }
        &-all {
          margin-left: 15px;
          font-size: rpx(12);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #78c747;
          line-height: 14px;
        }
      }
    }
    &-userBox {
      margin-top: 1.8vh;
      &-box {
        display: inline-block;
        &-item {
          @include ver;
          align-items: center;
          margin-right: 4.4vw;
          margin-bottom: 1.8vh;
          position: relative;
          width: 13.2vw;
          &-avater {
            width: 9.6vw;
            height: 9.6vw;
            border-radius: 88rpx;
            position: relative;
            &-head {
              width: 100%;
              height: 100%;
              border-radius: 88rpx;
            }
            &-sex {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 3.7vw;
              height: 1.7vh;
            }
          }
          &-add {
            width: 9.6vw;
            height: 9.6vw;
          }
          span {
            width: 100%;
            text-align: center;
            margin-top: 1vh;
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            @include text-overflow-line(1);
          }
          &-share {
            @include abscenter;
          }
          button {
            background: unset !important;
          }
          button::after {
            border: none;
          }
        }
        .active {
          border: 2px solid #14c9c9;
        }
      }
    }
  }
  &-addressBox {
    margin-top: rpx(15);
    background: #ffffff;
    border-radius: 16px;
    padding: rpx(15);
    position: relative;
    &-name {
      font-size: rpx(13);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 15px;
      width: 70%;
      margin-left: 20px;
    }
    &-phone {
      margin-top: rpx(30);
      width: 100%;
      height: rpx(36);
    }
    &-place {
      position: absolute;
      right: rpx(15);
      top: rpx(15);
      width: rpx(36);
      height: rpx(36);
    }
    &-tag {
      position: absolute;
      left: rpx(15);
      top: rpx(15);
      width: rpx(18);
      height: rpx(18);
    }
  }
  &-returnBox {
    margin-top: 15px;
    height: 147px;
    background: #ffffff;
    border-radius: 16px;
    padding: rpx(15);
    margin-bottom: 11.5vh;
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
}
.bottomBox {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 11.2vh;
  background: #ffffff;
  &-button {
    margin: 15px;
    width: calc(100vw - 60rpx);
    height: 48px;
    background: #14c9c9;
    border-radius: 16px;
    @include hor-center-center;
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
  }
  .disable {
    opacity: 0.5;
  }
}
</style>