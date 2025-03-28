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
            <el-form-item label="搜索内容：">
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
                                <div class="user-type" v-if="row.type" :title="row.type === 3 ? row.other : USER_TYPE[row.type]">
                                    <template v-if="row.type !== 3">
                                        {{ USER_TYPE[row.type] && USER_TYPE[row.type].substr(0, 1) }}
                                    </template>
                                    <template v-else>
                                        {{ row.other && row.other.substr(0, 1) }}
                                    </template>
                                </div>
                                <span class="nickName">{{ row.userName }}</span>
                                <div class="ml-10">
                                    <pl-svg v-if="row.gender === 2" name="icon-women" width="10" height="10" />
                                    <pl-svg v-if="row.gender === 1" name="icon-man" width="10" height="10" />
                                </div>
                            </div>
                            <div class="tag">
                                <template v-if="row.userTags && row.userTags.length">
                                    <el-popover
                                        placement="bottom-end"
                                        trigger="hover"
                                    >
                                        <div>
                                            <span v-for="(item, index) in row.userTags" :key="index">{{ item && item }} </span>
                                        </div>
                                        <div slot="reference">
                                            {{ row.userTags.join('  ') }}
                                        </div>
                                    </el-popover>
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
                            <a @click="updateBrokerStatus(row.id, 'PASS')">
                                通过
                            </a>
                            |
                            <a @click="updateBrokerStatus(row.id, 'REJECT')">
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
                <el-button round @click="dialogAuditCancel()">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    round
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
    updateBrokerStatus
} from '../../../../apis/member'

@Component
export default class HelperReviewList extends Vue {
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

    USER_TYPE = {
        1: '家长',
        2: '学生',
        3: '其他'
    }

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
      await this.init()
  }

  async init () {
      this.currentStatus = this.$route.query.currentStatus || 'AWAIT'
      this.routeName = this.$route.name || ''
      this.form.auditStatus = this.currentStatus
      this.form.auditFlag = Boolean(this.form.auditStatus)
      try {
          await this.getList()
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

  selectionChange (list: any[]) {
      this.currentSelect = list
  }

  // 批量通过
  async batchAudit () {
      try {
          await this.$confirm('您确定通过所选用户的申请吗')
          const ids = []
          for (const { id } of this.currentSelect) {
              ids.push(id)
          }
          updateBrokerStatus({ ids, status: 'PASS', reviewContent: '' })
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
            .user-type{
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
