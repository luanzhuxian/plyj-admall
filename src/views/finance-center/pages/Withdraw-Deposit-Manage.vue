<template>
    <div class="wrap bg-white">
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
                <el-button
                    type="text"
                    @click="clear"
                >
                    清空筛选条件
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
                    <Operating v-if="row.status === 'AWAIT'">
                        <template slot="button-box">
                            <a @click="pass(row)">
                                转账
                            </a>
                            <a @click="reject(row)">
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

        <!-- 同意提现成功 -->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="resultDialogVisible"
            width="660px"
            class="result-dialog"
        >
            <div
                slot="title"
                class=" font-weight-bold"
            >
                共发送{{ resultTable.length }}个红包，{{ successResult.length }}个红包发送成功，{{ failResult.length }}个红包发送失败
            </div>
            <el-table
                :data="resultTable"
                style="width: 100%"
            >
                <el-table-column
                    prop="USER_NAME"
                    label="提现申请人
"
                    width="180"
                />
                <el-table-column
                    prop="PRICE"
                    label="提现金额"
                    width="180"
                >
                    <template slot-scope="round">
                        {{ round.row.PRICE }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="STATUS"
                    label="红包发送状态"
                >
                    <template slot-scope="scope">
                        <div>{{ scope.row.STATUS === 'FAIL' ? '失败' : '成功' }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="MESSAGE"
                    label="情况描述"
                />
            </el-table>
            <div
                slot="footer"
                class="dialog-footer text-center"
            >
                <el-button
                    type="primary"
                    @click="resultDialogVisible = false"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 拒绝提现 -->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="rejectDialogVisible"
            :show-close="false"
            width="30%"
            title="请填写拒绝理由"
            @close="handleClose"
        >
            <el-form
                ref="form"
                label-width="100px"
            >
                <el-form-item>
                    <div
                        slot="label"
                        class=" font-weight-bold"
                    >
                        拒绝理由：
                    </div>
                    <el-input
                        type="textarea"
                        v-model="message"
                        resize="none"
                    />
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="rejectDialogVisible = false"
                    round
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    round
                    @click="confirmReject"
                >
                    确 定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {
    getWithdrawDepositList,
    passWithdrawDeposit,
    rejectWithdrawDeposit
} from '../../../apis/finance-center/withdraw-deposit-manage'
@Component
export default class WithdrawDepositManage extends Vue {
    total = 0
    statusList: DynamicObject[] = [
        {
            label: '全部',
            value: ''
        },
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
    resultTable: DynamicObject[] = []
    failResult: DynamicObject[] = []
    successResult: DynamicObject[] = []
    rowSelected: DynamicObject | null = {}
    resultDialogVisible = false
    rejectDialogVisible = false
    message = ''

    form = {
        current: 1,
        size: 10,
        status: 'AWAIT',
        startTime: '',
        endTime: '',
        keyword: ''
    }

    async created () {
        this.form.status = (this.$route.query.status as string) || 'AWAIT'
        await this.search()
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

    async dateChange ({ start, end }: DynamicObject) {
        this.form.startTime = start
        this.form.endTime = end
        await this.search()
    }

    selectionChange (list: DynamicObject[]) {
        this.selection = list
    }

    // 通过转账请求
    async pass (option: DynamicObject) {
        await this.$confirm({
            message: `确认该helper提现，提现到用户零钱，提现金额<span style="color: #EC742E;font-weight:bold">￥${ option.price }</span>`,
            title: '确认提现',
            dangerouslyUseHTMLString: true
        })
        try {
            const data: { ids: string[] } = {
                ids: []
            }
            if (Array.isArray(option)) {
                data.ids = option
            } else {
                data.ids = [option.id]
            }
            const { result } = await passWithdrawDeposit(data)

            if (result.errorCode === 'NOTENOUGH') {
                await this.$confirm({
                    message: `您账户余额不足，若要进行退款及润笔审核操作需微信支付账户充值<span style="color: #EC742E;font-weight:bold">￥${ option.price }</span>`,
                    title: '账户余额不足'
                })
                window.open('https://pay.weixin.qq.com/index.php/core/home/login', '_blank')
                return
            }
            this.resultTable = result
            this.failResult = result.filter((item: DynamicObject) => (item.STATUS === 'FAIL'))
            this.successResult = result.filter((item: DynamicObject) => (item.STATUS === 'SUCCESS'))
            this.resultDialogVisible = true
            await this.getList()
        } catch (e) {
            throw e
        }
    }

    handleClose () {
        this.message = ''
        this.rowSelected = null
        this.selection = []
    }

    reject (row: DynamicObject) {
        this.rejectDialogVisible = true
        this.rowSelected = row
    }

    async confirmReject () {
        let ids = []
        if (this.rowSelected) {
            const { id } = this.rowSelected
            ids.push(id)
        } else {
            ids = this.selection.map(item => item.id)
        }
        const { message } = this
        const data = {
            status: 'REJECT',
            message,
            ids
        }
        await rejectWithdrawDeposit(data)
        this.rejectDialogVisible = false
        this.$success('已拒绝提现申请！')
        await this.getList()
    }
}
</script>

<style module lang="scss">

</style>
