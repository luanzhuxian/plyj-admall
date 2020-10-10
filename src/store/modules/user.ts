import { Module } from 'vuex'
import {
    login,
    mobileLogin,
    getLoginInfo,
    // getRolePowerList,
    getAgencyDetail,
    getAgencyList,
    getAccountInfo
} from '../../apis/login'
import {
    mallInfoData,
    saveMallInfo
} from '../../apis/home'
import {
    register,
    getWechatPaytStatus
    // getUpgradeStatus,
    // getVstatus
} from '../../apis/base/register'
import { resetForm } from '../../assets/ts/utils'
import Cookie from '../../assets/ts/storage-cookie'
import setSentry from '../../assets/ts/set-sentry'
import selectMall from '../../components/common/select-mall'
import { LocalEnum, SessionEnum } from '@/enum/storage'
import { MutationTypes } from '@/store/mutation-type'

const currentStep = Number(sessionStorage.getItem(SessionEnum.currentStep)) || 0
const agencyCode = Cookie.get(LocalEnum.agencyCode) || ''
const mallId = Cookie.get(LocalEnum.mallId) || ''
const token = Cookie.get(LocalEnum.token) || ''

// 本地cookie较服务器提前一小时过期
const CalcCookieTime = (expire: number) => Number(new Date(Date.now() + expire * 1000 - 60000000))

