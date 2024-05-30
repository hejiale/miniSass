import iconFont from '@/utils/icon-font';
import dayjs from 'dayjs'
import enums from '@/utils/enums'
/**
 *
 *
 */
const wxml = (info, title) => {
  let posterCover = `<image src="`+ iconFont.getIconName('lp-poster-bg') +`" class="posterCover"/>`;
  let coverImg = `<image src="` + info.urls[0] + `" class="coverImg"/>`;
  let coverBorder = `<image src="` + iconFont.getIconName('lp-poster-cover-border') + `" class="coverBorder"/>`;
  let address = `地点：${info.address}`;
  let date = `时间：${dayjs(info.eventStartTime).format('YYYY-MM-DD HH:mm')}`;
  let user = `${info.name} ${(info.sex === 'MALE' || info.sex === 'FEMALE') ? enums.LP_SEX.getName(info.sex):''} ${info.phone}`;

  return `
<view class="container">
${posterCover}
${coverImg}
${coverBorder}
<text class="name">`+ title + `</text>
<text class="date">`+ date + `</text>
<text class="address">`+ address + `</text>
<text class="note">您已成功报名本期活动！</text>
<text class="user">`+ user +`</text>
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
const style = (canvasWidth, canvasHeight) => {
  return {
    "container": {
      position: 'relative',
      overflow: 'hidden',
      width: canvasWidth,
      height: canvasHeight
    },
    "posterCover":{
      position: 'absolute',
      left: 0,
      top: 0,
      width: canvasWidth,
      height: canvasHeight,
    },
    "coverImg":{
      position: 'absolute',
      left: 26,
      top: 25,
      width: 242,
      height: 320,
      borderRadius: 6
    },
    "coverBorder":{
      position: 'absolute',
      left: 26,
      top: 25,
      width: 242,
      height: 320,
      zIndex: 1
    },
    "address":{
      position: 'absolute',
      left: 22,
      top: 494,
      fontSize: 11,
      fontWeight: 400,
      color: '#fff',
      width: canvasWidth * 0.8,
      height: 44,
      zIndex: 1
    },
    "date":{
      position: 'absolute',
      left: 22,
      top: 476,
      fontSize: 11,
      fontWeight: 400,
      color: '#fff',
      width: canvasWidth * 0.8,
      height: 22,
      zIndex: 1,
    },
    "name":{
      position: 'absolute',
      left: 22,
      top: 432,
      fontSize: 20,
      fontWeight: 600,
      color: '#fff',
      width: canvasWidth * 0.8,
      height: 20,
      fontFamily: 'PingFang HK, PingFang HK'
    },
    "note":{
      position: 'absolute',
      left: 22,
      top: 411,
      fontSize: 13,
      fontWeight: 400,
      color: '#fff',
      width: canvasWidth * 0.8,
      height: 22,
      zIndex: 1
    },
    "user":{
      position: 'absolute',
      left: 22,
      top: 383,
      fontSize: 13,
      fontWeight: 400,
      color: '#EDD3BF',
      width: canvasWidth * 0.8,
      height: 22,
      zIndex: 1
    }
  }
}

module.exports = {
  wxml,
  style
}
