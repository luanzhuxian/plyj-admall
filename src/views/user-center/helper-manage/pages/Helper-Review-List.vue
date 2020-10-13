<template>
    <div class="helper-list">
        <el-tabs :value="currentStatus" type="card" @tab-click="handleStatusClick">
            <el-tab-pane
                v-for="item in statusMap"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            />
        </el-tabs>
        <search-box>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    v-model.trim="form.keyword"
                    placeholder="请输入用户昵称/真实姓名/手机号"
                    @change="search"
                    class="filter-inp"
                />
            </el-form-item>
            <el-form-item label="申请时间：">
                <date-range :init="[form.startTime, form.endTime]"
                            @change="joinTimeRange"
                            disable-after
                            clearable />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    round
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    type="text"
                    round
                    @click="restForm"
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>

        <div class="mt-20" v-if="currentStatus === 'AWAIT'">
            已选择{{ currentSelect.length }}个用户
            <el-button type="text" :disabled="!currentSelect.length" @click="batchAudit">
                批量通过
            </el-button>
        </div>
        <el-table
            @selection-change="selectionChange"
            :key="currentStatus"
            :data="table"
        >
            <el-table-column
                v-if="currentStatus === 'AWAIT'"
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
                                <span class="nickName">{{ row.userName }}</span>
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
            >
                <template #default="{ row }">
                    <template v-if="row.ownedUserMobile">
                        {{ row.ownedUserMobile }}
                    </template>
                    <template v-if="row.ownedUserMobile && row.ownedUser">-</template>
                    <template v-if="row.ownedUser">
                        {{ row.ownedUser }}
                    </template>
                    <span class="acc-label" v-if="row.ownedRoleCode">
                        <template v-if="row.ownedRoleCode === 'ENTERPRISE_ADMIN'">企</template>
                        <template v-if="row.ownedRoleCode === 'EMPLOYEE'">子</template>
                        <template v-if="row.ownedRoleCode === 'ADMIN'">高</template>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="审核状态">
                <template>
                    <span v-if="currentStatus === 'AWAIT'">待审核</span>
                    <span v-else-if="currentStatus === 'PASS'">审核通过</span>
                    <span v-else-if="currentStatus === 'REJECT'">审核驳回</span>
                </template>
            </el-table-column>
            <el-table-column label="申请时间" prop="createTime" />
            <el-table-column v-if="currentStatus !== 'AWAIT'" label="审核时间" prop="auditTime" />
            <el-table-column
                v-if="currentStatus === 'REJECT'"
                prop="agentWriteBack"
                label="驳回理由"
            />
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
            >
                <template slot-scope="{ row }">
                    <div class="action">
                        <template v-if="currentStatus === 'AWAIT'">
                            <a
                                @click="updateBrokerStatus(row.id, 'PASS')"
                            >
                                通过
                            </a>
                            |
                            <a
                                @click="updateBrokerStatus(row.id, 'REJECT')"
                            >
                                驳回
                            </a>
                            |
                        </template>
                        <a
                            @click="$router.push({ name: 'HelperDetail', params: { id: row.id, roleCode: 'HELPER', fromRouteName: routeName }, query: { from: 'audit', currentStatus } })"
                        >
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
                        v-model="searchAccountsForm.keyword"
                        placeholder="请输入真实姓名/手机号"
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
                            type="text"
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

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {
    getHelperList,
    changeHelpersAccount,
    updateBrokerStatus
} from '../../../../apis/member'
import { getAccounts } from '../../../../apis/account'

@Component
export default class HelperReviewList extends Vue {
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
  statusMap = [
      { title: '待审核', name: 'AWAIT' },
      { title: '审核通过', name: 'PASS' },
      { title: '审核驳回', name: 'REJECT' }]

  /* 查询所属账号表单 */
  searchAccountsForm = {
      current: 1,
      size: 200,
      status: 1,
      keyword: ''
  }

  accountList = []
  routeName = ''

  /* 当前正在修改所属账号的数据id */
  currentUserId: string[] = []

  /* 当前选中的表格数据 */
  currentSelect: any[] = []
  dialogAuditVisible = false
  auditId = ''

  /* 驳回申请理由 */
  rejectReason = ''
  currentRoleCode = ''
  currentStatus: any = ''

  async created () {
      this.currentStatus = this.$route.query.currentStatus || 'AWAIT'
      this.routeName = this.$route.name || ''
      this.form.auditStatus = this.currentStatus
      this.form.auditFlag = Boolean(this.form.auditStatus)
      try {
          await this.getList()
          await this.getAccountList()
      } catch (e) {
          throw e
      }
  }

  restForm () {
      this.form = {
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
      this.form.auditStatus = this.currentStatus
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

  async updateBrokerStatus (id: string, status: string) {
      try {
          if (status === 'REJECT') {
              this.auditId = id
              this.dialogAuditVisible = true
          } else {
              await this.$confirm('确定通过该用户的申请吗？')
              await updateBrokerStatus({ ids: [id], status, reviewContent: '' })
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

  showDialogBox (id: string) {
      this.showDialog = true
      this.currentUserId = [id]
  }

  async changeHelperAccount (data: any) {
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

  selectionChange (list: any[]) {
      this.currentSelect = list
  }

  // 批量通过
  async batchAudit () {
      try {
          await this.$confirm('您确定通过所选用户的申请吗')
          updateBrokerStatus({ ids: this.currentSelect, status: 'PASS', reviewContent: '' })
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
      const ids = [this.auditId]
      const status = 'REJECT'
      const reviewContent = this.rejectReason
      await updateBrokerStatus({ ids, status, reviewContent })
      this.dialogAuditVisible = false
      this.$success('审核驳回')
      this.restForm()
      this.getList()
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

  handleStatusClick (e: any) {
      this.currentStatus = e.name
      this.form.auditStatus = e.name
      this.form.current = 1
      this.getList()
  }

  joinTimeRange ({ start, end }: any) {
      this.form.startTime = start
      this.form.endTime = end
      this.getList()
  }
}
</script>

<style lang="scss" scoped>
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
            .nickName{
                max-width: 81px;
                @include elps-wrap(1);
            }
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
    .filter-inp {
        width: 250px;
    }
</style>
