// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import Cookie from './../assets/ts/storage-cookie'
import qs from 'qs'
import { MessageBox } from 'admall-element'
// import NotFound from '../views/404.vue'
import { importFiles } from './../assets/ts/utils'
import { LocalEnum, SessionEnum } from '@/enum/storage'

// 无需登录就可以看到的页面
const NOLOGIN = [
    'WxLogin',
    'PasswordLogin',
    'PhoneLogin',
    'WxBindPassword',
    'WxBindPhone',
    'Register',
    'RegisterAccount',
    'ForgetPassword',
    'ResetPassword'
]
// 无需创建店铺就可以访问的页面
const NO_MALL = [
    'Home',
    ...NOLOGIN
]
// 无需进行微信授权就可以访问的页面
const NO_AUTH = [
    'BaseSetting',
    'Wechat',
    'AccountSet',
    'CompleteLogin',
    ...NO_MALL
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
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home/Index.vue'),
        meta: {
            title: '首页',
            index: '1'
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
        sessionStorage.setItem(SessionEnum.redirectState, to.query.state)
        sessionStorage.setItem(SessionEnum.redirectCode, to.query.code)
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
    try {
        document.title = [...to.matched].reverse().find(item => item.meta.title).meta.title
    } catch (e) {
        document.title = ''
    }
    const token = Cookie.get(LocalEnum.token) || ''
    // 需要登录，但未登录
    if (!token && !NOLOGIN.includes(to.name)) {
        next({ name: 'PhoneLogin' })
        return
    }
    // 已登录，访问不需要登录的页面
    if (token && NOLOGIN.includes(to.name)) {
        next({ name: 'Home' })
        return
    }
    // 访问了需要微信授权的页面
    const appId = localStorage.getItem(LocalEnum.appId)
    const mallId = localStorage.getItem(LocalEnum.mallId)
    if (!mallId && !to.matched.some(item => NO_MALL.includes(item.name))) {
        NProgress.done()
        MessageBox.alert('创建店铺后才可以进行后续操作，请点击操作指引完成创建', {
            title: '请先创建店铺',
            confirmButtonText: '我知道了'
        })
        next({ name: 'Home' })
        return
    }
    if (!appId && !to.matched.some(item => NO_AUTH.includes(item.name))) {
        NProgress.done()
        MessageBox.confirm('进行微信授权即可访问全部页面', {
            title: '请进行微信授权',
            confirmButtonText: '去授权'
        })
            .then(() => {
                next({ name: 'Wechat' })
            })
            .catch(() => {
                next({ name: 'Home' })
            })
        return
    }
    next()
}

export const afterEach = () => {
    NProgress.done()
}
router.beforeResolve(beforeResolve)
router.afterEach(afterEach)
window.router = router
