import { router } from '../router'
import store from '../store'
import actions from './shared/actions'
export default [
    {
        name: 'admall',
        entry: '//localhost:8000',
        container: '#child-app',
        activeRule: '/admall',
        props: {
            MAIN_ROUTER: router,
            MAIN_STORE: store,
            MAIN_ACTIONS: actions
        }
    }
]
