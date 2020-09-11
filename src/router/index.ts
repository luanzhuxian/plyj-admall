// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import qs from 'qs'
// import NotFound from '../views/404.vue'
import login from './login.ts'
import marketingManage from './marketing-manage/index.ts'
import baseSetting from './base-setting/index.ts'
import userCenter from './user-center.ts'

import Home from '../views/Home.vue'

Vue.use(Router)

/**
 * vue-router新版本给push和replace方法新增了回调（Promise）
 * 有时会有错误抛出，但是并不会影响正常跳转
 * 为了能避免错误的打印，以下式vue-router作者给出的解决方案
 */
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
Router.prototype.push = function push (location, onResolve, onReject) {
    if (typeof location === 'object') {
        if (location.query) {
            location.query.t = Date.now()
        } else {
            Object.assign(location, {
                query: {
                    t: Date.now()
                }
            })
        }
    }
    if (onResolve || onReject) { return originalPush.call(this, location, onResolve, onReject) }
    return originalPush.call(this, location)
        .catch(err => {
            console.error(err)
        })
}
Router.prototype.replace = function replace (location, onResolve, onReject) {
    if (typeof location === 'object') {
        if (location.query) {
            location.query.t = Date.now()
        } else {
            Object.assign(location, {
                query: {
                    t: Date.now()
                }
            })
        }
    }
    if (onResolve || onReject) { return originalReplace.call(this, location, onResolve, onReject) }
    return originalReplace.call(this, location)
        .catch(err => {
            console.error(err)
        })
}

// 导入其他同层路由文件
// const importRoutes = []
// let [files, file] = [require.context('./', false, /\/((?!index).)+\.js$/)]
// for (const key of files.keys()) {
//     file = files(key).default || files(key)
//     importRoutes.push(...file)
// }

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: '首页'
        }
    },
    // ...importRoutes
    ...login,
    ...userCenter,
    ...marketingManage,
    ...baseSetting
]

export const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({
        y: 0,
        x: 0
    }),
    routes
})
export const beforeResolve = async (to, from, next) => {
    if (to.query.code) {
        sessionStorage.setItem('redirect_state', to.query.state)
        sessionStorage.setItem('redirect_code', to.query.code)
        delete to.query.code
        delete to.query.state
        const search = qs.stringify(to.query)
        if (search) {
            return next(`${ to.path }?${ search }`)
        }
        return next(to.path)
    }
    NProgress.start()
    next()
}

export const afterEach = () => {
    NProgress.done()
}
router.beforeResolve(beforeResolve)
router.afterEach(afterEach)
