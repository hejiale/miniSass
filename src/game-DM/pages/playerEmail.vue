<template>
 <div class="email">
		<view >
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000"
            size="50rpx"
          />
					<div class="title">
						邮箱
					</div>
					<div></div>
        </view>
      </view>
			<view >
					<view class="email__content">
					<div class="main">邮件列表</div>
					<div class="list">
						<div class="item" v-for="(v, i) in emailData" :key="v.id" @click="readEmail(v, i)">
							<image
								:src="v.senderAvatar"
							/>
							<div class="item-right">
								<div class="title">
									<span>{{v.senderName}}</span>
									<!-- <div class="date">
										5月23日
									</div> -->
									<div class="isRead" v-if="v.readStatus == '1'"></div>
								</div>
								<!-- <div class="name">尊敬的不美市长</div> -->
								<div class="content">
								   {{v.emailContent}}
								</div>
							</div>
						</div>
					</div>
				</view> 
		</view>
		<image class="emailRefresh" @click="getUserEmailList" src="../static/emailRefresh.png"/>
 </div>
</template>

<script>
import navigationBar from "@/components/navigation-bar/index.vue";
import { mapState, mapMutations } from "vuex";
import service from "@/services/game.js";

export default {
 data() {
	return {}
 },
 components: {
   navigationBar
 },
 computed: {
    ...mapState("dm", [
      'emailData'
    ]),
		...mapState("player", [
      'userInfo',
			'options'
    ]),
 },
 methods: {
  ...mapMutations("dm", [ "setEmailData"]),
	backRoute() {
		uni.navigateBack();
	},
	async readEmail(v, index) {
    await service.readEmail({
			emailId: v.id,
			roomId: this.options.roomId,
			userId: this.userInfo.id
		});
		this.getUserEmailList()
		uni.navigateTo({
			url: `/game-DM/pages/emailDetail?index=${index}`,
		});
	},
	async getUserEmailList() {
		uni.showLoading();
		const res = await service.getUserEmailList({
			userId: this.userInfo.id,
			roomId: this.options.roomId,
		});
		 uni.hideLoading();
     this.setEmailData(res);
   },
 }
}
</script>

<style scoped lang="scss">
.email {
	padding: 30px 16px;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	&__content {
		margin-top: 20px;
    .main {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 12px;
			line-height: 17px;
			color: #5F5F5F;
			margin-bottom: 23px;
		}
		.list {
			max-height: 77vh;
			overflow-y: scroll;
			.item {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: 18px;
				image {
					width: 40px;
					height: 40px;
					border-radius: 50%;
				}
			}
			.item-right {
				width: 76vw;
				font-family: 'PingFang SC';
				font-style: normal;
				letter-spacing: -0.2px;
				color: #020202;
				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 12px;
			  	line-height: 17px;
					font-weight: 500;
					span {
						font-size: 16px;
						line-height: 22px;
						display: inline-block;
						font-weight: 600;
					}
					.isRead {
						width: 8px;
            height: 8px;
            background: rgba(235, 77, 61, 1);
            border-radius: 50%;
					}
				}
				.name {
					font-size: 14px;
          line-height: 20px;
					font-weight: 500;
					margin: 4px 0 1px;
				}
				.content {
					font-size: 14px;
					line-height: 20px;
					color: #545454;
					overflow:hidden; //超出的文本隐藏
					text-overflow:ellipsis; //溢出用省略号显示
					white-space:nowrap; //溢出不换行
				}
			}
		}
	}
}
.topNav {
	padding-top:22px;
	width: 100vw;
	display: flex;
	align-items: center;
	/deep/image {
		vertical-align: super !important;
	}
	.title {
		font-family: PingFang SC;
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
    color: rgba(2, 2, 2, 1);
		margin-left: 30vw;
	}
}
.emailRefresh {
	position: fixed;
	right: 0;
	bottom: 15vh;
	width: 48px;
	height: 55px;
}
</style>
