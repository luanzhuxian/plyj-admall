export default [
    {
        path: 'account-manage',
        redirect: '/base-setting/account-manage/manage',
        name: 'AccountManage',
        component: () => import('../../views/base-setting/account-manage/Index.vue'),
        children: [
            {
                path: 'list',
                name: 'AccountList',
                component: () => import('../../views/base-setting/account-manage/pages/Account-List.vue'),
                meta: {
                    title: '账号列表'
                }
            },
            {
                path: 'manage',
                name: 'Manage',
                component: () => import('../../views/base-setting/account-manage/pages/Account-Manage.vue'),
                meta: {
                    title: '账号管理'
                }
            },

            // {
            //   path: 'audit',
            //   name: 'AccountAudit',
            //   component: () => import('../views/account-manage/Account-Audit.vue'),
            //   meta: {
            //     title: '账号审核'
            //   },
            //   children: [
            //     {
            //       path: 'waiting',
            //       name: 'AccountAuditWaiting',
            //       meta: {
            //         title: '待审核'
            //       }
            //     },
            //     {
            //       path: 'passed',
            //       name: 'AccountAuditPassed',
            //       meta: {
            //         title: '审核通过'
            //       }
            //     },
            //     {
            //       path: 'rejected',
            //       name: 'AccountAuditRejected',
            //       meta: {
            //         title: '审核拒绝'
            //       }
            //     }
            //   ]
            // }
            {
                path: 'add-account/:mode',
                name: 'AddAccount',
                component: () => import('../../views/base-setting/account-manage/pages/Add-Account.vue'),
                props: true,
                meta: {
                    title: '新增账号'
                }
            },
            {
                path: 'add-account/:mode?',
                name: 'EditAccount',
                component: () => import('../../views/base-setting/account-manage/pages/Add-Account.vue'),
                props: true,
                meta: {
                    title: '编辑账号'
                }
            },
            {
                path: 'detail',
                name: 'AccountDetail',
                component: () => import('../../views/base-setting/account-manage/pages/Account-Detail.vue'),
                meta: {
                    title: '查看详情'
                }
            }
        ]
    }
    // UI效果要求，顶部无父级菜单，因此在这里声明无嵌套的路由
    // 这里声明的路由需要提供完整的path，以免刷新后404
]
