<template>
    <div>
        <el-form
            :inline="true"
            :model="filterForm"
            class="border-bottom mb-20"
        >
            <div>
                <el-form-item>
                    <el-input
                        style="width: 200px;"
                        v-model="filterForm.keyword"
                        placeholder="请输入商品名称"
                        clearable
                        @change="search"
                    />
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select
                        v-model="filterForm.type"
                        @change="search"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item of typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-0">
                    <el-button
                        type="primary"
                        @click="search"
                    >
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item class="mr-10 mb-0">
                    <el-button type="primary" plain @click="resetFilterForm">
                        清空筛选条件
                    </el-button>
                </el-form-item>
                <el-form-item class="mr-10 mb-10">
                    <el-button
                        class="button"
                        type="primary"
                        plain
                        :disabled="!tableData.length"
                        @click="exportData"
                    >
                        导出数据
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
        <div>
            <el-table :data="tableData" class="mt-10" stripe>
                <span slot="empty" class="empty">
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                    没有查到数据，请确认后重新查询！
                </span>
                <el-table-column
                    prop="productName"
                    label="商品名称"
                />
                <el-table-column
                    prop="definiteType"
                    label="类型"
                />
                <el-table-column
                    label="商品分类"
                >
                    <template #default="{row}">
                        {{ row.mainCategoryName ? row.mainCategoryName : '--' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderCount"
                    label="购买数量"
                />
                <el-table-column
                    prop="payDiscounts"
                    label="收益金额"
                />
                <el-table-column
                    prop="payDiscounts"
                    label="商品状态"
                />
                <el-table-column
                    prop="payDiscounts"
                    label="参与Helper人数"
                />
                <el-table-column
                    prop="payDiscounts"
                    label="分享次数"
                />
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <div class="operationList">
                            <span @click="watchOrderList(row)">查看订单</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-model="filterForm.current"
                :sizes="true"
                :total="total"
                @sizeChange="sizeChange"
                @change="getList"
                style="margin-top: 12px;text-align: center;"
            />
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { getProductListOfHelper, exportProductListOfHelper } from '../../../../apis/marketing-manage/helper'
import { createObjectUrl } from '../../../../assets/ts/upload'
export default {
    name: 'DataOfProduct',
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            filterForm: {
                keyword: '',
                type: '',
                current: 1,
                size: 10
            },
            total: 0,
            tableData: [],
            typeList: [
                { value: '', label: '全部' },
                { value: 1, label: '实体商品' },
                { value: 2, label: '虚拟商品' },
                { value: 3, label: '体验课' },
                { value: 4, label: '正式课' },
                { value: 5, label: '知识课程' },
                { value: 6, label: '系列课' }
            ]
        }
    },
    async activated () {
        try {
            await this.getList()
        } catch (e) { throw e }
    },
    deactivated () {
        this.clearData()
    },
    methods: {
    // 获取列表数据
        async getList () {
            try {
                const { data: { result: { records, total } } } = await getProductListOfHelper(this.filterForm)
                this.tableData = records || []
                this.total = total
            } catch (e) { throw e }
        },
        async search () {
            try {
                this.filterForm.current = 1
                await this.getList()
            } catch (e) { throw e }
        },
        async resetFilterForm () {
            try {
                this.clearData()
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.size = val
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async exportData () {
            try {
                const dataList = await exportProductListOfHelper(this.filterForm)
                const url = createObjectUrl(dataList)
                const aElement = document.createElement('a')
                aElement.href = url
                aElement.download = `Helper活动商品数据${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                aElement.click()
                aElement.remove()
            } catch (e) {
                throw e
            }
        },
        watchOrderList (row) {
            // 网校订单
            this.$router.push({ name: 'OnlineSchoolOrder', params: { id: row.productId } })
            // 商品订单
            this.$router.push({ name: 'ProductList', params: { id: row.productId } })
            // 课程订单
            this.$router.push({ name: 'CoursesList', params: { id: row.productId } })
        },
        clearData () {
            this.filterForm = {
                keyword: '',
                type: '',
                current: 1,
                size: 10
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .operationList {
    width: 480px;
    color: #598bf8;
    span {
      cursor: pointer;
      padding: 6px 0; /*视觉上，垂直方向的padding不起作用，但是可以增加点击区域*/
      &:first-child:before {
        padding: 0;
      }
      &:before {
        content: '';
        font-size: 0;
        padding: 10px 3px 1px;
        margin-left: 6px;
        border-left: 1px solid #598bf8;
      }
    }
  }

</style>
