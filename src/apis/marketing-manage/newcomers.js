/**
 * 赢取豪礼
 */

import axios from 'axios'

export const getNewcomersActivities = queryParams => axios.get('/apis/v2/b/newcomerActivitys/page', { params: queryParams })

export const getNewcomersActivityDetail = id => axios.get(`/apis/v1/newcomerActivitys/${ id }/detail`)

export const getNewcomersActivityUsersInfo = (activityId, queryParams) => axios.get(`/apis/v2/b/newcomerActivitys/${ activityId }/userAttendInfo/page`, { params: queryParams })

export const createNewcomersActivity = activityInfo => axios.post('/apis/v1/newcomerActivitys', activityInfo)

export const updateNewcomersActivity = (id, activityInfo) => axios.put(`/apis/v1/newcomerActivitys/${ id }`, activityInfo)

// 结束 新人有礼
export const updateNewcomersActivityStatus = (id, activityStatus) => axios.put(`/apis/v1/newcomerActivitys/${ id }/activityStatus/${ activityStatus }`)

// 删除 新人有礼
export const deleteNewcomersActivityStatus = id => axios.delete(`/apis/v2/b/newcomerActivitys/${ id }`)

// 新增新人有礼活动
export const saveNewcomerActivitys = data => axios.post('/apis/v2/b/newcomerActivitys', data)

// 获取新人活动详情
export const getNewcomerActivitysDeatil = id => axios.get(`/apis/v2/b/newcomerActivitys/${ id }`)

// 更新新人活动
export const updateNewcomerActivitys = (id, data) => axios.put(`/apis/v2/b/newcomerActivitys/${ id }`, data)

// 导出新人有礼活动数据
export const exportNewcomerActivitysDeatil = (id, params) => axios.get(`/apis/v2/b/newcomerActivitys/${ id }/userAttendInfo/export`, {
    timeout: 0,
    responseType: 'blob',
    params
})

// 见学之旅 新增、获取、更新
export const saveRoadLearningActivitys = data => axios.post('/apis/v1/mallCheckIn', data)
export const getRoadLearningActivitysDeatil = id => axios.get(`/apis/v1/mallCheckIn/${ id }`)
export const updateRoadLearningActivitys = (id, data) => axios.put(`/apis/v1/mallCheckIn/${ id }`, data)

// 获取活动列表
export const getActivityList = params => axios.get('/apis/v1/mallCheckIn/page', { params })

// 获取活动统计信息
export const getActivityStat = activityId => axios.get(`/apis/v1/mallCheckIn/${ activityId }/stat`)

// 获取活动分页信息
export const getActivityGiftList = (activityId, params) => axios.get(`/apis/v1/mallCheckIn/${ activityId }/giftClaim/page`, {
    params
})

// 更新活动状态
export const updateActivityStatus = (id, status) => axios.put(`/apis/v1/mallCheckIn/${ id }/status/${ status }`)

// 获取所有满足搜索条件的活动礼品信息并导出
export const exportActivityGiftList = activityId => axios.get(
    `/apis/v1/mallCheckIn/export/${ activityId }/giftClaim/page`,
    {
        timeout: 0,
        responseType: 'blob'
    }
)

// 显示隐藏领取数量
export const claimNumShowFunc = (id, claimNumShow) => axios.put(`/apis/v2/b/newcomerActivitys/${ id }/claimNumShow/${ claimNumShow }`)

// 显示引导页面
export const isShowGuide = () => axios.get('/apis/v2/b/newcomerActivitys/needRemind')
