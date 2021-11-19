<template>
	<view class="container">
		<view class="top"  :style="{'margin-top':statusBar+'px','height':customBar+'px','line-height':customBar+'px'}" >
			<view class="iconfont icon-a-lujing448" @click="goBack"></view>
			<view class="topname">我的余额</view>
			<view class="topRi"></view>
			<!-- <view class="topRi" @click="gojyRecord">账单</view> -->
		</view>
		<view class="content">
			<view class="money">
				<view class="qdata">￥<text>{{ye?ye/100:0}}</text></view>
				
				<view class="qtip">充值所得，可用于购买套餐和换电支付费用</view>
				<image :src='imgUrl+"money.png"'></image>
			</view>
			<view class="cz">
				<view class="cztop">
					<text>选择充值金额</text>
					<text>余额只能购买套餐和换电消费，不可退</text>
				</view>
				<view class="czlist">
					<block v-for="(item,index) in lists" :key="index">
						<view class="czli" :class="qhsta==index?'czliho':''" :data-index="index" :data-id="item.id" @click="clickqh">充<text>{{item.price/100-item.discount/100}}</text>元</view>
					</block>
				</view>
			</view>
			<view class="czbot">
				<view class="cztip">温馨提示：钱包余额只能用于购买套餐和换电扣款消费，不可 提现，用户点击支付，即表示您已同意<text @click="goAgrerment">《充值协议》</text></view>
				<view class="czbtn" @click="goMy">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:getApp().globalData.imgUrl,
				statusBar: '',
				customBar: '',
				qhsta:0,
				ye:0,
				id:1,
				lists:[],
			}
		},

		methods: {
			clickqh(e){
				this.qhsta=e.currentTarget.dataset.index;
				this.id=e.currentTarget.dataset.id;
				console.log('e',this.id,this.qhsta);
			},
			goBack(){
				uni.navigateBack()
			},
			gojyRecord() {
				uni.navigateTo({
					url: '../jyRecord/jyRecord',
				})
			},
			goAgrerment(){
				uni.navigateTo({
					url: '../czxy/czxy',
				})
			},
			// 获取充值套餐
			getczList: function() {
				var that=this;
				this.$http.sendRequest('/center/rechargelist', 'POST').then(res => {
					console.log(res.data);
					if (res.data.code == 200) {
						that.lists=res.data.data;
						that.id=res.data.data[0].id
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})
					
				})
			},
			goMy() {
				var that=this;
				this.$http.sendRequest('/apporder/recharge/create', 'POST',{
					payType :'0',
					rechargeId:this.id
				}).then(ress => {
					console.log(',wx',ress);
					if (ress.data.code == 200) {
						that.$http.sendRequest('/apporder/wxpay', 'POST',{
							orderid:ress.data.data
						}).then(res => {
							console.log(res);
							if (res.data.code == 200) {	
								uni.requestPayment({
								    provider: 'wxpay',
								    timeStamp: res.data.data.timeStamp,
								    nonceStr: res.data.data.nonceStr,
								    package: res.data.data.package,
								    signType: res.data.data.signType,
								    paySign: res.data.data.paySign,
								    success: function (obj) {
								        console.log('success:' + JSON.stringify(obj));
										uni.navigateTo({
											url: '../my/my',
										})
								    },
								    fail: function (err) {
								        console.log('fail:' + JSON.stringify(obj));
								    }
								});
							}else{
								uni.showToast({
									icon: 'none',
									title: err.data.msg,
								})
							}
						}).catch(err => {
							uni.showToast({
								icon: 'none',
								title: "网络错误",
							})
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
		onLoad(option) {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				if(option.money){
					this.ye=option.money;
				}
				this.getczList();
			}
		},
		onReady() {
			var that = this
			uni.getSystemInfo({
				success: function(e) {
					that.statusBar = e.statusBarHeight
					// #ifndef MP
					if (e.platform == 'android') {
						that.customBar = e.statusBarHeight + 50
					} else {
						that.customBar = e.statusBarHeight + 45
					}
					// #endif

					// #ifdef MP-WEIXIN

					//获取胶囊按钮的布局位置信息，坐标信息以屏幕左上角为原点
					let custom = wx.getMenuButtonBoundingClientRect()

					//导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度。

					that.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif

					// #ifdef MP-ALIPAY
					that.customBar = e.statusBarHeight + e.titleBarHeight
					// #endif
					that.hei=that.statusBar+that.customBar
					console.log(that.statusBar, that.customBar,that.hei);
				}
			})
		}
	}
</script>

<style>
	.container {
		align-items: initial;
		justify-content: initial;
		background: #fff;
	}

	.top {
		padding: 0 24rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.top .icon-a-lujing448 {
		font-size: 26rpx;
		color: #333;
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		/* IE 9 */
		-moz-transform: rotate(180deg);
		/* Firefox */
		-webkit-transform: rotate(180deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(180deg);
		/* Opera */
	}

	.topname {
		font-size: 34rpx;
		color: #333;
	}

	.topRi {
		font-size: 30rpx;
		color: #000;
	}

	.money {
		position: relative;
		margin: 0 auto;
		padding-top: 80rpx;
		width: 702rpx;
		height: 300rpx;
		text-align: center;
		background: linear-gradient(101deg, #212D43 0%, #283958 100%);
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.qdata {
		margin-bottom: 70rpx;
		font-size: 30rpx;
		color: #fff;
	}

	.qdata text {
		font-size: 60rpx;
		font-weight: bold;
	}

	.qtip {
		font-size: 26rpx;
		color: #95A1B7;
	}

	.money image {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 238rpx;
		height: 130rpx;
		border-bottom-right-radius: 20rpx;
	}

	.cz {
		padding: 0 24rpx;
	}

	.cztop {
		margin: 36rpx 0;
		display: flex;
		justify-content: space-between;
		height: 40rpx;
		line-height: 40rpx;
	}

	.cztop text:first-child {
		font-size: 34rpx;
		color: #333;
		font-weight: bold;
	}

	.cztop text:last-child {
		font-size: 22rpx;
		color: #333;
	}

	.czlist {
		display: flex;
		flex-wrap: wrap;
	}

	.czli {
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		width: 221rpx;
		height: 160rpx;
		line-height: 160rpx;
		font-size: 26rpx;
		color: #333;
		text-align: center;
		background: #F4F4F3;
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.czli:nth-child(3n) {
		margin-right: 0;
	}

	.czliho {
		background: #DFF6E6;
		border: 1rpx solid #29BD5F;
	}

	.czli text {
		font-size: 34rpx;
		font-weight: bold;
	}

	.czbot {
		padding: 0 24rpx;
		position: fixed;
		bottom: 40rpx;
	}

	.cztip {
		margin-bottom: 20rpx;
		line-height: 44rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
	}

	.cztip text {
		color: #29BD5F;
	}

	.czbtn {
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 30rpx;
		color: #fff;
		font-weight: bold;
		background: #212D43;
		border-radius: 10rpx;
	}
</style>
