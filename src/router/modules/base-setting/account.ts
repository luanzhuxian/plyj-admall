export default [
    {
        path: 'account-manage',
        redirect: '/base-setting/account-manage/manage',
        name: 'AccountManage',
        component: () => import('../../../views/base-setting/account-manage/Index.vue'),
        children: [
            {
                path: 'list',
                name: 'AccountList',
                component: () => import('../../../views/base-setting/account-manage/pages/Account-List.vue'),
                meta: {
                    title: '账号列表'
                }
            }
        ]
    }
]
