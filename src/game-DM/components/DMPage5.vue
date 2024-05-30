<template>
  <view style="height: 65vh" v-if="current == 5">
    <div class="musicLibrary" v-if="audioList && audioList.length">
      <div
        class="box"
        v-for="item in audioList"
        :key="item.id"
        @click="getCurrentAudio(item)"
      >
        <div class="box-current" v-if="currentAudio.id == item.id"></div>
        <div class="box-left">
          <image :src="$iconFont.getIconName('lib-cd')" />
        </div>
        <div class="box-right">
          <image
            :src="
              currentAudio.id == item.id && isPlaying
                ? '../static/play-now.png'
                : currentAudio.id == item.id && !isPlaying
                ? '../static/pause-now.png'
                : '../static/pause.png'  
            "
            class="box-right-icon"
            @click="getAudio(item)"
          />
          <div class="box-right-content">
            <div class="box-right-content-top">
              <span>{{ item.audioName }}</span>
              <span>{{ $enums.PlayType.getName(item.playType) }}</span>
            </div>
            <div class="box-right-content-bottom">
              <span
                style="margin-right: 20rpx"
                v-if="currentAudio.id == item.id"
                >{{ time }}</span
              >
              <progress
                class="progress"
                :percent="playJd"
                stroke-width="3"
                activeColor="#F7C33F"
                backgroundColor="#666666"
                v-if="currentAudio.id == item.id"
              />
              <progress
                class="progress"
                stroke-width="3"
                activeColor="#F7C33F"
                backgroundColor="#666666"
                v-else
              />
              <span
                style="margin-left: 20rpx"
                v-if="currentAudio.id == item.id"
                >{{ duration }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      <image src="../static/empty-audio.png" mode="widthFix" />
    </div>
    <!-- <image
      class="thread-detail-content-audio-play-icon"
      src="/static/image/audio-thread/icon-audio.png"
    />
    <div class="thread-detail-content-audio-play-itemBox">
      <image
        src="/static/image/audio-thread/icon-pause.png"
        class="thread-detail-content-audio-play-itemBox-play"
        @click="getAudio(currentThreadDetail)"
        v-if="isPlaying"
      />
      <image
        src="/static/image/audio-thread/icon-play.png"
        class="thread-detail-content-audio-play-itemBox-play"
        @click="getAudio(currentThreadDetail)"
        v-else
      />
      <div class="thread-detail-content-audio-play-itemBox-progressBar">
        <div class="thread-detail-content-audio-play-itemBox-progressBar-top">
          <span>{{ currentThreadDetail.clueName }}</span>
        </div>
        <view
          class="thread-detail-content-audio-play-itemBox-progressBar-progressBox"
        >
          <span style="margin-right: 30rpx;">{{ time }}</span>
          <slider
            :value="playJd"
            stroke-width="2"
            selected-color="#D07E03"
            backgroundColor="#666666"
            block-size="12"
            @change="sliderChange"
            class="slider"
          />
          <span style="margin-left: 30rpx;">{{ duration }}</span>
        </view>
      </div>
    </div> -->
  </view>
</template>

<script>
import { mapState } from "vuex";
import service from "@/services/game.js";
export default {
  props: {
    current: {
      type: Number,
    },
  },
  data() {
    return {
      isPlaying: false,
      isStop: true,
      duration: "00:00",
      time: "00:00",
      playJd: 0,
      activeIndex: -1,
      innerAudioContext: null,
      audioInfo: {},
      audioList: [],
      currentAudio: null,
    };
  },
  mounted() {
    this.createAudioContextThread();
  },
  beforeDestroy() {
    this.audioDestroy();
  },
  computed: {
    ...mapState("dm", [
      "murderMysteryOnlineRecordId",
      "roundActionIndex",
      "roundList",
    ]),
  },
  watch: {
    // audioInfo: {
    //   handler(newVal, oldVal) {
    //     console.log(newVal, oldVal);
    //     if (newVal.id != oldVal.id) {
    //       if (this.isPlaying) {
    //         this.innerAudioContext.stop();
    //         this.playJd = 0;
    //         this.duration = "00:00";
    //         this.time = "00:00";
    //       }
    //       //切换源
    //       uni.showLoading({
    //         title: "加载中",
    //       });
    //       this.innerAudioContext.src = this.audioInfo.contentClue;
    //       this.innerAudioContext.title = this.audioInfo.clueName;
    //       this.innerAudioContext.play();
    //     }
    //   },
    // },
  },
  methods: {
    async queryList() {
      this.audioList = await service.getRoundAudioList({
        ...this.murderMysteryOnlineRecordId,
        roundId: this.roundList[this.roundActionIndex].id,
      });
    },
    getCurrentAudio(item) {
      this.currentAudio = item;
    },
    clear() {
      this.playJd = 0;
      this.time = "00:00";
      this.duration = "00:00";
    },
    getAudio(audio) {
      if (this.currentAudio) {
        if (this.currentAudio.id == audio.id) {
          //播放
          if (!this.isPlaying) {
            uni.showLoading({
              title: "音频加载中~",
            });
            this.innerAudioContext.title = this.currentAudio.audioName;
            this.innerAudioContext.src = this.currentAudio.audioAddress;
            this.innerAudioContext.play();
            this.isPlaying = true;
            uni.hideLoading();
          } else {
            //暂停
            this.innerAudioContext.pause();
            this.isPlaying = false;
          }
        } else {
          uni.showLoading({
            title: "音频加载中~",
          });
          this.clear();
          this.currentAudio = audio;
          this.innerAudioContext.title = this.currentAudio.audioName;
          this.innerAudioContext.src = this.currentAudio.audioAddress;
          this.innerAudioContext.play();
          this.isPlaying = true;
          uni.hideLoading();
        }
      } else {
        uni.showLoading({
          title: "音频加载中~",
        });
        this.clear();
        this.currentAudio = audio;
        this.innerAudioContext.title = this.currentAudio.audioName;
        this.innerAudioContext.src = this.currentAudio.audioAddress;
        this.innerAudioContext.play();
        this.isPlaying = true;
        uni.hideLoading();
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
        that.isPlaying = false;
      });
      //监听播放时间 及 计算播放进度
      this.innerAudioContext.onTimeUpdate(() => {
        //播放时间
        setTimeout(() => {
          if (that.innerAudioContext) {
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
        if (that.currentAudio.playType === "LOOP") {
          that.innerAudioContext.src = that.currentAudio.audioAddress;
          that.innerAudioContext.title = that.currentAudio.audioName;
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
    //音频拖动
    sliderChange(e) {
      this.playJd = e.detail.value;
      var duration = this.innerAudioContext.duration;
      let time = parseInt((e.detail.value * duration) / 100);
      this.innerAudioContext.seek(time);
    },
    //卸载页面
    audioDestroy() {
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    },
    audioChange() {
      this.innerAudioContext.pause();
      // this.innerAudioContext.stop();
      // this.innerAudioContext = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.musicLibrary {
  height: 100%;
  box-sizing: border-box;
  padding-right: 22rpx;
  padding-left: 4vw;
  overflow-y: auto;
  .box {
    padding: 40rpx 34rpx 16rpx 122rpx;
    background: rgba(0, 0, 0, 0.4);
    margin: 0 20rpx 50rpx 64rpx;
    position: relative;
    &-current {
      width: 10rpx;
      height: 134rpx;
      background: #ffc530;
      border-radius: 0 16rpx 16rpx 0;
      position: absolute;
      left: -64rpx;
      top: 50%;
      transform: translate(-4vw, -50%);
    }
    &-left {
      width: 178rpx;
      height: 156rpx;
      position: absolute;
      left: -64rpx;
      top: 50%;
      transform: translateY(-50%);
    }
    &-right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-icon {
        width: 52rpx;
        height: 52rpx;
        margin-right: 32rpx;
      }
      &-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        &-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          :nth-child(1) {
            font-size: 28rpx;
            font-family: Source Han Serif CN-SemiBold, Source Han Serif CN;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            line-height: 28rpx;
          }
          :nth-child(2) {
            font-size: 22rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 28rpx;
          }
        }
        &-bottom {
          height: 34rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16rpx;
          .progress {
            flex: 1;
            margin: 0;
          }
          span {
            font-size: 24rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #ccbc91;
            line-height: 28rpx;
          }
        }
      }
    }
  }
  .box:first-child {
    margin-top: 20rpx;
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
  }

  /deep/ ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    width: 8rpx !important;
    border-radius: 10px !important;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
    background: #e3e1d7 !important;
  }

  /deep/ ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    width: 2rpx !important;
    height: 80% !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 20px !important;
  }
}
.audioImg {
  width: 30px;
  height: 30px;
}
.empty{
  position: fixed;
  left: 0;
  right: 0;
  top: 20vh;
  @include hor-center-center;
  image{
    width: 44vw;
  }
}
</style>
