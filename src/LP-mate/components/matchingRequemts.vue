<template>
  <div class="requirementBox">
    <image
      src="../static/image/filter-bg.png"
      class="requirementBox-bg"
    ></image>
    <div class="requirementBox-back" @click="onBack"></div>
    <div class="requirementBox-title" :style="navBarStyle">设置匹配要求</div>
    <scroll-view scroll-y class="requirementBox-scrollBox">
      <div class="requirementBox-cell">
        <div class="requirementBox-cell-title mb20">年龄 (岁)</div>
        <van-slider
          :value="sliderAgeValues"
          range
          min="18"
          max="80"
          use-button-slot
          active-color="#FFC0D2"
          inactive-color="#ECECEC"
          @change="onChangeAgeSlider"
          @drag="onDragAgeSlider"
          class="sliderBar"
          bar-height="4px"
        >
          <div class="custom-button" slot="left-button">
            <image
              src="../static/image/icon-slider.png"
              class="custom-button-tag"
            ></image>
            <span class="custom-button-value">{{ sliderAgeValues[0] }}</span>
          </div>
          <div class="custom-button" slot="right-button">
            <image
              src="../static/image/icon-slider.png"
              class="custom-button-tag"
            ></image>
            <span class="custom-button-value">{{ sliderAgeValues[1] }}</span>
          </div>
        </van-slider>
      </div>
      <div class="requirementBox-cell pt10 mt40">
        <div class="requirementBox-cell-title mb20">身高 (cm)</div>
        <van-slider
          :value="sliderHeightValues"
          range
          min="140"
          max="220"
          use-button-slot
          active-color="#FFC0D2"
          inactive-color="#ECECEC"
          @change="onChangeHeightSlider"
          @drag="onDragHeightSlider"
          class="sliderBar"
          bar-height="4px"
        >
          <div class="custom-button" slot="left-button">
            <image
              src="../static/image/icon-slider.png"
              class="custom-button-tag"
            ></image>
            <span class="custom-button-value">{{ sliderHeightValues[0] }}</span>
          </div>
          <div class="custom-button" slot="right-button">
            <image
              src="../static/image/icon-slider.png"
              class="custom-button-tag"
            ></image>
            <span class="custom-button-value">{{ sliderHeightValues[1] }}</span>
          </div>
        </van-slider>
      </div>
      <div class="requirementBox-cell pt10 mt40">
        <div class="requirementBox-cell-title mb20">体重 (kg)</div>
        <van-slider
          :value="sliderWeightValues"
          range
          min="35"
          max="150"
          use-button-slot
          active-color="#FFC0D2"
          inactive-color="#ECECEC"
          @change="onChangeWeightSlider"
          @drag="onDragWeightSlider"
          class="sliderBar"
          bar-height="4px"
        >
          <div class="custom-button" slot="left-button">
            <image
              src="../static/image/icon-slider.png"
              class="custom-button-tag"
            ></image>
            <span class="custom-button-value">{{ sliderWeightValues[0] }}</span>
          </div>
          <div class="custom-button" slot="right-button">
            <image
              src="../static/image/icon-slider.png"
              class="custom-button-tag"
            ></image>
            <span class="custom-button-value">{{ sliderWeightValues[1] }}</span>
          </div>
        </van-slider>
      </div>
      <div class="requirementBox-cell pt10 mt40">
        <div class="requirementBox-cell-title mb12">学历 (多选)</div>
        <div class="requirementBox-cell-wrapBox">
          <div
            class="requirementBox-cell-wrapBox-item"
            :class="{ activeItem: isActive(v) }"
            v-for="(v, idx) in LP_EDUCATION_FILTER"
            :key="v"
            @click="onSelectEduction(v, idx)"
          >
            {{ v }}
          </div>
        </div>
      </div>
      <div class="requirementBox-cell mt20">
        <div class="requirementBox-cell-title">地区</div>
        <div class="requirementBox-cell-switchBox">
          <span>只看同地区</span>
          <van-switch
            :checked="checked"
            class="mt2"
            size="26px"
            active-color="#FE6391"
            inactive-color="#E8E8E8"
            @change="onChangeSwitch"
          />
        </div>
        <div class="requirementBox-cell-cityWrapBox" v-if="!checked">
          <div
            class="requirementBox-cell-cityWrapBox-item cityActive"
            v-for="city in citys"
            :key="city"
            @click="onDeleteCity(city)"
          >
            {{ city }}
            <image
              src="../static/image/icon-city-close.png"
              class="requirementBox-cell-cityWrapBox-item-close"
            ></image>
          </div>
          <div class="requirementBox-cell-cityWrapBox-item" @click="onPopCity">
            选择地区+
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="requirementBox-bottom">
      <image
        src="../static/image/filter-bottom.png"
        class="requirementBox-bottom-bg"
      ></image>
      <div class="requirementBox-bottom-left" @click="onReset"></div>
      <div class="requirementBox-bottom-right" @click="onFilter"></div>
    </div>
    <van-action-sheet
      :show="showPicker"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showPicker = false"
    >
      <div class="pickerBox">
        <div class="pickerBox-bar">
          <div class="pickerBox-bar-cancel" @click="showPicker = false">
            取消
          </div>
          <div class="pickerBox-bar-sure" @click="bindPickerChangeArea">
            确认
          </div>
        </div>
        <van-picker
          title="选择城市"
          id="cityPicker"
          :columns="cityColumns"
          @change="changePicker"
        />
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { getMenuButtonRect } from "@/utils/index";
import service from "../utils/service";
export default {
  data() {
    return {
      menuReact: {},
      sliderAgeValues: [18, 80],
      sliderHeightValues: [140, 220],
      sliderWeightValues: [35, 150],
      eductions: [],
      checked: false,
      showPicker: false,
      cityColumns: [
        {
          values: [],
          className: "column1",
        },
        {
          values: [],
          className: "column2",
        },
      ],
      //LP学历
      LP_EDUCATION_FILTER: [
        "不限学历",
        "高中",
        "大专",
        "本科",
        "硕士",
        "博士及以上",
      ],
      citys: [],
      userInfo: null
    };
  },
  computed: {
    navBarStyle() {
      return `padding-top: ${this.menuReact.top + 10}px`;
    },
    isActive() {
      return function (v) {
        if (v === "不限学历" && !this.eductions.length) {
          return true;
        }
        return this.eductions.findIndex((e) => e === v) !== -1;
      };
    },
  },
  async mounted() {
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.menuReact = await getMenuButtonRect();
    this.queryRegion();
  },
  methods: {
    refreshData() {
      this.queryMatchingResult();
    },
    onBack() {
      this.$emit("hide");
    },
    //重置初始化参数 并保存
    async onReset() {
      await service.lpUserMatchCountMatching({
        minAge: 18,
        maxAge: 80,
        minHeight: 140,
        maxHeight: 220,
        minWeight: 35,
        maxWeight: 150,
        isSameCity: false,
        lpUserId: this.userInfo.id,
        education: [],
        permanentResidenceCity: [],
      });
      await this.refreshData();
    },
    async onFilter() {
      await service.lpUserMatchCountMatching({
        minAge: this.sliderAgeValues[0],
        maxAge: this.sliderAgeValues[1],
        minHeight: this.sliderHeightValues[0],
        maxHeight: this.sliderHeightValues[1],
        minWeight: this.sliderWeightValues[0],
        maxWeight: this.sliderWeightValues[1],
        isSameCity: this.checked,
        lpUserId: this.userInfo.id,
        education: this.eductions,
        permanentResidenceCity: this.citys,
      });

      this.$emit("hide");
    },
    onDragAgeSlider(event){
      this.sliderAgeValues = event.detail.value;
    },
    onChangeAgeSlider(event) {
      this.sliderAgeValues = event.detail;
    },
    onDragHeightSlider(event){
      this.sliderHeightValues = event.detail.value;
    },
    onChangeHeightSlider(event) {
      this.sliderHeightValues = event.detail;
    },
    onDragWeightSlider(event){
      this.sliderWeightValues = event.detail.value;
    },
    onChangeWeightSlider(event) {
      this.sliderWeightValues = event.detail;
    },
    onSelectEduction(e, idx) {
      if (idx === 0) {
        this.eductions = [];
      } else {
        if (this.eductions.findIndex((v) => v === e) === -1) {
          this.eductions.push(e);
        } else {
          this.eductions.splice(
            this.eductions.findIndex((v) => v === e),
            1
          );
        }
      }
    },
    onChangeSwitch(event) {
      this.checked = event.detail;
      this.citys = [];
    },
    onDeleteCity(text) {
      this.citys.splice(
        this.citys.findIndex((v) => v === text),
        1
      );
    },
    onPopCity() {
      this.showPicker = true;

      let vm = this;
      setTimeout(() => {
        vm.cityPicker = vm.selectComponent("#cityPicker");
      }, 0);
    },
    // 切换区域
    bindPickerChangeArea() {
      let data = this.cityPicker.getIndexes();
      let province = this.cityColumns[0].values[data[0]];
      let city = this.cityColumns[1].values[data[1]];

      if (this.citys.findIndex((v) => v === city.text) === -1) {
        this.citys.push(city.text);
      }

      this.showPicker = false;
    },
    changePicker(e) {
      //滑动第一列的情况
      if (e.detail.index === 0) {
        this.cityColumns[1].values = e.detail.value[0].subRegionList.map(
          (m) => {
            return {
              text: m.regionName,
              id: m.id,
            };
          }
        );
      }
    },
    //查询省市区
    async queryRegion() {
      try {
        let res = await this.$api.getRegion({
          id: 100000,
          regionType: "CITY",
        });

        this.cityColumns[0].values = res.map((m) => {
          return {
            text: m.regionName,
            id: m.id,
            subRegionList: m.subRegionList,
          };
        });
        this.cityColumns[1].values = res[0].subRegionList.map((m) => {
          return {
            text: m.regionName,
            id: m.id,
          };
        });
      } catch (e) {}
    },
    //查询匹配缓存数据
    async queryMatchingResult() {
      let res = await service.matchingRequirementsCache({
        id: this.userInfo.id,
      });

      if (res) {
        if (res.minAge && res.maxAge) {
          this.sliderAgeValues = [res.minAge, res.maxAge];
        }
        if (res.minWeight && res.maxWeight) {
          this.sliderWeightValues = [res.minWeight, res.maxWeight];
        }
        if (res.minHeight && res.maxHeight) {
          this.sliderHeightValues = [res.minHeight, res.maxHeight];
        }
        this.checked = res.isSameCity;
        this.eductions = res.education || [];
        this.citys = res.permanentResidenceCity || [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.requirementBox {
  width: 710rpx;
  height: 100vh;
  position: relative;
  &-back {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 60rpx;
    height: 200rpx;
  }
  &-bg {
    @include abscenter;
    z-index: -1;
  }
  &-title {
    font-size: 26rpx;
    color: #000000;
    margin-left: 256rpx;
  }
  &-scrollBox{
    position: fixed;
    left: 60rpx;
    width: 618rpx;
    bottom: 168rpx;
    top: 14vh;
  }
  &-bottom {
    position: fixed;
    left: 60rpx;
    right: 0px;
    bottom: 0px;
    height: 168rpx;
    border-top: 2rpx solid #f5f5f5;
    &-bg {
      position: absolute;
      left: 24rpx;
      top: 24rpx;
      width: 602rpx;
      height: 80rpx;
    }
    &-left {
      position: absolute;
      left: 24rpx;
      top: 24rpx;
      width: 300rpx;
      height: 80rpx;
    }
    &-right {
      position: absolute;
      right: 24rpx;
      top: 24rpx;
      width: 300rpx;
      height: 80rpx;
    }
  }
  &-cell {
    @include ver;
    margin-left: 32rpx;
    &-title {
      font-size: 26rpx;
      color: #000000;
    }
    &-wrapBox {
      &-item {
        display: inline-flex;
        padding: 12rpx 16rpx;
        font-size: 26rpx;
        color: #2e323e;
        border-radius: 6rpx;
        background: #f5f6f8;
        margin-right: 18rpx;
        margin-bottom: 18rpx;
        box-sizing: border-box;
      }
      .activeItem {
        background: #ffebf1;
        border: 2rpx solid #f5b1c5;
        color: #ff6a95;
      }
    }
    &-switchBox {
      margin-top: 24rpx;
      width: 594rpx;
      height: 76rpx;
      background: #f5f6f8;
      border-radius: 6rpx;
      @include hor-between-center;
      padding: 20rpx;
      box-sizing: border-box;
      font-size: 26rpx;
      color: #2e323e;
    }
    &-cityWrapBox {
      margin-top: 28rpx;
      &-item {
        display: inline-flex;
        background: #f5f6f8;
        border-radius: 6rpx;
        font-size: 26rpx;
        color: #2e323e;
        padding: 20rpx;
        box-sizing: border-box;
        margin: 0px 18rpx 18rpx 0px;
        position: relative;
        &-close {
          position: absolute;
          right: -10rpx;
          top: -10rpx;
          width: 24rpx;
          height: 24rpx;
        }
      }
      .cityActive {
        background: #ffebf1;
        border: 2rpx solid #f5b1c5;
        color: #ff6a95;
      }
    }
  }
}
.custom-button {
  @include ver;
  align-items: center;
  padding: 40rpx 8rpx 8rpx 8rpx;
  &-tag {
    width: 20rpx;
    height: 20rpx;
  }
  &-value {
    font-size: 26rpx;
    color: #000000;
  }
}
.pickerBox {
  background: #fff;
  &-bar {
    padding: 40rpx;
    @include hor-between-center;
    box-sizing: border-box;
    &-cancel {
      font-weight: 500;
      font-size: 32rpx;
      color: #959aa5;
    }
    &-sure {
      font-weight: 500;
      font-size: 32rpx;
      color: #ff5485;
    }
  }
}
.sliderBar{
  margin-left: 2%;
  width: 94%;
}
</style>