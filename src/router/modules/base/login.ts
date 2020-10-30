import Login from '../../../views/login/Login.vue'
export default [
    {
        path: '/login',
        redirect: '/login/phone-login',
        name: 'Login',
        component: Login,
        meta: {
            title: '登录',
            ignore: true
        },
        children: [
            {
                path: 'wx-login',
                name: 'WxLogin',
                component: () => import('../../../views/login/components/Wx-Login.vue'),
                meta: {
                    title: '微信登录',
                    ignore: true
                }
            },
            {
                path: 'password-login',
                name: 'PasswordLogin',
                component: () => import('../../../views/login/components/Password-Login.vue'),
                meta: {
                    title: '密码登录',
                    ignore: true
                }
            },
            {
                path: 'phone-login',
                name: 'PhoneLogin',
                component: () => import('../../../views/login/components/Phone-Login.vue'),
                meta: {
                    title: '验证码登录',
                    ignore: true
                }
            },
            {
                path: 'wx-bind-password',
                name: 'WxBindPassword',
                component: () => import('../../../views/login/components/Wx-Bind-Password.vue'),
                meta: {
                    title: '账户绑定',
                    ignore: true
                }
            },
            {
                path: 'wx-bind-phone',
                name: 'WxBindPhone',
                component: () => import('../../../views/login/components/Wx-Bind-Phone.vue'),
                meta: {
                    title: '手机绑定',
                    ignore: true
                }
            },
            {
                path: 'complete-login',
                name: 'CompleteLogin',
                component: () => import('../../../views/login/components/Complete-Login.vue'),
                meta: {
                    title: '完善资料',
                    ignore: true
                }
            }
        ]
    }
]
