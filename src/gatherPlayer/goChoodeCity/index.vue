<template>
  <view class="main-Location">
    <view class="topbar">
      <view class="closeIcon" @click="closeIcon">关闭</view>
      <view class="chooseCity">选择城市</view>
    </view>
    <!-- 输入关键词搜索 -->
    <view class="inputBox">
      <van-search
        placeholder="输入关键词搜索  "
        input-align="center"
        background="white"
        @change="onSearch"
        @search="onSearch"
        @clear="onSearch"
        :left-icon="$iconFont.getIconName('icon-searchDeep')"
      />
    </view>
    <!-- 字母区域 -->
    <view class="Location-Letter">
      <view
        hover-class="Click-Latter"
        @tap="getLetter('ScrollTop')"
        class="dwHote"
        >定位热门</view
      >
      <view
        class="dwzmCity"
        v-for="(l, i) in LatterName"
        :key="i"
        hover-class="Click-Latter"
        @tap="getLetter(l)"
        :style="{ color: LetterId === l ? '#000' : '#118AFF' }"
        >{{ l }}</view
      >
    </view>
    <!-- 定位城市 -->
    <view class="ynq-AutoLocation u_flex jcsb">
      <view class="ynq-AutoAddress">
        <view>
          <text class="ynq ynq-dizhi"></text>
          <text class="dingwCity">定位城市</text>
        </view>
        <view @click="goBackUrl">
          <view class="dingw_city">{{ CityName }}</view>
        </view>
      </view>
    </view>
    <!-- 历史访问城市 -->
    <view class="ynq-AutoLocation u_flex jcsb">
      <view class="ynq-AutoAddress">
        <view>
          <text class="ynq ynq-dizhi"></text>
          <text class="dingwCity">历史访问城市</text>
        </view>
        <view
          class="historyCityName2"
          @tap="historyCity(item.regionName, item)"
          v-for="(item, index) in historyCityName"
          :key="index"
        >
          <view class="dingw_city2">{{ item.regionName }}</view>
        </view>
      </view>
    </view>
    <scroll-view
      scroll-y="true"
      class="ynq-ScrollView"
      :scroll-into-view="LetterId"
    >
      <!-- 热门城市 -->
      <view class="ynq-HotCity" id="ScrollTop">
        <view class="ynq-HotCityTitle">
          <text class="ynq ynq-fire"></text>
          <text class="hotCity">热门城市</text>
        </view>
        <view class="ynq-HotCityList flex">
          <view
            class="radius-3"
            @tap="getStorage(item.value, item)"
            v-for="(item, index) in HotCity"
            :key="index"
          >
            {{ item.value }}</view
          >
        </view>
      </view>
      <!-- 城市列表 -->
      <view class="ynq-CityList">
        <block v-for="(item, index) in CityList" :key="index">
          <view class="ynq-CityLetter" :id="item.initial">{{
            item.initial
          }}</view>
          <view class="ynq-CityLine">
            <text
              @tap="getStorage2(item_city)"
              v-for="(item_city, name_index) in item.list"
              :key="name_index"
              >{{ item_city.name }}</text
            >
          </view>
        </block>
      </view>
    </scroll-view>
  </view>
</template>
 
