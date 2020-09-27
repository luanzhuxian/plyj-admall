import axios from '../assets/ts/axios-config'
import { Template } from '../views/mall-manage/utils/types'

/**
 * 获取当前模板信息
 * @param {object} params
 * @property {number} params.type 1 首页 2 主会场
 */
export const getCurrentTemplate = (params: { type: number }) => axios.get('/apis/v1/mall/template/system/current', { params })

/**
 * 根据id查询模板信息
 * @param {string} id
 */
export const getTemplateById = (id: string) => axios.get(`/apis/v1/mall/template/${ id }`)

/**
 * 创建或者修改模板
 * @param {object} data 模板数据
 */
export const updateCurrentTemplate = (data: Template) => axios.post('/apis/v1/mall/template', data)

/**
 * 更改模板状态：上下架 / 定时上架
 * @param {object} data
 * @property {string} data.id 模板id
 * @property {number} data.type 1 首页 2 主会场
 * @property {number} data.status 0下架 1上架 2草稿
 * @property {string} data.upShelf 定时上架时间
 */
export const updateTemplateStatus = (data: {
    id: string;
    type: number;
    status: number;
    upShelf?: string;
}) => axios.post('/apis/v1/mall/template/update', data)

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
 * 更新模板模块数据
 * @param {Object} data 模板模块数据
 */
export const updateModule = (data: Template) => axios.post('/apis/v1/mall/template/package', data)

/**
 * 下架当前模板
 * @param {object} data
 * @property {string} data.id
 * @property {number} data.type 1 首页 2 主会场
 */
export const takeOffCurrentTemplate = ({ id, type }: { id: string; type: number }) => axios.get(`/apis/v1/mall/template/takeOff/${ id }?type=${ type }`)

/**
 * 查询最大额度优惠券信息
 */
export const getMaxCoupon = () => axios.get('/apis/v1/coupon/getMostPreferential')

/**
 * 查询服务器时间
 */
export const getServerTime = () => axios.get('/apis/v1/mall/template/current/time')

/**
 * 查询品宣
 * @param {object} data
 * @property {string} data.keyword 查询关键字
 * @property {number} data.size
 * @property {number} data.current
 * @property {string} data.type
 */
export const getPintuan = (params: {
    keyword: string;
    size: number;
    current: number;
    type: string;
}) => axios.get('/apis/v1/group/buy/page/activity', { params })

/**
 * 查询预购
 * @param {object} data
 * @property {string} data.keyword 查询关键字
 * @property {number} data.size
 * @property {number} data.current
 * @property {string} data.type
 */
export const getYugou = (params: {
    keyword: string;
    size: number;
    current: number;
    type: string;
}) => axios.get('/apis/v1/pre/buy/page/activity', { params })

/**
 * 查询秒杀
 * @param {object} data
 * @property {string} data.keyword 查询关键字
 * @property {number} data.size
 * @property {number} data.current
 * @property {string} data.type
 * @property {string} data.startTime
 * @property {string} data.endTime
 */
export const getMiaosha = (params: {
    keyword: string;
    size: number;
    current: number;
    type: string;
    startTime: string;
    endTime: string;
}) => axios.get('/apis/v1/seckill/activity/page/activity', { params })

/**
 * 查询优惠券
 * @param {object} data
 * @property {string} data.keyword 查询关键字
 * @property {number} data.size
 * @property {number} data.current
 * @property {string} data.type
 */
export const getCoupon = (params: {
    keyword: string;
    size: number;
    current: number;
    type: string;
}) => axios.get('/apis/v1/coupon/select/page', { params })

/**
 * 查询营销活动商品
 * @param {object} data
 * @property {string} data.keyWords 查询关键字
 * @property {number} data.size
 * @property {number} data.current
 */
export const getDistribution = (params: {
    keyWords: string;
    size: number;
    current: number;
}) => axios.get('/apis/v1/marketing/activity/product/pageList', { params })

/**
 * 查询线上课程信息
 * @param {object} data
 * @property {number} data.courseType 1 单课 2 系列课
 */
export const getCourseInfo = (params: { courseType: number }) => axios.get('/apis/v1/knowledgeCourse/findTemplateVideo', { params })

/**
 * 查询图文资料信息列表
 * @param {object} data
 * @property {string} data.searchproperty 查询关键字
 * @property {number} data.size
 * @property {number} data.current
 */
export const getImageTextList = (params?: {
    searchParam: string;
    size: number;
    current: number;
}) => axios.get('/apis/v1/graphic/template/graphicDataPage', { params })

/**
 * 获取品宣信息
 */
export const getPingXuan = () => axios.get('/apis/v1/brand/branding/query')

/**
 * 获取店铺模板列表
 */
export const getDefaultTemplateList = () => axios.get('/apis/v1/mall/template/system/template')

/** *********** 换肤 ************ **/
/**
 * 换肤
 * @param {number} skinId 皮肤id
 * @param {object} params
 * @property {object} params.type 1 首页
 */
export const updateSkinStatus = (skinId: number, params: { type: number}) => axios.get(`/apis/v1/mall/template/updateSkinStatus/${ skinId }`, { params })

/**
 * 皮肤下架
 * @param {object} params
 * @property {object} params.type 1 首页
 */
export const cancelSkinStatus = (params: { type: number}) => axios.get('/apis/v1/mall/template/cancelSkinStatus', { params })

/**
 * 查询当前皮肤
 * @param {object} params
 * @property {object} params.type 1 首页
 */
export const getSkinStatus = (params: { type: number}) => axios.get('/apis/v1/mall/template/getSkinStatus', { params })
