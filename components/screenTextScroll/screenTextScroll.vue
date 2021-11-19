<!-- 
展示屏幕文字滚动效果
 
使用方法：
 -->
<!-- 
展示屏幕文字滚动效果
usage:
 list:数组数据
 @getCurrentIndex  获取当前swiper的下标
 <textscroll :list="list" @getCurrentIndex="getIndex"/>
 -->

<template>
	<view class="_notice">
		<swiper class="_swiper tc" @change="slideChange" autoplay="true" :interval="interval" circular="true"
			display-multiple-items="2" :duration="duration">
			<swiper-item v-for="(item,index) in list" :key="index">
				<block v-if="item.content">
					<view class="swiper-item uni-bg-red">{{item.content}}</view>
				</block>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item uni-bg-red"></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item uni-bg-red"></view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props: {
			//显示数据
			list: {
				type: Array,
				defual: function() {
					return [];
				}
			},
		},
		data() {
			return {
				interval: 3000,
				duration: 12000,
			};
		},
		methods: {
			slideChange(e) {
				this.$emit('getCurrentIndex', e.detail.current);

			}
		}
	};
</script>

<style lang="scss">
	._notice {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
		width: 100%;
		font-size: 30rpx;
		height: 70rpx;
		overflow: hidden;
	}

	._swiper {
		line-height: 70rpx;
	}
</style>
