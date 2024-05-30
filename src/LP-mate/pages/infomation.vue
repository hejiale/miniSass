<template>
  <div class="container">
    <navigation-bar :nav="customNav">
      <view slot="left" @click="onBack">
        <image
          class="container-back"
          src="../static/image/icon-back.png"
        ></image>
      </view>
    </navigation-bar>
    <swiper class="container-swiperBox" @change="onChangeSwiper">
      <swiper-item v-for="url in bannerList" :key="url" @click="onPrview(url)">
        <image :src="url" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <div class="container-countBox" v-if="bannerList.length > 1">{{ current }}/{{ bannerList.length }}</div>
    <div class="container-contentBox">
      <div class="container-contentBox-infoBox" :class="{bottomLine: !isEmpty}">
        <image
          src="../static/image/infoContent-bg.png"
          class="container-contentBox-infoBox-bg"
        ></image>
        <div class="container-contentBox-infoBox-nameBox">
          <span>{{ lpUserInfo.name }}</span>
          <image
            src="../static/image/icon-male.png"
            class="container-contentBox-infoBox-nameBox-sex"
            v-if="lpUserInfo.sex === 'MALE'"
          ></image>
          <image
            src="../static/image/icon-female.png"
            class="container-contentBox-infoBox-nameBox-sex"
            v-if="lpUserInfo.sex === 'FEMALE'"
          ></image>
        </div>
        <div class="container-contentBox-infoBox-tagsBox">
          <div
            class="container-contentBox-infoBox-tagsBox-item"
            v-for="tag in infoTags"
            :key="tag"
          >
            {{ tag }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-introduceBox bottomLine" v-if="lpUserInfo.content">
        <span class="container-contentBox-introduceBox-title">关于我</span>
        <span class="container-contentBox-introduceBox-content">{{
          lpUserInfo.content
        }}</span>
      </div>
      <div class="container-contentBox-timeBox bottomLine" v-if="theatreTimes.length">
        <span class="container-contentBox-timeBox-title">ta的剧场时光</span>
        <view class="container-contentBox-timeBox-imageScroll" scroll-x>
          <div
            class="container-contentBox-timeBox-imageScroll-activityBox"
            v-for="(time, index) in theatreTimes"
            :key="index"
            @click="onActivity(time.activeId)"
          >
            <image
              :src="time.pic"
              class="container-contentBox-timeBox-imageScroll-activityBox-image"
              mode="aspectFill"
            ></image>
            <span
              class="container-contentBox-timeBox-imageScroll-activityBox-name"
              >{{ time.title }}</span
            >
            <div
              class="container-contentBox-timeBox-imageScroll-activityBox-LineBox"
            ></div>
            <div
              class="container-contentBox-timeBox-imageScroll-activityBox-circle"
            >
              <div
                class="container-contentBox-timeBox-imageScroll-activityBox-circle-center"
              ></div>
            </div>
            <div
              class="container-contentBox-timeBox-imageScroll-activityBox-title"
            >
              报名了剧场
            </div>
            <div
              class="container-contentBox-timeBox-imageScroll-activityBox-time"
            >
              {{ $dayjs(time.regTime).format("YYYY.MM.DD") }}
            </div>
          </div>
        </view>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.leisureHobbies">
        <span class="container-contentBox-propertyBox-title">休闲爱好</span>
        <div class="container-contentBox-propertyBox-list">
          <div
            class="container-contentBox-propertyBox-list-item"
            v-for="v in lpUserInfo.leisureHobbies"
            :key="v"
          >
            {{ v }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.sportsHobbies">
        <span class="container-contentBox-propertyBox-title">运动爱好</span>
        <div class="container-contentBox-propertyBox-list">
          <div
            class="container-contentBox-propertyBox-list-item"
            v-for="v in lpUserInfo.sportsHobbies"
            :key="v"
          >
            {{ v }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.dietaryPreferences">
        <span class="container-contentBox-propertyBox-title">饮食偏好</span>
        <div class="container-contentBox-propertyBox-list">
          <div
            class="container-contentBox-propertyBox-list-item"
            v-for="v in lpUserInfo.dietaryPreferences"
            :key="v"
          >
            {{ v }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.favoriteAnimal">
        <span class="container-contentBox-propertyBox-title">最喜欢的动物</span>
        <div class="container-contentBox-propertyBox-list">
          <div class="container-contentBox-propertyBox-list-item">
            {{ lpUserInfo.favoriteAnimal }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.placesToVisitDomestic || lpUserInfo.placesToVisitOversea">
        <span class="container-contentBox-propertyBox-title">最想去的地方</span>
        <div class="container-contentBox-propertyBox-list">
          <div
            class="container-contentBox-propertyBox-list-item"
            v-for="v in lpUserInfo.placesToVisitDomestic"
            :key="v"
          >
            {{ v }}
          </div>
          <div
            class="container-contentBox-propertyBox-list-item"
            v-for="v in lpUserInfo.placesToVisitOversea"
            :key="v"
          >
            {{ v }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.favoriteMovieGenres">
        <span class="container-contentBox-propertyBox-title"
          >喜欢的电影类型</span
        >
        <div class="container-contentBox-propertyBox-list">
          <div
            class="container-contentBox-propertyBox-list-item"
            v-for="v in lpUserInfo.favoriteMovieGenres"
            :key="v"
          >
            {{ v }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.favoriteMovie">
        <span class="container-contentBox-propertyBox-title">最喜欢的电影</span>
        <div class="container-contentBox-propertyBox-list">
          <div class="container-contentBox-propertyBox-list-item">
            {{ lpUserInfo.favoriteMovie }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.favoriteMusicGenres">
        <span class="container-contentBox-propertyBox-title"
          >喜欢的音乐类型</span
        >
        <div class="container-contentBox-propertyBox-list">
          <div
            class="container-contentBox-propertyBox-list-item"
            v-for="v in lpUserInfo.favoriteMusicGenres"
            :key="v"
          >
            {{ v }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox bottomLine" v-if="lpUserInfo.favoriteMusic">
        <span class="container-contentBox-propertyBox-title">最喜欢的音乐</span>
        <div class="container-contentBox-propertyBox-list">
          <div class="container-contentBox-propertyBox-list-item">
            {{ lpUserInfo.favoriteMusic }}
          </div>
        </div>
      </div>
      <div class="container-contentBox-propertyBox" v-if="lpUserInfo.favoriteBook">
        <span class="container-contentBox-propertyBox-title">最喜欢的书籍</span>
        <div class="container-contentBox-propertyBox-list">
          <div class="container-contentBox-propertyBox-list-item">
            {{ lpUserInfo.favoriteBook }}
          </div>
        </div>
      </div>
      <image :src="$iconFont.getIconName('none-note')" class="container-contentBox-empty" v-if="isEmpty"></image>
      <div style="height: 160rpx"></div>
    </div>
    <image
      class="container-message"
      src="../static/image/icon-message.png"
      @click="onMessage"
    ></image>
    <image
      class="container-invite"
      :src="$iconFont.getIconName('icon-mate-invite')"
      @click="onInvite"
    ></image>
    <image class="container-focus" src="../static/image/has-focus.png" @click="showDialog = true" v-if="isFollow"></image>
    <image class="container-focus" src="../static/image/icon-focus.png" @click="onFocus" v-else></image>
    <div class="topBox" :style="navBarStyle" v-if="showTop" @click="onBack">
        <image src="../static/image/pop-back.png" class="topBox-back"></image>
        <span class="topBox-name">{{ lpUserInfo.name }}</span>
    </div>
    <van-popup :show="showDialog" position="center" round>
      <div class="dialogBox">
        <image src="../static/image/cancel-focus.png" class="dialogBox-bg"></image>
        <div class="dialogBox-button" @click="showDialog = false"></div>
        <div class="dialogBox-button" @click="onCancelFocus"></div>
      </div>
    </van-popup>
    <van-popup :show="showFocusStatus" position="center" round>
      <image src="../static/image/focus-success.png" class="status-dialog"></image>
    </van-popup>
    <van-popup :show="showUnFocusStatus" position="center" round>
      <image src="../static/image/cancelFocus-success.png" class="status-dialog"></image>
    </van-popup>
  </div>
</template>
<script>
import service from "../utils/service";
import { getMenuButtonRect } from "@/utils/index";
import navigationBar from "@/components/navigation-bar";
export default {
  components: {
    navigationBar,
  },
  data() {
    return {
      lpUserInfo: {},
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "",
      },
      current: 1,
      theatreTimes: [],
      menuReact: {},
      showTop: false,
      userSelftId: null,
      isFollow: false,
      showDialog: false,
      showFocusStatus: false,
      showUnFocusStatus: false
    };
  },
  computed: {
    infoTags() {
      let tags = [];
      if (this.lpUserInfo.age) {
        tags.push(`${this.lpUserInfo.age}岁`);
      }
      if (this.lpUserInfo.height) {
        tags.push(`${this.lpUserInfo.height}cm`);
      }
      if (this.lpUserInfo.permanentResidenceCity) {
        tags.push(this.lpUserInfo.permanentResidenceCity);
      }
      if (this.lpUserInfo.permanentResidenceOverSeas) {
        tags.push(this.lpUserInfo.permanentResidenceOverSeas);
      }
      if (this.lpUserInfo.education) {
        tags.push(this.lpUserInfo.education);
      }
      if (this.lpUserInfo.occupation) {
        tags.push(this.lpUserInfo.occupation);
      }
      return tags;
    },
    bannerList() {
      return [this.lpUserInfo.avatar, ...(this.lpUserInfo.albumUrls || [])];
    },
    navBarStyle(){
      return `padding-top: ${this.menuReact.top || 44}px`;
    },
    isEmpty(){
        return !this.lpUserInfo.age 
            && !this.lpUserInfo.height 
            && !this.lpUserInfo.permanentResidenceCity 
            && !this.lpUserInfo.permanentResidenceOverSeas
            && !this.lpUserInfo.education
            && !this.lpUserInfo.occupation
            && !this.lpUserInfo.content
            && !this.theatreTimes.length
            && !this.lpUserInfo.leisureHobbies
            && !this.lpUserInfo.sportsHobbies
            && !this.lpUserInfo.dietaryPreferences
            && !this.lpUserInfo.favoriteAnimal
            && !this.lpUserInfo.placesToVisitDomestic
            && !this.lpUserInfo.favoriteMovieGenres
            && !this.lpUserInfo.favoriteMovie
            && !this.lpUserInfo.favoriteMusicGenres
            && !this.lpUserInfo.favoriteMusic
            && !this.lpUserInfo.favoriteBook;
    }
  },
  onPageScroll(event) {
    if (event.scrollTop > 100) {
        this.showTop = true;
    }else{
        this.showTop = false;
    }
  },
  async onLoad(options) {
    this.menuReact = await getMenuButtonRect();
    this.userSelftId = options.useSelf;
    await this.getMemberInfo(options.userId);
    await this.queryIsFollow();
  },
  methods: {
    onBack(){
      uni.navigateBack()
    },
    //预览 
    onPrview(url){
      wx.previewImage({
        current: url,
        urls: this.bannerList,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },
    //私信
    onMessage(){
      uni.showModal({
        title: "提示",
        content: "请前往“剧游宇宙APP”私信对方",
        showCancel: false,
        success(res) {
        },
      });
    },
    //关注
    async onFocus(){
      await service.lpUserFollowFocus({followLpUserId: this.lpUserInfo.id, lpUserId: this.userSelftId})

      this.showFocusStatus = true;
      setTimeout(()=>{
        this.showFocusStatus = false;
      }, 2000)
      await this.queryIsFollow();
    },
    //取消关注
    async onCancelFocus(){
      await service.lpUserFollowCancelFocus({followLpUserId: this.lpUserInfo.id, lpUserId: this.userSelftId})
      this.showDialog = false;
      this.showUnFocusStatus = true;
      setTimeout(()=>{
        this.showUnFocusStatus = false;
      }, 2000)
      await this.queryIsFollow();
    },
    //判断是否关注
    async queryIsFollow(){
      let res = await service.lpUserFollowIsFollow({followLpUserId: this.lpUserInfo.id, lpUserId: this.userSelftId});
      this.isFollow = res.isFollow;
    },
    //查询会员信息
    async getMemberInfo(userId) {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId,
      });
      await this.queryTheatreTime();
    },
    onChangeSwiper(e) {
      this.current = e.detail.current + 1;
    },
    async queryTheatreTime() {
      this.theatreTimes = await service.theatreTime({
        lpUserId: this.lpUserInfo.id,
      });
    },
    onInvite(){
      uni.navigateTo({url: `/LP-mate/pages/inviteList?lpUserId=${this.lpUserInfo.id}`})
    },
    onActivity(id){
      uni.navigateTo({url: `/lovepotion/pages/detail?id=${id}`})
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-back {
    width: 200rpx;
    height: 88rpx;
    transform: translateX(-20rpx);
  }
  &-more {
    position: absolute;
    right: 0px;
    top: 88rpx;
    width: 200rpx;
    height: 88rpx;
    z-index: 1;
  }
  &-swiperBox {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 1000rpx;
  }
  &-countBox {
    position: absolute;
    right: 32rpx;
    top: 778rpx;
    width: 84rpx;
    height: 50rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 16rpx;
    z-index: 1;
    @include hor-center-center;
    font-weight: 600;
    font-size: 24rpx;
    color: #ffffff;
  }
  &-contentBox {
    position: absolute;
    top: 860rpx;
    width: 750rpx;
    z-index: 1;
    &-infoBox {
      position: relative;
      width: 100%;
      padding: 52rpx 32rpx 64rpx 32rpx;
      box-sizing: border-box;
      &-bg {
        @include abscenter;
        z-index: -1;
      }
      &-nameBox {
        font-weight: 500;
        font-size: 44rpx;
        color: #111111;
        max-width: 80vw;
        @include hor;
        align-items: center;
        &-sex {
          width: 48rpx;
          height: 48rpx;
          margin-left: 18rpx;
        }
      }
      &-tagsBox {
        margin-top: 24rpx;
        // white-space: nowrap;
        // @include hor;
        // align-items: center;
        &-item {
          padding: 8rpx 20rpx;
          font-size: 24rpx;
          color: #111111;
          background: #f3f3f3;
          margin-right: 12rpx;
          border-radius: 24rpx;
          min-width: 54rpx;
          // @include hor-center-center;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12rpx;
        }
      }
    }
    &-introduceBox {
      padding: 48rpx 32rpx;
      box-sizing: border-box;
      @include ver;
      &-title {
        font-weight: 500;
        font-size: 36rpx;
        color: #111111;
        line-height: 42rpx;
      }
      &-content {
        margin-top: 24rpx;
        font-size: 32rpx;
        color: #2e323e;
        line-height: 38rpx;
      }
    }
    &-timeBox {
      padding: 64rpx 32rpx;
      box-sizing: border-box;
      @include ver;
      &-title {
        font-weight: 500;
        font-size: 36rpx;
        color: #111111;
        line-height: 42rpx;
      }
      &-imageScroll {
        margin-top: 24rpx;
        @include hor;
        overflow-x: scroll;
        &-activityBox {
          display: inline-flex;
          flex-direction: column;
          position: relative;
          &-image {
            width: 168rpx;
            height: 224rpx;
            border-radius: 8rpx;
          }
          &-name {
            margin-top: 14rpx;
            font-weight: 500;
            font-size: 26rpx;
            color: #2e323e;
            @include text-overflow-line(1);
            width: 168rpx;
            text-align: center;
          }
          &-LineBox {
            position: relative;
            margin-top: 28rpx;
            width: 180rpx;
            height: 4rpx;
            background: linear-gradient(90deg, #ece6f2 0%, #ebebed 100%);
          }
          &-circle {
            margin-left: 44%;
            margin-top: -16rpx;
            transform: translateX(-50%);
            width: 28rpx;
            height: 28rpx;
            background: rgba($color: #a082bc, $alpha: 0.2);
            border-radius: 50%;
            @include hor-center-center;
            &-center {
              width: 12rpx;
              height: 12rpx;
              background: #a082bc;
              border-radius: 50%;
            }
          }
          &-title {
            margin-top: 6rpx;
            font-size: 24rpx;
            color: #a082bc;
            width: 100%;
            text-align: center;
          }
          &-time {
            margin-top: 6rpx;
            font-size: 24rpx;
            color: #a082bc;
            width: 100%;
            text-align: center;
          }
        }
      }
    }
    &-propertyBox {
      padding: 72rpx 32rpx;
      box-sizing: border-box;
      @include ver;
      &-title {
        font-weight: 500;
        font-size: 36rpx;
        color: #111111;
        line-height: 42rpx;
      }
      &-list {
        margin-top: 30rpx;
        &-item {
          display: inline-block;
          padding: 10rpx 22rpx;
          background: #f3f3f3;
          border-radius: 32rpx;
          border: 2rpx solid #dadada;
          font-size: 26rpx;
          color: #5f6572;
          margin-right: 20rpx;
          margin-bottom: 24rpx;
        }
      }
    }
    &-empty{
        width: 280rpx;
        height: 248rpx;
        margin-top: 90rpx;
        margin-left: 50%;
        transform: translateX(-50%);
    }
  }
  .bottomLine {
    border-bottom: 8rpx solid #f6f7f9;
  }
  &-message {
    position: fixed;
    left: 44rpx;
    bottom: 78rpx;
    width: 130rpx;
    height: 74rpx;
    z-index: 1;
  }
  &-invite {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 64rpx;
    width: 324rpx;
    height: 100rpx;
    z-index: 1;
  }
  &-focus {
    position: fixed;
    right: 44rpx;
    bottom: 78rpx;
    width: 130rpx;
    height: 74rpx;
    z-index: 1;
  }
}
.topBox{
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    height: 88rpx;
    background: #fff;
    z-index: 101;
    @include hor;
    align-items: center;
    &-back{
        width: 56rpx;
        height: 56rpx;
        padding-left: 32rpx;
    }
    &-name{
        margin-left: 24rpx;
        font-weight: 500;
        font-size: 30rpx;
        color: #111111;
    }
}
.dialogBox{
  position: relative;
  width: 576rpx;
  height: 340rpx;
  &-bg{
    @include abscenter;
  }
  &-button{
    position: absolute;
    bottom: 0px;
    width: 50%;
    height: 100rpx;
  }
  &-button:nth-child(2){
    left: 0px;
  }
  &-button:nth-child(3){
    right: 0px;
  }
}
.status-dialog{
  width: 204rpx;
  height: 90rpx;
}
</style>