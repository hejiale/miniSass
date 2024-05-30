<template>
  <view class="bottomMenu" v-if="current != 1">
    <image
      class="two"
      :src="current == 2 ? '../static/home-on.png' : '../static/home-off.png'"
      @click="handleBtMenu('home')"
    />
    <image
      class="two"
      :src="current == 3 ? '../static/round-on.png' : '../static/round-off.png'"
      @click="handleBtMenu('round')"
    />
    <image
      class="three"
      :src="current == 4 ? '../static/clue-on.png' : '../static/clue-off.png'"
      @click="handleBtMenu('clue')"
    />
    <image
      class="three"
      :src="current == 5 ? '../static/music-on.png' : '../static/music-off.png'"
      @click="handleBtMenu('music')"
    />
    <image
      class="two"
      :src="current == 6 ? '../static/tool-on.png' : '../static/tool-off.png'"
      @click="handleBtMenu('tool')"
    />
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  props: {
    current: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      //   bottomMenu: [
      //     {
      //       name: "主页",
      //       type: "home",
      //     },
      //     {
      //       name: "回合",
      //       type: "round",
      //     },
      //     {
      //       name: "线索库",
      //       type: "clue",
      //     },
      //     {
      //       name: "音乐库",
      //       type: "music",
      //     },
      //     {
      //       name: "工具",
      //       type: "tool",
      //     },
      //   ],
    };
  },
  computed: {
    ...mapState("dm", ["gameInfo", "roundInfo", "publicClues"]),
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
    ]),
    ...mapMutations("dm", ["setGameInfo", "setSeatInfo", "setRolePlayersList"]),

    handleBtMenu(type) {
      switch (type) {
        case "home":
          this.getPublicClues();
          this.getRoundInfo();
          this.$emit("update:current", 2);
          break;
        case "round":
          // 回合信息
          this.$emit("update:current", 3);
          break;
        case "clue":
          // uni.showLoading();
          // this.getDmClues();
          this.$emit("update:current", 4);

          break;
        case "music":
          this.$emit("update:current", 5);
          this.$emit("queryList");
          break;
        case "tool":
          this.$emit("update:current", 6);

          break;
        default:
          this.$emit("update:current", 2);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bottomMenu {
  box-sizing: border-box;
  width: 100vw;
  padding: 0 8rpx;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 66rpx;
  justify-content: space-around;
  .two {
    width: 134rpx;
    height: 84rpx;
  }
  .three {
    width: 160rpx;
    height: 84rpx;
  }
}
</style>
