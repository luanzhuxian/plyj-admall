<template>
    <div class="recommend wrap">
        <div>
            <el-button
                type="primary"
                @click="openDialog"
                round
                :disabled="isEdit"
            >
                新增推荐
            </el-button>
            <el-button
                plain
                @click="recommendBatchSort()"
                round
                :disabled="!recommendTable.length"
                v-if="!isEdit"
            >
                编辑排序
            </el-button>
            <el-button
                type="primary"
                @click="editSortNumber"
                round
                v-if="isEdit"
            >
                保存
            </el-button>
            <el-button
                size="mini"
                plain
                @click="cancelSortNumber"
                v-if="isEdit"
            >
                取消
            </el-button>
        </div>
        <div class="recommend-table">
            <div
                class="batch-text"
                v-if="multipleSelection.length"
            >
                <div class="batch-num">
                    已选择{{ multipleSelection.length }}条
                </div>
                <el-button
                    size="mini"
                    @click="cancelBatchRecommend()"
                >
                    批量取消推荐
                </el-button>
            </div>
            <div
                class="batch-info"
                v-else
            >
                <el-checkbox
                    :disabled="isEdit"
                    v-if="isEdit"
                    style="position: absolute;top: -2px;left: -30px;z-index: 999;"
                />
                全选
            </div>
            <el-table
                class="batch"
                :data="recommendTable"
                @selection-change="setSelectionChange"
                ref="recommendTable"
            >
                <span
                    slot="empty"
                    class="empty"
                >
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 暂无推荐榜单信息
                </span>
                <el-table-column
                    type="selection"
                    width="40"
                    align="left"
                    :selectable="()=>{ return !isEdit }"
                />
                <el-table-column
                    prop="serialNo"
                    label="排序"
                    header-align="center"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <el-input-number
                            v-model="row.sort"
                            controls-position="right"
                            :min="1"
                            :max="30"
                            v-if="isEdit"
                            @change="checkSort(row)"
                        />
                        <span v-else>{{ row.serialNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderDetails"
                    :label="$route.name === 'RecommendGoods' ? '商品信息' : '课程信息'"
                    width="350"
                >
                    <template slot-scope="{ row }">
                        <div class="order-detail">
                            <img
                                v-imgError
                                :width="$route.name === 'RecommendGoods' ? 60 : 90"
                                height="60"
                                :src="row.productMainImage"
                                v-viewer
                            >
                            <div>
                                <p class="detail-title">
                                    {{ row.productName }}
                                </p>
                                <p class="detail-tags">
                                    <span
                                        v-for="item of row.labelNames"
                                        :key="item"
                                    >{{ item }}</span>
                                </p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="productType"
                    label="类别"
                />
                <el-table-column
                    prop="categoryName"
                    :label="$route.name === 'RecommendGoods' ? '商品分类' : '课程分类'"
                />
                <el-table-column
                    prop="salesVolume"
                    label="总销量"
                />
                <el-table-column
                    prop="productStatusTxt"
                    :label="$route.name === 'RecommendGoods' ? '商品状态' : '课程状态'"
                />
                <el-table-column
                    prop="createTime"
                    label="添加时间"
                    align="center"
                />
                <el-table-column
                    label="操作"
                    align="right"
                    width="100"
                    header-align="right"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            type="text"
                            size="mini"
                            @click="cancelRecommend(row.id)"
                            :disabled="isEdit"
                        >
                            取消推荐
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogVisible"
            title="新增推荐"
            @close="closeDialog"
        >
            <el-form
                :inline="true"
                v-model="searchForm"
            >
                <el-form-item>
                    <el-select
                        v-model="searchForm.productType"
                        @change="searchProduct"
                        style="width: 100px;"
                    >
                        <el-option
                            v-for="(item,index) of searchType"
                            :key="index"
                            :label="item.dictDataValue"
                            :value="item.dictDataKey"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-cascader
                        :props="{ expandTrigger: 'hover', value:'id', label:'categoryName', children:'childs' }"
                        :options="categoryList"
                        v-model="categoryArray"
                        @change="searchProduct"
                    />
                </el-form-item>
                <el-form-item style="margin-left: 40px;">
                    <el-input
                        prefix-icon="el-icon-search"
                        :placeholder="$route.name === 'RecommendGoods' ? '搜索商品名称' : '搜索课程名称'"
                        style="width: 180px;"
                        v-model="searchForm.productName"
                    />
                    <el-button
                        type="primary"
                        style="width: 98px;margin-left: 10px;"
                        @click="searchProduct"
                    >
                        查询
                    </el-button>
                    <el-button
                        type="primary"
                        @click="refreshProduct"
                    >
                        清空搜索条件
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="searchTable"
                empty-text="请输入信息进行搜索"
                style="margin-top: 38px;"
            >
                <el-table-column
                    :label="$route.name === 'RecommendGoods' ? '商品图片' : '课程图片'"
                    width="150"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <img
                            v-imgError
                            width="48"
                            height="48"
                            :src="row.productMainImage"
                            v-viewer
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    property="productName"
                    :label="$route.name === 'RecommendGoods' ? '商品名称' : '课程名称'"
                    width="300"
                />
                <el-table-column
                    property="createTime"
                    label="添加时间"
                    width="200"
                />
                <el-table-column
                    label="设置推荐"
                >
                    <template slot-scope="{ row }">
                        <span v-if="row.serialNo">当前排位{{ row.serialNo }}</span>
                        <div class="switch-group" v-if="!row.serialNo">
                            <el-switch
                                v-model="row.isSelected"
                                active-color="#598BF8"
                                inactive-color="#CCCCCC"
                                @change="resetSwitch(row)"
                            />
                            <pl-svg width="16" v-if="row.isSelected" :key="2" name="icon-open-recommend" fill="#598BF8" />
                            <pl-svg width="16" v-else :key="3" name="icon-close-recommend" fill="#999999" />
                        </div>
                        <span v-if="!row.serialNo && row.isSelected">
                            <el-input-number
                                v-model="row.sort"
                                :min="1"
                                :max="recommendNumberInfo.nextNumber"
                            />
                            <span style="margin-left: 6px;">位</span>
                        </span>
                        <span
                            class="text-btn"
                            @click="setRecommend(row.productId,row.sort)"
                            v-if="!row.serialNo && row.isSelected"
                        >
                            保存
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                small
                layout="prev, pager, next"
                :current-page="searchForm.current"
                :page-size="searchForm.size"
                :total="searchTotal"
                @current-change="setPageSize"
                style="margin-top: 12px;text-align: center;"
            />
            <div style="margin-top: 32px;text-align: center;">
                <el-button
                    type="primary"
                    style="width: 70px;"
                    @click="closeDialog"
                >
                    关闭
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getDataDictionary } from '../../../apis/common'
import { getCategoryTreePlatform, getRecommendProduct, getAddRecommend, cancelRecommend, modifyRecommend, createAddRecommend, getCurrentNumber } from '../../../apis/product-center/goods'

export default {
    name: 'Recommend',
    data () {
        return {
            recommendForm: {
                recommendType: 1,
                current: 1,
                size: 30
            },
            // 推荐列表
            recommendTable: [],
            // 选择的项目
            multipleSelection: [],
            isEdit: false,
            // 添加推荐弹层
            dialogVisible: false,
            // 搜索条件
            searchForm: {
                recommendType: 1,
                categoryId: '',
                subCategoryId: '',
                productType: this.$route.name === 'RecommendGoods' ? 'ALL_GOODS' : 'ALL_CLASS',
                productName: '',
                current: 1,
                size: 4
            },
            // 搜索类型数据字典
            searchType: [],
            // 分类数据
            categoryList: [],
            // 分类中间变量
            categoryArray: [''],
            // 搜索结果
            searchTable: [],
            // 搜索结果计数
            searchTotal: 0,
            // 推荐信息对象
            recommendNumberInfo: {}
        }
    },
    watch: {
        $route () {
            this.recommendTable = []
            this.searchForm.current = 1
            this.getRecommends()
            this.getRecommendCurrent()
        },
        categoryArray (val) {
            if (val.length) {
                this.searchForm.categoryId = val[0] || ''
                this.searchForm.subCategoryId = val[1] || ''
            }
        }
    },
    created () {
        this.getRecommends()
        this.getRecommendCurrent()
    },
    methods: {
        checkRoute () {
            if (this.$route.name === 'RecommendGoods') {
                this.recommendForm.recommendType = 1
                this.searchForm.recommendType = 1
                return 1
            }
            this.recommendForm.recommendType = 2
            this.searchForm.recommendType = 2
            return 2
        },
        // 获取推荐状态
        async getRecommendCurrent () {
            const { result } = await getCurrentNumber({ recommendType: this.checkRoute() })
            if (result) {
                this.recommendNumberInfo = result
            }
        },
        // 获取推荐列表
        async getRecommends () {
            try {
                await this.checkRoute()
                const data = await getRecommendProduct(this.recommendForm)
                if (data && data.result && data.result.records && data.result.records.length) {
                    for (const item of data.result.records) {
                        item.sort = item.serialNo
                    }
                    this.recommendTable = data.result.records
                } else {
                    this.recommendTable = []
                }
            } catch (e) {
                throw e
            }
        },
        async checkSort (row) {
            if (row.sort <= this.recommendNumberInfo.currentNumber) {
                for (const item of this.recommendTable) {
                    if (row.sort === item.sort && item.id !== row.id) {
                        try {
                            await this.$confirm(`该位数已编辑是否继续当前${ this.$route.name === 'RecommendGoods' ? '商品' : '课程' }位数编辑？`)
                        } catch (e) {
                            row.sort = row.serialNo
                        }
                    }
                }
            }
        },
        // 修改推荐名次顺序
        async editSortNumber () {
            const array = []
            for (const item of this.recommendTable) {
                if (item.sort !== item.serialNo) {
                    array.push({ id: item.id, serialNo: item.sort })
                }
            }
            if (array.length) {
                await modifyRecommend({ list: array, recommendType: this.checkRoute() })
                await this.getRecommends()
                this.isEdit = false
            } else {
                this.isEdit = false
            }
        },
        // 取消修改名次顺序
        cancelSortNumber () {
            for (const item of this.recommendTable) {
                item.sort = item.serialNo
            }
            this.isEdit = false
        },
        // 取消推荐
        async cancelRecommend (id) {
            await this.$confirm(`确定取消该${ this.$route.name === 'RecommendGoods' ? '商品' : '课程' }推荐？`)
            try {
                await cancelRecommend({ cancelList: [id], recommendType: this.checkRoute() })
                this.$success('取消推荐成功')
                this.getRecommends()
            } catch (e) {
                this.$error('取消推荐失败')
            }
        },
        // 多选过滤出id来批量操作
        setSelectionChange (val) {
            const array = []
            if (val && val.length) {
                for (const item of val) {
                    array.push(item.id)
                }
            }
            this.multipleSelection = array
        },
        recommendBatchSort () {
            this.$refs.recommendTable.clearSelection()
            this.multipleSelection = []
            this.isEdit = true
        },
        // 批量取消推荐
        async cancelBatchRecommend () {
            await this.$confirm(`确定批量取消${ this.$route.name === 'RecommendGoods' ? '商品' : '课程' }推荐？`)
            try {
                await cancelRecommend({ cancelList: this.multipleSelection, recommendType: this.checkRoute() })
                this.$success('批量取消推荐成功')
                this.getRecommends()
            } catch (e) {
                this.$error('批量取消推荐失败')
            }
        },
        // 获取新增推荐基础数据
        async getSearchData () {
            let type = null
            if (this.$route.name === 'RecommendGoods') {
                type = 'goodsType'
                this.searchForm.productType = 'ALL_GOODS'
            } else {
                type = 'courseType'
                this.searchForm.productType = 'ALL_CLASS'
            }
            const data = await getDataDictionary(type)
            this.searchType = data.result || []
            const res = await getCategoryTreePlatform()
            if (res && res.result && res.result.length) {
                res.result.unshift({ categoryName: '全部分类', id: '' })
                this.categoryList = res.result
            }
        },
        // 打开新增推荐弹窗，并准备数据
        async openDialog () {
            await this.getSearchData()
            await this.searchProduct()
            this.dialogVisible = true
        },
        // 搜索列表以备推荐
        async searchProduct () {
            try {
                await this.checkRoute()
                const data = await getAddRecommend(this.searchForm)
                if (data && data.result && data.result.records) {
                    // 如果当前页面没有数据，且页码大于1，则请求上一页
                    if (data.result.records.length === 0 && this.searchForm.current > 1) {
                        this.searchForm.current--
                        this.searchProduct()
                        return
                    }
                    await this.getRecommendCurrent()
                    for (const item of data.result.records) {
                        item.isSelected = false
                        item.sort = this.recommendNumberInfo.nextNumber
                    }
                    this.searchTable = data.result.records
                    this.searchTotal = data.result.total
                } else {
                    this.searchTable = []
                }
            } catch (e) {
                throw e
            }
        },
        refreshProduct () {
            this.searchForm = {
                recommendType: 1,
                categoryId: '',
                subCategoryId: '',
                productType: this.$route.name === 'RecommendGoods' ? 'ALL_GOODS' : 'ALL_CLASS',
                productName: '',
                current: 1,
                size: 4
            }
            this.categoryArray = ['']
            this.searchProduct()
        },
        // 分页设置页码并查询
        setPageSize (e) {
            this.searchForm.current = e
            this.searchProduct()
        },
        // 重置开关的状态
        resetSwitch (row) {
            if (!this.recommendNumberInfo.canAdd) {
                this.$error('推荐位已满，请编辑后重试')
                row.isSelected = !row.isSelected
                return false
            }
            if (row.isSelected) {
                for (const items of this.searchTable) {
                    items.isSelected = false
                }
                row.isSelected = true
            }
        },
        // 设置推荐
        async setRecommend (id, sort) {
            if (!this.recommendNumberInfo.canAdd) {
                this.$alert(`榜单${ this.$route.name === 'RecommendGoods' ? '商品' : '课程' }已满30，请整理榜单后重新加入`)
                return false
            }
            if (sort <= this.recommendNumberInfo.currentNumber) {
                await this.$confirm(`该位数已编辑是否继续当前${ this.$route.name === 'RecommendGoods' ? '商品' : '课程' }位数编辑？`)
            }
            await createAddRecommend({ productId: id, serialNo: sort, recommendType: this.checkRoute() })
            this.$success('设置推荐成功')
            await this.searchProduct()
        },
        // 关闭弹窗并清理数据
        async closeDialog () {
            this.searchTable = []
            this.searchForm = {
                recommendType: 1,
                categoryId: '',
                subCategoryId: '',
                productType: this.$route.name === 'RecommendGoods' ? 'ALL_GOODS' : 'ALL_CLASS',
                productName: '',
                current: 1,
                size: 4
            }
            this.categoryArray = ['']
            await this.getRecommends()
            this.dialogVisible = false
        }
    }
}
</script>

<style scoped lang="scss">
    .recommend{
        padding-bottom: 15px;
    }

    .recommend-table{
        position: relative;

        .empty{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 12px;
                margin-right: 8px;
            }
        }

        .batch-text {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 11px;
            left: 50px;
            z-index: 11;
            font-size: 12px;

            .batch-num {
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                line-height: 17px;
                margin-right: 10px;
            }
        }

        .batch-info {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #666666;
            position: absolute;
            top: 17px;
            left: 50px;
            z-index: 11;
            font-size: 12px;
        }

        .order-detail{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            img{
                margin-right: 12px;
                object-fit: cover;
            }
            .detail-title{
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                width: 215px;
                color: #454553;
                font-size: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .detail-tags{
                width: 215px;
                span{
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    max-width: 100px;
                    height: 18px;
                    margin: 0 10px 4px 0;
                    padding: 0 2px;
                    color: #EC742E;
                    font-size: 10px;
                    border: 1px solid #EC742E;
                }
            }
        }

        .batch {
            ::v-deep .el-table__header-wrapper {
                .has-gutter {
                    tr {
                        th {
                            padding-top: 50px;
                        }

                        .el-table-column--selection {
                            padding: 0;
                            padding-bottom: 30px;
                        }
                    }
                }
            }
        }

        ::v-deep .el-input-number{
            width: 70px;
            .el-input__inner{
                padding-left: 10px;
                padding-right: 30px;
                text-align: left;
            }
        }
    }

    ::v-deep .el-dialog{
        .el-dialog__body{
            padding: 0 0 32px 0 !important;
            .el-form {
                padding: 12px 32px;
                border-bottom: 1px solid #E7E7E7;
                .el-form-item{
                    margin-bottom: 0;
                }
            }
            .switch-group{
                display: inline-flex;
                flex-direction: column;
                width: 50px;
                height: 32px;
                margin-right: 10px;
                position: relative;
                & > img{
                    position: absolute;
                    left: 5px;
                    bottom: 0;
                }
            }
            .text-btn{
                margin-left: 16px;
                color: #598BF8;
                font-size: 12px;
                cursor: pointer;
            }
            ::v-deep .el-pager{
                .active , & > li:hover{
                    color: #EC742E;
                }
            }
        }
    }

    .el-button.is-disabled,.el-button.is-disabled:hover{
        color: #ffffff;
        background-color: #CCCCCC;
        border-color: #CCCCCC;
    }
</style>
