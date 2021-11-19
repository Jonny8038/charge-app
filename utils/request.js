var apiUrl = "http://192.168.2.119:9108/app";
// var apiUrl = "http://192.168.2.42:9108/app";
// var apiUrl = "http://39.108.237.5:9108/app";  //线上接口地址
// var apiUrl = "http://124.71.65.82:9108/app";  //124线上接口地址
// var apiUrl = 'http://ygsb.bendizhi.com:9108/app'; //放入后台接口的url

// 400错误  500token为空
// #ifdef H5
var baseUrl = '';
if (process.env.NODE_ENV === 'development') {
	//本地环境，即开发环境
	baseUrl = '/api'
} else {
	//线上环境
	baseUrl = apiUrl
}
// #endif


//封装request请求
const sendRequest = (url, method = 'GET', data = {}, contentType) => {
	//判断header提交数据类型
	let types = '';
	if (method == 'POST' && !contentType) {
		types = 'application/x-www-form-urlencoded'
	} else if (method == 'POST' && contentType) {
		types = contentType
	} else {
		types = 'application/json';
	}

	// #ifdef H5
	var bases = baseUrl + '/' + url;
	// #endif

	// #ifndef H5
	var bases = apiUrl + '/' + url;
	// #endif

	var token = uni.getStorageSync('token') || '';
	return new Promise(function(resolve, reject) {
		uni.request({
			url: bases,
			data: data,
			method: method,
			header: {
				'Content-Type': types,
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Authorization': token
			},
			success(res) {
				if (res.header.authorization) {
					uni.setStorageSync('token', res.header.authorization);
				} else {
					var code = res.data.code;
					switch (code) {
						case 400:
							resolve(res);
							break;
						case 401:
							uni.showModal({
								title: '登录提示',
								content: res.data.msg,
								success: ress => {
									if (ress.confirm) {
										uni.redirectTo({
											url: '/pages/login/login'
										})
										uni.clearStorageSync("token");
										uni.clearStorageSync("carId"); 
										uni.clearStorageSync("tel"); 
									}
								}
							})
							break;
						// case 500:
						// 		uni.showModal({
						// 			title: '登录提示',
						// 			content: res.data.msg
						// 		})
						// 		break;
						case 77777:
							uni.showModal({
								title: '请填写认证信息',
								content: res.data.msg,
								success: ress => {
									if (ress.confirm) {
										uni.navigateTo({
											url: '/pages/approveCar/approveCar'
										})
									}
								}
							})
							break;
						default:
							resolve(res);
							break;
					}
				}
			},
			fail(err) {
				reject(err);
			}
		})
	})
}

module.exports.sendRequest = sendRequest
