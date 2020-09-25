export default [
    {
        path: 'books-materials',
        name: 'BooksMaterials',
        redirect: '/product-center/online-teaching/books-materials/list',
        component: () => import('./../../../../views/product-center/online-teaching/pages/books-materials/Index.vue'),
        meta: {
            title: '图文资料'
        },
        children: [
            {
                path: 'list',
                name: 'BooksMaterialsList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/books-materials/pages/List.vue'),
                meta: {
                    title: '列表'
                }
            },
            {
                path: 'add',
                name: 'AddBooksMaterials',
                component: () => import('./../../../../views/product-center/online-teaching/pages/books-materials/pages/Add.vue'),
                meta: {
                    title: '新增图文资料'
                }
            },
            {
                path: '/product-center/online-teaching/books-materials/edit/:id',
                name: 'EditBooksMaterials',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/books-materials/pages/Add.vue'),
                meta: {
                    title: '编辑图文资料'
                }
            },
            {
                path: '/product-center/online-teaching/books-materials/data/:id',
                name: 'BooksMaterialsData',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/books-materials/pages/Data.vue'),
                meta: {
                    title: '数据详情'
                }
            }
        ]
    }
]
