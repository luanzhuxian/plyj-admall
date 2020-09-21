// @ts-nocheck
import axios from '../../assets/ts/axios-config'

/* 查询小V商户 */
export const getVstatus = () => axios.get('/apis/v2/micro/applyment/status')

// 注册
export const register = (data: any) => axios.post('/apis/v2/base/baseUserInfo/agency/register', data)

// 修改密码
type modifyPasswordType = (arg: { lastPassword: string; password: string }) => Promise<any>
export const modifyPassword: modifyPasswordType = ({ lastPassword, password }) => axios.put('/apis/v1/base/baseUserInfo/password/modify', { lastPassword, password })

// 忘记密码
type forgetPasswordType = (arg: { mobile: string; verifyCode: string }) => Promise<any>
export const forgetPassword: forgetPasswordType = ({ mobile, verifyCode }) => axios.put('/apis/v2/base/baseUserInfo/rest/step1', { mobile, verifyCode })

// 重置密码
type resetPasswordType = (arg: { mobile: string; verifyCode: string; password: string;confirmPassword: string }) => Promise<any>
export const resetPassword: resetPasswordType = ({ mobile, verifyCode, password, confirmPassword }) => axios.put('/apis/v2/base/baseUserInfo/rest/step2', { mobile, verifyCode, password, confirmPassword })

/* 注册 */
export const register1 = data => axios.post('/apis/v1/base/baseMall/saveMall', data)

export const infoStep1 = data => axios.post('/apis/v1/micro/applyment/step1', data)
export const infoStep2 = data => axios.post('/apis/v1/micro/applyment/step2', data)
export const infoStep3 = data => axios.post('/apis/v1/micro/applyment/step3', data)

/* step 2 */
// export const register2 = data => axios.post('/apis/v1/base/baseEnterprise/saveEntPerson', data)

/* step 3 提交资料 */
// export const submitBusinessInfo = data => axios.post('/apis/v1/base/baseMall/saveMall', data)

// 随机获取客服
export const selectOneRandom = () => axios.get('/apis/v1/agency/AgencyCustomerService/selectOneRandom')

/* 识别营业执照 */
export const getBusLicenseInfo = fileUrl => axios.post(`/apis/v2/oss/upload/img/busLicense?fileUrl=${ fileUrl }`)

/* 识别身份证 flag:front or back */
export const idCardSide = (side, url) => axios.post(`/apis/v2/oss/upload/img/idCard?idCardSide=${ side }&fileUrl=${ url }`)

/* 获取银行种类类别 */
export const getBankList = () => axios.get('/apis/v1/systemctl/sysbankInfo/first/bank')

/* 查询分行 */
export const getSubBankList = (parentCode, parentCodeName, bankNameKeyword) => axios.get(`/apis/v1/systemctl/sysbankInfo/branch/bank?parentCode=${ parentCode }&parentCodeName=${ parentCodeName }&bankNameKeyword=${ bankNameKeyword }`)

/* 获取银行所在地区 */
export const getProvincesBankList = (parentCode = 0) => axios.get(`/apis/v2/base/location/parent/${ parentCode }`)

/* 传图片给微信 */
export const sendImageToWeixin = file => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post('/apis/v2/micro/uploadImage', formData)
}

/* 获取小v商户申请时填写的信息 */
export const getVMerchantInfo = () => axios.post('/apis/v1/micro/applyment/confirm')

/* 提交小v商户资料 */
export const applyVMerchant = data => axios.post('/apis/v1/micro/applyment/submit', data)

/* 升级商户 */
export const upgrdaeV1 = data => axios.post('/apis/v1/micro/upgrade/step1', data)
export const upgrdaeV2 = data => axios.post('/apis/v1/micro/upgrade/step2', data)
export const upgrdaeSubmit = data => axios.post('/apis/v1/micro/upgrade/submit', data)
export const getUpgradeInfo = () => axios.post('/apis/v1/micro/upgrade/confirm')
export const getUpgradeStatus = () => axios.get('/apis/v2/micro/upgrade/status')