<script>
// var cityData = require('./city.json')
export default {
  data() {
    return {
      CityName: "",
      HotCity: [],
      LatterName: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      // CityList: cityData.city, //引用json数据
      CityList: [],
      LetterId: "",
      keyword: "", //关键词
      regionId: "", // 选择的城市regionId
      historyCityName: [], //历史城市列表
      CityNameList: {},
      //是否重置全局城市缓存
      resetGlobalCacheCity: null,
    };
  },
  onLoad(options) {
    if (options.type !== undefined) {
      this.resetGlobalCacheCity = options.type;
    }
  },
  async onShow() {
    await this.promotionList();
    await this.queryHotCity();
    await this.getqueryHistoryRegionList();

    if(uni.getStorageSync('isLocation')){
      await this.regionResolver();
    }else{
      this.CityName = uni.getStorageSync("cityInfo").city;
    } 
  },
  methods: {
    goBackUrl() {
      let cityInfo = uni.getStorageSync("cityInfo");
      if (cityInfo) {
        cityInfo.city = this.CityNameList.city;
        cityInfo.cityId = this.CityNameList.cityId;
        uni.setStorage({
          key: "cityInfo",
          data: cityInfo,
        });
      } else {
        cityInfo = {
          city: this.CityNameList.city,
          cityId: this.CityNameList.cityId,
        };
        uni.setStorage({
          key: "cityInfo",
          data: cityInfo,
        });
      }
      this.goBack();
    },
    goBack() {
      uni.setStorageSync('refreshCity', true);
      uni.navigateBack({
        delta: 1, // 返回上一级页面
      });
    },
    // 按字母排序获取行政区划
    async promotionList() {
      try {
        let res = await this.$api.getRegionByLetter({
          id: null,
          regionType: null,
          keyword: this.keyword,
        });
        this.CityList = res;
        // console.log('this.CityList', res);
      } catch (e) {}
    },
    // 新增历史记录
    async getsaveCommonRegion() {
      try {
        let data = await this.$checkLogin.getUserInfo();
        let res = await this.$api.saveCommonRegion({
          appUserId: data.id,
          regionId: this.regionId,
        });
        console.log("新增历史记录", res);
      } catch (e) {}
    },
    // 查询历史城市
    async getqueryHistoryRegionList() {
      try {
        let data = await this.$checkLogin.getUserInfo();
        let res = await this.$api.getqueryHistoryRegionList({
          appUserId: data.id,
        });
        console.log("历史城市记录", res);
        this.historyCityName = res;
      } catch (e) {}
    },
    //定位城市
    async regionResolver(lat, lon) {
      try {
        let data = await this.$api.regionResolver({
          latitude: uni.getStorageSync("currentLatitude"),
          longitude: uni.getStorageSync("currentLongitude"),
          userId: uni.getStorageSync("userInforId"),
          dataSource: "SAAS_MP",
        });
        this.CityName = data.city;
        this.CityNameList = data;
      } catch (e) {}
    },
    // 查询热门城市
    async queryHotCity() {
      try {
        let res = await this.$api.getHotCity({});
        console.log("热门城市res", res);
        this.HotCity = res;
      } catch (e) {}
    },
    onSearch(e) {
      this.keyword = e.detail;
      this.promotionList();
    },
    closeIcon() {
      uni.navigateBack();
    },
    //获取定位点
    getLetter(name) {
      this.LetterId = name;
    },
    //历史城市返回
    async historyCity(regionName, item) {
      this.regionId = item.regionId;
      let cityInfo = uni.getStorageSync("cityInfo");
      if (cityInfo) {
        cityInfo.city = regionName;
        cityInfo.cityId = this.regionId;
      } else {
        cityInfo = {
          city: regionName,
          cityId: this.regionId,
        };
      }
      if (this.resetGlobalCacheCity === "false") {
        uni.setStorageSync("temporaryCity", cityInfo);
      } else {
        uni.setStorage({
          key: "cityInfo",
          data: cityInfo,
        });
      }

      await this.getsaveCommonRegion();
      await this.getqueryHistoryRegionList();
      //跳转返回
      console.log("this.CityName", this.CityName);
      uni.setStorage("CityName", this.CityName);
      this.goBack();
    },
    //存储城市缓存
    async getStorage(Name, item) {
      this.CityName = Name;
      this.regionId = item.code;
      let cityInfo = uni.getStorageSync("cityInfo");
      if (cityInfo) {
        cityInfo.city = this.CityName;
        cityInfo.cityId = this.regionId;
      } else {
        cityInfo = {
          city: this.CityName,
          cityId: this.regionId,
        };
      }
      if (this.resetGlobalCacheCity === "false") {
        uni.setStorageSync("temporaryCity", cityInfo);
      } else {
        uni.setStorage({
          key: "cityInfo",
          data: cityInfo,
        });
      }

      await this.getsaveCommonRegion();
      await this.getqueryHistoryRegionList();
      //跳转返回
      console.log("this.CityName", this.CityName);
      uni.setStorage("CityName", this.CityName);
      this.goBack();
    },
    async getStorage2(item_city) {
      this.CityName = item_city.name;
      this.regionId = item_city.id;
      let cityInfo = uni.getStorageSync("cityInfo");
      if (cityInfo) {
        cityInfo.city = this.CityName;
        cityInfo.cityId = this.regionId;
      } else {
        cityInfo = {
          city: this.CityName,
          cityId: this.regionId,
        };
      }
      if (this.resetGlobalCacheCity === "false") {
        uni.setStorageSync("temporaryCity", cityInfo);
      } else {
        uni.setStorage({
          key: "cityInfo",
          data: cityInfo,
        });
      }

      await this.getsaveCommonRegion();
      await this.getqueryHistoryRegionList();
      //跳转返回
      this.goBack();
    }
  },
};
</script>
 
