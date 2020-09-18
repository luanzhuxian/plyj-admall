import axios from '../assets/ts/axios-config'

/**
 * 查询直播信息
 */
export const getLiveInfo = () => axios.get('/apis/v1/mall/live/activity/current/home')

/**
 * 新春年味活动信息
 */
export const getNianweiInfo = () => axios.get('/apis/v1/signinActivity/customer/may_join_activity')

/**
 * 获取草稿箱列表
 * @param {object} params
 */
export const getTemplateList = (params: { keyword: string; status: string; type: string; current: number; size: number }) => axios.get('/apis/v1/mall/template/list', { params })

/**
 * 草稿箱模板改名
 * @param {object} data
 * @property {string} data.id
 * @property {string} data.name
 */
export const updateTemplateName = ({ id, name }: { id: string; name: string}) => axios.patch(`/apis/v1/mall/template/update/${ id }/${ name }`)

/**
 * 复制草稿箱模板
 * @param {string} id
 */
export const copyTemplateItem = (id: string) => axios.patch(`/apis/v1/mall/template/copy/${ id }`)

/**
 * 预览草稿箱模板
 * @param {string} id
 */
export const previewTemplateItem = (id: string) => axios.get(`/apis/v1/mall/template/${ id }`)

/**
 * 上架草稿箱模板
 * @param {string} id
 */
export const useTemplateItem = (id: string) => axios.patch(`/apis/v1/mall/template/use/${ id }`)

/**
 * 删除草稿箱模板
 * @param {string} id
 */
export const delTemplateItem = (id: string) => axios.delete(`/apis/v1/mall/template/${ id }`)

/**
 * 批量删除草稿箱模板
 * @param {array} ids
 */
export const delTemplateBatch = (ids: string[]) => axios.post('/apis/v1/mall/template/delete', ids)

/**
 * 查询草稿箱是否已满
 */
export const checkIsFull = () => axios.get('/apis/v1/mall/template/max/count')

/**
 * 更改模板状态：上下架 / 定时上架
 * @param {object} data
 * @property {string} data.id
 * @property {number} data.type 模板id
 * @property {number} data.status 0下架 1上架 2草稿
 * @property {string} data.upShelf 定时上架时间
 */
export const updateTemplateStatus = (data: { id: string; type: number; status: number; upShelf?: string }) => axios.post('/apis/v1/mall/template/update', data)
