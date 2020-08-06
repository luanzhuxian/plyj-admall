import { router } from '../router'
import store from '../store'
export default [
    {
        name: 'admall',
        entry: '//localhost:8000',
        container: '#child-app',
        activeRule: '/admall',
        props: {
            router,
            store
        }
    }
]
