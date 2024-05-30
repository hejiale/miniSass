<template>
  <div class="experience-dialog">
    <p class="title">选择体验角色</p>

    <ul class="role-list">
      <li class="role-item" v-for="(role,index) in queryMurderMysteryRoleList" :key="role.id">
        <image mode="aspectFill" :src="role.roleUrl" alt />
        <p>{{ role.roleName }}</p>
        <img
          class="select-icon"
          :src="selected[index] ? selectedIconPath : unselectedIconPath"
          @click="toggleSelect(index)"
        />
      </li>
      <li class="role-other" @click="plusjia">
        <img class="bordbox" alt />
        <img class="plus-jia"  :src="$iconFont.getIconName('plusjia')" alt />
        <p>其他</p>
      </li>
    </ul>
    <div class="popup-bottom">
      <div class="popup-gradient">
        <div class="popup-confirm" @click="confirmSelect">确认</div>
      </div>
    </div>

    <img class="close-icon" :src="$iconFont.getIconName('pgyclose')" @click="closeModal" alt />
  </div>
</template>

<script>
import service from "../utils/service.js";
export default {
  props: {
    experienceRole: Boolean,
    dramaId: [Number, String] ,
  },
  data() {
    return {
      roleValue: "",
      queryMurderMysteryRoleList: [],
      // 用一个数组保存每个图片的选中状态，初始时都没有选中
      selected: [],
      selectedIconPath: this.$iconFont.getIconName('sel-tyrole'),
      unselectedIconPath: this.$iconFont.getIconName('tyrole'),
      roleList: [
        {
          id: 1,
          name: "体验角色一星龙",
          selected: false
        },
        {
          id: 2,
          name: "角色2",
          selected: false
        },
        {
          id: 3,
          name: "角色3",
          selected: false
        },
        {
          id: 4,
          name: "角色4",
          selected: false
        },
        {
          id: 5,
          name: "角色5",
          selected: false
        },
        {
          id: 6,
          name: "角色6",
          selected: false
        }
      ]
    };
  },
  computed: {},
  created() {

  },
  mounted() {
    this.queryMurderMysteryRole();
  },
  methods: {
    closeModal() {
      this.$emit("closeExperienceRole");
    },
    plusjia() {
      for (let i = 0; i < this.selected.length; i++) {
        this.$set(this.selected, i, false);
      }
      this.$emit("onPlusClick");
    },
    toggleSelect(index) {
      // 如果点击的index已经被选中了，那么取消选中状态并返回
      if (this.selected[index]) {
        this.$set(this.selected, index, false);
        return;
      }

      // 先取消所有的选中状态
      for (let i = 0; i < this.selected.length; i++) {
        this.$set(this.selected, i, false);
      }
      // 然后只选中当前的图片
      this.$set(this.selected, index, true);
    },
    confirmSelect() {
      const selectedRoles = this.queryMurderMysteryRoleList.filter(
        (role, index) => this.selected[index]
      );
      this.$emit("selectedRoles", selectedRoles);
    },
    // selectCurRole(row) {
    //   row.selected = !row.selected;
    // },
    //小程序-票房本角色接口
    async queryMurderMysteryRole() {
      try {
        let data = await service.queryMurderMysteryRole({
          id: this.dramaId
        });
        this.queryMurderMysteryRoleList = data;
        this.selected = new Array(this.queryMurderMysteryRoleList.length).fill(
          false
        );
      } catch (e) {}
    }
  }
};
</script>

<style lang="scss" scoped>
.experience-dialog {
  width: 100%;
  background: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  padding-top: 48rpx;
  padding-bottom: 98rpx;
  position: relative;
  .close-icon {
    width: 52rpx;
    height: 52rpx;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
  }

  .title {
    font-size: 32rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2e323e;
    line-height: 38rpx;
    text-align: center;
  }

  .role-list {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    align-items: center;
    margin-top: 48rpx;
    padding: 0 19rpx 16rpx;
    width: 100%;
    box-sizing: border-box;

    .role-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 162rpx;
      margin: 16rpx 9rpx;
      position: relative;

      image {
        width: 162rpx;
        height: 216rpx;
        border-radius: 12rpx;
      }
      .select-icon {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        top: 12rpx;
        right: 12rpx;
      }
      p {
        box-sizing: border-box;
        width: 100%;
        padding: 12rpx 12rpx;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .role-other {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 162rpx;
      margin: 16rpx 9rpx;
      background: #fff;
      border-radius: 12rpx;
      position: relative;
      opacity: 1;
      .bordbox {
        width: 162rpx;
        height: 216rpx;
        border: 2rpx solid #e9ebef;
        border-radius: 12rpx;
      }
      .plus-jia {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        top: 30%;
        left: 37%;
      }

      p {
        box-sizing: border-box;
        width: 100%;
        padding: 12rpx 12rpx;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .popup-bottom {
    padding: 20rpx 32rpx;
    .popup-gradient {
      width: 100%;
      height: 88rpx;
      background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);
      border-radius: 98rpx;
      padding: 4rpx 8rpx;
      box-sizing: border-box;
      .popup-confirm {
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        background: #111111;
        border-radius: 98rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
      }
    }
  }
}
</style>