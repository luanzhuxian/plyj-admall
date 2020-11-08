import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import user from './modules/user'
import goods from './modules/goods'
import mall from './modules/mall'
import account from './modules/account'
import onlineTeaching from './modules/online-teaching'

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
        account,
        onlineTeaching
    },
    state,
    mutations,
    actions,
    getters
}

export default new Vuex.Store(option)
