import axios from 'axios'

/**
 * 添加抽奖活动
 * @params data {Object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const addLottery = data => axios.post('/apis/v1/luckdraw/manager/create', data)

/**
 * 编辑添加抽奖活动
 * @param data {Object}
 * @returns {*}
 */
export const editLottery = data => axios.post('/apis/v1/luckdraw/manager/update', data)

/**
 * 获取抽奖列表
 * @param params {Object} 参数
 */
export const getLottery = params => axios.get('/apis/v1/luckdraw/manager/list', { params })

/**
 * 获取抽奖详情
 * @param activityId {String}
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getLotteryDetail = activityId => axios.get(`/apis/v1/luckdraw/manager/detail/${ activityId }`)

/**
 * 获取抽奖库存，编辑的时候需要实时的去查询
 * @param activityId {String}
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getLotteryDetailStock = activityId => axios.get(`/apis/v1/luckdraw/manager/award_stock/${ activityId }`)

/**
 * 结束抽奖
 * @param activityId {String}
 * @returns {Promise<AxiosResponse<any>>}
 */
export const endLottery = activityId => axios.post(`/apis/v1/luckdraw/manager/end/${ activityId }`)

/**
 * 删除抽奖
 * @param activityId {String}
 * @returns {Promise<AxiosResponse<any>>}
 */
export const delLottery = activityId => axios.post(`/apis/v1/luckdraw/manager/del/${ activityId }`)

/**
 * 获取统计详情
 * @param activityId {String}
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getLotteryStatistics = activityId => axios.get(`/apis/v1/luckdraw/manager/statistics/${ activityId }`)

/**
 * 获取抽奖列表
 * @param params {Object} 参数
 */
export const getLotteryStatisticsList = (params, activityId) => axios.get(`/apis/v1/luckdraw/manager/user_statistics_list/${ activityId }`, { params })

// 导出获奖列表
export const exportLotteryStatistic = (activityId, params) => axios.post(`/apis/v1/luckdraw/manager/user_statistics_list/download/${ activityId }`, null, {
    params,
    responseType: 'blob',
    timeout: 0
})

/**
 * 获取抽奖列表
 * @param activityId {String}
 * @param userId {String}
 */
export const getWinningGift = (activityId, userId) => axios.get(`/apis/v1/luckdraw/manager/award_gift/${ activityId }/${ userId }`)
