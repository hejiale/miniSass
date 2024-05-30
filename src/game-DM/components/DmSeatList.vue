<template>
  <div class="seatBox">
    <div
      v-for="v in gameInfo.playerNum"
      :key="v"
      class="seatSubBox"
      :style="isSingle(v) ? 'margin-right: 7px;' : 'margin-right: 0px;'"
    >
      <div
        class="seat"
        v-if="rolePlayersStash[v].position === v + 1"
      >
		  	<div class="user"  :style="{backgroundImage:'url(' +rolePlayersStash[v].roleAvatar+ ')'}"></div>
        <span>{{ rolePlayersStash[v].roleName }}</span>
      </div>
      <div
        class="seat"
        v-else-if="seatInfo.length && seatInfo[v].userId"
        @click="handleDelete(v)"
      >
        <image class="user" :src="seatInfo[v].avatar" />
        <span>{{ seatInfo[v].nickName }}</span>
        <image
          class="tag"
          src="../static/icon-delete-role.png"
          v-if="!gameInfo.isAllPosition"
        />
      </div>
      <div class="seat" @click="handleSeat(v + 1)" v-else>
        <image src="../static/defaultUser.png" mode="widthFix" class="user" />
        <span>点击入座</span>
      </div>
      <div class="bage">{{ v + 1 }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  watch: {
    rolePlayersStash(v) {
      console.log('rolePlayersStash', v[1]);
    }
  },
  computed: {
    ...mapState("dm", ["gameInfo", "rolePlayersList", "seatInfo","rolePlayersStash"]),
    isSingle() {
      return function (v) {
        return parseInt(v) % 2 === 0;
      };
    },
   
    //  getRole() {
    //   return function (i) {
    //     let index = this.rolePlayersList.findIndex(v=>user.userId === it.id);
    //     if(index === -1){
    //       this.otherUserList.push(it)
    //     }
    //   };
    // }
  },
  components: {},
  methods: {
    handleSeat(v) {
      console.log("handleSeat", v);
      this.$emit("handleSeat", v);
    },
    handleDelete(v) {
      if (!this.gameInfo.isAllPosition) {
        this.$emit("handleDelete", this.seatInfo[v]);
      }
    },
    onChangeSeat(v) {
		this.$emit("handleChange", v);
	  },
   
  },
};
</script>

<style scoped lang="scss">
.seatBox {
  height: 45vh;
  overflow: scroll;
}
.seatSubBox {
  display: inline-block;
  margin-bottom: rpx(8);
  width: calc((100vw - 70rpx) / 2);
  position: relative;
  .seat {
    padding: rpx(10) 0;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    width: 100%;
    position: relative;
    .user {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-left: rpx(25);
      background-repeat: no-repeat;
			background-position: top;
			background-size: cover;
    }
    span {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 400;
      font-size: rpx(14);
      line-height: 20px;
      color: rgba(255, 255, 255, 0.6);
      margin-left: rpx(6);
      @include text-overflow-line(1);
      width: 60%;
    }
    .tag {
      position: absolute;
      left: rpx(25);
      bottom: rpx(10);
      width: 36px;
      height: 14px;
    }
  }
  .bage {
    position: absolute;
    left: 1px;
    top: 1px;
    width: 22px;
    height: 14px;
    background: linear-gradient(180deg, #e2d3b6 0%, #d5c19b 100%);
    border-radius: 11px 0px 7px 0px;
    @include hor-center-center;
    font-size: 11px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #4f4123;
  }
}
</style>
