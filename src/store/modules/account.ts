import { getmMrketStatuAuth } from '../../apis/marketing-manage/gameplay'
import { Module } from 'vuex'
import { MutationTypes } from '@/store/mutation-type'

const account: Module<DynamicObject, DynamicObject> = {
    state: {
        marketStatusAuth: []
    },
    mutations: {
        [MutationTypes.getMarketStatusAuth] (state, payload) {
            state.marketStatusAuth = payload
        }
    },
    actions: {
        async [MutationTypes.getMarketStatusAuth] ({ commit }) {
            try {
                const { result } = await getmMrketStatuAuth()
                commit(MutationTypes.getMarketStatusAuth, result)
            } catch (e) {
                throw e
            }
        }
    },
    getters: {
    // 营销中心公共活动信息及状态
        marketStatusAuth: state => state.marketStatusAuth
    }
}
export default {
    namespaced: true,
    ...account
}
