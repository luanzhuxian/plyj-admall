<template>
    <div class="category">
        <div
            ref="category-list"
            class="category-list"
        >
            <div class="category-list-top">
                <el-button type="primary" icon="el-icon-plus" @click="addMain" round size="medium">
                    新建主分类
                </el-button>
                <pl-svg class="icon" @click="expand" name="icon-xiala" v-if="!isExpand" />
                <pl-svg class="icon" @click="expand" name="icon-shouqi" v-else />
            </div>
            <div class="category-list-default" @click="getDefaultCategory">
                <span>默认分类</span>
            </div>
            <!-- 知识课程分类 -->
            <pl-tree
                @node-click="treeClick"
                @change="treeSort"
                :tree="courseCategoryTree"
                ref="tree1"
                disabled
                :options="{
                    children: 'childs',
                    value: 'id'
                }"
            >
                <template slot="treeItemLabel" slot-scope="{ data }">
                    <span>{{ `${data.categoryName}` }}</span>
                    <i class="gray-3" style="margin-left: 8px">{{ data.parentCode === '0' ? data.subcategoryCount > 0 ? `${data.subcategoryCount}` : '' : '' }}</i>
                </template>
                <template slot="default" slot-scope="{ data }">
                    <div class="category-ctrl">
                        <el-tooltip
                            v-if="Number(data.parentCode) === 0 && data.subcategoryCount < 8"
                            class="category-ctrl-item"
                            effect="dark"
                            content="添加子分类"
                            placement="top-start"
                        >
                            <pl-svg class="icon" name="icon-tianjiazifenlei" width="12" fill="#4F63FF"
                                    @click.stop="addChild(data)" />
                        </el-tooltip>
                        <el-tooltip
                            class="category-ctrl-item"
                            effect="dark"
                            content="编辑"
                            placement="top-start"
                        >
                            <pl-svg class="icon" name="icon-bianji" width="12" fill="#4F63FF" @click.stop="edit(data)" />
                        </el-tooltip>
                        <el-tooltip
                            v-if="Number(data.parentCode) !== 0"
                            class="category-ctrl-item"
                            effect="dark"
                            content="删除"
                            placement="top-start"
                        >
                            <pl-svg class="icon" name="icon-shanchu1" width="12" fill="#4F63FF"
                                    @click.stop="remove(data)" />
                        </el-tooltip>
                    </div>
                </template>
            </pl-tree>
            <pl-tree
                @node-click="treeClick"
                @change="treeSort"
                :tree="categoryTree"
                :hidden="['默认分类']"
                ref="tree2"
                :options="{
                    children: 'childs',
                    value: 'id'
                }"
            >
                <template slot="treeItemLabel" slot-scope="{ data }">
                    <span>{{ `${data.categoryName}` }}</span>
                    <i class="gray-3" style="margin-left: 8px">{{ data.parentCode === '0' ? data.subcategoryCount > 0 ? `${data.subcategoryCount}` : '' : '' }}</i>
                </template>
                <template slot="default" slot-scope="{ data }">
                    <div class="category-ctrl">
                        <el-tooltip
                            class="category-ctrl-item"
                            effect="dark"
                            content="添加子分类"
                            placement="top-start"
                            v-if="data.parentCode === '0' && data.subcategoryCount < 6"
                        >
                            <pl-svg class="icon" name="icon-tianjiazifenlei" width="12" fill="#4F63FF"
                                    @click.stop="addChild(data)" />
                        </el-tooltip>
                        <el-tooltip
                            class="category-ctrl-item"
                            effect="dark"
                            content="编辑"
                            placement="top-start"
                        >
                            <pl-svg class="icon" name="icon-bianji" width="12" fill="#4F63FF" @click.stop="edit(data)" />
                        </el-tooltip>
                        <el-tooltip
                            class="category-ctrl-item"
                            effect="dark"
                            content="删除"
                            placement="top-start"
                        >
                            <pl-svg class="icon" name="icon-shanchu1" width="12" fill="#4F63FF"
                                    @click.stop="remove(data)" />
                        </el-tooltip>
                    </div>
                </template>
            </pl-tree>

            <div class="category-drop-tip">
                <i>（拖动即可调整同级分类的顺序）</i>
            </div>
        </div>

        <div class="product-list" ref="product-list">
            <span style="margin-right: 10px;">已选择<i v-text="productsSelected.length" />个商品</span>
            <el-button @click="showEditProductCategory = true" :disabled="productsSelected.length === 0">
                批量设置分类
            </el-button>
            <pl-table :data="productList" @selection-change="selectionChange" @sortUpdate="sortUpdate">
                <el-table-column type="selection" width="55" />
                <el-table-column width="80px">
                    <template slot-scope="{ row }">
                        <img v-imgError v-viewer class="product-image" :src="row.productMainImage || row.graphicMainImg"
                             alt="商品图片">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称">
                    <template slot-scope="{ row }">
                        {{ row.productName || row.graphicName }}
                    </template>
                </el-table-column>
                <el-table-column label="所在分类" width="300px">
                    <template slot-scope="{ row }">
                        <span v-text="row.categoryName" />
                        <template v-if="row.subCategoryName">
                            /
                            <span v-text="row.subCategoryName" />
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="productStatusText" width="150px">
                    <template #default="{ row }">
                        <span v-if="row.productStatusText" v-text="row.productStatusText" />
                        <span v-else v-text="courseStatusMap[row.status]" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{ row }">
                        <el-button type="text" @click="updateCategory(row)">
                            修改分类
                        </el-button>
                    </template>
                </el-table-column>
                <template slot="empty" style="margin: 60px 0;">
                    该分类下暂无商品
                </template>
            </pl-table>
            <Pagination
                sizes
                @change="pageChange"
                @sizeChange="sizeChange"
                :size.sync="form.size"
                v-model="form.current"
                :total="total"
                v-if="total > 0"
            />
        </div>

        <EditMain
            :show.sync="showMainBox"
            :data.sync="currentMainCategory"
        />

        <EditSubset
            :show.sync="showSubsetBox"
            :data.sync="currentSubCategory"
            :parent.sync="currentMainCategory"
        />

        <!-- 删除分类 -->
        <el-dialog
            title="确认要删除这个分类吗？"
            :visible.sync="showRemoveCategory"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @closed="newCategory = []; newCategoryError = ''; willRemove = [];"
            width="33%"
        >
            <p style="margin: 24px 0;">
                该分类下有商品，分类删除后将不可恢复！您可将该分类下的所有商品将移动到<i style="color: #7472dd">其它分类</i>中
            </p>
            <el-form>
                <el-form-item
                    :error="newCategoryError"
                    label="请选择分类："
                >
                    <SelectCategory
                        :category-type="willRemoveCategory.type ? willRemoveCategory.type : 0"
                        :disabled-ids="willRemove"
                        v-model="newCategory"
                    />
                </el-form-item>
            </el-form>
            <div style="text-align: center;">
                <el-button @click="showRemoveCategory = false">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="deleteAndRemove"
                >
                    保 存
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改商品分类 -->
        <el-dialog
            :visible.sync="showEditProductCategory"
            title="修改分类"
            width="20%"
            @closed="categoryClosed"
        >
            <el-form>
                <el-form-item
                    :error="productCategorySelectError"
                    label="选择分类："
                >
                    <SelectCategory
                        v-model="checkedEditProductCategory"
                        :category-type="currentCategory.type ? currentCategory.type : 0"
                    />
                </el-form-item>
            </el-form>
            <div style="text-align: center; margin-top: 42px;">
                <el-button @click="showEditProductCategory = false">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="editProductCategory"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditMain from '../../../components/product-center/category-manage/Edit-Main.vue'
