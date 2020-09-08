import axios from '../../assets/ts/axios-config'

/**
 * 资源库待授权课程
 * @param {number} isNotice 主页传 0 资源库传 1
 */
export const getWaitWarrantyResource = (isNotice: number) => axios.post(`/apis/v1/system/course/order/giveNotice?isNotice=${ isNotice }`)
