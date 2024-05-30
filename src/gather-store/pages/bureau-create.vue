<template>
  <div class="bureauCreate">
    <div class="fixedBg"></div>
    <navigationBar :nav="customNav">
      <view slot="left" @click="backRoute">
        <view class="topNav">
          <van-icon
            name="arrow-left"
            style="color: #000"
            size="50rpx"
          />
        </view>
      </view>
    </navigationBar>
    <div class="content">
      <div class="content-item">
        <div class="content-item-top" @click="onDramaList">
          <div class="content-item-top-left">
            <image src="../static/image/icon-create-drama.png" />
            <span>选择剧本</span>
          </div>
          <div class="content-item-top-right">
            <van-icon name="arrow" style="color: #000" size="28rpx" />
          </div>
        </div>
        <div class="content-item-bottom" v-if="dramaInfo">
          <div class="content-item-bottom-left">
            <image :src="dramaInfo.dramaCover" mode="aspectFill"/>
            <div class="content-item-bottom-left-tag LIMITED">
              {{ $enums.SellType.getName(dramaInfo.sellType) }}
            </div>
          </div>
          <div class="content-item-bottom-right">
            <div class="content-item-bottom-right-title">
              {{ dramaInfo.dramaName }}
            </div>
            <div class="content-item-bottom-right-gameNum">
              {{ dramaInfo.maleGamerNum > 0 ? `${dramaInfo.maleGamerNum}男`:'' }}{{ dramaInfo.femaleGamerNum > 0 ?  `${dramaInfo.femaleGamerNum}女`:'' }}
            </div>
            <scroll-view class="content-item-bottom-right-tag" scroll-x>
              <span v-for="item in dramaInfo.dramaThemeList" :key="item.id">{{
                item.dictValue
              }}</span>
            </scroll-view>
          </div>
        </div>
      </div>
      <div class="content-item" @click="$refs.modalDate.showCaledar = true">
        <div class="content-item-top">
          <div class="content-item-top-left">
            <image src="../static/image/icon-create-date.png" />
            <span>选择时间</span>
          </div>
          <div class="content-item-top-right">
            <span class="text" v-if="currentDate"
              >{{ $dayjs(currentDate).format("MM月DD日") }} {{ week }}
              {{ $dayjs(currentDate).format("HH:mm") }}</span
            >
            <div class="icon">
              <van-icon name="arrow" style="color: #000" size="28rpx" />
            </div>
          </div>
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-top">
          <div class="content-item-top-left">
            <image src="../static/image/icon-create-price.png" />
            <span>价格</span>
          </div>
          <div class="content-item-top-right">
            <van-cell-group>
              <van-field
                :value="price"
                type="number"
                disabled
                placeholder="待定"
                :border="false"
                input-align="right"
              />
            </van-cell-group>
          </div>
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-top">
          <div class="content-item-top-left">
            <image src="../static/image/icon-fanchuan.png" />
            <span>角色反串</span>
          </div>
          <div class="content-item-top-right">
            <div class="checkbox">
              <div @click="isSubtract = true">
                <image
                  src="../static/image/icon-checkbox.png"
                  v-if="isSubtract"
                />
                <span v-else></span>
                <span>是</span>
              </div>
              <div @click="isSubtract = false">
                <image
                  src="../static/image/icon-checkbox.png"
                  v-if="!isSubtract"
                />
                <span v-else></span>
                <span>否</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-item" @click="$refs.modalTime.showCaledar = true">
        <div class="content-item-top">
          <div class="content-item-top-left">
            <image src="../static/image/icon-create-time.png" />
            <span>剧本时长</span>
          </div>
          <div class="content-item-top-right">
            <span class="text" v-if="currentTime">
              {{ $dayjs(currentTime).format("HH") + "时"
              }}{{ $dayjs(currentTime).format("mm") + "分" }}</span
            >
            <div class="icon">
              <van-icon name="arrow" style="color: #000" size="28rpx" />
            </div>
          </div>
        </div>
      </div>
      <div class="content-item" @click="isShowGender = true">
        <div class="content-item-top">
          <div class="content-item-top-left">
            <image src="../static/image/icon-create-people.png" />
            <span>添加占位</span>
            <span>(选填)</span>
          </div>
          <div class="content-item-top-right">
            <span class="text"
              >{{ maleNum ? maleNum + "男" : ""
              }}{{ femaleNum ? femaleNum + "女" : "" }}</span
            >
            <div class="icon">
              <van-icon name="arrow" style="color: #000" size="28rpx" />
            </div>
          </div>
        </div>
      </div>
      <div class="content-item">
        <van-cell-group>
          <van-field
            :value="message"
            @input="input"
            type="textarea"
            placeholder="请输入组局说明~"
            :maxlength="100"
            :autosize="{ maxHeight: 76, minHeight: 76 }"
            :border="false"
          />
        </van-cell-group>
        <div class="content-item-textarea">
          <div class="clear" @click="clearText">
            <image src="../static/image/icon-create-del.png" />
            <span>清空</span>
          </div>
          <div class="limit">
            <span>{{ message.length }}</span>
            <span style="color: #999999">/100</span>
          </div>
        </div>
      </div>
    </div>
    <div class="btn canBtn" @click="onSubmit" v-if="canBtn">发布组局</div>
    <div class="btn" v-else>发布组局</div>
    <modalDate
      ref="modalDate"
      :current="currentDate"
      @getCurrentDate="getCurrentDate"
    />
    <modalTime
      ref="modalTime"
      :current="currentTime"
      @getCurrentTime="getCurrentTime"
    />
    <modalGender
      :isShowGender.sync="isShowGender"
      :propMaleNum="maleNum"
      :propFemaleNum="femaleNum"
      :isRevertSex='isSubtract'
      :limitMale="isSubtract ? limitMaleNum + limitFemaleNum: limitMaleNum"
      :limitFemale="isSubtract ? limitMaleNum + limitFemaleNum: limitFemaleNum"
      @male-female-num="maleFemaleNum"
      v-if="isShowGender"
    />
  </div>
