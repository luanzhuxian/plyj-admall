import axios from 'axios'
// 分页获取老带新活动列表
export const getActivityList = params => axios.get('/apis/v1/pre/buy/page', { params })
