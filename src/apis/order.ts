// @ts-nocheck
import axios from 'axios'
// 商户发货
export const physicalorderShipment = data => axios.post('/apis/v2/order/confirm/delivery', data)

// 修改发货
export const updateOrderShipment = data => axios.post('/apis/v2/order/update/delivery', data)

// 修改收货人信息
export const modifyConsigneeInformation = data => axios.post('/apis/v2/order/update/consignee', data)

// NEW:待提交 WAIT_PAY:待支付 WAIT_SHIP:待发货 WAIT_RECEIVE:待收货 FINISHED:订单完成 WAIT_REFUND:待退款 WAIT_RETURN:等待买家发货 RETURN_RECEIVE:等待商家收货 CLOSED:订单关闭

/**
 * 获取订单列表
 * @param params {Object}
 * @property params.current {number}
 * @property params.size {number}
 * @param data {Object}
 * @property data.goodsTypes: ['PHYSICAL_GOODS', 'VIRTUAL_GOODS', 'FORMAL_CLASS', 'EXPERIENCE_CLASS', 'KNOWLEDGE_COURSE', 'SERIES_OF_COURSE', 'LIVE_GOODS'] {array}
 * @property data.orderStatus {number}
 * @property data.keywords {string}
 * @property data.startTime {string}
 * @property data.endTime {string}
 * @property data.orderType {string}
 * @property data.categoryName {string}
 * @property data.operatorUser {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getOrderQuery = (params, data) => axios.post('/apis/v2/order/page', data, { params })

// 订单列表-导出用户订单列表
export const exportOrderQuery = data => axios.post(
    '/apis/v2/order/page/export',
    data,
    {
        timeout: 0,
        responseType: 'blob'
    }
)

// 获取活动统计数据
export const activityDataList = (params, data) => axios.post('/apis/v2/order/business/page', data, { params })

// 获取组合课活动统计数据
export const courseActivityDataList = params => axios.get('/apis/v2/combination/queryOrderPage', { params })

// 获取组合课活动统计数据
export const refundsMaxAmount = data => axios.post('/apis/v2/order/refunds/max/amount', data)

// 订单详情
export const getOrderDetail = orderId => axios.get('/apis/v2/order/detail', { params: { orderId } })

// 售后单详情
export const getBackorderDetail = id => axios.get('/apis/v2/order/refunds/detail', { params: { id } })

// 订单取消
export const cancelOrder = params => axios.get('/apis/v2/order/cancel', { params })

// 订单查看预约
export const queryPickup = orderId => axios.get(`/apis/v1/order/logistics/agency/query/pickup/${ orderId }`)

// 订单申请售后
export const refundApply = data => axios.post('/apis/v2/order/refunds/apply/refund', data)

// 售后单-分页查询用户退单列表
export const getReturnOrdersList = (params, data) => axios.post('/apis/v2/order/refunds/order/Page', data, { params })

// 售后单 快速退款
export const returnOrdersListSuperRefund = params => axios.post('/apis/v2/order/refunds/confirm/refunds', null, { params })

// 售后单 确认收货
export const returnOrdersListConfirmGoods = params => axios.post('/apis/v2/order/refunds/confirm/goods', null, { params })

// 售后单 通过审核
export const returnOrdersListAgree = params => axios.post('/apis/v2/order/refunds/pass', null, { params })

// 售后单 修改金额
export const modifyActualRefund = data => axios.post('/apis/v2/order/refunds/modifyActualRefund', data)

// 售后单 驳回订单
export const returnOrdersListTurnDown = data => axios.post('/apis/v2/order/refunds/reject', data)

// 售后单-导出用户订单列表
export const exportBackOrderQuery = data => axios.post(
    '/apis/v2/order/refunds/order/Page/export',
    data,
    {
        responseType: 'blob',
        timeout: 0
    }
)

// 获取发票列表
export const getInvoiceList = ({ keywords, startTime, endTime, current, size, status }) => axios.get('/apis/v2/order/invoice/page', { params: { keywords, startTime, endTime, current, size, status } })

// 作废发票
export const obsoleteInvoiceStatus = data => axios.post('/apis/v1/invoice/invoice/admin/invalid', data)

// 修改、确认 发票
export const confirmModifyInvoiceStatus = data => axios.post('/apis/v2/order/invoice/update/number', data)

// 取消申请发票
export const cancelInvoiceStatus = data => axios.post('/apis/v2/order/invoice/cancel', data)

// 删除发票
export const deleteInvoiceStatus = data => axios.post('/apis/v2/order/invoice/delete', data)

// 作废发票
export const invalidInvoiceStatus = data => axios.post('/apis/v2/order/invoice/invalid', data)

// 获取发票详情
export const getInvoiceDetail = id => axios.get('/apis/v2/order/invoice/detail', { params: { id } })

// 获取是否有未核销
export const confirmInvoice = id => axios.get(`/apis/v1/invoice/invoice/admin/confirm?id=${ id }`)

// 发票-导出用户订单列表
export const exportInvoiceQuery = data => axios.post(
    '/apis/v2/order/invoice/page/export',
    data,
    {
        responseType: 'blob',
        timeout: 0
    }
)

// 获取订单对应的物流公司
export const getCompany = params => axios.get('/apis/v2/product/company', { params })

// 预约取件
export const courierCompany = ({ orderSn, courierCompany, addressSeq, startTime, endTime }) => axios.post(`/apis/v1/order/logistics/agency/pickup/${ orderSn }`, null, { params: { courierCompany, addressSeq, startTime, endTime } })

// 取消预约
export const cancelCourier = (orderSn, courierCompanyCode) => axios.post(`/apis/v1/order/logistics/agency/cancel/pickup/${ orderSn }?courierCompany=${ courierCompanyCode }`)

// 发票订单查询
export const selectOrderForInvoice = data => axios.post('/apis/v2/order/invoice/user/not/invoice/order', data)

// 发票订单明细查询
export const selectDetailInvoice = params => axios.get('/apis/v2/order/invoice/orderId', { params })

// 已申请发票订单明细查询
export const selectInvoiceDetail = id => axios.post('/apis/v1/invoice/invoice/admin/selectInvoiceDetail', { id })

// 查询企业税号公司名
export const getEinList = userId => axios.post('/apis/v1/base/baseUserInvoice/select', { userId })

// 新增企业税号公司名
export const addEinList = data => axios.post('/apis/v1/base/baseUserInvoice/add', data)

// 查询用户收票地址
export const getAddressList = userId => axios.get(`/apis/v1/publicuser/address/user/list?type=2&userId=${ userId }`)

// 新增用户收票地址
export const addAddressList = data => axios.post('/apis/v1/publicuser/address/admin/add', data)

// 地址新增查询省市区
export const getLocation = code => axios.get(`/apis/v1/systemctl/location/parent/${ code }`)

// 管理员帮忙发票申请
export const applyInvoice = data => axios.post('/apis/v2/order/invoice/apply', data)

// 管理修改发票申请
export const editInvoice = data => axios.post('/apis/v2/order/invoice/update', data)

// 获取售后单详情
export const refundDetail = data => axios.post('/apis/v1/refund/refund/admin/selectRefundDetail', data)

// 订单详情修改学员信息
export const updateStudentInfo = data => axios.post('/apis/v2/redeem/update/user', data)

// 修改自定义学员信息
export const updateCustomForm = data => axios.post('/apis/v2/order/update/custom', data)

// 12位核销状态查询-虚拟商品核销
export const byredeemcode = ({ redeemCode }) => axios.get('/apis/v2/redeem/byredeemcode', { params: { redeemCode } })

// 14位核销状态查询-礼品核销
export const byredeemcodeActive = ({ redeemCode }) => axios.get('/apis/v1/gift/detail', { params: { redeemCode } })

// 12位核销查询-虚拟商品核销
export const auditredeemcode = ({ redeemCode }) => axios.post('/apis/v2/redeem/audit', null, { params: { redeemCode } })

// 14位核销查询-礼品核销
export const auditredeemcodeActive = ({ redeemCode }) => axios.put(`/apis/v1/gift/${ redeemCode }/update`)

// 无码核销
export const batchAuditredeemcode = ({ orderId }) => axios.post('/apis/v2/redeem/batch/audit', null, { params: { orderId } })

// 详情redeemId核销
export const singleAuditredeemcode = ({ redeemId }) => axios.post('/apis/v2/redeem/single/audit', null, { params: { redeemId } })

// 核销人员查询
export const redeemUserList = () => axios.get('/apis/v1/base/baseUserInfo/redeemUserList')

// 查询网校订单列表
export const getNetSchoolOrderList = params => axios.get('/apis/v1/knowledgeCourse/findOrderList', { params })

// 导出网校订单列表
export const exportNetSchoolOrderList = params => axios.get(
    '/apis/v1/knowledgeCourse/exportOrderList',
    {
        timeout: 0,
        responseType: 'blob',
        params
    }
)

// 查询网校订单详情
export const getNetSchoolOrderDetail = id => axios.get(`/apis/v1/knowledgeCourse/orderListDetail/${ id }`)