</template>

<script>
import modalTime from "../components/modal-time.vue";
import modalDate from "../components/modal-date.vue";
import modalGender from "../components/modal-gender.vue";
import service from "../utils/service";
import navigationBar from "../../components/navigation-bar/index.vue";
export default {
  components: {
    modalTime,
    modalDate,
    modalGender,
    navigationBar,
  },
  data() {
    return {
      customNav: {
        navTitle: "发起组局",
        customizeLeft: true,
        position:'fixed'
      },
      dramaInfo: null,
      isSubtract: true,
      limitMaleNum: null,
      limitFemaleNum: null,
      maleNum: 0,
      femaleNum: 0,
      price: "",
      message: "",
      currentDate: null,
      currentTime: null,
      isShowGender: false,
      saving: false,
    };
  },
  onShow() {
    this.getDramaInfo();
  },
  computed: {
    week() {
      return this.getWeek(this.currentDate);
    },
    canBtn() {
      if (this.dramaInfo && this.currentDate && this.currentTime) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch:{
    isSubtract(){
      this.maleNum = 0;
      this.femaleNum = 0;
    }
  },
  methods: {
    backRoute() {
      uni.navigateBack();
    },
    onDramaList() {
      uni.navigateTo({
        url: `/gatherPlayer/pages/selectDrama?storeId=${uni.getStorageSync('storeId')}`,
      });
    },
    async onSubmit() {
      try {
        if (this.saving) return;
        this.saving = true;

        if (this.price < 10) {
          wx.showToast({ title: "价格需高于￥10" });
          return;
        }
        let gameTime = this.transitionTime();
        let originPrice = this.price.split("￥");
        console.log(originPrice);
        await service.storeCreateGathering({
          botFemaleGamerNum: this.femaleNum,
          botMaleGamerNum: this.maleNum,
          content: this.message,
          gameStartTime: this.$dayjs(this.currentDate).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          gameTime,
          isRevertSex: this.isSubtract,
          originPrice: Number(originPrice[1]) * 100,
          storeId: uni.getStorageSync("storeId"),
          storeProductId: this.dramaInfo.id,
        });
        uni.showToast({
          title: "发布成功",
        });
        setTimeout(() => {
          uni.setStorageSync('refresh', true);
          this.saving = false;
          uni.navigateBack();
        }, 500);
      } catch (e) {
        this.saving = false;
        console.log(e);
      }
    },
    getDramaInfo() {
      if (uni.getStorageSync("gather-drama")) {
        this.dramaInfo = uni.getStorageSync("gather-drama");
        this.$nextTick(() => {
          this.price = "￥" + String(this.dramaInfo.currentPrice / 100);
        });
        this.currentTime = new Date(
          "1970/1/5 " + this.dramaInfo.gameTime + ":00"
        ).getTime();
        this.$refs.modalTime.currentDate = this.$dayjs(this.currentTime).format(
          "HH:mm"
        );
        this.limitMaleNum = this.dramaInfo.maleGamerNum;
        this.limitFemaleNum = this.dramaInfo.femaleGamerNum;
        wx.removeStorageSync("gather-drama");
      }
    },
    transitionTime() {
      let arr = this.$dayjs(this.currentTime).format("HH:mm").split(":");
      let hour = Number(arr[0]);
      let minute = Number(arr[1]) / 60;
      return hour + minute;
    },

    maleFemaleNum(obj) {
      this.maleNum = obj.male;
      this.femaleNum = obj.female;
    },
    getCurrentDate(date) {
      this.currentDate = date;
    },
    getCurrentTime(date) {
      this.currentTime = date;
    },
    /**
     * 转换日期
     */
    getWeek(dateString) {
      let date = new Date(dateString).getDay();
      var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      return "周" + weeks[date];
    },
    inputPrice(e) {
      if (this.price.includes("￥")) {
        this.price = e.detail;
      } else {
        this.price = "￥" + e.detail;
      }
    },
    input(e) {
      this.message = e.detail;
    },
    clearText() {
      this.message = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.bureauCreate {
  .content {
    padding: 24rpx 30rpx 0;
    margin-bottom: 130rpx;
    &-item {
      padding: 30rpx;
      background: #ffffff;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      margin-bottom: 30rpx;
      &-top {
        @include hor-between-center;
        &-left {
          display: flex;
          align-items: center;
          image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
          }
          :nth-child(2) {
            font-size: 26rpx;
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 44rpx;
          }
          :nth-child(3) {
            font-size: 26rpx;
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #bbbbbb;
            line-height: 44rpx;
          }
        }
        &-right {
          display: flex;
          align-items: center;
          .text {
            font-size: 28rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #999999;
            line-height: 44rpx;
          }
          .icon {
            margin-left: 30rpx;
          }
        }
        .checkbox {
          display: flex;
          align-items: center;
          div {
            display: flex;
            align-items: center;
            margin-left: 80rpx;
            image {
              width: 32rpx;
              height: 32rpx;
            }
            span:nth-child(1) {
              box-sizing: border-box;
              width: 32rpx;
              height: 32rpx;
              border-radius: 10rpx 10rpx 10rpx 10rpx;
              border: 2rpx solid #999999;
            }
            span:nth-child(2) {
              font-size: 28rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #1a1a1a;
              line-height: 44rpx;
              margin-left: 20rpx;
            }
          }
        }
      }
      &-bottom {
        @include hor-center-center;
        margin-top: 30rpx;
        &-left {
          width: 100rpx;
          height: 136rpx;
          margin-right: 20rpx;
          position: relative;
          image {
            border-radius: 12rpx 12rpx 12rpx 12rpx;
          }
          &-tag {
            width: 56rpx;
            height: 32rpx;
            border-radius: 8rpx 8rpx 8rpx 8rpx;
            font-size: 20rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 32rpx;
            text-align: center;
            position: absolute;
            top: 8rpx;
            left: 8rpx;
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
          &-title {
            @include text-overflow-line(1);
            font-size: 28rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #1a1a1a;
            line-height: 33rpx;
          }
          &-gameNum{
            margin-top: 10rpx;
            font-size: 20rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #999999;
          }
          &-tag {
            margin-top: 12rpx;
            white-space: nowrap;
            width: 60vw;
            span {
              padding: 0 10rpx;
              margin-right: 10rpx;
              background: #f4f5f6;
              border-radius: 114rpx 114rpx 114rpx 114rpx;
              font-size: 20rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 32rpx;
            }
          }
        }
      }
      &-textarea {
        @include hor-between-center;
        .clear {
          image {
            width: 32rpx;
            height: 32rpx;
          }
          span {
            font-size: 22rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #a3a3a3;
            line-height: 26rpx;
            margin-left: 4rpx;
          }
        }
        .limit {
          span {
            font-size: 22rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #1a1a1a;
          }
        }
      }
      /deep/input {
        caret-color: #14c9c9;
        font-size: 28rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 44rpx;
      }
      /deep/textarea {
        caret-color: #14c9c9;
      }
      /deep/.van-cell {
        padding: 0 !important;
      }
      /deep/.van-field__body--textarea {
        padding: 0 !important;
      }
      /deep/.van-hairline--top-bottom:after {
        display: none;
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 62rpx;
    left: 0;
    right: 0;
    margin: 0 30rpx;
    height: 96rpx;
    background: rgba(20, 201, 201, 0.5);
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 96rpx;
    text-align: center;
  }
  .canBtn {
    color: #ffffff;
    background: #14c9c9;
  }
}
</style>
