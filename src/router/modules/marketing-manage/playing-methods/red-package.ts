export default [
    {
        path: 'red-package',
        name: 'RedPackage',
        redirect: 'red-package/red-package-list',
        component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Index.vue'),
        meta: {
            title: '福利红包',
            index: '8-20',
            ignore: true
        },
        children: [
            {
                path: 'red-package-list',
                name: 'RedPackageList',
                redirect: 'red-package-list/list',
                component: () => import('../../../../views/marketing-manage/playing-methods/red-package/List/Index.vue'),
                meta: {
                    title: '列表',
                    index: '8-20-1',
                    ignore: true
                },
                children: [
                    {
                        path: 'list',
                        name: 'RedPackageActivityList',
                        component: () => import('../../../../views/marketing-manage/playing-methods/red-package/List/Activity-List.vue'),
                        meta: {
                            title: '',
                            index: '8-20-1-1',
                            ignore: true
                        }
                    },
                    {
                        path: 'rank',
                        name: 'RedPackageRankList',
                        component: () => import('../../../../views/marketing-manage/playing-methods/red-package/List/Rank-List.vue'),
                        meta: {
                            title: '',
                            index: '8-20-1-2',
                            ignore: true
                        }
                    }
                ]
            }
            // {
            //     path: 'add-red-package',
            //     name: 'AddRedPackage',
            //     component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Add.vue'),
            //     meta: {
            //         title: '新增福利红包',
            //         index: '8-20-2'
            //     }
            // },
            // {
            //     path: 'add-red-package/:id',
            //     name: 'EditRedPackage',
            //     component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Add.vue'),
            //     meta: {
            //         title: '编辑福利红包',
            //         index: '8-20-3'
            //     }
            // },
            // {
            //     path: 'copy-red-package/:id',
            //     name: 'CopyRedPackage',
            //     component: () => import('../../../../views/marketing-manage/playing-methods/red-package/Add.vue'),
            //     meta: {
            //         title: '复制福利红包',
            //         index: '8-20-4'
            //     }
            // },
            // {
            //     path: 'view-red-package-list/:id',
            //     name: 'ViewRedPackageListActive',
            //     component: () => import('../../../../views/marketing-manage/playing-methods/red-package/ViewCouponList.vue'),
            //     meta: {
            //         title: '查看详情',
            //         index: '8-20-5'
            //     }
            // }
        ]
    }
]
