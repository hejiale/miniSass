<template>
  <div class="addRole-dialog">
    <p class="title">添加体验角色</p>

    <input class="role-input" v-model="roleName" placeholder="请填写角色名称" />
    <div class="btn-area">
      <div class="btn cancel" @click="closeSelf">取消</div>
      <div class="btn confirm" @click="addDramaRolebutton">确定</div>
    </div>
  </div>
</template>

<script>
import service from "../utils/service.js";
export default {
  data() {
    return {
      roleName: "",
      addDramaRoleOtherList: [],
    };
  },
  computed: {},
  created() {
  },
  mounted() {},
  methods: {
    closeSelf() {
    this.$emit('close');
  },
    addDramaRolebutton() {
      this.$emit('addRoleName', this.roleName);
      this.$emit('close'); // 关闭子组件
    },
  }
};
</script>

<style lang="scss" scoped>
.addRole-dialog {
  width: 100%;
  height: 402rpx;
  background: #ffffff;
  border-radius: 30rpx;
  padding-top: 48rpx;
  position: relative;
  box-sizing: border-box;

  .title {
    font-size: 32rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2e323e;
    line-height: 38rpx;
    text-align: center;
  }

  .role-input {
    width: calc(100% - 104rpx);
    margin-left: 52rpx;
    height: 88rpx;
    background: #f6f6f6;
    border-radius: 12rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5f6572;
    text-indent: 24rpx;
    margin-top: 56rpx;
  }

  .btn-area {
    width: 100%;
    height: 96rpx;
    border-top: 1rpx solid #cbccce;
    display: flex;
    flex-direction: row;
    position: absolute;
    bottom: 0;
    left: 0;

    .btn {
      width: 50%;
      font-size: 30rpx;
      height: 96rpx;
      line-height: 96rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #5f6572;
      text-align: center;
    }

    .confirm {
      width: 50%;
      border-left: 1rpx solid #cbccce;
      color: #2e323e;
    }
  }
}
</style>