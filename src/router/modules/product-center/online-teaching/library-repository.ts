export default [
    {
        path: 'library-repository',
        name: 'LibraryRepository',
        redirect: '/product-center/online-teaching/library-repository/list',
        component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/Index.vue'),
        meta: {
            title: '资源库'
        },
        children: [
            {
                path: 'list',
                name: 'VideoRepository',
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/pages/List.vue'),
                meta: {
                    title: '列表'
                }
            },
            // 详情
            {
                path: '/product-center/online-teaching/library-repository/detail/:id',
                name: 'VideoRepositoryDetail',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/pages/Detail.vue'),
                meta: {
                    title: '查看详情'
                }
            },
            {
                path: '/product-center/online-teaching/library-repository/buy-now/:id',
                name: 'VideoRepositoryBuyNow',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/pages/Buy-Now.vue'),
                meta: {
                    title: '立即购买'
                }
            }
        ]
    }
]
