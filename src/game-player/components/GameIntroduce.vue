<template>
   <view class="introduce">
     <div class="introduce__body">
        <div class="empty"></div>
        <image :src="dramaItem.logoUrl" mode="widthFix" class="introduce__left"/>
        <div class="empty"></div>
        <div class="introduce__content">
          <view class="titleImg">
            <image src="../static/introTitle.png" mode="widthFix" />
          </view>
          <GMTitleLine />
          <div class="textWord">
            <!-- <div class="mask"></div> -->
            <div class="text">
              <div class="text-content" v-html="dramaItem.content"></div>
            </div>
          </div>  
        </div>
        <div class="empty"></div>
      </div>
      <div class="introduce__bottom" v-if="userInfo.phone">
          <div class="user">
             <image :src="userInfo.avatar"  />
             <span>{{userInfo.nickName}}</span>
          </div>
          <image src="../static/waitLine.png" class="waitLine" mode="widthFix"/>
            <view class="waitOption">
              <div>
               <image src="../static/waitOption.png" mode="widthFix"/>
               <!-- <span>...</span> -->
              </div>
            </view>
          <image src="../static/waitLine.png" class="waitLine" mode="widthFix"/>  
      </div>
      <div class="introduce__newBottom" v-else>
        <image src="../static/newUser.png" class="newUser" mode="widthFix"/>
        <div >点击任意地方授权登录即可参与剧本杀</div>
      </div>
   </view>
</template>

<script>
import { mapState } from 'vuex'
import GMTitleLine from './components/GMTitleLine.vue'
export default {
  name: "GameIntroduce",
  props: {},
  data() {
    return {}
  },
  components: {
    GMTitleLine
  },
  computed: {
    ...mapState('player',['dramaItem','userInfo']),
  },
  methods: {},
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {},
}
</script>

<style lang="scss"  scoped>
.introduce {
  width: 100vw;
  /* height: 100vh; */
  &__body {
    width: 100%;
    height: 66vh;
    display: flex;
    /* padding-top: 11vh; */
  }
  &__left {
    width: 200px;
    vertical-align: middle;
    padding-top: 20vh;
    
  }
  .empty {
    width: 100px;
  }
  &__content {
    width: calc(100vw - 500px);
    display: flex;
    flex-direction: column;
    text-align: center;
    max-height: 52vh;
    vertical-align: middle;
    position: relative;
    .titleImg {
      width: 7.7vw;
      margin: 0 auto;
      image {
        width: 100%;
        vertical-align: bottom;
      }
    }
  }
  .textWord {
    position: relative;
    .mask {
        position: absolute;
        height: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: 20px 15px 20px -20px #1b1b16, -20px 15px 20px -20px #1b1b16;
        background: linear-gradient(rgba(42, 42, 28, 0), rgba(42, 42, 28, 1));
     }
    .text {
      max-height: 48.5vh;
      overflow-y: scroll;
      overflow: -moz-scrollbars-none;
      text-align: left;
      .text-content {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 18px;
        color: #FFFFFF;
      }
    
    }
  }  
  &__bottom {
    box-sizing:border-box;
    width: 100vw;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 4vh;
    left: 0;
    right: 0;
    .user {
      position: fixed;
      bottom:4vh;
      right: 0;
      left: 20px;
        display: flex;
        align-items: center;
        image {
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }
        span {
          font-family: 'PingFang SC';
          font-weight: 400;
          font-size: 15px;
          color: rgba(255, 255, 255, 1);
          margin-left: 10px;
        }
      }
    .waitLine {
      width: 100%;
    }
    .waitOption {
      width: 100%;
      text-align: center;
      background: linear-gradient(89.98deg, rgba(46, 42, 28, 0) 0.01%, #2E2A1C 31.89%, #2E2A1C 67.43%, rgba(46, 42, 28, 0) 100.35%);
      opacity: 0.8; 
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 80px;
        vertical-align: middle;
      }
      span {
        color: #fff;
        vertical-align: middle;
      }
    }
    
  }
  &__newBottom {
    text-align: center;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 15px;
    color: rgba(255, 255, 255, 0.6);
    width: 100%;
    position: fixed;
    bottom: 5vh;
    left: 0;
    right: 0;
    .newUser {
      width: 148px;
    }
  }
}
</style>