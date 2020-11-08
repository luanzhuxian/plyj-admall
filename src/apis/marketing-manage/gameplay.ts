// @ts-nocheck
import axios from '../../assets/ts/axios-config'

// 获取营销活动信息
export const getActivitiesInfo = () => axios.get('/apis/v1/group/buy/activityCount/total')

// 查询我的活动权限（双十二、新春、龙门节）
export const getActivityAuth = () => axios.get('/apis/v1/mall/doublet/twelve/lock')

export const getDblTwelveOpenFlag = () => axios.post('/apis/v1/mall/doublet/twelve/popups')

// 查询我的活动权限（年年翻）
export const getmMrketStatuAuth = () => axios.get('/apis/v1/mall/market/marketStatu', { params: { t: Date.now() } })

// 查询我的活动详情（年年翻）
export const getBaseMarket = id => axios.get(`/apis/v1/mall/market/baseMarket?id=${ id }`)

// 生成支付二维码（年年翻）
export const getMarketPayCode = id => axios.get('/apis/v1/mall/market/qrCode', { params: { id } })

// 生成支付二维码（年年翻）
export const getMarketPayStatus = orderId => axios.get('/apis/v1/mall/market/payStatus', { params: { orderId } })

/**
 * 申请售后
 * @param {Object} data - 营销活动统计数据
 * @param {number} data.activityId - 退款金额
 * @param {string} data.activityType - 活动类型 2-团购 3-秒杀 4-预购 统计数据
 * @return {Promise<Object>}
 */
export const getActivityData = params => axios.get('/apis/v2/order/activity/statistics/queryReport', { params })
