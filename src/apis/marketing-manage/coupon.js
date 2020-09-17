// 添加优惠券
import axios from 'axios'

export const saveCoupon = (data) => axios.post(`/apis/v1/coupon/save`, data)

// 编辑优惠券
export const updateCoupon = (data) => axios.put(`/apis/v1/coupon/update`, data)

// 分页获取优惠券列表
export const getCouponList = params => axios.get('/apis/v1/coupon/selectByName', { params })

// 查看优惠券
export const selectCouponDetail = params => axios.get('/apis/v1/coupon/selectCouponPageDetail', { params })

// 查看优惠券统计
export const getCouponstatistics = id => axios.get(`/apis/v1/coupon/statistics/${id}`)

// 修改优惠券状态
export const couponModifystatus = ({ id, status }) => axios.put(`/apis/v1/coupon/modify/status/${id}/${status}`)

// 复制优惠券
export const copyCoupon = (id) => axios.post(`/apis/v1/coupon/copyCoupon/${id}`)

// 分页获取优惠券列表
export const getCouponDetail = id => axios.get(`/apis/v1/coupon/selectById/${id}`)

// 是否首次进入优惠券
export const coupleIsFirstTime = () => axios.get(`/apis/v1/mallActivitys/couple/isFirstTime`)

// 查询当前活动是否有被活动使用
export const getActivityListUseCoupon = id => axios.get(`/apis/v1/coupon/getActivityListUseCoupon/${id}`)

// 查询当前优惠券是否参与其他活动
// export const getUseCouponActivityType = id => axios.get(`/apis/v1/coupon/byCouponIdQueryActivy/${id}`)

// 查询用户分组
export const getUserTtagList = () => axios.get(`/apis/v1/mall/user/tag/list`)

// 删除优惠券
export const deleteCoupon = id => axios.put(`/apis/v1/coupon/delete/${id}`)

// 满减券导出
export const exportReductionCoupon = params => axios.get('/apis/v1/coupon/exportCouponDetail', {
  responseType: 'blob',
  timeout: 0,
  params
})
