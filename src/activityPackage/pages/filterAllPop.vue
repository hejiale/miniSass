<template>
  <div class="filterPopBox">
    <div class="filterPopBox-title" @click="onClose">全部筛选</div>
    <image src="../static/image/icon-close.png" class="filterPopBox-closeBox" />
    <scroll-view class="filterPopBox-scrollView" scroll-y>
      <div class="filterPopBox-scrollView-group" style="margin-top: 0px">
        <div class="filterPopBox-scrollView-group-title">是否首发</div>
        <div class="filterPopBox-scrollView-group-blocks">
          <div
            v-for="it in isFirstList"
            :key="it"
            class="filterPopBox-scrollView-group-blocks-item"
            :class="isFirst === it ? 'active' : ''"
            @click="onChooseIsFirst(it)"
          >
            {{ it }}
          </div>
        </div>
      </div>
      <div
        class="filterPopBox-scrollView-group mt18"
        v-for="item in organizerList"
        :key="item.organizerType"
      >
        <div class="filterPopBox-scrollView-group-title">
          {{ $enums.OrganizerType.getName(item.organizerType) }}
        </div>
        <div class="filterPopBox-scrollView-group-blocks">
          <div
            v-for="it in item.organizer"
            :key="it.organizerId"
            class="filterPopBox-scrollView-group-blocks-item"
            :class="
              selectOrganizer.organizerId === it.organizerId ? 'active' : ''
            "
            @click="onChooseOrganizer(it)"
          >
            {{ it.organizerName }}
          </div>
        </div>
      </div>
      <div class="filterPopBox-scrollView-group mt18">
        <div class="filterPopBox-scrollView-group-title">剧本类型</div>
        <div class="filterPopBox-scrollView-group-blocks">
          <div
            v-for="coreType in coreTypeList"
            :key="coreType.id"
            class="filterPopBox-scrollView-group-blocks-item"
            :class="selectCoreType.id === coreType.id ? 'active' : ''"
            @click="onChooseCoreType(coreType)"
          >
            {{ coreType.dictValue }}
          </div>
        </div>
      </div>
      <div class="filterPopBox-scrollView-group mt18">
        <div class="filterPopBox-scrollView-group-title">剧本人数</div>
        <div class="filterPopBox-scrollView-group-blocks">
          <div
            v-for="player in gamePlayer"
            :key="player"
            class="filterPopBox-scrollView-group-blocks-item"
            :class="selectPlayer === player ? 'active' : ''"
            @click="onChooseGamePlayer(player)"
          >
            {{ player }}
          </div>
        </div>
      </div>
      <!-- <div class="filterPopBox-scrollView-group mt18">
        <div class="filterPopBox-scrollView-group-title">剧本时长</div>
        <div class="filterPopBox-scrollView-group-blocks">
          <div
            v-for="time in playTime"
            :key="time"
            class="filterPopBox-scrollView-group-blocks-item"
            :class="selectTime === time ? 'active' : ''"
            @click="onChooseGameTime(time)"
          >
            {{ time }}
          </div>
        </div>
      </div> -->
      <div class="filterPopBox-scrollView-group mt18">
        <div class="filterPopBox-scrollView-group-title">发售类型</div>
        <div class="filterPopBox-scrollView-group-blocks">
          <div
            v-for="v in sellTypeList"
            :key="v.value"
            class="filterPopBox-scrollView-group-blocks-item"
            :class="selectSellType.value === v.value ? 'active' : ''"
            @click="onChooseSellType(v)"
          >
            {{ v.label }}
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="filterPopBox-bottomBox">
      <image src="../static/image/icon-sure-filter.png" />
      <span @click="onReset">重置</span>
      <span @click="onSure">确定</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    coreTypeList: {
      type: Array,
      default: [],
    },
    organizerList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      selectOrganizer: { organizerId: null },
      selectCoreType: { id: null },
      isFirstList: ["是", "否"],
      isFirst: null,
      gamePlayer: ["≤4人", "5人", "6人", "7人", "8人", "≥9人"], //玩本人数
      selectPlayer: null,
      // playTime: ["2~4小时", "4~6小时", "6~8小时", "8~10小时", "10~12小时"], //玩本时间
      // selectTime: null,
      filterParama: [],
      selectSellType: {},
      sellTypeList:[
        { label: "盒装", value: "BOXED" },
        { label: "城限", value: "LIMITED" },
        { label: "独家", value: "EXCLUSIVE" },
        { label: "实景", value: "REAL_SCENE" },
        { label: "待定", value: "UNDETERMINED" },
      ]
    };
  },
  methods: {
    show(val) {
      this.filterParama = val;
      if (this.filterParama.length) {
        this.filterParama.map((it) => {
          if (it.type === "isFirst") {
            this.isFirst = it.value;
          }
          if (it.type === "organizer") {
            this.selectOrganizer = {
              organizerId: it.value,
              organizerName: it.name,
            };
          }
          if (it.type === "coreType") {
            this.selectCoreType = {
              id: it.value,
              dictValue: it.name,
            };
          }
          if (it.type === "player") {
            this.selectPlayer = it.value;
          }
          // if (it.type === "time") {
          //   this.selectTime = it.value;
          // }
          if (it.type === "sellType") {
            this.selectSellType =  {
              value: it.value,
              label: it.name,
            };
          }
        });
      }else{
        this.clearFilter();
      }
    },
    onClose() {
      this.$emit("on-close", this.filterParama);
    },
    //是否首发
    onChooseIsFirst(it) {
      this.isFirst = it;
    },
    //选择主办方
    onChooseOrganizer(it) {
      this.selectOrganizer = it;
    },
    //选择类型
    onChooseCoreType(obj) {
      this.selectCoreType = obj;
      this.queryFilterCount();
    },
    //选择玩本人数
    onChooseGamePlayer(obj) {
      this.selectPlayer = obj;
      this.queryFilterCount();
    },
    // //选择玩本时间
    // onChooseGameTime(obj) {
    //   this.selectTime = obj;
    //   this.queryFilterCount();
    // },
    //选择发售类型
    onChooseSellType(obj){
      this.selectSellType = obj;
    },
    //重置
    onReset() {
      this.clearFilter();
      this.filterParama = [];
      this.onFilterQuery();
    },
    onSure() {
      if (
        this.selectOrganizer.organizerId ||
        this.selectCoreType.id ||
        this.selectPlayer ||
        this.isFirst || 
        this.selectSellType
      ) {
        //主办方
        if(this.selectOrganizer.organizerId){
          if(this.filterParama.findIndex(v=>v.type === 'organizer') !== -1){
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'organizer')].value = this.selectOrganizer.organizerId;
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'organizer')].name = this.selectOrganizer.organizerName;
          }else{
            this.filterParama.push({
              type: 'organizer',
              value: this.selectOrganizer.organizerId,
              name: this.selectOrganizer.organizerName
            })
          }
        }
        //剧本类型
        if(this.selectCoreType.id){
          if(this.filterParama.findIndex(v=>v.type === 'coreType') !== -1){
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'coreType')].value = this.selectCoreType.id;
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'coreType')].name = this.selectCoreType.dictValue;
          }else{
            this.filterParama.push({
              type: 'coreType',
              value: this.selectCoreType.id,
              name: this.selectCoreType.dictValue
            })
          }
        }
        //剧本人数
        if(this.selectPlayer){
          if(this.filterParama.findIndex(v=>v.type === 'player') !== -1){
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'player')].value = this.selectPlayer;
          }else{
            this.filterParama.push({
              type: 'player',
              value: this.selectPlayer
            })
          }
        }
        //剧本时长
        // if(this.selectTime){
        //   if(this.filterParama.findIndex(v=>v.type === 'time') !== -1){
        //     this.filterParama[this.filterParama.findIndex(v=>v.type === 'time')].value = this.selectTime;
        //   }else{
        //     this.filterParama.push({
        //       type: 'time',
        //       value: this.selectTime
        //     })
        //   }
        // }
        //是否首发
        if(this.isFirst){
          if(this.filterParama.findIndex(v=>v.type === 'isFirst') !== -1){
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'isFirst')].value = this.isFirst;
          }else{
            this.filterParama.push({
              type: 'isFirst',
              value: this.isFirst
            })
          }
        }
        //发售类型
        if(this.selectSellType){
          if(this.filterParama.findIndex(v=>v.type === 'sellType') !== -1){
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'sellType')].value = this.selectSellType.value;
            this.filterParama[this.filterParama.findIndex(v=>v.type === 'sellType')].name = this.selectSellType.label;
          }else{
            this.filterParama.push({
              type: 'sellType',
              value: this.selectSellType.value,
              name: this.selectSellType.label
            })
          }
        }
      }

      this.clearFilter();
      this.onFilterQuery();
    },
    clearFilter() {
      this.selectOrganizer = {};
      this.selectCoreType = {};
      this.selectPlayer = null;
      // this.selectTime = null;
      this.isFirst = null;
      this.selectSellType = {};
    },
    onFilterQuery() {
      this.$emit("on-close", this.filterParama);
    },
  },
};
</script>
<style lang="scss" scoped>
.filterPopBox {
  width: 100vw;
  height: 80vh;
  background: #fff;
  &-title {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    padding: 17px 0;
    font-size: 17px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #111111;
    line-height: 20px;
    text-align: center;
    z-index: 1;
  }
  &-closeBox {
    position: absolute;
    top: 12px;
    right: 12px;
    width: rpx(26);
    height: rpx(26);
  }
  &-scrollView {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 7.2vh;
    bottom: 11.5vh;
    &-group {
      position: relative;
      margin-top: rpx(27);
      &-title {
        font-size: 16px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #111111;
        line-height: 19px;
      }
      &-blocks {
        margin-top: 10px;
        &-item {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-width: 15vw;
          padding: 0 rpx(12);
          margin-right: rpx(11);
          height: 38px;
          background: #f5f5f5;
          border-radius: 19px;
          font-size: rpx(14);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          margin-bottom: 9px;
        }
        .active {
          background: #edfaf5;
          color: #1cbc80;
        }
      }
    }
  }
  &-bottomBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 11.5vh;
    background: #fff;
    image {
      position: absolute;
      left: rpx(12);
      width: 93.6vw;
      top: rpx(12);
      height: 4.7vh;
    }
    span:nth-child(2) {
      position: absolute;
      left: 0;
      top: 0;
      padding-top: 2.7vh;
      padding-bottom: 20px;
      width: 50vw;
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #1cbc80;
      z-index: 1;
      width: 50%;
      text-align: center;
    }
    span:nth-child(3) {
      position: absolute;
      right: 0;
      top: 0;
      padding-top: 2.7vh;
      padding-bottom: 20px;
      width: 50vw;
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      z-index: 1;
      width: 50%;
      text-align: center;
    }
  }
}
</style>
