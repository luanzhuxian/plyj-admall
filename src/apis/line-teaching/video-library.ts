// @ts-nocheck
import axios from '../../assets/ts/axios-config'

// 获取视频库列表
export const getLibraryList = params => axios.get('/apis/v1/mall/live/lib/list', { params })

// 删除直播库视频
export const deleteLibraryFile = (id, status) => axios.get(`/apis/v1/mall/live/lib/recycle/${ id }`, { params: { status } })

// 彻底删除
export const deleteRecycleBin = id => axios.post(`/apis/v1/mall/live/lib/delete/${ id }`)

// 上传视频到直播库
export const uploadLibraryFile = data => axios.post('/apis/v1/mall/live/lib/upload', data)

// 是否删除
export const getDeleteInfo = id => axios.get('/apis/v1/mall/live/lib/related', { params: { id } })

// 获取视频库单个详情
export const getResourceInfoById = resourceId => axios.get(`/apis/v1/mall/live/lib/${ resourceId }`)

// 获取回收站列表
export const getRecycleBinData = params => axios.get('/apis/v1/mall/live/lib/recycle/list', { params })

// 获取回收站占用空间
export const getVideoLibInfo = () => axios.get('/apis/v1/mall/live/lib/recycle/followCount')

/**
 * 获取视频库剩余容量
 * @return {Promise<AxiosResponse<any>>}
 */
export const getRemainingSpaceSize = () => axios.get('/apis/v1/mall/live/lib/flowSpace')
