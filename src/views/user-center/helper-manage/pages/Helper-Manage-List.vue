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
                    v-model.trim="form.realName"
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
                        :label="item.realName"
                        :value="item.userId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="最近登录时间">
                <date-range />
            </el-form-item>
            <el-form-item label="加入时间">
                <date-range />
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

        <div
            class="wrap mb-20"
        >
            <!--<el-button type="primary">新增Helper</el-button>-->
            <!--<el-button type="primary">批量注册Helper</el-button>-->
            <div v-if="routeName === 'HelperList'">
                已选择{{ currentSelect.length }}条
                <el-button
                    :disabled="!currentSelect.length"
                    @click="relieveBatched"
                >
                    批量降级
                </el-button>
                <el-button
                    :disabled="!currentSelect.length"
                    @click="belongBatched"
                >
                    批量更改所属账号
                </el-button>
            </div>
        </div>

        <el-table
            @selection-change="selectionChange"
            :data="table"
        >
            <el-table-column
                type="selection"
                width="55"
                v-if="$route.name === 'HelperList'"
            />
            <el-table-column
                prop="userId"
                label="ID"
            />
            <el-table-column label="头像">
                <template slot-scope="scope">
                    <img
                        height="50"
                        :src="scope.row.avatarUrl"
                        alt=""
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="realName"
                label="真实姓名"
            />
            <el-table-column
                prop="mobile"
                label="手机号（登录账户）"
            />
            <el-table-column
                prop="ownnerName"
                label="所属账号"
            />
            <!--<el-table-column prop="weChatNumber" label="Helper等级" />-->
            <!--<el-table-column prop="weChatNumber" label="成长值" />-->
            <!-- <el-table-column prop="ownnerName" label="所属账号" /> -->
            <!-- <el-table-column prop="status" label="状态" /> -->
            <!--<template slot-scope="scope">-->
            <!--<span v-if="scope.row.auditStatus === 'AWAIT'">待审核</span>-->
            <!--<span v-else-if="scope.row.auditStatus === 'PASS'">正常（已论证）</span>-->
            <!--<span v-else-if="scope.row.auditStatus === 'REJECT'">驳回</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
                prop="lastestLogonTime"
                label="最近登录时间"
            />
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <template v-if="routeName === 'HelperList'">
                                <a
                                    @click="showDialogBox(row.userId, row.ownnerUserId)"
                                >
                                    更改所属账号
                                </a>
                                <a
                                    @click="relieve(row.userId)"
                                >
                                    降级
                                </a>
                            </template>
                            <a @click="$router.push({ name: 'MemberDetail', params: { id: row.mallUserId, roleCode: 'HELPER' }, query: { from: 'HelperList' } })">
                                查看
                            </a>
                        </template>
                    </Operating>
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
                        v-model="searchAccountsForm.searchContent"
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
                    prop="realName"
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
        realName: '',
        mobile: '',
        ownnerUserId: '',
        current: 1,
        size: 10,
        auditFlag: true,
        auditStatus: ''
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
        searchContent: ''
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
            realName: '',
            mobile: '',
            ownnerUserId: '',
            current: 1,
            auditFlag: true,
            auditStatus: ''
        }
        this.form.auditStatus = this.statusMap[this.routeName]
        this.form.auditFlag = Boolean(this.form.auditStatus)
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
        try {
            await this.$confirm({ message: '对Helper降级后，降级后该Helper将成为普通会员用户，不再享受Helper的相关权限，确认要解除Helper账号的权限吗？' })
            await relieveHelper(id)
            this.$success('降级成功')
            this.restForm()
            this.getList()
        } catch (e) {
            throw e
        }
    }

    async relieveBatched () {
        const userIdList = []
        for (const item of this.currentSelect) {
            userIdList.push(item.userId)
        }
        try {
            await this.$confirm({ message: '对Helper降级后，降级后该Helper将成为普通会员用户，不再享受Helper的相关权限，确认要批量解除Helper账号的权限吗？' })
            await relieveHelperBatched(userIdList.join(','))
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
            this.currentUserId.push(item.userId)
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
                ownnerUserId: data.userId,
                ownneName: data.realName,
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
</style>
