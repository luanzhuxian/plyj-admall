import Register from '../../../views/register/Index.vue'
export default [
    {
        path: '/register',
        redirect: '/register/account',
        name: 'Register',
        component: Register,
        meta: {
            title: '注册雅集'
        },
        children: [
            {
                path: 'account',
                name: 'RegisterAccount',
                meta: {
                    title: '注册雅集'
                }
            },
            {
                path: '/forget-password',
                name: 'ForgetPassword',
                meta: {
                    title: '忘记密码'
                }
            },
            {
                path: '/modify-password',
                name: 'ModifyPassword',
                meta: {
                    title: '修改密码'
                }
            },
            {
                path: '/reset-password/:code',
                name: 'ResetPassword',
                props: true,
                meta: {
                    title: '重置密码'
                }
            }
        ]
    }
]
