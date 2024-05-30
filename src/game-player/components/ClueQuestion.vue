<template>
  <div class="question" v-if="visible">
    <view class="question__top">
      <image
        class="avatar"
        src="../static/clue/toolAvatar.png"
        alt=""
        mode="widthFix"
      />
      <div class="title">
        <image
          class="icon"
          src="../static/clue/toolIcon.png"
          alt=""
          mode="widthFix"
        />
        <div class="title-box">
          <div class="text" v-if="dataSource.type === 'vote'">
            {{ dataSource.title }}({{ voteType[dataSource.voteType] }})
          </div>
          <div class="text" v-else>
            {{ dataSource.question }}({{ typeData[dataSource.questionType] }})
          </div>
          <div class="audio" v-if="dataSource.url">
            <image
              :src="
                isPlaying ? '../static/play-now.png' : '../static/pause-now.png'
              "
              class="audio-icon"
              @click="getAudio()"
            />
            <div class="audio-content">
              <progress
                class="progress"
                :percent="playJd"
                stroke-width="3"
                activeColor="#4F4123"
                backgroundColor="#B09F7F"
              />
              <div class="audio-content-bottom">
                <span>{{ time }}</span>
                <span>{{ duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </view>
    <view class="question__content" v-if="dataSource.type === 'vote'">
      <div
        class="choice"
        v-if="dataSource.options && dataSource.options.length"
      >
        <div
          class="choice-card"
          v-for="v in dataSource.options"
          :key="v.id"
          @click="handleClick(v)"
        >
          <div
            class="choice-img"
            v-if="dataSource.optionIds && dataSource.optionIds.length"
          >
            <image
              v-if="
                dataSource.optionIds.includes(String(v.id)) &&
                dataSource.isAnswer
              "
              src="../static/clue/selectActive.png"
              alt=""
            />
            <image v-else src="../static/clue/select.png" alt="" />
          </div>
          <div class="choice-img" v-else>
            <image
              v-if="answerIds.includes(v.id)"
              src="../static/clue/selectActive.png"
              alt=""
            />
            <image v-else src="../static/clue/select.png" alt="" />
          </div>
          <div class="text">
            <span>{{ v.content }}</span>
          </div>
        </div>
      </div>
    </view>
    <view class="question__content" v-else>
      <div class="choice" v-if="dataSource.answerItemList.length">
        <div
          class="choice-card"
          v-for="v in dataSource.answerItemList"
          :key="v.id"
          @click="handleClick(v)"
        >
          <div class="choice-img">
            <image
              v-if="
                answerIds.includes(v.id) ||
                (dataSource.optionIds.includes(v.id) && dataSource.isAnswer)
              "
              src="../static/clue/selectActive.png"
              alt=""
            />
            <image v-else src="../static/clue/select.png" alt="" />
          </div>
          <div class="text">
            <span>{{ v.content }}</span>
          </div>
        </div>
      </div>
    </view>
    <view class="question__bottom" v-if="!dataSource.isAnswer">
      <span @click="handleSelect">确定选择</span>
    </view>
    <view class="popup" v-if="isCorrect">
      <div class="popup__content">
        <div class="title">回答正确！</div>
        <span>您收到新的线索</span>
        <span>请到私有页查收</span>
        <div class="bottom" @click="handleClose">关闭</div>
      </div>
    </view>
  </div>
</template>

<script>
import service from "@/services/game.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      answerIds: [],
      visible: false,
      typeData: {
        ONCE: "单选题",
        MULTIPLE: "多选题",
      },
      voteType: {
        SINGLE: "单选题",
        MULTIPLE: "多选题",
      },
      stashData: {},
      isCorrect: false,
      isPlaying: false,
      isStop: true,
      duration: "00:00",
      time: "00:00",
      playJd: 0,
      innerAudioContext: null,
    };
  },
  props: {
    dataSource: {
      type: Object,
      default: {},
    },
  },
  watch: {
    "dataSource.id": {
      handler(newValue, oldValue) {
        console.log("dataSource.id", newValue);
        this.answerIds = [];
        (this.stashData = {}), (this.isCorrect = false);
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("player", ["options", "userInfo"]),
  },
  components: {},
  mounted() {
    this.createAudioContextThread();
  },
  methods: {
    handleClick(v) {
      if (this.dataSource.isAnswer) return;
      this.stashData = v;
      // if(this.dataSource.type === 'vote') {
      // 	if(this.dataSource.voteType === 'SINGLE') {
      //    this.answerIds = [v.id]
      // 	} else {
      // 		let index = this.answerIds.findIndex(item=>item === v.id );
      // 		if(index != -1) {
      // 			this.answerIds.splice(index,1)
      // 		} else {
      //       this.answerIds = [...this.answerIds, v.id]
      // 		}
      // 	}
      // }
      if (
        this.dataSource.questionType === "ONCE" ||
        this.dataSource.voteType === "SINGLE"
      ) {
        this.answerIds = [v.id];
      } else {
        let index = this.answerIds.findIndex((item) => item === v.id);
        if (index != -1) {
          this.answerIds.splice(index, 1);
        } else {
          this.answerIds = [...this.answerIds, v.id];
        }
      }
    },
    close() {
      this.audioDestroy();
      this.visible = false;
    },
    open() {
      this.visible = true;
    },
    handleSelect() {
      if (!this.answerIds.length) {
        uni.showToast({
          title: "请选择后再提交！",
          icon: "none",
        });
        return;
      }
      if (this.dataSource.type === "vote") {
        this.postVote();
      } else {
        if (this.stashData.isTrue) {
          this.isCorrect = true;
          this.answerQuestion();
        } else {
          uni.showModal({
            title: "回答错误!",
            showCancel: false,
            confirmText: "取消",
          });
          this.answerQuestion();
        }
      }
      this.handleClose();
    },
    handleClose() {
      this.$emit("handleClose");
      this.answerIds = [];
      this.isCorrect = false;
    },
    async answerQuestion() {
      if (!this.answerIds.length) {
        uni.showToast({
          title: "请选择后再提交！",
          icon: "none",
        });
        return;
      }
      await service.answerQuestion({
        murderMysteryOnlineRecordId: Number(this.options.id),
        questionId: this.dataSource.id,
        userId: this.userInfo.id,
        answerIds: this.answerIds,
      });
    },
    async postVote() {
      if (!this.answerIds.length) {
        uni.showToast({
          title: "请选择后再提交！",
          icon: "none",
        });
        return;
      }
      await service.postVote({
        murderMysteryOnlineRecordId: Number(this.options.id),
        voteId: this.dataSource.id,
        userId: this.userInfo.id,
        voteOptionIds: this.answerIds,
      });
      uni.showModal({
        title: "已经成功提交!",
        showCancel: false,
        confirmText: "取消",
      });
    },
    getAudio() {
      //播放
      if (!this.isPlaying) {
        if(this.playJd === 0){
          uni.showLoading({
            title: "音频加载中~",
          });
          this.innerAudioContext.title = "";
          this.innerAudioContext.src = this.dataSource.url;
        }
        this.innerAudioContext.play();
      } else {
        //暂停
        this.innerAudioContext.pause();
        this.isPlaying = false;
      }
    },
    //初始化播放器(线索)
    createAudioContextThread() {
      this.innerAudioContext = wx.createInnerAudioContext();
      //开始播放
      let that = this;
      this.innerAudioContext.onCanplay(() => {
        that.isPlaying = true;
        that.innerAudioContext.duration;
        that.$nextTick(() => {
          setTimeout(() => {
            var time = that.innerAudioContext.duration.toFixed(0);
            var min = Math.floor(time / 60);
            var second = time % 60;
            that.duration =
              (min >= 10 ? min : "0" + min) +
              ":" +
              (second >= 10 ? second : "0" + second);
            uni.hideLoading();
          }, 500);
        });
      });
      this.innerAudioContext.onPlay(() => {
        that.isPlaying = true;
        that.isStop = false;
      });
      // 暂停状态
      this.innerAudioContext.onPause(() => {
        that.isPlaying = false;
        that.isStop = true;
      });
      this.innerAudioContext.onStop(() => {
        that.playJd = 0;
        that.time = "00:00";
        that.isPlaying = false;
      });
      //监听播放时间 及 计算播放进度
      this.innerAudioContext.onTimeUpdate(() => {
        //播放时间
        setTimeout(() => {
          if (that.innerAudioContext && that.isPlaying) {
            var time = that.innerAudioContext.currentTime.toFixed(0);
            var duration = that.innerAudioContext.duration
              ? that.innerAudioContext.duration.toFixed(0)
              : "";
            var min = Math.floor(time / 60);
            var second = time % 60;
            that.time =
              (min >= 10 ? min : "0" + min) +
              ":" +
              (second >= 10 ? second : "0" + second);
            //计算进度
            that.playJd = (time / duration) * 100;
          }
        }, 200);
      });
      // 继续播放seek完成
      this.innerAudioContext.onSeeked(() => {
        that.innerAudioContext.play();
        that.isPlaying = true;
      });
      //自然播放结束
      this.innerAudioContext.onEnded(() => {
        that.playJd = 0;
        that.time = "00:00";
        if (that.dataSource.questionType === "LOOP") {
          that.innerAudioContext.src = that.dataSource.url;
          that.innerAudioContext.title = "";
          that.innerAudioContext.play();
        } else {
          that.isPlaying = false;
          that.isStop = true;
        }
      });
      //音频错误
      this.innerAudioContext.onError((res) => {
        that.isPlaying = false;
      });
    },
    //卸载页面
    audioDestroy() {
	    this.clear();
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    },
    clear() {
      this.time = "00:00";
      this.duration = "00:00";
      this.isPlaying = false;
      this.playJd = 0;
    },
  },
};
</script>

<style scoped lang="scss">
.question {
  max-height: 80vh;
  overflow-y: scroll;
  &__top {
    display: flex;
    align-items: center;
    .avatar {
      width: 50px;
      margin-right: 34px;
    }
    .title {
      padding: 4px;
      background: linear-gradient(180deg, #e6d9bf 0%, #d3c098 100%);
      border-radius: 4px;
      position: relative;
      .icon {
        width: 14px;
        position: absolute;
        bottom: 0;
        left: -14px;
      }
      &-box{
        padding: 8px 12px;
        border: 1px dashed #4F4123;
        padding: 4px;
        border-radius: 4px;
      }
      .text {
        font-family: "Source Han Serif CN";
        font-style: normal;
        font-weight: 900;
        font-size: 12px;
        line-height: 17px;
        color: #4f4123;
        width: 43.4vw;
        border-radius: 4px;
      }
      .audio {
        @include hor;
        align-items: center;
        margin-top: 10px;
        padding-bottom: 16px;
        &-icon {
          width: 32px;
          height: 32px;
          margin-left: 42px;
        }
        &-content {
          @include ver;
          flex: 1;
          margin-left: 20px;
          .progress {
            width: 80%;
            margin-top: 10px;
          }
          &-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80%;
            margin-top: 4px;
            span {
              font-size: 9px;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #4f4123;
            }
          }
        }
      }
    }
  }
  &__content {
    margin-top: 30px;
    // height: 43vh;
    overflow-y: scroll;
    .choice {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .choice-card {
        position: relative;
        margin-bottom: 15px;
        .choice-img {
          height: 37px;
          width: 29vw;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          padding: 0 14px;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          color: #c1baaa;
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            width: 100%;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
          }
        }
      }
    }
  }
  &__bottom {
    margin-top: 27px;
    text-align: right;
    span {
      font-family: "Source Han Serif CN";
      font-style: normal;
      font-weight: 900;
      font-size: 13px;
      color: rgba(204, 188, 145, 0.9);
      padding: 4px 12px;
      background: rgba(204, 188, 145, 0.2);
      border: 1px solid rgba(204, 188, 145, 0.4);
    }
  }
  .popup {
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    z-index: 3;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    text-align: center;
    &__content {
      font-family: "PingFang SC";
      font-style: normal;
      margin-top: 56px;
      .title {
        color: #feeaa8;
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 6px;
      }
      span {
        font-weight: 400;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
      .bottom {
        font-weight: 700;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 50px;
      }
    }
  }
}
</style>
