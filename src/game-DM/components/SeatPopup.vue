<template>
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
          <span>选择玩家入座</span>
          <van-icon  class="close" name="cross" color="#CCBC91" @click="showPopup = false"/>
        </view>
        <view class="userPopup__list">
          <div class="info" v-for="(v,i) in otherUserList" :key="v" @click="handleRadio(v.id)">
            <div class="avatar">
             <image :src="v.avatar" mode="widthFix" />
             <span>{{v.nickName}}</span>
            </div>
            <view class="radio-content" >
              <view class="radio" >
                <view :class="userId == v.id ? 'radio-active':''"></view>
              </view>
            </view>
          </div>
        </view>
      </div>
    </van-popup>
</template>

<script>
import { mapState } from 'vuex'

export default {
 data() {
	return {
    showPopup: false,
    userId: null,
    otherUserList: []
	}
 },
 components: {

 },
 watch: {
   showPopup(v) {
    if(!v) {
      this.userId = null
    }
   }
 },
 computed: {
    ...mapState('dm',['roomUsersList','seatInfo']),
 },
 methods: {
	open() {
    this.otherUserList = [];
    let roomUsersList = JSON.parse(JSON.stringify(this.roomUsersList));
    let seatInfo = JSON.parse(JSON.stringify(this.seatInfo));
    
    roomUsersList.map(it=>{
      let index = seatInfo.findIndex(user=>user.userId === it.id);
      if(index === -1){
        this.otherUserList.push(it)
      }
    })
		this.showPopup = true
	},
  close() {
		this.showPopup = false
    this.userId = null
	},
	handleRadio(userId) {
    this.userId = userId
		this.$emit('assignSeatDM', userId)
	}
 }
}
</script>
<style lang="scss">
/* .userPopup {
    /deep/ .van-popup {
      height: 58vh!important;
      background: #1C292E!important;
    }
    /deep/ .van-popup__close-icon {
      color: #CCBC91;
    }
} */
</style>
<style scoped lang="scss">

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
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        margin-bottom: 5px;
        border-bottom: 1px solid rgba(81, 76, 60, 0.6);
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
    .radio {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid rgba(204, 188, 145, 0.4);
      display: flex;
      flex-direction: column; 
      align-items: center;
      justify-content: center;
    }
    .radio-active{
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #CCBC91;
    }
    
  }
</style>
