export default [
    {
        path: 'booking-buy',
        name: 'BookingBuy',
        redirect: 'booking-buy/list',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/booking-buy/Index.vue'),
        meta: {
            title: '疯狂同学会'
        },
        children: [
            {
                path: 'add-booking/:id?',
                name: 'AddBooking',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/booking-buy/Add-Booking.vue'),
                props: true,
                meta: {
                    title: '新增/编辑预购'
                }
            },
            {
                path: 'list',
                name: 'BookingBuyList',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/booking-buy/Booking-Buy-List.vue'),
                meta: {
                    title: '预购'
                }
            },
            {
                path: 'setting',
                name: 'BookingBuySetting',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/booking-buy/Booking-Buy-Setting.vue'),
                meta: {
                    title: '预购设置',
                    id: ''
                }
            },
            {
                path: 'detail/:id',
                name: 'BookingBuyDetail',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/booking-buy/Booking-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '预购详情',
                    id: ''
                }
            },
            {
                path: 'data/:id',
                name: 'BookingBuyData',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/booking-buy/Booking-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据',
                    id: ''
                }
            }
        ]
    }
]
