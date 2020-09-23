import { Module } from 'vuex'

const mall: Module<DynamicObject, DynamicObject> = {
    state: {
        // 直播
        liveInfo: {},
        // 是否展示年味活动
        hasNwEvent: false
    },
    getters: {
        liveInfo: state => state.liveInfo,
        hasNwEvent: state => state.hasNwEvent
    },
    mutations: {
        setLiveInfo: (state, payload) => {
            state.liveInfo = payload
        },
        setNwEvent: (state, payload) => {
            state.hasNwEvent = !!payload.permissionStatus
        }
    },
    actions: {}
}

export default {
    namespaced: true,
    ...mall
}
