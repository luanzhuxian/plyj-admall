import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import './assets/ts/el-components'

import PlSvg from './components/common/base/Pl-Svg.vue'
import SearchBox from './components/common/Search-Box.vue'
import DateRange from './components/common/base/Date-Range.vue'
import PlTabs from './components/common/Pl-Tabs.vue'
import Pagination from './components/common/Pagination.vue'
import Operating from './components/common/Operating.vue'
import PlTable from './components/common/Pl-Table.vue'

import VueViewer from 'v-viewer'
import VueClipboard from 'vue-clipboard2'
import directive from './directive'
import filter from './filter'

import './assets/scss/index.scss'
import './assets/ts/axios-config'
import { MutationTypes } from '@/store/mutation-type'

Vue.use(VueClipboard)
Vue.use(VueViewer, {
    defaultOptions: {
        zIndex: 9999
    }
})

/* 注册全局组件 */
Vue.component('PlSvg', PlSvg)
Vue.component('DateRange', DateRange)
Vue.component('SearchBox', SearchBox)
Vue.component('PlTabs', PlTabs)
Vue.component('Pagination', Pagination)
Vue.component('Operating', Operating)
Vue.component('PlTable', PlTable)

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
    if (err && typeof err !== 'string' && err.message.indexOf('Redirected when going from') === -1) {
        // 响应出错
        if (err.name === 'ResponseError') {
            const error = JSON.parse(err.message)
            vm.$error(error.message)
        } else {
            vm.$error(err.message)
        }
        console.error(err)
    } else {
        console.warn(err)
    }
}

const render = async () => {
    const getters = store.getters
    const dispatch = store.dispatch
    const token = getters['user/token']
    const agencyCode = getters['user/agencyCode']
    const categoryTree = getters['goods/categoryTree']
    if (token && agencyCode) {
        await dispatch(`user/${ MutationTypes.setLoginInfo }`)
        await dispatch(`user/${ MutationTypes.getAgencyList }`)
        await dispatch(`user/${ MutationTypes.getAllMallInfo }`)
        if (!categoryTree || !categoryTree.length) await dispatch(`goods/${ MutationTypes.getClassifyTree }`)
    }
    /* eslint-disable no-new */
    new Vue({
        el: '#main-app',
        router,
        store,
        render: h => h(App)
    })
}

render()
