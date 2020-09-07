export default [
    {
        path: '/marketing-manage',
        redirect: '/marketing-manage/marketing-gameplay-list/classmate',
        name: 'MarketingManage',
        component: () => import('../../views/marketing-manage/index.vue'),
        meta: {
            title: '营销中心'
        },
        children: [
            {
                path: 'marketing-gameplay-list/classmate',
                name: 'MarketingGameplayList',
                component: () => import('../../views/marketing-manage/pages/gameplay/index.vue'),
                meta: {
                    title: '营销方案'
                }
            }
        ]
    }
]
