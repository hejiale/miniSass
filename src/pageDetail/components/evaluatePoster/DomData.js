import iconFont from "@/utils/icon-font"
/**
 *  
 */
const wxml = (montageParma) => {
  //最多9张图的情况，三等分数组   
  let firstImgCard = '';
  let secondImgCard = '';
  let thirdImgCard = '';

  if (montageParma.evaluateData.imageList) {
    if (montageParma.evaluateData.imageList.length > 3) {
      let firstPart = [];
      let secondPart = [];
      let thirdPart = [];

      firstPart = JSON.parse(JSON.stringify(montageParma.evaluateData.imageList)).splice(0, 3);

      if (montageParma.evaluateData.imageList.length < 7) {
        secondPart = JSON.parse(JSON.stringify(montageParma.evaluateData.imageList)).splice(3, montageParma.evaluateData.imageList.length);
      } else {
        secondPart = JSON.parse(JSON.stringify(montageParma.evaluateData.imageList)).splice(3, 6);

        if (montageParma.evaluateData.imageList.length < 9) {
          thirdPart = JSON.parse(JSON.stringify(montageParma.evaluateData.imageList)).splice(6, montageParma.evaluateData.imageList.length);
        } else {
          thirdPart = JSON.parse(JSON.stringify(montageParma.evaluateData.imageList)).splice(6, 9);
        }
      }

      for (let i = 0; i < firstPart.length; i++) {
        firstImgCard += `<image src="` + firstPart[i] + `" class="imageItem"/>`
      }
      for (let i = 0; i < secondPart.length; i++) {
        secondImgCard += `<image src="` + secondPart[i] + `" class="imageItem"/>`
      }
      for (let i = 0; i < thirdPart.length; i++) {
        thirdImgCard += `<image src="` + thirdPart[i] + `" class="imageItem"/>`
      }
    } else {
      for (let i = 0; i < montageParma.evaluateData.imageList.length; i++) {
        firstImgCard += `<image src="` + montageParma.evaluateData.imageList[i] + `" class="imageItem"/>`
      }
    }
  }

  //sellType
  let sellTypeCard = "";
  if(montageParma.drama.sellType){
    if(montageParma.drama.sellType === 'EXCLUSIVE' || montageParma.drama.sellType === 'REAL_SCENE' || montageParma.drama.sellType === 'LIMITED'){
      let url = iconFont.getIconName(montageParma.drama.sellType)
      sellTypeCard = `<image src="`+url+`" class="sellType"/>`
    }
  }

  return `<view class="container">
  <view class="infoContent">
    <image src="`+ montageParma.drama.dramaCover + `" class="cover"/>
    <text class="dramaName">`+ montageParma.nameWords + `</text>
    <text class="scoreTitle">剧游评分</text>
    <text class="scoreValue">`+ montageParma.drama.juyouScoreAvg / 10 + `</text>
    <text class="dictValue">`+ montageParma.dictValue + `</text>
    <text class="timeValue">`+ montageParma.time + `</text>
    ${sellTypeCard}
  </view>
  <view class="evaluateContent">
    <image src="`+ montageParma.evaluateBg + `" class="evaluateBg"/>
    <image src="`+ montageParma.evaluateData.avatar + `" class="avatar" />
    <text class="nickName">`+ montageParma.evaluateData.nickName + `</text>
    <text class="date">`+ montageParma.evaluateData.evaluateTime + `</text>
    <image src="`+ montageParma.evaluateGatherTag + `" class="evaluateGatherTag"/>
  </view>
  <view class="evaluateComment">
    <text class="roleName">`+ montageParma.roleName + `</text>
    <text class="comment">`+ montageParma.evaluateData.content + `</text>
    <view class="firstImgListBox">
      ${firstImgCard}
    </view>
    <view class="secondImgListBox">
      ${secondImgCard}
    </view>
    <view class="thirdImgListBox">
      ${thirdImgCard}
    </view>
  </view>
  <view class="rankBottom">
    <image src="`+ montageParma.posterBottom + `"  class="evaluateBg"/>
    <image src="`+ montageParma.sunCode + `" class="sunCode"/>
  </view>
  <view class="evaluateTag">
    <image src="`+ montageParma.evaluateStar + `" class="evaluateBg"/>
    <text class="evaluateName">`+ montageParma.nickNameWords + `</text>
    <text class="evaluateTagText">评价这部剧本：</text>
    <image src="`+ montageParma.emojImg + `" class="emojImg"/>
    <text class="emojText">`+ montageParma.emojText + `</text>
    <text class="scoreText">`+ montageParma.scoreText + `</text>
  </view>
</view>
`
}

/**
 *
 *
 * @param {*} canvasWidth  画布宽度
 * @param {*} canvasHeight  画布高度
 * @return {*} 
 */
