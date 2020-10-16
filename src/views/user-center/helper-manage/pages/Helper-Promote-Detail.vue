<template>
    <div>
        <div :class="$style.module">
            <div :class="$style.moduleTitle">用户基本信息</div>
            <BaseInfo
                :avatar="helperDetail.userImage"
                :type="Number(helperDetail.type) || 3"
                :other="helperDetail.other"
                :nick-name="helperDetail.nickName"
                :mobile="helperDetail.mobile"
                :gender="Number(helperDetail.gender) || 0"
                :role-code="helperDetail.roleCode"
                :user-name="helperDetail.name"
                :address="helperDetail.address"
                :tags="helperDetail.tags"
                :id="helperDetail.id"
                :source="helperDetail.source"
                :create-time="helperDetail.createTime"
                :owned-user="helperDetail.ownedUser || helperDetail.ownedMobile"
                :owned-role="helperDetail.ownedRole"
                :owned-user-id="helperDetail.ownedUserId"
                @changeOwnedAccount="showChangeOwnerDialog = true"
                :edit-tags="false"
            />
        </div>
        <div :class="$style.module">
            <div :class="$style.moduleTitle">Helper推广数据</div>
            <DataBar
                :data-list="[
                    { title: '支付订单量', data: statistics.totalOrder || 0, tip: `自购${ statistics.selfBuyOrder || 0 } <i class='ml-20'>分享${ statistics.shareOrder || 0 }</i>` },
                    { title: '支付总额', data: statistics.totalAmount / 100 || 0, tip: `自购${ statistics.selfBuyAmount/100 || 0 } <i class='ml-20'>分享${ statistics.shareAmount/100 || 0 }</i>` },
                    { title: '获得润笔金额', data: statistics.rebateAmount / 100 || 0, tip: `未提现润笔金额${ statistics.pendingWithdrawal/100 || 0 }` }
                ]"
            />
        </div>
        <!--helper列表数据-->
        <div class="table-list">
            <pl-tabs :value="tabName" :tabs="TAB_LIST" @tabClick="tabClick" />
            <div class="tab-detail">
                <!--自购订单-->
                <template v-if="tabName === ORDER_LIST">
                    <SearchBox>
                        <el-form-item label="关键字：">
                            <el-input
                                clearable
                                style="width: 300px;"
                                @change="searchOrderList"
                                placeholder="请输入订单号/产品名称"
                                v-model="orderListForm.keyword"
                            />
                        </el-form-item>
                        <el-form-item label="订单状态：">
                            <el-select
                                v-model="orderListForm.orderStatus"
                                @change="searchOrderList"
                                clearable
                            >
                                <el-option
                                    v-for="item of ORDER_STATUS"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支付时间：">
                            <date-range
                                style="width: 380px;"
                                :init="orderListTimeRange"
                                @change="formatOrderListTimeRange"
                                disable-after
                                clearable
                                ref="dateRange"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                round
                                @click="searchOrderList"
                            >
                                查询
                            </el-button>
                            <el-button type="text" @click="resetOrderList">清空筛选条件</el-button>
                        </el-form-item>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="orderList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136"
                                         src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png"
                                         alt="">
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="orderId"
                                label="订单号"
                            />
                            <el-table-column
                                prop="goodName"
                                label="产品名称"
                            />
                            <el-table-column
                                prop="orderType"
                                label="产品类型"
                            >
                                <template #default="{ row }">
                                    {{ orderTypeText[row.orderType] }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="unitPrice"
                                label="单价（元）">
                                <template #default="{ row }">
                                    {{ row.unitPrice / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="amount"
                                label="实付款（元）">
                                <template #default="{ row }">
                                    {{ row.amount / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="润笔金额（元）">
                                <template #default="{ row }">
                                    {{ row.rebateAmount / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="订单状态"
                            >
                                <template #default="{row}">
                                    {{ orderStatusText[row.orderStatus] }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="payTime"
                                label="支付时间"
                            />
                        </el-table>
                        <Pagination
                            @change="getOrderList"
                            @sizeChange="orderListSizeChange"
                            v-model="orderListForm.current"
                            :total="orderListTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
                <!--分享订单-->
                <template v-if="tabName === SHARE_LIST">
                    <SearchBox>
                        <el-form-item label="关键字：">
                            <el-input
                                clearable
                                style="width: 300px;"
                                @change="searchShareList"
                                placeholder="请输入订单号/产品名称"
                                v-model="shareListForm.keyword"
                            />
                        </el-form-item>
                        <el-form-item label="订单状态：">
                            <el-select
                                v-model="shareListForm.orderStatus"
                                @change="searchShareList"
                                clearable
                            >
                                <el-option
                                    v-for="item of ORDER_STATUS"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支付时间：">
                            <date-range
                                style="width: 380px;"
                                :init="shareListTimeRange"
                                @change="formatShareListTimeRange"
                                disable-after
                                clearable
                                ref="dateRange"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                round
                                type="primary"
                                @click="searchShareList"
                            >
                                查询
                            </el-button>
                            <el-button type="text" @click="resetShareList">清空筛选条件</el-button>
                        </el-form-item>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="shareList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136"
                                         src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png"
                                         alt="">
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="orderId"
                                label="订单号"
                            />
                            <el-table-column
                                prop="goodName"
                                label="产品名称"
                            />
                            <el-table-column
                                prop="orderType"
                                label="产品类型"
                            >
                                <template #default="{ row }">
                                    {{ orderTypeText[row.orderType] }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="unitPrice"
                                label="单价（元）">
                                <template #default="{ row }">
                                    {{ row.unitPrice / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="amount"
                                label="实付款（元）">
                                <template #default="{ row }">
                                    {{ row.amount / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="润笔金额（元）">
                                <template #default="{ row }">
                                    {{ row.rebateAmount / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="订单状态"
                            >
                                <template #default="{row}">
                                    {{ orderStatusText[row.orderStatus] }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="userName"
                                label="购买人"
                            />
                            <el-table-column
                                prop="payTime"
                                label="支付时间"
                            />
                        </el-table>
                        <Pagination
                            @change="getShareList"
                            @sizeChange="shareListSizeChange"
                            v-model="shareListForm.current"
                            :total="shareListTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
                <!--提现记录-->
                <template v-if="tabName === WITHDRAWAL_RECORDS">
                    <SearchBox>
                        <el-form-item label="申请时间：" label-width="120px">
                            <date-range
                                style="width: 380px;"
                                :init="withdrawalRecordsTimeRange"
                                @change="formaWithdrawalRecordsTimeRange"
                                disable-after
                                clearable
                                ref="dateRange"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                round
                                @click="searchWithdrawalRecords"
                            >
                                查询
                            </el-button>
                            <el-button type="text" @click="resetWithdrawalRecords">清空筛选条件</el-button>
                        </el-form-item>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="withdrawalRecords"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136"
                                         src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png"
                                         alt="">
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="name"
                                label="Helper姓名"
                            />
                            <el-table-column
                                prop="nikeName"
                                label="微信昵称"
                            />
                            <el-table-column
                                label="手机号"
                            >
                                <template #default="{ row }">
                                    {{ row.mobile }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="withdrawalAmount"
                                label="提现金额（元）">
                                <template #default="{ row }">
                                    {{ row.withdrawalAmount / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="amount"
                                label="剩余润笔（元）">
                                <template #default="{ row }">
                                    {{ (row.balanceAmount || 0) / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="提现状态"
                            >
                                <template #default="{ row }">
                                    {{ row.status }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="申请时间"
                            >
                                <template #default="{ row }">
                                    {{ row.createTime }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination
                            @change="getWithdrawalRecords"
                            @sizeChange="withdrawalRecordsSizeChange"
                            v-model="withdrawalRecordsForm.current"
                            :total="withdrawalRecordsTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
            </div>
        </div>
        <!--更改所属账号-->
        <ChangeOwnerDialog
            :show.sync="showChangeOwnerDialog"
            :current-user-info="helperDetail"
            @success="getHelperDetail"
        />
    </div>
</template>

<script  lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Field from '../../../../components/common/base/Field.vue'
import ChangeOwnerDialog from '../components/Change-Owner-Dialog.vue'
import BaseInfo from '../../../../components/user-center/Base-Info.vue'
import DataBar from '../../../../components/user-center/Data-Bar.vue'

import {
    getHelperDetail,
    getHelperStatistics,
    getWithdrawalRecords,
    getHelperOrderList
} from '../../../../apis/member'

  @Component({
      components: {
          Field,
          ChangeOwnerDialog,
          BaseInfo,
          DataBar
      }
  })
export default class HelperPromoteDetail extends Vue {
    @Prop(String) readonly id!: string
    @Prop(String) readonly mallUserId!: string

    orderStatusText= {
        ALL_ORDER: '全部订单',
        WAIT_SHIP: '待发货',
        WAIT_RECEIVE: '待收货',
        WAIT_PAY: '待付款',
        WAIT_PAY_TAIL_MONEY: '待付尾款',
        FINISHED: '订单完成',
        CLOSED: '订单关闭'
    }

    orderTypeText= {
        VIRTUAL_GOODS: '虚拟商品',
        PHYSICAL_GOODS: '实体商品',
        FORMAL_CLASS: '正式课',
        EXPERIENCE_CLASS: '体验课',
        KNOWLEDGE_COURSE: '知识课程',
        SERIES_OF_COURSE: '系列课程',
        GRAPHIC_DATA: '图文资料',
        LIVE_GOODS: '直播',
        VIDEO_GOODS: '录播'
    }

    USER_TYPE = {
        1: '家长',
        2: '学生',
        3: '其他'
    }

    // 是否显示添加标签弹框
    showAddTagDialog = false

    // TAB页面
    ORDER_LIST = 'OrderList'
    SHARE_LIST = 'ShareList'
    WITHDRAWAL_RECORDS = 'WithdrawalRecords'
    TAB_LIST = [
        { name: this.ORDER_LIST, label: '自购订单' },
        { name: this.SHARE_LIST, label: '分享订单' },
        { name: this.WITHDRAWAL_RECORDS, label: '提现记录' }
    ]

    ORDER_STATUS = [
        {
            label: '全部',
            value: ''
        },
        {
            label: '待发货',
            value: 'WAIT_SHIP'
        },
        {
            label: '待收货',
            value: 'WAIT_RECEIVE'
        },

        /* {
            label: '待付款',
            value: 'WAIT_PAY'
        }, */
        {
            label: '订单完成',
            value: 'FINISHED'
        },
        {
            label: '订单关闭',
            value: 'CLOSED'
        }
    ]

    async created () {
        this.userId = this.id
        try {
            await this.getHelperDetail()
            await this.getHelperStatistics()
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    userId = ''

    // 用户数据
    helperDetail = {
        userImage: '',
        type: '',
        other: '',
        nickName: '',
        gender: '',
        mobile: '',
        name: '',
        addressPath: '',
        address: '',
        source: '',
        tags: []
    }

    showChangeOwnerDialog = false

    async getHelperDetail () {
        try {
            const { result } = await getHelperDetail(this.userId)
            this.helperDetail = result || {}
        } catch (e) {
            throw e
        }
    }

    statistics = {
        totalOrder: 0,
        selfBuyOrder: 0,
        shareOrder: 0,
        totalAmount: 0,
        selfBuyAmount: 0,
        shareAmount: 0,
        rebateAmount: 0,
        pendingWithdrawal: 0
    }

    async getHelperStatistics () {
        try {
            const { result } = await getHelperStatistics(this.mallUserId)
            this.statistics = result || {}
        } catch (e) {
            throw e
        }
    }

    // 当前所在的tab页
    tabName = this.TAB_LIST[0].name

    // 切换Tab页面
    tabClick (data: DynamicObject) {
        console.log(data.name)
        this.tabName = data.name
        if (this.tabName === this.ORDER_LIST) {
            this.getOrderList()
        }
        if (this.tabName === this.SHARE_LIST) {
            this.getShareList()
        }
        if (this.tabName === this.WITHDRAWAL_RECORDS) {
            this.getWithdrawalRecords()
        }
    }

    // 自购订单
    orderListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        startTime: '',
        endTime: '',
        orderStatus: '',
        helper: false,
        payStartTime: '',
        payEndTime: ''
    }

    orderListTimeRange = []
    orderList = []
    orderListTotal = 0

    async formatOrderListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.orderListForm.startTime = start
            this.orderListForm.endTime = end
            await this.searchOrderList()
        } catch (e) {
            throw e
        }
    }

    async searchOrderList () {
        try {
            this.orderListForm.current = 1
            await this.getHelperStatistics()
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    async resetOrderList () {
        try {
            this.orderListForm = {
                mallUserId: '',
                current: 1,
                size: 10,
                keyword: '',
                startTime: '',
                endTime: '',
                orderStatus: '',
                helper: false,
                payStartTime: '',
                payEndTime: ''
            }
            this.orderListTimeRange = []
            await this.getHelperStatistics()
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    async getOrderList () {
        try {
            this.orderListForm.mallUserId = this.mallUserId
            const { result: { records, total } } = await getHelperOrderList(this.orderListForm)
            this.orderList = records || []
            this.orderListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async orderListSizeChange (val: number) {
        try {
            this.orderListForm.current = 1
            this.orderListForm.size = val
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    shareListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        startTime: '',
        endTime: '',
        orderStatus: '',
        goodsType: '',
        helper: true,
        payStartTime: '',
        payEndTime: ''
    }

    shareListTimeRange = []
    shareList = []
    shareListTotal = 0

    async formatShareListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.shareListForm.startTime = start
            this.shareListForm.endTime = end
            await this.searchShareList()
        } catch (e) {
            throw e
        }
    }

    async searchShareList () {
        try {
            this.shareListForm.current = 1
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    async resetShareList () {
        try {
            this.shareListForm = {
                mallUserId: '',
                current: 1,
                size: 10,
                keyword: '',
                startTime: '',
                endTime: '',
                orderStatus: '',
                goodsType: '',
                helper: true,
                payStartTime: '',
                payEndTime: ''
            }
            this.shareListTimeRange = []
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    async getShareList () {
        try {
            this.shareListForm.mallUserId = this.userId
            const form = JSON.parse(JSON.stringify(this.orderListForm))
            form.helper = true
            const { result: { records, total } } = await getHelperOrderList(form)
            this.shareList = records || []
            this.shareListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async shareListSizeChange (val: number) {
        try {
            this.shareListForm.current = 1
            this.shareListForm.size = val
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    withdrawalRecordsForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        startTime: '',
        endTime: ''
    }

    withdrawalRecordsTimeRange = []
    withdrawalRecords = []
    withdrawalRecordsTotal = 0

    async formaWithdrawalRecordsTimeRange ({ start, end }: DynamicObject) {
        try {
            this.withdrawalRecordsForm.startTime = start
            this.withdrawalRecordsForm.endTime = end
            await this.searchWithdrawalRecords()
        } catch (e) {
            throw e
        }
    }

    async searchWithdrawalRecords () {
        try {
            this.withdrawalRecordsForm.current = 1
            await this.getWithdrawalRecords()
        } catch (e) {
            throw e
        }
    }

    async resetWithdrawalRecords () {
        try {
            this.withdrawalRecordsForm = {
                mallUserId: '',
                current: 1,
                size: 10,
                startTime: '',
                endTime: ''
            }
            this.withdrawalRecordsTimeRange = []
            await this.getWithdrawalRecords()
        } catch (e) {
            throw e
        }
    }

    async getWithdrawalRecords () {
        try {
            this.withdrawalRecordsForm.mallUserId = this.userId
            const { result: { records, total } } = await getWithdrawalRecords({
                ...this.withdrawalRecordsForm,
                mallUserId: this.mallUserId
            })
            this.withdrawalRecords = records || []
            this.withdrawalRecordsTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async withdrawalRecordsSizeChange (val: number) {
        try {
            this.withdrawalRecordsForm.current = 1
            this.withdrawalRecordsForm.size = val
            await this.getWithdrawalRecords()
        } catch (e) {
            throw e
        }
    }
}
</script>
<style module lang="scss">
    .module {
        margin-bottom: 20px;
        .module-title {
            font-weight: bold;
            font-size: 16px;
        }
    }
</style>

<style scoped lang="scss">
    .header {
        display: flex;
        margin-bottom: 50px;

        .face {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            object-fit: cover;
        }

        .intro {
            margin-left: 15px;

            .detail {
                display: flex;
                line-height: 18px;

                .user-type {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: 1px solid #F79F1A;
                    border-radius: 5px;
                    font-size: 12px;
                    font-family: Microsoft YaHei UI;
                    line-height: 18px;
                    text-align: center;
                    color: #F79F1A;
                }

                .name {
                    width: 76px;
                    margin: 0 6px;
                    @include elps-wrap(1);
                }
            }

            .role-type {
                margin-top: 10px;
                margin-left: 20px;
                font-size: 12px;
                line-height: 16px;
                color: #6FD79F;
            }

            .member-type {
                margin-left: 24px;
                font-size: 12px;
                font-weight: 400;
                color: #6FD79F;
            }
        }

        .info-list {
            display: grid;
            margin-left: 24px;
            min-width: 500px;
            grid-template-columns: repeat(2, 50%);
            grid-row-gap: 24px;
            font-size: 16px;

            .tag-list {
                .tags {
                    padding: 0 13px;
                    font-size: 14px;

                    &:first-child {
                        margin-left: -20px !important;
                    }
                }

                > a {
                    color: #4F63FF;
                }
            }

            .record {
                grid-column: 1 / 2;

                > .list {
                    vertical-align: text-top;
                    display: inline-block;

                    > p {
                        margin-bottom: 16px;
                    }
                }
            }
        }
    }
    .statistics {
        margin-bottom: 60px;
        color: #333333;
        .title {
            margin-bottom: 21px;
            font-size: 16px;
            font-weight: 600;
            line-height: 20px;
        }
        .info {
            display: grid;
            padding-left: 120px;
            grid-template-columns: repeat(3, 33.33%);
            grid-row-gap: 33px;
           > li {
               text-align: left;
               > p {
                   font-size: 16px;
                   font-weight: 400;
                   line-height: 20px;
               }
               > b {
                   margin: 10px 0;
                   display: block;
                   font-size: 48px;
                   font-weight: 600;
               }
               > span {
                   font-size: 14px;
                   font-weight: 400;
                   line-height: 20px;
                   color: #999999;
                   > i {
                       margin-left: 20px;
                   }
               }
           }
        }
    }
</style>
