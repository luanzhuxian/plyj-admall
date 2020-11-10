<template>
    <div class="account-single">
        <div class="box-card box-card-info">
            <div class="avatar-info">
                <img
                    class="rounded-circle"
                    style="width: 88px;height: 88px;border-radius: 50%;"
                    :src="single.avatarUrl || 'https://mallcdn.youpenglai.com/static/admall-new/3.0.0/yonghu.png'"
                    slot="label"
                >
                <div class="base-info">
                    <div class="font-18 font-weight-bold">
                        {{ single.nickName }} <span style="font-weight: 400">({{ single.lockStatus? '开启':'禁用' }})</span>
                    </div>
                    <div class="font-16">
                        {{ single.position }}
                    </div>
                </div>
            </div>
            <el-form label-position="left" class="account-info">
                <el-form-item>
                    <div
                        slot="label"
                        class="font-16"
                    >
                        职位:
                    </div>
                    <div class="font-16">
                        {{ single.position }}
                    </div>
                </el-form-item>
                <el-form-item>
                    <div
                        slot="label"
                        class="font-16"
                    >
                        联系方式:
                    </div>
                    <div class="font-16">
                        {{ single.mobile }}
                    </div>
                </el-form-item>
                <el-form-item>
                    <div
                        slot="label"
                        class="font-16"
                    >
                        创建时间:
                    </div>
                    <div class="font-16">
                        {{ single.createTime }}
                    </div>
                </el-form-item>
                <el-form-item>
                    <div
                        slot="label"
                        class="font-16"
                    >
                        管理权限:
                    </div>
                    <div class="font-16">
                        <el-button type="text" @click="viewTree" v-if="canEdit || (selfEdit && currentRoleCode === 'ADMIN')">
                            查看
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div class="edit-box">
                <!-- <span>{{ single.roleName }} </span> -->
                <el-button type="primary" round plain v-if="canEdit" :disabled="!single.lockStatus" @click="edit">
                    编辑
                </el-button>
            </div>
        </div>
        <div class="box-card">
            <div class="fz-16 font-weight-bold">发展Helper ( {{ total }} ) 人</div>
            <el-table :data="helpers">
                <el-table-column
                    prop="userId"
                    label="ID"
                    width="170"
                />
                <el-table-column label="头像">
                    <template #default="{ row }">
                        <img
                            class="rounded-circle"
                            style="height:62px;"
                            :src="row.avatarUrl"
                            alt=""
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    prop="realName"
                    label="真实姓名"
                />
                <el-table-column
                    prop="createTime"
                    label="时间"
                    width="160"
                />
                <el-table-column width="300">
                    <template slot-scope="{row}">
                        <el-button size="mini" @click="showChangeBelongBox(row)">
                            更改所属账号
                        </el-button>
                        <el-button size="mini" @click="$router.push({ name: 'HelperPromoteDetail', params: { id: row.id, mallUserId: row.mallUserId } })">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-show="total" :total="total" :size="listForm.size" v-model="listForm.current" @change="getHelperList" />
        </div>

        <role-tree
            :visible.sync="visible"
            :tree-list="treeList"
            :show-checkbox="treeEdit"
        />

        <!--更改所属账号-->
        <ChangeOwnerDialog
            :show.sync="showChangeDialog"
            :helper-ids="currentUserIds"
            :current-user-info="currentUserInfo"
            @success="showChangeDialog = false; getHelperList()"
        />

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item label="搜索关键词" prop="condition">
                    <el-input
                        v-model.trim="exportData.condition"
                        placeholder="输入订单号,商品名称,helper"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="orderSource" label="订单来源">
                    <el-select style="width: 140px;" v-model="exportData.orderSource" clearable>
                        <el-option v-for="item of orderResource" :value="item.value" :key="item.value" :label="item.label" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-10" label="订单类型：">
                    <el-select style="width: 140px;" v-model="exportData.orderType" clearable>
                        <el-option v-for="item of orderStatus" :value="item.value" :key="item.value" :label="item.label" />
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间" prop="startTime">
                    <el-radio-group @change="exportRangeChange" v-model="exportData.dateRange">
                        <el-radio :label="1">
                            7日内
                        </el-radio>
                        <el-radio :label="2">
                            30日内
                        </el-radio>
                        <el-radio :label="3">
                            自选时间
                        </el-radio>
                    </el-radio-group>
                    <date-range
                        v-if="showExport"
                        style="margin-top: 20px"
                        size="small"
                        ref="exportDatePicker"
                        :disabled-start-time="exportData.dateRange !== 3"
                        :disabled-end-time="exportData.dateRange !== 3"
                        disable-after
                        :init="exportData.startTime ? [exportData.startTime,exportData.endTime] : []"
                        :clearable="true"
                        @change="exportDatechange"
                        range-separator="至"
                        end-label=""
                    />
                </el-form-item>
            </el-form>
        </ExportDialog>

    </div>
