<template>
    <div class="invoice wrap">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model.trim="form.keywords"
                    placeholder="输入发票单编号/收票人电话/收票人姓名"
                    style="width: 350px;"
                    clearable
                    @change="getList"
                />
            </el-form-item>
            <el-form-item label="发票状态：">
                <el-select v-model="form.status" @change="statusChange">
                    <el-option v-for="(item,index) in invoiceStatus" :label="orderStatusText[item]" :value="item" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="申请时间：">
                <date-range
                    :clearable="true"
                    disable-after
                    @change="dateChange"
                    size="small"
                    start-label="申请时间："
                    range-separator="至"
                    end-label=""
                    ref="reqDate"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="search"
                    round
                >
                    查询
                </el-button>
                <el-button
                    type="primary"
                    @click="$router.push({ name:'ApplyInvoice' })"
                    round
                >
                    申请发票
                </el-button>
                <el-button
                    type="primary"
                    plain
                    round
                    @click="changeExport"
                    v-if="table && table.length"
                >
                    导出发票单
                </el-button>
                <el-button type="text" @click="clear">
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>
        <div class="invoice-content">
            <div
                class="flex-align mt-24"
                v-if="selectionShow"
            >
                <div class="mr-10">
                    已选择{{ multipleSelection.length }}条
                </div>
                <el-button
                    v-if="form.status === 0"
                    :disabled="!multipleSelection.length"
                    @click="batchCancelInvoiceStatus()"
                >
                    批量取消
                </el-button>
                <el-button
                    v-if="form.status === 1"
                    :disabled="!multipleSelection.length"
                    @click="batchInvalidInvoiceStatus()"
                >
                    批量作废
                </el-button>
                <el-button
                    v-if="form.status === 2 || form.status === 3"
                    size="mini"
                    :disabled="!multipleSelection.length"
                    @click="batchDeleteInvoiceStatus()"
                >
                    批量删除
                </el-button>
            </div>
            <el-table
                @selection-change="handleSelectionChange"
                class="content-table"
                :data="table"
                :row-class-name="getRowClass"
                ref="table"
            >
                <span
                    slot="empty"
                    class="empty"
                >
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />暂无发票申请信息
                </span>
                <el-table-column
                    v-if="selectionShow"
                    type="selection"
                    align="right"
                    width="55"
                />
                <el-table-column
                    prop="id"
                    label="发票单编号"
                    width="180"
                    :header-align="selectionShow ? 'center' : 'left'"
                    :align="selectionShow ? 'center' : 'left'"
                />
                <el-table-column
                    width="1"
                    style="opacity: 0; display: none;"
                    type="expand"
                >
                    <template slot-scope="{ row }">
                        <el-table
                            :show-header="false"
                            :data="row.orderInfos"
                            :cell-style="{ border: 'none' }"
                        >
                            <el-table-column width="180" />
                            <el-table-column width="180" prop="orderId" />
                            <el-table-column width="480" />
                            <el-table-column width="120" prop="amount" />
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单编号"
                    width="200"
                >
                    <template slot-scope="{ row }">
                        <span :class="{'more': row.orderInfos.length>1}">
                            <span
                                v-if="row.orderInfos.length === 1"
                                v-text="row.orderInfos[0].orderId"
                            />
                            <span v-else>
                                <span style="color: #666">
                                    {{ `订单编号(${row.orderInfos.length})条` }}
                                </span>
                                <pl-svg
                                    :style="{ cursor: 'pointer', transition: 'transform .2s linear', transform: row.expanded ? 'rotate(-180deg)' : 'rotate(0)'}"
                                    name="icon-sanjiao"
                                    width="12"
                                    @click="toggleRowExpansion(row)"
                                />
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="发票类型"
                    width="80"
                >
                    <template #default="{ row }">
                        {{ invoiceTypeText[row.invoiceType] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="invoiceTitle"
                    label="发票抬头"
                    width="220"
                />
                <el-table-column
                    prop="taxpayerNumber"
                    label="纳税人识别号"
                    width="160"
                />
                <el-table-column
                    label="开票金额（元）"
                    width="120"
                >
                    <template slot-scope="{ row }">
                        <div>
                            {{ row.amount/100 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="invoiceTitle"
                    label="收票人"
                >
                    <template #default="{ row }">
                        <span v-if="row.mailingMethod === '0'">
                            {{ row.recvName }}
                        </span>
                        <span v-if="row.mailingMethod === '1' && row.orderInfos[0]">
                            {{ row.orderInfos[0].userName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="收票人电话"
                    width="120"
                >
                    <template #default="{ row }">
                        <span v-if="row.mailingMethod === '0'">
                            {{ row.recvMobile }}
                        </span>
                        <span v-if="row.mailingMethod === '1' && row.orderInfos[0]">
                            {{ row.orderInfos[0].mobile }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="收票方式"
                    width="100"
                >
                    <template #default="{ row }">
                        {{ row.mailingMethod === '1'?'门店自提':'邮寄' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="100"
                >
                    <template #default="{ row }">
                        {{ orderStatusText[row.status] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="申请时间"
                    width="160"
                />
                <el-table-column
                    label="操作"
                    align="right"
                    header-align="right"
                    fixed="right"
                    width="100"
                >
                    <template slot-scope="{ row }">
                        <Operating>
                            <template slot="button-box">
                                <a
                                    v-if="row.status === 1"
                                    @click="confirmModifyInvoiceStatus(row.id,'modify')"
                                >
                                    修改
                                </a>
                                <a
                                    v-if="row.status === 0"
                                    @click="confirmModifyInvoiceStatus(row.id,'confirm')"
                                >
                                    确认开票
                                </a>
                                <a
                                    v-if="row.status === 0"
                                    @click="cancelInvoiceStatus(row.id)"
                                >
                                    取消申请
                                </a>
                                <a
                                    v-if="row.status === 0"
                                    @click="$router.push({ name: 'EditInvoice', query: { id: row.id, userId: row.userId } })"
                                >
                                    修改信息
                                </a>
                                <a
                                    v-if="row.status === 2 || row.status === 3"
                                    @click="deleteInvoiceStatus(row.id)"
                                >
                                    删除
                                </a>
                                <a
                                    v-if="row.status === 1"
                                    @click="invalidInvoiceStatus(row.id)"
                                >
                                    作废
                                </a>
                                <a
                                    @click="rowDetail(row)"
                                >
                                    查看
                                </a>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                @change="getList"
                @sizechange="sizeChange"
                v-model="form.current"
                :total="total"
                :sizes="true"
            />
        </div>
        <InvoiceDetails
            :show.sync="InvoiceDetailsVisible"
            :id="id"
        />
        <el-dialog
            width="30%"
            :title="dialogTitle"
            :visible.sync="dialogFormVisible"
        >
            <el-form
                label-width="70px"
                style="width: 376px;height: 47px"
            >
                <el-form-item
                    class="mb-0"
                    label="发票编号"
                >
                    <el-input
                        v-model="invoiceConfirmNo"
                        autocomplete="off"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
            >
                <el-button @click="dialogInvoiceCancel()">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="dialogInvoiceConfirm()"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 导出 -->
        <ExportDialog title="导出发票" :show.sync="showExport" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item label="搜索内容" prop="keywords">
                    <el-input
                        v-model.trim="exportData.keywords"
                        placeholder="输入发票单编号/收票人电话/收票人姓名"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="status" label="发票状态">
                    <el-select v-model="exportData.status">
                        <el-option v-for="(item,index) in invoiceStatus" :label="orderStatusText[item]" :value="item" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间" prop="startTime">
                    <el-radio-group @change="exportRangeChange" v-model="exportData.dateRange">
                        <el-radio :label="1">
                            7日内
                        </el-radio>
                        <el-radio :label="2">
                            30日内
                        </el-radio>
                        <el-radio :label="3">
                            自选时间
                        </el-radio>
                    </el-radio-group>
                    <date-range
                        v-if="showExport"
                        style="margin-top: 20px"
                        size="small"
                        ref="exportDatePicker"
                        :disabled-start-time="exportData.dateRange !== 3"
                        :disabled-end-time="exportData.dateRange !== 3"
                        disable-after
                        :init="exportData.startTime ? [exportData.startTime,exportData.endTime] : []"
                        :clearable="true"
                        @change="exportDatechange"
                        range-separator="至"
                        end-label=""
                    />
                </el-form-item>
            </el-form>
        </ExportDialog>
    </div>
</template>
<script>
import Pagination from '../../../../components/common/Pagination.vue'
import InvoiceDetails from '../../../../components/order-center/Invoice-Details.vue'
import {
    getInvoiceList,
    confirmModifyInvoiceStatus,
    cancelInvoiceStatus,
    deleteInvoiceStatus,
    invalidInvoiceStatus,
    exportInvoiceQuery,
    confirmInvoice
} from '../../../../apis/order'
import { createObjectUrl } from '../../../../assets/ts/upload'
import moment from 'moment'
import ExportDialog from '../../../../components/common/Export-Dialog'

export default {
    name: 'InvoiceList',
    components: {
        Pagination,
        InvoiceDetails,
        ExportDialog
    },
    data () {
        return {
            showExport: false,
            exportData: {
                status: '',
                keywords: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3,
                startTime: '',
                endTime: ''
            },
            exportRules: {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            },
            selectionShow: false,
            invoiceTypeText: {
                0: '个人发票',
                1: '企业增值税普票',
                2: '企业增值税专票'
            },
            orderStatusText: {
                '': '全部发票',
                0: '待开票',
                1: '已开票',
                2: '已取消',
                3: '已作废'
            },
            // 发票查询数据字典
            invoiceStatus: {
                AllInvoice: '',
                // 待开票
                WaitInvoice: 0,
                // 已开票
                AlreadyInvoice: 1,
                // 取消
                CancelInvoice: 2,
                InvalidInvoice: 3
            },
            activeName: '2',
            table: [],
            keywords: '',
            dialogTitle: '',
            dialogFormVisible: false,
            form: {
                keywords: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            total: 0,
            multipleSelection: [],
            invoiceConfirmNo: '',
            invoiceConfirmId: '',
            // 发票详情id
            id: '',
            InvoiceDetailsVisible: false
        }
    },
    async created () {
        await this.getList()
    },
    methods: {
        statusChange (val) {
            this.selectionShow = val !== ''
            this.form.current = 1
            this.form.size = 10
            this.getList()
        },
        // 展开更多商品
        toggleRowExpansion (row) {
            row.expanded = !row.expanded
            this.$refs.table.toggleRowExpansion(row, row.expanded)
        },
        async search () {
            this.form.current = 1
            await this.getList()
        },
        async clear () {
            this.form = {
                keywords: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            }
            this.$refs.reqDate.clear()
            await this.getList()
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        getRowClass (row) {
            const res = []
            if (row.row.orderInfos && row.row.orderInfos.length < 2) {
                res.push('row-expand-cover')
            }
            return res.join(' ')
        },
        sizeChange (val) {
            this.form.current = 1
            this.form.size = val
            this.getList()
        },
        async getList () {
            try {
                const { result } = await getInvoiceList(this.form)
                this.table = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        rowDetail (row) {
            this.id = row.id
            this.InvoiceDetailsVisible = true
        },
        async confirmModifyInvoiceStatus (id, status) {
            if (status === 'modify') {
                this.dialogTitle = '修改票号'
            }
            if (status === 'confirm') {
                this.dialogTitle = '确认票号'
                const { result } = await confirmInvoice(id)
                if (result) {
                    await this.$confirm('该开票申请含有未核销订单，是否开票？')
                }
            }
            this.dialogFormVisible = true
            this.invoiceConfirmId = id
        },
        dialogInvoiceCancel () {
            this.invoiceConfirmNo = ''
            this.invoiceConfirmId = ''
            this.dialogFormVisible = false
        },
        async dialogInvoiceConfirm () {
            if (!this.invoiceConfirmNo) {
                this.$warning('发票编号不能为空')
                return
            }
            const data = {
                id: this.invoiceConfirmId,
                invoiceNumber: this.invoiceConfirmNo
            }
            try {
                await confirmModifyInvoiceStatus(data)
                this.$success('操作成功')
                this.dialogFormVisible = false
                this.invoiceConfirmId = ''
                this.invoiceConfirmNo = ''
                this.search()
            } catch (e) {
                throw e
            }
        },
        async cancelInvoiceStatus (id) {
            await this.$confirm({
                title: '取消申请',
                message: '确认取消发票申请，取消后将不可恢复?'
            })
            try {
                await cancelInvoiceStatus([id])
                this.$success('操作成功')
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async batchCancelInvoiceStatus () {
            if (!this.multipleSelection.length) {
                this.$warning('请选择取消项目')
                return
            }
            await this.$confirm({
                title: '批量取消',
                message: '确认批量取消选中发票申请，取消后将不可恢复?'
            })
            const arrayCancel = []
            for (const item of this.multipleSelection) {
                arrayCancel.push(item.id)
            }
            try {
                await cancelInvoiceStatus(arrayCancel)
                this.$success('操作成功')
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async deleteInvoiceStatus (id) {
            await this.$confirm({
                title: '确认删除',
                message: '确认删除该发票，删除后将不可恢复?'
            })
            try {
                await deleteInvoiceStatus([id])
                await this.$success('操作成功')
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async batchDeleteInvoiceStatus () {
            if (!this.multipleSelection.length) {
                this.$warning('请选择删除项目')
                return
            }
            await this.$confirm({
                title: '批量删除',
                message: '确认批量删除选中发票，删除后将不可恢复?'
            })
            const arrayDelete = []
            for (const item of this.multipleSelection) {
                arrayDelete.push(item.id)
            }
            try {
                await deleteInvoiceStatus(arrayDelete)
                await this.$success('操作成功')
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async invalidInvoiceStatus (id) {
            await this.$confirm({
                title: '确认作废',
                message: '确认作废该发票，作废后将不可恢复?'
            })
            try {
                await invalidInvoiceStatus([id])
                await this.$success('操作成功')
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async batchInvalidInvoiceStatus () {
            if (!this.multipleSelection.length) {
                this.$warning('请选择作废项目')
                return
            }
            await this.$confirm({
                title: '批量作废',
                message: '确认批量作废选中发票，作废后将不可恢复?'
            })
            const arrayDelete = []
            for (const item of this.multipleSelection) {
                arrayDelete.push(item.id)
            }
            try {
                await invalidInvoiceStatus(arrayDelete)
                await this.$success('操作成功')
                await this.search()
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            this.form.current = 1
            this.getList()
        },
        changeExport () {
            const obj = {
                status: '',
                keywords: '',
                startTime: '',
                endTime: ''
            }
            obj.status = this.form.status
            obj.keywords = this.form.keywords
            obj.startTime = this.form.startTime
            obj.endTime = this.form.endTime
            this.exportData = {
                ...this.exportData,
                ...obj
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                status: '',
                keywords: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3,
                startTime: '',
                endTime: ''
            }
            this.$refs.exportForm.clearValidate()
            this.showExport = false
        },
        async exportDatechange ({ start, end }) {
            this.exportData.startTime = start
            this.exportData.endTime = end
            if (!start || !end) {
                return
            }
            await this.$nextTick()
            this.$refs.exportDatePicker.initDate()
        },
        exportRangeChange (val) {
            let start = new Date()
            let end = new Date()
            const formatType = 'YYYY-MM-DD'

            if (val === 1) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            } else if (val === 2) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            } else {
                start = this.form.startTime || ''
                end = this.form.endTime || ''
            }

            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        },
        async exportList () {
            await this.$refs.exportForm.validate()
            const data = {
                status: this.exportData.status,
                keywords: this.exportData.keywords,
                startTime: this.exportData.startTime,
                endTime: this.exportData.endTime
            }
            try {
                const blob = await exportInvoiceQuery(data)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `发票-${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
                this.exportClose()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .flex-align {
        display: flex;
        align-items: center;
    }
    .invoice{
        min-height: calc(100vh - 120px);
        padding-bottom: 30px;
        background-color: #ffffff;
        .right-btn {
            position: absolute;
            right: 40px;
        }

        .ml-40 {
            margin-left: 40px;
        }

        .empty{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 12px;
                margin-right: 8px;
            }
        }

        ::v-deep .content-table {
            .el-table-column--selection > .cell {
                padding-left: 10px;
            }

            .el-table__expand-column {
                .cell {
                    display: none;
                }
            }

            .el-table__expanded-cell {
                padding: 0;

                .table-expand {
                    display: flex;
                    flex-direction: column;
                    padding-left: 244px;

                    .el-form-item {
                        margin: 12px 0;
                    }
                }
            }
        }

        .more {
            display: flex;
            flex-direction: column;
            >div {
                display: flex;
                flex-direction: row;
                padding: 10px 0 10px 200px;
                font-size: 12px;
                color: #222222;
            }
        }
    }
</style>
