<template>
    <div class="member-manage-list">
        <!--会员数据-->
        <div class="data">
            <h4>会员数据</h4>
            <div class="data-list">
                <div>
                    今日新增会员
                    <el-tooltip
                        effect="dark"
                        content="今日新增会员，是指当日新注册的会员数量，即当日绑定手机号的会员数量；会员包括普通会员和Helper。"
                        placement="top-start"
                    >
                        <i class="el-icon-info" />
                    </el-tooltip>
                    <b>{{ memberData.todayUserCount }}</b>
                </div>
                <div>
                    近30天新增会员
                    <el-tooltip
                        effect="dark"
                        content="近30天新增会员，是指从昨日开始结算，30天内新注册会员的数量；会员包括普通会员和Helper。"
                        placement="top-start"
                    >
                        <i class="el-icon-info" />
                    </el-tooltip>
                    <b>{{ memberData.monthUserCount }}</b>
                </div>
                <div>
                    累计会员总量
                    <el-tooltip
                        effect="dark"
                        content="累计会员总量，是指店铺中所有已注册会员的合计数量；会员包括普通会员和Helper。"
                        placement="top-start"
                    >
                        <i class="el-icon-info" />
                    </el-tooltip>
                    <b>{{ memberData.count }}</b>
                </div>
            </div>
        </div>
        <!--搜索-->
        <SearchBox label-width="110px">
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    @change="search"
                    placeholder="请输入用户昵称/真实姓名/手机号"
                    v-model="form.keyword"
                    style="width: 254px;"
                />
            </el-form-item>
            <el-form-item label="注册时间：">
                <date-range
                    :init="timeRange"
                    @change="p => {formatTimeRange(p, 'startTime', 'endTime')}"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item label="来源：">
                <el-select v-model="form.userSource" @change="search" clearable>
                    <el-option :value="''" label="全部" />
                    <el-option value="微信H5" label="微信H5" />
                </el-select>
            </el-form-item>
            <el-form-item label="购买次数：">
                <el-input
                    clearable
                    size="small"
                    style="width: 116px"
                    type="number"
                    @change="search"
                    placeholder="请输入次数"
                    v-model="form.purchasesMinNumber"
                />
                至
                <el-input
                    clearable
                    size="small"
                    style="width: 116px"
                    type="number"
                    @change="search"
                    placeholder="请输入次数"
                    v-model="form.purchasesMaxNumber"
                />
            </el-form-item>
            <el-form-item label="最近登录时间：">
                <date-range
                    :init="loginTimeRange"
                    @change="p => {formatTimeRange(p, 'loginStartTime', 'loginEndTime')}"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item label="用户类型：">
                <el-select
                    v-model="form.roleCode"
                    @change="search"
                    clearable
                >
                    <el-option :value="''" label="全部" />
                    <el-option value="MEMBERSHIP" label="普通会员" />
                    <el-option value="HELPER" label="Helper" />
                </el-select>
            </el-form-item>
            <el-form-item label="支付金额：">
                <el-input
                    clearable
                    size="small"
                    style="width: 116px"
                    @change="search"
                    type="number"
                    placeholder="请输入金额"
                    v-model.number="form.purchasesMinAmount"
                />
                至
                <el-input
                    clearable
                    size="small"
                    style="width: 116px"
                    type="number"
                    @change="search"
                    placeholder="请输入金额"
                    v-model.number="form.purchasesMaxAmount"
                />
            </el-form-item>

            <el-form-item label="最近购买时间：">
                <date-range
                    :init="lastPurchaseTimeRange"
                    @change="p => {formatTimeRange(p, 'lastPurchaseStartTime', 'lastPurchaseEndTime')}"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <br>
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    v-if="table && table.length"
                    round
                    type="primary"
                    plain
                    @click="changeExport"
                >
                    导出数据
                </el-button>
                <el-button type="text" @click="reset">清空筛选条件</el-button>
            </el-form-item>
        </SearchBox>
        <div class="member-info">
            <!-- 左侧标签列表 -->
            <div
                ref="tag-list"
                class="tag-list"
            >
                <div class="tag-list-top">
                    <el-button icon="el-icon-plus" @click="editTag" style="color: #333333; border-radius: 20px;">
                        新建标签
                    </el-button>
                </div>
                <div class="tag-list-default" @click="getMemberListByTag('')">
                    <span class="color-333">全部用户</span>
                </div>
                <div
                    @click.stop="getMemberListByTag(0)"
                    :class="{'tag-list-options':true, 'background-color-grey': form.tagId === 0}"
                >
                    无标签
                </div>
                <pl-tree
                    class="tag-list-options"
                    @node-click="treeClick"
                    @change="treeSort"
                    :tree="tagList"
                    :allow-expand="false"
                    ref="tree"
                    :has-left-icon="false"
                    :options="{
                        value: 'id'
                    }"
                >
                    <template #treeItemLabel="{ data }">
                        {{ data.tagName }}
                    </template>
                    <template #default="{ data }">
                        <div class="tag-ctrl">
                            <el-tooltip
                                class="tag-ctrl-item pointer"
                                effect="dark"
                                content="编辑"
                                placement="top-start"
                            >
                                <pl-svg :key="2" name="icon-edit-511af" @click.stop="editTag(data)" width="12" fill="#598BF8" class="icon" />
                            </el-tooltip>
                            <el-tooltip
                                class="tag-ctrl-item second-item pointer"
                                effect="dark"
                                content="删除"
                                placement="top-start"
                            >
                                <pl-svg :key="3" name="icon-delete-9811c" @click.stop="deleteTag(data.id)" width="12" fill="#598BF8" class="icon" />
                            </el-tooltip>
                        </div>
                    </template>
                </pl-tree>

                <div class="category-drop-tip">
                    <i>（拖动即可调整同级分类的顺序）</i>
                </div>
            </div>
            <!-- 会员列表 -->
            <div class="member-list">
                <div class="multiple-selection" v-if="multipleSelectionId.length">
                    <p>已选择<span>{{ multipleSelectionId.length }}</span>个用户</p>
                    <el-button type="text" @click="setTagToMultipleMember">设置标签</el-button>
                </div>
                <el-table
                    :data="table"
                    @selection-change="handleSelectionChange"
                    class="table-customer"
                    max-height="800"
                    empty-image="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png"
                >
                    <template slot="empty">
                        <p>还没有新注册的用户哦~</p>
                    </template>
                    <el-table-column
                        type="selection"
                        align="right"
                        width="55"
                    />
                    <el-table-column label="用户信息" width="250" fixed="left">
                        <template #default="{ row }">
                            <div class="member-detail">
                                <img
                                    :src="row.userImage"
                                    alt=""
                                >
                                <div class="info">
                                    <div class="intro">
                                        <span v-if="row.userType" class="user-type">{{ USER_TYPE[row.userType] }}</span>
                                        <span class="name">{{ row.nickName }}</span>
                                        <template>
                                            <pl-svg v-if="row.gender === 2" name="icon-women-be552" width="10" height="10" />
                                            <pl-svg v-if="row.gender === 1" name="icon-man-8b747" width="10" height="10" />
                                        </template>
                                    </div>
                                    <div class="tag">
                                        <template v-if="row.userTags && row.userTags.length">
                                            <el-tooltip class="item" effect="dark" :content="row.userTags.filter(item => item.tagName).map( item => item.tagName).join('  ')" placement="bottom">
                                                <div>
                                                    <span v-for="item in row.userTags" :key="item.id">{{ item && item.tagName }} </span>
                                                </div>
                                            </el-tooltip>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="真实姓名"
                    />
                    <el-table-column
                        prop="mobile"
                        label="手机号(账户)"
                        width="120"
                    />
                    <el-table-column label="用户类型">
                        <template #default="{ row }">
                            {{ ROLE_TYPE[row.roleCode] }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userSource"
                        label="来源"
                    />
                    <el-table-column
                        prop="purchasesNumber"
                        label="购买次数"
                    />
                    <el-table-column label="支付总额（元）">
                        <template #default="{ row }">
                            {{ row.purchasesAmount /100 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="注册时间"
                        width="170"
                    />
                    <el-table-column
                        prop="lastLoginTime"
                        label="最近登录时间"
                        width="170"
                    />
                    <el-table-column
                        prop="lastPurchaseTime"
                        label="最近购买时间"
                        width="150"
                    />
                    <el-table-column
                        label="操作"
                        width="80"
                        header-align="right"
                        align="right"
                    >
                        <template #default="{ row }">
                            <Operating>
                                <template slot="button-box">
                                    <a @click="$router.push({
                                        name: 'MemberManageDetail',
                                        params: { userId: row.id },
                                        query:{isHelper: row.roleCode === 'HELPER'? '1' : '0' }
                                    })">
                                        详情
                                    </a>
                                    <a @click="setTagToMember(row)">
                                        设置标签
                                    </a>
                                    <a @click="setRemarkToMember(row)">
                                        备注
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

            <!-- 编辑标签 -->
            <edit-member-tag
                :show.sync="showTagBox"
                :data.sync="currentTag"
                @editTag="editTagConfirm"
            />

            <!-- 添加标签 -->
            <add-tags
                :show.sync="showAddTagDialog"
                :is-multiple="isMultiple"
                :current-member="isMultiple? multipleSelectionId : currentMemberInfo"
                @confirm="editTagConfirm"
            />

            <!-- 导出 -->
            <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
                <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                    <el-form-item label="搜索关键字" prop="keyword">
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
                            <el-option v-for="item in tagList" :label="item.tagName" :value="item.id" :key="item.id" />
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

            <!--显示备注信息列表-->
            <RemarkList :show.sync="isShowRemarkList" :user-id="currentUserId" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import PlTree from '../../../../components/common/pl-tree'
import EditMemberTag from '../components/Edit-Member-Tag.vue'
import AddTags from '../components/Add-Tags.vue'
import RemarkList from '../components/Remark-List.vue'

import {
    getMemberData,
    getMemberList,
    exportMemberQuery,
    getTagList,
    deleteTag,
    sortTagList,
    checkIsTagUsed
} from '../../../../apis/member'
import { createObjectUrl } from '../../../../assets/ts/upload'
import moment from 'moment'
import { ElForm } from 'admall-element/types/form'

@Component({
    components: {
        PlTree,
        EditMemberTag,
        AddTags,
        ExportDialog,
        RemarkList
    }
})

export default class MemberManageList extends Vue {
  ROLE_TYPE = {
      MEMBERSHIP: '普通会员',
      HELPER: 'Helper'
  }

  USER_TYPE = {
      1: '家',
      2: '学',
      3: '其'
  }

  form = {
      keyword: '',
      current: 1,
      size: 10,
      roleCode: '',
      userSource: '',
      startTime: '',
      endTime: '',
      loginStartTime: '',
      loginEndTime: '',
      lastPurchaseStartTime: '',
      lastPurchaseEndTime: '',
      purchasesMinNumber: '',
      purchasesMaxNumber: '',
      purchasesMinAmount: '',
      purchasesMaxAmount: '',
      tagId: ''
  }

  timeRange = []
  loginTimeRange = []
  lastPurchaseTimeRange = []

  multipleSelection: any[] = []
  multipleSelectionId: any[] =[]

  total = 0
  table = []

  // 会员统计信息
  memberData = {
      todayUserCount: 0,
      monthUserCount: 0,
      count: 0
  }

  // 查看备注信息
  isShowRemarkList = false
  currentUserId = ''

  // 标签列表
  tagList = []
  // 显示标签编辑框
  showTagBox = false
  // 当前编辑的标签
  currentTag = {}
  // 是否批量设置标签
  isMultiple = true
  showAddTagDialog = false
  // 当前用户信息
  currentMemberInfo = {}

  // 导出数据
  showExport = false
  exportData: {[k: string]: number | string} = {
      keyword: '',
      roleType: '',
      // 1 7日内 2 30日内 3自选
      dateRange: 3,
      startTime: '',
      endTime: '',
      tagId: ''
  }

  exportRules = {
      startTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
      ]
  }

  async created () {
      await this.getMemberData()
      await this.getMemberList()
      await this.getTagList()
  }

  //  methods
  // 标签排序
  async treeSort (node: DynamicObject, list: DynamicObject[]) {
      const ids = list.map(item => item.id)

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
  async treeClick ({ id }: { id: string }) {
      await this.getMemberListByTag(id)
  }

  // 导出
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
          endTime: '',
          tagId: ''
      };
      (this.$refs.exportForm as ElForm).clearValidate()
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
          start = this.form.startTime || ''
          end = this.form.endTime || ''
      }

      this.exportDatechange({
          start: start && `${ moment(start).format(formatType) } 00:00:00`,
          end: end && `${ moment(end).format(formatType) } 23:59:59`
      })
  }

  async exportList () {
      await (this.$refs.exportForm as HTMLFormElement).validate()
      const exportData = this.exportData
      const data = {
          keyword: exportData.keyword,
          roleType: exportData.roleType,
          tagId: exportData.tagId,
          startTime: exportData.startTime,
          endTime: exportData.endTime
      }
      const blob = await exportMemberQuery(data)
      const url = createObjectUrl(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `会员列表${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
      a.click()
  }

  async getMemberData () {
      const { result: { todayUserCount, monthUserCount, count } } = await getMemberData()
      this.memberData = {
          todayUserCount,
          monthUserCount,
          count
      }
  }

  async getMemberList () {
      const params = { ...this.form }
      params.purchasesMinAmount = String(Number(params.purchasesMinAmount) * 100)
      params.purchasesMaxAmount = String(Number(params.purchasesMaxAmount) * 100)
      const { result: { records, total } } = await getMemberList(params)
      this.table = records
      this.total = total
  }

  // 处理批量操作数据
  handleSelectionChange (val: any[]) {
      this.multipleSelection = val
      this.multipleSelectionId = val.map(item => item.id)
  }

  // 根据标签获取用户列表
  async getMemberListByTag (tagId: string) {
      try {
          this.form.tagId = tagId
          if (!tagId) {
              (this.$refs.tree as HTMLFormElement).$children[0].$children.forEach((item: Vue) => {
                  item.$el.classList.remove('tree-node-active')
              })
          }
      } catch (e) {
          throw e
      } finally {
          await this.getMemberList()
      }
  }

  async formatTimeRange ({ start, end }: any, startText: 'lastPurchaseStartTime' | 'loginStartTime' | 'startTime', endText: 'lastPurchaseEndTime' | 'loginEndTime' | 'endTime') {
      this.form[startText] = start
      this.form[endText] = end
      await this.search()
  }

  async sizeChange (val: number) {
      this.form.current = 1
      this.form.size = val
      await this.search()
  }

  checkPurchasesNumber () {
      let minNumber: number = Number(this.form.purchasesMinNumber) || 0
      this.form.purchasesMinNumber = String(minNumber || '')
      if (minNumber && (!Number.isInteger(minNumber) || minNumber < 0)) {
          return this.$warning('当前输入框只支持输入正整数')
      }
      let maxNumber: number = Number(this.form.purchasesMaxNumber) || 0
      this.form.purchasesMaxNumber = String(maxNumber || '')
      if (maxNumber && (!Number.isInteger(maxNumber) || maxNumber < 0)) {
          return this.$warning('当前输入框只支持输入正整数')
      }
      if (minNumber && maxNumber && minNumber > maxNumber) {
          [minNumber, maxNumber] = [maxNumber, minNumber]
          this.form.purchasesMinNumber = String(minNumber)
          this.form.purchasesMaxNumber = String(maxNumber)
      }
      return false
  }

  checkPurchasesAmount () {
      let minNumber: number = Number(this.form.purchasesMinAmount) || 0
      this.form.purchasesMinAmount = String(minNumber || '')
      if (minNumber && minNumber < 0) {
          return this.$warning('当前输入框只支持输入正数')
      }
      let maxNumber: number = Number(this.form.purchasesMaxAmount) || 0
      this.form.purchasesMinAmount = String(maxNumber || '')
      if (maxNumber && maxNumber < 0) {
          return this.$warning('当前输入框只支持输入正数')
      }
      if (minNumber && maxNumber && minNumber > maxNumber) {
          [minNumber, maxNumber] = [maxNumber, minNumber]
          this.form.purchasesMinAmount = String(minNumber)
          this.form.purchasesMaxAmount = String(maxNumber)
      }
      return false
  }

  async search () {
      if (this.checkPurchasesNumber()) return
      if (this.checkPurchasesAmount()) return
      this.form.current = 1
      await this.getMemberList()
  }

  async reset () {
      const tagId = this.form.tagId
      this.form = {
          keyword: '',
          current: 1,
          size: 10,
          roleCode: '',
          userSource: '',
          startTime: '',
          endTime: '',
          loginStartTime: '',
          loginEndTime: '',
          lastPurchaseStartTime: '',
          lastPurchaseEndTime: '',
          purchasesMinNumber: '',
          purchasesMaxNumber: '',
          purchasesMinAmount: '',
          purchasesMaxAmount: '',
          tagId: ''
      }
      this.timeRange = []
      this.loginTimeRange = []
      this.lastPurchaseTimeRange = []
      this.form.tagId = tagId
      await this.search()
  }

  setTagToMultipleMember () {
      this.isMultiple = true
      this.showAddTagDialog = true
  }

  setTagToMember (row: any) {
      this.isMultiple = false
      this.currentMemberInfo = row
      this.showAddTagDialog = true
  }

  // 设置备注
  setRemarkToMember (row: any) {
      this.isShowRemarkList = true
      this.currentUserId = row.id
  }

  // 获取标签列表
  async getTagList () {
      const { result } = await getTagList()
      this.tagList = result || []
  }

  // 新建/编辑用户标签
  async editTag (tagInfo: any) {
      if (tagInfo) {
          this.currentTag = { id: tagInfo.id, sort: tagInfo.sort, tagName: tagInfo.tagName }
      } else {
          this.currentTag = {}
      }
      this.showTagBox = true
  }

  async editTagConfirm () {
      await this.getTagList()
      await this.getMemberList()
  }

  // 删除用户标签
  async deleteTag (id: string) {
      const data = await checkIsTagUsed(id)
      if (data.result) {
          await this.$confirm('删除标签后，该标签下的所有用户将失去该标签属性是否确定删除？')
      }
      await deleteTag(id)
      await this.getTagList()
      await this.getMemberList()
      this.$success('删除用户标签成功')
  }
}
</script>

<style lang="scss" scoped>
.member-manage-list {
    .data {
        font-size: 16px;
        color: #333333;
        .data-list {
            display: flex;
            margin: 20px 0 33px;
            > div {
                margin: 0 98px;
                > b {
                    display: block;
                    font-size: 48px;
                }
            }
        }
    }

    .member-info {
        display: flex;
        margin-top: 33px;
    }

    .tag-list {
        position: relative;
        z-index: 1;
        width: 200px;
        height: 800px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
        background-color: #F5F5F5;
        overflow: auto;

        .tag-list-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 61px;
            padding: 0 16px;
            border-bottom: 1px solid #ddd;
        }

        .tag-list-default {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            line-height: 50px;
            border-bottom: 1px solid #e7e7e7;
            cursor: pointer;

            > span {
                flex: 1;
                padding-left: 16px;
            }
        }

        .tag-list-options {
            padding-left: 16px;
        }

        .tag-list-options {
            line-height: 50px;
            position: relative;
            .tag-ctrl {
                position: absolute;
                top: -8px;
                right: 15px;
                display: inline-flex;
                justify-content: flex-end;
                align-items: center;
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
            margin-top: 50px;
            padding: 100px 20px 0;
            text-align: center;
            color: #4C88D6;
            background:  transparent url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/roate.png") center top/65px auto no-repeat;
        }
    }

    .member-list {
        width: calc(100% - 260px);
        min-height: calc(100vh - 110px);
        padding-bottom: 30px;
        background-color: #ffffff;
        .multiple-selection {
            padding-left: 21px;
            > p {
                display: inline-block;
                > span {
                    color: #4F63FF;
                }
            }
        }
        .no-data {
            margin-top: 145px;
            margin-bottom: 249px;
        }
        .member-detail {
            display: flex;
            > img {
                width: 40px;
                height: 40px;
                margin-right: 12px;
                border-radius: 14px;
                object-fit: cover;
            }
            .info {
                display: inline-block;
                .intro {
                    display: flex;
                    line-height: 18px;
                    .user-type {
                        display: inline-block;
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
                    .name {
                        max-width: 81px;
                        margin-right: 6px;
                        @include elps-wrap(1);
                    }
                    >svg {
                        vertical-align: -2px;
                    }
                }
                .tag {
                    margin-top: 8px;
                    width: 110px;
                    color: #999999;
                    @include elps-wrap(1);
                }
            }
        }
        .operate {
          > a {
              padding: 0 13px;
              border-left: 1px solid;
              font-size: 14px;
              color: #4F63FF;
              &:first-child {
                  margin-left: -20px!important;
              }
          }
        }
    }

    .tree-tag-name {
        // padding: 0 16px;
    }
    .background-color-grey {
        background-color: #eee!important;
    }
    #color-333{
        color: #333;
    }
}
</style>
