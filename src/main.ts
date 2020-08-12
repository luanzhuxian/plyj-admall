import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
// import Element from 'admall-element'
// import 'admall-element/lib/theme-chalk/index.css'

import directive from './directive'
import filter from './filter'

import './assets/scss/index.scss'
import './assets/ts/axios-config'

import startQiankun from './micro'

// Vue.use(Element)

/* *************** 自定义指令 ***************** */
for (const k of Object.keys(directive)) {
    Vue.directive(k, directive[k])
}

/* *************** 过滤器 ***************** */
for (const name of Object.keys(filter)) {
    Vue.filter(name, filter[name])
}

startQiankun()

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#main-app',
    router,
    store,
    render: h => h(App)
})
