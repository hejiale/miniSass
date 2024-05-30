<template>
  <div>
    <div
      class="jigsaw"
      :style="{
        'background-image': `url(${$iconFont.getIconName('jigsaw-bg')})`,
      }"
      v-if="visible"
    >
      <div class="jigsaw-logo">
        <image :src="$iconFont.getIconName('jigsaw-logo')" mode="heightFix" />
        <image :src="jigsawSuccessLogo" mode="heightFix" v-if="jigsawList.isSuccess" />
      </div>

      <div class="left">
        <div class="border">
          <div class="border-padding">
            <div class="border-padding-box">
              <div
                class="border-padding-box-row"
                v-for="(item, index) in list"
                :key="index"
              >
                <div
                  class="border-padding-box-row-item"
                  :style="swiperStyle"
                  v-for="(it, idx) in item"
                  :key="idx"
                >
                  <div
                    :class="
                      it.jigsawColumn + 1 ==
                        jigsawList.jigsawGameItem.jigsawColumn &&
                      it.jigsawRow + 1 == jigsawList.jigsawGameItem.jigsawRow
                        ? 'last'
                        : it.jigsawColumn + 1 ==
                          jigsawList.jigsawGameItem.jigsawColumn
                        ? 'lastColumn'
                        : it.jigsawRow + 1 ==
                          jigsawList.jigsawGameItem.jigsawRow
                        ? 'lastRow'
                        : ''
                    "
                    v-if="!it.id"
                    @click="putJigsaw(it)"
                  ></div>
                  <image
                    :src="it.url"
                    mode="aspectFill"
                    v-else
                    @click="takeJigsaw(it)"
                    :style="
                      it.userId == userInfo.id
                        ? 'border: #f7cb3f 2rpx solid;'
                        : ''
                    "
                    :class="
                      it.jigsawColumn + 1 ==
                        jigsawList.jigsawGameItem.jigsawColumn &&
                      it.jigsawRow + 1 == jigsawList.jigsawGameItem.jigsawRow
                        ? 'last'
                        : it.jigsawColumn + 1 ==
                          jigsawList.jigsawGameItem.jigsawColumn
                        ? 'lastColumn'
                        : it.jigsawRow + 1 ==
                          jigsawList.jigsawGameItem.jigsawRow
                        ? 'lastRow'
                        : ''
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-tip">
          <span>已获得碎片：</span>
          <span>操作说明:选中碎片后，点击左侧目标位置,即可完成拼图。</span>
        </div>
        <div class="right-box" v-if="userList.length">
          <div class="right-box-left" @click="onChangeCurrent('left')">
            <image src="../static/icon-left-arrow.png" v-if="userList.length > 1"/>
          </div>
          <swiper class="right-box-swiper" @change="onChangeSwiper" :current="swiperIndex">
            <swiper-item  class="right-box-swiper-item" v-for="item in userList" :key="item.id" @click="onGetCurrent">
              <image :src="item.url" mode="aspectFill" :class="item.id === current.id ? 'active':''"/>
            </swiper-item>
          </swiper>
          <div class="right-box-right" @click="onChangeCurrent('right')">
            <image src="../static/icon-right-arrow.png" v-if="userList.length > 1"/>
          </div>
        </div>
        <div class="right-numBox"  v-if="userList.length"><span>{{swiperIndex + 1}}</span><span>/{{userList.length}}</span></div>
      </div>
    </div>
    <div class="success" v-if="visible && isJigsawSuccess && jigsawList.isSuccess" @click="success">
      <image class="success-gif" :src="jigsawGif" />
      <image class="success-png" :src="jigsawSuccess" />
      <span>点击以继续</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import service from "@/services/game.js";
