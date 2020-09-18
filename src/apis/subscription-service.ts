import axios from '../assets/ts/axios-config'

// 直播套餐列表
export const getFunctionalList = (params: any) => axios.get('/apis/v1/mall/live/order/agency/list', { params })

// 直播套餐订单导出
export const exportFunctionalList = (params: any) => axios.post('/apis/v1/mall/live/order/agency/export', null, {
    responseType: 'blob',
    timeout: 0,
    params
})

// 资源库订单列表
export const getRepositoryOrderList = (params: any) => axios.get('/apis/v1/system/course/order/agency/page', { params })

// 资源库订单详情
export const getRepositoryOrderDetail = (id: any) => axios.get(`/apis/v1/system/course/order/${ id }/detail`)

// 资源库订单导出
export const exportRepositoryOrder = (params: any) => axios.post('/apis/v1/system/course/order/export', null, {
    responseType: 'blob',
    timeout: 0,
    params
})

// 营销方案订单列表
export const getMarketList = (params: any) => axios.get('/apis/v1/mall/market/agency/page', { params })

// 营销方案订单导出
export const exportMarketOrder = (params: any) => axios.post('/apis/v1/mall/market/agency/export', null, { responseType: 'blob', timeout: 0, params })
