export default [
    {
        path: '/product-center/online-teaching',
        component: () => import('../../../../views/product-center/online-teaching/Index.vue'),
        name: 'LineTeaching',
        redirect: '/product-center/online-teaching/function-pack',
        meta: {
            title: '云课堂'
        },
        children: [
            {
                path: 'function-pack',
                name: 'FunctionPack',
                component: () => import('../../../../views/product-center/online-teaching/pages/Function-Pack.vue'),
                meta: {
                    title: '方案包'
                }
            }
        ]
    }
]
