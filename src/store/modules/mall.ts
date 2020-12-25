import { Module } from 'vuex'
import { getCurrentTemplate } from '../../apis/mall'

export default {
    namespaced: true,
    state: {
        // 当前首页
        currentHome: {},
        // 当前主会场
        currentActivity: {},
        // 直播
        liveInfo: {},
        // 是否展示年味活动
        hasNwEvent: false,
        // 模板使用权限: 1 '开启', 2: '过期', 3: '未开启活动'
        double12LockStatus: 3, // 双十二权限
        springLockStatus: 3, // 新春权限
        // dragonGateLockStatus = 3 // 龙门节权限
        redPackageList: [],
        currentLottery: {},
        currentSign: {}
    },
    getters: {
        liveInfo: state => state.liveInfo,
        hasNwEvent: state => state.hasNwEvent,
        currentHome: state => state.currentHome,
        currentActivity: state => state.currentActivity,
        currentHomeType: state => state.currentHome.type,
        currentActivityType: state => state.currentActivity.type,
        double12LockStatus: state => state.double12LockStatus,
        springLockStatus: state => state.springLockStatus,
        isRedPackageShow: state => !!state.redPackageList.length,
        currentLottery: state => state.currentLottery,
        currentSign: state => state.currentSign
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
        },
        setDouble12LockStatus: (state, payload) => {
            state.double12LockStatus = payload
        },
        setSpringLockStatus: (state, payload) => {
            state.springLockStatus = payload
        },
        setRedPackage: (state, payload) => {
            state.redPackageList = payload
        },
        setCurrentLottery: (state, payload) => {
            state.currentLottery = payload
        },
        setCurrentSign: (state, payload) => {
            state.currentSign = payload
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
} as Module<DynamicObject, DynamicObject>
