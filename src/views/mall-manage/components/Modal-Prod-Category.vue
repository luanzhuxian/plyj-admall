<template>
    <el-dialog
        class="modal-product-category"
        :class="$style.modalProductCategory"
        :title="title"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="show"
        @close="close"
    >
        <template>
            <el-tabs
                v-model="currentTab"
                type="card"
                class="tab-bar"
                :class="{ 'hide': !isTabShow }"
                @tab-click="onTabClick"
            >
                <div :class="$style.searchGroup">
                    <div :class="$style.searchGroupInput">
                        <el-input
                            v-model.trim="searchValue"
                            type="text"
                            clearable
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="search"
                            @clear="search"
                        />
                        <el-button type="primary" @click="search">
                            搜索
                        </el-button>
                    </div>
                    <i class="el-icon-refresh" @click="refresh" />
                </div>

                <!-- 商品的 tabpane -->
                <el-tab-pane label="已上架商品" name="product">
                    <!-- 商品列表 -->
                    <CustomTable
                        ref="productTable"
                        v-if="show"
                        :data="productList"
                        :options="options"
                        selection-type="radio"
                        :default-radio="radioValue"
                        :is-radio-disable="checker"
                        :selected-list="selectedList"
                        @update-radio="onRadioChange"
                        @update-checkbox="onCheckboxChange"
                    />
                </el-tab-pane>

                <!-- 分类的 tabpane -->
                <el-tab-pane label="商品分类" name="category">
                    <!-- 分类列表 -->
                    <CustomTable
                        ref="categoryTable"
                        v-if="show"
                        :data="categoryList"
                        :options="categoryTableOptions"
                        selection-type="radio"
                        :default-radio="radioValue"
                        :is-radio-disable="(row) => !row.productCount"
                        :selected-list="selectedList"
                        @update-radio="onRadioChange"
                        @update-checkbox="onCheckboxChange"
                    />
                </el-tab-pane>

                <Pagination
                    v-model="pagination.current"
                    :total="pagination.total"
                    :size="pagination.size"
                    @change="onPageChange"
                />
                <div :class="$style.btnGroup">
                    <el-button type="primary" @click="confirm">
                        确定
                    </el-button>
                </div>
            </el-tabs>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CustomTable from './Custom-Table.vue'
import { modalTitleMap } from '../utils/map'
import { getGoods } from '../../../apis/product-center/goods'
import { getCategory } from '../../../apis/product-center/category'
import { getVideoList } from '../../../apis/product-center/online-teaching/knowledge-course'
import {
    productTableOptions,
    courseTableOptions,
    categoryTableOptionsProducer
} from '../utils/config'
import { ModalType, ProductStatus } from '../utils/types'

const productChecker = () => false
const courseChecker = (row: { status: string }) => row.status === '2'

@Component({
    components: { CustomTable }
})
export default class ModalProdCategory extends Vue {
    // 名字不要改
    name = 'ModalProdCategory'

    /* props */
    @Prop(Boolean) show!: boolean
    @Prop(String) defaultRadio!: string
    @Prop({
        type: String,
        default: '商品'
    }) title!: string

    @Prop({
        type: Number,
        default: 0
    }) readonly type!: number

    /* data */
    currentTab = 'product'
    searchValue = ''
    searchHistory = ''
    productList = []
    categoryList = []
    selectedList = []
    // 装修的时候才需要 editorListIndex，表示当前装修数据在列表中的位置
    editorListIndex!: number
    radioValue = this.defaultRadio
    pagination = {
        current: 1,
        size: 4,
        total: 0
    }

    checker: Function = productChecker
    options: (typeof productTableOptions) | (typeof courseTableOptions) = []
    productTableOptions = productTableOptions
    courseTableOptions = courseTableOptions
    categoryTableOptions: DynamicObject[] = []

    /* computed */
    get isTabShow () {
        return this.type === ModalType.ProductAndCategoryModal
    }

    /* watch */
    @Watch('show')
    onShowChange (val: boolean) {
        val ? this.getData() : this.clear()
    }

    @Watch('type')
    onTypeChange (type: number) {
        this.currentTab = (type === ModalType.CategoryModal) ? 'category' : 'product'
        this.getData()
    }

    created () {
        if (this.type) {
            this.init(this.type)
        }
    }

    /* methods */
    getData () {
        if (this.type === ModalType.ProductAndCategoryModal) {
            this.currentTab === 'product' ? this.getProduct() : this.getCategory()
        }
        if (this.type === ModalType.CategoryModal) {
            this.getCategory()
        }
        if (this.type === ModalType.CourseModal) {
            this.getCourse()
        }
    }

