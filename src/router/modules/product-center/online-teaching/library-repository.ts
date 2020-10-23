export default [
    {
        path: 'library-repository',
        name: 'LibraryRepository',
        redirect: '/product-center/online-teaching/library-repository/list',
        component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/Index.vue'),
        meta: {
            title: '资源库',
            index: '2-1-8'
        },
        children: [
            {
                path: 'list',
                name: 'VideoRepository',
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/pages/List.vue'),
                meta: {
                    title: '列表',
                    index: '2-1-8-1'
                }
            },
            {
                path: 'detail/:id',
                name: 'VideoRepositoryDetail',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/pages/Detail.vue'),
                meta: {
                    title: '查看详情',
                    index: '2-1-8-2'
                }
            },
            {
                path: 'buy-now/:id',
                name: 'VideoRepositoryBuyNow',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-repository/pages/Buy-Now.vue'),
                meta: {
                    title: '立即购买',
                    index: '2-1-8-3'
                }
            }
        ]
    }
]
