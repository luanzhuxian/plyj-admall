export default [
    {
        path: 'helper-marketing',
        name: 'MarketingHelper',
        redirect: '/marketing-manage/helper-marketing/list',
        component: () => import('../../../../views/marketing-manage/utils/helper-marketing/Index.vue'),
        meta: {
            title: 'Helper活动'
        },
        children: [
            {
                path: 'list',
                name: 'MarketingManageList',
                component: () => import('../../../../views/marketing-manage/utils/helper-marketing/List.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'add/:id?',
                name: 'AddMarketing',
                component: () => import('../../../../views/marketing-manage/utils/helper-marketing/Add-Marketing.vue'),
                meta: {
                    title: '新增Helper活动'
                }
            },
            {
                path: 'data/:id',
                name: 'MarketingManageData',
                redirect: 'data/:id/product',
                props: true,
                component: () => import('../../../../views/marketing-manage/utils/helper-marketing/Data.vue'),
                meta: {
                    title: '查看数据'
                },
                children: [
                    {
                        path: 'product',
                        name: 'MarketingManageDataOfProduct',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/utils/helper-marketing/Data-Of-Product.vue'),
                        meta: {
                            // 商品数据
                            title: ''
                        }
                    },
                    {
                        path: 'helper',
                        name: 'MarketingManageDataOfHelper',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/utils/helper-marketing/Data-Of-Helper.vue'),
                        meta: {
                            // helper数据
                            title: ''
                        }
                    }
                ]
            }
        ]
    }
]
