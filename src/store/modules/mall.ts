import { Module } from 'vuex'
import { getCurrentTemplate } from '../../apis/mall'
// import { rebuild } from '../../views/mall-manage/utils/service'

const mall: Module<DynamicObject, DynamicObject> = {
    state: {
        // 直播
        liveInfo: {},
        // 是否展示年味活动
        hasNwEvent: false,
        currentHome: {},
        currentActivity: {}
    },
    getters: {
        liveInfo: state => state.liveInfo,
        hasNwEvent: state => state.hasNwEvent,
        currentHome: state => state.currentHome,
        currentActivity: state => state.currentActivity,
        currentHomeType: state => state.currentHome.type,
        currentActivityType: state => state.currentActivity.type
    },
    mutations: {
        setLiveInfo: (state, payload) => {
            state.liveInfo = payload
        },
        setNwEvent: (state, payload) => {
            state.hasNwEvent = !!payload.permissionStatus
        },
        setCurrentHome: (state, payload) => {
            state.currentHome = payload
        },
        setCurrentActivity: (state, payload) => {
            state.currentActivity = payload
        }
    },
    actions: {
        async getCurrentTemplate ({ commit }, type) {
            try {
                const { result } = await getCurrentTemplate({ type })
                // 当前首页
                if (type === 1) {
                    commit('setCurrentHome', result)
                }
                // 当前主会场
                if (type === 2) {
                    commit('setCurrentActivity', result)
                }
                // return result
            } catch (error) {
                throw error
            }
        }
    }
}

export default {
    namespaced: true,
    ...mall
}
