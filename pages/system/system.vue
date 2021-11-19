<template>
	<view class="container">
		<view class="content">
			<view class="list">
				<view class="li">
					<view class="lile">实名认证</view>
					<view class="liri" v-if="carSta">已认证<view class="iconfont icon-a-lujing448"></view>
					</view>
					<view class="liri" v-else @click="goApprove">未认证<view class="iconfont icon-a-lujing448"></view>
					</view>
				</view>
				<view class="li" @click="updatePas">
					<view class="lile">修改密码</view>
					<view class="liri">
						<view class="iconfont icon-a-lujing448"></view>
					</view>
				</view>
				<view class="li" @click="closedl">
					<view class="lile">退出登录</view>
					<view class="liri">
						<view class="iconfont icon-a-lujing448"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				carSta:false
			}
		},

		methods: {
			// 修改密码
			updatePas() {
				uni.navigateTo({
					url: '../updatePassword/updatePassword',
				})
			},
			goApprove(){
				uni.navigateTo({
					url: '../approveCar/approveCar',
				})
			},
			closedl() {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '确定退出？',
					success(res) {
						if (res.confirm) {
							that.$http.sendRequest('/wx/applogout', 'DELETE').then(ress => {
								if (ress.data.code == 200) {
									uni.clearStorageSync("token");
									uni.clearStorageSync("carId");
									uni.clearStorageSync("tel"); 
									uni.redirectTo({
										url: '../index/index'
									})
								}
							}).catch(err => {
								uni.showToast({
									icon: 'none',
									title: err.data.msg,
								})
							})
						}
					}
				})
			},
		},
		onLoad() {
			if(uni.getStorageSync('carId')){
				this.carSta=true;
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
	}

	.list {
		margin-top: 20rpx;
	}

	.li {
		padding: 0 24rpx;
		display: flex;
		justify-content: space-between;
		height: 120rpx;
		line-height: 120rpx;
		background: #fff;
		border-bottom: 2rxp solid #F4F4F3;
	}

	.li:last-child {
		border-bottom: 0;
	}

	.lile {
		font-size: 30rpx;
		color: #000000
	}

	.liri {
		display: flex;
		font-size: 26rpx;
		color: #999
	}

	.icon-a-lujing448 {
		margin-left: 6rpx;
		font-size: 16rpx;
		color: #999
	}
</style>
