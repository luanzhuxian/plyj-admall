import axios from '../assets/ts/axios-config'

/* 会员统计信息 */
export const getMemberData = () => axios.get('/apis/v2/user/count')

/* 会员列表 */
export const getMemberList = ({ current, size, keyword, roleCode, userSource, startTime, endTime, loginStartTime, loginEndTime, lastPurchaseStartTime, lastPurchaseEndTime, purchasesMinNumber, purchasesMaxNumber, purchasesMinAmount, purchasesMaxAmount, tagId }: any) => axios.get('/apis/v2/user', {
    params: { current, size, keyword, roleCode, userSource, startTime, endTime, loginStartTime, loginEndTime, lastPurchaseStartTime, lastPurchaseEndTime, purchasesMinNumber, purchasesMaxNumber, purchasesMinAmount, purchasesMaxAmount, tagId }
})

/* Helper列表 */
export const getHelperList = ({ keyword, ownnerUser, current, size, auditFlag, auditStatus, loginStartTime, loginEndTime, startTime, endTime }: any) => axios.get('/apis/v2/helper', {
    params: { keyword, ownnerUser, current, size, auditFlag, auditStatus, loginStartTime, loginEndTime, startTime, endTime }
})

/**
 * 会员详情
 * @param params {Object} { mallUserId, roleCode }
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getMemberDetail = (id: any) => axios.get(`/apis/v2/user/${ id }`)

// 统计用户订单数
export const getMemberOrderCount = (id: any) => axios.get(`/apis/v2/user/order/${ id }`)

export const saveMemberInfo = (params: any) => axios.put('/apis/v2/user', params)

/**
 * Helper 详情
 * @param id
 */
export const getHelperDetail = (id: any) => axios.get(`/apis/v2/helper/${ id }`)

export const getHelperStatistics = (id: string) => axios.get(`/apis/v2/user/order/helper/${ id }`)

export const orderRebateInfo = ({ userId }: any) => axios.get('/apis/v2/order/agency/orderRebateInfo', { params: { userId } })

/* 解除helper */
export const relieveHelper = (ids: any) => axios.post('/apis/v2/helper/demote', ids)

/* 批量解除helper */
export const relieveHelperBatched = (ids: any) => axios.post('/apis/v2/helper/demote', ids)

/* helper所属账号变更 */
export const changeHelpersAccount = ({ ownerUserId, userId }: any) => axios.put(`/apis/v2/helper/audit/${ ownerUserId }`, userId)

/* 修改经纪人审核状态 */
export const updateBrokerStatus = ({ ids, status, reviewContent }: any) => axios.post('/apis/v2/helper/audit', { ids, status, reviewContent })

/**
 * HElper详情提现记录
 * @param params {object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const queryMemberDeposit = (params: any) => axios.get('/apis/v1/agent/user/withdraw/deposit/page', { params })

/**
 * 订单列表-导出用户订单列表
 * @param params {object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const exportMemberQuery = (params: any): Promise<Blob> => axios.post(
    '/apis/v1/systemctl/memberManager/member/list/export',
    null,
    {
        timeout: 0,
        responseType: 'blob',
        params
    }
)

// 账户中心查看订单数据
export const getOrderList = (params: any) => axios.get('/apis/v2/user/order', { params })

// 账户中心查看订单数据
export const getLiveWatchList = (params: any) => axios.get('/apis/v2/live/visitor', { params })

// 账户中心查看订单数据
export const getLineLearningList = (params: any) => axios.post('/apis/v2/course/watch/record', params)
// 账户中心导出数据
export const exportOrderDetail = (params: any) => axios.get('/apis/v2/order/agency/employeeOrders/export', {
    timeout: 0,
    responseType: 'blob',
    params
})

/**
 * 获取游客列表
 * @param params {object}
 * @property params.size {number}
 * @property params.current {number}
 * @property params.nickName {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getYouKe = (params: any) => axios.get('/apis/v2/tourist', { params })

export const getYouKeCount = () => axios.get('/apis/v2/tourist/count')

/* 用户标签 */
// 添加用户标签
export const addTag = (tagName: string) => axios.post('/apis/v1/mall/user/tag/add', { tagName })

// 编辑标签
export const updateTag = (params: any) => axios.post('/apis/v2/user/tag', params)

// 删除用户标签
export const deleteTag = (id: string) => axios.delete(`/apis/v2/user/tag/${ id }`)

// 获取用户标签列表
export const getTagList = (keyword: string) => axios.get('/apis/v2/user/tag', { params: { keyword } })

// 排序用户标签列表
export const sortTagList = (ids: string[]) => axios.post('/apis/v2/user/tag/sort', ids)

// 当前标签是否已经被使用
export const checkIsTagUsed = (id: string) => axios.get(`/apis/v2/user/tag/isTagUsed/${ id }`)

// 向当前用户添加标签
export const addTagToMember = (userId: string, tags: string[]) => axios.post('/apis/v2/user/tag/r', { userId, tags })

// 查看 当前学员观看列表
export const getWatchDetailList = (userId: string, courseId: string) => axios.get(`/apis/v2/course/watch/record/${ userId }/${ courseId }`)

// 新增备注信息
export const saveRemark = (params: any) => axios.post('/apis/v2/user/remark', params)

// 查看 当前备注列表
export const getRemarkList = (params: any) => axios.get('/apis/v2/user/remark', { params })

// 新增备注信息
export const deleteRemark = (params: any) => axios.delete('/apis/v2/user/remark', { params })
// 查看 当前helper提现记录
export const getWithdrawalRecords = (params: any) => axios.get('/apis/v2/helper/account', { params })
