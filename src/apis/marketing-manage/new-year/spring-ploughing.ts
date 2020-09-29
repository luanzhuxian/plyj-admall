import axios from 'axios'

/**
 * 新增春耘计划活动
 * @param {object} data  数据
 * @property {string} data.activityName  活动名称
 * @property {string} data.regulation 活动细则
 * @property {number} data.preheatTime 活动预热
 * @property {number} data.receiveLimit 限制的角色 0:全部用户 1:会员 2:Helper 3:部分用户组
 * @property {array} data.tagIds 用户组id
 * @property {array} data.combinationDetailList 活动组合
 * @property {string} data.quarterVersion 活动标签
 * @property {number} data.status  0 未开始 1 进行中 2 已结束
 * @property {number} data.batchType  2 新春春耘
 * @return {Promise<AxiosResponse<T>>}
 */
export const addSpringPloughing = (data: {
    activityName: string;
    regulation: string;
    preheatTime: number;
    receiveLimit: number;
    tagIds: string[];
    combinationDetailList: object[];
    quarterVersion: string;
    status: number;
    batchType: number;
}) => axios.post('/apis/v1/combination/save', data)

/**
 * 新增春耘计划活动
 * @param {string} id
 * @param {object} data 数据
 * @return {Promise<AxiosResponse<T>>}
 */
export const updateSpringPloughing = (id: string, data: {
    activityName: string;
    regulation: string;
    preheatTime: number;
    receiveLimit: number;
    tagIds: string[];
    combinationDetailList: object[];
    quarterVersion: string;
    status: number;
    batchType: number;
}) => axios.post(`/apis/v1/combination/modify/${ id }`, data)

/**
 * 获取春耘计划列表
 * @param {object} params
 * @property {number} params.current
 * @property {number} params.size
 * @property {string} params.condition 关键字
 * @property {string} params.startTime
 * @property {string} params.endTime
 * @property {number} params.status
 * @property {number} params.batchType 1：组合商品 2: 新春春耘
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingList = (params: {
    batchType: number;
    current: number;
    size: number;
    startTime: string;
    endTime: string;
    status: string;
    condition?: string;
}) => axios.get('/apis/v2/combination/page', { params })

/**
 * 获取春耘计划详情
 * @param {string} combinationId
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingDetail = (combinationId: string) => axios.get(`/apis/v1/combination/detail?combinationId=${ combinationId }`)

/**
 * 结束活动
 * @param {string} id
 * @return {Promise<AxiosResponse<T>>}
 */
export const endSpringPloughing = (id: string) => axios.put('/apis/v1/combination/end', { id })

/**
 * 查询春耘活动统计数据
 * @param {string} id
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingStatistics = (id: string) => axios.get(`/apis/v2/combination/queryReport?activityId=${ id }`)

/**
 * 查询春耘活动订单数据
 * @param {object} params
 * @property {number} params.current
 * @property {number} params.size
 * @property {string} params.activityId
 * @property {string} params.operatorUserName
 * @property {number} params.orderStatus
 * @property {string} params.condition
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSpringPloughingOrderData = (params: {
    current: number;
    size: number;
    activityId: string;
    operatorUserName: string;
    status: string;
    orderStatus: number;
    condition: string;
}) => axios.get('/apis/v1/combination/queryOrderPage', { params })

/**
 * 检查活动中的商品上下架状态，用户复制活动时的检查
 * @param data
 * @return {Promise<AxiosResponse<T>>}
 */
export const checkSpringPloughingProductStatus = (data: unknown) => axios.post('/apis/v1/combination/check/activity/product', data)

/**
 * 删除春耘活动
 * @param {object} params
 * @property {string} params.id
 * @return {Promise<AxiosResponse<T>>}
 */
export const deleteSpringPloughingActivity = (params: { id: string }) => axios.put('/apis/v1/combination/delete', params)

