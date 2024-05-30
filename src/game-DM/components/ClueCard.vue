<template>
 <div class="container">
   <div class="card">
			<div class="border" @click="handleClick">
				<div class="borderBody" :style="cardType === 'public' ? 'width: 75px;height:100px;' : 'width: 111px;height:148px;'">
					<template v-if="dataSource.clueType === 'VIDEO'"> 
						<image class="bgIMG" :src="dataSource.clueIcon"  />
						<div class="videoMask"></div>
						<image class="video"  src="@/static/image/clue/video.png" />
					</template>
					<template v-if="dataSource.clueType === 'AUDIO'">
						<image class="bgIMG" :src="dataSource.clueIcon"  />
						<div class="musicMask"></div>
						<image class="music"  src="@/static/image/clue/music.png" mode="widthFix" />
						<image class="musicAvatar" :src="dataSource.clueIcon"  />
					</template>
					<template v-if="dataSource.clueType === 'TEXT' || dataSource.clueType === 'IMAGE'">
						<image class="bgIMG" :src="$filters.waterMarkImg(dataSource.clueIcon, userInfo.juyouId, gameInfo.storeNumber)"  />
					</template>
				</div>
			  <div class="bottom" v-if="cardType === 'unpublished'">
           <span v-if="dataSource.isDmDistribute && !userId" @click.stop="handlePrivately(dataSource.id)">
						 私发
					 </span>
					 <span v-if="dataSource.isDmRecall && userId" @click.stop="handleOption(dataSource.id,'recall')">
						 收回
					 </span>
					 <span  @click.stop="handleOption(dataSource.id,'public')" v-if="dataSource.isDmPublic">
						 公开
					 </span>
				</div>
				 <div class="bottom" v-if="cardType === 'public'">
					 <span v-if="dataSource.isDmRecall"  @click.stop="handleOption(dataSource.id,'recall')">
						 收回
					 </span>
				</div>
			</div>
			<div class="clueName">
				{{dataSource.clueName}}
			</div>
		</div>
		<van-popup
      :show="showPopup"
      position="bottom" 
      @click-overlay="showPopup = false"
      close-on-click-overlay
      class="userPopup"
    >
      <div class="userPopup__body">
        <view class="userPopup__head">
					<div></div>
          <span>发给谁？</span>
					<van-icon  class="close" name="cross" color="#CCBC91" @click="showPopup = false"/>
        </view>
        <view class="userPopup__list">
          <div class="info" v-for="(v) in rolePlayersList" :key="v.userId">
            <div class="avatar">
             <image :src="v.roleAvatar"  />
             <span>{{v.roleName}}</span>
            </div>
						<template>
              <div class="btn" @click="dmClueTransfer(v.userId)">发送</div>
						</template>
          </div>
        </view>
      </div>
    </van-popup>
 </div>
</template>

<script>
import service from "@/services/game.js"
import { mapState, mapActions } from 'vuex'


export default {
 data() {
	return {
    type: 'TEXT',
		showPopup: false,
		sendClueId: null
	}
 },   
 props: {
   cardType: {
		type: String,
		default: 'public'
	 },
	 dataSource: {
		type: Object,
	 },
	 userId: {
		type: Number,
	 },
	 dataType: {
		type: String,
		default: 'dm'
	 },
	 storeNum: {
		type: Number
	 }
 },
 components: {

 },
  computed: {
    ...mapState('dm',
    ['rolePlayersList',
		'gameInfo',
		'userInfo'
     ]),
  },
 watch: {
   showPopup(v) {
		if(!v) {
			this.sendClueId = null
		}
	 }
 },
 methods: {
	...mapActions('dm',[
      'getDmClues',
			'getPrivateClues',
			'getPublicClues',
			'getRolePlayers'
    ]),
	handleOption(clueId, type) {
    let that = this
		uni.showModal({
			title: "提示",
			content: `确认${type === 'public' ? '公开': '收回'}？`,
			success: async (res) => {
				if (res.cancel) return;
				if(type === 'public') {
					// DM-线索公开
					if(this.dataType === 'player') {
				  	await service.playerCluePublish({
							murderMysteryOnlineRecordId: this.gameInfo.id,
						  clueId,
							originalUserId: this.userId
						})
					} else {
						 await service.dmCluePublish({
								murderMysteryOnlineRecordId: this.gameInfo.id,
								clueId,
							})
					}
					that.$emit('getDmClues')
					that.getPrivateClues({
						userId: this.userId
					})
					that.getRolePlayers(); 
					uni.showToast({
						title: "公开成功",
					});
				}	else if(type === 'recall') {
					if(this.dataType === 'player') {
						await service.dmClueBack({
							murderMysteryOnlineRecordId: this.gameInfo.id,
							clueId,
							originalUserId: this.userId
						})
					} else {
            // DM-线索回收
            await service.dmPublicClueBack({
							murderMysteryOnlineRecordId: this.gameInfo.id,
							clueId,
						})
					}
					that.$emit('getDmClues')
					that.getPrivateClues({
						userId: this.userId
					})
					that.getPublicClues()
					that.getRolePlayers(); 
					uni.showToast({
						title: "回收成功",
					});
				}
			},
		});
	},
	handlePrivately(clueId) {
		this.sendClueId = clueId
    this.showPopup = true
	},
	// DM-线索转移
	async dmClueTransfer(transferUserId) {
		await service.dmClueTransfer({
			murderMysteryOnlineRecordId: this.gameInfo.id,
			clueId: this.sendClueId,
      transferUserId
		})
		this.$emit('getDmClues')
		this.showPopup = false
		uni.showToast({
      title: "私发成功",
    });
	},
	handleClick() {
		this.$emit('handleClick')
	}
 }
}
</script>

