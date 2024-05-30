<template>
  <web-view :src="url" bindmessage="getMessage"></web-view>
</template>
<script>
import CONF from "@/config";
export default {
  data() {
    return {
      url: null,
      id: null,
    }
  },
  onLoad(options) {
    this.id = options.id;

    wx.showShareMenu({
      menus: ['shareAppMessage']
    })
    this.url = `${CONF.baseURL}/minih5/#/activityPage?id=${options.id}`
  },
  onShareAppMessage() {
    return {
      title: '',
      path: `/webview/pages/index?id=${this.id}`
    };
  },
}
</script>