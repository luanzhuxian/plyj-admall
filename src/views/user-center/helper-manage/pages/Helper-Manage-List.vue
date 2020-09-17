<template>
    <div class="helper-list">
        <el-form
            :inline="true"
            class="form-filter"
            label-width="96px"
        >
            <el-form-item label="关键词">
                <el-input
                    clearable
                    v-model.trim="form.keyword"
                    placeholder="请输入用户昵称/真实姓名/手机号"
                    @change="search"
                    class="filter-inp"
                />
            </el-form-item>
            <el-form-item
                label="所属账号"
                v-if="currentRoleCode !== 'EMPLOYEE'"
            >
                <el-select
                    v-model="form.ownnerUserId"
                    clearable
                    @change="search"
                >
                    <el-option
                        v-for="(item, index) of accountList"
                        :key="index"
                        :label="item.name"
                        :value="item.baseUserId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="最近登录时间">
                <date-range :init="[form.loginStartTime, form.loginEndTime]"
                            @change="loginTimeRange"
                            disable-after
                            clearable />
            </el-form-item>
            <el-form-item label="加入时间">
                <date-range :init="[form.startTime, form.endTime]"
                            @change="joinTimeRange"
                            disable-after
                            clearable />
            </el-form-item>
            <div class="filter-btns">
                <el-button
                    type="primary"
                    size="mini"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    size="mini"
                    @click="search"
                >
                    导出数据
                </el-button>
                <el-button
                    type="text"
                    size="mini"
                    @click="restForm"
                >
                    清空筛选条件
                </el-button>
            </div>
        </el-form>

        <div class="mt-20">
            已选择{{ currentSelect.length }}个用户
            <el-button
                type="text"
                size="mini"
                :disabled="!currentSelect.length"
                @click="relieveBatched"
            >
                降级
            </el-button>
            <el-button
                type="text"
                size="mini"
                :disabled="!currentSelect.length"
                @click="belongBatched"
            >
                更改所属账号
            </el-button>
        </div>

        <el-table
            @selection-change="selectionChange"
            :data="table"
        >
            <el-table-column
                type="selection"
                align="right"
                width="50"
            />
            <el-table-column label="用户信息">
                <template slot-scope="{row}">
                    <div class="user-info">
                        <img
                            class="avatar"
                            :src="row.userImage"
                            alt=""
                        >
                        <div>
                            <div class="name">
                                {{ row.userName }}
                                <div class="ml-10">
                                    <pl-svg v-if="row.gender === 2" name="icon-women-be552" width="10" height="10" />
                                    <pl-svg v-if="row.gender === 1" name="icon-man-8b747" width="10" height="10" />
                                </div>
                            </div>
                            <ul class="tag">
                                <li v-for="(tag, k) in row.userTags" :key="k">
                                    {{ tag }}
                                </li>
                                <li v-if="row.userTags.length >= 3">
                                    <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="hover">
                                        <ul class="tag" slot="content">
                                            <li v-for="(tag, k) in row.userTags" :key="k">
                                                {{ tag }}
                                            </li>
                                        </ul>
                                        更多
                                    </el-popover>
                                </li>
                            </ul>
                        </div>
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机（账户）"
            />
            <el-table-column
                label="所属账号"
            >
                <template slot-scope="{row}">
                    {{ row.ownedUser }}
                    <span class="acc-label">{{ row.ownedRoleCode === 'ENTERPRISE_ADMIN' ? '企' : '高' }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="lastLoginTime"
                label="最近登录时间"
            />
            <el-table-column
                prop="createTime"
                label="加入时间"
            />
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="200"
            >
                <template slot-scope="{ row }">
                    <div class="action">
                        <a
                            @click="showDialogBox(row.mallUserId, row.ownnerUserId)"
                        >
                            更改所属账号
                        </a>
                        |
                        <a
                            @click="relieve(row.mallUserId)"
                        >
                            降级
                        </a>
                        |
                        <a
                            @click="$router.push({ name: 'HelperDetail', params: { id: row.id, roleCode: 'HELPER' }, query: { from: 'HelperList' } })">
                            详情
                        </a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            @change="getList"
            @sizeChange="sizeChange"
            v-model="form.current"
            :total="total"
            :sizes="true"
        />

        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="showDialog"
            title="选择所属账号"
            width="40%"
        >
            <el-form :inline="true">
                <el-form-item>
                    <el-input
                        clearable
                        @change="getAccountList"
                        v-model="searchAccountsForm.keyword"
                        placeholder="请输入真实姓名或手机号"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        @click="getAccountList"
                        type="primary"
                    >
                        查询
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table :data="accountList">
                <el-table-column
                    prop="name"
                    label="真实姓名"
                />
                <el-table-column
                    prop="mobile"
                    label="手机号（登录账户）"
                />
                <el-table-column
                    prop="roleName"
                    label="角色"
                />
                <el-table-column label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button
                            v-if="row.userId ===ownnerUserId"
                            disabled="disabled"
                            type="primary"
                            size="mini"
                        >
                            已选择
                        </el-button>
                        <el-button
                            v-else
                            type="primary"
                            size="mini"
                            @click="changeHelperAccount(row)"
                        >
                            选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Pagination from '../../../../components/common/Pagination'
import {
    getHelperList,
    relieveHelper,
    relieveHelperBatched,
    changeHelpersAccount,
    updateBrokerStatus
} from '../../../../apis/member'
import { getAccounts } from '../../../../apis/account'

@Component({
    components: {
        Pagination
    }
})
export default class HelperManageList extends Vue {
    showDialog = false
    form = {
        keyword: '',
        ownnerUserId: '',
        current: 1,
        size: 10,
        auditFlag: true,
        auditStatus: '',
        loginStartTime: '',
        loginEndTime: '',
        startTime: '',
        endTime: ''
    }

    table = []
    total = 0
    statusMap = {
        HelperWaiting: 'AWAIT',
        HelperPassed: 'PASS',
        HelperRejected: 'REJECT',
        HelperList: null
    }

    /* 查询所属账号表单 */
    searchAccountsForm = {
        current: 1,
        size: 200,
        keyword: ''
    }

    accountList = []
    routeName = ''

    /* 当前正在修改所属账号的数据id */
    currentUserId = []

    /* 当前选中的表格数据 */
    currentSelect = []
    ownnerUserId = ''
    currentRoleCode = ''

    created () {
        this.routeName = this.$route.name
        this.form.auditStatus = this.statusMap[this.routeName]
        this.form.auditFlag = Boolean(this.form.auditStatus)
        this.getList()
        this.getAccountList()
    }

    restForm () {
        this.form = {
            keyword: '',
            ownnerUserId: '',
            current: 1,
            size: 10,
            loginStartTime: '',
            loginEndTime: '',
            startTime: '',
            endTime: ''
        }
        this.form.auditStatus = this.statusMap[this.routeName]
        this.form.auditFlag = Boolean(this.form.auditStatus)
        this.getList()
    }

    async getList () {
        try {
            const { result } = await getHelperList(this.form)
            this.table = result.records
            this.total = result.total
        } catch (e) {
            throw e
        }
    }

    async updateBrokerStatus (id, status) {
        try {
            await this.$confirm({ message: `确定${ status === 'PASS' ? '通过' : '拒绝' }该用户的申请吗？` })
            await updateBrokerStatus({ id, status })
            this.$success('审核成功')
            this.form.current = 1
            this.getList()
        } catch (e) {
            throw e
        }
    }

    loginTimeRange ({ start, end }) {
        this.form.loginStartTime = start
        this.form.loginEndTime = end
        this.getList()
    }

    joinTimeRange ({ start, end }) {
        this.form.startTime = start
        this.form.endTime = end
        this.getList()
    }

    async getAccountList () {
        try {
            const { result } = await getAccounts(this.searchAccountsForm)
            // console.log(result)
            this.accountList = result.records
        } catch (e) {
            throw e
        }
    }

    async relieve (id) {
        const ids = [id]
        try {
            await this.$confirm({ message: '对Helper降级后，降级后该Helper将成为普通会员用户，不再享受Helper的相关权限，确认要解除Helper账号的权限吗？' })
            await relieveHelper(ids)
            this.$success('降级成功')
            this.restForm()
            this.getList()
        } catch (e) {
            throw e
        }
    }

    async relieveBatched () {
        const ids = []
        for (const item of this.currentSelect) {
            ids.push(item.mallUserId)
        }
        try {
            await this.$confirm({ message: '对Helper降级后，降级后该Helper将成为普通会员用户，不再享受Helper的相关权限，确认要批量解除Helper账号的权限吗？' })
            await relieveHelperBatched(ids)
            this.$success('降级成功')
            this.restForm()
            this.getList()
        } catch (e) {
            throw e
        }
    }

    async belongBatched () {
        this.currentUserId = []
        for (const item of this.currentSelect) {
            this.currentUserId.push(item.mallUserId)
        }
        if (this.currentUserId.length !== 1) {
            this.ownnerUserId = ''
        }
        this.showDialog = true
    }

    showDialogBox (id, ownnerUserId) {
        this.showDialog = true
        this.currentUserId = [id]
        this.ownnerUserId = ownnerUserId
    }

    async changeHelperAccount (data) {
        try {
            await changeHelpersAccount({
                ownerUserId: data.userId,
                userId: this.currentUserId
            })
            this.showDialog = false
            this.$success('变更成功！')
            this.restForm()
            this.getList()
        } catch (e) {
            throw e
        }
    }

    selectionChange (list) {
        this.currentSelect = list
    }

    sizeChange (val) {
        this.form.current = 1
        this.form.size = val
        this.getList()
    }

    search () {
        this.form.current = 1
        this.getList()
    }
}
</script>

<style lang="scss">
.form-filter{
    padding: 20px 32px;
    background: #F5F6FA;
    border-radius: 10px;
    .filter-inp{
        width: 350px;
    }
    .filter-btns{
        padding-left: 96px;
        button{
            height: 32px;
            border-radius: 16px;
        }
    }
}
.user-info {
    display: flex;
    .avatar{
        width: 40px;
        height: 40px;
        border-radius: 14px;
        margin-right: 10px;
    }
    .name{
        height: 20px;
        font-size: 14px;
        color: #333;
        display: flex;
    }
    .tag{
        display: flex;
        height: 20px;
        li{
            margin-right: 12px;
            color: #999;
            font-size: 12px;
            width: 24px;
        }
    }
}
.action {
    color: #4F63FF;
    a{
        color: #4F63FF;
    }
}
    .acc-label{
        display: inline-block;
        width: 18px;
        text-align: center;
        height: 18px;
        line-height: 16px;
        font-size: 12px;
        color: #F79F1A;
        border-radius: 5px;
        border: 1px solid #F79F1A;
    }
</style>
