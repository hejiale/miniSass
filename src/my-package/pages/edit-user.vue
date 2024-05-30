<template>
  <view>
    <div class="fixedBg"></div>
    <edit-infor
      @backRoute="backRoute"
      :value.sync="value"
      :label="label"
      :type="type"
      @save="save"
      :maxLength="title == 'nickName' ? 7: null"
    ></edit-infor>
  </view>
</template>

<script>
import editInfor from "../components/edit-infor";
export default {
  components: {
    editInfor,
  },
  data() {
    return {
      value: "2",
      label: "标题",
      type: "",
      title: "",
      userInfor: null,
    };
  },
  async onLoad(options) {
    this.userInfor = await this.$checkLogin.getUserInfo();;
    this.value = this.userInfor[options.title];
    this.type = options.enumtype;
    this.label = this.switchLable(options.title);
    this.title = options.title;
    
  },
  methods: {
    async backRoute() {
      uni.navigateBack();
    },
    async save() {
      if (!this.value) {
        uni.showToast({
          title: "请填写数据",
          icon: "none",
        });
        return;
      }
      this.userInfor[this.title] = this.value;
      if (!this.userInfor.wxNumber) {
        this.userInfor.wxNumber = "暂无";
      }
      await this.$api.updateUserWxMessage({
        id: this.userInfor.id,
        ...this.userInfor,
      });
      uni.navigateBack();
    },
    switchLable(title) {
      switch (title) {
        case "nickName":
          return "昵称";
        case "phone":
          return "手机号";
        case "sex":
          return "性别";
        case "wxNumber":
          return "微信号";
        default:
          return "标题";
      }
    },
    onChange(event) {},
  },
};
</script>

<style>
</style>