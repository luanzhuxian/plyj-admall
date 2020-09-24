import { importFiles } from './../../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!onliine-teaching).)+\.ts$/)

export default [
    {
        path: 'online-teaching',
        component: () => import('../../../../views/product-center/online-teaching/Index.vue'),
        name: 'LineTeaching',
        redirect: '/product-center/online-teaching/function-pack',
        meta: {
            title: '云课堂',
            requiresAuth: true
        },
        children: [
            {
                path: 'function-pack',
                name: 'FunctionPack',
                component: () => import('../../../../views/product-center/online-teaching/pages/Function-Pack.vue'),
                meta: {
                    title: '方案包'
                }
            },
            ...importFiles(context)
        ]
    }
]
