<template>
  <div class="question">
    <image class="bg" src="../../static/tool-bg.png" />
    <div class="question-content">
      <div class="question-content-title">
        <span>{{ title }}</span>
        <div class="close" @click="pageClose">
          <div></div>
        </div>
      </div>
      <div class="question-content-tab">
        <div class="question-content-tab-text" @click="checkTab">
          问题
          <div :class="!tab ? 'bg' : ''"></div>
        </div>
        <!-- <div class="question-content-tab-text" @click="checkTab">
          问答情况
          <div :class="tab ? 'bg' : ''"></div>
        </div> -->
      </div>
      <div class="question-content-roleList" v-if="tab">
        <div
          class="imgBox"
          v-for="item in rolePlayersList"
          :key="item.roleId"
          :class="currentRole.roleId == item.roleId ? 'border' : ''"
          @click="checkRole(item)"
        >
          <div class="imgBox-head">
            <div class="imgBox-head-border"></div>
            <image :src="item.roleAvatar" mode="aspectFill" />
            <div class="imgBox-head-name">
              {{ item.roleName }}
            </div>
          </div>
        </div>
      </div>
      <scroll-view
        class="question-content-scroll"
        scroll-y
        :style="!tab ? '' : 'height:50vh'"
      >
        <div class="box" v-if="!tab">
          <div class="box-tab1 top">题目</div>
          <div class="box-tab1 top">发送座位</div>
          <div class="box-tab1 top">发送状态</div>
          <div class="box-tab1 top">操作</div>
        </div>
        <template v-if="!tab">
          <div class="box" v-for="item in questionList" :key="item.id">
            <div class="box-tab1">
              <span>{{ item.question }}</span>
              <span class="click" @click="pageTypeOne(item)">查看详情</span>
              <span>正确答案：</span>
              <span>{{ getTrue(item.answerItemList) }}</span>
            </div>
            <div class="box-tab1 column">
              <span v-for="it in item.roleList" :key="it.roleId">{{
                it.roleName
              }}</span>
            </div>
            <div class="box-tab1 column">
              <span>{{ item.isSend ? "已发送" : "未发放" }}</span>
            </div>
            <div class="box-tab1 column">
              <span
                @click="sendVote(item.id)"
                v-if="!item.isSend"
                :class="item.isSend ? '' : 'click'"
                >发放</span
              >
              <span v-else>/</span>
            </div>
          </div>
        </template>
        <div class="detail" v-if="tab">
          <div class="detail-top">
            <div>
              <span>{{ currentRole.roleName }}</span>
            </div>
            <!-- <div>
              <span>总得分：</span><span class="color">{{ "20" }}分</span>
            </div>
            <div>
              <span>线索数量：</span><span>{{ "2" }}</span>
            </div> -->
          </div>
          <template v-if="answerList">
            <div class="detail-item">
              <div>
                {{ answerDetailItem.questionUserAnswerItem[0].questionContent }}
              </div>
              <div>
                回答情况：<span
                  v-for="item in answerDetailItem.questionUserAnswerItem"
                  :key="item.roleId"
                >
                  <span v-if="!item.answerList">未回答</span>
                  <template v-else>
                    <span v-for="it in item.answerList" :key="it.id">{{
                      it.content
                    }}</span>
                  </template>
                </span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="empty">暂无回答</div>
          </template>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import service from "@/services/game.js";
