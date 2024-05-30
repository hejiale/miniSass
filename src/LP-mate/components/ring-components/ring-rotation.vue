<template>
  <div class="container">
    <div class="box" v-for="index in 12" :key="index" :style="{ top: circleTop(index), left: circleLeft(index) }">
    </div>
  </div>
</template>
<script lang="js">
export default {
  data(){
    return {
      url: 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230625/005ab140-22b6-4470-9fbf-a45afc031fc0/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230625143537.jpg',
      angleInterval: (2 * Math.PI) / 12 //计算每个小圆点在圆周上的角度
    }
  },
  computed:{
    // 根据索引计算每个小圆点的 top 值
    circleTop(){
      return function(index){
        const radius = 272; // 圆的半径
        const angle = index * this.angleInterval;
        //微调 中间数值改变位置
        return `calc(50% - 20rpx - ${radius * Math.sin(angle)}rpx)`;
      }
    },
    // 根据索引计算每个小圆点的 left 值
    circleLeft(){
      return function(index){
        const radius = 272; // 圆的半径
        const angle = index * this.angleInterval;
        //微调 中间数值改变位置
        return `calc(50% - 45rpx + ${radius * Math.cos(angle)}rpx)`;
      }
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  height: 544rpx;
  width: 544rpx;
  border-radius: 50%;
  //background: #1ee9c4;
  position: relative;
  animation: rotateContainer 20s linear infinite; /* 顺时针旋转容器 */
}

@keyframes rotateContainer {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.box {
  position: absolute;
  width: 40px;
  height: 40px;
  /* 逆时针旋转每个小圆点 */
  animation: rotateCircle 20s linear infinite;
  @include ver-center;
}

@keyframes rotateCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}


</style>