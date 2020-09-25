import axios from '../assets/ts/axios-config'

/**
 * 获取服务器时间
 */
export const getServerTime = () => axios.post('/apis/v1/order/current/date')

/**
 * 获取sts
 */
export const getSTS = () => axios.get('/apis/v2/oss/upload/sts')

/**
 * 发送短信验证码
 * @param smsType {string}
 * @param mobile {string}
 */
type VerifyCodeFunType = (arg: { smsType: SmsType; mobile: string }) => Promise<object>
export const getVerifyCodeFunc: VerifyCodeFunType = ({ smsType = '', mobile = '' }) => axios.post(`/apis/v1/systemctl/sms/${ smsType }/verify/${ mobile }`)

// 校验手机短信是否可用
type checkMobileCodeData = { smsType: SmsType; mobile: string; verifyCode: string }
export const checkMobileCode = ({ smsType, mobile, verifyCode }: checkMobileCodeData) => axios.get(`/apis/v1/systemctl/sms/${ smsType }/verify/${ mobile }/${ verifyCode }/verification`)

/**
 * 获取数据字典
 * @param type
 */
export const getDataDictionary = (type: string) => axios.get(`/apis/v2/systemctl/sysdictionary/detail/list/${ type }`)
