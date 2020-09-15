import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import './assets/ts/el-components'

import PlSvg from './components/common/Pl-Svg.vue'
import SearchBox from './components/common/Search-Box.vue'
import DateRange from './components/common/Date-Range.vue'
import PlTabs from './components/common/Pl-Tabs.vue'
import Pagination from './components/common/Pagination.vue'
import Operating from './components/common/Operating.vue'

import VueViewer from 'v-viewer'
import VueClipboard from 'vue-clipboard2'
import directive from './directive'
import filter from './filter'

import './assets/scss/index.scss'
import './assets/ts/axios-config'

Vue.use(VueClipboard)
Vue.use(VueViewer, {
    defaultOptions: {
        zIndex: 9999
    }
})

/* 注册全局组件 */
Vue.component(PlSvg.name, PlSvg)
Vue.component(DateRange.name, DateRange)
Vue.component(SearchBox.name, SearchBox)
Vue.component(PlTabs.name, PlTabs)
Vue.component(Pagination.name, Pagination)
Vue.component(Operating.name, Operating)

/* *************** 自定义指令 ***************** */
for (const k of Object.keys(directive)) {
    Vue.directive(k, directive[k])
}

/* *************** 过滤器 ***************** */
for (const name of Object.keys(filter)) {
    Vue.filter(name, filter[name])
}

Vue.config.productionTip = false

/* 处理所有组件抛出的错误 */
Vue.config.errorHandler = function (err, vm) {
    if (err) {
        // 响应出错
        if (err.name === 'ResponseError') {
            const error = JSON.parse(err.message)
            vm.$error(error.message)
        }
        console.error(err)
    }
}

/* eslint-disable no-new */
new Vue({
    el: '#main-app',
    router,
    store,
    render: h => h(App)
})
