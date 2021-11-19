<template>
	<view class="container">
		<view class="login">
			<!-- <image class="dlbg" :src='imgUrl+"dlbg.png"' /> -->
			<view class="dlcon">
				<view class="dltop">
					<view class="dlimg">
						<image :src='imgUrl+"72.png"'></image>
					</view>
					<view class="dltit">广远咔咔换电</view>
					<view class="dldesc">新能源汽车智能换电平台</view>
				</view>
				<view class="dlform">
					<view class="dlitem dlitem1">
						<image class="ico" :src='imgUrl+"tel.png"'></image>
						<input type="text" @blur="phone" :value="account" maxlength="11" placeholder="请输入手机号"
							placeholder-class="phcolor" />
					</view>
					<view class="dlitem dlitem2">
						<image class="ico" :src='imgUrl+"mm.png"'></image>
						<input v-if="eyesta" type="password" @input="getPassword" :value="password" placeholder="输入密码"
							placeholder-class="phcolor" />
						<input v-else type="text" @input="getPassword" :value="password" placeholder="输入密码"
							placeholder-class="phcolor" />
						<image v-if="eyesta" class="eyeico" :src='imgUrl+"eyeg.png"' @click="eyefun"></image>
						<image v-else class="eyekico" :src='imgUrl+"eyek.png"' @click="eyefun"></image>
					</view>
					<view class="dbtn" @click="goIndex">登录</view>
					<view class="dltip">
						<text @click="goregister">立即注册</text>
					</view>
				</view>
				<view class="dsf">
					<view class="dsftit">第三方账号登录</view>
					<button class="dsfcon" @click="handleThirdLoginApp">
						<image :src='imgUrl+"wx1.png"' />
						<text>微信登录</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/WSCoordinate.js'
	export default {
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				eyesta: true,
				account: '',
				password: '',
			}
		},

		methods: {
			eyefun: function() {
				this.eyesta = !this.eyesta
			},
			// getPhoneNumber: function(e) {
			// 	var that = this;
			// 	console.log('e', e);
			// 	if (e.detail.errMsg == "getPhoneNumber:ok") {
			// 		uni.login({
			// 			provider: 'weixin',
			// 			success({
			// 				errMsg,
			// 				code
			// 			}) {
			// 				if (errMsg == "login:ok") {
			// 					that.$http.sendRequest('/wx/weChatLogin', 'POST', {
			// 						code: code,
			// 						encryptedData: e.detail.encryptedData,
			// 						iv: e.detail.iv,
			// 					}).then(res => {
			// 						console.log('’123123', res.data);
			// 						if (res.data.code == 200) {
			// 							uni.setStorageSync('tel', res.data.phoneNumber);
			// 							uni.setStorageSync('token', res.data.token.access_token);
			// 							if (res.data.carinfo != null) {
			// 								uni.setStorageSync('carId', res.data.carinfo.id);
			// 							}
			// 							uni.showToast({
			// 								title: "登录成功",
			// 								icon: 'success',
			// 								duration: 2000,
			// 								success() {
			// 									setTimeout(() => {
			// 										uni.redirectTo({
			// 											url: '../index/index', //跳转至首页
			// 										})
			// 									}, 2000)
			// 								}
			// 							})
			// 						} else {
			// 							uni.showToast({
			// 								icon: 'none',
			// 								title: res.data.msg,
			// 							})
			// 						}
			// 					}).catch(err => {
			// 						uni.showToast({
			// 							icon: 'none',
			// 							title: "网络错误",
			// 						})
			// 					})
			// 				}
			// 			}
			// 		});
			// 	}
			// },
			handleThirdLoginApp() {
				var that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res.provider);
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									console.log("App微信获取用户信息成功", loginRes);
									that.getApploginData(loginRes) //请求登录接口方法
								},
								fail: function(res) {
									console.log("App微信获取用户信息失败", res);
								}
							})
						}
					}
				});

			},
			getApploginData(data){
				var that=this;
				console.log('222',data)
				that.$http.sendRequest('/wx/weChatLogin', 'POST', {
					access_token: data.authResult.access_token,
					openid: data.authResult.openid,
				}).then(res => {
					console.log('’123123', res.data);
					if (res.data.code == 200) {
						// uni.setStorageSync('tel', res.data.phoneNumber);
						uni.setStorageSync('token', res.data.token.access_token);
						// if (res.data.carinfo != null) {
						// 	uni.setStorageSync('carId', res.data.carinfo.id);
						// }
						uni.showToast({
							title: "登录成功",
							icon: 'success',
							duration: 2000,
							success() {
								setTimeout(() => {
									uni.redirectTo({
										url: '../index/index', //跳转至首页
									})
								}, 2000)
							}
						})
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
			phone: function(e) {
				let phone = e.detail.value;
				let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!reg.test(phone)) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: "none",
						duration: 2000
					})
					return false;
				}
				this.account = e.detail.value
			},
			getPassword: function(e) {
				var value = e.detail.value;
				this.password = value
			},
			goregister: function() {
				wx.navigateTo({
					url: '../../pages/register/register'
				});
			},
			goIndex() {
				var that = this;
				if (that.account.length == 0 || that.password.length == 0) { //校验非空
					uni.showToast({ //弹框提示
						icon: 'none',
						title: '用户名或密码不能为空！',
						duration: 2000,
					})
				} else {
					this.$http.sendRequest('/wx/applogin', 'POST', {
						username: this.account,
						password: this.password
					}).then(res => {
						console.log('ssss', res.data.code);
						if (res.data.code == 200) {
							uni.setStorageSync('token', res.data.token.access_token);
							if (res.data.carinfo != null) {
								uni.setStorageSync('carId', res.data.carinfo.id);
							}
							uni.showToast({
								title: "登录成功",
								icon: 'success',
								duration: 2000,
								success() {
									setTimeout(() => {
										uni.redirectTo({
											url: '../index/index', //跳转至首页
										})
									}, 2000)
								}
							})
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

				}

			}
		},
		onLoad() {

		}
	}
</script>

<style>
	.login {
		width: 100%;
		height: 100%;
		position: relative;
		background: #fff;
	}

	.dlbg {
		width: 100%;
		height: 100%;
	}

	.dlcon {
		position: absolute;
		top: 170rpx;
		z-index: 1;
		width: 100%;
	}

	.dltop {
		margin-bottom: 150rpx;
	}

	.dlimg {
		margin: 0 auto;
		margin-bottom: 20rpx;
		width: 131rpx;
		height: 131rpx;
	}

	.dlimg image {
		width: 100%;
		height: 100%;
	}

	.dltit {
		margin-bottom: 10rpx;
		font-size: 46rpx;
		color: #212D43;
		text-align: center;
		letter-spacing: 4rpx;
	}

	.dldesc {
		font-size: 26rpx;
		color: #9A9CA5;
		text-align: center;
	}

	/* .dlform {
		margin: 0 auto;
		
	} */

	.dlitem {
		display: flex;
		align-items: center;
		margin: 20rpx auto;
		width: 626rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-bottom: 1rpx solid #DEE0EA;
	}

	.dlitem1 .ico {
		width: 30rpx;
		height: 40rpx;
	}

	.dlitem2 .ico {
		width: 30rpx;
		height: 36rpx;
	}

	.dlitem2 .eyeico {
		width: 34rpx;
		height: 14rpx;
	}

	.dlitem2 .eyekico {
		width: 34rpx;
		height: 24rpx;
	}

	.dlitem input {
		margin-left: 10rpx;
		flex: 1;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		color: #212D43;
	}

	.phcolor {
		font-size: 30rpx;
		color: #7B7E8C;
	}

	.dltip {
		display: flex;
		justify-content: flex-end;
		width: 622rpx;
		margin: 0 auto;
		height: 60rpx;
		line-height: 60rpx;
	}

	.dltip text {
		font-size: 26rpx;
		color: #7B7E8C;
	}

	.dbtn {
		margin: 0 auto;
		margin-top: 66rpx;
		margin-bottom: 10rpx;
		width: 700rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		color: #fff;
		font-weight: bold;
		text-align: center;
		background: #212D43;
		border-radius: 40rpx;
	}

	.dsf {
		margin-top: 30rpx;
	}

	.dsftit {
		font-size: 30rpx;
		color: #A6A6A6;
		text-align: center;
	}

	.dsfcon {
		padding: 0;
		background: none;
		display: flex;
		flex-direction: column;
		font-size: 30rpx;
		color: #A6A6A6;
		text-align: center;
	}

	.dsfcon image {
		margin: 30rpx auto;
		margin-bottom: 0;
		width: 120rpx;
		height: 120rpx;
	}

	.dsfcon::after {
		border: 0
	}
</style>
