import axios from 'axios'

// 分页获取秒杀活动列表
export const secondActivityPage = params => axios.get('/apis/v2/seckill/activity/page', { params })

// 创建秒杀活动
export const createSecondActivity = params => axios.post(`/apis/v1/seckill/activity`, params)

// 修改秒杀活动
export const updateSecondActivity = params => axios.post(`/apis/v1/seckill/activity/update`, params)

// 结束秒杀
export const updateActivityStatus = params => axios.put(`/apis/v1/seckill/activity/modifyStatus`, params)

// 查询秒杀活动详情
export const secondActivityDetail = id => axios.get(`/apis/v1/seckill/activity/${id}`)

// 秒杀活动选择商品
export const secondActivityGoods = params => axios.get(`/apis/v1/group/buy/selectProduct`, { params })

// 复制秒杀活动
export const duplicateSecondActivity = id => axios.get(`/apis/v1/seckill/activity/${id}`)
