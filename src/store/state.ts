export default {
    childRoute: null,
    productType: [
        {
            label: '全部',
            value: ''
        },
        {
            label: '实体',
            value: 'PHYSICAL_GOODS'
        },
        {
            label: '虚拟',
            value: 'VIRTUAL_GOODS'
        }
    ],
    orderStatus: {
        NEW: '待提交',
        WAIT_PAY: '待支付',
        WAIT_SHIP: '待发货',
        WAIT_RECEIVE: '待收货',
        FINISHED: '订单完成',
        CLOSED: '订单关闭',
        // POST_SALE_SERVICE  售后状态
        // WAIT_REFUND: '待退款',
        // WAIT_RETURN: '等待买家发货',
        // RETURN_RECEIVE: '等待商家收货',
        // 待发货的待退款
        WAIT_SHIP_REFUND: '待退款',
        // 待收货的待退款
        WAIT_RECEIVE_REFUND: '待退款',
        // 订单完成的待退款
        FINISHED_REFUND: '待退款'
    },
    // 不允许支付的商城
    theMallForbiddenPay: [
        '1187288967105314816',
        '1071966573238960128'
    ],
    // 左菜单栏组件名称
    navBarName: 'MainNavbar',
    defaultLogo: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/008ac522-ac48-4e30-86cc-637bed73241a.jpg'
}
