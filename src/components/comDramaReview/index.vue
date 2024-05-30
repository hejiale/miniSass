<style lang="scss" scoped>
.drama-review-list {
  margin-bottom: 34rpx;
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

    .content-commit {
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2E323E;
      line-height: 33rpx;
      padding-bottom: 24rpx;
      .content-text{
        font-size: 28rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #2E323E;
        line-height: 33rpx;
      }
      .image{
        width: 40rpx;
        height: 40rpx;
      }

    }

    .list-description {
      font-size: 28rpx;
      color: #2E323E;
      line-height: 38rpx;
      margin-bottom: 10rpx;
      position: relative;
      &.hide {
        word-break: break-word; //换行模式
        overflow: hidden;
        text-overflow: ellipsis; //修剪文字，超过2行显示省略号
        display: -webkit-box;
        -webkit-line-clamp: 2; //此处为上限行数
        -webkit-box-orient: vertical;
      }
      .tips {
        width: 90rpx;
        height: 40rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #4876AE;
        background: #FFFFFF;
        position: absolute;
        bottom: 0;
        right: 0;
        &.expand {
          position: initial;
          width: auto;
          display: flex;
          flex: 1;
          justify-content: flex-end;
        }
      }
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
    .label {
      margin: 18rpx 0;
      display: flex;
      align-items: center;
      .label-item {
        display: flex;
        align-items: center;
        margin-right: 18rpx;
        border: 1rpx solid #CDD1D5;
        border-radius: 23rpx 23rpx 23rpx 23rpx;
        background: #FFFFFF;
        padding: 10rpx;
        image {
          width: 28rpx;
          height: 28rpx;
          margin-right: 6rpx;
        }
        p {
          font-size: 22rpx;
          font-weight: 500;
          color: #5F6572;
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
        position:relative;
        .couverImg{
          position: absolute;
          left: 0rpx;
          top: 0rpx;
          width: 60rpx;
          height: 32rpx;
        }
        .couno {
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
          display: flex;
          .dramatext{
            letter-spacing: 0.6px;
            margin-left: 8rpx;
          }
        }
      }
    }
    .list-bottom {
      display: flex;
      justify-content: space-between;
      .sayBox {
        width: 202rpx;
        height: 54rpx;
        border-radius: 94rpx;
        background: #F5F6F8;
        text-align: center;
        line-height: 54rpx;
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
  .popBox {
    height: 30vh;
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
<template>
  <div class="com-drama-review-container">
    <div class="drama-review-list" v-for="(i,idx) in comDramaReviewData" :key="i.id">
      <div class="author-info">
        <div class="author-left" @click="addClickJBRP(i)">
          <div class="avatar">
            <image :src="i.avatar" mode="aspectFill" />
          </div>
          <div class="text">
            <div class="name">{{ $filters.truncateText(i.nickName,7)}}</div>
            <div class="time-source"> {{ i.createDate }}发布于{{i.cityName || ''}}</div>
          </div>
        </div>
        <div class="author-right" @click="showMoreOperationClick(i)">
          <div class="oper">
            <img src="./static/oper.png" alt="" />
          </div>
        </div>
      </div>
      <div class="list-content">
        <p class="content-commit"  @click="addClickJBRP(i)">
          {{i.nickName}}评价这部剧本：
          <span v-if="i.dramaEvaluateType == 'SO_SO' ">
            <img class="image" :src="$iconFont.getIconName('general-facial-expressions')" alt="">
           <span class="content-text">一般</span> </span>
          <span v-else-if="i.dramaEvaluateType == 'RECOMMEND' ">
            <img class="image" :src="$iconFont.getIconName('recommended-emoji')" alt="">
           <span class="content-text">推荐</span> </span>
          <span v-else-if="i.dramaEvaluateType == 'NOT_GOOD' ">
            <img class="image" :src="$iconFont.getIconName('no-expression')" alt="">
           <span class="content-text">不行</span> </span>
        </p>
        <div class="list-description" :class="!i.iSinfo && 'hide'" v-if="i.content" @click="addClickJBRP(i)">
          <span>{{i.content}}</span>
          <div class="tips" :class="iSinfo && 'expand'" @click.stop="showinfo(idx)" v-if="i.content.length > 45">{{i.iSinfo ? '收起' : '...全文'}}</div>
        </div>
        <div>
          <image-grid :images="i.imageList" size="25"></image-grid>
        </div>
        <div class="label">
          <div class="label-item" v-if="i.roleName" @click="addClickJBRP(i)">
            <image :src="require('./static/role.png')" />
            <p>体验角色：{{$filters.truncateText(i.roleName,6)}}</p>
          </div>
          <div class="label-item" v-if="i.storeName" @click="gotoStoreDetail(i)">
            <image :src="require('./static/shop.png')" />
            <p>{{$filters.truncateText(i.storeName,6)}}</p>
            <van-icon name="arrow" style="color: #5F6572;margin-left: 6rpx;" size="28rpx" />
          </div>
        </div>
        <div class="drama" v-if="i.dramaItem">
          <div class="drama-img" @click="goScrdetails(i)">
            <image class="couno" :src="i.dramaItem.dramaCover" mode="aspectFill"/>
            <image
                class="couverImg"
                v-if="i.sellType == 'REAL_SCENE'"
                :src="$iconFont.getIconName('liveAction')"
            />
            <image
                class="couverImg"
                v-if="i.sellType == 'LIMITED'"
                :src="$iconFont.getIconName('Citylimit')"
            />
            <image
                class="couverImg"
                v-if="i.sellType == 'EXCLUSIVE'"
                :src="$iconFont.getIconName('exclusive')"
            />
          </div>
          <div class="drama-text" >
            <div class="drama-name">
              <div class="name" @click="goScrdetails(i)">{{$filters.truncateText(i.dramaItem.dramaName,6)}}</div>
              <div class="want" @click="changeLoveStatus(i)" :class="activeClass">
                <img :src="i.playStatus === 'WANT_PLAY' ? $iconFont.getIconName('aixin') : (i.playStatus === null ? $iconFont.getIconName('closeaixin') : '')" alt />
                <span>{{ i.playStatus === "WANT_PLAY" ? "已想玩" : (i.playStatus === null ? "我想玩" : "") }}</span>
              </div>
            </div>
            <div class="drama-type" @click="goScrdetails(i)">
              {{i.dramaItem.maleGamerNum}}男{{i.dramaItem.femaleGamerNum}}女 {{i.dramaItem.gameTime}}小时 |
              <span class="dramatext" v-for="ite in i.dramaItem.dicts" :key="ite.id">{{ite.dictValue}}</span>
            </div>
          </div>
        </div>
        <div class="list-bottom">
          <div @click="addClickJBRP(i)" class="sayBox">说说你的想法...</div>
          <view class="flex" @click="addClickJBRP(i)">
              <img :src="$iconFont.getIconName('sharepl')" alt="">
              <p>分享</p>
          </view>
          <view class="flex"  @click="toggleImage(i)">
              <img   :src="i.hasFabulous === true ? $iconFont.getIconName('mzan') : $iconFont.getIconName('kzan')" alt="">
              <p>点赞{{ i.praiseQuantity }}</p>
          </view>
          <view class="flex" @click="addClickJBRP(i)">
              <img :src="$iconFont.getIconName('pinglun')" alt="">
            <p>评论{{ i.nowCommentCount !== null ? i.nowCommentCount : '' }}</p>
          </view>
        </div>

      </div>
      <van-action-sheet
          :show="i.showMore"
          :safe-area-inset-bottom="false"
          z-index="1000"
          close-on-click-overlay
          @close="showMoreOperationClick(i)"
          title="更多"
      >
        <div class="popBox">
          <div
              class="menu"
              @click="reportDynamic(i)"
              v-if="userInfoMessage.id !== i.userId"
          >
            <image :src="$iconFont.getIconName('icon-jubao')" />
            <span>举报</span>
          </div>
          <div
              class="menu"
              @click="userDynamicPublishNavigator(i)"
              v-if="userInfoMessage.id === i.userId"
          >
            <image :src="$iconFont.getIconName('icon-edit')" />
            <span>编辑</span>
          </div>
          <div
              class="menu"
              @click="deleteDynamic(i)"
              v-if="userInfoMessage.id === i.userId"
          >
            <image :src="$iconFont.getIconName('icon-delete')" />
            <span>删除</span>
          </div>
        </div>
      </van-action-sheet>
    </div>

  </div>

</template>
<script>
import ImageGrid from "@/components/imageGrid/index.vue";
export default {
  props: {
    userInfoMessage: {
      type: Object,
      default() {
        return null;
      }
    },
    comDramaReviewData: {
      type: Array,
      default: () => [],
    },
  },
  components: { ImageGrid },
  data() {
    return {
      iSinfo: false
    }
  },
 async created() {

  },
  async mounted() {
  },
  computed: {
    loveImageUrl() {
      return this.loveStatus
        ? this.$iconFont.getIconName('aixin')
        : this.$iconFont.getIconName('closeaixin');
    },
    activeClass() {
      return this.loveStatus ? "active" : "";
    },
  },
  watch: {
    
  },
  methods: {
    showMoreOperationClick(i) {
      i.showMore = !i.showMore;
    },
    reportDynamic(i) {
      console.log('i',i)
      uni.setStorageSync("reportPublish", i)
      uni.setStorageSync("reportDetail", {
        'businessId': i.id,
        'feedBusiness': 'DYNAMIC_CIRCLE'
      })
      uni.navigateTo({
        url: "/report/pages/index",
      });
    },
    //删除评论
    deleteDynamic(i){
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该条剧评吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              await that.$api.deleteDramaEvaluate({
                dramaId: i.dramaId,
                id: i.id,
              });
              that.comDramaReviewData.splice(that.comDramaReviewData.findIndex(v=>v.id === i.id), 1);
            } catch (e) {
              console.log(e);
            }
          }
        },
      });
    },
    //编辑
    userDynamicPublishNavigator(i){
      uni.setStorageSync('editDrama', {
        dramaCover: i.dramaItem.dramaCover,
        dramaId: i.dramaId,
        dramaName: i.dramaItem.dramaName,
        evaluateId: i.id,
        edit: 2
      });
      uni.navigateTo({
        url: `/pageDetail/pages/index`,
      });
    },
    //动态点赞
    async toggleImage(i) {
      let status = "DISABLE";
      let dynamicType = 3;
      let dynamicId = i.id;
      if (i.hasFabulous == false) {
        status = "ENABLE";
      } else {
        status = "DISABLE";
      }
      try {
        await this.userPraiseDynamic(status, dynamicType, dynamicId);
        if (i.hasFabulous == false) {
          i.hasFabulous = true;
          i.praiseQuantity++;
        } else {
          i.hasFabulous = false;
          i.praiseQuantity--;
        }
        this.$emit('on-update');
      } catch (err) {
        console.log(err);
      }
    },
    //剧圈动态点赞
    async userPraiseDynamic(status, dynamicType, dynamicId) {
      try {
        await this.$api.userPraiseDynamic({
          dynamicId: dynamicId,
          dynamicType: dynamicType,
          statusEnum: status,
        });
        return true;
      } catch (e) {
        return false;
      }
    },

    //动态剧本详情页
    goScrdetails(i) {
      uni.navigateTo({
        url: "/pageDetail/pages/pageDetail?id=" + i.dramaId,
      });
    },
    addClickJBRP(i) {
      console.log('----------->剧本热评', i);

      // 显示加载提示
      uni.showLoading({
        title: '加载中',
        mask: true // 防止触摸穿透
      });

      // 延迟跳转页面，以确保加载提示显示
      setTimeout(() => {
        uni.navigateTo({
          url: `/pageDetail/pages/scriptReview?userId=${i.userId}&evaluateId=${i.id}&dramaId=${i.dramaId}`,
          success: () => {
            // 页面跳转成功，隐藏加载提示
            uni.hideLoading();
          },
          fail: () => {
            // 页面跳转失败，也要确保隐藏加载提示
            uni.hideLoading();
          }
        });
      }, 300); // 这里的延迟时间可以根据实际情况进行调整
    },
    gotoStoreDetail(i) {
      uni.navigateTo({
        url: `/store-package/pages/index?storeId=${i.storeId}`,
      });
    },
    async toggleFollowStatus(item) {
      // 切换关注状态
      await this.updateUserFocus(item);
    },
    async updateUserFocus(i) {
      i.isFocus = !i.isFocus;
      try {
        let data = await this.$api.updateUserFocus({
        flag:i.isFocus,focusUserId:i.userId,userId:this.userInfoMessage.id
        });
      } catch (e) {}
    },
    // 全文展开收起
    showinfo(i) {
      this.comDramaReviewData[i].iSinfo = !this.comDramaReviewData[i].iSinfo;
    },
    // gotoDynamicDetail(id) {
    //   uni.navigateTo({
    //     url: `/dynamicDetail/pages/index?id=${id}`
    //   });
    // },
   async changeLoveStatus(i) {
      if(i.playStatus == "WANT_PLAY"){

      await  this.cancelUserDramaPlayMP(i);
      } else if(i.playStatus == null){
        i.playStatus = "WANT_PLAY"
      await  this.updateUserDramaPlayMP(i);
      }
    },
    async updateUserDramaPlayMP(i) {
      try {
        await this.$api.updateUserDramaPlayMP({
          dramaId: i.dramaId,
          playStatus: "WANT_PLAY",
          userId: this.userInfoMessage.id,
        });
        return i.playStatus = "WANT_PLAY";
      } catch (e) {
        return false;
      }
    },
    // async updateUserDramaPlayMP(i) {
    //   try {
    //     let data = await this.$api.updateUserDramaPlayMP({
    //       dramaId: i.dramaId,
    //       playStatus: "WANT_PLAY",
    //       userId: id,
    //     });
    //     return true;
    //   } catch (e) {
    //     return false;
    //   }
    // },
    async cancelUserDramaPlayMP(i) {
      try {
        let data = await this.$api.cancelUserDramaPlayMP({
          dramaId: i.dramaId,
          playStatus: null,
          userId: this.userInfoMessage.id,
        });

        return i.playStatus = null;
      } catch (e) {
        return false;
      }
    },
  },

}
</script>