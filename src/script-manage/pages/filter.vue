<template>
  <div class="popFilterBox">
    <div
      v-for="dict in filterObj"
      :key="dict.title"
      class="popFilterBox-dictBox"
    >
      <div class="popFilterBox-dictBox-title">{{ dict.title }}</div>
      <div class="popFilterBox-dictBox-lists">
        <div
          class="popFilterBox-dictBox-lists-item"
          :class="selected(dict, it) ? 'select' : ''"
          v-for="it in dict.list"
          :key="it.dictValue"
          @click="onChangeDict(dict, it)"
        >
          {{ it.dictValue }}
        </div>
      </div>
    </div>
    <div class="popFilterBox-bottom">
      <div class="popFilterBox-bottom-left" @click="onReset">重置</div>
      <div class="popFilterBox-bottom-right" @click="onQuery">查询</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterObj: [],
      selectDicts: []
    };
  },
  props:{
    isAddStatus:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    selected(){
      return function(dict, val){
        let isExist = false;
        let index = this.selectDicts.findIndex(it=>it.title === dict.title);
        if(index !== -1){
          this.selectDicts.map(v=>{
            let idx = v.list.findIndex(i=>i.dictValue === val.dictValue)
            if(idx !== -1){
              isExist = true;
            }
          })
        }
        return isExist;
      }
    }
  },
  created(){
    this.getDicts();
  },
  methods: {
    //筛选参数
    async getDicts() {
      try {
        let data = await this.$api.queryDictList({
          dictType: "DRAMA",
        });
        this.filterObj = [
          {
            title: this.isAddStatus ? "添加状态":"剧本状态",
            list: this.isAddStatus ? [{ dictValue: "已添加",isPutOn: true }, { dictValue: "未添加",isPutOn: false }]:[{ dictValue: "推荐", isRecommend: true }, { dictValue: "置顶",isTop: true }],
          },
          {
            title: "剧本人数",
            list: [
              { dictValue: "≤4人",minGamer: 4,  maxGamer: 0},
              { dictValue: "5人",minGamer: 5,  maxGamer: 5},
              { dictValue: "6人",minGamer: 6,  maxGamer: 6},
              { dictValue: "7人",minGamer: 7,  maxGamer: 7},
              { dictValue: "8人",minGamer: 8,  maxGamer: 8},
              { dictValue: "≥9人",minGamer: null,  maxGamer: 9},
            ],
          },
          { title: null, list: [] },
          {
            title: "剧本类型",
            list: [
              { dictValue: "实景", dictType: 'REAL_SCENE'},
              { dictValue: "盒装", dictType: 'BOXED' },
              { dictValue: "城限", dictType: 'LIMITED' },
              { dictValue: "独家", dictType: 'EXCLUSIVE' },
              { dictValue: "待定", dictType: 'UNDETERMINED' }
            ],
          },
        ];
        this.filterObj[2].title = data[0].typeValue;
        this.filterObj[2].list = data[0].dictList;
      } catch (e) {}
    },
    onChangeDict(dict, val) {
      //已有存在
      let index = this.selectDicts.findIndex((it) => it.title === dict.title);
      if(index !== -1){
        if(dict.title === '剧本类型'){
          this.selectDicts.map(it=>{
            if(it.title === dict.title){
              let index = it.list.findIndex((v) => v.dictValue === val.dictValue);
              if (index !== -1) {
                it.list.splice(index, 1);
              }else{
                it.list.push(val)
              }
            }
          })
        }else{
          let idx = this.selectDicts[index].list.findIndex(v=>v.dictValue === val.dictValue);
          if(idx !== -1){
            this.selectDicts[index].list = [];
          }else{
            this.selectDicts[index].list = [val];
          }
        }
      }else{
        this.selectDicts.push({title: dict.title, list: [val]});
      }
    },
    onReset(){
      this.selectDicts = [];
      this.$emit('on-change')
    },
    onQuery(){
      this.$emit('on-change', this.selectDicts)
    }
  },
};
</script>
<style lang="scss" scoped>
.popFilterBox {
  padding-top: rpx(20);
  padding-bottom: rpx(92);
  &-dictBox {
    overflow-y: scroll;
    &-title {
      margin-top: rpx(8);
      margin-left: rpx(16);
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
    }
    &-lists {
      display: flex;
      flex-wrap: wrap;
      margin-top: rpx(10);
      margin-left: rpx(5);
      &-item {
        display: inline-block;
        padding: rpx(6) rpx(12);
        background: #f7f7f7;
        border-radius: 20px;
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        @include hor-center-center;
        margin-left: rpx(11);
        margin-bottom: rpx(16);
      }
      .select {
        background: #14c9c9;
        color: #fff;
      }
    }
  }
  &-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: rpx(88);
    background: #ffffff;
    box-shadow: 0px -3px 8px 0px rgba(0, 0, 0, 0.05);
    @include hor-center-center;
    &-left {
      margin-top: rpx(-16);
      width: rpx(164);
      height: 44px;
      background: #e5e9ed;
      border-radius: 41px;
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #4c5657;
      @include hor-center-center;
      margin-right: rpx(15);
    }
    &-right {
      margin-top: rpx(-16);
      width: rpx(164);
      height: 44px;
      background: #14c9c9;
      border-radius: 41px;
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #fff;
      @include hor-center-center;
    }
  }
}
</style>