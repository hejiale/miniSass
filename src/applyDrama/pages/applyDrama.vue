<template>
  <div class="container">
    <div class="fixedBg">
      <image :src="$iconFont.getIconName('bg-personnel')" mode="widthFix" />
    </div>
    <navigation-bar :nav="customNav">
      <view slot="left">
        <view class="topNav">
          <van-icon name="arrow-left" @click="backRoute" style="color: #000" size="50rpx" />
        </view>
      </view>
      <view slot="content">
        <div class="container-statusBox">
          <image :src="$iconFont.getIconName('apply-progress-4')"
            v-if="form && form.boxStoreApplyStatus === 'REJECT_AUTHORIZE'" mode="widthFix" />
          <image :src="$iconFont.getIconName('apply-progress-3')"
            v-else-if="form && form.boxStoreApplyStatus === 'PASS_AUTHORIZE'" mode="widthFix" />
          <image :src="$iconFont.getIconName('apply-progress-2')"
            v-else-if="form && form.boxStoreApplyStatus === 'WAIT_AUTHORIZE'" mode="widthFix" />
          <image :src="$iconFont.getIconName('apply-progress-1')" mode="widthFix" v-else />
        </div>
        <div class="container-dramaBox">
          <drama :dramaObj="drama" v-if="drama" />
          <div class="container-dramaBox-note" v-if="drama.remark">
            说明：{{ drama.remark }}
          </div>
        </div>
        <div class="container-addressBox" @click="onGoAddressPage" v-if="defaultAddress">
          <addressObj :address="defaultAddress" />
          <van-icon name="arrow" size="40rpx" color="#999" class="container-addressBox-arrow" />
        </div>
        <div class="container-noneBox" @click="onGoAddressPage" v-else>
          <div class="container-noneBox-noneTitle">收货地址</div>
          <span class="container-noneBox-arrowTitle">新建一个收货地址</span>
          <van-icon name="arrow" size="24rpx" color="#999" class="container-noneBox-arrow" />
        </div>
        <div class="container-taskBox" v-if="form.boxDramaQuestionResponse.length">
          <div class="container-taskBox-title">申领任务</div>
          <div class="container-taskBox-scoreBox" v-if="form.boxStoreApplyStatus">
            得分：{{ totalRealScore }} <span>（总分{{ totalScore }}）</span>
          </div>
          <div class="container-taskBox-subtitle">
            填写领本任务可以帮助你获得更多的分数，平台与发行会根据分数由高到低授权剧本。
          </div>
          <div class="container-taskBox-questionBox" v-for="(item, index) in form.boxDramaQuestionResponse" :key="index">
            <span class="container-taskBox-questionBox-requirdNote"
              :style="item.answerApplyStatus ? 'width:70%' : 'width:100%'"><span
                class="container-taskBox-questionBox-requirdNote-tag" v-if="item.isRequired">*</span>
              {{ index + 1 }}. {{ item.title }} ({{ item.score }}分)
            </span>
            <span class="container-taskBox-questionBox-demo"
              v-if="item.picUrlList && item.picUrlList.length && item.answerApplyStatus !== 'PASS'"
              @click="onPreImage(item.picUrlList, 0)">点击查看示例</span>
            <div class="container-taskBox-questionBox-scoreBox" v-if="item.answerApplyStatus">
              <span v-if="item.realyScore" class="mr4">{{ `得${item.realyScore}分` }}</span>
              <span :class="item.answerApplyStatus === 'UN_PASS' ? 'reject' : ''">{{
                $enums.AnswerApplyStatus.getName(item.answerApplyStatus)
              }}</span>
            </div>
            <input :value="item.answerWord" placeholder="请输入回答" placeholder-style="color:#ccc"
              class="container-taskBox-questionBox-inputBox" :disabled="item.answerApplyStatus === 'PASS'"
              @blur="onBlurAnswer($event, index)" v-if="item.answerType === 'WORD' || item.answerType === 'ALL'" />
            <span class="container-taskBox-questionBox-requirdNote mt16"
              v-if="item.answerType === 'PICTURE' || item.answerType === 'ALL'">请上传（图片小于2M）</span>
            <scroll-view scroll-x class="container-taskBox-questionBox-scrollBox"
              v-if="item.answerType === 'PICTURE' || item.answerType === 'ALL'">
              <div class="container-taskBox-questionBox-scrollBox-imgBox" style="padding: 0px"
                @click="onUpdateImgAction(index)" v-if="item.answerApplyStatus !== 'PASS'">
                <image src="../static/image/storeInfo-addPic.png"
                  class="container-taskBox-questionBox-scrollBox-imgBox-cover" mode="aspectFill" />
              </div>
              <div v-for="(it, idx) in item.urls" :key="it" class="container-taskBox-questionBox-scrollBox-imgBox"
                @click="onClickImage(index, idx)">
                <image :src="$filters.processImage(it, 160)" class="container-taskBox-questionBox-scrollBox-imgBox-cover"
                  mode="aspectFill" />
                <image src="../static/image/icon-close.png"
                  class="container-taskBox-questionBox-scrollBox-imgBox-clearIcon"
                  v-if="item.answerApplyStatus !== 'PASS'" />
              </div>
            </scroll-view>
            <div class="container-taskBox-questionBox-rejectBox" v-if="item.reason">
              {{ item.reason }}
            </div>
          </div>
        </div>
        <div class="container-note">
          提示：若未授权成功，将原路退款，每个店铺限领1本
        </div>
        <div class="container-bottomButton" @click="onUpdateApply"
          v-if="form && form.boxStoreApplyStatus === 'WAIT_AUTHORIZE'">
          保存修改
        </div>
        <div class="container-bottomButton" @click="onApply" v-if="!form.boxStoreApplyStatus">
          提交申领任务
        </div>
      </view>
    </navigation-bar>
  </div>
