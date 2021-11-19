<template>
	<view class="container">
		<view class="content">
			<view class="lbtop">
				<view :class="topIndex==1?'lbtopho':''" class="lbtopItem" data-num="1" @click="menuClick">
					成功订单
					<text></text>
				</view>
				<view :class="topIndex==2?'lbtopho':''" class="lbtopItem" data-num="2" @click="menuClick">
					失败订单
					<text></text>
				</view>
			</view>
			<view class="lb">
				<scroll-view scroll-y="true" :style="{height:'calc(100vh - '+ bootomTop+')'}" @scrolltoupper="upper"
					@scrolltolower="lower">
					<block v-for="(item,index) in lists" :key="index">
						<view class="li">
							<view class="litop">
								<view class="litople">
									<text>换电车辆：{{item.carNo}}</text>
									<text>时间：{{item.createTime}}</text>
								</view>
								<view class="litopri" v-if="item.status==-3">已超时</view>
								<view class="litopri" v-if="item.status==-2">已取消</view>
								<view class="litopri" v-if="item.status==-1">检测异常</view>
								<view class="litopri" v-if="item.status==0">进行中</view>
								<view class="litopri" v-if="item.status==1">已完成</view>
							</view>
							<view class="licon">
								<view class="itemlist">
									<view class="liitem">预约站点：{{item.site.name}}</view>
									<view class="liitem liitemtel">站场电话：{{item.site.phone}}<view class="iconfont icon-a-lujing424" :data-tel="item.site.phone" @click="callTel">
										</view>
									</view>
									<view class="liitem" v-if="item.status==-3">订单状态：已超时</view>
									<view class="liitem" v-if="item.status==-2">订单状态：已取消</view>
									<view class="liitem" v-if="item.status==-1">订单状态：检测异常</view>
									<view class="liitem" v-if="item.status==0">订单状态：进行中</view>
									<view class="liitem" v-if="item.status==1">订单状态：已完成</view>
									<view class="liitem liitempay">支付金额：<text>{{item.price}}元</text></view>
									<view class="liitem">订单编号：{{item.id}}</view>
									<view class="liitem">营业时间：{{item.site.bussTime}}</view>
								</view>
								<view class="lidt" v-if="item.site.zx&&item.site.zy" :data-lng="item.site.zx" :data-lat="item.site.zy" :data-name="item.site.name"
											:data-address="item.site.address" @click="goDh">
									<image :src='imgUrl+"dt.png"'></image>
									<text>{{item.site.address}}</text>
								</view>
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
	import util from '../../utils/WSCoordinate.js'
	export default {
		data() {
			return {
				imgUrl:getApp().globalData.imgUrl,
				bootomTop:'',
				topIndex: 1,
				currentPage: 1, // 当前第1页
				pageSize: 10, //每页显示多少数据 
				hasMoreData: true,
				loadAll: false,
				nodata: false,
				lists: [],
			}
		},
		methods: {	
			// 跳转到导航
			goDh(e) {
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
			// 打电话
			callTel: function(e) {
				console.log('e',e.currentTarget.dataset.tel);
				var phone = e.currentTarget.dataset.tel;
				if (phone != '') {
					console.log('22');
					uni.makePhoneCall({
						phoneNumber: phone,
					})
				}
			},
			// 点击切换
			menuClick: function(e) {
				this.topIndex = e.target.dataset.num;
				this.currentPage = 1;
				this.lists = [];
				this.hdList();
			},
			hdList: function() {
				var that=this;
				uni.showLoading({
					title: '数据加载中。。。',
				});
				this.$http.sendRequest('/apporder/list', 'POST', {
					type: this.topIndex,
					pageNum: this.currentPage,
					pageSize: this.pageSize
				}).then(res => {
					console.log('ress',res.data.data);
					uni.hideLoading();
					var contentlistTem = this.lists
					if (res.data.code == 200) {
						if (that.currentPage == 1) {
							contentlistTem = []
						}
						var contentlist = res.data.data
						
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
				this.hdList()
			},
			lower: function(e) {
				if (this.hasMoreData) {
					this.hdList()
					this.loadAll = false
				} else {
					this.loadAll = true
					uni.showToast({
						icon: 'none',
						title: '没有更多数据',
					})
				}
			}
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				var ss =getApp().globalData.bootomTop*2;
				this.bootomTop= ss + "rpx";
				this.hdList();
			}
		}
	}
</script>

<style>
	.content {
		width: 750rpx;
		overflow-y: scroll;
	}
	
	.lbtop {
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
		padding: 0 24rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: #fff;
	}
	
	.lbtopItem {
		position: relative;
		width: 120rpx;
		font-size: 30rpx;
		color: #666;
		text-align: center;
	}
	
	.lbtopItem text {
		display: block;
		position: absolute;
		bottom: 0;
		left: 30rpx;
		width: 60rpx;
		height: 4rpx;
		background: #fff;
	}
	
	.lbtopho {
		font-weight: bold;
		color: #29BD5F;
	}
	
	.lbtopho text {
		background: #29BD5F;
	}
	
	.lb {
		margin-top: 120rpx
	}

	.li {
		padding-bottom: 30rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		width: 702rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 10rpx;
	}
	
	.litop {
		padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 120rpx;
		color: #000000;
		border-bottom: 2rpx solid #F4F4F3;
	}
	
	.litople {
		display: flex;
		flex-direction: column;
	}
	
	.litople text:first-child {
		margin-bottom: 8rpx;
		height: 42rpx;
		line-height: 42rpx;
		font-size: 30rpx;
		font-weight: bold;
	
	}
	
	.litople text:last-child {
		height: 32rpx;
		line-height: 32rpx;
		font-size: 22rpx;
	}
	
	.litopri {
		padding: 0 13rpx;
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 26rpx;
		text-align: center;
		border: 2rpx solid #333333;
		border-radius: 100rpx;
	}
	
	.litopho {
		color: #fff;
		background: #29BD5F;
		border-radius: 10rpx 10rpx 0px 0px;
	}
	
	.litopho .litopri {
		border: 2rpx solid #fff;
	}
	
	.licon {
		padding: 0 20rpx;
	}
	
	.itemlist {
		margin: 20rpx 0;
	}
	
	.liitem {
		height: 56rpx;
		line-height: 56rpx;
		font-size: 26rpx;
		color: #333;
	}
	
	.liitemtel {
		display: flex;
		justify-content: space-between;
	}
	
	.liitemtel .iconfont {
		color: #212D43;
	}
	.liitempay text{
		color:#FD6361;
	}
	.lidt {
		display: flex;
		padding: 0 20rpx;
		width: 662rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #F4F4F3;
		box-sizing: border-box;
	}
	
	.lidt image {
		margin-right: 20rpx;
		width: 60rpx;
		height: 60rpx;
	}
	
	.lidt text {
		font-size: 26rpx;
		color: #666666;
	}
	
	.libot {
		padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 140rpx;
		line-height: 140rpx;
	}
	
	.litime {
		font-size: 26rpx;
		color: #333;
	}
	
	.litime text {
		color: #FD6361;
	}
	
	.liqx {
		font-size: 26rpx;
		color: #999999;
	}
	
	.liqw {
		width: 146rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #fff;
		text-align: center;
		background: #29BD5F;
		border-radius: 10rpx;
	}
	
	.libot1 {
		display: flex;
		justify-content: flex-end;
	}
	
	.libot2 .litime text {
		color: #999999;
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
