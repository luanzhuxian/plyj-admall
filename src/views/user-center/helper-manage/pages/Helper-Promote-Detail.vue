<template>
    <div>
        <!--用户信息-->
        <div>
            <div class="header">
                <img
                    slot="left"
                    class="face"
                    :src="helperDetail.userImage"
                >
                <div class="intro">
                    <div class="detail">
                        <span class="user-type" v-if="helperDetail.type">
                            <template v-if="helperDetail.type !== 3">
                                {{ USER_TYPE[helperDetail.type] && USER_TYPE[helperDetail.type].split('')[0] }}
                            </template>
                            <template v-else>
                                {{ helperDetail.other && helperDetail.other.split('')[0] }}
                            </template>
                        </span>
                        <span
                            slot="right-top"
                            class="name"
                            v-text="helperDetail.nickName"
                        />
                        <template>
                            <pl-svg v-if="helperDetail.gender === 2" name="icon-women-be552" width="10" height="10" />
                            <pl-svg v-if="helperDetail.gender === 1" name="icon-man-8b747" width="10" height="10" />
                        </template>
                    </div>
                    <div class="role-type">Helper会员</div>
                </div>
                <div class="info-list">
                    <Field
                        title="手机号："
                        :text="helperDetail.mobile"
                    />
                    <Field
                        title="姓名："
                        :text="helperDetail.name || '--'"
                    />
                    <Field
                        title="地址："
                        :text="helperDetail.address || '--'"
                    />
                    <Field
                        title="来源："
                        :text="helperDetail.source"
                    />
                    <div class="tag-list">
                        <span>标签：</span>
                        <span class="tags" v-if="helperDetail.tags && helperDetail.tags.length">
                            <span v-for="item in helperDetail.tags" :key="item.id">{{ item && item.tagName }} </span>
                        </span>
                        <a @click="showAddTagDialog = true">
                            编辑
                        </a>
                    </div>
                    <div class="record">
                        <span>记录：</span>
                        <div class="list" v-if="helperDetail.logs && helperDetail.logs.length">
                            <p v-for="item in helperDetail.logs" :key="item.id">
                                {{ item }}
                            </p>
                        </div>
                    </div>
                    <div class="tag-list">
                        <span>所属账号：</span>
                        <span class="tags">{{ helperDetail.ownedUser }}</span>
                        <a @click="showChangeOwnerDialog = true">
                            更改所属账号
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!--统计数据-->
        <div class="statistics">
            <h3 class="title">Helper推广数据</h3>
            <ul class="info">
                <li>
                    <p>支付订单</p>
                    <b>{{ statistics.totalOrder || 0 }}</b>
                    <span>自购{{ statistics.selfBuyOrder || 0 }} <i>分享{{ statistics.shareOrder || 0 }}</i> </span>
                </li>
                <li>
                    <p>支付总额</p>
                    <b>{{ statistics.totalAmount / 100 || 0 }}</b>
                    <span>自购{{ statistics.selfBuyAmount / 100 || 0 }} <i>分享{{ statistics.shareAmount / 100 || 0 }}</i> </span>
                </li>
                <li>
                    <p>获得润笔</p>
                    <b>{{ statistics.rebateAmount / 100 || 0 }}</b>
                    <span>未提现润笔{{ statistics.pendingWithdrawal / 100 || 0 }}元</span>
                </li>
            </ul>
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
                                prop="categoryName"
                                label="产品类型"
                            />
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
                                prop="orderStatus"
                                label="订单状态"
                            />
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
                                prop="categoryName"
                                label="产品类型"
                            />
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
                                prop="orderStatus"
                                label="订单状态"
                            />
                            <el-table-column
                                prop="orderStatus"
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
                                prop="mobile"
                                label="手机号"
                            />
                            <el-table-column
                                prop="withdrawalAmount"
                                label="提现金额（元）">
                                <template #default="{ row }">
                                    {{ row.withdrawalAmount / 100 }}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column
                                prop="amount"
                                label="剩余润笔（元）">
                                <template #default="{ row }">
                                    {{ row.amount / 100 }}
                                </template>
                            </el-table-column> -->
                            <el-table-column
                                prop="status"
                                label="提现状态"
                            />
                            <el-table-column
                                prop="createTime"
                                label="申请时间"
                            />
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

        <!-- 添加标签 -->
        <AddTags
            :show.sync="showAddTagDialog"
            :current-member="helperDetail"
            @confirm="getHelperDetail"
        />

        <!--更改所属账号-->
        <ChangeOwnerDialog
            :show.sync="showChangeOwnerDialog"
            :current-user-id="userId"
            :current-user-info="helperDetail"
            @success="getHelperDetail"
        />
    </div>
</template>

<script  lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Field from '../../../../components/common/base/Field.vue'
import ChangeOwnerDialog from '../components/Change-Owner-Dialog.vue'
import AddTags from '../../member-manage/components/Add-Tags.vue'
import {
    getHelperDetail,
    getHelperStatistics,
    getWithdrawalRecords,
    getOrderList
} from '../../../../apis/member'

  @Component({
      components: {
          Field,
          ChangeOwnerDialog,
          AddTags
      }
  })
export default class HelperPromoteDetail extends Vue {
    @Prop(String) readonly id!: string
    @Prop(String) readonly mallUserId!: string

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
            const { result } = await getHelperStatistics(this.userId)
            this.statistics = result || {}
        } catch (e) {
            throw e
        }
    }

    // 当前所在的tab页
    tabName = this.TAB_LIST[0].name

    // 切换Tab页面
    tabClick (data: DynamicObject) {
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
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    async getOrderList () {
        try {
            this.orderListForm.mallUserId = this.userId
            const { result: { records, total } } = await getOrderList(this.orderListForm)
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
            const { result: { records, total } } = await getOrderList(this.orderListForm)
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
