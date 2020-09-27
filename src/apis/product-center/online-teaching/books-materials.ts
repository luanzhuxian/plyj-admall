// @ts-nocheck
import axios from '../../../assets/ts/axios-config'

// 查看图文资料
export const getBooksList = params => axios.get('/apis/v1/graphic/findList', { params })
// 新增图文资料
export const addBooksMaterials = data => axios.post('/apis/v1/graphic/save', data)

// 查看图文资料
export const getBooksDetail = id => axios.get(`/apis/v1/graphic/find/${ id }`)

// 编辑图文资料
export const modifyBooksMaterials = data => axios.post('/apis/v1/graphic/modify', data)

// 展示隐藏图文
export const showBooksMaterials = ({ id, status }) => axios.put(`/apis/v1/graphic/show/${ id }`, null, { params: { status } })

// 展示隐藏销量
export const showSalesBooksMaterials = ({ id, status }) => axios.put(`/apis/v1/graphic/showSales/${ id }`, null, { params: { status } })

// 上下架删除图文
export const updateStatusBooksMaterials = ({ id, operate }) => axios.put(`/apis/v1/graphic/updateStatus/${ id }`, null, { params: { operate } })

// 根据直播Id,获取送课学员的信息
export const getGiveBooksMaterialsUser = id => axios.get(`/apis/v1/graphic/findGive/${ id }`)

// 图文送课
export const giveBooksMaterials = (id, data) => axios.post(`/apis/v1/graphic/give/${ id }`, data)

// 获取图文数据详情
export const getBooksMaterialsData = params => axios.get('/apis/v1/graphic/dataInfo', { params })

// 图文导出
export const exportBooksMaterials = params => axios.get('/apis/v1/graphic/exportUserData', {
    timeout: 0,
    responseType: 'blob',
    params
})
