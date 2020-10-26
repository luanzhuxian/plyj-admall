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
                prop="categoryName"
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
                    <el-button type="text" @click="$router.push({ name: 'GoodsOrderDetail', params: { id: row.orderId } })">
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import {
    getOrderList
} from '../../../../apis/member'
@Component
export default class MemberBuyRecord extends Vue {
    orderList = []
    orderListTotal = 0
    isHelper = false

    orderListForm = {
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

    changeExportOrderList () {
        // todo
        console.log(1111)
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
}
</script>

<style module lang="scss">

</style>
