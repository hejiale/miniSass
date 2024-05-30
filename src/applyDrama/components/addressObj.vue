<template>
  <div class="item">
    <div class="item-nameBox">
      <span class="item-nameBox-name">{{ address.linkmanName }}</span>
    </div>
    <div class="item-phoneBox">
      <div class="item-phoneBox-phone">
        <image
          src="../static/image/icon-phone-address.png"
          class="item-phoneBox-phone-tag"
        />
        <span class="item-phoneBox-phone-value">{{
          address.linkmanPhone || ""
        }}</span>
      </div>
    </div>
    <div class="item-address">
      {{ address.addressName }}{{ address.linkmanAddress || "" }}
    </div>
    <div
      class="item-editBox"
      v-if="isEdit"
      @click.stop="onEditAddress(address.id)"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    address: {
      type: Object,
      default() {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onEditAddress(id) {
      this.$emit("editStoreAddress", id);
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  margin: 20rpx;
  background: #ffffff;
  border-radius: 8px;
  position: relative;
  padding-bottom: 20rpx;
  &-nameBox {
    padding: 20rpx 0 0 20rpx;
    @include hor;
    align-items: center;
    &-name {
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      @include text-overflow-line(1);
    }
  }
  &-phoneBox {
    @include hor;
    align-items: center;
    margin-top: 16rpx;
    &-phone {
      margin-left: 20rpx;
      @include hor;
      align-items: center;
      &-tag {
        width: 32rpx;
        height: 32rpx;
      }
      &-value {
        margin-left: 4rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        @include text-overflow-line(1);
      }
    }
  }
  &-address {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    margin: 12rpx 0 0 20rpx;
    @include text-overflow-line(2);
    width: 90%;
    color: #999999;
  }
  &-editBox {
    position: absolute;
    right: 32rpx;
    top: 40rpx;
    background: url("../static/image/icon-edit-address.png");
    background-repeat: no-repeat;
    background-size: 50% 50%;
    width: 40rpx;
    height: 40rpx;
    padding: 20rpx;
    background-position: center;
  }
}
</style>