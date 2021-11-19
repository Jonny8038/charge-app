<template>
	<view class="container">
		<view class="dtcon">
			<view class="ss">
				<view class="sscon">
					<text class="ssico iconfont icon-a-lujing293"></text>
					<input placeholder="请输入站点名字" placeholder-class="pyclass" @input="ssfun" />
				</view>
			</view>
			<view class="lbnr">
				<scroll-view scroll-y="true" :style="{height:'calc(100vh - '+ bootomTop+')'}" @scrolltoupper="upper"
					@scrolltolower="lower">
					<block v-for="(item,index) in lists" :key="index">
						<view class="li">
							<view class="lile">
								<view class="wz" :data-id="item.id">
									<view v-if="item.bussStatus==1" class="mdstate">营业</view>
									<view v-if="item.bussStatus==2" class="mdstate mdstate1">停业</view>
									<view class="mdname">{{item.name}}</view>
								</view>
								<view class="lihdz">
									<view class="iconfont icon-a-lujing425"><text>{{item.distance}}</text></view>
									<view v-if="item.phone" class="iconfont icon-a-lujing426"
										:data-tel="item.phone" @click="callTel">
										<text>{{item.phone}}</text>
									</view>
									<view v-else class="iconfont icon-a-lujing426"><text>暂无</text></view>
								</view>
							</view>
							<view class="liri">
								<view class="yybtn" v-if="item.bussStatus==1&&item.zx&&item.zy" :data-lng="item.zx"
									:data-lat="item.zy" :data-name="item.name" :data-address="item.address"
									@click="goDh">前往维修</view>
								<view class="yybtn" :class="item.bussStatus==2?'yybtnho':''" v-if="item.bussStatus==2">前往维修</view>
							</view>
						</view>
					</block>
					<view class="loading" :hidden="!loadAll">已加载全部</view>
					<view class="loading1" :hidden="!nodata" :style="{height:'calc(100vh - '+ bootomTop+')'}">
						<view class="wsjcon">
							<image :src='imgUrl+"xx.png"' />
							<text>暂无数据</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import QQMapWX from '../../utils/qqmap-wx-jssdk.min.js'
	import util from '../../utils/WSCoordinate.js'
	export default {
		data() {
			return {
				imgUrl:getApp().globalData.imgUrl,
				bootomTop: '',
				latitude: '',
				longitude: '',
				city:'',
				currentPage: 1, // 当前第1页
				pageSize: 10, //每页显示多少数据 
				hasMoreData: true,
				nodata: false,
				loadAll: false,
				sitename: '',
				lists: [],
			}
		},
		methods: {
			// 打电话
			callTel: function(e) {
				var phone = e.currentTarget.dataset.tel;
				if (phone != '') {
					uni.makePhoneCall({
						phoneNumber: phone,
					})
				}
			},
			// 跳转到导航
			goDh: function(e) {
				var bdzhx = util.transformFromBaiduToGCJ(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
				uni.openLocation({
					latitude: bdzhx.latitude, //维度
					longitude: bdzhx.longitude, //经度
					name: e.currentTarget.dataset.name, //目的地定位名称
					scale: 15, //缩放比例
					address: e.currentTarget.dataset.address //导航详细地址
				});
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

			ssfun: function(e) {
				this.sitename = e.detail.value;
				this.lists = [];
				this.currentPage = 1;
				this.getfjlist();
			},
			getfjlist: function() {
				var hxzbd = util.transformFromGCJToBaidu(this.latitude, this.longitude);
				uni.showLoading({
					title: '数据加载中。。。',
				});
				this.$http.sendRequest('/appservicesite/list', 'POST', {
					city:this.city,
					name: this.sitename,
					posX : hxzbd.longitude,
					posY : hxzbd.latitude,
					pageNum: this.currentPage,
					pageSize: this.pageSize
				}).then(res => {
					uni.hideLoading();
					var contentlistTem = this.lists;
					var distance = 0;
					if (res.data.code == 200) {

						if (this.currentPage == 1) {
							contentlistTem = []
						}
						var contentlist = res.data.data.rows
						if (contentlist.length != 0) {
							for (var i = 0; i < contentlist.length; i++) {
								distance = this.getDistance(this.latitude, this.longitude,
									contentlist[i].zy, contentlist[i].zx);
								contentlist[i].distance = distance;
							}
						}
						if (contentlist.length == 0 && this.currentPage == 1) {
							this.loadAll = false;
							this.nodata = true;
						} else if (contentlist.length == 0 && this.currentPage != 1) {
							this.loadAll = true;
							this.nodata = false;
						} else if (contentlist.length < this.pageSize) {
							this.lists = contentlistTem.concat(contentlist);
							this.loadAll = true;
							this.hasMoreData = false;
							this.nodata = false;
						} else {
							this.lists = contentlistTem.concat(contentlist);
							this.hasMoreData = true;
							this.nodata = false;
							this.currentPage = this.currentPage + 1;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
						})
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: "网络错误",
					})
				})
			},
			upper: function(e) {
				this.currentPage = 1
				this.getfjlist()
			},
			/**页面上拉触底事件的处理函数*/
			lower: function() {
				if (this.hasMoreData) {
					this.getfjlist()
					this.loadAll = false
				} else {
					this.loadAll = true
					uni.showToast({
						icon: 'none',
						title: '没有更多数据',
					})
				}
			},
			// 获取当前城市信息
			GetNowCityInfo(lag) {
				var that = this;
				let qqmapsdk = new QQMapWX({
					key: '2EDBZ-KBK32-WSHU3-C2HAN-GNKF7-ZPFYE' //腾讯地图ak
				});
				qqmapsdk.reverseGeocoder({
					location: {
						longitude: lag.longitude,
						latitude: lag.latitude
					},
					success(res) {
						if (res.status == 0 && res.message == "query ok") {
							that.city = res.result.address_component.city.replace("市","");
						}
						that.getfjlist();
					}
				})
			}
		},
		onLoad() {
			var that = this;
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				//获取当时位置
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						console.log('r11es',res);
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						that.GetNowCityInfo(res)  //获取城市信息
						that.currentPage = 1;
						
					}
				});
				var ss = 80 + getApp().globalData.bootomTop * 2;
				this.bootomTop = ss + "rpx";
			}
		}
	}
