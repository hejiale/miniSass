<template>
	<div class="card">
		<div class="border" @click="handleClick">
			<div class="borderBody">
					<template v-if="dataSource.clueType === 'VIDEO'">
						<image class="bgIMG" :src="dataSource.clueIcon" />
						<div class="videoMask"></div>
						<image class="video"  src="@/static/image/clue/video.png" mode="widthFix" />
					</template>
					<template v-if="dataSource.clueType === 'AUDIO'">
						<image class="bgIMG" :src="dataSource.clueIcon" />
						<div class="musicMask"></div>
						<image class="music"  src="@/static/image/clue/music.png" mode="widthFix" />
						<image class="musicAvatar" :src="dataSource.clueIcon"  />
					</template>
					<template v-if="dataSource.clueType === 'TEXT' || dataSource.clueType === 'IMAGE'">
						<image class="bgIMG"    :src="$filters.waterMarkImg(dataSource.clueIcon, userInfo.juyouId, roomInfo.storeNumber)"/>
					</template>
			</div>
		</div>
		<div class="clueName">
			{{dataSource.clueName}}
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
 data() {
	return {
    type: 'TEXT'
	}
 },
 created() {},
 props: {
   dataSource: {
		type: Object,
   },
 },
 computed: {
    ...mapState("player", [
      "userInfo",
	  "roomInfo"
    ]),
  },
 methods: {
  handleClick() {
		this.$emit('handleClick')
	}
 }
}
</script>

<style scoped lang="scss">
.card {
		display: flex;
		flex-direction: column;
		.clueName {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 10px;
			text-align: center;
			color: #FFFFFF;
			width: 100%;
			margin-top: 5px;
			display: inline-block;
			@include text-overflow-line(1);
		}
		.border {
			border: 2px solid rgba(168, 152, 93, 1);
			border-radius: 2px;
			display: inline-flex;
			position: relative;
			/* overflow: hidden; */
			/* background: linear-gradient(to right, rgba(204, 188, 145, 1), rgba(168, 152, 93, 1)); */
			.borderBody {
				border: 1px solid #000000;
			  position: relative;
				width: 75px;
				height:100px;
			}
			
      .bgIMG {
				border-radius: 1px;
				width: 100%;
				height: 100%;
			}
			.videoMask {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.6);
				z-index: 1;
			}
			.video {
				width: 26px;
        height: 26px;
				position: absolute;
				z-index: 2;
        left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			.musicMask {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.6);
				z-index: 1;
				backdrop-filter: blur(3px);
			}
			.music {
				width: 100%;
        height: 100%;
				position: absolute;
				z-index: 2;
        left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			.musicAvatar {
				width: 35.26px;
        height: 35.26px;
				position: absolute;
				z-index: 3;
        left: 50%;
				top: 50%;
				border-radius: 50%;
				transform: translate(-50%, -50%);
			}
		}
		
		
}
</style>
