<template>
	<view class="container">
		<view class="content">
			<view class="tit">{{detailes.title}}</view>
			<view class="zxlibot" :class="!detailes.siteName?'zxlibotho':''">
				<view class="zxname" v-if="detailes.siteName">{{detailes.siteName}}</view>
				<view class="zxtime">{{detailes.createTime?detailes.createTime:"''"}}</view>
			</view>
			<view class="xqcontent">
				<rich-text :nodes="detailes.content"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailes: '',
			}
		},

		methods: {
			getdetails: function(id) {
				this.$http.sendRequest('/news/detail', 'POST', {
					id: id
				}).then(res => {
					if (res.data.code == 200) {
						this.detailes = res.data.data;
						this.detailes.content = this.detailes.content.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
						.replace(/<p>/ig, '<p style="font-size: 15px; line-height: 25px;">')
						.replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
						.replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
						.replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
						.replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
						.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;" $1');
						
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: "网络错误",
					})
				})
			},
		},
		onLoad(options) {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getdetails(options.id);
			}
		}
	}
</script>

<style>
	.container {
		background: #fff;
	}

	.content {
		width: 100%;
		padding: 0 24rpx;
		overflow-y: scroll;
		box-sizing: border-box;
	}

	.tit {
		margin-top: 20rpx;
		margin-bottom: 30rpx;
		line-height: 48rpx;
		font-size: 34rpx;
		font-weight: bold;
		color: #000000;
	}

	.zxlibot {
		margin-bottom: 40rpx;
		display: flex;
		justify-content: space-between;
	}
	.zxlibotho{
		justify-content: flex-end;
	}
	.zxname {
		width: 55%;
		height: 32rpx;
		font-size: 22rpx;
		color: #999;
		overflow: hidden;
	}

	.zxtime {
		width: 40%;
		height: 32rpx;
		font-size: 22rpx;
		color: #999;
		overflow: hidden;
		text-align: right;
	}

	.img {
		margin-bottom: 40rpx;
		width: 702rpx;
		height: 294rpx;
	}

	.img image {
		width: 100%;
		height: 100%;
	}

	.xqcon {
		font-size: 30rpx;
		font-weight: 400;
		line-height: 56rpx;
		color: #333333;
	}
</style>
