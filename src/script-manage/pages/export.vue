<template>
  <view class="container">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('bg-personnel')" mode="widthFix" />
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000"
            size="50rpx"
          />
          <van-search
            v-model="searchValue"
            shape="round"
            placeholder="搜索剧本名称"
            :left-icon="$iconFont.getIconName('icon-search')"
            @search="onSearch"
            @clear="onSearch"
          />
        </view>
      </view>
      <view slot="content">
        <div class="container-filterBox">
          <div class="container-filterBox-numBox">
            <span>共</span>
            <span>{{ total }}</span>
            <span>套剧本</span>
          </div>
          <div
            class="container-filterBox-rightBox"
            @click="isShowFilter = true"
          >
            <image src="../static/image/screen-srp.png" />筛选
          </div>
        </div>
        <modify
          :form="form"
          @on-add="onAddDrama"
          @on-delete="onDeleteDrama"
          @reachBottom="onLoadMore"
        />
        <notc-data top="20vh" v-if="!form.length"></notc-data>
        <div class="container-noteBox">
          <div class="container-noteBox-text">信息有误、剧本缺失点这里</div>
          <button open-type="contact" class="container-noteBox-button"></button>
        </div>
      </view>
    </navigation-bar>
    <van-popup
      :show="isShowFilter"
      close-on-click-overlay
      @click-overlay="isShowFilter = false"
      custom-style="height: 60%"
      position="bottom"
      round
    >
      <filterBox
        :isAddStatus="true"
        @on-cancel="onCancelFilter"
        @on-change="onChangeFilter"
      />
    </van-popup>
    <van-popup
      :show="isShowNote"
      close-on-click-overlay
      @click-overlay="isShowNote = false"
      custom-style="height: 25%"
      position="bottom"
      round
    >
      <div class="popNoteBox">
        <div class="popNoteBox-title">未设置剧本价格</div>
        <div class="popNoteBox-note">
          您还未设置剧本价格，请完成剧本价格设置后再上架剧本。如不设置剧本价格，导入剧本后价格将会设置为默认价格￥88。
        </div>
        <div class="popNoteBox-bottomBox">
          <div @click="isShowNote = false">取消</div>
          <div @click="onGoSet">去设置</div>
        </div>
      </div>
    </van-popup>
  </view>
