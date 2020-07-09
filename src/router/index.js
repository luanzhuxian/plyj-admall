import Vue from 'vue'
import Router from 'vue-router'

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
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location)
        .catch(err => console.error(err))
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
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location)
        .catch(err => console.error(err))
}

const routes = [
    {
        path: '*',
        redirect: '/not-found'
    },
    {
        path: '/not-found',
        name: 'NotFound',
        component: import('../views/404.vue'),
        meta: {
            title: '页面未找到'
        }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
            title: '首页'
        }
    }
]

export const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({
        y: 0
    }),
    routes
})
