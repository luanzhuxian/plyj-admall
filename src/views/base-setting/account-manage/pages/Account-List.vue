<template>
    <div class="account-list wrap">
        <search-box label-width="85px">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filter.searchContent"
                    @clear="realNameClear"
                    @change="search"
                    placeholder="请输入真实姓名或手机号"
                    :clearable="true"
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="filter.status"
                    @change="statusOptionChange"
                    :clearable="true"
                >
                    <el-option
                        :label="option.label"
                        :value="option.value"
                        v-for="option in statusOptions"
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

        <div class="mt-24">
            <router-link :to="{name:'AddAccount',params:{mode:'EMPLOYEE'}}">
                <el-button
                    round
                    type="primary"
                >
                    新增
                </el-button>
            </router-link>
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
                                    v-if="!canEdit(row) && row.lockStatus "
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
                                <div class="switch-box">
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

                        <!-- <el-button plain size="mini" @click="deleteAccount(scope.row)" v-if="scope.row.roleStatus==='已失效'">
            删除
          </el-button> -->
                        <!--          <div>-->
                        <!--            {{ userId===row.userId }}-->
                        <!--            {{ row.roleCode === currentRoleCode }}-->
                        <!--            {{ row.currentRoleCode === 'EMPLOYEE' }}-->
                        <!--            {{ row.roleCode === 'ADMIN' && currentRoleCode!== 'ENTERPRISE_ADMIN' }}-->
                        <!--          </div>-->
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

<script>
import { mapGetters } from 'vuex'
import {
    getAccounts,
    deleteAccount,
    enableAccount,
    downgradeAccount,
    editAccount
} from '../../../../apis/account.js'
class Filter {
  current = 1
  size = 10
  status = null
  createdTime = ''
  searchContent = ''
  startTime = ''
  endTime = ''
}

class Account {
  searchContent
  idCard
  position
  roleCode
  constructor (account = null) {
      if (account) {
          const { searchContent, idCard, position, roleCode } = account
          this.searchContent = searchContent
          this.idCard = idCard
          this.position = position
          this.roleCode = roleCode
      }
  }
}
export default {
    name: 'AccountList',
    data () {
        return {
            statusOptions: [
                { label: '全部', value: null },
                { label: '已开启', value: 1 },
                { label: '已禁用', value: 0 }
            ],
            dateRange: [],
            filter: new Filter(),
            table: [],
            total: 0,
            isEdit: false,
            account: new Account()
        }
    },
    created () {
        this.getAccounts()
    },
    computed: {
        ...mapGetters(['userId', 'currentRoleCode'])
    },
    methods: {
        canEdit (row) {
            return this.userId === row.userId || (row.roleCode === this.currentRoleCode) || (row.currentRoleCode === 'EMPLOYEE') || (row.roleCode === 'ADMIN' && this.currentRoleCode !== 'ENTERPRISE_ADMIN')
        },
        pageChange (page) {
            this.filter.current = page
            this.getAccounts()
        },
        async getAccounts () {
            // this.filter = new Filter()
            const { data: res } = await getAccounts(this.filter)
            this.table = res.result.records
            this.total = res.result.total
        },
        search () {
            this.filter.current = 1
            this.getAccounts()
        },
        goDetail (row, selfEdit, canEdit) {
            const { mobile, userId, roleCode } = row
            this.$router.push({
                name: 'AccountDetail',
                query: { mobile, userId, roleCode, selfEdit, canEdit }
            })
        },
        async deleteAccount (row) {
            await this.$confirm('删除后将无法恢复！')
            await deleteAccount(row)
            this.$success('删除成功')
            this.filter.current = 1
            this.getAccounts()
        },
        dateRangeChange (value) {
            this.filter.current = 1
            const { end, start } = value
            this.filter.startTime = start
            this.filter.endTime = end
            this.getAccounts()
        },
        statusOptionChange () {
            this.filter.current = 1
            this.getAccounts()
        },
        realNameClear () {
            this.filter.realName = ''
        },
        mobileClear () {
            this.filter.mobile = ''
        },
        async downgradeAccount (row) {
            const { roleCode, userId } = row
            const params = { roleCode, userId }
            const roleMap = {
                EMPLOYEE: '子账号',
                ADMIN: '高级管理员'
            }
            await this.$confirm({
                title: '确认降级此账户？',
                message: `降级后，所属该${ roleMap[roleCode] }的所有helper用户，将自动更新所属账号为“企业管理员”！`
            })
            await downgradeAccount(params)
            this.$success('降级成功')
            this.filter.current = 1
            this.getAccounts()
        },
        editAccount (data) {
            return editAccount(data)
        },
        async toSave () {
            try {
                await this.editAccount(this.account)
                this.isEdit = !this.isEdit
                this.$success('编辑成功')
                this.filter.current = 1
                this.getAccounts()
            } catch (e) {
                this.isEdit = !this.isEdit
                throw e
            }
        },
        async switchChange (row) {
            const { roleCode, userId, lockStatus } = row
            const params = { roleCode, userId, lockStatus }
            if (row.lockStatus) {
                // let data = {
                //   userId: row.userId,
                //   accountRole: row.roleCode,
                //   lockStatus: 1
                // }
                // const { data: res } = await validatedOpen(data)
                // if (!res.result) {
                //   row.lockStatus = 0
                //   this.$confirm({
                //     title: '名额已满',
                //     message: '当前高级管理员名额已满，如若设置请先禁用其他管理员。'
                //   })
                //   return
                // }
                try {
                    const { data: res } = await enableAccount(params)
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
                } catch (e) {
                    throw e
                }
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
}

</script>

<style lang="scss" scoped>
  .account-list{
    min-height: calc(100vh - 110px);
    padding-bottom: 10px;
    background-color: #ffffff;
  }
  .switch-box{
    padding-left: 20px;
    text-align: left;
  }
</style>
