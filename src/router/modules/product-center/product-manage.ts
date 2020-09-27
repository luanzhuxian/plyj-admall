export default [
    {
        path: 'goods-manage',
        redirect: '/product-center/goods-manage/my-goods',
        name: 'GoodsManage',
        component: () => import('../../../views/product-center/product-manage/Index.vue'),
        meta: {
            title: '我的商品',
            index: '2-2'
        },
        children: [
            {
                path: 'my-goods/edit/:id',
                name: 'EditProduct',
                props: true,
                component: () => import('../../../views/product-center/product-manage/pages/Add-Product.vue'),
                meta: {
                    title: '编辑商品'
                }
            },
            {
                path: 'my-goods/add',
                name: 'AddProduct',
                props: true,
                component: () => import('../../../views/product-center/product-manage/pages/Add-Product.vue'),
                meta: {
                    title: '新增商品'
                }
            },
            {
                path: 'my-goods',
                name: 'MyGoods',
                component: () => import('../../../views/product-center/product-manage/pages/My-Goods.vue'),
                meta: {
                    title: ''
                }
            }
        ]
    }
]
