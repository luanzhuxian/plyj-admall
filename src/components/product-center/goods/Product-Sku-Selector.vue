<template>
    <!-- 选择全部商品，不同于Product-Checkbox.vue的是，可以选择单独的规格 -->
    <el-dialog
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="visible"
        title="全部商品"
        @close="closeAddListDialog"
        @open="open"
        class="product-selector"
    >
        <el-form
            :inline="true"
        >
            <el-form-item>
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="请输入商品名称"
                    style="width: 200px;"
                    v-model="goodsListForm.productName"
                    @change="getGoodsList(1)"
                    clearable
                />
            </el-form-item>
            <el-form-item>
                <el-select
                    v-model="goodsListForm.productType"
                    @change="getGoodsList(1)"
                    style="width: 100px;"
                >
                    <el-option
                        label="全部商品"
                        value=""
                        :key="10"
                    />
                    <el-option
                        v-for="(k, i) in Object.keys(typeMap)"
                        :key="i"
                        :label="typeMap[k]"
                        :value="k"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-cascader
                    :props="{ expandTrigger: 'hover', value:'id', label:'categoryName', children:'childs' }"
                    :options="goodsClassifyList"
                    v-model="category"
                    @change="categoryChange"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="getGoodsList(1)"
                >
                    查询
                </el-button>
            </el-form-item>
        </el-form>

        <el-table
            ref="table"
            :data="goodsList"
            class="el-icon-check"
            @expand-change="setSelection"
        >
            <el-table-column
                type="expand"
                width="55"
            >
                <template #default="{ row }">
                    <el-table
                        style="width: 100%;"
                        :data="row.skuEntityList"
                        @selection-change="selected => { selectGoods(row, selected) }"
                        :row-key="getRowKeys"
                        reserve-selection
                        :ref="`child-table-${row.id}`"
                        :show-header="false"
                    >
                        <el-table-column type="selection" width="55" />
                        <el-table-column width="200" />
                        <el-table-column width="150">
                            <template>
                                <span v-text="row.skuCode1Name" />
                                <template v-if="row.skuCode2Name">
                                    <span>/</span>
                                    <span v-text="row.skuCode2Name" />
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock" width="100" />
                        <el-table-column prop="price" width="100" />
                        <el-table-column width="100" />
                        <el-table-column width="100" />
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column width="60">
                <template slot-scope="{ row }">
                    <img
                        width="30"
                        height="30"
                        style="object-fit: cover;"
                        :src="row.productMainImage + '?x-oss-process=style/thum-middle'"
                        v-viewer
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="productName"
                label="商品名称"
                width="200"
            />
            <el-table-column label="规格" width="150" />
            <el-table-column label="剩余库存" width="100" />
            <el-table-column label="价格" width="100" />
            <el-table-column
                prop="productTypeText"
                label="类型"
                width="100"
            >
                <template #default="{ row }">
                    <span v-text="typeMap[row.productType]" />
                </template>
            </el-table-column>
            <el-table-column
                prop="productStatusText"
                label="商品状态"
                width="100"
            />
        </el-table>
        <Pagination
            :total="goodsPageSize.total"
            v-model="goodsPageSize.current"
            :size="goodsPageSize.size"
            @change="getGoodsList"
            layout="prev, pager, next, jumper"
        />
        <div style="margin-top: 32px;text-align: center;">
            <el-button
                type="primary"
                style="width: 70px;"
                @click="confirmGoods"
                :disabled="!selectedGoods"
            >
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getCategoryTreePlatform, getGoods } from '../../../apis/product-center/goods'
import { resetForm } from '../../../assets/ts/utils'
export default {
    name: 'ProductSelector',
    data () {
        return {
            goodsList: [],
            category: [],
            goodsPageSize: {
                current: 1,
                size: 5,
                total: 0
            },
            // 记录被取消选中的商品
            cancelProducts: new Set(),
            typeMap: {
                PHYSICAL_GOODS: '实体商品',
                VIRTUAL_GOODS: '虚拟商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课'
            },
            goodsClassifyList: [],
            goodsListForm: {
                type: 'GOODS',
                categoryId: '',
                subCategoryId: '',
                productType: '',
                productName: '',
                recommendStatus: '',
                startTime: '',
                endTime: '',
                productStatus: '2',
                sortCondition: '',
                current: 1,
                size: 5
            },
            selectedGoods: null
        }
    },
    props: {
        visible: Boolean,
        // 默认选中的规格
        // 格式：[{ skuCode1, skuCode2, productId }]
        defaultSelected: {
            type: Array,
            default () {
                return []
            }
        },
        allowedStatus: {
            type: Array,
            default () {
                return ['', '1', '2', '4']
            }
        },
        maxSelect: {
            type: Number,
            default: Number.MAX_VALUE
        }
    },
    async created () {
        try {
            await this.getGoodsList(1)
        } catch (e) {
            throw e
        }
    },
    watch: {
        async visible (val) {
            if (!val) return
            try {
                await this.getGoodsList(1)
            } catch (e) {
                throw e
            }
        }
    },
    methods: {

        /**
     * 获取列表
     * @param [page] {number} 页码
     * @param [type] {string} 商品类型
     * @return {Promise<void>}
     */
        async getGoodsList (page = 1, type) {
            this.goodsListForm.current = page || 1
            type = type || this.goodsListForm.productType
            if (type === 'FORMAL_CLASS' || type === 'EXPERIENCE_CLASS') {
                this.goodsListForm.type = 'CLASS'
            } else if (type === '') {
                this.goodsListForm.type = 'ALL'
            } else {
                this.goodsListForm.type = 'GOODS'
            }
            try {
                const { result: { records, current, size, total } } = await getGoods(this.goodsListForm)
                this.goodsList = records
                this.goodsPageSize = {
                    current,
                    size,
                    total
                }
                await this.$nextTick()
                await this.setDefaultSelection()
            } catch (e) {
                throw e
            }
        },
        // 窗口打开时调用
        async open () {
            try {
                if (this.goodsList.length && this.goodsClassifyList.length) {
                    await this.setDefaultSelection()
                    return
                }
                await Promise.all([this.getGoodsClassifyList(), this.getGoodsList(1)])
            } catch (e) {
                throw e
            }
        },
        async categoryChange (val) {
            try {
                this.goodsListForm.categoryId = val[0] || ''
                this.goodsListForm.subCategoryId = val[1] || ''
                await this.getGoodsList()
            } catch (e) {
                throw e
            }
        },
        // 设置默认选中的享
        async setDefaultSelection () {
            for (const pro of this.goodsList) {
                for (const sku of pro.skuEntityList) {
                    const ct = this.$refs && this.$refs.table && this.$refs.table.$refs[`child-table-${ sku.id }`]
                    if (ct) {
                        ct.clearSelection()
                    }
                }
            }
            for (const sku of this.defaultSelected) {
                const productId = sku.productId
                const row = this.goodsList.find(item => item.id === productId)
                if (row) {
                    // 展开存在选中规格的商品
                    this.$refs.table && this.$refs.table.toggleRowExpansion(row, true)
                    // 选中该商品的规格
                    this.setSelection(row)
                }
            }
        },
        // 选中某一行
        async setSelection (row) {
            for (const sku of this.defaultSelected) {
                const skuRow = row.skuEntityList.find(item => item.skuCode1 === sku.skuCode1 && item.skuCode2 === sku.skuCode2)
                await this.$nextTick()
                const childTable = this.$refs[`child-table-${ row.id }`]
                if (childTable && skuRow) {
                    childTable.toggleRowSelection(skuRow, true)
                }
            }
        },

        /**
     * 确认选择
     * 由于商品列表时分页展示的，如果某一页的商品未被加载，但其实它时被选择的，会造成这类商品被丢弃
     * 因此，在确认的时候，取药判断一下，取消了哪些商品，排除掉这些商品后，将新选择的列表与老列表进行合并后再发送出去
     * @return {Promise<void>}
     */
        async confirmGoods () {
            const currentData = []
            // TODO: 等flat支持性更好一些后用flat，更简洁
            for (const skus of Object.values(this.selectedGoods)) {
                for (const sku of skus) {
                    currentData.push(sku)
                }
            }
            // 如果默认的商品没有被取消且当前选中的里边也没有它，就将此商品合并至新的列表中
            for (const pro of this.defaultSelected) {
                const key = pro.skuCode1 + pro.skuCode2
                if (
                    !this.cancelProducts.has(key) &&
          !currentData.some(item => key === item.skuCode1 + item.skuCode2) &&
          !['KNOWLEDGE_COURSE', 'SERIES_OF_COURSE'].includes(pro.productType)
                ) {
                    currentData.push(pro)
                }
            }
            if (currentData.length > this.maxSelect) {
                return this.$warning(`最多选择${ this.maxSelect }个商品`)
            }
            this.$emit('confirm', currentData)
            this.$emit('update:visible', false)
        },
        clearGoodsSearch () {
            this.clearSelection()
            resetForm(this.goodsListForm, {
                current: 1,
                size: 5,
                type: this.goodsListForm.type || 'GOODS',
                productStatus: '2'
            })
            this.selectedGoods = null
            this.category = ['']
        },
        // 清空规格选择
        clearSelection () {
            const table = this.$refs.table
            for (const pro of this.goodsList) {
                const childTable = this.$refs[`child-table-${ pro.id }`]
                if (childTable) childTable.clearSelection()
                table && table.toggleRowExpansion(pro, false)
            }
        },
        // 表格选择事件
        selectGoods (pro, selected) {
            for (const sku of pro.skuEntityList) {
                const isCancel = selected.includes(sku)
                const key = sku.skuCode1 + sku.skuCode2
                // 如果商品被取消，就记录，否则，删除激励
                if (!isCancel) {
                    this.cancelProducts.add(key)
                } else {
                    this.cancelProducts.delete(key)
                }
            }
            // 判断当前规格的选中状态，如果被取消了，就记录被取消的规格
            const data = []
            for (const item of selected) {
                data.push({
                    productId: pro.id,
                    productName: pro.productName,
                    image: pro.productMainImage,
                    productStatus: pro.productStatus,
                    productStatusText: pro.productStatusText,
                    productType: pro.productType,
                    shoppingStatus: pro.shoppingStatus,
                    skuId: item.id,
                    skuCode1: item.skuCode1,
                    skuCode2: item.skuCode2,
                    skuCode1Name: item.skuCode1Name,
                    skuCode2Name: item.skuCode2Name,
                    stock: item.stock,
                    price: item.price,
                    originPrice: item.originPrice || 0,
                    skuImage: pro.skuEntityList.length ? pro.skuEntityList[0].skuImage : ''
                })
            }
            if (this.selectedGoods) {
                this.selectedGoods[pro.id] = data
            } else {
                this.selectedGoods = {
                    [pro.id]: data
                }
            }
        },
        closeAddListDialog () {
            this.$emit('update:visible', false)
            this.clearGoodsSearch()
        },
        // 获取分类
        async getGoodsClassifyList () {
            try {
                const data = await getCategoryTreePlatform()
                if (data && data.result && data.result.length) {
                    data.result.unshift({ categoryName: '全部分类', id: '' })
                    this.goodsClassifyList = data.result
                }
            } catch (e) {
                throw e
            }
        },
        getRowKeys (row) {
            return row.skuCode1 + row.skuCode2
        }
    }
}
</script>
<style scoped lang="scss">
::v-deep .el-table__expanded-cell {
    padding: 0 0 0 60px !important;
    border-bottom: none !important;
    background-color: #fcfcfc;
    tr {
        background-color: #fcfcfc;
    }
}
</style>
