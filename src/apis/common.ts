import axios from '../assets/ts/axios-config'

/**
 * 获取服务器时间
 */
export const getServerTime = () => axios.post('/apis/v1/order/current/date')

/**
 * 获取sts
 */
export const getSTS = () => axios.get('/apis/v1/oss/upload/sts')
