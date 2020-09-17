import axios from 'axios'

/**
 * 公益行动列表
 * @param {number} size
 * @param {number} current
 * @param {string} keyword
 * @param {string} status
 * @param {date} startTime
 * @param {date} endTime
 */
export const getPublicBenefitList = params => axios.get('/apis/v2/commonweal/page', { params })

/**
 * 公益活动状态修改
 * @param {string} activityId
 * @param {number} status  2关闭 0删除
 */
export const updatePublicBenefitStatus = ({ activityId, status }) => axios.put(`/apis/v1/commonweal/${ activityId }/${ status }`)

/**
 * 公益活动详情
 * @param {string} activityId
 */
export const getPublicBenefitDetail = activityId => axios.get(`/apis/v1/commonweal/${ activityId }/detail`)

// 添加公益活动
export const addPublicBenefit = data => axios.post('/apis/v1/commonweal/save', data)

/**
 * 修改公益行动
 * @param {string} activityId
 */
export const updatePublicBenefit = ({ activityId, data }) => axios.put(`/apis/v1/commonweal/${ activityId }/update`, data)

/**
 * 公益行动统计
 * @param {string} activityId
 */
export const getPublicBenefitStatistics = activityId => axios.get(`/apis/v2/commonweal/${ activityId }/statistics`)

/**
 * 公益活动统计列表
 * @param {string} activityId
 */
export const getPublicBenefitActivityList = ({ activityId, params }) => axios.get(`/apis/v1/commonweal/${ activityId }/orders`, { params })

/**
 * 公益活动导出
 * @param {string} activityId
 */
export const exportPublicBenefit = data => axios.post('/apis/v2/commonweal/orders/export', null, {
    responseType: 'blob',
    timeout: 0,
    data
})
