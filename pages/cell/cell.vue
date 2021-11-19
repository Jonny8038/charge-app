<template>
	<view class="container">
		<view class="content" :style="{'background':background}">
			<view class="cph">
				<view class="qy" :style="{'color':color}">{{cnoqy}}</view>
				<view class="num">{{cnonum}}</view>
			</view>
			<view class="dc">
				<view class="dcnum">
					<text>{{detailes.power?detailes.power:0}}%</text>
					<text>电池电量</text>
				</view>
			</view>
			<view class="dcxx">
				<view class="xxtop">电池信息</view>
				<view class="xxcon">
					<view class="xxitem">
						<text>电池容量</text>
						<text>{{detailes.space?detailes.space:0}}AH</text>
					</view>
					<view class="xxitem">
						<text>电池状态</text>
						<text>{{detailes.yctype==0?'正常':'异常'}}</text>
					</view>
					<view class="xxitem" v-if="detailes.type">
						<text>电池型号</text>
						<text v-if="detailes.type=='01'">磷酸铁锂电池</text>
						<text v-if="detailes.type=='02'">锰酸锂电池</text>
						<text v-if="detailes.type=='03'">钴酸锂电池</text>
						<text v-if="detailes.type=='04'">三元材料电池</text>
						<text v-if="detailes.type=='05'">聚合物锂离子电池</text>
						<text v-else>无</text>
					</view>
					<view class="xxitem" v-else>
						<text>电池型号</text>
						<text>无</text>
					</view>
					<view class="xxitem">
						<text>电池编号</text>
						<text>{{detailes.bno?detailes.bno:'暂无'}}</text>
					</view>
					<view class="xxitem">
						<text>更换时间</text>
						<text>{{detailes.receiveTime?detailes.receiveTime:"''"}}</text>
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
				background: '#F34848',
				color: '',
				detailes: {},
				cnoqy: '',
				cnonum: '',
			}
		},

		methods: {
			dcDetailes: function(id) {
				this.$http.sendRequest('/appcar/batteryinfo', 'GET',{
					carId:id
				}).then(res => {
					console.log(res);
					console.log(res.data.data.updatetime, res.data.data.updatetime == '');
					if (res.data.code == 200) {
						if (res.data.data.power == null) {
							res.data.data.power = 0
						}
						if (res.data.data.updatetime == '') {
							res.data.data.updatetime = this.getTime();
						}
						if (res.data.data.power < 20) {
							// 电池小于20%显示的颜色
							uni.setNavigationBarColor({
								frontColor: '#ffffff',
								backgroundColor: '#F34848',
								animation: {
									timingFunc: 'easeIn'
								}
							})
							this.background = "#F34848";
							this.color = "#F34848";
						} else {
							// 电池大于20%显示的颜色
							uni.setNavigationBarColor({
								frontColor: '#ffffff',
								backgroundColor: '#29BD5F',
								animation: {
									timingFunc: 'easeIn'
								}
							})
							this.background = "#29BD5F";
							this.color = "#29BD5F";
						}
						this.detailes = res.data.data;
						this.cnoqy = res.data.data.cno.substring(0, 1);
						this.cnonum = res.data.data.cno.substring(1);
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})
					uni.setNavigationBarColor({
						frontColor: '#ffffff',
						backgroundColor: '#29BD5F',
						animation: {
							timingFunc: 'easeIn'
						}
					})
					this.background = "#29BD5F";
					this.color = "#29BD5F";
				})
			},
			getTime: function() {
				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				var timer = year + '-' + month + '-' + day ;
				return timer;
			},
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.dcDetailes(uni.getStorageSync('carId'));
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
	}

	.cph {
		display: flex;
		margin: 0 auto;
		margin-top: 70rpx;
		margin-bottom: 80rpx;
		width: 268rpx;
	}

	.qy {
		margin-right: 20rpx;
		width: 60rpx;
		height: 60rpx;
		text-align: center;
		background: #FFFFFF;
		border: 2rpx solid #DFF6E6;
		border-radius: 10rpx;
	}

	.num {
		width: 180rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 30rpx;
		color: #fff;
		border: 2rpx solid #DFF6E6;
		border-radius: 10rpx;
	}

	.dc {
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 460rpx;
		height: 460rpx;
		background: rgba(255, 255, 255, 0.29);
		border-radius: 50%;
	}

	.dcnum {
		display: flex;
		flex-direction: column;
		width: 376rpx;
		height: 376rpx;
		background: #fff;
		border-radius: 50%;
		text-align: center;
	}

	.dcnum text:nth-child(1) {
		margin-top: 126rpx;
		font-size: 62rpx;
		color: #000;
		font-weight: bold;
	}

	.dcnum text:nth-child(2) {
		font-size: 26rpx;
		color: #999;
	}

	.dcxx {
		padding: 0 24rpx;
		margin-top: 100rpx;
	}

	.xxtop {
		margin-bottom: 40rpx;
		font-size: 34rpx;
		color: #fff;
		font-weight: bold;
		letter-spacing: 8rpx;
	}

	.xxitem {
		display: flex;
		justify-content: space-between;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #DFF6E6;
		/* letter-spacing: 8rpx; */
	}
	.xxitem text:last-child{
		width: 70%;
		overflow: hidden;
		text-align: right;
	}
</style>
