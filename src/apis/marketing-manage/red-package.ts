import axios from '../../assets/ts/axios-config'

// 新增红包活动
export const addRedPackage = (data: object) => axios.post('/apis/v2/red-package-activities', data)

// 福利红包详情
export const getRedPackageDetail = (id: string) => axios.get(`/apis/v2/red-package-activities/${ id }`)

// 编辑福利红包
export const editRedPackage = (id: string, data: object) => axios.put(`/apis/v2/red-package-activities/${ id }`, data)

// 获取活动列表
export const getRedPackageList = (params: { name: string; activityStatus: string; receiveEndTime: string; receiveStartTime: string; page: number; size: number }) => axios.get('/apis/v2/red-package-activities', { params })

// 暂停开启福利红包
export const pauseRedPackage = (id: string, pause: boolean) => axios.put(`/apis/v2/red-package-activities/${ id }/pause/${ pause }`)

// 隐藏显示福利红包
export const showRedPackage = (id: string, showStatus: boolean) => axios.put(`/apis/v2/red-package-activities/${ id }/showStatus/${ showStatus }`)

// 结束福利红包
export const overRedPackage = (id: string) => axios.put(`/apis/v2/red-package-activities/${ id }/over`)

// 删除福利红包
export const deleteRedPackage = (id: string) => axios.delete(`/apis/v2/red-package-activities/${ id }`)

// 复制福利红包
export const copyRedPackage = (id: string) => axios.post(`/apis/v2/red-package-activities/${ id }`)

// 福利红包领用量
export const getRedPackageclaimVolume = (id: string) => axios.get(`/apis/v2/red-package-activities/${ id }/claimVolume`)

// 福利红包活动数据
export const getRedPackageStatistics = (id: string) => axios.get(`/apis/v2/red-package-activities/stat/${ id }`)

// 福利红包数据列表
export const getRedPackageStatisticsList = (params: object) => axios.get('/apis/v2/red-package-activities/page/date', { params })
