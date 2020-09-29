// @ts-nocheck
import axios from 'axios'

/**
 * 新增春耘计划活动
 * @param data {object} 数据
 * @return {Promise<AxiosResponse<T>>}
 */
export const addSpringPloughing = data => axios.post('/apis/v1/combination/save', data)

/**
 * 新增春耘计划活动
 * @param id {string}
 * @param data {object} 数据
 * @return {Promise<AxiosResponse<T>>}
 */
export const updateSpringPloughing = (id, data) => axios.post(`/apis/v1/combination/modify/${ id }`, data)

/**
 * 获取春耘计划列表
 * @param params {object}
 * @property params.current {number}
 * @property params.size {number}
 * @property params.condition {string} 关键字
 * @property params.startTime {string}
 * @property params.endTime {string}
 * @property params.status {number}
 * @property params.batchType {number} 1：组合商品 2: 新春春耘
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingList = params => axios.get('/apis/v2/combination/page', { params })

/**
 * 获取春耘计划详情
 * @param combinationId {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingDetail = combinationId => axios.get(`/apis/v1/combination/detail?combinationId=${ combinationId }`)

/**
 * 结束活动
 * @param id {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const endSpringPloughing = id => axios.put('/apis/v1/combination/end', { id })

/**
 * 查询春耘活动统计数据
 * @param id
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingStatistics = id => axios.get(`/apis/v2/combination/queryReport?activityId=${ id }`)

/**
 * 查询春耘活动订单数据
 * @param params {object}
 * @property params.current {number}
 * @property params.size {number}
 * @property params.activityId {string}
 * @property params.operatorUserName {string}
 * @property params.orderStatus {number}
 * @property params.condition {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingOrderData = params => axios.get('/apis/v1/combination/queryOrderPage', { params })

/**
 * 检查活动中的商品上下架状态，用户复制活动时的检查
 * @param data
 * @return {Promise<AxiosResponse<T>>}
 */
export const checkSpringPloughingProductStatus = data => axios.post('/apis/v1/combination/check/activity/product', data)

/**
 * 删除春耘活动
 * @param params {object}
 * @property params.id {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const deleteSpringPloughingActivity = params => axios.put('/apis/v1/combination/delete', params)

/**
 * 获取20个年味
 * @param params {object}
 * @property params.activityId {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const materialSchemeList = params => axios.get('/apis/v1/signinActivity/materialSchemeList', { params })

/**
 * 新增年味
 * @param data {object}
 * @property data.activityStartTime {string} 活动时间
 * @property data.activityEndTime {string} 活动时间
 * @property data.winningProbability {string} 中奖率
 * @property data.activityRule {string} 使用说明
 * @property data.userScope {number} 适用用户
 * @property data.userGroupTagModels {array} 部分用户标签
 * @property data.materialSchemeModels {array} 年味标签
 * @property data.giftModels {array} 年味大礼
 * @property data.ladderAward {number} 是否设置阶梯奖
 * @property data.awardModels {array} 阶梯列表
 * @return {Promise<AxiosResponse<T>>}
 */
export const addSigninActivity = data => axios.post('/apis/v1/signinActivity', data)

/**
 * 开始后调用
 * @param data {object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const editActivityInfoDataStart = data => axios.post('/apis/v1/signinActivity/updateActivity/updateStart', data)

/**
 * 未开始调用
 * @param data {object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const editActivityInfoNotStart = data => axios.post('/apis/v1/signinActivity/updateActivity/updateNoStart', data)

/**
 * 年味详情
 * @param activityId {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const signinActivityDetail = activityId => axios.get(`/apis/v1/signinActivity/detail/${ activityId }`)

/**
 * 导出年味数据
 * @param params {Object}
 * @property data.searchContent {string}
 * @property data.orderStatus {string}
 * @property data.operatorUserName {string}
 * @property data.activityId {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const exportSpringData = params => axios.post('/apis/v2/combination/export', null, {
    timeout: 0,
    params,
    responseType: 'blob'
})
