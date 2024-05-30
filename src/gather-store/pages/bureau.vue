<template>
  <div class="bureau">
    <div class="bureau-top">
      <image class="bureau-top-bg" :src="$iconFont.getIconName('DM-bureau-bg')" />
      <scroll-view class="weekBox" scroll-x :scroll-left="scrollViewLeft" :scroll-with-animation="true"
        :scroll-anchoring="true">
        <div v-for="(item, index) in dateList" :key="index" style="display: inline-block"
          @click="getCurrentDate(item, index)" :id="'the-' + index">
          <div class="weekBox-item" :class="index === currentDate ? 'activeItem' : ''"
            :style="index + 1 === dateList.length ? 'margin-right: 16px' : ''">
            <span class="weekBox-item-date" :class="index === currentDate ? 'active' : ''">{{ item.date ?
              transitionDate(item.date) : "全部" }}</span>
            <span class="weekBox-item-count" :class="index === currentDate ? 'active' : ''">{{ item.sum }}场</span>
          </div>
        </div>
      </scroll-view>
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon name="arrow-left" @click="backRoute" style="color: #000" size="50rpx" />
        </view>
      </view>
      <view slot="content">
        <div class="bureau-content">
          <div class="bureau-content-bg">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="bureau-content-tab">
            <div class="bureau-content-tab-bg" :style="tabWidth"></div>
            <div class="bureau-content-tab-item">
              <div v-for="(item, index) in tab" :key="index" @click="switchTab(index)"
                :style="tabIndex === index ? 'color:#1a1a1a' : ''">
                {{ item.value }}({{ item.type || 0 }})
              </div>
            </div>
          </div>
          <div class="bureau-content-tip">按玩本时间排序</div>
          <div class="scrollBox" v-if="list.length">
            <div class="scrollBox-item" v-for="it in list" :key="it.id" @click="onDetail(it)">
              <div class="scrollBox-item-info">
                <div class="scrollBox-item-info-img">
                  <image :src="it.dramaItem.dramaCover" mode="aspectFill" />
                </div>
                <div class="scrollBox-item-info-right">
                  <div class="scrollBox-item-info-right-title">
                    <div>{{ it.storeProductName }}</div>
                    <div :class="
                      it.gatherStatus === 'FAIL'
                        ? 'fail'
                        : it.gatherStatus == 'SUCCESS'
                          ? 'success'
                          : 'shopping'">
                      {{
                        (it.gatherLockStatus == "LOCKED" && it.gatherStatus == 'GATHERING')
                        ? $enums.GatherLockStatus.getName(
                          it.gatherLockStatus
                        )
                        : $enums.GatherStatusType.getName(it.gatherStatus)
                      }}
                    </div>
                  </div>
                  <div class="scrollBox-item-info-right-time">
                    {{ getDateStr(it.gameStartTime) }}
                  </div>
                  <div class="scrollBox-item-info-right-price">
                    价格：￥{{ it.originPrice / 100 }}/位
                  </div>
                </div>
              </div>
              <div class="scrollBox-item-btn" v-if="!isFail(it)">
                <div class="scrollBox-item-btn-left">
                  <div class="scrollBox-item-btn-left-player" v-if="it.gatheringMemberItemList.length">
                    <image :style="{ 'margin-left': index === 0 ? '0' : `-20rpx` }"
                      v-for="(item, index) in memberList(it.gatheringMemberItemList)" :key="index" :src="item.avatar" />
                  </div>
                  <div class="scrollBox-item-btn-left-text">
                    {{
                      it.realMaleGamerNum +
                      it.realFemaleGamerNum +
                      it.botMaleGamerNum +
                      it.botFemaleGamerNum
                    }}人已上车
                  </div>
                  <div class="scrollBox-item-btn-left-lack">
                    {{ getPlayerNum(it) }}
                  </div>
                </div>
                <div class="scrollBox-item-btn-right">
                  <button class="scrollBox-item-btn-right-share" open-type="share" @click.stop="onShare(it)">
                    <image src="../static/image/icon-share.png" />
                  </button>
                  <div class="scrollBox-item-btn-right-lock"
                    v-if="(it.gatherStatus === 'GATHERING' || it.gatherStatus === 'SUCCESS') && !isExpire(it)">
                    <div class="unlock" v-if="it.gatherLockStatus == 'LOCKED'" @click.stop="onUnlock(it)">
                      解锁
                    </div>
                    <div class="lock" v-else @click.stop="onLock(it)">锁车</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="emptyBox" v-else>
            <image :src="$iconFont.getIconName('gather-empty')" />
            <span class="cityZuju">当前城市暂时没有组局～</span>
          </div>
          <div class="footer">
            <div class="footer-phone" @click="onPhone">
              <image src="../static/image/icon-phone.png" />
            </div>
            <div class="footer-report" @click="onReport">生成组局公告</div>
            <div class="footer-start" @click="onCreate">发起组局</div>
          </div>
        </div>
      </view>
    </navigation-bar>
    <van-action-sheet :show="showPop" :safe-area-inset-bottom="false" z-index="1000" close-on-click-overlay
      @click-overlay="showPop = false">
      <div class="popBox">
        <span @click="showPop = false">组局公告 <van-icon name="cross" size="18px" class="close" /></span>
        <div class="popBox-content">
          <span v-html="report"></span>
        </div>
        <div class="popBox-bottom" @click="onCopyWechat">复制到微信</div>
      </div>
    </van-action-sheet>
    <div class="modal" v-if="isShowModal">
      <div class="modal-bg" @click="cancel"></div>
      <div class="modal-box">
        <div class="modal-box-title">
          <div>补齐玩家</div>
        </div>
        <div class="modal-box-text">
          <span>是否需要剩余位置一键补齐线下玩家?
            若未满员，当前组局将在开场时间到达时自动解散</span>
        </div>
        <div class="modal-box-btn">
          <div @click="onCancelModel">暂不</div>
          <div @click="onFillPlayer">一键补齐</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { windowWidth } from "@/utils/index";
