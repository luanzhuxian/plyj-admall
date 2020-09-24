import { importFiles } from './../../../assets/ts/utils'
import onlineTeaching from './online-teaching/onliine-teaching'

const context = require.context('./', false, /\/(((?!index)(?!online-teaching)).)+\.ts$/)

export default [
    {
        path: '/product-center',
        name: 'ProductCenter',
        meta: {
            title: '产品中心'
        },
        redirect: '/product-center/goods-manage/my-goods',
        component: () => import('../../../views/product-center/Index.vue'),
        children: [
            ...importFiles(context),
            ...onlineTeaching
        ]
    }
]
