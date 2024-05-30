<template>
  <view>
    <!-- 导航栏 -->
    <view class="selection-box">
      <!--下拉选项器-->
      <view class="target-area" @click="onShowCityPicker">
        <view class="input-size">{{ regionName }}</view>
        <image class="icon-down" src="../static/image/downImage.png"/>
      </view>
      <picker @change="bindPickerChangePX" :value="index4" :range="array4" range-key="regionName">
        <view class="sort-area">
          <view class="sort-area-title" @click="addClickZHPX">
            <view class="input-size">{{ sortType }}</view>
            <image class="icon-down" src="../static/image/downImage.png"/>
          </view>
        </view>
      </picker>
      <view class="want-status" @click="addClickbox(1)" :class="indexNo === 1 ? 'currentColor' : ''">之前去过</view>
      <view class="want-status second-button" @click="addClickbox(2)" :class="indexNo === 2 ? 'currentColor' : ''">
        有我想玩
      </view>
    </view>
    <van-action-sheet
      :show="showPicker"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showPicker = false"
    >
      <van-picker
      show-toolbar
      title="选择城市"
      :columns="columns"
      @cancel="showPicker = false"
      @confirm="bindPickerChangeArea"
    />
    </van-action-sheet>
  </view>
</template>
<script>
export default {
  props: {
    preferred: {
      type: Object,
      default() {
        return null;
      },
    },
    ids: {
      type: Number,
      default() {
        return null;
      },
    },
    regionType: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      indexNo: '',
      regionName: "全城",
      sortType: "综合排序",
      columns: [],
      array4: [
        {regionName: "综合排序", id: "1"},
        {regionName: "距离排序", id: "2"},
      ],
      index4: 0,
      showPicker: false
    };
  },
  methods: {
    // 切换区域
    bindPickerChangeArea(e) {
      let target = e.detail.value[0];
      this.regionName = target.text;
      if (target.text === "全城"){
        this.category_id = null;
        this.$emit("searchCategoryYX", null);
        this.showPicker = false;
        return;
      }
      this.category_id = target.id;
      this.$emit("searchCategoryYX", this.category_id);
      this.showPicker = false;
    },
    bindPickerChangePX(e) {
      let selectId = this.array4[e.detail.value].id;
      this.sortType = this.array4[e.detail.value].regionName;
      this.$emit("searchCategoryYXZH", selectId);
    },
    onShowCityPicker(){
      this.showPicker = true;
      this.queryRegion();
    },
    async queryRegion() {
      try {
        let res = await this.$api.getRegion({
          id: this.ids,
          regionType: this.regionType,
        });
        let first = {
          "id": this.ids,
          "regionName": "全城",
          "subRegionList" : null
        }
        res.unshift(first);
        this.columns = [{
          values: [],
        }];
      
        this.columns[0].values = res.map((m) => {
          return {
            text: m.regionName,
            id: m.id,
          };
        });
      } catch (e) {
      }
    },
    addClickZHPX(e) {
    },
    addClickbox(index) {
      if (index == this.indexNo) {
        this.indexNo = null
        this.$parent.changeBeforPlay(null);
      } else {
        this.indexNo = index
        this.$parent.changeBeforPlay(index);
      }
    },
    clear(){
      this.regionName = "全城";
      this.category_id = null;
      this.$emit("searchCategoryYX", null);
    }
  },
};
</script>


<style lang="scss" scoped>
.selection-box {
  font-family: PingFang SC, PingFang SC;
  width: 750rpx;
  height: 88rpx;
  background: #ffffff;
  border-radius: 0 0 0 0;
  opacity: 1;
  position: fixed;
  top: 15.4vh;
  display: flex;
  z-index: 99;
  align-items: center;

  .target-area {
    display: flex;
    justify-content: flex-start;
    margin-left: 34rpx;
    margin-right: 34rpx;
  }

  .sort-area {
    display: flex;
    justify-content: space-between;

    .sort-area-title {
      display: flex;
      justify-content: flex-start;
    }
  }

  .input-size {
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #5F6572;
  }


  .icon-down {
    width: 14rpx;
    height: 10rpx;
    margin-left: 6rpx;
    transform: translateY(12rpx);
  }

  .icon-down-mr {
    margin-right: 44rpx;
  }

  .want-status {
    width: 128rpx;
    height: 50rpx;
    background: #ffffff;
    border-radius: 34rpx;
    border: 2rpx solid #e9ebef;
    font-size: 24rpx;
    font-weight: 500;
    color: #5f6572;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 34rpx;
  }

  .second-button {
    margin-left: 14rpx;
  }


  .currentColor {
    border: 2rpx solid #36e4bb;
    font-size: 24rpx;
    font-weight: 500;
    color: #36e4bb;
  }

}
</style>
  