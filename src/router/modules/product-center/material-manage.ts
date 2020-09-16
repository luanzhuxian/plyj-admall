export default [
    {
        path: 'material-manage',
        name: 'MaterialManage',
        redirect: '/product-center/material-manage/video-library',
        component: () => import('../../../views/product-center/material-manage/Index.vue'),
        children: [
            {
                path: 'video-library',
                name: 'VideoLibrary',
                component: () => import('../../../views/product-center/material-manage/video-library/Index.vue'),
                redirect: '/product-center/material-manage/video-library/list',
                meta: {
                    title: '视频库'
                },
                children: [
                    {
                        path: 'List',
                        name: 'VideoLibraryList',
                        component: () => import('../../../views/product-center/material-manage/video-library/pages/List.vue')
                    },
                    {
                        path: 'recycle-bin',
                        name: 'RecycleBin',
                        component: () => import('../../../views/product-center/material-manage/video-library/pages/Recycle-Bin.vue'),
                        meta: {
                            title: '回收站'
                        }
                    }
                ]
            },
            {
                path: 'repository-library',
                name: 'RepositoryLibrary',
                component: () => import('../../../views/product-center/material-manage/repository/Index.vue'),
                redirect: '/product-center/material-manage/repository-library/list',
                meta: {
                    title: '资源库'
                },
                children: [
                    {
                        path: 'list',
                        name: 'RepositoryLibraryList',
                        component: () => import('../../../views/product-center/material-manage/repository/pages/List.vue')
                    },
                    {
                        path: 'detail/:id',
                        name: 'VideoRepositoryDetail',
                        props: true,
                        component: () => import('../../../views/product-center/material-manage/repository/pages/Detail.vue'),
                        meta: {
                            title: '查看详情'
                        }
                    },
                    {
                        path: 'buy-now/:id',
                        name: 'VideoRepositoryBuyNow',
                        props: true,
                        component: () => import('../../../views/product-center/material-manage/repository/pages/Buy-Now.vue'),
                        meta: {
                            title: '立即购买'
                        }
                    }
                ]
            }
        ]
    }
]
