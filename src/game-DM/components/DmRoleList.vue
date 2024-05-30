<template>
 <div class="right-list">
		<div class="avatarInfo" v-for="v in rolePlayersList" :key="v.userId" @click="openDetail(v)">
			<div class="avatar"  :style="{backgroundImage:'url(' +v.roleAvatar+ ')'}"></div>
			<image class="hand" v-if="v.ishandUp"  src="../static/hand.png" mode="widthFix" />
			<span class="number" v-if="v.clueNum">{{v.clueNum}}</span>
			<div class="name">
				{{v.roleName}}
			</div>
		</div>
		<van-popup
      :show="roleVisible"
      position="bottom" 
      @click-overlay="closeDetail"
      close-on-click-overlay
      class="userPopup"
    >
      <div class="userPopup__body">
        <view class="userPopup__head">
					<div></div>
          <span>玩家详情</span>
			    <van-icon  class="close" name="cross" color="#CCBC91" @click="closeDetail"/>
        </view>
        <view class="userPopup__info">
		    	<div class="avatar"  :style="{backgroundImage:'url(' +stashInfo.roleAvatar+ ')'}"></div>
					<div class="name">
						<div>{{stashInfo.roleName}}</div>
						<span v-if="stashInfo.userName">微信昵称：{{stashInfo.userName}}</span>
					</div>
				</view>
				<view class="userPopup__list" >
					<ClueCard :userId="stashInfo.userId" dataType="player" :storeNum="gameInfo.storeNumber" cardType="unpublished" v-for="v in privateClues" :key="v.id"   :dataSource="v" @handleClick="handleCard(v.id,'pageUser')"/>
				</view>
      </div>
    </van-popup>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ClueCard from './ClueCard.vue'

export default {
 data() {
	return {
    stashInfo: {},
		showPopup: false
	}
 },
 computed: {
    ...mapState('dm',['gameInfo', 'rolePlayersList', 'privateClues', 'roleVisible']),
 },
 components: {
   ClueCard
 },
 watch: {
  privateClues(v) {
	}
 },
 methods: {
	...mapMutations("dm", [
		"setRoleVisible",
	]),
	...mapActions('dm',[
		'getPrivateClues'
  ]),
	openDetail(data) {
		this.stashInfo = data
    // uni.showLoading();
		this.getPrivateClues({
			userId: data.userId,
			open: true
		})
	},
	closeDetail() {
		this.setRoleVisible(false)
	},
	handleCard(clueId, type) {
			this.$emit('handleClick', 
				clueId,
				type
			); 
		},
 }
}
</script>

<style scoped lang="scss">
 .right-list {
		display: flex;
		flex-direction: column;
		height: 60vh;
		overflow-y: scroll;
	}
	.avatarInfo {
		width: 11.7vw;
		height: 11.7vw;
		position: relative;
		margin: 0 auto 18px;
		.avatar {
			width: 100%;
			height: 100%;
		  border-radius: 50%;
			background-repeat: no-repeat;
			background-position: top;
			background-size: cover;
			/* background-color: #E83A3A; */
		}
		.hand {
			width: 6vw;
			height: 6vw;
			position: absolute;
			top: 3px;
			right: -22px;
		}
		.number {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			width: 16px;
			height: 16px;
			background: #E83A3A;
			border: 0.5px solid #EDAEA6;
			text-align: center;
			border-radius: 50%;
			color: #FFFFFF;
		}
		.name {
			min-width: 42px;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 10px;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 10px;
			color: #FFFFFF;
			padding: 4px 6px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: -4px;
			text-align: center;
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
		&__info {
			display: flex;
			align-items: center;
			.avatar {
				width: 44px;
				height: 44px;
				border-radius: 50%;
				background-repeat: no-repeat;
				background-position: top;
				background-size: cover;
			}
			.name {
				margin-left: 9px;
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 400;
				font-size: 16px;
				color: rgba(255, 255, 255, 0.6);
			}
			span {
				font-size: 12px;
				margin-top: 10px;
				max-width: 172px;
				overflow:hidden; //超出的文本隐藏
				text-overflow:ellipsis; //溢出用省略号显示
				white-space:nowrap; //溢出不换行
			}
		}
		&__list {
			margin-top: 18px;
			height: 40vh;
      overflow-y: scroll;
      display: grid;
      justify-content: strat;
      grid-template-columns: repeat(auto-fill, 29vw);
      grid-gap:4px 4px;
			padding: 0 53px;
		}
}		
</style>
