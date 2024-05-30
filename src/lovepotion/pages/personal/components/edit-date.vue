<template>
  <div class="editBox">
    <span class="editBox-title">{{ title }}</span>
    <div class="editBox-content">
      <van-datetime-picker
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        :value="currentDate"
        :show-toolbar="false"
        column-class="columnClass"
        active-class="activeClass"
        @input="onChange"
      />
    </div>
    <div class="footer" @click="onNext">下一步</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
    },
    value: {
      type: String
    }
  },
  data() {
    return {
      currentDate: new Date().getTime(),
      minDate: new Date('1940/01/01').getTime(),
      maxDate: new Date().getTime(),
      age: 0,
      birthday: this.$dayjs(new Date()).format('YYYY-MM-DD 00:00:00')
    };
  },
  watch:{
    value:{
      handler(newName, oldName) {
        if (newName !== oldName && newName !== '') {
          this.currentDate = new Date(newName).getTime();
          this.age = parseInt(this.$dayjs(new Date()).format('YYYY')) - parseInt(this.$dayjs(new Date(newName)).format('YYYY'));
          this.birthday = this.$dayjs(new Date(newName)).format('YYYY-MM-DD 00:00:00');
        }
      },
      immediate: true,
    }
  },
  methods:{
    onNext(){
      this.$emit('on-next', {age: this.age, birthday: this.birthday});
    },
    onChange(e){
      this.age = parseInt(this.$dayjs(new Date()).format('YYYY')) - parseInt(this.$dayjs(e.detail).format('YYYY'));
      this.birthday = this.$dayjs(e.detail).format('YYYY-MM-DD 00:00:00');
    }
  }
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
  &-content {
    margin-top: 10vh;
    width: 100vw;
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