const style = (canvasWidth, canvasHeight, lineHeight, contentHeight, roleHeight, contentTop, nickNameScale, imageTop) => {
  console.log(roleHeight, contentTop, lineHeight, contentHeight, imageTop)
  return {
    "container": {
      width: canvasWidth,
      height: canvasHeight,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#313131',
    },
    "infoContent": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      top: 20,
      height: 160,
      backgroundColor: "#444",
      borderRadius: 8
    },
    "scoreTitle": {
      position: 'absolute',
      left: canvasWidth * 0.2933,
      top: 43,
      width: 49,
      height: 17,
      fontSize: 12,
      fontWeight: 400,
      color: "rgba(255,255,255,0.6)"
    },
    "cover": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      top: 14,
      width: canvasWidth * 0.208,
      height: 104,
      borderRadius: 6
    },
    "dramaName": {
      position: 'absolute',
      left: canvasWidth * 0.2933,
      top: 16,
      width: canvasWidth * 0.55,
      height: 25,
      fontSize: 18,
      fontWeight: 600,
      color: "#FFFFFF"
    },
    "scoreValue": {
      position: 'absolute',
      left: canvasWidth * 0.4293,
      top: 43,
      width: 30,
      height: 17,
      fontSize: 13,
      fontWeight: 800,
      color: '#FFA557'
    },
    "dictValue": {
      position: 'absolute',
      left: canvasWidth * 0.2933,
      top: 80,
      width: canvasWidth * 0.66,
      height: 20,
      color: "rgba(255,255,255,0.6)",
      fontSize: 12
    },
    "timeValue": {
      position: 'absolute',
      left: canvasWidth * 0.2933,
      top: 99,
      width: canvasWidth * 0.66,
      height: 20,
      color: "rgba(255,255,255,0.6)",
      fontSize: 12
    },
    "evaluateContent": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      top: 152,
      height: 144,
    },
    "evaluateBg": {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    "avatar": {
      position: 'absolute',
      left: canvasWidth * 0.0533,
      top: 21,
      width: 32,
      height: 32,
      borderRadius: 16
    },
    "nickName": {
      position: 'absolute',
      left: canvasWidth * 0.1626,
      top: 28,
      width: canvasWidth * 0.3,
      height: 20,
      fontSize: 13,
      fontWeight: 500,
      color: '#2E323E'
    },
    "date": {
      position: 'absolute',
      right: canvasWidth * 0.0533,
      top: 18,
      width: canvasWidth * 0.32,
      height: 17,
      fontSize: 12,
      fontWeight: 400,
      color: '#959AA5',
      textAlign: 'right'
    },
    "evaluateGatherTag": {
      position: 'absolute',
      right: canvasWidth * 0.0533,
      top: 38,
      width: canvasWidth * 0.234,
      height: 19
    },
    "evaluateTag": {
      position: 'absolute',
      left: canvasWidth * 0.04,
      right: canvasWidth * 0.04,
      top: 242,
      height: 36,
    },
    "evaluateName": {
      position: 'absolute',
      left: canvasWidth * 0.032,
      top: 9,
      width: canvasWidth * nickNameScale,
      height: 18,
      fontSize: 13,
      color: '#B66440'
    },
    "evaluateTagText": {
      position: 'absolute',
      left: canvasWidth * (nickNameScale + 0.032),
      top: 9,
      width: canvasWidth * 0.25,
      height: 18,
      fontSize: 13,
      color: '#B66440'
    },
    "emojImg": {
      position: 'absolute',
      left: canvasWidth * (nickNameScale + 0.26),
      top: 8,
      width: canvasWidth * 0.053,
      height: canvasWidth * 0.053
    },
    "emojText": {
      position: 'absolute',
      left: canvasWidth * (nickNameScale + 0.32),
      height: 18,
      width: 40,
      fontSize: 13,
      fontWeight: 600,
      color: '#B66440',
      top: 9
    },
    "scoreText": {
      position: 'absolute',
      right: 12,
      top: 12,
      width: canvasWidth * 0.3,
      height: 14,
      color: "#B66440",
      fontSize: 10,
      textAlign: 'right'
    },
    "evaluateComment": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      top: 258,
      height: contentHeight,
      backgroundColor: "#fff",
      borderRadius: 8
    },
    "roleName": {
      position: 'absolute',
      left: canvasWidth * 0.0586,
      top: 32,
      width: canvasWidth * 0.5,
      height: roleHeight,
      fontSize: 14,
      fontWeight: 400,
      color: "#4B577C"
    },
    "comment": {
      position: 'absolute',
      left: canvasWidth * 0.0586,
      right: canvasWidth * 0.0586,
      top: contentTop,
      height: lineHeight,
      fontSize: 14,
      color: '#2E323E'
    },
    "rankBottom": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      bottom: 20,
      height: 107
    },
    "sunCode": {
      position: 'absolute',
      right: canvasWidth * 0.0586,
      top: 11,
      width: 54,
      height: 54
    },
    "firstImgListBox": {
      position: 'absolute',
      left: canvasWidth * 0.0586,
      top: imageTop,
      flexDirection: 'row'
    },
    "secondImgListBox": {
      position: 'absolute',
      left: canvasWidth * 0.0586,
      top: canvasWidth * 0.2506 + 4 + imageTop,
      flexDirection: 'row'
    },
    "thirdImgListBox": {
      position: 'absolute',
      left: canvasWidth * 0.0586,
      top: (canvasWidth * 0.2506) * 2 + 8 + imageTop,
      flexDirection: 'row'
    },
    "imageItem": {
      width: canvasWidth * 0.2506,
      height: canvasWidth * 0.2506,
      borderRadius: 6,
      marginRight: 4
    },
    "sellType":{
      position: 'absolute',
      left: canvasWidth * 0.1813,
      top: 14.5,
      width: canvasWidth * 0.08,
      height: 16,
    }
  }
}

module.exports = {
  wxml,
  style
}
