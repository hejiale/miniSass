<template>
  <div
    class="passwordBox"
    :style="{ 'background-image': `url(${dramaItem.backgroundUrl})` }"
  >
    <image class="passwordBox-bg" />
    <span class="passwordBox-title">{{ passwordInfo.title }}</span>
    <div
      class="passwordBox-inputBox"
      v-if="inputNum === 4"
      @click="onShowKeyboard"
      :style="{
        'background-image': `url(${$iconFont.getIconName('password-border')})`,
      }"
    >
      <div
        class="passwordBox-inputBox-border"
        v-for="idx in inputNum"
        :key="idx"
        :style="[
          { 'margin-right': idx === inputNum - 1 ? '0px' : '' },
          {
            'background-image': `url(${$iconFont.getIconName('input-border')})`,
          },
        ]"
      >
        {{ password[idx] || "" }}
      </div>
    </div>
    <div
      class="passwordBox-inputBox"
      v-else
      :style="{
        'background-image': `url(${$iconFont.getIconName('password-border')})`,
      }"
      @click="onShowKeyboard"
    >
      <div
        class="passwordBox-inputBox-moreBorder"
        v-for="idx in inputNum"
        :key="idx"
        :style="[
          { 'margin-right': idx === inputNum - 1 ? '0px' : '5px' },
          { width: `${borderWidth}px` },
          {
            'background-image': `url(${$iconFont.getIconName('input-border')})`,
          },
        ]"
      >
        {{ password[idx] || "" }}
      </div>
    </div>
    <div>
      <image src="../static/icon-help.png" class="passwordBox-tag" />
      <span class="passwordBox-helpTitle">解谜助手：</span>
      <scroll-view class="passwordBox-answerBox" scroll-y>
        <div
          class="passwordBox-answerBox-item"
          v-for="(item, idx) in resultList"
          :key="idx"
        >
          <span class="passwordBox-answerBox-item-date">{{
            $dayjs(item.currentTime).format("HH:mm:ss")
          }}</span>
          <div class="passwordBox-answerBox-item-right" v-if="item.isLoading">
            <div class="passwordBox-answerBox-item-right-item">
              <span>解谜计算中...</span>
            </div>
          </div>
          <div class="passwordBox-answerBox-item-right" v-else>
            <div class="passwordBox-answerBox-item-right-item">
              <span>输入密码：</span>
              <span
                :class="idx === 0 ? (item.flag ? 'success' : 'fail') : ''"
                >{{ item.password }}</span
              >
            </div>
            <div class="passwordBox-answerBox-item-right-item">
              <span>结果判定：</span>
              <span
                :class="idx === 0 ? (item.flag ? 'success' : 'fail') : ''"
                >{{ item.flag ? "解锁成功" : "密码错误" }}</span
              >
            </div>
            <div
              class="passwordBox-answerBox-item-right-content"
              v-if="!item.flag && passwordInfo.isHelper"
            >
              <span class="fenxi">输入分析：</span>
              <div class="passwordBox-answerBox-item-right-content-list">
                <div class="passwordBox-answerBox-item-right-content-list-item">
                  <span>内容与位置都正确</span>
                  <span :class="idx === 0 ? 'fail ml4':'ml4'">{{ `${item.trueNumber}位` }}</span>
                </div>
                <div class="passwordBox-answerBox-item-right-content-list-item">
                  <span>内容正确位置不正确</span>
                  <span :class="idx === 0 ? 'fail ml4':'ml4'">{{
                    `${item.truePositionNumber}位`
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="passwordBox-answerBox-item" v-if="!resultList.length">
          <span class="passwordBox-answerBox-item-date">等待您输入…</span>
        </div>
      </scroll-view>
    </div>
    <van-action-sheet
      :show="showKeyboard"
      z-index="2000"
      @click-overlay="hide"
      :round="false"
      :safe-area-inset-bottom="false"
    >
      <div class="keyboardBox">
        <div class="keyboardBox-topBox">
          <div class="keyboardBox-topBox-numBox">
            {{ value }}
          </div>
          <span class="keyboardBox-topBox-sure" @click="onComplete">确认</span>
        </div>
        <div class="keyboardBox-numBox">
          <div @click="onPoint('1')">1</div>
          <div @click="onPoint('2')">2</div>
          <div @click="onPoint('3')">3</div>
        </div>
        <div class="keyboardBox-numBox">
          <div @click="onPoint('4')">4</div>
          <div @click="onPoint('5')">5</div>
          <div @click="onPoint('6')">6</div>
        </div>
        <div class="keyboardBox-numBox">
          <div @click="onPoint('7')">7</div>
          <div @click="onPoint('8')">8</div>
          <div @click="onPoint('9')">9</div>
        </div>
        <div class="keyboardBox-bottom">
          <div></div>
          <div @click="onPoint('0')">0</div>
          <div @click="onDel">
            <image src="../static/keyboard-del.png" />
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import service from "@/services/game";
import { mapState } from "vuex";
export default {
  data() {
    return {
      inputNum: 0,
      borderWidth: 0,
      password: [],
      value: "",
      resultList: [],
      showKeyboard: false,
    };
  },
  created() {
    this.inputNum = this.passwordInfo.password.length;
    this.borderWidth = (327 - 38 - (this.inputNum - 1) * 5) / this.inputNum;
    this.queryResult();
  },
  computed: {
    ...mapState("player", [
      "userInfo",
      "dramaItem",
      "passwordInfo",
      "userRole",
      "murderMysteryOnlineRecordId",
    ]),
  },
  methods: {
    onShowKeyboard() {
      this.showKeyboard = true;
      this.$emit("showKeyboard");
    },
    onPoint(key) {
      if (this.value.length === this.inputNum) return;

      this.value += key;
      this.password = this.value.split("");
    },
    onDel() {
      if (!this.value.length) return;

      this.value = this.value.substring(0, this.value.length - 1);
    },
    async onSure() {
      try {
        let res = await service.addOneGuess({
          murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
          passwordDecryptionItemId: this.passwordInfo.id,
          userId: this.userInfo.id,
          password: this.password.join(""),
          roleName: this.userRole.roleName,
        });
        if (res.flag) {
          this.password = [];
          this.resultList = [];
          this.$emit("on-success");
        } else {
          this.password = [];
          this.value = "";
          this.queryResult();
        }
      } catch (e) {}
    },
    async queryResult() {
      try {
        let res = await service.getAllGuess({
          murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
          passwordDecryptionItemId: this.passwordInfo.id,
          userId: this.userInfo.id,
        });
        this.resultList = res.passwordDecryptionItemList;
      } catch (e) {}
    },
    hide() {
      this.showKeyboard = false;
      this.$emit("showKeyboard");
    },
    onComplete() {
      if (this.password.length < this.inputNum) {
        return wx.showToast({
          title: `请输入${this.inputNum}位密码`,
          icon: "none",
        });
      }

      this.hide();
      this.resultList.unshift({
        currentTime: new Date(),
        isLoading: true,
      });

      let that = this;
      setTimeout(() => {
        that.onSure();
      }, 2000);
    },
  },
};
</script>
<style lang="scss" scoped>
.passwordBox {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: -1;
  &-bg {
    @include abscenter;
    background: rgba($color: #000000, $alpha: 0.9);
  }
  &-title {
    position: absolute;
    top: 19.7vh;
    right: 14.2vw;
    font-size: 16px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    width: 327px;
    text-align: center;
  }
  &-note {
    position: absolute;
    top: 25.6vh;
    right: 14.2vw;
    font-size: 14px;
    width: 327px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    opacity: 0.6;
    text-align: center;
  }
  &-inputBox {
    position: absolute;
    right: 14.2vw;
    top: 34vh;
    width: 327px;
    height: 153px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    @include hor-center-center;
    &-border {
      width: 57px;
      height: 87px;
      margin-right: 14px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @include hor-center-center;
      font-size: 64px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2b3030;
      text-shadow: 0px 1px 2px #000000;
    }
    &-moreBorder {
      height: 89px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @include hor-center-center;
      font-size: 64px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2b3030;
      text-shadow: 0px 1px 2px #000000;
    }
  }
  &-tag {
    position: absolute;
    left: 60px;
    top: 18vh;
    width: 30px;
    height: 30px;
  }
  &-helpTitle {
    position: absolute;
    left: 96px;
    top: 19vh;
    font-size: 15px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
  }
  &-answerBox {
    position: absolute;
    left: 60px;
    top: 30vh;
    width: 37vw;
    bottom: 20px;
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
          .fenxi {
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
              span {
                font-size: 13px;
                font-family: PingFang SC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 22px;
                opacity: 0.6;
              }
            }
          }
        }
        .success {
          color: #dccdaa;
          opacity: 1;
        }
        .fail {
          color: #dd6464;
          opacity: 1;
        }
      }
    }
  }
}
.keyboardBox {
  height: 60vh;
  background: #c8cfd7;
  @include ver;
  align-items: center;
  &-topBox {
    width: 100%;
    height: 12vh;
    background: #bebfc3;
    @include hor;
    align-items: center;
    &-numBox {
      margin-left: 8vw;
      width: 80vw;
      height: 10vh;
      background: #fff;
      border-radius: 5px;
      padding-left: 10px;
    }
    &-sure {
      margin-left: 10px;
      font-size: 16px;
      color: #3681eb;
      font-weight: 600;
    }
  }
  &-numBox {
    @include hor;
    align-items: center;
    margin-top: 5px;
    div {
      width: 30vw;
      height: 9vh;
      background: #fff;
      border-radius: 5px;
      @include hor-center-center;
    }
    div:nth-child(1),
    div:nth-child(2) {
      margin-right: 5px;
    }
  }
  &-bottom {
    @include hor;
    align-items: center;
    margin-top: 5px;
    div:nth-child(1) {
      margin-right: 5px;
      width: 30vw;
      height: 9vh;
    }
    div:nth-child(2) {
      width: 30vw;
      height: 9vh;
      background: #fff;
      border-radius: 5px;
      margin-right: 5px;
      @include hor-center-center;
    }
    div:nth-child(3) {
      @include hor-center-center;
      width: 30vw;
      height: 9vh;
      image {
        width: 30px;
        height: 28px;
      }
    }
  }
}
</style>