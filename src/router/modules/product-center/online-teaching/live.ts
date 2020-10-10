export default [
    {
        path: 'live',
        name: 'Live',
        component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/Index.vue'),
        redirect: '/product-center/online-teaching/live/workbench',
        meta: {
            title: '互动直播'
        },
        children: [
            {
                path: '/product-center/online-teaching/live/set-meal/:isRenew',
                name: 'SetMeal',
                component: () => import('../../../../views/product-center/online-teaching/pages/Set-Meal.vue'),
                meta: {
                    title: '开通直播'
                }
            },
            {
                path: '/product-center/online-teaching/live/pay-and-order/:isRenew/:type?',
                name: 'PayAndOrder',
                props: true,
                component: () => import('../../../../views/product-center/online-teaching/pages/Pay-And-Order.vue'),
                meta: {
                    title: '流量套餐'
                }
            },
            {
                path: 'workbench',
                name: 'Workbench',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Workbench.vue'),
                meta: {
                    title: '工作台'
                }
            },
            {
                path: 'previous-list',
                name: 'LivePreviousList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Live-Previous-List.vue'),
                meta: {
                    title: '往期直播' // 往期直播
                }
            },
            {
                path: 'now-list',
                name: 'LiveNowList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Live-Now-List.vue'),
                meta: {
                    title: '直播工作台' // 直播工作台
                }
            },
            {
                path: 'video-download',
                name: 'VideoDownload',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Video-Download.vue'),
                props: true,
                meta: {
                    title: '视频下载'
                }
            },
            {
                path: 'data-detail/:id/:liveMode',
                name: 'WatchDetail',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Watch-Detail.vue'),
                props: true,
                meta: {
                    title: '数据查看'
                }
            },
            {
                path: 'detail/:id',
                name: 'LiveDetail',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Detail.vue'),
                props: true,
                meta: {
                    title: '直播详情'
                }
            },
            {
                path: 'add',
                name: 'AddLive',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Add-live.vue'),
                props: true,
                meta: {
                    title: '添加直播'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditLive',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Add-live.vue'),
                props: true,
                meta: {
                    title: '编辑直播'
                }
            },
            {
                path: 'statistics/:roomId?',
                name: 'LiveStatistics',
                component: () => import('./../../../../views/product-center/online-teaching/pages/live-video/pages/Live-Statistics.vue'),
                props: true,
                meta: {
                    title: '数据统计'
                }
            }
        ]
    }
]
