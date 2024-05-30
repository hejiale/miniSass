<template>
  <div class="jigsaw">
    <image class="bg" src="../../static/tool-bg.png" />
    <div class="jigsaw-content">
      <div class="jigsaw-content-title">
        <span>{{ title }}</span>
        <div class="close" @click="pageClose">
          <div></div>
        </div>
      </div>
      <scroll-view class="jigsaw-content-scroll" scroll-y>
        <div class="box" v-for="item in jigsawList" :key="item.jigsawGameItem.id">
          <div class="box-text">{{ item.jigsawGameItem.title }}</div>
          <div class="box-modelBox">
            <image :src="$iconFont.getIconName('pintu-border')" class="box-modelBox-bg"/>
            <image
              class="box-modelBox-cover"
              mode="aspectFill"
              v-for="it in item.jigsawGameItem.blockItemList"
              :key="it.id"
              :src="it.url"
              :style="'width:' + item.imageWidth + 'px;' + 'height:' + item.imageWidth + 'px;'"
            />
          </div>
          <div class="box-btn">
            <div class="box-btn-border" v-if="item.isSuccess">
              <image src="../../static/pintu_success.png"/>
            </div>
            <div class="box-btn-border" v-else-if="item.jigsawGameItem.isSend">
              <image src="../../static/pintu_ing.png"/>
              <span>拼图答案见DM手册</span>
            </div>
            <div class="box-btn-border" v-else @click="sendJigsaw(item.jigsawGameItem.id)">
              <image src="../../static/send_pintu.png"/>
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="jigsaw-content-refresh" @click="queryList">
        <image src="../../static/refresh.png"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import service from "@/services/game.js";
import {
  windowWidth
} from "@/utils";
export default {
  props: {
    title: {
      type: String,
    },
    currentType: {
      type: String,
    },
  },
  data() {
    return {
      jigsawList: []
    };
  },
  created() {
    this.queryList();
  },
  computed: {
    ...mapState("dm", ["murderMysteryOnlineRecordId"])
  },
  methods: {
    pageClose() {
      this.$emit("update:currentType", null);
    },

    async queryList() {
      let res = await service.getTrueJigsawList({
        ...this.murderMysteryOnlineRecordId,
      });
      let width = await windowWidth();
      res.map(async v=>{
        v.imageWidth = (width * 0.8293 - (v.jigsawGameItem.jigsawColumn - 1) * 2) / v.jigsawGameItem.jigsawColumn;
      })
      this.jigsawList = res;
    },
    async sendJigsaw(id) {
      uni.showLoading({
        title: "发送中",
      });
      await service.distributeTool({
        ...this.murderMysteryOnlineRecordId,
        toolType: "JIGSAW",
        toolId: id,
      });
      await this.queryList();
      uni.hideLoading();
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
// .jigsawClose {
//   animation-name: closeMove;
//   animation-duration: 0.2s;
// }
// .jigsawOpen {
//   width: 100vw;
//   height: 84.11vh;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   z-index: 10;
//   animation-name: move;
//   animation-duration: 0.2s;
// }
.jigsaw {
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
    padding: 0 16px 16rpx 16px;
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
    &-scroll {
      height: 70vh;
      padding-top: 16rpx;
      .box {
        margin-bottom: 60rpx;
        margin-right: 12rpx;
        &-text {
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #c1baaa;
          line-height: 29rpx;
          margin-bottom: 22px;
        }
        &-modelBox {
          padding: 10px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          &-bg{
            @include abscenter;
            z-index: -1;
          }
          &-cover{
            margin: 0px 2px 2px 0px;
          }
        }
        &-btn {
          margin-top: 48rpx;
          &-border {
            box-sizing: border-box;
            width: 160rpx;
            height: 52rpx;
            padding: 2rpx;
            margin: 0 auto;
            position: relative;
            span{
              position: absolute;
              right: -115px;
              top: 5px;
              color: rgba(255,255,255,0.6);
              font-size: 12px;
            }
          }
        }
      }
    }
    &-refresh{
      position: fixed;
      right: 0;
      bottom: 12vh;
      padding: 10px;
      image{
        width: 48rpx;
        height: 70rpx;
      }
    }
  }
}
// // 滚动条样式
// /deep/ ::-webkit-scrollbar {
//   /*滚动条整体样式*/
//   width: 8rpx !important;
//   height: 1px !important;
//   overflow: auto !important;
//   background: #ccc !important;
//   -webkit-appearance: auto !important;
//   display: block;
//   margin-right: 20rpx !important;
// }

// /deep/ ::-webkit-scrollbar-thumb {
//   /*滚动条里面小方块*/
//   width: 8rpx !important;
//   border-radius: 10px !important;
//   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
//   background: #615f56 !important;
// }

// /deep/ ::-webkit-scrollbar-track {
//   /*滚动条里面轨道*/
//   width: 2rpx !important;
//   background: #373530 !important;
//   border-radius: 20px !important;
// }
</style>
