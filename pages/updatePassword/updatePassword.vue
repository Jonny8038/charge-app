<template>
	<view class="container">
		<form class="form" @submit='formSubmit'>
			<view class="formItem">
				<view class="formName">旧密码</view>
				<input password='true' name="oldpwd" placeholder="请输入你的旧密码" />
			</view>
			<view class="formItem">
				<view class="formName">新密码</view>
				<input password='true' name="newpwd" :value="password" @blur="getPwd"
					placeholder="请输入你的新密码，最少6位数" />
			</view>
			<view class="formItem">
				<view class="formName">确认密码</view>
				<input password='true' name="newpwd2" :value="password2" @blur="getPwd2"
					placeholder="请再次输入你的密码，最少6位数" />
			</view>
			<button class="dbtn" type='primary' form-type='submit'>确定</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password: '',
				password2: ''
			}
		},

		methods: {
			getPwd: function(e) {
				if (e.detail.value.length < 6) {
					wx.showToast({
						title: '请输入6位数以上的密码',
						icon: 'none'
					})
				} else {
					this.password= e.detail.value
				}
			},
			getPwd2: function(e) {
				if (e.detail.value.length < 6) {
					wx.showToast({
						title: '请输入6位数以上的密码',
						icon: 'none'
					})
				} else {
					this.password2= e.detail.value
				}
			},
			//修改密码成功跳转到登录
			formSubmit: function(e) {
				var oldpwd = e.detail.value.oldpwd;
				var newpwd = e.detail.value.newpwd;
				var newpwd2 = e.detail.value.newpwd2;

				// console.log(no);
				if (oldpwd == '' || newpwd == '' || newpwd2 == '') {
					wx.showToast({
						title: '密码不能为空',
						icon: 'none',
						duration: 1000
					})
				} else if (newpwd != newpwd2) {
					wx.showToast({
						title: '两次输入不一致',
						icon: 'none',
						duration: 1000
					})
				} else {
					this.$http.sendRequest('/wx/updatepass', 'POST',{
						newPassword: newpwd,
						oldPassword: oldpwd,
					}).then(res => {
						if (res.data.code == 200) {
							wx.showToast({
								title: res.data.msg,
								icon: 'success',
								duration: 2000,
								success: function() {
									setTimeout(function() {
										uni.clearStorageSync("token");
										uni.navigateTo({
											url: '../login/login'
										})
									}, 2000)
								}
							})
						} else {
							wx.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							})
						}

					}).catch(err => {
						wx.showToast({
							icon: 'none',
							title: err.data.msg,
						})
					})
				}

			},
		},
		onLoad() {
			
		}
	}
</script>

<style>
	.container{
	    background: #fff;
	}
	.form{
	    width: 100%;
	}
	.formItem{
	    padding: 0 24rpx;
	    height: 120rpx;
	    line-height: 120rpx;
	}
	.formItem{
	    display: flex;
	    height: 120rpx;
	    line-height: 120rpx;
	    border-bottom: 2rpx solid #F5F5F5;
	}
	.formName{
	    font-size: 30rpx;
	    color: #333;
	    width: 160rpx;
	}
	
	.formItem input{
	    flex:1;
	    font-size: 26rpx;
	    color: #999;
	    height: 120rpx;
	}
	.formItem input::placeholder{
	    font-size: 26rpx;
	    color: #999;
	}
	.yzmBtn{
	    width: 150rpx;
	    font-size: 30rpx;
	    color: #29BD5F;
	}
	.dbtn{
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
	    background: #212D43 !important;
	    border-radius: 10rpx;
	}
</style>
