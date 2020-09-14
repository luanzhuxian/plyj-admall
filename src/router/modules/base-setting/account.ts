export default [
    {
        path: '/base-setting/account-manage/manage',
        redirect: '/base-setting/account-manage/manage/list',
        name: 'AccountManage',
        component: () => import('../../../views/base-setting/account-manage/Index.vue'),
        meta: {
            title: '基础设置'
        },
        children: [
            {
                path: 'list',
                name: 'AccountList',
                component: () => import('../../../views/base-setting/account-manage/pages/Account-List.vue'),
                meta: {
                    title: '账号管理'
                }
            }
        ]
    }
]
