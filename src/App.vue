<script>
import "./components/index";
export default {
  onLoad: function (options) {
    console.log(options);
  },
  onLaunch(){
    //预存储默认坐标
    if(!uni.getStorageSync("currentLongitude") || !uni.getStorageSync("currentLatitude")){
      uni.setStorageSync('currentLongitude', 120.63132)
      uni.setStorageSync('currentLatitude', 31.30227)
    }
    //预存储城市信息
    if(!uni.getStorageSync('cityInfo')){
      uni.setStorageSync('cityInfo', {cityId: 320500, city: '苏州市'});
    }
    
    uni.setStorageSync('onLanuch', true)
    this.autoUpdate();

    wx.getLocalIPAddress({
      success: (res) => {
        uni.setStorageSync('localip', res.localip);
      },
      fail(err) {
        uni.showModal({
          title: "提示",
          content: "未开启微信定位权限",
        });
      },
    });
  },
  onShow: function (options) {
    console.log("App Show", options.query, options.path);
  },
  onHide: function () {
    uni.setStorageSync("appHide", true);
    console.log("App Hide");
  },
  methods: {
    autoUpdate: function () {
      var self = this;

      // 获取小程序更新机制兼容
      if (wx.canIUse("getUpdateManager")) {
        const updateManager = wx.getUpdateManager();

        //1. 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            //检测到新版本，需要更新，给出提示
            wx.showModal({
              title: "更新提示",
              content: "检测到新版本，是否下载新版本并重启小程序？",
              success: function (res) {
                if (res.confirm) {
                  //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                  self.downLoadAndUpdate(updateManager);
                } else if (res.cancel) {
                  //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: "温馨提示",
                    content:
                      "本次版本更新涉及到新的功能添加，旧版本可能无法正常访问哦",
                    showCancel: false, //隐藏取消按钮
                    confirmText: "确定更新", //只保留确定更新按钮
                    success: function (res) {
                      if (res.confirm) {
                        //下载新版本，并重新应用
                        self.downLoadAndUpdate(updateManager);
                      }
                    },
                  });
                }
              },
            });
          }
        });
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        });
      }
    },

    /**
 
   * 下载小程序新版本并重启应用
 
   */
    downLoadAndUpdate: function (updateManager) {
      var self = this;

      wx.showLoading();
      //静默下载更新小程序新版本
      updateManager.onUpdateReady(function () {
        wx.hideLoading();
        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate();
      });
      updateManager.onUpdateFailed(function () {
        wx.hideLoading();
        // 新的版本下载失败
        wx.showModal({
          title: "已经有新版本了哟",
          content: "新版本已经上线啦，请您删除当前小程序，重新搜索打开哟",
        });
      });
    },
  },
};
</script>
<style lang="scss">
@import "wxcomponents/vant/common/index.wxss";
@import "assets/style/index.scss";
@import url("@/static/fonts/iconfont.css");
/*每个页面公共css */
</style>
