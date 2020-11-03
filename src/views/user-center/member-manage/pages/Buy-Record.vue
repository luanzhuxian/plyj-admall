<template>
    <!-- 购买记录 -->
    <div>
        <SearchBox>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    @change="search"
                    placeholder="请输入订单号/产品名称"
                    v-model.trim="orderListForm.keyword"
                />
            </el-form-item>
            <el-form-item label="产品类型：">
                <el-select
                    v-model="orderListForm.goodsType"
                    @change="search"
                    clearable
                >
                    <el-option
                        v-for="item of orderType"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="支付时间：">
                <date-range
                    @change="formatOrderListTimeRange"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item label="订单状态：">
                <el-select
                    v-model="orderListForm.orderStatus"
                    @change="search"
                    clearable
                >
                    <el-option
                        v-for="item of orderStatusMap"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    round
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    @click="changeExportOrderList"
                    type="primary"
                    plain
                    round
                    v-if="orderList && orderList.length"
                >
                    导出数据
                </el-button>
                <el-button type="text" @click="resetOrderList">清空筛选条件</el-button>
            </el-form-item>
        </SearchBox>

        <el-table
            key="OrderList"
            :data="orderList"
            class="table-customer"
            style="width: 100%"
        >

            <el-table-column
                prop="orderId"
                label="订单号"
            />
            <el-table-column
                prop="goodName"
                label="产品名称"
            />
            <el-table-column
                label="产品类型"
            >
                <template #default="{ row }">
                    <span v-text="productTypeMap[row.orderType]" />
                </template>
            </el-table-column>
            <el-table-column
                prop="orderNumber"
                label="数量"
            />
            <el-table-column
                prop="unitPrice"
                label="单价（元）">
                <template #default="{ row }">
                    {{ row.unitPrice / 100 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="实付款（元）">
                <template #default="{ row }">
                    {{ row.amount / 100 }}
                </template>
            </el-table-column>
            <el-table-column v-if="isHelper" label="润笔金额（元）">
                <template #default="{ row }">
                    {{ row.rebateAmount / 100 }}
                </template>
            </el-table-column>
            <el-table-column
                label="订单状态"
            >
                <template #default="{ row }">
                    <span v-text="orderStatus[row.orderStatus]" />
                </template>
            </el-table-column>
            <el-table-column
                prop="payTime"
                label="支付时间"
            />
            <el-table-column
                fixed="right"
                label="操作"
            >
                <template #default="{ row }">
                    <el-button type="text" @click="handleClick(row)">
                        订单详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            @change="getOrderList"
            v-model="orderListForm.current"
            :total="orderListTotal"
        />
        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="110px" label-position="left">
                <el-form-item label="关键字" prop="keyword">
                    <el-input
                        v-model.trim="exportData.keyword"
                        placeholder="请输入订单号/产品名称"
                        style="width: 300px;"
                        clearable
                    />
                </el-form-item>

                <el-form-item label="产品类型：">
                    <el-select
                        v-model="exportData.goodsType"
                        clearable
                    >
                        <el-option
                            v-for="item of orderType"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="订单状态：">
                    <el-select
                        v-model="exportData.orderStatus"
                        clearable
                    >
                        <el-option
                            v-for="item of orderStatusMap"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付时间" prop="payStartTime">
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
                        :init="exportData.payStartTime ? [exportData.payStartTime,exportData.payEndTime] : []"
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

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import {
    MemberBuyRecordExport,
    getOrderList
} from '../../../../apis/member'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import { ElForm } from 'admall-element/types/form'
import { createObjectUrl } from '@/assets/ts/upload'
import moment from 'moment'
@Component({
    components: { ExportDialog }
})
export default class MemberBuyRecord extends Vue {
    orderList = []
    orderListTotal = 0
    isHelper = false

    orderListForm: DynamicObject = {
        current: 1,
        size: 10,
        mallUserId: '',
        keyword: '',
        goodsType: '',
        payStartTime: '',
        payEndTime: '',
        orderStatus: '',
        helper: false
    }

    // 导出
    showExport = false
    exportData: DynamicObject = {
        mallUserId: '',
        keyword: '',
        goodsType: '',
        payStartTime: '',
        payEndTime: '',
        orderStatus: '',
        helper: false,
        dateRange: 3
    }

    exportRules = {
        payStartTime: [
            { required: true, message: '请选择时间', trigger: 'blur' }
        ]
    }

    async activated () {
        this.isHelper = Number(this.$route.query.isHelper) === 1
        await this.search()
    }

    @Prop() userId!: string
    @Prop({ type: Array }) orderType!: DynamicObject[]
    @Prop({ type: Array }) orderStatusMap!: DynamicObject[]
    @State('orderStatus') orderStatus!: DynamicObject
    @State('productTypeMap') productTypeMap!: DynamicObject

    // methods
    async getOrderList () {
        try {
            this.orderListForm.mallUserId = this.userId || ''
            const { result: { records, total } } = await getOrderList(this.orderListForm)
            this.orderList = records || []
            this.orderListTotal = total || 0
            this.$emit('search')
        } catch (e) {
            throw e
        }
    }

    async search () {
        try {
            this.orderListForm.current = 1
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    async formatOrderListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.orderListForm.payStartTime = start
            this.orderListForm.payEndTime = end
            await this.search()
        } catch (e) {
            throw e
        }
    }

    async resetOrderList () {
        this.orderListForm = {
            mallUserId: '',
            current: 1,
            size: 10,
            keyword: '',
            goodsType: '',
            orderStatus: '',
            helper: false,
            payStartTime: '',
            payEndTime: ''
        }
        await this.search()
    }

    changeExportOrderList () {
        for (const item of Object.keys(this.exportData)) {
            if (item !== 'dateRange') this.exportData[item] = this.orderListForm[item]
        }
        this.showExport = true
    }

    exportClose () {
        this.exportData = {
            mallUserId: '',
            keyword: '',
            goodsType: '',
            payStartTime: '',
            payEndTime: '',
            orderStatus: '',
            dateRange: 3,
            helper: false
        };
        (this.$refs.exportForm as ElForm).clearValidate()
        this.showExport = false
    }

    async exportList () {
        await (this.$refs.exportForm as HTMLFormElement).validate()
        const blob = await MemberBuyRecordExport(this.exportData)
        const url = createObjectUrl(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `会员购买记录${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
        a.click()
        this.showExport = false
    }

    exportRangeChange (val: number) {
        const start: string | Date = new Date()
        const end: string | Date = new Date()
        const formatType = 'YYYY-MM-DD'

        if (val === 1) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        } else if (val === 2) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        } else {
            this.exportData.payStartTime = ''
            this.exportData.payEndTime = ''
        }
    }

    async exportDatechange ({ start, end }: DynamicObject) {
        this.exportData.payStartTime = start
        this.exportData.payEndTime = end
        if (!start || !end) {
            return
        }
        await this.$nextTick();
        (this.$refs.exportDatePicker as HTMLFormElement).initDate()
    }

    handleClick ({ orderType, orderId }: { orderType: string; orderId: string }) {
        if (orderType === 'PHYSICAL_GOODS' || orderType === 'VIRTUAL_GOODS') {
            this.$router.push({ name: 'GoodsOrderDetail', params: { id: orderId } })
        } else if (orderType === 'FORMAL_CLASS' || orderType === 'EXPERIENCE_CLASS') {
            this.$router.push({ name: 'CourseOrderDetail', params: { id: orderId } })
        } else if (orderType === 'KNOWLEDGE_COURSE' || orderType === 'SERIES_OF_COURSE' || orderType === 'LIVE_GOODS') {
            this.$router.push({ name: 'OnlineSchoolOrderDetail', params: { id: orderId } })
        }
    }
}
</script>

<style module lang="scss">

</style>
