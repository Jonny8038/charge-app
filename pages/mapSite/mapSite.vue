<template>
	<view class="container">
		<view class="content">
			<map id="map" :scale="scale" :markers="markers" :longitude="longitude" :latitude="latitude"
				@markertap="showModal">
				<!-- <cover-view class="tc" v-if="gglist.length!=0">系统公告：{{gglist[0].content}}</cover-view>
				<cover-view class="tc" v-else>系统公告：暂无</cover-view> -->
				
				<!-- <cover-image v-show="dwSta" class="zximg" :src='imgUrl+"marker1.png"'></cover-image> -->
				
				<cover-image class="item item1" @click="" src="../../static/right1.png"></cover-image>
				<cover-image class="item item2" @click="reflash" src="../../static/right2.png"></cover-image>
				<cover-image class="item item3" @click="getdqwz" src="../../static/right3.png"></cover-image>
			</map>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/WSCoordinate.js'
	export default {
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				cityname: '',
				scale: 16,
				latitude: 0,
				longitude: 0,
				markers: [],
				dwSta: true,
				dtDetaile: {},
				dcNum: '',
				gglist:[],
			}
		},
		methods: {
			reflash: function() {
				this.markers = [];
				this.getalllist();
				this.scale = 16;
			},
			getdqwz: function() {
				var that = this;
				//获取当时位置
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						let marker = {
							id: Number(0),
							longitude: res.longitude,
							latitude: res.latitude,
							iconPath: "../../static/marker1.png",
							width: 30,
							height: 40
						};
						var list = that.markers;
						list.push(marker);
						that.scale = 16;
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						that.markers = list;
						that.currentPage = 1;
						that.dwSta = false;
					}
				});
			},
			getalllist() {
				var that = this;
				/** 将GCJ-02(火星坐标)转为百度坐标*/
				var hxzbd = util.transformFromGCJToBaidu(this.latitude, this.longitude);
				this.$http.sendRequest('/appsite/alllist', 'POST', {
					city: this.cityname,
					jd: hxzbd.longitude,
					wd: hxzbd.latitude
				}).then(res => {
					if (res.data.code == 200) {
						var arr = [];
						res.data.data.forEach(item => {
							/**将百度坐标转为GCJ-02(火星坐标) */
							var bdzhx = util.transformFromBaiduToGCJ(item.zy, item.zx);
							if (item.istype == 1) { //1营业
								var obj = {
									id: Number(item.id),
									longitude: bdzhx.longitude,
									latitude: bdzhx.latitude,
									iconPath:"../../static/marker2.png",
									width: 36,
									height: 46
								}
							} else if (item.istype == 2) { //2停业
								var obj = {
									id: Number(item.id),
									longitude: bdzhx.longitude,
									latitude: bdzhx.latitude,
									iconPath: "../../static/marker3.png",
									width: 36,
									height: 46
								}
							}
							that.markers.push(obj)
						});
						arr = that.markers;
						that.markers = arr
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})
				})
			},
			// 点击地图上面的标记点
			showModal: function(e) {
				var that = this;
				var token = uni.getStorageSync('token') || '';
				if (e.detail.markerId != 0) {
					this.$http.sendRequest('/appsite/sitedetails', 'POST', {
						sid: e.detail.markerId
					}).then(res => {
						console.log('res11',res);
							var distance = 0;
						if (res.data.code == 200) {
							if (res.data.zy != null && res.data.data.zx != '') {
								distance = that.getDistance(that.latitude, that.longitude, res.data
									.data.zy, res.data.data.zx);
							}
							if (res.data.data != null) {
								that.dtDetaile = res.data.data;
							}
							if (res.data.powerSpaceCount != null) {
								that.powerSpaceCount = res.data.powerSpaceCount;
							}
							that.dtDetaile.distance = distance;
							that.dcNum = res.data.siztdatasize;
							
							const popdetaile = uni.getSubNVueById('popup_detaile');
							popdetaile.show();
							//页面之间传值
						    uni.$emit('popDetaile', {
								dtDetaile: that.dtDetaile,
								dcNum:that.dcNum,
								powerSpaceCount:that.powerSpaceCount
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
							})
						}
					}).catch(err => {
						uni.showToast({
							icon: 'none',
							title: '网络错误121',
						})
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: "点击了当前位置",
					})
				}
			},
			
			Rad: function(d) { //根据经纬度判断距离
				return d * Math.PI / 180.0;
			},
			getDistance: function(lat1, lng1, lat2, lng2) {
				var radLat1 = this.Rad(lat1);
				var radLat2 = this.Rad(lat2);
				var a = radLat1 - radLat2;
				var b = this.Rad(lng1) - this.Rad(lng2);
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) *
					Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10000;
				s = s.toFixed(2) + '公里' //保留两位小数
				return s
			},
			// 公告消息
			getggList: function(id) {
				var that = this;
				this.$http.sendRequest('/appsysmgs/platform/list', 'POST').then(res => {
					console.log('111', res);
					if (res.data.code == 200) {
						that.gglist = res.data.data
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
			this.getdqwz();
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getggList();
			}
		},
		onShow(){
			var that = this;
			that.getalllist();
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.tc {
		position: absolute;
		top: 20rpx;
		z-index: 3;
		margin-left: 24rpx;
		display: flex;
		padding: 0 20rpx;
		width: 702rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 26rpx;
		color: #000000;
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.06);
		background: rgba(255, 255, 255, 0.9);
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.icon-a-lujing471 {
		margin-right: 10rpx;
		font-size: 28rpx;
		color: #01972C;
	}

	.zximg {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 52%;
		left: 338rpx;
		width: 74rpx;
		height: 104rpx;
	}
	.item {
		position: absolute;
		right: 10rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.16);
		border-radius: 10rpx;
	}

	.item1 {
		bottom: 258rpx;
	}

	.item2 {
		bottom: 178rpx;
	}

	.item3 {
		bottom: 98rpx;
	}

	map {
		width: 100vw;
		height: 100vh;
		z-index: 1;
	}

	.bottk {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.bot {
		display: none;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #FAFCFF;
		border-radius: 40rpx 40rpx 0px 0px;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.mobtn {
		display: flex;
		padding: 24rpx;
		height: 8rpx;
		border-radius: 40rpx;
	}

	.mobtn .tb {
		margin: 0 auto;
		width: 60rpx;
		height: 8rpx;
		background: #EAEAEA;
	}

	.btn {
		display: flex;
		justify-content: center;
		margin: 0 auto;
		width: 702rpx;
		height: 90rpx;
		line-height: 90rpx;
		color: #FAFCFF;
		background: #212D43;
		border-radius: 10rpx;
		text-align: center;
	}

	.btn .iconfont {
		margin-right: 10rpx;
	}

	.btn view:last-child {
		font-size: 26rpx;
	}

	.mdxx {
		padding: 0 24rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;
	}

	.icon-a-lujing279 {
		height: 56rpx;
		line-height: 56rpx;
		font-size: 20rpx;
		color: #EAEAEA;
		text-align: center;
	}

	.xx1 {
		display: flex;
		justify-content: space-between;
	}

	.wz {
		margin-bottom: 10rpx;
		display: flex;
		align-items: center;
		height: 50rpx;
	}

	.mdstate {
		width: 60rpx;
		height: 30rpx;
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		background: #29BD5F;
		border-radius: 10rpx;
	}

	.mdstate1 {
		background: #999999;
	}

	.mdname {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: #333;
		line-height: 21px;
		height: 50rpx;
		overflow: hidden;
	}

	.mdtel {
		display: flex;
	}

	.icon-a-lujing424 {
		margin-right: 10rpx;
		font-size: 32rpx;
	}

	.dh {
		margin-bottom: 10rpx;
		display: flex;
		justify-content: center;
		width: 130rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: #FAFCFF;
		border: 2rpx solid #66676A;
		border-radius: 24rpx;

	}

	.icon-a-lujing2821 {
		margin-right: 10rpx;
		font-size: 30rpx;
	}

	.dh text:last-child {
		color: #212D43;
	}

	.jl {
		text-align: right;
	}

	.xx2 {
		margin-top: 24rpx;
		padding: 0 20rpx;
		width: 702rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.05);
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.xx2top {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
	}

	.dcnum {
		color: #FF1D1D;
	}

	.xx2con {
		padding: 30rpx 0;
		border-top: 2rpx solid #F2F5F8;
		display: flex;
		justify-content: space-between;
	}

	.xx2item {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.xx2item view:first-child {
		margin-bottom: 20rpx;
		height: 44rpx;
		font-size: 34rpx;
		font-weight: bold;
		line-height: 40rpx;
		color: #333333;

	}

	.xx2item view:last-child {
		height: 34rpx;
		font-size: 26rpx;
		line-height: 40rpx;
		color: #999999;
	}

	.xx3 {
		margin: 40rpx 0;
		height: 88rpx;
		font-size: 26rpx;
		line-height: 52rpx;
		color: #333333;
	}

	.xx3 text {
		font-weight: bold;
	}

	.icon-a-zu640 {
		margin-right: 10rpx;
	}

	.jcBtn {
		background: #F2F5F8;
	}

	.jcBtn view {
		font-weight: bold;
		color: #333;
	}

	.yytk {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		z-index: 999;
		background: rgba(0, 0, 0, 0.4);
	}

	.tk {
		position: relative;
		width: 582rpx;
		height: 400rpx;
		background: #FFFFFF;
		border: 6rpx solid rgba(112, 213, 142, 0.2196078431372549);
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.26);
		border-radius: 40rpx;
	}

	.tk .img {
		position: absolute;
		left: 232rpx;
		top: -59rpx;
		height: 118rpx;
		width: 118rpx;
	}

	.tk image {
		height: 118rpx;
		width: 118rpx;
	}

	.tknr {
		margin-top: 108rpx;
		text-align: center;
	}

	.tknr1 {
		margin-top: 144rpx;
	}

	.tip1 {
		margin: 0 auto;
		margin-bottom: 20rpx;
		width: 320rpx;
		line-height: 40rpx;
	}

	.icon-a-lujing415 {
		margin-top: 40rpx;
		font-size: 64rpx;
		text-align: center;
	}

	.sbtknr {
		border: 6px solid #EAEAEA;
	}

	.tip3 {
		margin: 0 auto;
		margin-top: 40rpx;
		width: 400rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #F2F5F8;
		border-radius: 10rpx;
	}

	.tip4 {
		margin: 0 auto;
		margin-top: 40rpx;
		width: 400rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: #fff;
		background: #212D43;
		border-radius: 10rpx;
	}
</style>
