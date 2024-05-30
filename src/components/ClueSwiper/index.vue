<template>
  <div class="clueSwiper" v-if="showSwiper">
    <view class="clueSwiper__box" v-if="type === 'player'">
      <view class="left">
        <view class="pages">
          <span>{{ currentValue + 1 }}</span>
          <span>/</span>
          <span>{{ list.length }}</span>
        </view>
      </view>
      <view class="middle">
        <swiper
          :current="currentValue"
          @change="changeSwiper"
          :indicator-dots="false"
          :circular="true"
        >
          <swiper-item v-for="(item) in list" :key="item.id">
            <view class="content">
              <div class="title">{{ item.clueName }}</div>
              <div class="box">
                <span class="icon icon-left"></span>
                <div class="line"></div>
                <span class="icon icon-right"></span>
              </div>
              <div class="detail">
                <template v-if="item.clueType === 'IMAGE'">
                  <image
                    :src="
                      $filters.waterMarkImg(
                        item.contentClueFileUrl,
                        userInfo.juyouId,
                        storeNum
                      )
                    "
                    mode="widthFix"
                    @click="
                      handlePreview(item.contentClueFileUrl, userInfo.juyouId)
                    "
                  ></image>
                </template>
                <template v-if="item.clueType === 'VIDEO'">
                  <video
                    class="video"
                    :id="item.id"
                    :src="item.contentClueFileUrl"
                    controls
                    :direction="90"
                    object-fit="cover"
                    :show-center-play-btn="false"
                  ></video>
                </template>
                <template v-if="item.clueType === 'AUDIO'">
                  <Audio :dataSource="item" />
                </template>
                <template v-if="item.clueType === 'TEXT'">
                  <div class="textWord">
                    <div class="mask"></div>
                    <div class="text">
                      <div
                        class="text-content"
                        v-html="item.contentTextClue"
                      ></div>
                    </div>
                  </div>
                </template>
              </div>
            </view>
            <view class="right" v-if="clueType === 'private'">
              <view class="footer">
				<image src="@/static/image/clue/icon-openClue.png" v-if="item.isPlayerPublic" @click="handleMark('public')"/>
				<image src="@/static/image/clue/icon-transfer.png" v-if="item.isPlayerTransfer" @click="handleMark('transfer')"/>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <van-icon class="close" name="cross" color="#CCBC91" @click="close" />
    </view>
    <view v-else class="clueSwiper__boxDM">
      <view class="dmContent">
        <div class="top"  @click="close">
                <div></div>
                <div class="title">{{ list[currentValue].clueName }}</div>
                <van-icon
                  size="20px"
                  name="cross"
                  color="#CCBC91"
                />
              </div>
        <swiper
          :current="currentValue"
          @change="changeSwiper"
          :indicator-dots="false"
          :circular="true"
        >
          <swiper-item v-for="(item) in list" :key="item.id" style="overflow-y: scroll;">
            <view class="content">
              <!-- <div class="top"  @click="close">
                <div></div>
                <div class="title">{{ item.clueName }}</div>
                <van-icon
                  size="20px"
                  name="cross"
                  color="#CCBC91"
                />
              </div> -->

              <div class="detail">
                <template v-if="item.clueType === 'IMAGE'">
                  <image
                    :src="
                      $filters.waterMarkImg(
                        item.contentClueFileUrl,
                        $store.state.dm.userInfo.juyouId,
                        storeNum
                      )
                    "
                    mode="widthFix"
                    @click="
                      handlePreview(
                        item.contentClueFileUrl,
                        $store.state.dm.userInfo.juyouId
                      )
                    "
                  ></image>
                </template>
                <template v-if="item.clueType === 'VIDEO'">
                  <video
                    class="video"
                    :id="item.id"
                    :src="item.contentClueFileUrl"
                    controls
                    :direction="90"
                    object-fit="cover"
                    :show-center-play-btn="false"
                  ></video>
                </template>
                <template v-if="item.clueType === 'AUDIO'">
                  <Audio :dataSource="item" />
                </template>
                <template v-if="item.clueType === 'TEXT'">
                  <div class="textWord">
                    <div class="mask"></div>
                    <div class="text">
                      <div
                        class="text-content"
                        v-html="item.contentTextClue"
                      ></div>
                    </div>
                  </div>
                </template>
              </div>
            </view>
          </swiper-item>
        </swiper>
      </view>
      <view class="dmPage">
        <view class="pages">
          <span>{{ currentValue + 1 }}</span>
          <span>/</span>
          <span>{{ list.length }}</span>
        </view>
      </view>
      <!-- <view class="dmBtn">
				<span v-if="item.isDmDistribute" @click="handleDM('public')">公开</span>
				<span v-if="item.isDmPublic" @click="handleDM('private')">私发</span>
			</view>	 -->
    </view>
    <van-popup
      :show="showPopup"
      position="bottom"
      @click-overlay="showPopup = false"
      close-on-click-overlay
      class="userPopup"
    >
      <div class="userPopup__body">
        <view class="userPopup__head">
          <div></div>
          <span>发给谁？</span>
          <van-icon
            class="close"
            name="cross"
            color="#CCBC91"
            @click="showPopup = false"
          />
        </view>
        <view class="userPopup__list">
          <div class="info" v-for="(v) in rolePlayersList" :key="v.userId">
            <div class="avatar">
              <image :src="v.roleAvatar" />
              <span>{{ v.roleName }}</span>
            </div>
            <template>
              <div class="btn" @click="dmClueTransfer(v.userId)">发送</div>
            </template>
          </div>
        </view>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import service from "@/services/game.js";
