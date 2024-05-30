<template>
  <div class="gamePlayer">
    <view class="gamePlayer__bg">
      <view class="mask" />
    </view>
    <view class="gamePlayer__header">
      <image src="../static/back.png" mode="widthFix" @click="cancelGame" />
      <div class="title">{{ gameInfo.dramaName }}</div>
      <span>房间编号：{{ gameInfo.roomId }}</span>
    </view>
    <view class="content">
      <view v-if="current === 1">
        <DMPage1 class="userPopup" :current.sync="current" />
      </view>
      <view v-if="current === 2">
        <DMPage2 class="userPopup" @changeClueSwiper="changeClueSwiper" />
      </view>
      <view v-if="current === 3">
        <DMPage3 @stopAudio="stopAudio" @on-clue="onGoClue" ref="DMPage3"/>
      </view>
      <view v-if="current === 4">
        <DMPage4 class="userPopup" @changeClueSwiper="changeClueSwiper" ref="DMPage4"/>
      </view>
      <view>
        <DMPage5 ref="audio" :current.sync="current" />
      </view>
      <view v-if="current === 6">
        <DMPage6 ref="DMPage6"/>
      </view>
    </view>
    <view class="bottomMenu" v-if="current != 1">
      <bottomMenu :current.sync="current" @queryList="queryList" />
    </view>
    <div
      class="closeMenu"
      @click="closeGame"
      v-if="current == 2 || current == 1"
      :class="current == 1 ? 'fixed':''"
    >
      <image src="../static/icon-end.png" />
      <span>解散房间</span>
    </div>
    <image
      class="img2"
      @click="handleOptions('refresh')"
        src="../static/refresh.png"
      mode="widthFix"
      :class="current == 1 ? 'fixed-right':''"
      v-if="current == 1"
    />
    <!-- 线索swiper 层级 2 -->
    <ClueSwiper
      :list="list"
      ref="clueSwiper"
      type="DM"
      :currentValue.sync="currentClueIndex"
      @openTransfer="handleTransfer"
      class="zIndex999"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { backMurderMysteryList } from '@/utils/index';
import bottomMenu from "../components/bottomMenu.vue";
import DmTitle from "../components/DmTitle.vue";
import DMPage1 from "../components/DMPage1.vue";
import DMPage2 from "../components/DMPage2.vue";
import DMPage3 from "../components/DMPage3.vue";
import DMPage4 from "../components/DMPage4.vue";
import DMPage5 from "../components/DMPage5.vue";
import DMPage6 from "../components/DMPage6.vue";
import ClueSwiper from "@/components/ClueSwiper";
import service from "@/services/game.js";
let WebIM = (wx.WebIM = require("@/WebIM/WebIM")["default"]);
let SID = uni.getStorageSync("SID") && JSON.parse(uni.getStorageSync("SID"));

