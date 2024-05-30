<template>
  <view class="kw-swiper">
    <view class="kw-swiper__top">
      <div class="title">
        <div class="line"></div>
        <div class="name">
          {{ dramaItem.dramaName }}
        </div>
        <div class="line"></div>
        <span> 房间编号：{{ roomInfo.roomId }} </span>
      </div>
    </view>
    <view class="swiper-container" v-if="rolePlayersList.length">
      <scroll-view class="scroll" scroll-x>
        <div
          class="swiper-item"
          v-for="(item) in rolePlayersList"
          :key="item.roleId"
          @click="onTapItem(item)"
		      :class="roleId === item.roleId ? 'active':''"
        >
          <div class="info">
            <template v-if="item.userId">
              <image class="userAvatar" :src="item.userAvatar" />
              <span class="userName">{{ item.userName }}</span>
            </template>
            <span class="roleName">{{ item.roleName }}</span>
          </div>
          <image
            :src="item.roleAvatar"
            mode="aspectFill"
          ></image>
        </div>
      </scroll-view>
    </view>
    <view class="kw-swiper__bottom">
      <div>
        <image
          v-show="!isChoose"
          class="btImg"
          @click="chooseRole('select')"
          :src="$iconFont.getIconName('selectRole')"
          mode="widthFix"
        ></image>
        <image
          v-show="isChoose"
          class="btImg"
          @click="chooseRole('cancel')"
          src="../static/cancelRole.png"
          mode="widthFix"
        ></image>
        <div class="waitDM">等待主持人开始…</div>
      </div>
    </view>
  </view>
</template>
<script>
import { mapState, mapActions } from "vuex";
import service from "@/services/game.js";
export default {
  name: "GameSwiper",
  // 双向绑定模型
  model: {
    prop: "value",
    event: "update:value",
  },
  props: {},
  data() {
    return {
      roleId: null,
      isChoose: false, // 是否选中角色
      canDo: true
    };
  },
  watch: {
    rolePlayersList: {
      handler(newVal) {
        console.log("rolePlayersList", newVal);
        newVal.length &&
          newVal.map((v) => {
            if (v.userId === this.userInfo.id) {
              this.roleId = v.roleId;
              this.isChoose = true;
            }
          });
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState("player", [
      "rolePlayersList",
      "dramaItem",
      "roomInfo",
      "options",
      "userInfo",
    ]),
  },
  methods: {
    ...mapActions("player", ["getRolePlayers"]),
    onTapItem(item) {
      if(item.userId){
        return uni.showToast({
          title: "该角色已被其他玩家选中！",
          icon: "none",
        });
      }
      if(this.isChoose){
        return uni.showToast({
          title: "请先取消选择！",
          icon: "none",
        });
      };
      this.roleId = item.roleId;
    },
    // 用户选角色
    async chooseRole(type) {
      console.log("chooseRole", type);
      if (!this.roleId) {
        uni.showToast({
          title: "请选择角色！",
          icon: "none",
        });
        return;
      }

      if(!this.canDo)return;
      this.canDo = false;

      try{
        if (type === "select") {
          let index = this.rolePlayersList.findIndex(
            (v) => v.roleId === this.roleId
          );
          if (this.rolePlayersList[index].userId) {
            uni.showToast({
              title: "请选择其他角色！",
              icon: "none",
            });
            this.canDo = true;
            return;
          }
          await service.takeSeatPlayer({
            murderMysteryOnlineRecordId: this.options.id,
            userId: this.userInfo.id,
            roleId: this.roleId,
          });
          this.isChoose = true;
        } else {
          if (this.roleId) {
            await service.vacateSeatPlayer({
              murderMysteryOnlineRecordId: this.options.id,
              userId: this.userInfo.id,
              roleId: this.roleId,
            });
            this.isChoose = false;
            this.roleId = null;
          }
        }
        await this.getRolePlayers();
        this.canDo = true;
      }catch(e){
        this.canDo = true;
        this.roleId = null;
        this.isChoose = false;
        await this.getRolePlayers();
      }

      
    },
  },
};
</script>
<style lang="scss">
$kw-border-color: var(--color) !default;
$kw-color-active: var(--activecolor) !default;

.kw-swiper {
  position: relative;
  padding-top: 12px;
  /* overflow: hidden; */
  &__top {
    text-align: center;
    margin: 3px 0 5px;
    .title {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #f7cb3f;
      display: inline-block;
      .line {
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.65) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        height: 1px;
        width: 100%;
      }
      .name {
        padding: 2px 43px;
        background: linear-gradient(
          270.06deg,
          rgba(0, 0, 0, 0) 0.05%,
          rgba(0, 0, 0, 0.6) 46.88%,
          rgba(0, 0, 0, 0) 94.76%
        );
      }
      span {
        display: inline-block;
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 17px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  &__bottom {
	margin-top: 5px;
    width: 100%;
    text-align: center;
    .waitDM {
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 2px;
    }

    .btImg {
      width: 161px;
    }
  }

  .scroll{
	width: 100%;
	height: 100%;
	white-space: nowrap;
  }

  .swiper-item {
    display: inline-block;
    position: relative;
	height: 100%;
    .info {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 12px;
      @include ver;
      align-items: center;
      .userAvatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      span {
        display: inline-block;
        font-family: "PingFang SC";
        font-style: normal;
        color: rgba(255, 255, 255, 0.6);
      }
      .userName {
        font-weight: 400;
        font-size: 11px;
        line-height: 15px;
        margin-bottom: 3px;
      }
      .roleName {
        font-weight: 500;
        font-size: 13px;
        line-height: 18px;
      }
    }
  }
}

.active {
  border: 4px solid #d5b657;
}

.swiper-container {
  margin: 0 6vw;
  margin-top: 20px;
  .swiper-item {
	margin-right: 20px;
	width: 20vw;
	height: 57vh;
	box-sizing: border-box;
  }
}
</style>