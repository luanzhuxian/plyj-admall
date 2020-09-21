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
                meta: {
                    title: '微信登录'
                }
            },
            {
                path: 'password-login',
                name: 'PasswordLogin',
                meta: {
                    title: '密码登录'
                }
            },
            {
                path: 'phone-login',
                name: 'PhoneLogin',
                meta: {
                    title: '验证码登录'
                }
            },
            {
                path: 'wx-bind-password',
                name: 'WxBindPassword',
                meta: {
                    title: '账户绑定'
                }
            },
            {
                path: 'wx-bind-phone',
                name: 'WxBindPhone',
                meta: {
                    title: '手机绑定'
                }
            },
            {
                path: 'complete-login',
                name: 'CompleteLogin',
                meta: {
                    title: '完善资料'
                }
            }
        ]
    }
]
