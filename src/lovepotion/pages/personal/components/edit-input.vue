<template>
  <div class="editBox">
    <span class="editBox-title">{{ title }}</span>
    <div class="editBox-inputBox">
      <input
        auto-focus
        v-model="inputValue"
        :type="inputType"
        :placeholder="placeholder"
        class="editBox-inputBox-input"
        placeholder-class="placeholder"
        @input="onInput"
        :maxlength="type !== 'phone' ? 10: -1"
      />
    </div>
    <div class="editBox-subTitle">{{ subTitle }}</div>
    <div class="footer" @click="onNext">下一步</div>
  </div>
</template>
<script>
import {checkContent} from "@/utils/index"
export default {
  props: {
    title: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    inputType: {
      type: String,
      default: "text",
    },
    subTitle: {
      type: String,
    },
    type: {
      type: String
    },
    updateValue: {
      type: String
    }
  },
  data(){
    return {
      inputValue: null
    }
  },
  watch:{
    updateValue: {
      handler(newName, oldName) {
        if(newName){
          this.inputValue = newName
        }
      },
      immediate: true,
    }
  },
  methods:{
    onNext(){
      this.$emit('on-next', this.inputValue);
      this.inputValue = null;
    },
    async onInput(e){
      if(this.type === 'phone')return;
      
      try{
        await checkContent(e.detail.value)
      }catch(e){
        this.inputValue = "";
      }
    },
  }
};
</script>
<style>
.placeholder {
  color: #959aa5 !important;
  font-weight: 500 !important;
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
  &-inputBox {
    margin-top: 340rpx;
    width: 78.6vw;
    height: 114rpx;
    background: #f5f6f8;
    border-radius: 10px;
    position: relative;
    &-input {
      @include abscenter;
      text-align: center;
      font-size: 36rpx;
      color: #2e323e;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      caret-color: #FF5485;
    }
  }
  &-subTitle {
    margin-top: 32rpx;
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #959aa5;
    line-height: 38rpx;
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
</style>