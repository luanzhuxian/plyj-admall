<template>
    <!-- 选择商品分类 -->
    <div :class="$style.selectCategory">
        <!-- 商品 -->
        <el-cascader
            :value="classification"
            :options="category"
            :props="{ ...props, checkStrictly }"
            @change="changeHandler"
            clearable
        />
        <el-button
            v-if="showAdd"
            type="text"
            class="text-underline"
            style="color: #007bff; margin-left: 20px;"
            @click="showAddCategory = true"
        >
            新建
        </el-button>

        <!-- 添加主分类 -->
        <EditMain v-if="!categoryType" @success="res => addSuccess(res, 1)" :show.sync="showAddCategory" />
        <EditSubset v-else @success="res => addSuccess(res, 2)" :show.sync="showAddCategory" :parent="categoryType === 1 ? courseCategoryTree[0] : courseCategoryTree[1]" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditMain from './Edit-Main.vue'
import EditSubset from './Edit-Subset.vue'
import { MutationTypes } from '../../../store/mutation-type'
export default {
    name: 'SelectCategoryName',
    components: {
        EditMain,
        EditSubset
    },
    data () {
        return {
            showAddCategory: false,
            // 分类
            category: []
        }
    },
    computed: {
        ...mapGetters({
            categoryTree: 'goods/categoryTree',
            courseCategoryTree: 'goods/courseCategoryTree'
        }),
        // 知识课程分类树
        knowledgeCourse () {
            return this.courseCategoryTree[0] ? this.courseCategoryTree[0][this.props.children] : []
        },
        // 系列课分类树
        seriesOfCourses () {
            return this.courseCategoryTree[1] ? this.courseCategoryTree[1][this.props.children] : []
        },
        // 标记分类数据是否已经全部加载完毕
        loaded () {
            return this.categoryTree.length > 0 && this.courseCategoryTree.length > 0
        }
    },
    props: {
    // 绑定值
        classification: {
            type: Array,
            default: () => ([])
        },
        // cascader 组件的prop属性，用来配置字段值
        props: {
            type: Object,
            default: () => ({
                children: 'childs',
                value: 'categoryName',
                label: 'categoryName',
                expandTrigger: 'click',
                leaf: 'leaf'
            })
        },
        // 是否可选择一级
        checkStrictly: Boolean,
        // 是否显示添加按钮
        showAdd: Boolean,
        // 要禁用的分类
        disabledIds: {
            type: Array,
            default: () => ([])
        },
        // 类型：0 商品，1 知识课程 2 系列课
        categoryType: {
            type: Number,
            default: 0
        },
        // 是否显示全部
        showAll: Boolean
    },
    watch: {
        courseCategoryTree () {
            this.init()
        },
        categoryTree () {
            this.init()
        },
        disabledIds  (val) {
            if (this.loaded && val.length) {
                this.$nextTick(() => {
                    this.init()
                })
            }
        },
        categoryType () {
            if (this.loaded) {
                this.$nextTick(() => {
                    this.init()
                })
            }
        },
        loaded: {
            handler (val) {
                if (val) {
                    this.$nextTick(() => {
                        this.init()
                    })
                }
            },
            immediate: true
        }
    },
    model: {
        event: 'change',
        prop: 'classification'
    },
    methods: {
        async getTree () {
            try {
                await this.$store.dispatch(`goods/${ MutationTypes.getClassifyTree }`)
            } catch (e) {
                throw e
            }
        },
        changeHandler (val) {
            // if (val[0] === '全部') val = ['']
            this.$emit('change', val)
        },

        /**
     * 添加分类成功
     * 成功后，用新分类填充表单
     * @param res {object} 返回结果
     * @param type {number} 1 主分类 2 子分类
     */
        addSuccess (res, type) {
            if (type === 1) {
                this.changeHandler([res.id])
            }
            if (type === 2) {
                this.changeHandler([res.parentCode, res.id])
            }
        },
        init () {
            if (this.categoryType === 0) {
                const categoryTree = JSON.parse(JSON.stringify(this.categoryTree))
                if (this.disabledIds[1]) {
                    const parent = categoryTree.find(item => item.id === this.disabledIds[0])
                    const index = parent.childs.findIndex(item => item.id === this.disabledIds[1])
                    parent.childs.splice(index, 1)
                    if (!parent.childs.length) {
                        // 如果这个分类下没有其它子分类了，则不能选择这个分类，包括主分类
                        categoryTree.splice(categoryTree.indexOf(parent), 1)
                    }
                    this.category = categoryTree
                } else if (this.disabledIds[0]) {
                    const index = categoryTree.findIndex(item => item.id === this.disabledIds[0])
                    categoryTree.splice(index, 1)
                }
                //  else if (this.showAll) {
                //   categoryTree.unshift({
                //     id: '',
                //     categoryName: '全部'
                //   })
                // }
                this.category = categoryTree
                return
            }
            // 处理线上课分类显示
            // 找到当前父类，并复制一份
            const category = JSON.parse(JSON.stringify(this.courseCategoryTree.find(item => item.type === this.categoryType)))
            if (this.disabledIds[1]) {
                const index = category.childs.findIndex(item => item.id === this.disabledIds[1])
                category.childs.splice(index, 1)
            }
            this.category = [category]
        }
    }
}
</script>

<style module lang="scss">
  .selectCategory {}
</style>
