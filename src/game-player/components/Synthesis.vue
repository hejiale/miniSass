<template>
  <div class="synthesis" v-if="showSynthesis">
    <template v-if="type === 'init'">
      <view class="synthesis__box">
        <view class="content">
          <div class="title">{{ dataSource.title }}</div>
          <div class="text" v-html="dataSource.content"></div>
          <!-- <div class="text">
	           {{dataSource.content}}
					</div> -->
          <div class="bottom">
            <div class="btn" @click="handleStart">开始</div>
          </div>
        </view>
      </view>
    </template>
    <template v-else-if="type === 'next'">
      <view class="synthesis__box">
        <view class="content">
           <template >
            <image :src="dataSource.processUrl" mode="widthFix" class="nextImg"/>
          </template>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="synthesis__box">
        <view class="content">
          <template v-if="dataSource.flag == '1'">
            <div class="title">{{ dataSource.successContent }}</div>
            <image :src="dataSource.successUrl" mode="widthFix" />
          </template>
          <template v-else>
            <div class="title">{{ dataSource.failContent }}</div>
            <image :src="dataSource.failUrl" mode="widthFix" />
          </template>
          <div class="bottom1">
            <span @click="handleClose">关闭</span>
          </div>
        </view>
      </view>
    </template>

    <!-- <van-icon class="close" name="cross" color="#CCBC91" @click="close"/> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import service from "@/services/game.js";

export default {
  props: {
    dataSource: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      showSynthesis: false,
      type: "init",
    };
  },
  components: {},
  computed: {
    ...mapState("player", ["userInfo", "options"]),
  },
  watch: {},
  created() {},
  methods: {
    close() {
      this.showSynthesis = false;
    },
    open() {
      this.showSynthesis = true;
    },
    async handleStart() {
      await service.rollClick({
        murderMysteryOnlineRecordId: Number(this.options.id),
        userId: this.userInfo.id,
        rollId: this.dataSource.id,
      });
      this.type = "next"; 
      setTimeout(()=>{
        this.type = "finish"; 
      }, 2000)
    },
    handleClose() {
      this.$emit("handleClose");
      this.showSynthesis = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.synthesis {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  opacity: 0.8;
  z-index: 4;
  .close {
    position: fixed;
    right: 120px;
    top: 10px;
  }
  &__box {
    width: 100%;
    height: 100%;
    display: flex;
    .content {
      width: 47vw;
      margin: 0 auto;
      text-align: center;
      image {
        width: 114px;
      }
    }
    .title {
      margin-top: 16vh;
      font-family: "Source Han Serif CN";
      font-style: normal;
      font-weight: 900;
      font-size: 15px;
      color: #ccbc91;
      width: 100%;
      text-align: center;
    }
    .text {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
     	color: rgba(255, 255, 255, 0.8);
      height: 53vh;
      margin-top: 9px;
      overflow: scroll;
    }

    .bottom {
      width: 100%;
      text-align: center;
      .btn {
        margin-top: 37px;
        display: inline-block;
        padding: 4px 25px;
        font-family: "Source Han Serif CN";
        font-style: normal;
        font-weight: 900;
        font-size: 13px;
        color: rgba(204, 188, 145, 0.9);
        background: linear-gradient(
          180deg,
          rgba(204, 188, 145, 0) 0%,
          rgba(204, 188, 145, 0.2) 100%
        );
        border: 1px solid rgba(204, 188, 145, 0.4);
      }
    }
    .bottom1 {
      width: 100%;
      text-align: center;
      font-family: "Source Han Serif CN";
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      span {
        margin-top: 37px;
        display: inline-block;
        padding: 4px 25px;
      }
    }
  }
}

.nextImg {
  width: 40vw!important;
  height: 240px;
  top: 50%;
  left: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
}
</style>
