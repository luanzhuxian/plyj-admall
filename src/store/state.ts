const { VUE_APP_MODEL } = process.env
const bindWechatInfo = VUE_APP_MODEL === 'development' || VUE_APP_MODEL === 'local' ? {
    appId: 'wx7f8e7e4ea457931d',
    redirectUrl: 'http://joint.xijun.youpenglai.com'
} : {
    appId: 'wxb1536f57905c8753',
    redirectUrl: 'https://admall.youpenglai.com/h5'
}
export default {
    bindWechatInfo,
    // 微信绑定二维码样式文件
    weChatStyle: 'https://mallcdn.youpenglai.com/static/admall-new/weChatLoginStyle/index.css',
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
    // 角色映射值
    roleMap: {
        ENTERPRISE_ADMIN: '企业管理员',
        ADMIN: '高级管理员',
        EMPLOYEE: '子账号'
    },

    // 商品类型
    productTypeMap: {
        GRAPHIC_DATA: '图文资料',
        PHYSICAL_GOODS: '实体商品',
        VIRTUAL_GOODS: '虚拟商品',
        EXPERIENCE_CLASS: '体验课',
        KNOWLEDGE_COURSE: '知识课程',
        SERIES_OF_COURSE: '系列课',
        FORMAL_CLASS: '正式课',
        LIVE_GOODS: '直播课',
        VIDEO_GOODS: '录播课'
    },
    orderStatus: {
        ALL_ORDER: '全部订单',
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
        FINISHED_REFUND: '待退款',
        WAIT_PAY_TAIL_MONEY: '待付尾款'
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
