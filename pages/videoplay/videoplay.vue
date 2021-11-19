<template>
	<view class="container">
		<video :src="videoUrl" autoplay="true"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoUrl: '',
			}
		},
		methods: {
			
		},
		onLoad(options) {
			console.log(options);
			this.videoUrl=options.url
		}
	}
</script>

<style>
	video {
		width: 100vw;
		height: 100vh;
	}
</style>
