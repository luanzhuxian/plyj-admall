export default [
    {
        path: '/user-center',
        redirect: '/user-center/member-manage/member-manage-list',
        name: 'UserCenter',
        component: () => import('../views/user-center/Index'),
        meta: {
            title: '用户中心'
        },
        children: [
            {
                path: 'member-manage',
                name: 'MemberManage',
                component: () => import('../views/user-center/member-manage/Index'),
                meta: {
                    title: '用户管理'
                },
                children: [
                    // 会员管理列表
                    {
                        path: 'member-manage-list',
                        name: 'MemberManageList',
                        component: () => import('../views/user-center/member-manage/pages/MemberManageList'),
                        meta: {
                            title: '会员管理'
                        }
                    },
                    // 会员管理详情
                    {
                        path: 'member-manage-detail',
                        name: 'MemberManageDetail',
                        component: () => import('../views/user-center/member-manage/pages/MemberManageDetail'),
                        meta: {
                            title: '会员管理'
                        }
                    },
                    // 游客管理列表
                    {
                        path: 'vistor-manage-list',
                        name: 'VistorManageList',
                        component: () => import('../views/user-center/member-manage/pages/VisitorManageList'),
                        meta: {
                            title: '游客管理'
                        }
                    }
                ]
            },
            {
                path: 'HelperManage',
                name: 'HelperManage',
                component: () => import('../views/user-center/helper-manage/Index'),
                meta: {
                    title: 'Helper管理'
                },
                children: [
                    // Helper管理列表
                    {
                        path: 'helper-manage-list',
                        name: 'HelperManageList',
                        component: () => import('../views/user-center/helper-manage/pages/HelperManageList'),
                        meta: {
                            title: 'Helper管理'
                        }
                    },
                    // helper审核列表
                    {
                        path: 'helper-review-list',
                        name: 'HelperReviewList',
                        component: () => import('../views/user-center/helper-manage/pages/HelperReviewList'),
                        meta: {
                            title: 'helper审核'
                        }
                    },
                    // helper详情
                    {
                        path: 'helper-detail',
                        name: 'HelperDetail',
                        component: () => import('../views/user-center/helper-manage/pages/HelperDetail'),
                        meta: {
                            title: 'helper详情'
                        }
                    }
                ]
            }
        ]
    }
]
