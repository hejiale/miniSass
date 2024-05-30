<template>
  <div class="albumBox">
    <div class="albumBox-titleBox">
      <span class="albumBox-titleBox-title">我的相册</span>
      <span class="albumBox-titleBox-subTitle">长按拖动排序，点击预览或删除</span>
    </div>
    <drag-sorts
      :img_list="albumUrls"
      @add="addImage"
      :width="654"
      :viewWidth="206"
      :viewHeight="206"
      class="drag-sort-box"
      :allowDrag="allowDrag"
      imgMode="aspectFill"
      img_key="path"
      :showLast="true"
      @clickItem="clickItem"
      @sortChange="sortChange"
    >
    </drag-sorts>
    <div class="footer" @click="onNext">下一步</div>
    <van-action-sheet
      :show="showAction"
      :actions="actions"
      cancel-text="返回"
      @select="onActionSheet"
      @click-overlay="showAction = false"
      @cancel="showAction = false"
    />
  </div>
</template>
<script>
import dragSorts from "./miy-drag-sorts/drag-sorts.vue";
import { uploadFile } from "@/utils";
export default {
  components: {
    dragSorts,
  },
  props:{
    value:{
      type: Array,
      default: []
    }
  },
  data() {
    return {
      allowDrag: true,
      showAction: false,
      actions: [{ name: "预览" }, { name: "删除", color: "#ee0a24" }],
      currentImg: null,
      albumUrls: []
    };
  },
  watch:{
    value: {
      handler(newName, oldName) {
        if(newName){
          this.albumUrls = [];
          newName.map(v=>{
            this.albumUrls.push({path: v});
          })
        }
      },
      immediate: true,
    }
  },
  methods: {
    addImage() {
      let vm = this;
      uni.chooseMedia({
        count: 20,
        mediaType: ["image"],
        success: function (res) {
          uni.showLoading("上传中...");

          let promiseArr = [];
          for (let i = 0; i < res.tempFiles.length; i++) {
            promiseArr.push(vm.onUploadFile(res.tempFiles[i].tempFilePath));
          }
          Promise.all(promiseArr).then((_) => {
            uni.hideLoading();
            vm.$emit('on-upload', vm.albumUrls.map(v=>v.path))
          });
        },
      });
    },
    onUploadFile(url) {
      return new Promise((resolve) => {
        uploadFile(url).then((e) => {
          this.albumUrls.unshift({path: e});
          resolve();
        });
      });
    },
    clickItem(e, index) {
      this.currentImg = index;
      this.showAction = true;
    },
    onActionSheet(e) {
      if (e.detail.name === "预览") {
        uni.previewImage({
          urls: [this.albumUrls[this.currentImg].path],
          longPressActions: {
            itemList: ["发送给朋友", "保存图片", "收藏"],
            success: function (data) {},
            fail: function (err) {},
          },
        });
      } else {
        this.albumUrls.splice(this.currentImg, 1);
        this.$emit('on-upload', this.albumUrls.map(v=>v.path))
      }
      this.showAction = false;
    },
    sortChange(arr) {
      wx.showLoading();

      arr.sort(function (a, b) {
        return a.order_num - b.order_num;
      });
      this.$emit('on-upload', arr.map(v=>v.path))
    },
    onNext(){
      console.log(this.albumUrls);
      this.$emit('on-next')
    }
  },
};
</script>
<style lang="scss" scoped>
.albumBox {
  @include fiexcenter;
  @include ver;
  align-items: center;;
  &-titleBox {
    @include ver;
    align-items: center;
    padding-bottom: 140rpx;
    margin-top: 124rpx;
    &-title {
      font-size: 40rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 56rpx;
    }
    &-subTitle {
      margin-top: 4rpx;
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #959aa5;
      line-height: 28rpx;
    }
  }
}
.footer {
  position: fixed;
  right: 40rpx;
  bottom: 92rpx;
  width: 134rpx;
  height: 80rpx;
  background: #ff5485;
  border-radius: 8px;
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  @include hor-center-center;
}
</style>