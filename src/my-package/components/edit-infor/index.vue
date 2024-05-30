<template>
  <view>
    <view>
      <van-field
        :value="inputValue"
        input-align="right"
        @change.native="change"
        :maxlength="maxLength"
        :placeholder="'最多输入' + maxLength + '个字符'"
        v-if="!type"
      >
        <template #label>
          {{ label }}
        </template>
      </van-field>
      <van-cell input-align="right" @click="changeType" v-if="type" is-link>
        <template #title>
          {{ label }}
        </template>
        {{ $enums[type].getName(inputValue) }}
      </van-cell>
      <div class="note" v-if="!type">{{'提示： 至多可输入' + maxLength + '个字符！'}}</div>
    </view>
    <!-- 保存 -->
    <view style="height:160rpx;">
      <view class="bottomView">
        <view style="width:500rpx;" @click="save('save')">
          <van-button custom-class="addBtn" color="#14C9C9 " round
            >保存</van-button
          >
        </view>
      </view>
    </view>
    <!-- 弹窗 -->
    <van-popup
      :show="showPopup"
      round
      @close.native="onClose"
      position="bottom"
    >
      <van-picker
        :columns="columns"
        @confirm.native="onChange"
        @cancel="showPopup = false"
        show-toolbar
      />
    </van-popup>
  </view>
</template>
<script>
import vanIcon from "@/wxcomponents/vant/icon/index";
import vanField from "@/wxcomponents/vant/field/index";
import vanCell from "@/wxcomponents/vant/cell/index";
import vanPopup from "@/wxcomponents/vant/popup/index";
import vanPicker from "@/wxcomponents/vant/picker/index";
import vanButton from "@/wxcomponents/vant/button/index";

export default {
  components: {
    vanIcon,
    vanField,
    vanCell,
    vanPopup,
    vanPicker,
    vanButton,
  },
  data() {
    return {
      setNav: {
        customizeLeft: true, //是否显示自定义左侧区域
        customizeTitle: true, //是否显示自定义标题区域
        showBackBtn: true, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
        // 然后有些页面不需要的东西通过条件控制进行显示与隐藏
        navTitle: "标题栏", //导航标题
      },
      showPopup: false,
      columns: null,
      inputValue: null,
    };
  },
  props: {
    title: {
      type: String,
      default: "编辑信息",
    },
    label: {
      type: String,
      default: "标题",
    },
    value: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    maxLength: {
      type: Number,
      default: 50
    }
  },
  mounted() {
    this.inputValue = this.value;
  },
  methods: {
    save(e) {
      if (e == "save") {
        uni.showToast({
          title: "保存成功",
          icon: "none",
        });
      }
      this.$emit("update:value", this.inputValue);
      this.$emit("save");
    },
    backRoute(e) {
      if (e == "save") {
        uni.showToast({
          title: "保存成功",
          icon: "none",
        });
      }
      // this.$emit('update:value',this.value)
      this.$emit("save");
    },
    change(event) {
      this.inputValue = event.detail;
      // this.$emit('backRoute2')
    },
    changeType() {
      this.columns = this.$enums[this.type].list.map((e) => ({
        text: e.label,
        value: e.value,
      }));
      this.showPopup = true;
    },
    onClose() {
      this.showPopup = false;
    },
    onChange(event) {
      this.inputValue = event.detail.value.value;
      this.showPopup = false;
    },
  },
};
</script>
<style lang="scss">
.bottomView {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  bottom: 70rpx;
  height: 90rpx;
  width: 100%;
  font-size: 24rpx;
}
.addBtn {
  width: 500rpx !important;
  height: 96rpx;
  margin-top: 0rpx;
}
.note{
  color: red;
  padding: 20rpx;
}
</style>
