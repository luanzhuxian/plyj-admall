import axios from '../assets/ts/axios-config'
// 获取微信支付申请状态
export const getWechatPaytStatus = () => axios.get('/apis/v2/pay/applyment/status')

export const getUpgradeStatus = () => axios.get('/apis/v2/micro/upgrade/status')

/* 查询小V商户 */
export const getVstatus = () => axios.get('/apis/v2/micro/applyment/status')

// 注册
export const register = (data: any) => axios.post('/apis/v2/base/baseUserInfo/agency/register', data)

// 修改密码
type modifyPasswordType = (arg: { lastPassword: string; password: string }) => Promise<any>
export const modifyPassword: modifyPasswordType = ({ lastPassword, password }) => axios.put('/apis/v1/base/baseUserInfo/password/modify', { lastPassword, password })