import service from "../utils/service";
import navigationBar from "@/components/navigation-bar";
export default {
  components: { navigationBar },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      tab: [
        { value: "全部" },
        { value: "拼场中" },
        { value: "拼场成功" },
        { value: "拼场失败" },
      ],
      tabIndex: 0,
      tabWidth: "10rpx",
      dateList: null,
      currentDate: 0,
      infoList: [],
      saving: false,
      currentShare: null,
      showPop: false,
      report: null,
      merchantBase: null,
      scrollViewLeft: 0,
      firstLoad: true,
      isShowModal: false,
      gatheringId: null
    };
  },
  async onLoad() {
    await this.queryMerchantBase();
  },
  onShow() {
    if (uni.getStorageSync('refresh')) {
      wx.removeStorageSync('refresh')
      this.tabIndex = 0;
    }
    this.getDate();

    if (!this.firstLoad) {
      this.getList();
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      let need;

      if (this.currentShare.isRevertSex) {
        let count = this.currentShare.totalGamerNum - this.currentShare.botMaleGamerNum - this.currentShare.botFemaleGamerNum - this.currentShare.realMaleGamerNum - this.currentShare.realFemaleGamerNum;
        need = `${count}人`;
      } else {
        let maleNum = this.currentShare.maleLimitNum - this.currentShare.botMaleGamerNum - this.currentShare.realMaleGamerNum;
        let femaleNum = this.currentShare.femaleLimitNum - this.currentShare.botFemaleGamerNum - this.currentShare.realFemaleGamerNum;
        need = `${maleNum}男${femaleNum}女`;
      }

      let dicts = this.currentShare.dramaItem.dicts.map((it) => it.dictValue);

      return {
        title: `${this.$dayjs(this.currentShare.gameStartTime).format(
          "YYYY年MM月DD日"
        )} ${this.getWeek(this.currentShare.gameStartTime)} ${this.$dayjs(
          this.currentShare.gameStartTime
        ).format("HH:mm")} 等${need}【${this.currentShare.dramaItem.dramaName
          }】 ${dicts.join("，")}， 剧本时长：${this.currentShare.gameTime}小时`,
        path: `/gatherPlayer/pages/index?id=${this.currentShare.id}&scene=${this.currentShare.storeId}`,
        imageUrl: this.currentShare.dramaItem.dramaCover,
      };
    }
    let store = JSON.parse(uni.getStorageSync('shopInfo'));
    return {
      title: store.storeName,
      path: `/pages/gathering/index?scene=${store.id}`,
      imageUrl: store.storeLogo,
    };
  },
  computed: {
    list() {
      if (this.tabIndex == 1) {
        console.log(this.infoList.filter((v) => v.gatherStatus == "GATHERING"));
        return this.infoList.filter((v) => v.gatherStatus == "GATHERING");
      } else if (this.tabIndex == 2) {
        return this.infoList.filter((v) => v.gatherStatus == "SUCCESS");
      } else if (this.tabIndex == 3) {
        return this.infoList.filter((v) => v.gatherStatus == "FAIL");
      } else {
        return this.infoList;
      }
    },
    playerWidth() {
      return function (it) {
        if (it.realMaleGamerNum + it.realFemaleGamerNum >= 1) {
          return `${32 + 18 * (it.realMaleGamerNum + it.realFemaleGamerNum - 1)
            }rpx`;
        } else {
          return `0`;
        }
      };
    },
    transitionDate() {
      return function (date) {
        if (this.$dayjs(new Date()).format("YYYY-MM-DD") == date) {
          return "今天";
        } else if (
          this.$dayjs(new Date() - 86400000).format("YYYY-MM-DD") == date
        ) {
          return "昨天";
        } else {
          let arr = date.split("-");
          return `${arr[1]}.${arr[2]}`;
        }
      };
    },
    getDateStr() {
      return function (date) {
        let time = this.$dayjs(date);
        return (
          "开局：" +
          this.$dayjs(time).format("MM月DD日") +
          " " +
          this.getWeek(time) +
          this.$dayjs(time).format("HH:mm")
        );
      };
    },
    getPlayerNum() {
      return function (it) {
        if (it.isRevertSex) {
          let needCount =
            it.totalGamerNum -
            it.realFemaleGamerNum -
            it.botFemaleGamerNum -
            it.realMaleGamerNum -
            it.botMaleGamerNum;
          if (needCount > 0) {
            return `空${needCount}人`;
          } else {
            return "";
          }
        }
        let str = "";
        if (it.maleLimitNum > it.botMaleGamerNum + it.realMaleGamerNum) {
          str +=
            it.maleLimitNum - (it.botMaleGamerNum + it.realMaleGamerNum) + "男";
        }
        if (it.femaleLimitNum > it.botFemaleGamerNum + it.realFemaleGamerNum) {
          str +=
            it.femaleLimitNum -
            (it.botFemaleGamerNum + it.realFemaleGamerNum) +
            "女";
        }
        if (str) {
          return "差" + str;
        } else {
          return str;
        }
      };
    },
    getColor() {
      return function (it) {
        if (it.gatherLockStatus == "LOCKED") {
          return "shopping";
        } else {
          switch (it.gatherStatus) {
            case "GATHERING":
              return "shopping";
            case "SUCCESS":
              return "fail";
            case "FAIL":
              return "fail";
          }
        }
      };
    },
    isExpire() {
      return function (v) {
        return (
          new Date().getTime() > new Date(v.gameStartTime).getTime()
        );
      }
    },
    isFail() {
      return function (v) {
        return (
          v.gatherStatus === "FAIL" ||
          v.gatherStatus === "DISMISS"
        );
      }
    },
    memberList(){
      return function(list){
        if(list && list.length > 6){
          return list.splice(0, 6);
        }
        return list;
      }
    }
  },
  methods: {
    onPhone() {
      let shop = JSON.parse(uni.getStorageSync('shopInfo'));
      wx.makePhoneCall({
        phoneNumber: shop.telephone
      })
    },
    backRoute() {
      uni.navigateBack();
    },
    onShare(it) {
      this.currentShare = it.$orig;
    },
    async onCopyWechat() {
      uni.setClipboardData({
        data: this.report.replace(/<.+?>/g, ""),
        success: function () {
          uni.showToast({
            title: "复制成功",
          });
        },
      });
    },
    async onReport() {
      try {
        let res = await service.getGatheringPublicContent({
          storeId: uni.getStorageSync("storeId"),
        });
        this.report = res.str;
        this.showPop = true;
      } catch (e) { }
    },
    async switchTab(index) {
      this.tabIndex = index;
      let left = ((await windowWidth()) - 40) / 4;
      if (index) {
        this.tabWidth = `left: ${left * this.tabIndex + 5}px`;
      } else {
        this.tabWidth = "10rpx";
      }
    },
    getCurrentDate(item, index) {
      this.currentDate = index;
      this.tab = [
        { value: "全部", type: item.sum || 0 },
        { value: "拼场中", type: item.gatheringNum || 0 },
        { value: "拼场成功", type: item.successNum || 0 },
        { value: "拼场失败", type: item.failNum || 0 },
      ];
      this.getList();
    },
    async getDate() {
      this.dateList = await service.getStoreGatheringOverviewByDate({
        storeId: uni.getStorageSync("storeId"),
      });

      //若不包含今天的日期，则获取最近的一天日期
      if (this.firstLoad) {
        //首次加载处理
        this.dateList.map((it, index) => {
          let playDate = new Date(it.date);
          let date = new Date();
          if (
            playDate.getFullYear() === date.getFullYear() &&
            playDate.getMonth() + 1 === date.getMonth() + 1 &&
            playDate.getDate() === date.getDate()
          ) {
            this.currentDate = index;
          }
        });

        if (this.currentDate > 0) {
          this.getList();

          let that = this;
          //跳转到指定日期
          uni
            .createSelectorQuery()
            .select(".weekBox")
            .boundingClientRect((data) => {
              uni
                .createSelectorQuery()
                .select(`#the-${that.currentDate}`)
                .boundingClientRect((res) => {
                  if (res && data) {
                    that.scrollViewLeft = res.left - data.left;
                  }
                })
                .exec();
            })
            .exec();
        } else {
          this.getList();
        }
        this.firstLoad = false;
      }
      this.tab = [
        { value: "全部", type: this.dateList[this.currentDate].sum || 0 },
        { value: "拼场中", type: this.dateList[this.currentDate].gatheringNum || 0 },
        { value: "拼场成功", type: this.dateList[this.currentDate].successNum || 0 },
        { value: "拼场失败", type: this.dateList[this.currentDate].failNum || 0 },
      ];
    },
    async getList() {
      this.infoList = await service.getGatheringList({
        date: this.currentDate ? this.dateList[this.currentDate].date : null,
        storeId: uni.getStorageSync("storeId"),
        operatorType: "STORE",
      });
      this.$nextTick(_ => {
        this.$forceUpdate();
      })
    },
    onCreate() {
      if (!this.merchantBase.activate) {
        return wx.showToast({
          title: '店铺商户未激活！',
          icon: 'none'
        })
      }
      uni.navigateTo({
        url: "./bureau-create",
      });
    },
    onDetail(it) {
      uni.navigateTo({
        url: `./bureau-detail?id=${it.id}`,
      });
    },
    /**
     * 转换日期
     */
    getWeek(dateString) {
      let date = new Date(dateString).getDay();
      var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      return "周" + weeks[date];
    },
    async onLock(it) {
      try {
        if (this.saving) return;
        this.saving = true;

        await service.lockGathering({
          id: it.$orig.id,
        });

        uni.showToast({
          title: "锁车成功",
        });
        this.saving = false;
        this.gatheringId = it.$orig.id;
        this.isShowModal = true;
      } catch (e) {
        this.saving = false;
        console.log(e);
      }
    },
    async onUnlock(it) {
      try {
        if (this.saving) return;
        this.saving = true;

        await service.unlockGathering({
          id: it.$orig.id,
        });
        await this.getList();
        await this.getDate();
        uni.showToast({
          title: "解锁成功",
        });
        this.saving = false;
      } catch (e) {
        this.saving = false;
        console.log(e);
      }
    },
    async queryMerchantBase() {
      try {
        this.merchantBase = await this.$api.getMerchantBase({
          storeId: uni.getStorageSync("storeId")
        })
      } catch (e) { }
    },
    async onFillPlayer() {
      try {
        await service.changeFullBotNum({ gatheringId: this.gatheringId })
        this.onCancelModel();
      } catch (e) { }
    },
    async onCancelModel() {
      this.isShowModal = false;
      this.gatheringId = null;
      await this.getDate();
      await this.getList();
    }
  },
};
</script>

