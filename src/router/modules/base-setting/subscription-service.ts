export default [
    {
        path: 'subscription-service',
        name: 'SubscriptionService',
        component: () => import('../../../views/base-setting/subscription-service/Index.vue'),
        meta: {
            title: '我的订购服务',
            index: '7-5'
        },
        children: [
            {
                path: 'live-service-order',
                name: 'LiveServiceOrder',
                component: () => import('../../../views/base-setting/subscription-service/pages/Live-Service-Order.vue'),
                meta: {
                    title: '直播套餐订单',
                    index: '7-5-1'
                }
            },
            {
                path: 'source-service-order',
                name: 'SourceServiceOrder',
                component: () => import('../../../views/base-setting/subscription-service/pages/Source-Service-Order.vue'),
                meta: {
                    title: '资源库',
                    index: '7-5-2'
                }
            },
            {
                path: 'marketing-service-order',
                name: 'MarketingServiceOrder',
                component: () => import('../../../views/base-setting/subscription-service/pages/Marketing-Service-Order.vue'),
                meta: {
                    title: '营销方案订单',
                    index: '7-5-3'
                }
            },
            {
                path: 'detail/:id?',
                name: 'SourceServiceOrderDetail',
                component: () => import('../../../views/base-setting/subscription-service/pages/Detail.vue'),
                meta: {
                    title: '资源库详情',
                    index: '7-5-4'
                }
            }
        ]
    }
]
