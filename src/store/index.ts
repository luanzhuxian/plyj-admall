import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import user from './modules/user'
import goods from './modules/goods'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const option: StoreOptions<DynamicObject> = {
    modules: {
        user,
        goods
    },
    state,
    mutations,
    actions,
    getters
}

export default new Vuex.Store(option)
