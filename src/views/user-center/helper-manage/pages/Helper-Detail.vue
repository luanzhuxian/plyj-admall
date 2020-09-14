<template>
    <div class="member-detail">
        <top-back />
        <div class="container bg-white mt-20">
            <div class="header">
                <div
                    class="member-type"
                    v-text="role[form.roleCode]"
                />
                <Card class="info">
                    <img
                        slot="left"
                        class="face"
                        :src="detail.avatarUrl"
                    >
                    <span
                        slot="right-top"
                        class="name"
                        v-text="detail.nickName"
                    />
                    <span
                        v-if="fromRouteName !== 'MemberList'"
                        slot="right-bottom"
                        class="ownner-name"
                    >
                        所属账号：{{ detail.ownnerName }}
                    </span>
                    <span
                        v-if="this.form.roleCode === 'HELPER' && detail.agentStatus === 'PASS'"
                        slot="right-top"
                        class="is-helper"
                    >Helper</span>
                    <!--<span class="level" slot="right-bottom" style="margin-right: 20px;">等级：1</span>-->
                    <!--<span class="level" slot="right-bottom">贡献值：1</span>-->
                </Card>
            </div>

            <div class="info-list">
                <Field
                    title="真实姓名："
                    :text="detail.realName"
                />
                <Field
                    title="手机号："
                    :text="detail.mobile"
                />
                <Field
                    title="昵称："
                    :text="detail.nickName"
                />
                <!-- <Field title="职位：" :text="detail.position" /> -->
                <Field
                    title="生日："
                    :text="detail.birth"
                />
                <Field
                    title="年龄："
                    :text="detail.age"
                />
                <Field
                    title="地址："
                    :text="detail.address"
                />
                <Field
                    v-if="fromRouteName === 'HelperList'"
                    title="身份证号："
                    :text="detail.idCard"
                />
                <Field
                    title="加入时间："
                    :text="detail.createTime"
                />
            </div>
        </div>

        <div class="order-detail container" v-if="detail.agentStatus === '1' && detail.auditStatus === 'PASS'">
            <div class="content">
                <div class="content-title">
                    支付订单
                </div>
                <div class="content-num">
                    <span>{{ orderRebateInfoData.orderTotal }}</span>单
                </div>
                <div class="content-detail">
                    自购：{{ orderRebateInfoData.selfOrderTotal }}单
                </div>
                <div class="content-detail">
                    分享：{{ orderRebateInfoData.shareOrderTotal }}单
                </div>
            </div>
            <div class="content">
                <div class="content-title">
                    营收总额
                </div>
                <div class="content-num">
                    <span>{{ orderRebateInfoData.incomeTotal/100 }}</span>元
                </div>
                <div class="content-detail">
                    自购订单金额：￥{{ orderRebateInfoData.selfIncome/100 }}
                </div>
                <div class="content-detail">
                    分享订单金额：￥{{ orderRebateInfoData.shareIncome/100 }}
                </div>
            </div>
            <div class="content">
                <div class="content-title">
                    获得润笔
                </div>
                <div class="content-num">
                    <span>{{ orderRebateInfoData.rebateTotal/100 }}</span>元
                </div>
                <div class="content-detail">
                    未提现润笔：￥{{ orderRebateInfoData.noWithdrawRebateTotal/100 }}
                </div>
            </div>
        </div>

        <div class="container bg-white mt-20"
             v-if="detail.operationLogs&&detail.operationLogs.length && from === 'audit'">
            <span class="audit-title">
                审核信息
            </span>
            <div class="audit-detail-list" v-for="(item,index) in detail.operationLogs" :key="index">
                <span class="detail-list-time">{{ item.createTime }}</span>
                <span class="detail-list-person">
                    操作人：
                    <span class="list-person-name">
                        {{ item.operationUserName }}
                    </span>
                </span>
                <span class="detail-list-result" :class="[item.description === '成为Helper' ? 'color-orange' : '']">
                    {{ item.description }}
                </span>
            </div>
        </div>
        <div v-if="from === 'List' || from === 'HelperList'" class="container bg-white mt-20">
            <el-tabs v-model="activeName">
                <el-tab-pane label="订单记录" name="first">
                    <el-form inline>
                        <el-form-item>
                            <el-input style="width: 200px" @change="searchQueryMemberOrders"
                                      v-model="orderForm.condition" placeholder="请输入订单号/商品名称" clearable />
                        </el-form-item>
                        <el-form-item label="订单来源">
                            <el-select v-model="orderForm.orderSource" clearable @change="searchQueryMemberOrders">
                                <el-option
                                    v-for="item in orderSourceList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单类型">
                            <el-select v-model="orderForm.orderType" clearable @change="searchQueryMemberOrders">
                                <el-option
                                    v-for="item in orderTypeList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchQueryMemberOrders">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="orderList" ref="table">
                        <el-table-column prop="orderId" label="订单号" width="170" />
                        <el-table-column prop="goodsName" label="商品名称" />
                        <!--            <el-table-column label="商品名称">-->
                        <!--              <template v-slot="{ row }">-->
                        <!--                <div v-if="row.products.length > 0">-->
                        <!--                  {{ row.products[0].productName }}-->
                        <!--                </div>-->
                        <!--                <div v-else>-->
                        <!--                  共{{ row.products.length }}件商品-->
                        <!--                  <pl-svg class="icon-paixujiantoushang" name="icon-paixujiantoushang" fill="#666" width="12" @click="toggleRowExpansion(row)" />-->
                        <!--                </div>-->
                        <!--              </template>-->
                        <!--            </el-table-column>-->

                        <!--            <el-table-column type="expand">-->
                        <!--              <template v-slot="{ row }">-->
                        <!--                <el-table v-if="row.products.length > 1" :data="row.products" :show-header="false">-->
                        <!--                  <el-table-column width="170" />-->
                        <!--                  <el-table-column prop="productName" />-->
                        <!--                  <el-table-column prop="count" width="60" />-->
                        <!--                  <el-table-column prop="productPrice" width="70" />-->
                        <!--                  <el-table-column prop="price" width="80" />-->
                        <!--                  <el-table-column prop="realRebate" width="80" />-->
                        <!--                  <el-table-column width="80" />-->
                        <!--                  <el-table-column width="80" />-->
                        <!--                  <el-table-column width="100" align="center" />-->
                        <!--                </el-table>-->
                        <!--              </template>-->
                        <!--            </el-table-column>-->

                        <el-table-column prop="goodsNum" label="数量" width="60" />
                        <el-table-column prop="goodsPrice" label="单价（元）" width="80">
                            <template #default="{row}">
                                {{ row.goodsPrice/100 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="实付款" width="80">
                            <template #default="{row}">
                                {{ row.amount/100 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="获得润笔（元）" width="120">
                            <template #default="{row}">
                                {{ row.rebate/100 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderStatus" label="订单状态" width="80">
                            <template #default="{row}">
                                <span v-if="row.orderStatus === 'WAIT_RECEIVE' && (row.orderType === 'VIRTUAL_GOODS' || row.orderType === 'FORMAL_CLASS' || row.orderType === 'EXPERIENCE_CLASS')">
                                    待使用
                                </span>
                                <span v-else>
                                    {{ orderStatusText[row.orderStatus] }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderSourceText" label="订单来源" width="80" />
                        <el-table-column prop="createTime" label="下单时间" width="100" align="center" />
                    </el-table>
                    <Pagination v-show="orderTotal" :total="orderTotal" v-model="orderForm.current"
                                :size="orderForm.size" @change="getOrderList" />
                </el-tab-pane>
                <el-tab-pane label="提现记录" name="second" v-if="from === 'HelperList'">
                    <el-form inline>
                        <el-form-item class="mb-0 ml-40">
                            <date-range
                                :clearable="true"
                                disable-after
                                @change="depositDateChange"
                                type="datetime"
                                size="small"
                                start-label="申请时间："
                                range-separator="至"
                                end-label=""
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getOrderList">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="withdrawData" ref="withdrawTable">
                        <el-table-column prop="userName" label="Helper" />
                        <el-table-column prop="nickName" label="微信昵称" />
                        <el-table-column prop="mobile" label="手机号" width="120" />
                        <el-table-column prop="price" label="提现金额（元）" width="120" />
                        <el-table-column prop="balance" label="剩余润笔（元）" width="120" />
                        <el-table-column prop="createTime" label="申请时间" width="150" />
                    </el-table>
                    <Pagination v-show="withdrawTotal" :total="withdrawTotal" v-model="withdrawForm.current"
                                :size="withdrawForm.size" @change="getQueryMemberDeposit" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

import Field from '../../../../components/common/Field.vue'
import Card from '../../../../components/common/Card.vue'
import { getMemberDetail, getOrderList, orderRebateInfo, queryMemberDeposit } from '../../../../apis/member'

  @Component({
      components: {
          Field,
          Card
      }
  })

export default class MemberManageDetail extends Vue {
    // 数据
    formRouteName = ''
    form = {
        roleCode: '',
        mallUserId: ''
    }

    // 从列表来的还是从审核列表来的，'list' or 'audit'
    from = ''
    detail = {}
    data = []
    backRoute = ''
    role = {
        MEMBERSHIP: '普通会员',
        HELPER: 'Helper'
    }

    orderList = []
    orderForm = {
        current: 1,
        size: 10,
        userId: '',
        orderSource: '',
        condition: '',
        orderType: ''
    }

    orderSourceList = [
        { value: '', label: '全部' },
        { value: '1', label: '自购' },
        { value: '2', label: '分享' }
    ]

    orderSourceText = {
        '': '全部',
        1: '自购',
        2: '分享'
    }

    orderTypeList = [
        { value: '', label: '全部' },
        { value: 'PHYSICAL_GOODS', label: '实体商品' },
        { value: 'VIRTUAL_GOODS', label: '虚拟商品' },
        { value: 'EXPERIENCE_CLASS', label: '体验课' },
        { value: 'FORMAL_CLASS', label: '正式课' },
        { value: 'KNOWLEDGE_COURSE', label: '知识课程' },
        { value: '"SERIES_OF_COURSE', label: '系列课' },
        { value: '"LIVE_GOODS', label: '直播订单' },
        { value: 'VIDEO_GOODS', label: '录播订单' }
    ]

    orderStatusText = {
        ALL_ORDER: '全部订单',
        WAIT_SHIP: '待发货',
        WAIT_RECEIVE: '待收货',
        WAIT_PAY: '待付款',
        WAIT_PAY_TAIL_MONEY: '待付尾款',
        FINISHED: '订单完成',
        CLOSED: '订单关闭'
    }

    userId = ''
    withdrawData = []
    withdrawForm = {
        current: 1,
        size: 10,
        startTime: '',
        endTime: '',
        keyword: ''
    }

    withdrawTotal = 0
    orderTotal = 0
    activeName = 'first'
    orderRebateInfoData = {}
    // 生命周期函数
    async created () {
        const { roleCode, id, fromRouteName } = this.$route.params
        this.from = this.$route.query.from
        this.fromRouteName = fromRouteName
        this.form.mallUserId = id
        this.form.roleCode = roleCode
        await this.getMemberDetail()
        await this.getOrderRebateInfo(this.userId)
        if (this.from === 'HelperList') {
            this.getQueryMemberDeposit()
        }
    }

    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.backRoute = from.name
        })
    }

    // methods
    async getMemberDetail () {
        try {
            const { data: res } = await getMemberDetail(this.form)
            if (res.result && res.result.idCard) {
                res.result.idCard = res.result.idCard.replace(/^(\d{4})\d{9}(\d+)/, '$1*********$2')
            }
            this.detail = res.result || {}
            this.orderForm.userId = res.result.userId
            this.userId = res.result.userId
            this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    searchQueryMemberOrders () {
        this.orderForm.current = 1
        this.getOrderList()
    }

    async getOrderList () {
        try {
            const { data: { result } } = await getOrderList(this.orderForm)
            console.log(result)
            this.orderList = result.records
            this.orderTotal = result.total
        } catch (e) {
            throw e
        }
    }

    toggleRowExpansion (row) {
        row.expanded = !row.expanded
        this.$refs.table.toggleRowExpansion(row, row.expanded)
    }

    async getOrderRebateInfo (userId) {
        const { data: res } = await orderRebateInfo({ userId })
        this.orderRebateInfoData = res.result
    }

    async getQueryMemberDeposit () {
        this.withdrawForm.keyword = this.userId
        const { data: res } = await queryMemberDeposit(this.withdrawForm)
        this.withdrawData = res.result.records
        this.withdrawTotal = res.result.total
    }

    depositDateChange ({ start, end }) {
        this.withdrawForm.current = 1
        if (start) {
            this.withdrawForm.startTime = new Date(start).getTime()
        } else {
            this.withdrawForm.startTime = start
        }
        if (end) {
            this.withdrawForm.endTime = new Date(end).getTime()
        } else {
            this.withdrawForm.endTime = end
        }
        this.getQueryMemberDeposit()
    }
}
</script>

<style scoped lang="scss">
    .container {
        width: 64%;
        margin: 0 auto;
        padding: 32px 56px;

        .header {
            .member-type {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 24px;
            }

            .face {
                width: 62px;
                height: 62px;
                border-radius: 50%;
                object-fit: cover;
            }

            .name {
                margin-right: 20px;
                font-size: 20px;
                font-weight: bold;
            }

            .ownner-name {
                font-size: 12px;
                font-weight: bold;
                line-height: 16px;
                color: rgba(236, 116, 46, 1);
            }

            .is-helper {
                padding: 2px 4px;
                border: 1px solid $--color-primary-orange;
                font-size: 12px;
                color: $--color-primary-orange;
            }

            .level {
                color: $--color-primary-orange;
                font-weight: bold;
            }
        }

        .info-list {
            margin-top: 32px;
            font-size: 16px;
        }

        .audit-title {
            display: inline-flex;
            font-size: 18px;
            font-weight: bold;
            color: #5A5A5A;
            padding-bottom: 10px;
        }

        .audit-detail-list {
            color: #333333;
            font-size: 16px;
            display: flex;
            padding: 10px 0;

            .color-orange {
                color: #EC742E;
            }

            .detail-list-time {
                width: 25%;
                font-weight: bold;
            }

            .detail-list-person {
                width: 25%;

                .list-person-name {
                    font-weight: bold;
                }
            }

            .detail-list-result {
                width: 50%;
            }
        }
    }

    .icon-paixujiantoushang {
        display: inline-block;
        transform: rotate(180deg) !important;
        cursor: pointer;
        vertical-align: -2px;
    }

    ::v-deep .el-table__expanded-cell {
        padding: 0;
    }

    ::v-deep .el-table__expand-icon {
        display: none;
    }

    .order-detail {
        display: flex;
        padding: 20px;
        margin-top: 24px;
        background-color: #FFFFFF;

        .content {
            width: 300px;
            border-right: 1px solid #E7E7E7;
            padding: 15px 10px 15px 35px;

            .content-title {
                color: #333333;
                font-size: 18px;
                font-weight: bold;
            }

            .content-num {
                padding: 20px 0;
                font-size: 14px;
                color: #666666;

                span {
                    font-size: 50px;
                    color: #333333;
                    font-weight: 400;
                    padding-right: 14px;
                }
            }

            .content-detail {
                font-size: 14px;
                font-weight: 400;
                color: #598BF8;
            }
        }

        .content:last-child {
            border: none;
        }
    }
</style>00.
