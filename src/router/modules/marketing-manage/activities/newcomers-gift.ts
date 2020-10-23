export default [
    {
        path: 'newcomers-gift',
        redirect: '/marketing-manage/newcomers-gift/list/:id?',
        name: 'NewcomersGift',
        component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Gift-List.vue'),
        meta: {
            title: '新人有礼',
            index: '8-10'
        },
        children: [
            {
                path: 'list',
                name: 'NewcomersGiftList',
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-List.vue'),
                meta: {
                    title: '列表',
                    index: '8-10-1'
                }
            },
            {
                path: 'add',
                name: 'NewcomersAdd',
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Edit.vue'),
                meta: {
                    title: '新增活动',
                    index: '8-10-2'
                }
            },
            {
                path: 'newcomers/:id/edit',
                name: 'NewcomersEdit',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Edit.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-10-3'
                }
            },
            {
                path: 'setting',
                name: 'NewcomersSetting',
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Setting.vue'),
                meta: {
                    title: '活动设置',
                    index: '8-10-4'
                }
            },
            {
                path: 'newcomers/:id/copy',
                name: 'NewcomersCopy',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Edit.vue'),
                meta: {
                    title: '复制活动',
                    index: '8-10-5'
                }
            },
            {
                path: 'newcomers/:id',
                name: 'NewcomersDetail',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-10-6'
                }
            },
            {
                path: 'newcomers-data/:id',
                name: 'NewcomersData',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Data.vue'),
                meta: {
                    title: '数据详情',
                    index: '8-10-7'
                }
            }
        ]
    }
]
