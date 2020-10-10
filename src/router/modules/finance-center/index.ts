import { importFiles } from './../../../assets/ts/utils'
const context = require.context('./', false, /\/((?!index).)+\.ts$/)
export default [
    {
        path: '/finance-center',
        name: 'FinanceCenter',
        component: () => import('../../../views/finance-center/Index.vue'),
        meta: {
            title: '财务中心',
            index: '5'
        },
        children: [
            ...importFiles(context)
        ]
    }
]
