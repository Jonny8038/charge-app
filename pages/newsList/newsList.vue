<template>
	<view class="container">
		<view class="lbnr zxlist">
			<scroll-view scroll-y="true" :style="{height:'calc(100vh)'}" @scrolltoupper="upper" @scrolltolower="lower">
					<block v-for="(item,index) in lists" :key="index">
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
				<view class="loading" :hidden="!loadAll">已加载全部</view>
				<view class="loading1" :hidden="!nodata" :style="{height:'calc(100vh)'}">
					<view class="wsjcon">
						<image :src='imgUrl+"xx.png"' />
						<text>暂无数据</text>
					</view>
				</view>
			</scroll-view>
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
				bootomTop: '',
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
			getzxList() {
				uni.showLoading({
					title: '数据加载中。。。',
				});
				this.$http.sendRequest('/news/platformlist', 'POST', {
					pageNum: this.currentPage,
					pageSize: this.pageSize
				}).then(res => {
					uni.hideLoading();
					var contentlistTem = this.lists;
					if (res.data.code == 200) {
						if (this.currentPage == 1) {
							contentlistTem = []
						}
						console.log(res.data.data);
						var contentlist = res.data.data
						if (contentlist.length != 0) {
							if (res.data.data.length != 0) {
								res.data.data.forEach((item) => {
									item.createTime = item.createTime.split(" ")[0]
								})
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
					uni.showToast({
						icon: 'none',
						title: "网络错误",
					})
				})
			},
		
			upper: function(e) {
				this.currentPage = 1
				this.getzxList()
			},
			/**页面上拉触底事件的处理函数*/
			lower: function() {
				if (this.hasMoreData) {
					this.getzxList()
					this.loadAll = false
				} else {
					this.loadAll = true
					uni.showToast({
						icon: 'none',
						title: '没有更多数据',
					})
				}
			},
			goItemDetaile(e) {
				var id = e.currentTarget.dataset.id
				uni.navigateTo({
					url: '../../pages/itemDetaile/itemDetaile?id=' + id,
				});
			},
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getzxList();
				var ss = 80 + getApp().globalData.bootomTop * 2;
				this.bootomTop = ss + "rpx";
			}
		}
	}
</script>

<style>
	.container{
		
	}
	.zxlist{
		width: 100%;
	}
	
	.zxli {
		padding: 20rpx;
		margin-top: 20rpx;
		display: flex;
		background: #fff;
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