    // 查商品
    async getProduct () {
        try {
            const params = {
                type: 'ALL',
                productStatus: ProductStatus.OnSell, // 0：已删除 1：下架 2：上架  3：草稿箱
                current: this.pagination.current,
                size: this.pagination.size,
                ...(this.searchHistory ? { productName: this.searchHistory } : null) // 搜索内容
            }
            const { result } = await getGoods(params)
            for (const item of result.records) {
                item.skuEntityList.sort((a: { price: number }, b: { price: number }) => a.price - b.price)
            }
            this.productList = result.records
            this.pagination.total = result.total
        } catch (error) {
            throw error
        }
    }

    // 查知识课程
    async getCourse () {
        try {
            const params = {
                status: '',
                searchParam: this.searchHistory,
                current: this.pagination.current,
                size: this.pagination.size
            }
            const { result } = await getVideoList(params)
            this.productList = result.records
            this.pagination.total = result.total
        } catch (error) {
            throw error
        }
    }

    // 查分类
    async getCategory () {
        try {
            const params = {
                productType: '',
                parentCode: 0, // 0：一级分类,
                // participate: this.type === 4 ? '' : true, // 分类下只包含参加推荐排序的商品
                size: this.pagination.size,
                current: this.pagination.current,
                ...(this.searchHistory ? { categoryName: this.searchHistory } : null)
            }
            const { result } = await getCategory(params)
            this.categoryList = result.records
            this.pagination.total = result.total
        } catch (e) {
            throw e
        }
    }

    onTabClick () {
        this.pagination.current = 1
        this.getData()
    }

    // 单选
    onRadioChange (selectedList = []) {
        this.selectedList = selectedList
    }

    // 多选
    onCheckboxChange (selectedList = []) {
        this.selectedList = selectedList
    }

    onPageChange (current: number) {
        this.pagination.current = current
        this.getData()
    }

    search () {
        this.searchHistory = this.searchValue
        this.getData()
    }

    refresh () {
        this.searchHistory = ''
        this.searchValue = ''
        this.pagination.current = 1
        this.selectedList = []
        this.getData()
    }

    clear () {
        this.searchValue = ''
        this.searchHistory = ''
        this.pagination.current = 1
        this.pagination.total = 0
        this.productList = []
        this.categoryList = []
        this.radioValue = ''
        this.selectedList = []
        this.options = []
    }

    close () {
        this.clear()
        this.$emit('update:show', false)
    }

    confirm () {
        let updateType
        // 商品分类
        if (this.type === ModalType.ProductAndCategoryModal) updateType = this.currentTab === 'category' ? 1 : 2
        // 分类
        if (this.type === ModalType.CategoryModal) updateType = 1
        // 知识课程
        if (this.type === ModalType.CourseModal) updateType = 3

        this.$emit('update', {
            type: updateType,
            selectedList: this.selectedList,
            index: this.editorListIndex
        })
        this.close()
    }

    init (modalType: number, radio = '') {
        this.radioValue = radio
        if (modalType === ModalType.CategoryModal) {
            this.categoryTableOptions = categoryTableOptionsProducer(modalType)
        }
        if (modalType === ModalType.ProductAndCategoryModal) {
            this.checker = productChecker
            this.options = this.productTableOptions
            this.categoryTableOptions = categoryTableOptionsProducer(modalType)
        }
        if (modalType === ModalType.CourseModal) {
            this.checker = courseChecker
            this.options = this.courseTableOptions
        }
    }

    /**
     * @param modalType {Number} 模块的id
     * @param index {Number} 在当前模块values列表中的位置
     * @param radio {String} 单选回显
     */
    open ({ modalType, index, radio = '' }: { modalType: number; index: number; radio: string }) {
        this.editorListIndex = index
        this.init(modalType, radio)
        this.$emit('update:type', Number(modalType))
        this.$emit('update:title', modalTitleMap[modalType])
        this.$nextTick(() => this.$emit('update:show', true))
    }
}
</script>

<style lang="scss">
.modal-product-category {
    img {
        // width: 100%;
        object-fit: cover;
    }
    .el-icon-refresh {
        font-size: 24px;
        cursor: pointer;
        &::before {
            color: #4F63FF;
        }
    }
    .el-dialog {
        min-width: 790px;
    }
    .el-tabs__item {
        text-align: center;
        width: 160px;
    }
    .el-tabs--card > .el-tabs__header {
        border-bottom: none;
    }
    .tab-bar {
        &.hide {
            .el-tabs__header {
                display: none;
            }
        }
    }
}

</style>
<style module lang="scss">
.modal-product-category {
    min-width: 1300px;
    .search-group {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-input {
            display: flex;
            align-items: center;
            position: relative;
        }
        button {
            margin-left: 10px;
        }
    }

    .btn-group {
        margin-top: 32px;
        text-align: center;
    }
}

</style>
