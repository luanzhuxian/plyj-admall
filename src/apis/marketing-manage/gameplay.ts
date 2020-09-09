import axios from 'axios'

// 获取营销活动信息
export const getActivitiesInfo = () => axios.get('/apis/v1/group/buy/activityCount/total')

// 查询我的活动权限（双十二、新春、龙门节）
export const getActivityAuth = () => axios.get('/apis/v1/mall/doublet/twelve/lock')
