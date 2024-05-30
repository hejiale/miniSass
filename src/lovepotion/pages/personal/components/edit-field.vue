<template>
  <div class="editBox">
    <span class="editBox-title">个人简介</span>
    <div class="editBox-inputBox">
      <textarea
        placeholder="用一句话来简单描述自己～"
        maxlength="250"
        auto-focus
        auto-height
        class="editBox-inputBox-field"
        placeholder-class="placeholderArea"
        v-model="description"
        @input="onInput"
      ></textarea>
      <span class="editBox-inputBox-count">({{ description.length }}/250)</span>
    </div>
    <div class="footer" @click="onNext">下一步</div>
  </div>
</template>
<script>
import {checkContent} from "@/utils/index"
export default {
  props: {
    content:{
      type: String
    }
  },
  data(){
    return {
      description: ''
    }
  },
  watch:{
    content:{
      handler(newName, oldName) {
        if (newName !== oldName) {
          this.description = this.content;
        }
      },
      immediate: true,
    }
  },
  methods:{
    onNext(){
      this.$emit('on-next', this.description)
    },
    async onInput(e){
      try{
        await checkContent(e.detail.value)
      }catch(e){
        this.description = "";
      }
    },
  }
};
</script>
<style>
.placeholderArea {
  font-size: 32rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: #959aa5;
  line-height: 38rpx;
}
</style>
<style lang="scss" scoped>
.editBox {
  @include fiexcenter;
  @include ver;
  align-items: center;
  &-title {
    font-size: 40rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 56rpx;
    margin-top: 124rpx;
  }
  &-inputBox {
    margin-top: 114rpx;
    width: 89.3vw;
    height: 42vh;
    background: #f5f6f8;
    border-radius: 10px;
    position: relative;
    &-count {
      position: absolute;
      right: 40rpx;
      bottom: 40rpx;
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959aa5;
    }
    &-field {
      padding: 40rpx;
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #5f6572;
      line-height: 38rpx;
      caret-color: #FF5485;
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
</style>