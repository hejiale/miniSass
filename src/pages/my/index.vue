<template>
  <view class="container">
    <div class="headImage">
      <image
        class="headImage-cover"
        mode="aspectFill"
        :src="homepageList.personalBackground || $iconFont.getIconName('background')"
      />
      <div class="headImage-dark" :style="backgroundColor"></div>
    </div>
    <!-- 头部区域 -->
    <scroll-view class="myheadBox" scroll-y @scroll="onScroll">
      <div class="topBox" :style="{
        'margin-top': menuRect.top + 'px',
        'margin-right': menuRect.width + 12 + 'px',
        'height': menuRect.height + 'px'
      }">
      <view @click="addClickSeting">
        <image class="setting" src="@/static/image/mys/setting.png"></image>
      </view>
      <image class="lesten" src="@/static/image/mys/listen.png"></image>
      <button open-type="contact" class="contact"/>
    </div>
      <!-- 头像名称 -->
      <view class="avatarBox">
        <image class="avatar" :src="homepageList.avatar || $iconFont.getIconName('background')"></image>
        <view class="ml12">
          <view class="useNameBox">
            <view class="useName">{{ homepageList.nickName || '微信用户' }}</view>
            <image
              v-if="homepageList.sex == 'MALE'"
              class="sex"
              src="@/static/image/mys/sexM.png"
            ></image>
            <image v-else class="sex" src="@/static/image/mys/sexW.png"></image>
          </view>
          <view class="text1" @click="onCopy">
            <view>ID:</view>
            <view class="ml4">{{ homepageList.juyouId }}</view>
            <image class="copy" src="@/static/image/mys/copy.png"></image>
            <view>IP属地:</view>
            <view class="ml4">{{cityName}}</view>
          </view>
        </view>
      </view>
      <!-- 文字部分 -->
      <view @click.stop="onEditDesc">
        <view class="text2">
          <view v-if="userInfo.personSign">{{userInfo.personSign}}</view>
          <view v-else>增加个人描述，让大家更好认识你</view>
          <image class="edit" src="@/static/image/mys/edit.png" v-if="!userInfo.personSign"></image>
        </view>
      </view>
      <!--  粉丝 关注 获赞 -->
      <view class="fsgzhz">
        <view class="fensi">
          <view class="num">{{ $filters.formatNum(homepageList.fansNum) }}</view>
          <view class="title">粉丝</view>
        </view>
        <view class="guanzhu">
          <view class="num">{{ $filters.formatNum(homepageList.followerNum) }}</view>
          <view class="title">关注</view>
        </view>
        <view class="huozan">
          <view class="num">{{ $filters.formatNum(homepageList.sumPraiseCount) }}</view>
          <view class="title">获赞</view>
        </view>
        <view class="qwshouye" @click="myUpdates">
          <view>前往主页</view>
          <image
            class="shouyeIcon"
            src="@/static/image/mys/rightIcon2.png"
          ></image>
        </view>
      </view>
      <!-- 我的订单 -->
      <view class="mydd">
        <view @click="myOrder" class="mydd-item">
          <image class="imageIcon" src="@/static/image/mys/order.png"></image>
          <view class="title">我的订单</view>
        </view>
        <view @click="addClickmydongt" class="mydd-item">
          <image class="imageIcon" src="@/static/image/mys/dongtai.png"></image>
          <view class="title">我的动态</view>
        </view>
        <!-- <view class="mydd-item">
          <image
            class="imageIcon"
            src="@/static/image/mys/shouchang.png"
          ></image>
          <view class="title">我的收藏</view>
        </view> -->
        <view @click="addClickperson" class="mydd-item">
          <image class="imageIcon" src="@/static/image/mys/person.png"></image>
          <view class="title">个人资料</view>
        </view>
        <bindPhone ref="bindPhone" paddingBottom="12vh" @on-success-authorize="onSuccessAuthorize" v-if="!userInfo.phone"/>
      </view>
      <!-- 底部滚动区域 -->
      <view class="myshowtime">
        <!-- 我的店铺 -->
        <div class="mystore" :style="storeBgColor" v-if="hasStore" @click="onGoMyStore">
          <!-- <image class="mystore-cover" /> -->
          <image
            class="mystore-storeTag"
            src="@/static/image/mys/icon-store.png"
          />
          <span class="mystore-storeTitle">我的店铺</span>
          <span class="mystore-all">查看全部</span>
          <van-icon name="arrow" class="mystore-arrow" color="#fff" />
        </div>
        <!-- 我的剧游时光 -->
        <view
          class="myshowtimehead"
          :style="hasStore ? 'margin-top: 14px;' : ''"
        >
          <view class="juyoutaime">
            <view class="textName">我的剧游时光</view>
            <view class="textBox">
              <view class="text">已记录</view>
              <view class="text">{{ homepageList.dramaLifeTime }}</view>
              <view class="text">天</view>
            </view>
          </view>
          <view class="xiangwan">
            <view @click="addClickXW" class="xiangwan-item">
              <view class="xiangwan-num">{{ homepageList.wantPlayNum || 0 }}</view>
              <view class="xiangwan-text">想玩</view>
            </view>
            <view class="xiangwan-line"></view>
            <view @click="addClickWG" class="xiangwan-item">
              <view class="xiangwan-num">{{ homepageList.playedNum || 0 }}</view>
              <view class="xiangwan-text">玩过</view>
            </view>
            <view class="xiangwan-line"></view>
            <view class="xiangwan-item" @click="onGoEvaluate">
              <view class="xiangwan-num">{{
                homepageList.sumDramaEvaluate || 0
              }}</view>
              <view class="xiangwan-text">剧评</view>
            </view>
          </view>
        </view>
        <view class="stepsBox">
          <view class="line_one">
            <view class="dian1"></view>
            <view class="moreTime" @click="openMoreTime">开启更多时光+</view>
          </view>
          <!-- 开启剧游时光 -->
          <view v-for="(itemA, indexA) in openjuyouTimeList" :key="indexA">
            <view class="lineone" v-if="indexA === 0"></view>
            <view class="line_circle" :style="{'top': menuRect.top + menuRect.height + 8 + 'px'}">
              <div class="line_circle-left">
                <view class="line_circle-left-line"></view>
                <view class="bigPoint"></view>
                <view class="line_circle-left-line"></view>
              </div>
              <view class="time2">{{ itemA.partitionDate }}</view>
            </view>
            <!-- 具有时光item部分 -->
            <view v-for="(itemB, indexB) in itemA.partitionStage" :key="indexB">
              <view
                v-for="(itemC,idx) in itemB.userLiftRecordVo"
                :key="idx"
                class="group"
              >
                <view class="line_tow">
                  <view class="dian">
                    <view class="yuanquan"></view>
                  </view>
                  <view class="linethree"></view>
                </view>
                <!-- 已评价的情况  -->
                <view
                  class="linethree_box"
                  v-if="itemC.hasEvaluate"
                >
                  <view class="linethree_box-top">
                    <view class="time3">{{
                      $dayjs(itemC.localDate).format("MM.DD")
                    }}</view>
                    <view
                      class="playedjuben"
                      v-if="itemC.userLiftTimeEnum == 'DRAMA_WANT_PLAY_FLAG'"
                    >
                      想玩的剧本</view
                    >
                    <view
                      class="playedjuben"
                      v-else-if="itemC.userLiftTimeEnum == 'DRAMA_PLAYED_FLAG'"
                    >
                      玩过的剧本</view
                    >
                  </view>
                  <view class="contentBox">
                    <view class="textbox2" v-if="itemC.hasEvaluate">
                      <view class="text1">
                        <span class="nickName">{{ userInfo.nickName }}</span>
                        觉得
                        <span class="dramaName">{{
                          itemC.dramaItem.dramaName
                        }}</span>
                        {{evaluateText(itemC.dramaEvaluateDetail ? itemC.dramaEvaluateDetail.dramaEvaluateType: null)}}
                        <image :src="evaluateType(itemC.dramaEvaluateDetail ? itemC.dramaEvaluateDetail.dramaEvaluateType: null)" class="dramaEvaluateType"/>
                      </view>
                      <view class="text2">{{
                        scoreStr(
                          itemC.dramaEvaluateDetail
                            ? itemC.dramaEvaluateDetail.scoreList
                            : ""
                        )
                      }}</view>
                    </view>
                    <view class="text3" v-if="itemC.hasEvaluate">{{
                      itemC.dramaEvaluateDetail.content
                    }}</view>
                    <view class="content" @click.stop="gotoJuBenDetail(itemC)">
                      <image
                        class="picturebox"
                        mode="aspectFill"
                        :src="itemC.dramaItem.dramaCover"
                      >
                      </image>
                      <image
                        class="sellType"
                        mode="aspectFill"
                        :src="$iconFont.getIconName(itemC.dramaItem.sellType)"
                      >
                      </image>
                      <image class="logo" src=""></image>
                      <view class="rightBox">
                        <view class="titletext">
                          {{ itemC.dramaItem.dramaName }}</view
                        >
                        <view class="textBox">
                          <view class="timeymd"
                            >{{
                              $dayjs(itemC.dramaItem.updateTime).format(
                                "YYYY-MM-DD"
                              )
                            }}发行 </view
                          >
                          <view class="line"></view>
                          <view class="dramaTheme">
                            {{ dramaTheme(itemC.dramaItem.dramaThemeList) }}
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
                <!-- 未评价的情况 -->
                <view
                  class="linethree_box"
                  v-else-if="itemC.userLiftTimeEnum !== 'FIRST_TIME' && !itemC.hasEvaluate"
                >
                  <view class="linethree_box-top">
                    <view class="time3">{{
                      $dayjs(itemC.localDate).format("MM.DD")
                    }}</view>
                    <view
                      class="playedjuben"
                      v-if="itemC.userLiftTimeEnum == 'DRAMA_WANT_PLAY_FLAG'"
                    >
                      想玩的剧本</view
                    >
                    <view
                      class="playedjuben"
                      v-else-if="itemC.userLiftTimeEnum == 'DRAMA_PLAYED_FLAG'"
                    >
                      玩过的剧本</view
                    >
                  </view>
                  <view class="contentBox2" @click.stop="gotoJuBenDetail(itemC)">
                    <image
                      class="leftBox"
                      :src="itemC.dramaItem.dramaCover"
                      mode="aspectFill"
                    />
                    <image
                        class="sellType"
                        mode="aspectFill"
                        :src="$iconFont.getIconName(itemC.dramaItem.sellType)"
                      >
                    </image>
                    <view class="rightBox">
                      <view class="rightBox2">
                        <view class="titleText">{{
                          itemC.dramaItem.dramaName
                        }}</view>
                      </view>
                      <!--  发行时间 和类型-->
                      <view class="timeType">
                        <view class="time"
                          >{{
                            $dayjs(itemC.dramaItem.updateTime).format(
                              "YYYY-MM-DD"
                            )
                          }}发行 </view
                        >
                        <view class="line"></view>
                        <view class="typecl">
                          {{ dramaTheme(itemC.dramaItem.dramaThemeList) }}
                        </view>
                      </view>
                      <!-- 作者 -->
                      <view class="zuozheBox">
                        <view>
                          作者: {{ authorName(itemC.dramaItem.authorItems) }}
                        </view>
                      </view>
                      <!-- 发行 -->
                      <view class="faxingBox">
                        <view class="publisherName"
                          >发行: {{
                            publisherName(itemC.dramaItem.publishers)
                          }}</view
                        >
                      </view>
                    </view>
                    <view
                      class="pingjiaBox"
                      @click.stop="gotoDetailJuBen(itemC)"
                      v-if="itemC.userLiftTimeEnum === 'DRAMA_PLAYED_FLAG' && itemC.hasEvaluate === false"
                    >
                      <view class="pingjia">去评价</view>
                    </view>
                    <view
                      v-else
                      class="zujuBox"
                      @click.stop="gotoDetailZuJu(itemC)"
                    >
                      <view class="zuju">去组局</view>
                    </view>
                  </view>
                </view>
                <!-- 首次开启 -->
                <view
                  class="linethree_box"
                  v-else-if="itemC.userLiftTimeEnum == 'FIRST_TIME'"
                >
                  <view class="linethree_box-top">
                    <view class="time3">{{ itemC.localDate }}</view>
                    <view class="playedjuben">加入剧游宇宙</view>
                  </view>
                  <image
                    class="juyouFristDay"
                    :src="$iconFont.getIconName('juyoutime')"
                  >
                  </image>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view
      class="fixedHead"
      v-if="showheadBox"
      :style="{
        'padding-top': menuRect.top + 'px',
        height: menuRect.height + 'px',
      }"
    >
      <image class="logotouxiang" :src="homepageList.avatar"></image>
      <view class="fixedHead-userName">{{ homepageList.nickName }}</view>
      <view @click="addClickSeting">
        <image class="setting" src="@/static/image/mys/setting.png"></image>
      </view>
      <image class="lesten" src="@/static/image/mys/listen.png"></image>
      <button open-type="contact" class="contact"/>
    </view>
    <tabBar :active="1" />
  </view>
