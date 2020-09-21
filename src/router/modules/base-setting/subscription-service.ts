export default [
    {
        path: 'subscription-service',
        name: 'SubscriptionService',
        redirect: '/base-setting/subscription-service/live-service-order',
        component: () => import('../../../views/base-setting/subscription-service/Index.vue'),
        meta: {
            title: '我的订购服务'
        },
        children: [
            {
                path: 'live-service-order',
                name: 'LiveServiceOrder',
                component: () => import('../../../views/base-setting/subscription-service/pages/Live-Service-Order.vue'),
                meta: {
                    title: '直播套餐订单'
                }
            },
            {
                path: 'source-service-order',
                name: 'SourceServiceOrder',
                component: () => import('../../../views/base-setting/subscription-service/pages/Source-Service-Order.vue'),
                meta: {
                    title: '资源库'
                }
            },
            {
                path: 'marketing-service-order',
                name: 'MarketingServiceOrder',
                component: () => import('../../../views/base-setting/subscription-service/pages/Marketing-Service-Order.vue'),
                meta: {
                    title: '营销方案订单'
                }
            },
            {
                path: 'detail/:id?',
                name: 'SourceServiceOrderDetail',
                component: () => import('../../../views/base-setting/subscription-service/pages/Detail.vue'),
                meta: {
                    title: '资源库详情'
                }
            }
        ]
    }
]
