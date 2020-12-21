export default [
    {
        path: 'lottery',
        name: 'LongmenLottery',
        redirect: 'lottery/list',
        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/lottery/Index.vue'),
        meta: {
            title: '龙门抽大奖',
            index: '8-12'
        },
        children: [
            {
                path: 'list',
                name: 'LongmenLotteryList',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/lottery/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-12-1'
                }
            },
            // 之所以添加也有id，是因为存在复制这么一种情况
            // {
            //     path: 'add/:id?',
            //     props: true,
            //     name: 'AddLongmenLottery',
            //     component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/lottery/Add.vue'),
            //     meta: {
            //         title: '新建活动',
            //         index: '8-12-2'
            //     }
            // },
            // {
            //     path: 'edit/:id',
            //     name: 'EditLongmenLottery',
            //     props: true,
            //     component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/lottery/Add.vue'),
            //     meta: {
            //         title: '编辑活动',
            //         index: '8-12-3'
            //     }
            // },
            {
                path: 'detail/:id',
                name: 'LongmenLotteryDetail',
                redirect: 'detail/:id/info',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/lottery/Detail.vue'),
                props: true,
                meta: {
                    title: '活动详情',
                    index: '8-12-4'
                },
                children: [
                    {
                        path: 'info',
                        name: 'LongmenLotteryInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/lottery/Detail-Info.vue'),
                        props: true,
                        meta: {
                            ignore: true
                        }
                    },
                    {
                        path: 'data',
                        name: 'LongmenLotteryData',
                        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/lottery/Detail-Data.vue'),
                        props: true,
                        meta: {
                            title: '活动数据',
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
