export default [
    {
        path: 'second-buy',
        name: 'SecondBuy',
        redirect: '/marketing-manage/second-buy/list',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/second-buy/Index.vue'),
        meta: {
            title: ''
        },
        children: [
            {
                path: 'add-second/:id?',
                name: 'AddSecond',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/second-buy/Add-Second.vue'),
                props: true,
                meta: {
                    title: '新增/编辑秒杀'
                }
            },
            {
                path: 'list',
                name: 'SecondBuyList',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/second-buy/Second-Buy-List.vue'),
                meta: {
                    title: '秒杀',
                    id: ''
                }
            },
            {
                path: 'setting',
                name: 'SecondBuySetting',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/second-buy/Second-Buy-Setting.vue'),
                meta: {
                    title: '秒杀设置',
                    id: ''
                }
            },
            {
                path: 'detail/:id',
                name: 'SecondBuyDetail',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/second-buy/Second-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '活动详情',
                    id: ''
                }
            },
            {
                path: 'data/:id',
                name: 'SecondBuyData',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/second-buy/Second-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据',
                    id: ''
                }
            }
        ]
    }
]
