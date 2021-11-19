<template>
	<view class="container">
		<view class="content">
			<!-- //无故障 -->
			<view v-if="faultInfo.faultNum==0">
				<view class="gzImg">
					<image :src='imgUrl+"gz1.png"'></image>
					<text>车辆无故障，请继续保持</text>
				</view>
				<view class="gznum">当前故障码：{{faultInfo.faultNum}}个</view>
			</view>
			<!-- 有故障 -->
			<view v-else>
				<view class="gzImg">
					<image :src='imgUrl+"gz2.png"'></image>
					<text>车辆有故障，请消除故障</text>
				</view>
				<view class="gznum gznum1">
					<view>当前故障码：{{faultInfo.faultNum}}个</view>
					<view @click="gofjwd">消除故障<text class="iconfont icon-a-lujing448"></text></view>
				</view>
			</view>
			<view class="carInfo">
				<view class="cartop">
					<text>车辆详情</text>
					<text>数据时间：{{faultInfo.receiveTime}}</text>
				</view>
				<view class="carlist">
					<view class="carli">
						<view class="carname" :class="faultInfo.chargeableFaultNum==0?'':'cardataho'">
							<text>充电储能装置</text>
							<text v-if="faultInfo.chargeableFaultNum==0">正常</text>
							<text v-else>异常</text>
						</view>
						<view class="cardata" :class="faultInfo.chargeableFaultNum==0?'':'cardataho'">
							<text class="name">故障数</text>
							<text class="data">{{faultInfo.chargeableFaultNum}}</text>
						</view>
					</view>
					<view class="carli">
						<view class="carname" :class="faultInfo.driverFaultNum==0?'':'cardataho'">
							<text>驱动电机</text>
							<text v-if="faultInfo.driverFaultNum==0">正常</text>
							<text v-else>异常</text>
						</view>
						<view class="cardata" :class="faultInfo.driverFaultNum==0?'':'cardataho'">
							<text class="name">故障数</text>
							<text class="data">{{faultInfo.driverFaultNum}}</text>
						</view>
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
				imgUrl:getApp().globalData.imgUrl,
				faultInfo:'',
			}
		},

		methods: {			
			gofjwd: function() {
				uni.navigateTo({
					url: '../fjwd/fjwd'
				})
			},
			getfaultInfo: function(id) {
				var that=this;
				this.$http.sendRequest('/appcar/alarminfo', 'GET',{
					carId:id
				}).then(res => {
					console.log(res);
					if (res.data.code == 200) {
						that.faultInfo=res.data.data
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})
					
				})
			},
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getfaultInfo(uni.getStorageSync('carId'));
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
		height: auto;
		overflow-y: scroll;
	}

	.gzImg {
		display: flex;
		flex-direction: column;
		text-align: center;
		margin-top: 62rpx;
	}

	.gzImg image {
		margin: 0 auto;
		margin-bottom: 20rpx;
		width: 160rpx;
		height: 160rpx;
	}

	.gzImg text {
		height: 32rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: #333333;
	}

	.gznum {
		margin: 20rpx auto;
		padding: 0 20rpx;
		width: 702rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #333;
		background: #F4F4F3;
		border-radius: 10rpx;
		box-sizing: border-box;
	}
	.gznum1{
		display: flex;
		justify-content: space-between;
	}
	.gznum1 view:last-child{
		font-size: 26rpx;
		color: #999;
	}
	.gznum1 view:last-child text{
		margin-left: 6rpx;
		font-size: 16rpx;
		color: #999;
	}
	.cartop {
		width: 100%;
		padding: 0 24rpx;
		display: flex;
		justify-content: space-between;
		height: 60rpx;
		line-height: 60rpx;
		background: #F4F4F3;
		box-sizing: border-box;
	}

	.cartop text {
		width: 50%;
		font-size: 22rpx;
		color: #999;
	}
	.cartop text:last-child{
		text-align: right;
	}
	.carli {
		padding: 20rpx 24rpx;
		border-bottom: 2rpx solid #F4F4F3;
	}
	.carname,
	.cardata {
		display: flex;
		justify-content: space-between;
	}

	.carname text:last-child,
	.cardata text:last-child {
		text-align: right;
	}

	.carname text {
		width: 50%;
		height: 42rpx;
		line-height: 42rpx;
		font-size: 26rpx;
		color: #333333;
	}

	.cardata text {
		width: 50%;
		height: 42rpx;
		line-height: 42rpx;
		font-size: 22rpx;
		color: #999;
	}
	.cardataho text:last-child{
		color: #FD6361;
	}
</style>
