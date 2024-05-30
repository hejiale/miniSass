<template>
  <view>
    <div class="fixedBg"></div>
    <van-cell-group>
      <van-cell is-link custom-class="personal-avatar_cell">
        <template #title>
          <span class="cell-label_left">头像</span>
        </template>
        <img :src="userInfor.avatar" class="photo-image" mode="aspectFill" />
        <button
          open-type="chooseAvatar"
          @chooseavatar="chooseavatar"
          class="personal-avatar_cell-button"
        ></button>
      </van-cell>
      <van-cell
        is-link
        link-type="navigateTo"
        :url="url0"
        custom-class="custom-content_cell"
        value-class="cell-label_right"
      >
        <template #title>
          <span class="cell-label_left">昵称</span>
        </template>
        {{ userInfor.nickName || '' }}
      </van-cell>
      <van-cell
        is-link
        @click="phoneBn()"
        custom-class="custom-content_cell"
        value-class="cell-label_right"
      >
        <template #title>
          <span class="cell-label_left">手机号</span>
        </template>
        {{ userInfor.phone ? userInfor.phone : "请输入手机号" }}
      </van-cell>
      <van-cell
        is-link
        link-type="navigateTo"
        :url="url2"
        custom-class="custom-content_cell"
        value-class="cell-label_right"
      >
        <template #title>
          <span class="cell-label_left">性别</span>
        </template>
        {{ $enums.Sex.getName(userInfor.sex) }}
      </van-cell>
      <van-cell
        is-link
        custom-class="custom-content_cell"
        value-class="cell-label_right"
        @click="onUploadBg"
      >
        <template #title>
          <span class="cell-label_left">个人主页背景</span>
        </template>
        <img :src="userInfor.personalBackground" class="photo-image" mode="aspectFill" />
      </van-cell>
    </van-cell-group>
    <BindPhone
      @on-success-authorize="onSuccessAuthorize"
      v-if="!userInfor.phone"
    ></BindPhone>
  </view>
</template>
<script>
const detail = {
  phone: "" /*手机号*/,
  nickName: "" /*昵称*/,
  avatar: "" /*头像*/,
  sex: "" /*性别：MALE|FEMAL*/,
  wxNumber: "" /*微信号*/,
  dataSource: "MP" /*数据来源：M*/,
  personalBackground: ''
};
import { uploadFile } from "@/utils";
import BindPhone from "../../components/bindPhone/index.vue";
export default {
  components: {
    BindPhone,
  },
  data() {
    const vm = this;
    return {
      userInfor: vm.$_.clone(detail),
      url0: null,
      url1: null,
      url2: null,
      url3: null,
      customNav: {
        bgHeight: " ",
        navTitle: "个人信息",
        color: "#000",
        weight: 700,
        customizeTitle: true,
        hideBg: true,
      },
    };
  },
  async mounted() {},
  onShow() {
    this.init();
  },
  methods: {
    async Userinfo(needRefresh) {
      let data = await this.$checkLogin.getUserInfo(needRefresh);
      this.userInfor = data;
    },
    phoneBn() {
      if (this.userInfor && this.userInfor.phone) {
        uni.showToast({
          title: "你已经绑定手机号了",
          icon: "none",
        });
      }
    },
    //授权成功后，重新获取用户信息
    onSuccessAuthorize() {
      this.Userinfo(true);
    },
    async init() {
      let data = await this.$checkLogin.getUserInfo(true);
      this.userInfor = data;
      this.url0 = `./edit-user?title=nickName`;
      this.url1 = `./edit-user?title=phone`;
      this.url2 = `./edit-user?title=sex&enumtype=Sex`;
      this.url3 = `/joyoBureau-package/pages/editInfo`;
    },
    chooseavatar(e) {
      const vm = this;

      uploadFile(e.detail.avatarUrl).then(async e=>{
        vm.userInfor.avatar = e;

        if (!vm.userInfor.wxNumber) {
          vm.userInfor.wxNumber = "暂无";
        }
        await vm.$api.updateUserWxMessage({
          id: vm.userInfor.id,
          ...vm.userInfor,
        });
        vm.init();
      })
    },
    onUploadBg(){
      const vm = this;

      uni.chooseImage({
        count: 1,
        success: async (res) => {
          vm.onUploadFile(res.tempFilePaths[0]);
        },
      });
    },
    //普通上传
    onUploadFile(url) {
      const vm = this;
      uni.showLoading({ title: "上传中" });

      uploadFile(url).then(async e=>{
        vm.userInfor.personalBackground = e;

        await vm.$api.updateUserWxMessage({
          id: vm.userInfor.id,
          ...vm.userInfor,
        });

        wx.hideLoading();

        vm.init();
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.photo-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 80rpx;
}
.cell-label_left {
  color: rgba(54.19, 52.38, 52.38, 1);
}
.cell-label_right {
  color: rgba(54.19, 52.38, 52.38, 1) !important;
  font-size: 28rpx;
  font-weight: 600;
  text-align: right;
  line-height: 40rpx;
}
.cell-label_rightHolder {
  color: #999;
  font-size: 28rpx;
  font-weight: 600;
  text-align: right;
  line-height: 40rpx;
}
.personal-avatar_cell {
  height: 128rpx;
  position: relative;
  &-button {
    @include abscenter;
    background: unset !important;
  }
  button:after {
    border: none !important;
  }
}
.van-cell {
  border: 0 solid #fff !important;
}
/deep/.van-cell {
  .van-icon {
    color: #000;
  }
}
.van-cell:after {
  border: 0 solid #fff !important;
}
.custom-content_cell {
  background: #fff !important;
}
/deep/.van-cell__value {
  @include text-overflow-line(1);
  font-size: 28rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
</style>
