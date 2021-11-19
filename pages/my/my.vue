<template>
	<view class="container">
		<view class="content">
			<view class="grxx">
				<view class="xxle">
					<view class="xximg">
						<image :src="info.avatar?info.avatar:imgUrl+'tx.png'"></image>
					</view>
					<view class="xxcon">
						<text class="xxname">{{info.userName?info.userName:'暂无昵称'}}</text>
						<text class="xxtel">{{info.loginName?info.loginName:'暂无手机号'}}</text>
					</view>
				</view>
				<view class="xxri" @click="goUserInfo">
					编辑资料
					<text class="iconfont icon-a-lujing357"></text>
				</view>
			</view>
			<view class="gn">
				<view class="zhxx">
					<view class="zhcon">
						<view class="zhitem" @click="goCar">
							<text>{{info.carSum?info.carSum:0}}</text>
							<text>车辆</text>
						</view>
						<view class="zhitem" :data-balance="info.balance" @click="goBalance">							
							<text><text>￥</text>{{info.balance?info.balance/100:0}}</text>
							<text>余额</text>
						</view>
						<view class="zhitem" @click="gojyRecord">
							<text>{{info.orderSum?info.orderSum:0}}</text>
							<text>交易记录</text>
						</view>
					</view>
				</view>
				<view class="gntop">常用功能
					<view class="topcon"></view>
				</view>
				<view class="gncon">
					<view class="gnitem" @click="goyyRecord">
						<view class="itemle">
							<view class="img">
								<image :src='imgUrl+"my6.png"' />
							</view>
							<text>预约记录</text>
						</view>
						<view class="itemri iconfont icon-a-lujing448"></view>
					</view>
					<view class="gnitem" @click="gohdRecord">
						<view class="itemle">
							<view class="img">
								<image :src='imgUrl+"my1.png"' />
							</view>
							<text>换电记录</text>
						</view>
						<view class="itemri iconfont icon-a-lujing448"></view>
					</view>
					<view class="gnitem" @click="goCell">
						<view class="itemle">
							<view class="img">
								<image :src='imgUrl+"my2.png"' />
							</view>
							<text>我的电池</text>
						</view>
						<view class="itemri iconfont icon-a-lujing448"></view>
					</view>
					<view class="gnitem">
						<view class="itemle">
							<view class="img">
								<image :src='imgUrl+"my7.png"' />
							</view>
							<button open-type='contact' session-from=''>联系客服</button>
						</view>
						<view class="itemri iconfont icon-a-lujing448"></view>
					</view>
					<view class="gnitem" @click="goSystem">
						<view class="itemle">
							<view class="img">
								<image :src='imgUrl+"my8.png"' />
							</view>
							<text>系统设置</text>
						</view>
						<view class="itemri iconfont icon-a-lujing448"></view>
					</view>
					<!-- 	<view class="gnitem" @click="goAbout">
						<view class="itemle">
							<view class="img">
								<image src="../../static/images/my3.png" />
							</view>
							<text>关于我们</text>
						</view>
						<view class="itemri iconfont icon-a-lujing448"></view>
					</view>
					<view class="gnitem" @click="updatePas">
						<view class="itemle">
							<view class="img">
								<image src="../../static/images/my4.png" />
							</view>
							<text>修改密码</text>
						</view>
						<view class="itemri iconfont icon-a-lujing448"></view>
					</view> -->
				</view>
			</view>
			<!-- <view class="closebtn" @click="closedl">退出登录</view> -->
		</view>
		<view class="navigation_bar">
			<view class="navbar">
				<view class="navbar__item" data-index="0" @click="tabClick">
					<view class="navbar__imgs">
						<image class="navbar__img" :src='imgUrl+"sy.png"'></image>
					</view>
					<view class="navbar__title">首页</view>
				</view>
				<view class="navbar__item" data-index="1" @click="tabClick">
					<view class="navbar__imgs">
						<image class="navbar__img" :src='imgUrl+"fw.png"'></image>
					</view>
					<view class="navbar__title">服务</view>
				</view>
				<view class="navbar__item bar_item_on" data-index="2" @click="tabClick">
					<view class="navbar__imgs">
						<image class="navbar__img" :src='imgUrl+"myho.png"'></image>
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
				info: ''
			}
		},

		methods: {
			// 底部切换
			tabClick(e) {
				if (e.currentTarget.dataset.index == 0) {
					uni.redirectTo({
						url: '../index/index'
					})
				} else if (e.currentTarget.dataset.index == 1) {
					uni.redirectTo({
						url: '../server/server'
					})
				} else if (e.currentTarget.dataset.index == 2) {
					uni.redirectTo({
						url: '../my/my'
					})
				}
			},
			// 跳转到个人信息
			goCar() {
				uni.navigateTo({
					url: '../carInfo/carInfo',
				})
			},
			goBalance(e) {
				uni.navigateTo({
					url: '../balance/balance?money='+e.currentTarget.dataset.balance,
				})
			},
			gojyRecord() {
				uni.navigateTo({
					url: '../jyRecord/jyRecord',
				})
			},
			goUserInfo() {
				uni.navigateTo({
					url: '../userInfo/userInfo',
				})
			},

			// 预约记录
			goyyRecord() {
				uni.navigateTo({
					url: '../yyRecord/yyRecord',
				})
			},
			// 换电记录
			gohdRecord() {
				uni.navigateTo({
					url: '../hdRecord/hdRecord',
				})
			},
			// 我的电池
			goCell() {
				uni.navigateTo({
					url: '../cell/cell',
				})
			},
			// 关于我们
			goAbout() {
				uni.navigateTo({
					url: '../about/about',
				})
			},
			goSystem() {
				uni.navigateTo({
					url: '../system/system',
				})
			},
			
			getUserInfo: function() {
				this.$http.sendRequest('/wx/goUser', 'POST').then(res => {
					if (res.data.code == 200) {
						this.info = res.data.data
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})
				})
			},
		},
		onShow() {
			this.getUserInfo();
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getUserInfo();
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 98rpx;
		background: #fff;
	}

	.content {
		overflow-y: scroll;
	}

	.grxx {
		padding-top: 20rpx;
		padding-bottom: 40rpx;
		display: flex;
		justify-content: space-between;
		background: #212D43;
	}

	.xxle {
		padding-left: 24rpx;
		display: flex;
	}

	.xximg {
		margin-right: 20rpx;
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}

	.xximg image {
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}

	.xxcon {
		display: flex;
		flex-direction: column;
	}

	.xxname {
		margin-top: 12rpx;
		margin-bottom: 10rpx;
		font-size: 34rpx;
		color: #fff;
	}

	.xxtel {
		font-size: 26rpx;
		color: #637AA5;
	}

	.xxri {
		margin-top: 6rpx;
		width: 160rpx;
		height: 44rpx;
		line-height: 44rpx;
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		background: #2E4265;
		border-radius: 60rpx 0px 0px 60rpx;
	}

	.xxri .iconfont {
		font-size: 18rpx;
	}

	.zhxx {
		background: #212D43;
	}

	.zhcon {
		display: flex;
		justify-content: space-around;
		padding: 58rpx 24rpx;
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0px 0px;
		box-sizing: border-box;
	}

	.zhitem {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.zhitem text:first-child {
		margin-bottom: 28rpx;
		height: 52rpx;
		font-size: 40rpx;
		font-weight: bold;
		line-height: 52rpx;
		color: #333333;

	}

	.zhitem text:last-child {
		height: 36rpx;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #000000;
	}

	.gntop {
		padding: 0 24rpx;
		height: 126rpx;
		line-height: 126rpx;
		font-size: 34rpx;
		color: #000;
		font-weight: bold;
		border-top: 2rpx solid #F2F5F8;
	}

	.gnitem {
		padding: 0 24rpx;
		display: flex;
		justify-content: space-between;
		height: 126rpx;
		line-height: 126rpx;
	}

	.itemle {
		display: flex;
		font-size: 30rpx;
		color: #000;
	}

	.itemle image {
		margin-right: 20rpx;
		width: 40rpx;
		height: 46rpx;
	}

	.itemle button {
		padding: 0;
		background: none;
		height: 126rpx;
		line-height: 126rpx;
		font-size: 30rpx;
		color: #000000;
	}
	.itemle button::after{
		border:0;
	}
	.img {
		display: flex;
		align-items: center;
	}

	.gnitem image {
		width: 40rpx;
		height: 40rpx;
	}

	.gnitem:nth-child(3) image {
		width: 40rpx;
		height: 35rpx;
	}

	.gnitem:nth-child(5) image {
		width: 40rpx;
		height: 37rpx;
	}

	.itemri {
		font-size: 26rpx;
		color: #999999;
	}

	.closebtn {
		margin: 40rpx auto;
		width: 702rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		color: #212D43;
		text-align: center;
		background: #E4EDF5;
		border-radius: 10rpx;
	}
</style>
