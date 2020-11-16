// 添加优惠券
import axios from '../../assets/ts/axios-config'

export const saveCoupon = (data: object) => axios.post('/apis/v1/coupon/save', data)

// 编辑优惠券
export const updateCoupon = (data: object) => axios.put('/apis/v1/coupon/update', data)

/**
 * 分页获取优惠券列表
 * @param {object} params
 * @property {string | number} data.couponType
 * @property {string} data.name
 * @property {number | string} data.status
 * @property {number} data.distributionMethod
 * @property {string} data.startTime
 * @property {string} data.endTime
 * @property {number} data.current
 * @property {number} data.size
 */
export const getCouponList = (params: {
    couponType: string | number;
    name: string;
    status: number | string;
    distributionMethod?: number;
    startTime: string;
    endTime: string;
    current: number;
    size: number;
}) => axios.get('/apis/v1/coupon/selectByName', { params })

/**
 * 查看优惠券
 * @param {object} params
 * @property {string} data.couponId
 * @property {string} data.name
 * @property {number | string} data.status
 * @property {string} data.startTime
 * @property {string} data.endTime
 * @property {number} data.current
 * @property {number} data.size
 */
export const selectCouponDetail = (params: {
    couponId: string;
    name: string;
    status: number | string;
    startTime: string;
    endTime: string;
    current: number;
    size: number;
}) => axios.get('/apis/v1/coupon/selectCouponPageDetail', { params })

// 查看优惠券统计
export const getCouponstatistics = (id: string) => axios.get(`/apis/v1/coupon/statistics/${ id }`)

// 修改优惠券状态
export const couponModifystatus = ({ id, status }: { id: string; status: number }) => axios.put(`/apis/v1/coupon/modify/status/${ id }/${ status }`)

// 复制优惠券
export const copyCoupon = (id: string) => axios.post(`/apis/v1/coupon/copyCoupon/${ id }`)

// 分页获取优惠券列表
export const getCouponDetail = (id: string) => axios.get(`/apis/v1/coupon/selectById/${ id }`)

// 是否首次进入优惠券
export const coupleIsFirstTime = () => axios.get('/apis/v1/mallActivitys/couple/isFirstTime')

// 查询当前活动是否有被活动使用
export const getActivityListUseCoupon = (id: string) => axios.get(`/apis/v1/coupon/getActivityListUseCoupon/${ id }`)

// 查询当前优惠券是否参与其他活动
// export const getUseCouponActivityType = id => axios.get(`/apis/v1/coupon/byCouponIdQueryActivy/${id}`)

// 查询用户分组
export const getUserTtagList = () => axios.get('/apis/v2/user/tag')

// 删除优惠券
export const deleteCoupon = (id: string) => axios.put(`/apis/v1/coupon/delete/${ id }`)

/**
 * 满减券导出
 * @param {object} params
 * @property {string} data.couponId
 * @property {string} data.name
 * @property {number | string} data.status
 * @property {string} data.startTime
 * @property {string} data.endTime
 * @property {number} data.current
 * @property {number} data.size
 */
export const exportReductionCoupon = (params: {
    couponId: string;
    name: string;
    status: number | string;
    startTime: string;
    endTime: string;
    current: number;
    size: number;
}) => axios.get('/apis/v1/coupon/exportCouponDetail', {
    responseType: 'blob',
    timeout: 0,
    params
})
