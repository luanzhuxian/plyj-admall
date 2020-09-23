import axios from '../assets/ts/axios-config'
import { Template } from '../views/mall-manage/utils/types'

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

/**
 * 更新模板模块数据
 * @param {Object} data 模板模块数据
 */
export const updateModule = (data: Template) => axios.post('/apis/v1/mall/template/package', data)

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
 * @param {string} data.keyword 查询关键字
 * @param {number} data.size
 * @param {number} data.current
 * @param {string} data.type
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
 * @param {string} data.keyword 查询关键字
 * @param {number} data.size
 * @param {number} data.current
 * @param {string} data.type
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
 * @param {string} data.keyword 查询关键字
 * @param {number} data.size
 * @param {number} data.current
 * @param {string} data.type
 * @param {string} data.startTime
 * @param {string} data.endTime
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
 * @param {string} data.keyword 查询关键字
 * @param {number} data.size
 * @param {number} data.current
 * @param {string} data.type
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
 * @param {string} data.keyWords 查询关键字
 * @param {number} data.size
 * @param {number} data.current
 */
export const getDistribution = (params: {
    keyWords: string;
    size: number;
    current: number;
}) => axios.get('/apis/v1/marketing/activity/product/pageList', { params })

/**
 * 查询线上课程信息
 * @param {object} data
 * @param {number} data.courseType 1 单课 2 系列课
 */
export const getCourseInfo = (params: { courseType: number }) => axios.get('/apis/v1/knowledgeCourse/findTemplateVideo', { params })

/**
 * 查询图文资料信息列表
 * @param {object} data
 * @param {string} data.searchParam 查询关键字
 * @param {number} data.size
 * @param {number} data.current
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
