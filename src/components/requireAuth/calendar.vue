<template>
  <div>
    <button
      class="setting-button"
      @click="addPhoneCalendar"
      v-if="showCalendar"
    ></button>
    <button
      open-type="openSetting"
      @opensetting="onReloadSetting"
      class="setting-button"
      v-else-if="showSetting"
    ></button>
    <button class="setting-button" @click="onGoSetting" v-else></button>
  </div>
</template>
<script>
export default {
  props: {
    calendarTitle: {
      type: String,
      default: "",
    },
    calendarDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showSetting: null,
      showCalendar: false,
    };
  },
  methods: {
    onGoSetting() {
      let vm = this;

      if (!uni.getStorageSync("requestPrivacyAuth")) {
        wx.requirePrivacyAuthorize({
          success: async () => {
            uni.setStorageSync("requestPrivacyAuth", true);
            vm.showCalendar = true;
          },
        });
      } else {
        vm.addPhoneCalendar();
      }
    },
    //跳转日历
    addPhoneCalendar() {
      let vm = this;

      wx.addPhoneCalendar({
        title: this.calendarTitle,
        startTime:
          new Date(this.calendarDate.replace(/-/g, "/")).getTime() / 1000,
        success() {
          wx.showToast({
            title: "添加日历成功!",
          });
        },
        fail(e) {
          wx.getSetting({
            success: (res) => {
              if (
                res.authSetting["scope.addPhoneCalendar"] != undefined &&
                res.authSetting["scope.addPhoneCalendar"] === true
              ) {
                wx.showToast({
                  icon: "none",
                  title: "添加日历失败",
                });
              } else {
                wx.showModal({
                  title: "提示",
                  content: "请再次点击前去设置页面开启授权",
                  confirmText: "返回",
                  showCancel: false,
                });
                vm.showCalendar = false;
                vm.showSetting = true;
              }
            },
          });
        },
      });
    },
    onReloadSetting(e) {
      if (e.detail.authSetting["scope.addPhoneCalendar"]) {
        this.showSetting = false;
        this.showCalendar = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.setting-button {
  @include abscenter;
  background: unset !important;
}
button::after {
  border: unset !important;
}
</style>