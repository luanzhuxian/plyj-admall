export default [
    {
        path: 'redeem-code',
        name: 'RedeemCode',
        redirect: 'redeem-code/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Index.vue'),
        meta: {
            title: '兑换码',
            index: '8-6'
        },
        children: [
            {
                path: 'list',
                name: 'RedeemCodeList',
                props: true,
                redirect: 'list/data',
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-6-1'
                },
                children: [
                    {
                        path: 'data',
                        name: 'RedeemCodeListData',
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/RedeemCodeList.vue'),
                        meta: {
                            title: '',
                            ignore: true
                        }
                    },
                    {
                        path: 'setting',
                        name: 'RedeemCodeSetting',
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Setting.vue'),
                        meta: {
                            title: '',
                            ignore: true
                        }
                    }
                ]
            },
            {
                path: 'add',
                name: 'AddRedeemCode',
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Add.vue'),
                meta: {
                    title: '新增兑换码',
                    index: '8-6-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditRedeemCode',
                props: true,
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Add.vue'),
                meta: {
                    title: '编辑兑换码',
                    index: '8-6-3'
                }
            },
            {
                path: 'duplicate/:id',
                name: 'DuplicateRedeemCode',
                props: true,
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Add.vue'),
                meta: {
                    title: '复制兑换码',
                    index: '8-6-4'
                }
            },
            {
                path: 'detail',
                name: 'RedeemCodeDetail',
                props: true,
                redirect: 'detail/activity/:id',
                component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Detail.vue'),
                meta: {
                    index: '8-6-5',
                    title: '兑换码详情'
                },
                children: [
                    {
                        path: 'data/:id',
                        name: 'RedeemCodeDataDetail',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Data-Detail.vue'),
                        meta: {
                            title: '数据详情',
                            ignore: true
                        }
                    },
                    {
                        path: 'activity/:id',
                        name: 'RedeemCodeActivityDetail',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/playing-methods/redeem-code/Activity-Detail.vue'),
                        meta: {
                            title: '查看详情',
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