</script>

<style>
	.dtcon {
		position: relative;
		width: 100%;
	}

	.ss {
		padding-bottom: 20rpx;
		position: fixed;
		background: #fff;
		z-index: 1;
		width: 100%;
	}

	.sscon {
		display: flex;
		position: relative;
		margin: 0 auto;
		width: 702rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #F5F5F5;
		border-radius: 10rpx;
	}

	.ssico {
		margin: 0 20rpx;
		font-size: 26rpx;
		color: #666;
	}

	.sscon input {
		flex: 1;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #000;
	}

	.pyclass {
		font-size: 26rpx;
		color: #999;
	}

	.lbnr {
		width: 100%;
		position: absolute;
		top: 80rpx;
	}

	.lbtopItem {
		width: 60rpx;
		font-size: 30rpx;
		color: #666;
		text-align: center;
	}

	.lbtopho {
		font-weight: bold;
		color: #29BD5F;
		border-bottom: 4rpx solid #29BD5F;
	}

	.lbcontent {
		padding-bottom: 114rpx;
	}

	.li {
		display: flex;
		padding: 30rpx 24rpx;
		margin-top: 20rpx;
		background: #fff;
	}

	.lile {
		flex: 1;
	}

	.wz {
		margin-bottom: 12rpx;
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
		font-weight: bold;
		line-height: 50rpx;
		height: 50rpx;
		overflow: hidden;
	}

	.lihdz {
		display: flex;
		height: 34rpx;
		line-height: 34rpx;
	}

	.icon-a-lujing425,
	.icon-a-lujing426 {
		font-size: 26rpx;
		color: #666666;
	}

	.icon-a-lujing425 {
		margin-right: 40rpx;
	}

	.lihdz .iconfont text {
		margin-left: 6rpx;
		color: #999;
	}

	.liri {
		display: flex;
		align-items: center;
		width: 180rpx;
	}
	.yybtn {
		width: 180rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #fff;
		text-align: center;
		background: #29BD5F;
		border-radius: 60rpx;
	}
	.yybtnho{
		background: #F4F4F3;
	}
	.loading {
		padding: 20rpx 0;
		font-size: 30rpx;
		color: #666;
		text-align: center;
	}

	.loading1 {
		display: flex;
		justify-content: center;
		width: 100%;
		align-items: center;
	}

	.wsjcon {
		display: flex;
		flex-direction: column;
	}

	.wsjcon image {
		margin-bottom: 40rpx;
		width: 536rpx;
		height: 170rpx;
	}

	.wsjcon text {
		font-size: 30rpx;
		color: #666;
		text-align: center;
	}
</style>
