<template>
  <div>
    <dynamicState :userId="userId" ref="dynamicState" @shareDynamic="onGetShareDynamic"/>
  </div>
</template>
<script>
import dynamicState from '../../components/dynamicState.vue';
export default {
  components:{
    dynamicState
  },
  data(){
    return {
      userId: null,
      shareDynamic: null
    }
  },
  onLoad(options){
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.userId = options.userId;
  },
  onShow(){
    if (uni.getStorageSync("isPrview")) {
      setTimeout(() => {
        uni.removeStorageSync("isPrview");
      }, 200);
      return;
    }
    this.$nextTick(_=>{
      this.$refs['dynamicState'].queryDynamicWithDramaPage();
    })
  },
  onReachBottom() {
    this.$refs['dynamicState'].loadMore();
  },
  onShareAppMessage(event) {
    if(event.from === 'button'){
      return {
        title: $filters.truncateText(this.shareDynamic.content, 50),
        path: `/dynamicDetail/pages/index?id=${this.shareDynamic.id}`,
        imageUrl: this.shareDynamic.fileList.length > 0 ? this.shareDynamic.fileList[0] : this.$iconFont.getIconName('juyou-share-default')
      };
    }
  },
  methods:{
    onGetShareDynamic(e){
      this.shareDynamic = e;
    }
  }
}
</script>
<style lang="scss" scoped>

</style>