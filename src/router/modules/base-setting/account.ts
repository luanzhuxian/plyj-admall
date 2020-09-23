export default [
    {
        path: 'account-manage',
        redirect: '/base-setting/account-manage/list',
        name: 'AccountManage',
        component: () => import('../../../views/base-setting/account-manage/Index.vue'),
        meta: {
            title: '账号管理'
        },
        children: [
            {
                path: 'manage',
                name: 'Manage',
                component: () => import('../../../views/base-setting/account-manage/pages/Account-Manage.vue'),
                meta: {
                    title: '账号管理'
                }
            },
            {
                path: 'list',
                name: 'AccountList',
                component: () => import('../../../views/base-setting/account-manage/pages/Account-List.vue'),
                meta: {
                    title: '账号列表'
                }
            },
            {
                path: 'add-account/:mode',
                name: 'AddAccount',
                component: () => import('../../../views/base-setting/account-manage/pages/Add-Account.vue'),
                meta: {
                    title: '新增账号'
                }
            },
            {
                path: 'edit-account/:mode?',
                name: 'EditAccount',
                component: () => import('../../../views/base-setting/account-manage/pages/Add-Account.vue'),
                meta: {
                    title: '编辑账号'
                }
            },
            {
                path: 'detail',
                name: 'AccountDetail',
                component: () => import('../../../views/base-setting/account-manage/pages/Account-Detail.vue'),
                meta: {
                    title: '查看详情'
                }
            }
        ]
    }
]
