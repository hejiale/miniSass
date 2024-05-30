<template>
  <div class="container">
    <div class="clueItem">
      <div class="left">
          <div
            class="titleBox"
            v-for="(v, i) in roundInfo"
            :key="v.id"
            @click="handleClick(i, v.id)"
          >
            <div class="clueTitle" :class="roundIndex === i ? 'active' : ''">
              {{ v.roundName }}
            </div>
            <span v-if="currentRoundId === v.id">当前</span>
          </div>
      </div>
      <div class="right">
        <DmTitle
          class="page2__title"
          :title="roundInfo[roundIndex].roundName"
        />
        <div class="right-box">
          <div class="info">主持人操作</div>
          <div class="right-list" v-if="dmClues.length">
            <ClueCard
              @getDmClues="refreshDmClues"
              cardType="unpublished"
              v-for="v in dmClues"
              :key="v.id"
              :dataSource="v"
              :storeNum="gameInfo.storeNumber"
              @handleClick="handleCard(v.id,'page4')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DmTitle from "./DmTitle.vue";
import ClueCard from "./ClueCard.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "DMPage4",
  data() {
    return {
      roundIndex: 0,
      roundId: null,
    };
  },
  components: {
    DmTitle,
    ClueCard,
  },
  computed: {
    ...mapState("dm", ["roundInfo", "gameInfo", "dmClues", "currentRoundId"]),
  },
  methods: {
    ...mapActions("dm", ["getDmClues"]),
    changeMenu(){
      this.roundIndex = this.roundInfo.findIndex(v=>v.id === this.currentRoundId);
    },
    handleClick(roundIndex, roundId) {
      this.roundIndex = roundIndex;
      this.roundId = roundId;
      this.getDmClues({
        roundId,
      });
    },
    refreshDmClues() {
      this.getDmClues({
        roundId: this.roundIndex === -1 ? -1: this.roundInfo[this.roundIndex].id,
      });
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
.clueItem {
  color: rgba(255, 255, 255, 0.6);
  font-family: "PingFang SC";
  font-style: normal;
  display: flex;
  padding-left: 4vw;
  .left {
    text-align: center;
    max-height: 67vh;
    overflow-y: scroll;
    width: 30vw;
    .clueTitle {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px 2px;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
      &.active {
        border: 1px solid rgba(225, 209, 179, 1);
      }
    }
    .titleBox {
      width: 28vw;
      position: relative;
      span {
        display: inline-block;
        position: absolute;
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 12px;
        color: #c1baaa;
        padding: 2px 5px;
        background: #000000;
        border: 0.5px solid #c1baaa;
        min-width: 34px;
        top: -5px;
        right: -10px;
      }
    }
  }
  .right {
    width: 70vw;
    .right-box {
      margin-left: 14px;
    }
    .info {
      font-weight: 500;
      font-size: 12px;
      line-height: 17px;
      margin: 19px 9px;
    }
    .right-list {
      max-height: 64vh;
      overflow-y: scroll;
      display: grid;
      justify-content: strat;
      grid-template-columns: repeat(auto-fill, 29vw);
      grid-gap: 6px 4px;
    }
  }
}
</style>
