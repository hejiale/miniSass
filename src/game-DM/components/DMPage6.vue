<template>
  <div>
    <div class="toolBox">
      <div v-for="(item, index) in showToolList" :key="index">
        <div
          class="toolBox-item"
          @click="showComponents(item.type)"
        >
          <image :src="$iconFont.getIconName(item.src)" mode="widthFix" />
        </div>
      </div>
    </div>
    <!-- <div class="components"> -->
    <van-action-sheet
      :show="currentType == 'jigsaw'"
      :safe-area-inset-bottom="false"
      z-index="10"
      :round="false"
      :overlay="false"
    >
      <jigsaw
        title="拼图"
        :currentType.sync="currentType"
        :pageOne.sync="pageOne"
        ref="jigsaw"
      />
    </van-action-sheet>

    <van-action-sheet
      :show="currentType == 'vote'"
      :safe-area-inset-bottom="false"
      z-index="10"
      :round="false"
      :overlay="false"
    >
      <vote
        ref="vote"
        title="投票"
        :currentType.sync="currentType"
        :pageOne.sync="pageOne"
      />
    </van-action-sheet>
    <van-action-sheet
      :show="pageOne == 'votePageOne'"
      :safe-area-inset-bottom="false"
      z-index="20"
      :round="false"
      :overlay="false"
    >
      <votePage1
        title="投票详情"
        :pageOne.sync="pageOne"
        :pageTwo.sync="pageTwo"
      />
    </van-action-sheet>
    <van-action-sheet
      :show="currentType == 'stochastic'"
      :safe-area-inset-bottom="false"
      z-index="10"
      :round="false"
      :overlay="false"
    >
      <stochastic
        title="随机工具"
        :currentType.sync="currentType"
        :pageOne.sync="pageOne"
        :pageTwo.sync="pageTwo"
      />
    </van-action-sheet>
    <van-action-sheet
      :show="pageOne == 'stochasticPageOne'"
      :safe-area-inset-bottom="false"
      z-index="20"
      :round="false"
      :overlay="false"
    >
      <stochasticPage1
        title="详情"
        :pageOne.sync="pageOne"
        :pageTwo.sync="pageTwo"
      />
    </van-action-sheet>
    <van-action-sheet
      :show="pageTwo == 'stochasticPageTwo'"
      :safe-area-inset-bottom="false"
      z-index="30"
      :round="false"
      :overlay="false"
    >
      <stochasticPage2 class="jigsaw" title="发给谁?" :pageTwo.sync="pageTwo" />
    </van-action-sheet>

    <van-action-sheet
      ref="question"
      :show="currentType == 'question'"
      :safe-area-inset-bottom="false"
      z-index="10"
      :round="false"
      :overlay="false"
    >
      <question
        title="问答题"
        :currentType.sync="currentType"
        :pageOne.sync="pageOne"
      />
    </van-action-sheet>
    <van-action-sheet
      :show="pageOne == 'questionPageOne'"
      :safe-area-inset-bottom="false"
      z-index="20"
      :round="false"
      :overlay="false"
    >
      <questionPage1 title="答题详情" :pageOne.sync="pageOne" />
    </van-action-sheet>

    <van-action-sheet
      :show="currentType == 'tel'"
      :safe-area-inset-bottom="false"
      z-index="10"
      :round="false"
      :overlay="false"
    >
      <tel
        ref="tel"
        title="来电"
        :currentType.sync="currentType"
        :pageOne.sync="pageOne"
      />
    </van-action-sheet>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import jigsaw from "./tool-components/jigsaw.vue";
import vote from "./tool-components/vote.vue";
import votePage1 from "./tool-components/vote-page1.vue";
import stochastic from "./tool-components/stochastic.vue";
import stochasticPage1 from "./tool-components/stochastic-page1.vue";
import stochasticPage2 from "./tool-components/stochastic-page2.vue";
import question from "./tool-components/question.vue";
import questionPage1 from "./tool-components/question-page1.vue";
import tel from "./tool-components/tel.vue";
export default {
  components: {
    jigsaw,
    vote,
    votePage1,
    stochastic,
    stochasticPage1,
    stochasticPage2,
    question,
    questionPage1,
    tel,
  },
  data() {
    return {
      // toolList: [
      //   { type: "question", src: "../static/tool-question.png" },
      //   { type: "vote", src: "../static/tool-vote.png" },
      //   { type: "stochastic", src: "../static/tool-stochastic.png" },
      //   { type: "jigsaw", src: "../static/tool-jigsaw.png" },
      //   { type: "tel", src: "../static/tool-tel.png" },
      // ],
      currentType: null,
      pageOne: null,
      pageTwo: null,
    };
  },
  computed: {
    ...mapState("dm", ["toolList"]),
    showToolList(){
      return this.toolList.filter(v=>v.isShow)
    }
  },
  methods: {
    ...mapActions("dm", ["queryQuestionList", "queryRollList"]),
    showComponents(type) {
      this.currentType = type;
      switch (type) {
        case "question":
          this.queryQuestionList();
          break;
        case "vote":
          this.$refs.vote.queryList();
          break;
        case "stochastic":
          this.queryRollList();
          break;
        case "jigsaw":
          break;
        case "tel":
          this.$refs.tel.queryList();
          break;
        default:
      }
      console.log(this.currentType);
    },
    refreshJigsaw(){
      this.$refs.jigsaw.queryList();
    }
  },
};
</script>

<style lang="scss" scoped>
// @keyframes move {
//   0% {
//     transform: translateX(100%);
//   }
//   100% {
//     transform: translateX(0);
//   }
// }
.toolBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-right: 4vw;
  padding-left: 4vw;
  // animation-name: move;
  // animation-duration: 0.2s;
  &-item {
    margin-bottom: 3vh;
    width: 43.5vw;
    height: 13.5vh;
  }
}
.components {
  width: 100vw;
  height: 84.11vh;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
}
</style>
