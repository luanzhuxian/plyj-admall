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
                redirect: '/orders-manage/backorder/list',
                component: () => import('../../../views/order-manage/pages/backorder/Index.vue'),
                meta: {
                    title: '售后单',
                    index: '4-4'
                },
                children: [
                    {
                        path: 'list',
                        name: 'BackorderList',
                        component: () => import('../../../views/order-manage/pages/backorder/List.vue'),
                        meta: {
                            title: '列表',
                            index: '4-4-1'
                        }
                    },
                    {
                        path: 'backorder-detail/:id',
                        name: 'BackorderDetail',
                        component: () => import('../../../views/order-manage/pages/backorder/Backorder-Detail.vue'),
                        props: true,
                        meta: {
                            title: '售后详情',
                            index: '4-4-2'
                        }
                    }
                ]
            },
            {
                path: 'invoice',
                name: 'Invoice',
                redirect: '/orders-manage/invoice/list',
                component: () => import('../../../views/order-manage/pages/invoice/Index.vue'),
                meta: {
                    title: '发票管理',
                    index: '4-5'
                },
                children: [
                    {
                        path: 'list',
                        name: 'InvoiceList',
                        component: () => import('../../../views/order-manage/pages/invoice/List.vue'),
                        meta: {
                            title: '列表',
                            index: '4-5-1'
                        }
                    },
                    {
                        path: 'apply',
                        name: 'ApplyInvoice',
                        component: () => import('../../../views/order-manage/pages/invoice/Apply-Invoice.vue'),
                        meta: {
                            title: '申请发票',
                            index: '4-5-2'
                        }
                    },
                    {
                        path: 'edit',
                        name: 'EditInvoice',
                        component: () => import('../../../views/order-manage/pages/invoice/Apply-Invoice.vue'),
                        meta: {
                            title: '修改发票',
                            index: '4-5-3'
                        }
                    }
                ]
            },
            {
                path: 'right-goods-order',
                name: 'RightGoodsOrder',
                redirect: '/orders-manage/right-goods-order/list',
                component: () => import('../../../views/order-manage/pages/right-goods-order/Index.vue'),
                meta: {
                    title: '权益商品',
                    index: '4-6',
                    ignore: true
                },
                children: [
                    {
                        path: 'list',
                        name: 'RightGoodsList',
                        component: () => import('../../../views/order-manage/pages/right-goods-order/Right-Goods-List.vue'),
                        meta: {
                            title: '列表',
                            index: '4-6-1',
                            ignore: true
                        }
                    },
                    {
                        path: 'right-goods-detail/:id',
                        name: 'RightGoodsDetail',
                        component: () => import('../../../views/order-manage/pages/Order-Detail.vue'),
                        props: true,
                        meta: {
                            title: '订单详情',
                            index: '4-6-2',
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
