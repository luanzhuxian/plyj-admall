<template>
    <div class="member">
        <!-- 左侧标签列表 -->
        <div
            ref="tag-list"
            class="tag-list"
        >
            <div class="tag-list-top">
                <el-button icon="el-icon-plus" @click="editTag" style="color: #4C88D6; border-color: #4C88D6;">
                    新建用户标签
                </el-button>
            </div>
            <div class="tag-list-default" @click="getMemberListByTag('')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-rule-dir-close" />
                </svg>
                <span :class="{'blue-text': form.tagId === ''}">全部用户({{ userCount }})</span>
                <pl-svg :key="1" name="icon-you" width="20" />
            </div>
            <div
                @click.stop="getMemberListByTag(0)"
                :class="{'tag-list-options0':true, 'background-color-grey': form.tagId === 0}"
            >
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dir-close" />
                </svg>
                未设置标签({{ notSetTageUserCount }})
            </div>
            <pl-Tree
                class="tag-list-options"
                @nodeClick="treeClick"
                @change="treeSort"
                :tree="tagList"
                ref="tree"
                :options="{
                    value: 'id'
                }"
            >
                <template slot="treeItemLabel" slot-scope="{ data }">
                    {{ data.tagName }}
                </template>
                <template slot="default" slot-scope="{ data }">
                    <div class="tag-ctrl">
                        <el-tooltip
                            class="tag-ctrl-item"
                            effect="dark"
                            content="编辑"
                            placement="top-start"
                        >
                            <pl-svg :key="2" name="icon-bianji" @click.stop="editTag(data)" width="12" fill="#598BF8" class="icon" />
                        </el-tooltip>
                        <el-tooltip
                            class="tag-ctrl-item second-item"
                            effect="dark"
                            content="删除"
                            placement="top-start"
                        >
                            <pl-svg :key="3" name="icon-shanchu1" @click.stop="deleteTag(data.id)" width="12" fill="#598BF8" class="icon" />
                        </el-tooltip>
                    </div>
                </template>
            </pl-Tree>

            <div class="category-drop-tip">
                <i>（拖动即可调整同级分类的顺序）</i>
            </div>
        </div>
        <!-- 编辑标签 -->
        <edit-member-tag
            :show.sync="showTagBox"
            :data.sync="currentTag"
            @editTag="editTagConfirm"
        />
        <!-- 会员列表 -->
        <div class="member-list">
            <el-form
                :inline="true"
                class="wrap border-bottom mb-20"
            >
                <el-form-item class="mb-0">
                    <el-input
                        clearable
                        @change="search"
                        placeholder="昵称/手机号"
                        v-model="form.keyword"
                    />
                </el-form-item>
                <el-form-item label="加入时间：" class="mb-0">
                    <date-range
                        :init="[form.startTime, form.endTime]"
                        @change="formatTimeRange"
                        disable-after
                        clearable
                        ref="dateRange"
                    />
                </el-form-item>

                <el-form-item class="mb-0">
                    <span class="font-weight-bold mr-10">用户类型: </span>
                    <el-select v-model="form.roleType" @change="getMemberList" clearable>
                        <el-option :value="''" label="全部" />
                        <el-option value="MEMBERSHIP" label="普通会员" />
                        <el-option value="HELPER" label="Helper" />
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="会员等级" class="mb-0">-->
                <!--<el-select v-model="leave" placeholder="请选择会员等级">-->
                <!--<el-option label="区域一" value="shanghai"></el-option>-->
                <!--<el-option label="区域二" value="beijing"></el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->

                <el-form-item class="mb-0">
                    <el-button
                        type="primary"
                        style="width:98px"
                        @click="search"
                    >
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item class="mb-0">
                    <el-button
                        @click="changeExport"
                        style="width: 98px;"
                        type="primary"
                        plain
                        v-if="table && table.length"
                    >
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
            <div class=" mb-1" />
            <el-table
                :data="table"
                class="table-customer"
            >
                <el-table-column
                    prop="invitationCode"
                    label="头像"
                >
                    <template slot-scope="scope">
                        <img
                            height="50"
                            :src="scope.row.avatarUrl"
                            alt=""
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    prop="nickName"
                    label="昵称"
                />
                <el-table-column label="用户标签" width="200">
                    <template #default="{ row }">
                        <p class="detail-tags">
                            <span
                                v-for="item of row.tags"
                                :key="item.id"
                            >{{ item.tagName }}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号(登录账户)"
                />
                <el-table-column
                    prop="sex"
                    label="性别"
                />
                <!--<el-table-column prop="createTime" label="会员等级" />-->
                <!--<el-table-column prop="status" label="成长值" />-->
                <el-table-column
                    prop="createTime"
                    label="加入时间"
                    width="170"
                />
                <el-table-column label="用户类型">
                    <template #default="{ row }">
                        {{ ROLE_TYPE[row.roleType] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="lastestLogonTime"
                    label="最近登录时间"
                    width="170"
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
                                <a
                                    @click="setTagToMember(row)"
                                >
                                    设置标签
                                </a>
                                <a
                                    @click="$router.push({ name: 'MemberDetail', params: { id: row.mallUserId, roleCode: row.roleType, fromRouteName: routeName }, query: { from: 'List' } })"
                                >
                                    查看
                                </a>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                @change="getMemberList"
                @sizeChange="sizeChange"
                v-model="form.current"
                :total="total"
                :sizes="true"
            />
        </div>
        <!-- 添加标签 -->
        <add-tags
            :show.sync="showAddTagDialog"
            :current-member="currentMemberInfo"
            @confirm="editTagConfirm"
        />

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item label="搜索关键词" prop="keyword">
                    <el-input
                        v-model.trim="exportData.keyword"
                        placeholder="昵称/手机号"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="roleType" label="用户类型">
                    <el-select v-model="exportData.roleType" clearable>
                        <el-option :value="''" label="全部" />
                        <el-option value="MEMBERSHIP" label="普通会员" />
                        <el-option value="HELPER" label="Helper" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="tagId" label="用户标签">
                    <el-select v-model="exportData.tagId" clearable>
                        <el-option value="" label="全部" />
                        <el-option :value="0" label="未设置标签" />
                        <el-option v-for="(item,index) in tagList" :label="item.tagName" :value="item.id" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="加入时间" prop="startTime">
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

<script>
import { Vue, Component } from 'vue-property-decorator'

import Pagination from '../../../../components/common/Pagination'
import ExportDialog from '../../../../components/common/Export-Dialog'
import PlTree from '../../../../components/pl-tree'
import EditMemberTag from '../components/Edit-Member-Tag'
import AddTags from '../components/Add-Tags'

import {
    getMemberList,
    exportMemberQuery,
    getTagList,
    deleteTag,
    sortTagList,
    checkIsTagUsed,
    getMemberNum
} from '../../../../apis/member'
import { createObjectUrl } from '../../../../assets/ts/upload'
import moment from 'moment'

@Component({
    components: {
        PlTree,
        Pagination,
        EditMemberTag,
        AddTags,
        ExportDialog
    }
})

export default class MemberManageList extends Vue {
  showExport = false
  exportData = {
      keyword: '',
      roleType: '',
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

  leave = ''
  form = {
      keyword: '',
      current: 1,
      size: 10,
      tagId: '',
      startTime: '',
      endTime: '',
      roleType: ''
  }

  timeRange = []
  total = 0
  table = []
  routeName = ''
  // 标签列表
  tagList = []
  // 显示标签编辑框
  showTagBox = false
  // 当前编辑的标签
  currentTag = {}
  // 未设置标签的会员列表
  notSetTageUserCount = 0
  // 全部用户数量
  userCount = 0
  showAddTagDialog = false
  // 当前用户信息
  currentMemberInfo = {}
  ROLE_TYPE = {
      MEMBERSHIP: '普通会员',
      HELPER: 'Helper'
  }

  noRefresh = true

  //  life circle
  created () {
      this.routeName = this.$route.name
      if (sessionStorage.getItem('filterForm')) {
          this.form = JSON.parse(sessionStorage.getItem('filterForm'))
          sessionStorage.removeItem('filterForm')
      }
      this.getMemberList()
      this.getTagList()
  }

  beforeRouteLeave (to, from, next) {
      if (to.name === 'MemberDetail') {
          sessionStorage.setItem('filterForm', JSON.stringify(this.form))
          next()
      } else {
          next()
      }
  }

  //  methods
  // 标签排序
  async treeSort (node, list) {
      const ids = []
      for (const item of list) {
          ids.push(item.id)
      }
      try {
          await sortTagList(ids)
      } catch (e) {
          throw e
      } finally {
      // 任何时候都去刷新分类
          await this.getTagList()
      }
  }

  // 点击树节点
  treeClick ({ id }) {
      this.getMemberListByTag(id)
  }

  changeExport () {
      this.exportData = {
          ...this.exportData,
          ...this.form
      }
      this.showExport = true
  }

  exportClose () {
      this.exportData = {
          keyword: '',
          roleType: '',
          // 1 7日内 2 30日内 3自选
          dateRange: 3,
          startTime: '',
          endTime: ''
      }
      this.$refs.exportForm.clearValidate()
      this.showExport = false
  }

  async exportDatechange ({ start, end }) {
      this.exportData.startTime = start
      this.exportData.endTime = end
      if (!start || !end) {
          return
      }
      await this.$nextTick()
      this.$refs.exportDatePicker.initDate()
  }

  exportRangeChange (val) {
      let start = new Date()
      let end = new Date()
      const formatType = 'YYYY-MM-DD'

      if (val === 1) {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      } else if (val === 2) {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      } else {
          start = this.form.startTime || ''
          end = this.form.endTime || ''
      }

      this.exportDatechange({
          start: start && `${ moment(start).format(formatType) } 00:00:00`,
          end: end && `${ moment(end).format(formatType) } 23:59:59`
      })
  }

  async exportList () {
      await this.$refs.exportForm.validate()
      const exportData = this.exportData
      const data = {
          keyword: exportData.keyword,
          roleType: exportData.roleType,
          tagId: exportData.tagId,
          startTime: exportData.startTime,
          endTime: exportData.endTime
      }
      try {
          const blob = await exportMemberQuery(data)
          const url = createObjectUrl(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `会员列表${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
          a.click()
          a.remove()
      } catch (e) {
          throw e
      }
  }

  async getMemberNum () {
      try {
          const { data } = await getMemberNum()
          this.notSetTageUserCount = data.result.notSetTageUserCount || 0
          this.userCount = data.result.userCount || 0
      } catch (e) {
          throw e
      }
  }

  async getMemberList () {
      try {
          const { data: res } = await getMemberList(this.form)
          this.table = res.result.records
          this.total = res.result.total
          this.getMemberNum()
      } catch (e) {
          throw e
      }
  }

  // 根据标签获取用户列表
  getMemberListByTag (tagId) {
      try {
          this.form.tagId = tagId
          if (tagId === 0) {
              this.$refs.tree.$children.forEach(item => {
                  item.$el.classList.remove('tree-node-active')
              })
          }
      } finally {
          this.getMemberList()
      }
  }

  formatTimeRange ({ start, end }) {
      this.form.startTime = start
      this.form.endTime = end
      this.getMemberList()
  }

  sizeChange (val) {
      this.form.current = 1
      this.form.size = val
      this.getMemberList()
  }

  search () {
      this.form.current = 1
      this.getMemberList()
  }

  setTagToMember (row) {
      this.showAddTagDialog = true
      this.currentMemberInfo = row
  }

  // 获取标签列表
  async getTagList () {
      try {
          const { data } = await getTagList()
          this.getMemberNum()
          this.tagList = data.result || []
      } catch (e) {
          throw (e)
      }
  }

  // 新建/编辑用户标签
  async editTag (tagInfo) {
      this.currentTag = {}
      if (tagInfo) {
          this.currentTag = { id: tagInfo.id, tagName: tagInfo.tagName }
      }
      this.showTagBox = true
  }

  editTagConfirm () {
      this.getTagList()
      this.getMemberList()
  }

  // 删除用户标签
  async deleteTag (id) {
      try {
          const { data } = await checkIsTagUsed(id)
          if (data.result) {
              await this.$confirm('删除标签后，该标签下的所有用户将失去该标签属性。是否确定删除？')
          }
          await deleteTag(id)
          await this.getTagList()
          await this.getMemberList()
          this.$success('删除用户标签成功')
      } catch (e) {
          throw (e)
      }
  }
}
</script>

<style lang="scss" scoped>
    .member {
        display: flex;
        width: 1680px;
        margin: 20px auto 0;
        background-color: #fff;

        .tag-list {
            position: relative;
            z-index: 1;
            width: 250px;
            height: calc(100vh - 80px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            overflow: auto;

            .tag-list-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 61px;
                padding: 0 15px;
                border-bottom: 1px solid #ddd;
            }

            .tag-list-default {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                padding: 0 20px;
                line-height: 50px;
                border-bottom: 1px solid #e7e7e7;
                cursor: pointer;

                > .icon {
                    width: 25px;
                    height: 18px;
                }

                > span {
                    flex: 1;
                    padding-left: 8px;
                }
            }

            .tag-list-options0 {
                position: relative;
                padding-left: 38px;
                line-height: 50px;
                font-size: var(--fontSize);
                color: #333;
                font-weight: bold;
                user-select: none;
                height: 50px;
                svg {
                    width: 25px;
                    height: 18px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
            }

            .tag-list-options {
                position: relative;
                .tag-ctrl {
                    position: absolute;
                    top: 0;
                    right: 15px;
                    display: inline-flex;
                    justify-content: flex-end;
                    align-items: center;
                    width: 100px;
                    height: 50px;
                    > .icon {
                        margin-left: 10px;
                    }
                    > .tag-ctrl-item {
                        display: block;
                    }
                }
            }
            .category-drop-tip {
                height: 100px;
                margin-top: 20px;
                line-height: 150px;
                text-align: center;
                color: #4C88D6;
                background:  #fff url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/roate.png") center top/65px auto no-repeat;
            }
        }

        .member-list {
            flex: 1;
            min-height: calc(100vh - 110px);
            padding-bottom: 30px;
            background-color: #ffffff;

            .detail-tags {
                span {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    max-width: 200px;
                    height: 18px;
                    margin: 0 10px 4px 0;
                    padding: 0 2px;
                    color: #4C88D6;
                    font-size: 10px;
                    border: 1px solid #4C88D6;
                }
            }
        }
    }
    .background-color-grey {
        background-color: #eee!important;
    }
    .blue-text {
        color: #4C88D6!important;
    }
</style>
