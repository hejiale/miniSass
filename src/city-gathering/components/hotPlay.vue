<template>
  <view class="container" :prefix="`${item.typeValue}：`">
    <scroll-view scroll-y class="container-scroll" @scrolltolower="scrollLower" :style="{
      top: `${statusBarHeight + 48}px`,
      height: `${scrollHeight}px`,
    }">
      <view class="scollView">
        <view class="mvstyle2" v-for="form in DictTypeForm" :key="form.typeValue">
          <view class="ticai">{{form.typeValue}}：</view>
          <scroll-view class="mvstyleitem1" scroll-x>
            <view class="mvstyleitem" :class="activeForm(item.dictValue, form.typeValue) ? 'active' : ''"
              v-for="(item, index) in form.dictList" @click="onChange(item, form.typeValue)" :key="index">{{ item.dictValue }}</view>
          </scroll-view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      DictTypeForm: [
        {
          typeValue: "人数",
          dictList: [
            {
              dictType: "gamer",
              dictValue: "全部",
              minGamerNum: null,
              maxGamerNum: null
            },
            {
              dictType: "gamer",
              dictValue: "≤4人",
              minGamerNum: 4,
              maxGamerNum: 0
            },
            {
              dictType: "gamer",
              dictValue: "5人",
              minGamerNum: 5,
              maxGamerNum: 5,
            },
            {
              dictType: "gamer",
              dictValue: "6人",
              minGamerNum: 6,
              maxGamerNum: 6,
            },
            {
              dictType: "gamer",
              dictValue: "7人",
              minGamerNum: 7,
              maxGamerNum: 7,
            },
            {
              dictType: "gamer",
              dictValue: "8人",
              minGamerNum: 8,
              maxGamerNum: 8,
            },
            {
              dictType: "gamer",
              dictValue: "9人",
              minGamerNum: 9,
              maxGamerNum: 9,
            },
          ],
        },
      ],
      selectForm: [{type: '人数', form: {dictValue: "全部",}}]
    };
  },
  async mounted(){
    await this.queryType();
  },
  computed:{
    activeForm(){
      return function(dictValue, type){
        if(this.selectForm.length){
          let idx = this.selectForm.findIndex(v=>v.type === type);
          if(idx !== -1){
            if(this.selectForm[idx].form.dictValue === dictValue){
              return true
            }
          }
        }
        return false;
      }
    }
  },
  methods: {
    clearForm(){
      this.selectForm.map(v=>{
        v.form = {dictValue: "全部"}
      })
    },
    onChange(form, type) {
      let idx = this.selectForm.findIndex(v=>v.type === type);
      if(idx !== -1){
        if(this.selectForm[idx].form.dictValue !== form.dictValue){
          this.selectForm.splice(idx, 1);
          this.selectForm.push({type, form})
        }else{
          this.selectForm.splice(idx, 1);
          this.selectForm.push({type, form: {dictValue: "全部"}})
        }
      }else{
        this.selectForm.push({type, form})
      }
      
      this.$emit("onChange", this.selectForm);
    },
    //查询组局筛选类型
    async queryType() {
      try {
        let res = await this.$api.queryDictList({
          dictType: 0,
        });
        res[0].dictList.unshift({dictValue: '全部', id: null});
        this.DictTypeForm.unshift(res[0]);
        
        if(this.selectForm.findIndex(v=>v.type === res[0].typeValue) === -1){
          this.selectForm.unshift({type: res[0].typeValue, form: {dictValue: '全部'}})
        }
      } catch (e) { }
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  background: #f5f6f8;
}

.container {
  position: fixed;
  top: 15.8vh;
  border-top: 2rpx solid #E9EBEF;

  .scollView {
    // width: 750rpx;
    white-space: nowrap;
  }

  .mvstyle2 {
    display: flex;
    align-items: center;
    padding: 20rpx 0rpx 0rpx 56rpx;

    .ticai {
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
      width: 130rpx;
      text-align: right;
    }

    .qb {
      margin-left: 10rpx;
      margin-right: 58rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e323e;
    }

    .active {
      color: #36e4bb;
    }

    .mvstyleitem1 {
      width: 75vw;
      display: flex;
      .mvstyleitem {
        display: flex;
        justify-content: flex-start;
        display: inline-block;
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        padding: 6rpx 26rpx;
        border-radius: 20rpx;
        background: unset;
      }

      .active {
        color: #36e4bb;
        background: rgba($color: #36e4bb, $alpha: 0.1);
      }
    }
  }

  .scriptNavigation {
    margin-left: 24rpx;
    font-size: 26rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #2e323e;
  }

  .bannerJb {
    width: 702rpx;
    height: 386rpx;
    background: #ffffff;
    border-radius: 18rpx 18rpx 18rpx 18rpx;
    opacity: 1;
    margin-top: 20rpx;

    .box {
      display: flex;
      justify-content: space-between;
    }

    .left {
      width: 168rpx;
      height: 224rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      opacity: 1;
      background-color: #36e4bb;
      margin: 30rpx 0rpx 0rpx 24rpx;
    }

    .right {
      width: 130rpx;
      height: 34rpx;
      background-color: #36e4bb;
      margin: 32rpx 24rpx 0rpx 0rpx;
    }

    .mindel {
      margin-top: 28rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6572;
      margin-left: -30rpx;

      .titletext {
        font-size: 32rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e323e;
        margin-bottom: 14rpx;
      }

      .mvStyle {
        margin-top: 6rpx;
      }

      .wmcount {
        margin-top: 6rpx;
      }

      .zuoze {
        margin-top: 6rpx;
      }

      .faxing {
        margin-top: 6rpx;
      }
    }

    .bottonBox {
      // width: 654rpx;
      height: 72rpx;
      background: #f5f6f8;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e323e;
      margin: 30rpx 24rpx 0px 24rpx;

      .jiantou {
        width: 16rpx;
        height: 20rpx;
      }

      .number {
        margin-right: 4rpx;
      }

      .pczhong {
        margin-right: 12rpx;
      }
    }
  }
}
</style>
