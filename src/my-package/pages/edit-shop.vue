<template>
    <view>
        <edit-infor @backRoute="backRoute" :value.sync="value" :label.sync="label" :type.sync="type"></edit-infor>
    </view>
</template>

<script>
import editInfor from '../components/edit-infor';
export default {
    components:{
        editInfor
    },
    data(){
        return{
           value:'2',
           label: '标题',
           type: '',
           title: '',
           userInfor: null
        }
    },
    onLoad(options){
        this.value = JSON.parse(options.userInfor)[options.title]
        this.type = options.enumtype
        this.label = this.switchLable(options.title)
        this.title = options.title
        this.userInfor = JSON.parse(options.userInfor)
    },
    methods:{
        async backRoute(){
            this.userInfor[this.title] = this.value
            uni.navigateBack()
        },
        switchLable(title){
            switch(title){
                case 'nickName':
                    return '昵称'
                case 'phone': 
                    return '手机号'
                case 'sex': 
                    return '性别'
                case 'wxNumber': 
                    return '微信号'
                default: 
                    return '标题'
            }
        },
        onChange(event){
        },
    }
}
</script>

<style>

</style>