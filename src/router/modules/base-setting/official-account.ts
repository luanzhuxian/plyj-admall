export default [
    {
        path: 'wechat',
        name: 'Wechat',
        // redirect: '/base-setting/wechat/wechat-auth',
        component: () => import('../../../views/base-setting/official-account/Index.vue'),
        meta: {
            title: '公众号服务',
            index: '7-3'
        },
        children: [
            {
                path: 'wechat-auth',
                name: 'WechatAuth',
                component: () => import('../../../views/base-setting/official-account/pages/Wechat-Auth.vue'),
                meta: {
                    title: '商城授权',
                    index: '7-3-1',
                    ignore: true
                }
            }
            // {
            //     path: 'wechat-pay',
            //     name: 'WechatPay',
            //     component: () => import('../../../views/base-setting/official-account/pages/Wechat-Pay.vue'),
            //     meta: {
            //         title: '微信支付开通',
            //         index: '7-3-2',
            //         ignore: true
            //     }
            // },
            // {
            //     path: 'yaji-authenticate',
            //     name: 'YajiAuthenticate',
            //     component: () => import('../../../views/base-setting/official-account/pages/Yaji-Auth.vue'),
            //     meta: {
            //         title: '雅集认证',
            //         index: '7-3-3',
            //         ignore: true
            //     }
            // }
        ]
    }
]
