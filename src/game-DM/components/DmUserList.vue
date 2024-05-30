<template>
	<view class="users">
      <div class="ml14">当前房间玩家({{roomUsersList.length}})</div>
      <div class="avatarList">
        <template v-if="roomUsersList.length">
           <div class="avatar" v-for="(v,i) in roomUsersList">
            <image :src="v.avatar" mode="widthFix" />
            <span>{{v.nickName || ''}}</span>
          </div>
        </template>
        <template v-else>
          <div class="avatar">
            <image src="../static/defaultUser.png" mode="widthFix" />
            <span>等待玩家进入</span>
          </div>
        </template>
      </div>
    </view>
</template> 

<script>
import { mapState } from 'vuex'

export default {
 data() {
	return {

	}
 },
 computed: {
    ...mapState('dm',['roomUsersList']),
 },
 methods: {
    
 }
}
</script>

<style scoped lang="scss">
.users {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: -0.4px;
    color: #C1BAAA;
    margin-top: 21px;
    .avatarList {
      overflow-x: scroll;
      margin-top: 12px;
      display: flex;
      .avatar {
        position: relative;
        margin-left: 17px;
        image {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
        >span {
          display: inline-block;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0) -3.85%, #000000 29.15%, #000000 73.5%, rgba(0, 0, 0, 0) 100%);
          border-radius: 6px;
          width: 52px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          position: absolute;
          left: -4px;
          bottom: 0;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 500;
          font-size: 9px;
          line-height: 115%;
          text-align: center;
          letter-spacing: -0.4px;
          color: #C1BAAA;
        }
      }
    }
  }
</style>
