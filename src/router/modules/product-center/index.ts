import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)
export default [
    {
        path: '/product-center',
        name: 'ProductCenter',
        component: () => import('../../../views/product-center/Index.vue'),
        children: [
            ...importFiles(context)
        ]
    }
]
