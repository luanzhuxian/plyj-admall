export default [
    {
        path: '/orders-manage',
        redirect: '/orders-manage/order-list',
        name: 'OrderManage',
        component: () => import('../../../views/order-manage/Index.vue'),
        meta: {
            title: '订单管理'
        },
        children: [

        ]
    }
    // UI效果要求，顶部无父级菜单，因此在这里声明无嵌套的路由
    // 这里声明的路由需要提供完整的path，以免刷新后404
    // {
    //     path: '/orders/list/order-detail/:id',
    //     name: 'OrderDetail',
    //     component: () => import('../views/orders-manage/Order-Detail'),
    //     props: true,
    //     meta: {
    //         title: '订单详情'
    //     }
    // },
    // {
    //     path: '/orders/list/class-detail/:id',
    //     name: 'ClassDetail',
    //     component: () => import('../views/orders-manage/Order-Detail'),
    //     props: true,
    //     meta: {
    //         title: '课程订单详情'
    //     }
    // },
    // {
    //     path: '/orders/list/online-school-order-detail/:id',
    //     name: 'OnlineSchoolOrderDetail',
    //     component: () => import('../views/orders-manage/Order-Detail.vue'),
    //     props: true,
    //     meta: {
    //         title: '网校订单详情'
    //     }
    // },
    // {
    //     path: '/orders/list/backorder-detail/:id',
    //     name: 'BackorderDetail',
    //     component: () => import('../views/orders-manage/Backorder-Detail'),
    //     props: true,
    //     meta: {
    //         title: '售后详情'
    //     }
    // },
    // {
    //     path: '/orders/invoice/apply-invoice',
    //     name: 'ApplyInvoice',
    //     component: () => import('../views/orders-manage/Apply-Invoice'),
    //     meta: {
    //         title: '申请发票'
    //     }
    // },
    // {
    //     path: '/orders/invoice/edit-invoice',
    //     name: 'EditInvoice',
    //     component: () => import('../views/orders-manage/Apply-Invoice'),
    //     meta: {
    //         title: '修改发票'
    //     }
    // }
]
