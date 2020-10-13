export default [
    {
        path: 'booking-buy',
        name: 'BookingBuy',
        redirect: 'new-year-booking-buy/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Index.vue'),
        meta: {
            title: ''
        },
        children: [
            {
                path: 'add-booking/:id?',
                name: 'AddBookingBuy',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Add-Booking.vue'),
                props: true,
                meta: {
                    title: '新增/编辑预购'
                }
            },
            {
                path: 'list',
                name: 'BookingBuyList',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Booking-Buy-List.vue'),
                meta: {
                    title: '预购'
                }
            },
            {
                path: 'detail/:id',
                name: 'BookingBuyDetail',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Booking-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '预购详情',
                    id: ''
                }
            },
            {
                path: 'new-year-data/:id',
                name: 'BookingBuyData',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Booking-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据',
                    id: ''
                }
            }
        ]
    }
]
