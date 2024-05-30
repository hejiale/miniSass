<template>
 <div class="audio">
   	<image
			:src="
				isPlaying
				? require('./static/play-now.png')
					: require('./static/pause-now.png')"
			class="audioImg"
			@click="getAudio(dataSource)"
		/>
 </div>
</template>

<script>
export default {
 data() {
	return {
    isPlaying: false,
		isStop: true,
		duration: "00:00",
		time: "00:00",
		playJd: 0,
		activeIndex: -1,
		innerAudioContext: null,
		currentAudio: null
	}
 },
 props: {
  dataSource: {
	  type: Object,
	}
 },
 created() {
   this.createAudioContextThread();
 },
 beforeDestroy() {
		this.audioDestroy();
 },
 components: {

 },
 methods: {
	clear() {
		this.playJd = 0;
		this.time = "00:00";
		this.duration = "00:00";
		},
	getAudio(audio) {
			// if (this.currentAudio.id == audio.id) {
				//播放
				if (!this.isPlaying) {
					this.innerAudioContext.title = audio.clueName;
					this.innerAudioContext.src = audio.contentClueFileUrl;
					this.innerAudioContext.play();
					this.isPlaying = true;
				} else {
					//暂停
					this.innerAudioContext.pause();
					this.isPlaying = false;
				}
			// } else {
			// 	this.clear();
			// 	this.currentAudio = audio;
			// 	this.innerAudioContext.title = this.currentAudio.audioName;
			// 	this.innerAudioContext.src = this.currentAudio.audioAddress;
			// 	this.innerAudioContext.play();
			// 	this.isPlaying = true;
			// }
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
			// if (that.currentAudio.playType === "LOOP") {
			// 	that.innerAudioContext.src = that.currentAudio.audioAddress;
			// 	that.innerAudioContext.title = that.currentAudio.audioName;
			// 	that.innerAudioContext.play();
			// } else {
				that.isPlaying = false;
				that.isStop = true;
			// }
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
 }
}
</script>

<style scoped lang="scss">
.audioImg {
	width: 50px!important;
	height: 50px;
	margin-top: 30px;
}
</style>
