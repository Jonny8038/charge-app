<template>
	<view class="container">
		<view class="con">
			<!-- <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="2" :fixOrientation="true" :size="500"
				:maxWidth="1000" :ql="0.9" type="url" /> -->
			<view class="xx">
				<view class="xxtit font30 color0 fontwe">
					<text class="titicon"></text>
					上传身份信息
				</view>
				<view class="xxcon">
					<view class="sfz">
						<view class="sfztp">
							<view class="sfzimg">
								<image :src="sfzzmimg?sfzzmimg:imgUrl+'sfzzm.png'"></image>
								<button :disabled="mbsta" class="uploadBtn" data-index="1"
									@click="uploadImg">上传</button>
							</view>
							<view class="sfztit">身份证人像面</view>
						</view>
						<view class="sfztp">
							<view class="sfzimg">
								<image :src="sfzfmimg?sfzfmimg:imgUrl+'sfzfm.png'"></image>
								<button :disabled="mbsta" class="uploadBtn" data-index="2"
									@click="uploadImg">上传</button>
							</view>
							<view class="sfztit">身份证国徽面</view>
						</view>
					</view>
					<view class="form">
						<view class="formItem">
							<view class="formName"><text>*</text>姓名</view>
							<input type="text" :value="username" @input="usernameFun" placeholder="请输入姓名" />
						</view>
						<view class="formItem">
							<view class="formName"><text>*</text>身份证号</view>
							<input type="text" :value="userno" @input="usernoFun" placeholder="请输入身份证号" />
						</view>
						<view class="formItem formItemtip font20 color9">请确认身份信息，如有错请修改</view>
					</view>
				</view>
			</view>
			<view class="xx">
				<view class="xxtit font30 color0 fontwe">
					<text class="titicon"></text>
					填写手机信息
				</view>
				<view class="xxcon">
					<view class="form">
						<view class="formItem">
							<view class="formName"><text>*</text>手机号码</view>
							<input type="text" :value="tel" @blur="phone" placeholder="请输入手机号码" />
							<!-- <button v-show="telSta" class="yzmBtn yzmBtn1" open-type="getPhoneNumber"
								@getphonenumber="getPhoneNumber">获取手机号</button> -->
						</view>
						<view class="formItem">
							<view class="formName"><text>*</text>设置密码</view>
							<input type="text" :value="password" @blur="getPwd" placeholder="请设置6位数以上的登录密码" />
						</view>
						<view class="formItem yzmItem">
							<view class="formName">
								<text>*</text>验证码
							</view>
							<input :value="code" placeholder="请输入验证码" :hidden="!yzminput" :disabled="yzminput"
								@click="getCode1" />
							<input :value="code" placeholder="请输入验证码" maxlength="4" :hidden="yzminput"
								@input="getCode" />
							<button class="yzmBtn" :disabled="disabled" @click="sendcode">{{codebtn}}</button>
						</view>
						<view class="formItem formItemtip font20 color9">请确认身份信息，如有错请修改</view>
					</view>
				</view>
			</view>
			<view class="btn" @click="goLogin">
				<view class="btncon" :class="{'btnho':btnTrue}">注册</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cpimg from "../../components/cpimg/cpimg.vue"
	import util from '../../utils/WSCoordinate.js'

	export default {
		components: {
			cpimg
		},
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				btnTrue: false,
				sfzzmimg: '',
				sfzfmimg: '',
				imgSta: '', //表示那张图片
				username: '',
				userno: '', //身份证号
				tel: '',
				// telSta:true,
				password: '',
				code: '',
				codebtn: '发送验证码',
				yzminput: true,
				disabled: false,
				openid: '',
				mbsta: false,
			}
		},

		methods: {
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
			// 					that.$http.sendRequest('wx/wxuserphone', 'POST', {
			// 						code: code,
			// 						encryptedData: e.detail.encryptedData,
			// 						iv: e.detail.iv,
			// 					}).then(res => {
			// 						console.log('’123123', res.data);
			// 						if (res.data.code == 200) {
			// 							that.tel = res.data.data.phoneNumber;
			// 							// that.openid = res.data.data.openid;
			// 							// that.telSta=false;
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
			usernameFun: function(e) { //车牌号
				this.username = e.detail.value
				if (this.sfzzmimg != '' && this.sfzfmimg != '' && this.username != '' && this.userno != '' && this
					.tel != '' && this.password != '' && this.code != '') {
					this.btnTrue = true
				}
			},
			usernoFun: function(e) { //车牌号
				this.userno = e.detail.value
				if (this.sfzzmimg != '' && this.sfzfmimg != '' && this.username != '' && this.userno != '' && this
					.tel != '' && this.password != '' && this.code != '') {
					this.btnTrue = true
				}
			},
			phone: function(e) {
				let tel = e.detail.value;
				let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!reg.test(tel)) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: "none",
						duration: 2000
					})
					return false;
				}
				this.tel = e.detail.value;
				if (this.sfzzmimg != '' && this.sfzfmimg != '' && this.username != '' && this.userno != '' && this
					.tel != '' && this.password != '' && this.code != '') {
					this.btnTrue = true
				}
			},
			getPwd: function(e) {
				if (e.detail.value.length < 6) {
					uni.showToast({
						title: '请输入6位数以上的密码',
						icon: 'none'
					})
				} else {
					this.password = e.detail.value
					if (this.sfzzmimg != '' && this.sfzfmimg != '' && this.username != '' && this.userno != '' && this
						.tel != '' && this.password != '' && this.code != '') {
						this.btnTrue = true
					}
				}
			},
			getCode: function(e) {
				this.code = e.detail.value
				if (this.sfzzmimg != '' && this.sfzfmimg != '' && this.username != '' && this.userno != '' && this
					.tel != '' && this.password != '' && this.code != '') {
					this.btnTrue = true
				}
			},
			getCode1: function() {
				uni.showToast({
					title: '请先发送验证码',
					icon: 'none'
				})
			},
			//发送验证码
			sendcode() {
				let that = this;
				let tel = that.tel;
				if (tel != '') {
					uni.showToast({
						title: '验证码已发送.请注意接收',
						icon: 'none'
					})
					let time = 60;
					var timers = setInterval(function() {
						time--;
						if (time > 0) {
							that.codebtn = time;
							that.disabled = true;
							that.yzminput = false;
						} else {
							that.codebtn = '发送验证码';
							that.disabled = false;
							that.yzminput = false;
							clearInterval(timers)
						}
					}, 1000)
				} else {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
				}
			},
			// 上传图片
			uploadImg(e) {
				var  that=this;
				that.mbsta = true;
				that.imgSta = e.currentTarget.dataset.index;
				// this.$refs.cpimg._changImg();
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: function (res) {
						console.log('111',res);
						that.upload_file(getApp().globalData.uploadUrl, res.tempFilePaths[0]);
						// _rtArr = [];
						// _cgFile = res.tempFilePaths;
						// _index = 0;
						// that._cpImg()
					},
					fail: function (e) {
						that.mbsta = false;
						uni.showToast({
							icon: 'none',
							title: e,
						})
					}
				});
				
			},
			cpimgOk(file) {
				let that = this
				that.upload_file(getApp().globalData.uploadUrl, file[0])
			},
			cpimgErr(e) {
				this.mbsta = false;
				uni.showToast({
					icon: 'none',
					title: e,
				})
			},
			upload_file: function(url, filePath) {
				var that = this;
				console.log('url', url, filePath);
				uni.showLoading({
					title: '图片加载中。。。'
				});
				uni.uploadFile({
					url: url, //后台处理接口
					filePath: filePath,
					name: 'file',
					header: {
						'content-type': 'multipart/form-data',
					}, // 设置请求的 header                        
					success: function(res) {
						// uni.hideLoading();
						console.log('上传成功res1', res.data);
						console.log('上传成功res', JSON.parse(res.data).data.url);

						var data = JSON.parse(res.data);
						if (data.code == 200) {
							var url = data.data.url
							if (that.imgSta == 1) {
								//身份证正面 
								// var url="http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mcc1HDud0mKYnlKAvzRm82BrH1RwB7Dzyuxh*SWuBKj0.nPSbIL.KVIWhm2Y0SHnd9G61*647W5uvhvqPOSL5ZrE!/b&bo=OASgBQAAAAABF6k!&rf=viewer_4"
								that.yzsFun(getApp().globalData.sfzUrl, url, "front");
							} else if (that.imgSta == 2) {
								//身份证反面 
								// var url="http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mcc1HDud0mKYnlKAvzRm82BpfTAWLFBOCpQ5DbRpqL2lICVORedhH.UKhMDHef9.WsWYLD4VqgdrlUzKwDCvjo2s!/b&bo=OASgBQAAAAABF6k!&rf=viewer_4"
								that.yzsFun(getApp().globalData.sfzUrl, url, "back");
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
							})
						}
					},
					fail: function(res) {
						that.mbsta = false;
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: "网络错误",
						})
					}
				})

			},
			// 身份证验证
			yzsFun: function(url, img, cardSide) {
				var that = this
				// qq身份证
				// var img='http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mceoymCZL6F7zRPYwKV5KnWMG1LZa2vycXPagDTy38*vu.2PK0isnM3WhA*LheeCREzseif0RN3Cl5qLKySOnYZA!/b&bo=QAZVCNALwA8BSWE!&rf=viewer_4'
				uni.request({
					url: url,
					data: {
						access_token: uni.getStorageSync("bdaccess-token"),
						url: img,
						id_card_side: cardSide
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' // 默认值
					},
					success(res) {
						that.mbsta = false;
						uni.hideLoading();
						console.log('111222', res.data);
						if (res.data.image_status == "normal") {
							if (that.imgSta == 1) {
								that.sfzzmimg = img;
								that.username = res.data.words_result.姓名.words;
								that.userno = res.data.words_result.公民身份号码.words
							} else if (that.imgSta == 2) {
								that.sfzfmimg = img
							}
							if (that.sfzzmimg != '' && that.sfzfmimg != '' && that.username != '' && that
								.userno != '' && that.tel != '' && that.password != '' && that.code != '') {
								that.btnTrue = true
							}
						} else {
							uni.showToast({
								title: '请上传正确的图片',
								icon: 'none'
							})
						}
					},
					fail() {
						that.mbsta = false;
						uni.hideLoading();
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						})
					}
				})
			},

			//跳转到登录
			goLogin: function() {
				var that = this;
				if (that.sfzzmimg == '') {
					uni.showToast({
						title: '请上传身份证人像面',
						icon: 'none'
					})
					return false
				}
				if (that.sfzfmimg == '') {
					uni.showToast({
						title: '请上传身份证国徽面',
						icon: 'none'
					})
					return false
				}
				if (that.username == '') {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return false
				}
				if (that.userno == '') {
					uni.showToast({
						title: '请输入身份证号',
						icon: 'none'
					})
					return false
				}
				if (that.tel == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return false
				}
				if (that.password == '') {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return false
				}
				if (that.code == "" || isNaN(that.code) || that.code.length != 4) {
					uni.showToast({
						title: '验证码格式不正确',
						icon: 'none'
					})
				} else {
					var object = uni.getStorageSync('carIfo');
					var userInfo = {
						caimg: this.sfzzmimg,
						cfimg: this.sfzfmimg,
						loginName: this.tel,
						phonenumber:this.tel,
						password: this.password,
						code: this.code,
						username: this.username,
						idcard: this.userno, // 身份证
						openid: this.openid
					}
					object.userInfo = userInfo
					console.log('obj', object);

					this.$http.sendRequest('/reg/toreg', 'POST', object, 'application/json').then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: "注册成功",
								icon: 'success',
								duration: 2000,
								success: function() {
									setTimeout(function() {
										uni.redirectTo({
											url: '../../pages/login/login'
										})
									}, 2000)
									uni.setStorageSync('vin', object.vin);
								}
							})
						}  else {
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
			},
		},
		onLoad() {
			this.tel=uni.getStorageSync('tel');
		}
	}
