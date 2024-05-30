<template>
  <div class="bureauDetail">
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left" @click="backRoute">
        <view class="topNav">
          <image src="../static/image/icon-back.png" />
        </view>
      </view>
    </navigationBar>
    <div class="bureauDetail-bg">
      <image
        mode="aspectFill"
        :src="
          infoDetail.dramaItem.dramaCover +
          '?x-oss-process=image/blur,r_20,s_20'
        "
      />
    </div>
    <image
      mode="aspectFill"
      :src="$iconFont.getIconName('bureau-detail-bg')"
      class="bg"
    />
    <scroll-view
      class="content"
      scroll-y
      v-if="infoDetail"
      :style="isFail || isExpire ? '' : 'padding-bottom: 12vh;'"
    >
      <div class="content-info">
        <div class="content-info-left">
          <image :src="infoDetail.dramaItem.dramaCover" mode="aspectFill" />
          <div
            v-if="infoDetail.dramaItem.sellType !=='UNDETERMINED'"
            :class="
              infoDetail.dramaItem.sellType == 'BOXED'
                ? 'BOXED'
                : infoDetail.dramaItem.sellType == 'LIMITED'
                ? 'LIMITED'
                : infoDetail.dramaItem.sellType == 'EXCLUSIVE'
                ? 'EXCLUSIVE'
                : infoDetail.dramaItem.sellType == 'REAL_SCENE'
                ? 'REAL_SCENE'
                : ''
            "
          >
            {{ $enums.SellType.getName(infoDetail.dramaItem.sellType) }}
          </div>
        </div>
        <div class="content-info-right">
          <div class="content-info-right-title">
            {{ infoDetail.productName }}
          </div>
          <scroll-view scroll-x class="content-info-right-tag">
            <span v-for="item in infoDetail.dramaItem.dicts" :key="item.id">{{
              item.dictValue
            }}</span>
          </scroll-view>
          <div class="content-info-right-limit">
            <div>
              <image src="../static/image/icon-people.png" />
              <span
                >{{ infoDetail.maleLimitNum }}男{{
                  infoDetail.femaleLimitNum
                }}女</span
              >
            </div>
            <div>
              <image src="../static/image/icon-time.png" />
              <span>{{ infoDetail.gameTime }}小时</span>
            </div>
            <div v-if="infoDetail.isRevertSex">
              <image src="../static/image/icon-fanchuan.png" />
              <span>可反串</span>
            </div>
          </div>
          <div class="content-info-right-price">
            价格：￥{{ infoDetail.originPrice / 100 }}
          </div>
        </div>
      </div>
      <div class="content-tip" v-if="infoDetail.content">
        <span>本局说明</span>
        <span>{{ infoDetail.content }}</span>
      </div>
      <div class="content-box">
        <div class="content-box-edit">
          <span>设置可反串</span>
          <span
            class="canEdit"
            @click="editReversible"
            v-if="!infoDetail.isRevertSex && !isFail"
            >去设置</span
          >
          <span v-else-if="isFail" class="cantEdit">不可设置</span>
          <span class="cantEdit" v-else>已设置</span>
        </div>
        <div class="content-box-time">
          <div class="content-box-time-top">开场时间：{{ getDateStr }}</div>
          <div class="content-box-time-bottom" v-if="!isFail">
            <span
              :class="
                infoDetail.gatherStatus == 'GATHERING' &&
                infoDetail.gatherLockStatus == 'LOCKED'
                  ? 'lock'
                  : infoDetail.gatherStatus == 'GATHERING'
                  ? 'creating'
                  : 'success'
              "
              ><image
                v-if="
                  infoDetail.gatherStatus == 'GATHERING' &&
                  infoDetail.gatherLockStatus == 'LOCKED'
                "
                src="../static/image/icon-lock.png"
              />
              {{
                infoDetail.gatherStatus == "GATHERING" &&
                infoDetail.gatherLockStatus == "LOCKED"
                  ? "已锁车"
                  : infoDetail.gatherStatus == "GATHERING"
                  ? "拼场中"
                  : "拼场成功"
              }}</span
            >
            <span v-if="infoDetail.gatherStatus == 'GATHERING'"
              >拼场中若未满员，当前组局将到达开场时间自动解散。</span
            >
            <span v-else>拼场成功超过游戏开场时间，无法取消本场组局。</span>
          </div>
          <div class="content-box-time-bottom" v-else>
            <span class="fail">拼场失败</span>
            <span>拼场失败全部玩家订单已取消，已原路退款。</span>
          </div>
        </div>
        <div class="content-box-list" v-if="!isFail">
          <div class="content-box-list-item">
            <div class="content-box-list-item-left" v-if="isFail"></div>
            <div
              class="content-box-list-item-left"
              @click="editPlayer"
              v-if="!isFail && infoDetail.gatherStatus == 'GATHERING'"
            >
              <div class="img" v-if="getPlayerNum">
                <image src="../static/image/icon-add.png" />
              </div>
              <div class="tip" v-if="getPlayerNum">修改线下占位</div>
            </div>
            <div class="content-box-list-item-right">
              <span class="text" v-if="getPlayerNum">{{ getPlayerNum }}</span>
              <span class="text" style="color: #a3a3a3" v-else>已满员</span>
            </div>
          </div>
          <div
            class="content-box-list-item"
            v-for="(item, index) in infoDetail.botMaleGamerNum"
            :key="index"
          >
            <div class="content-box-list-item-left">
              <div class="img">
                <image src="../static/image/icon-default.png" />
                <image src="../static/image/icon-male.png" />
              </div>
              <div class="name">线下玩家</div>
            </div>
            <div class="content-box-list-item-middle">—</div>
            <div class="content-box-list-item-middle">
              <span>1男</span>
            </div>
            <div
              class="content-box-list-item-right"
              v-if="!isFail && infoDetail.gatherStatus == 'GATHERING'"
            >
              <span class="delBtn" @click.stop="delPlaceholder('male')"
                >删除占位</span
              >
            </div>
            <div
              class="content-box-list-item-right"
              v-else
            >
              ——
            </div>
          </div>
          <div
            class="content-box-list-item"
            v-for="(item, index) in infoDetail.botFemaleGamerNum"
            :key="index"
          >
            <div class="content-box-list-item-left">
              <div class="img">
                <image src="../static/image/icon-default.png" />
                <image src="../static/image/icon-female.png" />
              </div>
              <div class="name">线下玩家</div>
            </div>
            <div class="content-box-list-item-middle">—</div>
            <div class="content-box-list-item-middle">
              <span>1女</span>
            </div>
            <div
              class="content-box-list-item-right"
              v-if="!isFail && infoDetail.gatherStatus == 'GATHERING'"
            >
              <span class="delBtn" @click.stop="delPlaceholder('female')"
                >删除占位</span
              >
            </div>
            <div class="content-box-list-item-right" v-else>——</div>
          </div>
          <div
            class="content-box-list-item"
            v-for="item in infoDetail.gatheringMemberItems"
            :key="item.id"
            @click="callUp(item)"
          >
            <div class="content-box-list-item-left">
              <div class="img">
                <image :src="item.avatar" />
              </div>
              <div class="name">{{ item.nickName }}</div>
            </div>
            <div class="content-box-list-item-middle">
              <span
                >{{ item.maleGamerNum ? item.maleGamerNum + "男" : ""
                }}{{
                  item.femaleGamerNum ? item.femaleGamerNum + "女" : ""
                }}</span
              >
            </div>
            <div class="content-box-list-item-middle">
              <span>￥{{ item.incomeAmount / 100 }}</span>
            </div>
            <div
              class="content-box-list-item-right"
              v-if="!isFail && !isExpire"
            >
              <span class="cancel" @click.stop="cancelOrder(item)"
                >取消订单</span
              >
            </div>
            <div
              class="content-box-list-item-rightDisable"
              v-else-if="infoDetail.gatherStatus === 'SUCCESS'"
            >
              已完成
            </div>
            <div class="content-box-list-item-rightDisable" v-else>已取消</div>
          </div>
          <div
            class="content-box-list-btn"
            @click="cancelBureau"
            v-if="!isFail && !isExpire"
          >
            取消组局
          </div>
        </div>
      </div>
      <div style="height: 20px;"></div>
    </scroll-view>
    <div class="footer" v-if="!isFail && !isExpire && infoDetail">
      <div
        class="footer-unlock"
        @click="unlockRoom"
        v-if="infoDetail.gatherLockStatus === 'LOCKED'"
      >
        <image src="../static/image/icon-unlock.png" />
        <span>解锁</span>
      </div>
      <div
        class="footer-lock"
        @click="lockRoom"
        v-if="infoDetail.gatherLockStatus === 'UNLOCKED'"
      >
        <image src="../static/image/icon-lock.png" />
        <span>锁车</span>
      </div>
      <!-- <div
        class="footer-open"
        v-if="isCanOpen"
        @click="onGoGame"
      >
        <span>立即开本</span>
      </div> -->
    </div>
    <div class="modal" v-if="isShowModal">
      <div class="modal-bg" @click="cancel"></div>
      <div class="modal-box">
        <div class="modal-box-title">
          <div>{{ modalTitle }}</div>
        </div>
        <div class="modal-box-text">
          <span>{{ modalText }}</span>
          <span class="emphasize" v-if="isShowModal == 'reversible'"
            >不可修改</span
          >
          <span>。</span>
        </div>
        <div class="modal-box-btn" v-if="isShowModal == 'reversible'">
          <div @click="cancel">取消</div>
          <div @click="onEditReversible">确认设置</div>
        </div>
        <div class="modal-box-btn" v-if="isShowModal == 'fill'">
          <div @click="cancel">暂不</div>
          <div @click="onFillPlayer">一键补齐</div>
        </div>
        <div class="modal-box-btn" v-if="isShowModal == 'cancelOrder'">
          <div @click="cancel">暂不</div>
          <div @click="onCancelOrder">确认取消</div>
        </div>
        <div class="modal-box-btn" v-if="isShowModal == 'cancelBureau'">
          <div @click="cancel">取消</div>
          <div @click="onCancelBureau">确认取消</div>
        </div>
        <div
          class="modal-box-btnOnly"
          @click="onLock"
          v-if="isShowModal == 'lock'"
        >
          <image src="../static/image/icon-lock.png" />
          <span>确认锁车</span>
        </div>
        <div
          class="modal-box-btnOnly"
          @click="onUnlock"
          v-if="isShowModal == 'unlock'"
        >
          <span>确认解锁</span>
        </div>
      </div>
    </div>
    <modalGender
      :isShowGender.sync="isShowGender"
      :propMaleNum="infoDetail.botMaleGamerNum"
      :propFemaleNum="infoDetail.botFemaleGamerNum"
      :isRevertSex="infoDetail.isRevertSex"
      :limitMale="
        infoDetail.isRevertSex
          ? infoDetail.totalGamerNum
          : infoDetail.maleLimitNum
      "
      :limitFemale="
        infoDetail.isRevertSex
          ? infoDetail.totalGamerNum
          : infoDetail.femaleLimitNum
      "
      :propRealMale="infoDetail.realMaleGamerNum"
      :propRealFemale="infoDetail.realFemaleGamerNum"
      @male-female-num="maleFemaleNum"
      v-if="isShowGender"
    />
    <modalPhone
      :isShowPhone.sync="isShowPhone"
      :phone="currentOrder.phone"
      :nickName="currentOrder.nickName"
      :avatar="currentOrder.avatar"
      v-if="isShowPhone"
    />
  </div>
