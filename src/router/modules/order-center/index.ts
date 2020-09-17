export default [
    {
        path: '/orders-manage',
        name: 'OrderManage',
        children: [
            {
                path: 'order-list',
                name: 'OrderList',
                component: () => import('../../../views/order-manage/pages/Goods-List.vue'),
                meta: {
                    title: '商品订单'
                }
            },
            {
                path: 'courses-list',
                name: 'CoursesList',
                component: () => import('../../../views/order-manage/pages/Course-List.vue'),
                meta: {
                    title: '课程订单'
                }
            },
            {
                path: 'online-school-order',
                name: 'OnlineSchoolOrder',
                component: () => import('../../../views/order-manage/pages/Online-School-Order-List.vue'),
                meta: {
                    title: '网校订单'
                }
            },
            {
                path: 'backorder',
                name: 'Backorder',
                component: () => import('../../../views/order-manage/pages/Backorder.vue'),
                meta: {
                    title: '售后单'
                }
            },
            {
                path: 'invoice',
                name: 'Invoice',
                component: () => import('../../../views/order-manage/pages/Invoice.vue'),
                meta: {
                    title: '发票申请'
                }
            }
        ]
    }
]