</script>

<style>
	.xx {
		padding: 0 24rpx;
		padding-bottom: 10rpx;
		width: 100%;
		margin-bottom: 20rpx;
		background: #fff;
		box-sizing: border-box;
	}

	.xx:last-child {
		margin-bottom: 0;
	}

	.xxtit {
		margin-top: 20rpx;
		margin-bottom: 40rpx;
	}

	.titicon {
		margin-right: 10rpx;
		display: inline-block;
		width: 10rpx;
		height: 30rpx;
		background: #01B537;
		border-radius: 100rpx;
	}

	.sfz {
		display: flex;
		padding: 0 52rpx;
		justify-content: space-between;
	}

	.sfztp {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.sfzimg {
		margin-bottom: 20rpx;
		position: relative;
		width: 280rpx;
		height: 160rpx;
	}

	.sfzimg image {
		width: 280rpx;
		height: 160rpx;
	}

	.sfzimg button[disabled] {
		color: #fff !important;
		background: rgba(3, 3, 3, 0.6) !important;
		border-radius: 50%;
	}

	.uploadBtn {
		padding: 0;
		position: absolute;
		top: 46rpx;
		left: 106rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 68rpx;
		height: 68rpx;
		font-size: 26rpx;
		color: #fff;
		background: rgba(3, 3, 3, 0.6);
		border-radius: 50%;
	}

	button::after {
		border: 0;
	}

	.sfztit {
		font-size: 26rpx;
		color: #999;
	}

	.form {
		margin-top: 10rpx;
	}

	.formItem {
		display: flex;
		height: 120rpx;
		line-height: 120rpx;
		border-bottom: 2rpx solid #F5F5F5;
	}

	.formName {
		font-size: 30rpx;
		color: #333;
		width: 160rpx;
	}

	.formName text {
		margin-right: 10rpx;
		color: #FF0000;
	}

	.formItem input {
		flex: 1;
		font-size: 26rpx;
		height: 120rpx;
	}

	.formItem input::placeholder {
		font-size: 26rpx;
		color: #999;
	}

	.yzmBtn {
		margin-top: 30rpx;
		width: 180rpx !important;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		color: #01B537;
		padding: 0;
		border: 2rpx solid #01B537;
		background: none;
		font-weight: initial;
	}

	.yzmBtn1 {
		color: #fff;
		background: #01B537;
	}

	.formItem button[disabled] {
		color: #01B537 !important;

	}

	.formItemtip {
		height: 70rpx;
		line-height: 70rpx;
	}

	.btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding-top: 20rpx;
		background: #fff;
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}

	.btncon {
		margin: 0 auto;
		width: 702rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
		text-align: center;
		background: #F4F4F3;
		border-radius: 10rpx;
	}

	.btnho {
		color: #fff;
		background: #212D43;
	}
</style>
