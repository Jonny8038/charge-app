<template>
	<view class="container">
		<view class="xx">
			<view class="tx" @click='upuserPhoto'>
				<view class="tximg">
					<image :src='userimg' mode="aspectFill"></image>
				</view>
				<text>更改头像</text>
			</view>
			<view class="xxcon">
				<view class="xxitem">
					<view class="xxname font30 color3">昵称</view>
					<view class="xxri">
						<input type="text" placeholder="请输入昵称" :value="nick" @blur="getnick" />
						<text class="iconfont icon-a-lujing448"></text>
					</view>
				</view>
				<view class="xxitem" v-if="phone">
					<view class="xxname font30 color3">手机号</view>
					<view class="xxri">
						<input type="text" :value="phone" disabled />
						<text class="iconfont icon-a-lujing448"></text>
					</view>
				</view>
				<view class="xxitem">
					<view class="xxname font30 color3">性别</view>
					<view class="xxri">
						<picker @change="bindPickerSex" :value="'index'" :range="sex">
							<view class="picker">{{sex[sexIndex]}}</view>
						</picker>
						<text class="iconfont icon-a-lujing448"></text>
					</view>
				</view>
			</view>
			<view class="dbtn" @click="updateInfo">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userimg: getApp().globalData.imgUrl+'tx.png',
				nick: '',
				sex: ['男', '女'],
				sexIndex: 0,
				zy: '',
				date: '2016-09-01',
				phone: '',
			}
		},

		methods: {
			upuserPhoto: function() {
				var that = this;
				uni.showActionSheet({
					itemList: ['从相册中选择', '拍照'],
					itemColor: "#f7982a",
					success: function(res) {
						if (!res.cancel) {
							if (res.tapIndex == 0) {
								that.chooseWxImageShop('album'); //从相册中选择

							} else if (res.tapIndex == 1) {
								that.chooseWxImageShop('camera'); //手机拍照

							}
						}
					}
				})
			},
			chooseWxImageShop: function(type) {
				var that = this;
				uni.chooseImage({
					sizeType: ['original', 'compressed'],
					sourceType: [type],
					success: function(res) {
						that.userimg = res.tempFilePaths[0];
						that.upload_file(getApp().globalData.uploadUrl, res.tempFilePaths[0])
						var userPhoto = res.tempFilePaths[0];
						that.userimg=userPhoto
					}
				})
			},
			upload_file: function(url, filePath) {
				var that = this;
				uni.uploadFile({
					url: url, //后台处理接口
					filePath: filePath,
					name: 'file',
					header: {
						'content-type': 'multipart/form-data',
					},                     
					success: function(res) {
						var data = JSON.parse(res.data);
						if (data.code == 200) {
							that.userimg=data.data.url
						}
					},
					fail: function(res) {}
				})

			},
			bindPickerSex: function(e) {
				this.sexIndex= e.detail.value
			},
			getnick: function(e) {
				this.nick= e.detail.value
			},
			updateInfo() {
				this.$http.sendRequest('/wx/updateuser', 'POST',{
					avatar: this.userimg,
					userName: this.nick,
					sex: this.sexIndex,
				}).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: "编辑成功",
							icon: 'success',
							duration: 2000,
							success: function() {
								uni.navigateBack({
									delta: 1
								})
							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
						})
					}

				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})
				})

			},
			getUserInfo: function() {
				this.$http.sendRequest('/wx/goUser', 'POST').then(res => {
					console.log('res', res)
					if (res.data.code == 200) {
						if (res.data.data.avatar.length != 0) {
							this.userimg=res.data.data.avatar
						}
						this.sexIndex=res.data.data.sex;
						this.nick=res.data.data.userName;
						this.phone=res.data.data.phonenumber;
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
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getUserInfo();
			}
			
		}
	}
</script>

<style>
	.container {
		background: #fff;
	}

	.xx {
		width: 750rpx;
	}

	.tx {
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 26rpx;
		color: #333;
	}

	.tximg {
		margin: 0 auto;
		margin-bottom: 10rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		border: 1rpx solid #ccc;
	}

	.tximg image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.xxcon {
		padding: 0 24rpx;
	}

	.xxitem {
		display: flex;
		justify-content: space-between;
		height: 120rpx;
		line-height: 120rpx;
	}

	.xxri {
		display: flex;
	}

	.xxri input {
		height: 120rpx;
		line-height: 120rpx;
		text-align: right;
		font-size: 26rpx;
		color: #999999;
	}

	.xxri .iconfont {
		margin-left: 10rpx;
		font-size: 26rpx;
		color: #999999;
	}

	.picker {
		font-size: 26rpx;
		color: #999;
	}

	.dbtn {
		padding: 0;
		margin: 0 auto;
		margin-top: 200rpx;
		width: 702rpx !important;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		color: #fff !important;
		font-weight: bold;
		text-align: center;
		background: #212D43;
		border-radius: 10rpx;
	}
</style>