export default {
  components: {
    bottomMenu,
    DmTitle,
    DMPage1,
    DMPage2,
    DMPage3,
    DMPage4,
    DMPage5,
    DMPage6,
    ClueSwiper
  },
  data() {
    return {
      loginId: SID.loginId || null,
      page: 2,
      position: null,
      current: 1,
      nextType: "initial",
      list: [],
      currentClueIndex: 0,
      // isChangeSeat: false
    };
  },
  computed: {
    ...mapState("dm", [
      "gameInfo",
      "roundInfo",
      "publicClues",
      "dmClues",
      "privateClues",
      "currentRoundId"
    ]),
  },
  onShareAppMessage() {
    return {
      title: `${this.gameInfo.dramaName}+${this.gameInfo.roomId}`,
      path: `/game-player/pages/index?id=${this.gameInfo.id}&roomId=${this.gameInfo.roomId}&storeId=${this.gameInfo.storeId}`,
      imageUrl: this.gameInfo.dramaCover,
    };
  },
  async onLoad(options) {
    if(options.storeId){
      await this.getShopInfo(options.storeId);
    }

    await this.getUserInfo();
    
    //监听消息返回
    //注册IM
    await this.registerIM_user();
    let that = this;
    WebIM.conn.listen({
      onCmdMessage(message) {
        let Res = message.ext.content.split("-");
        console.log("DM", Res, that.gameInfo.roomId);
        if (Res[1] == that.gameInfo.roomId) {
          if (Res[0] == "0X00031") {
            uni.showModal({
              title: "房间已关闭",
              showCancel: false,
              success() {
                wx.reLaunch({
                  url: '/manage/pages/index'
                })
              },
            });
            return;
          }
          let res = message.ext.content.split("/");
          console.log("res---", res[2]);
          if (res[2] == "getRoomUsers") {
            that.getRoomUsers({
              murderMysteryOnlineRecordId: that.gameInfo.id,
            });
          } else if (res[2] == "takeSeat") {
            that.getRolePlayers();
          } else if (res[2] == "getRolePlayers") {
            that.getRolePlayers();
          } else if (res[2] == "getDmClues") {
            // that.getDmClues();
          } else if (res[2] == "getPrivateClues") {
            // 用户的私有线索前端不走透传，自己控制
            that.getRolePlayers(); // 用户私有线索被收回这时候刷新page2的用户列表
          } else if (res[2] == "getPublicClues") {
            // 公开线索
            that.getPublicClues();
          } else if (res[2] == "getQuestionList") {
            // 问答题列表
            that.queryQuestionList();
          } else if (res[2] == "getCurrentJigsawList"){
            //刷新拼图列表
            that.$refs.DMPage6.refreshJigsaw();
          } else if (res[2] == "getAllGuess"){
            //刷新解密列表
            that.$refs.DMPage3.queryPasswordResult();
          }
        }
      },
    });
  },
  onReady() {},
  onShow() {},
  onHide() {},
  watch: {
    "gameInfo.roomStatus": {
      handler(newName, oldName) {
        console.log("newName----", newName);
        if (newName === "CREATING") {
          this.current = 1;
        } else if (newName === "PLAYING") {
          this.current = 2;
        }
      },
      immediate: true,
    },
    current(newData) {
      console.log('current', newData);
      if (newData === 2) {
        this.getPublicClues();
        this.getRoundInfo();
        this.getRolePlayers();
      } else if(newData === 4) {
        this.getDmClues({
          roundId: this.currentRoundId || -1
        })
        this.$nextTick((_) => {
          this.$refs.DMPage4.changeMenu()
        });
      } else if(newData === 6) {
        this.isShowToolIcon()
      }
    },
  },
  methods: {
    ...mapActions("dm", [
      "getUserInfo",
      "getRoundInfo",
      "getPublicClues",
      "getPrivateClues",
      "checkOnlineGame",
      "getRolePlayers",
      "getRoomUsers",
      "getDmClues",
      "queryQuestionList",
      "isShowToolIcon",
      'getSeatInfo',
    ]),
    ...mapMutations("dm", ["setGameInfo", "setSeatInfo", "setRolePlayersList","setRolePlayersStash","RESET_STATE"]),
    //注册IM用户
    registerIM_user() {
      //初始化IM
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: `test-im${this.loginId}`,
        pwd: "123456",
        grant_type: "password",
        appKey: WebIM.config.appkey,
      });
    },
    handleOptions(){
      this.checkOnlineGame()
      this.getSeatInfo();
    },
    cancelGame() {
      uni.showModal({
        title: "点击‘继续’",
        content: "将返回‘开本列表’，但不会关闭游戏",
        confirmText: "继续",
        showCancel: true,
        cancelText: "取消",
        success: async (res) => {
          if (res.confirm) {
            backMurderMysteryList();
          }
        },
      });
    },
    closeGame() {
      uni.showModal({
        title: "确认关闭",
        content: "点击确认关闭将解散房间？",
        confirmText: "确定",
        showCancel: true,
        cancelText: "取消",
        success: async (res) => {
          if (res.confirm) {
            if (this.gameInfo.roomStatus === "CREATING") {
              this.terminatePreGame();
            } else if (this.gameInfo.roomStatus === "PLAYING") {
              this.terminateGame();
            }
            this.RESET_STATE();
            // this.setSeatInfo([]);
            // this.setRolePlayersList([]);
            // this.setRolePlayersStash([])
          }
        },
      });
    },
    onGoClue(v){
      this.current = 4;
    },
    // 开始游戏前结束游戏
    async terminatePreGame() {
      const res = await service.terminatePreGame({
        murderMysteryOnlineRecordId: this.gameInfo.id,
      });
      backMurderMysteryList();
      
    },
    // 开始游戏后-结束游戏
    async terminateGame() {
      const res = await service.terminateGame({
        murderMysteryOnlineRecordId: this.gameInfo.id,
      });
      backMurderMysteryList();
    },
    changeClueSwiper(obj) {
      const { clueId, type } = obj;
      console.log("changeClueSwiper", obj);

      // this.currentClueId = clueId
      if (type === "page2") {
        this.list = Object.assign([], this.publicClues);
      } else if (type === "page4") {
        this.list = Object.assign([], this.dmClues);
      } else if (type === "pageUser") {
        this.list = Object.assign([], this.privateClues);
        // console.log('changeClueSwiper', this.list);
      }
      this.currentClueIndex = this.list.findIndex((item) => item.id == clueId);
      this.$refs.clueSwiper.open(this.gameInfo.storeNumber);
    },
    //换座位
    // changeSeat(){
    //   this.isChangeSeat = true;
    // }
    queryList() {
      this.$refs.audio.queryList();
    },
    stopAudio() {
      this.$refs.audio.innerAudioContext.pause();
    },
    async getShopInfo(storeId) {
      if (!uni.getStorageSync("shopInfo")) {
        let shopInfo = await this.$api.getStoreHome({
           storeId 
         }
        );
        uni.setStorageSync("storeId", shopInfo.id);
        uni.setStorageSync("shopInfo", JSON.stringify(shopInfo));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gamePlayer {
  height: 100vh;
  // padding-left: 4vw;
  &__bg {
    position: fixed;
    z-index: -1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    // background: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1pLfuURaYoI4IPc-nP0OjcXi6tAeox5Wg-OihIAv13RQkrjnSh-3LY8RJyu4TLJcauAo&usqp=CAU")
    //   no-repeat center;
    // background-size: 100%;
    .mask {
      background: rgba(28, 41, 46, 0.8);
      width: 100vw;
      height: 100vh;
    }
  }
  &__header {
    padding-top: 7.3vh;
    text-align: center;
    margin-bottom: 20px;
    image {
      width: 30px;
      position: absolute;
      left: 0px;
      top: 5.9vh;
      padding: 20px;
    }
    .title {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      color: #ffffff;
    }
    span {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 17px;
      color: rgba(255, 255, 255, 0.6);
      display: inline-block;
    }
  }
}
.userPopup {
  /deep/ .van-popup {
    height: 58vh !important;
    background: #1c292e !important;
  }
  /deep/ .van-popup__close-icon {
    color: #ccbc91;
    z-index: 2;
  }
}

.zIndex999 {
  position: relative;
  z-index: 999;
}
.closeMenu {
  margin-top: rpx(-38);
  width: rpx(100);
  height: rpx(45);
  @include ver;
  align-items: center;
  image {
    width: rpx(24);
    height: rpx(24);
  }
  span {
    margin-top: rpx(4);
    font-size: rpx(12);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 14px;
  }
}
.fixed{
  position: fixed;
  left: rpx(0);
  bottom: 13vh;
}
.fixed-right{
  position: fixed;
  right: rpx(20);
  bottom: 11.8vh;
}
.img2 {
  width: 24px;
  padding: 12px;
}
</style>
