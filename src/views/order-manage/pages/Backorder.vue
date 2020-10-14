<template>
    <div class="backorder wrap">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="form.keywords"
                    style="width: 380px"
                    placeholder="输入订单编号/售后单号/收货电话/收货人姓名/商品名称"
                    clearable
                    @change="getList"
                />
            </el-form-item>
            <el-form-item label="订单类型：">
                <el-select
                    v-model="form.orderType"
                    @change="goodsTypesChange()"
                >
                    <el-option
                        value=""
                        label="全部"
                    />
                    <el-option
                        value="PHYSICAL_GOODS"
                        label="实体订单"
                    />
                    <el-option
                        value="VIRTUAL_GOODS"
                        label="虚拟订单"
                    />
                    <el-option
                        value="FORMAL_CLASS"
                        label="正式课订单"
                    />
                    <el-option
                        value="EXPERIENCE_CLASS"
                        label="体验课订单"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="分类：">
                <SelectCategoryName v-model="selectedOptions" check-strictly show-all @change="categoryChange" />
            </el-form-item>
            <el-form-item label="申请时间：">
                <date-range
                    width="380px"
                    :clearable="true"
                    disable-after
                    size="small"
                    @change="dateChange"
                    start-label="申请时间："
                    range-separator="至"
                />
            </el-form-item>
            <el-form-item label="售后状态：">
                <el-select v-model="exportData.returnStatus" @change="orderStatusChange">
                    <el-option v-for="(item,index) in routeMap" :label="item" :value="index" :key="index" />
                </el-select>
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
                    @click="changeExport"
                    type="primary"
                    plain
                    round
                    v-if="table && table.length"
                >
                    导出售后单
                </el-button>
            </el-form-item>
        </search-box>
        <el-table
            :class="{'batch':(form.returnStatus === 'WAIT_CHECK'||form.returnStatus === 'REFUND_PRODUCT')}"
            @selection-change="handleSelectionChange"
            :data="table"
        >
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到该订单信息，请确认后重新查询！
            </span>
            <el-table-column
                label="售后单号"
                prop="id"
                width="180"
                header-align="left"
                align="left"
            />
            <el-table-column
                label="订单类型"
                width="80"
            >
                <template slot-scope="{ row }">
                    {{ orderTypeText[row.orderTypeCode] }}
                </template>
            </el-table-column>
            <el-table-column
                label="商品名称"
                prop="goodsName"
            />
            <el-table-column
                label="规格名称"
                width="120"
            >
                <template slot-scope="{ row }">
                    {{ row.subSkuName?`${row.skuName}，${row.subSkuName}`:row.skuName }}
                </template>
            </el-table-column>
            <el-table-column
                label="售后方式"
                width="120"
            >
                <template slot-scope="{ row }">
                    {{ AfterMethod[row.type] }}
                </template>
            </el-table-column>
            <el-table-column
                label="订单状态"
                width="120"
            >
                <template #default="{ row }">
                    {{ row.orderStatus === 'WAIT_RECEIVE' && (row.orderTypeCode === 'VIRTUAL_GOODS' || row.orderTypeCode === 'FORMAL_CLASS' || row.orderTypeCode === 'EXPERIENCE_CLASS') ? '待使用' : orderStatusText[row.orderStatus] }}
                </template>
            </el-table-column>
            <el-table-column
                label="退款金额（元）"
                prop="actualRefund"
                width="120"
            >
                <template slot-scope="{ row }">
                    {{ row.refundAmount/100 }}
                </template>
            </el-table-column>
            <el-table-column
                label="收货人"
                prop="consigneeName"
                width="100"
            />
            <el-table-column
                label="收货人电话"
                prop="consigneeMobile"
                width="120"
            />
            <el-table-column
                label="申请时间"
                prop="createTime"
                width="150"
            />
            <el-table-column
                label="售后状态"
                width="100"
            >
                <template #default="{ row }">
                    {{ row.status === 2 ? `${auditStatusText[row.status]} - ${businessStatusText[row.businessStatus] }`: auditStatusText[row.status] }}
                    <!-- 审核通过才会有业务状态  -->
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                v-if="row.status === 1"
                                @click="ordersListAgree(row)"
                            >
                                通过
                            </a>
                            <a
                                v-if="row.status === 1"
                                @click="ordersListTurnDown(row.id)"
                            >
                                驳回
                            </a>
                            <a
                                v-if="row.orderTypeCode === 'PHYSICAL_GOODS' && row.status === 2 && row.businessStatus < 3"
                                @click="confirmGoods(row.id)"
                            >
                                确认收货
                            </a>
                            <a
                                v-if="row.status === 2 && (row.businessStatus === 3 || row.businessStatus === 4)"
                                @click="ordersListSuperRefund(row.id)"
                            >
                                退款
                            </a>
                            <a
                                @click="$router.push({ name: 'BackorderDetail', params: { id: row.id } })"
                            >
                                查看
                            </a>
                        </template>
                    </Operating>

                    <el-popover
                        v-if="row.orderTypeCode === 'PHYSICAL_GOODS' && row.status === 2 && row.type === 1 && row.businessStatus <= 4 && (row.orderStatus === 'WAIT_RECEIVE' || row.orderStatus === 'FINISHED')"
                        placement="bottom"
                        trigger="click"
                        :content="`${row.logisticsCompany}：${row.serialNo}`"
                    >
                        <el-button
                            type="text"
                            style="width: 50px;"
                            slot="reference"
                        >
                            物流信息
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            @change="getList"
            @sizeChange="sizeChange"
            :total="total"
            :sizes="true"
            v-model="queryPage.current"
            style="margin-bottom: 70px;"
        />
        <BackorderTurndown
            :show.sync="TurndownVisible"
            :order-id="turndownConfirmId"
            @success="search()"
        />

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item prop="keywords" label="搜索关键词">
                    <el-input
                        v-model="exportData.keywords"
                        style="width: 369px"
                        placeholder="输入订单编号/售后单号/收货电话/收货人姓名/商品名称"
                        clearable
                    />
                </el-form-item>

                <el-form-item prop="orderType" label="订单类型">
                    <el-select
                        v-model="exportData.orderType"
                    >
                        <el-option
                            value=""
                            label="全部"
                        />
                        <el-option
                            value="PHYSICAL_GOODS"
                            label="实体订单"
                        />
                        <el-option
                            value="VIRTUAL_GOODS"
                            label="虚拟订单"
                        />
                        <el-option
                            value="FORMAL_CLASS"
                            label="正式课订单"
                        />
                        <el-option
                            value="EXPERIENCE_CLASS"
                            label="体验课订单"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item prop="selectedOptions" label="分类">
                    <SelectCategoryName check-strictly show-all v-model="exportData.selectedOptions" @change="exportCategoryChange" />
                </el-form-item>

                <el-form-item prop="orderStatus" label="售后状态">
                    <el-select v-model="exportData.returnStatus">
                        <el-option v-for="(item,index) in routeMap" :label="item" :value="index" :key="index" />
                    </el-select>
                </el-form-item>

                <el-form-item prop="startTime" label="申请时间">
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
import BackorderTurndown from '../../../components/order-center/Backorder-Turndown.vue'
import {
    getReturnOrdersList,
    returnOrdersListAgree,
    returnOrdersListSuperRefund,
    exportBackOrderQuery,
    returnOrdersListConfirmGoods
} from '../../../apis/order'
import { createObjectUrl } from '../../../assets/ts/upload'
import moment from 'moment'
import SelectCategoryName from '../../../components/product-center/category-manage/Select-Category-Name.vue'
import ExportDialog from '../../../components/common/Export-Dialog'

