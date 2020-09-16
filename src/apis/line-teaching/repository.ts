// @ts-nocheck
import axios from '../../assets/ts/axios-config'

// 资源库列表
export const getRepositoryList = params => axios.get('/apis/v1/mall/cource/agency/page', { params })

// 支付信息
export const getBuyDetails = ({ id, giveRecordId = '' }) => axios.get('/apis/v1/mall/cource/agency/buyDetail', { params: { id, giveRecordId } })

// 资源库详情
export const getRepositoryDetail = ({ id, giveRecordId = '' }) => axios.get('/apis/v1/mall/cource/agency/detail', { params: { id, giveRecordId } })

// 资源库立即购买
export const buyNow = ({ courseResourceId, giveRecordId = '' }) => axios.get('/apis/v1/system/course/order/qrCode', { params: { courseResourceId, giveRecordId } })

// 资源库购买重试
export const retryFalidOrder = orderId => axios.get(`/apis/v1/system/course/order/retry/recharge/${ orderId }`)

// 资源库订单状态
export const getOrderStatus = orderId => axios.get('/apis/v1/system/course/order/status', { params: { orderId } })

/**
 * 资源库待授权课程
 * @param {number} isNotice 主页传 0 资源库传 1
 */
export const getWaitWarrantyResource = isNotice => axios.post(`/apis/v1/system/course/order/giveNotice?isNotice=${ isNotice }`)
