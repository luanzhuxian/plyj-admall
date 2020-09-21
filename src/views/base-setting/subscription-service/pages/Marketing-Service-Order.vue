<template>
    <div>
        <search-box
            label-width=""
        >
            <el-form-item>
                <el-input
                    v-model="query.searchContent"
                    placeholder="请输入订单编号/营销方案/套餐名"
                    clearable
                    style="width: 350px;"
                    @keyup.enter.native="search"
                />
            </el-form-item>
            <el-form-item
                class="mb-0"
            >
                <date-range
                    :clearable="true"
                    disable-after
                    @change="dateChange"
                    size="small"
                    start-label="支付时间："
                    range-separator="至"
                    end-label=""
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item class="mb-0 right-btn">
                <el-button
                    type="primary"
                    style="width: 98px;"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    type="primary"
                    plain
                    style="width: 98px;"
                    @click="clear"
                >
                    清空筛选条件
                </el-button>
                <el-button
                    type="primary"
                    plain
                    style="width: 98px;"
                    :disabled="!tableData || !tableData.length"
                    @click="exportOrders"
                >
                    导出订单
                </el-button>
            </el-form-item>
        </search-box>

        <el-table
            ref="table"
            :data="tableData"
        >
            <span
                slot="empty"
                class="empty"
            >
                <i
                    class="iconfont iconempty"
                    style="margin-right: 4px; color: #4C88D6;"
                />
                没有查到相关信息，请确认后重新查看！
            </span>
            <el-table-column
                prop="id"
                label="订单编号"
            />
            <el-table-column
                prop="programName"
                label="方案内容"
            />
            <el-table-column
                prop="amount"
                label="支付金额（元）"
            />
            <el-table-column prop="createTime" label="订单状态">
                <template #default="{ row }">
                    <span v-text="statusMap[row.payStatus]" />
                </template>
            </el-table-column>
            <el-table-column
                prop="payTime"
                label="支付时间"
            />
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
            >
                <template slot-scope="{ row }">
                    <el-popover
                        placement="bottom"
                        trigger="click"
                        :content="`支付流水号：${row.serialNo}`"
                    >
                        <el-button
                            type="text"

                            slot="reference"
                        >
                            查看
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-model="query.current"
            :total="total"
            :sizes="true"
            @sizeChange="sizeChange"
            @change="getList"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getMarketList, exportMarketOrder } from '../../../../apis/subscription-service'
import { createObjectUrl } from '../../../../assets/ts/upload'
import moment from 'moment'
@Component
export default class LiveServiceOrder extends Vue {
  query = {
      searchContent: '',
      payStartTime: '',
      payEndTime: '',
      current: 1,
      size: 10
  }

  tableData = []
    statusMap = {
        WAIT_PAY: '待支付',
        FINISHED: '已完成'
    }

    total = 0

    async created () {
        this.getList()
    }

    async getList () {
        try {
            const { data: { result } } = await getMarketList(this.query)
            this.tableData = result.records || []
            this.total = result.total
        } catch (error) {
            throw error
        }
    }

    async exportOrders () {
        const { ...rest } = this.query
        try {
            const blob = await exportMarketOrder(rest)
            const url = createObjectUrl(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `营销方案订单${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
            a.click()
        } catch (e) {
            throw e
        }
    }

    dateChange ({ start, end }) {
        this.query.payStartTime = start
        this.query.payEndTime = end
        this.search()
    }

    async sizeChange (val) {
        this.query.size = val
        this.search()
    }

    search () {
        this.query.current = 1
        this.getList()
    }

    clear () {
        this.query.current = 1
        this.query.searchContent = ''
        this.query.payStartTime = ''
        this.query.payEndTime = ''
        this.$refs['date-range'].clear()
        this.search()
    }
}
</script>

<style scoped>

</style>
