import { getCategoryTree, getCourseCategory } from '../../apis/goods'
import { getAddress } from '../../apis/address'
import {
    GET_PRODUCT_CLASSIFY_TREE,
    GET_COURSE_CLASSIFY_TREE,
    GET_CLASSIFY_TREE,
    GET_RECEIVE_ADDRESS,
    GET_RETURN_ADDRESS
} from '../mutation-type'
import { Module } from 'vuex'

/**
 * 为树结构数据设置叶子节点标记
 * @param { Array } tree
 */
const setTreeLeaf = function (tree: any[]) {
    for (const item of tree) {
        if (!item.childs.length) {
            item.leaf = true
            item.childs = null
        } else {
            setTreeLeaf(item.childs)
        }
    }
}
const goodsManage: Module<DynamicObject, DynamicObject> = {
    state: {
        categoryTree: [],
        courseCategoryTree: [],
        receiveAddressList: [],
        returnAddressList: []
    },

    mutations: {
    // 获取所有分类
        [GET_CLASSIFY_TREE]: (state, payload = {}) => {
            const { courseCategory = [], goodsCategory = [] } = payload
            setTreeLeaf(goodsCategory)
            setTreeLeaf(courseCategory)
            if (goodsCategory.length) state.categoryTree = goodsCategory
            if (courseCategory.length) state.courseCategoryTree = courseCategory
        },
        // 获取商品分类
        [GET_PRODUCT_CLASSIFY_TREE]: (state, goodsCategory) => {
            setTreeLeaf(goodsCategory)
            state.categoryTree = goodsCategory || []
        },
        // 获取课程分类
        [GET_COURSE_CLASSIFY_TREE]: (state, courseCategoryTree) => {
            setTreeLeaf(courseCategoryTree)
            state.courseCategoryTree = courseCategoryTree || []
        },
        // 获取地址
        [GET_RECEIVE_ADDRESS]: (state, payload) => {
            if (Array.isArray(payload)) {
                state.receiveAddressList = payload
            }
        },
        [GET_RETURN_ADDRESS]: (state, payload) => {
            if (Array.isArray(payload)) {
                state.returnAddressList = payload
            }
        }
    },
    actions: {

        /**
     * 获取分类
     * @param commit
     * @param type {number} 1 商品分类 2 课程分类
     * @return {Promise<void>}
     */
        [GET_CLASSIFY_TREE]: async ({ commit }, type) => {
            if (type === 1) {
                const { result: goodsCategory } = await getCategoryTree()
                commit(GET_PRODUCT_CLASSIFY_TREE, goodsCategory)
            } else if (type === 2) {
                const { result: courseCategory } = await getCourseCategory()
                commit(GET_COURSE_CLASSIFY_TREE, courseCategory)
            } else {
                const { result: courseCategory } = await getCourseCategory()
                const { result: goodsCategory } = await getCategoryTree()
                commit(GET_CLASSIFY_TREE, { goodsCategory, courseCategory })
            }
        },

        /* 用户发货地址 */
        [GET_RECEIVE_ADDRESS]: async ({ commit }) => {
            const { result } = await getAddress(1)
            commit(GET_RECEIVE_ADDRESS, result)
        },

        /* 用户退货地址 */
        [GET_RETURN_ADDRESS]: async ({ commit }) => {
            const { result } = await getAddress(3)
            commit(GET_RETURN_ADDRESS, result)
        }
    },
    getters: {
        receiveAddressList: state => state.receiveAddressList,
        returnAddressList: state => state.returnAddressList,
        defaultCategory: state => state.categoryTree.find((item: any) => item.categoryName === '默认分类'),
        categoryTree: state => state.categoryTree,
        courseCategoryTree: state => state.courseCategoryTree,
        categoryTreeFiltered: state => state.categoryTree.filter((item: any) => (item.categoryName !== '默认分类')),

        /* 不包含默认的分类树 */
        categoryTreeNoDefault: state => {
            const temp = JSON.parse(JSON.stringify(state.categoryTree))
            return temp.filter((item: any) => item.categoryName !== '默认分类')
        }
    }
}

export default {
    namespaced: true,
    ...goodsManage
}
