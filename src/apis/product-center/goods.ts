// @ts-nocheck
import axios from '../../assets/ts/axios-config'

/* 指定店铺的树形分类信息 */
export const getCategoryTree = () => axios.get('/apis/v1/product/category/tree')

// 运费模板
// 获取模板数据
export const getTemplate = (params: any) => axios.get('/apis/v1/product/shippingTemplate/page', { params })

// 获取模板数据
export const getTemplateDetail = (id: string) => axios.get(`/apis/v1/product/shippingTemplate/${ id }`)

// 获取省（仅限一级地址）
export const getCity = (params: any) => axios.get('/apis/v2/base/location/parent/0', { params })

// 新增模板数据
export const addTemplate = (data: any) => axios.post('/apis/v1/product/shippingTemplate/add', data)

// 编辑模板数据
export const editTemplate = (data: any) => axios.post('/apis/v1/product/shippingTemplate/edit', data)

// 删除模板数据
export const deleteTemplate = (id: string) => axios.delete(`/apis/v1/product/shippingTemplate/delete/${ id }`)
// 获取线上课分类
export const getCourseCategory = () => axios.get('/apis/v1/course/category/tree')

/* 创建商品信息 */
export const addGoods = data => axios.post('/apis/v1/product/creation', data)

/* 商品隐藏销量 */
export const showProductSales = ({ productId, status }) => axios.put(`/apis/v1/product/showSales/${ productId }`, null, { params: { status } })

/* 商品显示隐藏 */
export const showProduct = ({ productId, status }) => axios.put(`/apis/v1/product/show/${ productId }`, null, { params: { status } })

/* 修改商品信息 */
export const modifyGoods = ({ productId, data }) => axios.post(`/apis/v1/product/modify/${ productId }`, data)

/* 商户端查询单个商品信息 */
export const getSingleGoods = productId => axios.get(`/apis/v1/product/detail/${ productId }?source=2`)

/* 商户端查询是否允许保存草稿箱商品 */
export const isAllowSave = type => axios.get(`/apis/v1/product/isAllowSave/${ type }`)

/* 创建草稿箱商品 */
export const createDraft = (data, type) => axios.post(`/apis/v1/product/createDraft/${ type }`, data)

/* 复制商品 */
export const copyProduct = id => axios.post(`/apis/v1/product/copy/${ id }`)

/* 编辑草稿箱商品 */
export const modifyDraft = ({ productId, data }) => axios.post(`/apis/v1/product/modifyDraft/${ productId }`, data)

/* 编辑商品库存 */
export const modifyStock = data => axios.post('/apis/v1/product/modifyStock', data)

/* 商户端-分页查询 */
/*
* GET请求：
* categoryId   一级分类ID
* subCategoryId  二级分类ID
* productType   商品类型
* productName   商品名称
* recommendStatus   筛选推荐商品
* startTime
* endTime
* productStatus  商品状态
* sortCondition   排序规则
* current
* size
* */
export const getGoods = params => axios.get('/apis/v1/product/page', { params })

/* 删除商品（移动到回收站） */
export const deleteGoods = productStatus => axios.put(`/apis/v1/product/${ productStatus }`)

/* 更新商品状态 */
// 0：已删除 1：下架 2：上架
export const updateGoodsStatus = (type, idList) => axios.post(`/apis/v1/product/${ type }`, idList)

// 下架前查询是否参与营销活动
export const getIsActivityProduct = id => axios.get(`/apis/v1/product/isActivityProduct/${ id }`)

// 下架前查询是否参与双12营销活动
export const isJoinActivity = id => axios.get(`/apis/v1/product/isJoinActivity/${ id }`)

// 设置显示销量
export const setShowSales = (productIds, showSalesVolume) => axios.post('/apis/v1/product/setShowSales', { showSalesVolume, productIds })

/**
 * 批量修改单个商品分类
 * @param {string} sequenceNbr
 */
export const mendSingleCategory = sequenceNbr => axios.put(`/apis/v1/product/category/${ sequenceNbr }`)

// 我要分销
// 获取商品池中的商品
export const getGoodsOfPool = params => axios.get('/apis/v1/distribution/product/list', { params })

// 分销中心商品上架到店铺
export const productorOnSale = data => axios.post('/apis/v1/distribution/product/distributionProductToMallProduct', data)

// 分销中心商品详情查询
export const productDetail = id => axios.get(`/apis/v1/distribution/product/${ id }/detail`)

// 商户未更新到最新状态的分销商品列表查询
export const productUpdatedList = params => axios.get('/apis/v1/distribution/product/mallProductListUnUpdated', { params })

// 分销商商品更新
export const updateProduct = data => axios.post('/apis/v1/distribution/product/modify', data)

// 分销中心分类查询
export const getDistributionCategoryList = params => axios.get('/apis/v1/productcategorymall/tree', { params })

// 获取商品的运费模板
export const getProductTemplate = params => axios.get('/apis/v1/product/shippingTemplate/list', { params })

// 获取推荐榜单
export const getRecommendProduct = data => axios.post('/apis/v1/recommend/product', data)

// 取消商品推荐
export const cancelRecommend = data => axios.post('/apis/v1/recommend/product/cancelRecommend', data)

// 获取商品列表进行推荐
export const getAddRecommend = data => axios.post('/apis/v1/recommend/product/addRecommend', data)

// 保存商品推荐
export const createAddRecommend = data => axios.post('/apis/v1/recommend/product/create', data)

// 修改商品推荐排名
export const modifyRecommend = data => axios.post('/apis/v1/recommend/product/ManyUpdate', data)

// 查询标签
export const getLabelList = () => axios.post('/apis/v1/mall/label/list', {})

// 添加标签
export const addLabel = params => axios.post('/apis/v1/mall/label/add', params)

// 修改标签
export const updateLabel = params => axios.post('/apis/v1/mall/label/update', params)

// 删除标签
export const deleteLabel = id => axios.delete(`/apis/v1/mall/label/delete/${ id }`)

// 检查标签是否被使用
export const checkIsLabelUsed = id => axios.get(`/apis/v1/mall/label/isLabelUsed/${ id }`)

// 生成sku结构
export const createSku = data => axios.post('/apis/v1/product/skus', data)

// 指定店铺的树形分类信息，不展示隐藏的分类
export const getCategoryTreePlatform = () => axios.get('/apis/v1/product/category/tree/platform')

// 预测当推荐排名
export const getCurrentNumber = params => axios.get('/apis/v1/recommend/product/currentNumber', { params })
// 获取商品主图的主题
export const getMainImageTheme = () => axios.get('/apis/v1/product/themes/list')