</template>
<script>
import { uploadFile } from "@/utils";
import drama from "../components/detailDrama.vue";
import addressObj from "../components/addressObj.vue";
import service from "../utils/service";
import navigationBar from "@/components/navigation-bar";
export default {
  components: {
    drama,
    addressObj,
    navigationBar,
  },
  data() {
    return {
      drama: null,
      form: {
        boxDramaQuestionResponse: [],
      },
      canSubmit: false,
      userInfor: null,
      endLoad: false,
      customNav: {
        color: "#000",
        hideBg: true,
        customizeLeft: true,
        navTitle: "领本填写",
      },
      defaultAddress: null,
      orderInfoId: null,
      delta: null
    };
  },
  computed: {
    totalRealScore() {
      let score = 0;
      this.form.boxDramaQuestionResponse.map((it) => {
        score += it.realyScore;
      });
      return score;
    },
    totalScore() {
      let score = 0;
      this.form.boxDramaQuestionResponse.map((it) => {
        score += it.score;
      });
      return score;
    },
  },
  async onLoad(options) {
    this.orderInfoId = options.orderInfoId;
    this.delta = options.delta;

    await this.Userinfo();
    await this.queryProductDetail(options.id);

    //已申领详情
    if (options.applyId && options.applyId !== "undefined") {
      await this.queryApplyDetail(options.applyId);
    } else {
      await this.queryApplyQuestion(options.id);
    }
  },
  onShow() {
    //地址信息
    if (uni.getStorageSync("selectStoreAddress")) {
      this.defaultAddress = uni.getStorageSync("selectStoreAddress");
      uni.setStorageSync("selectStoreAddress");

      this.form["linkmanName"] = this.defaultAddress["linkmanName"];
      this.form["linkmanPhone"] = this.defaultAddress["linkmanPhone"];
      this.form["linkmanAddress"] = this.defaultAddress["linkmanAddress"];
      this.form["provinceId"] = this.defaultAddress["provinceId"];
      this.form["cityId"] = this.defaultAddress["cityId"];
      this.form["districtId"] = this.defaultAddress["districtId"];
    }
  },
  methods: {
    backRoute() {
      if (this.delta) {
        uni.navigateBack({
          delta: Number(this.delta)
        });
      } else {
        uni.navigateBack();
      }
    },
    onGoAddressPage() {
      if (this.defaultAddress) {
        uni.navigateTo({
          url: `./editMyAddress?address=${JSON.stringify(this.defaultAddress)}`,
        });
      } else {
        uni.navigateTo({
          url: `./editMyAddress`,
        });
      }
    },
    onPreImage(urls, current) {
      wx.previewImage({
        current: urls[current],
        urls: urls,
        showmenu: false,
      });
    },
    onBlurAnswer(event, index) {
      this.form.boxDramaQuestionResponse[index].answerWord = event.detail.value;
    },
    //上传图片
    onUpdateImgAction(index) {
      const vm = this;

      let count = 9 - (vm.form.boxDramaQuestionResponse[index].urls ? vm.form.boxDramaQuestionResponse[index].urls.length : 0);
      if (count <= 0) {
        uni.showToast({
          title: "照片最多上传9张",
          icon: "none",
        });
        return;
      }

      uni.chooseImage({
        count,
        success: function (res) {
          uni.showLoading("上传中...");
          let promiseArr = [];
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            promiseArr.push(vm.onUploadFile(res.tempFilePaths[i], index));
          }
          Promise.all(promiseArr).then((_) => {
            uni.hideLoading();
          });
        },
      });
    },
    onUploadFile(url, index) {
      return new Promise((resolve) => {
        uploadFile(url).then((e) => {
          if (!this.form.boxDramaQuestionResponse[index].urls) {
            this.form.boxDramaQuestionResponse[index].urls = [];
          }
          this.form.boxDramaQuestionResponse[index].urls.push(e);
          resolve();
        });
      });
    },
    onClickImage(index, idx) {
      if (
        this.form.boxDramaQuestionResponse[index].answerApplyStatus === "PASS"
      ) {
        this.onPreImage(this.form.boxDramaQuestionResponse[index].urls, idx);
        return;
      }

      const vm = this;
      uni.showModal({
        title: "提示",
        content: "您确定要删除吗？",
        success(res) {
          if (res.confirm) {
            vm.form.boxDramaQuestionResponse[index].urls.splice(idx, 1);
          }
        },
      });
    },
    //新增申领
    async onApply() {
      if (!this.judgeRequird()) return;

      if (this.canSubmit) return;
      this.canSubmit = true;
      wx.showLoading();

      //提交申领
      let form = JSON.parse(
        JSON.stringify(this.form).replace(
          /"boxDramaQuestionResponse"/g,
          '"boxStoreAnswers"'
        )
      );
      form = JSON.parse(JSON.stringify(form).replace(/"id"/g, '"questionId"'));

      try {
        await service.addBoxStoreApply(form);

        uni.showToast({
          title: "新增申请成功！",
        });

        setTimeout(() => {
          wx.hideLoading();
          this.backRoute();
        }, 1000);
      } catch (e) {
        setTimeout(() => {
          wx.hideLoading
          this.backRoute();
        }, 1000);
        this.canSubmit = false;
      }
    },
    //修改申领
    onUpdateApply() {
      if (!this.judgeRequird()) return;

      this.updateApplyDetail();
    },
    //查询商品信息
    async queryProductDetail(id) {
      try {
        this.drama = await service.productDetail({
          id /*申领id*/,
        });
      } catch (e) { }
    },
    //查询剧本申领问题
    async queryApplyQuestion(id) {
      try {
        let data = await service.getBoxDramaApplyDetail({
          id,
        });

        data.boxDramaQuestionResponse.map((it) => {
          it["urls"] = [];
        });
        data["storeId"] = uni.getStorageSync("storeId");
        data["orderInfoId"] = this.orderInfoId;
        data["applyUserId"] = this.userInfor.id;
        this.form = data;
      } catch (e) { }
    },
    async Userinfo() {
      this.userInfor = await this.$checkLogin.getUserInfo();
    },
    //修改申领
    async updateApplyDetail() {
      if (this.canSubmit) return;
      this.canSubmit = true;
      wx.showLoading();

      //提交申领
      let form = JSON.parse(
        JSON.stringify(this.form).replace(
          /"boxDramaQuestionResponse"/g,
          '"boxStoreAnswers"'
        )
      );
      form = JSON.parse(JSON.stringify(form).replace(/"applyId"/g, '"id"'));

      try {
        await service.updateBoxStoreApplyWithMp(form);

        uni.showToast({
          title: "修改申请成功！",
        });

        setTimeout(() => {
          wx.hideLoading();
          this.backRoute();
        }, 1000);
      } catch (e) {
        setTimeout(() => {
          wx.hideLoading();
          this.backRoute();
        }, 1000);
        this.canSubmit = false;
      }
    },
    //校验必填
    judgeRequird() {
      if (!this.defaultAddress) {
        uni.showToast({
          title: "请填写收货地址",
          icon: "none",
        });
        return false;
      }
      //判断答案
      if (this.form.boxDramaQuestionResponse.length) {
        let isReject = false;
        this.form.boxDramaQuestionResponse.map((it) => {
          if (it.isRequired) {
            //文字或图片答案
            if (it.answerType === "ALL") {
              if (!it.answerWord || !it.urls || !it.urls.length) {
                isReject = true;
              }
            } else if (it.answerType === "WORD") {
              if (!it.answerWord) {
                isReject = true;
              }
            } else if (it.answerType === "PICTURE") {
              if (!it.urls || !it.urls.length) {
                isReject = true;
              }
            }
          }
        });
        if (isReject) {
          uni.showToast({
            title: "请填写必填申领任务",
            icon: "none",
          });
          return false;
        }
      }
      return true;
    },
    //查询申领详情
    async queryApplyDetail(id) {
      try {
        let data = await service.getBoxStoreApplyCheckDetail({
          id,
        });

        let form = JSON.parse(
          JSON.stringify(data).replace(
            /"boxStoreAnswerItems"/g,
            '"boxDramaQuestionResponse"'
          )
        );
        form = JSON.parse(
          JSON.stringify(form).replace(/"question"/g, '"title"')
        );

        this.defaultAddress = {
          linkmanName: data.linkmanName,
          linkmanPhone: data.linkmanPhone,
          linkmanAddress: data.linkmanAddress,
          addressName: `${data.provinceName}${data.cityName}${data.districtName || ""
            }`,
        };
        this.form = form;
      } catch (e) { }
    },
  },
};
</script>
<style>
.van-cell {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.fixedBg {
  background: #f4f5f6;
  height: 100vh;
}

.container {
  padding-bottom: 68rpx;

  &-statusBox {
    margin: 0 32rpx 32rpx 32rpx;
    @include hor;
    align-items: center;

    image:nth-child(1) {
      width: calc(100vw - 40rpx);
    }
  }

  &-dramaBox {
    margin: 32rpx 32rpx 0 32rpx;
    padding: rpx(16);
    background: #ffffff;
    border-radius: 8px;

    &-note {
      margin-top: rpx(16);
      min-height: 67px;
      background: #f4f5f6;
      border-radius: 4px;
      padding: rpx(8);
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #849198;
      line-height: 14px;
      word-break: break-all;
    }
  }

  &-addressBox {
    margin: 32rpx;
    background: #ffffff;
    border-radius: 8px;
    @include ver;
    position: relative;

    &-title {
      padding: 32rpx 0 0 32rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 40rpx;
    }

    &-arrow {
      position: absolute;
      right: 16rpx;
      top: 50%;
      transform: translateY(-10px);
    }
  }

  &-noneBox {
    margin: 32rpx;
    background: #ffffff;
    border-radius: 8px;
    @include hor;
    align-items: center;
    position: relative;

    &-noneTitle {
      padding: 32rpx;
      font-size: rpx(13);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }

    &-arrow {
      position: absolute;
      right: 16rpx;
    }

    &-arrowTitle {
      position: absolute;
      right: rpx(28);
      font-size: rpx(13);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #cccccc;
    }
  }

  &-taskBox {
    margin: 32rpx;
    background: #ffffff;
    border-radius: 8px;
    padding: rpx(16);
    position: relative;

    &-title {
      font-size: rpx(16);
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 40rpx;
      word-wrap: break-word;
      word-break: break-all;
    }

    &-subtitle {
      margin-top: rpx(8);
      background: #f4f5f6;
      border-radius: 4px;
      padding: rpx(8);
      font-size: rpx(12);
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #849198;
      line-height: 14px;
    }

    &-scoreBox {
      position: absolute;
      right: rpx(16);
      top: rpx(16);
      @include hor;
      align-items: center;
      font-size: rpx(12);
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #14c9c9;
      line-height: 14px;

      span {
        color: #999999;
      }
    }

    &-questionBox {
      @include ver;
      margin-top: rpx(16);
      position: relative;

      &-requirdNote {
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 32rpx;
        word-wrap: break-word;
        word-break: break-all;
        @include hor;

        &-tag {
          color: #fa5252;
        }
      }

      &-demo {
        margin-top: 8rpx;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 28rpx;
        color: #14C9C9;
      }

      &-scrollBox {
        margin-top: 32rpx;
        width: 97%;
        @include hor;
        align-items: center;
        white-space: nowrap;

        &-imgBox {
          display: inline-block;
          margin-right: rpx(16);
          position: relative;
          padding: 8px;

          &-cover {
            width: rpx(64);
            height: rpx(64);
            border-radius: 16rpx;
            @include ver;
            align-items: center;

            image {
              width: rpx(24);
              height: rpx(24);
            }
          }

          &-clearIcon {
            position: absolute;
            right: 0rpx;
            top: 0rpx;
            width: 32rpx;
            height: 32rpx;
          }
        }
      }

      &-inputBox {
        margin-top: rpx(16);
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        border-bottom: 1rpx solid #e7e7e7;
      }

      &-rejectBox {
        margin-top: rpx(16);
        width: 100%;
        background: rgba(250, 82, 82, 0.1);
        padding-left: rpx(8);
        font-size: rpx(12);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #fa5252;
        line-height: 22px;
        word-break: break-all;
      }

      &-scoreBox {
        position: absolute;
        right: 0;
        top: 0;
        font-size: rpx(14);
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #14c9c9;
        @include hor;
        align-items: center;
      }

      .reject {
        color: #fa5252;
      }
    }
  }

  &-note {
    padding-left: 32rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 44rpx;
  }

  &-bottomButton {
    margin-top: rpx(27) !important;
    width: 550rpx;
    height: 44px;
    background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
    border-radius: 41px;
    margin: auto;
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    @include hor-center-center;
  }

  &-contactBox {
    width: 100vw;
    height: 20px;
    margin-top: rpx(24);
  }
}
</style>