</template>
<script>
import modify from "./modify.vue";
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar";
import filterBox from "./filter.vue";
import service from "../utils/service";
export default {
  components: { modify, notcData, filterBox, navigationBar },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: 'fixed'
      },
      pageNo: 1,
      pageSize: 50,
      searchValue: "",
      showPopup: false,
      form: [],
      total: 0,
      isShowFilter: false,
      isShowNote: false,
      searchForm: {},
      storeDramaStandardPriceList: [],
      canSubmit: false
    };
  },
  onLoad() {
    this.init();
  },
  onShow(){
    this.queryPriceList();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onGoSet(){
      this.isShowNote = false;
      wx.navigateTo({
        url: './batch-price'
      })
    },
    onSearch(e) {
      this.searchValue = e.detail;
      this.pageNo = 1;
      this.init();
    },
    //取消筛选
    onCancelFilter() {
      this.isShowFilter = false;
    },
    //筛选
    onChangeFilter(val) {
      let form = {};
      if(val){
        val.map((key) => {
          if(key.list.length){
            if (key.title === "剧本人数") {
              form.minGamer = key.list[0].minGamer;
              form.maxGamer = key.list[0].maxGamer;
            } else if (key.title === "剧本类型") {
              form.sellTypeList = key.list.map(it=>it.dictType);
            } else if (key.title === "剧本题材") {
              form.themeIds = [key.list[0].id];
            } else if (key.title === "添加状态") {
              if (key.list[0].dictValue === "已添加") {
                form.isInStore = true;
              } else {
                form.isInStore = false;
              }
            }   
          }
        });
      }
      
      this.searchForm = form;
      this.isShowFilter = false;
      this.pageNo = 1;
      this.init();
    },
    async onAddDrama(drama) {
      if(this.canSubmit)return;
      this.canSubmit = true;

      let sellPrice;
      if(this.storeDramaStandardPriceList.length){
        this.storeDramaStandardPriceList.map(it=>{
          if(drama.sellType === 'UNDETERMINED'){
            sellPrice = 8800;
          }else{
            if(it.sellType === drama.sellType){
              sellPrice = it.standardPrice;
            }
          }
        })
      }else{
        sellPrice = 8800;
      }
      try {
        await service.storeDramaAdd({
          dramaId: drama.id,
          storeId: uni.getStorageSync("storeId"),
          sellPrice
        });
        this.pageNo = 1;
        await this.init();
        this.canSubmit = false;
      } catch (e) {
        this.canSubmit = false;
      }
    },
    async onDeleteDrama(drama){
      if(this.canSubmit)return;
      this.canSubmit = true;

      try{
        await service.deleteStoreDrama({
          dramaIds: [drama.id],
          storeId: uni.getStorageSync("storeId")
        })
        this.pageNo = 1;
        await this.init();
        this.canSubmit = false;
      }catch(e){
        this.canSubmit = false;
      }
    },
    onLoadMore() {
      if(this.total === this.form.length)return;
      
      this.pageNo++;
      this.init();
    },
    async init() {
      wx.showLoading();
      let data = await service.queryDramaByStore({
        pageNo: this.pageNo /*当前页码*/,
        pageSize: this.pageSize /*分页大小*/,
        dramaName: this.searchValue,
        storeId: uni.getStorageSync("storeId"),
        ...this.searchForm,
      });

      if (this.pageNo == 1) {
        this.form = [];
        this.total = data.total;
      }
      this.form.push(...data.records);
      wx.hideLoading();
    },
    async queryPriceList(){
      try{
        let data = await service.getStoreDramaStandardPrice({
          storeId: uni.getStorageSync("storeId"),
        });
        this.storeDramaStandardPriceList = data.storeDramaStandardPriceList;
        if(!this.storeDramaStandardPriceList.length){
          this.isShowNote = true;
        }
      }catch(e){}
    }
  },
};
</script>
<style lang="scss">
.fixedBg {
  background: #f4f5f6;
  height: 100vh;
}
.topNav {
  display: flex;
  align-items: center;
  /deep/image {
    vertical-align: super !important;
  }
}
/deep/.van-search {
  height: rpx(36);
  padding: unset !important;
  border-radius: 60px;
  margin-left: rpx(16);
}
/deep/.van-search__content {
  background: #fff !important;
}
.container {
  &-filterBox {
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    top: 13.8vh;
    @include hor-between-center;
    &-numBox {
      @include hor;
      align-items: center;
      span {
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
      }
      span:nth-child(2) {
        color: #14c9c9;
        margin: 0 rpx(3);
      }
    }
    &-rightBox {
      width: 59px;
      height: 24px;
      background: #ffffff;
      border-radius: 13px;
      font-size: rpx(11);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #666666;
      @include hor-center-center;
      image {
        width: rpx(12);
        height: rpx(12);
        margin-right: rpx(4);
      }
    }
  }
  &-noteBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 10.5vh;
    background: #ffffff;
    border-radius: 24px 24px 0px 0px;
    z-index: 1;
    @include hor-center-center;
    &-text {
      padding: 0 60px;
      height: 44px;
      border-radius: 41px;
      border: 1px solid #14c9c9;
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #14c9c9;
      @include hor-center-center;
    }
    &-button {
      @include abscenter;
    }
    button {
      background: unset !important;
      padding: 0px !important;
      height: 100%;
    }
    button::after {
      border: none !important;
    }
  }
}
.popNoteBox {
  @include ver;
  align-items: center;
  &-title {
    font-size: rpx(16);
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 19px;
    margin-top: rpx(20);
  }
  &-note {
    margin: 8px 16px 0 16px;
    font-size: rpx(14);
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
  &-bottomBox {
    margin-top: 24px;
    @include hor;
    align-items: center;
    div {
      width: 164px;
      height: 44px;
      border-radius: 41px;
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      @include hor-center-center;
    }
    div:nth-child(1) {
      background: #e5e9ed;
      margin-right: 15px;
      color: #4c5657;
    }
    div:nth-child(2) {
      background: #14c9c9;
      color: #ffffff;
    }
  }
}
</style>
