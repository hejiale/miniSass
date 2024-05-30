<template>
  <div class="container">
    <div class="box" v-for="(user, index) in userList" :key="index" :style="{ top: circleTop(index), left: circleLeft(index) }">
      <div class="box-circle" v-if="index % 4 === 0">
        <image :src="user.avatar" class="avatar" v-if="index % 4 === 0"></image>
        <div class="box-circle-name">{{ user.name }}</div>
      </div>
      <div class="box-unCircle" v-else>
        <image class="box-unCircle-border"></image>
        <div class="box-unCircle-name">{{ user.name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
  data(){
    return {
      angleInterval: (2 * Math.PI) / 8 //计算每个小圆点在圆周上的角度
    }
  },
  props: {
    userList:{
      type: Array,
      default(){
        return []
      }
    }
  },
  computed:{
    // 根据索引计算每个小圆点的 top 值
    circleTop(){
      return function(index){
        const radius = 325; // 圆的半径
        const angle = index * this.angleInterval;
        //微调 中间数值改变位置
        return `calc(50% - 20rpx - ${radius * Math.sin(angle)}rpx)`;
      }
    },
    // 根据索引计算每个小圆点的 left 值
    circleLeft(){
      return function(index){
        const radius = 325; // 圆的半径
        const angle = index * this.angleInterval;
        //微调 中间数值改变位置
        return `calc(50% - 45rpx + ${radius * Math.cos(angle)}rpx)`;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  height: 544rpx;
  width: 544rpx;
  border-radius: 50%;
  //background: #1ee9c4;
  position: relative;
  animation: rotateContainer 30s linear infinite; /* 顺时针旋转容器 */
}

@keyframes rotateContainer {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.box {
  position: absolute;
  width: 40px;
  height: 40px;
  /* 逆时针旋转每个小圆点 */
  animation: rotateCircle 30s linear infinite;
  @include ver-center;
  &-circle {
    @include ver-center;
    .avatar{
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
    }
    &-name{
      margin-top: 4rpx;
      @include text-custom(500, 16rpx, #ffffff);
      @include text-overflow-line(1);
      width: 60rpx;
      text-align: center;
    }
  }
  &-unCircle {
    @include ver-center;
    &-border{
      width: 24rpx;
      height: 24rpx;
      background: #d5aa86;
      border-radius: 50%;
    }
    &-name{
      margin-top: 4rpx;
      @include text-custom(500, 12rpx, #ffffff);
      @include text-overflow-line(1);
      width: 60rpx;
      text-align: center;
    }
  }
}

@keyframes rotateCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


</style>