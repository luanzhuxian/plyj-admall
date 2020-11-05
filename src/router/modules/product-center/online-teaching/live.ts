export default [
    {
        path: 'live',
        name: 'Live',
        component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/Index.vue'),
        redirect: '/product-center/online-teaching/live/workbench',
        meta: {
            title: '互动直播',
            index: '2-1-3'
        },
        children: [
            {
                path: 'workbench',
                name: 'Workbench',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Workbench.vue'),
                meta: {
                    title: '工作台',
                    index: '2-1-3-1'
                }
            },
            {
                path: 'previous-list',
                name: 'LivePreviousList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Live-Previous-List.vue'),
                meta: {
                    title: '往期直播',
                    index: '2-1-3-2'
                }
            },
            {
                path: 'now-list',
                name: 'LiveNowList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Live-Now-List.vue'),
                meta: {
                    title: '直播工作台',
                    index: '2-1-3-3'
                }
            },
            {
                path: 'video-download',
                name: 'VideoDownload',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Video-Download.vue'),
                props: true,
                meta: {
                    title: '视频下载',
                    index: '2-1-3-4'
                }
            },
            {
                path: 'data-detail/:id/:liveMode',
                name: 'WatchDetail',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Watch-Detail.vue'),
                props: true,
                meta: {
                    title: '数据查看',
                    index: '2-1-3-5'
                }
            },
            {
                path: 'detail/:id',
                name: 'LiveDetail',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Detail.vue'),
                props: true,
                meta: {
                    title: '直播详情',
                    index: '2-1-3-6'
                }
            },
            {
                path: 'add',
                name: 'AddLive',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Add-live.vue'),
                props: true,
                meta: {
                    title: '添加直播',
                    index: '2-1-3-7'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditLive',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Add-live.vue'),
                props: true,
                meta: {
                    title: '编辑直播',
                    index: '2-1-3-8'
                }
            },
            {
                path: 'statistics/:roomId?',
                name: 'LiveStatistics',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Live-Statistics.vue'),
                props: true,
                meta: {
                    title: '数据统计',
                    index: '2-1-3-9'
                }
            }
        ]
    }
]
