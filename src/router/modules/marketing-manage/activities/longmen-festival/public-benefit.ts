export default [
    {
        path: 'public-benefit',
        name: 'LongmenPublicBenefit',
        redirect: 'public-benefit/list',
        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Index.vue'),
        meta: {
            title: '公益助力',
            index: '8-13'
        },
        children: [
            {
                path: 'list',
                name: 'LongmenPublicBenefitList',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-13-1'
                }
            },
            {
                path: 'add',
                name: 'AddLongmenPublicBenefit',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Add.vue'),
                meta: {
                    title: '新建活动',
                    index: '8-13-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditLongmenPublicBenefit',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Add.vue'),
                props: true,
                meta: {
                    title: '编辑活动',
                    index: '8-13-3'
                }
            },
            {
                path: 'edit/:id/:copy',
                name: 'CopyLongmenPublicBenefit',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Add.vue'),
                props: true,
                meta: {
                    title: '复制活动',
                    index: '8-13-4'
                }
            },
            {
                path: 'detail/:id',
                name: 'LongmenPublicBenefitDetail',
                redirect: 'detail/:id/info',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Detail.vue'),
                props: true,
                meta: {
                    title: '活动详情',
                    index: '8-13-5'
                },
                children: [
                    {
                        path: 'info',
                        name: 'LongmenPublicBenefitInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Detail-Info.vue'),
                        props: true,
                        meta: {
                            ignore: true
                        }
                    },
                    {
                        path: 'data',
                        name: 'LongmenPublicBenefitData',
                        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Detail-Data.vue'),
                        props: true,
                        meta: {
                            title: '活动数据',
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
