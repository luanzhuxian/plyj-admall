<template>
    <div :class="$style.detailData">
        <div :class="$style.dataPreview" class="border-bottom">
            <div :class="$style.previewItem">
                <div :class="$style.type">
                    访问数
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.viewNo || 0" />
                    <span class="gray-2">人</span>
                </div>
            </div>
            <div :class="$style.previewItem">
                <div :class="$style.type">
                    参与活动人数
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.orderNo || 0" />
                    <span class="gray-2">人</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    总营业额
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.orderAmount || 0" />
                    <span class="gray-2">元</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    捐赠公益总额
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.donationAmount || 0" />
                    <span class="gray-2">元</span>
                </div>
            </div>
        </div>

        <search-box class="mt-24" label-width="85px">
            <el-form-item label="搜索内容：">
                <el-input placeholder="搜索订单编号/商品名称/购买人" clearable v-model="form.keywords" @change="search" />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    @change="search"
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
            <div />
            <el-form-item>
                <el-button round type="primary" @click="getList">
                    查询
                </el-button>
                <el-button round plain type="primary" @click="dialogVerificationVisible = true">
                    去核销
                </el-button>
                <el-button round plain type="primary" v-if="total" @click="changeExport">
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="list">
            <el-table-column label="订单编号" prop="orderId" />
            <el-table-column label="商品名称" prop="goodsName" />
            <el-table-column label="商品类型" prop="productTypeDesc">
                <template #default="{ row }">
                    {{ orderTypes[row.orderType] }}
                </template>
            </el-table-column>
            <el-table-column label="购买人" prop="consigneeName" />
            <el-table-column label="联系方式" prop="consigneeMobile" />
            <el-table-column
                label="实付款"
            >
                <template #default="{ row }">
                    <span v-if="row.orderStatus !== 'WAIT_PAY' && row.orderStatus !== 'CLOSED'">
                        {{ row.orderAmount/100 }}
                    </span>
                    <span v-else>0</span>
                </template>
            </el-table-column>
            <el-table-column label="捐赠公益金（元）" prop="donationAmount">
                <template #default="{ row }">
                    {{ (row.donationAmount || 0) / 100 }}
                </template>
            </el-table-column>
            <el-table-column
                label="下单时间"
            >
                <template #default="{ row }">
                    <span>
                        {{ row.createTime }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="购买时间"
            >
                <template #default="{ row }">
                    <span v-if="row.payTransInfoModels && row.payTransInfoModels.length">
                        {{ row.payTransInfoModels[row.payTransInfoModels.length -1].callbackTime }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
            >
                <template #default="{ row }">
                    {{ row.orderStatus === 'WAIT_RECEIVE' && (row.orderType === 'VIRTUAL_GOODS' || row.orderType === 'FORMAL_CLASS' || row.orderType === 'EXPERIENCE_CLASS') ? '待使用' : orderStatusText[row.orderStatus] }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="right" header-align="right">
                <template #default="{ row }">
                    <el-button
                        type="text"
                        size="mini"
                        @click="target(row)"
                    >
                        订单详情
                    </el-button>
                </template>
            </el-table-column>
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
                <el-form-item label="搜索关键词" prop="keywords">
                    <el-input
                        v-model.trim="exportData.keywords"
                        placeholder="搜索订单编号/商品名称/购买人"
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
import moment from 'moment'
import ExportDialog from '../../../../../components/common/Export-Dialog.vue'
import {
    getPublicBenefitStatistics as getStatistics,
    exportPublicBenefit
} from './../../../../../apis/marketing-manage/lonmen-festival/public-benefit'
import { activityDataList } from '../../../../../apis/order'
import { createObjectUrl } from '../../../../../assets/ts/upload'
import verification from '../../../../../components/order-center/Verification.vue'
export default {
    components: {
        verification,
        ExportDialog
    },
    name: 'LongmenPublicBenefitData',
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showExport: false,
            exportData: {
                keywords: '',
                businessId: '',
                orderStatus: ''
            },
            queryPage: {
                current: 1,
                size: 10
            },
            form: {
                keywords: '',
                businessId: '',
                orderStatus: ''
            },
            total: 0,
            list: [],
            statistics: {},
            orderStatusText: {
                ALL_ORDER: '全部订单',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                WAIT_PAY_TAIL_MONEY: '待付尾款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            },
            orderTypes: {
                PHYSICAL_GOODS: '实体商品',
                VIRTUAL_GOODS: '虚拟商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课'
            },
            dialogVerificationVisible: false
        }
    },
    async created () {
        this.form.businessId = this.id
        try {
            await Promise.all([
                this.getStatistics(),
                this.getList()
            ])
        } catch (e) { throw e }
    },
    methods: {
        target (row) {
            this.$router.push({ name: 'GoodsOrderDetail', params: { id: row.orderId } })
            // if (row.type === 1) {
            //   this.$router.push({ name: 'OrderDetail', params: { id: row.orderId } })
            //   return
            // }
            // this.$router.push({ name: 'OnlineSchoolOrderDetail', params: { id: row.orderId } })
        },
        async search () {
            try {
                this.queryPage.current = 1
                await this.getList()
            } catch (e) { throw e }
        },
        async getList () {
            try {
                const { result } = await activityDataList(this.queryPage, this.form)
                this.list = result.records || []
                this.total = result.total
            } catch (e) { throw e }
        },
        async getStatistics () {
            try {
                const { result } = await getStatistics(this.id)
                this.statistics = result
            } catch (e) { throw e }
        },
        changeExport () {
            this.exportData = {
                ...this.form
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                keywords: '',
                businessId: '',
                orderStatus: ''
            }
            this.showExport = false
        },
        async exportList () {
            try {
                const result = await exportPublicBenefit(this.exportData)
                const url = createObjectUrl(result)
                const a = document.createElement('a')
                a.href = url
                a.download = `公益行动${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
                this.exportClose()
            } catch (e) { throw e }
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
