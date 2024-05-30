<template>
  <div class="editBox">
    <span class="editBox-title">{{ title }}</span>
    <div class="editBox-tabBox" v-if="tabs.length">
      <div v-for="tab in tabs" :key="tab.index" class="editBox-tabBox-tab" :class="{ 'leftTab': tab.index === 0, 'active': activeTab === tab.index }" @click="onChangeTab(tab.index)">
        {{ tab.name }}
        <div class="line" v-if="activeTab === tab.index"></div>
      </div>
    </div>
    <div class="editBox-content" :style="contentStyle">
      <div
        class="editBox-content-item"
        :class="{ active: isSelect(v.name) }"
        v-for="(v, idx) in menus"
        :key="v.name"
        :style="idx % 2 !== 0 ? 'margin-right: 0px' : ''"
        @click="onSelect(v.name)"
      >
        {{ v.name }}
        <image src="../../../static/image/icon-delete.png" class="editBox-content-item-delete" v-if="v.new" @click.stop="onDeleteMenu(v)"></image>
      </div>
      <div
        class="editBox-content-add"
        :style="menus.length % 2 !== 0 ? 'margin-right: 0px' : ''"
        @click="onAdd"
      >
        + 新增
      </div>
    </div>
    <div class="footer" @click="onNext">{{ type == 'place' ? '确定':'下一步' }}</div>
    <van-popup
      :show="showEdit"
      :safe-area-inset-bottom="false"
      z-index="1000"
      round
      close-on-click-overlay
      @click-overlay="showEdit = false"
    >
      <div class="editPopBox">
        <div class="editPopBox-inputBox">
          <input
            v-model="inputValue"
            :placeholder="placeholder"
            class="editPopBox-inputBox-input"
            maxlength="10"
            @input="onInput"
          />
          <span class="editPopBox-inputBox-count">{{ inputValue.length }}/10</span>
        </div>
        <div class="editPopBox-sure" @click="onSureAdd">确定新增</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {checkContent} from "@/utils/index"
