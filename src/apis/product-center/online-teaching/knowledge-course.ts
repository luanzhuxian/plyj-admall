// @ts-nocheck
import axios from '../../../assets/ts/axios-config'
// 视频库列表
export const getLineTeachingInfo = () => axios.get('/apis/v1/mall/live/statistics')
// 获取视频库存储信息
export const getVideoLibInfo = () => axios.get('/apis/v1/mall/live/lib/account')

// 新增知识课程管理
export const addVideoCourse = params => axios.post('/apis/v1/knowledgeCourse/addVideo', params)

// 查看知识课程管理详情
export const getVideoDetail = id => axios.get(`/apis/v1/knowledgeCourse/findVideoDetail/${ id }`)

/* 知识课程隐藏销量 */
export const showCourseSales = ({ courseId, status }) => axios.put(`/apis/v1/knowledgeCourse/showSales/${ courseId }`, null, { params: { status } })

/* 知识课程 C 端隐藏 */
export const showCourse = ({ id, status }) => axios.put(`/apis/v1/knowledgeCourse/show/${ id }`, null, { params: { status } })

// 查看知识课程管理列表
export const getVideoList = params => axios.get('/apis/v1/knowledgeCourse/findVideoList', { params })

// 更新课程状态 {operate: OFF / DELETE }
export const updateVideoStatus = (id, operate) => axios.get(`/apis/v1/knowledgeCourse/updateVideo/${ id }?operate=${ operate }`)

// 视频库列表
export const getVideoLibraryList = params => axios.get('/apis/v1/mall/live/lib/list', { params })

// 点播统计数据
export const getStatistics = () => axios.get('/apis/v1/knowledgeCourse/statistical/data?courseType=1')

// 知识课堂点播详情
export const getPlayDetail = params => axios.get('/apis/v1/mall/live/cost/video/view/detail', { params })

// 根据直播Id,获取送课学员的信息
export const getSendCourseUsersInfo = id => axios.get(`/apis/v1/knowledgeCourse/findGive/${ id }`)

// 提交送课学员的信息
export const submitSendCourseUsersList = ({ id, params }) => axios.post(`/apis/v1/knowledgeCourse/give/${ id }`, params)

// 单课程数据详情导出数据
export const exportDataList = params => axios.get('/apis/v1/knowledgeCourse/exportUserData', {
    timeout: 0,
    responseType: 'blob',
    params
})
