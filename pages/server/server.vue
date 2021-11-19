<template>
	<view class="container">
		<view class="content">
			<view class="yy">
				<view class="fwitem">
					<view class="itemle">
						<view class="img">
							<image :src='imgUrl+"fw1.png"' />
						</view>
						<view class="lecon">
							<text class="font30 color3 fontwe">电池服务网点</text>
							<text class="font26 color9">电池维修操作入口</text>
						</view>
					</view>
					<view class="itemri" @click="gofjwd">进入</view>
				</view>
				<!-- 	<view class="fwitem">
					<view class="itemle">
						<view class="img">
							<image :src='imgUrl+"fw2.png"' />
						</view>
						<view class="lecon">
							<text class="font30 color3 fontwe">加盟表单填写</text>
							<text class="font26 color9">填写信息申请加盟</text>
						</view>
					</view>
					<view class="itemri" @click="btnfun">进入</view>
				</view> -->
				<view class="fwitem">
					<view class="itemle">
						<view class="img">
							<image :src='imgUrl+"fw3.png"' />
						</view>
						<view class="lecon">
							<text class="font30 color3 fontwe">购买套餐</text>
							<text class="font26 color9">购买套餐享优惠</text>
						</view>
					</view>
					<view class="itemri" @click="goBalance">进入</view>
				</view>
			</view>
			<view class="sp">
				<view class="sptop">视频教程</view>
				<view class="splist" v-if="lists.length!=0">
					<block v-for="(item,index) in lists" :key="index">
						<view class="spli">
							<view class="spdh" :data-url="item.videoUrl" @click="toPlayVideo">
								<image :src="item.banner"></image>
								<view class="bf">
									<image src="../../static/play.png"></image>
								</view>
							</view>
							<view class="splitit">{{item.title?item.title:'暂无标题'}}</view>
							<view class="splidesc">{{item.description?item.description:'暂无简介'}}</view>
						</view>
					</block>
				</view>
				<view class="splist splist1" v-else>暂无数据</view>
			</view>
		</view>
		<view class="navigation_bar">
			<view class="navbar">
				<view class="navbar__item" data-index="0" @click="tabClick">
					<view class="navbar__imgs">
						<image class="navbar__img" :src='imgUrl+"sy.png"'></image>
					</view>
					<view class="navbar__title">首页</view>
				</view>
				<view class="navbar__item bar_item_on" data-index="1" @click="tabClick">
					<view class="navbar__imgs">
						<image class="navbar__img" :src='imgUrl+"fwho.png"'></image>
					</view>
					<view class="navbar__title">服务</view>
				</view>
				<view class="navbar__item" data-index="2" @click="tabClick">
					<view class="navbar__imgs">
						<image class="navbar__img" :src='imgUrl+"my.png"'></image>
					</view>
					<view class="navbar__title">我的</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				cityname: '',
				showState: true,
				dcState: true,
				successState: true,
				failState: true,
				scale: 16,
				latitude: 0,
				longitude: 0,
				markers: [],
				dwSta: true,
				dtDetaile: {},
				dcNum: '',
				lists: [],
			}
		},
		methods: {
			toPlayVideo(e) {
				uni.navigateTo({
					url: '../videoplay/videoplay?url=' + e.currentTarget.dataset.url
				})
			},
			// 底部切换
			tabClick: function(e) {
				if (e.currentTarget.dataset.index == 0) {
					uni.reLaunch({
						url: '../index/index'
					})
				} else if (e.currentTarget.dataset.index == 1) {
					uni.reLaunch({
						url: '../server/server'
					})
				} else if (e.currentTarget.dataset.index == 2) {
					uni.reLaunch({
						url: '../my/my'
					})
				}
			},
			gofjwd: function() {
				uni.navigateTo({
					url: '../fjwd/fjwd'
				})
			},
			goBalance: function() {
				uni.navigateTo({
					url: '../balance/balance'
				})
			},
			btnfun: function() {
				uni.showToast({
					title: "暂未开放",
					icon: 'none',
					duration: 2000
				})
			},
			getvideoList: function() {
				var that = this;
				this.$http.sendRequest('/apptutorial/list', 'GET').then(res => {
					// console.log(res);
					if (res.data.code == 200) {
						// that.lists = res.data.data
						uni.setStorageSync('lists',that.lists);
						// console.log('111111',uni.getStorageSync('lists'))
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})

				})
			}
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getvideoList();
			}
			
			console.log('111111',uni.getStorageSync('lists'))
			var that = this 
			that.lists = uni.getStorageSync('lists')
		},
	}
</script>

<style>
	.container {
		padding-bottom: 98rpx;
	}

	.content {
		width: 100%;
		height: auto;
		overflow-y: scroll;
	}

	.videosp {
		position: fixed;
		width: 0rpx;
		height: 0rpx;
		left: 0;
		display: none;
	}

	.videospho {
		display: flex;
	}

	.yy {
		padding: 0 24rpx;
	}

	.fwitem {
		margin-top: 20rpx;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		width: 702rpx;
		height: 240rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 12rpx rgba(0, 0, 0, 0.06);
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.itemle {
		display: flex;
	}

	.img {
		margin-right: 20rpx;
		width: 200rpx;
		height: 200rpx;
	}

	.img image {
		width: 200rpx;
		height: 200rpx;
	}

	.lecon {
		display: flex;
		flex-direction: column;
	}

	.lecon text:nth-child(1) {
		margin-top: 52rpx;
		margin-bottom: 20rpx;
	}

	.itemri {
		margin-top: 70rpx;
		width: 128rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #A35EF4;
		text-align: center;
		border: 2rpx solid #A35EF4;
		border-radius: 60rpx;
	}

	.fwitem:nth-child(2) .itemri {
		color: #F9713D;
		border: 2rpx solid #F9713D;
	}

	.fwitem:nth-child(3) .itemri {
		color: #FF5C83;
		border: 2rpx solid #FF5C83;
	}

	.sp {
		margin: 20rpx 0;
		padding: 30rpx 24rpx;
		background: #fff;
	}

	.sptop {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 34rpx;
		color: #333;
		font-weight: bold;
	}

	.splist {
		display: flex;
		flex-wrap: wrap;
	}

	.spli {
		margin-top: 20rpx;
		width: 341rpx;
	}

	.spli:nth-child(2n) {
		margin-left: 20rpx;
	}

	.spdh {
		position: relative;
		width: 341rpx;
		height: 196rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.spdh image {
		width: 100%;
		height: 100%;
	}

	.bf {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 341rpx;
		height: 196rpx;
		background: rgba(0, 0, 0, 0.2);
	}

	.bf image {
		width: 81rpx;
		height: 81rpx;
	}

	.splitit {
		margin-top: 20rpx;
		margin-bottom: 4rpx;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.splidesc {
		width: 100%;
		height: 36rpx;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #999999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.splist1{
		justify-content: center;
		font-size: 30rpx;
		color: #666;
	}
</style>
