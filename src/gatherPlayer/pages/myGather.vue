<template>
  <view class="container">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('icon-order-bg')" mode="widthFix" />
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <div class="topNav-backBox">
            <van-icon
              name="arrow-left"
              @click="backRoute"
              style="color: #000"
              size="16"
            />
          </div>
        </view>
      </view>
      <view slot="content">
        <div class="container-tabBox">
          <div
            v-for="(menu, idx) in menus"
            :key="menu.title"
            class="container-tabBox-tab"
            :style="idx === 2 ? 'margin-right:0' : ''"
            @click="onChangeTab(menu.type)"
          >
            <span :class="gatherMemberOrderStatus === menu.type ? 'active' : ''">{{ menu.title }}</span>
            <div
              class="container-tabBox-tab-border"
              :class="gatherMemberOrderStatus === menu.type ? 'borderActive' : ''"
            ></div>
          </div>
        </div>
        <scroll-view scroll-y class="container-listBox" @scrolltolower="reachBottom">
          <div
            v-for="item in list"
            :key="item.orderId"
            class="container-listBox-item"
            @click="onGoDetail(item.gathering.id)"
          >
            <image
              src="../static/image/icon-store.png"
              class="container-listBox-item-tag"
            />
            <span class="container-listBox-item-storeName">{{
              item.storeName
            }}</span>
            <div class="container-listBox-item-line"></div>
            <image :src="item.productImg" class="container-listBox-item-cover" mode="aspectFill"/>
            <span class="container-listBox-item-title">{{
              item.productName
            }}</span>
            <scroll-view class="container-listBox-item-tags" scroll-x>
              <div
                class="container-listBox-item-tags-tag"
                v-for="it in item.dictList"
                :key="it.id"
              >
                {{ it.dictValue }}
              </div>
            </scroll-view>
            <span class="container-listBox-item-date"
              >时间：{{
                $dayjs(item.gathering.gameStartTime).format("YYYY-MM-DD")
              }}{{formatDate(item.gathering.gameStartTime) || ''}} {{$dayjs(item.gathering.gameStartTime).format("HH:mm")}}</span
            >
            <div class="container-listBox-item-left">
              <image
                :src="member.avatar"
                class="container-listBox-item-left-head"
                v-for="(member,idx) in item.gatheringMemberItemList.slice(0, 5)"
                :key="idx"
                :style="idx > 0 ? 'margin-left: -8px;' : ''"
              />
              <span v-if="item.gatheringMemberItemList.length > 4" class="gather-member-head-more">
                <span></span><span></span><span></span>
              </span>
              <span class="container-listBox-item-left-note">{{item.gathering.realFemaleGamerNum + item.gathering.realMaleGamerNum + item.gathering.botMaleGamerNum + item.gathering.botFemaleGamerNum}}人已上车</span>
              <span class="container-listBox-item-left-people">{{needMaleOrFeMale(item.gathering)}}</span>
            </div>
            <span class="container-listBox-item-payStatus" :class="gatherMemberOrderStatus">{{
              $enums.GatherStatusType.getName(item.gathering.gatherStatus)
            }}</span>
          </div>
          <div style="height: 20px"></div>
        </scroll-view>
        <notc-data top="20vh" v-if="!list.length"></notc-data>
      </view>
    </navigation-bar>
  </view>
