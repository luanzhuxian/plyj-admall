export default [
    {
        path: '/reservation-manage',
        name: 'ReservationManage',
        component: () => import('../../../views/reservation-manage/Index.vue'),
        meta: {
            title: '预约管理',
            index: '9'
        }
    }
]
