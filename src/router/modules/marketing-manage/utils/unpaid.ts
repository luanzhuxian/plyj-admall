export default [
    {
        path: 'marketing-unpaid',
        name: 'MarketingUnpaid',
        redirect: '/marketing-manage/unpaid/marketing-unpaid-detail',
        component: () => import('../../../../views/marketing-manage/unpaid/Index.vue'),
        meta: {
            title: ''
        },
        children: [
            {
                path: '/marketing-manage/marketing-unpaid-detail/:programId',
                name: 'MarketingUnpaidDetail',
                props: true,
                component: () => import('../../../../views/marketing-manage/unpaid/pages/Marketing-Unpaid-Detail.vue'),
                meta: {
                    title: '查看详情'
                }
            },
            {
                path: '/marketing-manage/marketing-pay/:programId',
                name: 'MarketingPay',
                props: true,
                component: () => import('../../../../views/marketing-manage/unpaid/pages/Marketing-Pay.vue'),
                meta: {
                    title: '购买详情'
                }
            }
        ]
    }
]
