<template>
    <div :class="$style.detailData">
        <div :class="$style.dataPreview" class="border-bottom">
            <!--<div :class="$style.previewItem">
        <div :class="$style.type">
          访问数
        </div>
        <div>
          <i :class="$style.value">9000000</i>
          <span class="gray-2">次</span>
        </div>
      </div>-->
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
                    <i :class="$style.value" v-text="statistics.amount / 100 || 0" />
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

        <search-box class="mt-24" label-width="85px">
            <el-form-item label="搜索内容：">
                <el-input style="width: 280px;" v-model="filter.condition" @change="getList(1)" placeholder="输入关键字" />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="filter.orderStatus" @change="getList(1)">
                    <el-option :key="-1" value="" label="全部" />
                    <el-option
                        v-for="k of Object.keys(orderStatusMap)"
                        :key="k"
                        :value="k"
                        :label="orderStatusMap[k]"
                    />
                </el-select>
            </el-form-item>
            <div />
            <el-form-item>
                <el-button round type="primary" @click="getList(1)">
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
                    round
                    v-if="total"
                    type="primary"
                    plain
                    @click="changeExport"
                >
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>

        <el-table
            :data="list"
            ref="orderTable"
            stripe
        >
            <el-table-column
                label="参与人"
                prop="userName"
                width="150"
                align="left"
                header-align="left"
            />
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
                        :show-header="false"
                        :data="scope.row.orderModels"
                        class="child-table"
                        :ref="`orderItemTable_${scope.$index}`"
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
                                                {{ row.sku }}<span v-if="row.subSku">,</span>{{ row_.subSku }}
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
                        <el-table-column width="202" />
                        <el-table-column width="140" prop="payTime" />
                        <el-table-column width="140">
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
                                <el-button @click="$router.push({ name: 'OrderDetail', params: { id: orderItem.orderId } })">
                                    订单详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="活动商品" width="130" />
            <el-table-column label="实付款(元)" width="120">
                <template #default="{row}">
                    {{ row.amount? row.amount/100: '' }}
                </template>
            </el-table-column>
            <el-table-column label="组合名称" prop="combinationDetailName" width="200" />
            <el-table-column label="购买时间" width="140" />
            <el-table-column label="订单状态" width="140" />
            <el-table-column label="发放礼品" width="140">
                <template #default="{ row }">
                    <el-popover
                        placement="right"
                        width="400"
                        trigger="click"
                        :key="1"
                        v-if="row.giftUserRList.length"
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
            <el-table-column label="操作" />
        </el-table>
        <Pagination
            v-model="filter.current"
            :size="filter.size"
            :total="total"
            @change="getList"
        />
        <verification :dialog-verification-visible.sync="dialogVerificationVisible" />

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" label-width="100px" label-position="left">
                <el-form-item label="搜索关键词" prop="condition">
                    <el-input
                        v-model.trim="exportData.condition"
                        placeholder="搜索关键词"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="exportData.orderStatus">
                        <el-option :key="-1" value="" label="全部" />
                        <el-option
                            v-for="k of Object.keys(orderStatusMap)"
                            :key="k"
                            :value="k"
                            :label="orderStatusMap[k]"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </ExportDialog>
    </div>
</template>

<script>
import {
    getSpringPloughingStatistics,
    exportSpringData
} from '../../../../../apis/marketing-manage/new-year/spring-ploughing'
import { courseActivityDataList } from '../../../../../apis/order'
import { createObjectUrl } from '../../../../../assets/ts/upload'
import moment from 'moment/moment'
import verification from '../../../../../components/order-center/Verification.vue'
import ExportDialog from '../../../../../components/common/Export-Dialog.vue'
export default {
    components: {
        verification,
        ExportDialog
    },
    name: 'SpringPloughingDetailData',
    data () {
        return {
            showExport: false,
            exportData: {
                condition: '',
                orderStatus: ''
            },
            people: '',
            status: '',
            list: [],
            orderStatusMap: {
                WAIT_PAY: '待支付',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            },
            filter: {
                condition: '',
                orderStatus: '',
                activityId: '',
                current: 1,
                size: 10
            },
            statistics: {},
            total: 0,
            dialogVerificationVisible: false,
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
        this.filter.activityId = this.id
        try {
            await Promise.all([
                this.getStatistics(),
                this.getList()
            ])
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        this.filter = {
            condition: '',
            orderStatus: '',
            activityId: '',
            current: 1,
            size: 10
        }
    },
    methods: {
        async getList (page) {
            this.filter.current = page || this.filter.current
            try {
                const data = await courseActivityDataList(this.filter)
                for (const order of data.result.records) {
                    order.expanded = false
                    for (const pro of order.orderModels) {
                        pro.expanded = false
                    }
                }
                this.list = data.result.records || []
                this.total = data.result.total
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
                ...this.exportData,
                ...this.filter
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                condition: '',
                orderStatus: ''
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
                    operatorUserName: '',
                    activityId
                })
                const a = document.createElement('a')
                a.href = createObjectUrl(data)
                a.download = `春耘 ${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
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
