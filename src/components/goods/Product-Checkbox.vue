<template>
    <!-- 团购商品选择器 -->
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
            :model="goodsListForm"
        >
            <el-form-item>
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="请输入商品名称"
                    style="width: 200px;"
                    v-model="goodsListForm.searchContent"
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
                    />
                    <el-option
                        label="实体商品"
                        value="PHYSICAL_GOODS"
                    />
                    <el-option
                        label="虚拟商品"
                        value="VIRTUAL_GOODS"
                    />
                    <el-option
                        label="正式课"
                        value="FORMAL_CLASS"
                    />
                    <el-option
                        label="体验课"
                        value="EXPERIENCE_CLASS"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-cascader
                    :props="{ expandTrigger: 'hover', value:'id', label:'categoryName', children:'childs' }"
                    :options="goodsClassifyList"
                    v-model="goodsListForm.classifyCodes"
                    @change="getGoodsList(1)"
                />
            </el-form-item>
            <el-form-item>
                <el-select
                    v-model="goodsListForm.productStatus"
                    @change="getGoodsList(1)"
                    style="width: 150px;"
                >
                    <el-option
                        label="全部商品状态"
                        value=""
                    />
                    <el-option
                        label="出售中"
                        value="2"
                    />
                    <el-option
                        label="已售罄"
                        value="4"
                    />
                    <el-option
                        label="已下架"
                        value="1"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <!--        <el-button-->
                <!--          type="primary"-->
                <!--          style="width: 98px;margin-left: 28px;"-->
                <!--          @click="getGoodsList(1)"-->
                <!--        >-->
                <!--          搜索-->
                <!--        </el-button>-->
                <el-button
                    type="primary"
                    @click="clearGoodsSearch"
                >
                    刷新
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            ref="tabel"
            :data="goodsList"
            @selection-change="selectGoods"
            :row-key="getRowKeys"
            class="el-icon-check"
        >
            <el-table-column
                type="selection"
                :reserve-selection="true"
                width="55"
            />
            <el-table-column>
                <template slot-scope="{ row }">
                    <img
                        width="60"
                        height="60"
                        style="object-fit: cover;"
                        :src="row.productMainImage + '?x-oss-process=style/thum-middle'"
                        v-viewer
                    >
                </template>
            </el-table-column>
            <el-table-column
                property="productName"
                label="商品名称"
            />
            <el-table-column
                property="productTypeText"
                label="类型"
                width="100"
            />
            <el-table-column
                property="categoryName"
                label="分类"
                width="150"
            />
            <el-table-column
                property="totalStock"
                label="剩余库存"
                width="100"
            />
            <el-table-column
                property="price"
                label="价格"
                width="150"
            />
            <el-table-column
                property="productStatusText"
                label="商品状态"
                width="100"
            />
        </el-table>
        <Pagination
            :total="goodsPageSize.total"
            v-model="goodsPageSize.current"
            :size="goodsPageSize.size"
            @change="getGoodsList"
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
import { togetherActivityGoods } from '../../apis/marketing-manage/together'
import { getCategoryTreePlatform } from '../../apis/goods'
export default {
    name: 'ProductCheckbox',
    data () {
        return {
            goodsList: [],
            goodsPageSize: {
                current: 1,
                size: 1,
                total: 0
            },
            goodsClassifyList: [],
            goodsListForm: {
                searchContent: '',
                current: 1,
                size: 4,
                productType: '',
                productStatus: '',
                classifyCodes: ['']
            },
            selectedGoods: null
        }
    },
    props: {
        visible: Boolean,
        initCouponArray: {
            type: Array,
            default () {
                return []
            }
        }
    },
    methods: {
        async open () {
            if (this.goodsList.length && this.goodsClassifyList.length) return
            try {
                await this.getGoodsClassifyList()
                await this.getGoodsList(1)
            } catch (e) {
                throw e
            }
        },
        async confirmGoods () {
            this.$emit('confirm', this.selectedGoods)
            this.$emit('update:visible', false)
        },
        async getGoodsList (page) {
            if (page) {
                this.goodsListForm.current = page
            }
            const {
                searchContent,
                current,
                size,
                productType,
                productStatus,
                classifyCodes
            } = this.goodsListForm
            try {
                const data = await togetherActivityGoods({
                    searchContent,
                    current,
                    size,
                    productType,
                    productStatus,
                    categoryId: classifyCodes[0] || '',
                    subCategoryId: classifyCodes[1] || '',
                    activityType: 'GROUPBUGACTIVITY'
                })
                data.result.records.map((item, index) => {
                    item.index = (index + 1) + (Number(data.result.current) - 1) * Number(data.result.size)
                })
                this.goodsList = data.result.records
                this.goodsPageSize = {
                    current: data.result.current,
                    size: data.result.size,
                    total: data.result.total
                }
            } catch (e) {
                throw e
            }
        },
        clearGoodsSearch () {
            this.goodsListForm.searchContent = ''
            this.goodsListForm.current = 1
            this.goodsListForm.size = 4
            this.goodsListForm.productType = ''
            this.goodsListForm.productStatus = ''
            this.goodsListForm.classifyCodes = ['']
            this.selectedGoods = null
            this.getGoodsList()
            this.$refs.tabel.clearSelection()
        },
        selectGoods (selected) {
            this.selectedGoods = selected
        },
        closeAddListDialog () {
            this.$emit('update:visible', false)
            this.clearGoodsSearch()
        },
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
            return row.id
        }
    }
}
</script>
