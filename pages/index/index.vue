<template>
	<view class="container">
		<view class="content">
			<view class="top">
				<view class="topcon">
					<!-- <view class="tople" @click="gomapSite">
						<view class="topimg">
							<image :src='imgUrl+"index2.png"' />
						</view>
						<text>地图站点</text>
					</view> -->
					<view class="tople">{{weather}}</view>
					<view class="topimg" @click="gosystemInfo">
						<image :src='imgUrl+"xxico.png"' />
					</view>
				</view>
			</view>
			<swiper class="swiper" indicator-dots="true" indicator-color="rgba(255, 255, 255, .28)"
				indicator-active-color="#fff" autoplay="true" interval="2000" duration="500">
				<block v-for="(item,index) in banners" :key="index">
					<swiper-item>
						<view class="swiper-item">
							<image :src="item.banner?item.banner:imgUrl+'index_banner.png'"></image>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="tc" v-if="gglist[0]">
				<text class="iconfont icon-a-lujing471"></text>
				系统公告：{{gglist[0].content?gglist[0].content:'暂无数据'}}
			</view>
			<view class="zd">
				<view class="zdtop">
					<view class="zdtople">附近站点</view>
					<view class="zdtopri" @click="gomapSite">所有站点<text class="iconfont icon-a-lujing448"></text></view>
				</view>
				<view class="zdcon">
					<view class="dtcon" v-if="lists.length>0">
						<block v-for="(item,index) in lists" :key="index">
							<view class="li">
								<view class="limb" :data-id="item.id" :data-jl="item.distance" @click="goDetaile">
								</view>
								<view class="lile">
									<view class="wz">
										<view v-if="item.istype==1" class="mdstate">营业</view>
										<view v-if="item.istype==2" class="mdstate mdstate1">停业</view>
										<view class="mdname">{{item.name}}</view>
									</view>
									<view class="lihdz">
										<text class="iconfont icon-a-lujing425"></text>
										<text class="tel font26 color9">{{item.address?item.address:'暂无'}}</text>
									</view>
									<view class="lidc">电池<text>{{item.zxnum?item.zxnum:0}}</text></view>
								</view>
								<view class="liri">
									<view class="lidh">
										<text v-if="item.phone" class="iconfont icon-a-lujing426"
											:data-tel="item.phone" @click="callTel"></text>
										<text v-if="item.zx&&item.zy" class="iconfont icon-a-lujing2821"
											:data-lng="item.zx" :data-lat="item.zy" :data-name="item.name"
											:data-address="item.address" @click="goDh"></text>
									</view>
									<view class="jl font26 color9" v-if="item.distance">{{item.distance}}</view>
									<view class="yybtn" v-if="item.istype==1" :data-id="item.id" :data-name="item.zname"
										:data-lng="item.zx" :data-lat="item.zy" :data-dhname="item.name"
										:data-address="item.address" @click="lbyyFun">
										立即预约
									</view>
									<view class="yybtn" :class="item.istype==2?'yybtnho':''" v-if="item.istype==2">
										立即预约
									</view>

								</view>
							</view>
						</block>
					</view>
					<view v-else
						style="padding: 20rpx 0;text-align: center;font-size: 30rpx;color:#000;background: #fff;">暂无数据
					</view>
				</view>
			</view>
			<view class="clzt">
				<view class="tit">车辆状态</view>
				<view class="ztcon">
					<view class="ztxx">
						<view class="ztxxle">
							<image :src='imgUrl+"wz.png"'></image>
							<view class="wzsj">
								<view class="ztwz">当前位置：{{dwqz}}</view>
								<view class="ztsj">更新时间：{{carInfo?carInfo.receiveTime:"''"}}</view>
							</view>
						</view>
						<view class="ztxxri" @click="gomapSite">
							立即换电 <text class="iconfont icon-a-lujing448"></text>
						</view>
					</view>
					<scroll-view scroll-x="true" class="ztList">
						<view class="ztitem" @click="goMycell">
							<view class="ztitemcon">
								<view class="ztItle">
									<text>电池情况</text>
									<text v-if="carInfo.yctype==0&&carInfo.power!=0">正常</text>
									<text v-if="carInfo.yctype==1||carInfo.power==0||!carInfo.yctype">异常</text>
								</view>
								<view class="ztItri iconfont icon-a-lujing448"></view>
								<image :src='imgUrl+"zt1.png"'></image>
							</view>
						</view>
						<view class="ztitem" @click="goFaultInfo">
							<view class="ztitemcon">
								<view class="ztItle">
									<text>故障码</text>
									<text>{{carInfo.alarmnum?carInfo.alarmnum:0}}个</text>
								</view>
								<view class="ztItri iconfont icon-a-lujing448"></view>
								<image :src='imgUrl+"zt2.png"'></image>
							</view>
						</view>
						<view class="ztitem">
							<view class="ztitemcon">
								<view class="ztItle">
									<text>剩余电量</text>
									<text>{{carInfo.power?carInfo.power:0}}%</text>
								</view>
								<image :src='imgUrl+"zt3.png"'></image>
							</view>
						</view>
						<!-- 	<view class="ztitem" @click="goFaultInfo">
							<view class="ztitemcon">
								<view class="ztItle">
									<text>发动机工况</text>
									<text>1个</text>
								</view>
								<view class="ztItri iconfont icon-a-lujing448"></view>
								<image src="../../static/images/zt4.png"></image>
							</view>
						</view> -->
						<view class="ztitem">
							<view class="ztitemcon">
								<view class="ztItle">
									<text>行驶里程</text>
									<text>{{carInfo.dqgls?carInfo.dqgls:0}}公里</text>
								</view>
								<image :src='imgUrl+"zt5.png"'></image>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="clzt">
				<view class="hdtop">
					<view class="tit">换电数据</view>
					<view class="hdtopri">
						<!-- <text :class="topIndex==0?'hdtopriho':''" data-num="0" @click="menuClick">今日换电</text>
						<text :class="topIndex==1?'hdtopriho':''" data-num="1" @click="menuClick">最近一次</text> -->
						<text class="hdtopriho">最近一次</text>
					</view>
				</view>
				<view class="hdcon" v-if="lastinfo">
					<view class="hdwz">
						<view>站场位置</view>
						<view>{{lastinfo.siteName?lastinfo.siteName:'无'}}</view>
					</view>
					<view class="hddata">
						<view class="hditem">里程：<text>{{lastinfo.mileage?lastinfo.mileage:0}}公里</text></view>
						<view class="hditem">消费：<text>{{lastinfo.price?lastinfo.price:0}}元</text></view>
						<view class="hditem">用时：<text>{{lastinfo.useTime?lastinfo.useTime:0}}分钟</text></view>
						<view class="hditem">电量：<text>{{lastinfo.newBatteryPower?lastinfo.newBatteryPower:0}}%</text></view>
					</view>
					<view class="hdri">
						<text class="iconfont icon-a-lujing448"></text>
					</view>
				</view>
				<view class="hdcon hdconho" v-else>
					暂无
				</view>
			</view>
			<view class="zx">
				<view class="zdtop zxtit">
					<view class="zdtople">新闻资讯</view>
					<view class="zdtopri" @click="gozxList">更多<text class="iconfont icon-a-lujing448"></text></view>
				</view>
				<view class="zxlist">
					<view v-if="zxList.length==0" style="font-size:30rpx;color:#666;text-align: center;">暂无数据</view>
					<block v-else v-for="(item,index) in zxList" :key="index">
						<view class="zxli" :data-id="item.id" @click="goItemDetaile">
							<view class="zxImg">
								<image :src="item.banner?item.banner:'../../static/zximg.png'"></image>
							</view>
							<view class="zxRi">
								<view class="zxlitit" v-if="item.title">{{item.title}}</view>
								<view class="zxlidesc">{{item.description?item.description:'无'}}</view>
								<view class="zxlibot">
									<view class="zxtime">{{item.createTime?item.createTime:"''"}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view class="navigation_bar">
				<view class="navbar">
					<view class="navbar__item bar_item_on" data-index="0" @click="tabClick">
						<view class="navbar__imgs">
							<image class="navbar__img" :src='imgUrl+"syho.png"'></image>
						</view>
						<view class="navbar__title">首页</view>
					</view>
					<view class="navbar__item" data-index="1" @click="tabClick">
						<view class="navbar__imgs">
							<image class="navbar__img" :src='imgUrl+"fw.png"'></image>
						</view>
						<view class="navbar__title">服务</view>
					</view>
					<view class="navbar__item" data-index="2" @click="tabClick">
						<view class="navbar__imgs">
							<image class="navbar__img" :src='imgUrl+"my.png"'></image>
						</view>
						<view class="navbar__title">我的</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 地图预约成功 -->
		<view class="yytk" :hidden="successState">
			<view class="tkcon">
				<view class="tk">
					<view class="img">
						<image :src='imgUrl+"success.png"' />
					</view>
					<view class="tknr tknr1">
						<view class="tip1 font30 color3">恭喜你 电池检测通过</view>
						<view class="tip2 font38 color3 fontwe">已成功预约</view>
						<view class="tip4 font30 color6" :data-lng="lng" :data-lat="lat" :data-name="dhname"
							:data-address="address" @click="goDh">去换电</view>
					</view>
				</view>
				<view class="iconfont icon-a-lujing415" data-sta='0' @click="yytkClose"></view>
			</view>
		</view>
		<!-- 地图预约失败 -->
		<view class="yytk" :hidden="failState">
			<view class="tkcon">
				<view class="tk sbtknr">
					<view class="img">
						<image :src='imgUrl+"fail.png"' />
					</view>
					<view class="tknr">
						<view class="tip1 font30 color3">很抱歉 电池检测异常</view>
						<!-- <view class="tip1 font30 color3">{{failMsg}}</view> -->

						<view class="tip2 font38 color3 fontwe">预约失败</view>
						<view class="tip3 font30 color6" @click="goxyFun">去消除异常</view>
					</view>
				</view>
				<view class="iconfont icon-a-lujing415" data-sta='1' @click="yytkClose"></view>
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
				imgUrl: getApp().globalData.imgUrl,
				topIndex: 0,
				cityname: '',
				successState: true,
				failState: true,
				lists: [],
				dtDetaile: {},
				sitename: '',
				zxList: [],
				lat: '', //点击列表预约获取导航数据
				lng: '', //点击列表预约获取导航数据
				dhname: '', //点击列表预约获取导航数据
				address: '', //点击列表预约获取导航数据
				banners: [],
				carId: '',
				carInfo: {}, //车辆状态
				dwqz: '', //当前为止
				lastinfo: null,
				gglist: [],
				weather: '',

			}
		},
		methods: {
			// 点击切换
			menuClick(e) {
				this.topIndex = e.target.dataset.num;
			},
			// 底部切换
			tabClick(e) {
				if (e.currentTarget.dataset.index == 0) {
					uni.redirectTo({
						url: '../index/index'
					})
				} else if (e.currentTarget.dataset.index == 1) {
					uni.redirectTo({
						url: '../server/server'
					})
				} else if (e.currentTarget.dataset.index == 2) {
					uni.redirectTo({
						url: '../my/my'
					})
				}
			},
			gomapSite() {
				uni.navigateTo({
					url: '../mapSite/mapSite'
				})
			},
			gosystemInfo() {
				uni.navigateTo({
					url: '../systemInfo/systemInfo'
				})
			},
			goFaultInfo() {
				uni.navigateTo({
					url: '../faultInfo/faultInfo'
				})
			},
			goMycell() {
				uni.navigateTo({
					url: '../cell/cell'
				})
			},
			gozxList() {
				uni.navigateTo({
					url: '../newsList/newsList'
				});
			},
			goItemDetaile(e) {
				var id = e.currentTarget.dataset.id
				uni.navigateTo({
					url: '../../pages/itemDetaile/itemDetaile?id=' + id,
				});
			},
			// 轮播
			getBanners() {
				this.$http.sendRequest('/appsysmgs/banner/list', 'POST').then(res => {
					if (res.data.code == 200) {
						if (res.data.data.length != 0) {
							this.banners = res.data.data;
						}
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
			Rad(d) { //根据经纬度判断距离
				return d * Math.PI / 180.0;
			},
			getDistance(lat1, lng1, lat2, lng2) {
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

			getfjlist(latitude, longitude) {
				var hxzbd = util.transformFromGCJToBaidu(latitude, longitude);
				this.$http.sendRequest('/appsite/fjlist', 'POST', {
					city: '',
					name: '',
					jd: hxzbd.longitude,
					wd: hxzbd.latitude,
					pageNum: 1,
					pageSize: 3
				}).then(res => {
					var distance = 0;
					if (res.data.code == 200) {
						var contentlist = res.data.data.rows
						if (contentlist.length != 0) {
							for (var i = 0; i < contentlist.length; i++) {
								distance = this.getDistance(latitude, longitude,
									contentlist[i].zy, contentlist[i].zx);
								contentlist[i].distance = distance;
							}
						}
						this.lists = contentlist;
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
			// 跳转到内容页
			goDetaile(e) {
				var id = e.currentTarget.dataset.id
				uni.navigateTo({
					url: '../../pages/detaile/detaile?id=' + id + '&jl=' + e.currentTarget.dataset.jl,
				});
			},
			// 预约弹框关闭
			yytkClose(e) {
				if (e.currentTarget.dataset.sta == 0) {
					this.successState = true
				} else if (e.currentTarget.dataset.sta == 1) {
					this.failState = true
				}
			},
			//点击消除异常
			goxyFun(e) {
				this.showState = true;
				this.failState = true
				uni.navigateTo({
					url: '../../pages/fjwd/fjwd'
				})
			},
			// 打电话
			callTel(e) {
				var phone = e.currentTarget.dataset.tel;
				if (phone != '') {
					uni.makePhoneCall({
						phoneNumber: phone,
					})
				}
			},
			// 跳转到导航
			goDh(e) {
				this.successState = true;
				var bdzhx = util.transformFromBaiduToGCJ(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
				uni.openLocation({
					latitude: bdzhx.latitude, //维度
					longitude: bdzhx.longitude, //经度
					name: e.currentTarget.dataset.name, //目的地定位名称
					scale: 15, //缩放比例
					address: e.currentTarget.dataset.address //导航详细地址
				});
			},
			// 列表预约
			lbyyFun(e) {
				//预约接口
				this.yyreserv(e.currentTarget.dataset.id);
				this.lat = e.currentTarget.dataset.lat;
				this.lng = e.currentTarget.dataset.lng;
				this.dhname = e.currentTarget.dataset.dhname;
				this.address = e.currentTarget.dataset.address;
			},
			// 认证判断
			approveFun() {

			},
			yyreserv(id) {
				console.log('1111', id);
				var that = this
				this.$http.sendRequest('/appreserv/create', 'POST', {
					siteId: id,
				}).then(res => {
					console.log('res111', res);
					// const value = uni.getStorageSync("vin");
					if (res.data.code == 200) {
						if (res.data.msg == "操作成功") {
							that.successState = false
							that.failState = true
						} else {
							that.successState = true
							that.failState = false
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
							duration: 3000
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: "网络错误",
					})
				})
			},
			getzxList() {
				this.$http.sendRequest('/news/platformlist', 'POST', {
					pageNum: this.currentPage,
					pageSize: 5
				}).then(res => {
					if (res.data.code == 200) {
						if (res.data.data.length != 0) {
							res.data.data.forEach((item) => {
								item.createTime = item.createTime.split(" ")[0]
							})
						}
						this.zxList = res.data.data
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
			//获取车辆电池信息 
			getCarinfo(id) {
				this.$http.sendRequest('/appcar/carinfo', 'GET', {
					carId: id
				}).then(res => {
					if (res.data.code == 200) {
						this.carInfo = res.data.data;
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
							that.dwqz = res.result.address;
							that.city = res.result.address_component.city.replace("市", "");
							that.getWeather();
						}
					}
				})
			},
			// 获取天气
			getWeather() {
				var that = this;
				uni.request({
					url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + that.city,
					data: {},
					success: (res) => {
						that.weather = that.city + ' ' + res.data.data.forecast[0].type + ' ' + res.data.data
							.forecast[0].low.split(" ")[1] + '/' + res.data.data.forecast[0].high.split(" ")[
							1];
					}
				})
			},
			//查询最近换电记录
			getlastRecord() {
				this.$http.sendRequest('/apporder/latest', 'POST').then(res => {
					if (res.data.code == 200) {
						if (res.data.data != null) {
							this.lastinfo = res.data.data;
							if (res.data.data.useTime != null) {
								let minutes = Math.floor((res.data.data.useTime % (1000 * 60 * 60)) / (1000 * 60));
								this.lastinfo.useTime = minutes;
							}
						}
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
			var that = this;
			//获取当时位置
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					var list = [];
					that.currentPage = 1;
					that.GetNowCityInfo(res) //获取城市信息
					that.getfjlist(res.latitude, res.longitude);
				}
			});
			if (uni.getStorageSync('token') == '') {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			} else {
				this.getBanners();
				this.getzxList();
				this.getCarinfo(uni.getStorageSync('carId'));
				this.getlastRecord();
				this.getggList();
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 98rpx;
	}

	.content {
		width: 100%;
		overflow-y: scroll;
	}

	.top {
		position: fixed;
		top: 0;
		z-index: 3;
		width: 100%;
	}

	.topcon {
		padding: 0 24rpx;
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background: #fff;
		box-sizing: border-box;
	}

	.tople {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #333;
	}

	.topimg {
		display: flex;
		align-items: center;
		height: 88rpx;
	}

	.topimg image {
		margin-right: 10rpx;
		width: 41rpx;
		height: 41rpx;
	}

	.swiper {
		margin-top: 88rpx;
		width: 100%;
		height: 300rpx;
		background: #fff;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	swiper-item {
		border-radius: 20rpx;
	}

	.swiper-item {
		width: 100%;
		height: 300rpx;
		overflow: hidden;
		border-radius: 20rpx;
	}

	.swiper-item image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.tc {
		padding: 0 24rpx;
		display: flex;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 26rpx;
		color: #000000;
		background: #fff;
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.icon-a-lujing471 {
		margin-right: 10rpx;
		font-size: 28rpx;
		color: #01972C;
	}

	.zdtop {
		display: flex;
		justify-content: space-between;
		padding: 0 24rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: #fff;
	}

	.zdtople {
		font-size: 34rpx;
		color: #333;
		font-weight: bold;
	}

	.zdtopri {
		font-size: 26rpx;
		color: #666;
	}

	.zdtopri .iconfont {
		margin-left: 6rpx;
		font-size: 22rpx;
		color: #666;
	}

	.dtcon {
		padding: 0 24rpx;
	}

	.li {
		position: relative;
		display: flex;
		padding: 30rpx 24rpx;
		margin-top: 20rpx;
		background: #fff;
		border-radius: 20rpx;
	}

	.li:last-child {
		margin-bottom: 0;
	}

	.limb {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.lile {
		width: 522rpx;
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
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lihdz {
		margin-bottom: 28rpx;
		height: 34rpx;
		line-height: 34rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.icon-a-lujing425 {
		margin-right: 6rpx;
		font-size: 26rpx;
		color: #666666;
	}

	.lidc {
		height: 60rpx;
		line-height: 60rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #333;
	}

	.lidc text {
		margin-left: 10rpx;
		font-size: 38rpx;
		color: #FF1D1D;
	}

	.liri {
		position: absolute;
		right: 24rpx;
		z-index: 2;
		width: 180rpx;
	}

	.lidh {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.lidh .iconfont {
		font-size: 26rpx;
		color: #999;
		text-align: right;
	}

	.icon-a-lujing426 {
		margin-right: 20rpx;
		padding-right: 20rpx;
		border-right: 2rpx solid #F4F4F3;
	}

	.liri .jl {
		margin-bottom: 28rpx;
		height: 34rpx;
		line-height: 34rpx;
		text-align: right;
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

	.yybtnho {
		background: #F4F4F3;
	}

	.yytk {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
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

	/* 车辆状态 */
	.clzt {
		margin: 20rpx 0;
		padding: 20rpx 24rpx;
		background: #fff;
	}

	.tit {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 34rpx;
		color: #333;
		font-weight: bold;
	}

	.ztxx {
		margin: 30rpx 0;
		display: flex;
		justify-content: space-between;
	}

	.ztxxle {
		display: flex;
		width: 500rpx;
	}

	.ztxxle image {
		margin-top: 11rpx;
		margin-right: 10rpx;
		width: 33rpx;
		height: 44rpx;
	}

	.ztwz {
		width: 460rpx;
		height: 36rpx;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #333333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.ztsj {
		width: 460rpx;
		height: 32rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: #999999;
		overflow: hidden;
	}

	.ztxxri {
		height: 68rpx;
		line-height: 68rpx;
		font-size: 22rpx;
		color: #999999;
	}

	.ztxxri .iconfont {
		margin-left: 6rpx;
		font-size: 16rpx;
		color: #999999;
	}

	.ztList {
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		white-space: nowrap;
	}

	.ztitem {
		display: inline-block;
		margin-left: 10rpx;
		width: 200rpx;
		height: 100rpx;
		background: linear-gradient(90deg, #E8F3FF 0%, #F6FCFF 100%);
		border-radius: 10rpx;
	}

	.ztitem:first-child {
		margin-left: 0;
	}

	.ztitemcon {
		padding: 18rpx 20rpx;
		position: relative;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.ztItle {
		display: flex;
		flex-direction: column;
	}

	.ztItle text:first-child {
		height: 32rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: #7D8DAA;
	}

	.ztItle text:last-child {
		height: 36rpx;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #212D43;
	}

	.ztItri {
		display: flex;
		align-items: center;
		font-size: 16rpx;
		color: #333;
	}

	.ztitem image {
		position: absolute;
		right: 20rpx;
		bottom: 0;
		width: 91rpx;
		height: 59rpx;
	}

	/* 换电数据 */
	.hdtop {
		display: flex;
		justify-content: space-between;
		line-height: 60rpx;
	}

	.hdtopri text {
		font-size: 26rpx;
		color: #999;
	}

	.hdtopri text:first-child {
		/* margin-right: 40rpx; */
	}

	.hdtopriho {
		color: #333 !important;
		font-weight: bold;
	}

	.hdcon {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
		padding: 30rpx 20rpx;
		background: #FAFCFF;
		border-radius: 10rpx;
	}

	.hdconho {
		justify-content: center;
		font-size: 30rpx;
		color: #666;
	}

	.hdwz {
		display: flex;
		flex-direction: column;
		width: 210rpx;
		overflow: hidden;
	}

	.hdwz view:first-child {
		margin-bottom: 20rpx;
		height: 32rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: #333333;
	}

	.hdwz view:last-child {
		width: 210rpx;
		height: 36rpx;
		font-size: 26rpx;
		font-weight: bold;
		line-height: 36rpx;
		color: #333333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.hddata {
		display: flex;
		flex-wrap: wrap;
		width: 370rpx;
	}

	.hditem {
		width: 185rpx;
		height: 32rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: #999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.hditem:nth-child(1),
	.hditem:nth-child(2) {
		margin-bottom: 20rpx;
	}

	.hditem:nth-child(1),
	.hditem:nth-child(3) {
		width: 215rpx;
	}

	.hditem:nth-child(2),
	.hditem:nth-child(4) {
		width: 155rpx;
	}

	.hditem:nth-child(1) text {
		color: #333333;
	}

	.hditem:nth-child(2) text {
		color: #F34848;
	}

	.hditem:nth-child(3) text {
		color: #333333;
	}

	.hdri .iconfont {
		font-size: 16rpx;
		color: #999;
	}

	/* 资讯 */
	.zx {
		margin: 20rpx 0;
		padding: 24rpx;
		background: #fff;
	}

	.zxtit {
		padding: 0;
		margin-bottom: 20rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.zxli {
		margin-bottom: 40rpx;
		display: flex;
	}

	.zxli:last-child {
		margin-bottom: 0;
	}

	.zxImg {
		width: 200rpx;
		height: 200rpx;
		overflow: hidden;
	}

	.zxImg image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.zxRi {
		margin-left: 20rpx;
		width: 482rpx;
	}

	.zxlitit {
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		height: 42rpx;
		line-height: 42rpx;
		font-size: 30rpx;
		color: #000;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.zxlidesc {
		margin-bottom: 16rpx;
		height: 80rpx;
		font-size: 26rpx;
		line-height: 44rpx;
		color: #666666;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.zxlibot {
		display: flex;
		justify-content: flex-end;
	}

	.zxname {
		width: 55%;
		height: 32rpx;
		font-size: 22rpx;
		color: #999;
		overflow: hidden;
	}

	.zxtime {
		width: 40%;
		height: 32rpx;
		font-size: 22rpx;
		color: #999;
		overflow: hidden;
		text-align: right;
	}
</style>
