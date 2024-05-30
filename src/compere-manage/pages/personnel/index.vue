<template>
  <view class="personnel">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('bg-personnel')" mode="widthFix"/>
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            @click="backRoute"
            style="color: #000"
            size="50rpx"
          />
          <van-search
            v-model="searchValue"
            shape="round"
            placeholder="搜索成员名称/手机号"
            :left-icon="$iconFont.getIconName('icon-search')"
            @search="search"
            @change="search"
          />
        </view>
      </view>
      <view slot="content">
        <scroll-view class="content" scroll-y>
          <template>
            <div class="content-countBox">
              <span>共有成员</span>
              <span>{{ userList.length }}</span>
              <span>人</span>
            </div>
          </template>
          <template v-if="userList.length">
            <view
              class="content-list"
              @click="goDetail(item)"
              v-for="item in userList"
              :key="item.userId"
            >
              <image
                class="content-list-picture"
                mode="aspectFill"
                :src="$filters.processImage(item.avatar, 160)"
              />
              <view class="content-list-info">
                <view class="content-list-info-up">
                  <span class="content-list-info-up-name">{{
                    item.userName || ""
                  }}</span>
                  <image
                    mode="aspectFill"
                    :src="
                      item.sex == 'MALE'
                        ? '../../static/image/icon-male.png'
                        : '../../static/image/icon-female.png'
                    "
                  />
                  <span
                    class="content-list-info-up-solid storekeeper"
                    v-if="item.storeUserType == 'OWNER'"
                    >店主</span
                  >
                  <span
                    class="content-list-info-up-solid shopDirector"
                    v-else-if="item.storeUserType == 'SHOP_DIRECTOR'"
                    >店长</span
                  >
                  <span
                    class="content-list-info-up-solid dm"
                    v-else-if="item.storeUserType == 'DM'"
                    >主持人</span
                  >
                  <span class="content-list-info-up-solid employee" v-else
                    >员工</span
                  >
                  <span class="content-list-info-up-self" v-if="userInfo.id === item.userId"
                    >自己</span
                  >
                </view>
                <view class="content-list-info-down">{{ item.phone }}</view>
              </view>
              <image class="content-list-arrow" src="../../static/image/icon-rightArrow.png" v-if="(userInfo.storeUserType === 'OWNER' || userInfo.storeUserType === 'SHOP_DIRECTOR')"/>
            </view>
          </template>
          <notcData v-else></notcData>
        </scroll-view>
      </view>
    </navigation-bar>
    <van-action-sheet
      :show="isShowActionSheet"
      :actions="actions"
      @select="onSelectAction"
      @click-overlay="isShowActionSheet = false"
    />
    <van-action-sheet
      :show="isShowDelete"
      @click-overlay="isShowDelete = false"
    >
    <div class="popDeleteBox">
      <image :src="currentUser.avatar"/>
      <span>{{currentUser.userName || ''}}</span>
      <span>确定要移出此成员吗？</span>
      <div class="popDeleteBox-left" @click="isShowDelete = false">取消</div>
      <div class="popDeleteBox-right" @click="onDelete">移出</div>
    </div>
    </van-action-sheet>
  </view>
</template>

<script>
import notcData from "../../../components/notc-data/index.vue";
import navigationBar from "../../../components/navigation-bar";
import service from "../../utils/service";
export default {
  components: {
    notcData,
    navigationBar,
  },
  data() {
    return {
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
      },
      userList: [],
      userInfo: {}, //接收服务器返回的用户信息
      currentUser: null,
      searchValue: null,
      isShowActionSheet: false,
      isShowDelete: false,
      actions: [
        { name: '修改职位', color: '#333333' },
        { name: '权限设置', color: '#333333' },
        { name: '移出团队', color: '#FA5252' },
        { name: '取消', color: '#333333' },
      ],
    };
  },
  async onLoad() {
    this.queryUserInfo();
  },
  onShow() {
    this.searchValue = null;
    this.getDMList();
  },
  methods: {
    onSelectAction(event){
      if(event.detail.name === '修改职位'){
        uni.setStorageSync('updateUser', this.currentUser)
        uni.navigateTo({
          url: `./updateJob`,
        });
      }else if(event.detail.name === '权限设置'){
        uni.setStorageSync('updateUser', this.currentUser)
        uni.navigateTo({
          url: `./permission`,
        });
      }else if(event.detail.name === '移出团队'){
        this.isShowDelete = true;
      }
      this.isShowActionSheet = false;
    },
    backRoute() {
      uni.navigateBack();
    },
    search(event) {
      this.searchValue = event.detail;
      this.getDMList(this.searchValue);
    },
    goDetail(item) {
      //自己或者 员工主持人不能点击
      if(this.userInfo.id === item.userId || (this.userInfo.storeUserType === 'DM' || this.userInfo.storeUserType === 'EMPLOYEE'))return;

      //店长不能移除店长
      if(this.userInfo.storeUserType === 'SHOP_DIRECTOR' && item.storeUserType === 'SHOP_DIRECTOR'){
        return wx.showToast({title: '无法修改店主', icon: 'none'})
      }
      
      this.isShowActionSheet = true;
      this.currentUser = item;
    },
    async getDMList(value) {
      let res = await service.queryStoreUserPage({
        realNameOrPhone: value,
        pageNo: 1,
        pageSize: 999,
        storeId: uni.getStorageSync("storeId"),
      });
      this.userList = res.records;
    },
    //移出团队
    async onDelete(){
      try{
        await service.removeStoreUser({
          storeId: uni.getStorageSync("storeId"),
          userId: this.currentUser.userId
        })
        this.isShowDelete = false;
        this.getDMList();
      }catch(e){}
    },
    async queryUserInfo(){
      try{
        this.userInfo = await this.$checkLogin.getUserInfo();
        let data = await service.getStoreUserUserType({
          userId: this.userInfo.id,
          storeId: uni.getStorageSync("storeId")
        })
        this.userInfo['storeUserType'] = data;
        this.$nextTick(_=>{
          this.$forceUpdate();
        })
      }catch(e){}
    }
  },
};
</script>

