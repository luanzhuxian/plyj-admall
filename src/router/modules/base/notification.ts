export default [
    {
        path: '/notification',
        name: 'Notification',
        redirect: '/notification/list',
        component: () => import('../../../views/notification-center/Index.vue'),
        meta: {
            index: '2-10'
        },
        children: [
            {
                path: 'list',
                name: 'NotificationList',
                component: () => import('../../../views/notification-center/pages/List.vue'),
                meta: {
                    title: '通知中心',
                    index: '2-10-1'
                }
            },
            {
                path: 'detail/:id',
                name: 'NotificationDetail',
                component: () => import('../../../views/notification-center/pages/Detail.vue'),
                meta: {
                    title: '公告详情',
                    index: '2-10-2'
                }
            }
        ]
    }
]
