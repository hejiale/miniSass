<template>
 <div class="detail">
   <navigationBar :nav="customNav">
		<view slot="left">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000"
            size="50rpx"
          />
        </view>
      </view>
			<view slot="content">
				<div class="content" v-if="emailData[index] && emailData[index].senderName">
          <div class="line"></div>
					<div class="title">
            <div>{{emailData[index].senderName}}</div>
					  <!-- <span>new message</span> -->
					</div>
          <div class="line"></div>
					<div class="text" v-html="getContent(emailData[index].emailContent)">
					</div>
				</div>
			</view>
	 </navigationBar>
 </div>
</template>

<script>
import navigationBar from "@/components/navigation-bar/index.vue";
import { mapState } from "vuex";

export default {
 data() {
	return {
   customNav: {
		bgHeight: "100vh",
		color: "#000",
		hideBg: true,
		customizeLeft: true,
	 },
	 index: 0
	}
 },
 components: {
   navigationBar
 },
 computed: {
    ...mapState("dm", [
      'emailData'
    ]),
 },
 onLoad(options) {
   this.index = options.index
 },
 methods: {
	backRoute() {
		uni.navigateBack();
	},
	getContent(data) {
		let message=data.replace(/\n/g, "<br/>"); 
		return message
	}
 }
}
</script>

<style scoped lang="scss">
.content {
	padding: 9px 0;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 23px;
	color: #020202;
	.line {
		border: 1px solid #EEEEEE;
	}
	.title {
		margin-left: 16px;
		padding: 24px 0;
	}
	span {
		font-weight: 400;
		font-size: 14px;
		line-height: 23px;
		color: #E19421;
		margin-top: 6px;
	}
	.text {
		margin-top: 30px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 17px;
		line-height: 26px;
		color: #020202;
		padding: 0 16px;
		word-break: break-all;
	}
}
</style>
