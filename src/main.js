import Vue from 'vue'
import App from './App'
import { router } from './router'
import store from './store'
import { beforeResolve, afterEach } from './router-guard'

import directive from './directive'
import filter from './filter'

import './assets/scss/index.scss'
import './assets/js/axios-config'

/* *************** 自定义指令 ***************** */
for (const k of Object.keys(directive)) {
    Vue.directive(k, directive[k])
}

/* *************** 过滤器 ***************** */
for (const name of Object.keys(filter)) {
    Vue.filter(name, filter[name])
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
router.beforeResolve(beforeResolve)
router.afterEach(afterEach)
