<template>
    <view class="">
        <view class="input-box">
            <!-- <view class="details">{{ details }}</view> -->
            <view class="in_bot">
                <textarea @change="changeValue" :heightRpx="60" :cursorSpacing="80" class="textbox" v-model="val"
                    placeholder="展开说说吧..." :showConfirmBar="false" :focus="commit" border="none" @blur="blur"
                    :placeholderStyle="placeholderStyle" style="padding: 20rpx;"></textarea>
                <button class="but" :class="val.length ? 'active':''" @tap="sendFS">发送</button>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            val: '',
            placeholderStyle: {
                padding: '30rpx 0'
            }
        }
    },
    props: {
        commit: {
            type: Boolean,
            default: false,
        },
        details: {
            type: String,
            default: '',
        },
    },
    methods: {
        changeValue(e) {
            console.log(e.target.value);
        },
        sendFS() {
            console.log(this.val);
            this.$emit("submit", this.val)
            this.val = '';
        },
        blur() {
            this.$emit('blurCom')
        }
    }
}
</script>
<style lang="scss" scoped>
.input-box {
    width: 686rpx;
    min-height: 210rpx;
    padding: 32rpx;
    background: #ffffff;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 15;

    .details {
        width: 686rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .in_bot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 32rpx;

        .textbox {
            width: 578rpx;
            height: 132rpx;
            background: #F5F6F8;
            border-radius: 16rpx 16rpx 16rpx 16rpx;
            opacity: 1;
        }
    }

    .but {
        width: 150rpx;
        height: 64rpx;
        background: #BCBFC5;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        opacity: 1;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        margin-left: 10rpx;
    }
    .active{
        background: #725CF5;
    }
}
</style>