/* 获取授权信息 */
export const getAuthInfo = () => axios.get('/apis/v1/api/mpOrMa/refresh')

/* 重新申请小V时重置状态 */
export const refareshVStatus = () => axios.post('/apis/v1/micro/applyment/id/delete')

/**
 * 判断机构用户是否通过扫描授权过公众号
 * @return {Promise<AxiosResponse<T>>}
 */
export const isAuthedByScan = () => axios.get('/apis/v1/api/auth/success')

/**
 * 获取最新的公众号或者小程序信息:
 * @return {Promise<AxiosResponse<T>>}
 */
export const getWexinInfo = () => axios.get('/apis/v1/api/mpOrMa/refresh')

/* ************************************* 新 流 程 ***************************************** */

/**
 * 微信支付申请第一步
 * @param data
 * @property data.idCardCopy {string}
 * @property data.idCardCopyUrl {string}
 * @property data.idCardNational {string}
 * @property data.idCardNationalUrl {string}
 * @property data.idCardName {string}
 * @property data.idCardNumber {string}
 * @property data.idCardValidTimeEnd {string}
 * @property data.idCardValidTime {string}
 * @property data.contactPhone {string}
 * @property data.contactEmail {string}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const wechatPayStep1 = data => axios.post('/apis/v2/pay/applyment/step1', data)

/**
 * 微信支付申请第二步
 * @param data
 * @property data.organizationType {string}
 * @property data.businessLicenseCopy {string}
 * @property data.businessLicenseCopyUrl {string}
 * @property data.businessLicenseNumber {string}
 * @property data.certTimeStart {string}
 * @property data.certTimeEnd {string}
 * @property data.entName {string}
 * @property data.companyAddress {string}
 * @property data.entBusScope {string}
 * @property data.qualifications {string}
 * @property data.qualificationsUrl {string}
 * @property data.businessAdditionPics {string}
 * @property data.businessAdditionPicsUrl {string}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const wechatPayStep2 = data => axios.post('/apis/v2/pay/applyment/step2', data)

/**
 * 微信支付申请第三步
 * @param data
 * @property data.merchantShortname {string}
 * @property data.storeName {string}
 * @property data.storeAddressCode {string}
 * @property data.storeStreet {string}
 * @property data.storeEntrancePic {string}
 * @property data.storeEntrancePicUrl {string}
 * @property data.indoorPic {string}
 * @property data.indoorPicUrl {string}
 * @property data.servicePhone {string}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const wechatPayStep3 = data => axios.post('/apis/v2/pay/applyment/step3', data)

/**
 * @param data
 * @property data.bankAccountType {string}
 * @property data.accountName {string}
 * @property data.accountBank {string}
 * @property data.bankAddressCode {string}
 * @property data.bankName {string}
 * @property data.accountNumber {string}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const wechatPayStep4 = data => axios.post('/apis/v2/pay/applyment/step4', data)

/**
 * 获取前四步填写的信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getWchatPayInfo = () => axios.post('/apis/v2/pay/applyment/confirm')

/**
 * 正式提交前四步信息
 * @param data
 * @returns {Promise<AxiosResponse<T>>}
 */
export const submitWechatPay = data => axios.post('/apis/v2/pay/applyment/submit', data)

// 获取微信支付申请状态
export const getWechatPaytStatus = () => axios.get('/apis/v2/pay/applyment/status')
export const getAuthUrl = () => axios.get('/apis/v1/api/auth/goto_auth_url?authType=1')
export const setAuthCode = (mallId, authCode) => axios.get(`/apis/v1/api/auth/jump?mallId=${ mallId }&type=2&auth_code=${ authCode }`)

/* 检查微信授权状态 */
export const checkAuth = () => axios.get('/apis/v1/api/auth/needOrNot')

/**
 * 根据主体类目查询所属行业
 * @param entType {string} 主体类目
 * @return {Promise<AxiosResponse<any>>}
 */
export const getTradeByMainPart = entType => axios.get(`/apis/v2/pay/wxpaysettlementinfo/list?entType=${ entType }`)
