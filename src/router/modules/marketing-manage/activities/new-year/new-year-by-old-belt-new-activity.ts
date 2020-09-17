export default [
    {
        path: 'old-belt-new-activity',
        name: 'ByOldBeltNewActivity',
        redirect: 'old-belt-new-activity/list',
        component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Index.vue'),
        meta: {
            title: '老带新'
        },
        children: [
            {
                path: 'list',
                name: 'ByOldBeltNewActivityList',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/List.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'add',
                name: 'AddByOldBeltNewActivity',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Add.vue'),
                meta: {
                    title: '创建活动'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditByOldBeltNewActivity',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Add.vue'),
                meta: {
                    title: '编辑活动'
                }
            },
            {
                path: 'detail/:id',
                name: 'ByOldBeltNewActivityDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Detail.vue'),
                meta: {
                    title: '活动详情'
                },
                children: [
                    // 详情
                    {
                        path: 'info',
                        name: 'ByOldBeltNewActivityDetailInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Detail-Info.vue')
                    },
                    // 活动数据
                    {
                        path: 'data',
                        name: 'ByOldBeltNewActivityDetailData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Detail-Data.vue')
                    }
                ]
            }
        ]
    }
]
