import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', false, /\/((?!index).)+\.ts$/)
console.log(context)
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
