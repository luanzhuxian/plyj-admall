export default [
    {
        path: '/reservation-manage',
        name: 'ReservationManage',
        redirect: '/reservation-manage/list',
        component: () => import('../../../views/reservation-manage/Index.vue'),
        meta: {
            title: '预约管理',
            index: '9'
        },
        children: [
            {
                path: 'list',
                name: 'ReservationList',
                component: () => import('../../../views/reservation-manage/pages/List.vue')
            }
        ]
    }
]
