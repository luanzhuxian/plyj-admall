import Vue from 'vue'
import App from './App'
import { router } from './router'
import store from './store'
import { beforeResolve, afterEach } from './router-guard'
import './assets/scss/index.scss'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
router.beforeResolve(beforeResolve)
router.afterEach(afterEach)
