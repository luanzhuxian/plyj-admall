// @ts-nocheck
import axios from '../assets/ts/axios-config'

// export const getReviewModuleFunc = () => axios.get('/apis/v1/agency/mall/home/template/list')

// export const createOrUpdateModuleFunc = data => axios.post('/apis/v1/agency/mall/home/template/create', data)

// export const deleteModuleDataFunc = deleteId => axios.delete(`/apis/v1/agency/agencymall/home/module/delete/${deleteId}`)

// 获取首页商品信息
export const getHomeGoods = data => axios.post('/apis/v1/product/find/sale', data)

// 获取当前模板信息
export const getCurrentTemplate = params => axios.get('/apis/v1/mall/template/system/current', { params })

// 根据id查询模板信息
export const getTemplateById = id => axios.get(`/apis/v1/mall/template/${ id }`)

// 创建或者修改模板
export const updateCurrentTemplate = data => axios.post('/apis/v1/mall/template', data)

// 更改模板状态上下架、定时上架
// id, status: 0下架 1上架 2草稿, upShelf：定时上架时间
export const updateTemplateStatus = data => axios.post('/apis/v1/mall/template/update', data)

/**
 * 更新模板模块数据
 * @param {Object} data 模板模块数据
 */
export const updateModule = data => axios.post('/apis/v1/mall/template/package', data)

// 获取草稿箱列表
export const getTemplateList = params => axios.get('/apis/v1/mall/template/list', { params })

// 草稿箱模板改名
export const updateTemplateName = ({ id, name }) => axios.patch(`/apis/v1/mall/template/update/${ id }/${ name }`)

// 复制草稿箱模板
export const copyTemplateItem = id => axios.patch(`/apis/v1/mall/template/copy/${ id }`)

// 预览草稿箱模板
export const previewTemplateItem = id => axios.get(`/apis/v1/mall/template/${ id }`)

// 上架草稿箱模板
export const useTemplateItem = id => axios.patch(`/apis/v1/mall/template/use/${ id }`)

// 删除草稿箱模板
export const delTemplateItem = id => axios.delete(`/apis/v1/mall/template/${ id }`)

// 批量删除草稿箱模板
export const delTemplateBatch = data => axios.post('/apis/v1/mall/template/delete', data)

// 下架当前主会场模板
export const takeOffCurrentActivityTemplate = ({ id, type }) => axios.get(`/apis/v1/mall/template/takeOff/${ id }?type=${ type }`)

// 获取店铺预设模板列表
export const getDefaultTemplateList = () => axios.get('/apis/v1/mall/template/system/template')

// 查询草稿箱是否已满
export const checkIsFull = () => axios.get('/apis/v1/mall/template/max/count')

// 是否提醒用户有新模板
export const checkIsTemplateAlertShow = () => axios.get('/apis/v1/base/baseMall/tempalteStatus')

// 获取品宣信息
export const getPingXuan = () => axios.get('/apis/v1/brand/branding/query')

export const getPintuan = params => axios.get('/apis/v1/group/buy/page/activity', { params })

export const getYugou = params => axios.get('/apis/v1/pre/buy/page/activity', { params })

export const getMiaosha = params => axios.get('/apis/v1/seckill/activity/page/activity', { params })

export const getCoupon = params => axios.get('/apis/v1/coupon/select/page', { params })

// 查询营销活动商品
export const getDistribution = params => axios.get('/apis/v1/marketing/activity/product/pageList', { params })

// 查询服务器时间
export const getServerTime = () => axios.get('/apis/v1/mall/template/current/time')

// 查询直播信息
export const getLiveInfo = () => axios.get('/apis/v1/mall/live/activity/current/home')

// 查询线上课程信息
export const getCourseInfo = params => axios.get('/apis/v1/knowledgeCourse/findTemplateVideo', { params })

// 查询图文资料信息列表
export const getImageTextList = params => axios.get('/apis/v1/graphic/template/graphicDataPage', { params })

// 查询最大额度优惠券信息
export const getMaxCoupon = () => axios.get('/apis/v1/coupon/getMostPreferential')

// 查询邀新活动信息
export const getInvitingEvent = () => axios.get('/apis/v1/invitingEvents/currActiviy/baseInfo')

// 见学之路活动信息
export const getJianxueInfo = () => axios.get('/apis/v1/mallCheckIn/currActivity/baseInfo')

// 新春年味活动信息
export const getNianweiInfo = () => axios.get('/apis/v1/signinActivity/customer/may_join_activity')

/** ********** 换肤 ************ **/
// skinStatus: 0: 默认没有皮肤, 1: 圣诞皮肤, 2: 新春皮肤
export const updateSkinStatus = (skinId, params) => axios.get(`/apis/v1/mall/template/updateSkinStatus/${ skinId }`, { params })

// 皮肤下架
export const cancelSkinStatus = params => axios.get('/apis/v1/mall/template/cancelSkinStatus', { params })

// 查询当前皮肤
export const getSkinStatus = params => axios.get('/apis/v1/mall/template/getSkinStatus', { params })
