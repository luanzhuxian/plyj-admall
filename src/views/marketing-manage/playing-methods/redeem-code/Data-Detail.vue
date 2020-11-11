<template>
    <div>
        <div class="tab-card-content">
            <div class="tab-card-item">
                <div class="card-item-title">
                    兑换码数量
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.exchangeCodeTotal" /> <span>个</span>
                </div>
                <el-button type="primary" round plain @click="showAddRedeemCode = true">
                    添加兑换码
                </el-button>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    已激活数量
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.activeTotal" /> <span>个</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    已使用量
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.useExchangeCodeTotal" /> <span>个</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    参与人数
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.userTotal" /> <span>人</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    已兑换商品数
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.useTotal" /> <span>个</span>
                </div>
            </div>
        </div>
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filterForm.keyword"
                    placeholder="请输入兑换码/使用人/电话"
                    style="width: 220px;"
                    clearable
                />
            </el-form-item>
            <el-form-item label="使用状态：">
                <el-select
                    v-model="filterForm.status"
                    placeholder="请选择"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        key="全部活动"
                        label="全部活动"
                        value=""
                    />
                    <el-option
                        key="未使用"
                        label="未使用"
                        value="1"
                    />
                    <el-option
                        key="已激活"
                        label="已激活(未使用)"
                        value="2"
                    />
                    <el-option
                        key="已使用"
                        label="已使用"
                        value="3"
                    />
                    <el-option
                        key="已作废"
                        label="已作废"
                        value="4"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="激活时间：">
                <date-range
                    size="small"
                    :clearable="true"
                    @change="dateChange"
                    range-separator="至"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    round
                    type="primary"
                    plain
                    @click="showExportRedeemCode = true"
                    :disabled="total === 0"
                >
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>
        <div class="mt-24">
            <el-button round plain :disabled="hasNoVoidData || multipleSelection.length === 0" @click="showBatchToVoid = true">
                批量作废
            </el-button>
            <el-button round plain :disabled="multipleSelection.length === 0" @click="showBatchRemarks = true">
                批量备注
            </el-button>
        </div>
        <el-table :data="tableData" class="mt-10" stripe @selection-change="handleSelectionChange">
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到兑换码，请确认后重新查询！
            </span>
            <el-table-column
                type="selection"
                width="55"
                header-align="left"
                align="right"
            />
            <el-table-column
                label="兑换码号"
                width="200"
                header-align="left"
                align="left"
            >
                <template #default="{row}">
                    <div style="display: flex; align-items: left; justify-content: flex-start">
                        <div style="margin-right: 10px">
                            {{ row.exchangeCode }}
                        </div>
                        <el-popover
                            placement="right"
                            style="height: 20px"
                            trigger="hover"
                        >
                            <img :src="row.qrcode">
                            <div slot="reference">
                                <img src="https://mallcdn.youpenglai.com/static/admall/2.10.0/qrcode_icon.png" style="width: 20px; height: 20px">
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                width="150"
                header-align="center"
                align="center"
            >
                <template #default="{row}">
                    <span v-if="row.status === 1">未使用</span>
                    <span v-if="row.status === 2 && row.useTotal === 0">已激活(未使用)</span>
                    <span v-if="row.status === 2 && row.useTotal > 0">已激活</span>
                    <span v-if="row.status === 3">已使用</span>
                    <span v-if="row.status === 4">已作废</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="userName"
                label="使用人"
                width="180"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="phone"
                label="使用人电话"
                width="150"
                header-align="center"
                align="center"
            />
            <el-table-column
                label="使用商品数"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{row}">
                    {{ row.useTotal }}
                    <el-button type="text" @click="handleShowProduct(row.userId, row.id)" v-if="row.useTotal > 0">
                        查看
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="receiveTime"
                label="激活时间"
                width="280"
                header-align="center"
                align="center"
            />
            <el-table-column
                label="备注"
                header-align="center"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.remarks }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                @click="handleAddRemark(row.id)"
                            >
                                添加备注
                            </a>
                            <a>
                                <a :href="row.qrcode" :download="row.exchangeCode + '.png'">
                                    下载二维码
                                </a>
                            </a>
                            <a
                                v-if="row.useTotal === 0 && row.status !== 4"
                                @click="handleToVoid(row.id)"
                            >
                                作废
                            </a>
                            <a
                                v-if="row.useTotal === 0"
                                @click="handleToDelete(row.id)"
                            >
                                删除
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-model="filterForm.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="getList"
            style="margin-top: 12px;text-align: center;"
        />
        <el-dialog
            title="新增兑换码"
            :visible.sync="showAddRedeemCode"
            width="600px"
        >
            <el-form :model="addCodeForm" :rules="rules" ref="addCodeForm">
                <el-form-item label="兑换码数量" :label-width="formLabelWidth" prop="addExchangeCodeNumber">
                    <el-input-number :max="1000" :min="statistics.exchangeCodeTotal" size="mini" step-strictly controls-position="right" v-model="addCodeForm.addExchangeCodeNumber" /> 个
                    <span class="inp-tips">（该活动生成不同的随机兑换码）</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddRedeemCode = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="submitForm('addCodeForm')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="导出数据"
            :visible.sync="showExportRedeemCode"
            width="600px"
        >
            <el-form :model="exportForm">
                <el-form-item label="使用状态" :label-width="formLabelWidth" required>
                    <el-select
                        v-model="exportForm.status"
                        placeholder="请选择"
                        style="width: 128px;"
                    >
                        <el-option
                            key="全部活动"
                            label="全部活动"
                            value=""
                        />
                        <el-option
                            key="未使用"
                            label="未使用"
                            value="1"
                        />
                        <el-option
                            key="已激活"
                            label="已激活"
                            value="2"
                        />
                        <el-option
                            key="已使用"
                            label="已使用"
                            value="3"
                        />
                        <el-option
                            key="已作废"
                            label="已作废"
                            value="4"
                        />
                    </el-select>
                    <el-checkbox v-model="exportForm.notExport" style="margin-left: 20px">
                        从未导出过的兑换码
                    </el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showExportRedeemCode = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="exportData">
                    确定导出
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :title="multipleSelection.length === 1 ? '作废' : '批量作废'"
                   :visible.sync="showBatchToVoid"
                   width="600px"
        >
            <span v-if="multipleSelection.length > 1">确认要批量作废兑换码吗？作废后将不可恢复，已激活的已将作废，请谨慎操作</span>
            <span v-if="multipleSelection.length === 1">确认要作废此兑换码吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showBatchToVoid = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="submitBatchToVoid">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :title="multipleSelection.length === 1 ? '删除' : '批量删除'"
                   :visible.sync="showBatchDelete"
                   width="600px"
        >
            <span v-if="multipleSelection.length > 1">确认要批量删除兑换码吗？删除后将不可恢复，已激活的已将作废，请谨慎操作</span>
            <span v-if="multipleSelection.length === 1">确认要删除此兑换码吗？删除后将不可恢复</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelBatchDelete">
                    取 消
                </el-button>
                <el-button type="primary" @click="submitBatchDelete">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :title="multipleSelection.length === 1 ? '备注' : '批量备注'"
                   :visible.sync="showBatchRemarks"
                   width="480px"
        >
            <el-form :model="remarkForm" :rules="rules">
                <el-form-item label="">
                    <el-input type="textarea" v-model="remarkForm.remarks" maxlength="100" :autosize="{ minRows: 6 }" placeholder="输入100字以内" show-word-limit />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelBatchRemarks">
                    取 消
                </el-button>
                <el-button type="primary" @click="submitBatchRemarks">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看备注"
                   :visible.sync="showViewRemarks"
                   width="600px"
        >
            <table :data="remarkData">
                <el-table-column
                    prop="orderId"
                    label="备注内容"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    prop="orderId"
                    label="备注时间"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    prop="orderId"
                    label="操作人"
                    header-align="center"
                    align="center"
                />
            </table>
        </el-dialog>
        <el-dialog title="查看商品" :visible.sync="showProductModal" width="600px">
            <el-table :data="productList" height="450">
                <el-table-column
                    label="商品图片"
                    header-align="center"
                    align="center"
                >
                    <template #default="{row}">
                        <img width="60" height="60" :src="row.productImg">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="productName"
                    label="商品名称"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    prop="productType"
                    label="商品类型"
                    header-align="center"
                    align="center"
                >
                    <template #default="{row}">
                        {{ row.productType === 2 ? '单课' : '系列课' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sellingPrice"
                    label="售价(元)"
                    header-align="center"
                    align="center"
                >
                    <template #default="{row}">
                        {{ row.sellingPrice / 100 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="exchangeTime"
                    label="兑换时间"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    header-align="center"
                    align="center"
                >
                    <template #default="{row}">
                        <el-button @click="handleViewOrder(row.orderId)">
                            查看订单
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import { createObjectUrl } from '../../../../assets/ts/upload'
import { exportActivityData, getRedeemCodeStatistics, getRedeemCodeByActivity, addCodeByActivity, redeemCodeBatchToVoid, redeemCodeBatchDelete, redeemCodeBatchRemarks, redeemCodeViewOrders } from '../../../../apis/marketing-manage/redeem-code'
import { generateQrcode } from '../../../../assets/ts/utils'
export default {
    name: 'RedeemCodeDataDetail',
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            statistics: {
                exchangeCodeTotal: 0,
                useExchangeCodeTotal: 0,
                useTotal: 0,
                userTotal: 0,
                activeTotal: 0
            },
            filterForm: {
                current: 1,
                size: 10,
                keyword: '',
                status: '',
                startDate: '',
                endDate: ''
            },
            tableData: [],
            remarkData: [],
            productList: [],
            total: 1,
            showAddRedeemCode: false,
            showExportRedeemCode: false,
            showBatchToVoid: false,
            showBatchDelete: false,
            showBatchRemarks: false,
            showViewRemarks: false,
            showProductModal: false,
            addCodeForm: {
                addExchangeCodeNumber: 1
            },
            exportForm: {
                status: '',
                notExport: false
            },
            remarkForm: {
                remarks: ''
            },
            formLabelWidth: '120px',
            rules: {
                addExchangeCodeNumber: [
                    { required: true, message: '新增兑换码不能为空', trigger: 'blur' }
                ]
            },
            multipleSelection: [],
            hasNoVoidData: false
        }
    },
    async created () {
        try {
            await this.getStatistics()
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getStatistics () {
            try {
                const data = await getRedeemCodeStatistics(this.id)
                this.statistics = data.result
                this.addCodeForm.addExchangeCodeNumber = data.result.exchangeCodeTotal
            } catch (e) {
                throw e
            }
        },
        async getList () {
            try {
                const data = await getRedeemCodeByActivity(this.id, this.filterForm)
                data.result.records.forEach(async item => {
                    item.qrcode = await generateQrcode({
                        size: 300,
                        text: item.exchangeCodeUrl,
                        padding: 25,
                        centerPadding: 10
                    })
                })
                this.tableData = data.result.records
                this.total = data.result.total
            } catch (e) {
                throw e
            }
        },
        async dateChange (val) {
            try {
                this.filterForm.startDate = val.start
                this.filterForm.endDate = val.end
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            try {
                this.filterForm.size = val
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async search () {
            try {
                this.exportForm.status = this.filterForm.status
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async submitForm (formName) {
            try {
                await this.$refs[formName].validate()
                const number = this.addCodeForm.addExchangeCodeNumber - this.statistics.exchangeCodeTotal
                await addCodeByActivity(this.id, number)
                await this.$success('添加成功')
                this.showAddRedeemCode = false
                this.getStatistics()
                this.getList()
            } catch (e) {
                throw e
            }
        },
        handleSelectionChange (data) {
            this.hasNoVoidData = data.some(val => val.status === 4 || val.useTotal > 0)
            const array = []
            for (const item of data) {
                array.push(item.id)
            }
            this.multipleSelection = array
        },
        async submitBatchToVoid () {
            try {
                await redeemCodeBatchToVoid(this.multipleSelection)
                this.cancelBatchToVoid()
                await this.getStatistics()
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        cancelBatchToVoid () {
            this.showBatchToVoid = false
            this.multipleSelection = []
        },
        async submitBatchDelete () {
            try {
                await redeemCodeBatchDelete(this.multipleSelection)
                this.cancelBatchDelete()
                await this.getStatistics()
                if (((this.multipleSelection.length === this.tableData.length) || (this.tableData.length === 1)) && this.filterForm.current !== 1) this.filterForm.current--
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        cancelBatchDelete () {
            this.showBatchDelete = false
            this.multipleSelection = []
        },
        async submitBatchRemarks () {
            try {
                const ids = {
                    codeIds: this.multipleSelection,
                    remarks: this.remarkForm.remarks
                }
                await redeemCodeBatchRemarks(ids)
                this.cancelBatchRemarks()
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        cancelBatchRemarks () {
            this.showBatchRemarks = false
            this.multipleSelection = []
            this.remarkForm.remarks = ''
        },
        handleViewRemarks () {
            this.showViewRemarks = true
        },
        async handleShowProduct (userId, codeId) {
            try {
                const data = await redeemCodeViewOrders(userId, codeId)
                this.productList = data.result
                this.showProductModal = true
            } catch (e) {
                throw e
            }
        },
        handleAddRemark (id) {
            this.multipleSelection = []
            this.multipleSelection.push(id)
            this.showBatchRemarks = true
            this.remarkForm.remarks = ''
        },
        handleToVoid (id) {
            this.multipleSelection = []
            this.multipleSelection.push(id)
            this.showBatchToVoid = true
        },
        handleToDelete (id) {
            this.multipleSelection = []
            this.multipleSelection.push(id)
            this.showBatchDelete = true
        },
        handleViewOrder (id) {
            this.$router.push({ name: 'OnlineSchoolOrderDetail', params: { id } })
        },
        // 导出数据
        async exportData () {
            try {
                const params = {
                    notExport: this.exportForm.notExport,
                    status: this.exportForm.status || this.filterForm.status
                }
                const blob = await exportActivityData(this.id, params)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${ this.statistics.name }${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
            } catch (e) { throw e }
        }
    }
}
</script>

<style lang="scss" scoped>
  .tab-card-content {
    display: flex;
    height: 205px;
    padding: 23px 0;
    .tab-card-item {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-left: 40px;
      padding-top: 10px;
      width: max-content;
      &:nth-last-of-type(1):after {
        display: none;
      }
      &:after {
        position: absolute;
        right: 0;
        top: 0;
        content: '';
        width: 1px;
        height: 100%;
        background-color: $--border-color;
      }
      .yesterday, .see-detail {
        font-size: 14px;
        line-height: 19px;
        padding: 0;
        color: $--color-primary-blue;
      }
      .card-item-title {
        font-size: 18px;
        font-weight: bold;
        &.red{
          color: #EC742E;
        }
        &.green{
          color: #63BF41;
        }
      }
      .card-item-content {
        display: flex;
        align-items: flex-end;
        font-size: 14px;
        margin: 20px 0 8px;
        padding-right: 20px;
        color: #666;
        > i {
          margin-right: 14px;
          color: #333;
          line-height: 67px;
          font-size: 50px;
          word-break: keep-all;
        }
        > span {
          line-height: 40px;
        }
      }
    }
  }
  .filter-wrap{
    display: flex;
    justify-content: space-between;
    padding: 18px 24px 0;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #e7e7e7;
  }
  .batch-action{
    margin: 18px 24px 0;
  }
</style>