<style lang="scss" scoped>
.hotCity {
  font-size: 22rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #9f9fa0;
}

/deep/.van-search__content {
  background: #ffffff;
  height: 60rpx;
}

/deep/.van-search {
  width: 690rpx;
  height: 60rpx;
  background: #ffffff;
  border-radius: 30rpx 30rpx 30rpx 30rpx;
  opacity: 1;
  margin-left: 30rpx;
  margin-top: 12rpx;
  text-align: center;
}

.main-Location {
  height: 100vh;
  margin-top: 114rpx;
  background: #f5f6f8;

  .inputBox {
    position: relative;
    top: 14rpx;

    .input {
      width: 690rpx;
      height: 60rpx;
      background: #fff;
      border-radius: 30rpx 30rpx 30rpx 30rpx;
      opacity: 1;
      margin-left: 26rpx;
      margin-top: -10rpx;
      text-align: center;
    }

    .inputIcon {
      width: 32rpx;
      height: 32rpx;
      position: absolute;
      left: 27%;
      top: 14%;
    }
  }

  .topbar {
    display: flex;
    justify-content: flex-start;
    background: white;
    padding-bottom: 20rpx;
  }

  .closeIcon {
    font-size: 32rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #2e323e;
    margin-left: 24rpx;
    margin-right: 232rpx;
  }

  .chooseCity {
    font-size: 34rpx;
    width: 138rpx;
    height: 48rpx;
    font-weight: 400;
    font-family: PingFang SC-Regular, PingFang SC;
    color: #2e323e;
  }
}

.ynq-AutoLocation {
  width: calc(100% - 40rpx);
  background: rgba(250, 250, 250, 0.5);
  padding: 20rpx 20rpx;

  .ynq-AutoAddress {
    .historyCityName2 {
      float: left;
    }

    .dingwCity {
      font-size: 22rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #9f9fa0;
    }

    .dingw_city {
      width: 216rpx;
      height: 64rpx;
      background: #ffffff;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      border: 1rpx solid #36e4bb;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #36e4bb;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24rpx;
      margin-left: 10rpx;
    }

    .dingw_city2 {
      width: 208rpx;
      height: 64rpx;
      background: #ffffff;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      border: 1rpx solid #e9ebef;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24rpx;
      margin-left: 10rpx;
    }
  }

  text.ynq {
    font-size: 32rpx;
    margin-right: 10rpx;
  }

  text {
    font-size: 30rpx;
  }
}

.ynq-HotCity {
  padding: 20rpx;
}

.ynq-HotCityTitle {
  padding: 0rpx 0rpx;

  text.ynq {
    margin-right: 10rpx;
    color: #ff0000;
    // font-size: 32rpx;
  }

  text {
    // font-size: 30rpx;
  }
}

.ynq-HotCityList {
  padding: 20rpx 0 0 0;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .radius-3 {
    width: 208rpx;
    height: 64rpx;
    background: #ffffff;
    border-radius: 0rpx 0rpx 0rpx 0rpx;
    opacity: 1;
    border: 1rpx solid #e9ebef;
    margin: 10rpx;
    font-size: 26rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #959aa5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.Location-Letter {
  position: fixed;
  right: 5rpx;
  top: 596rpx;
  width: 46rpx;
  z-index: 100;
  font-size: 22rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #118aff;

  .dwHote {
    width: 46rpx;
    height: 62rpx;
    font-size: 22rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #118aff;
  }

  .dwzmCity {
    margin-left: 20rpx;
  }

  view {
    display: block;
    width: 30rpx;
    text-align: center;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 22rpx;
    transition: ease 0.3s;
    -webkit-transition: ease 0.3s;
  }
}

.ynq-CityList {
  padding: 0px 40rpx 0 20rpx;

  .ynq-CityLetter {
    line-height: 30rpx;
    height: 40rpx;
    font-size: 24rpx;
    border-bottom: 1px solid #f7f7f7;
    padding-left: 10rpx;
    color: #909090;
  }

  .ynq-CityLine {
    margin: 20rpx 0px;

    text {
      display: block;
      line-height: 60rpx;
      padding: 0px 10rpx;
      font-size: 30rpx;
      color: #767676;

      &:nth-child(even) {
        background-color: rgba(200, 200, 200, 0.12);
      }
    }
  }
}

.ynq-ScrollView {
  height: calc(100vh - 160rpx);
}

.Click-Latter {
  font-size: 30rpx !important;
}

.jcsb {
  justify-content: space-between;
}

.u_flex {
  display: flex;
}
</style>