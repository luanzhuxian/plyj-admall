import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)
export default [
    {
        path: '/user-center',
        redirect: '/user-center/member-manage/member-manage-list',
        name: 'UserCenter',
        component: () => import('../../../views/user-center/Index.vue'),
        children: [
            ...importFiles(context)
        ]
    }
]
