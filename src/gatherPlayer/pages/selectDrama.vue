<template>
  <view class="container">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('icon-goGather')" mode="widthFix" />
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <div class="topNav-backBox">
            <van-icon name="arrow-left" @click="backRoute" style="color: #000" size="16" />
          </div>
          <van-search v-model="keywords" shape="round" placeholder="搜索剧本名称"
            :left-icon="$iconFont.getIconName('icon-search')" @search="onSearch" @change="onSearch" @clear="onSearch" />
        </view>
      </view>
      <view slot="content">
        <div class="container-filterBox">
          <div class="container-filterBox-numBox">共计 {{ total }} 套剧本</div>
          <div class="container-filterBox-rightBox" @click="onShowFilter">
            <image src="../static/image/screen-srp.png" />筛选
          </div>
        </div>
        <scroll-view scroll-y class="container-listBox listBox" @scrolltolower="onLoadMore">
          <div class="container-listBox-selectedBox" v-if="formName.length">
            <span class="container-listBox-selectedBox-title">已选条件：</span>
            <div class="container-listBox-selectedBox-inlineBox">
              <div class="container-listBox-selectedBox-inlineBox-item" v-for="v in formName" :key="v"
                @click="onDelForm(v)">
                <span>{{ v }}</span>
                <van-icon name="cross" size="12px" class="ml4" />
              </div>
            </div>
          </div>
          <div class="container-listBox-item" v-for="(item, index) in list" :key="index" @click="onSelectDrama(item)">
            <image :src="$filters.processImage(item.dramaItem.dramaCover, 160)" class="container-listBox-item-url"
              mode="aspectFill" />
            <span class="container-listBox-item-title">{{
              item.dramaItem.dramaName
            }}</span>
            <span class="container-listBox-item-price" v-if="item.currentPrice !== null">¥{{ item.currentPrice / 100
            }}</span>
            <div class="container-listBox-item-button">选择</div>
            <div class="container-listBox-item-bage" :class="item.sellType">
              {{ $enums.SellType.getName(item.dramaItem.sellType) }}
            </div>
          </div>
          <div style="height: 10px"></div>
        </scroll-view>
        <notc-data v-if="!list.length && isPlayer" top="20vh"></notc-data>
        <notc-data v-if="!list.length && !isPlayer" top="20vh" clickTitle="去上架" @on-click="onPuton"></notc-data>
      </view>
    </navigation-bar>
    <van-popup :show="isShowFilter" close-on-click-overlay @click-overlay="isShowFilter = false"
      custom-style="height: 80%" position="bottom" round>
      <div class="popFilterBox">
        <div v-for="dict in filterObj" :key="dict.title" class="popFilterBox-dictBox">
          <div class="popFilterBox-dictBox-title">{{ dict.title }}</div>
          <div class="popFilterBox-dictBox-lists">
            <div class="popFilterBox-dictBox-lists-item" :class="selected(dict, it) ? 'select' : ''"
              v-for="it in dict.list" :key="it.dictValue" @click="onChangeDict(dict, it)">
              {{ it.dictValue }}
            </div>
          </div>
        </div>
        <div class="popFilterBox-bottom">
          <div class="popFilterBox-bottom-left" @click="onReset">重置</div>
          <div class="popFilterBox-bottom-right" @click="onQuery">确定</div>
        </div>
      </div>
    </van-popup>
  </view>
