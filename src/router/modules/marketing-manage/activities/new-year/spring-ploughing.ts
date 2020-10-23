export default [
    {
        path: 'spring-ploughing',
        name: 'SpringPloughing',
        redirect: 'spring-ploughing/list',
        component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Index.vue'),
        meta: {
            title: '春耘计划',
            index: '8-17'
        },
        children: [
            {
                path: 'list',
                name: 'SpringPloughingList',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-17-1'
                }
            },
            {
                path: 'add',
                name: 'AddSpringPloughing',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Add.vue'),
                meta: {
                    title: '新建活动',
                    index: '8-17-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditSpringPloughing',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Add.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-17-3'
                }
            },
            {
                path: 'detail/:id',
                name: 'SpringPloughingDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-17-4'
                },
                children: [
                    // 活动详情
                    {
                        path: 'info',
                        props: true,
                        name: 'SpringPloughingDetailInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Detail-Info.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'data',
                        props: true,
                        name: 'SpringPloughingDetailData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/spring-ploughing/Detail-Data.vue'),
                        meta: {
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