import Audio from "./Audio";

export default {
  props: {
    list: {
      type: Array,
      value: [],
    },
    currentValue: {
      // swiper索引
      type: Number,
      value: 0,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    indicatorColor: {
      type: String,
      default: "#c0c0c0",
    },
    indicatorActiveColor: {
      type: String,
      default: " #2979ff",
    },
    type: {
      type: String,
      default: "player",
    },
    clueType: {
      type: String,
      default: "public",
    },
  },
  data() {
    return {
      showSwiper: false,
      showPopup: false,
      storeNum: null
    };
  },
  components: {
    Audio,
  },
  computed: {
    ...mapState("player", [
      "userInfo",
      "roomInfo",
      "murderMysteryOnlineRecordId",
      "rolePlayersList",
    ]),
  },
  watch: {
    list(v) {},
    currentValue(v) {},
  },
  created() {},

  methods: {
    ...mapActions("player", ["getPublicClues"]),
    ...mapActions("dm", ["getDmClues"]),
    handleMark(type) {
      if (type === "public") {
        uni.showModal({
          title: "提示",
          content: "确认公开？",
          success: async (res) => {
            if (res.cancel) return;
            // 玩家-线索公开
            await service.playerCluePublish({
              murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
              clueId: this.list[this.currentValue].id,
              originalUserId: this.userInfo.id,
            });
            this.getPublicClues();
            this.close();
            uni.showToast({
              title: "公开成功",
            });
          },
        });
      } else if (type === "transfer") {
        // this.getRolePlayers()
        this.$emit("openTransfer", {
          visible: true,
          clueId: this.list[this.currentValue].id,
        });
      }
    },
    close() {
      this.showSwiper = false;
    },
    open(storeNum) {
      this.storeNum = storeNum;
      this.showSwiper = true;
    },
    changeSwiper(e) {
      this.$emit("update:currentValue", e.detail.current);
    },
    handlePreview(url, juyouId) {
		let urls = [];
		this.list.map(v=>{
			urls.push(this.$filters.waterMarkImg(v.contentClueFileUrl, juyouId, this.storeNum))
		})
      uni.previewImage({
		current: this.$filters.waterMarkImg(url, juyouId, this.storeNum),
        urls,
        showmenu: false,
      });
    },
    handleOption(clueId, type) {
      let that = this;
      uni.showModal({
        title: "提示",
        content: `确认${type === "public" ? "公开" : "收回"}？`,
        success: async (res) => {
          if (res.cancel) return;
          if (type === "public") {
            // DM-线索公开
            await service.dmCluePublish({
              murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
              clueId: this.list[this.currentValue].id,
            });
            that.$emit("getDmClues");
            uni.showToast({
              title: "公开成功",
            });
          } else if (type === "private") {
            this.showPopup = true;
          }
        },
      });
    },
    // DM-线索转移
    async dmClueTransfer(transferUserId) {
      await service.dmClueTransfer({
        murderMysteryOnlineRecordId: this.gameInfo.id,
        clueId: this.sendClueId,
        transferUserId,
      });
      this.$emit("getDmClues");
      this.showPopup = false;
      uni.showToast({
        title: "私发成功",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$kw-border-color: var(--color) !default;
$kw-color-active: var(--activecolor) !default;

.middle {
  width: 100vw;
  position: relative;
  swiper {
    height: 100vh;
  }
  swiper-item {
    display: flex;
  }
  .right {
    position: absolute;
    right: 20px;
    bottom: 17px;
    .footer {
      display: flex;
      flex-direction: column;
      text-align: center;
      position: relative;
      left: -20px;
	  image{
		width: 76px;
		height: 27px;
		margin-bottom: 20px;
	  }
    //   span {
    //     display: block;
    //     font-family: "Source Han Serif CN";
    //     font-style: normal;
    //     font-weight: 900;
    //     font-size: 9px;
    //     line-height: 110%;
    //     color: rgba(204, 188, 145, 0.9);
    //     padding: 10px 20px;
    //     border: 1px solid rgba(204, 188, 145, 0.4);
    //     background: rgba(0, 0, 0, 0.8);
    //     margin-bottom: 20px;
    //   }
    }
  }
}
.clueSwiper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 4;
  &__box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    /* position: fixed;
		top: 0;
		left: 0; */
    /* width: 40vw;
		margin: 0 auto; */
    .left {
      text-align: right;
      position: absolute;
      left: 68px;
      bottom: 17px;
      .pages {
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        color: #ccbc91;
        text-align: center;
        span {
          display: inline-block;
        }
      }
    }
    .content {
      width: 67.7vw;
      /* padding: 0 90px; */
      margin: 0 auto;
      image {
        width: 100%;
      }
      .box {
        width: 100%;
        position: relative;
        margin: 10px 0;
        .line {
          width: calc(100% - 10px);
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
          margin-left: 5px;
        }
        .icon {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          display: inline-block;
          transform: rotate(45deg);
          &-left {
            position: absolute;
            left: -4px;
            top: -4px;
          }
          &-right {
            position: absolute;
            right: -4px;
            top: -4px;
          }
        }
      }
    }
    .title {
      margin-top: 14px;
      font-family: "Source Han Serif CN";
      font-style: normal;
      font-weight: 900;
      font-size: 15px;
      color: #ccbc91;
      width: 100%;
      text-align: center;
    }
    .detail {
      text-align: center;
      height: 80vh;
      overflow: scroll;
      image {
        width: 27.7vw;
        overflow-y: scroll;
      }
      .video {
        width: 100%;
      }
      .textWord {
        position: relative;
        text-align: left;
        .mask {
          position: absolute;
          height: 50px;
          left: 0;
          right: 0;
          bottom: 0;
          box-shadow: 20px 15px 20px -20px #1b1b16,
            -20px 15px 20px -20px #1b1b16;
          background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
          z-index: -1;
        }
        .text {
          max-height: 63.7vh;
          overflow-y: scroll;
          overflow: -moz-scrollbars-none;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 400;
          font-size: 13px;
          line-height: 18px;
          color: #ffffff;
        }
      }
    }
    .close {
      position: fixed;
      left: 17px;
      top: 7px;
	  padding: 10px;
    z-index: 1;
    }
  }
  &__boxDM {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 99px;
    box-sizing: border-box;
    .dmPage {
      width: 100%;
      text-align: center;
      .pages {
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 16px;
        color: #ccbc91;
        text-align: center;
        span {
          display: inline-block;
        }
      }
    }
    .dmBtn {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 60vw;
      padding: 0 5vw;
      span {
        display: block;
        font-family: "Source Han Serif CN";
        font-style: normal;
        font-weight: 900;
        font-size: 9px;
        line-height: 110%;
        color: rgba(204, 188, 145, 0.9);
        padding: 10px 20px;
        border: 1px solid rgba(204, 188, 145, 0.4);
        background: rgba(0, 0, 0, 0.8);
        margin-bottom: 20px;
      }
    }
    .dmContent {
      width: 100%;
      swiper {
        height: 76vh;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 18px 18px 18px;
      }
      .content {
        width: 100%;
        image {
          width: 100%;
          overflow-y: scroll;
        }
        .box {
          width: 100%;
          position: relative;
          margin: 10px 0;
          .line {
            width: calc(100% - 10px);
            height: 1px;
            background: rgba(255, 255, 255, 0.3);
            margin-left: 5px;
          }
          .icon {
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.3);
            display: inline-block;
            transform: rotate(45deg);
            &-left {
              position: absolute;
              left: -4px;
              top: -4px;
            }
            &-right {
              position: absolute;
              right: -4px;
              top: -4px;
            }
          }
        }
      }
      .title {
        font-family: "Source Han Serif CN";
        font-style: normal;
        font-weight: 900;
        font-size: 15px;
        color: #ccbc91;
        width: 100%;
        text-align: center;
      }
      .detail {
        padding: 0 18px;
        text-align: center;
        // height: 40vh;
        overflow: scroll;
        image {
          width: 100%;
          overflow-y: scroll;
        }
        .video {
          width: 100%;
        }
        .textWord {
          position: relative;
          text-align: left;
          .mask {
            position: absolute;
            height: 50px;
            left: 0;
            right: 0;
            bottom: 0;
            box-shadow: 20px 15px 20px -20px #1b1b16,
              -20px 15px 20px -20px #1b1b16;
            background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
            z-index: -1;
          }
          .text {
            overflow-y: scroll;
            overflow: -moz-scrollbars-none;
            font-family: "PingFang SC";
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            line-height: 18px;
            color: #ffffff;
          }
        }
      }
    }
  }
}

.kw-swiper-dots {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  font-size: 0;
  bottom: 5px;
  text-align: center;
  white-space: nowrap;
  margin-top: 20px;
}

.kw-swiper-dot {
  width: 5px;
  height: 5px;
  position: relative;
  margin: 2px 4px !important;
  background-color: $kw-border-color;
  display: inline-block;
  cursor: pointer;
  -webkit-transition-property: background-color;
  transition-property: background-color;
  -webkit-transition-timing-function: ease;
  transition-timing-function: ease;
  border-radius: 50%;

  &.kw-swiper-dot-active {
    background-color: $kw-color-active;
    width: 9px;
    height: 9px;

    &::after {
      content: "";
      position: absolute;
      width: 5px;
      height: 5px;
      top: 0px;
      left: 0px;
      right: 0;
      bottom: 0;
      margin: auto;
      background-color: #ffffff;
      border-radius: 11px;
    }
  }

  &.square-dot {
    margin: 2px 4px !important;
    border-radius: 11px;

    &.kw-swiper-dot-active {
      opacity: 1;
      height: 5px;
      width: 16px;

      &::after {
        display: none;
      }
    }
  }
}
</style>
