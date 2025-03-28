export default [
    {
        path: 'helper-manage',
        name: 'HelperManage',
        component: () => import('../../../views/user-center/helper-manage/Index.vue'),
        meta: {
            title: 'Helper管理',
            index: '3-2'
        },
        children: [
            // Helper管理列表
            {
                path: 'list',
                name: 'HelperManageList',
                component: () => import('../../../views/user-center/helper-manage/pages/Helper-Manage-List.vue'),
                meta: {
                    index: '3-2-1'
                }
            },
            // helper审核列表
            {
                path: 'helper-review-list',
                name: 'HelperReviewList',
                component: () => import('../../../views/user-center/helper-manage/pages/Helper-Review-List.vue'),
                meta: {
                    title: 'Helper审核',
                    index: '3-2-2'
                }
            },
            // helper详情
            {
                path: 'helper-detail/:id?',
                name: 'HelperDetail',
                component: () => import('../../../views/user-center/helper-manage/pages/Helper-Detail.vue'),
                meta: {
                    title: 'Helper审核详情',
                    index: '3-2-3'
                }
            },
            // helper推广详情
            {
                path: 'helper-promote-detail/:id/:mallUserId?',
                name: 'HelperPromoteDetail',
                props: true,
                component: () => import('../../../views/user-center/helper-manage/pages/Helper-Promote-Detail.vue'),
                meta: {
                    title: 'Helper推广详情',
                    index: '3-2-4'
                }
            }
        ]
    }
]
