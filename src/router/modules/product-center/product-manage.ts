export default [
    {
        path: 'goods-manage',
        redirect: '/product-center/goods-manage/my-goods',
        name: 'GoodsManage',
        component: () => import('../../../views/product-center/product-manage/Index.vue'),
        meta: {
            title: '我的商品'
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
            },
            {
                path: 'recommend',
                name: 'Recommend',
                component: () => import('../../../views/product-center/product-manage/pages/Recommend.vue'),
                meta: {
                    title: '推荐榜单'
                },
                children: [
                    {
                        path: 'recommend-goods',
                        name: 'RecommendGoods',
                        meta: {
                            title: '商品推荐榜单'
                        }
                    },
                    {
                        path: 'recommend-course',
                        name: 'RecommendCourse',
                        meta: {
                            title: '课程推荐榜单'
                        }
                    }
                ]
            }
        ]
    }
]
