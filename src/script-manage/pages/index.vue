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
        <div class="container-topBox">
          <div class="container-topBox-numBox">
            <span>共</span>
            <span>{{ total }}</span>
            <span>套剧本</span>
          </div>
          <div class="container-topBox-rightBox">
            <div class="container-topBox-rightBox-filter" @click="onFilter">
              <image src="../static/image/screen-srp.png" /> 筛选
            </div>
            <div
              class="container-topBox-rightBox-manage"
              :style="isEditStatus ? 'background: #E9E9E9' : ''"
              @click="onEditBatch"
            >
              <image src="../static/image/screen-manage.png" />管理
            </div>
          </div>
        </div>
        <modify
          ref="modify"
          :form="form"
          :isAll="isAll"
          :isEditStatus="isEditStatus"
          @on-change="onChangeBatch"
          @on-select-drama="onSelectDrama"
          @on-reachBottom="onLoadMore"
        />
        <notc-data top="20vh" v-if="!form.length"></notc-data>
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
      <filterBox @on-cancel="onCancelFilter" @on-change="onChangeFilter" />
    </van-popup>
    <van-popup
      :show="isShowMenu"
      close-on-click-overlay
      @click-overlay="isShowMenu = false"
      custom-style="height: 24%"
      position="bottom"
      round
    >
      <div class="popMenuBox">
        <div class="popMenuBox-dramaBox">
          <image
            :src="$filters.processImage(editDrama.dramaCover, 320)"
            mode="aspectFill"
            lazy-load
          />
          <div class="popMenuBox-dramaBox-infoBox">
            <span class="popMenuBox-dramaBox-infoBox-title">{{
              editDrama.dramaName
            }}</span>
            <scroll-view
              class="popMenuBox-dramaBox-infoBox-tags"
              v-if="editDrama.dramaThemes"
              scroll-x
            >
              <div
                class="popMenuBox-dramaBox-infoBox-tags-item"
                v-for="item in editDrama.dramaThemes"
                :key="item.id"
              >
                {{ item.dictValue }}
              </div>
            </scroll-view>
          </div>
        </div>
        <div class="popMenuBox-menus">
          <div class="popMenuBox-menus-menu" @click="onSetTop(editDrama)">
            <image
              src="../static/image/storeManage-drama-unTop.png"
              v-if="editDrama.isTop"
            />
            <image src="../static/image/storeManage-drama-top.png" v-else />
            <span>{{ editDrama.isTop ? "取消置顶" : "设为置顶" }}</span>
          </div>
          <div class="popMenuBox-menus-menu" @click="onSetRecommend(editDrama)">
            <image
              src="../static/image/storeManage-drama-unRecommend.png"
              v-if="editDrama.isRecommend"
            />
            <image
              src="../static/image/storeManage-drama-recommend.png"
              v-else
            />
            <span>{{ editDrama.isRecommend ? "取消推荐" : "设为推荐" }}</span>
          </div>
          <div
            class="popMenuBox-menus-menu"
            @click="onUpdateSinglePrice(editDrama)"
          >
            <image src="../static/image/storeManage-drama-price.png" />
            <span>修改价格</span>
          </div>
          <div
            class="popMenuBox-menus-menu"
            @click="onDeleteSinglePrice(editDrama)"
          >
            <image src="../static/image/storeManage-drama-delete.png" />
            <span>删除剧本</span>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup
      :show="isShowEditBatch"
      close-on-click-overlay
      @click-overlay="isShowEditBatch = false"
      custom-style="height: 16.5%"
      position="bottom"
      round
      :overlay="false"
    >
      <div class="popEditBatchBox">
        <div class="popEditBatchBox-topBox">
          <div class="popEditBatchBox-topBox-numBox">
            <span>已选</span>
            <span>{{ editBatchs.length }}</span>
            <span>项</span>
          </div>
          <div
            class="popEditBatchBox-topBox-cancelBox"
            @click="onCloseEditBatch"
          >
            取消
          </div>
        </div>
        <div class="popEditBatchBox-bottomBox">
          <div class="popEditBatchBox-bottomBox-allBox" @click="onSelectAll">
            <image src="../static/image/Subtract-true.png" v-if="isAll" />
            <image src="../static/image/Subtract-false.png" v-else />
            <span>全选</span>
          </div>
          <div class="popEditBatchBox-bottomBox-operateBox">
            <div
              class="popEditBatchBox-bottomBox-operateBox-update"
              @click="onUpdatePrice"
            >
              修改价格
            </div>
            <div
              class="popEditBatchBox-bottomBox-operateBox-delete"
              @click="onDeleteBatch"
            >
              删除
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup
      :show="isShowEditPrice"
      close-on-click-overlay
      @click-overlay="isShowEditPrice = false"
      custom-style="height: 16.5%"
      position="bottom"
      round
    >
      <div class="popEditPriceBox">
        <div class="popEditPriceBox-inputBox">
          <span>批量修改价格：</span>
          <input
            type="digit"
            v-model="inputPrice"
            placeholder="请输入价格"
            @input="onInputPrice"
          />
        </div>
        <div class="popEditPriceBox-bottomBox">
          <div @click="onCloseEditBatch">取消</div>
          <div @click="onSaveBatchPrice">保存</div>
        </div>
      </div>
    </van-popup>
  </view>