<style lang="scss" scoped>
.personnel {
  .fixedBg {
    background: #f4f5f6;
    height: 100vh;
  }
  .topNav {
    display: flex;
    align-items: center;
    /deep/image {
      vertical-align: super !important;
    }
  }
  /deep/.van-search {
    height: rpx(36);
    padding: unset !important;
    border-radius: 60px;
    margin-left: rpx(16);
  }
  /deep/.van-search__content--round {
    background: #fff;
  }
  .content {
    &-countBox {
      margin: rpx(16) 0 rpx(10) rpx(16);
      @include hor;
      align-items: center;
      span {
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
      }
      span:nth-child(2) {
        color: #5ec9c7;
        margin: 0 rpx(4);
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
      }
    }
    &-list {
      display: flex;
      align-items: center;
      margin: rpx(0) rpx(16) rpx(16) rpx(16);
      background: #ffffff;
      border-radius: 8px;
      &-picture {
        width: rpx(44);
        height: rpx(44);
        border-radius: 50%;
        margin: rpx(16);
      }
      &-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        &-up {
          display: flex;
          align-items: center;
          &-name {
            @include text-overflow-line(1);
            max-width: 30vw;
            font-size: rpx(16);
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            line-height: rpx(22);
            margin-right: rpx(4);
            color: #333333;
          }
          image {
            width: rpx(14);
            height: rpx(14);
          }
          &-solid {
            border-radius: rpx(4);
            padding: rpx(2) rpx(5);
            font-size: rpx(10);
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            margin-left: rpx(6);
          }
          &-self {
            border: 1px solid #14C9C9;
            border-radius: rpx(4);
            padding: rpx(1) rpx(5);
            font-size: rpx(10);
            margin-left: rpx(8);
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #14C9C9;
          }
          .storekeeper {
            background: #faa21e;
          }
          .shopDirector {
            background: #faa21e;
          }
          .dm {
            background: #97b5ff;
          }
          .employee {
            background: #1ac9f9;
          }
        }
        &-down {
          font-size: rpx(12);
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: rpx(22);
        }
      }
      &-arrow{
        width: rpx(24);
        height: rpx(24);
        margin-right: rpx(16);
      }
    }
    &-audit {
      width: rpx(124);
      height: rpx(44);
      background: rgba(20, 201, 201, 0.2);
      border-radius: rpx(31);
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #14c9c9;
      line-height: rpx(44);
      text-align: center;
      position: fixed;
      bottom: rpx(73);
      left: 0;
      right: 0;
      margin: auto;
    }
  }
  .popDeleteBox{
    height: rpx(248);
    background: #FFFFFF;
    border-radius: 24px 24px 0px 0px;
    @include ver;
    align-items: center;
    position: relative;
    image{
      width: rpx(64);
      height: rpx(64);
      border: 4px solid #FFFFFF;
      border-radius: 64px;
      margin-top: rpx(20);
    }
    span:nth-child(2){
      font-size: rpx(14);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: 22px;
      margin-top: rpx(4);
    }
    span:nth-child(3){
      margin-top: rpx(16);
      font-size: rpx(18);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
    }
    &-left{
      position: absolute;
      left: rpx(16);
      bottom: rpx(28);
      width: 43.7vw;
      height: rpx(44);
      background: #E5E9ED;
      border-radius: 44px;
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #4C5657;
      @include hor-center-center;
    }
    &-right{
      position: absolute;
      right: rpx(16);
      bottom: rpx(28);
      width: 43.7vw;
      height: rpx(44);
      background: #14C9C9;
      border-radius: 44px;
      font-size: rpx(16);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #fff;
      @include hor-center-center;
    }
  }
}
</style>
