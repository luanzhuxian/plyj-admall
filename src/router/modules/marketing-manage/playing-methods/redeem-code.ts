export default [
    {
        path: 'redeem-code',
        name: 'RedeemCode',
        redirect: 'redeem-code/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Index.vue'),
        meta: {
            title: '兑换码'
        },
        children: [
            {
                path: 'list',
                name: 'RedeemCodeList',
                props: true,
                redirect: 'list/data',
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/List.vue'),
                meta: {
                    // 此处会使用 RedeemCode 的title
                    title: ''
                },
                children: [
                    {
                        path: 'data',
                        name: 'RedeemCodeListData',
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/RedeemCodeList.vue'),
                        meta: {
                            // 此处会使用 RedeemCode 的title
                            title: ''
                        }
                    },
                    {
                        path: 'setting',
                        name: 'RedeemCodeSetting',
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Setting.vue'),
                        meta: {
                            // 此处会使用 RedeemCode 的title
                            title: ''
                        }
                    }
                ]
            },
            {
                path: 'add',
                name: 'AddRedeemCode',
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Add.vue'),
                meta: {
                    title: '新增'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditRedeemCode',
                props: true,
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Add.vue'),
                meta: {
                    title: '编辑'
                }
            },
            {
                path: 'duplicate/:id',
                name: 'DuplicateRedeemCode',
                props: true,
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Add.vue'),
                meta: {
                    title: '复制'
                }
            },
            {
                path: 'detail',
                name: 'RedeemCodeDetail',
                props: true,
                redirect: 'detail/activity/:id',
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Detail.vue'),
                children: [
                    {
                        path: 'data/:id',
                        name: 'RedeemCodeDataDetail',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Data-Detail.vue'),
                        meta: {
                            title: '数据详情'
                        }
                    },
                    {
                        path: 'activity/:id',
                        name: 'RedeemCodeActivityDetail',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Activity-Detail.vue'),
                        meta: {
                            title: '查看详情'
                        }
                    }
                ]
            }
        ]
    }
]
