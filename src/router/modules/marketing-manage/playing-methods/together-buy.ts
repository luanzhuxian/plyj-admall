export default [
    {
        path: 'together-buy',
        name: 'TogetherBuy',
        redirect: '/marketing-manage/together-buy/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Index.vue'),
        meta: {
            title: '众志成团',
            index: '8-8'
        },
        children: [
            {
                path: 'list',
                name: 'TogetherBuyList',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Together-Buy-List.vue'),
                meta: {
                    title: '列表',
                    index: '8-8-1'
                }
            },
            {
                path: 'add',
                name: 'AddTogether',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Add-Together.vue'),
                props: true,
                meta: {
                    title: '新增众志成团',
                    index: '8-8-2'
                }
            },
            {
                path: 'edit/:id?',
                name: 'EditTogether',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Add-Together.vue'),
                props: true,
                meta: {
                    title: '编辑众志成团',
                    index: '8-8-3'
                }
            },
            {
                path: 'detail/:id',
                name: 'TogetherBuyDetail',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Together-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '查看详情',
                    index: '8-8-4'
                }
            },
            {
                path: 'data/:id',
                name: 'TogetherBuyData',
                component: () => import('../../../../views/marketing-manage/playing-methods/together-buy/Together-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据',
                    index: '8-8-5'
                }
            }
        ]
    }
]