</template>
<script>
import notcData from "@/components/notc-data/index.vue";
import navigationBar from "@/components/navigation-bar";
import service from "../utils/index";
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
        navTitle: '我的组局'
      },
      pageNo: 1,
      pageSize: 20,
      menus: [
        { title: "拼场中", type: "GATHERING" },
        { title: "拼场成功", type: "SUCCESS" },
        // { title: "拼场失败", type: "FAIL" }
      ],
      userInfo: null,
      list: [],
      gatherMemberOrderStatus: 'GATHERING',
      isAll: false,
      canChange: true
    };
  },
  async onLoad(options) {
    this.isAll = options.isAll;
  },
  async onShow(){
    this.pageNo = 1;
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.queryOrderList();
  },
  computed: {
    formatDate(){
      return function(date){
        return this.fnTime(date);
      }
    },
    needMaleOrFeMale(){
      return function(gather){
        if(gather.isRevertSex){
          let needCount = gather.totalGamerNum - gather.realMaleGamerNum - gather.botMaleGamerNum - gather.realFemaleGamerNum - gather.botFemaleGamerNum;
          if(needCount > 0){
            return `差${needCount}人`;
          }else{
            return "";
          }
        }
        let male = gather.maleLimitNum - gather.realMaleGamerNum - gather.botMaleGamerNum > 0 ? `差${gather.maleLimitNum - gather.realMaleGamerNum - gather.botMaleGamerNum}男`:'';
        let female = gather.femaleLimitNum - gather.realFemaleGamerNum - gather.botFemaleGamerNum > 0 ? `${male.length ? '':'差'}${gather.femaleLimitNum - gather.realFemaleGamerNum - gather.botFemaleGamerNum}女`:''
        return male + female;
      }
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onChangeTab(type) {
      if(!this.canChange)return;
      this.canChange = false;

      this.gatherMemberOrderStatus = type;
      this.pageNo = 1;
      this.queryOrderList();
    },
    onGoDetail(id){
      uni.navigateTo({
        url: `/gatherPlayer/pages/index?id=${id}`
      })
    },
    reachBottom(){
      this.pageNo++;
      this.queryOrderList();
    },
    async queryOrderList() {
      if(this.pageNo === 1){
        this.list = [];
      }
      try {
        let res = await service.playerGatheredGamePage({
          gatherStatus: this.gatherMemberOrderStatus,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          userId: this.userInfo.id,
        });
        
        if(res.records && res.records.length){
          this.list.push(...res.records);
        }
        setTimeout(()=>{
          this.canChange = true;
        },500)
      } catch (e) {
        setTimeout(()=>{
          this.canChange = true;
        },500)
      }
    },
    fnTime(time) {
      let d = new Date(time).setHours(0, 0, 0, 0);
      let today = new Date().setHours(0, 0, 0, 0);

      let obj = {
        "-86400000": "昨天",
        0: "今天",
        86400000: "明天",
      };
      return obj[d - today] || null;
    },
  },
};
</script>
<style>
.van-count-down{
  font-size: 12px !important;
}
</style>
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
.container {
  &-tabBox {
    position: fixed;
    left: rpx(16);
    right: rpx(16);
    top: 13.3vh;
    @include hor;
    &-tab {
      margin-right: 9.8vw;
      position: relative;
      span {
        font-size: rpx(14);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #a3a3a3;
      }
      &-border {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -3px;
        height: 6px;
        background: unset;
      }
    }
    .active {
      font-size: rpx(14);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 16px;
    }
    .borderActive {
      background: #14c9c9;
    }
  }
  &-listBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 18.3vh;
    &-item {
      margin: 0 rpx(15) rpx(15) rpx(15);
      height: 17.8vh;
      background: #ffffff;
      border-radius: 12px;
      position: relative;
      &-tag {
        position: absolute;
        left: rpx(15);
        top: rpx(16);
        width: rpx(18);
        height: rpx(18);
      }
      &-storeName {
        position: absolute;
        left: rpx(38);
        top: rpx(15);
        font-size: rpx(14);
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        width: 50%;
        @include text-overflow-line(1);
      }
      &-line {
        position: absolute;
        left: rpx(15);
        right: rpx(15);
        top: rpx(45);
        height: 1px;
        background: #e9e9e9;
      }
      &-cover {
        position: absolute;
        left: rpx(15);
        top: rpx(55);
        width: rpx(60);
        height: rpx(80);
        border-radius: 6px;
      }
      &-title {
        position: absolute;
        left: rpx(85);
        top: rpx(57);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        width: 55%;
        @include text-overflow-line(1);
      }
      &-tags {
        position: absolute;
        left: rpx(85);
        top: rpx(78);
        white-space: nowrap;
        width: 68vw;
        &-tag {
          display: inline-block;
          height: 16px;
          background: #f4f5f6;
          border-radius: 8px;
          padding: 0 5px;
          margin-right: 5px;
          color: #999;
          font-size: rpx(11);
        }
      }
      &-date {
        position: absolute;
        left: rpx(85);
        top: rpx(100);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
      &-left {
        position: absolute;
        left: rpx(85);
        top: rpx(120);
        &-head {
          width: 16px;
          height: 16px;
          border: 1px solid #ffffff;
          border-radius: 16px;
        }
        &-note {
          margin-left: rpx(4);
          font-size: rpx(11);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #8c9aa3;
          line-height: 14px;
        }
        &-people {
          margin-left: rpx(4);
          font-size: rpx(11);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #faa21e;
          line-height: 14px;
        }
        .gather-member-head-more {
          position: absolute;
          width: 16px;
          height: 16px;
          background: rgba(0,0,0,0.6);
          border: 1px solid #ffffff;
          border-radius: 16px;
          left: 40px;
          span {
            background: #ffffff;
            width: rpx(2);
            height: rpx(2);
            position: absolute;
            border-radius: 0rpx;
            top: 40%;
          }
          span:nth-of-type(1) {
            left: 20%;
          }
          span:nth-of-type(2) {
            left: 45%;
          }
          span:nth-of-type(3) {
            left: 70%;
          }
        }
      }
      &-payStatus {
        position: absolute;
        right: rpx(15);
        top: rpx(17);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 20px;
      }
      .GATHERING{
        color: #faa21e;
      }
      .SUCCESS{
        color: #14C9C9;
      }
      .FAIL{
        color: #999999;
      }
    }
  }
}
</style>