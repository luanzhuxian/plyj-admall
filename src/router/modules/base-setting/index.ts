import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)

export default [
    {
        path: '/base-setting',
        name: 'BaseSetting',
        redirect: '/base-setting/account-manage',
        component: () => import('../../../views/base-setting/Index.vue'),
        meta: {
            index: '7',
            title: '基础设置'
        },
        children: [
            ...importFiles(context)
        ]
    }
]
