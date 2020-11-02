import { getCategoryTree, getCourseCategory } from '../../apis/product-center/goods'
import { getAddress } from '../../apis/address'
import { Module } from 'vuex'
import { MutationTypes } from '@/store/mutation-type'
import { isIterable } from '../../assets/ts/utils'

/**
 * 为树结构数据设置叶子节点标记
 * @param { Array } tree
 */
const setTreeLeaf = function (tree: any[]) {
    if (!isIterable(tree)) {
        return
    }

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
        [MutationTypes.getClassifyTree]: (state, payload = {}) => {
            const { courseCategory = [], goodsCategory = [] } = payload
            setTreeLeaf(goodsCategory)
            setTreeLeaf(courseCategory)
            if (goodsCategory.length) state.categoryTree = goodsCategory
            if (courseCategory.length) state.courseCategoryTree = courseCategory
        },
        // 获取商品分类
        [MutationTypes.getProductClassifyTree]: (state, goodsCategory) => {
            setTreeLeaf(goodsCategory)
            state.categoryTree = goodsCategory || []
        },
        // 获取课程分类
        [MutationTypes.getCourseClassifyTree]: (state, courseCategoryTree) => {
            setTreeLeaf(courseCategoryTree)
            state.courseCategoryTree = courseCategoryTree || []
        },
        // 获取地址
        [MutationTypes.getReceiveAddress]: (state, payload) => {
            if (Array.isArray(payload)) {
                state.receiveAddressList = payload
            }
        },
        [MutationTypes.getReturnAddress]: (state, payload) => {
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
        [MutationTypes.getClassifyTree]: async ({ commit }, type) => {
            if (type === 1) {
                const { result: goodsCategory } = await getCategoryTree()
                commit(MutationTypes.getProductClassifyTree, goodsCategory)
            } else if (type === 2) {
                const { result: courseCategory } = await getCourseCategory()
                commit(MutationTypes.getCourseClassifyTree, courseCategory)
            } else {
                const { result: courseCategory } = await getCourseCategory()
                const { result: goodsCategory } = await getCategoryTree()
                commit(MutationTypes.getClassifyTree, { goodsCategory, courseCategory })
            }
        },

        /* 用户发货地址 */
        [MutationTypes.getReceiveAddress]: async ({ commit }) => {
            const { result } = await getAddress(1)
            commit(MutationTypes.getReceiveAddress, result)
        },

        /* 用户退货地址 */
        [MutationTypes.getReturnAddress]: async ({ commit }) => {
            const { result } = await getAddress(3)
            commit(MutationTypes.getReturnAddress, result)
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
