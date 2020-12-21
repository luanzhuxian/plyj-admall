<template>
    <el-dialog
        class="modal"
        :title="title"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="show"
        @close="close"
    >
        <template>
            <el-form class="search-group" :inline="true" :model="form">
                <el-form-item>
                    <el-input
                        style="width: 200px;"
                        v-model="inputVal"
                        clearable
                        prefix-icon="el-icon-search"
                        placeholder="请输入课程名称"
                        @change="search"
                    />
                </el-form-item>
                <el-form-item class="search-btn-group">
                    <el-button
                        type="primary"
                        @click="search"
                        round
                    >
                        查询
                    </el-button>
                    <el-button
                        type="text"
                        @click="refresh"
                    >
                        清空筛选条件
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table
                style="width: 100%; min-height: 336px;"
                ref="table"
                :data="list"
                :row-key="getRowKeys"
                @select="handleSelect"
                @select-all="handleSelectAll"
                @selection-change="onCheckboxChange"
                reserve-selection
            >
                <el-table-column
                    type="selection"
                    width="55"
                    :reserve-selection="true"
                    align="right"
                />
                <el-table-column
                    width="100"
                    label="课程图片"
                >
                    <template slot-scope="{ row }">
                        <img v-img-error width="48" height="48" :src="row.courseImg + '?x-oss-process=style/thum-small'">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="courseName"
                    label="知识课程名称"
                />
                <el-table-column
                    label="类型"
                >
                    <template #default="{ row }">
                        {{ row.courseType === 2 ? '系列课' : '视频课程' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sellingPrice"
                    label="价格（元）"
                />
                <el-table-column
                    label="状态"
                >
                    <template slot-scope="{ row }">
                        {{ statusMap[row.status] }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-group">
                <el-pagination
                    class="pagination"
                    small
                    layout="prev, pager, next"
                    :page-size="form.size"
                    :current-page.sync="form.current"
                    :total="pagination.total"
                    @current-change="onPageChange"
                />
            </div>
            <div class="btn-group">
                <el-button type="primary" round @click="confirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { getVideoList } from '../../apis/product-center/online-teaching/knowledge-course'

export default {
    name: 'Modal',
    props: {
        show: Boolean,
        title: {
            type: String,
            default: '知识课程'
        },
        defaultSelected: {
            type: Array,
            default () {
                return []
            }
        },
        // 查询的课程类型，默认查所有 1-单课 2-系列课
        courseType: {
            type: String,
            default: ''
        },
        // 查询的课程状态，默认查所有 1-仅上架
        status: {
            type: String,
            default: ''
        },
        maxSelect: {
            type: Number,
            default: Number.MAX_VALUE
        }
    },
    data () {
        return {
            form: {
                courseType: '',
                current: 1,
                size: 4,
                searchParam: '',
                status: ''
            },
            pagination: {
                total: 0
            },
            inputVal: '',
            list: [],

            /*
        * 当前问题在于：
        * 分页没有切到有勾选项的页面，无法记录到勾选，
        * originalSelected记录的是从父组件过来默认勾选数据，并去除了点击过取消勾选的数据，剩余的数据只有两种情况:
           1-切到过所在页，但没有变更的数据 2-没有切到所在页的数据
      */
            originalSelected: [],
            checkbox: [],
            getRowKeys (row) {
                return row.id
            },
            statusMap: {
                1: '上架中',
                2: '已下架'
            }
        }
    },
    computed: {
        selectedProdNum () {
            if (!this.originalSelected.length) {
                return 0
            }
            const list = this.originalSelected.filter(item => item.productType && item.productType !== 'KNOWLEDGE_COURSE')
            return list.length
        }
    },
    watch: {
        show (val) {
            this.form.courseType = this.courseType
            this.form.status = this.status
            this.originalSelected = JSON.parse(JSON.stringify(this.defaultSelected))
            this.originalSelected.forEach(item => {
                item.id = item.productId
            })
            val ? this.getData() : this.clear()
        }
    },
    methods: {
    // 设置默认选中
        async defaultSelect () {
            await this.$nextTick()
            const table = this.$refs.table
            if (this.originalSelected.length && table) {
                for (const item of this.list) {
                    // 是否应该被选中
                    const willSelected = this.originalSelected.some(row => row.id === item.id)
                    const newSelected = this.checkbox.some(row => row.id === item.id)
                    if (willSelected || newSelected) {
                        table.toggleRowSelection(item, true)
                    }
                }
            }
        },
        handleSelect (selection, row) {
            // 判断是否选中
            const isSelected = selection.includes(row)
            // 若是取消选中，将源数据的也删除掉
            if (!isSelected) this.deleteOriginalSelected(row.id)
        },
        handleSelectAll (selection) {
            // 取消全选 当前页所有数据
            const isAll = selection.length === this.list.length
            if (!isAll) {
                for (const item of this.list) {
                    this.deleteOriginalSelected(item.id)
                }
            }
        },
        deleteOriginalSelected (id) {
            const currentIndex = this.originalSelected.findIndex(item => item.id === id)
            if (currentIndex !== -1) this.originalSelected.splice(currentIndex, 1)
        },
        async getData () {
            try {
                const { result } = await getVideoList(this.form)
                this.list = result.records
                this.pagination.total = result.total
                this.defaultSelect()
            } catch (e) {
                throw e
            }
        },
        onCheckboxChange (value) {
            this.checkbox = JSON.parse(JSON.stringify(value))
        },
        onPageChange (current) {
            this.form.current = current
            this.getData()
        },
        search () {
            this.form.searchParam = this.inputVal
            this.getData()
        },
        refresh () {
            this.clear()
            this.form.courseType = this.courseType
            this.form.status = this.status
            this.getData()
        },
        clear () {
            this.form.searchParam = ''
            this.inputVal = ''
            this.form.status = ''
            this.form.courseType = ''
            this.form.current = 1
            this.pagination.total = 0
            this.checkbox = []
            this.list = []
            this.$refs.table.clearSelection()
        },
        close () {
            this.clear()
            this.$emit('update:show', false)
        },
        confirm () {
            const allSelect = JSON.parse(JSON.stringify(this.checkbox))
            for (const item of this.originalSelected) {
                const index = this.checkbox.findIndex(iItem => iItem.id === item.id)
                if (index === -1 && (item.productType === 'KNOWLEDGE_COURSE' || item.productType === 'SERIES_OF_COURSE')) {
                    allSelect.push(item)
                }
            }
            if (allSelect.length > this.maxSelect) {
                return this.$warning(`最多选择${ this.maxSelect }个商品/知识课程`)
            }
            this.$emit('confirm', allSelect)
            this.close()
        }
    }
}
</script>

<style scoped lang="scss">
.modal {
    .searh-btn-group {
        margin-left: auto;
    }

    .btn-group {
        padding: 28px 0 32px;
        text-align: center;
    }

    .pagination-group {
        position: relative;
        margin-top: 20px;
        padding: 12px 32px;
        span {
            font-size: 12px;
            color: #666;
        }
        .pagination {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
        }
    }

    .el-icon-search {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        &::before {
            color: #999;
        }
    }
    .el-icon-refresh {
        font-size: 24px;
        cursor: pointer;
        &::before {
            color: #326ff6;
        }
    }

    img {
        width: 100%;
        object-fit: cover;
    }

    ::v-deep .el-dialog {
        min-width: 790px;
    }
    ::v-deep .el-input--small .el-input__inner {
        padding-left: 30px;
    }
    ::v-deep .el-table .cell {
        line-height: 1;
    }
    ::v-deep .el-table tr {
        height: 72px;
    }
    ::v-deep .el-table thead > tr {
        height: 48px;
    }
    ::v-deep .el-radio__label {
        display: none;
    }
    ::v-deep .el-pager li {
        color: #333;
        font-weight: normal;
        &:hover {
            color: #333;
        }
    }
    ::v-deep .el-pager li.active {
        color: #ec742e;
        cursor: default;
        &:hover {
            color: #ec742e;
        }
    }
    ::v-deep .el-icon {
        color: #333;
        &:hover {
            color: #333;
        }
    }
}

</style>
