export default [
    {
        path: 'invite-newcomers-gift-list',
        redirect: 'invite-newcomers-gift-list/list',
        name: 'InviteNewcomersGiftList',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Gift-List.vue'),
        meta: {
            title: '赢取豪礼'
        },
        children: [
            {
                path: 'list',
                name: 'InviteNewcomersList',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-List.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'setting',
                name: 'InviteNewcomersSetting',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Setting.vue'),
                meta: {
                    title: '活动设置'
                }
            },
            {
                path: 'add',
                name: 'InviteNewcomersAdd',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Edit.vue'),
                meta: {
                    title: '新建活动'
                }
            }, {
                path: 'newcomers/:id/edit',
                name: 'InviteNewcomersEdit',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Edit.vue'),
                meta: {
                    title: '编辑活动'
                }
            }, {
                path: 'newcomers/:id/copy',
                name: 'InviteNewcomersCopy',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Edit.vue'),
                meta: {
                    title: '复制活动'
                }
            }, {
                path: 'newcomers/:id',
                name: 'InviteNewcomersDetail',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Detail.vue'),
                meta: {
                    title: '活动详情'
                }
            }
        ]
    }
]
