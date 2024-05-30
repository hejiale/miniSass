<template>
 <div class="initAnimation">
	<div v-for="i in 75" class="imgBox">
   <image v-show="i === setIntervalNumber" :src="`https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230429/fca17e2dff3e40b2a3de3f338983fa7d/init/animation (${i+1}).png`"  />
	</div>
 </div>
</template>

<script>
export default {
 data() {
	return {
    intervalFlag: false,
		setIntervalNumber: 0,
		showImageUrl: '',
		interval: null,
	}
 },
 created() {
   this.handleAni()
 },
 methods: {
	  handleAni() {
			if(this.intervalFlag) return //防止加速
			this.intervalFlag = true
			let _this = this
			this.interval = setInterval(function() { _this.setIntervalFunc() }, 25) //每60毫秒执行一次
		},
		setIntervalFunc() {
				if(this.setIntervalNumber>=75) {
						this.setIntervalNumber = 1
				}
				this.setIntervalNumber += 1
		},
		// 清除定时器
		clearIntervalFunc() {
			clearInterval(this.interval)
		}
 }
}
</script>

<style scoped lang="scss">
.initAnimation {
	/* background: red; */
	image{
		width: 100vw;
		height: 100vh;
	}
}
</style>
