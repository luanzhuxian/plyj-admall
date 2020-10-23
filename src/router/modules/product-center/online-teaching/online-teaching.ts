import { importFiles } from '../../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!online-teaching).)+\.ts$/)

export default [
    {
        path: 'online-teaching',
        component: () => import('../../../../views/product-center/online-teaching/Index.vue'),
        name: 'LineTeaching',
        redirect: '/product-center/online-teaching/function-pack',
        meta: {
            title: '云课堂',
            index: '2-1'
        },
        children: [
            {
                path: 'function-pack',
                name: 'FunctionPack',
                component: () => import('../../../../views/product-center/online-teaching/pages/Function-Pack.vue'),
                meta: {
                    index: '2-1-1'
                }
            },
            {
                path: 'set-meal/:isRenew',
                name: 'SetMeal',
                component: () => import('../../../../views/product-center/online-teaching/pages/Set-Meal.vue'),
                meta: {
                    title: '开通直播',
                    index: '2-1-2'
                }
            },
            ...importFiles(context)
        ]
    }
]
