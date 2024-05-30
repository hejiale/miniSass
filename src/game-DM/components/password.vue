<template>
  <div class="password">
    <image class="bg" src="../static/tool-bg.png" />
    <div class="password-content" v-if="passwordInfo">
      <span class="password-content-title">{{ passwordInfo.name }}</span>
      <div class="close" @click="pageClose">
        <van-icon name="cross" color="#CCBC91" size="24px" />
      </div>
      <span class="password-content-note"
        >答案：{{ passwordInfo.password }}</span
      >
      <div class="password-content-scroll">
        <div class="password-content-scroll-title">回答情况</div>
        <div
          class="password-content-scroll-note"
          :style="flag ? 'color: #3beb61;' : 'color: #fff;'"
        >
          {{ flag ? "解锁成功" : "解锁中…" }}
        </div>
        <image
          src="../static/refresh.png"
          class="password-content-scroll-refresh"
          @click="queryResult"
        />
        <image
          src="../static/icon-blur.png"
          class="password-content-scroll-blur"
        />
        <scroll-view scroll-y class="password-content-scroll-listBox">
          <div
            class="password-content-scroll-listBox-item"
            v-for="(item, idx) in resultList"
            :key="idx"
          >
            <span class="password-content-scroll-listBox-item-date">{{
              $dayjs(item.currentTime).format("HH:mm:ss")
            }}</span>
            <div class="password-content-scroll-listBox-item-right">
              <div class="password-content-scroll-listBox-item-right-item">
                <span>解锁人员：</span>
                <span
                  :class="idx === 0 ? (item.flag ? 'success' : 'fail') : ''"
                  >{{ item.roleName || "" }}</span
                >
              </div>
              <div class="password-content-scroll-listBox-item-right-item">
                <span>输入密码：</span>
                <span
                  :class="idx === 0 ? (item.flag ? 'success' : 'fail') : ''"
                  >{{ item.password }}</span
                >
              </div>
              <div class="password-content-scroll-listBox-item-right-item">
                <span>结果判定：</span>
                <span
                  :class="idx === 0 ? (item.flag ? 'success' : 'fail') : ''"
                  >{{ item.flag ? "解锁成功" : "密码错误" }}</span
                >
              </div>

              <div
                class="password-content-scroll-listBox-item-right-content"
                v-if="passwordInfo.isHelper && !item.flag"
              >
                <span>输入分析：</span>
                <div
                  class="password-content-scroll-listBox-item-right-content-list"
                >
                  <div
                    class="password-content-scroll-listBox-item-right-content-list-item"
                  >
                    <span>内容与位置都正确： </span>
                    <span :class="idx === 0 ? 'fail':''">{{ `${item.trueNumber}位` }}</span>
                  </div>
                  <div
                    class="password-content-scroll-listBox-item-right-content-list-item"
                  >
                    <span>内容正确位置不正确： </span>
                    <span :class="idx === 0 ? 'fail':''">{{
                      `${item.truePositionNumber}位`
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="height: 20px"></div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import service from "@/services/game.js";
export default {
  props: {
    title: {
      type: String,
    },
    currentRoundId: {
      type: Number,
    },
  },
  computed: {
    ...mapState("dm", ["userInfo", "gameInfo"]),
    flag() {
      return this.resultList.length
        ? this.resultList.findIndex(v=>v.flag) !== -1
          ? true
          : false
        : false;
    },
  },
  data() {
    return {
      resultList: [],
      passwordInfo: null,
    };
  },
  methods: {
    pageClose() {
      this.$emit("on-close");
    },
    async queryPasswordInfo() {
      this.resultList = [];
      this.passwordInfo = null;
      try {
        this.passwordInfo = await service.getPasswordDecryptionByRoundId({
          id: this.currentRoundId,
        });
        this.queryResult();
      } catch (e) {}
    },
    async queryResult() {
      try {
        let res = await service.getAllGuess({
          murderMysteryOnlineRecordId: this.gameInfo.id,
          passwordDecryptionItemId: this.passwordInfo.id,
        });
        this.resultList = res.passwordDecryptionItemList;
      } catch (e) {
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.password {
  width: 100vw;
  height: 84.11vh;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }
  &-content {
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    &-title {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36rpx;
      font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
      font-weight: 800;
      color: #ccbc91;
      line-height: 44rpx;
    }
    .close {
      @include hor-center-center;
      position: absolute;
      top: 0;
      right: 0;
      padding: 16px 20px;
    }
    &-note {
      position: absolute;
      top: 41px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
      line-height: 22px;
    }
    &-scroll {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 36px;
      top: 79px;
      background: #000;
      &-title {
        position: absolute;
        left: 16px;
        top: 24px;
        width: 58px;
        height: 16px;
        border: 1px solid #c1baaa;
        font-size: 12px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #c1baaa;
        @include hor-center-center;
      }
      &-note {
        position: absolute;
        right: 16px;
        top: 26px;
        font-size: 13px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 15px;
      }
      &-refresh {
        position: absolute;
        right: 10px;
        bottom: 50px;
        width: 24px;
        height: 36px;
        z-index: 1;
      }
      &-blur {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 46px;
        z-index: 1;
      }
      &-listBox {
        position: absolute;
        top: 17vw;
        left: 16px;
        right: 16px;
        bottom: 0px;
        &-item {
          position: relative;
          @include hor;
          margin-bottom: 20px;
          &-date {
            font-size: 13px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 22px;
            opacity: 0.6;
          }
          &-right {
            margin-left: 14px;
            @include ver;
            &-item {
              @include hor;
              align-items: center;
              span {
                font-size: 13px;
                font-family: PingFang SC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 22px;
                opacity: 0.6;
              }
            }

            &-content {
              @include hor;
              span {
                font-size: 13px;
                font-family: PingFang SC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 22px;
                opacity: 0.6;
              }
              &-list {
                @include ver;

                &-item {
                  @include hor;
                  align-items: center;
                }
              }
            }
            .success {
              color: #dccdaa;
              opacity: 1;
            }
            .fail {
              color: #fff;
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
// 滚动条样式
/deep/ ::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8rpx !important;
  height: 1px !important;
  overflow: auto !important;
  background: #ccc !important;
  -webkit-appearance: auto !important;
  display: block;
  margin-right: 20rpx !important;
}

/deep/ ::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  width: 8rpx !important;
  border-radius: 10px !important;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
  background: #615f56 !important;
}

/deep/ ::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  width: 2rpx !important;
  background: #373530 !important;
  border-radius: 20px !important;
}
</style>