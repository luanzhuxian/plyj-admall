import axios from '../assets/ts/axios-config'

/* 指定店铺的树形分类信息 */
export const getCategoryTree = () => axios.get('/apis/v1/product/category/tree')

// 运费模板
// 获取模板数据
export const getTemplate = (params: any) => axios.get('/apis/v1/product/shippingTemplate/page', { params })

// 获取模板数据
export const getTemplateDetail = (id: string) => axios.get(`/apis/v1/product/shippingTemplate/${ id }`)

// 获取省（仅限一级地址）
export const getCity = (params: any) => axios.get('/apis/v1/systemctl/location/provinces', { params })

// 新增模板数据
export const addTemplate = (data: any) => axios.post('/apis/v1/product/shippingTemplate/add', data)

// 编辑模板数据
export const editTemplate = (data: any) => axios.post('/apis/v1/product/shippingTemplate/edit', data)

// 删除模板数据
export const deleteTemplate = (id: string) => axios.delete(`/apis/v1/product/shippingTemplate/delete/${ id }`)
// 获取线上课分类
export const getCourseCategory = () => axios.get('/apis/v1/course/category/tree')
