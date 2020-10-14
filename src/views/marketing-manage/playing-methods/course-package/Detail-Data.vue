<template>
    <div :class="$style.detailData">
        <div :class="$style.dataPreview" class="border-bottom">
            <div :class="$style.previewItem">
                <div :class="$style.type">
                    购买人数
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.number" />
                    <span class="gray-2">人</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    总营业额
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.amount/100 || 0" />
                    <span class="gray-2">元</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    剩余库存
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.overStock" />
                    <span class="gray-2">组</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    发放礼品数
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.giftCount" />
                    <span class="gray-2">个</span>
                </div>
            </div>
        </div>

        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input clearable style="width: 280px;" v-model="form.condition" @change="search" placeholder="请输入参与人/联系方式" />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        label="全部订单"
                        value=""
                    />
                    <el-option
                        label="待发货"
                        value="WAIT_SHIP"
                    />
                    <el-option
                        label="待收货"
                        value="WAIT_RECEIVE"
                    />
                    <el-option
                        label="待付款"
                        value="WAIT_PAY"
                    />
                    <el-option
                        label="订单完成"
                        value="FINISHED"
                    />
                    <el-option
                        label="订单关闭"
                        value="CLOSED"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button round type="primary" @click="search">
                    查询
                </el-button>
                <el-button
                    round
                    type="primary"
                    @click="dialogVerificationVisible = true"
                    plain
                >
                    去核销
                </el-button>
                <el-button
                    v-if="total"
                    round
                    type="primary"
                    plain
                    @click="changeExport"
                >
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>

        <el-table
            ref="orderTable"
            :data="list"
            stripe
        >
            <el-table-column label="参与人" prop="userName" width="150" />
            <el-table-column label="联系方式" prop="mobile" width="150" />
            <el-table-column label="订单编号" width="120">
                <template #default="{ row }">
                    <el-button
                        type="text"
                        style="padding: 0"
                        class="expanded-btn"
                        :class="{ expanded: row.expanded }"
                        @click="expendOrder(row)"
                    >
                        查看订单
                        <i class="el-icon-arrow-right" />
                    </el-button>
                </template>
            </el-table-column>
            <!-- 订单子表 -->
            <el-table-column type="expand" width="0" class="order-expand">
                <template #default="scope">
                    <el-table
                        :ref="`orderItemTable_${scope.$index}`"
                        class="child-table"
                        :show-header="false"
                        :data="scope.row.orderModels"
                        stripe
                    >
                        <el-table-column width="168" prop="orderId" />
                        <el-table-column width="130">
                            <template #default="{ row }">
                                <el-popover
                                    placement="right"
                                    width="500"
                                    trigger="click"
                                    :key="2"
                                >
                                    <el-table
                                        :data="[row]"
                                    >
                                        <el-table-column property="goodsName" label="商品名称" />
                                        <el-table-column property="count" label="商品数量" />
                                        <el-table-column label="商品规格">
                                            <template #default="{ row_ }">
                                                {{ row_.sku }}<span v-if="row_.subSku">,</span>{{ row_.subSku }}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-button slot="reference" type="text">
                                        查看商品
                                    </el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column width="120">
                            <template #default="{ row }">
                                {{ row.amount ? row.amount/100 : 0 }}
                            </template>
                        </el-table-column>
                        <el-table-column width="140" prop="payTime" />
                        <el-table-column
                            label="状态"
                            width="100"
                        >
                            <template #default="{ row }">
                                <template
                                    v-if="row.orderStatus === 'WAIT_RECEIVE' &&
                                        (row.orderType === 'VIRTUAL_GOODS' || row.orderType === 'FORMAL_CLASS' || row.orderType === 'EXPERIENCE_CLASS')
                                    "
                                >
                                    待使用
                                </template>
                                <template v-else>
                                    {{ orderStatusText[row.orderStatus] }}
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column width="140" />
                        <el-table-column>
                            <template #default="{ row: orderItem }">
                                <el-button
                                    @click="$router.push({
                                        name: ['SERIES_OF_COURSE','KNOWLEDGE_COURSE' ].indexOf(orderItem.orderType) !== -1? 'OnlineSchoolOrderDetail' : 'OrderDetail',
                                        params: { id: orderItem.orderId }
                                    })"
                                >
                                    订单详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="活动商品" prop="goodsName" width="130" />
            <el-table-column label="实付款(元)" width="120">
                <template #default="{row}">
                    {{ row.amount? row.amount/100: '' }}
                </template>
            </el-table-column>
            <el-table-column label="购买时间" width="140" />
            <el-table-column
                label="状态"
                width="100"
            >
                <template #default="{ row }">
                    <template
                        v-if="row.orderStatus === 'WAIT_RECEIVE' &&
                            (row.orderType === 'VIRTUAL_GOODS' || row.orderType === 'FORMAL_CLASS' || row.orderType === 'EXPERIENCE_CLASS')
                        "
                    >
                        待使用
                    </template>
                    <template v-else>
                        {{ orderStatusText[row.orderStatus] }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="发放礼品" width="140">
                <template #default="{ row }">
                    <el-popover
                        placement="right"
                        width="400"
                        trigger="click"
                        :key="1"
                        v-if="row.giftUserRList && row.giftUserRList.length"
                    >
                        <el-table
                            :data="row.giftUserRList"
                            empty-text="无礼品"
                        >
                            <el-table-column property="giftName" label="礼品名称" />
                            <el-table-column property="statusText" label="礼品状态" />
                        </el-table>
                        <el-button slot="reference" type="text">
                            查看礼品
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column align="right" header-align="right" label="操作" />
        </el-table>
        <Pagination
            v-model="queryPage.current"
            :size="queryPage.size"
            :total="total"
            @change="getList"
        />

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" label-width="100px" label-position="left">
                <el-form-item label="搜索关键词" prop="condition">
                    <el-input
                        v-model.trim="exportData.condition"
                        placeholder="输入关键字"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select
                        v-model="exportData.orderStatus"
                        placeholder="请选择"
                        @change="search"
                        style="width: 128px;"
                    >
                        <el-option
                            label="全部订单"
                            value=""
                        />
                        <el-option
                            label="待发货"
                            value="WAIT_SHIP"
                        />
                        <el-option
                            label="待收货"
                            value="WAIT_RECEIVE"
                        />
                        <el-option
                            label="待付款"
                            value="WAIT_PAY"
                        />
                        <el-option
                            label="订单完成"
                            value="FINISHED"
                        />
                        <el-option
                            label="订单关闭"
                            value="CLOSED"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </ExportDialog>

        <verification :dialog-verification-visible.sync="dialogVerificationVisible" />
    </div>
</template>

<script>
import moment from 'moment/moment'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import verification from '../../../../components/order-center/Verification.vue'
import { createObjectUrl } from '../../../../assets/ts/upload'
import {
    getSpringPloughingStatistics,
    exportSpringData
} from '../../../../apis/marketing-manage/new-year/spring-ploughing'
import { courseActivityDataList } from '../../../../apis/order'
export default {
    name: 'CoursePackageDetailData',
    components: {
        verification,
        ExportDialog
    },
    data () {
        return {
            showExport: false,
            exportData: {
                condition: '',
                orderStatus: '',
                activityId: ''
            },
            people: '',
            status: '',
            list: [],
            queryPage: {
                current: 1,
                size: 10
            },
            form: {
                condition: '',
                orderStatus: '',
                activityId: ''
            },
            total: 0,
            dialogVerificationVisible: false,
            statistics: {},
            orderStatusText: {
                ALL_ORDER: '全部订单',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                WAIT_PAY_TAIL_MONEY: '待付尾款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            }
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async activated () {
        this.queryPage = {
            current: 1,
            size: 10
        }
        this.form = {
            condition: '',
            orderStatus: '',
            activityId: this.id || ''
        }
        try {
            await Promise.all([
                this.getStatistics(),
                this.getList()
            ])
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getList (page) {
            this.queryPage.current = page || this.queryPage.current
            try {
                const { result } = await courseActivityDataList({ ...this.queryPage, ...this.form })
                for (const order of result.records) {
                    order.expanded = false
                    for (const pro of order.orderModels) {
                        pro.expanded = false
                    }
                }
                this.list = result.records || []
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        async search () {
            try {
                await this.getList(1)
                await this.getStatistics()
            } catch (e) {
                throw e
            }
        },
        async getStatistics () {
            try {
                const data = await getSpringPloughingStatistics(this.id)
                this.statistics = data.result
            } catch (e) {
                throw e
            }
        },
        expendOrder (row) {
            row.expanded = !row.expanded
            this.$refs.orderTable.toggleRowExpansion(row, row.expanded)
            // 订单子表关闭后，也关闭商品子表
            if (!row.expanded) {
                row.orderModels.forEach(item => {
                    item.expanded = false
                })
            }
        },
        expendProduct (orderIndex, row) {
            row.expanded = !row.expanded
            this.$refs[`orderItemTable_${ orderIndex }`].toggleRowExpansion(row, row.expanded)
        },
        changeExport () {
            this.exportData = {
                ...this.form
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                condition: '',
                orderStatus: '',
                activityId: ''
            }
            this.showExport = false
        },
        async exportList () {
            const {
                activityId,
                orderStatus,
                condition
            } = this.exportData
            try {
                const data = await exportSpringData({
                    searchContent: condition,
                    orderStatus,
                    activityId
                })
                const a = document.createElement('a')
                a.href = createObjectUrl(data)
                a.download = `组合聚惠学-${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
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

<style module lang="scss">

.data-preview {
    display: flex;
    align-items: center;
    height: 142px;
    padding: 0 24px;
}
.preview-item {
    height: 94px;
    padding: 9px 50px;
    border-right: 1px solid #e7e7e7;
    &:nth-last-of-type(1) {
        border-right: none;
    }
    .type {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
    }
    .value {
        margin-right: 14px;
        font-size: 28px;
    }
}

</style>
<style scoped lang="scss">
.child-table {
    margin-left: 250px;
    &:before {
        display: none;
    }
    ::v-deep .el-table__row:nth-last-of-type(1) {
        td {
            border: none !important;
        }
    }
}
/*.child-product-table {
    &:before {
      display: none;
    }
    margin-left: 410px;
    ::v-deep .el-table__row:nth-last-of-type(1) {
      td {
        border: none !important;
      }
    }
  }*/
::v-deep .el-table__expand-column {
    .el-table__expand-icon {
        display: none;
    }
}
.el-icon-arrow-right {
    transition: all .2s ease-in-out;
    transform: rotate(0);
}
.expanded-btn.expanded {
    .el-icon-arrow-right {
        transform: rotate(90deg);
    }
}

</style>
