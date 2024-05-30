<template>
  <div class="container">
    <image
      :src="$iconFont.getIconName('evaluate-bg')"
      class="bg"
      mode="widthFix"
    />
    <div
      class="backBox"
      :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
      @click="onBack"
    >
      <van-icon name="arrow-left" color="#111" size="24" />
    </div>
    <div
      class="title"
      :style="{ top: `${menuRect.top}px`, height: `${menuRect.height}px` }"
    >
      店铺评价
    </div>
    <div class="titleBox">
      <div class="titleBox-left">
        <image :src="storeInfo.storeLogo" mode="aspectFill"/>
        <span>{{storeInfo.storeName}}</span>
      </div>
      <image src="../static/image/icon-release.png" class="titleBox-right" @click="evaluateRequest"/>
    </div>
    <scroll-view class="content" scroll-y>
        <div class="content-statusBox">
            <image src="../static/image/icon-no-select.png" mode="aspectFill" v-if="evaluateStatus === 0" @click="onUnChange()" />
            <image src="../static/image/icon-no.png" mode="aspectFill"   v-if="evaluateStatus !== 0" @click="onChange(0)" />
            <image src="../static/image/icon-normal-select.png" mode="aspectFill" v-if="evaluateStatus === 1" @click="onUnChange()" />
            <image src="../static/image/icon-normal.png" mode="aspectFill" v-if="evaluateStatus !== 1" @click="onChange(1)" />
            <image src="../static/image/icon-nice-select.png" mode="aspectFill" v-if="evaluateStatus === 2" @click="onUnChange()" />
            <image src="../static/image/icon-nice.png" mode="aspectFill" v-if="evaluateStatus !== 2" @click="onChange(2)" />
        </div>
        <div class="content-rateBox">
            <div class="content-rateBox-item">
                <span>环境</span>
                <van-rate
                :value="environmentValue"
                allow-half
                :icon="$iconFont.getIconName('full-star')"
                :void-icon="$iconFont.getIconName('none-star')"
                @change="onChangeEnvironmentValue"
                />
                <span :class="environmentValue*2 >= 9 ? 'niceText':'normalText'">{{environmentValue*2}}分{{niceStatus(environmentValue*2)}}</span>
            </div>
            <div class="content-rateBox-item">
                <span>服务</span>
                <van-rate
                :value="serviceValue"
                allow-half
                :icon="$iconFont.getIconName('full-star')"
                :void-icon="$iconFont.getIconName('none-star')"
                @change="onChangeServiceValue"
                />
                <span :class="serviceValue * 2 >= 9 ? 'niceText':'normalText'">{{serviceValue * 2}}分{{niceStatus(serviceValue * 2)}}</span>
            </div>
            <div class="content-rateBox-item">
                <span>D M</span>
                <van-rate
                :value="dmValue"
                allow-half
                :icon="$iconFont.getIconName('full-star')"
                :void-icon="$iconFont.getIconName('none-star')"
                @change="onChangeDmValue"
                />
                <span :class="dmValue * 2 >= 9 ? 'niceText':'normalText'">{{dmValue * 2}}分{{niceStatus(dmValue * 2)}}</span>
            </div>
        </div>
        <div class="content-inputContent">
            <div class="content-inputContent-textareaBox">
                <textarea
                placeholder="你可以从环境、服务、DM等方面进行评价"
                :maxlength="1000"
                v-model="evaluateContent"
                auto-height
                @blur="onBlurText"
            />
            <div class="content-inputContent-textareaBox-numBox">{{evaluateContent.length}}</div>
            </div>
            <view class="content-inputContent-uploadImgsBox" scroll-x>
              <div src="" v-for="(url,idx) in imageList" :key="url" class="content-inputContent-uploadImgsBox-item">
                <image :src="url" @click.stop="onPreView(idx)" v-if="isImage(url)" mode="aspectFill"/>
                <image :src="url + '?x-oss-process=video/snapshot,t_1000,m_fast'" @click.stop="onPreView(idx)" v-else mode="aspectFill"/>
                <image src="../static/image/icon-close.png" class="content-inputContent-uploadImgsBox-item-close" @click="onDeleteImg(idx)"/>
              </div>
              <div class="content-inputContent-uploadImgsBox-add" @click="onUploadImage" v-if="imageList.length < 6">
                <image src="../static/image/icon-camera.png" class="content-inputContent-uploadImgsBox-add-icon"/>
                <span class="content-inputContent-uploadImgsBox-title">{{uploadNote}}</span>
              </div>
            </view>
            <div class="content-inputContent-bottomBox">
              <div class="content-inputContent-bottomBox-item" @click="onSelectDrama">
                <div class="content-inputContent-bottomBox-item-top">
                  <image src="../static/image/relate-drama-select.png" class="content-inputContent-bottomBox-item-top-icon"  v-if="evaluateDrama"/>
                  <image src="../static/image/relate-drama.png" class="content-inputContent-bottomBox-item-top-icon" v-else/>
                  <span class="content-inputContent-bottomBox-item-top-title">{{evaluateDrama ? evaluateDrama.dramaName : '关联剧本'}}</span>
                  <van-icon name="arrow" class="arrow"/>
                </div>
                <div class="content-inputContent-bottomBox-item-bottom">选择您体验的剧本</div>
              </div>
              <div class="content-inputContent-bottomBox-item" @click="onSelectDM">
                <div class="content-inputContent-bottomBox-item-top">
                  <image src="../static/image/relate-drama-select.png" class="content-inputContent-bottomBox-item-top-icon" v-if="evaluateDM"/>
                  <image src="../static/image/relate-drama.png" class="content-inputContent-bottomBox-item-top-icon" v-else/>
                  <span class="content-inputContent-bottomBox-item-top-title">{{evaluateDM  ? evaluateDM.userName || evaluateDM.nickName: 'DM评价'}}</span>
                  <van-icon name="arrow" class="arrow"/>
                </div>
                <div class="content-inputContent-bottomBox-item-bottom">请选择本次带本的DM</div>
              </div>
            </div>
        </div>
    </scroll-view>
    <van-action-sheet
      :show="showSelectDrama"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showSelectDrama = false"
    >
      <div class="popDramaBox">
        <div class="popDramaBox-title">关联剧本 ({{dramaTotal}})</div>
        <div class="popDramaBox-subTitle">{{storeInfo.storeName}}</div>
        <div class="popDramaBox-searchBox">
          <input v-model="searchValue" @focus="onFocus" @input="onFocus" @blur="onSearch"/>
          <div class="popDramaBox-searchBox-placeholderBox" v-if="!isFocus">
            <image src="../static/image/icon-search.png"/>
            <span>输入关键词搜索</span>
          </div>
          
        </div>
        <div class="popDramaBox-filterBox">
          <div class="popDramaBox-filterBox-item">
            <span>题材：</span>
            <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
              <div class="popDramaBox-filterBox-item-scrolls-item" :class="dictParama === dic.id ? 'active':''" v-for="dic in dicts" :key="dic.id" @click="onSelectDict(dic.id)">{{dic.dictValue}}</div>
            </scroll-view>
          </div>
          <div class="popDramaBox-filterBox-item">
            <span>人数：</span>
            <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
              <div class="popDramaBox-filterBox-item-scrolls-item" :class="peopleParama === v ? 'active':''" v-for="v in peoples" :key="v"  @click="onSelectPeople(v)">{{v}}</div>
            </scroll-view>
          </div>
        </div>
        <scroll-view class="popDramaBox-listBox" scroll-y @scrolltolower="onLoadMore" v-if="dramaList.length">
          <div class="popDramaBox-listBox-item" v-for="drama in dramaList" :key="drama.id" @click="onChooseDrama(drama)">
            <div class="popDramaBox-listBox-item-cover">
              <image :src="drama.dramaCover" mode="aspectFill"/>
              <image
                :src="sellType(drama.sellType)"
                v-if="sellType(drama.sellType)"
                class="popDramaBox-listBox-item-cover-sellType"
              />
            </div>
            <div class="popDramaBox-listBox-item-info">
              <span>{{drama.dramaName}}</span>
              <span>{{dictValue(drama.dramaThemes)}}</span>
              <span>{{drama.maleGamerNum}}男{{drama.femaleGamerNum}}女 {{drama.gameTime}}小时</span>
            </div>
            <image src="../static/image/has-select.png" class="popDramaBox-listBox-item-status" v-if="selectDrama.dramaId === drama.dramaId"/>
            <image src="../static/image/empty-select.png" class="popDramaBox-listBox-item-status" v-else/>
          </div>
        </scroll-view>
        <notcData v-else/>
        <div class="popDramaBox-sureBox" @click="onSureSelect">
          <image src="../static/image/icon-sure-select.png" class="popDramaBox-sureBox-select" v-if="selectDrama"/>
          <image src="../static/image/icon-sure-normal.png" class="popDramaBox-sureBox-select" v-else/>
        </div>
      </div>
    </van-action-sheet>
    <van-action-sheet
      :show="showSelectDM"
      :safe-area-inset-bottom="false"
      z-index="1000"
      close-on-click-overlay
      @click-overlay="showSelectDM = false"
    >
      <div class="popDM_Box">
        <div class="popDM_Box-title">关联DM ({{DM_total}})</div>
        <div class="popDM_Box-subTitle">{{storeInfo.storeName}}</div>
        <scroll-view class="popDM_Box-listBox" scroll-y @scrolltolower="onLoadMore" v-if="dmList.length">
          <div class="popDM_Box-listBox-item" v-for="dm in dmList" :key="dm.userId" @click="onChooseDM(dm)">
            <image class="popDM_Box-listBox-item-cvoer" :src="dm.avatar" mode="aspectFill"/>
            <span>{{dm.userName}}</span>
            <image src="../static/image/has-select.png" class="popDM_Box-listBox-item-status" v-if="selectDM.userId === dm.userId"/>
            <image src="../static/image/empty-select.png" class="popDM_Box-listBox-item-status" v-else/>
          </div>
        </scroll-view>
        <notcData v-else/>
        <div class="popDM_Box-sureBox" @click="onSureSelectDM">
          <image src="../static/image/icon-sure-select.png" class="popDM_Box-sureBox-select" v-if="selectDM"/>
          <image src="../static/image/icon-sure-normal.png" class="popDM_Box-sureBox-select" v-else/>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { getMenuButtonRect, uploadFile, judgeMediaType, checkContent } from "@/utils/index";
