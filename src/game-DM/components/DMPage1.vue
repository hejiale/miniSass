<template>
  <div class="page1">
			<DmUserList v-if="!gameInfo.isAllPosition"/>
			<view  class ="seat">
				<div class="title" v-if="gameInfo.isAllPosition">
					等待玩家选择角色
				</div>
				<div class="title" v-else>
					点击座位，选择参与游戏的玩家
				</div>
        <div class="note">DM请确认入座玩家是否为本场玩家，游戏一旦开始，无法更换。</div>
				<DmSeatList  v-if="gameInfo.roomStatus === 'CREATING'" @handleSeat="handleSeat" @handleDelete="handleDelete"/>
			</view>
			<view class="options" :style="gameInfo.isAllPosition ? 'bottom: 12vh;':'bottom: 7.3vh;'">
				<div class="bTtitle" v-if="!gameInfo.isAllPosition">
					<DmTitle title="主持人位置"/>
				</div>
				<DmButton v-if="!gameInfo.isAllPosition" :bgImg="isNoAll ? '../static/icon-select-bg.png':'../static/icon-select-startGame-bg.png'" @handleClick="handleNext('start')"/>
				<DmButton v-else @handleClick="handleNext('action')" bgImg="../static/icon-select-start-bg.png"/>
			</view>
			<SeatPopup class="userPopup" ref="seatPop" @assignSeatDM="assignSeatDM"/>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DmButton from '../components/DmButton.vue'
import service from "@/services/game.js"
import DmUserList from './DmUserList.vue'
import DmSeatList from './DmSeatList.vue'
import SeatPopup from './SeatPopup.vue'
import DmTitle from './DmTitle.vue'
export default {
 data() {
	return {
    isCanDo: false
  }
 },
 components: {
    DmUserList,
    DmSeatList,
    SeatPopup,
    DmButton,
    DmTitle
 },
 computed: {
    ...mapState('dm',
    ['gameInfo',
    'roomUsersList',
    'seatInfo'
     ]),
    isNoAll(){
      return this.seatInfo.find(e=>!e.userId);
    }
 },
 methods: {
	...mapActions('dm',[
      'checkOnlineGame',
      'getSeatInfo',
    ]),
	 // DM分配座位
    async assignSeatDM(userId) {
      await service.assignSeatDM({
        murderMysteryOnlineRecordId: this.gameInfo.id,
        userId,
        position: this.position
      })
      this.$refs.seatPop.close()
      this.getSeatInfo()
    },
    // 游戏开场(玩家选完角色)
    async initializeGame() {
      if(this.isCanDo)return;
      this.isCanDo = true;

      try{
        const res =  await service.initializeGame({
          murderMysteryOnlineRecordId: this.gameInfo.id,
        })
        this.isCanDo = false;
        this.$emit('update:current', 2)
        this.checkOnlineGame()
      }catch(e){
        this.isCanDo = false;
      }
    },
    
    // 开始选择角色透传
    async startSelectRoleCommand() {
      //判断开始选角座位是否坐满
      let hasEmpty = this.seatInfo.find(e=>!e.userId)
      if(hasEmpty){
        uni.showToast({
          title: "请选择玩家！",
          icon: "error",
        });
        return;
      }
      if(this.isCanDo)return;
      this.isCanDo = true;

      try{
        const res =  await service.startSelectRoleCommand({
          murderMysteryOnlineRecordId: this.gameInfo.id,
        })
        this.isCanDo = false;
        this.checkOnlineGame()
      }catch(e){
        this.isCanDo = false;
      }
    },
    handleSeat(v) {
     if(!this.roomUsersList.length) {
      uni.showToast({
          title: "请等待玩家进入房间！",
          icon: "error",
      });
      return
     }
     this.position = v;
     this.$refs.seatPop.open()
    },
    //移除玩家
    async handleDelete(seat){
      try{
        await service.removeSeat({
          position: seat.seatNumber,
          userId: seat.userId,
          murderMysteryOnlineRecordId: this.gameInfo.id
        })
        this.getSeatInfo()
      }catch(e){}
    },
     // DM 开始选角和开始游戏按钮
    handleNext(type) {
      console.log('type----', type);
      this.nextType = type
      if(type === 'start') {
        this.startSelectRoleCommand()
      } else if (type === 'action') {
        this.initializeGame()
      }
    },
 }
}
</script>

<style scoped lang="scss">
.page1 {
	.seat {
    padding: 0 rpx(14);
    .title {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      text-align: center;
      margin: 20px 0 6px;
      text-align: center;
      font-family: PingFang SC-Regular, PingFang SC;
      color: #FFFFFF;
      line-height: 14px;
      opacity: 0.8;
    }
    .note{
      margin: 0 0 30px 10%;
      width: 80%;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 14px;
      letter-spacing: 1px;
      opacity: 0.8;
    }
  }
  .options {
    font-family: 'PingFang SC';
    font-style: normal;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    .bTtitle {
      width: 199px;
      margin: 0 auto;
      margin-bottom: 22px;
    } 
  }
}
</style>
