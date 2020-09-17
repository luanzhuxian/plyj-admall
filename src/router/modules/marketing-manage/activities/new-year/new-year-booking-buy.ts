export default [
    {
        path: 'new-year-booking-buy',
        name: 'NewYearBookingBuy',
        redirect: 'new-year-booking-buy/list',
        component: () => import('../../../../../views/marketing-manage/activities/new-year/booking-buy/Index.vue'),
        meta: {
            title: ''
        },
        children: [
            {
                path: 'new-year-add-booking/:id?',
                name: 'NewYearAddBooking',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/booking-buy/Add-Booking.vue'),
                props: true,
                meta: {
                    title: '新增/编辑预购'
                }
            },
            {
                path: 'list',
                name: 'NewYearBookingBuyList',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/booking-buy/Booking-Buy-List.vue'),
                meta: {
                    title: '预购'
                }
            },
            {
                path: 'new-year-detail/:id',
                name: 'NewYearBookingBuyDetail',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/booking-buy/Booking-Buy-Detail.vue'),
                props: true,
                meta: {
                    title: '预购详情',
                    id: ''
                }
            },
            {
                path: 'new-year-data/:id',
                name: 'NewYearBookingBuyData',
                component: () => import('../../../../../views/marketing-manage/activities/new-year/booking-buy/Booking-Buy-Data.vue'),
                props: true,
                meta: {
                    title: '活动数据',
                    id: ''
                }
            }
        ]
    }
]
