<template>
   <view class="transfer">
      <div class="transferBox">
        <view class="transferBox__top">
          <div>选择一名角色转让线索</div>
          <image src="../static/transferCancel.png" mode="widthFix" @click="handleClose"/>
        </view>
        <view class="line"></view>
        <view class="transferBox__list">
          <div class="card" v-for="v in rolePlayersList" :key="v.userId">
            <div class="card-left">
              <div class="avatar">
                <image :src="v.roleAvatar"  />
                <span>{{v.clueNum}}</span>
              </div>
              <div class="info">
                <div class="info-title">{{v.roleName}}</div>
                <div class="info-middle">
                  <div>角色状态：</div>
                  <span class="info-status">正常</span>
                </div>
                <div>其他信息</div>
              </div>
            </div>
            <div class="button" v-if="v.userId != userInfo.id" @click="handleTransfer(v)">
              转让
            </div>
          </div>
        </view>
			</div>
   </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import service from "@/services/game.js";
export default {
  name: "GameTop",
  props: {
    clueId: {
      type: Number
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('player',[
      'murderMysteryOnlineRecordId',
      'rolePlayersList',
      'userInfo'
    ]),
  },
  created() {},
  methods: {
     ...mapActions("player", [ "getPrivateClues"]),
    handleTransfer(v) {
      let that = this
      uni.showModal({
        title: "提示",
        content: `确认转让该线索给角色${v.roleName}？`,
        success: async (res) => {
          if (res.cancel) return;
          await service.playerClueTransfer({
            murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
            clueId: this.clueId,
            originalUserId: this.userInfo.id,
            transferUserId: v.userId
          })
          this.getPrivateClues();
          that.$emit("closeTransfer", {
            visible: false,
            clueId: null,
            clueSwiper: false
          });
          uni.showToast({
            title: "转让成功",
          });
        },
      });
    },
    handleClose() {
	    this.$emit("closeTransfer", {
        visible: false,
        clueId: null
			});
    }
  },
  watch: {},
  
}
</script>

<style lang="scss"  scoped>
.transfer {
	width: 100vw;
	height: 100vh;
	background: rgba(0,0,0, 0.8);
  padding-top: 40px;
  .transferBox {
    width: 74vw;
    margin: 0 auto;
    padding: 14px 16px 0;
    background: #211F19;
    border: 1px solid #CCBC91;
    &__top {
      font-family: 'Source Han Serif CN';
      font-style: normal;
      font-weight: 900;
      font-size: 15px;
      line-height: 110%;
      color: #CCBC91;
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      image {
        width: 18px;
        height: 18px;
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background: #514C3C;
    }
    &__list {
      height: 66vh;
      overflow: scroll;
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .card {
        width: 45.5%;
        background: rgba(0,0,0, 0.4);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 12px;
        margin-bottom: 8px;
        height: 80px;
      }
      .card-left {
        display: flex;
        align-items: center;
      }
      .avatar {
        position: relative;
        image {
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
        }
        span {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          width: 24;
          height: 10px;
          background: #2E2A1C;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 500;
          font-size: 8px;
          color: rgba(255, 255, 255, 0.4);
        }
      }
      .info {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 10px;
        line-height: 110%;
        color: rgba(255, 255, 255, 0.6);
        margin-left: 12px;
      }
      .info-title {
        font-size: 11px;
      }
      .info-middle {
        display: flex;
      }
      .info-status {
        color: #CCBC91;
      }
      .button {
        background: linear-gradient(180deg, rgba(204, 188, 145, 0) 0%, #CCBC91 100%);
        opacity: 0.6;
        font-family: 'Source Han Serif CN';
        font-style: normal;
        font-weight: 900;
        font-size: 13px;
        line-height: 110%;
        color: #F3E6C1;
        border: 1px solid rgba(204, 188, 145, 0.4);
        padding: 4px 25px;
      }
    }
  }
}
</style>