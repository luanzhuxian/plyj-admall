import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', true, /\/((?!index).)+\.ts$/)
export default [
    {
        path: '/product-center',
        name: 'ProductCenter',
        meta: {
            name: '产品中心'
        },
        component: () => import('../../../views/product-center/Index.vue'),
        children: importFiles(context)
    }
]
