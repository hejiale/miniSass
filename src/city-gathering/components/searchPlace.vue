<template>
  <view>
    <view class="contentBox">
      <view class="Box2" @click="onShowCityPicker">
        <view class="uni_input">{{ regionName }}</view>
        <image class="iconDown1" src="../static/image/downImage.png" />
      </view>
      <view @click="bindPickerChangeSX">
        <view class="Box2">
          <view :style="screenBox ? 'color:  #36E4BB;' : ''">筛选</view>
          <image class="iconDown" :src="screenBox ? '../static/image/iconUp.png' : '../static/image/downImage.png'" />
        </view>
      </view>
      <picker @change="bindPickerChange" :value="index4" :range="array4">
      </picker>
      <view class="Box2">
        <!-- 综合排序 -->
        <view class="zhonghepaixu" @click="addClickZHPX">
          <view class="paixu" :style="showSyntheticSort ? 'color:  #36E4BB;' : ''">{{ zhpxName }}</view>
          <image class="iconDown" :src="showSyntheticSort ? '../static/image/iconUp.png' : '../static/image/downImage.png'" />
        </view>
      </view>
    </view>
    <!-- 筛选弹出框 -->
    <view class="screenBox" v-if="screenBox">
      <scroll-view class="scrollBox" scroll-y>
      <view class="searchTime">时间</view>
      <view class="searchdate">
        <view class="dateBigbox1" :class="dateIndex == null ? 'activecolor' : ''" @click="addClickdateBox(null)">
          <view class="datebox1">全部</view>
        </view>
        <view class="dateBigbox" :class="dateIndex == 0 ? 'activecolor' : ''" @click="addClickdateBox(0)">
          <view class="datebox">日间</view>
          <view class="datebox">06:00~18:00</view>
        </view>
        <view class="dateBigbox" :class="dateIndex == 1 ? 'activecolor' : ''" @click="addClickdateBox(1)">
          <view class="datebox">晚间</view>
          <view class="datebox">18:00~22:00</view>
        </view>
        <view class="dateBigbox" :class="dateIndex == 2 ? 'activecolor' : ''" @click="addClickdateBox(2)">
          <view class="datebox">通宵</view>
          <view class="datebox">22:00~06:00</view>
        </view>
      </view>
      <!-- 线1 -->
      <view class="line1"></view>
      <view>
        <view class="wantPlay">想玩的剧本</view>
        <view class="wantPlay2">
          <view class="wantPlayeName22" v-for="(item, index) in wantPlayexwList" :key="index"
            @click="addClickXW(item.index)" :class="dateIndex2 === item.index ? 'activecolor' : ''">{{ item.name }}</view>
        </view>
      </view>
      <!-- 线2 -->
      <view class="line2"></view>
      <view>
        <view class="wantPlayTwo">发售方式</view>
        <view class="wantPlayTwo2">
          <view class="wantPlayeName" v-for="(item, index) in wantPlayefsList" :key="index"
            @click="addClickFS(item.index)" :class="dateIndex3 === item.index ? 'activecolor' : ''">{{ item.name }}</view>
        </view>
      </view>
      <!-- 线3 -->
      <view class="line3"></view>
      <view>
        <view class="wantPlayThree">类型</view>
        <view class="wantPlayThree2">
          <view v-for="(item, index) in wantPlayList" :key="index" class="wantPlayeName2"
            :class="{ activecolor: selected[item.id] == true }" @click="addclickLX(item.id)">
            {{ item.dictValue }}
          </view>
        </view>
      </view>
      </scroll-view>
      <!-- 底部按钮 -->
      <view class="buttonBox">
        <view class="buttonClear" @click="addClickClear">清空</view>
        <view class="buttonSure" @click="addClickCommit">确定</view>
      </view>
    </view>
    <!-- 综合排序下拉框 -->
    <view class="showSyntheticSortCSS" v-if="showSyntheticSort">
      <view class="syntheticSortItem" v-for="(item, index) in sortList" :key="item.id"
        @click="addClickSXtext(item, index)">
        <view v-if="SXtext == index ? true : false">
          <image class="leftIcon" src="../static/image/righticon.png"></image>
        </view>
        <view v-else class="leftIcon"></view>
        <view :class="SXtext == index ? 'activecolorIcon' : ''">{{
          item.name
        }}</view>
      </view>
    </view>
    <!-- 遮照层 -->
    <view class="zhezhaoBox" v-show="screenBox || showSyntheticSort" @click="closeOtherMask"></view>
    <van-action-sheet
      :show="showPicker"
      :safe-area-inset-bottom="false"
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
  props: ["ids", "regionType", "screenBox", "showSyntheticSort"],
  data() {
    return {
      openSearch: false,
      zhpxName: "综合排序", //综合排序名称
      SXtext: "",
      selected: {},
      dateIndex: null, //点击时间高亮索引
      dateIndex2: null, // 点击想玩的剧本
      dateIndex3: null, // 点击发售方式索引
      dateIndex4: null, // 点击类型
      regionName: "全城",
      category_id: "",
      title: "picker",
      columns: [],
      index: 0,
      sortList: [
        { name: "综合排序", id: 0 },
        { name: "新手优先", id: 1 },
        { name: "我想玩的", id: 2 },
        { name: "离我最近", id: 3 },
        { name: "即将满车", id: 4 },
      ],
      wantPlayefsList: [
        { name: "全部", index: null },
        { name: "盒装", index: "1" },
        { name: "独家", index: "3" },
        { name: "城限", index: "2" },
      ],
      wantPlayexwList: [
        { name: "全部", index: null },
        { name: "只看想玩", index: "1" },
        { name: "不看玩过", index: "-1" },
      ],
      wantPlayList: [],
      showPicker: false
    };
  },
  async created() {
    await this.queryType();
  },
  methods: {
    // 筛选文字
    addClickSXtext(item, index) {
      // console.log("========>", item.name);
      this.zhpxName = item.name;
      this.SXtext = index;
      this.$parent.SXtextMthod(this.SXtext);
    },
    // 点击综合排序
    addClickZHPX() {
      this.$parent.syntheticSort();
    },
    //查询组局筛选类型
    async queryType() {
      try {
        let res = await this.$api.queryDictList({
          dictType: 0,
        });
        // this.dateList = res;
        console.log("=======>res", res);
        this.wantPlayList = res[0].dictList;
      } catch (e) { }
    },
    // 想玩的剧本
    addClickXW(index) {
      this.dateIndex2 = index;
    },
    // 点击发售
    addClickFS(index) {
      console.log('index', index);
      this.dateIndex3 = index;


    },
    // 点击类型方式
    addclickLX(id) {
      this.$set(this.selected, id, !this.selected[id]);
      console.log("this.selected", this.selected);
    },
    // 点击确定按钮
    addClickCommit() {
      // 筛选类型数据
      let select = [];
      Object.keys(this.selected).forEach((key) => {
        if (this.selected[key]) {
          for (let i = 0; i < this.wantPlayList.length; i += 1) {
            this.wantPlayList[i].id == key
              ? select.push(this.wantPlayList[i])
              : "";
          }
        }
      });
      
      let select2 = [];
      select.map((item) => {
        select2.push(item.id);
      });
      
      this.$parent.screenBoxM(
        this.dateIndex,
        this.dateIndex2,
        this.dateIndex3,
        select2
      );
    },
    // 清空筛选列表
    addClickClear() {
      (this.selected = {}), //时间
        (this.dateIndex2 = null), // 想玩的剧本
        (this.dateIndex3 = null), // 发售
        (this.dateIndex = null);
    },
    addClickdateBox(idex) {
      this.dateIndex = idex;
      // this.$emit("searchTimeType", this.dateIndex);
    },
    bindPickerChangeSX() {
      this.openSearch = !this.openSearch
      this.$parent.screenBoxM1();
    },
    closeOtherMask() {
      this.$parent.closeSearchBox();
    },
    // 切换区域
    bindPickerChangeArea(e) {
      let target = e.detail.value[0];
      this.regionName = target.text;
      if (target.text === "全城"){
        this.category_id = null;
        this.$emit("searchCategory", null);
        this.showPicker = false;
        return;
      }
      this.category_id = target.id;
      this.$emit("searchCategory", this.category_id);
      this.showPicker = false;
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
          "regionName": "全城"
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
      } catch (e) { }
    },
    clear(){
      this.regionName = "全城";
      this.category_id = null;
      this.$emit("searchCategory", null);
    }
  },
};
</script>

