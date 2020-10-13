<template>
    <div class="together">
        <div class="together-data-top">
            <div class="together-title">
                <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/marketing-gameplay/icon_together.png">
                预购
            </div>
            <div class="activity-status">
                {{ statistics.statusText }}
            </div>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'BookingBuyDetail'},
                {label:'活动数据',name:'BookingBuyData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div class="tab-card-content">
            <div class="tab-card-item">
                <div class="card-item-title">
                    访问次数
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.pageviews" /> <span>次</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    购买人数
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.userNumber" /> <span>人</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    购买商品数量
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.orderCount" /> <span>人</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    总营业额
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.totalBusiness/100" /> <span>元</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    剩余库存
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.lastStock" /> <span /> <span>件</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    定金
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.price" /><span v-if="statistics.multiple === 1" style="color: red">x {{ statistics.multipleNumber }}</span> <span>元</span>
                </div>
            </div>
        </div>
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    style="width: 180px;"
                    v-model="filterForm.searchContent"
                    placeholder="搜索内容"
                    clearable
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="filterForm.orderStatus"
                    placeholder="请选择"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        key="全部订单"
                        label="全部订单"
                        value="ALL_ORDER"
                    />
                    <el-option
                        key="待发货"
                        label="待发货"
                        value="WAIT_SHIP"
                    />
                    <el-option
                        key="待收货"
                        label="待收货"
                        value="WAIT_RECEIVE"
                    />
                    <el-option
                        key="待付款"
                        label="待付款"
                        value="WAIT_PAY"
                    />
                    <el-option
                        key="订单完成"
                        label="订单完成"
                        value="FINISHED"
                    />
                    <el-option
                        key="订单关闭"
                        label="订单关闭"
                        value="CLOSED"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="核销人：">
                <el-select
                    v-model="filterForm.operatorUserName"
                    placeholder="请选择"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        key="请选择"
                        label="请选择"
                        value=""
                    />
                    <el-option
                        v-for="(item, k) in operatorUser"
                        :key="k"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="exportData"
                    :disabled="total === 0"
                >
                    导出数据
                </el-button>
                <el-button
                    round
                    plain
                    @click="dialogVerificationVisible = true"
                >
                    去核销
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="tableData" class="mt-10" stripe>
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到预购活动订单，请确认后重新查询！
            </span>
            <el-table-column
                prop="orderId"
                label="订单编号"
                width="180"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="nickName"
                label="昵称"
                width="180"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="mobile"
                label="联系方式"
                width="150"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="count"
                label="购买数量"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-column
                label="定金"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    {{ row.orderIntentionAmount/100 }}
                </template>
            </el-table-column>
            <el-table-column
                label="实付款"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <span v-if="row.orderStatus !== 'WAIT_PAY' && row.orderStatus !== 'CLOSED'">
                        {{ row.orderAmount/100 }}
                    </span>
                    <span v-else>0</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="skuName"
                label="规格"
                width="150"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="orderStatus"
                label="状态"
                width="150"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="payTime"
                label="购买时间"
                width="280"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="operatorUserName"
                label="核销人员"
                width="100"
                header-align="center"
                align="center"
            />
            <el-table-column label="操作" align="right" header-align="right">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"

                        @click="$router.push({name:'OrderDetail', params:{id: scope.row.orderId}})"
                    >
                        查看订单
                    </el-button>
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
        <verification :dialog-verification-visible.sync="dialogVerificationVisible" />
    </div>
</template>

<script>
import { getActivityData } from '../../../../../apis/marketing-manage/gameplay'
import verification from '../../../../../components/order-center/Verification.vue'
import { bookingActivityOrders, exportActivityData } from '../../../../../apis/marketing-manage/booking'
import { redeemUserList } from '../../../../../apis/order'
import moment from 'moment/moment'
import { createObjectUrl } from '../../../../../assets/ts/upload'
export default {
    components: {
        verification
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            filterForm: {
                current: 1,
                size: 10,
                searchContent: '',
                orderStatus: 'ALL_ORDER',
                activityId: '',
                operatorUserName: ''
            },
            operatorUser: [],
            tableData: [],
            dialogVerificationVisible: false,
            total: 0,
            statistics: {}
        }
    },
    created () {
        this.filterForm.activityId = this.id
        redeemUserList().then(res => {
            this.operatorUser = res.data.result
        })
        this.getData()
        this.getList()
    },
    methods: {
        async search () {
            this.filterForm.current = 1
            try {
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            this.filterForm.current = 1
            this.filterForm.size = val
            try {
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async getData () {
            try {
                const { result } = await getActivityData({ activityId: this.filterForm.activityId, activityType: 4 })
                this.statistics = result
            } catch (e) {
                throw e
            }
        },
        // 获取列表数据
        async getList () {
            try {
                const { result } = await bookingActivityOrders(this.filterForm)
                this.tableData = result.records || []
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        // 导出数据
        async exportData () {
            try {
                const params = {
                    searchContent: this.filterForm.searchContent,
                    orderStatus: this.filterForm.orderStatus,
                    operatorUserName: this.filterForm.operatorUserName,
                    activityId: String(this.id)
                }
                const blob = await exportActivityData(params)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `预购${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "booking";
  .wrap{
    border-top: 1px solid #e7e7e7;
    padding-top: 20px;
    padding-bottom: 0 !important;
  }
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
      justify-content: space-around;
      padding-left: 40px;
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
      }
      .card-item-content {
        display: flex;
        align-items: flex-end;
        font-size: 14px;
        padding-right: 20px;
        color: #666;
        > i {
          color: #333;
          line-height: 67px;
          font-size: 50px;
          word-break: keep-all;
        }
        > span {
          margin-left: 14px;
          line-height: 40px;
        }
      }
    }
  }
</style>
