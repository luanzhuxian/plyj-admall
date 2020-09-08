import axios from 'axios'

/* 会员列表 */
export const getMemberList = ({ keyword, current, size, tagId, startTime, endTime, roleType }) => axios.get('/apis/v1/systemctl/memberManager/member/list', {
    params: { keyword, current, size, tagId, startTime, endTime, roleType }
})

/* Helper列表 */
export const getHelperList = ({ realName, mobile, ownnerUserId, current, size, auditFlag, auditStatus }) => axios.get('/apis/v1/systemctl/memberManager/helper/list', {
    params: { realName, mobile, ownnerUserId, current, size, auditFlag, auditStatus }
})

/**
 * 会员详情
 * @param params {Object} { mallUserId, roleCode }
 * @returns {Promise<AxiosResponse<T>>}
 */
export const memberDetail = params => axios.get('/apis/v1/systemctl/memberManager/member/detail', { params })

export const orderRebateInfo = ({ userId }) => axios.get('/apis/v2/order/agency/orderRebateInfo', { params: { userId } })

/* 解除helper */
export const relieveHelper = userId => axios.put(`/apis/v1/systemctl/memberManager/release?userId=${ userId }`)

/* 批量解除helper */
export const relieveHelperBatched = userIdArr => axios.put(`/apis/v1/systemctl/memberManager/batch/release?userId=${ userIdArr }`)

/* 启用helper */
export const enabledHelper = userId => axios.put(`/apis/v1/systemctl/memberManager/enable?userId=${ userId }`)

/* 批量启用helper */
export const enabledHelperBatched = userId => axios.put(`/apis/v1/systemctl/memberManager/batch/enable?userId=${ userId }`)

/* helper所属账号变更 */
export const changeHelpersAccount = ({ ownnerUserId, ownneName, userId }) => axios.put(`/apis/v1/systemctl/memberManager/helper/ownner/changed?ownnerUserId=${ ownnerUserId }&ownneName=${ ownneName }&userId=${ userId }`)

/* 分页查询经纪人信息 */
// export const getBrokerList = params => axios.get(`/apis/v1/agent/user/info/audit/page`, { params })

/* 修改经纪人审核状态 */
export const updateBrokerStatus = ({ id, status, agentWriteBack }) => axios.put(`/apis/v1/agent/user/info/audit/${ id }/${ status }?agentWriteBack=${ agentWriteBack }`)

// 获取润笔申请列表
export const getRunbiList = ({ current, size, startTime, endTime, keyword, status }) => axios.get('/apis/v1/agent/user/share/price/record/page', { params: { current, size, startTime, endTime, keyword, status } })

// 修改润笔申请状态
export const updateRunbi = updateModel => axios.put('/apis/v1/agent/user/share/price/record/status', updateModel)

// 获取提现申请列表
export const withdrawDepositList = ({ current, status, startTime, endTime, size, keyword }) => axios.get('/apis/v1/agent/user/withdraw/deposit/page', { params: { size, current, status, startTime, endTime, keyword } })

// 提现审核通过
export const passWithdrawDeposit = ({ ids }) => axios.post('/apis/v1/agent/user/withdraw/deposit/transfer/accounts', { ids })

// 提现拒绝
export const rejectWithdrawDeposit = ({ ids, status, message }) => axios.post('/apis/v1/agent/user/withdraw/deposit/update', { ids, status, message })

// 查询提现详情
export const withdrawDepositDetail = sequenceNbr => axios.get(`/apis/v1/agent/user/withdraw/deposit/${ sequenceNbr }`)

/**
 * HElper详情提现记录
 * @param params {object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const queryMemberDeposit = params => axios.get('/apis/v1/agent/user/withdraw/deposit/page', { params })

/**
 * 订单列表-导出用户订单列表
 * @param params {object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const exportMemberQuery = params => axios.post(
    '/apis/v1/systemctl/memberManager/member/list/export',
    null,
    {
        timeout: 0,
        responseType: 'blob',
        params
    }
)

// 账户中心查看订单数据
export const getOrderList = params => axios.get('/apis/v2/order/agency/employeeOrders', { params })

// 账户中心导出数据
export const exportOrderDetail = params => axios.get('/apis/v2/order/agency/employeeOrders/export', {
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
export const getYouKe = params => axios.get('/apis/v1/systemctl/memberManager/visitor/list', { params })

/* 用户标签 */
// 添加用户标签
export const addTag = tagName => axios.post('/apis/v1/mall/user/tag/add', { tagName })

// 编辑标签
export const updateTag = (id, tagName) => axios.post('/apis/v1/mall/user/tag/update', { id, tagName })

// 删除用户标签
export const deleteTag = id => axios.delete(`/apis/v1/mall/user/tag/delete/${ id }`)

// 获取用户标签列表
export const getTagList = () => axios.get('/apis/v1/mall/user/tag/list')

// 排序用户标签列表
export const sortTagList = ids => axios.post('/apis/v1/mall/user/tag/sort', ids)

// 当前标签是否已经被使用
export const checkIsTagUsed = id => axios.get(`/apis/v1/mall/user/tag/isTagUsed/${ id }`)

// 向当前用户添加标签
export const addTagToMember = (userId, tagIds) => axios.post('/apis/v1/mall/user/tag/relation/add', { userId, tagIds })

// 获取未设置标签的用户数量以及所有用户的数量
export const getMemberNum = () => axios.get('/apis/v1/mall/user/tag/mallTagInfo')
