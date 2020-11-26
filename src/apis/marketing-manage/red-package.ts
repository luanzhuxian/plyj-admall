import axios from '../../assets/ts/axios-config'

// 新增红包活动
export const addRedPackage = (data: object) => axios.post('/apis/v2/red-package-activities', data)

// 福利红包详情
export const getRedPackageDetail = (id: string) => axios.get(`/apis/v2/red-package-activities/${ id }`)

// 编辑福利红包
export const editRedPackage = (id: string, data: object) => axios.put(`/apis/v2/red-package-activities/${ id }`, data)

// 获取活动列表
export const getRedPackageList = (params: object) => axios.get('/apis/v2/red-package-activities', { params })