const user: Module<DynamicObject, DynamicObject> = {
    state: {
        codeImg: [
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/1.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/2.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/3.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/4.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/5.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/6.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/7.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/8.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/9.png',
            'https://mallcdn.youpenglai.com/static/admall-new/CodeImg/10.png'
        ],
        codePass: false,
        codeShow: false,
        // 新老注册流程 1 老 2 新
        REG_TYPE: 1,
        // 数据是否加载完毕
        allLoaded: false,
        // 登录信息
        loginInfo: {
            // refresh_token: '',
            // refresh_token_expire: 0,
            openId: '',
            expire: 0,
            SESSION_ID: '',
            userId: '',
            token: ''
        },
        // 账户信息
        accountInfo: {
            account: '',
            createTime: '',
            email: '',
            id: '',
            lockStatus: 1,
            mobile: '',
            name: '',
            operator: '',
            unionId: '',
            updateTime: '',
            wxHeadImgUrl: '',
            wxNickName: '',
            headImgUrl: ''
        },
        // 注册步骤
        currentStep,
        // 注册第一步数据
        enterpriseSaveModel: {},
        // 注册第二步数据
        entPersonSaveModel: {},
        entWxPayInfoVO: {},
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
        agencyCode,
        // 当前登录的机构
        mallId,
        currentRoleCode: '',
        // 审核状态
        auditStatus: '',
        token,
        inviteCode: '',
        // 小v商户审核状态
        // vMerchantStatus: {},
        // 小v商户升级审核状态
        upgradeStatus: {},
        // 微信支付审核状态
        wechatPayStatus: {}
    },
    mutations: {
        [MutationTypes.setCodePass]: (state, payload) => {
            state.codePass = payload
        },
        [MutationTypes.setCodeShow]: (state, payload) => {
            state.codeShow = payload
        },
        [MutationTypes.setLoginInfo]: (state, payload) => {
            if (payload) {
                Cookie.set(LocalEnum.token, payload.token, {
                    expires: CalcCookieTime(payload.expire)
                })
                Cookie.set(LocalEnum.refreshToken, payload.token, {
                    expires: CalcCookieTime(payload.refresh_token_expire)
                })
                Object.assign(state.loginInfo, payload)
                state.token = state.loginInfo.token
            }
        },
        [MutationTypes.agencyUserInfo] (state, payload) {
            if (!payload) return
            const {
                currentStep = 1,
                entPersonSaveModel = {},
                entWxPayInfoVO = {},
                enterpriseSaveModel = {},
                mallSaveModel = {},
                inviteCode,
                auditStatus,
                currentRoleCode
            } = payload
            // 对步骤进行本地缓存
            sessionStorage.setItem(SessionEnum.currentStep, currentStep)
            state.currentStep = currentStep
            state.currentRoleCode = currentRoleCode || ''
            // 注册第二步数据
            state.entPersonSaveModel = entPersonSaveModel
            state.entWxPayInfoVO = entWxPayInfoVO
            // 注册第一步数据
            state.enterpriseSaveModel = enterpriseSaveModel
            state.mallSaveModel = mallSaveModel
            state.inviteCode = inviteCode
            state.auditStatus = auditStatus
            // TODO: 由于新流程不能无法保存成功性，暂且都按老流程处理，需要的时候，放开注释即可
            state.REG_TYPE = Number(enterpriseSaveModel.regType) || 1
            state.mallId = mallSaveModel.id
        },
        // 退出
        [MutationTypes.logout] (state) {
            resetForm(state.loginInfo)
            resetForm(state.entPersonSaveModel)
            resetForm(state.entWxPayInfoVO)
            resetForm(state.enterpriseSaveModel)
            resetForm(state.mallSaveModel)
            state.inviteCode = ''
            state.currentStep = 0
            state.token = ''
            state.menuList = []
            state.subAccount = []
            state.agencyCode = ''
            state.mallId = ''
            state.currentRoleCode = ''
            state.agencyList = []
            state.allLoaded = false
            Cookie.remove(LocalEnum.token)
            Cookie.remove(LocalEnum.refreshToken)
            Cookie.remove(LocalEnum.agencyCode)
            Cookie.remove(LocalEnum.mallId)
            sessionStorage.removeItem(SessionEnum.currentStep)
        },
        // 缓存权限列表
        // [types.SET_POWER_LIST]: (state, payload) => {
        //     if (!payload) {
        //         return
        //     }
        //     const regType = state.REG_TYPE
        //     const menus = payload[0] ? payload[0].children || [] : []
        //     const container = new Set()
        //     const getMenuName = (menuList: Array<any>) => {
        //         for (const item of menuList) {
        //             // 删除老流程菜单
        //             if (regType === 2 && item.routePath === 'WechatBind') {
        //                 menuList.splice(menuList.indexOf(item), 1)
        //                 getMenuName(menuList)
        //                 break
        //             }
        //             // 删除新流程菜单
        //             if (regType === 1 && item.routePath === 'BindWechat') {
        //                 menuList.splice(menuList.indexOf(item), 1)
        //                 getMenuName(menuList)
        //                 break
        //             }
        //             if (item.routePath) {
        //                 container.add(item.routePath)
        //             }
        //             if (item.children.length) {
        //                 getMenuName(item.children)
        //             }
        //         }
        //     }
        //     getMenuName(menus)
        //     state.routeNames = [...container]
        //     state.menuList = [{ children: menus }]
        // },
        // 缓存机构列表
        [MutationTypes.getAgencyList]: (state, payload) => {
            state.agencyList = payload
        },
        // 缓存机构列表
        [MutationTypes.getAccountInfo]: (state, payload) => {
            state.accountInfo = payload
        },
        // 缓存当前机构
        [MutationTypes.setCurrentAgency]: (state, payload) => {
            state.agencyCode = payload.agencyCode || ''
            Cookie.set(LocalEnum.agencyCode, payload.agencyCode, {
                expires: CalcCookieTime(state.loginInfo.expire)
            })
            state.mallId = payload.mallId || ''
            Cookie.set(LocalEnum.mallId, payload.mallId, {
                expires: CalcCookieTime(state.loginInfo.expire)
            })
        },
        // TODO: 已弃用
        // [types.V_MERCHANT_STATUS]: (state, payload) => {
        //     if (payload) {
        //         state.vMerchantStatus = payload
        //     }
        // },
        // TODO: 已弃用
        // [types.UPGRADE_STATUS]: (state, payload) => {
        //     if (payload) {
        //         state.upgradeStatus = payload
        //     }
        // },
        [MutationTypes.wechatPayStatus]: (state, payload) => {
            if (payload) {
                state.wechatPayStatus = payload
            }
        },
        [MutationTypes.hasGetAllMallInfo]: (state, loaded) => {
            state.allLoaded = loaded
        },
        [MutationTypes.getAllMallInfo]: (state, getters) => {
            setSentry(getters)
        }
    },
    actions: {
        async login ({ commit }, form) {
            try {
                const data = await login(form)
                commit(MutationTypes.setLoginInfo, data.result)
                return data.res
            } catch (e) {
                commit(MutationTypes.logout)
                throw e
            }
        },
        async mobileLogin ({ commit }, form) {
            try {
                const data = await mobileLogin(form)
                commit(MutationTypes.setLoginInfo, data.result)
                return data.result
            } catch (e) {
                commit(MutationTypes.logout)
                throw e
            }
        },

        async register ({ commit }, payload) {
            try {
                const data = await register(payload)
                commit(MutationTypes.setLoginInfo, data.result)
                return data.result
            } catch (e) {
                commit(MutationTypes.logout)
                throw e
            }
        },

        /**
         * 创建商城
         * @params data {Object} 数据
         */
        async createMall ({ commit }, data: mallInfoData) {
            const { result: { id, enterpriseId } } = await saveMallInfo(data)
            commit(MutationTypes.setCurrentAgency, {
                mallId: id,
                agencyCode: enterpriseId
            })
        },

        // 切换商城, 在 GET_AGENCY_LIST 之后调用
        async selectMall  ({ commit, state, rootState }) {
            const { mallId, agencyCode } = await selectMall(state.agencyList, rootState.roleMap)
            if (mallId !== state.mallId) {
                commit(MutationTypes.setCurrentAgency, {
                    mallId, agencyCode
                })
                return { mallId, agencyCode, changed: true }
            }
            commit(MutationTypes.setCurrentAgency, {
                mallId, agencyCode
            })
            return { mallId, agencyCode, changed: false }
        },

        /**
         * 获取所有机构列表，并选择一个商城
         * @param commit
         */
        async [MutationTypes.getAgencyList] ({ commit }) {
            try {
                const data = await getAgencyList()
                commit(MutationTypes.getAgencyList, data.result)
                return data.result
            } catch (e) {
                throw e
            }
        },

        /**
         * 获取账户信息
         * @param commit
         */
        async [MutationTypes.getAccountInfo] ({ commit }) {
            try {
                const { result } = await getAccountInfo()
                commit(MutationTypes.getAccountInfo, result)
                return result
            } catch (e) {
                throw e
            }
        },

        // 获取机构和商城详情
        async [MutationTypes.agencyUserInfo] ({ commit }) {
            try {
                const { result: AgencyDetail } = await getAgencyDetail()
                commit(MutationTypes.agencyUserInfo, AgencyDetail)
                return AgencyDetail
            } catch (e) {
                throw e
            }
        },
        async [MutationTypes.setLoginInfo] ({ commit }) {
            try {
                const LoginInfo = await getLoginInfo()
                commit(MutationTypes.setLoginInfo, LoginInfo.result)
                return LoginInfo.result
            } catch (e) {
                commit(MutationTypes.logout)
                throw e
            }
        },
        // async [types.SET_POWER_LIST] ({ commit }) {
        //     try {
        //         const data = await getRolePowerList()
        //         commit(types.SET_POWER_LIST, data.result)
        //         return data.result
        //     } catch (e) {
        //         commit(types.LOGOUT)
        //         throw e
        //     }
        // },
        // TODO: 已弃用
        // async [types.V_MERCHANT_STATUS] ({ commit }) {
        //     try {
        //         const data = await getVstatus()
        //         commit(types.V_MERCHANT_STATUS, data.result)
        //         return data.result
        //     } catch (e) {
        //         throw e
        //     }
        // },
        // TODO: 已弃用
        // async [types.UPGRADE_STATUS] ({ commit }) {
        //     try {
        //         const data = await getUpgradeStatus()
        //         if (data.result.applymentState === 'SUBMITING') {
        //             // SUBMITING相当于没升级过
        //             data.result.applymentState = ''
        //         }
        //         commit(types.UPGRADE_STATUS, data.result)
        //         return data.result
        //     } catch (e) {
        //         throw e
        //     }
        // },
        // 微信支付申请状态
        async [MutationTypes.wechatPayStatus] ({ commit }) {
            try {
                const data = await getWechatPaytStatus()
                if (data.result.errCode) {
                    data.result.applymentState = 'APPLYMENT_STATE_REJECTED'
                    data.result.applymentStateMsg = data.result.errCodeDes
                }
                commit(MutationTypes.wechatPayStatus, data.result)
                return data.result
            } catch (e) {
                throw e
            }
        },
        // 获取所有商城数据
        async [MutationTypes.getAllMallInfo] ({ dispatch, commit, getters }) {
            // 日志系统getters暂时删除
            try {
                await dispatch(MutationTypes.agencyUserInfo)
                await dispatch(MutationTypes.getAccountInfo)
                await dispatch(MutationTypes.wechatPayStatus)
                // await dispatch(types.SET_POWER_LIST)
                // if (state.REG_TYPE === 2) {
                //     // 新流程
                //     await dispatch(types.WECHAT_PAY_STATUS)
                // } else {
                //     // 老流程
                //     await Promise.all([dispatch(types.V_MERCHANT_STATUS), dispatch(types.UPGRADE_STATUS)])
                // }
                commit(MutationTypes.hasGetAllMallInfo, true)
                commit(MutationTypes.getAllMallInfo, getters)
            } catch (e) {
                throw e
            }
        }
    },
    getters: {
        codePass: state => state.codePass,
        codeShow: state => state.codeShow,
        codeImg: state => state.codeImg,
        token: state => state.token || null,
        // 当前登录人的id
        userId: state => state.loginInfo.userId || null,
        accountInfo: state => state.accountInfo,
        currentStep: state => state.currentStep,
        allLoaded: state => state.allLoaded,
        // currentStep: state => 6, // 注册步骤
        enterpriseSaveModel: state => state.enterpriseSaveModel,
        entPersonSaveModel: state => state.entPersonSaveModel,
        entWxPayInfoVO: state => state.entWxPayInfoVO,
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
        bindPhone: state => state.accountInfo.mobile,
        // vMerchantStatus: state => state.vMerchantStatus,
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

// export default user
export default {
    namespaced: true,
    ...user
}