export default {
  props: {
    dataSource: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      visible: false,
      userList: [],
      current: null,
      swiperIndex: 0,
      jigsawSuccess: null,
      jigsawSuccessLogo: null,
      jigsawGif: null,
      putting: false,
    };
  },
  created() {
    this.downloadGif();
  },
  computed: {
    ...mapState("player", [
      "userInfo",
      "murderMysteryOnlineRecordId",
      "jigsawList",
      "trueJigsawList",
      "isJigsawSuccess",
    ]),
    list() {
      if (!this.visible) return;
      let arr = [];
      for (let i = 0; i < this.jigsawList.jigsawGameItem.jigsawRow; i++) {
        arr.push([]);
      }
      this.jigsawList.jigsawGameItem.blockItemList.map((v) => {
        switch (v.jigsawRow) {
          case 0:
            arr[0].push(v);
            break;
          case 1:
            arr[1].push(v);
            break;
          case 2:
            arr[2].push(v);
            break;
          case 3:
            arr[3].push(v);
            break;
          default:
        }
      });
      console.log(arr);
      return arr;
    },
    swiperStyle(){
      if (!this.visible) return;
      if(this.jigsawList){
        if(this.jigsawList.jigsawGameItem.jigsawRow === 2){
          return `width: 13.3vw; height: 13.3vw`;
        }else if(this.jigsawList.jigsawGameItem.jigsawRow === 3){
          return 'width: 11.5vw; height: 11.5vw';
        }else if(this.jigsawList.jigsawGameItem.jigsawRow === 4){
          return 'width: 8.9vw; height: 8.9vw';
        }
      }
    }
  },
  methods: {
    ...mapMutations("player", ["setTrueJigsawList", "setIsJigsawSuccess"]),
    ...mapActions("player", ["getJigsawCurrentList"]),
    close() {
      this.visible = false;
      this.current = null;
    },
    open() {
      this.visible = true;
    },
    async queryUserList(jigsawId) {
      let res = await service.getUserJigsawList({
        jigsawId: jigsawId ? jigsawId : this.dataSource.toolId,
        murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
        userId: this.userInfo.id,
      });
      this.swiperIndex = 0;
      this.userList = res;
    },
    async queryTrueJigsawList(jigsawId) {
      let res = await service.getTrueJigsaw({
        jigsawId: jigsawId ? jigsawId : this.dataSource.toolId,
        murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
      });
      this.setTrueJigsawList(res);
    },
    onChangeCurrent(type){
      if(type === 'left'){
        if(this.swiperIndex === 0)return;
        this.swiperIndex--;
      }else{
        if(this.swiperIndex === this.userList.length - 1)return;
        this.swiperIndex++;
      }
    },
    onChangeSwiper(v) {
      this.swiperIndex = v.detail.current;
    },
    onGetCurrent(){
      if (this.jigsawList.isSuccess) return;
      if (this.userList[this.swiperIndex].userId != this.userInfo.id) return;
      this.current = this.userList[this.swiperIndex];
    },
    async putJigsaw(it) {
      try {
        if (this.jigsawList.isSuccess) return;
        if (!this.current) {
          uni.showToast({
            title: "请选择拼图",
            icon: "none",
          });
          return;
        }
        uni.showLoading({
          title: "放置中",
        });
        if (this.putting) return;
        this.putting = true;
        await service.putJigsaw({
          jigsawColumn: it.jigsawColumn,
          jigsawRow: it.jigsawRow,
          murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
          userId: this.userInfo.id,
          jigsawId: this.dataSource.toolId,
          jigsawBlockId: this.current.id,
        });
        this.queryUserList();
        await this.getJigsawCurrentList({
          jigsawId: this.dataSource.toolId,
          murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
        });
        this.current = null;
        // if (this.isSuccess) {
        // } else {
        //   this.success();
        // }
        this.putting = false;
        uni.hideLoading();
      } catch (e) {
        this.putting = false;
        uni.hideLoading();
      }
    },
    async takeJigsaw(it) {
      try {
        if (this.jigsawList.isSuccess) return;
        if (it.userId != this.userInfo.id) return;
        uni.showLoading({
          title: "取消放置中",
        });
        if (this.putting) return;
        this.putting = true;
        await service.takeJigsaw({
          jigsawColumn: it.jigsawColumn,
          jigsawRow: it.jigsawRow,
          murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
          userId: this.userInfo.id,
          jigsawId: this.dataSource.toolId,
          jigsawBlockId: it.id,
        });
        this.queryUserList();
        await this.getJigsawCurrentList({
          jigsawId: this.dataSource.toolId,
          murderMysteryOnlineRecordId: this.murderMysteryOnlineRecordId,
        });
        this.current = null;
        this.putting = false;
        uni.hideLoading();
      } catch (e) {
        this.putting = false;
        uni.hideLoading();
      }
    },
    success() {
      this.setIsJigsawSuccess(false);
    },
    // success() {
    //   let bool = true;
    //   this.trueJigsawList.jigsawGameItem.blockItemList.map((v, i) => {
    //     if (v.id != this.jigsawList.jigsawGameItem.blockItemList[i].id) {
    //       bool = false;
    //     }
    //   });
    //   if (bool) this.isSuccess = true;
    //   else this.isSuccess = false;
    // },
    //预下载gif图
    downloadGif() {
      wx.downloadFile({
        url: this.$iconFont.getIconName("jigsaw-success"),
        success: (res) => {
          this.jigsawSuccess = res.tempFilePath;
        },
      });
      wx.downloadFile({
        url: this.$iconFont.getIconName("jigsaw-successLogo"),
        success: (res) => {
          this.jigsawSuccessLogo = res.tempFilePath;
        },
      });
      wx.downloadFile({
        url: this.$iconFont.getIconName("jigsaw-gif"),
        success: (res) => {
          this.jigsawGif = res.tempFilePath;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.jigsaw {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: -1;
  &-logo {
    position: absolute;
    top: 0;
    right: 14.78vw;
    display: flex;
    justify-content: flex-end;
    :nth-child(1) {
      /* width: 26.85vw; */
      height: 26.67vh;
    }
    :nth-child(2) {
      /* width: 10.34vw; */
      height: 26.67vh;
    }
  }

  .left {
    position: fixed;
    top: 14.9vh;
    left: 7.3vw;
    .border {
      box-sizing: border-box;
      background: linear-gradient(
        180deg,
        rgba(219, 193, 125, 1),
        rgba(134, 104, 41, 1)
      );
      border-radius: 6px;
      padding: 2px;
      &-padding {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: linear-gradient(180deg, #101317 0%, #24252a 100%);
        border-radius: 6px;
        padding: 6px;
        &-box {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border-radius: 6px;
          background: linear-gradient(
            180deg,
            rgba(41, 42, 47, 1),
            rgba(25, 27, 29, 1)
          );
          padding: 2px;
          display: flex;
          flex-direction: column;
          &-row {
            display: flex;
            &-item {
              box-sizing: border-box;
              // width: 8vw;
              // height: 8vw;
              background: #22211d;
              div {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                border-right: 2px solid #14120b;
                border-bottom: 2px solid #14120b;
              }
            }
            image {
              box-sizing: border-box;
              padding: 2px;
              border-right: 2px solid #14120b;
              border-bottom: 2px solid #14120b;
            }
            .lastColumn {
              border-right: 2px solid #00000000;
            }
            .lastRow {
              border-bottom: 2px solid #00000000;
            }
            .last {
              border-right: 2px solid #00000000;
              border-bottom: 2px solid #00000000;
            }
          }
        }
      }
    }
  }
  .right {
    position: absolute;
    top: 26.13vh;
    right: 13.4vw;
    &-tip {
      min-width: 232px;
      display: flex;
      flex-direction: column;
      margin-bottom: 18rpx;
      :nth-child(1) {
        font-size: 13px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 13px;
        margin-bottom: 2px;
      }
      :nth-child(2) {
        font-size: 10px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
        opacity: 0.6;
      }
    }
    &-box {
      @include hor;
      align-items: center;
      position: fixed;
      right: 13.4vw;
      top: 40vh;
      &-left{
        width: 21px;
        height: 26px;
        margin-right: 22px;
      }
      &-swiper{
        width: 22vw;
        height: 48vh;
        &-item{
          width: 100%;
          height: 100%;
          @include hor-center-center;
          image{
            width: 98%;
            box-sizing: border-box;
            border: 4px solid #BDAD7C;
          }
        }
        .active{
          border: 4px solid #F7CB3F;
        }
      }
      &-right{
        width: 21px;
        height: 26px;
        margin-left: 22px;
      }
    }
    &-numBox{
      position: fixed;
      bottom: 4vh;
      right: 28.8vw;
      font-size: 11px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 13px;
    }
    span:nth-child(2){
      opacity: 0.6;
    }
  }
}
.success {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  &-gif {
    height: 91%;
    width: 66%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &-png {
    width: 27vw;
    height: 27vw;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  span {
    font-size: 11px;
    font-family: Source Han Serif CN-Bold, Source Han Serif CN;
    font-weight: bold;
    color: #ffffff;
    line-height: 12px;
    position: absolute;
    bottom: 9vh;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>