</template>

<script lang="ts">
import moment from 'moment'
import RoleTree from '../../../../components/base-setting/account-manage/Role-Tree.vue'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import { getSingleAccount, getSingleAccountHerlerList, getAccounts, getMenuByUser } from '../../../../apis/account'
import { getOrderList, exportOrderDetail } from '../../../../apis/member'
import { createObjectUrl } from '../../../../assets/ts/upload'
import { Vue, Component } from 'vue-property-decorator'
import ChangeOwnerDialog from '../../../user-center/helper-manage/components/Change-Owner-Dialog.vue'
import { LocalEnum } from '../../../../enum/storage'
import { namespace } from 'vuex-class'
const userModule = namespace('user')
@Component({
    components: {
        RoleTree,
        ExportDialog,
        ChangeOwnerDialog
    }
})
export default class AccountDetail extends Vue {
            showExport = false
            exportData = {
                userId: '',
                orderSource: '',
                orderType: '',
                condition: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3,
                startTime: '',
                endTime: ''
            }

            exportRules = {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            }

            table = []
            routeFrom = ''
            total = 0
            single = {}
            helpers = []
            orderResource = [
                { value: 3, label: 'helper自购订单' },
                { value: 4, label: 'helper分享订单' },
                { value: 5, label: '自购订单' },
                { value: 6, label: '分享订单' }
            ]

            orderResourceText =
                {
                    3: 'helper自购订单',
                    4: 'helper分享订单',
                    5: '自购订单',
                    6: '分享订单'
                }

            orderStatus = [
                { value: 'VIRTUAL_GOODS', label: '虚拟订单' },
                { value: 'PHYSICAL_GOODS', label: '实体订单' },
                { value: 'FORMAL_CLASS', label: '正式课订单' },
                { value: 'EXPERIENCE_CLASS', label: '体验课订单' },
                { value: 'KNOWLEDGE_COURSE', label: '知识课程' },
                { value: 'SERIES_OF_COURSE', label: '系列课程' },
                { value: 'LIVE_GOODS', label: '直播订单' },
                { value: 'VIDEO_GOODS', label: '录播订单' }
            ]

            activeStatusText = {
                1: '普通订单',
                2: '团购订单',
                3: '秒杀订单',
                4: '预购订单',
                5: '优惠券订单',
                6: '组合课订单',
                7: '公益订单'
            }

            currentUserInfo = {}
            currentUserIds: string[] = []

            orderStatusText = {
                WAIT_SHIP: '待发货',
                WAIT_RECEIVE: '待收货',
                WAIT_PAY: '待付款',
                FINISHED: '订单完成',
                CLOSED: '订单关闭'
            }

            orders = []
            orderTotal = 0
            orderForm = {
                current: 1,
                size: 10,
                startTime: '',
                endTime: '',
                orderSource: '',
                orderType: '',
                condition: '',
                userId: ''
            }

            detailForm = {
                roleCode: '',
                userId: ''
            }

            listForm = {
                userId: '',
                current: 1,
                size: 10
            }

            powerNum = 0
            visible = false
            treeList = []
            treeEdit = false
            // 账户属于列表
            accountList = ''
            showChangeDialog = false

            /* 当前正在修改所属账号的数据id */
            currentUserId = []

            /* 当前选中的表格数据 */
            currentSelect = []
            ownnerUserId = ''

            /* 查询所属账号表单 */
            searchAccountsForm = {
                current: 1,
                size: 200,
                searchContent: ''
            }

            selfEdit = false
            canEdit = false

            @userModule.Getter('currentRoleCode') currentRoleCode!: string

            async created () {
                const scrollWrap = document.querySelector('#main');
                (scrollWrap as HTMLFormElement).scrollTo(0, 0)
                await this.getAccountList()
                const query = JSON.parse(localStorage.getItem(LocalEnum.editAccount) || '')
                this.orderForm.userId = query.userId
                this.detailForm.userId = query.userId
                this.detailForm.roleCode = query.roleCode
                this.listForm.userId = this.detailForm.userId
                this.selfEdit = query.selfEdit
                this.canEdit = query.canEdit
                await this.getData()
                await this.getHelperList()
                // this.getOrderList()
                await this.getMenuByUserFun()
            }

            async getData () {
                const res = await getSingleAccount(this.detailForm)
                this.single = res.result
                // this.treeList = this.single.menuTree
                // let num = 0
                // for (const items of this.single.menuTree[0].children) {
                //   num += items.children.length
                // }
                // this.powerNum = num
            }

