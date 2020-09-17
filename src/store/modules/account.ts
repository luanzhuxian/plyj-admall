import * as types from './../mutation-type'
import { getmMrketStatuAuth } from '../../apis/marketing-manage/gameplay'
import { Module } from 'vuex'

const account: Module<DynamicObject, DynamicObject> = {
    state: {
        mrketStatuAuth: []
    },
    mutations: {
        [types.GET_MRKET_STATU_AUTH] (state, payload) {
            state.mrketStatuAuth = payload
        }
    },
    actions: {
        async [types.GET_MRKET_STATU_AUTH] ({ commit }) {
            try {
                const { result } = await getmMrketStatuAuth()
                commit(types.GET_MRKET_STATU_AUTH, result)
            } catch (e) {
                throw e
            }
        }
    },
    getters: {
    // 营销中心公共活动信息及状态
        mrketStatuAuth: state => state.mrketStatuAuth
    }
}
export default {
    namespaced: true,
    ...account
}
