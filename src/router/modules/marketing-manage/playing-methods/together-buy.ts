export default [
    {
        path: 'together-buy',
        name: 'NewYearTogetherBuy',
        redirect: '/marketing-manage/together-buy/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Index.vue'),
        meta: {
            title: '众志成团'
        },
        children: [
            {
                path: 'add-together/:id?',
                name: 'NewYearAddTogether',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Add-Together.vue'),
                props: true,
                meta: {
                    title: '新增/编辑众志成团'
                }
            },
            {
                path: 'list',
                name: 'NewYearTogetherBuyList',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Together-Buy-List.vue')
            },
            {
                path: 'detail/:id',
                name: 'NewYearTogetherBuyDetail',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Together-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '众志成团详情'
                }
            },
            {
                path: 'data/:id',
                name: 'NewYearTogetherBuyData',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Together-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据'
                }
            }
        ]
    }
]
