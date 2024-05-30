<template>
  <div class="matchResultBox">
    <div
      class="matchResultBox-item"
      v-for="user in matchUserList"
      :key="user.id"
      @click="onGoUser(user.userId)"
    >
      <image
        :src="$iconFont.getIconName('match-result-bg')"
        class="matchResultBox-item-bg"
      ></image>
      <image :src="$filters.filterBlur(user.avatar)" class="matchResultBox-item-avatar" mode="aspectFill"></image>
      <span class="matchResultBox-item-name">{{ infos(user)[0].text }}</span>
      <div class="matchResultBox-item-tags">
        <span class="matchResultBox-item-tags-tag" v-for="tag in slice(infos(user))" :key="tag">{{ tag.text }}</span>
      </div>
    </div>
    <span class="matchResultBox-title" v-if="matchUserList.length">每轮匹配，仅可选择一位进行互动哦</span>
    <image :src="$iconFont.getIconName('none-match')" class="matchResultBox-noneImg" @click="onGoFilter" v-if="endLoad && !matchUserList.length"></image>
    <image
      src="../static/image/icon-close.png"
      class="matchResultBox-close"
      @click="onClose"
    ></image>
  </div>
</template>
<script>
import service from "../utils/service";
export default {
  props: {
    lpUserId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      matchUserList: [],
      endLoad: false
    };
  },
  computed: {
    infos() {
      return function (user) {
        let count = 1;
        let infos = [{index: 1, text: user.name}];

        if (user.height) {
          count++;
          infos.push({index: 2, text: `${user.height}cm`});
        } else {
          infos.push({index: 2, text: "????"});
        }
        if (user.weight) {
          count++;
          infos.push({index: 3, text: `${user.weight}kg`});
        } else {
          infos.push({index: 3, text: "????"});
        }
        if (user.age) {
          count++;
          infos.push({index: 4, text: `${user.age}岁`});
        } else {
          infos.push({index: 4, text: "????"});
        }
        //常住地
        infos.push({index: 5, text: "????"});
        count++;

        if (user.permanentResidenceType === 'OVERSEAS' && user.permanentResidenceOverSeas) {
          infos[4] = {index: 5, text: user.permanentResidenceOverSeas};
        }
        if (user.permanentResidenceType === 'DOMESTIC' && user.permanentResidenceProvince) {
          infos[4] = {index: 5, text: `${user.permanentResidenceProvince}${user.permanentResidenceCity}`};
        }
        //职业
        if (user.occupation) {
          count++;
          infos.push({index: 6, text: user.occupation});
        } else {
          infos.push({index: 6, text: "????"});
        }

        //随机两条???
        if (count > 2) {
            let arr = infos.filter((v) => v.text !== '????');
            let randomIndexs = this.getRandomNumbers(arr.length, 2);
            arr.map((v, idx)=>{
                if(idx !== randomIndexs[0] && idx !== randomIndexs[1]){
                    v.text = '????'
                }
            })
        }
        return infos;
      };
    },
    slice(){
        return function(arr){
            return arr.slice(1, 6);
        }
    }
  },
  methods: {
    onClose(){
      this.endLoad = false;
      this.matchUserList = [];
      this.$emit('hide');
    },
    async reload() {
      this.endLoad = false;
      
      this.matchUserList = await service.startlpUserMatch({
        id: this.lpUserId,
      });
      this.endLoad = true;
      this.$emit('refreshTime');
    },
    onGoFilter(){
      this.$emit('goFilter');
    },
    onGoUser(id) {
      this.endLoad = false;
      uni.navigateTo({ url: `/LP-mate/pages/infomation?userId=${id}&useSelf=${this.lpUserId}`});
      this.$emit('hide');
      this.matchUserList = [];
    },
    getRandomNumbers(totalNumbers, numberOfRandoms) {
        const numbers = [1, 2, 3, 4, 5]; // 假设这是你的5个数字
        const randomNumbers = [];
        let index;
        
        // 确保不会选取超出数字范围的随机数
        const max = totalNumbers - 1;
        
        // 循环选取随机数直到达到需要的数量
        while (randomNumbers.length < numberOfRandoms) {
            index = Math.floor(Math.random() * max); // 生成一个随机索引
            if (randomNumbers.indexOf(numbers[index]) === -1) {
            randomNumbers.push(numbers[index]); // 确保不会选取重复的数字
            }
        }
        
        return randomNumbers;
    },
}
};
</script>
<style lang="scss" scoped>
.matchResultBox {
  @include ver;
  align-items: center;
  &-item {
    position: relative;
    width: 668rpx;
    height: 264rpx;
    margin-bottom: 36rpx;
    &-bg {
      @include abscenter;
    }
    &-avatar {
      position: absolute;
      left: 24rpx;
      top: 24rpx;
      width: 162rpx;
      height: 216rpx;
      border-radius: 24rpx;
    }
    &-name{
        position: absolute;
        left: 210rpx;
        top: 36rpx;
        font-weight: 500;
        font-size: 36rpx;
        color: #111111;
        line-height: 42rpx;
    }
    &-tags{
        position: absolute;
        left: 210rpx;
        top: 106rpx;
        right: 100rpx;
        &-tag{
            display: inline-block;
            font-weight: 500;
            font-size: 26rpx;
            color: #5F6572;
            line-height: 30rpx;
            margin-right: 36rpx;
            margin-bottom: 10rpx;
        }
    }
  }
  &-title {
    margin-top: 36rpx;
    font-weight: 500;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
    line-height: 30rpx;
    text-align: center;
  }
  &-noneImg{
    width: 508rpx;
    height: 510rpx;
  }
  &-close {
    margin-top: 56rpx;
    width: 60rpx;
    height: 60rpx;
    padding: 40rpx;
  }
}
</style>