export default {
  props: {
    title: {
      type: String,
    },
    currentType: {
      type: String,
    },
    pageOne: {
      type: String,
    },
  },
  data() {
    return {
      tab: false,
      currentRole: null,
      answerDetail: [],
    };
  },
  created() {
    this.queryQuestionList();
    console.log(this.rolePlayersList);
    this.currentRole = this.rolePlayersList[0];
  },
  computed: {
    ...mapState("dm", [
      "murderMysteryOnlineRecordId",
      "rolePlayersList",
      "questionDetail",
      "questionList",
    ]),
    getTrue() {
      return function (arr) {
        let str = "";
        arr.map((v, i) => {
          if (v.isTrue) {
            str += this.$enums.Label.getName(i);
          }
        });
        return str;
      };
    },
    answerDetailItem() {
      let item = null;
      console.log(this.answerDetail);
      this.answerDetail.map((v) => {
        if (v.roleId == this.currentRole.roleId) {
          item = v;
        }
      });
      return item;
    },
    answerList() {
      if (this.currentRole) {
        let item = null;
        let bool = false;
        this.answerDetail.map((v) => {
          if (v.roleId == this.currentRole.roleId) {
            item = v;
          }
        });
        if (item) {
          item.map((v) => {
            if (v.answerList) {
              bool = true;
            }
          });
        }

        return bool;
      }
    },
  },
  methods: {
    ...mapMutations("dm", ["setQuestionDetail"]),
    ...mapActions("dm", ["queryQuestionList"]),
    pageClose() {
      this.$emit("update:currentType", null);
    },
    pageTypeOne(item) {
      this.setQuestionDetail(item);
      this.$emit("update:pageOne", "questionPageOne");
      console.log(this.questionDetail);
    },

    // async queryList() {
    //   let res = await service.getQuestionList(this.murderMysteryOnlineRecordId);
    //   console.log(this.rolePlayersList);
    //   res.map((v) => {
    //     v.roleList = [];
    //     this.rolePlayersList.map((val) => {
    //       v.roleIds.map((value) => {
    //         if (value == val.roleId) {
    //           v.roleList.push(val);
    //         }
    //       });
    //     });
    //   });
    //   console.log(res);
    //   this.questionList = res;
    // },
    async sendVote(id) {
      uni.showLoading({
        title: "发送中",
      });
      await service.distributeTool({
        ...this.murderMysteryOnlineRecordId,
        toolType: "QUESTION",
        toolId: id,
      });
      await this.queryQuestionList();
      uni.hideLoading();
    },
    checkTab() {
      this.tab = !this.tab;
      if (this.tab) {
        this.checkRole(this.rolePlayersList[0]);
      }
    },
    async checkRole(item) {
      this.currentRole = item;
      this.answerDetail = await service.getAnswerDetailList({
        ...this.murderMysteryOnlineRecordId,
        // userId: item.userId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// @keyframes move {
//   0% {
//     transform: translateY(100%);
//   }
//   100% {
//     transform: translateY(0);
//   }
// }
// @keyframes closeMove {
//   0% {
//     transform: translateY(0);
//   }
//   100% {
//     transform: translateY(100%);
//   }
// }
// .questionClose {
//   animation-name: closeMove;
//   animation-duration: 0.2s;
// }
// .questionOpen {
//   width: 100vw;
//   height: 84.11vh;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   z-index: 10;
//   animation-name: move;
//   animation-duration: 0.2s;
// }
.question {
  width: 100vw;
  height: 84.11vh;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }
  &-content {
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    padding: 0 12rpx 136rpx 32rpx;
    &-title {
      padding: 32rpx 0 36rpx;
      border-bottom: 2rpx solid #514c3c;
      text-align: center;
      position: relative;
      margin-bottom: 34rpx;
      margin-right: 32rpx;
      span {
        font-size: 36rpx;
        font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
        font-weight: 800;
        color: #ccbc91;
        line-height: 44rpx;
      }
      .close {
        width: 72rpx;
        height: 72rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        div {
          width: 24rpx;
          height: 24rpx;
          background: #ccbc91;
          -webkit-clip-path: polygon(
            20% 0%,
            0% 20%,
            30% 50%,
            0% 80%,
            20% 100%,
            50% 70%,
            80% 100%,
            100% 80%,
            70% 50%,
            100% 20%,
            80% 0%,
            50% 30%
          );
          clip-path: polygon(
            20% 0%,
            0% 20%,
            30% 50%,
            0% 80%,
            20% 100%,
            50% 70%,
            80% 100%,
            100% 80%,
            70% 50%,
            100% 20%,
            80% 0%,
            50% 30%
          );
        }
      }
    }
    &-tab {
      display: flex;
      justify-content: space-around;
      margin: 46rpx 32rpx 60rpx 0;
      &-text {
        font-size: 26rpx;
        font-family: Source Han Serif CN-Heavy, Source Han Serif CN;
        font-weight: 800;
        color: #f3e5c1;
        line-height: 29rpx;
        position: relative;
        .bg {
          width: 180rpx;
          height: 52rpx;
          background-image: url("../../static/question-tabBg.png");
          background-repeat: no-repeat;
          background-size: 100%;
          position: absolute;
          top: 50%;
          right: 50%;
          transform: translate(50%, -50%);
          z-index: -1;
        }
      }
    }
    &-roleList {
      display: flex;
      align-items: center;
      overflow-x: auto;
      margin-right: 32rpx;
      .border {
        border: 4rpx solid #e19421;
        border-radius: 50%;
      }
      .imgBox {
        margin-bottom: 54rpx;
        margin-right: 32rpx;
        &-head {
          width: 84rpx;
          height: 84rpx;
          position: relative;
          &-border {
            box-sizing: border-box;
            width: 84rpx;
            height: 84rpx;
            border-radius: 50%;
            border: 2rpx solid rgba(255, 255, 255, 0.4);
            position: absolute;
          }
          image {
            width: 84rpx;
            height: 84rpx;
            border-radius: 50%;
          }
          &-name {
            box-sizing: border-box;
            width: 104rpx;
            height: 36rpx;
            padding: 0 2rpx;
            background: linear-gradient(
              90deg,
              rgba(0, 0, 0, 0) 0%,
              #000000 32%,
              #000000 74%,
              rgba(0, 0, 0, 0) 100%
            );
            border: 1rpx solid rgba(255, 255, 255, 0.29);
            border-radius: 12rpx;
            font-size: 18rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #c1baaa;
            line-height: 32rpx;
            text-align: center;
            position: absolute;
            bottom: 0;
            right: 50%;
            transform: translate(50%);
            @include text-overflow-line(1);
          }
        }
      }
      :last-child {
        margin-right: 0;
      }
    }
    &-scroll {
      height: 58vh;
      padding-top: 16rpx;
      .box {
        margin-bottom: 32rpx;
        margin-right: 12rpx;
        display: flex;
        justify-content: space-between;
        &-tab1 {
          width: 140rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          span {
            font-size: 22rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #afa076;
            line-height: 24rpx;
            margin-top: 14rpx;
            word-break: break-all;
          }
          :nth-child(1) {
            margin-top: 0;
          }
          .click {
            color: #f3e5c1;
          }
        }
        .top {
          height: 54rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #c1baaa;
          line-height: 54rpx;
          text-align: center;
          background: #14130f;
        }
        .column {
          align-items: center;
        }
      }
      .detail {
        padding: 34rpx 24rpx;
        margin-bottom: 32rpx;
        margin-right: 12rpx;
        background: #000000;
        &-top {
          display: flex;
          div {
            margin-right: 32rpx;
            span {
              font-size: 22rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 24rpx;
            }
            .color {
              color: #ccbc91;
            }
          }
        }
        &-item {
          margin-top: 32rpx;
          display: flex;
          justify-content: space-between;
          padding: 14rpx 16rpx 16rpx 14rpx;
          background: rgba(168, 159, 135, 0.5);
          div {
            font-size: 20rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #c1baaa;
            line-height: 22rpx;
          }
        }
      }
      .empty {
        margin-top: 32rpx;
        font-size: 20rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #c1baaa;
        line-height: 22rpx;
        text-align: center;
      }
      // 滚动条样式
      /deep/ ::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 8rpx !important;
        height: 1px !important;
        overflow: auto !important;
        background: #ccc !important;
        -webkit-appearance: auto !important;
        display: block;
      }

      /deep/ ::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        width: 8rpx !important;
        border-radius: 10px !important;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
        background: #615f56 !important;
      }

      /deep/ ::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        width: 2rpx !important;
        background: #373530 !important;
        border-radius: 20px !important;
      }
    }
  }
}
</style>
