export default [
    {
        path: 'account-manage',
        redirect: '/base-setting/account-manage/list',
        name: 'AccountManage',
        component: () => import('../../../views/base-setting/account-manage/Index.vue'),
        meta: {
            title: '账号管理',
            index: '7-1'
        },
        children: [
            {
                path: 'list',
                name: 'AccountList',
                props: true,
                component: () => import('../../../views/base-setting/account-manage/pages/Account-List.vue'),
                meta: {
                    index: '7-1-1',
                    title: '账号列表'
                }
            },
            {
                path: 'add-account/:mode',
                name: 'AddAccount',
                component: () => import('../../../views/base-setting/account-manage/pages/Add-Account.vue'),
                meta: {
                    index: '7-1-2',
                    title: '添加账号'
                }
            },
            {
                path: 'edit-account/:mode?',
                name: 'EditAccount',
                component: () => import('../../../views/base-setting/account-manage/pages/Add-Account.vue'),
                meta: {
                    index: '7-1-3',
                    title: '编辑账号'
                }
            },
            {
                path: 'detail',
                name: 'AccountDetail',
                component: () => import('../../../views/base-setting/account-manage/pages/Account-Detail.vue'),
                meta: {
                    index: '7-1-4',
                    title: '查看详情'
                }
            }
        ]
    }
]