/**
 * 获取20个年味
 * @param {object} params
 * @property {string} params.activityId
 * @return {Promise<AxiosResponse<T>>}
 */
export const materialSchemeList = (params: { activityId: string }) => axios.get('/apis/v1/signinActivity/materialSchemeList', { params })

/**
 * 新增年味
 * @param {object} data
 * @property {string} data.activityStartTime 活动时间
 * @property {string} data.activityEndTime 活动时间
 * @property {string} data.winningProbability 中奖率
 * @property {string} data.activityRule 使用说明
 * @property {number} data.userScope 适用用户
 * @property {array} data.userGroupTagModels 部分用户标签
 * @property {array} data.materialSchemeModels 年味标签
 * @property {array} data.giftModels 年味大礼
 * @property {array} data.awardModels 阶梯列表
 * @property {number} data.ladderAward 是否设置阶梯奖
 * @return {Promise<AxiosResponse<T>>}
 */
export const addSigninActivity = (data: {
    activityStartTime: string;
    activityEndTime: string;
    winningProbability: string;
    activityRule: string;
    userScope: number;
    userGroupTagModels: [];
    materialSchemeModels: [];
    giftModels: [];
    awardModels: [];
    ladderAward: number;
}) => axios.post('/apis/v1/signinActivity', data)

/**
 * 开始后调用
 * @param {object} data
 * @property {string} data.activityName 活动名称
 * @property {number} data.activityType 活动类型
 * @property {string} data.activityStartTime 活动时间
 * @property {string} data.activityEndTime 活动时间
 * @property {string} data.winningProbability 中奖率
 * @property {string} data.activityRule 使用说明
 * @property {number} data.userScope 适用用户
 * @property {array} data.userGroupTagModels 部分用户标签
 * @property {array} data.materialSchemeModels 年味标签
 * @property {array} data.giftModels 年味大礼
 * @property {array} data.awardModels 阶梯列表
 * @property {number} data.ladderAward 是否设置阶梯奖
 * @property {number} data.isShowLog 展示 logo  0  不展示   1 展示
 * @return {Promise<AxiosResponse<T>>}
 */
export const editActivityInfoDataStart = (data: {
    activityName: string;
    activityType: number;
    activityStartTime: string;
    activityEndTime: string;
    winningProbability: string;
    activityRule: string;
    userScope: number;
    userGroupTagModels: [];
    materialSchemeModels: [];
    giftModels: [];
    awardModels: [];
    ladderAward: number;
    isShowLog: number;
}) => axios.post('/apis/v1/signinActivity/updateActivity/updateStart', data)

/**
 * 未开始调用
 * @param {object} data
 * @return {Promise<AxiosResponse<T>>}
 */
export const editActivityInfoNotStart = (data: {
    activityName: string;
    activityType: number;
    activityStartTime: string;
    activityEndTime: string;
    winningProbability: string;
    activityRule: string;
    userScope: number;
    userGroupTagModels: [];
    materialSchemeModels: [];
    giftModels: [];
    awardModels: [];
    ladderAward: number;
    isShowLog: number;
}) => axios.post('/apis/v1/signinActivity/updateActivity/updateNoStart', data)

/**
 * 年味详情
 * @param {string} activityId
 * @return {Promise<AxiosResponse<T>>}
 */
export const signinActivityDetail = (activityId: string) => axios.get(`/apis/v1/signinActivity/detail/${ activityId }`)

/**
 * 导出年味数据
 * @param {Object} params
 * @property {string} data.activityId
 * @property {string} data.searchContent
 * @property {string} data.orderStatus
 * @property {string} data.operatorUserName
 * @return {Promise<AxiosResponse<T>>}
 */
export const exportSpringData = (params: {
    activityId: string;
    searchContent: string;
    orderStatus: string;
    operatorUserName: string;
}) => axios.post('/apis/v2/combination/export', null, {
    timeout: 0,
    params,
    responseType: 'blob'
})
