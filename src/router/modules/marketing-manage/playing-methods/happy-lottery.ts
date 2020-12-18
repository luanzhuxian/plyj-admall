export default [
    {
        path: 'happy-lottery',
        name: 'HappyLottery',
        redirect: 'happy-lottery/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/happy-lottery/Index.vue'),
        meta: {
            title: '抽奖乐翻天',
            index: '8-21'
        },
        children: [
            {
                path: 'list',
                name: 'HappyLotteryList',
                component: () => import('../../../../views/marketing-manage/playing-methods/happy-lottery/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-21-1'
                }
            },
            // 之所以添加也有id，是因为存在复制这么一种情况
            {
                path: 'add/:id?',
                props: true,
                name: 'AddHappyLottery',
                component: () => import('../../../../views/marketing-manage/playing-methods/happy-lottery/Add.vue'),
                meta: {
                    title: '新建活动',
                    index: '8-21-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditHappyLottery',
                props: true,
                component: () => import('../../../../views/marketing-manage/playing-methods/happy-lottery/Add.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-21-3'
                }
            },
            {
                path: 'detail/:id',
                name: 'HappyLotteryDetail',
                component: () => import('../../../../views/marketing-manage/playing-methods/happy-lottery/Detail.vue'),
                props: true,
                meta: {
                    title: '活动详情',
                    index: '8-21-4'
                },
                children: [
                    {
                        path: 'info',
                        name: 'HappyLotteryInfo',
                        component: () => import('../../../../views/marketing-manage/playing-methods/happy-lottery/Detail-Info.vue'),
                        props: true,
                        meta: {
                            index: '8-21-4-1'
                        }
                    },
                    {
                        path: 'data',
                        name: 'HappyLotteryData',
                        component: () => import('../../../../views/marketing-manage/playing-methods/happy-lottery/Detail-Data.vue'),
                        props: true,
                        meta: {
                            title: '活动数据',
                            index: '8-21-4-2'
                        }
                    }
                ]
            }
        ]
    }
]
