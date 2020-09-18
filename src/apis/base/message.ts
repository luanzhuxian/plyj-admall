import axios from '../../assets/ts/axios-config'

/**
 * 商户分页查询消息列表
 * @param {object} params
 * @property params.toAgencyCode 绑定的手机号
 * @property params.current
 * @property params.size
 */
export const getNotificationList = (params: { toAgencyCode: string; current: number; size: number }) => axios.get('/apis/v2/agency/AgencyNotificationCenter/page', { params })

/**
 * 标记消息为已读
 * @param {array} ids
 */
export const markReaded = (ids: string[]) => axios.put('/apis/v1/agency/AgencyNotificationCenter/read', ids)
