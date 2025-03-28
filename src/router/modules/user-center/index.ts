import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)
export default [
    {
        path: '/user-center',
        name: 'UserCenter',
        component: () => import('../../../views/user-center/Index.vue'),
        meta: {
            title: '用户中心',
            index: '3'
        },
        children: [
            ...importFiles(context)
        ]
    }
]
