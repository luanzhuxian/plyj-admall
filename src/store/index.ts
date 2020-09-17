import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import user from './modules/user'
import goods from './modules/goods'
import mall from './modules/mall-manage'
import account from './modules/account'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const option: StoreOptions<DynamicObject> = {
    modules: {
        user,
        goods,
        mall,
        account
    },
    state,
    mutations,
    actions,
    getters
}

export default new Vuex.Store(option)
