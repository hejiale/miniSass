<template>
  <div class="gender">
    <div class="gender-bg" @click="cancel"></div>
    <div class="gender-box">
      <div class="gender-box-title" @click="cancel">
        <div>修改线下占位</div>
        <div></div>
      </div>
      <div class="gender-box-edit">
        <div class="gender-box-edit-item male">
          <div class="gender-box-edit-item-icon">
            <image src="../static/image/icon-male_big.png" />
          </div>
          <div class="gender-box-edit-item-text">男生</div>
          <div class="gender-box-edit-item-stepper">
            <image
              @click="subtractmaleNum"
              :src="
                maleNum == 0
                  ? '../static/image/icon-unSubtract_gender.png'
                  : '../static/image/icon-subtract_gender.png'
              "
            />
            <span>{{ maleNum }}</span>
            <image
              @click="addmaleNum"
              :src="
                maleDisable
                  ? '../static/image/icon-unAdd_gender.png'
                  : '../static/image/icon-add_gender.png'
              "
            />
          </div>
        </div>
        <div class="gender-box-edit-item female">
          <div class="gender-box-edit-item-icon">
            <image src="../static/image/icon-female_big.png" />
          </div>
          <div class="gender-box-edit-item-text">女生</div>
          <div class="gender-box-edit-item-stepper">
            <image
              @click="subtractFemaleNum"
              :src="
                femaleNum == 0
                  ? '../static/image/icon-unSubtract_gender.png'
                  : '../static/image/icon-subtract_gender.png'
              "
            />
            <span>{{ femaleNum }}</span>
            <image
              @click="addFemaleNum"
              :src="
                femaleDisable
                  ? '../static/image/icon-unAdd_gender.png'
                  : '../static/image/icon-add_gender.png'
              "
            />
          </div>
        </div>
      </div>
      <div class="gender-box-text">{{needPeople}}</div>
      <div class="gender-box-btn" @click="confirm">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShowGender: {
      type: Boolean,
      default: false,
    },
    propMaleNum: {
      type: Number,
    },
    propFemaleNum: {
      type: Number,
    },
    limitMale: {
      type: Number,
    },
    limitFemale: {
      type: Number,
    },
    propRealMale: {
      type: Number,
    },
    propRealFemale: {
      type: Number,
    },
    isRevertSex: {
      type: Number,
    }
  },
  data() {
    return {
      maleNum: 0,
      femaleNum: 0,
      realMale: 0,
      realFemale: 0,
    };
  },
  created() {
    this.maleNum = this.propMaleNum ? this.propMaleNum : 0;
    this.femaleNum = this.propFemaleNum ? this.propFemaleNum : 0;
    this.realMale = this.propRealMale ? this.propRealMale : 0;
    this.realFemale = this.propRealFemale ? this.propRealFemale : 0;
  },
  computed:{
    maleDisable(){
      if(this.isRevertSex){
        return this.limitMale - this.realMale - this.realFemale - this.maleNum - this.femaleNum === 0;
      }
      return this.limitMale - this.realMale - this.maleNum === 0;
    },
    femaleDisable(){
      if(this.isRevertSex){
        return this.limitMale - this.realMale - this.realFemale - this.maleNum - this.femaleNum === 0;
      }
      return this.limitFemale - this.realFemale - this.femaleNum === 0;
    },
    needPeople(){
      if(this.isRevertSex){
        let count = this.limitMale - this.realMale - this.realFemale - this.maleNum - this.femaleNum;
        return count > 0 ? `缺${count}人`:'';
      }
      let maleCount = this.limitMale - this.realMale - this.maleNum;
      let feMaleCount = this.limitFemale - this.realFemale - this.femaleNum;
      if(maleCount > 0 || feMaleCount > 0){
        return `缺${maleCount > 0 ? `${maleCount}男`:''}`+ `${feMaleCount > 0 ? `${feMaleCount}女`:''}`;
      }
      return "";
    }
  },
  watch:{
    isRevertSex(){
      this.maleNum = 0;
      this.femaleNum = 0;
    }
  },
  methods: {
    subtractmaleNum() {
      if (this.maleNum == 0) return;
      this.maleNum--;
    },
    addmaleNum() {
      if(this.isRevertSex){
        if (this.maleNum == this.limitMale - this.realMale - this.femaleNum) return;
      }else{
        if (this.maleNum == this.limitMale - this.realMale) return;
      }
      this.maleNum++;
    },
    subtractFemaleNum() {
      if (this.femaleNum == 0) return;
      this.femaleNum--;
    },
    addFemaleNum() {
      if(this.isRevertSex){
        if (this.femaleNum == this.limitMale - this.realMale - this.maleNum) return;
      }else{
        if (this.femaleNum == this.limitFemale - this.realFemale) return;
      }
      this.femaleNum++;
    },
    confirm() {
      this.$emit("male-female-num", {
        male: this.maleNum,
        female: this.femaleNum,
      });
      this.cancel();
    },
    cancel() {
      this.$emit("update:isShowGender", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.gender {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  &-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
  &-box {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 626rpx;
    padding: 40rpx;
    background: #ffffff;
    border-radius: 44rpx 44rpx 44rpx 44rpx;
    &-title {
      position: relative;
      :nth-child(1) {
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 28rpx;
        text-align: center;
      }
      :nth-child(2) {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 26rpx;
        height: 26rpx;
        background: #000000;
        -webkit-clip-path: polygon(
          10% 0,
          0 10%,
          40% 50%,
          0 90%,
          10% 100%,
          50% 60%,
          90% 100%,
          100% 90%,
          60% 50%,
          100% 10%,
          90% 0,
          50% 40%
        );
        clip-path: polygon(
          10% 0,
          0 10%,
          40% 50%,
          0 90%,
          10% 100%,
          50% 60%,
          90% 100%,
          100% 90%,
          60% 50%,
          100% 10%,
          90% 0,
          50% 40%
        );
      }
    }
    &-edit {
      display: flex;
      justify-content: space-between;
      margin-top: 34rpx;
      .male {
        background-image: url("../static/image/bg-male.png");
      }
      .female {
        background-image: url("../static/image/bg-female.png");
      }
      &-item {
        width: 252rpx;
        height: 340rpx;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &-icon {
          width: 100rpx;
          height: 100rpx;
          margin: 48rpx auto 0;
        }
        &-text {
          margin: 20rpx auto 0;
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 28rpx;
          text-align: center;
        }
        &-stepper {
          @include hor-center-center;
          margin-top: 50rpx;
          image {
            width: 32rpx;
            height: 32rpx;
          }
          :nth-child(2) {
            font-size: 28rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #1a1a1a;
            line-height: 44rpx;
            margin: 0 30rpx;
          }
        }
      }
    }
    &-text {
      margin: 34rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 32rpx;
      text-align: center;
    }
    &-btn {
      height: 96rpx;
      background: #14c9c9;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 96rpx;
      text-align: center;
    }
  }
}
</style>
