<template>
  <view class="address-add">
    <div class="fixedBg"></div>
    <div class="address-add-name address-add-box">
      <p>收货人</p>
      <div class="address-add-name-box address-add-inp">
        <input type="text" v-model="form.linkmanName" placeholder="名字(必填)" />
      </div>
    </div>
    <div class="address-add-tel address-add-box">
      <p>手机号码</p>
      <div class="address-add-tel-box address-add-inp">
        <input type="text" v-model="form.linkmanPhone" placeholder="手机号(必填)" />
      </div>
    </div>
    <div class="address-add-district address-add-box" @click="hide">
      <p>所在地区</p>
      <div class="address-add-district-box address-add-inp">
        <input type="text" disabled="true" v-model="form.addressName" placeholder="省、市、区(必填)" />
        <div class="address-add-district-box-icon">
          <van-icon name="arrow" size="22rpx" color="rgba(0,0,0,0.2600)"></van-icon>
        </div>
      </div>
    </div>
    <div class="address-add-detail address-add-box">
      <p>详细地址</p>
      <div class="address-add-detail-box address-add-inp">
        <textarea type="text" v-model="form.linkmanAddress" placeholder="街道/小区楼栋/乡村名称(必填)" />
      </div>
    </div>
    <view class="address-add__fixed">
      <view class="tk-btn" @click="doSubmit">保存</view>
    </view>
    <van-action-sheet :show="showArea" :safe-area-inset-bottom="false" z-index="1000" close-on-click-overlay
      @click-overlay="showArea = false">
      <van-picker :columns="columns" :show-toolbar="false" @change="changePicker" id="picker" />
      <div class="pop-nextButton" @click="onGoNext">
        <div></div>
        <div class="pop-nextButton-right">确认</div>
      </div>
    </van-action-sheet>
  </view>
