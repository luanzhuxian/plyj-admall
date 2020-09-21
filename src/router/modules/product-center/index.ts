import { importFiles } from './../../../assets/ts/utils'

const context = require.context('./', true, /\/((?!index).)+\.ts$/)
export default [
    {
        path: '/product-center',
        name: 'ProductCenter',
        meta: {
            title: '产品中心'
        },
        redirect: '/product-center/goods-manage/my-goods',
        component: () => import('../../../views/product-center/Index.vue'),
        children: importFiles(context)
    }
]
