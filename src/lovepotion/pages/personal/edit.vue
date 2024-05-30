<template>
  <div>
    <navigationBar :nav="customNav">
      <view slot="left" @click="onBack">
        <image src="../../static/image/icon-close.png" class="closeIcon"></image>
      </view>
      <div slot="content" v-if="type">
        <album v-if="type === 'album'" @on-next="onGoNext" @on-upload="onUpload" :value="lpUserInfo.albumUrls"></album>
        <editField v-else-if="type === 'desc'" :content="updateValue" @on-next="onGoNext"></editField>
        <editMenu v-else-if="isMenu" :title="titleName" :type="type" @on-next="onGoNext" :placeholder="placeholder" :value="updateValue" :rightValue="updateRightValue"></editMenu>
        <editDate v-else-if="isDate" :title="titleName" @on-next="onGoNext" :value="updateValue"></editDate>
        <editPicker
          :title="titleName"
          v-else-if="isPicker"
          :type="type"
          @on-next="onGoNext"
          :value="updateValue"
        ></editPicker>
        <editPicker
          :title="titleName"
          :type="type"
          v-else-if="type === 'city'"
          @on-next="onGoNext"
          :isOverSea="lpUserInfo.isOverSea"
          :provinceId="lpUserInfo.provinceId"
          :cityId="lpUserInfo.cityId"
          :value="updateValue"
        ></editPicker>
        <editPicker
          :title="titleName"
          v-else-if="type === 'residence'"
          @on-next="onGoNext"
          :value="updateValue"
          :isOverSea="lpUserInfo.permanentResidenceType === 'OVERSEAS'"
          :permanentResidenceProvince="lpUserInfo.permanentResidenceProvince"
          :permanentResidenceCity="lpUserInfo.permanentResidenceCity"
          :type="type"
        ></editPicker>
        <editInput
          :title="titleName"
          :type="type"
          :updateValue="updateValue"
          :subTitle="subTitle"
          :placeholder="placeholder"
          :inputType="inputType"
          @on-next="onGoNext"
          v-else
        ></editInput>
      </div>
    </navigationBar>
  </div>
