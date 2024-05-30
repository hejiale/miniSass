<template>
  <div class="gamePlayer" >
    <!-- 背景 层级 -1 -->
    <div class="bgImg">
      <image :src="dramaItem.backgroundUrl" mode="aspectFill" lazy-load/>
      <div class="bgImg__opacity"></div>
    </div>
    <!-- 顶部刷新等按钮 层级 20（最高） -->
    <div class="fixed zIndex2" :style="{paddingTop: `${statusHeight}px`}">
      <GameTop v-if="currentPage === 1 || currentPage === 2" />
      <!-- 等待DM开始 层级 1 -->
      <GameIntroduce class="fixed zIndex2" v-if="currentPage === 1" />
      <!-- 玩家选角 层级 1 -->
      <GameSwiper class="fixed zIndex2"  v-else-if="currentPage === 2" />
    </div>
    <!-- 游戏线索 层级 1 -->
    <div :style="{paddingTop: `${statusHeight}px`}" class="zIndex3 relative" >
      <GameClue
        v-if="currentPage === 3"
        @changeClueSwiper="changeClueSwiper"
        ref="GameClue"
      />
    </div>
    <!-- 线索swiper 层级 2 -->
    <ClueSwiper
      :list="list"
      ref="clueSwiper"
      :currentValue.sync="currentClueIndex"
      :clueType="clueType"
      @openTransfer="handleTransfer"
    />
    <!-- 线索转让 层级 3 -->
    <GameTransfer
      v-if="transferVisible"
      :clueId="currentClueId"
      @closeTransfer="handleTransfer"
      class="fixed zIndex3"
    />
    <BindPhone
      @on-success-authorize="onSuccessAuthorize"
      paddingBottom="11vh"
      class="zIndexBind"
      v-if="!userInfo.phone"
    ></BindPhone>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