import EditSubset from '../../../components/product-center/category-manage/Edit-Subset.vue'
import Pagination from '../../../components/common/Pagination.vue'
import SelectCategory from '../../../components/product-center/category-manage/Select-Category.vue'
import PlTree from '../../../components/common/pl-tree'
import {
    deleteCategory,
    getGoodsByCategory,
    setCategoryBatch,
    sortCategory,
    courseSort,
    deleteCourseGoodsByCategory,
    getCourseGoodsByCategory,
    getBooksGoodsByCategory,
    updateCourseGoodsCategory,
    courseGoodSort,
    goodSort
} from '../../../apis/product-center/category'
export default {
    name: 'Category',
    components: {
        PlTree,
        Pagination,
        EditMain,
        EditSubset,
        SelectCategory
    },
    data () {
        return {
            productList: [],
            newCategory: [], // 删除分类时选择的新分类
            newCategoryError: '', // 删除分类时，移动商品弹框分类选择表单错误信息
            total: 0,
            currentCategory: {}, // 当前点击的分类
            showSubsetBox: false, // 子分类编辑框
            showMainBox: false, // 主分类编辑框
            showRemoveCategory: false, // 删除分类时有商品提示框
            currentSubCategory: null, // 正在编辑的子分类
            currentMainCategory: null, // 正在编辑的主分类
            isExpand: false, // 是否展开
            willRemove: [], // 将要删除的分类id
            willRemoveCategory: [], // 将要删除的分类
            goodsType: 1, // 1 商品，2 课程
            willUpdatePro: {}, // 将要修改分类的商品
            productsSelected: [], // 批量选择的商品
            showEditProductCategory: false, // 编辑商品分类选择框显示状态
            checkedEditProductCategory: [], // 编辑商品分类时选择的分类
            productCategorySelectError: '', // 编辑商品分类时选择错误信息
            courseStatusMap: {
                1: '出售中',
                2: '已下架'
            },
            form: {
                categoryId: '',
                mallId: '',
                current: 1,
                size: 10
            }
        }
    },
    computed: {
        ...mapGetters({
            mallNumber: 'user/mallNumber',
            categoryTree: 'goods/categoryTree',
            courseCategoryTree: 'goods/courseCategoryTree',
            categoryTreeNoDefault: 'goods/categoryTreeNoDefault',
            defaultCategory: 'goods/defaultCategory'
        })
    },
    async activated () {
        await this.getTree()
        await this.getDefaultCategory()
    },
    methods: {

        /**
         * @param type {number} 1 商品分类 2 课程分类 空两者都查
         */
        async getTree (type = '') {
            try {
                await this.$store.dispatch('goods/GET_CLASSIFY_TREE', type)
            } catch (e) {
                throw e
            }
        },

        /**
         * 获取列表
         * @param [page] {number} 分页
         * @return {Promise<void>}
         */
        async getProductList (page) {
            this.form.categoryId = this.currentCategory.id
            if (page) this.form.current = page
            try {
                if (!this.currentCategory.type) {
                    this.form.mallId = this.mallNumber
                    const { result } = await getGoodsByCategory(this.form)
                    this.productList = result.records
                    this.total = result.total
                } else {
                    delete this.form.mallId
                    let data = null
                    if (this.currentCategory.type === 1 || this.currentCategory.type === 2) {
                        data = await getCourseGoodsByCategory(this.form)
                    } else if (this.currentCategory.type === 3) {
                        data = await getBooksGoodsByCategory(this.form)
                    }
                    const { result } = data
                    // 转换数据字段
                    for (const item of result.records) {
                        item.productName = item.courseName
                        item.productMainImage = item.courseImg
                        item.categoryName = item.category1Name
                        item.subCategoryName = item.category2Name
                        item.courseStatus = Number(item.dataStatus)
                    }
                    this.productList = result.records
                    this.total = result.total
                }
            } catch (e) {
                throw e
            }
        },
        updateCategory (row) {
            const { categoryId, subCategoryId, courseType, category1, category2 } = row
            this.showEditProductCategory = true
            this.willUpdatePro = row
            if (courseType) {
                // 线上课
                this.checkedEditProductCategory = category1 ? [category1, category2] : [category1]
            } else {
                this.checkedEditProductCategory = subCategoryId ? [categoryId, subCategoryId] : [categoryId]
            }
        },
        // 添加子分类按钮点击事件
        addChild (data) {
            // 记录子所在主分类
            this.currentMainCategory = data
            // 显示弹框
            this.showSubsetBox = true
        },
        // 添加主分类按钮点击事件
        addMain () {
            if (this.categoryTree.length >= 30) {
                this.$warning('最多可设置30个主分类')
                return
            }
            this.showMainBox = true
        },
        // 点击删除按钮
        async remove (data) {
            console.log(data)
            console.log(data.parentCode)
            this.willRemoveCategory = data
            if (data.subcategoryCount) {
                this.$alert('该分类下有子分类，请先删除子分类')
                return
            }
            const parent = [...this.categoryTree, ...this.courseCategoryTree].find(item => item.id === data.parentCode)
            console.log('parent')
            console.log(parent)
            // 记录要删除的分类
            const willRemove = []
            if (Number(data.parentCode) !== 0) {
                willRemove.push(data.parentCode, data.id)
            } else {
                willRemove.push(data.id)
            }
            this.willRemove = willRemove
            const { id, mallId, type } = data
            const form = {
                categoryId: id,
                mallId,
                current: 1,
                size: 1
            }
            try {
                let total = 0
                if (type === 1 || type === 2) {
                    delete form.mallId;
                    ({ result: { total } } = await getCourseGoodsByCategory(form))
                } else if (type === 3) {
                    ({ result: { total } } = await getBooksGoodsByCategory(form))
                } else {
                    ({ result: { total } } = await getGoodsByCategory(form))
                }
                if (total > 0) {
                    if (parent && parent.childs.length === 1) {
                        this.$alert('主分类下必须至少有一个子分类')
                    } else {
                        this.showRemoveCategory = true
                    }
                } else {
                    await this.$confirm('分类删除后不可恢复！确认删除分类吗？')
                    const form = {
                        oldCategoryId: data.parentCode,
                        oldSubCategoryId: data.id,
                        categoryId: '',
                        subCategoryId: ''
                    }
                    await this.deleteCategory(form)
                }
            } catch (e) {
                throw e
            }
        },
        // 确定删除分类并移动商品弹框确定按钮
        async deleteAndRemove () {
            const [parentCode, id = ''] = this.willRemove
            if (this.newCategory.length === 0) {
                this.newCategoryError = '请选择分类'
                return
            }
            const form = {
                oldCategoryId: parentCode === '0' ? id : parentCode,
                oldSubCategoryId: id,
                categoryId: this.newCategory[0] || '',
                subCategoryId: this.newCategory[1] || ''
            }
            try {
                await this.deleteCategory(form)
            } catch (e) {
                throw e
            }
        },
        // 删除分类
        async deleteCategory (form) {
            try {
                if (this.willRemoveCategory.type) {
                    // 删除线上课分类，如果没有选择新分类，则新分类默认是主分类
                    await deleteCourseGoodsByCategory(form.oldSubCategoryId || form.oldCategoryId, form.subCategoryId || form.categoryId)
                } else {
                    // 删除商品分类
                    await deleteCategory(form)
                }
                this.showRemoveCategory = false
                await this.getTree(this.willRemoveCategory.type ? 2 : 1) // 分类树
            } catch (e) {
                throw e
            }
        },
        // 默认分类下的商品
        async getDefaultCategory () {
            try {
                await this.$nextTick()
                this.currentCategory = this.defaultCategory || {}
                await this.getProductList()
            } catch (e) {
                throw e
            }
        },
        // 点击编辑按钮
        edit (data) {
            if (data.parentCode === '0') {
                // 编辑的是主分类
                this.currentMainCategory = data
                this.showMainBox = true
            } else {
                this.currentSubCategory = data
                if (data.type) {
                    // 查找线上课父类
                    this.currentMainCategory = this.courseCategoryTree.find(item => item.id === data.parentCode)
                } else {
                    this.currentMainCategory = this.categoryTree.find(item => item.id === data.parentCode)
                }
                this.showSubsetBox = true
            }
        },
        // 点击树节点
        async treeClick (nodeData) {
            console.log(nodeData)
            const { parentCode, id } = nodeData
            this.currentCategory = nodeData
            if (Number(parentCode) !== 0) {
                this.checkedEditProductCategory = [parentCode, id]
            } else {
                this.checkedEditProductCategory = [id]
            }
            try {
                this.form.current = 1
                await this.getProductList()
            } catch (e) {
                throw e
            }
        },
        async pageChange () {
            try {
                await this.getProductList()
            } catch (e) {
                throw e
            }
        },
        async sizeChange () {
            try {
                await this.getProductList(1)
            } catch (e) {
                throw e
            }
        },
        expand () {
            const { tree1, tree2 } = this.$refs
            tree1.expandOfCollapse()
            tree2.expandOfCollapse()
            this.isExpand = this.tree1.isExpand
        },
        async treeSort ({ moved: { element } }, list) {
            const ids = []
            for (const item of list) {
                ids.push(item.id)
            }
            try {
                if (element.type) {
                    await courseSort(ids)
                } else {
                    await sortCategory(ids)
                }
            } catch (e) {
                throw e
            } finally {
                // 任何时候都去刷新分类
                await this.getTree(element.type ? 2 : 1)
            }
        },
        // 编辑商品分类(单个或批量)
        async editProductCategory () {
            if (this.checkedEditProductCategory.length === 0) {
                this.productCategorySelectError = '请选择分类'
                return
            }
            const form = {
                categoryId: this.checkedEditProductCategory[0],
                subCategoryId: this.checkedEditProductCategory[1] || '',
                productIds: []
            }

            if (this.willUpdatePro.id) {
                // 单个
                form.productIds.push(this.willUpdatePro.id)
            } else {
                // 批量
                for (const item of this.productsSelected) {
                    form.productIds.push(item.id)
                }
            }
            try {
                if (this.currentCategory.type) {
                    // 线上课分类
                    await updateCourseGoodsCategory(form.productIds, form.subCategoryId || form.categoryId)
                } else {
                    await setCategoryBatch(form)
                }
                if (this.currentCategory.id) {
                    await this.getProductList()
                } else {
                    await this.getDefaultCategory()
                }
                this.showEditProductCategory = false
                this.$success('分类修改成功')
            } catch (e) {
                throw e
            }
        },
        // 选择变化
        selectionChange (selection) {
            this.productsSelected = selection
        },

        /**
             * 拖拽排序完成
             * @param evt {object} 拖拽的事件对象
             * @param node {object} 被拖拽的商品数据
             * @return {Promise<void>}
             */
        async sortUpdate () {
            const ids = this.productList.map(item => item.id)
            try {
                if (this.currentCategory.type) {
                    // 课程商品排序
                    await courseGoodSort(ids)
                } else {
                    // 普通商品排序
                    await goodSort(ids)
                }
            } catch (e) {
                throw e
            }
        },
        // 分类选择弹框关闭
        categoryClosed () {
            this.willUpdatePro = {}
            this.checkedEditProductCategory = []
        }
    }
}
</script>

