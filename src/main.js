import Vue from 'vue'
import App from './App'
import router from './router'

import Common from '@/lib/common'
import Requests from '@/lib/requests'
import CommonMessage from '@/lib/message'

import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

function lib (config) {
    return {
        common: new Common(),
        requests: new Requests(config),
        message: new CommonMessage()
    }
}

Vue.use(elementUI)
Vue.config.productionTip = false
Vue.prototype.lib = lib({
    host: window.serverHost
})

router.beforeEach((to, from, next) => {
    for (let item of window.axiosRequestsList) {
        item.cancel()
    }
    window.axiosRequestsList = []
    next()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
