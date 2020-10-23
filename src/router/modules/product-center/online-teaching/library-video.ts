export default [
    {
        path: 'library-video',
        name: 'LibraryVideo',
        redirect: '/product-center/online-teaching/library-video/list',
        component: () => import('./../../../../views/product-center/online-teaching/pages/library-video/Index.vue'),
        meta: {
            title: '视频库',
            index: '2-1-7'
        },
        children: [
            {
                path: 'list',
                name: 'VideoLibraryList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-video/pages/List.vue'),
                meta: {
                    title: '列表',
                    index: '2-1-7-1'
                }
            },
            {
                path: 'recycle-bin',
                name: 'RecycleBin',
                component: () => import('./../../../../views/product-center/online-teaching/pages/library-video/pages/Recycle-Bin.vue'),
                meta: {
                    title: '回收站',
                    index: '2-1-7-2'
                }
            }
        ]
    }
]
