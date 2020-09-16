export default [
    {
        path: 'helper-manage',
        name: 'HelperManage',
        redirect: '/user-center/helper-manage/helper-manage-list',
        component: () => import('../../../views/user-center/helper-manage/Index.vue'),
        meta: {
            title: 'Helper管理'
        },
        children: [
            // Helper管理列表
            {
                path: 'helper-manage-list',
                name: 'HelperManageList',
                component: () => import('../../../views/user-center/helper-manage/pages/Helper-Manage-List.vue')
            },
            // helper审核列表
            {
                path: 'helper-review-list',
                name: 'HelperReviewList',
                component: () => import('../../../views/user-center/helper-manage/pages/Helper-Review-List.vue'),
                meta: {
                    title: 'helper审核'
                }
            },
            // helper详情
            {
                path: 'helper-detail/:id?',
                name: 'HelperDetail',
                component: () => import('../../../views/user-center/helper-manage/pages/Helper-Detail.vue'),
                meta: {
                    title: 'helper详情'
                }
            }
        ]
    }
]
