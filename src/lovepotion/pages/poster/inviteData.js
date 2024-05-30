import iconFont from '@/utils/icon-font';
/**
 *
 *
 */
const wxml = (sunCode, lpUserInfo) => {
    let posterCover = `<image src="` + iconFont.getIconName('invite-poster-bg') + `" class="posterCover"/>`;
    let titleImg = `<image src="`+ iconFont.getIconName('invite-poster-title') +`" class="titleImg"/>`
    let avatar = `<image src="` + lpUserInfo.avatar + `" class="avatar"/>`;
    let sunCodeImg = `<image src="`+ sunCode +`" class="sunCodeImg"/>`;

    return `
<view class="container">
${posterCover}
<view class="qrcodeBorder"></view>
<view class="qrcodeContent"></view>
${titleImg}
${sunCodeImg}
${avatar}
<text class="nicKName">`+ lpUserInfo.name +`</text>
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
        "posterCover": {
            position: 'absolute',
            left: 0,
            top: 0,
            width: canvasWidth,
            height: canvasHeight,
        },
        "qrcodeBorder": {
            position: 'absolute',
            left: 43,
            top: 91,
            width: 120,
            height: 120,
            backgroundColor: "#C5AEAE",
            borderRadius: 60,
        },
        "qrcodeContent": {
            position: 'absolute',
            left: 43.5,
            top: 91.5,
            width: 119,
            height: 119,
            backgroundColor: "#fff",
            borderRadius: 60,
        },
        "sunCodeImg": {
            position: 'absolute',
            left: 48,
            top: 96,
            width: 110,
            height: 110,
            backgroundColor: "#fff",
            borderRadius: 60,
        },
        "titleImg": {
            position: 'absolute',
            left: 74,
            top: 215,
            width: 62,
            height: 12,
        },
        "avatar":{
            position: 'absolute',
            left: 14,
            bottom: 25,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#fff",
        },
        "nicKName": {
            position: 'absolute',
            left: 32,
            bottom: 25,
            width: canvasWidth * 0.7,
            height: 14,
            fontSize: 11,
            color: '#2E323E'
        }
    }
}

module.exports = {
    wxml,
    style
}
