export default [
    {
        path: '/register',
        redirect: '/register/account',
        name: 'Register',
        component: () => import('../../../views/register/Index.vue'),
        meta: {
            title: '注册雅集'
        },
        children: [
            {
                path: 'account',
                name: 'RegisterAccount',
                component: () => import('../../../views/register/components/Register.vue'),
                meta: {
                    title: '注册雅集'
                }
            },
            {
                path: '/forget-password',
                name: 'ForgetPassword',
                component: () => import('../../../views/register/components/Forget-Password.vue'),
                meta: {
                    title: '忘记密码'
                }
            },
            {
                path: '/modify-password',
                name: 'ModifyPassword',
                component: () => import('../../../views/register/components/Modify-Password.vue'),
                meta: {
                    title: '修改密码'
                }
            },
            {
                path: '/reset-password/:code',
                name: 'ResetPassword',
                component: () => import('../../../views/register/components/Reset-Password.vue'),
                props: true,
                meta: {
                    title: '重置密码'
                }
            }
        ]
    }
]
