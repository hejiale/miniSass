<template>
 <div class="box">
		<span class="icon icon-left"></span>
		<div class="line"></div>
		<span class="icon icon-right"></span>
</div>
</template>

<script>
export default {
 data() {
	return {

	}
 },
 components: {

 }
}
</script>

<style scoped lang="scss">
.box {
    width: 100%;
    position: relative;
    margin: 10px 0;
    .line {
      width:  calc(100% - 10px);
      height: 1px;
      background: rgba(255,255,255,0.3);
      margin-left: 5px;
    }
    .icon {
      width: 8px;
      height: 8px;
      background: rgba(255,255,255,0.3);
      display: inline-block;
      transform: rotate(45deg);
      &-left {
        position: absolute;
        left: -4px;
        top: -4px;
      }
      &-right {
        position: absolute;
        right: -4px;
        top: -4px;
      }
    }
  }
</style>