</template>
<script>
import tabBar from "../../components/tabBar/index.vue";
import { getMenuButtonRect, windowHeight, getColor } from "@/utils/index";
import bindPhone from "@/components/bindPhone/index.vue";
export default {
  components: {
    tabBar,
    bindPhone
  },
  data() {
    return {
      showheadBox: false,
      openjuyouTimeList: [], // 开启剧游时光
      homepageList: [], // 查询我的列表信息
      userInfo: null,
      menuRect: null,
      bgColor: '28,46,44',
      hasStore: false,
      show: false,
      windowHeight: 0
    };
  },
  async onLoad() {
    wx.showLoading();
    this.menuRect = await getMenuButtonRect();
    this.windowHeight = await windowHeight();
  },
  async onShow() {
    this.userInfo = await this.$checkLogin.getUserInfo(true);
    await this.querySelfStores();
    await this.getHomePage();
    wx.hideLoading();
  },
  computed: {
    scoreStr() {
      return function (scoreList) {
        if (!scoreList) return "";
        let arr = [];
        scoreList.map((v) => {
          arr.push(`${v.dictValue} ${v.score / 10}`);
        });
        return arr.join(" ");
      };
    },
    dramaTheme() {
      return function (dramaTheme) {
        let arr = [];
        arr = dramaTheme.map((v) => v.dictValue);
        return arr.join("&");
      };
    },
    publisherName() {
      return function (publisher) {
        let arr = [];
        arr = publisher.map((v) => v.publisherName);
        return arr.join("&");
      };
    },
    authorName() {
      return function (author) {
        let arr = [];
        arr = author.map((v) => v.authorName);
        return arr.join("&");
      };
    },
    evaluateType() {
      return function (evaluateType) {
        if (!evaluateType) return "";
        return evaluateType === "RECOMMEND"
          ? this.$iconFont.getIconName("evaluate-nice")
          : evaluateType === "SO_SO"
          ? this.$iconFont.getIconName("evaluate-normal")
          : this.$iconFont.getIconName("evaluate-no");
      };
    },
    evaluateText() {
      return function (evaluateType) {
        if (!evaluateType) return "";
        return evaluateType === "RECOMMEND"
          ? "推荐"
          : evaluateType === "SO_SO"
          ? "一般"
          : "不行";
      };
    },
    cityName() {
      return uni.getStorageSync("cityInfo").city || '未知';
    },
    backgroundColor(){
      return `background: linear-gradient(180deg, rgba(${this.bgColor},0.8) 0%, rgba(${this.bgColor}) 100%`;
    },
    storeBgColor(){
      return `background: rgba(${this.bgColor});`;
    }
  },
  methods: {
    //授权成功
    async onSuccessAuthorize(){
      this.userInfo = await this.$checkLogin.getUserInfo(true);
      await this.getHomePage();
    },
    onScroll(e) {
      console.log(e);
      if (e.detail.scrollTop > this.windowHeight * 0.194) {
        this.showheadBox = true;
      } else {
        this.showheadBox = false;
      }
    },
    onCopy() {
      uni.setClipboardData({
        data: this.homepageList.juyouId,
        success: function () {
          uni.showToast({
            title: "复制成功",
          });
        },
      });
    },
    onGoEvaluate(){
      uni.navigateTo({
        url: '/my-package/pages/myEvaluate'
      })
    },
    addClickXW() {
      if(!this.userInfo.phone){
        this.$refs['bindPhone'].onAuthorize();
        return;
      }
      uni.navigateTo({
        url: `/my-package/pages/wantPlayBen/index?index=${0}&userId=${this.userInfo.id}`,
      });
    },
    addClickWG() {
      if(!this.userInfo.phone){
        this.$refs['bindPhone'].onAuthorize();
        return;
      }
      uni.navigateTo({
        url: `/my-package/pages/wantPlayBen/index?index=${1}&userId=${this.userInfo.id}`,
      });
    },
    // 点击设置
    addClickSeting() {
      uni.navigateTo({
        url: "/my-package/pages/setting-Infor",
      });
    },
    addClickperson() {
      if(!this.userInfo.phone){
        return;
      }
      uni.navigateTo({
        url: "/my-package/pages/personal-Infor",
      });
    },
    // 点击我的动态
    addClickmydongt() {
      if(!this.userInfo.phone){
        this.$refs['bindPhone'].onAuthorize();
        return;
      }
      uni.navigateTo({
        url: `/my-package/pages/dynamicState/index?userId=${this.userInfo.id}`,
      });
    },
    onEditDesc() {
      if(!this.userInfo.phone){
        this.$refs['bindPhone'].onAuthorize();
        return;
      }
      uni.navigateTo({
        url: "/my-package/pages/editUserDesc",
      });
    },
    // 前往首页
    myUpdates() {
      if(!this.userInfo.phone){
        this.$refs['bindPhone'].onAuthorize();
        return;
      }
      uni.navigateTo({
        url: `/my-package/pages/trends/index?userId=${this.userInfo.id}`,
      });
    },
    // 去剧本详情
    gotoJuBenDetail(itemC) {
      uni.navigateTo({
        url: "/pageDetail/pages/pageDetail?id=" + itemC.$orig.dramaId,
      });
    },
    //去我的店铺
    onGoMyStore() {
      uni.navigateTo({
        url: "/my-package/pages/havenstore-entry",
      });
    },
    // 我的订单
    myOrder() {
      if(!this.userInfo.phone){
        return;
      }
      uni.navigateTo({
        url: "/my-package/pages/orderList",
      });
    },
    // 开启更多时光
    openMoreTime() {
      wx.navigateTo({
        url: "/city-gathering/pages/index",
      });
    },
    gotoDetailJuBen(item) {
      uni.navigateTo({
        url: "/pageDetail/pages/pageDetail?id=" + item.$orig.dramaId,
      });
    },
    // 去组局
    gotoDetailZuJu(itemC) {
      uni.navigateTo({
        url: `/gatherPlayer/pages/goGather?dramaId=${itemC.$orig.dramaId}`,
      });
    },
    //我的列表信息查询
    async getHomePage() {
      try {
        let res = await this.$api.homePage({});
        
        //获取首次加入时间
        let createTime = res.createTime;
        let createYear = new Date(createTime).getFullYear();
        let createMonth = new Date(createTime).getMonth() + 1;

        if(res.userLifeTimeVos.length){
          //处理日期数组
          res.userLifeTimeVos.map((v) => {
            let dates = [];
            v.partitionStage.map((part) => {
              part.userLiftRecordVo.map((lift) => {
                dates.push(lift);
              });
            });
            v.partitionStage = [{ userLiftRecordVo: dates }];
          });

          let lastLife = res.userLifeTimeVos[res.userLifeTimeVos.length - 1];
          let year = new Date(lastLife.partitionDate).getFullYear();
          let month = new Date(lastLife.partitionDate).getMonth() + 1;
          //在同一个月
          if (createYear === year && createMonth === month) {
            lastLife.partitionStage[0].userLiftRecordVo.push({
              partitionDate: this.$dayjs(createTime).format("MM.DD"),
              userLiftTimeEnum: "FIRST_TIME",
              localDate: this.$dayjs(createTime).format("MM.DD"),
            });
          }
          //不在同一个月
          else {
            res.userLifeTimeVos.push({
              partitionDate: this.$dayjs(createTime).format("YYYY.MM"),
              partitionStage: [
                {
                  partitionDate: this.$dayjs(createTime).format("MM.DD"),
                  userLiftRecordVo: [
                    {
                      partitionDate: this.$dayjs(createTime).format("MM.DD"),
                      userLiftTimeEnum: "FIRST_TIME",
                      localDate: this.$dayjs(createTime).format("MM.DD"),
                    },
                  ],
                },
              ],
            });
          }
        }else{
          //首次注册的情况
          res.userLifeTimeVos = [{
            partitionDate: this.$dayjs(createTime).format("YYYY.MM"),
            partitionStage: [{
              userLiftRecordVo: [{
                userLiftTimeEnum: 'FIRST_TIME',
                localDate: this.$dayjs(createTime).format("MM.DD")
              }]
            }]
          }]
        }
        

        this.homepageList = res;
        this.openjuyouTimeList = res.userLifeTimeVos;
        this.bgColor = await getColor(
          res.personalBackground || this.$iconFont.getIconName("background")
        );
        this.show = true;
      } catch (e) {
        console.log(e);
      }
    },
    //查询自己加入过的店铺
    async querySelfStores() {
      try {
        let data = await this.$api.getMyStoreQrCode({
          userId: this.userInfo.id,
        });
        this.hasStore = data && data.length;
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  background: #f2f2f2;
}
.status-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 92rpx;
  margin: 30rpx;
  background-color: #007aff;
}
.example-body {
  display: block;
  padding: 15px;
  flex-direction: row;
}
.myheadBox {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: scroll;
  .avatarBox {
    display: flex;
    align-items: center;
    margin: 40rpx 24rpx 36rpx 32rpx;
    position: relative;
    .avatar {
      width: 124rpx;
      height: 124rpx;
      background: #dad9dc;
      box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.2);
      border-radius: 70rpx 70rpx 70rpx 70rpx;
      opacity: 1;
      border: 4rpx solid #ffffff;
    }
    .useNameBox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .useName {
        font-size: 38rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        max-width: 26vw;
        @include text-overflow-line(1);
        color: rgba($color: #fff, $alpha: 0.9);
      }
      .sex {
        margin-left: 12rpx;
        height: 32rpx;
        width: 32rpx;
      }
    }
    .text1 {
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      display: flex;
      justify-content: flex-start;
      width: 100%;
      margin-top: 4rpx;
      color: rgba($color: #fff, $alpha: 0.6);
      .copy {
        width: 32rpx;
        height: 32rpx;
        margin-right: 28rpx;
        margin-left: 4rpx;
      }
    }
  }
  .text2 {
    width: 92%;
    display: flex;
    justify-content: flex-start;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba($color: #fff, $alpha: 0.7);
    margin-left: 32rpx;
    margin-top: 6rpx;
    .edit {
      width: 36rpx;
      height: 36rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      margin-left: 2rpx;
    }
  }
  .fsgzhz {
    display: flex;
    justify-content: flex-start;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    margin-top: 40rpx;
    .qwshouye {
      width: 188rpx;
      height: 66rpx;
      border-radius: 44rpx 44rpx 44rpx 44rpx;
      border: 1rpx solid rgba(255, 255, 255, 0.7);
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba($color: #fff, $alpha: 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 196rpx;
      .shouyeIcon {
        width: 20rpx;
        height: 20rpx;
      }
      .rightIcon2 {
        margin-left: 4rpx;
        width: 22rpx;
        height: 20rpx;
      }
    }
    .num {
      font-size: 28rpx;
      font-family: OPPOSans-Heavy, OPPOSans;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 4rpx;
      text-align: center;
    }
    .fensi {
      margin-left: 32rpx;
    }
    .guanzhu {
      margin-left: 82rpx;
    }
    .huozan {
      margin-left: 76rpx;
    }
    .title {
      color: rgba($color: #fff, $alpha: 0.7);
    }
  }
  // 我的订单
  .mydd {
    padding: 40rpx 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.13) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    border-radius: 44rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.12);
    margin: 36rpx 10rpx 0 10rpx;
    display: flex;
    align-items: center;
    position: relative;
    &-item {
      @include ver;
      align-items: center;
      flex: 1;
    }
    .imageIcon {
      width: 56rpx;
      height: 56rpx;
    }
    .title {
      font-size: 26rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba($color: #fff, $alpha: 0.6);
      margin-top: 12rpx;
    }
  }
  .myshowtime {
    background: #f2f2f2;
    border-radius: 50rpx 50rpx 0rpx 0rpx;
    margin-top: 32rpx;
    padding-top: 28rpx;
    min-height: 50vh;
    position: relative;
    .mystore {
      margin-left: 24rpx;
      width: 93.6vw;
      height: 120rpx;
      border-radius: 24rpx;
      position: relative;
      @include hor;
      align-items: center;
      overflow: hidden;
      backdrop-filter: blur(20px);
      // &-cover {
      //   @include abscenter;
      //   background: rgba($color: #2e221c, $alpha: 0.63);
      //   backdrop-filter: blur(20px);
      // }
      &-storeTag {
        position: absolute;
        width: 42rpx;
        height: 42rpx;
        left: 30rpx;
      }
      &-storeTitle {
        position: absolute;
        left: 84rpx;
        font-size: 32rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
      &-all {
        position: absolute;
        right: 56rpx;
        font-size: 28rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: rgba($color: #fff, $alpha: 0.6);
      }
      &-arrow {
        position: absolute;
        right: 30rpx;
        transform: translateY(1rpx);
      }
    }
    .myshowtimehead {
      width: 93.6vw;
      height: 202rpx;
      background: #ffffff;
      border-radius: 24rpx;
      margin: 0 24rpx;
      @include ver;
      .juyoutaime {
        display: flex;
      }
      .textName {
        font-size: 30rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e323e;
        margin-left: 24rpx;
        margin-top: 24rpx;
      }
      .textBox {
        display: flex;
        margin-top: 28rpx;
        margin-left: 12rpx;
      }
      .text {
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #919191;
      }
      .xiangwan {
        width: 100%;
        display: flex;
        &-item {
          @include ver;
          align-items: center;
          flex: 1;
        }
        &-num {
          font-size: 30rpx;
          font-family: OPPOSans-Heavy, OPPOSans;
          font-weight: 800;
          color: #2e323e;
          margin-top: 34rpx;
        }
        &-line {
          width: 0rpx;
          height: 32rpx;
          border-radius: 1rpx 1rpx 1rpx 1rpx;
          opacity: 1;
          border: 2rpx solid #e9ebef;
          margin-top: 58rpx;
        }
        &-text {
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          margin-top: 4rpx;
        }
      }
    }
    .stepsBox {
      padding-bottom: 12vh;
      .line_one {
        display: flex;
        .dian1 {
          width: 12rpx;
          height: 12rpx;
          background: #2e323e;
          border-radius: 50%;
          margin-top: 80rpx;
          margin-left: 48rpx;
        }
        .moreTime {
          width: 304rpx;
          height: 84rpx;
          background: linear-gradient(90deg, #36e4bb 0%, #abdb24 100%);
          border-radius: 42rpx 42rpx 42rpx 42rpx;
          border: 2rpx solid #ffffff;
          font-size: 28rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          @include hor-center-center;
          margin-top: 44rpx;
          margin-left: 20rpx;
        }
      }
      .line_circle {
        @include hor;
        padding-left: 48rpx;
        position: sticky;
        z-index: 2;
        background: #f2f2f2;
        &-left {
          @include ver;
          height: 100%;
          &-line {
            width: 4rpx;
            height: 100%;
            background: #ebebed;
            margin-left: 4rpx;
            height: 60rpx;
          }
        }
        .time2 {
          margin-left: 20rpx;
          font-size: 40rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #2e323e;
          height: 132rpx;
          line-height: 132rpx;
          display: flex;
          flex: 1;
        }
      }
      .line_tow {
        @include hor;
        margin-left: 40rpx;
      }
      .bigPoint {
        width: 12rpx;
        height: 12rpx;
        background: #2e323e;
        border-radius: 50%;
      }
      .dian {
        width: 28rpx;
        height: 28rpx;
        background: #a082bc;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        opacity: 0.2;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .yuanquan {
          width: 12rpx;
          height: 12rpx;
          background: #2e323e;
          border-radius: 50%;
        }
      }
      .lineone {
        width: 4rpx;
        height: 110rpx;
        background: #ebebed;
        margin-left: 52rpx;
        margin-top: -48rpx;
      }
      .linetwo {
        width: 4rpx;
        height: 22rpx;
        background: #ebebed;
      }
      .linethree {
        width: 4rpx;
        background: #ebebed;
        margin-left: -16rpx;
        margin-top: 28rpx;
        height: 110%;
      }
      .linefouur {
        width: 4rpx;
        height: 62rpx;
        background: #ebebed;
        margin-left: 52rpx;
      }
      .fourBox {
        display: flex;
        justify-content: flex-start;
      }
      .line_four {
        width: 28rpx;
        height: 28rpx;
        background: #a082bc;
        opacity: 0.2;
        margin-left: 40rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .dian4 {
          width: 12rpx;
          height: 12rpx;
          background: #a082bc;
          border-radius: 50%;
        }
      }
      .group {
        display: flex;
        padding-bottom: 64rpx;
      }
      .linethree_box {
        @include ver;
        margin-top: -8rpx;
        margin-left: 28rpx;
        &-top {
          padding-bottom: 18rpx;
          .time3 {
            font-size: 32rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            color: #2e323e;
          }
          .playedjuben {
            font-size: 26rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #5f6572;
          }
        }
        .contentBox {
          width: 86vw;
          padding-bottom: 30rpx;
          background: #ffffff;
          border-radius: 12rpx;
          .textbox2 {
            @include hor-between-center;
            .text1 {
              @include hor;
              align-items: center;
              margin-top: 30rpx;
              margin-left: 24rpx;
              font-size: 24rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #959aa5;
              margin-bottom: 12rpx;
              .nickName {
                max-width: 10vw;
                margin-right: 4rpx;
                @include text-overflow-line(1);
              }
              .dramaName {
                max-width: 20vw;
                margin-right: 4rpx;
                @include text-overflow-line(1);
              }
              .dramaEvaluateType {
                margin-left: 6rpx;
                width: 30rpx;
                height: 30rpx;
              }
            }
            .text2 {
              font-size: 20rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #959aa5;
              margin: 32rpx 24rpx 16rpx 0rpx;
              @include text-overflow-line(1);
              max-width: 30vw;
              text-align: right;
            }
          }
          .text3 {
            font-size: 28rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #2e323e;
            width: 78vw;
            margin-left: 24rpx;
            @include text-overflow-line(1);
          }
          .content {
            width: 598rpx;
            height: 112rpx;
            background: #f5f6f8;
            border-radius: 6rpx;
            margin: 0 auto;
            display: flex;
            justify-content: flex-start;
            position: relative;
            margin-top: 18rpx;
            .picturebox {
              width: 84rpx;
              height: 112rpx;
              border-radius: 6rpx;
              background-color: #a082bc;
            }
            .sellType {
              position: absolute;
              left: 0px;
              top: 0px;
              width: 48rpx;
              height: 28rpx;
            }
            .logo {
              width: 48rpx;
              height: 28rpx;
              border-radius: 6rpx;
              position: absolute;
              left: 0;
              top: 0;
            }
            .rightBox {
              display: flex;
              flex-direction: column;
              .titletext {
                font-size: 26rpx;
                font-family: PingFang SC, PingFang SC;
                font-weight: 600;
                color: #2e323e;
                margin-top: 20rpx;
                margin-left: 18rpx;
              }
              .textBox {
                display: flex;
                font-size: 24rpx;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                color: #959aa5;
                align-items: center;
                margin-top: 18rpx;
                .timeymd {
                  margin-left: 18rpx;
                }
                .line {
                  width: 2rpx;
                  height: 22rpx;
                  background: #d9d9d9;
                  margin: 0 8rpx;
                }
                .qinggan {
                  @include text-overflow-line(1);
                  width: 60%;
                }
              }
            }
          }
        }
        .contentBox2 {
          width: 646rpx;
          padding-bottom: 30rpx;
          background: #ffffff;
          border-radius: 18rpx;
          display: flex;
          position: relative;
          .leftBox {
            width: 138rpx;
            height: 184rpx;
            border-radius: 12rpx;
            background-color: #36e4bb;
            margin: 24rpx;
          }
          .sellType {
            position: absolute;
            left: 24rpx;
            top: 24rpx;
            width: 48rpx;
            height: 28rpx;
          }
          .rightBox {
            width: 71%;
            position: relative;
            .rightBox2 {
              display: flex;
              justify-content: flex-start;
              .titleText {
                font-size: 32rpx;
                font-family: PingFang SC, PingFang SC;
                font-weight: 600;
                color: #2e323e;
                margin-top: 32rpx;
                width: 300rpx;
                margin-right: 40rpx;
                @include text-overflow-line(1);
              }
            }
            .timeType {
              display: flex;
              justify-content: flex-start;
              margin-top: 12rpx;
              font-size: 24rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #5f6572;
              .time {
                margin-right: 5rpx;
              }
              .line {
                width: 2rpx;
                height: 22rpx;
                background: #d9d9d9;
                margin: 0 8rpx;
                margin-top: 6rpx;
              }
              .typecl {
                @include text-overflow-line(1);
                width: 50%;
              }
            }
            .zuozheBox {
              display: flex;
              justify-content: flex-start;
              font-size: 24rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #5f6572;
              margin-top: 8rpx;
              @include text-overflow-line(1);
            }
            .faxingBox {
              display: flex;
              font-size: 24rpx;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #5f6572;
              margin-top: 6rpx;
              width: 90%;
              .publisherName {
                @include text-overflow-line(1);
              }
            }
          }
        }
        .zujuBox {
          position: absolute;
          right: 18rpx;
          top: 32rpx;
          width: 100rpx;
          height: 44rpx;
          background: linear-gradient(180deg, #36e4bb 74%, #b7e436 100%);
          border-radius: 25rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .zuju {
            width: 92rpx;
            height: 40rpx;
            background: #111111;
            border-radius: 27rpx;
            font-size: 20rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            @include hor-center-center;
          }
        }
        .pingjiaBox {
          position: absolute;
          right: 18rpx;
          top: 32rpx;
          width: 100rpx;
          height: 44rpx;
          background: linear-gradient(180deg, #fd3b3b 60%, #eecf5f 100%);
          border-radius: 78rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .pingjia {
            width: 92rpx;
            height: 40rpx;
            background: #111111;
            border-radius: 27rpx 27rpx 27rpx 27rpx;
            font-size: 20rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            // z-index: 99;
          }
        }
      }
      .juyouFristDay {
        width: 646rpx;
        height: 200rpx;
        border-radius: 18rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.67);
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.headImage {
  width: 100vw;
  height: 60vh;
  position: fixed;
  left: 0;
  top: 0;
  &-cover {
    width: 100%;
  }
  &-dark {
    @include abscenter;
    // background: linear-gradient(180deg, rgba(28, 34, 46, 0.8) 0%, #1c222e 100%);
    // background: linear-gradient(180deg, rgba(46,34,28,0.8) 0%, #2E221C 100%);
  }
}
.fixedHead {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  padding-bottom: 16rpx;
  .logotouxiang {
    width: 56rpx;
    height: 56rpx;
    background: #2e323e;
    border-radius: 0rpx 0rpx 0rpx 0rpx;
    opacity: 1;
    border-radius: 50%;
    margin-left: 20rpx;
  }
  &-userName {
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #2e323e;
    margin-left: 12rpx;
    width: 35vw;
    @include text-overflow-line(1);
  }
  .setting {
    position: absolute;
    width: 56rpx;
    height: 56rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    bottom: 16rpx;
    right: 39.46vw;
  }
  .lesten {
    position: absolute;
    width: 56rpx;
    height: 56rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    bottom: 16rpx;
    right: 28.26vw;
  }
  .contact {
    position: absolute;
    width: 56rpx;
    height: 56rpx;
    bottom: 16rpx;
    right: 28.26vw;
    background: unset !important;
  }
  button::after {
    border: none !important;
  }
}
.topBox {
  @include hor;
  align-items: center;
  margin-left: 0px;
  position: relative;
  place-content: flex-end;
  .setting {
    width: 56rpx;
    height: 56rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    margin-right: 28rpx;
  }
  .lesten {
    width: 56rpx;
    height: 56rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
  }
  .contact {
    position: absolute;
    right: 0px;
    width: 56rpx;
    height: 100%;
    background: unset !important;
  }
  button::after {
    border: none !important;
  }
}
</style>
  