</template>

<script>
import modalPhone from "../components/modal-phone.vue";
import modalGender from "../components/modal-gender.vue";
import navigationBar from "../../components/navigation-bar/index.vue";
import service from "../utils/service";
export default {
  components: {
    modalPhone,
    modalGender,
    navigationBar,
  },
  data() {
    return {
      customNav: {
        // bgHeight: "30vh",
        navTitle: "组局详情",
        customizeLeft: true,
        position: "fixed",
      },
      isShowModal: null, //reversible设置可反串，lock锁车，fill补齐玩家，cancelOrder取消订单，cancelBureau取消组局
      isShowGender: false,
      isShowPhone: false,
      infoDetail: null,
      currentOrder: null, //取消的订单
      saving: false,
    };
  },
  async onLoad(options) {
    this.id = options.id;
  },
  async onShow() {
    await this.getDetail();
  },
  onShareAppMessage(res) {
    let need;

    if (this.infoDetail.isRevertSex) {
      let count =
        this.infoDetail.totalGamerNum -
        this.infoDetail.botMaleGamerNum -
        this.infoDetail.botFemaleGamerNum -
        this.infoDetail.realMaleGamerNum -
        this.infoDetail.realFemaleGamerNum;
      need = `${count}人`;
    } else {
      let maleNum =
        this.infoDetail.maleLimitNum -
        this.infoDetail.botMaleGamerNum -
        this.infoDetail.realMaleGamerNum;
      let femaleNum =
        this.infoDetail.femaleLimitNum -
        this.infoDetail.botFemaleGamerNum -
        this.infoDetail.realFemaleGamerNum;
      need = `${maleNum}男${femaleNum}女`;
    }

    let dicts = this.infoDetail.dramaItem.dicts.map((it) => it.dictValue);

    return {
      title: `${this.$dayjs(this.infoDetail.gameStartTime).format(
        "YYYY年MM月DD日"
      )} ${this.getWeek(this.infoDetail.gameStartTime)} ${this.$dayjs(
        this.infoDetail.gameStartTime
      ).format("HH:mm")} 等${need}【${
        this.infoDetail.dramaItem.dramaName
      }】 ${dicts.join("，")}， 剧本时长：${this.infoDetail.gameTime}小时`,
      path: `/gatherPlayer/pages/index?id=${this.infoDetail.id}&scene=${this.infoDetail.storeId}`,
      imageUrl: this.infoDetail.dramaItem.dramaCover,
    };
  },
  computed: {
    modalTitle() {
      switch (this.isShowModal) {
        case "reversible":
          return "设置可反串";
        case "lock":
          return "是否锁车";
        case "unlock":
          return "";
        case "fill":
          return `补齐玩家`;
        case "cancelOrder":
          return "取消订单";
        case "cancelBureau":
          return "取消组局";
        default:
      }
    },
    modalText() {
      switch (this.isShowModal) {
        case "reversible":
          return "是否设置为 “可反串”，一旦开启将";
        case "lock":
          return "锁车后拼车状态变为拼车完成，玩家将无法自主退款";
        case "unlock":
          return "解锁后玩家可自由上下车";
        case "fill":
          return `是否需要剩余位置一键补齐线下玩家? 
          若未满员，当前组局将在开场时间到达时自动解散`;
        case "cancelOrder":
          return "取消订单将为该玩家操作退款该玩家将退出此组局";
        case "cancelBureau":
          return "取消组局所有玩家订单将退款";
        default:
      }
    },
    getDateStr() {
      if (!this.infoDetail) return "";
      let time = this.$dayjs(this.infoDetail.gameStartTime);
      return (
        this.$dayjs(time).format("MM月DD日") +
        " " +
        this.getWeek(time) +
        this.$dayjs(time).format("HH:mm")
      );
    },
    getPlayerNum() {
      if (!this.infoDetail) return "";
      if (this.infoDetail.isRevertSex) {
        let needCount =
          this.infoDetail.totalGamerNum -
          this.infoDetail.realFemaleGamerNum -
          this.infoDetail.botFemaleGamerNum -
          this.infoDetail.realMaleGamerNum -
          this.infoDetail.botMaleGamerNum;
        if (needCount > 0) {
          return `空${needCount}人`;
        } else {
          return "";
        }
      }
      let str = "";
      if (
        this.infoDetail.maleLimitNum >
        this.infoDetail.botMaleGamerNum + this.infoDetail.realMaleGamerNum
      ) {
        str +=
          this.infoDetail.maleLimitNum -
          (this.infoDetail.botMaleGamerNum + this.infoDetail.realMaleGamerNum) +
          "男";
      }
      if (
        this.infoDetail.femaleLimitNum >
        this.infoDetail.botFemaleGamerNum + this.infoDetail.realFemaleGamerNum
      ) {
        str +=
          this.infoDetail.femaleLimitNum -
          (this.infoDetail.botFemaleGamerNum +
            this.infoDetail.realFemaleGamerNum) +
          "女";
      }
      if (str) {
        return "空" + str;
      } else {
        return str;
      }
    },
    isCanOpen() {
      if (!this.infoDetail) return false;
      if (
        this.infoDetail.gatherStatus == "SUCCESS" &&
        this.infoDetail.dramaItem.isBoxOffice
      ) {
        return true;
      }
      return false;
    },
    isExpire() {
      if (!this.infoDetail) return false;
      return (
        new Date().getTime() > new Date(this.infoDetail.gameStartTime).getTime()
      );
    },
    isFail() {
      if (!this.infoDetail) return false;
      return (
        this.infoDetail.gatherStatus === "FAIL" ||
        this.infoDetail.gatherStatus === "DISMISS"
      );
    },
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    editReversible() {
      this.isShowModal = "reversible";
    },
    onGoGame() {
      if(new Date().getTime() < new Date(this.infoDetail.gameStartTime).getTime()){
        wx.showToast({
          title: '未到组局开场时间！',
          icon: 'none'
        })
        return;
      }
      uni.navigateTo({
        url: `/murderMysteryList/pages/Details?scriptID=${this.infoDetail.dramaItem.id}&productId=${this.infoDetail.productId}`,
      });
    },
    async onEditReversible() {
      try {
        if (this.saving) return;
        this.saving = true;

        this.infoDetail = await service.setIsRevertSexTrue({
          id: this.infoDetail.id,
        });
        this.cancel();
        this.saving = false;
      } catch (e) {
        this.cancel();
        this.saving = false;
      }
    },
    lockRoom() {
      this.isShowModal = "lock";
    },
    unlockRoom() {
      this.isShowModal = "unlock";
    },
    delPlaceholder(type) {
      try {
        if (this.saving) return;
        this.saving = true;

        if (type == "male") {
          this.editBotNum(
            this.infoDetail.botMaleGamerNum - 1,
            this.infoDetail.botFemaleGamerNum
          );
        } else {
          this.editBotNum(
            this.infoDetail.botMaleGamerNum,
            this.infoDetail.botFemaleGamerNum - 1
          );
        }
        this.cancel();
        this.saving = false;
      } catch (e) {
        this.cancel();
        this.saving = false;
        console.log(e);
      }
    },
    cancelOrder(item) {
      console.log(item);
      this.isShowModal = "cancelOrder";
      this.currentOrder = item;
    },
    async onCancelOrder() {
      try {
        if (this.saving) return;
        this.saving = true;

        await service.kickOutMember({
          gatheringId: this.infoDetail.id,
          orderId: this.currentOrder.orderId,
          userId: this.currentOrder.userId,
        });
        this.cancel();
        this.currentOrder = null;
        this.saving = false;
        this.getDetail();
      } catch (e) {
        this.cancel();
        this.currentOrder = null;
        this.saving = false;
        console.log(e);
      }
    },
    cancelBureau() {
      this.isShowModal = "cancelBureau";
    },
    async onCancelBureau() {
      try {
        if (this.saving) return;
        this.saving = true;

        await service.cancelGathering({
          id: this.infoDetail.id,
        });
        this.cancel();
        this.saving = false;
        uni.showToast({
          title: "组局取消成功",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 500);
      } catch (e) {
        this.cancel();
        this.saving = false;
      }
    },
    editPlayer() {
      this.isShowGender = true;
    },
    callUp(item) {
      this.isShowPhone = true;
      this.currentOrder = item;
    },
    cancel() {
      this.isShowModal = null;
    },
    async getDetail() {
      wx.showLoading();
      this.infoDetail = await service.getGatheringDetail({
        id: this.id,
      });
      wx.hideLoading();
    },
    maleFemaleNum(obj) {
      this.editBotNum(obj.male, obj.female);
    },
    async editBotNum(male, female) {
      try {
        this.infoDetail = await service.changeBotNum({
          botMaleGamerNum: male,
          botFemaleGamerNum: female,
          gatheringId: this.infoDetail.id,
        });
      } catch (e) {}
    },
    /**
     * 转换日期
     */
    getWeek(dateString) {
      let date = new Date(dateString).getDay();
      var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      return "周" + weeks[date];
    },
    async onLock() {
      try {
        if (this.saving) return;
        this.saving = true;

        this.infoDetail = await service.lockGathering({
          id: this.infoDetail.id,
        });
        uni.showToast({
          title: "锁车成功",
        });
        this.saving = false;
        
        this.cancel();
        this.isShowModal = "fill";
      } catch (e) {
        this.saving = false;
        console.log(e);
      }
    },
    havePlayer(){
      //反串
      if (this.infoDetail.isRevertSex) {
        let needCount =
          this.infoDetail.totalGamerNum -
          this.infoDetail.realFemaleGamerNum -
          this.infoDetail.botFemaleGamerNum -
          this.infoDetail.realMaleGamerNum -
          this.infoDetail.botMaleGamerNum;
        if (needCount > 0) {
          return true;
        }
      }
      //非反串
      if (
        this.infoDetail.maleLimitNum >
        this.infoDetail.botMaleGamerNum + this.infoDetail.realMaleGamerNum
      ) {
        return true;
      }
      if (
        this.infoDetail.femaleLimitNum >
        this.infoDetail.botFemaleGamerNum + this.infoDetail.realFemaleGamerNum
      ) {
        return true;
      }
      return false;
    },
    async onUnlock() {
      try {
        if (this.saving) return;
        this.saving = true;

        this.infoDetail = await service.unlockGathering({
          id: this.infoDetail.id,
        });
        uni.showToast({
          title: "解锁成功",
        });
        this.saving = false;
        this.cancel();
        this.getDetail();
      } catch (e) {
        this.saving = false;
        this.cancel();
        console.log(e);
      }
    },
    async onFillPlayer(){
      try{
        await service.changeFullBotNum({gatheringId: this.infoDetail.id})
        this.cancel();
        this.getDetail();
      }catch(e){}
    }
  },
};
</script>

<style lang="scss" scoped>
.bureauDetail {
  .topNav {
    width: 64rpx;
    height: 64rpx;
  }
  &-bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }
  .bg {
    position: fixed;
    top: 13.7vh;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: -1;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .content {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 13.7vh;
    &-info {
      @include hor-between-center;
      padding: 30rpx;
      &-left {
        width: 184rpx;
        height: 244rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        overflow: hidden;
        position: relative;
        margin-right: 20rpx;
        div {
          width: 64rpx;
          height: 36rpx;
          border-radius: 8rpx 8rpx 8rpx 8rpx;
          font-size: 20rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 36rpx;
          text-align: center;
          position: absolute;
          top: 12rpx;
          left: 12rpx;
        }
        .LIMITED {
          //城限
          background: linear-gradient(90deg, #317bff 0%, #5754f1 100%);
        }
        .REAL_SCENE {
          //实景
          background: linear-gradient(90deg, #ff9f00 0%, #ff682c 100%);
        }
        .BOXED {
          //盒装
          background: linear-gradient(90deg, #00c2ff 0%, #127cff 100%);
        }
        .EXCLUSIVE {
          //独家
          background: linear-gradient(74deg, #ff928b 0%, #fe6989 100%);
        }
      }
      &-right {
        flex: 1;
        @include ver;
        justify-content: center;
        &-title {
          font-size: 32rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 38rpx;
          margin-top: 10rpx;
        }
        &-tag {
          margin-top: 30rpx;
          width: 60vw;
          white-space: nowrap;
          span {
            padding: 0 10rpx;
            background: #ffffff;
            border-radius: 114rpx 114rpx 114rpx 114rpx;
            margin-right: 10rpx;
            font-size: 20rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 32rpx;
          }
        }
        &-limit {
          @include hor;
          margin-top: 20rpx;
          div {
            margin-right: 30rpx;
            image {
              width: 28rpx;
              height: 28rpx;
              margin-right: 10rpx;
              vertical-align: middle;
            }
            span {
              font-size: 22rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
              line-height: 26rpx;
            }
          }
        }
        &-price {
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #1a1a1a;
          line-height: 33rpx;
          margin-top: 32rpx;
        }
      }
    }
    &-tip {
      @include ver;
      margin: 0 30rpx 30rpx 30rpx;
      padding: 30rpx;
      background: #ffffff;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      :nth-child(1) {
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 44rpx;
        margin-bottom: 10rpx;
      }
      :nth-child(2) {
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 30rpx;
      }
    }
    &-box {
      padding: 30rpx;
      margin: 0rpx 30rpx;
      background: #ffffff;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      &-edit {
        @include hor-between-center;
        padding-bottom: 40rpx;
        border-bottom: 2rpx solid #e9e9e9;
        :nth-child(1) {
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 28rpx;
        }
        .canEdit {
          background: #14c9c9;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 44rpx;
          padding: 6rpx 24rpx;
        }
        .cantEdit {
          font-size: 28rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #a3a3a3;
          line-height: 28rpx;
        }
      }
      &-time {
        @include ver;
        padding: 20rpx;
        margin-top: 40rpx;
        background: #f7f7fa;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        &-top {
          font-size: 32rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 38rpx;
        }
        &-bottom {
          @include hor;
          align-items: flex-start;
          margin-top: 20rpx;
          span:nth-child(1) {
            width: 104rpx;
            height: 40rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 12rpx 12rpx 12rpx 12rpx;
            font-size: 20rpx;
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 40rpx;
            margin-right: 30rpx;
            image {
              width: 18rpx;
              height: 18rpx;
              margin-right: 2rpx;
            }
          }
          span:nth-child(2) {
            flex: 1;
            font-size: 24rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #78c747;
            line-height: 28rpx;
          }
          .creating {
            background: #faa21e;
            box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(250, 162, 30, 0.5);
          }
          .success {
            background: #067ae5;
            box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(6, 122, 229, 0.5);
          }
          .fail {
            background: #fa5252;
            box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(250, 82, 82, 0.5);
          }
          .lock {
            background: #333333;
            box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(51, 51, 51, 0.5);
          }
        }
      }
      &-list {
        margin-top: 40rpx;
        &-item {
          @include hor-between-center;
          margin-bottom: 50rpx;
          &-left {
            width: 32vw;
            @include hor;
            align-items: center;
            margin-right: 14rpx;
            .img {
              width: 72rpx;
              height: 72rpx;
              margin-right: 20rpx;
              position: relative;
              :nth-child(1) {
                border-radius: 50%;
              }
              :nth-child(2) {
                width: 24rpx;
                height: 24rpx;
                position: absolute;
                bottom: 0;
                right: 0;
              }
            }
            .name {
              @include text-overflow-line(1);
              flex: 1;
              font-size: 24rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #1a1a1a;
              line-height: 28rpx;
            }
            .tip {
              font-size: 24rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #bbbbbb;
              line-height: 28rpx;
            }
          }
          &-middle {
            flex: 1;
            span {
              font-size: 24rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #999999;
              line-height: 28rpx;
              margin-right: 18rpx;
            }
          }
          &-right {
            @include hor-center-center;
            span {
              font-size: 24rpx;
              font-family: PingFang SC-Semibold, PingFang SC;
              font-weight: 600;
            }
            .delBtn {
              width: 140rpx;
              height: 52rpx;
              border: 2rpx solid #ebebeb;
              color: #1a1a1a;
              border-radius: 16rpx 16rpx 16rpx 16rpx;
              line-height: 52rpx;
              text-align: center;
            }
            .cancel {
              width: 144rpx;
              height: 56rpx;
              background: #1a1a1a;
              color: #ffffff;
              border-radius: 16rpx 16rpx 16rpx 16rpx;
              line-height: 56rpx;
              text-align: center;
            }
            .text {
              width: 144rpx;
              height: 56rpx;
              color: #faa21e;
              line-height: 56rpx;
              text-align: center;
            }
          }
          &-rightDisable {
            font-size: 26rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #777777;
          }
        }
        &-btn {
          box-sizing: border-box;
          width: 630rpx;
          height: 80rpx;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          border: 2rpx solid #ebebeb;
          font-size: 28rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 80rpx;
          text-align: center;
          margin-top: 60rpx;
        }
      }
    }
  }
  .footer {
    height: 11vh;
    padding-top: 30rpx;
    @include hor;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    &-unlock {
      margin-left: rpx(15);
      width: 92vw;
      height: 96rpx;
      background: #fff;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      @include hor-center-center;
      border: 1px solid #ebebeb;
      image {
        width: 28rpx;
        height: 28rpx;
      }
      span {
        margin-left: 4px;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 32rpx;
      }
    }
    &-lock {
      margin-left: rpx(15);
      width: 92vw;
      height: 96rpx;
      background: #14c9c9;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      @include hor-center-center;
      image {
        width: 28rpx;
        height: 28rpx;
      }
      span {
        margin-left: 4px;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 32rpx;
      }
    }
    &-open {
      margin-left: rpx(15);
      width: 92vw;
      height: 48px;
      background: #14c9c9;
      border-radius: 16px;
      @include hor-center-center;
      font-size: 14px;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }
  }
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    &-bg {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
    }
    &-box {
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 626rpx;
      padding: 40rpx;
      background: #ffffff;
      border-radius: 44rpx 44rpx 44rpx 44rpx;
      &-title {
        position: relative;
        :nth-child(1) {
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 28rpx;
          text-align: center;
        }
      }
      &-text {
        margin-top: 30rpx;
        text-align: center;
        span {
          font-size: 26rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #999999;
          line-height: 44rpx;
        }
        .emphasize {
          color: #1a1a1a;
        }
      }
      &-btn {
        margin-top: 50rpx;
        display: flex;
        justify-content: space-between;
        div:nth-child(1) {
          flex: 1;
          background: #f7f7f7;
          border-radius: 32rpx 32rpx 32rpx 32rpx;
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #999999;
          line-height: 96rpx;
          text-align: center;
        }
        div:nth-child(2) {
          flex: 1;
          background: #1a1a1a;
          border-radius: 32rpx 32rpx 32rpx 32rpx;
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 96rpx;
          text-align: center;
          margin-left: 34rpx;
        }
      }
      &-btnOnly {
        margin-top: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #1a1a1a;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        image {
          width: 28rpx;
          height: 28rpx;
          margin-right: 4px;
        }
        span {
          font-size: 28rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 96rpx;
        }
      }
    }
  }
  /deep/.header-title {
    color: #ffffff !important;
  }
}
</style>
