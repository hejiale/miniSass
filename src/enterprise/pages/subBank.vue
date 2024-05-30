<template>
  <div class="container">
    <van-cell-group inset>
      <van-cell
        title="银行名称"
        is-link
        @click="onGoSelectBank"
        :value="bankInfo.bankName"
      ></van-cell>
      <van-cell title="支行名称">
        <input v-model="subBankName" placeholder="请输入支行名称" />
      </van-cell>
      <van-cell
        title="城市地区"
        is-link
        @click="showPicker"
        :value="cityName"
      ></van-cell>
    </van-cell-group>
    <div class="container-search" @click="onSearch">查询</div>
    <van-cell-group inset>
      <van-cell>
        <scroll-view scroll-y class="container-scroll">
          <div
            v-for="bank in bankList"
            :key="bank.cnaps_code"
            @click="onSelectBank(bank)"
            class="container-scroll-item"
          >
            <span>{{ bank.brabank_name }}</span>
            <van-icon name="arrow" />
          </div>
        </scroll-view>
      </van-cell>
    </van-cell-group>
    <van-action-sheet
      :show="showArea"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showArea = false"
    >
      <van-picker
        :columns="columns"
        :show-toolbar="false"
        @change="changePicker"
        id="picker"
      />
      <div class="pop-nextButton" @click="onGoNext">
        <div></div>
        <div class="pop-nextButton-right">确认</div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import service from "../utils/service";
export default {
  data() {
    return {
      bankInfo: {},
      subBankName: null,
      showArea: false,
      areaList: {}, // 数据格式见 Area 组件文档
      columns: [
        {
          values: [],
          className: "column1",
        },
        {
          values: [],
          className: "column2",
        },
      ],
      cityId: null,
      cityName: null,
      picker: null,
      bankList: null,
    };
  },
  onLoad() {
    this.initCityList();
  },
  onShow() {
    if (uni.getStorageSync("bank")) {
      this.bankInfo = uni.getStorageSync("bank");
      uni.removeStorageSync("bank");
    }
  },
  methods: {
    showPicker() {
      this.showArea = true;
      let vm = this;
      setTimeout(() => {
        vm.$nextTick((_) => {
          vm.picker = vm.selectComponent("#picker");
        });
      }, 500);
    },
    onGoSelectBank() {
      uni.navigateTo({ url: "./bank" });
    },
    // 初始化省市区信息
    async initCityList() {
      try {
        let res = await this.$api.queryRegionWithCodeCascadeList({
          regionType: "AREA",
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
      } catch (e) {}
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
    },
    //确认
    async onGoNext() {
      let data = this.picker.getIndexes();
      let cityOne = this.columns[0].values[data[0]];
      let cityTwo = this.columns[1].values[data[1]];

      this.cityId = cityTwo.id;
      this.cityName = cityOne.text + cityTwo.text;
      this.showArea = false;
    },
    //查询
    async onSearch() {
      try {
        if(!this.bankInfo.bankCode){
          return wx.showToast({
            title: '请选择银行',
            icon: 'none'
          })
        }
        if(!this.subBankName){
          return wx.showToast({
            title: '请输入支行名称',
            icon: 'none'
          })
        }
        if(!this.cityId){
          return wx.showToast({
            title: '请选择支行所在地',
            icon: 'none'
          })
        }
        let { card_list } = await service.getCnapsCodeRequest({
          bankCode: this.bankInfo.bankCode,
          braBankName: this.subBankName,
          cityCode: this.cityId,
        });
        this.bankList = card_list;
      } catch (e) {}
    },
    onSelectBank(bank) {
        let subBank = JSON.parse(JSON.stringify(bank));
        subBank.bankCode = this.bankInfo.bankCode;

        uni.setStorageSync('subBank', subBank);
        uni.navigateBack();
    },
  },
};
</script>
<style>
.van-field {
  padding-right: 0px !important;
}
</style>
<style lang="scss" scoped>
.container {
  background: #f5f5f5;
  height: 100vh;
  &-search {
    background: #36e4bb;
    color: #fff;
    font-size: 13px;
    width: 120px;
    height: 40px;
    border-radius: 44px;
    @include hor-center-center;
    margin: 10px auto;
  }
  &-scroll {
    height: 70vh;
    &-item {
      @include hor-between-center;
      padding: 10px 0;
      border-bottom: 1rpx solid #f5f5f5;
    }
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