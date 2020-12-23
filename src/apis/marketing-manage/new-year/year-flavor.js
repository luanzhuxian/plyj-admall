import axios from 'axios'

// 20个年味
export const materialSchemeList = params => axios.get('/apis/v1/signinActivity/materialSchemeList', { params })

// 新增年味
export const signinActivity = data => axios.post('/apis/v1/signinActivity', data)

// 年味详情
export const signinActivityDetail = activityId => axios.get(`/apis/v1/signinActivity/detail/${ activityId }`)

// 年味列表
export const queryActivityInfo = params => axios.get('/apis/v1/signinActivity/queryActivityInfo', { params })

// 结束年味活动
export const endingActivity = ({ activityId, status }) => axios.get(`/apis/v1/signinActivity/updateByStatus/${ activityId }`, { params: { status } })

// 年味活动统计数据
export const activityStatistic = activityId => axios.get(`/apis/v1/signinActivity/queryActivityStatistic/${ activityId }`)

// 年味活动数据列表
export const queryActivityList = (activityId, params) => axios.get(`/apis/v1/signinActivity/queryActivityInfo/${ activityId }`, { params })

// 导出年味活动数据
export const exportActivityStatistic = (activityId, params) => axios.get(`/apis/v1/signinActivity/export/${ activityId }`, {
    params,
    responseType: 'blob',
    timeout: 0
})

// 获得奖品详细
export const queryActivityGiftDetail = (activityId, userId) => axios.get(`/apis/v1/signinActivity/queryGiftByUserId/${ activityId }`, { params: { userId } })

// 年味礼品发放数据
export const queryGiftList = (activityId, params) => axios.get(`/apis/v1/signinActivity/queryGift/${ activityId }`, { params })

// 数据查看详情时间区间
export const signTimeInterval = activityId => axios.get(`/apis/v1/signinActivity/timeInterval/${ activityId }`)

// 数据查看详情每日新增
export const signEveryAddPeopleStatistic = activityId => axios.get(`/apis/v1/signinActivity/queryEveryAddPeopleStatistic/${ activityId }`)

// 数据查看详情当日打卡统计
export const signTodaySigninPeopleStatistic = activityId => axios.get(`/apis/v1/signinActivity/queryTodaySigninPeopleStatistic/${ activityId }`)
