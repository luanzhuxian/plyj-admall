export default [
    {
        path: '/mall-manage',
        name: 'MallManage',
        redirect: '/mall-manage/current',
        component: () => import('../../../views/mall-manage/Index.vue'),
        meta: {
            title: '店铺管理'
        },
        children: [
            {
                path: 'current',
                name: 'Current',
                component: () => import('../../../views/mall-manage/pages/Mall-Current.vue'),
                meta: {
                    title: '当前使用首页'
                }
            }
        ]
    }
]
