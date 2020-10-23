export default [
    {
        path: 'general-course-package',
        name: 'GeneralCoursePackage',
        redirect: 'general-course-package/list',
        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Index.vue'),
        meta: {
            title: '粽粽有礼',
            index: '8-11'
        },
        children: [
            {
                path: 'list',
                name: 'GeneralList',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-11-1'
                }
            },
            {
                path: 'add',
                name: 'GeneralAdd',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Add.vue'),
                meta: {
                    title: '新建活动',
                    index: '8-11-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'GeneralEdit',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Add.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-11-3'
                }
            },
            {
                path: 'setting',
                name: 'GeneralSetting',
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Setting.vue'),
                meta: {
                    title: '活动设置',
                    index: '8-11-4'
                }
            },
            {
                path: 'edit/:id',
                name: 'GeneralCopy',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Add.vue'),
                meta: {
                    title: '复制活动',
                    index: '8-11-5'
                }
            },
            {
                path: 'detail/:id',
                name: 'GeneralDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-11-6'
                },
                children: [
                    // 活动详情
                    {
                        path: 'info',
                        name: 'GeneralInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Info.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'data',
                        name: 'GeneralData',
                        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Data.vue'),
                        meta: {
                            title: '活动数据',
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'gift-data',
                        name: 'GeneralGiftData',
                        component: () => import('../../../../../views/marketing-manage/activities/longmen-festival/sign-In/Gift-Data.vue'),
                        meta: {
                            title: '礼品发放数据',
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