</template>
<script>
import modify from "./modif-recommend.vue";
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar";
import filterBox from "./filter.vue";
import service from "../utils/service";
export default {
  components: { modify, notcData, navigationBar, filterBox },
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
      isShowFilter: false,
      isShowMenu: false,
      isShowEditBatch: false,
      isShowEditPrice: false,
      form: [],
      total: 0,
      editDrama: {},
      isAll: false,
      editBatchs: [],
      isEditStatus: false,
      userInfo: null,
      inputPrice: null,
      searchForm: {}
    };
  },
  async onLoad() {
    wx.showLoading();
    this.userInfo = await this.$checkLogin.getUserInfo();
    this.init();
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onFilter() {
      this.onCloseEditBatch();
      this.isShowFilter = true;
    },
    onInputPrice(event) {
      if (event.detail.value.indexOf("¥ ") !== -1) {
        event.detail.value = event.detail.value.slice(
          2,
          event.detail.value.length
        );
      }
      if(event.detail.value !== ''){
        this.inputPrice = `¥ ${event.detail.value}`;
      }else{
        this.inputPrice = "";
      }
    },
    num(value) {
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字
      value = value.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
      value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      return value;
    },
    onSelectAll() {
      this.isAll = !this.isAll;

      this.$nextTick((_) => {
        this.$refs.modify.changeStatus();
      });
    },
    //搜索
    onSearch(e) {
      this.onCloseEditBatch();
      this.searchValue = e.detail;
      this.pageNo = 1;
      this.init();
    },
    //管理
    onEditBatch() {
      if (!this.form.length) return;

      if (!this.isShowEditPrice) {
        this.isShowEditBatch = !this.isShowEditBatch;
      }
      this.isEditStatus = !this.isEditStatus;
      if (!this.isEditStatus) {
        this.onCloseEditBatch();
      }
    },
    onCloseEditBatch() {
      this.isShowEditBatch = false;
      this.isEditStatus = false;
      this.isShowEditPrice = false;
      this.isShowMenu = false;
      this.editBatchs = [];
      this.isAll = false;
      this.inputPrice = null;
      this.$nextTick((_) => {
        this.$refs.modify.changeStatus();
      });
    },
    //修改选中状态
    onChangeBatch(val) {
      this.editBatchs = val;

      if (this.editBatchs.length === this.form.length) {
        this.isAll = true;
      } else {
        this.isAll = false;
      }
    },
    onUpdatePrice() {
      if (!this.editBatchs.length) {
        return wx.showToast({ title: "请选择剧本", icon: "none" });
      }
      this.isShowEditBatch = false;
      this.isShowEditPrice = true;
    },
    onSelectDrama(drama) {
      if(this.isEditStatus)return;

      this.editDrama = drama;
      this.isShowMenu = true;
    },
    //修改批量价格
    async onSaveBatchPrice() {
      if (!this.inputPrice) {
        return wx.showToast({ title: "请输入价格", icon: "none" });
      }
      this.inputPrice = this.num(this.inputPrice);
      try {
        await service.changePrice({
          ids: this.editBatchs.map((it) => it.id),
          price: parseFloat(this.inputPrice) * 100,
          storeId: uni.getStorageSync("storeId"),
          userId: this.userInfo.id,
        });
        this.refresh();
      } catch (e) {}
    },
    //修改单个商品价格
    onUpdateSinglePrice(drama) {
      this.inputPrice = `¥ ${drama.dramaPrice / 100}`;
      this.isShowEditPrice = true;
      this.isShowMenu = false;
      this.editBatchs = [drama];
    },
    //批量删除
    onDeleteBatch() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认删除该剧本吗？",
        success: async function (res) {
          if (res.confirm) {
            try {
              await service.deleteStoreDrama({
                dramaIds: that.editBatchs.map((it) => it.dramaId),
                storeId: uni.getStorageSync("storeId"),
              });
              that.refresh();
            } catch (e) {}
          }
        },
      });
    },
    onDeleteSinglePrice(drama) {
      this.editBatchs = [drama];
      this.onDeleteBatch();
    },
    refresh() {
      this.onCloseEditBatch();
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
      if (val) {
        val.map((key) => {
          if(key.list.length){
            if (key.title === "剧本人数") {
              form.minGamerNum = key.list[0].minGamer;
              form.maxGamerNum = key.list[0].maxGamer;
            } else if (key.title === "剧本类型") {
              form.sellTypeList = key.list.map(it=>it.dictType);
            } else if (key.title === "剧本题材") {
              form.dramaThemeIdList = [key.list[0].id];
            } else if (key.title === "剧本状态") {
              if (key.list[0].dictValue === "推荐") {
                form.isRecommend = key.list[0].isRecommend;
              } else {
                form.isTop = key.list[0].isTop;
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
    //置顶
    async onSetTop(drama) {
      try {
        if (drama.isTop) {
          await service.storeDramaCancelMoveTop({
            dramaId: drama.dramaId,
            id: drama.id,
            storeId: uni.getStorageSync("storeId"),
            userId: this.userInfo.id,
          });
        } else {
          await service.storeDramaMoveTop({
            dramaId: drama.dramaId,
            id: drama.id,
            storeId: uni.getStorageSync("storeId"),
            userId: this.userInfo.id,
          });
        }
        this.refresh();
      } catch (e) {}
    },
    //设置推荐
    async onSetRecommend(drama) {
      try {
        if (drama.isRecommend) {
          await service.storeDramaCancelRecommend({
            dramaId: drama.dramaId,
            id: drama.id,
            storeId: uni.getStorageSync("storeId"),
            userId: this.userInfo.id,
          });
        } else {
          await service.storeDramaSetRecommend({
            dramaId: drama.dramaId,
            id: drama.id,
            storeId: uni.getStorageSync("storeId"),
            userId: this.userInfo.id,
          });
        }
        this.refresh();
      } catch (e) {}
    },
    onLoadMore() {
      if (this.total === this.form.length) return;

      this.pageNo++;
      this.init();
    },
    //查询剧本列表
    async init() {
      let data = await this.$api.queryStoreDramaPage({
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
  &-topBox {
    @include hor-between-center;
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    top: 13.8vh;
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
      @include hor;
      align-items: center;
      &-filter,
      &-manage {
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
      &-manage {
        margin-left: rpx(8);
      }
    }
  }
}
.popMenuBox {
  &-dramaBox {
    @include hor;
    align-items: center;
    margin: rpx(22) 0 0 rpx(20);
    image {
      width: 44px;
      height: 44px;
      border-radius: 4px;
    }
    &-infoBox {
      margin-left: rpx(10);
      &-title {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 14px;
      }
      &-tags {
        display: flex;
        height: 40rpx;
        margin-top: rpx(8);
        white-space: nowrap;
        width: 70vw;
        &-item {
          display: inline-block;
          font-size: 22rpx;
          font-family: OPPOSans, OPPOSans-Regular;
          text-align: center;
          line-height: 40rpx;
          color: #666666;
          border-radius: 888px;
          background: rgba(153, 153, 153, 0.1);
          border-radius: 57px;
          margin-right: 12rpx;
          padding: 0 20rpx;
        }
      }
    }
  }
  &-menus {
    margin-top: rpx(30);
    padding: 0 rpx(36);
    @include hor-center-center;
    &-menu {
      margin-right: 9vw;
      @include ver;
      align-items: center;
      image {
        width: rpx(36);
        height: rpx(36);
      }
      span {
        margin-top: rpx(8);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
      }
    }
    &-menu:nth-child(4) {
      margin-right: 0;
    }
  }
}
.popEditBatchBox {
  &-topBox {
    @include hor-between-center;
    margin: rpx(16) rpx(16);
    &-numBox {
      @include hor;
      align-items: center;
      span {
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
      }
      span:nth-child(2) {
        color: #14c9c9;
        margin: 0 rpx(4);
      }
    }
    &-cancelBox {
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
  }
  &-bottomBox {
    @include hor-between-center;
    margin: rpx(24) rpx(16) 0 rpx(16);
    &-allBox {
      @include hor;
      align-items: center;
      image {
        width: rpx(20);
        height: rpx(20);
      }
      span {
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        margin-left: rpx(4);
        transform: translateY(-2rpx);
      }
    }
    &-operateBox {
      @include hor;
      align-items: center;
      &-update {
        width: 90px;
        height: rpx(32);
        border-radius: 41px;
        border: 1px solid #14c9c9;
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #14c9c9;
        @include hor-center-center;
        line-height: rpx(32);
      }
      &-delete {
        margin-left: rpx(8);
        width: 80px;
        height: rpx(32);
        background: #fa5252;
        border-radius: 41px;
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        @include hor-center-center;
        line-height: rpx(32);
      }
    }
  }
}
.popEditPriceBox {
  @include ver;
  align-items: center;
  &-inputBox {
    margin-top: 40rpx;
    width: calc(100vw - 80rpx);
    height: 50px;
    background: #f5f5f5;
    border-radius: 8px;
    @include hor-between-center;
    align-items: center;
    span {
      margin-left: rpx(14);
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
    input {
      text-align: right;
      margin-right: rpx(14);
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #14c9c9;
      line-height: 18px;
    }
    .input-placeholder {
      color: lightgrey;
      font-weight: 400;
    }
  }
  &-bottomBox {
    margin-top: 40rpx;
    @include hor-center-center;
    div {
      font-size: rpx(14);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
    div:nth-child(1) {
      margin-right: rpx(156);
    }
    div:nth-child(2) {
      color: #14c9c9;
    }
  }
}
</style>
