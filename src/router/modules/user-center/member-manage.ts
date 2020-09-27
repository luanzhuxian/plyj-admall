export default [
    {
        path: 'member-manage',
        name: 'MemberManage',
        component: () => import('../../../views/user-center/member-manage/Index.vue'),
        redirect: '/user-center/member-manage/member-manage-list',
        meta: {
            title: '用户管理',
            index: '3-1'
        },
        children: [
            // 会员管理列表
            {
                path: 'member-manage-list',
                name: 'MemberManageList',
                component: () => import('../../../views/user-center/member-manage/pages/Member-Manage-List.vue')
            },
            // 会员管理详情
            {
                path: 'member-manage-detail/:userId?',
                name: 'MemberManageDetail',
                component: () => import('../../../views/user-center/member-manage/pages/Member-Manage-Detail.vue'),
                meta: {
                    title: '会员详情'
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
    }
]
