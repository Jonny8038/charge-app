<template>
	<view class="container">
		<view class="content">
			<view class="xx">
				<view class="xxtop">车型信息</view>
				<view class="xxcon">
					<view class="xxitem">
						<text>车牌号</text>
						<text>{{info.cno?info.cno:'无'}}</text>
					</view>
					<view class="xxitem">
						<text>车型</text>
						<text>{{info.type?info.type:'无'}}</text>
					</view>
				</view>
			</view>
			<view class="xx">
				<view class="xxtop">驾驶证信息</view>
				<view class="xxcon xxcon1">
					<image :src="info.jsimg?info.jsimg:imgUrl+'zc1.png'"></image>
					<image :src="info.jsfimg?info.jsfimg:imgUrl+'zc2.png'"></image>
				</view>
			</view>
			<view class="xx">
				<view class="xxtop">行驶证信息</view>
				<view class="xxcon xxcon1">
					<image :src="info.xszimg?info.xszimg:imgUrl+'zc3.png'"></image>
					<image :src="info.xszfimg?info.xszfimg:imgUrl+'zc4.png'"></image>
				</view>
			</view>
			<view class="xx">
				<view class="xxtop">车辆照片</view>
				<view class="xxcon xxcon1">
					<image :src="info.climg?info.climg:imgUrl+'xszfm.png'"></image>
				</view>
			</view>
			<view class="btn" :data-id="info.id" @click="goUpdatecar"><view class="btncon">更换车辆</view></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:getApp().globalData.imgUrl,
				info:'',
			}
		},

		methods: {
			goUpdatecar:function(e){
				uni.setStorageSync('carInfo', this.info);
				uni.navigateTo({
					url: '../updateCar/updateCar'
				})
			},
			getcarInfo: function() {
				var that=this;
				this.$http.sendRequest('/center/carinfo', 'POST').then(res => {
					console.log(res);
					if (res.data.code == 200) {
						that.info=res.data.data
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
				this.getcarInfo();
			}
		}
	}
</script>

<style>
	.container{
		padding-bottom: 98rpx;
	}
	.content{
		width: 100%;
		height: auto;
		overflow-y: scroll;
	}
	.xxtop{
		padding: 0 24rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 22rpx;
		color: #666666;
	}
	.xxcon{
		padding: 0 24rpx;
		background: #fff;
	}
	.xxitem{
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		line-height: 80rpx;
	}
	.xxitem text:first-child{
		font-size: 26rpx;
		color: #333333;
	}
	.xxitem text:last-child{
		font-size: 30rpx;		
		color: #333333;
		font-weight: bold;
		text-align: right;
	}
	.xxcon1{
		padding: 40rpx 70rpx;
		display: flex;
		justify-content: space-between;
	}
	.xxcon1 image{
		width: 280rpx;
		height: 160rpx;
		border: 1px solid #DCDCDC;
		border-radius: 10rpx;
	}
	.btn{
		position: fixed;
		bottom: 0;
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
		background: #fff;
	}
	.btncon{
		width: 100%;
		height: 98rpx;
		line-height: 98rpx;
		font-size: 30rpx;
		color: #fff;
		font-weight: bold;
		background: #212D43;
		text-align: center;
	}
</style>
