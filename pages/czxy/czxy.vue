<template>
	<view class="container">
		<view class="content">
			<view class="jj font26 color6">
				尊敬的用户，为保障您的合法权益，请您在充值前仔细阅读本《充值协议》（“本协议”）以了解软件的充值及余额使用规则以避免产生任何误解。当您点击“马上充值”按钮后，即视为您已阅读、理解本协议，并同意按本协议的规定进行充值使用账户余额。
			</view>
			<view class="jj font26 color6">
				<view>1 定义</view>
				<view>充值本金：您通过软件向您已注册的用户账户实际支付的金额。</view>
				<view>账户余额：您的换电用户账号中显示的金额。</view>
			</view>
			<view class="jj font26 color6">
				<view>2 账户余额有效期限</view>
				<view>用户账户的有效期为自充值之日起至使用完毕为止。</view>

			</view>
			<view class="jj font26 color6">
				<view>3 账户余额使用规则</view>
				<view>1) 账户余额仅可用于购买换电套餐和支付换电费用，不可用于转移、转赠或提现；</view>
				<view>2) 用户购买换电套餐时，可选择使用账户余额支付，或者选择通过第三方支付平台支付（如支付宝或微信钱包支付）；</view>
			</view>
			<view class="jj font26 color6">
				<view>4 正当性保证</view>
				<view>
					您完全理解并同意，软件所提供的包含充值赠送在内的所有优惠推广活动仅面向正当、合法按照《用户协议》使用我们服务的用户。一旦发现您存在利用我们的规则漏洞进行任何形式的作弊行为（包括但不限于通过我们的活动获得不正当的经济利益），我们有权取消与作弊行为相关账户赠送金额、追回您作弊所得的不正当经济利益、关闭作弊账户或与您相关的所有账户，并保留取消您后续使用我们服务的权利，及依据严重程度追究您的法律责任。
				</view>
			</view>
			<view class="jj font26 color6">
				<view>5 特别说明</view>
				<view>
					您完全理解并同意，本公司有权随时修改本协议内容，届时将通过在官网或软件上公布修改后的协议，该公布将被视为已通知用户；同时，本公司也可通过其他适当方式通知用户。如果您选择继续充值即表示您同意并接受修改后协议并受其约束；如果您不同意我们对本协议的修改，请立即放弃充值或停止使用本服务。
				</view>
				<view>在适用法律法规允许的范围内，本协议下充值及账户全额的使用规则的最终解释权归本公司所有。</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
			}
		},

		methods: {

		},
		onLoad() {

		}
	}
</script>

<style>
	.container {
		background: #fff;
	}

	.content {
		overflow-y: scroll;
	}

	.jj {
		margin-bottom: 20rpx;
		padding: 0 20rpx;
		line-height: 44rpx;
		text-indent: 2em;
	}
	.jj view:first-child{
		font-weight: bold;
	}
</style>
