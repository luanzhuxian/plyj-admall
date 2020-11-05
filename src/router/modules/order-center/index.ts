export default [
    {
        path: '/orders-manage',
        name: 'OrderManage',
        component: () => import('../../../views/order-manage/Index.vue'),
        meta: {
            title: '订单中心',
            index: '4',
            noClick: true
        },
        children: [
            {
                path: 'goods',
                name: 'GoodsOrder',
                redirect: '/orders-manage/goods/list',
                component: () => import('../../../views/order-manage/pages/goods-order/Index.vue'),
                meta: {
                    title: '商品订单',
                    index: '4-1'
                },
                children: [
                    {
                        path: 'list',
                        name: 'GoodsOrderList',
                        component: () => import('../../../views/order-manage/pages/goods-order/Goods-List.vue'),
                        meta: {
                            title: '列表',
                            index: '4-1-1'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'GoodsOrderDetail',
                        component: () => import('../../../views/order-manage/pages/Order-Detail.vue'),
                        props: true,
                        meta: {
                            title: '订单详情',
                            index: '4-1-2'
                        }
                    }
                ]
            },
            {
                path: 'course',
                name: 'CourseOrder',
                redirect: '/orders-manage/course/list',
                component: () => import('../../../views/order-manage/pages/goods-order/Index.vue'),
                meta: {
                    title: '课程订单',
                    index: '4-2'
                },
                children: [
                    {
                        path: 'list',
                        name: 'CourseOrderList',
                        component: () => import('../../../views/order-manage/pages/course-order/Course-List.vue'),
                        meta: {
                            title: '列表',
                            index: '4-2-1'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'CourseOrderDetail',
                        component: () => import('../../../views/order-manage/pages/Order-Detail.vue'),
                        props: true,
                        meta: {
                            title: '订单详情',
                            index: '4-2-2'
                        }
                    }
                ]
            },
            {
                path: 'online-school-order',
                name: 'OnlineSchoolOrder',
                redirect: '/orders-manage/online-school-order/list',
                component: () => import('../../../views/order-manage/pages/goods-order/Index.vue'),
                meta: {
                    title: '网校订单',
                    index: '4-3'
                },
                children: [
                    {
                        path: 'list',
                        name: 'OnlineSchoolOrderList',
                        component: () => import('../../../views/order-manage/pages/online-school-order/Online-School-Order-List.vue'),
                        meta: {
                            title: '列表',
                            index: '4-3-1'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'OnlineSchoolOrderDetail',
                        component: () => import('../../../views/order-manage/pages/Order-Detail.vue'),
                        props: true,
                        meta: {
                            title: '订单详情',
                            index: '4-3-2'
                        }
                    }
                ]
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
                path: 'backorder-detail/:id',
                name: 'BackorderDetail',
                component: () => import('../../../views/order-manage/pages/Backorder-Detail.vue'),
                props: true,
                meta: {
                    title: '售后详情',
                    index: '4-6'
                }
            },
            {
                path: '/orders/invoice/apply-invoice',
                name: 'ApplyInvoice',
                component: () => import('../../../views/order-manage/pages/Apply-Invoice.vue'),
                meta: {
                    title: '申请发票',
                    index: '4-7'
                }
            },
            {
                path: '/orders/invoice/edit-invoice',
                name: 'EditInvoice',
                component: () => import('../../../views/order-manage/pages/Apply-Invoice.vue'),
                meta: {
                    title: '修改发票',
                    index: '4-8'
                }
            }
        ]
    }
]
