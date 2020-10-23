export default [
    {
        path: 'year-flavor',
        name: 'YearFlavor',
        redirect: 'year-flavor/year-flavor-list',
        component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/Index.vue'),
        meta: {
            title: '我心中的年味',
            index: '8-18'
        },
        children: [
            {
                path: 'year-flavor-list',
                name: 'YearFlavorList',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/Year-Flavor-List.vue'),
                meta: {
                    title: '列表',
                    index: '8-18-1'
                }
            },
            {
                path: 'add-year-flavor',
                name: 'AddYearFlavor',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/Add-Year-Flavor.vue'),
                meta: {
                    title: '新建活动',
                    index: '8-18-2'
                }
            },
            {
                path: 'edit-year-flavor/:id',
                name: 'EditYearFlavor',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/Add-Year-Flavor.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-18-3'
                }
            },
            {
                path: 'year-flavor-setting',
                name: 'YearFlavorSetting',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/Year-Flavor-Setting.vue'),
                meta: {
                    title: '活动设置',
                    index: '8-18-4'
                }
            },
            {
                path: 'edit-year-flavor/:id',
                name: 'CopyYearFlavor',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/Add-Year-Flavor.vue'),
                meta: {
                    title: '复制活动',
                    index: '8-18-5'
                }
            },
            {
                path: 'detail/:id',
                name: 'YearFlavorDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/Year-Flavor-Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-18-6'
                },
                children: [
                    // 活动详情
                    {
                        path: 'info',
                        name: 'ViewYearFlavorInfo',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/View-Year-Flavor-Info.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'data',
                        name: 'ViewYearFlavorData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/View-Year-Flavor-Data.vue'),
                        meta: {
                            title: '活动数据',
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'gift-data',
                        name: 'ViewYearFlavorGiftData',
                        component: () => import('../../../../../views/marketing-manage/activities/new-year/year-flavor/View-Year-Flavor-Gift-Data.vue'),
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
