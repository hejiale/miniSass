<template>
  <div class="editBox">
    <span class="editBox-title">{{ title }}</span>
    <div class="editBox-tabBox" v-if="tabs.length">
      <div v-for="tab in tabs" :key="tab.index" class="editBox-tabBox-tab" :class="{ 'leftTab': tab.index === 0, 'active': activeTab === tab.index }" @click="onChangeTab(tab.index)">
        {{ tab.name }}
        <div class="line" v-if="activeTab === tab.index"></div>
      </div>
    </div>
    <div class="editBox-pickerBox">
      <van-picker
        :columns="cityColumns"
        custom-class="customClass"
        column-class="columnClass"
        active-class="activeClass"
        @change="changePicker"
        id="cityPicker"
        v-if="(type === 'city' || type === 'residence') && activeTab === 0"
      />
      <van-picker
        id="picker"
        :columns="columns"
        custom-class="customClass"
        column-class="columnClass"
        active-class="activeClass singleActive"
        @change="changeSinglePicker"
        v-else
      />
    </div>
    <!-- <div class="space"></div> -->
    <div class="footer" @click="onNext">下一步</div>
  </div>
</template>
<script>
import countrys from "@/utils/country";
export default {
  props: {
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    value: {
      type: String,
      default: null,
    },
    isOverSea: {
      type: Boolean,
      default: false
    },
    provinceId: {
      type: Number,
      default: null,
    },
    cityId: {
      type: Number,
      default: null,
    },
    permanentResidenceProvince: {
      type: String,
      default: null,
    },
    permanentResidenceCity: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
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
      heights: [],
      weights: [],
      changeValue: null,
      defaultIndex: 0,
      picker: null,
      cityPicker: null,
      activeTab: 0
    };
  },
  computed: {
    columns() {
      if (this.type === "sex") {
        return this.$enums.LP_SEX.list;
      } else if (this.type === "education") {
        return this.$enums.LP_EDUCATION.list;
      } else if (this.type === "politics") {
        return this.$enums.LP_POLITICS.list;
      } else if (this.type === "occupation") {
        return this.$enums.LP_OCCUPATION.list;
      } else if (this.type === "weight") {
        return this.weights;
      } else if (this.type === "height") {
        return this.heights;
      } else if ((this.type === "city" || this.type === 'residence') && this.activeTab === 1) {
        return countrys.CountryList;
      }
      return [];
    },
    tabs() {
      if(this.type === 'city'){
        return [{name: '中国国籍',index: 0}, {name: '非中国国籍',index: 1}]
      }else if(this.type === 'residence'){
        return [{name: '中国境内',index: 0}, {name: '境外',index: 1}]
      }
      return [];
    }
  },
  watch: {
    value: {
      handler(newName, oldName) {
        if (newName !== oldName && newName !== undefined && newName !== null && newName !== '') {
          //延时操作，刷新
          let vm = this;
          setTimeout(() => {
            //设置已选的选中项
            if (vm.type === "sex") {
              vm.defaultIndex = vm.$enums.LP_SEX.list.findIndex(
                (v) => v.value === vm.value
              );
            } else if (vm.type === "education") {
              vm.defaultIndex = vm.$enums.LP_EDUCATION.list.findIndex(
                (v) => v.text === vm.value
              );
            } else if (vm.type === "politics") {
              vm.defaultIndex = vm.$enums.LP_POLITICS.list.findIndex(
                (v) => v.text === vm.value
              );
            } else if (vm.type === "occupation") {
              vm.defaultIndex = vm.$enums.LP_OCCUPATION.list.findIndex(
                (v) => v.text === vm.value
              );
            } else if (vm.type === "weight") {
              vm.defaultIndex = vm.weights.findIndex(
                (v) => v.text === vm.value
              );
            } else if (vm.type === "height") {
              vm.defaultIndex = vm.heights.findIndex(
                (v) => v.text === vm.value
              );
            } else if (vm.type === "residence" && this.activeTab === 1) {
              vm.defaultIndex = countrys.CountryList.findIndex(
                (v) => v.text === vm.value
              );
            } else if (vm.type === "city" && this.activeTab === 1) {
              vm.defaultIndex = countrys.CountryList.findIndex(
                (v) => v.text === vm.value
              );
            }

            if (vm.picker) {
              if (vm.defaultIndex !== -1) {
                vm.changeValue = null;
                vm.picker.setColumnIndex(0, vm.defaultIndex);
              } else {
                //设置默认选中项
                vm.setDefaultValue();
              }
            }
          }, 500);
        }
      },
      immediate: true,
    },
    type: {
      handler(newName, oldName) {
        this.getWeight();
        this.getHeight();

        if (newName !== oldName) {
          let vm = this;
          //注册picker
          if (newName === "city" || newName === 'residence') {
            setTimeout(() => {
              vm.$nextTick((_) => {
                vm.cityPicker = vm.selectComponent("#cityPicker");
              });
            }, 100);
          } else {
            setTimeout(()=>{
              vm.$nextTick((_) => {
                vm.picker = vm.selectComponent("#picker");
                vm.setDefaultValue();
              });
            }, 100)
          }
        }
      },
      immediate: true,
    },
    cityId: {
      handler(newName, oldName) {
        this.queryRegion();
      },
      immediate: true,
    },
    permanentResidenceCity: {
      handler(newName, oldName) {
        this.queryRegion();
      },
      immediate: true,
    },
    isOverSea: {
      handler(newName, oldName) {
        let vm = this;
        
        this.activeTab = newName ? 1: 0;

        this.$nextTick((_) => {
          vm.picker = vm.selectComponent("#picker");
        });
      },
      immediate: true,
    }
  },
  methods: {
    onChangeTab(idx){
      let vm = this;
      this.activeTab = idx;

      if(idx === 0){
        setTimeout(()=>{
          vm.cityPicker = vm.selectComponent("#cityPicker");
          vm.queryRegion();
        },0)
      }else{
        setTimeout(()=>{
          vm.picker = vm.selectComponent("#picker");
          vm.picker.setColumnIndex(0, vm.defaultIndex);
        },200)
        
      }
    },
    //设置默认选中项
    setDefaultValue() {
      if (this.type === "weight") {
        this.picker.setColumnIndex(
          0,
          this.weights.findIndex((v) => v.text === "60KG")
        );
      } else if (this.type === "height") {
        this.picker.setColumnIndex(
          0,
          this.heights.findIndex((v) => v.text === "170cm")
        );
      } else if (this.type === "education") {
        this.picker.setColumnIndex(
          0,
          this.$enums.LP_EDUCATION.list.findIndex((v) => v.text === "本科")
        );
      }
      this.changeValue = this.picker.getValues()[0].text;
    },
    onNext() {
      if((this.type === 'city' || this.type === 'residence') && this.activeTab === 0){
        let data = this.cityPicker.getIndexes();
        let province = this.cityColumns[0].values[data[0]];
        let city = this.cityColumns[1].values[data[1]];
        this.$emit("on-next", {province, city, type: this.activeTab});
      }else{
        this.$emit("on-next", this.changeValue);
        this.changeValue = null;
      }
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
    changeSinglePicker(e) {
      if (this.type === "sex") {
        this.changeValue = e.detail.value.value;
      } else {
        this.changeValue = e.detail.value.text;
      }
    },
    //查询省市列表
    async queryRegion() {
      try {
        let res = uni.getStorageSync('region');

        this.cityColumns[0].values = res.map((m) => {
          return {
            text: m.regionName,
            id: m.id,
            subRegionList: m.subRegionList,
          };
        });

        //处理二级列表
        if(this.type === 'city'){
          if (this.cityId) {
            res.map((province) => {
              if (province.id === this.provinceId) {
                this.cityColumns[1].values = province.subRegionList.map((m) => {
                  return {
                    text: m.regionName,
                    id: m.id,
                  };
                });
              }
            });
          } else {
            this.cityColumns[1].values = res[0].subRegionList.map((m) => {
              return {
                text: m.regionName,
                id: m.id,
              };
            });
          }
          if (this.provinceId && this.cityId) {
            setTimeout(() => {
              this.cityPicker.setIndexes([
                res.findIndex((v) => v.id === this.provinceId),
                this.cityColumns[1].values.findIndex((v) => v.id === this.cityId),
              ]);
            }, 200);
          }
        }else{
          if (this.permanentResidenceCity) {
            res.map((province) => {
              if (province.regionName === this.permanentResidenceProvince) {
                this.cityColumns[1].values = province.subRegionList.map((m) => {
                  return {
                    text: m.regionName,
                    id: m.id,
                  };
                });
              }
            });
          } else {
            this.cityColumns[1].values = res[0].subRegionList.map((m) => {
              return {
                text: m.regionName,
                id: m.id,
              };
            });
          }
          if (this.permanentResidenceProvince && this.permanentResidenceCity) {
            setTimeout(() => {
              this.cityPicker.setIndexes([
                res.findIndex((v) => v.regionName === this.permanentResidenceProvince),
                this.cityColumns[1].values.findIndex((v) => v.text === this.permanentResidenceCity),
              ]);
            }, 200);
          }
        }
        
      } catch (e) {}
    },
    //获取体重列表
    getHeight() {
      let count = 120;
      for (let i = 0; i < 101; i++) {
        this.heights.push({ text: `${count++}cm` });
      }
    },
    //获取体重列表
    getWeight() {
      let count = 35;
      for (let i = 0; i < 146; i++) {
        this.weights.push({ text: `${count++}kg` });
      }
    },
  },
};
</script>
<style>
.columnClass {
  font-size: 32rpx;
  font-weight: 500 !important;
  color: #959aa5 !important;
}
.activeClass {
  font-size: 36rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500 !important;
  color: #2e323e !important;
}
.singleActive {
  background: #f2f2f2;
  border-radius: 10px;
}
.customClass {
  background-color: transparent !important;
}
</style>
<style lang="scss" scoped>
.editBox {
  @include ver;
  align-items: center;
  @include fiexcenter;
  &-title {
    font-size: 40rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 56rpx;
    margin-top: 124rpx;
  }
  &-pickerBox {
    margin-top: 15vh;
    width: 78.6vw;
    z-index: 3;
  }
  &-tabBox{
    margin-top: 60rpx;
    @include hor-center-center;
    &-tab, &-leftTab{
      font-size: 32rpx;
      color: #959AA5;
      line-height: 38rpx;
      position: relative;
      padding-bottom: 10rpx;
    }
    .leftTab{
      margin-right: 110rpx;
    }
    .active{
      font-weight: 600;
      color: #2E323E;
      position: relative;
      @include ver;
      align-content: center;
    }
    .line{
      position: absolute;
      bottom: 0px;
      width: 32rpx;
      height: 4rpx;
      background: #2E323E;
      border-radius: 12rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.footer {
  position: fixed;
  right: 40rpx;
  bottom: 92rpx;
  width: 134rpx;
  height: 80rpx;
  background: #ff5485;
  border-radius: 8px;
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  @include hor-center-center;
}
.space {
  position: absolute;
  left: 40px;
  top: 38vh;
  width: 295px;
  height: 88rpx;
  background: #f2f2f2;
  border-radius: 10px 10px 10px 10px;
  opacity: 0.9;
  z-index: 2;
}
</style>