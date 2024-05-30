<template>
    <view class="img-add" @click="clickAdd" :class="className" :style="[boxStyle]">
        <image src="../../../../static/image/upload.png"></image>
    </view>
</template>

<script>
    /**
     * img-add 添加图片按钮
     * @description 用于图片列表最后一项，添加图片
     * @property {String} className 要添加到元素的样式名
     * @property {String} borderType 边框类型，默认dashed
     * @property {String} height 高度，需要传入单位
     * @property {String} width 宽度，需要传入单位
     */
    export default {
    	name: 'img-add',
    	props: {
            className: {
                type: String,
                default: ''
            },
            borderType:{
                type: String,
                default:'dashed'
            },
            height: {
                type: String,
                default:null
            },
            width: {
                type: String,
                default:null
            },
    	},
        computed:{
            boxStyle: function(){
                let style = {};
                if(this.height){
                    style['height'] = this.height;
                    style['width'] = this.height;
                }
                if(this.width){
                    style['width'] = this.width;
                    if(!this.height){
                        style['height'] = this.width;
                    }
                }
                return style;
            }
        },
        methods:{
            clickAdd(e){
                this.$emit('click', e);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .img-add{
        min-width: 120rpx;
        min-height: 120rpx;
        background: #F5F6F8;
        border-radius: 20rpx;
        position: relative;
        box-sizing: border-box;
        z-index: 1;
    }
</style>
