export default [
    {
        path: 'invite-newcomers-gift',
        redirect: 'invite-newcomers-gift/list',
        name: 'InviteNewcomersGift',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Gift-List.vue'),
        meta: {
            title: '赢取豪礼',
            index: '8-14'
        },
        children: [
            {
                path: 'list',
                name: 'InviteNewcomersList',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-List.vue'),
                meta: {
                    title: '列表',
                    index: '8-14-1'
                }
            },
            {
                path: 'add',
                name: 'InviteNewcomersAdd',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Edit.vue'),
                meta: {
                    title: '新建活动',
                    index: '8-14-2'
                }
            }, {
                path: 'newcomers/:id/edit',
                name: 'InviteNewcomersEdit',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Edit.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-14-3'
                }
            },
            {
                path: 'setting',
                name: 'InviteNewcomersSetting',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Setting.vue'),
                meta: {
                    title: '活动设置',
                    index: '8-14-4'
                }
            },
            {
                path: 'newcomers/:id/copy',
                name: 'InviteNewcomersCopy',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Edit.vue'),
                meta: {
                    title: '复制活动',
                    index: '8-14-5'
                }
            }, {
                path: 'newcomers/:id',
                name: 'InviteNewcomersDetail',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/invite-newcomers-gift/Invite-Newcomers-Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-14-6'
                }
            }
        ]
    }
]
