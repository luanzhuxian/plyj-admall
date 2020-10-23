export default [
    {
        path: 'old-belt-new-activity',
        name: 'ByOldBeltNewActivity',
        redirect: 'old-belt-new-activity/list',
        component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Index.vue'),
        meta: {
            title: '老带新',
            index: '8-16'
        },
        children: [
            {
                path: 'list',
                name: 'ByOldBeltNewActivityList',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-16-1'
                }
            },
            {
                path: 'add',
                name: 'AddByOldBeltNewActivity',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Add.vue'),
                meta: {
                    title: '新建活动',
                    index: '8-16-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditByOldBeltNewActivity',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Add.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-16-3'
                }
            },
            {
                path: 'detail/:id',
                name: 'ByOldBeltNewActivityDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-16-4'
                },
                children: [
                    // 详情
                    {
                        path: 'info',
                        name: 'ByOldBeltNewActivityDetailInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Detail-Info.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'data',
                        name: 'ByOldBeltNewActivityDetailData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/by-old-belt-new-activity/Detail-Data.vue'),
                        meta: {
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
