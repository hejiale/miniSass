
/**
 *  
 */
const wxml = (canvasBg, posterBottom, sunCode, words, darkBg, time, dictValue) => `
<view class="container">
  <view class="content">
    <image src="`+ canvasBg + `"  class="cover"/>
    <image src="`+ darkBg + `"  class="darkBg"/>
    <text class="name">`+ words + `</text>
    <text class="time">`+ time + `</text>
    <view class="line"></view>
    <view class="line"></view>
    <text class="dictValue">`+ dictValue + `</text>
  </view>
  <view class="rankBottom">
    <image src="`+ posterBottom + `"  class="rankBottomBg"/>
    <image src="`+ sunCode + `" class="sunCode"/>
  </view>
</view>
`

/**
 *
 *
 * @param {*} canvasWidth  画布宽度
 * @param {*} canvasHeight  画布高度
 * @return {*} 
 */
const style = (canvasWidth, canvasHeight, isPortrait) => {
  return {
    "container": {
      width: canvasWidth,
      height: canvasHeight,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4D4D4D',
    },
    "cover": {
      position: 'absolute',
      left: canvasWidth * 0.032,
      right: canvasWidth * 0.032,
      top: canvasHeight * (isPortrait ? 0.0147 : 0.032),
      height: canvasHeight * (isPortrait ? 0.7306 : 0.56),
      borderRadius: 8,
    },
    "content": {
      position: 'absolute',
      left: canvasWidth * 0.0533,
      right: canvasWidth * 0.0533,
      top: canvasHeight * (isPortrait ? 0.029 : 0.05),
      height: canvasHeight * (isPortrait ? 0.76 : 0.624),
      backgroundColor: "#fff",
      borderRadius: canvasWidth * 0.032
    },
    "rankBottom": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      top: canvasHeight * (isPortrait ? 0.787 : 0.672),
      height: canvasHeight * (isPortrait ? 0.195 : 0.29)
    },
    "rankBottomBg": {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    "sunCode": {
      position: 'absolute',
      right: canvasWidth * 0.0586,
      top: canvasHeight * 0.02,
      width: canvasWidth * 0.144,
      height: canvasWidth * 0.144
    },
    "name": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      bottom: canvasHeight * (isPortrait ? 0.048 : 0.08),
      fontSize: canvasWidth * 0.053,
      fontWeight: 600,
      color: "#FFFFFF",
      height: canvasHeight * 0.086
    },
    "darkBg": {
      position: 'absolute',
      left: canvasWidth * 0.032,
      right: canvasWidth * 0.032,
      bottom: canvasHeight * (isPortrait ? 0.0147: 0.03),
      height: canvasHeight * 0.34,
      borderRadius: 8,
    },
    "time": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      bottom: canvasHeight * 0.048,
      width: canvasWidth * 0.2133,
      height: 17,
      fontSize: 12,
      fontWeight: 400,
      color: "rgba(255,255,255,0.6)"
    },
    "line": {
      position: 'absolute',
      left: canvasWidth * 0.263,
      bottom: canvasHeight * (isPortrait ? 0.053: 0.056),
      width: 1,
      height: 11,
      backgroundColor: "rgba(255,255,255,0.2)"
    },
    "dictValue": {
      position: 'absolute',
      left: canvasWidth * 0.283,
      bottom: canvasHeight * 0.048,
      width: canvasWidth * 0.4533,
      height: 17,
      color: "rgba(255,255,255,0.6)",
      fontSize: 12,
    }
  }
}

module.exports = {
  wxml,
  style
}
