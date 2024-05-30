<template>
  <div class="paramasContent">
    <div class="paramasContent-coreTypeBox">
      <div v-if="type === 1">
        <div
          class="paramasContent-coreTypeBox-item"
          :class="selectCoreType.id === coreType.id ? 'activeCoreType' : ''"
          v-for="coreType in coreTypeList"
          :key="coreType.id"
          @click="onChooseCoreType(coreType)"
        >
          {{ coreType.dictValue }}
        </div>
      </div>
      <div v-if="type === 2">
        <div
          class="paramasContent-coreTypeBox-item"
          :class="selectPlayer === player ? 'activeCoreType' : ''"
          v-for="player in gamePlayer"
          :key="player"
          @click="onChooseGamePlayer(player)"
        >
          {{ player }}
        </div>
      </div>
      <!-- <div v-if="type === 3">
        <div
          class="paramasContent-coreTypeBox-item"
          :class="selectTime === time ? 'activeCoreType' : ''"
          v-for="time in playTime"
          :key="time"
          @click="onChooseGameTime(time)"
        >
          {{ time }}
        </div>
      </div> -->
      <div v-if="type === 3">
        <div
          class="paramasContent-coreTypeBox-item"
          :class="selectIsFirst === v ? 'activeCoreType' : ''"
          v-for="v in isFirstList"
          :key="v"
          @click="onChooseIsFirst(v)"
        >
          {{ v }}
        </div>
      </div>
      <div v-if="type === 4">
        <div
          class="paramasContent-coreTypeBox-item"
          :class="selectSellType.value === v.value ? 'activeCoreType' : ''"
          v-for="v in sellTypeList"
          :key="v.value"
          @click="onChooseSellType(v)"
        >
          {{ v.label }}
        </div>
      </div>
      <view class="paramasContent-coreTypeBox-scrollView" v-if="type === 5">
        <div
          class="paramasContent-coreTypeBox-scrollView-group"
          v-for="item in organizerList"
          :key="item.organizerType"
        >
          <div class="paramasContent-coreTypeBox-scrollView-group-title">
            {{ $enums.OrganizerType.getName(item.organizerType) }}
          </div>
          <div class="paramasContent-coreTypeBox-scrollView-group-blocks">
            <div
              v-for="it in item.organizer"
              :key="it.organizerId"
              class="paramasContent-coreTypeBox-scrollView-group-blocks-item"
              :class="
                selectOrganizer.organizerId === it.organizerId ? 'active' : ''
              "
              @click="onChooseOrganizer(it)"
            >
              {{ it.organizerName }}
            </div>
          </div>
        </div>
      </view>
    </div>
    <div class="paramasContent-bottom">
      <image src="../static/image/icon-sure-filter.png" />
      <span @click="onReset">重置</span>
      <span @click="onSure">确定</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: Number,
      default: 0,
    },
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
      selectOrganizer: {},
      selectCoreType: {},
      gamePlayer: ["≤4人", "5人", "6人", "7人", "8人", "≥9人"], //玩本人数
      selectPlayer: null,
      // playTime: ["2~4小时", "4~6小时", "6~8小时", "8~10小时", "10~12小时"], //玩本时间
      // selectTime: null,
      selectSellType: {},
      isFirstList: ["是", "否"],
      selectIsFirst: null,
      filterParama: [],
      sellTypeList:[
        { label: "盒装", value: "BOXED" },
        { label: "城限", value: "LIMITED" },
        { label: "独家", value: "EXCLUSIVE" },
        { label: "实景", value: "REAL_SCENE" },
        { label: "待定", value: "UNDETERMINED" },
      ]
    };
  },
  created() {},
  methods: {
    refresh(val) {
      this.filterParama = val || [];

      this.filterParama.map((it) => {
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
        if (it.type === "isFirst") {
          this.selectIsFirst = it.value;
        }
        if (it.type === "sellType") {
          this.selectSellType = {
            value: it.value,
            label: it.name
          };
        }
      });
    },
    //选择主办方
    onChooseOrganizer(it) {
      this.selectOrganizer = it;
    },
    //选择类型
    onChooseCoreType(obj) {
      this.selectCoreType = obj;
    },
    //选择玩本人数
    onChooseGamePlayer(obj) {
      this.selectPlayer = obj;
    },
    // //选择玩本时间
    // onChooseGameTime(obj) {
    //   this.selectTime = obj;
    // },
    //选择是否首发 
    onChooseIsFirst(obj){
      this.selectIsFirst = obj;
    },
    //选择发售类型
    onChooseSellType(obj){
      this.selectSellType = obj;
    },
    //重置
    onReset() {
      if (this.type === 1) {
        this.selectCoreType = {};
      } else if (this.type === 2) {
        this.selectPlayer = null;
      }
      //  else if (this.type === 3) {
      //   this.selectTime = null;
      // }
      else if (this.type === 3) {
        this.selectIsFirst = null;
      }else if (this.type === 4) {
        this.selectSellType = {};
      }else if (this.type === 5) {
        this.selectOrganizer = {};
      }
      this.onSure();
    },
    onSure() {
      //主办方
      if (this.filterParama.findIndex((v) => v.type === "organizer") !== -1) {
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "organizer")
        ].value = this.selectOrganizer.organizerId;
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "organizer")
        ].name = this.selectOrganizer.organizerName;
      } else {
        this.filterParama.push({
          type: "organizer",
          value: this.selectOrganizer.organizerId,
          name: this.selectOrganizer.organizerName,
        });
      }
      //剧本类型
      if (this.filterParama.findIndex((v) => v.type === "coreType") !== -1) {
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "coreType")
        ].value = this.selectCoreType.id;
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "coreType")
        ].name = this.selectCoreType.dictValue;
      } else {
        this.filterParama.push({
          type: "coreType",
          value: this.selectCoreType.id,
          name: this.selectCoreType.dictValue,
        });
      }
      //剧本人数
      if (this.filterParama.findIndex((v) => v.type === "player") !== -1) {
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "player")
        ].value = this.selectPlayer;
      } else {
        this.filterParama.push({
          type: "player",
          value: this.selectPlayer,
        });
      }
      //剧本时长
      // if (this.filterParama.findIndex((v) => v.type === "time") !== -1) {
      //   this.filterParama[
      //     this.filterParama.findIndex((v) => v.type === "time")
      //   ].value = this.selectTime;
      // } else {
      //   this.filterParama.push({
      //     type: "time",
      //     value: this.selectTime,
      //   });
      // }
      //是否首发
      if (this.filterParama.findIndex((v) => v.type === "isFirst") !== -1) {
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "isFirst")
        ].value = this.selectIsFirst;
      } else {
        this.filterParama.push({
          type: "isFirst",
          value: this.selectIsFirst,
        });
      }
      //发售类型
      if (this.filterParama.findIndex((v) => v.type === "sellType") !== -1) {
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "sellType")
        ].value = this.selectSellType.value;
        this.filterParama[
          this.filterParama.findIndex((v) => v.type === "sellType")
        ].name = this.selectSellType.label;
      } else {
        this.filterParama.push({
          type: "sellType",
          value: this.selectSellType.value,
          name: this.selectSellType.label
        });
      }

      this.$emit("on-change", JSON.parse(JSON.stringify(this.filterParama)));
      this.clearFilter();
    },
    clearFilter() {
      this.filterParama = [];
      this.selectOrganizer = {};
      this.selectCoreType = {};
      this.selectPlayer = null;
      // this.selectTime = null;
      this.selectIsFirst = null;
      this.selectSellType = {};
    },
  },
};
</script>
<style lang="scss" scoped>
.paramasContent {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: #f5f5f5;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  &-coreTypeBox {
    padding: 12px;
    overflow-y: scroll;
    max-height: 25vh;
    &-scrollView {
      padding: 12px 0;
      &-group {
        position: relative;
        &-title {
          font-size: 16px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #111111;
          line-height: 19px;
        }
        &-blocks {
          margin-top: 12px;
          &-item {
            display: inline-flex;
            margin-right: rpx(20);
            font-size: rpx(14);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            margin-bottom: 17px;
          }
          .active {
            color: #1cbc80;
          }
        }
      }
    }
    &-item {
      display: inline-block;
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #111111;
      line-height: 16px;
      width: 46vw;
      margin-bottom: rpx(17);
    }
    .activeCoreType {
      color: #1cbc80;
    }
  }
  &-bottom {
    position: absolute;
    bottom: rpx(12);
    left: rpx(12);
    width: 93.6vw;
    height: rpx(38);
    position: relative;
    @include hor-center-center;
    image {
      @include abscenter;
    }
    span:nth-child(2) {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #1cbc80;
      z-index: 1;
      width: 50%;
      text-align: center;
    }
    span:nth-child(3) {
      font-size: 14px;
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