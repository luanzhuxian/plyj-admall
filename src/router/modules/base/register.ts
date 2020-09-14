export default [
    {
        path: '/register',
        redirect: '/register',
        name: 'Register',
        component: () => import('../../../views/register/Index.vue'),
        meta: {
            title: '注册雅集'
        },
        children: [
            {
                path: '/register',
                name: 'Register',
                component: () => import('../../../views/register/Index.vue'),
                meta: {
                    title: '注册雅集'
                }
            }
        ]
    }
]
