<template>
  <div class="bout">
    <div class="card" v-for="(v, i) in roundList" :key="v.id">
      <image src="../static/icon-opening.png" class="card-tag" v-if="v.status == '0'"/>
      <div class="left" :class="v.status == '1' ? 'endText' : ''">
        {{ v.roundName }}
      </div>
      <template
        v-if="hasNow ? i < roundActionIndex + 2 : i < roundActionIndex + 1"
      >
        <div class="btn" @click="openOverlay(v)" v-if="v.status == '-1'">
          <div class="btn-border">
            <div class="btn-border-bg">
              <div>开启回合</div>
            </div>
          </div>
        </div>
        <div class="btn" @click="onDetail(v)" v-else-if="v.status == '0'">
          <div class="btn-border">
            <div class="btn-border-bg">
              <div>查看详情</div>
            </div>
          </div>
        </div>
        <div v-else class="endBtn">已结束</div>
      </template>
    </div>
    <div class="tip" v-if="overlay">
      <div class="tip-overlay"></div>
      <div class="tip-box">
        <div class="tip-box-title">确认开启该回合?</div>
        <div class="tip-box-round1">
          回合间隔不得小于30s
        </div>
        <div class="tip-box-round">
          {{ chooseRound.roundName }}
        </div>
        <div class="tip-box-btn btn">
          <div class="cancel" @click="overlay = false">取消</div>
          <div class="btn-border" @click="openBout">
            <div class="btn-border-bg">
              <div>开启</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet
      :show="showPassword"
      :safe-area-inset-bottom="false"
      z-index="10"
      :round="false"
      @click-overlay="showPassword = false"
    >
      <password ref="password" :currentRoundId="chooseRound.id" @on-close="showPassword = false"/>
    </van-action-sheet>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import service from "@/services/game.js";
import password from './password.vue'

export default {
  data() {
    return {
      roundPopup: false,
      chooseRound: null,
      overlay: false,
      showPassword: false
    };
  },
  computed: {
    ...mapState("dm", ["roundList", "gameInfo", "roundActionIndex"]),
    hasNow() {
      let now = false;
      this.roundList.map((v) => {
        if (v.status == "0") {
          now = true;
        }
      });
      return now;
    },
  },
  components: {password},
  onLoad() {},
  created() {
  },
  methods: {
    ...mapActions("dm", ["getRoundInfo", "getRolePlayers"]),
    ...mapMutations("dm", ["setCurrentRoundId"]),

    open() {
      this.roundPopup = true;
    },
    openOverlay(v) {
      this.chooseRound = v;
      this.overlay = true;
    },
    onDetail(v){
      this.chooseRound = v;
      if(v.roundType !== 'PASSWORD_DECRYPTION'){
        this.$emit('on-clue', v)
      }else{
        this.showPassword = true;
        this.$nextTick(_=>{
          this.$refs.password.queryPasswordInfo();
        })
      }
    },
    openBout() {
      this.startNextRound(this.chooseRound.id);
      this.getRolePlayers();
      this.$emit("stopAudio");
    },
    // 开始游戏
    async startNextRound(roundId) {
      this.overlay = false;
      uni.showLoading();
      try {
        await service.startNextRound({
          murderMysteryOnlineRecordId: this.gameInfo.id,
          roundId,
        });
        this.setCurrentRoundId(roundId)
        this.getRoundInfo();
        uni.showToast({
          title: "开启成功",
        });
        uni.hideLoading();
      } catch (e) {
        uni.showToast({
          title: "开启失败",
          icon: 'none'
        });
        uni.hideLoading();
      }
    },
    queryPasswordResult(){
      this.$refs.password.queryResult();
    }
  },
};
</script>

<style scoped lang="scss">
.bout {
  max-height: 72vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  padding-top: 30px;
  .card {
    padding: 22px 17px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 110%;
    color: #ccbc91;
    background: rgba(0, 0, 0, 0.4);
    margin-bottom: 16px;
    position: relative;
    span {
      display: inline-block;
      color: rgba(204, 188, 145, 0.9);
      font-weight: 900;
      font-size: 13px;
      padding: 3px 11px;
    }
    .left {
      max-width: 55vw;
      line-height: 52rpx;
      @include text-overflow-line(1);
    }
    .endText {
      font-size: 26rpx;
      font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
      font-weight: 800;
      color: #675e47;
    }
    .endBtn {
      box-sizing: border-box;
      width: 160rpx;
      height: 52rpx;
      color: #675e47;
      border: 2rpx solid #ccbc91;
      line-height: 48rpx;
      text-align: center;
    }
    .detailBtn{
      position: absolute;
      right: 16px;
      width: 80px;
      height: 26px;
    }
    &-tag{
      position: absolute;
      left: 0;
      top: 0;
      width: 44px;
      height: 17px;
    }
  }
  .tip {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    &-overlay {
      width: 100%;
      height: 100%;
    }
    &-box {
      position: absolute;
      top: 33.5vh;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 75vw;
      padding: 32rpx 38rpx 38rpx;
      background: #211f19;
      border: 2rpx solid;
      border-image: linear-gradient(
          180deg,
          rgba(142, 131, 101, 1),
          rgba(82, 76, 59, 1)
        )
        2 2;
      &-title {
        font-size: 32rpx;
        font-family: Source Han Serif CN-SemiBold, Source Han Serif CN;
        font-weight: 600;
        color: #ccbc91;
        line-height: 38rpx;
      }
      &-round {
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #c1baaa;
        line-height: 28rpx;
        margin: 18rpx 0 66rpx;
        @include text-overflow-line(2);
      }
      &-round1 {
        font-size: 28rpx;
        font-weight: 500;
        color: #c1baaa;
        font-family: PingFang SC-Regular, PingFang SC;
        line-height: 28rpx;
        margin-top:18rpx;
      }
      &-btn {
        display: flex;
        align-items: center;
        .cancel {
          margin-right: 80rpx;
        }
      }
    }
  }

  .btn {
    display: flex;
    justify-content: space-evenly;
    &-border {
      box-sizing: border-box;
      width: 160rpx;
      height: 52rpx;
      padding: 2rpx;
      border: 2rpx solid #ccbc91;
      &-bg {
        background: linear-gradient(
          180deg,
          rgba(204, 188, 145, 0) 0%,
          rgba(204, 188, 145, 0.2) 100%
        );
        div {
          font-size: 26rpx;
          font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
          font-weight: 800;
          color: #ccbc91;
          line-height: 44rpx;
          text-align: center;
        }
      }
      &-send {
        background: linear-gradient(
          180deg,
          rgba(204, 188, 145, 0) 0%,
          rgba(204, 188, 145, 0.6) 100%
        );
        div {
          color: #f3e6c1;
        }
      }
    }
    .cancel {
      box-sizing: border-box;
      width: 160rpx;
      height: 52rpx;
      font-size: 26rpx;
      font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
      font-weight: 800;
      color: #ccbc91;
      border: 2rpx solid #ccbc91;
      line-height: 48rpx;
      text-align: center;
    }
  }
}
</style>
