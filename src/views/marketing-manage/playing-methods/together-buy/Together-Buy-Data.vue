<template>
    <div class="together wrap">
        <div class="together-data-top">
            <div class="together-title">
                <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/众志成团.png">
                众志成团
            </div>
            <div :class="{
                'activity-status': true,
                'not-started': statistics.status === '未开始',
                'ongoing': statistics.statusText === '进行中',
                'finished': statistics.statusText === '已结束' || statistics.statusText === '已成功'
            }">
                <pl-svg width="16" name="icon-shijian1" fill="#fff" />
                {{ statistics.statusText }}
            </div>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'TogetherBuyDetail'},
                {label:'活动数据',name:'TogetherBuyData'},
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
                    <i v-text="statistics.orderCount" /> <span>个</span>
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
                    <i v-text="statistics.lastStock" /> <span>件</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title" :class="statistics.flag ? 'green' : 'red'">
                    {{ statistics.flag ? '达到瓜分条件' : '未达到瓜分奖励条件/无红包奖励' }}
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.flag ? (statistics.prizePool || 0) : 0" /> <span>元</span>
                </div>
            </div>
        </div>
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="form.keywords"
                    placeholder="搜索内容"
                    clearable
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="form.orderStatus"
                    placeholder="状态"
                    @change="search"
                    style="width: 128px;"
                >
                    <el-option
                        label="全部订单"
                        value=""
                    />
                    <el-option
                        label="待发货"
                        value="WAIT_SHIP"
                    />
                    <el-option
                        label="待收货"
                        value="WAIT_RECEIVE"
                    />
                    <el-option
                        label="待付款"
                        value="WAIT_PAY"
                    />
                    <el-option
                        label="订单完成"
                        value="FINISHED"
                    />
                    <el-option
                        label="订单关闭"
                        value="CLOSED"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="核销人：">
                <el-select
                    v-model="form.operatorUserName"
                    placeholder="核销人员"
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
                    @click="showExport = true"
                    :disabled="total === 0"
                >
                    导出数据
                </el-button>
                <el-button
                    round
                    plain
                    type="primary"
                    @click="dialogVerificationVisible = true"
                >
                    去核销
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="tableData" class="mt-10" stripe>
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到团购活动订单，请确认后重新查询！
            </span>
            <el-table-column
                prop="orderId"
                label="订单编号"
                width="180"
                header-align="left"
                align="left"
            />
            <el-table-column
                prop="userName"
                label="参与人"
                width="180"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="consigneeName"
                label="昵称"
                width="180"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="consigneeMobile"
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
            >
                <template #default="{ row }">
                    {{ row.sku }}<span v-if="row.subSku">,</span>{{ row.subSku }}
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    {{ row.orderStatus === 'WAIT_RECEIVE' && (row.orderType === 'VIRTUAL_GOODS' || row.orderType === 'FORMAL_CLASS' || row.orderType === 'EXPERIENCE_CLASS') ? '待使用' : orderStatusText[row.orderStatus] }}
                </template>
            </el-table-column>
            <el-table-column
                prop="payTime"
                label="购买时间"
                width="280"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <span v-if="row.payTransInfoModels && row.payTransInfoModels.length">
                        {{ row.payTransInfoModels[row.payTransInfoModels.length -1].createTime }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="operatorUser"
                label="核销人员"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    {{ row.redeemCodeOperatorUserName.join() }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                header-align="right"
                align="right"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="$router.push({name:'GoodsOrderDetail', params:{id: scope.row.orderId}})"
                    >
                        查看订单
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-model="queryPage.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="getList"
            style="margin-top: 12px;text-align: center;"
        />

        <Export
            :show.sync="showExport"
            :search-data="form"
            :operator-user="operatorUser"
            @confirm="exportData"
        />

        <verification :dialog-verification-visible.sync="dialogVerificationVisible" />
    </div>
</template>

<script>
import Export from '../../activities/classmate-reunion/components/Export'
import verification from '../../../../components/order-center/Verification.vue'
import { getActivityData } from '../../../../apis/marketing-manage/gameplay'
import { exportActivityData } from '../../../../apis/marketing-manage/booking'
import { activityDataList, redeemUserList } from '../../../../apis/order'
import moment from 'moment/moment'
import { createObjectUrl } from '../../../../assets/ts/upload'
export default {
    components: {
        verification,
        Export
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showExport: false,
            queryPage: {
                current: 1,
                size: 10
            },
            form: {
                keywords: '',
                orderStatus: '',
                businessId: '',
                operatorUserName: ''
            },
            operatorUser: [],
            tableData: [],
            dialogVerificationVisible: false,
            total: 0,
            statistics: {},
            orderStatusText: {
                ALL_ORDER: '全部订单',
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                WAIT_PAY_TAIL_MONEY: '待付尾款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            }
        }
    },
    created () {
        this.form.businessId = this.id
        redeemUserList().then(res => {
            this.operatorUser = res.result
        })
        this.getData()
        this.getList()
    },
    methods: {
        async search () {
            try {
                this.queryPage.current = 1
                await this.getList()
            } catch (e) { throw e }
        },
        async sizeChange (val) {
            try {
                this.queryPage.current = 1
                this.queryPage.size = val
                await this.getList()
            } catch (e) { throw e }
        },
        async getData () {
            try {
                const { result } = await getActivityData({ activityId: this.form.businessId, activityType: 2 })
                this.statistics = result
            } catch (e) { throw e }
        },
        // 获取列表数据
        async getList () {
            try {
                const { result } = await activityDataList(this.queryPage, this.form)
                this.tableData = result.records || []
                this.total = result.total
            } catch (e) { throw e }
        },
        // 导出数据
        async exportData (data) {
            try {
                const params = {
                    ...data,
                    activityId: String(this.id)
                }
                const blob = await exportActivityData(params)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `团购${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
            } catch (e) { throw e }
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "src/views/marketing-manage/playing-methods/together-buy/together";
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
</style>
