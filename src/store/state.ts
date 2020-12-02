const bindWechatInfo = {
    appId: 'wx7f8e7e4ea457931d',
    redirectUrl: `${ location.protocol }//${ location.hostname }`
}
export default {
    bindWechatInfo,
    // 微信绑定二维码样式文件
    weChatStyle: 'https://mallcdn.youpenglai.com/static/admall-new/weChatLoginStyle/index.css',
    redPackageBg: [
        {
            imgSrc: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包背景1.png',
            id: 0,
            check: false
        },
        {
            imgSrc: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包背景2.png',
            id: 1,
            check: false
        },
        {
            imgSrc: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包背景3.png',
            id: 2,
            check: false
        },
        {
            imgSrc: 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/red-package-bg/红包背景4.png',
            id: 3,
            check: false
        }
    ],
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
        PHYSICAL_GOODS: '实体商品',
        VIRTUAL_GOODS: '虚拟商品',
        FORMAL_CLASS: '正式课',
        EXPERIENCE_CLASS: '体验课',
        RED_ENVELOPE: '福利红包',
        KNOWLEDGE_COURSE: '知识课程',
        SERIES_OF_COURSE: '系列课',
        GRAPHIC_DATA: '图文资料',
        LIVE_GOODS: '直播课',
        VIDEO_GOODS: '录播课'
    },
    // 商品状态状态
    productStatusMap:
        {
            1: '已下架',
            2: '出售中',
            3: '草稿箱',
            4: '已售罄'
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
