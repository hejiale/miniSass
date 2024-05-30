<template>
    <view class="card shop-card" :style="{'margin': '0' + ' '+ spacing}" @click="clickShop">
        <image mode="aspectFill" class="card-image" :src="$filters.processImage(storeLogo, 160)" :style="{'width': imageStyle.width,'height': imageStyle.height,'margin': imageStyle.margin}" lazy-load />
        <!-- <view class="card-image" :style="{'background': `url(${storeLogo})`,'background-repeat': 'no-repeat', 'background-size': `${imageStyle.width} imageStyle.height`, 'width': imageStyle.width,'height': imageStyle.height,'margin': imageStyle.margin}"> -->

        <!-- </view> -->
        <view class="card-content">
            <view class="card-content-title">
                <span>
                    {{showName}}
                </span>
                <slot name="title-right"></slot>
            </view>
            <view class="card-content-address">
                <span v-if="!addressSlot">
                    {{address.length > 13? address.substr(0,13)+'...' : address}}
                </span>
                <slot v-else name="left"></slot>
                <span v-if="isKm[1]&&isKm[0]">
                    {{isKm[0] + 'km'}}
                </span>
                <slot v-if="isKm[1]&&!isKm[0]" name="right"></slot>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props:{
        showName:{
            type: String,
            default: 'DRAMA沉浸剧本体验馆'
        },
        address:{
            type: String,
            default: '长沙市雨花区德思勤城市广场...'
        },
        isKm:{
            type: Array,
            default: [2.7,false]
        },
        storeLogo:{
            type: String,
            default: '../static/image/auditIcon.png'
        },
        spacing:{
            type: String,
            default: '0'
        },
        addressSlot:{
            type: Boolean,
            default: false
        },
        background:{
            type: String,
            default: '#F7F7FA'
        },
        imageStyle:{
            type: Object,
            default: {
                width: 96 + 'rpx',
                height: 96 + 'rpx',
                margin: 10 + 'rpx',
            }
        }
    },
    methods:{
        clickShop(){
            this.$emit('clickShop')
        }
    }
}
</script>
<style lang="scss">
.card{
    display: flex;
    align-items: center;
    border-radius: 8rpx;
    min-height: 128rpx;
    .card-image{
        border-radius: 8rpx;
    }
    &-content{
        display: flex;
        flex-direction: column;
        width: 80%;
        margin-left: 20rpx;
        justify-content: space-around;
        &-title{
            font-size: 30rpx;
            font-family: PingFang SC, PingFang SC-Semibold;
            font-weight: 600;
            text-align: LEFT;
            color: #333333;
            line-height: 36rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        &-address{
            display: flex;
            justify-content: space-between;
            width: 100%;
            // min-width: 544rpx;
            font-size: 24rpx;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            text-align: LEFT;
            color: #666666;
            margin-top: 6rpx;
        }
    }
}
</style>