<style lang='scss' scoped>
.zhezhaoBox {
  width: 750rpx;
  height: 1212rpx;
  background: #000000;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  opacity: 0.4;
}

.contentBox {
  display: flex;
  justify-content: flex-start;
}

.Box2 {
  display: flex;
  justify-content: flex-start;
  font-size: 26rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  color: #5F6572;

  .zhonghepaixu {
    display: flex;
    justify-content: flex-start;
    position: fixed;
    right: 32rpx;

    .paixu {
      margin-right: 12rpx;
    }
  }
}

.iconDown {
  width: 14rpx;
  height: 10rpx;
  margin-left: 2rpx;
  margin-top: 13rpx;
}

.iconDown1 {
  width: 14rpx;
  height: 10rpx;
  margin-left: 2rpx;
  margin-top: 13rpx;
  margin-right: 44rpx;
}

.uni_input {
  margin-left: 34rpx;
}

.screenBox {
  width: 100vw;
  height: 54vh;
  background: #ffffff;
  .scrollBox{
    padding: 20rpx 0;
    height: 82%;
  }
  .searchTime {
    font-size: 28rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #5F6572;
    margin-left: 32rpx;
  }

  .searchdate {
    display: flex;
    justify-content: flex-start;
  }

  .dateBigbox1 {
    width: 156rpx;
    height: 100rpx;
    margin: 22rpx 20rpx 0rpx 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f6f8;
    border-radius: 6rpx 6rpx 6rpx 6rpx;
    opacity: 1;
  }

  .dateBigbox {
    width: 156rpx;
    height: 100rpx;
    margin: 22rpx 20rpx 0rpx 8rpx;
    display: flex;
    flex-direction: column;
    background: #f5f6f8;
    border-radius: 6rpx 6rpx 6rpx 6rpx;
    opacity: 1;

    .datebox {
      width: 156rpx;
      height: 50%;
      // background: #f5f6f8;
      display: flex;
      justify-content: center;
    }

    .datebox1 {
      width: 156rpx;
      height: 100%;
      // background: #f5f6f8;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .line1 {
    width: 686rpx;
    height: 1rpx;
    opacity: 1;
    background: #f5f6f8;
    position: absolute;
    top: 196rpx;
    left: 32rpx;
  }

  .line2 {
    width: 686rpx;
    height: 1rpx;
    opacity: 1;
    background: #f5f6f8;
    position: absolute;
    top: 380rpx;
    left: 32rpx;
  }

  .line3 {
    width: 686rpx;
    height: 1rpx;
    opacity: 1;
    background: #f5f6f8;
    position: absolute;
    top: 564rpx;
    left: 32rpx;
  }

  .wantPlayTwo {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    position: absolute;
    left: 32rpx;
    top: 406rpx;
  }

  .wantPlayTwo2 {
    position: absolute;
    left: 32rpx;
    top: 474rpx;
    display: flex;
    justify-content: space-between;

    .wantPlayeName {
      width: 157rpx;
      height: 60rpx;
      background: #f5f6f8;
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
    }

    .activecolor {
      height: 60rpx;
      background: #f1fffc;
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      opacity: 1;
      border: 2rpx solid #36e4bb;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #36e4bb;
    }
  }

  .wantPlayThree {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    position: absolute;
    left: 32rpx;
    top: 590rpx;
  }

  .wantPlayThree2 {
    position: absolute;
    left: 32rpx;
    top: 660rpx;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .wantPlayeName2 {
      padding: 12rpx 52rpx;
      background: #f5f6f8;
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      margin-right: 20rpx;
      margin-top: 20rpx;
    }

    .bottomBox {
      margin-top: 200rpx;
    }

    .activecolor {
      height: 30rpx;
      background: #f1fffc;
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      opacity: 1;
      border: 2rpx solid #36e4bb;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #36e4bb;
    }
  }

  .wantPlay {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    position: absolute;
    left: 32rpx;
    top: 222rpx;
  }

  .wantPlay2 {
    position: absolute;
    left: 32rpx;
    top: 290rpx;
    display: flex;
    justify-content: space-between;

    .wantPlayeName22 {
      padding: 6rpx 52rpx;
      background: #f5f6f8;
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
    }

    .activecolor {
      height: 60rpx;
      background: #f1fffc;
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      opacity: 1;
      border: 2rpx solid #36e4bb;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #36e4bb;
    }
  }

  .buttonBox {
    display: flex;
    justify-content: space-around;
    position: fixed;
    top: 1210rpx;
    align-items: center;
    background: #FFFFFF;
    width: 100vw;
    height: 132rpx;


    .buttonClear {
      width: 44vw;
      height: 80rpx;
      background: #ffffff;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      opacity: 1;
      border: 2rpx solid #959aa5;
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #5f6572;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .buttonSure {
      width: 44vw;
      height: 80rpx;
      background: #36e4bb;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      opacity: 1;
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #5f6572;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
    }
  }

  .activecolor {
    height: 100rpx;
    background: #f1fffc;
    border-radius: 6rpx 6rpx 6rpx 6rpx;
    opacity: 1;
    border: 2rpx solid #36e4bb;
    font-size: 26rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #36e4bb;
  }
}

.showSyntheticSortCSS {
  width: 750rpx;
  height: 402rpx;
  background: #ffffff;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  opacity: 1;
  display: flex;
  flex-direction: column;

  :nth-child(1).syntheticSortItem {
    margin-top: 22rpx;
  }

  .syntheticSortItem {
    margin: 0 0 40rpx 66rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #2e323e;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .leftIcon {
      width: 28rpx;
      height: 28rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin-right: 8rpx;
    }

    .activecolorIcon {
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #36e4bb;
    }
  }
}
</style>
