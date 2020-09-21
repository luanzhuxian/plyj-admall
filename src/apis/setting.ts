// @ts-nocheck
import axios from '../assets/ts/axios-config'
// 消息类型
export const getTemplateTypeLIst = () => axios.get('/apis/v1/agency/reminder/list')

export const createReminder = data => axios.post('/apis/v1/agency/reminder', data)

export const getReminderData = params => axios.get('/apis/v1/agency/reminder/page', { params })

export const deleteReminder = id => axios.delete(`/apis/v1/agency/reminder/${ id }`)

export const editReminder = ({ id, data }) => axios.put(`/apis/v1/agency/reminder/${ id }`, data)

// 获取权限树
export const getAllRolesByCode = roleCode => axios.patch(`/apis/v1/menu/role/${ roleCode }`)

// 修改店铺名称
export const mendShopName = params => axios.put('/apis/v1/agency/AgencyMall/mallName/modified', null, { params })

// 修改客服电话
export const mendSupportPhone = params => axios.put('/apis/v1/agency/AgencyMall/supportPhone/modified', null, { params })

// 修改店铺介绍
export const mendMallDesc = params => axios.put('/apis/v1/agency/AgencyMall/mallDesc/modified', null, { params })

// 获取机构主页
export const brandingQuery = () => axios.get('/apis/v1/brand/branding/query')

// 获取机构主页
export const brandingUpdate = data => axios.post('/apis/v1/brand/branding/saveOrUpdate', data)

// 设置公众号
export const setWechat = data => axios.put('/apis/v2/mall/wechat', data)
// 设置客服
export const setPhone = data => axios.post('/apis/v1/service/phone/update', data)
