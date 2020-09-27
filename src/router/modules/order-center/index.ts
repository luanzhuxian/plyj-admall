export default [
    {
        path: '/orders-manage',
        name: 'OrderManage',
        component: () => import('../../../views/order-manage/Index.vue'),
        redirect: '/orders-manage/order-list',
        meta: {
            title: '订单中心',
            index: '4'
        },
        children: [
            {
                path: 'order-list/:id?',
                name: 'OrderList',
                component: () => import('../../../views/order-manage/pages/Goods-List.vue'),
                meta: {
                    title: '商品订单',
                    index: '4-1'
                }
            },
            {
                path: 'courses-list',
                name: 'CoursesList',
                component: () => import('../../../views/order-manage/pages/Course-List.vue'),
                meta: {
                    title: '课程订单',
                    index: '4-2'
                }
            },
            {
                path: 'online-school-order',
                name: 'OnlineSchoolOrder',
                component: () => import('../../../views/order-manage/pages/Online-School-Order-List.vue'),
                meta: {
                    title: '网校订单',
                    index: '4-3'
                }
            },
            {
                path: 'backorder',
                name: 'Backorder',
                component: () => import('../../../views/order-manage/pages/Backorder.vue'),
                meta: {
                    title: '售后单',
                    index: '4-4'
                }
            },
            {
                path: 'invoice',
                name: 'Invoice',
                component: () => import('../../../views/order-manage/pages/Invoice.vue'),
                meta: {
                    title: '发票申请',
                    index: '4-5'
                }
            },
            {
                path: 'order-detail/:id',
                name: 'OrderDetail',
                component: () => import('../../../views/order-manage/pages/Order-Detail.vue'),
                props: true,
                meta: {
                    title: '订单详情'
                }
            },
            {
                path: 'class-detail/:id',
                name: 'ClassOrderDetail',
                component: () => import('../../../views/order-manage/pages/Order-Detail.vue'),
                props: true,
                meta: {
                    title: '课程订单详情'
                }
            },
            {
                path: 'online-school-order-detail/:id',
                name: 'OnlineSchoolOrderDetail',
                component: () => import('../../../views/order-manage/pages/Order-Detail.vue'),
                props: true,
                meta: {
                    title: '网校订单详情'
                }
            },
            {
                path: 'backorder-detail/:id',
                name: 'BackorderDetail',
                component: () => import('../../../views/order-manage/pages/Backorder-Detail.vue'),
                props: true,
                meta: {
                    title: '售后详情'
                }
            },
            {
                path: '/orders/invoice/apply-invoice',
                name: 'ApplyInvoice',
                component: () => import('../../../views/order-manage/pages/Apply-Invoice.vue'),
                meta: {
                    title: '申请发票'
                }
            },
            {
                path: '/orders/invoice/edit-invoice',
                name: 'EditInvoice',
                component: () => import('../../../views/order-manage/pages/Apply-Invoice.vue'),
                meta: {
                    title: '修改发票'
                }
            }
        ]
    }
]
