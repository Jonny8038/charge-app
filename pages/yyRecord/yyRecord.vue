<template>
	<view class="container">
		<view class="content">
			<view class="lbtop">
				<view :class="topIndex==1?'lbtopho':''" class="lbtopItem" data-num="1" @click="menuClick">
					预约成功
					<text></text>
				</view>
				<view :class="topIndex==2?'lbtopho':''" class="lbtopItem" data-num="2" @click="menuClick">
					预约失败
					<text></text>
				</view>
			</view>
			<view class="lb">
				<scroll-view scroll-y="true" :style="{height:'calc(100vh - '+ bootomTop+')'}" @scrolltoupper="upper"
					@scrolltolower="lower">
					<view class="ordertip" v-show="jxsta">您还有一个预约订单未换电，请尽快前往站场换电！</view>
					<block v-for="(item,index) in lists" :key="index">
						<view class="li">
							<view class="litop" :class="item.status==0?'litopho':''">
								<view class="litople">
									<text>预约号：{{item.id}}</text>
									<text>时间：{{item.createTime}}</text>
								</view>
								<view v-if="item.status==-3" class="litopri">订单超时</view>
								<view v-if="item.status==-2" class="litopri">已取消</view>
								<view v-if="item.status==-1" class="litopri">电池异常</view>
								<view v-if="item.status==0" class="litopri">进行中</view>
								<view v-if="item.status==1" class="litopri">已完成</view>
							</view>
							<view class="licon">
								<view class="itemlist">
									<view class="liitem">预约站点：{{item.site.name}}</view>
									<view class="liitem liitemtel">站场电话：{{item.site.phone}}
										<view class="iconfont icon-a-lujing424" :data-tel="item.site.phone"
											@click="callTel">
										</view>
									</view>
									<view class="liitem" v-if="item.site.istype==1">预约状态：预约成功</view>
									<view class="liitem" v-if="item.site.istype==0">预约状态：预约失败</view>
									<view class="liitem" v-if="item.orderId">订单编号：{{item.orderId}}</view>
									<view class="liitem">营业时间：{{item.site.bussTime?item.site.bussTime:'无'}}</view>
								</view>
								<view class="lidt" v-if="item.site.zx&&item.site.zy"
									:data-lng="item.site.zx" :data-lat="item.site.zy" :data-name="item.site.name"
									:data-address="item.site.address" @click="goDh">
									<image :src='imgUrl+"dt.png"'></image>
									<text>{{item.site.address}}</text>
								</view>
							</view>
							<view v-if="item.status==-3" class="libot libot2">
								<view class="litime">剩余时间：<text>{{item.lastTime}}</text></view>
								<view class="liqx" :data-id="item.siteId" @click="yyreserv">再次预约</view>
							</view>
							<view v-if="item.status==-2" class="libot libot2">
								<view class="litime">取消时间：<text>{{item.cancelTime}}</text></view>
								<view class="liqx" :data-id="item.siteId" @click="yyreserv">再次预约</view>
							</view>
							<view v-if="item.status==-1" class="libot libot1">
								<!-- <view class="litime">剩余时间：<text>{{item.lastTime}}</text></view> -->
								<view class="liqx" @click="gofjwd">消除异常</view>
							</view>
							<view v-if="item.status==0" class="libot">
								<view class="litime">剩余时间：<text>{{item.lastTime}}</text></view>
								<view class="liqx" :data-id="item.id" :data-index="index" @click="goqxorder">取消预约</view>
								<view class="liqw" :data-lng="item.site.zx" :data-lat="item.site.zy"
									:data-name="item.site.zname" :data-address="item.site.address" @click="goDh">前往站点
								</view>
							</view>
							<view v-if="item.status==1" class="libot libot1">
								<view class="liqx" :data-id="item.siteId" @click="yyreserv">再次预约</view>
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
				imgUrl: getApp().globalData.imgUrl,
				bootomTop: '',
				topIndex: 1,
				currentPage: 1, // 当前第1页
				pageSize: 10, //每页显示多少数据 
				hasMoreData: true,
				loadAll: false,
				nodata: false,
				lists: [],
				jxsta: false, //是否有进行中的数据
				settime: '0分0秒', //剩余时间
				timer: [], //定时器ID数组
			}
		},
		methods: {
			gofjwd() {
				uni.navigateTo({
					url: '../fjwd/fjwd'
				})
			},
			yyreserv(e) {
				var that = this
				var id = e.currentTarget.dataset.id;
				this.$http.sendRequest('/appreserv/create', 'POST', {
					siteId: id,
				}).then(res => {
					if (res.data.code == 200) {
						if(res.data.msg=="操作成功"){
							uni.showToast({
								title: "预约成功",
								icon: 'success',
								duration: 3000,
								success: function() {
									setTimeout(function() {
										that.currentPage = 1;
										that.topIndex = 1,
											that.yyList()
									}, 3000)
								}
							})
						}else{
							uni.showToast({
								title: "预约失败",
								icon: 'success',
								duration: 3000,
								success: function() {
									setTimeout(function() {
										that.currentPage = 1;
										that.topIndex = 2,
											that.yyList()
									}, 3000)
								}
							})
						}
					}else {
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
			goqxorder(e, index) {
				var that = this;
				var id = e.currentTarget.dataset.id;
				var index = e.currentTarget.dataset.index;
				uni.showModal({
					title: '提示',
					content: '确认取消订单',
					success: function(res) {
						if (res.confirm) {
							that.$http.sendRequest('/appreserv/cancel', 'POST', {
								reserveId: id
							}).then(ress => {
								if (ress.data.code == 200) {
									uni.showToast({
										icon: 'none',
										title: ress.data.msg,
									})
									that.currentPage = 1;
									that.lists = [];
									that.yyList();
									clearInterval(that.timer[index]);
								}else{
									uni.showToast({
										icon: 'none',
										title: ress.data.msg,
									})
								}
							}).catch(err => {
								uni.showToast({
									icon: 'none',
									title: err.data.msg,
								})
							})

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
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
			// 点击切换
			menuClick: function(e) {
				this.topIndex = e.target.dataset.num;
				this.currentPage = 1;
				this.lists = [];
				this.yyList();
			},
			yyList: function() {
				var that = this
				uni.showLoading({
					title: '数据加载中。。。',
				});
				this.$http.sendRequest('/appreserv/list', 'POST', {
					type: this.topIndex,
					pageNum: this.currentPage,
					pageSize: this.pageSize
				}).then(res => {
					var sytime = 0;
					uni.hideLoading();
					var contentlistTem = this.lists
					if (res.data.code == 200) {
						if (this.currentPage == 1) {
							contentlistTem = []
						}
						var contentlist = res.data.data.rows

						if (contentlist.length == 0 && this.currentPage == 1) {
							this.loadAll = false;
							this.nodata = true;
						} else if (contentlist.length == 0 && this.currentPage != 1) {
							this.loadAll = true;
							this.nodata = false;
						} else if (contentlist.length < this.pageSize) {
							contentlist.forEach((item) => {
								if (item.status == 0) { //判断是否有进行中的订单
									that.jxsta = true;
								}
								//新建一个showTime属性,用来做倒数定时器的,表示有效时间:30分钟+创建时间-当前时间
								//createTime是后台字段,时间格式为'2020-09-17 09:40:47',转为时间戳比较好计算
								item.showTime = this.getTime(item.createTime);
							})
							// if (this.topIndex == 1) {
								
							// }else{
							// 	contentlist.forEach((item) => {
							// 		//新建一个showTime属性,用来做倒数定时器的,表示有效时间:30分钟+创建时间-当前时间
							// 		var showTime = this.getTime(item.createTime);
							// 		console.log();
							// 		var time = showTime -= 1000;
							// 		let timeOne = time / 1000;
							// 		timeOne = timeOne - 1;
							// 		let minute = this.checkFigure(parseInt(timeOne / 60));
							// 		let second = this.checkFigure(parseInt(timeOne % 60));
							// 		item.lastTime = `${minute}分${second}秒`;
							// 	})
							// }
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
						if (this.lists.length > 0) {
							this.showTime(); //开始倒计时
							// if(this.topIndex == 1){
								
							// }
						}

					} else {
						uni.hideLoading();
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
				this.yyList()
			},
			lower: function(e) {
				if (this.hasMoreData) {
					this.yyList()
					this.loadAll = false
				} else {
					this.loadAll = true
					uni.showToast({
						icon: 'none',
						title: '没有更多数据',
					})
				}
			},
			/**
			 *你判断如果当前时间 - createTime > 30 就显示0分0秒，否则就显示30分钟 - (当前时间 - createTime) */
			//获取倒数计时的时间差
			getTime(createTime) {
				createTime = Date.parse(new Date(createTime)); //parse方法只能精确到秒,也就是转成时间戳,
				//后面三位数是000,比如本来是124141,精确成了124000
				let timeDate = Date.parse(new Date());
				return createTime + 30 * 60 * 1000 - timeDate;
			},
			//开启定时器
			showTime() {
				let flag = true; //flag用来判断是不是刚开始触发函数,定时器延迟了1s才开始计算倒数的时间,
				//所以用一个flag做开关
				//订单列表,给每一个订单里面加定时器
				for (let i = 0; i < this.lists.length; i++) {
					if (this.lists[i].showTime >= 0) {
						let time;
						if (flag) { //刚开始的时候计算倒计时的时间,类似一个初始化的作用
							time = this.lists[i].showTime -= 1000;
							let timeOne = time / 1000;
							timeOne = timeOne - 1;
							if (timeOne > 0) {
								let minute = this.checkFigure(parseInt(timeOne / 60));
								let second = this.checkFigure(parseInt(timeOne % 60));
								this.lists[i].lastTime = `${minute}分${second}秒`;
							} else {
								this.lists[i].lastTime = '0分0秒';
								clearInterval(this.timer[i]);
							}
						}
						//加倒数的定时器
						let timerId = setInterval(() => {
							flag = false;
							time = this.lists[i].showTime -= 1000;
							let timeOne = time / 1000;
							timeOne = timeOne - 1;
							if (timeOne > 0) {
								let minute = this.checkFigure(parseInt(timeOne / 60));
								let second = this.checkFigure(parseInt(timeOne % 60));
								this.lists[i].lastTime = `${minute}分${second}秒`;
							} else {
								this.lists[i].lastTime = '0分0秒';
								clearInterval(this.timer[i]);
							}
							this.$forceUpdate(); //!!!划重点,这个是迫使Vue实例重新（rander）渲染虚拟DOM，
							//注意并不是重新加载组件,但是也达到更新的目的了,要不然你会发现数据一直在变化,页面却没变
						}, 1000)
						this.timer.push(timerId);
					} else {
						this.lists[i].lastTime = '0分0秒';
						clearInterval(this.timer[i]);
					}
				}
			},
			//把单一位数字通过在前面+“0”转化为两位；
			checkFigure(i) {
				if (i < 10) {
					i = '0' + i;
				}
				return i;
			}

		},
		beforeDestroy() {
			//清除定时器
			this.timer.forEach(a => {
				clearInterval(a);
			})
		},
		onLoad() {
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				var ss = 80 + getApp().globalData.bootomTop * 2;
				this.bootomTop = ss + "rpx";
				this.yyList();
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

	.ordertip {
		margin: 0 auto;
		padding: 0 20rpx;
		width: 702rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #FD6361;
		background: #FFFFFF;
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.li {
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
		width: 500rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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
		height: 100rpx;
		line-height: 100rpx;
	}

	.litime {
		font-size: 26rpx;
		color: #333;
	}

	.litime text {
		color: #FD6361;
	}

	.liqx {
		width: 146rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #999999;
		text-align: center;
		border: 2rpx solid #F4F4F3;
		border-radius: 10rpx;
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