export default {
  props: {
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    placeholder:{
      type: String,
    },
    value: {
      type: Array,
      default: []
    },
    rightValue: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      hobbyList: [
        { name: "聚会", new: false },
        { name: "电子游戏", new: false },
        { name: "桌游", new: false },
        { name: "棋牌游戏", new: false },
        { name: "美食", new: false },
        { name: "绘画", new: false },
        { name: "写作", new: false },
        { name: "摄影", new: false },
        { name: "听音乐", new: false },
        { name: "乐器演出", new: false },
        { name: "社交", new: false },
        { name: "手工艺", new: false },
        { name: "购物", new: false },
        { name: "学习新技能", new: false },
        { name: "养生", new: false },
      ],
      motionList: [
        { name: "篮球", new: false },
        { name: "足球", new: false },
        { name: "跑步", new: false },
        { name: "游泳", new: false },
        { name: "徒步", new: false },
        { name: "瑜伽", new: false },
        { name: "健身操", new: false },
        { name: "羽毛球", new: false },
        { name: "乒乓球", new: false },
        { name: "登山", new: false },
        { name: "骑行", new: false },
        { name: "滑板", new: false },
        { name: "桨板", new: false },
        { name: "攀岩", new: false },
      ],
      dietList: [
        { name: "面食为主", new: false },
        { name: "香辣", new: false },
        { name: "麻辣", new: false },
        { name: "原汁原味", new: false },
        { name: "粤菜", new: false },
        { name: "顺德菜", new: false },
        { name: "点心", new: false },
        { name: "茶餐厅", new: false },
        { name: "东南亚菜", new: false },
        { name: "偏向清淡", new: false },
        { name: "海鲜", new: false },
        { name: "淮扬菜", new: false },
        { name: "苏式", new: false },
        { name: "杭帮菜", new: false },
        { name: "徽菜", new: false },
        { name: "鲁菜", new: false },
        { name: "川菜", new: false },
        { name: "闽菜", new: false },
        { name: "浙菜", new: false },
        { name: "湘菜", new: false },
        { name: "潮汕菜", new: false },
        { name: "客家菜", new: false },
        { name: "西餐", new: false },
        { name: "德式", new: false },
        { name: "美式", new: false },
        { name: "法式", new: false },
        { name: "土耳其菜", new: false },
      ],
      movieTypeList: [
        { name: "动作", new: false },
        { name: "冒险", new: false },
        { name: "喜剧", new: false },
        { name: "剧情", new: false },
        { name: "悬疑", new: false },
        { name: "恐怖", new: false },
        { name: "科幻", new: false },
        { name: "奇幻", new: false },
        { name: "浪漫", new: false },
        { name: "战争", new: false },
        { name: "历史", new: false },
        { name: "文艺", new: false },
        { name: "家庭", new: false },
        { name: "动画", new: false },
        { name: "纪录片", new: false },
        { name: "音乐/歌舞", new: false },
        { name: "其他", new: false }
      ],
      musicTypeList:[
        { name: "流行音乐", new: false },
        { name: "摇滚", new: false },
        { name: "爵士乐", new: false },
        { name: "古典音乐", new: false },
        { name: "乡村音乐", new: false },
        { name: "电子音乐", new: false },
        { name: "R&B/灵魂音乐", new: false },
        { name: "嘻哈", new: false },
        { name: "蓝调", new: false },
        { name: "雷鬼", new: false },
        { name: "重金属", new: false },
        { name: "朋克", new: false },
        { name: "蓝草", new: false },
        { name: "福音音乐", new: false },
        { name: "拉丁音乐", new: false },
        { name: "民谣", new: false },
        { name: "中国传统音乐", new: false }
      ],
      hotPlaceList: this.$enums.LP_HOT_PLACE.list,
      nationalPlaceList: this.$enums.LP_HOT_NATIONAL_PLACE.list,
      selectMenu: [],
      selectRightMenu: [],
      addMenu: [],
      addRightMenu: [],
      showEdit: false,
      inputValue: "",
      activeTab: 0
    };
  },
  computed: {
    isSelect() {
      return function (v) {
        if(this.activeTab === 1){
          return this.selectRightMenu.indexOf(v) !== -1;
        }
        return this.selectMenu.indexOf(v) !== -1;
      };
    },
    menus() {
      if (this.type === "hobby") {
        return [...this.hobbyList, ...this.addMenu];
      } else if (this.type === "motion") {
        return [...this.motionList, ...this.addMenu];
      } else if (this.type === "diet") {
        return [...this.dietList, ...this.addMenu];
      } else if (this.type === "movieType") {
        return [...this.movieTypeList, ...this.addMenu];
      } else if (this.type === "musicType") {
        return [...this.musicTypeList, ...this.addMenu];
      } else if (this.type === "place" && this.activeTab === 0) {
        return [...this.hotPlaceList, ...this.addMenu];
      } else if (this.type === "place" && this.activeTab === 1) {
        return [...this.nationalPlaceList, ...this.addRightMenu];
      }
      return [];
    },
    tabs() {
      if(this.type === 'place'){
        return [{name: '国内',index: 0}, {name: '国际',index: 1}]
      }
      return [];
    },
    contentStyle(){
      return this.type === 'place' ? 'top: 22vh': 'top: 16vh';
    }
  },
  watch:{
    value:{
      handler(newName, oldName) {
        if (newName !== oldName) {
          this.addMenu = [];
          this.selectMenu = [];

          if(this.type === 'hobby'){
            this.value.map(v=>{
              if(this.hobbyList.findIndex(e=>e.name === v) === -1){
                this.addMenu.push({
                  name: v,
                  new: true
                });
              }
            })
          }else if(this.type === 'diet'){
            this.value.map(v=>{
              if(this.dietList.findIndex(e=>e.name === v) === -1){
                this.addMenu.push({
                  name: v,
                  new: true
                });
              }
            })
          }else if(this.type === 'motion'){
            this.value.map(v=>{
              if(this.motionList.findIndex(e=>e.name === v) === -1){
                this.addMenu.push({
                  name: v,
                  new: true
                });
              }
            })
          }else if(this.type === 'musicType'){
            this.value.map(v=>{
              if(this.musicTypeList.findIndex(e=>e.name === v) === -1){
                this.addMenu.push({
                  name: v,
                  new: true
                });
              }
            })
          }else if(this.type === 'movieType'){
            this.value.map(v=>{
              if(this.movieTypeList.findIndex(e=>e.name === v) === -1){
                this.addMenu.push({
                  name: v,
                  new: true
                });
              }
            })
          }else if(this.type === 'place' && this.activeTab === 0){
            this.value.map(v=>{
              if(this.hotPlaceList.findIndex(e=>e.name === v) === -1){
                this.addMenu.push({
                  name: v,
                  new: true
                });
              }
            })
          }
          this.selectMenu = this.value;
        }
      },
      immediate: true
    },
    rightValue:{
      handler(newName, oldName) {
        if (newName !== oldName) {
          this.rightValue.map(v=>{
            if(this.nationalPlaceList.findIndex(e=>e.name === v) === -1){
              this.addRightMenu.push({
                name: v,
                new: true
              });
            }
          })
          this.selectRightMenu = this.rightValue;
        }
      },
      immediate: true
    }
  },
  methods: {
    onChangeTab(idx){
      this.activeTab = idx;
    },
    onAdd() {
      this.showEdit = true;
    },
    async onInput(e){
      try{
        await checkContent(e.detail.value)
      }catch(e){
        this.inputValue = "";
      }
    },
    onSureAdd() {
      if (this.inputValue.length) {
        if(this.activeTab === 0){
          this.addMenu.push({name: this.inputValue, new: true});
          this.selectMenu.push(this.inputValue);
        }else{
          this.addRightMenu.push({name: this.inputValue, new: true});
          this.selectRightMenu.push(this.inputValue);
        }
        
        this.inputValue = "";
        this.showEdit = false;
      }
    },
    onSelect(v) {
      if(this.activeTab === 0){
        if (this.selectMenu.indexOf(v) !== -1) {
          this.selectMenu.splice(this.selectMenu.indexOf(v), 1);
        } else {
          this.selectMenu.push(v);
        }
      }else{
        if (this.selectRightMenu.indexOf(v) !== -1) {
          this.selectRightMenu.splice(this.selectRightMenu.indexOf(v), 1);
        } else {
          this.selectRightMenu.push(v);
        }
      }
    },
    onNext() {
      this.inputValue = '';
      this.addMenu = [];
      this.addRightMenu = [];
      
      if(this.selectMenu.length){
        if(this.type === 'place'){
          this.$emit("on-next",{dom: this.selectMenu, over: this.selectRightMenu});
        }else{
          this.$emit("on-next", this.selectMenu);
        }
      } else{
        this.$emit("on-next");
      }
      
      this.selectMenu = [];
      this.selectRightMenu = [];
    },
    onDeleteMenu(v){
      if(this.activeTab === 0){
        this.addMenu.splice(this.addMenu.findIndex(e=>e.name === v.$orig.name), 1);
        this.selectMenu.splice(this.selectMenu.findIndex(e=>e === v.$orig.name), 1);
      }else{
        this.addRightMenu.splice(this.addRightMenu.findIndex(e=>e.name === v.$orig.name), 1);
        this.selectRightMenu.splice(this.selectRightMenu.findIndex(e=>e === v.$orig.name), 1);
      }
    }
  },
};
</script>
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
  &-content {
    position: fixed;
    left: 0rpx;
    right: 0rpx;
    padding: 0rpx 80rpx;
    bottom: 12.56vh;
    overflow-y: scroll;
    &-item,
    &-add {
      display: inline-flex;
      width: 37.3vw;
      height: 114rpx;
      background: #f2f2f2;
      border-radius: 10px;
      margin: 0px 30rpx 30rpx 0px;
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      position: relative;
      &-delete{
        position: absolute;
        right: -32rpx;
        top: -32rpx;
        width: 44rpx;
        height: 44rpx;
        padding: 20rpx;
      }
    }
    &-add {
      background: #ffffff;
      border: 1px solid #ff5485;
      color: #ff5485;
    }
    .active {
      border: 1px solid #ff5485;
      color: #ff5485;
      background: #fff1fa;
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
.editPopBox {
  width: 82.6vw;
  background: #fff;
  @include ver;
  align-items: center;
  padding-bottom: 2vh;
  &-inputBox {
    margin-top: 114rpx;
    width: 72vw;
    height: 114rpx;
    background: #f5f6f8;
    border-radius: 10px;
    position: relative;
    @include hor;
    align-items: center;
    &-count {
      position: absolute;
      right: 24rpx;
      font-size: 28rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #959aa5;
    }
    &-input {
      margin-left: 32rpx;
      font-size: 36rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #5f6572;
    }
  }
  &-sure {
    margin-top: 70rpx;
    width: 72vw;
    height: 92rpx;
    background: #ff5485;
    border-radius: 44px;
    font-size: 30rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    @include hor-center-center;
  }
}
</style>