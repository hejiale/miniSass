<template>
  <div class="bg">
    <div class="trends-item" >
      <div class="author-info">
        <div class="author-left">
          <div class="avatar">
            <image :src="detailstore.avatar" mode="aspectFill" @click="userDetailNavigator(detailstore.createUserId)"/>
          </div>
          <div class="text">
            <div class="name">{{detailstore.nickName}}</div>
            <div class="time-source">{{detailstore.createDate}}发布于{{detailstore.city || '未知'}}</div>
          </div>
        </div>
        <div class="author-right" >
          <div class="oper" @click="showMoreOperationClick(detailstore)">
            <img src="../static/image/oper.png" alt="">
          </div>
        </div>
      </div >
      <div class="list-content">
        <div class="list-description" :class="isOpen ? '' : 'overflowLine'"  @click="userDynamicDetailNavigator(detailstore.id)" v-if="detailstore.content">
          {{detailstore.content}}
          <div
          class="list-description-openBox"
          v-if="detailstore.content.length > 80"
          @click.stop="onFold"
        >
          {{ isOpen ? "收起" : "...展开" }}
        </div>
        </div>
        <div class="list-img multiple"  >
          <div v-for="(item,index) in detailstore.fileList" :key="index">
            <image :src="item" mode="widthFix" />
          </div>
        </div>
        <div class="drama">
          <div class="drama-img" @click="dramaDetailNavigator(detailstore.dramaId)">
            <image :src="detailstore.dramaItem.dramaCover" mode="aspectFill" />
          </div>
          <div class="drama-text">
            <div class="drama-name">
              <div class="name">{{$filters.truncateText(detailstore.dramaItem.dramaName,7)}}</div>
              <div class="want" @click="changeLoveStatus" :class="activeClass" v-if="queryAppDramaDetailList.isEvaluate != false && queryAppDramaDetailList.playStatus != 'HAS_PLAY'">
                <img :src="loveImageUrl" alt />
                <span>{{loveStatus ? '已想玩' : '我想玩'}}</span>
              </div>
            </div>
            <div class="drama-type">
              {{detailstore.dramaItem.maleGamerNum}}男{{detailstore.dramaItem.femaleGamerNum}}女 {{detailstore.dramaItem.gameTime}}小时 |
              <span class="dramatext" v-for="ite in detailstore.dramaItem.dicts" :key="ite.id">{{ite.dictValue}}</span>
            </div>
          </div>
        </div>
        <div class="list-bottom">
          <input
              placeholder="说说你的想法..."
              v-model="keywords"
              @confirm="onSearch"
              @input="onInputSearch"
              @focus="onFocus"
              disabled
              @click="userDynamicDetailNavigator(detailstore.id)"
          />
          <view class="flex" @click="userDynamicDetailNavigator(detailstore.id)">
            <img :src="$iconFont.getIconName('sharepl')" alt="">
            <p>分享</p>
          </view>
          <view class="flex" @click="toggleImage(detailstore)">
            <img :src="detailstore.isPraise === true ? $iconFont.getIconName('mzan') : $iconFont.getIconName('kzan')" alt="">
            <p v-text="$filters.quantityTransferThousand(detailstore.praiseQuantity) != null ? $filters.quantityTransferThousand(detailstore.praiseQuantity) : '点赞' "></p>
          </view>
          <view class="flex" @click="userDynamicDetailNavigator(detailstore.id)">
            <img :src="$iconFont.getIconName('pinglun')" alt="">
            <p>评论</p>
          </view>
        </div>
      </div>
      <van-action-sheet
          :show="showMore"
          :safe-area-inset-bottom="false"
          z-index="1000"
          close-on-click-overlay
          @close="showMoreOperationClick(detailstore)"
          title="更多"
      >
        <div class="popBox">
          <div
              class="menu"
              @click="reportDynamic(detailstore)"
              v-if="userId != detailstore.createUserId"
          >
            <image src="../static/image/icon-jubao.png" />
            <span>举报</span>
          </div>
          <div
              class="menu"
              @click="userDynamicPublishNavigator(detailstore.id)"
              v-if="userId == detailstore.createUserId"
          >
            <image src="../static/image/icon-edit.png" />
            <span>编辑</span>
          </div>
          <div
              class="menu"
              @click="deleteDynamic(detailstore)"
              v-if="userId == detailstore.createUserId"
          >
            <image src="../static/image/icon-delete.png" />
            <span>删除</span>
          </div>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import {
  dramaDetailNavigator,
  userDetailNavigator,
  userDynamicDetailNavigator,
  userDynamicPublishNavigator,
} from "@/utils/navigator.js"
export default {
  data() {
    return {
      iSinfo: false,
      loveStatus: false,
      showMore:false,
      isOpen: false
    };
  },
  props: {
    detailstore: {
      type: Object,
      default() {
        return null;
      }
    },
    queryAppDramaDetailList: {
      type: Object,
      default() {
        return null;
      }
    },
    userId: {
      type: String,
      default() {
        return null;
      }
    }
  },
  methods:{
    userDetailNavigator,
    userDynamicDetailNavigator,
    dramaDetailNavigator,
    userDynamicPublishNavigator,
    onFold() {
      this.isOpen = !this.isOpen;
    },
    //动态点赞
    async toggleImage(i) {
      let status = "DISABLE";
      let dynamicType = 1;
      let dynamicId = i.id;
      if (i.isPraise == false) {
        status = "ENABLE";
      } else {
        status = "DISABLE";
      }
      try {
        await this.userPraiseDynamic(status, dynamicType, dynamicId);
        this.$emit('update:trendsItem');
      } catch (err) {
        console.log(err);
      }
    },
     async deleteDynamic(detailstore){
       let that = this;
       wx.showModal({
         title: "提示",
         content: "确认删除该条动态吗？",
         success: async function (res) {
           if (res.confirm) {
             try {
               let data = await that.$api.deleteDynamic({
                 id: detailstore.id,
                 userId: that.userId,
               });
               that.showMore = false;
               that.$emit('update:delete');
             } catch (e) {
               console.log(e)
             }
           }
         },
       });
     },
    async userPraiseDynamic(status, dynamicType, dynamicId) {
      try {
        let data = await this.$api.userPraiseDynamic({
          dynamicId: dynamicId,
          dynamicType: dynamicType,
          statusEnum: status,
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    loveImageUrl() {
      return this.loveStatus
          ? this.$iconFont.getIconName('aixin')
          : this.$iconFont.getIconName('closeaixin');
    },
    showMoreOperationClick(detailstore) {
      console.log(detailstore.showMore)
      this.showMore = !this.showMore;
    },
    reportDynamic(detailstore) {
      uni.setStorageSync("reportPublish", detailstore)
      uni.setStorageSync("reportDetail", {
        'businessId': detailstore.id,
        'feedBusiness': 'DYNAMIC_CIRCLE'
      })
      uni.navigateTo({
        url: "/report/pages/index",
      });
    },
    // 全文展开收起
    showinfo(i) {
      i.overFlowOpen = !i.overFlowOpen;
    },
    gotoDynamicDetail() {
      uni.navigateTo({
        url: "/dynamicDetail/pages/index"
      });
    },
    async onFocus(i) {
      console.log('3wcc',i)
      try {
        this.$emit('trends-update', {
          isFocus: !this.detailstore.isFocus,
          focusUserId: this.detailstore.createUserId,
          userId: this.userId,
        });
      } catch (e) {}
    },
  }
};
</script>

<style lang="scss" scoped>
.bg{
  // margin-top: 20rpx;
  background: #fafafaFF;
  width: 100%;
  //display: flex;
  //
  //justify-content: center;


  .trends-item {
    margin-top: 20rpx;
    width: calc(100% - 40rpx);
    background: #ffffff;
    border-radius: 18rpx;
    padding: 0 20rpx;
    //display: flex;
    //justify-content: space-between;
    //box-sizing: border-box;
    .author-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;
      .author-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 80rpx;
          height: 80rpx;
          background: #DAD9DC;
          margin-right: 20rpx;
          border-radius: 50%;
          image{
            border-radius: 50%;
          }
        }
        .text {
          .name {
            font-size: 30rpx;
            font-weight: 600;
            color: #2E323E;
            margin-bottom: 10rpx;
          }
          .time-source {
            font-size: 22rpx;
            color: #959AA5;
          }
        }
      }
      .author-right {
        display: flex;
        align-items: center;
        .follow-gradient {
          width: 108rpx;
          height: 48rpx;
          background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);
          border-radius: 98rpx;
          padding: 4rpx 8rpx;
          box-sizing: border-box;
          margin-right: 40rpx;
          display: flex;
          align-items: center;
          .follow-confirm {
            width: 100%;
            height: 44rpx;
            line-height: 44rpx;
            background: #111111;
            border-radius: 98rpx;
            font-size: 22rpx;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
          }
          &.already {
            background: #EBEBEB;
            .follow-confirm {
              background: #D6D6D6;
            }
          }
        }
        .oper {
          width: 42rpx;
          height: 42rpx;
        }
      }
    }
    .list-content {
      margin-left: 92rpx;
      .list-description {
        font-size: 28rpx;
        color: #2E323E;
        line-height: 40rpx;
        margin-bottom: 10rpx;
        position: relative;
        word-break: break-all;
        &-openBox {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #4876ae;
          background: #fff;
          height: 42rpx;
          display: flex;
          flex-direction: column-reverse;
        }
      }
      .overflowLine {
        @include text-overflow-line(2);
      }
      .list-img {
        margin-bottom: 24rpx;
        display: flex;
        flex-wrap: wrap;
        image {
          border-radius: 24rpx;
        }
        &.one {
          image {
            width: 472rpx;
            // height: 630rpx;
          }
        }
        &.two {
          image {
            width: 232rpx;
            margin-right: 6rpx;
            &:nth-child(1) {
              border-radius: 24rpx 0 0 24rpx;
            }
            &:nth-child(2) {
              border-radius: 0 24rpx 0 24rpx;
            }
          }
        }
        &.multiple {
          image {
            width: 194rpx;
            margin-right: 6rpx;
            margin-bottom: 6rpx;
            &:nth-child(3n) {
              margin-right: 0;
            }
            &:nth-child(1) {
              border-radius: 24rpx 0 0 0;
            }
            &:nth-child(3) {
              border-radius: 0 24rpx 0 0;
            }
            &:nth-child(7) {
              border-radius: 0 0 0 24rpx;
            }
            &:nth-child(9) {
              border-radius: 0 0 24rpx 0;
            }
          }
        }
      }
      .drama {
        background: #F5F6F8;
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        display: flex;
        align-items: center;
        height: 128rpx;
        margin-bottom: 28rpx;
        .drama-img {
          width: 96rpx;
          height: 128rpx;
          opacity: 1;
          image {
            border-radius: 12rpx;
          }
        }
        .drama-text {
          flex: 1;
          padding: 22rpx 12rpx;
          .drama-name {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10rpx;
            .name {
              font-size: 28rpx;
              font-weight: 600;
              color: #2E323E;
            }
            .want {
              display: flex;
              align-items: center;
              font-size: 26rpx;
              color: #959AA5;
              image {
                width: 36rpx;
                height: 36rpx;
                margin-right: 6rpx;
              }
              span {
                font-size: 26rpx;
                color: #959AA5;
              }
              &.active {
                span {
                  color: #FA8E12;
                }
              }
            }
          }
          .drama-type {
            font-size: 24rpx;
            color: #959AA5;
          }
        }
      }
      .list-bottom {
        display: flex;
        justify-content: space-between;
        input {
          width: 202rpx;
          height: 54rpx;
          border-radius: 94rpx;
          background: #F5F6F8;
          text-align: center;
        }
        .flex {
          display: flex;
          align-items: center;
        }
        img {
          width: 26rpx;
          height: 26rpx;
          margin-right: 6rpx;
        }
        p {
          font-size: 24rpx;
          color: #5F6572;
        }
      }
    }
  }
  .popBox {
    height: 15vh;
    .menu {
      position: absolute;
      left: 32rpx;
      top: 120rpx;
      width: 100rpx;
      @include ver;
      align-items: center;
      image {
        width: 100rpx;
        height: 100rpx;
      }
      span {
        margin-top: 16rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
        line-height: 28rpx;
        text-align: center;
        width: 100%;
      }
      button {
        background: unset !important;
        @include abscenter;
      }
      button::after {
        border: none !important;
      }
    }
    .menu:nth-child(2) {
      left: 172rpx;
    }
    .menu:nth-child(3) {
      left: 312rpx;
    }
    .menu:nth-child(4) {
      left: 452rpx;
    }
  }
}

</style>