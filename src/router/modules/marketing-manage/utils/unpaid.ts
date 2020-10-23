export default [
    {
        path: 'marketing-unpaid/detail/:programId',
        name: 'MarketingUnpaidDetail',
        props: true,
        component: () => import('../../../../views/marketing-manage/unpaid/pages/Marketing-Unpaid-Detail.vue'),
        meta: {
            title: '立即订购',
            ignore: true
        }
    },
    {
        path: 'marketing-unpaid/pay/:programId',
        name: 'MarketingPay',
        props: true,
        component: () => import('../../../../views/marketing-manage/unpaid/pages/Marketing-Pay.vue'),
        meta: {
            title: '购买详情',
            ignore: true
        }
    }
]
