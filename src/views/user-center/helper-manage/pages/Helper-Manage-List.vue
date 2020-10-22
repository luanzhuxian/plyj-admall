<template>
    <div class="helper-list">
        <search-box>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    v-model.trim="form.keyword"
                    placeholder="请输入用户昵称/真实姓名/手机号"
                    @change="search"
                    style="width: 350px"
                />
            </el-form-item>
            <el-form-item
                label="所属账号："
                v-if="currentRoleCode !== 'EMPLOYEE'"
            >
                <el-select
                    v-model="form.ownedUser"
                    clearable
                    @change="search"
                    style="width: 350px"
                >
                    <el-option
                        v-for="(item, index) of ownedAccountList"
                        :key="index"
                        :label="item.name"
                        :value="item.baseUserId">
                        {{ item.mobile + ' ' + item.name }} （{{ item.roleName }}）
                    </el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="最近登录时间：">
                <date-range :init="[form.loginStartTime, form.loginEndTime]"
                            @change="loginTimeRange"
                            disable-after
                            clearable />
            </el-form-item>
            <el-form-item label="加入时间：">
                <date-range :init="[form.startTime, form.endTime]"
                            @change="joinTimeRange"
                            disable-after
                            clearable />
            </el-form-item>
            <br>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="search"
                    round
                >
                    查询
                </el-button>
                <!-- <el-button
                    @click="search"
                    round
                >
                    导出数据
                </el-button> -->
                <el-button
                    type="text"
                    @click="restForm"
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>

        <div class="mt-20">
            已选择{{ currentSelect.length }}个用户
            <el-button
                type="text"
                :disabled="!currentSelect.length"
                @click="relieveBatched"
            >
                降级
            </el-button>
            <el-button
                type="text"
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
            <el-table-column label="用户信息" width="300px">
                <template #default="{ row }">
                    <div class="user-info">
                        <img
                            class="avatar"
                            :src="row.userImage"
                            alt=""
                        >
                        <div>
                            <div class="name">
                                <div class="user-type" v-if="row.type" :title="row.type === 3 ? row.other : USER_TYPE[row.type]">
                                    <template v-if="row.type !== 3">
                                        {{ USER_TYPE[row.type] && USER_TYPE[row.type].substr(0, 1) }}
                                    </template>
                                    <template v-else>
                                        {{ row.other && row.other.substr(0, 1) }}
                                    </template>
                                </div>
                                {{ row.userName }}
                                <div class="ml-10">
                                    <pl-svg v-if="row.gender === 2" name="icon-women-be552" width="10" height="10" />
                                    <pl-svg v-if="row.gender === 1" name="icon-man-8b747" width="10" height="10" />
                                </div>
                            </div>
                            <div class="tag">
                                <template v-if="row.userTags && row.userTags.length">
                                    <el-tooltip class="item" effect="dark" :content="row.userTags.join('  ')" placement="bottom">
                                        <div>
                                            <span v-for="(item, index) in row.userTags" :key="index">{{ item && item }} </span>
                                        </div>
                                    </el-tooltip>
                                </template>
                            </div>
                        </div>
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号（账户）"
            />
            <el-table-column
                label="所属账号"
                width="250"
            >
                <template slot-scope="{row}">
                    <template v-if="row.ownedUser">
                        {{ row.ownedUserMobile +' - '+ row.nickName }}
                    </template>
                    <span class="acc-label">{{ roleType[row.ownedRoleCode] }}</span>
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
                    <Operating>
                        <template slot="button-box">
                            <el-button type="text" @click="showDialogBox(row)">
                                更改所属账号
                            </el-button>
                            <el-button type="text" @click="relieve(row.mallUserId)">
                                降级
                            </el-button>
                            <el-button type="text" @click="$router.push({ name: 'HelperPromoteDetail', params: { id: row.id, mallUserId: row.mallUserId } })">
                                详情
                            </el-button>
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

        <!--更改所属账号-->
        <ChangeOwnerDialog
            :show.sync="showDialog"
            :helper-ids="currentUserIds"
            :current-user-info="currentUserInfo"
            @success="showDialog = false; getList()"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import {
    getHelperList,
    relieveHelper,
    relieveHelperBatched,
    updateBrokerStatus
} from '../../../../apis/member'
import { getOwnedAccountList } from '../../../../apis/account'
import ChangeOwnerDialog from '../components/Change-Owner-Dialog.vue'
@Component({
    components: {
        ChangeOwnerDialog
    }
})
export default class HelperManageList extends Vue {
    showDialog = false
    form = {
        keyword: '',
        ownedUser: '',
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
    statusMap: { [k: string]: any } = {
        HelperWaiting: 'AWAIT',
        HelperPassed: 'PASS',
        HelperRejected: 'REJECT',
        HelperList: null
    }

    USER_TYPE = {
        1: '家长',
        2: '学生',
        3: '其他'
    }

    // 所属账号角色类型
    roleType = {
        ENTERPRISE_ADMIN: '企',
        ADMIN: '高',
        EMPLOYEE: '子'
    }

    ownedAccountList = []
    routeName = ''

    /* 当前正在修改所属账号的数据id */
    currentUserInfo: DynamicObject = {}
    currentUserIds: string[] = []

    /* 当前选中的表格数据 */
    currentSelect: any[] = []
    currentRoleCode = ''

    created () {
        this.routeName = this.$route.name || ''
        this.form.auditStatus = this.statusMap[this.routeName]
        this.form.auditFlag = Boolean(this.form.auditStatus)
        this.getList()
        this.getOwnedAccountList()
    }

    @Watch('showDialog')
    onChangeValue (newVal: string) {
        if (!newVal) {
            this.restForm()
        }
    }

    restForm () {
        this.form = {
            keyword: '',
            ownedUser: '',
            current: 1,
            size: 10,
            auditFlag: true,
            auditStatus: '',
            loginStartTime: '',
            loginEndTime: '',
            startTime: '',
            endTime: ''
        }
        this.form.auditStatus = this.statusMap[this.routeName] || ''
        this.form.auditFlag = Boolean(this.form.auditStatus)
        this.getList()
    }

    async getOwnedAccountList () {
        try {
            const filterForm = {
                mallUserId: '',
                current: 1,
                size: 1000
            }
            const { result } = await getOwnedAccountList(filterForm)
            this.ownedAccountList = result.records
        } catch (e) {
            throw e
        }
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

    async updateBrokerStatus (id: string, status: string) {
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

    loginTimeRange ({ start, end }: any) {
        this.form.loginStartTime = start
        this.form.loginEndTime = end
        this.getList()
    }

    joinTimeRange ({ start, end }: any) {
        this.form.startTime = start
        this.form.endTime = end
        this.getList()
    }

    async relieve (id: string) {
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
        this.currentUserIds = this.currentSelect.map(item => item.mallUserId)
        this.showDialog = true
    }

    async showDialogBox (row: DynamicObject) {
        this.showDialog = true
        this.currentUserInfo = row
        this.currentUserIds = [row.mallUserId]
    }

    selectionChange (list: any[]) {
        this.currentSelect = list
    }

    sizeChange (val: number) {
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
        align-items: center;
    }
    .user-type {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        border: 1px solid #F79F1A;
        border-radius: 5px;
        font-size: 12px;
        font-family: Microsoft YaHei UI;
        font-weight: 600;
        line-height: 15px;
        text-align: center;
        color: #F79F1A;
    }
    .tag {
        margin-top: 8px;
        width: 110px;
        color: #999999;
        @include elps-wrap(1);
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
