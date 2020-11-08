import { Module } from 'vuex'
import { MutationTypes } from '../mutation-type'
import { getRoomStatus } from '../../apis/product-center/online-teaching/live'

export default {
    namespaced: true,
    state: {
        // 是否已经开通直播
        hasLiveModule: false
    },
    mutations: {
        [MutationTypes.hasLiveModule]: (state, payload) => {
            // 3 未开通
            state.hasLiveModule = payload !== 3
        }
    },
    actions: {
        [MutationTypes.hasLiveModule]: async ({ commit }) => {
            const { result: { enable } } = await getRoomStatus()
            commit(MutationTypes.hasLiveModule, enable)
        }
    },
    getters: {
        hasLiveModule: state => state.hasLiveModule
    }
} as Module<DynamicObject, DynamicObject>