</template>
<script>
import service from "../../utils/service";
import album from "./components/album.vue";
import editInput from "./components/edit-input.vue";
import editField from "./components/edit-field.vue";
import editPicker from "./components/edit-picker.vue";
import editMenu from "./components/edit-menu.vue";
import editDate from "./components/edit-date.vue";
import navigationBar from "@/components/navigation-bar/index.vue";
export default {
  components: {
    album,
    navigationBar,
    editInput,
    editField,
    editPicker,
    editMenu,
    editDate,
  },
  data() {
    return {
      customNav: {
        customizeLeft: true,
      },
      type: null,
      types: [
        "album",
        "name",
        "sex",
        "phone",
        "desc",
        "age",
        "occupation",
        "education",
        "height",
        "weight",
        "politics",
        "city",
        "residence",
        "hobby",
        "diet",
        "motion",
        "animal",
        "movieType",
        "movie",
        "musicType",
        "music",
        "book",
        "place"
      ],
      userInfo: null,
      lpUserInfo: null,
      updateValue: null,
      updateRightValue: null
    };
  },
  onLoad(options) {
    this.type = options.type;
  },
  async onShow() {
    this.userInfo = await this.$checkLogin.getUserInfo();
    await this.getMemberInfo();
  },
  computed: {
    isPicker() {
      return (
        this.type === "sex" ||
        this.type === "education" ||
        this.type === "politics" ||
        this.type === "occupation" ||
        this.type === "weight" ||
        this.type === "height"
      );
    },
    isMenu() {
      return (
        this.type === "hobby" || this.type === "motion" || this.type === "diet" || this.type === 'movieType' || this.type === 'musicType' || this.type === "place"
      );
    },
    isDate() {
      return this.type === "age";
    },
    titleName() {
      if (this.type === "name") {
        return "修改姓名";
      } else if (this.type === "phone") {
        return "手机号";
      } else if (this.type === "animal") {
        return "最喜欢的动物";
      } else if (this.type === "place") {
        return "近期想去的地方";
      } else if (this.type === "movie") {
        return "最喜欢的电影";
      } else if (this.type === "music") {
        return "最喜欢的音乐";
      } else if (this.type === "book") {
        return "最喜欢的书籍";
      } else if (this.type === "sex") {
        return "性别";
      } else if (this.type === "education") {
        return "学历";
      } else if (this.type === "politics") {
        return "政治面貌";
      } else if (this.type === "city") {
        return "籍贯";
      } else if (this.type === "residence") {
        return "常住地";
      } else if (this.type === "hobby") {
        return "休闲爱好";
      } else if (this.type === "motion") {
        return "运动爱好";
      } else if (this.type === "diet") {
        return "饮食爱好";
      } else if (this.type === "occupation") {
        return "职业";
      } else if (this.type === "weight") {
        return "体重";
      } else if (this.type === "height") {
        return "身高";
      } else if (this.type === "age") {
        return "年龄";
      } else if (this.type === "movieType") {
        return "喜欢的电影类型";
      } else if (this.type === "musicType") {
        return "喜欢的音乐类型";
      }
      return "";
    },
    placeholder() {
      if (this.type === "name") {
        return "输入您的真实姓名";
      } else if (this.type === "phone") {
        return "输入您的11位手机号";
      } else if (this.type === "animal") {
        return "输入你最喜欢的动物名称";
      } else if (this.type === "place") {
        return "输入你近期想去的地方";
      } else if (this.type === "movie") {
        return "输入你最喜欢的电影名称";
      } else if (this.type === "music") {
        return "输入你最喜欢的音乐名称";
      } else if (this.type === "book") {
        return "输入你最喜欢的书籍名称";
      } else if (this.type === "hobby") {
        return "输入您的休闲爱好";
      } else if (this.type === "diet") {
        return "输入您的饮食爱好";
      } else if (this.type === "motion") {
        return "输入您的运动爱好";
      } else if (this.type === "movieType") {
        return "输入您喜欢的电影类型";
      } else if (this.type === "movieType") {
        return "输入您喜欢的音乐类型";
      }
      return "";
    },
    inputType() {
      if (this.type === "phone") {
        return "number";
      }
      return "text";
    },
    subTitle() {
      if (this.type === "animal" || this.type === "place") {
        return "由汉字和英文组成，不支持特殊符号";
      }
      return "";
    },
  },
  watch:{
    type(){
      this.getUpdateValue();
    }
  },
  methods: {
    onBack() {
      uni.navigateBack();
    },
    //相册保存
    async onUpload(value){
      await service.LpUserMessageSave({
        ...this.lpUserInfo,
        albumUrls: value
      }) 
      await this.getMemberInfo();
      wx.hideLoading();
    },
    async onGoNext(value){
      if(this.type !== 'album' && value){
        if(this.type === 'name'){
          this.lpUserInfo.name = value;
        }else if(this.type === 'animal'){
          this.lpUserInfo.favoriteAnimal = value;
        }else if(this.type === 'place'){
          this.lpUserInfo.placesToVisitDomestic = value.dom;
          this.lpUserInfo.placesToVisitOversea = value.over;
        }else if(this.type === 'movie'){
          this.lpUserInfo.favoriteMovie = value;
        }else if(this.type === 'movieType'){
          this.lpUserInfo.favoriteMovieGenres = value;
        }else if(this.type === 'musicType'){
          this.lpUserInfo.favoriteMusicGenres = value;
        }else if(this.type === 'music'){
          this.lpUserInfo.favoriteMusic = value;
        }else if(this.type === 'book'){
          this.lpUserInfo.favoriteBook = value;
        }else if(this.type === 'desc'){
          this.lpUserInfo.content = value;
        }else if(this.type === 'sex'){
          this.lpUserInfo.sex = value;
        }else if(this.type === 'occupation'){
          this.lpUserInfo.occupation = value;
        }else if(this.type === 'education'){
          this.lpUserInfo.education = value;
        }else if(this.type === 'height'){
          this.lpUserInfo.height = this.$filters.deleteUnit(value,'cm');
        }else if(this.type === 'weight'){
          this.lpUserInfo.weight = this.$filters.deleteUnit(value,'kg');
        }else if(this.type === 'politics'){
          this.lpUserInfo.politicalStatus = value;
        }else if(this.type === 'age'){
          this.lpUserInfo.age = value.age;
          this.lpUserInfo.birthday = value.birthday;
        }else if(this.type === 'city'){
          if(value.type === 0){
            this.lpUserInfo.isOverSea = false;
            this.lpUserInfo.provinceId = value.province.id;
            this.lpUserInfo.provinceName = value.province.text;
            this.lpUserInfo.cityId = value.city.id;
            this.lpUserInfo.cityName = value.city.text;
          }else{
            this.lpUserInfo.isOverSea = true;
            this.lpUserInfo.overSeaNativePlace = value;
          }
        }else if(this.type === 'residence'){
          if(value.type === 0){
            this.lpUserInfo.permanentResidenceType = 'DOMESTIC';
            this.lpUserInfo.permanentResidenceProvince = value.province.text;
            this.lpUserInfo.permanentResidenceCity = value.city.text;
            this.lpUserInfo.permanentResidenceOverSeas = null;
          }else{
            this.lpUserInfo.permanentResidenceType = 'OVERSEAS';
            this.lpUserInfo.permanentResidenceProvince = null;
            this.lpUserInfo.permanentResidenceCity = null;
            this.lpUserInfo.permanentResidenceOverSeas = value;
          }
        }else if(this.type === 'hobby'){
          this.lpUserInfo.leisureHobbies = value;
        }else if(this.type === 'motion'){
          this.lpUserInfo.sportsHobbies = value;
        }else if(this.type === 'diet'){
          this.lpUserInfo.dietaryPreferences = value;
        }else if(this.type === 'phone'){
          this.lpUserInfo.phone = value;
        }
        this.save();
      }
      if(this.type == 'place'){
        uni.navigateBack();
      }else{
        this.type = this.types[this.types.indexOf(this.type) + 1];
      }
    },
    //查询会员信息 
    async getMemberInfo() {
      this.lpUserInfo = {};
      
      this.lpUserInfo = await service.queryLpUserMessage({
        userId: this.userInfo.id,
      });
      this.getUpdateValue();
    },
    //保存信息
    async save(){
      await service.LpUserMessageSave({
        ...this.lpUserInfo
      })
    },
    getUpdateValue(){
      if(!this.lpUserInfo)return;
      
      if(this.type === 'name'){
        this.updateValue = this.lpUserInfo.name;
      }else if(this.type === 'animal'){
        this.updateValue = this.lpUserInfo.favoriteAnimal;
      }else if(this.type === 'movie'){
        this.updateValue = this.lpUserInfo.favoriteMovie;
      }else if(this.type === 'music'){
        this.updateValue = this.lpUserInfo.favoriteMusic;
      }else if(this.type === 'book'){
        this.updateValue = this.lpUserInfo.favoriteBook;
      }else if(this.type === 'place'){
        this.updateValue = this.lpUserInfo.placesToVisitDomestic;
        this.updateRightValue = this.lpUserInfo.placesToVisitOversea;
      }else if(this.type === 'phone'){
        this.updateValue = this.lpUserInfo.phone;
      }else if(this.type === 'desc'){
        this.updateValue = this.lpUserInfo.content;
      }else if(this.type === 'sex'){
        this.updateValue = this.lpUserInfo.sex;
      }else if(this.type === 'occupation'){
        this.updateValue = this.lpUserInfo.occupation;
      }else if(this.type === 'education'){
        this.updateValue = this.lpUserInfo.education;
      }else if(this.type === 'height'){
        this.updateValue = this.$filters.setUnit(this.lpUserInfo.height, 'cm');
      }else if(this.type === 'weight'){
        this.updateValue = this.$filters.setUnit(this.lpUserInfo.weight, 'kg');
      }else if(this.type === 'politics'){
        this.updateValue = this.lpUserInfo.politicalStatus;
      }else if(this.type === 'hobby'){
        this.updateValue = this.lpUserInfo.leisureHobbies;
      }else if(this.type === 'motion'){
        this.updateValue = this.lpUserInfo.sportsHobbies;
      }else if(this.type === 'diet'){
        this.updateValue = this.lpUserInfo.dietaryPreferences;
      }else if(this.type === 'age'){
        this.updateValue = this.lpUserInfo.birthday;
      }else if(this.type === 'residence' && this.lpUserInfo.permanentResidenceType === 'OVERSEAS'){
        this.updateValue = this.lpUserInfo.permanentResidenceOverSeas;
      }else if(this.type === 'musicType'){
        this.updateValue = this.lpUserInfo.favoriteMusicGenres;
      }else if(this.type === 'movieType'){
        this.updateValue = this.lpUserInfo.favoriteMovieGenres;
      }else if(this.type === 'city' && this.lpUserInfo.isOverSea){
        this.updateValue = this.lpUserInfo.overSeaNativePlace;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.closeIcon{
  width: 28rpx;
  height: 28rpx;
  padding: 20rpx;
}
</style>