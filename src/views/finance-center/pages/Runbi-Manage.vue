<template>
    <div class="runbi-mamange bg-white wrap">
        <search-box>
            <el-form-item label="Helper姓名：">
                <el-input
                    v-model="form.keyword"
                    placeholder="请输入Helper姓名"
                    @change="search"
                    clearable
                />
            </el-form-item>
            <el-form-item label="时间选择：">
                <date-range
                    clearable
                    @change="dateChange"
                    ref="date"
                />
            </el-form-item>
            <el-form-item label="审核状态：">
                <el-select v-model="form.status" @change="search" clearable>
                    <el-option
                        v-for="item of statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="mb-0">
                <el-button
                    type="primary"
                    round
                    @click="search"
                >
                    查询
                </el-button>
                <el-button type="text" @click="clear">
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>

        <div v-if="form.status === 'AWAIT'" class="mt-24">
            <el-button type="primary" round :disabled="!selectedList.length" @click="batchAudit">
                批量通过
            </el-button>
        </div>

        <el-table
            :data="table"
            @selection-change="selectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
                align="left"
                header-align="left"
                v-if="form.status === 'AWAIT'"
            />
            <el-table-column
                prop="orderId"
                label="订单编号"
                width="170"
            />
            <el-table-column
                prop="agentUserName"
                label="Helper"
                width="150"
            />
            <el-table-column
                prop="createTime"
                label="时间"
                width="150"
            />
            <el-table-column
                prop="productName"
                label="商品名称"
                width=""
            />
            <el-table-column
                label="商品价格（元）"
                prop="productPrice"
                width="120"
            />
            <el-table-column
                prop="count"
                label="数量"
                width="80"
            />
            <el-table-column
                label="润笔比例"
                width="100"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.priceType==='PERCENTAGE'">
                        {{ scope.row.unitPrice }}%
                    </div>
                    <div v-else>
                        ￥{{ scope.row.unitPrice }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="当前润笔"
                width="100"
            >
                <template slot-scope="scope">
                    <div style="padding: 10px 0">
                        ￥{{ scope.row.price }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="100"
            >
                <template slot-scope="scope">
                    <span v-text="statusMap[scope.row.status]" />
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating v-if="row.status === 'AWAIT'">
                        <template slot="button-box">
                            <template
                                v-if="row.status === 'AWAIT'"
                            >
                                <a
                                    @click="updateRunbi([row.id], 'PASS')"
                                >
                                    通过
                                </a>
                                <a
                                    @click="updateRunbi([row.id], 'REJECT')"
                                >
                                    驳回
                                </a>
                            </template>
                        </template>
                    </Operating>
                    <span
                        v-else
                        style="color:#ccc;"
                    >-</span>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            v-model="form.current"
            @change="getList"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { getRunbiList, updateRunbi } from '../../../apis/finance-center/runbi-manage'
@Component
export default class RunbiManage extends Vue {
    table: DynamicObject[] = []
    selectedList: DynamicObject[] = []
    total = 0
    statusList = [
        {
            label: '全部',
            value: ''
        },
        {
            label: '待审核',
            value: 'AWAIT'
        },
        {
            label: '审核通过',
            value: 'PASS'
        },
        {
            label: '审核驳回',
            value: 'REJECT'
        }
    ]

    statusMap = {
        PASS: '已通过',
        REJECT: '已拒绝',
        AWAIT: '待审核'
    }

    form = {
        keyword: '',
        status: 'AWAIT',
        current: 1,
        size: 10,
        startTime: '',
        endTime: ''
    }

    async created () {
        await this.search()
        this.form.status = (this.$route.query.status as string) || 'AWAIT'
        await this.search()
    }

    // methods
    async search () {
        this.form.current = 1
        await this.getList()
    }

    async clear () {
        this.form = {
            keyword: '',
            status: 'AWAIT',
            current: 1,
            size: 10,
            startTime: '',
            endTime: ''
        };
        (this.$refs.date as HTMLFormElement).clear()
        await this.getList()
    }

    async getList () {
        try {
            const { result } = await getRunbiList(this.form)
            this.table = result.records
            this.total = result.total
        } catch (e) {
            throw e
        }
    }

    async dateChange ({ start, end }: DynamicObject) {
        this.form.startTime = start
        this.form.endTime = end
        await this.search()
    }

    selectionChange (list: DynamicObject[]) {
        this.selectedList = list
    }

    async batchAudit () {
        try {
            await this.$confirm('您确定通过所选的申请吗？')
            const ids = []
            for (const { id } of this.selectedList) {
                ids.push(id)
            }
            await updateRunbi({ ids, status: 'PASS' })
            this.form.status = 'PASS'
            await this.search()
        } catch (e) {
            throw e
        }
    }

    async updateRunbi (ids: string[], status: string) {
        try {
            await this.$confirm(`确定${ status === 'PASS' ? '通过' : '拒绝' }这笔申请吗？`)
            await updateRunbi({ ids, status })
            this.$success('审核成功')
            await this.getList()
        } catch (e) {
            throw e
        }
    }
}
</script>

<style module lang="scss">

</style>
