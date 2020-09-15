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
            }
        ]
    }
]