import notcData from "@/components/notc-data/index.vue";
import service from "../utils/service";
export default {
  components: {
    notcData,
  },
  data() {
    return {
      menuRect: null,
      dmValue: 0,
      environmentValue: 0,
      serviceValue: 0,
      evaluateStatus: null, // 0 不行 1  普通 2 超赞
      evaluateContent: "",
      imageList: [],
      showSelectDrama: false,
      showSelectDM: false,
      searchValue: "",
      dicts: [],
      peoples: ["全部", "≤4人", "5人", "6人", "7人", "8人", "≥9人"],
      dictParama: null,
      peopleParama: "全部",
      pageNo: 1,
      dramaList: [],
      isFocus: false,
      selectDrama: null,
      evaluateDrama: null,
      selectDM: null,
      evaluateDM: null,
      dramaTotal: 0,
      DM_total: 0,
      dmList: [],
      storeInfo: null,
      userInfo: null,
      evaluateId: null,
      canRate: false,
      auditStatus: null,
      canDo: false
    };
  },
  async onLoad(options) {
    this.evaluateId = options.id;
    if (this.evaluateId) {
      this.queryEvaluateDetail();
    }
    this.storeInfo = uni.getStorageSync("store-info");
    this.userInfo = await this.$checkLogin.getUserInfo();
    uni.removeStorageSync("store-info");
    this.menuRect = await getMenuButtonRect();
    this.getDicts();
  },
  computed: {
    niceStatus() {
      return function (val) {
        return val >= 9 ? " 超赞!" : "";
      };
    },
    dictValue() {
      return function (dicts) {
        let arr = dicts.map((v) => v.dictValue);
        return arr.join(" ");
      };
    },
    uploadNote() {
      return this.imageList.length < 6
        ? this.imageList.length > 0
          ? `可再加${6 - this.imageList.length}张`
          : "上传图片"
        : "";
    },
    sellType() {
      return function (type) {
        if (type === "EXCLUSIVE") {
          return "../static/image/exclusive.png";
        } else if (type === "REAL_SCENE") {
          return "../static/image/real_scene.png";
        } else if (type === "LIMITED") {
          return "../static/image/limited.png";
        }
        return null;
      };
    },
    isImage(){
      return function(v){
        return judgeMediaType(v) === "image"; 
      }
    }
  },
  methods: {
    onLoadMore() {
      if (this.showSelectDrama) {
        if (this.dramaTotal === this.dramaList.length) return;

        this.pageNo++;
        this.queryDramaList();
      } else {
        if (this.DM_total === this.dmList.length) return;

        this.pageNo++;
        this.queryDM_List();
      }
    },
    onFocus() {
      this.isFocus = true;
    },
    onSearch() {
      if (!this.searchValue) {
        this.isFocus = false;
      }
      this.pageNo = 1;
      this.queryDramaList();
    },
    //对评价内容判断是否违规
    async onBlurText(){
      try{
        await checkContent(this.evaluateContent);
      }catch(e){
        this.evaluateContent = null;
      }
    },
    onChooseDrama(v) {
      if(this.selectDrama && this.selectDrama.dramaId === v.dramaId){
        this.selectDrama = null;
      }else{
        this.selectDrama = v;
      }
    },
    onSureSelect(){
      if(this.selectDrama){
        this.evaluateDrama = JSON.parse(JSON.stringify(this.selectDrama));
        this.selectDrama = null;
      }else{
        this.evaluateDrama = null;
      }
      this.showSelectDrama = false;
    },
    onChooseDM(v) {
      if(this.selectDM && this.selectDM.userId === v.userId){
        this.selectDM = null;
      }else{
        this.selectDM = v;
      }
    },
    onSureSelectDM(){
      if(this.selectDM){
        this.evaluateDM = JSON.parse(JSON.stringify(this.selectDM));
        this.evaluateDM['id'] = this.evaluateDM.userId;
        this.selectDM = null;
      }else{
        this.evaluateDM = null;
      }
      this.showSelectDM = false;
    },
    onBack() {
      uni.navigateBack();
    },
    onChangeEnvironmentValue(e) {
      this.canRate = true;
      this.environmentValue = e.detail;
    },
    onChangeServiceValue(e) {
      this.canRate = true;
      this.serviceValue = e.detail;
    },
    onChangeDmValue(e) {
      this.canRate = true;
      this.dmValue = e.detail;
    },
    onUnChange() {
      this.evaluateStatus = null;
    },
    onChange(index) {
      //修改评分默认值
      if (!this.canRate) {
        if (index === 0) {
          this.serviceValue = 2.5;
          this.dmValue = 2.5;
          this.environmentValue = 2.5;
        } else if (index === 1) {
          this.serviceValue = 3.5;
          this.dmValue = 3.5;
          this.environmentValue = 3.5;
        } else {
          this.serviceValue = 5;
          this.dmValue = 5;
          this.environmentValue = 5;
        }
      }

      this.evaluateStatus = index;
    },
    onUploadImage() {
      const vm = this;
      let count = 6 - this.imageList.length;
      if (count <= 0) {
        uni.showToast({
          title: "最多上传6张",
          icon: "none",
        });
        return;
      }

      uni.chooseMedia({
        count,
        success: async function (res) {
          uni.showLoading("上传中...");
          let promiseArr = [];
          for (let i = 0; i < res.tempFiles.length; i++) {
            promiseArr.push(vm.onUploadFile(res.tempFiles[i].tempFilePath));
          }
          Promise.all(promiseArr).then((_) => {
            uni.hideLoading();
          });
        },
      });
    },
    onUploadFile(url) {
      return new Promise((resolve) => {
        uploadFile(url).then((e) => {
          this.imageList.push(e);
          resolve();
        });
      });
    },
    onDeleteImg(idx) {
      this.imageList.splice(idx, 1);
    },
    onSelectDict(v) {
      if (this.dictParama === v) {
        this.dictParama = null;
      } else {
        this.dictParama = v;
      }
      this.pageNo = 1;
      this.queryDramaList();
    },
    onSelectPeople(v) {
      if (this.peopleParama === v) {
        this.peopleParama = "全部";
      } else {
        this.peopleParama = v;
      }
      this.pageNo = 1;
      this.queryDramaList();
    },
    async getDicts() {
      try {
        let data = await this.$api.queryDictList({
          dictType: "DRAMA",
        });
        data.map((v) => {
          if (v.dictType === "DRAMA") {
            this.dicts = v.dictList;
          }
        });
        this.dicts.unshift({ dictValue: "全部", id: null });
      } catch (e) {}
    },
    onSelectDrama() {
      if(this.evaluateDrama){
        this.selectDrama = JSON.parse(JSON.stringify(this.evaluateDrama));
      }
      
      this.showSelectDrama = true;
      this.pageNo = 1;
      this.queryDramaList();
    },
    onSelectDM() {
      if(this.evaluateDM){
        this.selectDM = JSON.parse(JSON.stringify(this.evaluateDM));
      }
      
      this.showSelectDM = true;
      this.pageNo = 1;
      this.queryDM_List();
    },
    async queryDramaList() {
      let minGamerNum, maxGamerNum;
      switch (this.peopleParama) {
        case "≤4人":
          minGamerNum = 4;
          maxGamerNum = 0;
          break;
        case "5人":
          minGamerNum = 5;
          maxGamerNum = 5;
          break;
        case "6人":
          minGamerNum = 6;
          maxGamerNum = 6;
          break;
        case "7人":
          minGamerNum = 7;
          maxGamerNum = 7;
          break;
        case "8人":
          minGamerNum = 8;
          maxGamerNum = 8;
          break;
        case "≥9人":
          minGamerNum = null;
          maxGamerNum = 9;
          break;
        default:
          minGamerNum = null;
          maxGamerNum = null;
          break;
      }
      try {
        let data = await this.$api.queryStoreDramaPage({
          pageNo: this.pageNo,
          pageSize: 10,
          storeId: this.storeInfo.id,
          dramaThemeIdList: this.dictParama ? [this.dictParama] : null,
          minGamerNum,
          maxGamerNum,
          dramaName: this.searchValue,
        });
        if (this.pageNo === 1) this.dramaList = [];

        if (data.records.length) {
          this.dramaList.push(...data.records);
        }
        this.dramaTotal = data.total;
      } catch (e) {}
    },
    async queryDM_List() {
      try {
        let data = await service.getStoreDMList({
          pageNo: this.pageNo,
          pageSize: 20,
          storeId: this.storeInfo.id,
          storeUserType: "DM",
        });
        if (this.pageNo === 1) this.dmList = [];

        if (data.records.length) {
          this.dmList.push(...data.records);
        }
        this.DM_total = data.total;
      } catch (e) {}
    },
    //发布评价
    async evaluateRequest() {
      if(!this.evaluateStatus){
        return wx.showToast({
          title: '给店铺打个分吧！',
          icon: 'none'
        })
      }
      if(this.canDo)return;
      this.canDo = true;

      wx.showLoading();
      try {
        await service.evaluateOperation({
          comment: this.evaluateContent,
          dmScore: this.dmValue * 20,
          environmentScore: this.environmentValue * 20,
          evaluationSource: "DETAIL_EVALUATE",
          serviceScore: this.serviceValue * 20,
          storeId: this.storeInfo.id,
          summarizeEvaluate:
            this.evaluateStatus === 0
              ? "NOT_GOOD"
              : this.evaluateStatus === 1
              ? "SO_SO"
              : "RECOMMEND",
          userId: this.userInfo.id,
          imageList: this.imageList,
          dramaId: this.evaluateDrama ? this.evaluateDrama.dramaId : null,
          dmId: this.evaluateDM ? this.evaluateDM.userId : null,
          id: this.evaluateId,
          cityId: uni.getStorageSync('cityInforId'),
          auditStatus: this.auditStatus
        });
        wx.showToast({
          title: "评价成功！",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (e) {
        this.canDo = false;
        wx.hideLoading();
      }
    },
    async queryEvaluateDetail() {
      try {
        let data = await service.evaluateDetail({
          id: this.evaluateId,
        });
  
        this.imageList = data.attachments.map((it) => it.fileUrl);
        this.evaluateContent = data.comment;
        
        this.evaluateDrama = data.dramaDetailVo;
        if(data.dramaDetailVo){
          this.evaluateDrama['dramaId'] = data.dramaDetailVo.id;
        }
        this.evaluateDM = data.dmuserInfo;
        if(data.dmuserInfo){
          this.evaluateDM['userId'] = this.evaluateDM.id;
        }
        this.evaluateStatus =
          data.summarizeEvaluate === "SO_SO"
            ? 1
            : data.summarizeEvaluate === "NOT_GOOD"
            ? 0
            : 2;
        this.serviceValue = data.serviceScore/2;
        this.environmentValue = data.environmentScore/2;
        this.dmValue = data.dmScore/2;
        this.auditStatus = data.auditStatus;
      } catch (e) {}
    },
    onPreView(current) {
      let sources = [];
      this.imageList.map((v) => {
        sources.push({
          url: v,
          type: judgeMediaType(v) === "image" ? "image" : "video",
          poster:
            judgeMediaType(v) === "video"
              ? `${v}?x-oss-process=video/snapshot,t_1000,m_fast`
              : null,
        });
      });
      uni.previewMedia({
        current,
        sources,
      });
    },
  },
};
</script>
<style>
.van-cell {
  padding: 40rpx !important;
}
</style>
<style lang="scss" scoped>
.container {
  background: linear-gradient(
    357deg,
    rgba(28, 184, 90, 0) 0%,
    rgba(220, 232, 255, 0.41) 100%
  );
  height: 100vh;
}
.bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
.backBox {
  position: fixed;
  left: 24rpx;
  @include ver;
  justify-content: center;
  z-index: 1;
}
.title {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  @include ver;
  justify-content: center;
  z-index: 1;
  font-size: 26rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #000000;
  line-height: 30rpx;
}
.titleBox {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  top: 192rpx;
  @include hor-between-center;
  &-left {
    @include hor;
    align-items: center;
    width: 70%;
    image {
      width: 64rpx;
      height: 64rpx;
      border-radius: 6px;
      border: 1px solid #ffffff;
    }
    span {
      margin-left: 18rpx;
      font-size: 26rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2e323e;
      line-height: 30rpx;
      @include text-overflow-line(1);
      width: 80%;
    }
  }
  &-right {
    width: 108rpx;
    height: 52rpx;
  }
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 19vh;
  @include ver;
  &-statusBox {
    @include hor;
    align-items: center;
    margin-left: 9.6vw;
    image {
      width: 24.26vw;
      height: 13.05vh;
      margin-right: 30rpx;
      box-sizing: border-box;
    }
  }
  &-rateBox {
    margin-top: 32rpx;
    margin-left: 80rpx;
    &-item {
      @include hor;
      align-items: center;
      margin-bottom: 24rpx;
      span:nth-child(1) {
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        margin-right: 52rpx;
      }
      span:nth-child(3) {
        margin-left: 24rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
      }
      .normalText {
        color: #959aa5;
      }
      .niceText {
        background: linear-gradient(180deg, #fe9535 0%, #fe5c35 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  &-inputContent {
    @include ver;
    margin-top: 52rpx;
    width: 100vw;
    background: #fff;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    &-textareaBox {
      width: 100vw;
      min-height: 15vh;
      padding-bottom: 40rpx;
      position: relative;
      textarea {
        margin: 40rpx 0px 0px 40rpx;
        width: calc(100% - 80rpx);
        font-size: 30rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        line-height: 36rpx;
      }
      &-numBox {
        position: absolute;
        right: 36rpx;
        bottom: 0px;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        line-height: 28rpx;
      }
      &-numBox::after {
        content: "/1000";
        color: "#959AA5";
      }
    }
    &-uploadImgsBox {
      white-space: nowrap;
      margin: 0 26rpx;
      width: calc(100vw - 52rpx);
      overflow-x: scroll;
      &-item {
        position: relative;
        display: inline-block;
        width: 180rpx;
        height: 180rpx;
        margin-right: 10rpx;
        image {
          border-radius: 28rpx;
        }
        &-close {
          position: absolute;
          right: -6rpx;
          top: -6rpx;
          width: 36rpx;
          height: 36rpx;
        }
      }
      &-add {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 180rpx;
        height: 180rpx;
        background: #f6f6f6;
        border-radius: 14px;
        transform: translateY(12rpx);
        &-icon {
          width: 80rpx;
          height: 80rpx;
          margin-top: 32rpx;
        }
        &-title {
          font-size: 26rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2e323e;
          line-height: 30rpx;
        }
      }
    }
    &-bottomBox {
      display: flex;
      width: 100%;
      background: linear-gradient(180deg, #fbfbfb 0%, #ffffff 56%);
      border-top: 1px solid #eeeeee;
      margin-top: 24rpx;
      padding-bottom: 5vh;
      &-item {
        margin: 56rpx 0 0 40rpx;
        @include ver;
        max-width: 40%;
        &-top {
          @include hor;
          align-items: center;
          &-icon {
            width: 32rpx;
            height: 32rpx;
          }
          &-title {
            font-size: 26rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #2e323e;
            line-height: 30rpx;
            margin-left: 18rpx;
            @include text-overflow-line(1);
            max-width: 60%;
          }
          .arrow {
            transform: translateY(2rpx);
          }
        }
        &-bottom {
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          line-height: 28rpx;
          margin-top: 8rpx;
        }
      }
      &-item:nth-child(2) {
        margin-left: 64rpx !important;
      }
    }
  }
}
.popDramaBox {
  margin-top: 30rpx;
  height: 85vh;
  background: #fff;
  border-radius: 32rpx;
  &-title {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 38rpx;
    text-align: center;
  }
  &-subTitle {
    margin-top: 4rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba($color: #444, $alpha: 0.4);
    line-height: 28rpx;
    text-align: center;
    width: 80%;
    margin-left: 10%;
  }
  &-searchBox {
    margin-left: 32rpx;
    margin-top: 20rpx;
    width: calc(100vw - 64rpx);
    height: 60rpx;
    background: #f5f6f8;
    border-radius: 30rpx;
    @include hor-center-center;
    position: relative;
    &-placeholderBox {
      image {
        width: 32rpx;
        height: 32rpx;
      }
      span {
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #959aa5;
      }
    }
    input {
      position: absolute;
      left: 40rpx;
      right: 40rpx;
      text-align: center;
    }
  }
  &-filterBox {
    @include ver;
    padding: 50rpx 0;
    margin-left: 40rpx;
    &-item {
      @include hor;
      align-items: center;
      margin-bottom: 20rpx;
      &-scrolls {
        white-space: nowrap;
        width: 85vw;
        &-item {
          display: inline-flex;
          padding: 8rpx 28rpx;
          background: unset;
          border-radius: 12px;
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #2e323e;
        }
        .active {
          background: rgba($color: #36e4bb, $alpha: 0.1);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #36e4bb;
        }
      }
    }
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 11.1vh;
    top: 39vh;
    background: #fafafa;
    padding: 0 24rpx;
    &-item {
      margin-top: 20rpx;
      width: 93.6vw;
      background: #ffffff;
      border-radius: 6px;
      @include hor;
      position: relative;
      &-cover {
        width: 108rpx;
        height: 144rpx;
        border-radius: 6px;
        margin: 24rpx;
        overflow: hidden;
        position: relative;
        &-sellType {
          position: absolute;
          right: 0rpx;
          top: 0rpx;
          width: 60rpx;
          height: 32rpx;
        }
      }
      &-info {
        margin-left: 18rpx;
        margin-top: 30rpx;
        @include ver;
        width: 60%;
        span:nth-child(1) {
          font-size: 32rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2e323e;
          line-height: 38rpx;
          @include text-overflow-line(1);
        }
        span:nth-child(2) {
          margin-top: 14rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          line-height: 28rpx;
        }
        span:nth-child(3) {
          margin-top: 10rpx;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #959aa5;
          line-height: 28rpx;
        }
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  &-sureBox{
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 11vh;
    background: #fff;
    @include hor-center-center;
    &-select{
      width: 91.46vw;
      height: 80rpx;
    }
  }
}
.popDM_Box {
  margin-top: 30rpx;
  height: 85vh;
  background: #fff;
  border-radius: 32rpx;
  &-title {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 38rpx;
    text-align: center;
  }
  &-subTitle {
    margin-top: 4rpx;
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba($color: #444, $alpha: 0.4);
    line-height: 28rpx;
    text-align: center;
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 20vh;
    background: #fafafa;
    padding: 24rpx;
    &-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 6rpx;
      margin-bottom: 24rpx;
      position: relative;
      &-cvoer {
        width: 30.66vw;
        height: 30.66vw;
        border-radius: 40rpx;
        border: 1px solid #d2d2d2;
      }
      span {
        font-size: 32rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e323e;
        line-height: 38rpx;
        margin-top: 16rpx;
        width: 28vw;
        text-align: center;
        @include text-overflow-line(1);
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 24rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  &-sureBox{
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 11vh;
    background: #fff;
    @include hor-center-center;
    &-select{
      width: 91.46vw;
      height: 80rpx;
    }
  }
}
</style>