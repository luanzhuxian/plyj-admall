<template>
    <div class="wrap bg-white">
        <search-box>
            <el-form-item label="Helper姓名：">
                <el-input
                    v-model="form.keyword"
                    placeholder="请输入Helper姓名"
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="时间选择：">
                <date-range
                    clearable
                    @change="dateChange"
                />
            </el-form-item>
            <el-form-item label="审核状态：">
                <el-select v-model="form.status" @change="search">
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
            </el-form-item>
        </search-box>

        <el-table
            :data="table"
            @selection-change="selectionChange"
        >
            <el-table-column
                prop="userName"
                label="Helper"
            />
            <el-table-column
                prop="nickName"
                label="微信昵称"
            />
            <el-table-column
                prop="mobile"
                label="手机号"
            />
            <el-table-column
                prop="price"
                label="提现金额（元）"
            />
            <el-table-column
                prop="balance"
                label="剩余润笔 (元)"
            />
            <el-table-column
                label="申请时间"
            >
                <template slot-scope="scope">
                    {{ scope.row.createTime | dateFormat("YYYY-MM-DD") }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating v-if="form.status === 'AWAIT'">
                        <template slot="button-box">
                            <a>
                                转账
                            </a>
                            <a>
                                拒绝
                            </a>
                        </template>
                    </Operating>

                    <el-popover
                        placement="bottom-end"
                        width="500"
                        trigger="click"
                    >
                        <div style="color:#999">
                            日志记录
                        </div>
                        <el-row
                            :gutter="20"
                            class="mt-10"
                            v-for="(log,index) in row.logs"
                            :key="index"
                        >
                            <el-col :span="8">
                                {{ log.createTime }}
                            </el-col>
                            <el-col :span="8">
                                {{ log.message }}
                            </el-col>
                            <el-col :span="8">
                                {{ log.createUserName }}
                            </el-col>
                        </el-row>
                        <el-button
                            type="text"
                            slot="reference"
                            class="text-underline"
                        >
                            查看日志
                        </el-button>
                    </el-popover>
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
import Component from 'vue-class-component'
import { getWithdrawDepositList } from '../../../apis/finance-center/withdraw-deposit-manage'
@Component
export default class WithdrawDepositManage extends Vue {
    total = 0
    statusList: DynamicObject[] = [
        {
            label: '提现成功',
            value: 'RECEIVED'
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
        },
        {
            label: '提现失败',
            value: 'FAIL'
        }
    ]

    table: DynamicObject[] = []
    selection: DynamicObject[] = []

    form = {
        current: 1,
        size: 10,
        status: '',
        startTime: '',
        endTime: '',
        keyword: ''
    }

    async created () {
        await this.search()
    }

    async activated () {
        if (this.$route.query.status !== this.form.status) {
            this.form.status = (this.$route.query.status as string) || ''
            await this.search()
        }
    }

    // methods
    async getList () {
        try {
            const { result } = await getWithdrawDepositList(this.form)
            this.total = result.total
            this.table = result.records
        } catch (e) {
            throw e
        }
    }

    async search () {
        this.form.current = 1
        await this.getList()
    }

    async dateChange ({ start, end }: DynamicObject) {
        this.form.startTime = start
        this.form.endTime = end
        await this.search()
    }

    selectionChange (list: DynamicObject[]) {
        this.selection = list
    }

    // async pass (option) {
    //     await this.$confirm({
    //         message: `确认该helper提现，提现到用户零钱，提现金额<span style="color: #EC742E;font-weight:bold">￥${option.price}</span>`,
    //         title: '确认提现',
    //         dangerouslyUseHTMLString: true
    //     })
    //     try {
    //         const data = {}
    //         if (Array.isArray(option)) {
    //             data.ids = option
    //         } else {
    //             data.ids = [option.id]
    //         }
    //         const { data: res } = await passWithdrawDeposit(data)
    //
    //         if (res.result.errorCode === 'NOTENOUGH') {
    //             await this.$confirm({
    //                 message: `您账户余额不足，若要进行退款及润笔审核操作需微信支付账户充值<span style="color: #EC742E;font-weight:bold">￥${option.price}</span>`,
    //                 title: '账户余额不足'
    //             })
    //             window.open('https://pay.weixin.qq.com/index.php/core/home/login', '_blank')
    //             return
    //         }
    //         this.resultTable = res.result
    //         this.failResult = res.result.filter(item => (item.STATUS === 'FAIL'))
    //         this.successResult = res.result.filter(item => (item.STATUS === 'SUCCESS'))
    //         this.resultDialogVisible = true
    //         await this.getList()
    //     } catch (e) {
    //         throw e
    //     }
    // }
}
</script>

<style module lang="scss">

</style>
