import axios from '../../assets/ts/axios-config'

// 微信绑定
export const WxBind = (code: string) => axios.post(`/apis/v2/privilege/auth/bing/wx/${ code }`)

// 解绑微信
export const WxUnBind = () => axios.post('/apis/v2/privilege/auth/bing/wx/cancel')

// 修改手机号
type updateMobileData = { mobile: string; verifyCode: string }
export const updateMobile = (data: updateMobileData) => axios.put('/apis/v2/base/baseUserInfo/modifyMobile', data)

// 修改头像和姓名
type updateAvatarOrNameData = { headImgUrl?: string; name?: string }
export const updateAvatarOrName = (data: updateAvatarOrNameData) => axios.put('/apis/v2/base/baseUserInfo', data)
