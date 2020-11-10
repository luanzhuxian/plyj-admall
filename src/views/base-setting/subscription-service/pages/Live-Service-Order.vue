<template>
    <div :class="$style.functionalContainer">
        <search-box>
            <el-form-item>
                <el-input style="width:200px"
                          clearable
                          v-model="form.keyword"
                          placeholder="请输入订单编号/方案套餐"
                          @change="search"
                />
            </el-form-item>
            <el-form-item label="开通方式">
                <el-select
                    :clearable="true"
                    v-model="form.openWay"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        label="全部"
                        value=""
                    />
                    <el-option
                        label="自购开通"
                        value="byBuy"
                    />
                    <el-option
                        label="卡密开通"
                        value="byCard"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="支付时间">
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
            <el-form-item>
                <el-button
                    type="primary"
                    @click="search"
                    round
                >
                    查询
                </el-button>
                <el-button
                    plain
                    type="primary"
                    :disabled="!tableData || !tableData.length"
                    @click="exportOrders"
                    round
                >
                    导出订单
                </el-button>
                <el-button
                    type="text"
                    @click="resetFilter"
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="tableData">
            <el-table-column prop="id" label="订单编号" />
            <el-table-column prop="name" label="方案套餐" />
            <el-table-column prop="name" width="200" label="方案内容">
                <template #default="{row}">
                    <!-- 流量加油包 -->
                    <div v-if="row.comboType === 2">
                        点播流量：{{ (row.flowSize / 1024).toFixed(2) }}G
                    </div>
                    <!-- 存储加油包 -->
                    <div v-else-if="row.comboType === 4">
                        <div>视频库存储空间：{{ (row.storageSize / 1024).toFixed(2) }}G</div>
                        <div>使用有效期：1年</div>
                    </div>
                    <!-- 直播观看时长包 -->
                    <template v-else-if="row.comboType === 7 || row.comboType === 3 || row.comboType === 1">
                        <div>直播观看时长：{{ row.totalMinute }}分钟</div>
                        <div v-if="row.flowSize || row.storageSize" :class="$style.functionalContent">
                            <div>赠送：</div>
                            <!--              <div v-if="row.storageSize">-->
                            <!--                视频空间：{{ (row.storageSize / 1024).toFixed(2) }}G-->
                            <!--              </div>-->
                            <div v-if="row.flowSize">
                                点播流量：{{ (row.flowSize / 1024).toFixed(2) }}G
                            </div>
                        </div>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="开通方式">
                <template #default="{ row }">
                    <span v-if="row.openWay === 'byBuy'">自购开通</span>
                    <span v-if="row.openWay === 'byCard'">卡密开通</span>
                </template>
            </el-table-column>
            <el-table-column label="支付金额(元)">
                <template #default="{ row }">
                    <span>{{ row.payPrice / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="订单状态">
                <template #default="{ row }">
                    <span v-text="statusMap[row.payStatus]" />
                </template>
            </el-table-column>
            <el-table-column prop="payTime" label="支付日期" />
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
            >
                <template slot-scope="{ row }" v-if="row.openWay === 'byBuy'">
                    <el-popover
                        placement="bottom"
                        trigger="click"
                        :content="`支付流水号：${row.serialNo}`"
                    >
                        <a style="color:#4F63FF;" slot="reference">
                            查看
                        </a>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-model="form.current"
            :total="total"
            style="margin-bottom: 70px;"
            @change="getList"
        />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { getFunctionalList, exportFunctionalList } from '../../../../apis/subscription-service'
import { createObjectUrl } from '../../../../assets/ts/upload'
import moment from 'moment'
  @Component({

  })
export default class LiveServiceOrder extends Vue {
  tableData = []
    total = 0
    type = ''
    form = {
        keyword: '',
        status: 'FINISHED',
        current: 1,
        size: 10,
        payStartTime: '',
        payEndTime: '',
        openWay: ''
    }

    statusMap = {
        FINISHED: '已完成',
        WAIT_PAY: '待支付'
    }

    async created () {
        try {
            await this.getList()
        } catch (e) { throw e }
    }

    async getList () {
        try {
            const { result } = await getFunctionalList(this.form)
            this.total = result.total || 0
            this.tableData = result.records
        } catch (e) { throw e }
    }

    async search () {
        this.form.current = 1
        await this.getList()
    }

    dateChange ({ start, end }) {
        this.form.payStartTime = start
        this.form.payEndTime = end
        this.search()
    }

    async resetFilter () {
        this.form = {
            keyword: '',
            status: 'FINISHED',
            current: 1,
            size: 10,
            payStartTime: '',
            payEndTime: '',
            openWay: ''
        }
        this.$refs.dateRange.clear()
        await this.getList()
    }

    async exportOrders () {
        const { ...rest } = this.form
        try {
            const blob = await exportFunctionalList(rest)
            const url = createObjectUrl(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `直播套餐订单${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
            a.click()
        } catch (e) {
            throw e
        }
    }
}
</script>

<style module lang='scss'>

    .functional-container {
        > .search {
            padding: 12px 20px;
        }
        .functional-content {
            position: relative;
            color: #D0423C;
            text-indent: 36px;
            > div:nth-of-type(1) {
                position: absolute;
                top: 0;
                left: 0;
                text-indent: 0;
            }
        }
    }

</style>
