import axios from 'axios'

// 创建兑换码活动
export const createRedeemCodeActivity = params => axios.post('/apis/v1/exchange/manager/create', params)

// 修改兑换码活动
export const updateRedeemCodeActivity = params => axios.post('/apis/v1/exchange/manager/update', params)

// 导出兑换码活动
export const exportActivityData = (activityId, params) => axios.post(`/apis/v1/exchange/manager/code/download/${ activityId }`, { timeout: 0 }, {
    params,
    responseType: 'blob'
})

// 获取兑换码活动列表
export const getRedeemCodeData = params => axios.get('/apis/v1/exchange/manager/list', { params })

// 获取兑换码活动详情
export const getRedeemCodeById = activityId => axios.get(`/apis/v1/exchange/manager/detail/${ activityId }`)

// 恢复兑换码活动
export const redeemCodeStop = activityId => axios.post(`/apis/v1/exchange/manager/stop/${ activityId }`)

// 恢复兑换码活动
export const redeemCodeResume = activityId => axios.post(`/apis/v1/exchange/manager/resume/${ activityId }`)

// 结束兑换码活动
export const redeemCodeEnd = activityId => axios.post(`/apis/v1/exchange/manager/end/${ activityId }`)

// 删除兑换码活动
export const redeemCodeDelete = activityId => axios.post(`/apis/v1/exchange/manager/del/${ activityId }`)

// 兑换码列表
export const getRedeemCodeStatistics = activityId => axios.get(`/apis/v1/exchange/manager/code/statistics/${ activityId }`)

// 兑换码列表
export const getRedeemCodeByActivity = (activityId, params) => axios.get(`/apis/v1/exchange/manager/code/list/${ activityId }`, { params })

// 添加活动兑换码数量
export const addCodeByActivity = (activityId, number) => axios.post(`/apis/v1/exchange/manager/add/code?activityId=${ activityId }&number=${ number }`)

// 批量删除
export const redeemCodeBatchDelete = params => axios.post('/apis/v1/exchange/manager/code/batch/del', params)

// 批量作废
export const redeemCodeBatchToVoid = params => axios.post('/apis/v1/exchange/manager/code/batch/end', params)

// 批量备注
export const redeemCodeBatchRemarks = params => axios.post('/apis/v1/exchange/manager/code/batch/remarks', params)

// 查看订单
export const redeemCodeViewOrders = (userId, codeId) => axios.get(`/apis/v1/exchange/manager/code/user_product/${ userId }/${ codeId }`)

// 是否显示引导
export const isHasRead = () => axios.get('/apis/v1/exchange/manager/hasRead')
