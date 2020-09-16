export default [
    {
        path: 'wechat',
        name: 'Wechat',
        component: () => import('../../../views/base-setting/official-account/Index.vue'),
        meta: {
            title: '公众号设置'
        },
        children: [
            {
                path: 'bind',
                name: 'BindWechat',
                component: () => import('../../../views/base-setting/official-account/pages/Bind-Wechat.vue'),
                meta: {
                    title: '微信公众号绑定'
                },
                children: [
                    {
                        path: 'wechat-auth',
                        name: 'WechatAuth',
                        component: () => import('../../../views/base-setting/official-account/pages/Wechat-Auth.vue'),
                        meta: {
                            title: '微信服务号授权'
                        }
                    },
                    {
                        path: 'wechat-pay',
                        name: 'WechatPay',
                        component: () => import('../../../views/base-setting/official-account/pages/Wechat-Pay.vue'),
                        meta: {
                            title: '微信支付开通'
                        }
                    },
                    {
                        path: 'yaji-authenticate',
                        name: 'YajiAuthenticate',
                        component: () => import('../../../views/base-setting/official-account/pages/Yaji-Auth.vue'),
                        meta: {
                            title: '雅集认证'
                        }
                    }
                ]
            }
        ]
    }
]
