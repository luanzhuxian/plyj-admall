// @ts-nocheck
import axios from '../../../assets/ts/axios-config'

// 系列课统计数据
export const getStatistics = () => axios.get('/apis/v1/knowledgeCourse/statistical/data?courseType=2')

// 查看系列课列表
export const getSeriesCourseList = params => axios.get('/apis/v1/knowledgeCourse/findVideoList', { params })

// 查看系列课详情
export const getCourseDetail = id => axios.get(`/apis/v1/knowledgeCourse/findVideoDetail/${ id }`)

// 更新课程状态 {operate: OFF / DELETE }
export const updateCourseStatus = (id, operate) => axios.get(`/apis/v1/knowledgeCourse/updateVideo/${ id }?operate=${ operate }`)

// 查看系列课-课程列表
export const getCourseList = params => axios.get('/apis/v1/mall/live/cost/allVideo/view/detail', { params })

// 导出系列课课程详情
export const exportCourseDataList = params => axios.get('/apis/v1/knowledgeCourse/exportCourseData', {
    timeout: 0,
    responseType: 'blob',
    params
})

// 查看 已观看学员列表
export const getWatchStudentList = params => axios.get('/apis/v1/mall/live/cost/videoLib/view/detail', { params })

// 系列课课程数据详情
export const getSingleCourseListDetail = params => axios.get('/apis/v1/mall/live/cost/video/view/detail', { params })

// 单课程数据详情导出数据
export const exportSingleCourseDetailDataList = params => axios.get('/apis/v1/knowledgeCourse/exportUserData', {
    timeout: 0,
    responseType: 'blob',
    params
})

// 查看 当前学员观看列表
export const getWatchDetailList = params => axios.get('/apis/v1/mall/live/cost/subVideo/view/detail', { params })
