export default [
    {
        path: 'second-buy',
        name: 'SecondBuy',
        redirect: '/marketing-manage/second-buy/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/second-buy/Index.vue'),
        meta: {
            title: '秒杀',
            index: '8-9'
        },
        children: [
            {
                path: 'list',
                name: 'SecondBuyList',
                component: () => import('../../../../views/marketing-manage/playing-methods/second-buy/Second-Buy-List.vue'),
                meta: {
                    title: '列表',
                    index: '8-9-1'
                }
            },
            {
                path: 'add/:id?',
                name: 'AddSecond',
                component: () => import('../../../../views/marketing-manage/playing-methods/second-buy/Add-Second.vue'),
                props: true,
                meta: {
                    title: '新增秒杀',
                    index: '8-9-2'
                }
            },
            {
                path: 'edit/:id?',
                name: 'EditSecond',
                component: () => import('../../../../views/marketing-manage/playing-methods/second-buy/Add-Second.vue'),
                props: true,
                meta: {
                    title: '编辑秒杀',
                    index: '8-9-3'
                }
            },
            {
                path: 'setting',
                name: 'SecondBuySetting',
                component: () => import('../../../../views/marketing-manage/playing-methods/second-buy/Second-Buy-Setting.vue'),
                meta: {
                    title: '秒杀设置',
                    index: '8-9-4'
                }
            },
            {
                path: 'detail/:id',
                name: 'SecondBuyDetail',
                component: () => import('../../../../views/marketing-manage/playing-methods/second-buy/Second-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '查看详情',
                    index: '8-9-5'
                }
            },
            {
                path: 'data/:id',
                name: 'SecondBuyData',
                component: () => import('../../../../views/marketing-manage/playing-methods/second-buy/Second-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据',
                    index: '8-9-6'
                }
            }
        ]
    }
]
