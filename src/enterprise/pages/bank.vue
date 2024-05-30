<template>
  <div class="container">
    <van-search
      v-model="searchValue"
      shape="round"
      placeholder="搜索银行名称"
      :left-icon="$iconFont.getIconName('icon-search')"
      @change="onSearch"
      @search="onSearch"
      @clear="onSearch"
    />
    <scroll-view scroll-y class="container-scroll" v-if="bankList.length">
      <van-cell
        :title="bank.bankName"
        is-link
        v-for="bank in bankList"
        :key="bank.id"
        @click="onSelectBank(bank)"
      />
    </scroll-view>
    <notc-data note="未查询到该银行" v-else></notc-data>
  </div>
</template>
<script>
import notcData from "../../components/notc-data/index.vue";
export default {
    components:{
        notcData
    },
  data() {
    return {
      searchValue: null,
      bankList: [],
    };
  },
  onLoad() {
    wx.showLoading();
    this.queryBankList();
  },
  methods: {
    onSearch({detail}) {
        this.searchValue = detail;
        this.queryBankList();
    },
    async queryBankList() {
      try {
        this.bankList = await this.$api.getBankCode({ bankName: this.searchValue });
        setTimeout(()=>{
            wx.hideLoading();
        },1000)
      } catch (e) {
        wx.hideLoading();
      }
    },
    onSelectBank(v){
        uni.setStorageSync('bank', v);
        uni.navigateBack();
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  &-scroll {
    height: 93vh;
  }
}
</style>