</template>
<script>
import { isvalidMobile } from "@/utils/validate.js";
export default {
  components: {},
  data() {
    return {
      form: {
        addressName: null,
        linkmanName: null,
        linkmanPhone: null,
        provinceId: null,
        cityId: null,
        districtId: null,
        linkmanAddress: null
      },
      columns: [
        {
          values: [],
          className: "column1",
        },
        {
          values: [],
          className: "column2",
        },
        {
          values: [],
          className: "column3",
        },
      ],
      addressId: null,
      showArea: false, //地区选择显示隐藏
      areaList: {}, // 数据格式见 Area 组件文档
      picker: null,
    };
  },
  onLoad(options) {
    uni.showLoading();
    this.initCityList()
      .then(() => {
        uni.hideLoading();
        if (options.address) {
          let address = JSON.parse(options.address);
          this.form = {
            linkmanName: address.linkmanName,
            linkmanPhone: address.linkmanPhone,
            addressName: address.addressName,
            linkmanAddress: address.linkmanAddress
          }
        }
      })
      .catch((e) => {
        uni.hideLoading();
      });
  },
  methods: {
    hide() {
      this.showArea = true;
      let vm = this;
      setTimeout(() => {
        vm.$nextTick((_) => {
          vm.picker = vm.selectComponent("#picker");
        });
      }, 500);
    },
    backRoute() {
      uni.navigateBack({});
    },
    async doSubmit() {
      //校验
      if (!this.form.linkmanName) {
        return uni.showToast({
          title: "请输入联系人",
          icon: "none",
        });
      } else if (!this.form.linkmanPhone) {
        return uni.showToast({
          title: "请输入手机号码",
          icon: "none",
        });
      } else if (!isvalidMobile(this.form.linkmanPhone)) {
        return uni.showToast({
          title: "请输入正确的手机号码",
          icon: "none",
        });
      } else if (!this.form.addressName) {
        return uni.showToast({
          title: "请选择所在地址",
          icon: "none",
        });
      } else if (!this.form.linkmanAddress) {
        return uni.showToast({
          title: "请输入详细地址",
          icon: "none",
        });
      }
      uni.setStorageSync('selectStoreAddress', this.form)
      uni.navigateBack();
    },
    //确认
    async onGoNext() {
      let data = this.picker.getIndexes();
      let cityOne = this.columns[0].values[data[0]];
      let cityTwo = this.columns[1].values[data[1]];
      let cityThree = this.columns[2].values[data[2]];
      this.form.provinceId = cityOne.id;
      this.form.cityId = cityTwo.id;
      if (cityThree) {
        this.form.districtId = cityThree.id;
      } else {
        this.form.districtId = "";
        this.form.districtName = "";
      }
      this.form.addressName =
        cityOne.text +
        cityTwo.text +
        (cityThree ? cityThree.text : "");
      this.showArea = false;
    },
    // 初始化省市区信息
    async initCityList() {
      try {
        let res = await this.$api.queryRegionWithCodeCascadeList({
          regionType: 'AREA'
        });

        if (!res || res.length === 0) return;
        this.columns[0].values = res.map((m) => {
          return {
            text: m.regionName,
            subRegionList: m.subRegionList,
            id: m.id,
          };
        });
        this.columns[1].values = res[0].subRegionList.map((m) => {
          return {
            text: m.regionName,
            subRegionList: m.subRegionList,
            id: m.id,
          };
        });
        this.columns[2].values = res[0].subRegionList[0].subRegionList.map((m) => {
          return {
            text: m.regionName,
            subRegionList: m.subRegionList,
            id: m.id,
          };
        });

        if (res[0][0].subRegionList) {
          this.columns[2].values = res[0][0].subRegionList.map((m) => {
            return {
              text: m.regionName,
              subRegionList: m.subRegionList,
              id: m.id,
            };
          });
        }
      } catch (e) { }
    },
    changePicker({ detail }) {
      let arr = detail.value;
      //滑动第一列的情况
      if (detail.index === 0) {
        this.columns[1].values = arr[0].subRegionList.map((m) => {
          return {
            text: m.regionName,
            subRegionList: m.subRegionList,
            id: m.id,
          };
        });
      }

      //判断是滑动的第一列  还是第二列
      if (detail.index === 0) {
        if (arr[detail.index].subRegionList[0].subRegionList) {
          this.columns[2].values = arr[
            detail.index
          ].subRegionList[0].subRegionList.map((m) => {
            return {
              text: m.regionName,
              id: m.id,
            };
          });
        } else {
          this.columns[2].values = [];
        }
      } else if (detail.index === 1) {
        if (arr[detail.index].subRegionList) {
          this.columns[2].values = arr[detail.index].subRegionList.map((m) => {
            return {
              text: m.regionName,
              id: m.id,
            };
          });
        } else {
          this.columns[2].values = [];
        }
      }
    }
  },
};
</script>
<style lang="scss">
.address-add {
  &-del {
    overflow: hidden;

    &-box {
      float: right;
      margin-right: 32rpx;
      margin-top: 52rpx;
    }

    &-txt {
      width: 108rpx;
      height: 44rpx;
      border-radius: 0px 0px 0px 0px;
    }

    &-img {
      width: 44rpx;
      height: 44rpx;
      margin-right: 8rpx;
    }
  }

  &-bureauBg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 46.55%;
    z-index: -1;
  }

  &__fixed {
    display: flex;
    justify-content: center;
    margin-top: 86rpx;
    @include hor;
    align-items: center;
  }

  &__inp {
    .van-field {
      &__body {
        padding: 20rpx;
        background-color: #eee;
        border-radius: 10rpx;
        text-align: left;
      }
    }
  }

  &-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 32rpx;

    p {
      width: 128rpx;
      height: 40rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40rpx;
      margin-right: 30rpx;
    }

    input,
    textarea {
      padding: 24rpx 18rpx 24rpx 30rpx;
      background: #e9e9e9;
      border-radius: 8px;
      font-size: 28rpx;
    }

    textarea {
      width: 478rpx;
      height: 104rpx;
    }
  }

  &-inp {
    flex: 1;
  }

  &-tel {
    &-box {
      position: relative;

      &-icon {
        display: flex;
        align-items: center;
        position: absolute;
        top: 50%;
        right: 26rpx;
        transform: translateY(-50%);

        span {
          margin-right: 26rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }

  &-district {
    &-box {
      position: relative;

      &-icon {
        position: absolute;
        top: 50%;
        right: 18rpx;
        transform: translateY(-50%);
      }
    }
  }

  .van-cell {
    background-color: rgba(51, 51, 51, 0);
  }

  .van-cell__title {
    font-size: 28rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
  }
}

.pop {
  width: 100%;
  background: #ffffff;
  border-radius: 24px 24px 0px 0px;
  padding-bottom: 10%;

  &-nextButton {
    @include hor-between-center;

    &-right {
      @include hor-center-center;
      margin-top: 60rpx;
      margin-bottom: 60rpx;
      margin-right: 40rpx;
      width: 128rpx;
      height: 60rpx;
      border-radius: 15px;
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #14c9c9;
      border-radius: 60rpx;
      border: 1px solid #14c9c9;
    }
  }
}
</style>
