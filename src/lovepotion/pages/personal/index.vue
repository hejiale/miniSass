<template>
  <div class="container" v-if="lpUserInfo">
    <div class="container-cell" @click="onUpload">
      <span>头像</span>
      <div class="container-cell-right">
        <image
          class="container-cell-right-head"
          :src="lpUserInfo.avatar"
          mode="aspectFill"
        ></image>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('album')">
      <span>相册</span>
      <div class="container-cell-right">
        <span v-if="lpUserInfo.albumUrls.length > 0"
          >{{ lpUserInfo.albumUrls.length }}张</span
        >
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('name')">
      <span>姓名</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.name }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('sex')">
      <span>性别</span>
      <div class="container-cell-right">
        <span>{{ $enums.LP_SEX.getName(lpUserInfo.sex) }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('phone')">
      <span>手机号</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.phone }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('desc')">
      <span>简介</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.content || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('age')">
      <span>年龄</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.age !== null ? lpUserInfo.age : "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('occupation')">
      <span>职业</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.occupation || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('education')">
      <span>学历</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.education || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('height')">
      <span>身高</span>
      <div class="container-cell-right">
        <span>{{ $filters.setUnit(lpUserInfo.height, 'cm') }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('weight')">
      <span>体重</span>
      <div class="container-cell-right">
        <span>{{  $filters.setUnit(lpUserInfo.weight, 'kg') }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('politics')">
      <span>政治面貌</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.politicalStatus || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('city')">
      <span>籍贯</span>
      <div class="container-cell-right">
        <span v-if="lpUserInfo.isOverSea">{{
          lpUserInfo.overSeaNativePlace || ""
        }}</span>
        <span v-else
          >{{ lpUserInfo.provinceName || "" }}
          {{ lpUserInfo.cityName || "" }}</span
        >
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('residence')">
      <span>常住地</span>
      <div class="container-cell-right">
        <span v-if="lpUserInfo.permanentResidenceType === 'OVERSEAS'">{{
          lpUserInfo.permanentResidenceOverSeas || ""
        }}</span>
        <span v-else
          >{{ lpUserInfo.permanentResidenceProvince || "" }}
          {{ lpUserInfo.permanentResidenceCity || "" }}</span
        >
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('hobby')">
      <span>休闲爱好</span>
      <div class="container-cell-right">
        <span>{{ joinWords(lpUserInfo.leisureHobbies) }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('diet')">
      <span>饮食偏好</span>
      <div class="container-cell-right">
        <span>{{ joinWords(lpUserInfo.dietaryPreferences) }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('motion')">
      <span>运动爱好</span>
      <div class="container-cell-right">
        <span>{{ joinWords(lpUserInfo.sportsHobbies) }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('animal')">
      <span>最喜欢的动物</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.favoriteAnimal || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('movieType')">
      <span>喜欢的电影类型</span>
      <div class="container-cell-right">
        <span>{{ joinWords(lpUserInfo.favoriteMovieGenres) }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('movie')">
      <span>最喜欢的电影</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.favoriteMovie || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('musicType')">
      <span>喜欢的音乐类型</span>
      <div class="container-cell-right">
        <span>{{ joinWords(lpUserInfo.favoriteMusicGenres) }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('music')">
      <span>最喜欢的音乐</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.favoriteMusic || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('book')">
      <span>最喜欢的书籍</span>
      <div class="container-cell-right">
        <span>{{ lpUserInfo.favoriteBook || "" }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
    <div class="container-cell" @click="onGoEdit('place')">
      <span>近期想去的地方</span>
      <div class="container-cell-right">
        <span>{{ wantPlay }}</span>
        <van-icon name="arrow" color="#959AA5" size="16" />
      </div>
    </div>
  </div>
</template>
<script>
import { uploadFile } from "@/utils";
import service from "../../utils/service";
export default {
  data() {
    return {
      activeTab: 0,
      userInfo: null,
      lpUserInfo: null,
    };
  },
  async onLoad() {
    let res = await this.$api.getRegion({
      id: 100000,
      regionType: "CITY",
    });
    uni.setStorageSync("region", res);
  },
  async onShow() {
    wx.showLoading();
    this.userInfo = await this.$checkLogin.getUserInfo();

    setTimeout(() => {
      this.getMemberInfo();
    }, 500);
  },
  computed: {
    joinWords() {
      return function (v) {
        if (!v) return "";
        return v.join("、");
      };
    },
    wantPlay() {
      if (!this.lpUserInfo) return "";
      return [
        ...(this.lpUserInfo.placesToVisitDomestic || []),
        ...(this.lpUserInfo.placesToVisitOversea || []),
      ].join("、");
    }
  },
  methods: {
    onChangeTab(index) {
      this.activeTab = index;
    },
    onGoEdit(type) {
      uni.navigateTo({
        url: `./edit?type=${type}`,
      });
    },
    //上传头像
    onUpload() {
      let vm = this;
      uni.chooseMedia({
        count: 1,
        mediaType: ["image"],
        success: function (res) {
          uni.showLoading("上传中...");

          uploadFile(res.tempFiles[0].tempFilePath).then((e) => {
            vm.lpUserInfo.avatar = e;
            vm.save();
            uni.hideLoading();
          });
        },
      });
    },
    //查询会员信息
    async getMemberInfo() {
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
      wx.hideLoading();
    },
    //保存信息
    async save() {
      await service.LpUserMessageSave({
        ...this.lpUserInfo,
        avatar: this.lpUserInfo.avatar,
      });
      this.getMemberInfo();
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-tabBar {
    @include hor;
    align-items: center;
    padding: 38rpx 0px 32rpx 0px;
    position: relative;
    &-bar {
      display: flex;
      flex: 1;
      justify-content: center;
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      color: #979797;
      line-height: 36rpx;
    }
    .activeBar {
      color: #ff5485;
    }
    &-lineBox {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      height: 6rpx;
      background: #f7f7f7;
      &-line {
        width: 50%;
        height: 6rpx;
        background: #ff5485;
      }
      .moveLeft {
        transform: translateX(0px);
        transition: 0.4s;
      }
      .moveRight {
        transform: translateX(100%);
        transition: 0.4s;
      }
    }
  }
  &-content {
    // position: fixed;
    // left: 0px;
    // right: 0px;
    // top: 7.3vh;
    // bottom: 0px;
    overflow-y: scroll;
  }
  &-cell {
    @include hor-between-center;
    height: 116rpx;
    margin: 0px 40rpx;
    border-bottom: 2rpx solid #e9ebef;
    span {
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #5f6572;
    }
    &-right {
      @include hor;
      align-items: center;
      &-head {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        border: 1px solid #cdcdcd;
      }
      span {
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        max-width: 40vw;
        @include text-overflow-line(1);
      }
    }
  }
}
</style>