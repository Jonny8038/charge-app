<template>
	<view class="container">
		<view class="content">
			<view class="img">
				<image :src='imgUrl+"about.png"' />
			</view>
			<view class="tit font30 color0">换电小程序</view>
			<view class="jj font26 color6">电动汽车换电模式是指通过集中型充电站对大量电池集中存
				储、集中充电、统一配送，并在电池配送站内对电动汽车进行电池更换服务或者集电池的充电、物流调配、以及换电服务于 一体。</view>
			<view class="nr">
				<view class="nritem">
					<view class="itemle font30 color0">联系电话</view>
					<view class="itemri font26 color9">0710-123456</view>
				</view>
				<view class="nritem">
					<view class="itemle font30 color0">电子邮箱</view>
					<view class="itemri font26 color9">huandian@xiaochengxu.com</view>
				</view>
				<view class="nritem">
					<view class="itemle font30 color0">公司地址</view>
					<view class="itemri font26 color9">深圳市南山区南头浙商大厦B栋</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:getApp().globalData.imgUrl,
			}
		},

		methods: {
			
		},
		onLoad() {

		}
	}
</script>

<style>
	.container{
	  background: #fff;
	}
	.img{
	  margin: 0 auto;
	  margin-top: 40rpx;
	  margin-bottom: 20rpx;
	  width: 140rpx;
	  height: 140rpx;
	}
	.img image{
	  width: 140rpx;
	  height: 140rpx;
	}
	.tit{
	  text-align: center;
	}
	.jj{
	  margin-top: 60rpx;
	  margin-bottom: 160rpx;
	  padding: 0 20rpx;
	  line-height: 44rpx;
	}
	.nritem{
	  display: flex;
	  justify-content: space-between;
	  padding: 0 20rpx;
	  height: 120rpx;
	  line-height: 120rpx;
	}
</style>
