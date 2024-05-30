<template>
  <div class="box" style="style">
		<div class="line"></div>
		<div class="title">
			{{title}}
		</div>
		<div class="line"></div>
	</div>
</template>

<script>
export default {
 data() {
	return {

	}
 },
 props: {
   title:{
		 type: String,
		 default: '主持人位置'
	 },
	 style:{
		 type: String,
	 },
 },
 components: {

 }
}
</script>

<style scoped lang="scss">
.box {
	width:100%;
}
.line {
	background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255,0.65) 50%, rgba(255, 255, 255,0) 100%);
	height: 1px;
	width: 100%;
}
.title {
	/* padding: 0 58px; */
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	color: #F7CB3F;
	text-align: center;
	line-height: 20px;
	background: linear-gradient(270.06deg, rgba(0, 0, 0, 0) 0.05%, rgba(0, 0, 0, 0.6) 46.88%, rgba(0, 0, 0, 0) 94.76%);
}
</style>
