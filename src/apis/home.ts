import axios from '../assets/ts/axios-config'

/**
 * 获取首页信息 会员数 + helper数 + 月访客人数 + 待审核helper + 待审核润笔 + 待提现审核
 */
export const getHomeInfo = () => axios.get('/apis/v1/base/baseMall/home/count')

/**
 * 获取首页信息 商品订单数量: 虚拟商品 + 课程商品
 */
export const getProductOrder = () => axios.get('/apis/v2/base/baseMall/home/waitRedeemTotal')

/**
 * 获取首页信息 订单相关: 支付订单量 + 收益总额 + 待发货订单 + 待退款订单
 */
export const getOrderInfo = () => axios.get('/apis/v1/base/baseMall/home/count')

/**
 * 判断是否绑定了手机号
 */
export const isBindMobile = () => axios.get('/apis/v1/base/baseUserInfo/isBindMobile')

/**
 * 绑定管理员手机号
 * @param {object} data
 * @property data.mobile 绑定的手机号
 * @property data.verifyCode 验证码
 */
export const modifyMobile = (data: { mobile: string; verifyCode: string }) => axios.put('/apis/v1/base/baseUserInfo/modifyMobile', data)
