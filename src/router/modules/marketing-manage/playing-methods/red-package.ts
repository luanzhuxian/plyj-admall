export default [
    {
        path: 'red-package',
        name: 'RedPackage',
        redirect: '/marketing-manage/red-package/list/activity-list',
        component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Index.vue'),
        meta: {
            title: '福利红包',
            index: '8-20'
        },
        children: [
            {
                path: 'list',
                name: 'RedPackageList',
                component: () => import('../../../../views/marketing-manage/playing-methods/red-package/list/Index.vue'),
                meta: {
                    title: '列表',
                    index: '8-20-1'
                },
                children: [
                    {
                        path: 'activity-list',
                        name: 'RedPackageActivityList',
                        component: () => import('../../../../views/marketing-manage/playing-methods/red-package/list/Activity-List.vue'),
                        meta: {
                            title: '',
                            index: '8-20-1-1',
                            ignore: true
                        }
                    },
                    {
                        path: 'rank-list',
                        name: 'RedPackageRankList',
                        component: () => import('../../../../views/marketing-manage/playing-methods/red-package/list/Rank-List.vue'),
                        meta: {
                            title: '',
                            index: '8-20-1-2',
                            ignore: true
                        }
                    }
                ]
            },
            {
                path: 'add',
                name: 'AddRedPackage',
                component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Add-Red-Package.vue'),
                meta: {
                    title: '新增福利红包',
                    index: '8-20-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditRedPackage',
                component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Add-Red-Package.vue'),
                props: true,
                meta: {
                    title: '编辑福利红包',
                    index: '8-20-3'
                }
            },
            {
                path: 'copy/:id',
                name: 'CopyRedPackage',
                component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Add-Red-Package.vue'),
                props: true,
                meta: {
                    title: '复制福利红包',
                    index: '8-20-4'
                }
            },
            {
                path: 'statistics/:id',
                name: 'RedPackageStatistics',
                component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Statistics.vue'),
                props: true,
                meta: {
                    title: '查看数据',
                    index: '8-20-5'
                }
            }
        ]
    }
]
