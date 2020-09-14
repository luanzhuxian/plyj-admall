<template>
    <div class="helper-list">
        <el-form
            :inline="true"
            class="form-filter"
            label-width="80px"
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
            <el-form-item label="申请时间">
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
                    type="text"
                    size="mini"
                    @click="restForm"
                >
                    清空筛选条件
                </el-button>
            </div>
        </el-form>

        <div class="wrap mb-20" v-if="$route.name === 'HelperWaiting'">
            <el-button type="primary" :disabled="!currentSelect.length" @click="batchAudit">
                批量通过
            </el-button>
        </div>

        <el-table
            @selection-change="selectionChange"
            :data="table"
        >
            <el-table-column
                type="selection"
                width="55"
                v-if="$route.name === 'HelperWaiting'"
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
                :label="$route.name === 'HelperWaiting'? '申请时间':'审核时间'"
            >
                <template slot-scope="{ row }">
                    {{ $route.name === 'HelperWaiting'? row.applyTime:row.auditTime }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="$route.name==='HelperRejected'"
                prop="agentWriteBack"
                label="驳回理由"
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
                            <template v-if="routeName === 'HelperWaiting'">
                                <a
                                    @click="updateBrokerStatus(row.id, 'PASS')"
                                >
                                    通过
                                </a>
                                <a
                                    @click="updateBrokerStatus(row.id, 'REJECT')"
                                >
                                    驳回
                                </a>
                            </template>

                            <a
                                @click="$router.push({ name: 'MemberDetail', params: { id: row.mallUserId, roleCode: 'HELPER', fromRouteName: routeName }, query: { from: 'audit' } })"
                            >
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
                        @clear="getAccountList"
                        v-model="searchAccountsForm.realName"
                        placeholder="真实姓名"
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        clearable
                        @clear="getAccountList"
                        v-model="searchAccountsForm.mobile"
                        placeholder="手机号"
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
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="changeHelperAccount(scope.row)"
                        >
                            选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog
            width="480px"
            title="确定驳回该用户的申请吗"
            :visible="dialogAuditVisible"
            @close="dialogAuditCancel()"
        >
            <el-form
                label-width="70px"
                style="width: 376px;height: 47px"
            >
                <el-form-item
                    class="mb-0"
                    label="驳回理由"
                >
                    <el-input
                        v-model="rejectReason"
                        placeholder="请输入驳回理由"
                        autocomplete="off"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
            >
                <el-button @click="dialogAuditCancel()">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="dialogAuditConfirm()"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Pagination from '../../../../components/common/Pagination'
import {
    getHelperList,
    changeHelpersAccount,
    updateBrokerStatus
} from '../../../../apis/member'
import { getAccounts } from '../../../../apis/account'
import DateRange from '../../../../components/common/Date-Range'

@Component({
    components: {
        DateRange,
        Pagination
    }
})
export default class HelperReviewList extends Vue {
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
      status: 1,
      realName: '',
      mobile: ''
  }

  accountList = []
  routeName = ''

  /* 当前正在修改所属账号的数据id */
  currentUserId = []

  /* 当前选中的表格数据 */
  currentSelect = []
  dialogAuditVisible = false
  auditId = ''

  /* 驳回申请理由 */
  rejectReason = ''
  currentRoleCode = ''

  async created () {
      this.routeName = this.$route.name
      this.form.auditStatus = this.statusMap[this.routeName]
      this.form.auditFlag = Boolean(this.form.auditStatus)
      try {
          await this.getList()
          await this.getAccountList()
      } catch (e) {
          throw e
      }
  }

  restForm () {
      this.form = { realName: '', mobile: '', ownnerUserId: '', current: 1, auditFlag: true, auditStatus: '' }
      this.form.auditStatus = this.statusMap[this.routeName]
      this.form.auditFlag = Boolean(this.form.auditStatus)
  }

  async getList () {
      try {
          const { result } = await getHelperList(this.form)
          this.table = result.records
      } catch (e) {
          throw e
      }
  }

  async updateBrokerStatus (id, status) {
      try {
          if (status === 'REJECT') {
              this.auditId = id
              this.dialogAuditVisible = true
          } else {
              await this.$confirm('确定通过该用户的申请吗？')
              await updateBrokerStatus({ id, status, agentWriteBack: '' })
              this.$success('审核成功')
              this.form.current = 1
              this.getList()
          }
      } catch (e) {
          throw e
      }
  }

  async getAccountList () {
      try {
          const { result } = await getAccounts(this.searchAccountsForm)
          this.accountList = result.records
      } catch (e) {
          throw e
      }
  }

  showDialogBox (id) {
      this.showDialog = true
      this.currentUserId = [id]
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

  // 批量通过
  async batchAudit () {
      try {
          await this.$confirm('您确定通过所选用户的申请吗')
          const ALL = []
          for (const { id } of this.currentSelect) {
              ALL.push(updateBrokerStatus({ id, status: 'PASS', agentWriteBack: '' }))
          }
          await Promise.all(ALL)
          await this.getList()
      } catch (e) {
          if (e) throw e
      }
  }

  dialogAuditCancel () {
      this.dialogAuditVisible = false
      this.rejectReason = ''
  }

  async dialogAuditConfirm () {
      const id = this.auditId
      const status = 'REJECT'
      const agentWriteBack = this.rejectReason
      await updateBrokerStatus({ id, status, agentWriteBack })
      this.dialogAuditVisible = false
      this.$success('审核成功')
      this.restForm()
      this.getList()
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
            padding-left: 80px;
            button{
                height: 32px;
                border-radius: 16px;
            }
        }
    }
</style>
