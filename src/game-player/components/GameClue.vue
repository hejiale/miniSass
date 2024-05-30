<template>
  <div class="gameClue">
    <header>
      <div class="title" @click="handleClose">
        <image src="../static/clue/back.png"  />
        <span v-if="currentRoundInfo.roundName">{{ currentRoundInfo.roundName }}</span>
      </div>
      <div class="user" v-if="!gameSubType">
        <div v-show="userRole.roleAvatar" class="avatar"  :style="{backgroundImage:'url(' +userRole.roleAvatar+ ')'}"></div>
        <span>{{userRole.roleName}}</span>
      </div>
    </header>
    <section class="gameClue__content">
      <view class="left" v-if="isGameSub" :style="leftMenuType === 'search' ? 'width: 14vw;':'width: 24vw;'">
        <div class="left__tap">
          <div
            class="item"
            v-for="v in leftTabList"
            :key="v.id"
            @click="handleLeftMenu(v.type)"
          >
            <image
              :src="leftMenuType === v.type ? v.activeUrl : v.url"
              mode="widthFix"
            />
            <!-- <image class="tips" src="../static/clue/tips.png" mode="widthFix" /> -->
          </div>
        </div>
        <div class="left-clues">
          <div class="left__list" v-if="leftMenuType === 'clues'">
            <image
              class="left__leftActive"
              :style="{ top: leftTab * 47 + 5 + 'px' }"
              :src="$iconFont.getIconName('leftActive')"
              mode="widthFix"
            />
            <div
              class="left__nav"
              :class="clueTab === 'public' ? 'active' : ''"
              @click="handleClueTab('public', 0)"
            >
              公开线索
            </div>
            <div
              class="left__nav"
              :class="clueTab === 'private' ? 'active' : ''"
              @click="handleClueTab('private', 1)"
            >
              私有线索
            </div>
          </div>
          <div class="left__list toolNavList" v-if="leftMenuType === 'game'">
            <!-- <image class="left__leftActive" :style="{'top':(gameTab*47-12) + 'px' }" src="../static/clue/leftActive.png" mode="widthFix" /> -->
            <div
              class="left__nav toolNav"
              v-for="(v, i) in toolList"
              :class="gameTab === i ? 'active' : ''"
              @click="handleGameTab(i, v.toolId, v.toolType)"
              :key="i"
            >
              <span class="toolNav-name">{{ toolData[v.toolType] }}</span>
              <span>{{ v.toolName }}</span>
            </div>
          </div>
          <div class="left__line"></div>
        </div>
      </view>
      <view class="middle" v-if="leftMenuType === 'clues'">
        <div class="page1">
          <div class="page1__tab">
            <div
              class="page1__nav"
              v-for="v in middleTabList"
              :key="v.id"
              @click="handleMiddleTab(v)"
            >
              <image
                :src="middleTab === v.id ? v.activeUrl : v.url"
                mode="widthFix"
              />
            </div>
          </div>
          <div  v-if="clueTab === 'public'">
           <div v-if="publicClues.length" class="page1__list">
              <ClueCard
                v-for="v in publicClues"
                :key="v.id"
                @handleClick="handleCard(v.id, 'public')"
                :dataSource="v"
              />
            </div>
            <div v-else>
              <div class="empty">
						   <image class="bgIMG" src="../static/clue/clueEmpty.png" mode="aspectFill" />
              </div>
            </div>
          </div>
          <div  v-else-if="clueTab === 'private'">
           <div v-if="privateClues.length" class="page1__list">
              <ClueCard
                v-for="v in privateClues"
                :key="v.id"
                @handleClick="handleCard(v.id, 'private')"
                :dataSource="v"
              />
            </div>
            <div v-else>
              <div class="empty">
						   <image class="bgIMG" src="../static/clue/clueEmpty.png" mode="widthFix" />
              </div>
            </div>
          </div>
        </div>
      </view>
      <div class="page3" v-if="leftMenuType === 'game'">
        <ClueQuestion
          v-if="gameSubType === 'QUESTION' || gameSubType === 'VOTE'"
          ref="question"
          :dataSource="questionData"
          @handleClose="handleClose"
        />
        <ClueSynthesis
          ref="roll"
          v-else-if="gameSubType === 'ROLL'"
          :dataSource="rollData"
          @handleClose="handleClose"
        />
        <ClueJigsaw ref="jigsaw" :dataSource="questionData" v-else-if="gameSubType === 'JIGSAW'"/>
        <div class="empty" v-if="!toolList || !toolList.length">
          <image class="bgIMG" src="../static/clue/gameEmpty.png" mode="aspectFill" />
        </div>
      </div>
      <div class="page2" v-else-if="leftMenuType === 'search'">
        <div v-if="!showSuccessPassword && !showPassword">
          <div class="page2__tab" v-if="isEmail || isPassword">
            <div class="page2__nav">
              <image src="../static/clue/allActive.png" mode="widthFix" />
            </div>
            <div class="page2-list">
              <div class="card" @click="toUrl" v-if="isEmail">
                <image src="../static/clue/phoneCard.png" mode="widthFix" />
                <div class="name">手机</div>
              </div>
              <div class="card" v-if="isPassword" @click="onPassword">
                <image :src="passwordInfo.enterUrl" mode="widthFix" />
                <div class="name">{{passwordInfo.name}}</div>
              </div>
            </div>
          </div>
          <div class="empty" v-else>
            <image class="bgIMG" src="../static/clue/emptySouzheng.png" mode="aspectFill" />
          </div>
        </div>
        <CluePassword  @showKeyboard="onShowKeyboard" @on-success="onPassword" v-if="showPassword"/>
        <CludSuccessPassword :roleName="successRoleName" v-if="showSuccessPassword" @hide="handleClose"/>
      </div>
      <view class="right" v-if="!hideRight">
        <div class="right__box">
          <div class="right__option">
            <image
              class="right__bg"
              mode="heightFix"
              src="../static/clue/rightSide.png"
            />
            <div class="right__top">
              <image
                v-show="!roomInfo.isRaiseHand"
                @click="handleHand(true)"
                src="../static/clue/hand.png"
                mode="widthFix"
              />
              <image
                v-show="roomInfo.isRaiseHand"
                @click="handleHand(false)"
                src="../static/clue/handActive.png"
                mode="widthFix"
              />
            </div>
            <div class="right__middle"></div>
            <div class="right__bottom" @click="handleRefresh">
              <image src="../static/clue/refresh.png" mode="widthFix" />
            </div>
          </div>
        </div>
      </view>
    </section>
    <image class="logo" :src="dramaItem.logoUrl"  v-if="!showSuccessPassword && !showPassword && !gameSubType" mode="aspectFill"/>
  </div>
