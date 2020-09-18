<template>
    <div :class="$style.accountManage" class="wrap">
        <div :class="$style.accountInfo">
            <div :class="$style.head">
                <div :class="$style.label">账号管理</div>
                <div :class="$style.desc">您可新增管理机构店铺的账号了</div>
            </div>
            <div :class="$style.content">
                <div>
                    <el-button
                        round
                        type="primary"
                        @click="$router.push({ name: 'AddAccount', params: { mode: 'EMPLOYEE' } })"
                    >
                        添加账号
                        <i class="el-icon-plus" />
                    </el-button>
                </div>
                <div :class="$style.infoBox">
                    <div :class="$style.title">
                        企业管理员
                        <el-tooltip placement="top">
                            <template #content>
                                账号是包括角色为企业管理员、高级管理员或自子账号的所有账号；<br>
                                其中超级管理员仅关联1个账号；
                            </template>
                            <div :class="$style.descTip">?</div>
                        </el-tooltip>
                    </div>
                    <div :class="$style.account">
                        <div :class="$style.number">
                            账号：{{ enterpriseAdminModel.mobile }}
                            <!-- <span :class="$style.tip">当前账号</span> -->
                        </div>
                        <div :class="$style.name">姓名：{{ enterpriseAdminModel.name }}</div>
                    </div>
                </div>
                <div :class="$style.infoBox">
                    <div :class="$style.title">
                        普通账号
                        <el-tooltip placement="top">
                            <template #content>
                                高级管理员角色至多可关联4个账号，高级管理员角色拥有除<br>
                                不可管理企业管理员之外的店铺最高管理操作权限；<br>
                                子账号至多可添加 {{ employeeModel.maxCount }} 个，支持自定义配置权限
                            </template>
                            <div :class="$style.descTip">?</div>
                        </el-tooltip>
                        <span style="font-size: 12px; color: #999999">至多可设置4个超高级管理员</span>
                    </div>
                    <Progress
                        :percentage="currentCount / maxCount * 100"
                        :show-text="true"
                        :text="`${currentCount}/${maxCount}`"
                        style="margin-top: 18px"
                    />
                </div>
            </div>
        </div>

        <search-box label-width="85px">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filter.searchContent"
                    @change="search"
                    placeholder="请输入真实姓名或手机号"
                    :clearable="true"
                />
            </el-form-item>
            <el-form-item label="角色：">
                <el-select
                    v-model="filter.roleCode"
                    @change="search"
                    :clearable="true"
                >
                    <el-option
                        :label="option.label"
                        :value="option.value"
                        v-for="option in roleOptions"
                        :key="option.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间：">
                <date-range
                    @change="dateRangeChange"
                    :clearable="true"
                    separator="至"
                    start-label="创建时间:"
                    end-label=""
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                    style="width:98px"
                >
                    查询
                </el-button>
            </el-form-item>
        </search-box>

        <pl-tabs
            class="mt-24 mb-24"
            :value="filter.status"
            :tabs="tabs"
            @tabClick="tabClick"
        />

        <div>
            <el-table :data="table">
                <el-table-column
                    prop="realName"
                    label="真实姓名"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-if="isEdit"
                            v-model="account.realName"
                        />
                        <div v-else>
                            {{ scope.row.realName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号（登录账户）"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-if="isEdit"
                            v-model="account.mobile"
                        />
                        <div v-else>
                            {{ scope.row.mobile }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="position"
                    label="职位"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-if="isEdit"
                            v-model="account.position"
                        />
                        <div v-else>
                            {{ scope.row.position }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    label="角色"
                >
                    <template slot-scope="scope">
                        <el-select
                            v-if="isEdit"
                            v-model="account.roleCode"
                        >
                            <el-option
                                label="高级管理员"
                                value="ADMIN"
                            />
                            <el-option
                                label="普通管理员"
                                value="ADMIN"
                            />
                            <el-option
                                label="子账号"
                                value="EMPLOYEE"
                            />
                        </el-select>
                        <div v-else>
                            {{ scope.row.roleName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="lockStatusText"
                    label="状态"
                />
                <el-table-column
                    prop="operator"
                    label="操作人"
                />
                <el-table-column
                    v-if="filter.status !== '3'"
                    prop="helperCount"
                    label="发展helper"
                />
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                >
                    <template slot-scope="scope">
                        {{ scope.row.createTime | dateFormat("YYYY-MM-DD hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="100"
                >
                    <template slot-scope="{ row }">
                        <Operating>
                            <template slot="button-box">
                                <a
                                    v-if="!canEdit(row) && row.lockStatus"
                                    @click="downgradeAccount(row)"
                                >
                                    降级
                                </a>
                                <a
                                    v-if="isEdit"
                                    @click="toSave"
                                >
                                    保存
                                </a>
                                <a
                                    @click="goDetail(row, userId === row.userId, (row.roleCode === 'EMPLOYEE' && currentRoleCode === 'ADMIN') || (currentRoleCode === 'ENTERPRISE_ADMIN'))"
                                >
                                    查看
                                </a>
                                <div :class="$style.switchBox">
                                    <el-switch
                                        :disabled="canEdit(row)"
                                        v-model="row.lockStatus"
                                        @change="switchChange(row)"
                                        active-color="#4F63FF"
                                        :active-value="1"
                                        :inactive-value="0"
                                    />
                                    <span v-if="row.lockStatus" style="color: #4F63FF">
                                        启用
                                    </span>
                                    <span v-else style="color: #ccc">
                                        关闭
                                    </span>
                                </div>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                :total="total"
                :size="filter.size"
                v-model="filter.current"
                @change="getAccounts"
            />
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import {
    AccountInfo,
    getAccounts,
    getNotActiveAccounts,
    deleteAccount,
    enableAccount,
    downgradeAccount,
    editAccount
} from '../../../../apis/account'
import Progress from './../components/Progress.vue'

interface AccountData {
    searchContent: string;
    idCard: string;
    position: string;
    roleCode: string;
}

const user = namespace('user')

class Account implements AccountData {
  searchContent = ''
  idCard = ''
  position = ''
  roleCode = ''
  constructor (account: AccountData | null) {
      if (account) {
          const { searchContent, idCard, position, roleCode } = account
          this.searchContent = searchContent
          this.idCard = idCard
          this.position = position
          this.roleCode = roleCode
      }
  }
}

@Component({
    components: {
        Progress
    }
})
export default class AccountList extends Vue {
    @user.Getter userId!: string;
    @user.Getter currentRoleCode!: string;

    tabs = [
        { label: '已启用', name: '1' },
        { label: '已禁用', name: '0' },
        { label: '待激活', name: '3' }
    ]

    roleOptions = [
        { label: '全部', value: '' },
        { label: '高级管理员', value: 'ADMIN' },
        { label: '子账号', value: 'EMPLOYEE' }
    ]

    total = 0
    isEdit = false
    currentTab = '1'
    dateRange = []
    table = []

    account = new Account(null)
    enterpriseAdminModel = {
        mobil: '',
        name: ''
    }

    filter = {
        current: 1,
        size: 10,
        status: '1',
        roleCode: '',
        createdTime: '',
        searchContent: '',
        startTime: '',
        endTime: ''
    }

    adminModel = {
        currentCount: 0,
        maxCount: 1
    }

    employeeModel = {
        currentCount: 0,
        maxCount: 1
    }

    async created () {
        await Promise.all([
            this.getAccounts(),
            this.getAccountInfo()
        ])
    }

    get maxCount () {
        return this.employeeModel.maxCount + this.adminModel.maxCount
    }

    get currentCount () {
        return this.employeeModel.currentCount + this.adminModel.currentCount
    }

    private async getAccountInfo () {
        const { result } = await AccountInfo()
        const { adminModel, employeeModel, enterpriseAdminModel } = result
        this.adminModel = adminModel
        this.employeeModel = employeeModel
        enterpriseAdminModel.idCard = enterpriseAdminModel.idCard.replace(/^(\d{6})\d{8}(\d+)/, '$1********$2')
        enterpriseAdminModel.mobile = enterpriseAdminModel.mobile.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
        this.enterpriseAdminModel = enterpriseAdminModel
    }

    private canEdit (row: DynamicObject) {
        return this.userId === row.userId || (row.roleCode === this.currentRoleCode) || (row.currentRoleCode === 'EMPLOYEE') || (row.roleCode === 'ADMIN' && this.currentRoleCode !== 'ENTERPRISE_ADMIN')
    }

    private async pageChange (page: number) {
        this.filter.current = page
        await this.getAccounts()
    }

    private async getAccounts () {
        const {
            current,
            size,
            status,
            searchContent,
            startTime,
            endTime,
            roleCode
        } = this.filter

        let result
        // 未激活
        if (status === '3') {
            const { result: res } = await getNotActiveAccounts({
                current,
                size,
                searchContent,
                startTime,
                endTime,
                roleCode
            })
            result = res
        } else {
            const { result: res } = await getAccounts({
                current,
                size,
                status,
                searchContent,
                startTime,
                endTime,
                roleCode
            })
            result = res
        }
        this.table = result.records
        this.total = result.total
    }

    private async tabClick (data) {
        this.filter.status = data.name
        await this.search()
    }

    private async search () {
        this.filter.current = 1
        await this.getAccounts()
    }

    private async goDetail (row: any, selfEdit: boolean, canEdit: boolean) {
        const { mobile, userId, roleCode } = row
        const data: any = {
            name: 'AccountDetail',
            query: {
                mobile,
                userId,
                roleCode,
                selfEdit,
                canEdit
            }
        }
        await this.$router.push(data)
    }

    private async deleteAccount (row: any) {
        await this.$confirm('删除后将无法恢复！')
        await deleteAccount(row)
        this.$success('删除成功')
        this.filter.current = 1
        await this.getAccounts()
    }

    private async dateRangeChange (value: any) {
        this.filter.current = 1
        const { end, start } = value
        this.filter.startTime = start
        this.filter.endTime = end
        await this.getAccounts()
    }

    private async downgradeAccount (row: { roleCode: 'EMPLOYEE' | 'ADMIN'; userId: string }) {
        const { roleCode, userId } = row
        const roleMap = {
            EMPLOYEE: '子账号',
            ADMIN: '高级管理员'
        }
        await this.$confirm({
            title: '确认降级此账户？',
            message: `降级后，所属该${ roleMap[roleCode] }的所有helper用户，将自动更新所属账号为“企业管理员”！`
        })
        await downgradeAccount({ roleCode, userId })
        this.$success('降级成功')
        this.filter.current = 1
        await this.getAccounts()
    }

    private editAccount (data: AccountData) {
        return editAccount(data)
    }

    private async toSave () {
        try {
            await this.editAccount(this.account)
            this.isEdit = !this.isEdit
            this.$success('编辑成功')
            this.filter.current = 1
            await this.getAccounts()
        } catch (e) {
            this.isEdit = !this.isEdit
            throw e
        }
    }

    private async switchChange (row: any) {
        const { roleCode, userId, lockStatus } = row
        const params = { roleCode, userId, lockStatus }
        if (row.lockStatus) {
            const res = await enableAccount(params)
            if (!res.result) {
                row.lockStatus = 0
                this.$alert({
                    title: '名额已满',
                    message: `当前${ row.roleName }名额已满，如若设置请先禁用其他管理员。`,
                    cancelButtonText: ''
                })
                return
            }
            this.$success('启用成功')
            row.lockStatusText = '已启用'
        } else {
            row.lockStatus = 1
            await this.$confirm('确认禁用此账户吗？')
            await enableAccount(params)
            this.$success('禁用成功')
            row.lockStatusText = '已禁用'
            row.lockStatus = 0
        }
    }
}

</script>

<style lang="scss" module>
.account-manage {
    .desc-tip {
        display: inline-block;
        margin: 0 20px 0 10px;
        width: 16px;
        line-height: 16px;
        border-radius: 50%;
        font-size: 12px;
        text-align: center;
        color: #fff;
        background-color: #999;
        cursor: pointer;
    }
    > .account-info {
        > .head {
            display: flex;
            align-items: baseline;
            > .label {
                font-size: 16px;
                font-weight: 600;
            }
            > .desc {
                margin-left: 20px;
                font-size: 12px;
                color: #999;
            }
        }
        > .content {
            display: flex;
            margin: 35px 0;
            > .info-box {
                margin-left: 80px;
                font-size: 14px;
                > .account {
                    display: flex;
                    margin-top: 18px;
                    > .number {
                        margin-right: 76px;
                        > .tip {
                            margin-left: 12px;
                            padding: 3px 5px;
                            border: 1px solid #4f63ff;
                            border-radius: 2px;
                            font-size: 12px;
                            color: #4f63ff;
                        }
                    }
                }
            }
        }
    }
    .switch-box {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        > span {
            margin-left: 12px;
        }
    }
}

</style>