            async getHelperList () {
                const helpers = await getSingleAccountHerlerList(this.listForm)
                this.total = helpers.result.total
                this.helpers = helpers.result.records
            }

            orderDateChange ({ start, end }: DynamicObject) {
                this.orderForm.startTime = start
                this.orderForm.endTime = end
                if (start === null) this.orderForm.startTime = ''
                if (end === null) this.orderForm.endTime = ''
                this.getOrderList()
            }

            orderRowClick ({ orderId }: DynamicObject) {
                this.$router.push({ name: 'GoodsOrderDetail', params: { id: orderId } })
            }

            async getOrderList () {
                try {
                    const { result } = await getOrderList(this.orderForm)
                    this.orderTotal = result.total
                    this.orders = result.records
                } catch (e) {
                    throw e
                }
            }

            changeExport () {
                this.exportData = {
                    ...this.exportData,
                    ...this.orderForm
                }
                this.showExport = true
            }

            exportClose () {
                this.exportData = {
                    userId: '',
                    orderSource: '',
                    orderType: '',
                    condition: '',
                    // 1 7日内 2 30日内 3自选
                    dateRange: 3,
                    startTime: '',
                    endTime: ''
                };
                (this.$refs.exportForm as HTMLFormElement).clearValidate()
                this.showExport = false
            }

            async exportDatechange ({ start, end }: DynamicObject) {
                this.exportData.startTime = start
                this.exportData.endTime = end
                if (!start || !end) {
                    return
                }
                await this.$nextTick();
                (this.$refs.exportDatePicker as HTMLFormElement).initDate()
            }

            exportRangeChange (val: number) {
                let start: string | Date = new Date()
                let end: string | Date = new Date()
                const formatType = 'YYYY-MM-DD'

                if (val === 1) {
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                } else if (val === 2) {
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                } else {
                    start = this.orderForm.startTime || ''
                    end = this.orderForm.endTime || ''
                }

                this.exportDatechange({
                    start: start && `${ moment(start).format(formatType) } 00:00:00`,
                    end: end && `${ moment(end).format(formatType) } 23:59:59`
                })
            }

            async exportList () {
                try {
                    await (this.$refs.exportForm as HTMLFormElement).validate()
                    const data = {
                        ...this.exportData
                    }
                    delete data.dateRange
                    const giftList = await exportOrderDetail(data)
                    const url = createObjectUrl(giftList)
                    const aElement = document.createElement('a')
                    aElement.href = url
                    aElement.download = '订单详情.xls'
                    aElement.click()
                    aElement.remove()
                } catch (e) {
                    throw e
                }
            }

            // 展开更多
            toggleRowExpansion (row: DynamicObject) {
                row.expanded = !row.expanded;
                (this.$refs.table as HTMLFormElement).toggleRowExpansion(row, row.expanded)
            }

            viewTree () {
                this.treeEdit = false
                this.visible = !this.visible
            }

            showChangeBelongBox (row: DynamicObject) {
                this.showChangeDialog = true
                this.currentUserInfo = row
                this.currentUserIds = [row.mallUserId]
            }

            async getAccountList () {
                try {
                    const res = await getAccounts(this.searchAccountsForm)
                    this.accountList = res.result.records
                } catch (e) {
                    throw e
                }
            }

            edit () {
                const params: DynamicObject = {
                    userId: this.detailForm.userId,
                    roleCode: this.detailForm.roleCode,
                    selfEdit: this.selfEdit,
                    canEdit: this.canEdit
                }
                this.$router.push({ name: 'EditAccount', query: params })
            }

            async getMenuByUserFun () {
                const data = {
                    roleCode: this.detailForm.roleCode,
                    userId: this.detailForm.userId
                }
                const res = await getMenuByUser(data)
                this.treeList = res.result
            }
}
</script>

<style scoped lang="scss">
.account-single {
    .box-card{
        padding: 36px 40px;
        background: #fff;
        margin-bottom: 10px;
    }
    .box-card-info{
        display: flex;
        .avatar-info{
            display: flex;
            align-items: center;
            margin-right: 50px;
            width: 30%;
            .base-info{
                margin-left: 20px;
            }
        }
        .account-info{
            width: 40%;
        }
    }
    ::v-deep.el-table {
        &:before {
            height: 0px;
        }
        &:hover {
            cursor: pointer;
        }
        .expand-row > .cell {
            display: none;
        }
        .el-table__expanded-cell {
            padding: 20px 0px;
        }
        .discount{
            position: relative;
            display: inline-flex;
            margin-right: 2px;
            margin-left: 4px;
            & .discount-text{
                padding: 0 7px;
                font-size: 12px;
                font-weight: 400;
                color: #FFFFFF;
                background-color: #EC742E;
            }
        }
    }
}
</style>
