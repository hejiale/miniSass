<template>
  <div>
    <van-tabbar active-color="#1A1A1A " inactive-color="#ccc" :active="active">
      <van-tabbar-item
        v-for="(tab, index) in tabBars"
        :key="index"
        @click.native="onChangeTab(index)"
      >
        <image
          slot="icon"
          :src="tab.iconPath"
          mode="aspectFit"
          style="width: 24px; height: 24px"
        />
        <image
          slot="icon-active"
          :src="tab.selectedIconPath"
          mode="aspectFit"
          style="width: 24px; height: 24px"
        />
        {{ tab.text }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import vanTabbar from "@/wxcomponents/vant/tabbar/index";
import vanTabbarItem from "@/wxcomponents/vant/tabbar-item/index";
export default {
  components: { vanTabbar, vanTabbarItem },
  props: {
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tabBars: [
        {
          text: "首页",
          iconPath: "/static/image/tab/homePage.png",
          selectedIconPath: "/static/image/tab/sel-homePage.png",
          pagePath: "/pages/index/index",
        },
        {
          text: "我的",
          iconPath: "/static/image/tab/myUser.png",
          selectedIconPath: "/static/image/tab/sel-myUser.png",
          pagePath: "/pages/my/index",
        },
      ],
    };
  },
  methods: {
    onChangeTab(index) {
      let path = this.tabBars[index].pagePath;
      wx.switchTab({
        url: path,
      });
    },
  },
};
</script>
<style>
.van-tabbar-item {
  font-size: 10px;
  font-family: PingFang SC-Semibold, PingFang SC;
  font-weight: 600;
  line-height: 14px;
}
</style>
