import axios from 'axios'

// 分页获取拼团活动列表
export const togetherActivityPage = params => axios.get('/apis/v2/group/buy/page', { params })

// 创建拼团活动
export const createTogetherActivity = params => axios.post('/apis/v1/group/buy/create', params)

// 修改拼团活动
export const updateTogetherActivity = params => axios.post('/apis/v1/group/buy/update', params)

// 结束拼团活动
export const endActivityStatus = data => axios.put('/apis/v1/group/buy/end', data)

// 删除拼团活动
export const deleteActivityStatus = data => axios.put('/apis/v1/group/buy/delete', data)

// 查询团购活动详情
export const togetherActivityDetail = id => axios.get(`/apis/v1/group/buy/select?id=${ id }`)

// 团购活动选择商品
export const togetherActivityGoods = params => axios.get('/apis/v1/group/buy/selectProduct', { params })

// 复制团购活动
// export const duplicateTogetherActivity = id => axios.get(`/apis/v1/group/buy/copy?id=${id}`)

// 获取团购活动统计数据
export const togetherActivityData = params => axios.get('/apis/v2/order/activity/statistics/queryReport', { params })

// 获取团购活动订单数据
export const togetherActivityOrders = params => axios.get('/apis/v1/group/buy/queryOrderPage', { params })

// 用户分组标签
export const getUserTagList = () => axios.get('/apis/v1/mall/user/tag/list')
