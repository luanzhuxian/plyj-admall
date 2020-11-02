import { importFiles } from './../../../assets/ts/utils'
import onlineTeaching from './online-teaching/online-teaching'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)

export default [
    {
        path: '/product-center',
        name: 'ProductCenter',
        component: () => import('../../../views/product-center/Index.vue'),
        meta: {
            title: '产品中心',
            index: '2'
        },
        children: [
            ...importFiles(context),
            ...onlineTeaching
        ]
    }
]
