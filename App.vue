<script>
	export default {
		globalData: {
			bootomTop: 0,
			baseUrl:'http://39.108.237.5:9108/app', //线上接口地址	
			imgUrl: 'http://39.108.237.5:9104/static/images/', //线上图片地址
			// uploadUrl: 'http://192.168.2.119:9108/file/app/regupload',  //吴本地上传图片地址
			// uploadUrl: 'http://124.71.65.82:9108/file/app/regupload',//线上传图片地址
			uploadUrl: 'http://39.108.237.5:9108/file/app/regupload',
			bdUrl: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=kT7BZV0k9F58rlasZxR1wpri&client_secret=IOCxd3roYRa05dB0SFHyYEYaus4C9xVD',//百度ocr
			sfzUrl: "https://aip.baidubce.com/rest/2.0/ocr/v1/idcard",//身份证识别
			xszUrl: "https://aip.baidubce.com/rest/2.0/ocr/v1/vehicle_license",//行驶证识别
			jszUrl: "https://aip.baidubce.com/rest/2.0/ocr/v1/driving_license",//驾驶证识别
			carUrl: "https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate", //车辆识别
		},
		onLaunch: function() {
			uni.getSystemInfo({
				success: res => {
					let model = res.model;
					if (/iphone\sx/i.test(model) || (/iphone/i.test(model) && /unknown/.test(model)) ||
						/iphone\s11/i.test(model)) {
						const {
							screenHeight,
							safeArea
						} = res
						const {
							bottom
						} = safeArea
						const bottomLift = screenHeight - bottom
						this.globalData.bootomTop = bottomLift;
					} else {
						this.globalData.bootomTop = 0;
					}
				}
			})
			uni.request({
				url: this.globalData.bdUrl,
				header: {
					'content-type': 'application/x-www-form-urlencoded' // 默认值
				},
				success(res) {
					if (res.statusCode == 200) {
						uni.setStorage({
							key: 'bdaccess-token',
							data: res.data.access_token,
						})
					}
				},
				fail(_res) {
					uni.showToast({
						title: '请求出错',
					})
					reject(_res)
				}
			})
			
		},
		onShow: function() {
			console.log('App Show')
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	@import url("./static/iconfont/iconfont.css");

	page {
		height: 100%;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		background: #efefef;
		box-sizing: border-box;
	}

	.content {
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}

	/* 隐藏滚动条 */
	.con {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		overflow-y: scroll;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.fontwe {
		font-weight: bold;
	}

	.font20 {
		font-size: 20rpx;
	}

	.font26 {
		font-size: 26rpx;
	}

	.font30 {
		font-size: 30rpx;
	}

	.font34 {
		font-size: 34rpx;
	}

	.font38 {
		font-size: 38rpx;
	}

	.colorf {
		color: #fff;
	}

	.color0 {
		color: #000;
	}

	.color3 {
		color: #333;
	}

	.color6 {
		color: #666;
	}

	.color9 {
		color: #999;
	}

	/* 底部导航 */
	.navigation_bar {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 98rpx;
		background: #fff;
		z-index: 999;
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		width: 750rpx;
		height: 98rpx;
	}

	.navbar__item {
		display: flex;
		flex-direction: column;
		width: 33.33%;
		text-align: center;
	}

	.navbar__imgs {
		margin: 0 auto;
		margin-top: 16rpx;
		margin-bottom: 6rpx;
		width: 36rpx;
		height: 36rpx;
	}

	.navbar__img {
		width: 100%;
		height: 100%;
	}

	.navbar__title {
		font-size: 22rpx;
		color: #333;
	}

	.bar_item_on .navbar__title {
		color: #01B537;
	}
	/* #endif */
</style>