let WebIM = (wx.WebIM = require("@/WebIM/WebIM")["default"]);
import GameIntroduce from "../components/GameIntroduce.vue";
import GameSwiper from "../components/GameSwiper.vue";
import GameTop from "../components/GameTop.vue";
import GameClue from "../components/GameClue.vue";
import ClueSwiper from "@/components/ClueSwiper";
import GameTransfer from "../components/GameTransfer.vue";
import BindPhone from "@/components/transverseBindPhone/index.vue";
export default {
  components: {
    GameIntroduce,
    GameSwiper,
    GameTop,
    GameClue,
    ClueSwiper,
    GameTransfer,
    BindPhone,
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      currentClueIndex: 0,
      currentClueId: null,
      transferVisible: false,
      clueType: "public",
      statusHeight: 0,
      navHeight: 0
    };
  },
  async onLoad(options) {
    wx.showLoading();

    this.getBarHeight()

    if(options){
      this.setOptions(options)
      this.setMurderMysteryOnlineRecordId(Number(options.id));

      await this.getUserInfo();
      await this.registerIM();
      // await this.getShopInfo(options.storeId);
    }
  },
  onShow() {},
  onHide() {
    if(this.$refs.GameClue){
      this.$refs.GameClue.clearAudio();
    }
  },
  onShareAppMessage() {
    return {
      title: `${this.dramaItem.dramaName}+${this.roomInfo.roomId}`,
      path: `/game-player/pages/index?id=${this.roomInfo.id}&roomId=${this.roomInfo.roomId}&storeId=${this.roomInfo.storeId}`,
      imageUrl: this.dramaItem.dramaCover,
    };
  },
  watch: {
    "roomInfo.gameStatus": {
      handler(newName, oldName) {
        if (newName === "CHOOSE_SEAT") {
          this.currentPage = 1;
        } else if (newName === "CHOOSE_ROLE") { 
          // 座位上满DM开始选角完
          this.currentPage = 2;
          this.getRolePlayers();
        } else if (newName === "PLAYING") {
          this.currentPage = 3;
          this.getRolePlayers();
          this.getToolList();
          this.getPublicClues();
          this.getPrivateClues();
          this.getCurrentRoundInfo()
        }
      },
      immediate: true,
    },
    // "roomInfo.storeId": {
    //   handler(newName, oldName) {
    //     if(newName) this.getShopInfo(newName|| 5381);
    //   },
    //   immediate: true,
    // }
  },
  computed: {
    ...mapState("player", [
      "userInfo",
      "murderMysteryOnlineRecordId",
      "options",
      "roomInfo",
      "publicClues",
      "privateClues",
      "dramaItem",
      "jigsawList",
      "trueJigsawList",
    ]),
  },
  methods: {
    ...mapActions("player", [
      "getUserInfo",
      "getPublicClues",
      "getPrivateClues",
      "checkOnlineRoom",
      "getRolePlayers",
      "getToolList",
      "getJigsawCurrentList",
      "getCurrentRoundInfo"
    ]),
    ...mapMutations("player", [
      "setUserInfo",
      "setMurderMysteryOnlineRecordId",
      "setOptions",
      "setIsJigsawSuccess",
      "RESET_STATE"
    ]),
    //注册IM用户
    registerIM_user() {
      //初始化IM
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: `test-im${this.userInfo.id || SID.loginId}`,
        pwd: "123456",
        grant_type: "password",
        appKey: WebIM.config.appkey,
      });
    },
    changeClueSwiper(obj) {
      const { clueId, type } = obj;
      // this.currentClueId = clueId
      if (type === "public") {
        this.list = Object.assign([], this.publicClues);
      } else if (type === "private") {
        this.list = Object.assign([], this.privateClues);
      }
      this.clueType = type;
      this.currentClueIndex = this.list.findIndex((item) => item.id == clueId);
      this.$refs.clueSwiper.open(this.roomInfo.storeNumber);
    },
    handleTransfer(obj) {
      (this.transferVisible = obj.visible), (this.currentClueId = obj.clueId);
      if (!obj.clueSwiper) {
        this.$refs.clueSwiper.close();
      }
    },
    //授权成功后，重新获取用户信息
    onSuccessAuthorize() {
      this.getUserInfo({needRefresh: true});
      this.registerIM();
    },
    registerIM() {
      //监听消息返回
      //注册IM
      this.registerIM_user();
      let that = this;
      WebIM.conn.listen({
        async onCmdMessage(message) {
          console.log(message)
          let Res = message.ext.content.split("-");
     
          if (Res[1] == that.options.roomId) {
            if (Res[0] == "0X0003") {
              // 游戏推送协议
              that.currentPage = 3;
              that.getPublicClues();
            } else if (Res[0] == "0X00031") {
              uni.showModal({
                title: "主持人已解散房间",
                showCancel: false,
                success() {
                  uni.switchTab({
                    url: "/pages/index/index",
                  });
                  that.RESET_STATE()
                },
              });
            } else if (Res[0] == "0X00021") {
              // 游戏前进入房间透传
              console.log("游戏前进入房间透传");
              that.getRolePlayers();
              setTimeout(() => {
                that.currentPage = 2;
              }, 10);
            } else if (Res[0] == "0X00023") {
              console.log("多余用户被踢出房间");
              uni.showToast({
                title: "房间已关闭",
                icon: "none",
                duration: 3000,
              });
              that.RESET_STATE()
              setTimeout(() => {
                uni.switchTab({
                  url: "/pages/index/index",
                });
              }, 500);
            } else if (Res[0] == "0X00028") {
              that.$nextTick((_) => {
                that.$refs.GameClue.onPassword();
              })
            } else if (Res[0] == "0X00029") {
              if(that.$refs.GameClue){
                that.$refs.GameClue.refreshNextRound();
              }
            } else {
              let res = message.ext.content.split("/");
              console.log("message---", res[2]);
              if (res[2] == "getPublicClues") {
                that.getPublicClues();
                that.getCurrentRoundInfo()
              } else if (res[2] == "getPrivateClues") {
                that.getPrivateClues();
                that.getCurrentRoundInfo()
              } else if (res[2] == "getRolePlayers") {
                that.checkOnlineRoom();
              } else if (res[2] == "getToolList") {
                that.getToolList();
              } else if (res[2] == "takeSeat") {
                that.getRolePlayers();
              } else if (res[2] && res[2].includes("getCurrentJigsaw")) {
                let id = res[2].split("?");
                await that.getJigsawCurrentList({
                  jigsawId: Number(id[1]),
                  murderMysteryOnlineRecordId: Number(that.options.id),
                });
                that.success();
              }
            }
          }
        },
      });
    },
    //判断拼图是否完成
    success() {
      let bool = true;
      this.trueJigsawList && this.trueJigsawList.jigsawGameItem && this.trueJigsawList.jigsawGameItem.blockItemList.length && this.trueJigsawList.jigsawGameItem.blockItemList.map((v, i) => {
        if (v.id != this.jigsawList.jigsawGameItem.blockItemList[i].id) {
          bool = false;
        }
      });
      if (bool) this.setIsJigsawSuccess(true);
      else this.setIsJigsawSuccess(false);
    },
    // async getShopInfo(storeId) {
    //   if (!uni.getStorageSync("shopInfo")) {
    //     let shopInfo = await this.$api.getStoreHome({
    //        storeId 
    //      }
    //     );
    //     uni.setStorageSync("storeId", shopInfo.id);
    //     uni.setStorageSync("shopInfo", JSON.stringify(shopInfo));
    //   }
    // },
    getBarHeight() {
      const res = wx.getMenuButtonBoundingClientRect()
      // const statusHeight = res.top //胶囊距离顶部
      const statusHeight = 10;
      const navHeight = res.height //胶囊高度
      this.statusHeight = statusHeight
      this.navHeight = navHeight
    }
  },
};
</script>

<style lang="scss" scoped>
.fixed {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.relative{
  position: relative;
}
.zIndex2 {
  z-index: 2;
}
.zIndex3 {
  z-index: 3;
}
.zIndex100 {
  z-index: 100;
}
.zIndexBind {
  z-index: 1000;
  @include abscenter
}
.gamePlayer {
  box-sizing: border-box;
  &__leftIcon {
    width: 200px;
    height: 200px;
  }
}

.bgImg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -2;
  image {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: -2;
  }
  &__opacity {
    width: 100%;
    height: 100%;
    z-index: -1;
    position: fixed;
    background: rgba(28, 41, 46, 0.8)
  }
}
</style>
