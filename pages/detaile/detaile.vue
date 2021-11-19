<template>
	<view class="cc">
		<view class="ComBox">
			<view id="scrollTop">
				<view class="banner">
					<image :src="detailes.banner?detailes.banner:imgUrl+'banner.png'"></image>
				</view>
				<view class="nrtop">
					<view class="tople font26 color3" v-if="detailes.zx&&detailes.zy" :data-lng="detailes.zx" :data-lat="detailes.zy" :data-name="detailes.name"
						:data-address="detailes.address" @click="goDh"><text class="iconfont icon-a-zujian93"></text>{{detailes.name}}
					</view>
					<view class="tophx"></view>
					<view class="topri font26 color3 fontwe">{{jl}}</view>
				</view>
			</view>
			<view class="istab" id="istab1">
				<view class="item" :class="index==1?'somitem':''" @click="Change(1)">电站详情<text></text></view>
				<view class="item" :class="index==2?'somitem':''" @click="Change(2)">站内资讯<text></text></view>
			</view>
			<view class="son1 dl" id="son01">
				<view class="dccon">
					<view class="dltop">
						<view class="dlle font26 color3 fontwe">电池充电情况</view>
						<view class="dlri font30 color9">电池<text v-if="dcList.length>0">{{dcList.length}}</text>
							<text v-else>0</text>
						</view>
					</view>
					<view class="dlcon">
						<block v-if="dcList.length>0" v-for="(item,index) in dcList" :key="index">
							<view v-if="item.yctype==0&&item.power&&item.power==100" class="dlli">
								<view class="dlnum font26 colorf">
									<text>{{index+1}}</text>
									<view class="dlbg dlbg1" style="height:100%"></view>
								</view>
								<view class="dlnr">
									<text class="dlsta font26 color3 fontwe">可换</text>
									<text class="dldata">电量{{item.power}}%</text>
								</view>
							</view>
							<view v-if="item.yctype==0&&item.power&&item.power<100" class="dlli">
								<view class="dlnum font26 colorf">
									<text>{{index+1}}</text>
									<view class="dlbg dlbg2" style="height:100%"></view>
								</view>
								<view class="dlnr">
									<text class="dlsta font26 color3 fontwe">不可换</text>
									<text class="dldata">电量{{item.power}}%</text>
								</view>
							</view>
							<view v-if="item.yctype==1||!item.power" class="dlli">
								<view class="dlnum font26 colorf">
									<text>{{index+1}}</text>
								</view>
								<view class="dlnr dlnr1">
									<text class="dlsta font26 color9 fontwe">维修中</text>
									<text class="dldata">故障</text>
								</view>
							</view>
						<!-- 	<view v-if="item.istype==3" class="dlli">
								<view class="dlnum font26 colorf">
									<text>{{index+1}}</text>
								</view>
								<view class="dlnr dlnr1">
									<text class="dlsta font26 color9 fontwe">不可换</text>
									<text class="dldata">已下线</text>
								</view>
							</view> -->
						</block>
						<view class="font30 color6" v-if="dcList.length==0" style="text-align: center;width: 100%;">
							暂无电池</view>
					</view>
				</view>
			</view>
			<view class="son2 zx" id="son02">
				<view class="zxtit">站内资讯</view>
				<view class="zxlist">
					<block v-if="zxList.length>0" v-for="(item,index) in zxList" :key="index">
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
					<view v-else style="font-size:30rpx;color:#666;text-align: center;">暂无数据</view>
				</view>
			</view>
		</view>
		<view class="dlbot">
			<view class="dlbotcon">
				<view class="dlbtn lxbtn" :data-tel="detailes.phone" @click="call">
					<text class="iconfont icon-a-lujing426"></text>
					联系站点
				</view>
				<view class="dlbtn yybtn" v-if="detailes.istype==1" :data-id="detailes.id" @click="yyFun">
					<text class="iconfont icon-a-zu6401"></text>
					立即预约
				</view>
				<view class="dlbtn yybtn" v-if="detailes.istype==2" :class="detailes.istype==2?'yybtnho':''"></text>
					立即预约
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
						<view class="tip4 font30 color6" :data-lng="detailes.zx"
							:data-lat="detailes.zy" :data-name="detailes.name" :data-address="detailes.address"
							@click="goDh">去换电</view>
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
	import util from '../../utils/WSCoordinate.js'
	export default {
		data() {
			return {
				imgUrl:getApp().globalData.imgUrl,
				index: 1,
				index1: 0, //tab的高度
				index2: 0, //第二个子元素的top
				IsShow: true, //用来阻止滚动产生的bug
				topIndex: 0,
				detailes: '',
				jl: '',
				dcList: [],
				zxList: [],
				successState: true,
				failState: true,
			};
		},
		methods: {
			// 跳转到导航
			goDh: function(e) {
				this.successState=true;
				var bdzhx = util.transformFromBaiduToGCJ(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
				uni.openLocation({
					latitude: bdzhx.latitude, //维度
					longitude: bdzhx.longitude, //经度
					name: e.currentTarget.dataset.name, //目的地定位名称
					scale: 15, //缩放比例
					address: e.currentTarget.dataset.address //导航详细地址
				});
			},
			call: function(e) {
				var phone = e.currentTarget.dataset.tel;
				if (phone != '') {
					uni.makePhoneCall({
						phoneNumber: phone,
					})
				}
			},
			// 预约弹框关闭
			yytkClose: function(e) {
				console.log(e.currentTarget.dataset.sta);
				if (e.currentTarget.dataset.sta == 0) {
					this.successState = true
				} else if (e.currentTarget.dataset.sta == 1) {
					this.failState = true
				}
			},
			goItemDetaile(e) {
				var id = e.currentTarget.dataset.id
				uni.navigateTo({
					url: '../../pages/itemDetaile/itemDetaile?id=' + id,
				});
			},
			getdetails: function(id) {
				this.$http.sendRequest('/appsite/sitedetails', 'POST', {
					sid: id
				}).then(res => {
					if (res.data.code == 200) {
						this.detailes = res.data.data
						this.dcList = res.data.siztdata
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
			getzxList: function(id) {
				this.$http.sendRequest('/news/site/list', 'POST', {
					siteId: id
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
			dttkClose: function(e) {
				if (e.currentTarget.dataset.sta == 0) {
					this.successState = true
				} else if (e.currentTarget.dataset.sta == 1) {
					this.failState = true
				} else if (e.currentTarget.dataset.sta == 2) {
					this.failState = true
					uni.navigateTo({
						url: '../../pages/fjwd/fjwd'
					})
				}

			},
			//点击消除异常
			goxyFun: function(e) {
				this.showState = true;
				this.failState = true
				uni.navigateTo({
					url: '../../pages/fjwd/fjwd'
				})
			},
			yyFun: function(e) {
				this.yyreserv(e.currentTarget.dataset.id);
			},
			yyreserv(id) {
				var that = this
				this.$http.sendRequest('/appreserv/create', 'POST', {
					siteId: id,
				}).then(res => {
					if (res.data.code == 200) {
						if(res.data.msg=="操作成功"){
							that.successState = false
							that.failState = true
						}else{
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
			// 点击切换
			Change(index) {
				this.index = index
				this.IsShow = false //在点击事件中  页面滚动依然会触发滚动事件  因而用这个值进行限制
				if (index == 1) {
					uni.pageScrollTo({ //页面滚动行为
						scrollTop: this.index1,
						duration: 300
					});
					setTimeout(() => {
						this.IsShow = true
					}, 300) //时间同页面滚动行为时间一样
				} else if (index == 2) {
					uni.pageScrollTo({
						scrollTop: this.index2,
						duration: 300
					});
					setTimeout(() => {
						this.IsShow = true
					}, 300)
				} else {
					let top = res[0].height
					uni.pageScrollTo({
						scrollTop: top,
						duration: 300
					});
					setTimeout(() => {
						this.IsShow = true
					}, 300)
				}
			},
			getDefault() {
				const query = uni.createSelectorQuery()
				query.select('#istab1').boundingClientRect() //获取要操作的元素
				query.select('#son01').boundingClientRect()
				query.select('#son02').boundingClientRect()
				query.exec((res) => {
					this.index1 = res[0].top
					this.index2 = res[2].top + res[0].height + 1
				})
			},
			getTop(index) {
				const query = uni.createSelectorQuery()
				query.select('#istab1').boundingClientRect()
				query.select('#son01').boundingClientRect()
				query.select('#son02').boundingClientRect()
				query.exec((res) => {
					if (res[0].top == 0 && res[1].top <= res[0].height && res[1].bottom >= res[0].height) { //判断 
						this.index = 1
					} else if (res[0].top == 0 && res[1].bottom <= res[0].height && res[2].bottom >= res[0]
						.height) {
						this.index = 2
					} else {
						this.index = 1
					}
				})
			}
		},
		onPageScroll(e) {
			this.IsShow ? this.getTop() : ''
		},
		onLoad(options) {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getDefault() //获取初始化的位置高度
				this.getdetails(options.id);
				this.getzxList(options.id);
				this.jl = options.jl
			}
		}
	};
</script>

<style>
	.container{
		
	}
	.ComBox {
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
		height: auto;
		position: relative;
	}

	.box {
		height: 200rpx;
		background: #f7f7f7;
		border: 1rpx solid skyblue;
		box-sizing: border-box;
		text-align: center;
		line-height: 200rpx;
	}

	.lbtop {
		/* position: fixed; */
		width: 100%;
		box-sizing: border-box;
		display: flex;
		padding: 0 24rpx;
		height: 100rpx;
		line-height: 100rpx;
		position: -webkit-sticky;
		position: sticky;
		top: var(--window-top);
		// top: 0; // 这个试了也可以达到吸顶效果
		z-index: 111;
		background: #F4F4F3;
	}

	.istab {
		width: 100%;
		padding: 0 24rpx;
		height: 100rpx;
		line-height: 100rpx;
		position: sticky !important;
		text-align: center;
		z-index: 999;
		top: 0;
		display: flex;
		background: #F4F4F3;
		box-sizing: border-box;
	}

	.item {
		position: relative;
		width: 120rpx;
		font-size: 30rpx;
		color: #333;
		text-align: center;
	}

	.item:first-child {
		margin-right: 40rpx;
	}

	.item text {
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 120rpx;
		height: 4rpx;
		background: #fff;
	}

	.somitem {
		font-weight: bold;
		color: #000;
	}

	.somitem text {
		background: #000;
	}


	.banner {
		width: 100%;
		height: 360rpx;
	}

	.banner image {
		width: 100%;
		height: 100%;
	}

	.nrtop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
		height: 156rpx;
		line-height: 156rpx;
		background: #fff;
	}

	.tople {
		display: flex;
		width: 534rpx;
		padding-right: 10rpx;
		height: 156rpx;
		overflow: hidden;
	}

	.icon-a-zujian93 {
		margin-right: 10rpx;
		font-size: 30rpx;
		color: #666;
	}

	.tophx {
		width: 2rpx;
		height: 75rpx;
		background: #F4F4F3;
	}

	.topri {
		width: 150rpx;
		text-align: right;
		height: 156rpx;
		overflow: hidden;
	}

	.dl {
		margin: 0 auto;
		padding: 0 22rpx;
		padding-top: 40rpx;
		background: #fff;
	}

	.dccon {
		padding-bottom: 40rpx;
		width: 702rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		background: #FAFCFF;
	}

	.dltop {
		padding: 0 22rpx;
		display: flex;
		justify-content: space-between;
		height: 110rpx;
		line-height: 110rpx;
		border-bottom: 2rpx solid #F2F5F8;
	}

	.dlri text {
		margin-left: 10rpx;
		font-size: 38rpx;
		color: #FF1D1D;
	}

	.dlcon {
		display: flex;
		flex-wrap: wrap;
		max-height: 250rpx;
		overflow-y: scroll;
	}

	.dlli {
		display: flex;
		margin-top: 40rpx;
		margin-right: 20rpx;
	}

	.dlli:nth-child(4n+4) {
		margin-right: 0;
	}

	.dlnum {
		position: relative;
		display: flex;
		align-items: flex-end;
		margin-top: 12rpx;
		width: 34rpx;
		height: 73rpx;
		line-height: 73rpx;
		text-align: center;
		background: #EAEAEA;
		border-radius: 10rpx 0px 0px 10rpx;
	}

	.dlnum text {
		width: 100%;
		z-index: 3;
	}

	.dlbg {
		position: absolute;
		z-index: 1;
		bottom: 0;
		width: 100%;
	}

	.dlbg1 {
		background: linear-gradient(180deg, #29BD5F 0%, #14AC4B 100%);
		border-radius: 10rpx 0 0 10rpx;
	}

	.dlbg2 {
		background: #212D43;
		border-radius: 10rpx 0 0 10rpx;
	}

	.dlnr {
		display: flex;
		flex-direction: column;
		width: 114rpx;
		height: 85rpx;
		padding-top: 8rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border: 2rpx solid #212D43;
		border-radius: 10rpx;
		border-bottom-left-radius: 0;
		text-align: center;
	}

	.dldata {
		font-size: 22rpx;
		color: #3E3E3E;
	}

	.dlnr1 {
		background: #F4F4F3;
		border: 0;
	}

	.dlnr1 .dldata {
		color: #999;
	}

	.dlbot {
		position: fixed;
		bottom: 0;
		padding: 20rpx 24rpx;
		width: 100%;
		background: #fff;
		box-sizing: border-box;		
	}

	.dlbotcon {
		display: flex;
		justify-content: space-between;
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
		
	}

	.dlbtn {
		width: 260rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 100rpx;
		text-align: center;
	}

	.lxbtn {
		font-size: 30rpx;
		color: #474747;
		border: 2rpx solid #999999;
	}

	.yybtn {
		font-size: 30rpx;
		color: #fff;
		background: #29BD5F;
	}
	.yybtnho{
		background: #F4F4F3;
	}

	.dlbtn .iconfont {
		margin-right: 10rpx;
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
	.tip4{
		margin: 0 auto;
		margin-top: 40rpx;
		width: 400rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: #fff;
		background: #212D43;
		border-radius: 10rpx;
	}

	/* 资讯 */
	.zx {
		margin: 20rpx 0;
		padding: 24rpx;
		padding-bottom: 100rpx;
		background: #fff;
	}

	.zxtit {
		margin-bottom: 34rpx;
		height: 42rpx;
		line-height: 42rpx;
		font-size: 30rpx;
		color: #000000;
		font-weight: bold;
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
		justify-content: space-between;
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
