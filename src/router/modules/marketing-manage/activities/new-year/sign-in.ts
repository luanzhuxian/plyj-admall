export default [
    {
        path: 'new-year-sign-in',
        name: 'NewYearSignIn',
        redirect: 'new-year-sign-in/list',
        component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Index.vue'),
        meta: {
            title: '打卡聪明年',
            index: '11-11'
        },
        children: [
            {
                path: 'list',
                name: 'SignInList',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/List.vue'),
                meta: {
                    title: '列表',
                    index: '11-11-1'
                }
            },
            {
                path: 'add',
                name: 'SignInAdd',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Add.vue'),
                meta: {
                    title: '新建活动',
                    index: '11-11-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'SignInEdit',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Add.vue'),
                meta: {
                    title: '编辑活动',
                    index: '11-11-3'
                }
            },
            {
                path: 'setting',
                name: 'SignInSetting',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Setting.vue'),
                meta: {
                    title: '活动设置',
                    index: '11-11-4'
                }
            },
            {
                path: 'edit/:id',
                name: 'SignInCopy',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Add.vue'),
                meta: {
                    title: '复制活动',
                    index: '11-11-5'
                }
            },
            {
                path: 'detail/:id',
                name: 'SignInDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '11-11-6'
                },
                children: [
                    // 活动详情
                    {
                        path: 'info',
                        name: 'SignInInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Info.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'data',
                        name: 'SignInData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Data.vue'),
                        meta: {
                            title: '活动数据',
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'gift-data',
                        name: 'SignInGiftData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/sign-In/Gift-Data.vue'),
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