export default {
    name: 'Backorder',
    components: {
        BackorderTurndown,
        SelectCategoryName,
        ExportDialog
    },
    data () {
        return {
            selectedOptions: [''],
            showExport: false,
            exportData: {
                selectedOptions: [''],
                // 售后状态
                returnStatus: '',
                // 审核状态
                auditStatus: [],
                // 业务状态
                businessStatus: [],
                orderType: '',
                keywords: '',
                startTime: '',
                endTime: '',
                categoryName: '',
                subCategoryName: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3
            },
            exportRules: {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            },
            AfterMethod: {
                1: '退货退款',
                2: '仅退款'
            },
            queryPage: {
                current: 1,
                size: 10
            },
            form: {
                // 审核状态
                auditStatus: [],
                // 业务状态
                businessStatus: [],
                orderType: '',
                keywords: '',
                startTime: '',
                endTime: '',
                categoryName: '',
                subCategoryName: ''
            },
            auditStatusMap: {
                AllAfter: [],
                WaitReview: [1],
                WaitReturn: [2],
                Refunding: [2],
                AlreadyFinished: [2],
                AlreadyClosed: [0, 3]
            },
            businessStatusMap: {
                AllAfter: [],
                WaitReview: [],
                WaitReturn: [1, 2, 3],
                Refunding: [4, 5, 7],
                AlreadyFinished: [6],
                AlreadyClosed: []
            },
            auditStatusText: {
                0: '取消售后',
                1: '待审核',
                2: '审核通过',
                3: '审核驳回'
            },
            businessStatusText: {
                1: '待退货',
                2: '待收货',
                3: '退货完成',
                4: '待退款',
                5: '退款中',
                6: '退款成功',
                7: '退款失败'
            },
            routeMap: {
                AllAfter: '全部售后',
                WaitReview: '待审核',
                WaitReturn: '退换货',
                Refunding: '退款中',
                AlreadyFinished: '已完成',
                AlreadyClosed: '已关闭'
            },
            orderStatusText: {
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            },
            orderTypeText: {
                VIRTUAL_GOODS: '虚拟订单',
                PHYSICAL_GOODS: '实体订单',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课程',
                LIVE_GOODS: '直播订单',
                VIDEO_GOODS: '录播订单'
            },
            table: [],
            total: 0,
            multipleSelection: [],
            // 驳回
            turndownConfirmId: '',
            TurndownVisible: false
        }
    },
    async created () {
        try {
            this.exportData.returnStatus = 'AllAfter'
            await this.search()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async goodsTypesChange () {
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async categoryChange (value) {
            this.form.categoryName = value[0] || ''
            this.form.subCategoryName = value[1] || ''
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async search () {
            this.queryPage.current = 1
            await this.getList()
        },
        async sizeChange (val) {
            this.queryPage.current = 1
            this.queryPage.size = val
            await this.getList()
        },
        async getList () {
            try {
                const { result } = await getReturnOrdersList(this.queryPage, this.form)
                this.table = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        async dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            await this.getList()
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        ordersListTurnDown (id) {
            this.turndownConfirmId = id
            this.TurndownVisible = true
        },
        async ordersListSuperRefund (id) {
            await this.$confirm({
                title: '是否确认已收到退回货品且已检查货品完整，同意退款给用户？',
                confirmButtonText: '同意'
            })
            await returnOrdersListSuperRefund({ id })
            this.$success('操作成功')
            await this.search()
        },
        async ordersListAgree (row) {
            let warningText = ''
            let title = ''
            if (row.orderStatus === '') warningText = '提示：订单异常无货物状态及物流信息，请及时核实货物信息，以免造成财物损失！'
            if ((row.orderStatus === 'WAIT_RECEIVE' || row.orderStatus === 'FINISHED') && row.type === 2) {
                title = '是否同意该“仅退款”售后申请？'
                if (row.orderTypeCode === 'PHYSICAL_GOODS') warningText = '提示：该商品已发货，请及时核实货物信息，以免造成财物损失！'
                if (row.orderTypeCode !== 'PHYSICAL_GOODS') warningText = ''
            }
            if (row.orderStatus === 'WAIT_SHIP' && row.type === 2) title = '是否同意该“仅退款”售后申请？'
            if (row.type === 1) title = '确定同意该退款申请？同意后请及时核实货物退回信息。'
            await this.$confirm({
                title,
                message: warningText,
                confirmButtonText: '同意'
            })
            try {
                await returnOrdersListAgree({ id: row.id })
                this.$success('操作成功')
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async confirmGoods (id) {
            await this.$confirm('提示：请核实货物信息确认收货，以免造成财物损失！')
            await returnOrdersListConfirmGoods({ id })
            this.$success('操作成功')
            await this.search()
        },
        changeExport () {
            const obj = {
                keywords: '',
                orderType: '',
                startTime: '',
                endTime: '',
                categoryName: '',
                subCategoryName: ''
            }

            for (const key of Object.keys(obj)) {
                obj[key] = this.form[key]
            }

            this.exportData.selectedOptions = this.selectedOptions.slice()
            this.exportData.auditStatus = this.form.auditStatus.slice()
            this.exportData.businessStatus = this.form.businessStatus.slice()

            this.exportData = {
                ...this.exportData,
                ...obj
            }

            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                selectedOptions: [''],
                // 审核状态
                auditStatus: [],
                // 业务状态
                businessStatus: [],
                orderType: '',
                keywords: '',
                startTime: '',
                endTime: '',
                categoryName: '',
                subCategoryName: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3
            }
            this.$refs.exportForm.clearValidate()
            this.showExport = false
        },
        exportCategoryChange (val) {
            this.exportData.categoryName = val[0] || ''
            this.exportData.subCategoryName = val[1] || ''
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
        async orderStatusChange (val) {
            this.exportData.returnStatus = val
            this.form.businessStatus = this.businessStatusMap[val] || []
            this.form.auditStatus = this.auditStatusMap[val] || []
            await this.search()
        },
        async exportList () {
            await this.$refs.exportForm.validate()
            const form = this.exportData
            const data = {
                auditStatus: form.auditStatus,
                businessStatus: form.businessStatus,
                orderType: form.orderType,
                keywords: form.keywords,
                startTime: form.startTime,
                endTime: form.endTime,
                categoryName: form.categoryName,
                subCategoryName: form.subCategoryName
            }
            try {
                const blob = await exportBackOrderQuery(data)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${ this.routeMap[this.exportData.returnStatus] }${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                this.exportClose()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .backorder{
    min-height: calc(100vh - 110px);
    padding-bottom: 30px;
    background-color: #ffffff;
    .right-btn {
      position: absolute;
      right: 40px;
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

    ::v-deep .el-table {
      .cell {
        padding: 0 !important;
      }
    }
  }
</style>
