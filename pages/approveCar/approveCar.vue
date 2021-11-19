<template>
	<view class="container">
		<view class="con">
			<!-- <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="2" :fixOrientation="true" :size="500"
				:maxWidth="1000" :ql="0.9" type="url" /> -->
			<view class="xx">
				<view class="xxtit font30 color0 fontwe">
					<text class="titicon"></text>
					上传驾驶证信息
				</view>
				<view class="xxcon">
					<view class="sfz">
						<view class="sfztp">
							<view class="sfzimg">
								<image :src="jszzmimg?jszzmimg:imgUrl+'zc1.png'"></image>
								<button :disabled="mbsta" class="uploadBtn" data-index="1"
									@click="uploadImg">上传</button>
							</view>
							<view class="sfztit">驾驶证正页</view>
						</view>
						<view class="sfztp">
							<view class="sfzimg">
								<image :src="jszfmimg?jszfmimg:imgUrl+'zc2.png'"></image>
								<button :disabled="mbsta" class="uploadBtn" data-index="2"
									@click="uploadImg">上传</button>
							</view>
							<view class="sfztit">驾驶证副页</view>
						</view>
					</view>
				</view>
			</view>
			<view class="xx">
				<view class="xxtit font30 color0 fontwe">
					<text class="titicon"></text>
					上传行驶证信息
				</view>
				<view class="xxcon">
					<view class="sfz">
						<view class="sfztp">
							<view class="sfzimg">
								<image :src="xszzmimg?xszzmimg:imgUrl+'zc3.png'"></image>
								<button :disabled="mbsta" class="uploadBtn" data-index="3"
									@click="uploadImg">上传</button>
							</view>
							<view class="sfztit">行驶证正页</view>
						</view>
						<view class="sfztp">
							<view class="sfzimg">
								<image :src="xszfmimg?xszfmimg:imgUrl+'zc4.png'"></image>
								<button :disabled="mbsta" class="uploadBtn" data-index="4"
									@click="uploadImg">上传</button>
							</view>
							<view class="sfztit">行驶证副页</view>
						</view>
					</view>
					<view class="form">
						<view class="formItem">
							<view class="formName"><text>*</text>车牌号码</view>
							<input type="text" :value="cno" @input="carNum" placeholder="请输入车牌号码" />
						</view>
						<view class="formItem">
							<view class="formName"><text>*</text>品牌型号</view>
							<view v-if="!hasDate" class="noDateBlock">请选择品牌型号</view>
							<picker :class="{isOp:!hasDate}" @change="bindPickerChange" :value="index"
								:range-key="'name'" :range="array">
								<view class="uni-input">{{array[index].name}}</view>
							</picker>
						</view>
						<view class="formItem">
							<view class="formName"><text>*</text>发动机号</view>
							<input type="text" :value="fdjno" @input="carFdjh" placeholder="请输入发动机号" />
						</view>
						<view class="formItem formItemtip font20 color9">请确认车辆信息，如有错请手动修改</view>
					</view>
				</view>
			</view>
			<view class="xx">
				<view class="xxtit font30 color0 fontwe">
					<text class="titicon"></text>
					上传车辆左45°照片或者右45°照片
				</view>
				<view class="xxcon">
					<view class="sfz">
						<view class="sfztp">
							<view class="sfzimg">
								<image :src="carimg?carimg:imgUrl+'xszfm.png'"></image>
								<button :disabled="mbsta" class="uploadBtn" data-index="5"
									@click="uploadImg">上传</button>
							</view>
							<view class="sfztit">上传车辆图片</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn" @click="goSave">
				<view class="btncon" :class="{'btnho':btnTrue}">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cpimg from "../../components/cpimg/cpimg.vue"
	export default {
		components: {
			cpimg
		},
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				btnTrue: false,
				jszzmimg: '', //驾驶证
				jszfmimg: '',
				xszzmimg: '', //行驶证
				xszfmimg: '',
				carimg: '',
				imgSta: '', //表示那张图片 				
				// 行驶证
				cno: '', //车牌号                
				clype: '', //车辆类型
				xztype: '', //使用性质
				pname: '', //品牌型号
				fdjno: '', //发动机号
				clsbno: '', //车辆识别代号
				starttime: '', //行驶证注册日期
				endtime: '', //行驶证发证日期
				// 驾驶证
				jsno: '', //驾驶证号
				carktime: '', //驾驶证开始时间
				carjtime: '', //驾驶证结束时间

				array: [],
				index: 0,
				xhid: '',
				hasDate: false,
				mbsta: false,
			}
		},

		methods: {
			getppList: function() {
				var that = this;
				this.$http.sendRequest('/appcar/type/list', 'GET').then(res => {
					console.log(res);
					if (res.data.code == 200) {
						that.array = res.data.data
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})

				})
			},
			bindPickerChange: function(e) {
				var that = this
				this.hasDate = true
				this.index = e.target.value //取其下标
				var selected = this.array[this.index] //获取选中的数组
				this.xhid = selected.id //选中的id
				if (that.jszzmimg != '' && that.jszfmimg != '' && that.xszzmimg != '' && that.xszfmimg != '' &&
					that.carimg != '' && that.cno != '' && that.xhid != '' && that.fdjno != '') {
					that.btnTrue = true
				}
			},

			carNum: function(e) { //车牌号
				this.cno = e.detail.value
				if (this.jszzmimg != '' && this.jszfmimg != '' && this.xszzmimg != '' && this.xszfmimg != '' && this
					.carimg != '' && this.cno != '' && this.xhid != '' && this.fdjno != '') {
					this.btnTrue = true
				}
			},
			carPpxh: function(e) { //品牌类型
				this.pname = e.detail.value;
				if (this.jszzmimg != '' && this.jszfmimg != '' && this.xszzmimg != '' && this.xszfmimg != '' && this
					.carimg != '' && this.cno != '' && this.xhid != '' && this.fdjno != '') {
					this.btnTrue = true
				}
			},
			carFdjh: function(e) { //发动机号
				this.fdjno = e.detail.value;
				if (this.jszzmimg != '' && this.jszfmimg != '' && this.xszzmimg != '' && this.xszfmimg != '' && this
					.carimg != '' && this.cno != '' && this.xhid != '' && this.fdjno != '') {
					this.btnTrue = true
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
				this.upload_file(getApp().globalData.uploadUrl, file[0]);
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
				uni.showLoading({
					title: '图片加载中。。。'
				});
				console.log('url', url, filePath);
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
								//驾驶证正页 
								// var url="http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mcQSxJTYcevoRB0vt4ZuqKD*wSbl3Q4umwrkCOj28fKmhAMKE8kGkgzyCkmfc74gorikMIEyWMWLHtwjXocM3n0U!/b&bo=VQH6AAAAAAADJ6w!&rf=viewer_4";
								that.jszyzFun(getApp().globalData.jszUrl, url, "front");
							} else if (that.imgSta == 2) {
								//驾驶证副页 
								// var url="http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mcRvAtStnTLMi2cA4duaS84b7ibnE22igwbtERmzL6n65EUEoNR7iemEJFLOQ.cCvB4D31017F.xuI9.pwapVbZ4!/b&bo=oAU4BAAAAAABF6k!&rf=viewer_4";
								that.jszyzFun(getApp().globalData.jszUrl, url, "back");
							} else if (that.imgSta == 3) {
								//行驶证正页
								// var url="http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mcQSxJTYcevoRB0vt4ZuqKD.mOiNkjWqqadH*hKbxFAHv807cf0RMcv1ZPo8W6iqEdymtrrTMUr14d3xUxkPOfBE!/b&bo=hwK*AQAAAAADNyk!&rf=viewer_4";
								that.xszyzFun(getApp().globalData.xszUrl, url, "front");
							} else if (that.imgSta == 4) {
								//行驶证副页
								// var url="http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mcRvAtStnTLMi2cA4duaS84bMYyt1jGQ3rO7zTjIPDDk83LqEVUsTIWG*BJ7HjQOOHjmrnG6tdnyNpvap5AZ.Bjs!/b&bo=oAU4BAAAAAABJ5k!&rf=viewer_4";
								that.xszyzFun(getApp().globalData.xszUrl, url, "back");
							} else if (that.imgSta == 5) {
								//车辆45°拍照
								// var url="http://m.qpic.cn/psc?/V53JbaiE0DSbcQ2Z9ynE3D0bdR4SBPjq/45NBuzDIW489QBoVep5mcS4tZRK7KZaY5Hph.ht6*utnKUtaaJnse8lI0TWdUBaVMZCcATozvZOONYLghqjReA9z2SVZZqOrG*J8ucFXKpE!/b&bo=oAU4BAAAAAABF6k!&rf=viewer_4";
								that.carFun(getApp().globalData.carUrl, url);
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
			// 驾驶证验证
			jszyzFun: function(url, img, cardSide) {
				var that = this
				uni.request({
					url: url,
					data: {
						access_token: uni.getStorageSync("bdaccess-token"),
						url: img,
						detect_direction: true,
						driving_license_side: cardSide
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' // 默认值
					},
					success(res) {
						that.mbsta = false;
						uni.hideLoading();
						if (res.data.words_result != undefined) {
							if (that.imgSta == 1) {
								that.jszzmimg = img;
								that.jsno = res.data.words_result.证号.words; //驾驶证号
								that.carktime = res.data.words_result.有效期限.words.replace(
									/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"); //驾驶证开始时间
								that.carjtime = res.data.words_result.至.words.replace(
									/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"); //驾驶证结束时间 

							} else if (that.imgSta == 2) {
								that.jszfmimg = img
							}
							if (that.jszzmimg != '' && that.jszfmimg != '' && that.xszzmimg != '' && that
								.xszfmimg != '' && that.carimg != '' && that.cno != '' && that.xhid != '' &&
								that.fdjno != '') {
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
			// 行驶证验证
			xszyzFun: function(url, img, cardSide) {
				var that = this
				uni.request({
					url: url,
					data: {
						access_token: uni.getStorageSync("bdaccess-token"),
						url: img,
						detect_direction: true,
						vehicle_license_side: cardSide
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' // 默认值
					},
					success(res) {
						that.mbsta = false;
						uni.hideLoading();
						if (res.data.words_result != undefined) {
							if (that.imgSta == 3) {
								that.xszzmimg = img;
								that.cno = res.data.words_result.号牌号码.words; //车牌号
								that.clype = res.data.words_result.车辆类型.words; //车辆类型
								that.xztype = res.data.words_result.使用性质.words; //使用性质
								that.pname = res.data.words_result.品牌型号.words; //品牌型号
								that.fdjno = res.data.words_result.发动机号码.words; //发动机号
								that.clsbno = res.data.words_result.车辆识别代号.words; //车辆识别代号

								that.starttime = res.data.words_result.注册日期.words.replace(
									/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"); //行驶证注册日期
								that.endtime = res.data.words_result.发证日期.words.replace(
									/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"); //行驶证发证日期 
							} else if (that.imgSta == 4) {
								that.xszfmimg = img
							}
							if (that.jszzmimg != '' && that.jszfmimg != '' && that.xszzmimg != '' && that
								.xszfmimg != '' && that.carimg != '' && that.cno != '' && that.xhid != '' &&
								that.fdjno != '') {
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
			// 图片验证
			carFun: function(url, img) {
				var that = this
				uni.request({
					url: url,
					data: {
						access_token: uni.getStorageSync("bdaccess-token"),
						url: img,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' // 默认值
					},
					success(res) {
						that.mbsta = false;
						uni.hideLoading();
						if (res.data.words_result != undefined) {
							if (that.imgSta == 5) {
								that.carimg = img
							}
							if (that.jszzmimg != '' && that.jszfmimg != '' && that.xszzmimg != '' && that
								.xszfmimg != '' && that.carimg != '' && that.cno != '' && that.xhid != '' &&
								that.fdjno != '') {
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
			//保存
			goSave: function() {
				var that = this;
				if (that.jszzmimg == '') {
					uni.showToast({
						title: '请上传驾驶证正页',
						icon: 'none'
					})
					return false
				}
				if (that.jszfmimg == '') {
					uni.showToast({
						title: '请上传驾驶证副页',
						icon: 'none'
					})
					return false
				}
				if (that.xszzmimg == '') {
					uni.showToast({
						title: '请上传行驶证正页',
						icon: 'none'
					})
					return false
				}
				if (that.xszfmimg == '') {
					uni.showToast({
						title: '请上传行驶证副页',
						icon: 'none'
					})
					return false
				}
				if (that.carimg == '') {
					uni.showToast({
						title: '请上传车辆左45°照片或者右45°照片',
						icon: 'none'
					})
					return false
				}
				if (that.cno == '') {
					uni.showToast({
						title: '请输入车牌号码',
						icon: 'none'
					})
					return false
				}
				if (that.xhid == '') {
					uni.showToast({
						title: '请输入品牌型号',
						icon: 'none'
					})
					return false
				}
				if (that.fdjno == '') {
					uni.showToast({
						title: '请输入发动机号',
						icon: 'none'
					})
					return false
				} else {
					if (that.jszzmimg != '' && that.jszfmimg != '' && that.xszzmimg != '' && that.xszfmimg != '' &&
						that.carimg != '' && that.cno != '' && that.xhid != '' && that.fdjno != '') {
						that.btnTrue = true
					}
					var carIfo = {
						jsimg: that.jszzmimg,
						jsfimg: that.jszfmimg,
						xszimg: that.xszzmimg,
						xszfimg: that.xszfmimg,
						climg: that.carimg,
						jsno: that.jsno, //驾驶证号
						carktime: that.carktime, //驾驶证开始时间
						carjtime: that.carjtime, //驾驶证结束时间   
						cno: that.cno, //车牌号
						clype: that.clype, //车辆类型
						xztype: that.xztype, //使用性质
						pname: that.pname, //品牌型号
						xhid: that.xhid, //型号id
						fdjno: that.fdjno, //发动机号
						vin: that.clsbno, //车辆识别代号
						starttime: that.starttime, //行驶证注册日期
						endtime: that.endtime, //行驶证发证日期
					}
					uni.setStorageSync('carIfo', carIfo);
					uni.navigateTo({
						url: '../approveUser/approveUser'
					})
				}
			},
		},
		onLoad() {
			this.getppList();
		}
	}
</script>

<style>
	/* .limb{
		    width: 100%;
		    height: 100%;
		    position: fixed;
		    top: 0;
		    left: 0;
		    background: rgba(0,0,0,.2);
	} */
	.container {
		padding-bottom: 110rpx;
	}

	.isOp {
		opacity: 0;
	}

	.noDateBlock {
		position: absolute;
		left: 160rpx;
		flex: 1;
		height: 120rpx;
		font-size: 26rpx;
		color: #999;
	}

	.con {
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}

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
		position: relative;
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

	.uni-input {
		font-size: 26rpx;
		color: #333;
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