</template>

<script>
import ClueCard from "./ClueCard.vue";
import ClueQuestion from "./ClueQuestion.vue";
import ClueJigsaw from "./ClueJigsaw.vue";
import ClueSynthesis from "./Synthesis.vue";
import CluePassword from "./CluePassword.vue";
import CludSuccessPassword from "./ClueSuccessPassword.vue";
import { mapState, mapMutations, mapActions } from "vuex";
import service from "@/services/game.js";
export default {
  components: {
    ClueCard,
    ClueQuestion,
    ClueJigsaw,
    ClueSynthesis,
    CluePassword,
    CludSuccessPassword
  },
  data() {
    return {
      clueTab: "public", // 右上角线索索引
      leftTab: 0, // 左侧菜单索引
      middleTab: 0, // 中间线索内容索引
      isHand: false, // 是否举手
      leftMenuType: "clues",
      gameTab: -2,
      jigsawId: null,
      middleTabList: [
        {
          id: 0,
          url: require("../static/clue/all.png"),
          activeUrl: require("../static/clue/allActive.png"),
          type: "all",
        },
        {
          id: 1,
          url: require("../static/clue/picture.png"),
          activeUrl: require("../static/clue/pictureActive.png"),
          type: "IMAGE",
        },
        {
          id: 2,
          url: require("../static/clue/text.png"),
          activeUrl: require("../static/clue/textActive.png"),
          type: "TEXT",
        },
        {
          id: 3,
          url: require("../static/clue/video.png"),
          activeUrl: require("../static/clue/videoActive.png"),
          type: "VIDEO",
        },
        {
          id: 4,
          url: require("../static/clue/music.png"),
          activeUrl: require("../static/clue/musicActive.png"),
          type: "AUDIO",
        },
      ],
      leftTabList: [
        {
          id: 0,
          url: require("../static/clue/clues.png"),
          activeUrl: require("../static/clue/cluesActive.png"),
          type: "clues",
        },
        {
          id: 1,
          url: require("../static/clue/search.png"),
          activeUrl: require("../static/clue/searchActive.png"),
          type: "search",
        },
        {
          id: 2,
          url: require("../static/clue/game.png"),
          activeUrl: require("../static/clue/gameActive.png"),
          type: "game",
        },
      ],
      toolData: {
        JIGSAW: "拼图",
        QUESTION: "答题",
        VOTE: "投票",
        PHONE: "手机",
        ROLL: "随机工具",
      },
      gameSubType: null,
      isGameSub: true,
      questionData: {},
      rollData: {}, // 随机工具
      showPassword: false,
      showSuccessPassword: false,
      hideRight: false,
      successRoleName: null
    };
  },
  created() {
    this.$nextTick(() => {
      this.getPublicClues();
      this.getRoundInfo();
    });
  },
  computed: {
    ...mapState("player", [
      "userInfo",
      "murderMysteryOnlineRecordId",
      "options",
      "publicClues",
      "privateClues",
      "roomInfo",
      "dramaItem",
      "toolList",
      "jigsawList",
      "isEmail",
      "isPassword",
      "passwordInfo",
      "userRole",
      "currentRoundInfo"
    ]),
  },
  methods: {
    ...mapMutations("player", ["setClueType","setIsPassword"]),
    ...mapMutations("dm", ["setPhoneData", "setEmailData"]),
    ...mapActions("player", [
      "getPublicClues",
      "getPrivateClues",
      "checkOnlineRoom",
      "getJigsawCurrentList",
      "getToolList",
      "getRoundInfo",
      "getCurrentRoundInfo"
    ]),
    onShowKeyboard(){
      setTimeout(() => {
        this.hideRight = !this.hideRight;
      }, 150);
    },
    handleClueTab(type, index) {
      this.clueTab = type;
      this.leftTab = index;
      if (type === "public") {
        this.getPublicClues();
      } else if (type === "private") {
        this.getPrivateClues();
      }
    },
    handleLeftMenu(type) {
      console.log('type', type);
      this.leftMenuType = type;
      if(type === 'search'){
        this.getCurrentRoundInfo();
      }
    },
    handleMiddleTab(v) {
      this.middleTab = v.id;
      this.setClueType(v.type);
      setTimeout(() => {
        if (this.clueTab === "public") {
          this.getPublicClues();
        } else {
          this.getPrivateClues();
        }
      }, 10);
    },
    refreshNextRound(){
      this.hideRight = false;
      if(this.leftMenuType === "game"){
        this.handleClose();
      }
      this.getCurrentRoundInfo();
    },
    // 举手
    async handleHand(v) {
      // TODO: 加一个防抖
      uni.showLoading();
      this.isHand = v;
      try{
        if (v) {
          //举手
          await service.raiseHand({
            murderMysteryOnlineRecordId: this.options.id,
            userId: this.userInfo.id,
          });
        } else {
          //取消举手
          await service.lowerHand({
            murderMysteryOnlineRecordId: this.options.id,
            userId: this.userInfo.id,
          });
        }
        this.checkOnlineRoom();
        uni.hideLoading();
      }catch(e){
        console.log(e)
        uni.hideLoading();
      }
    },
    handleCard(clueId, type) {
      this.$emit("changeClueSwiper", {
        clueId,
        type,
      });
    },
    handleGameTab(index, toolId, type) {
      this.gameTab = index;
      this.gameSubType = type;
      switch (type) {
        case "QUESTION":
          this.getQuestionList(toolId);
          break;
        case "VOTE":
          this.getVoteList(toolId);
          break;
        case "JIGSAW":
          this.getJigsawList(toolId);
          break;
        case "PHONE":
          this.getCommunicate(toolId);
          break;
        case "ROLL":
          this.getRollItem(toolId);
          break;
        default:
      }
    },
    async getJigsawList(jigsawId) {
      this.jigsawId = jigsawId;
      await this.getJigsawCurrentList({
        jigsawId: jigsawId,
        murderMysteryOnlineRecordId: Number(this.options.id),
      });
      //   const res = await service.getCurrentJigsaw({

      //   });
      this.isGameSub = false;
      this.questionData = Object.assign({ type: "jigsaw", toolId: jigsawId });
      this.$refs.jigsaw.open();
      this.$nextTick(() => {
        this.$refs.jigsaw.queryUserList(jigsawId);
        this.$refs.jigsaw.queryTrueJigsawList(jigsawId);
      });
    },
    async getQuestionList(questionId) {
      const res = await service.getQuestionList({
        murderMysteryOnlineRecordId: Number(this.options.id),
        questionId: questionId,
        userId: this.userInfo.id,
      });
      
      this.isGameSub = false;
      let index = res.findIndex(v=>v.id === questionId);
      let answerArr= []
      if(res[index].isAnswer) {
       const answerList = await service.getAnswerList({
          murderMysteryOnlineRecordId: Number(this.options.id),
          questionId,
          userId: this.userInfo.id
        });
     
        let arr = answerList[0].answerList || []
        arr.length && arr.map((v)=>{
          answerArr.push(v.id)
        })
      }
      this.questionData = Object.assign({ type: "question",optionIds: answerArr }, res[index]);
      console.log('detail', this.questionData);
      this.$refs.question.open();
    },
    handleClose() {
      if (this.leftMenuType === "game" || (this.showSuccessPassword || this.showPassword)) {
        if (this.gameSubType === "QUESTION" || this.gameSubType === "VOTE") {
          this.$refs.question.close();
        } else if (this.gameSubType === "ROLL") {
          this.$refs.roll.close();
        } else if (this.gameSubType === "JIGSAW") {
          this.$refs.jigsaw.close();
        }else{
          this.showSuccessPassword = false;
          this.showPassword = false;
        }
        this.isGameSub = true;
        this.gameSubType = null;
      } else {
        wx.switchTab({
          url: "/pages/index/index",
        });
      }
    },
    async getVoteList(voteId) { 
      const res = await service.getVoteList({
        murderMysteryOnlineRecordId: Number(this.options.id),
        voteId,
        userId: this.userInfo.id,
      });
      this.isGameSub = false;
      let index = res.findIndex(v=>v.id === voteId);

      this.questionData = Object.assign({ type: "vote" }, res[index]);
      this.$refs.question.open();
    },
    async getCommunicate(communicateId) {
      const res = await service.getCommunicate({
        murderMysteryOnlineRecordId: Number(this.options.id),
        communicateId,
      });
      this.setPhoneData(res.communicateItem);
      uni.navigateTo({
        url: `/game-DM/pages/playerPhone`,
      });
    },
    async getRollItem(rollId) {
      const res = await service.getRollItem({
        murderMysteryOnlineRecordId: Number(this.options.id),
        rollId,
        userId: this.userInfo.id,
      });
      this.isGameSub = false;
      this.rollData = res;
      this.$refs.roll.open();
    },
    async toUrl() {
      const res = await service.getUserEmailList({
        userId: this.userInfo.id,
        roomId: this.options.roomId,
      });
      if (res.length) {
        this.setEmailData(res);
        uni.navigateTo({
          url: `/game-DM/pages/playerEmail`,
        });
      } else {
        uni.showToast({
          title: "暂无邮箱搜证",
          icon: 'none'
        });
      }
    },
    handleRefresh() {
      uni.showLoading();
      this.getToolList();
      this.getPublicClues();
      this.getPrivateClues();
      this.getRoundInfo();
      if (this.jigsawId) {
        this.getJigsawCurrentList({
          jigsawId: this.jigsawId,
          murderMysteryOnlineRecordId: Number(this.options.id),
        });
      }
      if(this.showPassword){
        this.onPassword();
      }
      setTimeout(() => {
        uni.hideLoading();
      }, 500);
      // this.gameSubType = null;
      // this.isGameSub = true;
      // this.$refs.question.close()
      // this.$refs.roll.close()
    },
    async onPassword(){
      if(this.currentRoundInfo.roundType === 'PASSWORD_DECRYPTION'){ 
        try{
          let res = await service.getGuessStatus({
            murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
            passwordDecryptionItemId: this.passwordInfo.id
          })
          this.isGameSub = false;
          this.showPassword = false;
          this.showSuccessPassword = false;
          
          if(res.flag){
            this.successRoleName = res.roleName;
            this.showSuccessPassword = true;
          }else{
            this.showPassword = true;
          }
        }catch(e){

        }
      }else{
        uni.showToast({
          title: "暂未开启回合",
          icon: 'none'
        });
      }
      
    },
    clearAudio(){
      if(this.$refs.question){
        this.$refs.question.audioDestroy();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.gameClue {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 0 158px 0 33px;
    position: fixed;
    left: 33px;
    right: 158px;
    // margin-bottom: 14px;
    font-family: "PingFang SC";
    font-style: normal;
    font-size: 14px;
    line-height: 17px;
    z-index: 1;
    .title {
      font-weight: 600;
      color: rgba(238, 230, 212, 0.8);
      display: flex;
      align-items: center;
      image {
        margin-right: 7px;
        width: 24px;
        height: 24px;
      }
    }
    .user {
        display: flex;
        align-items: center;
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-position: top;
          background-size: cover;
          /* background-color: #E83A3A; */
        }
        span {
          font-family: 'PingFang SC';
          font-weight: 400;
          display: inline-block;
          font-size: 15px;
          color: rgba(255, 255, 255, 1);
          margin-left: 10px;
          max-width: 60px;
          overflow:hidden; //超出的文本隐藏
          text-overflow:ellipsis; //溢出用省略号显示
          white-space:nowrap; //溢出不换行
        }
      }
  }
  &__content {
    display: flex;
    align-items: flex-start;
    position: fixed;
    left: 0;
    right: 0;
    top: 12vh;
    .left {
      margin-top: 11px;
      margin-left: 5.6vw;
      display: flex;
      &__leftActive {
        position: absolute;
        top: 0;
        left: -12px;
        width: 120px;
        z-index: 1;
        transition: top 0.2s ease-in 0s;
      }
      &__tap {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-right: 2px;
        .item {
          margin-bottom: 24px;
          position: relative;
          image {
            width: 60px;
            /* width: 6.1vw; */
          }
          .tips {
            width: 12px;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
      .left-clues {
        position: relative;
      }
      &__list {
        position: relative;
        font-family: "Source Han Serif CN";
        font-style: normal;
        font-weight: 900;
        font-size: 13px;
        line-height: 110%;
        text-align: center;
        color: #c1baaa;
        margin-top: 11px;
        display: flex;
        flex-direction: column;
        .active {
          color: #ffffff;
        }
      }
      &__nav {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
        text-align: right;
        padding-right: 20px;
        z-index: 2;
        padding-left: 22px;
        white-space: nowrap;
        :nth-child(1) {
          font-size: 11rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #dccdaa;
          line-height: 13rpx;
        }
        :nth-child(2) {
          max-width: 50vw;
          font-size: 9rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #9a9280;
          line-height: 11rpx;
          @include text-overflow-line(1);
        }
      }
      &__line {
        position: absolute;
        top: -10px;
        width: 1px;
        height: 70vh;
        left: 14px;
        background: #9b9b9b;
      }
    }
    .middle {
      width: 64vw;
      max-height: calc(100vh - 56px);
      overflow: hidden;
      .page1 {
        &__tab {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        &__nav {
          display: inline-flex;
          overflow: hidden;
          margin-right: 15px;
          image {
            width: 44px;
            padding: 2px 12px;
          }
        }

        &__list {
          display: grid;
          justify-content: start;
          grid-template-columns: repeat(auto-fill, 9.2vw);
          grid-gap: 9px 9px;
          height: calc(100vh - 118px);
          overflow-y: scroll;
          padding-bottom: 20px;
        }
      }
    }
    .page2 {
      width: 88vw;
      &__tab {
        margin-bottom: 10px;
      }
      &__nav {
        image {
          width: 38px;
        }
      }
      .page2-list {
        @include hor;
        .card {
          margin-right: rpx(8);
          image {
            width: 73px;
          }
        }
        .name {
          text-align: center;
          font-style: normal;
          font-weight: 500;
          font-size: 10px;
          text-align: center;
          color: #ffffff;
          margin-top: 5px;
          width: 73px;
          font-family: PingFang SC-Medium, PingFang SC;
          line-height: 11px;
        }
      }
    }
    .page3 {
      width: 88vw;
      padding: 0 22px 0 6vw;
    }
    .right {
      width: 12vw;
      &__box {
        position: fixed;
        right: 28px;
        bottom: 22vh;
      }
      &__option {
        display: flex;
        flex-direction: column;
        padding: 0 15px;
        position: relative;
      }
      &__bg {
        position: absolute;
        left: 0;
        top: -9px;
        height: 124px;
        z-index: 1;
      }
      &__top {
        z-index: 2;
        height: 36px;
        width: 24px;
        image {
          width: 100%;
        }
      }
      &__middle {
        width: 20px;
        height: 1px;
        background: #ffffff;
        opacity: 0.2;
        margin: 11px 0 16px;
      }
      &__bottom {
        z-index: 2;
        height: 36px;
        width: 24px;
        image {
          width: 100%;
        }
      }
    }
  }
}
.toolNav {
  text-align: left!important;
  .toolNav-name {
    margin-bottom: 5px;
  }
}
.toolNavList {
  max-height: 65vh;
  overflow-y: scroll;
}
.empty {
  width: 90%;
  text-align: center;
   image {
     width: 74px;
     height: 74px;
     margin-top: 27vh;
   }
}
.logo {
  position: fixed;
  width: 54px;
  height: 40px;
  left: 19px;
  bottom: 19px;
  opacity: 0.5;
}
</style>
