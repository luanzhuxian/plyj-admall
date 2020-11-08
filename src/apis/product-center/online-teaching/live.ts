// @ts-nocheck
import axios from '../../../assets/ts/axios-config'

/**
 * 频道流量及观看量统计
 * @param params {Object}
 * startDate {String}
 * endDate {String}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getChanneStatistics = params => axios.get('/apis/v1/mall/live/summary', { params })

// 获取直播统计列表数据
export const getRoomStatistics = params => axios.get('/apis/v1/mall/live/summary/list', { params })

/**
 * 查询房间在线人数
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getOnlineCount = () => axios.get('/apis/v1/mall/live/room/viewers')

/**
 * 查看房间信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRoomInfo = () => axios.get('/apis/v1/mall/live/manager/account/room')

/**
 * 获取房间状态
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRoomStatus = () => axios.get('/apis/v1/mall/live/room/statue')

/**
 * 查询房间最近2分钟实时统计人数
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getCountInTwoMinute = roomId => axios.get(`/apis/v1/mall/live/manager/statistics/room/realtime?roomId=${ roomId }`)

/**
 * 直播账号剩余分钟数
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getSurplusMinute = () => axios.get('/apis/v1/mall/live/manager/account/durations')

/**
 * 查询房间历史并发数量
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getHistoryData = params => axios.get('/apis/v1/mall/live/manager/statistics/room/concurrence', { params })

/**
 * 验证卡号是否可用
 * @param data {Object}
 * cardId {String} 卡号
 * passwd {String} 密码
 * @return {Promise<AxiosResponse<T>>}
 */
export const checkCard = data => axios.post('/apis/v1/mall/live/card/check', data)

/**
 * 使用卡号
 * @param data {Object}
 * cardId {String} 卡号
 * passwd {String} 密码
 * @return {Promise<AxiosResponse<T>>}
 */
export const confirmUse = data => axios.post('/apis/v1/mall/live/card/use', data)

/**
 * 新增直播
 * @param data {Object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const addLive = data => axios.post('/apis/v1/mall/live/activity/save', data)

/**
 * 删除直播
 * @param id {String}
 * @return {Promise<AxiosResponse<T>>}
 */
export const deleteLive = id => axios.delete(`/apis/v1/mall/live/activity/${ id }/delete`)

/**
 * 关闭直播
 * @param id {String}
 * @return {Promise<AxiosResponse<T>>}
 */
export const closeLive = id => axios.put(`/apis/v1/mall/live/activity/${ id }/end`)

/**
 * 修改直播
 * @param data {Object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const updateLive = data => axios.put(`/apis/v1/mall/live/activity/${ data.id }/update`, data)

/**
 * 修改房间
 * @param roomId {number}
 * @param roomName {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const updateRoom = (roomId, roomName) => axios.post(`/apis/v1/mall/live/update_room_name/${ roomId }?roomName=${ roomName }`)

/**
 * 是否存在直播活动
 * @return {Promise<AxiosResponse<T>>}
 */
export const hasActivity = () => axios.get('/apis/v1/mall/live/activity/hasCurrentLiveActivity')

/**
 * 直播汇总
 * @params params {Object}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getLiveList = params => axios.get('/apis/v1/mall/live/activity/list', { params })

/**
 * 获取直播活动基本信息
 * @return {Promise<AxiosResponse<T>>}
 */
export const getActiveBaseInfo = () => axios.get('/apis/v1/mall/live/activity/current/simplified')

/**
 * 获取直播活动全部信息
 * @param id
 * @return {Promise<AxiosResponse<T>>}
 */
export const getActiveCompleteInfo = id => axios.get(`/apis/v1/mall/live/activity/detail/${ id }`)

/**
 * 获取支付二维码
 * @param comboId
 * @return {Promise<AxiosResponse<T>>}
 */
export const getPayCode = comboId => axios.get(`/apis/v1/mall/live/order/qrCode?comboId=${ comboId }`)
export const getOrderList = params => axios.get('/apis/v1/mall/live/order/list', { params })

/**
 * 获取套餐列表
 * @param params
 * @return {Promise<AxiosResponse<T>>}
 */
export const getSetMeal = () => axios.get('/apis/v1/mall/live/combo/list')

/**
 * 获取优惠券列表
 * @param params
 * @return {Promise<AxiosResponse<T>>}
 */
export const getCouponList = params => axios.get('/apis/v1/coupon/selectCouponPageDetail', { params })

/**
 * 获取订单详情
 * @param orderId {String}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getOrderDetail = orderId => axios.get(`/apis/v1/mall/live/order/status?orderId=${ orderId }`)

/**
 * 重试失败的充值时间订单
 * @return {Promise<AxiosResponse<T>>}
 */
