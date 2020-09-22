<template>
    <div class="together">
        <div class="together-data-top">
            <div class="together-title">
                <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/marketing-gameplay/icon_together.png">
                预购
            </div>
            <div class="activity-status">
                <pl-svg name="icon-shijian1" width="16" fill="#fff" class="mr-10" />
                {{ statistics.statusText }}
            </div>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'NewYearBookingBuyDetail'},
                {label:'活动数据',name:'NewYearBookingBuyData'},
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
                    <i v-text="statistics.orderCount" /> <span>件</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    总营业额
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.totalBusiness/100" /> <span>元</span>
                    <span class="watch-detail" @click="watchDetail">查看明细</span>
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
                    待付尾款订单
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.waitPayBalanceCount || 0" /><span>单</span>
                </div>
            </div>
            <div class="tab-card-item" v-if="statistics.multiple === 1">
                <div class="card-item-title">
                    定金翻倍
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.multipleNumber" /> <span>倍</span>
                </div>
            </div>
            <div class="tab-card-item">
                <div class="card-item-title">
                    尾款支付
                </div>
                <div class="card-item-content">
                    <i v-text="statistics.payMethod === 0 ? '线上' : '线下'" />
                </div>
            </div>
        </div>
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    style="width: 180px;"
                    v-model="form.keywords"
                    placeholder="搜索内容："
                    clearable
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="form.orderStatus"
                    placeholder="请选择"
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
                    placeholder="请选择"
                    @change="search"
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
                header-align="left"
                align="left"
            />
            <el-table-column
                prop="nickName"
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
                    <span v-if="row.payTransInfoModels && row.payTransInfoModels.length">
                        {{ row.orderAmount / 100 }}
                    </span>
                    <span v-else>0</span>
                </template>
            </el-table-column>
            <el-table-column
                label="尾款金额"
                width="100"
                header-align="center"
                align="center"
            >
                <template slot-scope="{ row }">
                    {{ !row.orderAmountTailMoney? (row.orderAmount - row.orderIntentionAmount - row.freight)/100:row.orderAmountTailMoney/100 }}
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
                label="购买时间"
                width="180"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <span v-if="row.payTransInfoModels && row.payTransInfoModels.length">
                        {{ row.payTransInfoModels.find(item => item.type === 'INTENTION_AMOUNT') ? row.payTransInfoModels.find(item => item.type === 'INTENTION_AMOUNT').callbackTime: '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="尾款支付时间"
                width="180"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <span v-if="row.payTransInfoModels && row.payTransInfoModels.length">
                        {{ row.payTransInfoModels.find(item => item.type === 'TAIL_MONEY') ? row.payTransInfoModels.find(item => item.type === 'TAIL_MONEY').callbackTime: '' }}
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
            v-model="queryPage.current"
            :sizes="true"
            :total="total"
            @sizechange="sizeChange"
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
import Export from './../../classmate-reunion/components/Export'
import verification from '../../../../../components/order-center/Verification.vue'
import { getActivityData } from '../../../../../apis/marketing-manage/gameplay'
import { exportActivityData } from '../../../../../apis/marketing-manage/booking'
import { activityDataList, redeemUserList } from '../../../../../apis/order'
import moment from 'moment/moment'
import { createObjectUrl } from '../../../../../assets/ts/upload'
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
            this.operatorUser = res.data.result
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
                const { data: res } = await getActivityData({ activityId: this.form.businessId, activityType: 4 })
                this.statistics = res.result
            } catch (e) { throw e }
        },
        // 获取列表数据
        async getList () {
            try {
                const { data: res } = await activityDataList(this.queryPage, this.form)
                this.tableData = res.result.records || []
                this.total = res.result.total
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
                a.download = `预购${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
            } catch (e) { throw e }
        },
        // 查看明细
        watchDetail () {
            this.$alert({
                title: '总营业额明细',
                message: `<p>定金支付总额：${ (this.statistics.depositAmount || 0) / 100 } 元<p/><p>支付尾款总额：${ (this.statistics.preBalanceAmount || 0) / 100 }元</p>`,
                dangerouslyUseHTMLString: true
            })
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
        position: relative;
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
        > .watch-detail {
          color: #4F63FF;
          font-size:12px;
          position: absolute;
          cursor: pointer;
          bottom: -29px;
          left: -11px;
        }
      }
    }
  }
</style>
