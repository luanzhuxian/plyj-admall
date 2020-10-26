<template>
    <!-- 分享记录 -->
    <div>
        <SearchBox>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    @change="search"
                    placeholder="请输入订单号/产品名称/分享人"
                    v-model="shareListForm.keyword"
                />
            </el-form-item>
            <el-form-item label="产品类型：">
                <el-select
                    v-model="shareListForm.goodsType"
                    @change="search"
                    clearable
                >
                    <el-option
                        v-for="item in orderType"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="支付时间：">
                <date-range
                    @change="formatShareListTimeRange"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item label="订单状态：">
                <el-select
                    v-model="shareListForm.orderStatus"
                    @change="search"
                    clearable
                >
                    <el-option
                        v-for="item in orderStatusMap"
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
                    @click="changeExportShareList"
                    type="primary"
                    plain
                    round
                    v-if="shareList && shareList.length"
                >
                    导出数据
                </el-button>
                <el-button type="text" @click="resetShareList">清空筛选条件</el-button>
            </el-form-item>
        </SearchBox>

        <el-table
            key="ShareList"
            :data="shareList"
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
            />
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
            <el-table-column
                prop="helperName"
                label="分享人"
            />
            <el-table-column v-if="isHelper" label="润笔金额（元）">
                <template #default="{ row }">
                    {{ row.rebateAmount / 100 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="orderStatus"
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
                <template #default="{row}">
                    <el-button type="text" @click="$router.push({ name: 'GoodsOrderDetail', params: { id: row.orderId } })">
                        订单详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            @change="getShareList"
            v-model="shareListForm.current"
            :total="shareListTotal"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { getOrderList } from '@/apis/member'
import { State } from 'vuex-class'

@Component
export default class MemberShareRecord extends Vue {
    shareList = []
    shareListTotal = 0
    isHelper = false
    shareListForm = {
        current: 1,
        size: 10,
        mallUserId: '',
        keyword: '',
        goodsType: '',
        payStartTime: '',
        payEndTime: '',
        orderStatus: '',
        helper: true
    }

    @Prop({ type: String }) userId!: string
    @Prop({ type: Array }) orderType!: DynamicObject[]
    @Prop({ type: Array }) orderStatusMap!: DynamicObject[]
    @State('orderStatus') orderStatus!: DynamicObject

    async activated () {
        this.isHelper = Number(this.$route.query.isHelper) === 1
        await this.search()
    }

    // methods
    async getShareList () {
        try {
            this.shareListForm.mallUserId = this.userId || ''
            const { result: { records, total } }: DynamicObject = await getOrderList(this.shareListForm)
            this.shareList = records || []
            this.shareListTotal = total || 0
            this.$emit('search')
        } catch (e) {
            throw e
        }
    }

    async search () {
        try {
            this.shareListForm.current = 1
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    async formatShareListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.shareListForm.payStartTime = start
            this.shareListForm.payEndTime = end
        } catch (e) {
            throw e
        }
    }

    async resetShareList () {
        this.shareListForm = {
            mallUserId: '',
            current: 1,
            size: 10,
            keyword: '',
            goodsType: '',
            orderStatus: '',
            helper: true,
            payStartTime: '',
            payEndTime: ''
        }
        await this.search()
    }

    changeExportShareList () {
        // todo
        console.log(1111)
    }
}
</script>

<style module lang="scss">

</style>
