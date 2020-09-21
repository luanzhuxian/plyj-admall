<template>
    <div class="order-list wrap">
        <search-box label-width="85px">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="form.keywords"
                    placeholder="搜索内容"
                    clearable
                    @change="goSearch"
                />
            </el-form-item>
            <el-form-item
                class="mb-0"
                label="下单时间："
            >
                <date-range
                    size="small"
                    disable-after
                    :clearable="true"
                    @change="dateChange"
                    range-separator="至"
                    end-label=""
                />
            </el-form-item>
            <el-form-item label="分类：">
                <SelectCategoryName v-model="classification" check-strictly show-all @change="categoryChange" />
            </el-form-item>
            <el-form-item
                class="mb-0"
                label="核销人员："
            >
                <el-select
                    clearable
                    v-model="form.operatorUser"
                    @change="goSearch"
                >
                    <el-option
                        v-for="(item,index) of redeemUserList"
                        :key="index"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                class="mb-0"
                label="支付时间："
            >
                <date-range
                    size="small"
                    disable-after
                    :clearable="true"
                    @change="datePayChange"
                    range-separator="至"
                    end-label=""
                />
            </el-form-item>
            <el-form-item label="订单状态：">
                <el-select
                    v-model="form.orderStatus"
                    @change="goSearch"
                >
                    <el-option
                        v-for="item of routeMap"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="goSearch"
                    round
                >
                    查询
                </el-button>
                <el-button
                    type="primary"
                    @click="dialogVerificationVisible = true"
                    round
                >
                    立即核销
                </el-button>
                <el-button
                    @click="showExport = true"
                    type="primary"
                    plain
                    v-if="tableData && tableData.length"
                    round
                >
                    导出订单
                </el-button>
            </el-form-item>
        </search-box>

        <el-table
            :data="tableData"
            ref="table"
        >
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" style="margin-right: 4px;" fill="#4C88D6" width="16" />
                没有查到该订单信息，请确认后重新查询！
            </span>
            <el-table-column
                prop="orderId"
                label="订单编号"
                width="180"
                header-align="left"
                align="left"
            />
            <el-table-column label="课程名称">
                <template slot-scope="{ row }">
                    <span>
                        <div class="discount">
                            <span>{{ activeStatusText[row.skuSource] }}</span>
                        </div>
                        <div class="discount" v-if="row.couponAmount || row.scholarship">
                            <span class="discount-coupon">优惠</span>
                        </div>
                        <span
                            v-text="row.goodsName"
                        />
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="sharer"
                label="分享人"
                width="100"
            />
            <el-table-column
                prop="count"
                label="数量"
                width="100"
            />
            <el-table-column
                label="实付款（元）"
                width="100"
            >
                <template #default="{ row }">
                    <span v-if="row.orderStatus !== 'WAIT_PAY' && row.orderStatus !== 'CLOSED'">
                        {{ row.orderAmount/100 }}
                    </span>
                    <span v-else>0</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="consigneeName"
                label="收货人"
                width="100"
            />
            <el-table-column
                prop="consigneeMobile"
                label="收货人电话"
                width="120"
            />
            <el-table-column
                label="订单状态"
                width="80"
            >
                <template #default="{ row }">
                    <span v-if="isAfterSale(row)">
                        {{ row.aftersaleStatus === 'PROCESSING' ? '售后中': '退款完成' }}
                    </span>
                    <span v-else-if="row.orderStatus === 'WAIT_RECEIVE'">
                        待使用
                    </span>
                    <span v-else>
                        {{ orderStatusText[row.orderStatus] }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="下单时间"
                width="150"
                align="center"
            />
            <el-table-column
                label="发票"
                width="80"
            >
                <template slot-scope="{ row }">
                    <span v-if="!row.payInvoice || row.skuSource > 1">
                        不支持
                    </span>
                    <span v-else>
                        {{ invoiceStatusText[row.invoiceStatus] }}
                    </span>
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
                                v-if="canApplyRefund(row) && !isAfterSale(row)"
                                @click="ordersListApplyAfter(row)"
                            >
                                申请售后
                            </a>
                            <a
                                v-if="canApplyInvoice(row) && !isAfterSale(row)"
                                @click="$router.push({ name: 'ApplyInvoice', query: { id:row.orderId, userId: row.userId } })"
                            >
                                申请发票
                            </a>
                            <a
                                v-if="row.orderStatus === 'WAIT_PAY'"
                                @click="getCancelOrderData(row.orderId)"
                            >
                                关闭订单
                            </a>
                            <a
                                @click="$router.push({ name: 'OrderDetail', params: { id: row.orderId } })"
                            >
                                查看
                            </a>
                            <a
                                v-if="row.redeemSize && row.orderStatus === 'WAIT_RECEIVE'"
                                @click="batchAuditredeemcode(row)"
                            >
                                核销
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            @change="getList"
            @sizeChange="sizeChange"
            v-model="queryPage.current"
            :total="total"
            :sizes="true"
            style="margin-bottom: 70px;"
        />
        <!-- 申请售后-->
        <ApplyAfter
            :show.sync="afterVisible"
            :order-id="applyAfterData.orderId"
            :apply-after-data="applyAfterData"
            @success="goSearch()"
        />
        <!--关闭订单-->
        <CloseOrder
            :show.sync="closeOrderVisible"
            :order-id="closeConfirmId"
            @success="goSearch()"
        />

        <!--  核销功能  -->
        <Verification :dialog-verification-visible.sync="dialogVerificationVisible" />
        <UncodedVerification @success="getList(1)" @codeVerification="codeVerification" :redeem-code-num="redeemCodeNum" :order-id="orderId" :show.sync="uncodedVerificationShow" />
        <!-- 订单导出 -->
        <ExportOrder
            :show.sync="showExport"
            :search-form="form"
            :classification="classification"
            order-type="course"
        />
    </div>
</template>

<script>
import moment from 'moment'
import {
    getOrderQuery,
    exportOrderQuery,
    redeemUserList
} from '../../../apis/order'
import { GET_RECEIVE_ADDRESS } from '../../../store/mutation-type'
import { mapActions, mapState, mapGetters } from 'vuex'
import { createObjectUrl } from '../../../assets/ts/upload'
import ApplyAfter from '../../../components/order-center/Apply-After.vue'
import Verification from '../../../components/order-center/Verification.vue'
import UncodedVerification from '../../../components/order-center/Uncoded-Verification.vue'
import CloseOrder from '../../../components/order-center/Close-Order.vue'
import SelectCategoryName from '../../../components/product-center/category-manage/Select-Category-Name.vue'
import ExportOrder from './../components/Export-Order'
export default {
    name: 'CourseList',
    components: {
        ApplyAfter,
        Verification,
        UncodedVerification,
        CloseOrder,
        SelectCategoryName,
        ExportOrder
    },
    data () {
        return {
            classification: [''],
            showExport: false,
            showShipBox: false,
            showShipBox2: false,
            // 查看预约dialog
            seeAppointment: false,
            queryPage: {
                current: 1,
                size: 10
            },
            form: {
                goodsTypes: ['FORMAL_CLASS', 'EXPERIENCE_CLASS'],
                orderStatus: '',
                keywords: '',
                startTime: '',
                endTime: '',
                payStartTime: '',
                payEndTime: '',
                categoryName: '',
                operatorUser: ''
            },
            orderTypeText: {
                VIRTUAL_GOODS: '虚拟商品',
                PHYSICAL_GOODS: '实体商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课程',
                LIVE_GOODS: '直播订单'
            },
            routeMap: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '待使用',
                    value: 'WAIT_RECEIVE'
                },
                {
                    label: '待付款',
                    value: 'WAIT_PAY'
                },
                {
                    label: '订单完成',
                    value: 'FINISHED'
                },
                {
                    label: '订单关闭',
                    value: 'CLOSED'
                }
            ],
            orderStatusText: {
                ALL_ORDER: '全部订单',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                WAIT_PAY_TAIL_MONEY: '待付尾款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            },
            invoiceStatusText: {
                '-1': '未开票',
                0: '待开票',
                1: '已开票',
                2: '已取消',
                3: '已作废'
            },
            activeStatusText: [
                '优惠',
                '普通订单',
                '团购订单',
                '秒杀订单',
                '预购订单',
                '春耘订单',
                '组合课订单',
                '公益订单',
                '兑换码订单'
            ],
            tableData: [],
            total: 0,
            // 发货
            orderShipVisible: false,
            orderShipData: {},
            // 关闭订单
            closeOrderVisible: false,
            closeConfirmId: '',
            // 售后商品
            afterVisible: false,
            applyAfterData: {},
            // 退款类型
            dialogVerificationVisible: false,
            // 核销人
            redeemUserList: [],
            uncodedVerificationShow: false,
            redeemCodeNum: 0,
            orderId: ''
        }
    },
    computed: {
        ...mapState(['orderStatus']),
        // ...mapGetters(['bindPhone', 'receiveAddressList'])
        ...mapGetters({
            bindPhone: 'user/bindPhone',
            receiveAddressList: 'goods/receiveAddressList'
        })
    },
    async created () {
        if (this.$route.params.id) this.form.keywords = this.$route.params.id
        this.form.orderStatus = this.$route.query.status || ''
        try {
            await this.getList()
            await this.getRedeemUserList()
        } catch (e) {
            throw e
        }
        if (!this.receiveAddressList.length) {
            await this[GET_RECEIVE_ADDRESS]()
        }
        if (this.$route.params.verify === 'true') {
            this.dialogVerificationVisible = true
        }
    },
    methods: {
        ...mapActions({
            [GET_RECEIVE_ADDRESS]: 'goods/GET_RECEIVE_ADDRESS'
        }),
        canApplyRefund (row) {
            // 申请条件 不等于待付款、订单关闭，订单可申请售后，订单没有申请过售后
            if (row.orderStatus === 'WAIT_SHIP') {
                // 0元订单 代发货退运费
                return !!(row.orderStatus !== 'WAIT_PAY' && row.orderStatus !== 'CLOSED' && row.orderStatus !== 'FINISHED' && !row.redeemCodeOperatorUserName.length && row.supportAfterSales === 1 && row.aftersaleStatus === 'NO_AFTER_SALES' && row.orderAmount > row.freight && row.skuSource < 2)
            }
            return !!(row.orderStatus !== 'WAIT_PAY' && row.orderStatus !== 'CLOSED' && row.orderStatus !== 'FINISHED' && !row.redeemCodeOperatorUserName.length && row.supportAfterSales === 1 && row.aftersaleStatus === 'NO_AFTER_SALES' && row.skuSource < 2)
        },
        canApplyInvoice (row) {
            // 申请条件 不等于待付款、订单关闭，订单可申请发票，订单没有申请过发票
            return !!(row.orderStatus !== 'WAIT_PAY' && row.orderStatus !== 'CLOSED' && row.payInvoice && (row.invoiceStatus === -1 || row.invoiceStatus === 2 || row.invoiceStatus === 3) && row.orderAmount > row.freight && row.skuSource < 2)
        },
        isAfterSale (row) {
            return !!(row.aftersaleStatus === 'PROCESSING' || row.aftersaleStatus === 'PROCESSING_COMPLETED')
        },
        async categoryChange (value) {
            this.form.categoryName = value[value.length - 1] || ''
            try {
                await this.goSearch()
            } catch (e) {
                throw e
            }
        },
        async exportList () {
            try {
                const blob = await exportOrderQuery(this.form)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${ this.orderStatusText[this.form.orderStatus] }${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
            } catch (e) {
                throw e
            }
        },
        // 获取列表数据
        async getList () {
            try {
                const { result } = await getOrderQuery(this.queryPage, this.form)
                for (const item of result.records) {
                    item.expanded = false
                }
                this.tableData = result.records || []
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        // 获取筛选条件
        async getRedeemUserList () {
            try {
                const { result } = await redeemUserList()
                const array = []
                if (result && result.length) {
                    for (const item of result) {
                        array.push({ label: item, value: item })
                    }
                }
                this.redeemUserList = array
            } catch (e) {
                throw e
            }
        },
        async dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            try {
                await this.goSearch()
            } catch (e) {
                throw e
            }
        },
        async datePayChange (val) {
            this.form.payStartTime = val.start
            this.form.payEndTime = val.end
            try {
                await this.goSearch()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            this.queryPage.size = val
            try {
                await this.goSearch()
            } catch (e) {
                throw e
            }
        },
        // 按钮搜索时，需要重置当前的分页
        async goSearch () {
            this.queryPage.current = 1
            try {
                await this.getList()
            } catch (e) {
                throw e
            }
        },

        // 发货
        async sendProduct (row) {
            this.orderShipData = row
            this.orderShipVisible = true
        },
        async getCancelOrderData (id) {
            this.closeConfirmId = id
            this.closeOrderVisible = true
        },
        ordersListApplyAfter (row) {
            this.applyAfterData = row
            this.afterVisible = true
        },
        async batchAuditredeemcode (row) {
            this.uncodedVerificationShow = true
            this.redeemCodeNum = row.redeemSize
            this.orderId = row.orderId
        },
        codeVerification (val) {
            if (val) this.dialogVerificationVisible = true
        }
    }
}

</script>

<style lang="scss" scoped>
  .order-list{
    min-height: calc(100vh - 110px);
    padding-bottom: 30px;
    background-color: #ffffff;

    ::v-deep .el-dialog__body {
        .el-form-item__label {
            margin-left: 0;
        }
    }

    ::v-deep .separator{
      margin: 0 6px;
      color: #A8A8A8;
      font-size: 12px;
    }

    .right-btn {
      position: absolute;
      right: 40px;
    }

    .ml-40 {
      margin-left: 40px;
    }

    .empty {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 12px;
        margin-right: 8px;
      }
    }

    .discount{
      position: relative;
      display: inline-flex;
      margin-right: 2px;
      margin-left: 4px;
      & span{
        padding: 0 7px;
        font-size: 12px;
        font-weight: 400;
        color: #FFFFFF;
        background-color: #EC742E;
        &.discount-coupon{
          background-color: #F2B036;
        }
      }
    }

    ::v-deep .row-expand-cover {
      .el-table__expand-column {
        .cell {
          display: none;
        }
      }
    }

    ::v-deep .el-table__expand-column .cell {
      display: none;
    }

    ::v-deep .el-table__expanded-cell {
      padding: 0;
      border-bottom: none;
    }
  }
</style>
