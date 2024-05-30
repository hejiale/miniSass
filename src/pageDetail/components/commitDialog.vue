<template>
  <div class="commit-dialog">
    <p class="title">
        觉得这个本怎么样？
    </p>
    <p class="intro">
        点击表情给出综合评价
    </p>
    <ul class="status-list">
        <li class="status-item" 
            @click="toggleActive(index)"
            :class="{'active-status': activeIndex === index}"
             v-for="(item, index) in statusList" :key="index">
            <img :src="activeIndex === index ? item.activeImgUrl : item.imgUrl" alt="">
            <span class="name">{{ item.label }}</span>
        </li>
    </ul>
    <div>

    </div>
    <div class="btn-area">
        <div class="btn" @click="closePopup">取消</div>
        <div class="btn confirm" @click="triggerEvent">确认选择</div>
    </div>
    <p class="center-info"><span style="color: #1D4788">客观真实</span>
        <span>的评价能帮助他人了解剧本</span></p>
    
    <div class="close-icon" @click="closePopup">
        <img :src="$iconFont.getIconName('closedialog')" alt="">
    </div>
  </div>
</template>

<script>
export default {
    props: {
        showDialog:{
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            statusList: [
                {imgUrl: this.$iconFont.getIconName('no'), activeImgUrl: this.$iconFont.getIconName('no-active'), label: '不行'},
                {imgUrl: this.$iconFont.getIconName('generally'), activeImgUrl: this.$iconFont.getIconName('generally-active'), label: '一般'},
                {imgUrl: this.$iconFont.getIconName('recommend'), activeImgUrl: this.$iconFont.getIconName('recommend-active.png'), label: '推荐'}
            ],
            activeIndex: null
        }
    },
    methods: {
      triggerEvent() {
        this.$emit('confirm-click',this.activeIndex);
    },
        toggleActive(index) {
            this.activeIndex = index;
        },
        closePopup() {
            this.$emit('closePopup')
            setTimeout(() => {
                this.activeIndex = null
            },400)
        }
    },
    watch: {
        showDialog(nVal) {
            !nVal && setTimeout(() => {
                this.activeIndex = null
            },400)
        },
  },
}
</script>

<style lang="scss" scoped>
.commit-dialog {
    width: 100%;
    box-sizing: border-box;
    padding: 60rpx 32rpx 32rpx;
    display: flex;
    flex-direction: column;
    position: relative;

    .close-icon {
        width: 52rpx;
        height: 52rpx;
        position: absolute;
        top: 28rpx;
        right: 28rpx;
    }

    .title {
        font-size: 40rpx;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #2E323E;
        line-height: 47rpx;
        margin-left: 14rpx;
        margin-bottom: 6rpx;
    }

    .intro {
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5F6572;
        line-height: 28rpx;
        margin-left: 14rpx;
        margin-bottom: 82rpx;
    }

    .status-list  {
        width: 100%;
        display: flex;
        justify-content: space-around;

        .status-item {
            width: 182rpx;
            height: 212rpx;
            background: #F3F3F4;
            border-radius: 32rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &.active-status {
                border: 2rpx solid #36E4BB;
                background: #EFFFFB;
                .name {
                    color: #2E323E;
                }
            }
            img {
                width: 64rpx;
                height: 64rpx;
                margin-bottom: 12rpx;
            }
            .name {
                font-size: 28rpx;
                font-family: PingFang SC-Regular, PingFang SC;
                font-weight: 400;
                color: #5F6572;
                line-height: 33rpx;
            }
        }
    }

    .btn-area {
        margin-top: 58rpx;
        width: 100%;
        display: flex;
        justify-content: space-between;

        .btn {
            width: 310rpx;
            height: 90rpx;
            background: #F3F3F4;
            border-radius: 16rpx;
            font-size: 30rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #2E323E;
            text-align: center;
            line-height: 90rpx;
            border: none;
            margin: 0;
            padding: 0;
        }

        .confirm {
            background: #36E4BB;
        }
    }

    .center-info {
        margin-top: 24rpx;
        width: 100%;
        text-align: center;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #5F6572;
    }
}
</style>