export default [
    {
        path: '/phone-login',
        redirect: '/phone-login',
        name: 'PhoneLogin',
        component: () => import('../views/user-center/Index.vue'),
        meta: {
            title: '登陆'
        },
        children: [
            {
                path: '/wx-login',
                name: 'WxLogin',
                component: () => import('../views/login/Login.vue'),
                meta: {
                    title: '微信登录'
                }
            },
            {
                path: '/password-login',
                name: 'PasswordLogin',
                component: () => import('../views/login/Login.vue'),
                meta: {
                    title: '密码登录'
                }
            },
            {
                path: '/phone-login',
                name: 'PhoneLogin',
                component: () => import('../views/login/Login.vue'),
                meta: {
                    title: '验证码登录'
                }
            },
            {
                path: '/wx-bind-password',
                name: 'WxBindPassword',
                component: () => import('../views/login/Login.vue'),
                meta: {
                    title: '账户绑定'
                }
            },
            {
                path: '/wx-bind-phone',
                name: 'WxBindPhone',
                component: () => import('../views/login/Login.vue'),
                meta: {
                    title: '手机绑定'
                }
            }
        ]
    }
]
