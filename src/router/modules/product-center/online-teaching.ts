export default [
    {
        path: 'online-teaching',
        component: () => import('../../../views/product-center/online-teaching/Index.vue'),
        name: 'LineTeaching',
        redirect: '/product-center/online-teaching/function-pack',
        meta: {
            title: '云课堂',
            requiresAuth: true
        },
        children: [
            {
                path: 'function-pack',
                name: 'FunctionPack',
                component: () => import('../../../views/product-center/online-teaching/pages/Function-Pack.vue'),
                meta: {
                    title: '方案包'
                }
            },
            {
                path: 'live',
                name: 'Live',
                component: () => import('./../../../views/product-center/online-teaching/pages/live-video/Index.vue'),
                redirect: '/product-center/online-teaching/live/workbench',
                meta: {
                    title: '互动直播'
                },
                children: [
                    {
                        path: 'workbench',
                        name: 'Workbench',
                        component: () => import('./../../../views/product-center/online-teaching/pages/live-video/pages/Workbench.vue'),
                        meta: {
                            title: '工作台'
                        }
                    },
                    {
                        path: 'previous-list',
                        name: 'LivePreviousList',
                        component: () => import('./../../../views/product-center/online-teaching/pages/live-video/pages/Live-Previous-List.vue'),
                        meta: {
                            title: '往期直播' // 往期直播
                        }
                    },
                    {
                        path: 'now-list',
                        name: 'LiveNowList',
                        component: () => import('./../../../views/product-center/online-teaching/pages/live-video/pages/Live-Now-List.vue'),
                        meta: {
                            title: '近期直播' // 近期直播
                        }
                    }
                    // {
                    //     path: 'video-download',
                    //     name: 'VideoDownload',
                    //     component: () => import('../views/line-teaching/live-video/Video-Download.vue'),
                    //     props: true,
                    //     meta: {
                    //         title: '视频下载'
                    //     }
                    // },
                    // {
                    //     path: 'coupon/:id',
                    //     name: 'LiveCoupon',
                    //     component: () => import('../views/line-teaching/live-video/Coupon.vue'),
                    //     meta: {
                    //         title: '优惠券'
                    //     }
                    // },
                    // {
                    //     path: 'data-detail/:id/:liveMode',
                    //     name: 'WatchDetail',
                    //     component: () => import('../views/line-teaching/live-video/Watch-Detail.vue'),
                    //     props: true,
                    //     meta: {
                    //         title: '数据查看'
                    //     }
                    // },
                    // {
                    //     path: 'detail/:id',
                    //     name: 'LiveDetail',
                    //     component: () => import('../views/line-teaching/live-video/Detail.vue'),
                    //     props: true,
                    //     meta: {
                    //         title: '直播详情'
                    //     }
                    // },
                    // {
                    //     path: 'add',
                    //     name: 'AddLive',
                    //     component: () => import('../views/line-teaching/live-video/Add-live.vue'),
                    //     props: true,
                    //     meta: {
                    //         title: '添加直播'
                    //     }
                    // },
                    // {
                    //     path: 'edit/:id',
                    //     name: 'EditLive',
                    //     component: () => import('../views/line-teaching/live-video/Add-live.vue'),
                    //     props: true,
                    //     meta: {
                    //         title: '编辑直播'
                    //     }
                    // },
                    // {
                    //     path: 'statistics/:roomId?',
                    //     name: 'LiveStatistics',
                    //     component: () => import('../views/line-teaching/live-video/Live-Statistics.vue'),
                    //     props: true,
                    //     meta: {
                    //         title: '数据统计'
                    //     }
                    // }
                ]
            }
        ]
    }
]
