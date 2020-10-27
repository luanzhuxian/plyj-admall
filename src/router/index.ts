// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import Cookie from './../assets/ts/storage-cookie'
import qs from 'qs'
import { MessageBox } from 'admall-element'
import NotFound from '../views/404.vue'
import { importFiles } from './../assets/ts/utils'
import { LocalEnum, SessionEnum } from '@/enum/storage'
import store from '../store'

const checkAuth = to => {
    const routeNames = store.getters['user/routeNames']
    const currentHasPower = routeNames.has(to.name)
    const index = routeNames.get(to.name)
    // 判断是否有权限访问
    if (currentHasPower) {
        const routeNameArr = [...routeNames]
        // 找出当前路由的所有子路由
        const allChildren = routeNameArr.filter(item => item[1] !== index && item[1].indexOf(`${ index }-`) === 0)
        if (allChildren.length) {
            return allChildren[0][0]
        }
        return to.name
    }

    /**
     * 无权限访问，返回一个重定向路由，并提示用户
     * 返回路由列表中的第一个路由
     */
    MessageBox.alert(`${ to.meta.title ? to.meta.title : '该' }页面暂无权限，请联系管理员`, { title: '暂无权限' })
    return [...routeNames.keys()][0]
}

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
    'CompleteLogin',
    ...NOLOGIN
]
// 无需进行微信授权就可以访问的页面
const NO_AUTH = [
    'BaseSetting',
    'Wechat',
    'AccountSet',
    ...NO_MALL
]

Vue.use(Router)

const context = require.context('./modules', true, /index\.ts$/)
const importRoutes = importFiles(context)

const routes: RouteConfig[] = [
    {
        path: '*',
        name: 'NotFound',
        component: NotFound,
        meta: {
            title: '网页带着诗和远方出游了',
            ignore: true
        }
    },
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
export const beforeResolve = async (to: Route, from: Route, next: RouteNext) => {
    if (to.query.code) {
        sessionStorage.setItem(SessionEnum.redirectState, to.query.state as string)
        sessionStorage.setItem(SessionEnum.redirectCode, to.query.code as string)
        delete to.query.code
        delete to.query.state
        const search = qs.stringify(to.query)
        if (search) {
            return next(`${ to.path }?${ search }`)
        }
        return next(to.path)
    }
    NProgress.start()
    document.title = to.meta.title || document.title
    const token = Cookie.get(LocalEnum.token) || ''
    if (!token) {
        if (!NOLOGIN.includes(to.name as string)) {
            next({ name: 'PhoneLogin' })
            NProgress.done()
        }
        next()
        return
    }

    // 已登录，访问不需要登录的页面
    if (NOLOGIN.includes(to.name as string)) {
        next({ name: 'Home' })
        NProgress.done()
        return
    }
    // 校验页面权限
    if (!to.meta.ignore) {
        const newTo = checkAuth(to)
        console.log(newTo, to.name)
        if (newTo !== to.name) {
            NProgress.done()
            return next({ name: newTo })
        }
    }
    const appId = localStorage.getItem(LocalEnum.appId)
    const mallId = Cookie.get(LocalEnum.mallId)
    if (!mallId && !to.matched.some(item => NO_MALL.includes(item.name as string))) {
        NProgress.done()
        await MessageBox.confirm('创建店铺后才可以进行后续操作，请点击操作指引完成创建', {
            title: '请先创建店铺',
            confirmButtonText: '创建店铺'
        })
        next({ path: '/home?showCreateMall=1' })
        return
    }
    if (!appId && !to.matched.some(item => NO_AUTH.includes(item.name as string))) {
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

/**
 * vue-router新版本给push和replace方法新增了回调（Promise）
 * 有时会有错误抛出，但是并不会影响正常跳转
 * 为了能避免错误的打印，以下式vue-router作者给出的解决方案
 */
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
Router.prototype.push = function push (location: Route, onResolve: Function, onReject: Function) {
    if (typeof location === 'object') {
        if (location.query) {
            location.query.t = String(Date.now())
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
Router.prototype.replace = function replace (location: Route, onResolve: Function, onReject: Function) {
    if (typeof location === 'object') {
        if (location.query) {
            location.query.t = String(Date.now())
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
