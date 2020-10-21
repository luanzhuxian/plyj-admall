export default [
    {
        path: 'newcomers-gift',
        redirect: '/marketing-manage/newcomers-gift/list/:id?',
        name: 'NewcomersGiftList',
        component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Gift-List.vue'),
        meta: {
            title: '新人有礼'
        },
        children: [
            {
                path: 'list',
                name: 'NewcomersList',
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-List.vue')
            },
            {
                path: 'setting',
                name: 'NewcomersSetting',
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Setting.vue'),
                meta: {
                    title: '新人有礼设置'
                }
            },
            {
                path: 'add',
                name: 'NewcomersAdd',
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Edit.vue'),
                meta: {
                    title: '新增活动'
                }
            },
            {
                path: 'newcomers/:id/edit',
                name: 'NewcomersEdit',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Edit.vue'),
                meta: {
                    title: '编辑活动'
                }
            },
            {
                path: 'newcomers/:id/copy',
                name: 'NewcomersCopy',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Edit.vue'),
                meta: {
                    title: '复制活动'
                }
            },
            {
                path: 'newcomers/:id',
                name: 'NewcomersDetail',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Detail.vue'),
                meta: {
                    title: '活动详情'
                }
            },
            {
                path: 'newcomers-data/:id',
                name: 'NewcomersData',
                props: true,
                component: () => import('../../../../views/marketing-manage/activities/newcomers-gift/Newcomers-Data.vue'),
                meta: {
                    title: '数据详情'
                }
            }
        ]
    }
]
