import Vue from 'vue'
import App from './App'
import http from './utils/request.js'
import share from './common/share.js'
Vue.mixin(share)

Vue.config.productionTip = false

Vue.prototype.$http = http;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
