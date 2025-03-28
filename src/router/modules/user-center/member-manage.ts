export default [
    {
        path: 'member-manage',
        name: 'MemberManage',
        component: () => import('../../../views/user-center/member-manage/Index.vue'),
        meta: {
            title: '用户管理',
            index: '3-1'
        },
        children: [
            // 会员管理列表
            {
                path: 'list',
                name: 'MemberManageList',
                component: () => import('../../../views/user-center/member-manage/pages/Member-Manage-List.vue'),
                meta: {
                    index: '3-1-1'
                }
            },
            // 会员管理详情
            {
                path: 'member-manage-detail/:userId',
                name: 'MemberManageDetail',
                component: () => import('../../../views/user-center/member-manage/pages/Member-Manage-Detail.vue'),
                props: true,
                meta: {
                    title: '会员详情',
                    index: '3-1-2'
                },
                children: [
                    {
                        path: 'buy-record',
                        name: 'MemberBuyRecord',
                        props: true,
                        component: () => import('../../../views/user-center/member-manage/pages/Buy-Record.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    {
                        path: 'share-record',
                        name: 'MemberShareRecord',
                        props: true,
                        component: () => import('../../../views/user-center/member-manage/pages/Share-Record.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    {
                        path: 'live-record',
                        name: 'MemberLiveRecord',
                        props: true,
                        component: () => import('../../../views/user-center/member-manage/pages/Live-Record.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    {
                        path: 'online-progress',
                        name: 'MemberOnlineProgress',
                        props: true,
                        component: () => import('../../../views/user-center/member-manage/pages/Online-Progress.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    {
                        path: 'remark',
                        name: 'MemberRemark',
                        props: true,
                        component: () => import('../../../views/user-center/member-manage/pages/Remark.vue'),
                        meta: {
                            ignore: true
                        }
                    }
                ]
            },
            // 游客管理列表
            {
                path: 'vistor-manage-list',
                name: 'VistorManageList',
                component: () => import('../../../views/user-center/member-manage/pages/Visitor-Manage-List.vue'),
                meta: {
                    title: '游客管理',
                    index: '3-1-3'
                }
            }
        ]
    }
]
