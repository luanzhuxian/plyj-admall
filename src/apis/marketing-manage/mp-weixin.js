import axios from 'axios'

// 分页公众号列表
export const mpWeixinQuery = (params) => axios.get('/apis/v1/wechatQRCode/list', { params })

export const mpWeixinDetail = id => axios.get(`/apis/v1/wechatQRCode/detail/${id}`)

export const addMmpWeixin = params => axios.post(`/apis/v1/wechatQRCode`, params)

export const updateMmpWeixin = params => axios.post(`/apis/v1/wechatQRCode/update`, params)

export const updateMmpWeixinStatus = (id, params) => axios.get(`/apis/v1/wechatQRCode/updateStatus/${id}`, { params })
