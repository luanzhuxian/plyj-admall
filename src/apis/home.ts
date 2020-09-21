import axios from '../assets/ts/axios-config'

/**
 * 获取首页信息 会员数 + helper数 + 月访客人数 + 待审核helper + 待审核润笔 + 待提现审核
 */
export const getHomeInfo = () => axios.get('/apis/v2/mall/home/count')

/**
 * 获取首页信息 商品订单数量: 虚拟商品 + 课程商品
 */
export const getProductOrder = () => axios.get('/apis/v2/mall/home/waitRedeemTotal')

/**
 * 获取首页信息 订单相关: 支付订单量 + 收益总额 + 待发货订单 + 待退款订单
 */
export const getOrderInfo = () => axios.get('/apis/v2/mall/home/waitPerfect')

/**
 * 判断是否绑定了手机号
 */
export const isBindMobile = () => axios.get('/apis/v1/base/baseUserInfo/isBindMobile')

/**
 * 绑定管理员手机号
 * @param {object} data
 * @property {string} data.mobile 绑定的手机号
 * @property {string} data.verifyCode 验证码
 */
export const modifyMobile = (data: { mobile: string; verifyCode: string }) => axios.put('/apis/v1/base/baseUserInfo/modifyMobile', data)

// 保存商城信息
export type contactWayType = {
    contactUserName?: string;
    contactWayType: string;
    contactWay: string;
    isDefault?: number;
}
export type mallInfoData = {
    mallName: string;
    province: string;
    city: string;
    region: string;
    town: string;
    address: string;
    provinceCode: string;
    cityCode: string;
    regionCode: string;
    townCode: string;
    consultantUserId: string;
    mallCategoryIds: number[];
    servicePhoneModels: contactWayType[];
    contactWay?: string;
}
export const saveMallInfo = (data: mallInfoData) => axios.post('/apis/v2/mall/save', data)

// 获取主营类目
export const getMainCategories = () => axios.get('/apis/v2/mall/category/list')

/**
 * 获取雅集专属顾问列表
 * @param province {string} 省code
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getConsultantList = (province: string) => axios.get(`/apis/v2/mall/consultant/list?province=${ province }`)
