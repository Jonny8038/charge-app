<template>
	<view class="container">
		<view class="content">
			<scroll-view scroll-y="true" :style="{height:'calc(100vh)'}" @scrolltoupper="upper" @scrolltolower="lower">
				<block v-for="(item,index) in lists" :key="index">
					<view class="list">
						<view class="month">{{item.yearMonths}}</view>
						<view class="jydata">
							<block v-for="(itennr,index) in item.arr" :key="index">
							<view class="item">
								<view class="itemle" v-if="itennr.payType">
									<text>余额充值</text>
									<text v-if="itennr.payType==0">充值方式：小程序支付</text>
									<text v-if="itennr.payType==1">充值方式：微信支付</text>
									<text v-if="itennr.payType==3">充值方式：支付宝支付</text>
									<text v-if="itennr.payType==4">充值方式：余额支付</text>
								</view>
								<view class="itemle" v-else>
									<text>余额充值</text>
									<text>充值方式：无</text>
								</view>
								<view class="itemri">
									<text class="addMoney" v-if="itennr.type==2">+{{itennr.payPrice/100}}</text>
									<text class="addMoney" v-if="itennr.type==1">-{{itennr.payPrice/100}}</text>
									<text>{{itennr.createTime}}</text>
								</view>
							</view>
							</block>
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
	export default {
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				currentPage: 1, // 当前第1页
				pageSize: 10, //每页显示多少数据 
				hasMoreData: true,
				loadAll: false,
				nodata: false,
				lists: [],
			}
		},

		methods: {
			dataHandle(data) {
				var that = this;
				let newArr = []
				let n = 0
				let yearMonths = ''
				let timeHandle = data[0].createTime.split('-')
				yearMonths = timeHandle[0] + '年' + timeHandle[1] + '月'
				newArr.push({
					yearMonths: yearMonths,
					arr: [data[0]]
				})
				//然后循环剩下的数据，从1开始（即第二个数据开始，第一个数据已经处理过），
				for (let i = 1; i < data.length; i++) {
					let current = data[i].createTime.split('-') //处理当前的数据
					let before = data[i - 1].createTime.split('-') //处理当前项的前一项数据	
					yearMonths = current[0] + '年' + current[1] + '月' //当前项的年月

					//当前项中的年月与前一项的年月进行比较
					if (current[0] === before[0] && current[1] === before[1]) {
						//都相等则表示该数据为同一年同一月份，然后将当前项处理好的数据添加的newArr中n项中arr月份数据中
						newArr[n].arr.push(data[i])
					} else {
						n++
						newArr.push({
							yearMonths: yearMonths,
							arr: [data[i]]
						})
					}
				}
				that.lists = newArr
				console.log('312312', that.lists);
			},
			getList: function() {
				var that = this;
				uni.showLoading({
					title: '数据加载中。。。',
				});
				this.$http.sendRequest('/apporder/tradeorder/list', 'POST', {
					pageNum: this.currentPage,
					pageSize: this.pageSize
				}).then(res => {
					uni.hideLoading();
					var contentlistTem = this.lists;
					if (res.data.code == 200) {
						if (this.currentPage == 1) {
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
						if(that.lists.length!=0){
							that.dataHandle(that.lists);
						}
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
				this.getList()
			},
			/**页面上拉触底事件的处理函数*/
			lower: function() {
				if (this.hasMoreData) {
					this.getList()
					this.loadAll = false
				} else {
					this.loadAll = true
					uni.showToast({
						icon: 'none',
						title: '没有更多数据',
					})
				}
			},
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getList();
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: auto;
		overflow-y: scroll;
	}

	.month {
		padding: 0 24rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 22rpx;
		color: #666666;
	}

	.jydata {
		padding: 0 24rpx;
		background: #fff;
	}

	.item {
		padding: 30rpx 0;
		display: flex;
		justify-content: space-between;
		border-bottom: 2rpx solid #F4F4F3;
	}

	.item:last-child {
		border-bottom: 0;
	}

	.itemle {
		display: flex;
		flex-direction: column;
	}

	.itemri {
		display: flex;
		flex-direction: column;
	}

	.item text {
		height: 40rpx;
		line-height: 40rpx;
	}

	.itemle text:first-child {
		margin-bottom: 10rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.itemle text:last-child {
		font-size: 22rpx;
		color: #999999;
	}

	.itemri text {
		text-align: right;
	}

	.itemri text:first-child {
		margin-bottom: 10rpx;
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
	}

	.itemri text:last-child {
		font-size: 22rpx;
		color: #999999;
	}

	.addMoney {
		color: #FD6361 !important;
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
