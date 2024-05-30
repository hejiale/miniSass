<template>
    <div>
      <button
        class="setting-button"
        @click="addPhotoAlbum"
        v-if="showAlbum"
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
      posterImg: {
        type: String,
        default: "",
      }
    },
    data() {
      return {
        showSetting: null,
        showAlbum: false,
      };
    },
    methods: {
      onGoSetting() {
        let vm = this;
  
        if (!uni.getStorageSync("requestPrivacyAuth")) {
          wx.requirePrivacyAuthorize({
            success: async () => {
              uni.setStorageSync("requestPrivacyAuth", true);
              vm.showAlbum = true;
            },
          });
        } else {
          vm.addPhotoAlbum();
        }
      },
      //跳转相册 
      addPhotoAlbum() {
        let vm = this;
  
        wx.saveImageToPhotosAlbum({
          filePath: this.posterImg,
          success() {   
            wx.showToast({ title: "图片保存成功" });  
          },
          fail(e) {
            wx.getSetting({
              success: (res) => {
                if (
                  res.authSetting["scope.writePhotosAlbum"] != undefined &&
                  res.authSetting["scope.writePhotosAlbum"] === true
                ) {
                 
                } else {
                  wx.showModal({
                    title: "提示",
                    content: "请再次点击前去设置页面开启授权",
                    confirmText: "返回",
                    showCancel: false,
                  });
                  vm.showAlbum = false;
                  vm.showSetting = true;
                }
              },
            });
          },
        });
      },
      onReloadSetting(e) {
        if (e.detail.authSetting["scope.writePhotosAlbum"]) {
          this.showSetting = false;
          this.showAlbum = true;
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