<style lang="scss" scoped>
.bureau {
  &-top {
    height: 26.5vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;

    .weekBox {
      position: fixed;
      left: 0;
      right: 0;
      top: 12vh;
      white-space: pre;
      z-index: 1;

      &-item {
        @include ver;
        align-items: center;
        margin-left: rpx(14);
        background: unset;
        border-radius: 12px;
        padding: rpx(12) rpx(9);

        &-date {
          font-size: rpx(12);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #1a1a1a;
          line-height: 14px;
        }

        &-count {
          margin-top: rpx(12);
          font-size: rpx(12);
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 14px;
        }

        .active {
          color: #fff;
        }
      }

      .activeItem {
        background: linear-gradient(180deg, #000000 0%, #000000 100%);
      }
    }
  }

  &-content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 73.8vh;
    border-radius: 40rpx 40rpx 0rpx 0rpx;
    padding: 30rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    &-bg {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: -1;

      :nth-child(1) {
        height: 100vh;
        background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 12%, #F7F7F7 19%, #F7F7F7 100%);
      }

      :nth-child(2) {
        height: 7.8vh;
        background: linear-gradient(180deg,
            #ffffff 0%,
            #ffffff 12%,
            #f7f7f7 19%,
            #f7f7f7 100%);
      }

      :nth-child(3) {
        flex: 1;
        background: #f7f7f7;
      }
    }

    &-tab {
      background: #f4f5f6;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      padding: 10rpx 0;
      position: relative;
      z-index: -1;

      &-bg {
        // width: 160rpx;
        width: 24%;
        height: 56rpx;
        margin-right: 1%;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        transition: left 0.2s ease-in 0s;
        background: #ffffff;
        z-index: -1;
        position: absolute;
        left: 10rpx;
        // transform: translateX(10rpx);
      }

      &-item {
        display: flex;
        justify-content: space-between;

        div {
          //   width: 160rpx;
          width: 24%;
          height: 56rpx;
          font-size: 22rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #666;
          line-height: 56rpx;
          text-align: center;
        }
      }
    }

    &-tip {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 28rpx;
      margin-top: 20px;
    }

    .scrollBox {
      flex: 1;
      overflow-y: auto;
      margin-top: 10px;

      &-item {
        background: #ffffff;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        padding: 30rpx;
        margin-bottom: 30rpx;

        &-info {
          display: flex;
          justify-content: space-between;

          &-img {
            width: 108rpx;
            height: 144rpx;
            border-radius: 12rpx;
            margin-right: 16rpx;
            overflow: hidden;
          }

          &-right {
            flex: 1;
            @include ver;
            justify-content: space-between;

            &-title {
              @include hor-between-center;
              margin-bottom: 32rpx;

              :nth-child(1) {
                @include text-overflow-line(1);
                max-width: 50vw;
                font-size: 28rpx;
                font-family: PingFang SC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 33rpx;
              }

              :nth-child(2) {
                font-size: 24rpx;
                font-family: PingFang SC-Medium, PingFang SC;
                font-weight: 500;
                line-height: 28rpx;
              }
            }

            &-time {
              font-size: 24rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              line-height: 32rpx;
              color: #999;
            }

            &-price {
              font-size: 24rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              line-height: 32rpx;
              color: #999;
            }
          }
        }

        &-btn {
          margin-top: 30rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &-left {
            display: flex;

            &-player {
              height: 32rpx;
              position: relative;
              margin-right: 8rpx;

              image {
                width: 30rpx;
                height: 30rpx;
                border-radius: 50%;
                border: 2rpx solid #ffffff;
                // position: absolute;
                // left: 0;
              }
            }

            &-text {
              font-size: 22rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #8c9aa3;
              line-height: 28rpx;
              transform: translateY(4rpx);
            }

            &-lack {
              font-size: 22rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #faa21e;
              line-height: 28rpx;
              margin-left: 4rpx;
              transform: translateY(4rpx);
            }
          }

          &-right {
            display: flex;
            align-items: center;

            button {
              width: 56rpx;
              height: 56rpx;
              display: flex;
              background-color: none;
              padding-left: 0;
              padding-right: 0;
            }

            button::after {
              display: none;
            }

            &-lock {
              div {
                width: 120rpx;
                height: 56rpx;
                border-radius: 16rpx 16rpx 16rpx 16rpx;
                text-align: center;
                margin-left: 20rpx;
              }

              .unlock {
                font-size: 24rpx;
                font-family: PingFang SC-Semibold, PingFang SC;
                font-weight: 600;
                color: #1a1a1a;
                line-height: 56rpx;
                background: #f7f7f7;
              }

              .lock {
                font-size: 24rpx;
                font-family: PingFang SC-Semibold, PingFang SC;
                font-weight: 600;
                color: #ffffff;
                line-height: 56rpx;
                background: #1a1a1a;
              }
            }
          }
        }
      }

      &-item:last-child {
        margin-bottom: calc(11vh + 30rpx);
      }
    }

    .footer {
      height: 11vh;
      display: flex;
      background: #ffffff;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding-top: rpx(15);
      box-sizing: border-box;

      &-phone {
        width: rpx(48);
        height: rpx(48);
        margin-left: rpx(15);
      }

      &-report {
        margin-left: rpx(15);
        width: 35.7vw;
        height: 96rpx;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        border: 2rpx solid #ebebeb;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 96rpx;
        text-align: center;
      }

      &-start {
        margin-left: rpx(15);
        width: 35.7vw;
        height: 96rpx;
        background: #14c9c9;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 96rpx;
        text-align: center;
      }
    }
  }
}

.success {
  color: #067ae5;
}

.shopping {
  color: #faa21e;
}

.fail {
  color: #999999;
}

.canUse {
  color: #78c747;
}

.emptyBox {
  @include ver;
  align-items: center;

  image {
    width: 300rpx;
    height: 300rpx;
    margin-top: 170rpx;

  }

  .cityZuju {
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #959AA5;
  }
  span:nth-child(3) {
    margin-top: 7px;
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #a3a3a3;
    line-height: 16px;
  }

  div:nth-child(4) {
    margin-top: 30px;
    width: 120px;
    height: 44px;
    background: #1a1a1a;
    border-radius: 16px;
    @include hor-center-center;
    font-size: rpx(14);
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
  }
}

.popBox {
  position: fixed;
  left: 30px;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  border-radius: 22px 22px 22px 22px;
  padding: 20px;
  @include ver;

  span {
    font-size: 14px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 14px;
    position: relative;
    @include hor-center-center;

    .close {
      position: absolute;
      right: 0;
    }
  }

  &-content {
    margin-top: 15px;
    background: #f7f7f7;
    border-radius: 16px 16px 16px 16px;
    padding: 15px;
    min-height: 20vh;
  }

  &-bottom {
    margin: 25px 15px 0 15px;
    height: 48px;
    background: #1a1a1a;
    border-radius: 16px 16px 16px 16px;
    font-size: 14px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 22px;
    @include hor-center-center;
  }
}

.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  &-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  &-box {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 626rpx;
    padding: 40rpx;
    background: #ffffff;
    border-radius: 44rpx 44rpx 44rpx 44rpx;

    &-title {
      position: relative;

      :nth-child(1) {
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 28rpx;
        text-align: center;
      }
    }

    &-text {
      margin-top: 30rpx;
      text-align: center;

      span {
        font-size: 26rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 44rpx;
      }

      .emphasize {
        color: #1a1a1a;
      }
    }

    &-btn {
      margin-top: 50rpx;
      display: flex;
      justify-content: space-between;

      div:nth-child(1) {
        flex: 1;
        background: #f7f7f7;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #999999;
        line-height: 96rpx;
        text-align: center;
      }

      div:nth-child(2) {
        flex: 1;
        background: #1a1a1a;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 96rpx;
        text-align: center;
        margin-left: 34rpx;
      }
    }

    &-btnOnly {
      margin-top: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      border-radius: 32rpx 32rpx 32rpx 32rpx;

      image {
        width: 28rpx;
        height: 28rpx;
        margin-right: 4px;
      }

      span {
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 96rpx;
      }
    }
  }
}</style>
