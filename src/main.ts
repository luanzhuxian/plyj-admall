import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import './assets/ts/el-components'
import PlSvg from './components/common/Pl-Svg.vue'
import DateRange from './components/common/Date-Range.vue'

import directive from './directive'
import filter from './filter'

import './assets/scss/index.scss'
import './assets/ts/axios-config'

import startQiankun from './micro'

/* 注册全局组件 */
Vue.component(PlSvg.name, PlSvg)
Vue.component(DateRange.name, DateRange)

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
