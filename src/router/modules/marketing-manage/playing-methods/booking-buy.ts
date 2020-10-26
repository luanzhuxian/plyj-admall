export default [
    {
        path: 'booking-buy',
        name: 'BookingBuy',
        redirect: 'booking-buy/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Index.vue'),
        meta: {
            title: '预购',
            index: '8-2'
        },
        children: [
            {
                path: 'list',
                name: 'BookingBuyList',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Booking-Buy-List.vue'),
                meta: {
                    title: '列表',
                    index: '8-2-1'
                }
            },
            {
                path: 'add',
                name: 'AddBookingBuy',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Add-Booking.vue'),
                props: true,
                meta: {
                    title: '新增预购',
                    index: '8-2-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditBookingBuy',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Add-Booking.vue'),
                props: true,
                meta: {
                    title: '编辑预购',
                    index: '8-2-3'
                }
            },
            {
                path: 'detail/:id',
                name: 'BookingBuyDetail',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Booking-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '预购详情',
                    index: '8-2-4'
                }
            },
            {
                path: 'data/:id',
                name: 'BookingBuyData',
                component: () => import('../../../../views/marketing-manage/playing-methods/booking-buy/Booking-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据',
                    index: '8-2-5'
                }
            }
        ]
    }
]
