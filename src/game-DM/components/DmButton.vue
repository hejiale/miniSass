<template>
	<div class="button" @click="handleClick">
		<image :src="bgImg" mode="aspectFill"/>
		<!-- <span>{{name}}</span> -->
	</div>
</template>

<script>
export default {
 data() {
	return {

	}
 },
 props: {
//    name:{
// 		 type: String,
// 		 default: '开始选角'
// 	 },
	 bgImg:{
		type: String,
		default: ''
	 }
 },
 methods: {
   handleClick() {
		 this.$emit('handleClick')
	 }
 }
}
</script>

<style scoped lang="scss">
.button {
	display: inline-block;
	position: relative;
	width: rpx(170);
	height: rpx(45);
	image {
	  @include abscenter;
	}
	// span {
	// 	display: inline-block;
	// 	width: 100%;
	// 	position: absolute;
	// 	left: 50%;
	// 	top: 50%;
	// 	color: #FFFFFF;
	// 	font-weight: 700;
	// 	font-size: 20px;
	// 	line-height: 29px;
	// 	padding: 8px 41px;
	// 	transform: translate(-50%, -50%);
	// }
}
</style>
