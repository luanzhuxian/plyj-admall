import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)

export default [
    {
        path: '/base-setting',
        name: 'BaseSetting',
        component: () => import('../../../views/base-setting/Index.vue'),
        meta: {
            index: '6'
        },
        children: [
            ...importFiles(context)
        ]
    }
]
