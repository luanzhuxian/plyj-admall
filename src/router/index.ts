// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import Cookie from './../assets/ts/storage-cookie'
import qs from 'qs'
// import NotFound from '../views/404.vue'

import Home from '../views/Home.vue'
import { importFiles } from './../assets/ts/utils'

// 无需登录就可以看到的页面
const NOLOGIN = [
    'WxLogin',
    'PasswordLogin',
    'PhoneLogin',
    'WxBindPassword',
    'WxBindPhone',
    'Register',
    'ForgetPassword',
    'ResetPassword'
]

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

const context = require.context('./modules', true, /index\.ts$/)
const importRoutes = importFiles(context)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: '首页'
        }
    },
    ...importRoutes
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

    // 部分路由没有title，此时就找离它最近的父级title
    // try {
    //     document.title = [...to.matched].reverse().find(item => item.meta.title).meta.title
    // } catch (e) {
    //     document.title = ''
    // }
    const token = Cookie.get('token') || ''
    const currentStep = Number(sessionStorage.getItem('currentStep')) || 0
    // 需要登录，但未登录
    if (!token && !NOLOGIN.includes(to.name)) {
        return next({ name: 'PhoneLogin' })
    }
    // 已登录，访问不需要登录的页面
    if (token && NOLOGIN.includes(to.name) && currentStep !== 1) {
        next({ path: '/' })
        return
    }
    if (currentStep === 1 && to.name !== 'Register') {
        next({ path: '/register' })
        return
    }
    next()
}

export const afterEach = () => {
    NProgress.done()
}
router.beforeResolve(beforeResolve)
router.afterEach(afterEach)
