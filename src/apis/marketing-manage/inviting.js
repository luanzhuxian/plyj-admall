import axios from 'axios'

// 分页获取邀新活动列表
export const getInviting = params => axios.get('/apis/v1/invitingEvents/page', { params })

// 操作活动状态
export const changeInvitingStatus = (id, status) => axios.put(`/apis/v1/invitingEvents/${id}/activityStatus/${status}`)

// 创建邀新活动
export const saveInviting = data => axios.post('/apis/v1/invitingEvents', data)

// 获取活动详情
export const getInvitingDetail = id => axios.get(`/apis/v1/invitingEvents/${id}`)

// 更新活动
export const updateInviting = (id, data) => axios.post(`/apis/v1/invitingEvents/${id}`, data)

// 分页查询礼物领取信息
export const getClaimGift = params => axios.get('/apis/v1/invitingEvents/page/claimGift', { params })

// 分页查询赢取豪礼-活动详情列表
export const getInvitingDetailList = params => axios.get('/apis/v1/invitingEvents/page/selectActivityDetail', { params })

// 导出礼物领取信息
export const exportClaimGift = params =>
  axios.get('/apis/v1/invitingEvents/export/page/claimGift', {
    responseType: 'blob',
    timeout: 0,
    params
  })

// 导出礼物领取信息
export const exportInvitingDetailList = params =>
  axios.get('/apis/v1/invitingEvents/page/selectActivityDetail/export', {
    responseType: 'blob',
    timeout: 0,
    params
  })
