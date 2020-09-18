export default [
    {
        path: '/online-teaching',
        component: () => import('../../../views/online-teaching/Index.vue'),
        name: 'LineTeaching',
        meta: {
            title: '云课堂'
        },
        redirect: '/online-teaching/function-pack',
        children: [
            {
                path: 'function-pack',
                name: 'FunctionPack',
                component: () => import('../../../views/online-teaching/pages/Function-Pack.vue'),
                meta: {
                    title: '云课堂'
                }
            }
        ]
    }
]
