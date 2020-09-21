/* 批量更新商品分类 */
import axios from '@/assets/ts/axios-config'

// export const categoryGoodsBatch = (categoryCode: string, data: DynamicObject) => axios.put(`/apis/v1/product/productinfo/batch/category?categoryCode=${ categoryCode }`, data)

// 分页查询获取分类
// export const getCategory = (params: DynamicObject) => axios.get('/apis/v1/product/category/page', { params })

/**
 * 删除商品分类
 * oldCategoryCode
 * oldSubCategory
 * categoryCode
 * subCategory
 * */
export const deleteCategory = (data: DynamicObject) => axios.delete('/apis/v1/product/category/delete', { data })

/* 根据商品分类查询商品 */
export const getGoodsByCategory = (params: DynamicObject) => axios.get('/apis/v1/product/category/page/category/products', { params })

/**
 * 批量设置商品分类
 * @param {Object} data
 * @param {string} data.categoryCode
 * @param {string} data.subCategory
 * @param {string[]} data.productIds
 */
export const setCategoryBatch = (data: DynamicObject) => axios.post('/apis/v1/product/category/setCategoryBatch', data)

/**
 * 分类排序
 * @param data Array 分类id数组
 */
export const sortCategory = (data: DynamicObject) => axios.post('/apis/v1/product/category/sort', data)

/**
 * 课程分类排序
 * @param ids {array}
 * @return {Promise<AxiosResponse<any>>}
 */
export const courseSort = (ids: string[]) => axios.post('/apis/v1/course/category/sort', ids)

/**
 * 从分类中删除商品
 * @param id {string} 老分类
 * @param newCategoryId {string} 新分类
 * @return {Promise<AxiosResponse<any>>}
 */
export const deleteCourseGoodsByCategory = (id: string, newCategoryId: string) => axios.delete(`/apis/v1/course/category/delete/${ id }?newCategoryId=${ newCategoryId }`)

/**
 * 根据分类获取在线课程
 * @param {object} params
 * @param {string} params.categoryId
 * @param {number} params.current
 * @param {number} params.size
 * @return {Promise<AxiosResponse<any>>}
 */
export const getCourseGoodsByCategory = (params: DynamicObject) => axios.get('/apis/v1/course/category/page', { params })

/**
 * 根据分类获取在线图文资料
 * @param {object} params
 * @param {string} params.categoryId
 * @param {number} params.current
 * @param {number} params.size
 * @return {Promise<AxiosResponse<any>>}
 */
export const getBooksGoodsByCategory = (params: DynamicObject) => axios.get('/apis/v1/course/category/graphic/page', { params })

/**
 * 修改课程商品分类
 * @param courseIds {Array} - 课程id
 * @param id {string} - 分类id (最后一级id)
 * @return {Promise<AxiosResponse<any>>}
 */
export const updateCourseGoodsCategory = (courseIds: string[], id: string) => axios.post(`/apis/v1/course/category/changeCategory/${ id }`, courseIds)

/**
 * 课程分类下的商品排序
 * @param ids {Array}
 * @return {Promise<AxiosResponse<any>>}
 */
export const courseGoodSort = (ids: string[]) => axios.post('/apis/v1/knowledgeCourse/courseSort', ids)

/**
 * 商品分类下的商品排序
 * @param ids {Array}
 * @return {Promise<AxiosResponse<any>>}
 */
export const goodSort = (ids: string[]) => axios.post('/apis/v1/product/sort', ids)

/**
 * 添加主分类
 * @param {Object} data
 * @param {number} data.parentCode
 * @param {string} data.categoryName
 * @param {number} data.sort
 * @param {boolen} data.hidden
 * @param {string} data.bannerPic
 * @param {string} data.categoryPic
 */
export const addMainCategory = (data: DynamicObject) => axios.post('/apis/v1/product/category', data)

/**
 * 添加主分类
 * @param {Object} data
 * @param {number} data.parentCode
 * @param {string} data.categoryName
 * @param {number} data.sort
 * @param {boolean} data.hidden
 * @param {string} data.categoryPic
 */

export const addSubCategory = (data: DynamicObject) => axios.post('/apis/v1/product/category/sub', data)

/**
 * 编辑商品分类
 * @param {Object} data
 * @param {number} data.parentCode
 * @param {string} data.categoryName
 * @param {number} data.sort
 * @param {boolean} data.hidden
 * @param {string} data.categoryPic
 * @param {string} data.bannerPic
 * @param {string} sequenceNbr
 *
 */
export const updateCategory = (sequenceNbr: string, data: DynamicObject) => axios.put(`/apis/v1/product/category/${ sequenceNbr }`, data)

/**
 * 编辑线上课分类（主分类和子分类）
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.categoryName
 * @param {string} data.categoryPic
 * @param {string} data.bannerPic
 * @param {boolean} data.hidden
 * @param {string} data.parentCode
 * @return {Promise<AxiosResponse<any>>}
 */
export const editCourseCategory = (data: DynamicObject) => axios.post('/apis/v1/course/category/update', data)

/**
 * 创建二级课程分类
 * @param {object} data
 * @param {string} data.categoryName
 * @param {string} data.categoryPic
 * @param {boolean} data.hidden
 * @param {string} data.parentCode
 * @return {Promise<AxiosResponse<any>>}
 */
export const addCourseCategory = (data: DynamicObject) => axios.post('/apis/v1/course/category', data)

/*
* 商户端列表查询商品分类
* @method getCategoryList
* @param mallSeq string required
* @param parentCode string
* @param categoryName string
* */
export const getCategoryList = (mallId: string, parentCode: string, categoryName: string) => axios.get('/apis/v1/product/category/list', { params: { mallId, parentCode, categoryName } })
