<template>
    <div class="order-list wrap">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="form.keywords"
                    placeholder="请输入订单编号/福利红包名称"
                    clearable
                    @change="search()"
                />
            </el-form-item>
            <el-form-item label="订单状态：">
                <el-select
                    v-model="form.orderStatus"
                    @change="search"
                >
                    <el-option
                        v-for="item of routeMap"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="下单时间：">
                <date-range
                    size="small"
                    disable-after
                    :clearable="true"
                    @change="dateChange"
                    range-separator="至"
                    ref="submitDate"
                />
            </el-form-item>
            <el-form-item label="支付时间：">
                <date-range
                    size="small"
                    disable-after
                    :clearable="true"
                    @change="datePayChange"
                    range-separator="至"
                    ref="payDate"
                />
            </el-form-item>
            <el-form-item label="订单类型：">
                <el-select
                    v-model="goodsTypes"
                    @change="goodsTypesChange()"
                >
                    <el-option
                        value=""
                        label="全部"
                    />
                    <el-option
                        value="RED_ENVELOPE"
                        label="福利红包"
                    />
                </el-select>
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
                    @click="showExport = true"
                    type="primary"
                    plain
                    v-if="tableData && tableData.length"
                    round
                >
                    导出订单
                </el-button>
                <el-button type="text" @click="clear">
                    清空筛选条件
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
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到该订单信息，请确认后重新查询！
            </span>
            <el-table-column
                prop="orderId"
                label="订单编号"
                width="180"
                header-align="left"
                align="left"
            />
            <el-table-column
                prop="goodsName"
                label="福利红包名称"
                width="180"
            />
            <el-table-column
                label="福利红包面额（元）"
                align="center"
                width="150"
            >
                <template #default="{row}">
                    {{ Number(row.subSku) }}
                </template>
            </el-table-column>
            <el-table-column
                label="类型"
                width="100"
            >
                <template #default="{ row }">
                    {{ orderTypeText[row.orderType] }}
                </template>
            </el-table-column>
            <el-table-column
                prop="sharer"
                label="分享人"
                width="100"
            />
            <el-table-column
                label="单价（元）"
                width="100"
            >
                <template #default="{ row }">
                    {{ row.unitPrice ? Number(row.unitPrice/100) : '免费' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="count"
                label="购买数量"
                width="100"
            />
            <el-table-column
                label="实付款（元）"
                width="110"
            >
                <template #default="{ row }">
                    <span v-if="row.payTransInfoModels && row.payTransInfoModels.length">
                        {{ Number(row.orderAmount/100) }}
                    </span>
                    <span v-else>0</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="consigneeName"
                label="联系人"
                width="100"
            />
            <el-table-column
                prop="consigneeMobile"
                label="联系人电话"
                width="120"
            />
            <el-table-column
                label="订单状态"
                width="80"
            >
                <template #default="{ row }">
                    <span>
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
                label="操作"
                align="right"
                header-align="right"
                fixed="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <el-button type="text" @click="$router.push({ name: 'RightGoodsDetail', params: { id: row.orderId } })">
                        查看
                    </el-button>
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
        <!-- 订单导出 -->
        <ExportOrder
            :show.sync="showExport"
            :search-form="form"
            :goods-type="goodsTypes"
            order-type="rightGoods"
        />
    </div>
</template>

<script>
import {
    getOrderQuery,
    exportOrderQuery
} from '../../../../apis/order'
import moment from 'moment'
import { createObjectUrl } from '../../../../assets/ts/upload'
import ExportOrder from '../../components/Export-Order'
export default {
    name: 'GoodsList',
    components: {
        ExportOrder
    },
    data () {
        return {
            showExport: false,
            goodsTypes: '',
            queryPage: {
                current: 1,
                size: 10
            },
            form: {
                goodsTypes: ['RED_ENVELOPE'],
                orderStatus: '',
                keywords: '',
                startTime: '',
                endTime: '',
                payStartTime: '',
                payEndTime: '',
                operatorUser: '',
                categoryName: '',
                subCategoryName: ''
            },
            orderTypeText: {
                VIRTUAL_GOODS: '虚拟订单',
                PHYSICAL_GOODS: '实体订单',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                RED_ENVELOPE: '福利红包',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课程',
                LIVE_GOODS: '直播订单',
                VIDEO_GOODS: '录播订单'
            },
            routeMap: [
                {
                    label: '全部',
                    value: ''
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
                '优惠订单',
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
            orderId: ''
        }
    },
    async created () {
        this.form.keywords = this.$route.query.keyword || ''
        this.form.orderStatus = this.$route.query.status || ''
        this.goodsTypes = this.$route.query.productType || ''
        try {
            await this.goodsTypesChange()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async goodsTypesChange () {
            switch (this.goodsTypes) {
                case '':
                    this.form.goodsTypes = ['RED_ENVELOPE']
                    break
                case 'RED_ENVELOPE':
                    this.form.goodsTypes = ['RED_ENVELOPE']
                    break
            }
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        // 导出订单列表
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
                this.tableData = result.records || []
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        async dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async datePayChange (val) {
            this.form.payStartTime = val.start
            this.form.payEndTime = val.end
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            this.queryPage.size = val
            try {
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async search () {
            this.queryPage.current = 1
            await this.getList()
        },
        async clear () {
            this.queryPage = {
                current: 1,
                size: 10
            }
            this.form = {
                goodsTypes: ['RED_ENVELOPE'],
                orderStatus: '',
                keywords: '',
                startTime: '',
                endTime: '',
                payStartTime: '',
                payEndTime: ''
            }
            this.goodsTypes = ''
            this.$refs.payDate.clear()
            this.$refs.submitDate.clear()
            await this.getList()
        }
    }
}

</script>

<style lang="scss" scoped>
    .order-list{
        min-height: calc(100vh - 110px);
        padding-bottom: 30px;
        background-color: #ffffff;

        ::v-deep .separator{
            margin: 0 6px;
            color: #A8A8A8;
            font-size: 12px;
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