<style scoped lang="scss">
.userPopup {
    /deep/ .van-popup {
      height: 58vh!important;
      background: #1C292E!important;
    }
    /deep/ .van-popup__close-icon {
      color: #CCBC91;
    }
}
.userPopup {
    &__body {
      padding: 15px 16px 0;
    }
    &__head {
      text-align: center;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
      color: #CCBC91;
			display: flex;
			justify-content: space-between;
    }
    &__list {
      height: 47vh;
      overflow: scroll;
			padding: 0 14px;
			margin-top: 55px;
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 11px 12px;
        margin-bottom: 5px;
        border-bottom: 1px solid rgba(81, 76, 60, 0.6);
				background: rgba(0, 0, 0, 0.4);
				margin-bottom: 10px;

      }
      .avatar {
        image {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        span {
          display: inline-block;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin-left: 10px;
        }
      }
    }
    .btn {
			font-family: 'Source Han Serif CN';
			font-style: normal;
			font-weight: 900;
			font-size: 13px;
			color: #F3E6C1;
			padding: 4px 25px;
			border: 1px solid rgba(204, 188, 145, 0.4);
			background: linear-gradient(180deg, rgba(204, 188, 145, 0) 0%, rgba(204, 188, 145, 0.6) 100%);
		}
    .hasSend {
      background: linear-gradient(180deg, rgba(204, 188, 145, 0) 0%, rgba(204, 188, 145, 0.2) 100%);
		}
  }
.card {
		display: flex;
		flex-direction: column;
		.clueName {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 10px;
			text-align: center;
			color: #FFFFFF;
			width: 100%;
			margin-top: 5px;
			display: inline-block;
			@include text-overflow-line(1);
		}
		.border {
			border: 2px solid rgba(168, 152, 93, 1);
			border-radius: 2px;
			display: inline-flex;
			position: relative;
			/* overflow: hidden; */
			/* background: linear-gradient(to right, rgba(204, 188, 145, 1), rgba(168, 152, 93, 1)); */
			.borderBody {
				border: 1px solid #000000;
			  position: relative;
			}
			.bottom {
				display: flex;
				justify-content: space-around;
				width: 100%;
				position: absolute;
        left: 0;
				bottom: 5px;
				z-index: 2;
        span {
					display: inline-block;
					font-family: 'Source Han Serif CN';
					font-style: normal;
					font-weight: 700;
					font-size: 12px;
					color: #271C0C;
					padding: 5px 0;
					width: 13vw;
					text-align: center;
					background: linear-gradient(180deg, #CCBC91 0%, #56420D 100%);
					border: 1px solid #352813;
					border-radius: 2px;
				}
			}
      .bgIMG {
				border-radius: 1px;
				width: 100%;
				height: 100%;
			}
			.videoMask {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.6);
				z-index: 1;
			}
			.video {
				width: 26px;
        height: 26px;
				position: absolute;
				z-index: 2;
        left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			.musicMask {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.6);
				z-index: 1;
				backdrop-filter: blur(3px);
			}
			.music {
				width: 100%;
        height: 100%;
				position: absolute;
				z-index: 2;
        left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			.musicAvatar {
				width: 35.26px;
        height: 35.26px;
				position: absolute;
				z-index: 3;
        left: 50%;
				top: 50%;
				border-radius: 50%;
				transform: translate(-50%, -50%);
			}
		}
		
		
}
</style>
