import axios from 'axios'

// 分页获取预购活动列表
export const bookingActivityPage = params => axios.get('/apis/v2/pre/buy/page', { params })

// 创建预购活动
export const createBookingActivity = params => axios.post('/apis/v1/pre/buy/create', params)

// 修改预购活动
export const updateBookingActivity = params => axios.post('/apis/v1/pre/buy/update', params)

// 结束团购活动
export const updateActivityStatus = params => axios.put('/apis/v1/pre/buy/modifyStatus ', params)

// 查询预购活动详情
export const bookingActivityDetail = activityId => axios.get(`/apis/v1/pre/buy/detail/${ activityId }`)

// 预购活动选择商品
export const bookingActivityGoods = params => axios.get('/apis/v1/group/buy/selectProduct', { params })

// 复制预购活动
export const duplicateBookingActivity = id => axios.get(`/apis/v1/pre/buy/detail/${ id }`)

// 获取预购活动订单数据
export const bookingActivityOrders = params => axios.get('/apis/v1/pre/buy/queryOrderPage', { params })

// 导出活动数据
export const exportActivityData = params => axios.post('/apis/v2/group/buy/export', null, {
    responseType: 'blob',
    timeout: 0,
    params
})

// 用户分组标签
export const getUserTagList = () => axios.get('/apis/v1/mall/user/tag/list')
