export default [
    {
        path: '/user-center',
        redirect: '/user-center/member-manage/member-manage-list',
        name: 'UserCenter',
        component: () => import('../../../views/user-center/Index.vue'),
        meta: {
            title: '用户中心'
        },
        children: [
            {
                path: 'member-manage',
                name: 'MemberManage',
                component: () => import('../../../views/user-center/member-manage/Index.vue'),
                redirect: '/user-center/member-manage/member-manage-list',
                meta: {
                    title: '用户管理'
                },
                children: [
                    // 会员管理列表
                    {
                        path: 'member-manage-list',
                        name: 'MemberManageList',
                        component: () => import('../../../views/user-center/member-manage/pages/Member-Manage-List.vue'),
                        meta: {
                            title: '会员管理'
                        }
                    },
                    // 会员管理详情
                    {
                        path: 'member-manage-detail/:userId?',
                        name: 'MemberManageDetail',
                        component: () => import('../../../views/user-center/member-manage/pages/Member-Manage-Detail.vue'),
                        meta: {
                            title: '会员管理'
                        }
                    },
                    // 游客管理列表
                    {
                        path: 'vistor-manage-list',
                        name: 'VistorManageList',
                        component: () => import('../../../views/user-center/member-manage/pages/Visitor-Manage-List.vue'),
                        meta: {
                            title: '游客管理'
                        }
                    }
                ]
            },
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
                        component: () => import('../../../views/user-center/helper-manage/pages/Helper-Manage-List.vue'),
                        meta: {
                            title: 'Helper管理'
                        }
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
                        path: 'helper-detail',
                        name: 'HelperDetail',
                        component: () => import('../../../views/user-center/helper-manage/pages/Helper-Detail.vue'),
                        meta: {
                            title: 'helper详情'
                        }
                    }
                ]
            }
        ]
    }
]
