<template>
	<view>
		<van-popup
				:show="showPopup"
				round
				position="bottom"
				@click-overlay="showPopup = false"
				close-on-click-overlay
			>
				<van-datetime-picker
					:type="type"
					:value="currentTime"
					:max-date="$dayjs(maxDate).valueOf()"
					:min-date="$dayjs().valueOf()"
					@cancel.native="showPopup = false"
					@confirm.native="doConfirm" 
					:formatter="formatter"
				/>
			</van-popup>
	</view>
</template>

<script>

export default {
	components: {},
	props: {
    type: {
      type: String,
      default: "date", 
    },
  },
	data: () => ({
		showPopup: false,
		formatter(type, value) {
			if (type === "year") {
				return `${value}年`;
			}
			if (type === "month") {
				return `${value}月`;
			}
			if (type === "day") {
				return `${value}日`;
			}
			return value;
		},
		maxDate: new Date(new Date("2099/12/31")).getTime(),
}),
computed: {
	currentTime() {
		return this.$dayjs(new Date()).valueOf();
	},
},
watch: {},
onLoad(options) {

},
onShow() {

},
methods: {
	doConfirm(value) {
		let temp = value.detail;
		// let format = this.type === "date" ? "YYYY-MM-DD" : "YYYY-MM";
		// let timeInfo = this.$dayjs(temp).format(format);
		let timeInfo = temp;
		this.showPopup = false;
		this.$emit('updateDate', timeInfo)
		// this.$emit("update:timeInfo", timeInfo);
	},
	open () {
		this.showPopup = true
	}
},
}
</script>
<style lang='scss'>

</style>