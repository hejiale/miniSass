<template>
 <div class="phone"  :style="{backgroundImage:'url(' +phoneData.avatar+ ')'}">
   <view class="mask"></view>
	 <view class="content">
		 <div class="time">
			 <span>{{time}}</span>
			</div>
		 <div class="avatar">
			 <image
				:src="phoneData.avatar"
			 />
			 <div class="name">{{phoneData.nickName}}</div>
		 </div>
     <div class="callText" v-if="status === 0">
			 邀请你语音通话...
		 </div>
		 <div class="bottom">
			<template v-if="status === 0">
				<image
          @click="getAudio(phoneData.url)"
					src="../static/answer.png"
					mode="widthFix"
				/>
				<span>接听</span>
			</template>
			<template v-else-if="status === 1">
				<image
				  @click="closeCall"
					src="../static/hangUp.png"
					mode="widthFix"
				/>
				<span>挂断</span>
			</template>
		 </div>
	 </view>
 </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
 data() {
	return {
    isPlaying: false,
		isStop: true,
		duration: "00:00",
		time: "00:00",
		innerAudioContext: null,
		currentAudio: null,
		status: 0
	}
 },
 computed: {
    ...mapState('dm',[
			'userInfo', 
			'murderMysteryOnlineRecordId',
			'phoneData'
		]),
 },
 components: {

 },
 created() {
   this.createAudioContextThread();
  },
 beforeDestroy() {
	 this.audioDestroy();
 },
 methods: {
	clear() {
      this.time = "00:00";
      this.duration = "00:00";
   },
	 getAudio() {
		  this.status = 1
				//播放
				if (!this.isPlaying) {
					this.innerAudioContext.title = this.phoneData.nickName;
					this.innerAudioContext.src = this.phoneData.url;
					this.innerAudioContext.play();
					this.isPlaying = true;
				} else {
					//暂停
					this.innerAudioContext.pause();
					this.isPlaying = false;
				}
				// this.clear();
				// this.currentAudio = audio;
				// this.innerAudioContext.title = this.currentAudio.audioName;
				// this.innerAudioContext.src = this.currentAudio.audioAddress;
				// this.innerAudioContext.play();
				// this.isPlaying = true;
    
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
        that.time = "00:00";
				that.isPlaying = false;
				that.isStop = true;
      });
      //音频错误
      this.innerAudioContext.onError((res) => {
        that.isPlaying = false;
      });
    },
    //卸载页面
    audioDestroy() {
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    },
		closeCall() {
      uni.navigateBack();
			this.audioDestroy()
		}
 }
}
</script>

<style scoped lang="scss">
.phone {
	height: 100vh;
	width: 100vw;
	box-sizing: border-box;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	background-color: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(10px);
	.mask {
		position: absolute;
		background: #000000;
    opacity: 0.8; 
		width: 100%;
		height: 100%;
		z-index: 1;
		left: 0;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}
	.content {
		font-family: 'PingFang SC';
		font-style: normal;
		color: #FFFFFF;
		text-align: center;
		position: relative;
		z-index: 2;
		padding-top: 8.6vh;
		.time {
			font-weight: 500;
			font-size: 16px;
			line-height: 22px;
			height: 22px;
		}
		.avatar {
			margin-top: 16.5vh;
			image {
				border-radius: 8px;
				width: 96px;
				height: 96px; 
			}
			.name {
				font-weight: 400;
				font-size: 22px;
				line-height: 31px;
				margin-top: 14px;
			}
		}
		.callText {
			font-weight: 400;
			font-size: 16px;
			line-height: 22px;
			color: rgba(255, 255, 255, 0.6);
			margin-top: 11.6vh;
		}
		.bottom {
			position: fixed;
			left: 50%;
			bottom: 11vh;
			transform: translateX(-50%);
			image {
				width: 72px;
				border: 50%;
			}
			span {
				font-weight: 400;
				font-size: 15px;
				line-height: 21px;
				margin-top: 9px;
				display: block;
			}
		}
	}
}
</style>
