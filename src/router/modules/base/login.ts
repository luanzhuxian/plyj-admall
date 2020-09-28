import Login from '../../../views/login/Login.vue'
export default [
    {
        path: '/login',
        redirect: '/login/phone-login',
        name: 'Login',
        component: Login,
        meta: {
            title: '登录'
        },
        children: [
            {
                path: 'wx-login',
                name: 'WxLogin',
                component: () => import('../../../views/login/components/Wx-Login.vue'),
                meta: {
                    title: '微信登录'
                }
            },
            {
                path: 'password-login',
                name: 'PasswordLogin',
                component: () => import('../../../views/login/components/Password-Login.vue'),
                meta: {
                    title: '密码登录'
                }
            },
            {
                path: 'phone-login',
                name: 'PhoneLogin',
                component: () => import('../../../views/login/components/Phone-Login.vue'),
                meta: {
                    title: '验证码登录'
                }
            },
            {
                path: 'wx-bind-password',
                name: 'WxBindPassword',
                component: () => import('../../../views/login/components/Wx-Bind-Password.vue'),
                meta: {
                    title: '账户绑定'
                }
            },
            {
                path: 'wx-bind-phone',
                name: 'WxBindPhone',
                component: () => import('../../../views/login/components/Wx-Bind-Phone.vue'),
                meta: {
                    title: '手机绑定'
                }
            },
            {
                path: 'complete-login',
                name: 'CompleteLogin',
                component: () => import('../../../views/login/components/Complete-Login.vue'),
                meta: {
                    title: '完善资料'
                }
            }
        ]
    }
]
