import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)

export default [
    {
        path: '/base-setting',
        name: 'BaseSetting',
        redirect: '/base-setting/wechat/wechat-auth',
        component: () => import('../../../views/base-setting/Index.vue'),
        meta: {
            index: '7'
        },
        children: [
            ...importFiles(context)
        ]
    }
]
