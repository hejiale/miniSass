<template>
  <div class="container">
    <view class="page2">
      <DmTitle class="page2__title" title="主持人位置" />
      <div class="page2__clues">
        <div class="left">
          <div class="left-top">
            <image src="../static/clueIcon.png" mode="widthFix" />
            <span> 公开线索 </span>
          </div>
          <div class="left-list" v-if="publicClues.length">
            <ClueCard cardType="public" v-for="v in publicClues" :key="v.id" :dataSource="v" :storeNum="gameInfo.storeNumber" @handleClick="handleCard(v.id,'page2')"/>
          </div>
        </div>
        <div class="right">
          <DmRoleList @handleClick="handleCard"/>
        </div>
      </div>
      <view class="page2__options">
        <!-- <image
          class="img1"
          @click="handleOtions('seat')"
          src="../static/seat.png"
          mode="widthFix"
        />
        <div class="line"></div> -->
        <image
          class="img2"
          @click="handleOptions('refresh')"
           src="../static/refresh.png"
          mode="widthFix"
        />
        <div class="line"></div>
        <image
          class="img3"
          @click="handleOptions('cancelHand')"
          src="../static/cancelhand.png"
          mode="widthFix"
        />
      </view>
    </view>
  </div>
</template>

<script>
import service from "@/services/game.js";
import { mapState, mapActions } from "vuex";
import ClueCard from "./ClueCard.vue";
import DmRoleList from "./DmRoleList.vue";
export default {
  data() {
    return {
    };
  },
  components: {
    ClueCard,
    DmRoleList,
  },
  computed: {
    ...mapState("dm", ["gameInfo", "userInfo", "publicClues"]),
  },
  methods: {
    ...mapActions("dm", ["getRolePlayers", "getPublicClues"]),
    handleOptions(type) {
      switch (type) {
        case "seat":
          // this.$emit('onChangeSeat')
          break;
        case "refresh":
           uni.showLoading();
           this.getRolePlayers();
           this.getPublicClues();
           setTimeout(()=>{
             uni.hideLoading();
           }, 1000)
          break;
        case "cancelHand":
          this.dmLowerHand();
          break;
        default:
      }
    },
    // DM-取消举手
    async dmLowerHand() {
      await service.dmLowerHand({
        murderMysteryOnlineRecordId: this.gameInfo.id,
        userId: this.userInfo.id,
      });
      this.getRolePlayers();
    },
    handleCard(clueId, type) {
			this.$emit('changeClueSwiper', {
				clueId,
				type
			}); 
		},
  },
};
</script>

<style scoped lang="scss">
.page2 {
  margin-top: 24px;
  padding-left: 4vw;
  &__title {
    width: 255px;
  }
  &__clues {
    margin-top: 14px;
    display: flex;
  }
  &__options {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    margin-right: 12px;
    .img1 {
      width: 36px;
    }
    .img2 {
      width: 24px;
      padding: 0 12px;
    }
    .img3 {
      width: 48px;
      padding: 0 12px;
    }
    .line {
      background: rgba(255, 255, 255, 0.2);
      height: 26px;
      width: 1px;
    }
  }
  .left {
    width: 64vw;
    .left-top {
      display: flex;
      align-items: center;
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: #eee6d4;
      margin-bottom: 12px;
      image {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
    .left-list {
      display: grid;
      justify-content: start;
      grid-template-columns: repeat(auto-fill, 20vw);
      grid-gap: 1.5vw 1.5vw;
      overflow-y: scroll;
      padding-bottom: 20px;
      max-height: 59vh;
    }
  }
  .right {
    width: 31vw;
    margin-top: 24px;
  }
}
</style>
