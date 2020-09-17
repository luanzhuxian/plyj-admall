export default [
    {
        path: 'spring-ploughing',
        name: 'SpringPloughing',
        redirect: 'spring-ploughing/list',
        component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Index.vue'),
        meta: {
            title: '春耘计划'
        },
        children: [
            {
                path: 'list',
                name: 'SpringPloughingList',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/List.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'add',
                name: 'AddSpringPloughing',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Add.vue'),
                meta: {
                    title: '创建活动'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditSpringPloughing',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Add.vue'),
                meta: {
                    title: '编辑活动'
                }
            },
            {
                path: 'detail/:id',
                name: 'SpringPloughingDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Detail.vue'),
                meta: {
                    title: '活动详情'
                },
                children: [
                    // 活动详情
                    {
                        path: 'info',
                        props: true,
                        name: 'SpringPloughingDetailInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Detail-Info.vue')
                    },
                    // 活动数据
                    {
                        path: 'data',
                        props: true,
                        name: 'SpringPloughingDetailData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Detail-Data.vue')
                    }
                ]
            }
        ]
    }
]