export const retryFalidOrder = orderId => axios.get(`/apis/v1/mall/live/order/retry/recharge/${ orderId }`)

/**
 * 营销中心 => 观看详情列表
 */
export const getWatchDetailList = (id, params) => axios.get(`/apis/v1/mall/live/activity/${ id }/selectWatchLog`, { params })

/**
 * 营销中心 => 导出观看详情数据
 */
export const exportWatchDetail = (id, params) => axios.post(`/apis/v1/mall/live/activity/${ id }/export`, null, {
    responseType: 'blob',
    timeout: 0,
    params
})

/**
 * 获取视频下载列表
 * @param startDate
 * @param endDate
 * @param roomId
 */
export const getDownloadList = params => axios.get('/apis/v1/mall/live/record_files', { params })

/**
 * 合并频道暂存文件
 * @param fileName
 * @param urls
 * @param roomId
 */
export const mergeDownloadFile = ({ fileName, fileIds, roomId }) => axios.post(`/apis/v1/mall/live/merge_records?roomId=${ roomId }`, { fileName, fileIds }, { timeout: 0 })

/**
 * 删除频道暂存文件
 * @param sessionId
 * @param roomId
 */
export const deleteDownloadFile = ({ sessionId, roomId }) => axios.post(`/apis/v1/mall/live/delete_record_file?sessionId=${ sessionId }&roomId=${ roomId }`)

// 获取视频库列表
export const getLibraryList = params => axios.get('/apis/v1/mall/live/lib/list', { params })

// 取消回放
export const cancelPlayBack = id => axios.post(`/apis/v1/mall/live/cancel_look_back/${ id }`)

// 添加回放
export const addPlayBack = ({ id, videoId }) => axios.post(`/apis/v1/mall/live/add_look_back/${ id }?videoId=${ videoId }`)

// C 端显示隐藏
export const showLive = ({ id, status }) => axios.put(`/apis/v1/mall/live/show/${ id }`, null, { params: { status } })

// 根据视频 id 获取视频信息
export const getVideoMesById = id => axios.get(`/apis/v1/mall/live/lib/detail/${ id }`)

// 获取已消耗的点播流量
export const getFlowHasUsed = () => axios.get('/apis/v1/mall/live/queryVideoDataFlow')

// 更新直播口令
export const updateRoomToken = ({ activityId, roomToken }) => axios.get(`/apis/v1/mall/live/activity/${ activityId }`, { params: { roomToken } })

// 获取可以创建直播活动的直播房间
export const getFreeRooms = () => axios.get('/apis/v1/mall/live/activity/free_rooms')

// 获取所有的直播房间
export const getAllRooms = () => axios.get('/apis/v1/mall/live/activity/simple_rooms')

// 获取所有的直播房间
export const getAllRoomsOfDetail = () => axios.get(' /apis/v1/mall/live/activity/all_rooms')

// 新增直播房间
export const createRoom = roomName => axios.post(`/apis/v1/mall/live/create_live_room?roomName=${ roomName }`)

/**
 * 根据手机号搜索用户
 * @param mobile
 * @param current
 * @param size
 */
export const getUserByPhone = params => axios.get('/apis/v1/mall/live/user/mobile', { params })

/**
 * 根据直播Id,获取选定学员的信息
 * @param liveId
 */
export const getLiveSelectStudentInfo = id => axios.get(`/apis/v1/mall/live/activity/student/info?activityId=${ id }`)

/**
 * 根据直播Id,提交选定学员的信息
 * @param liveId
 */
export const submitLiveSelectStudentList = ({ id, params }) => axios.put(`/apis/v1/mall/live/activity/student/update?activityId=${ id }`, params)

/**
 * 根据直播Id,获取送课学员的信息
 * @param liveId
 */
export const getSendLiveUsersInfo = id => axios.get(`/apis/v1/mall/live/activity/findGive/${ id }`)

/**
 * 根据直播Id,提交送课学员的信息
 * @param liveId
 */
export const submitSendLiveUsersList = ({ id, params }) => axios.post(`/apis/v1/mall/live/activity/give/${ id }`, params)

// 取消送课
export const cancelGive = ({ id, activityId, type }) => axios.put(`/apis/v1/mall/live/activity/cancelGive/${ id }?activityId=${ activityId }&type=${ type }`)

/**
 * 根据房间Id,查看房间信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRoomInfoById = roomId => axios.get(`/apis/v1/mall/live/live_stream/${ roomId }`)

/**
 * 根据分组id,查找所有用户信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getAllUserListByTagId = id => axios.get(`/apis/v2/user/tag/r/usersInfo?tagId=${ id }`)
