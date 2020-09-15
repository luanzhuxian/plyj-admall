import axios from '../assets/ts/axios-config'

/**
 * 查询直播信息
 */
export const getLiveInfo = () => axios.get('/apis/v1/mall/live/activity/current/home')

/**
 * 新春年味活动信息
 */
export const getNianweiInfo = () => axios.get('/apis/v1/signinActivity/customer/may_join_activity')
