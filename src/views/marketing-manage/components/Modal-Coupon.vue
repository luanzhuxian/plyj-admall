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
                        v-model="inputVal"
                        clearable
                        prefix-icon="el-icon-search"
                        placeholder="请输入优惠券名称"
                        :maxlength="50"
                        @change="search"
                        style="width: 160px;"
                    />
                </el-form-item>
                <el-form-item v-if="!hideStatus">
                    <el-select
                        v-model="form.status"
                        clearable
                        @change="search"
                        style="width: 88px;"
                    >
                        <el-option label="全部" value="" />
                        <el-option label="已停止" :value="0" />
                        <el-option label="待开始" :value="2" />
                        <el-option label="已结束" :value="3" />
                        <el-option label="进行中" :value="4" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!hideDatePicker">
                    <el-date-picker
                        v-model="daterange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="onDatePickerChange"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item class="search-btn-group">
                    <el-button
                        type="primary"
                        @click="search"
                    >
                        查询
                    </el-button>
                    <el-button
                        v-if="!hideClearBtn"
                        type="primary"
                        @click="refresh"
                    >
                        清空
                    </el-button>
                    <el-button v-if="!hideManageBtn" @click="toCouponPage">
                        优惠券管理
                    </el-button>
                </el-form-item>
            </el-form>
            <!-- 优惠券 -->
            <el-table
                style="width: 100%; min-height: 336px;"
                ref="table"
                :data="list"
                :row-key="getRowKeys"
                reserve-selection
                @select="handleSelect"
                @select-all="handleSelectAll"
                @selection-change="onCheckboxChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    :reserve-selection="true"
                />
                <el-table-column property="couponName" label="优惠券名称" />
                <el-table-column label="优惠券金额" width="120">
                    <template slot-scope="{row}">
                        满{{ row.useLimitAmount }}减{{ row.amount }}
                    </template>
                </el-table-column>
                <el-table-column label="领取方式" width="80">
                    <template slot-scope="{row}">
                        {{ row.distributionMethod === 1 ? '活动发放' : '自行领取' }}
                    </template>
                </el-table-column>
                <el-table-column property="time" label="用券时间" width="280">
                    <template slot-scope="{row}">
                        {{ row.useStartTime }} - {{ row.useEndTime }}
                    </template>
                </el-table-column>
                <el-table-column property="receiveAmount" label="领用量" width="70" />
                <el-table-column property="usedAmount" label="使用量" width="70" />
                <el-table-column property="statusText" label="状态" width="70" />
            </el-table>
            <pagination
                :size="form.size"
                :total="total"
                v-model="form.current"
                @change="onPageChange"
            />
            <div class="btn-group">
                <el-button type="primary" style="width: 70px;" @click="confirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { getCouponList } from '../../../apis/marketing-manage/coupon'

export default {
    name: 'Modal',
    props: {
        show: Boolean,
        hideStatus: Boolean,
        hideDatePicker: Boolean,
        hideClearBtn: Boolean,
        hideManageBtn: Boolean,
        title: {
            type: String,
            default: ''
        },
        defaultSelected: {
            type: Array,
            default () {
                return []
            }
        },
        maxSelect: {
            type: Number,
            default: Number.MAX_VALUE
        },
        couponType: {
            type: String,
            default: ''
        },

        /**
     * 筛选优惠券的状态
     * 3 已结束
     * 4 进行中
     */
        status: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            // 默认选中
            originalSelected: [],
            form: {
                current: 1,
                size: 4,
                name: '',
                status: '',
                startTime: '',
                endTime: '',
                distributionMethod: 1,
                couponType: this.couponType
            },
            total: 0,
            inputVal: '',
            list: [],
            daterange: [],
            checkbox: [],
            getRowKeys (row) {
                return row.id
            }
        }
    },
    computed: {
        selectedPresentNum () {
            if (!this.originalSelected.length) {
                return 0
            }
            const list = this.originalSelected.filter(item => item.giftType && item.giftType === 1)
            return list.length
        }
    },
    watch: {
        show (val) {
            if (val) {
                const originalSelected = JSON.parse(JSON.stringify(this.defaultSelected))
                this.originalSelected = originalSelected.map(item => {
                    item.id = item.couponId
                    item.couponName = item.giftName
                    return item
                })
            }
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
                    // 是否已被选中
                    const hasSelected = this.checkbox.some(row => row.id === item.id)
                    if (willSelected && !hasSelected) {
                        table.toggleRowSelection(item, true)
                    }
                }
            }
        },
        deleteOriginalSelected (id) {
            const currentIndex = this.originalSelected.findIndex(item => item.id === id)
            if (currentIndex !== -1) this.originalSelected.splice(currentIndex, 1)
        },
        async getData () {
            try {
                this.form.status = this.status
                const { result } = await getCouponList(this.form)
                this.list = result.records
                this.total = result.total
                await this.defaultSelect()
            } catch (e) {
                throw e
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
        onCheckboxChange (value) {
            this.checkbox = JSON.parse(JSON.stringify(value))
        },
        onPageChange (current) {
            this.form.current = current
            this.getData()
        },
        onDatePickerChange () {
            if (!this.daterange) {
                this.form.startTime = ''
                this.form.endTime = ''
            }
            if (this.daterange && this.daterange.length === 2) {
                this.form.startTime = this.daterange[0]
                this.form.endTime = this.daterange[1]
            }
            this.search()
        },
        search () {
            this.form.name = this.inputVal
            this.getData()
        },
        refresh () {
            this.clear()
            this.getData()
        },
        clear () {
            this.form.name = ''
            this.inputVal = ''
            this.form.status = ''
            this.form.current = 1
            this.total = 0
            this.checkbox = []
            this.list = []
            this.daterange = []
            this.$refs.table.clearSelection()
        },
        close () {
            this.clear()
            this.$emit('update:show', false)
        },
        toCouponPage () {
            this.close()
            this.$router.push({ name: 'ReductionCouponList' })
        },
        confirm () {
            const allSelect = JSON.parse(JSON.stringify(this.checkbox))
            for (const item of this.originalSelected) {
                const index = this.checkbox.findIndex(iItem => iItem.id === item.id)
                if (index === -1) {
                    allSelect.push(item)
                }
            }

            if (allSelect.length > this.maxSelect) {
                return this.$warning(`最多选择${ this.maxSelect }个礼品/优惠券`)
            }
            this.$emit('confirm', allSelect)
            this.close()
        }
    }
}
</script>

<style scoped lang="scss">
.modal {
    .search-btn-group {
        margin-left: auto;
    }

    .btn-group {
        padding: 28px 0 32px;
        text-align: center;
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
        min-width: 900px;
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