</template>
<script>
import navigationBar from "@/components/navigation-bar";
import notcData from "@/components/notc-data/index.vue";
import service from '../utils/index'
export default {
  components: {
    navigationBar,
    notcData
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        position: "fixed",
      },
      isShowFilter: false,
      total: 0,
      pageNo: 1,
      pageSize: 20,
      keywords: "",
      list: [],
      filterObj: [],
      selectDicts: [],
      searchForm: [],
      isPlayer: null,
      formName: [],
      storeId: null,
      dramaId: null
    };
  },
  onLoad(options) {
    if (options.storeId == undefined || options.storeId == '' || options.storeId == null || options.storeId == 'undefined') {
      this.storeId = null
    } else {
      this.storeId = options.storeId
    }
    this.isPlayer = options.isPlayer;
    this.dramaId = options.dramaId
    this.getDicts();
    // console.log('this.options', this.storeId);
  },
  onShow() {
    this.pageNo = 1;
    this.queryDramaList();
  },
  computed: {
    selected() {
      return function (dict, val) {
        let isExist = false;
        let index = this.selectDicts.findIndex((it) => it.title === dict.title);
        if (index !== -1) {
          this.selectDicts.map((v) => {
            let idx = v.list.findIndex((i) => i.dictValue === val.dictValue);
            if (idx !== -1) {
              isExist = true;
            }
          });
        }
        return isExist;
      };
    }
  },
  methods: {
    onLoadMore() {
      if (this.pageNo >= this.total) {
        uni.showToast({
          title: '已加载全部数据~',
          icon: 'none',
          duration: 1000
        });
      } else {
        uni.showLoading({
          title: "加载中...",
        }),
          this.pageNo++,
          this.queryDramaList().then(() => {
            uni.hideLoading();
          })
      }
    },
    backRoute() {
      uni.navigateBack();
    },
    onShowFilter() {
      this.isShowFilter = true;
      this.selectDicts = JSON.parse(JSON.stringify(this.searchForm));
    },
    onSearch(event) {
      this.keywords = event.detail;
      this.pageNo = 1;
      this.queryDramaList();
    },
    onPuton() {
      uni.navigateTo({
        url: '/script-manage/pages/export'
      })
    },
    async queryDramaList() {
      let form = {};
      this.searchForm.map((key) => {
        if (key.list.length) {
          if (key.title === "剧本人数") {
            form.minGamerNum = key.list[0].minGamer;
          } else if (key.title === "剧本类型") {
            form.sellTypeList = key.list.map((it) => it.dictType);
          } else if (key.title === "剧本题材") {
            form.dictIds = [key.list[0].id];
          } else if (key.title === "是否票房本") {
            form.isBoxOffice = key.list[0].status;
          }
        }
      });

      try {
        let res = await service.getStoreProductPage({
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          productKeyword: this.keywords,
          productType: 'GATHERING_PRODUCT',
          storeId: this.storeId,
          dramaId: this.dramaId,
          ...form,
        });
        this.total = res.total;
        if (this.pageNo === 1) {
          this.list = [];
        }
        if (res.records && res.records.length) {
          this.list.push(...res.records);
        }
      } catch (e) { }
    },
    //筛选参数
    async getDicts() {
      try {
        let data = await this.$api.queryDictList({
          dictType: "DRAMA",
        });
        this.filterObj = [
          {
            title: "是否票房本",
            list: [
              { dictValue: "是", status: true },
              { dictValue: "否", status: false },
            ],
          },
          {
            title: "剧本人数",
            list: [
              { dictValue: "≤4人", minGamer: 4 },
              { dictValue: "5人", minGamer: 5 },
              { dictValue: "6人", minGamer: 6 },
              { dictValue: "7人", minGamer: 7 },
              { dictValue: "8人", minGamer: 8 },
              { dictValue: "≥9人", minGamer: 9 },
            ],
          },
          { title: null, list: [] },
          {
            title: "剧本类型",
            list: [
              { dictValue: "实景", dictType: "REAL_SCENE" },
              { dictValue: "盒装", dictType: "BOXED" },
              { dictValue: "城限", dictType: "LIMITED" },
              { dictValue: "独家", dictType: "EXCLUSIVE" },
              { dictValue: "待定", dictType: "UNDETERMINED" },
            ],
          },
        ];
        this.filterObj[2].title = data[0].typeValue;
        this.filterObj[2].list = data[0].dictList;
      } catch (e) { }
    },
    onChangeDict(dict, val) {
      //已有存在
      let index = this.selectDicts.findIndex((it) => it.title === dict.title);
      if (index !== -1) {
        if (dict.title === "剧本类型") {
          let idx = this.selectDicts[index].list.findIndex(
            (v) => v.dictValue === val.dictValue
          );
          if (idx !== -1) {
            this.selectDicts[index].list.splice(idx, 1);
          } else {
            this.selectDicts[index].list.push(val);
          }
        } else {
          let idx = this.selectDicts[index].list.findIndex(v => v.dictValue === val.dictValue);
          if (idx !== -1) {
            this.selectDicts[index].list = [];
          } else {
            this.selectDicts[index].list = [val];
          }
        }
      } else {
        this.selectDicts.push({ title: dict.title, list: [val] });
      }
    },
    onDelForm(val) {
      let index = this.formName.findIndex(v => v === val);
      this.formName.splice(index, 1);

      this.searchForm.map(i => {
        let idx = i.list.findIndex(v => v.dictValue === val);
        if (idx > -1) {
          i.list.splice(idx, 1);
        }
      })
      this.pageNo = 1;
      this.queryDramaList();
    },
    onReset() {
      this.selectDicts = [];
      this.searchForm = [];
      this.isShowFilter = false;
      this.formName = []
      this.selectDicts.map(it => {
        this.formName.push(...it.list.map(v => v.dictValue))
      })
      this.pageNo = 1;
      this.queryDramaList();
    },
    onQuery() {
      let form = {};
      if (this.selectDicts) {
        this.selectDicts.map((key) => {
          if (key.list.length) {
            if (key.title === "剧本人数") {
              form.minGamerNum = key.list[0].minGamer;
            } else if (key.title === "剧本类型") {
              form.sellTypeList = key.list.map((it) => it.dictType);
            } else if (key.title === "剧本题材") {
              form.dictIds = [key.list[0].id];
            } else if (key.title === "是否票房本") {
              form.isBoxOffice = key.list[0].status;
            }
          }
        });

        this.formName = []
        this.selectDicts.map(it => {
          this.formName.push(...it.list.map(v => v.dictValue))
        })
        this.searchForm = JSON.parse(JSON.stringify(this.selectDicts));
        this.selectDicts = [];
      }

      this.isShowFilter = false;
      this.pageNo = 1;
      this.queryDramaList();
    },
    onSelectDrama(drama) {
      uni.setStorageSync("gather-drama", drama);
      this.dramaId = drama.dramaId
      uni.navigateBack();
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

  &-backBox {
    width: rpx(32);
    height: rpx(32);
    background: #ffffff;
    border-radius: 10px;
    @include hor-center-center;
  }

  /deep/image {
    vertical-align: super !important;
  }
}

/deep/.van-search {
  height: rpx(36);
  padding: unset !important;
  border-radius: 10px;
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
    top: 12.8vh;
    @include hor-between-center;

    &-numBox {
      font-size: rpx(11);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #999999;
      line-height: 13px;
    }

    &-rightBox {
      width: rpx(59);
      height: rpx(24);
      background: #ffffff;
      border-radius: 6px;
      font-size: rpx(11);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #1a1a1a;
      @include hor-center-center;

      image {
        width: rpx(12);
        height: rpx(12);
        margin-right: rpx(4);
      }
    }
  }

  &-listBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 16.6vh;

    &-selectedBox {
      @include ver;

      &-title {
        font-size: rpx(12);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1A1A1A;
        margin-left: rpx(16);
      }

      &-inlineBox {
        display: flex;
        flex-wrap: wrap;
        margin: 6px 0 0 16px;

        &-item {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 8px;
          background: #FFFFFF;
          border-radius: 45px 45px 45px 45px;
          margin: 0px 8px 8px 0;
        }
      }
    }

    &-item {
      display: inline-block;
      width: calc((100vw - 90rpx) / 2);
      height: rpx(88);
      background: #ffffff;
      border-radius: 12px;
      margin-bottom: rpx(15);
      margin-left: rpx(15);
      position: relative;

      &-url {
        width: rpx(50);
        height: rpx(68);
        border-radius: 6px;
        position: absolute;
        left: rpx(10);
        top: rpx(10);
      }

      &-title {
        position: absolute;
        left: rpx(70);
        right: 0;
        top: rpx(10);
        font-size: rpx(12);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 14px;
        @include text-overflow-line(1);
      }

      &-price {
        position: absolute;
        left: rpx(70);
        right: 0;
        top: rpx(30);
        font-size: rpx(12);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 14px;
      }

      &-button {
        position: absolute;
        left: rpx(70);
        right: 0;
        top: rpx(54);
        width: 22vw;
        height: rpx(24);
        background: #14c9c9;
        border-radius: 6px;
        @include hor-center-center;
        color: #fff;
      }

      &-bage {
        position: absolute;
        left: rpx(15);
        top: rpx(15);
        border-radius: 4px;
        font-size: rpx(10);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        padding: rpx(3) rpx(4);
      }

      .EXCLUSIVE {
        background: linear-gradient(90deg, #fe6989 50%, #ff928b 100%);
      }

      .BOXED {
        background: linear-gradient(90deg, #317bff 0%, #5754f1 100%);
      }

      .LIMITED {
        background: linear-gradient(90deg, #5655e6 50%, #3e86ff 100%);
      }

      .REAL_SCENE {
        background: linear-gradient(90deg, #ff7043 50%, #ffa726 100%);
      }

      .UNDETERMINED {
        background: linear-gradient(90deg, #c2c7cb 50%, #c2c7cb 100%);
      }
    }
  }
}

.popFilterBox {
  padding-top: rpx(20);
  padding-bottom: rpx(92);

  &-dictBox {
    overflow-y: scroll;

    &-title {
      margin-top: rpx(8);
      margin-left: rpx(16);
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
    }

    &-lists {
      display: flex;
      flex-wrap: wrap;
      margin-top: rpx(10);
      margin-left: rpx(5);

      &-item {
        display: inline-block;
        padding: rpx(6) rpx(17);
        background: #f7f7f7;
        border-radius: rpx(6);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        @include hor-center-center;
        margin-left: rpx(11);
        margin-bottom: rpx(16);
      }

      .select {
        background: #1a1a1a;
        color: #fff;
      }
    }
  }

  &-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: rpx(88);
    background: #ffffff;
    @include hor-center-center;

    &-left {
      margin-top: rpx(-16);
      width: rpx(164);
      height: 44px;
      border: 1px solid #ebebeb;
      border-radius: rpx(16);
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #1a1a1a;
      @include hor-center-center;
      margin-right: rpx(15);
    }

    &-right {
      margin-top: rpx(-16);
      width: rpx(164);
      height: 44px;
      background: #14c9c9;
      border-radius: rpx(16);
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #fff;
      @include hor-center-center;
    }
  }
}
</style>