<style scoped lang="scss">
    .category {
        display: flex;
        background-color: #fff;
        .category-list-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 61px;
            padding: 0 15px;

            > .icon {
                cursor: pointer;
            }
        }

        .category-list-default {
            font-size: 14px;
            color: $--color-primary-blue;
            padding: 0 34px;
            line-height: 34px;
            cursor: pointer;

            > .icon {
                width: 25px;
                height: 18px;
            }
        }

        .category-list {
            position: relative;
            height: calc(100vh - 80px);
            width: 250px;
            overflow: auto;
            box-shadow: 0 5px 10px rgba(0, 0, 0, .2);

            .category-drop-tip {
                height: 100px;
                margin-top: 20px;
                line-height: 150px;
                text-align: center;
                color: #4C88D6;
                background: #fff url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/roate.png") center top/65px auto no-repeat;
            }
        }

        .product-list {
            position: relative;
            height: calc(100vh - 145px);
            flex: 1;
            padding: 15px;
            overflow: auto;
        }

        .category-ctrl {
            position: absolute;
            top: 0;
            right: 15px;
            display: inline-flex;
            justify-content: flex-end;
            align-items: center;
            width: 100px;
            height: 34px;

            > .icon {
                margin-left: 10px;
                cursor: pointer;
            }

            > .category-ctrl-item {
                display: block;
            }
        }

        .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
        }
    }
</style>
