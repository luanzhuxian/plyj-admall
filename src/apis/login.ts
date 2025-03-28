import axios from '../assets/ts/axios-config'

/* 登录 */
type passwordLoginType = (arg: { account: string; password: string }) => Promise<any>
export const login: passwordLoginType = ({ account, password }) => axios.post('/apis/v2/privilege/auth/penglai/idpassword', { account, password })

/* 短信登录 */
type mobileLoginType = (arg: { mobile: string; identifyingCode: string }) => Promise<any>
export const mobileLogin: mobileLoginType = ({ mobile, identifyingCode }) => axios.post('/apis/v2/privilege/auth/sms', { mobile, identifyingCode })

// 获取登录信息
export const getLoginInfo = () => axios.get('/apis/v2/privilege/auth/me')

/* 获取权限列表 */
export const getRolePowerList = () => axios.get('/apis/v2/menu/list/mch/current/role')

// 获取机构信息
export const getAgencyDetail = () => axios.get('/apis/v2/mall/queryRegisterData')

// 获取所有机构列表
export const getAgencyList = () => axios.get('/apis/v2/base/baseUserInfo/agency/list')

// 微信扫码
export const WxScanLogin = (code: string) => axios.post(`/apis/v2/privilege/auth/open-auth/scan/${ code }`)

// 是否C端升级账号
export const getAccountInfo = () => axios.get('/apis/v2/base/baseUserInfo/account/info')

// 重置密码
type completeInfoType = (arg: { account: string; password: string;confirmPassword: string }) => Promise<any>
export const completeInfo: completeInfoType = ({ account, password, confirmPassword }) => axios.put('/apis/v2/base/baseUserInfo/account/info/complete', { account, password, confirmPassword })
