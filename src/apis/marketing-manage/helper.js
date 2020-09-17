import axios from 'axios'

// 分页获取Helper活动列表
export const marketingActivityPage = params => axios.get('/apis/v1/marketing/activity/page', { params })

// 删除Helper活动
export const removeMarketingActivityProduct = id => axios.delete(`/apis/v1/marketing/activity/${ id }`)

// 创建Helper活动
export const marketingActivityCreate = data => axios.post('/apis/v1/marketing/activity/create', data)

// 修改Helper活动
export const updateMarketingActivity = ({ id, data }) => axios.put(`/apis/v1/marketing/activity/${ id }`, data)

// 获取Helper活动
export const getActivity = id => axios.get(`/apis/v1/marketing/activity/${ id }`)

// 修改活动状态
export const updateMarketingActivityStatus = ({ id, status }) => axios.put(`/apis/v1/marketing/activity/${ id }/${ status === 'OPEN' ? 'PAUSE' : 'OPEN' }`)

// 查询活动可用商品
export const getProductJust = data => axios.post('/apis/v1/marketing/activity/product/page/productJust', data)

// 查询活动商品下的商品sku
export const getProductSkuByProductId = data => axios.post('/apis/v1/marketing/activity/product/page/productSkuByProductId', data)

// 查询活动可用分类
export const getCategoryName = data => axios.post('/apis/v1/marketing/activity/product/page/categoryName', data)

// 查询活动可用分类下的商品sku
export const getProductByCategoryId = data => axios.post('/apis/v1/marketing/activity/product/page/productByCategoryId', data)

// Helper活动统计数据
export const getStatistics = id => axios.get(`/apis/v1/knowledgeCourse/statistical/data/${ id }`)

// Helper活动商品数据
export const getProductListOfHelper = params => axios.get('/apis/v1/mall/live/cost/video/view/detail', { params })

// 导出Helper活动商品数据
export const exportProductListOfHelper = params => axios.get('/apis/v1/knowledgeCourse/exportUserData', {
    timeout: 0,
    responseType: 'blob',
    params
})

// Helper活动用户数据
export const getUserListOfHelper = params => axios.get('/apis/v1/mall/live/cost/video/view/detail', { params })

// 导出Helper活动用户数据
export const exportUserListOfHelper = params => axios.get('/apis/v1/knowledgeCourse/exportUserData', {
    timeout: 0,
    responseType: 'blob',
    params
})
