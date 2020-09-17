<template>
    <div class="order-list wrap">
        <search-box label-width="85px">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="form.keywords"
                    placeholder="搜索内容"
                    clearable
                    @keyup.enter.native="goSearch()"
                />
            </el-form-item>
            <el-form-item label="下单时间：">
                <date-range
                    size="small"
                    disable-after
                    :clearable="true"
                    @change="dateChange"
                    range-separator="至"
                    end-label=""
                />
            </el-form-item>
            <el-form-item label="课程类型：">
                <el-select
                    v-model="goodsTypes"
                    @change="goodsTypesChange()"
                >
                    <el-option
                        v-for="(item,index) in goodsTypesList"
                        :value="item.value"
                        :label="item.label"
                        :key="index"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="订单状态：">
                <el-select
                    v-model="form.orderStatus"
                    @change="goSearch"
                >
                    <el-option
                        v-for="(item, index) of orderStatusList"
                        :key="index"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="支付时间：">
                <date-range
                    size="small"
                    disable-after
                    :clearable="true"
                    @change="datePayChange"
                    range-separator="至"
                    end-label=""
                />
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
                    @click="showExport = true"
                    type="primary"
                    plain
                    round
                    v-if="tableData && tableData.length"
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
                        <div class="discount" v-if="row.couponAmount">
                            <span class="discount-coupon">优惠券</span>
                        </div>
                        <span
                            v-text="row.goodsName"
                        />
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="课程类型"
                width="100"
            >
                <template #default="{ row }">
                    {{ orderTypeText[row.orderType] }}
                </template>
            </el-table-column>
            <el-table-column
                prop="count"
                label="课节数量"
                width="100"
            />
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
                    {{ row.unitPrice/100 }}
                </template>
            </el-table-column>
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
                    {{ orderStatusText[row.orderStatus] }}
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
                    <span v-if="!row.payInvoice">
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
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            @change="getList"
            @sizechange="sizeChange"
            v-model="queryPage.current"
            :total="total"
            :sizes="true"
            style="margin-bottom: 70px;"
        />
        <!--关闭订单-->
        <CloseOrder
            :show.sync="closeOrderVisible"
            :order-id="closeConfirmId"
            @success="goSearch()"
        />

        <!-- 订单导出 -->
        <ExportOrder
            :show.sync="showExport"
            :search-form="form"
            :goods-type="goodsTypes"
            :classification="classification"
            order-type="networkCourse"
        />
    </div>
</template>

<script>
import {
    getOrderQuery,
    exportOrderQuery
} from '../../../apis/order'
import { GET_RECEIVE_ADDRESS } from '../../../store/mutation-type'
import { mapActions, mapState, mapGetters } from 'vuex'
import { createObjectUrl } from '../../../assets/ts/upload'
import moment from 'moment'
import ExportOrder from './../components/Export-Order'
import CloseOrder from '../../../components/order/Close-Order.vue'

export default {
    name: 'OnlineSchoolOrder',
    components: {
        CloseOrder,
        ExportOrder
    },
    data () {
        return {
            classification: [''],
            showExport: false,
            goodsTypes: '',
            queryPage: {
                current: 1,
                size: 10
            },
            form: {
                goodsTypes: ['KNOWLEDGE_COURSE', 'SERIES_OF_COURSE', 'LIVE_GOODS', 'VIDEO_GOODS', 'GRAPHIC_DATA'],
                orderStatus: '',
                keywords: '',
                startTime: '',
                endTime: '',
                payStartTime: '',
                payEndTime: ''
            },
            goodsTypesList: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: 'KNOWLEDGE_COURSE',
                    label: '知识课程'
                },
                {
                    value: 'SERIES_OF_COURSE',
                    label: '系列课程'
                },
                {
                    value: 'GRAPHIC_DATA',
                    label: '图文资料'
                },
                {
                    value: 'LIVE_GOODS',
                    label: '直播'
                },
                {
                    value: 'VIDEO_GOODS',
                    label: '录播'
                }
            ],
            orderTypeText: {
                VIRTUAL_GOODS: '虚拟商品',
                PHYSICAL_GOODS: '实体商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课程',
                GRAPHIC_DATA: '图文资料',
                LIVE_GOODS: '直播',
                VIDEO_GOODS: '录播'
            },
            orderStatusText: {
                ALL_ORDER: '全部订单',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                WAIT_PAY_TAIL_MONEY: '待付尾款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            },
            orderStatusList: [
                { value: '', label: '全部' },
                { value: 'WAIT_PAY', label: '待付款' },
                { value: 'FINISHED', label: '订单完成' },
                { value: 'CLOSED', label: '订单关闭' }
            ],
            invoiceStatusText: {
                '-1': '未开票',
                0: '待开票',
                1: '已开票',
                2: '已作废'
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
            // 关闭订单
            closeOrderVisible: false,
            closeConfirmId: ''
        }
    },
    computed: {
        ...mapState(['orderStatus']),
        ...mapGetters({
            categoryTree: 'goods/categoryTree',
            bindPhone: 'user/bindPhone',
            receiveAddressList: 'goods/receiveAddressList'
        })
    },
    async created () {
        if (this.$route.params.courseId) this.form.keywords = this.$route.params.courseId
        if (this.$route.params.graphicId) this.form.keywords = this.$route.params.graphicId
        try {
            await this.getList()
        } catch (e) {
            throw e
        }
        if (!this.receiveAddressList.length) {
            await this[GET_RECEIVE_ADDRESS]()
        }
    },
    methods: {
        ...mapActions([GET_RECEIVE_ADDRESS]),
        async goodsTypesChange () {
            switch (this.goodsTypes) {
                case '':
                    this.form.goodsTypes = ['KNOWLEDGE_COURSE', 'SERIES_OF_COURSE', 'LIVE_GOODS', 'VIDEO_GOODS', 'GRAPHIC_DATA']
                    break
                case 'KNOWLEDGE_COURSE':
                    this.form.goodsTypes = ['KNOWLEDGE_COURSE']
                    break
                case 'SERIES_OF_COURSE':
                    this.form.goodsTypes = ['SERIES_OF_COURSE']
                    break
                case 'GRAPHIC_DATA':
                    this.form.goodsTypes = ['GRAPHIC_DATA']
                    break
                case 'LIVE_GOODS':
                    this.form.goodsTypes = ['LIVE_GOODS']
                    break
                case 'VIDEO_GOODS':
                    this.form.goodsTypes = ['VIDEO_GOODS']
                    break
            }
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
        async getCancelOrderData (id) {
            this.closeConfirmId = id
            this.closeOrderVisible = true
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
  }
</style>
