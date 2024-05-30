<template>
  <view>
    <div class="fixedBg"></div>
    <div class="group">
      <van-field
        :value="message"
        type="textarea"
        placeholder="请输入个人描述"
        autosize
        :border="false"
        @blur="onBlur"
        :maxlength="50"
        show-word-limit
      />
    </div>
    <view class="bottomView" @click="save">保存</view>
  </view>
</template>

<script>
import service from '../utils/service';
export default {
  components: {
  },
  data() {
    return {
      message: "",
      userInfor: null,
    };
  },
  async onLoad() {
    this.userInfor = await this.$checkLogin.getUserInfo();
    this.message = this.userInfor.personSign
  },
  methods: {
    async backRoute() {
      uni.navigateBack();
    },
    onBlur(event){
        this.message = event.detail.value;
    },
    async save() {
        try{
            await service.saveAppUserEditInfo({
                id: this.userInfor.id,
                personSign: this.message
            })
            uni.navigateBack();
        }catch(e){}
    }
  },
};
</script>
<style lang="scss" scoped>
.group{
    background: #fff;
    padding-bottom: 20px;
    width: 100vw;
}
.bottomView {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  bottom: 70rpx;
  height: 90rpx;
  width: 80vw;
  font-size: 24rpx;
  position: fixed;
  left: 10vw;
  color: #fff;
  font-size: 26rpx;
  background: #14C9C9;
  border-radius: 45rpx;
}
</style>