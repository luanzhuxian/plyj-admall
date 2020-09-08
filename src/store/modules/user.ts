import { Module } from 'vuex'

// import Cookie from '../../assets/js/storage-cookie'

const currentStep = Number(sessionStorage.getItem('currentStep')) || 0
// const agencyCode = Cookie.get('agencyCode') || ''
// const mallId = Cookie.get('mallId') || ''
// const token = Cookie.get('token') || ''

// 本地cookie较服务器提前一小时过期
// const CalcCookieTime = expire => new Date(Date.now() + expire * 1000 - 60000000)

// const getters: GetterTree<DynamicObject, DynamicObject> =

const user: Module<DynamicObject, DynamicObject> = {
    state: {
        // 新老注册流程 1 老 2 新
        REG_TYPE: 1,
        // 数据是否加载完毕
        allLoaded: false,
        loginInfo: {
            // refresh_token: '',
            // refresh_token_expire: 0,
            openId: '',
            expire: 0,
            SESSION_ID: '',
            userId: '',
            token: ''
        },
        // 注册步骤
        currentStep,
        // 注册第一步数据
        enterpriseSaveModel: {},
        // 注册第二步数据
        entPersonSaveModel: {},
        mallSaveModel: {},
        subAccount: [],
        menuList: [{
            children: []
        }],
        // 所拥路由名称
        routeNames: [],
        // 所拥有的机构
        agencyList: [],
        // 当前机构主键
        agencyCode: '',
        // 当前登录的机构
        mallId: '',
        currentRoleCode: '',
        // 审核状态
        auditStatus: '',
        token: '',
        inviteCode: '',
        // 小v商户审核状态
        vMerchantStatus: {},
        // 小v商户升级审核状态
        upgradeStatus: {},
        // 微信支付审核状态
        wechatPayStatus: {}
    },
    mutations: {},
    actions: {},
    getters: {
        token: state => state.token || null,
        // 当前登录人的id
        userId: state => state.loginInfo.userId || null,
        currentStep: state => state.currentStep,
        allLoaded: state => state.allLoaded,
        // currentStep: state => 6, // 注册步骤
        enterpriseSaveModel: state => state.enterpriseSaveModel,
        entPersonSaveModel: state => state.entPersonSaveModel,
        idName: state => state.entPersonSaveModel.idName,
        regType: state => state.REG_TYPE,
        agencyList: state => state.agencyList,
        auditStatus: state => state.auditStatus,
        agencyCode: state => state.agencyCode,
        currentRoleCode: state => state.currentRoleCode,
        mallNumber: state => state.mallSaveModel.id || '',
        appId: state => state.mallSaveModel.appId,
        // 开发者密码
        appSecret: state => state.mallSaveModel.secret,
        // 商户号
        mchId: state => state.mallSaveModel.mchId,
        // 商户密钥
        mchKey: state => state.mallSaveModel.mchKey,
        // 凭证地址
        keyPath: state => state.mallSaveModel.mchPath,
        logo: state => state.mallSaveModel.logoUrl || 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/008ac522-ac48-4e30-86cc-637bed73241a.jpg',
        mallUrl: state => state.mallSaveModel.mallUrl,
        mallSaveModel: state => state.mallSaveModel,
        mallName: state => state.mallSaveModel.mallName,
        bindPhone: state => state.mallSaveModel.bindPhone,
        vMerchantStatus: state => state.vMerchantStatus,
        upgradeStatus: state => state.upgradeStatus,
        wechatPayStatus: state => state.wechatPayStatus,
        // 微信审核状态详情
        auditDetailModels: state => {
            const auditDetailModels = state.wechatPayStatus.auditDetailModels || {}
            if (Array.isArray(auditDetailModels)) {
                return auditDetailModels[0] || {}
            }
            return auditDetailModels
        }
    }
}

export default user
