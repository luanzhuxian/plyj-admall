<template>
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
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-select
                    v-model="form.productType"
                    @change="search"
                    style="width: 100px;"
                >
                    <el-option label="全部商品" value="" />
                    <el-option v-for="key of Object.keys(goodsTypes)" :key="key" :label="goodsTypes[key]" :value="key" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-cascader
                    :props="{ expandTrigger: 'hover', value:'id', label:'categoryName', children:'childs' }"
                    :options="goodsClassifyList"
                    v-model="classifyCodes"
                    @change="search"
                />
            </el-form-item>
            <el-form-item>
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="请输入商品名称"
                    style="width: 200px;"
                    v-model="form.productName"
                    @change="search"
                    clearable
                />
                <el-button
                    type="primary"
                    style="width: 98px;margin-left: 28px;"
                    round
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    type="primary"
                    @click="e => { clearGoodsSearch(); search()}"
                >
                    清空搜索条件
                </el-button>
            </el-form-item>
        </el-form>

        <el-table :row-key="row => row.id" ref="table" :data="goodsList" @selection-change="selectGoods">
            <el-table-column reserve-selection type="selection" width="55" />
            <el-table-column>
                <template #default="{ row }">
                    <img
                        width="60"
                        height="60"
                        style="object-fit: cover;"
                        :src="row.productMainImage + '?x-oss-process=style/thum-middle'"
                        v-viewer
                    >
                </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="productType" label="类型" width="100">
                <template #default="{ row }">
                    {{ goodsTypes[row.productType] }}
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="分类" width="150" />
            <el-table-column prop="totalStock" label="剩余库存" width="100" />
            <el-table-column prop="price" label="价格" width="150" />
            <el-table-column prop="productStatusText" label="商品状态" width="100" />
        </el-table>

        <Pagination
            :total="total"
            v-model="form.current"
            :size="form.size"
            @change="getGoodsList"
        />
        <div style="margin-top: 32px; text-align: center;">
            <el-button
                type="primary"
                style="width: 70px;"
                @click="confirmGoods"
                :disabled="!selectedGoods.length || !isInRange"
            >
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getGoods, getCategoryTreePlatform } from '../../../../../apis/product-center/goods'
export default {
    name: 'ProductCheckbox',
    props: {
        visible: Boolean,
        defaultList: {
            type: Array,
            default () {
                return []
            }
        },
        // 最大选择数量
        maxSelectNum: {
            type: Number,
            default: 0,
            required: true
        }
    },
    data () {
        return {
            selectedGoods: [],
            goodsTypes: {
                PHYSICAL_GOODS: '实体商品',
                VIRTUAL_GOODS: '虚拟商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课'
            },
            goodsList: [],
            goodsClassifyList: [],
            total: 0,
            // 分类
            classifyCodes: [],
            form: {
                type: 'ALL',
                productName: '',
                productType: '',
                // 0：已删除 1：下架 2：上架  3：草稿箱
                productStatus: 2,
                //   一级分类ID
                categoryId: '',
                //  二级分类ID
                subCategoryId: '',
                current: 1,
                size: 4
            }
        }
    },
    methods: {
        async open () {
            try {
                await this.getGoodsClassifyList()
                await this.search()
            } catch (e) { throw e }
        },
        async search () {
            try {
                this.form.current = 1
                await this.getGoodsList()
            } catch (e) { throw e }
        },
        async getGoodsList () {
            try {
                const queryData = {
                    ...this.form,
                    //   一级分类ID
                    categoryId: this.classifyCodes[0] || '',
                    //  二级分类ID
                    subCategoryId: this.classifyCodes[1] || ''
                }
                const { result } = await getGoods(queryData)
                this.total = result.total
                this.goodsList = result.records
                this.defaultSelect()
            } catch (e) { throw e }
        },
        async getGoodsClassifyList () {
            try {
                const { result } = await getCategoryTreePlatform()
                if (result && result.length) {
                    result.unshift({ categoryName: '全部分类', id: '' })
                    this.goodsClassifyList = result
                }
            } catch (e) { throw e }
        },
        async defaultSelect () {
            try {
                await this.$nextTick()
                for (const item of this.goodsList) {
                    if (
                        this.defaultList.some(({ id }) => id === item.id) ||
            this.selectedGoods.some(({ id }) => id === item.id)
                    ) {
                        this.$refs.table.toggleRowSelection(item, true)
                    } else {
                        this.$refs.table.toggleRowSelection(item, false)
                    }
                }
            } catch (e) { throw e }
        },
        async clearGoodsSearch () {
            this.form = {
                type: 'ALL',
                productName: '',
                productType: '',
                // 0：已删除 1：下架 2：上架  3：草稿箱
                productStatus: 2,
                //   一级分类ID
                categoryId: '',
                //  二级分类ID
                subCategoryId: '',
                current: 1,
                size: 4
            }
            this.classifyCodes = []
            this.selectedGoods = []
        },
        selectGoods (list) {
            this.selectedGoods = list
        },
        closeAddListDialog () {
            this.$emit('update:visible', false)
            this.clearGoodsSearch()
        },
        async confirmGoods () {
            const list = JSON.parse(JSON.stringify(this.selectedGoods))
            this.$emit('confirm', list)
            this.$emit('update:visible', false)
        }
    },
    computed: {
        // 是否在可添加数量内
        isInRange () {
            return this.selectedGoods.length <= this.maxSelectNum
        }
    }
}
</script>

<style scoped lang="scss">

</style>
