import Register from '../../../views/register/Index.vue'
export default [
    {
        path: '/register',
        redirect: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: '注册雅集'
        },
        children: [
            {
                path: '/register',
                name: 'Register',
                meta: {
                    title: '注册雅集'
                }
            },
            {
                path: '/forget-password',
                name: 'ForgetPassword',
                component: () => import('../../../views/register/Index.vue'),
                meta: {
                    title: '忘记密码'
                }
            },
            {
                path: '/modify-password',
                name: 'ModifyPassword',
                component: () => import('../../../views/register/Index.vue'),
                meta: {
                    title: '修改密码'
                }
            },
            {
                path: '/reset-password',
                name: 'ResetPassword',
                component: () => import('../../../views/register/Index.vue'),
                meta: {
                    title: '重置密码'
                }
            }
        ]
    }
]
