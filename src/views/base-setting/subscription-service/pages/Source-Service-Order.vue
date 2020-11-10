<template>
    <div :class="$style.functionalContainer">
        <search-box>
            <el-form-item label="搜索内容">
                <el-input style="width:350px"
                          clearable
                          v-model="params.keyword"
                          placeholder="请输入订单编号或课程资源名称" />
            </el-form-item>
            <el-form-item label="标签">
                <el-select
                    :clearable="true"
                    v-model="params.tagName"
                    @change="e => { params.current = 1; getList()}"
                    style="width: 128px;"
                >
                    <el-option
                        v-for="(item,index) in tags"
                        :key="index"
                        :label="item.dictDataValue"
                        :value="item.dictDataValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="来源">
                <el-select
                    :clearable="true"
                    v-model="params.source"
                    @change="e => { params.current = 1; getList()}"
                    style="width: 128px;"
                >
                    <el-option
                        v-for="(item,index) in source"
                        :key="index"
                        :label="item.dictDataValue"
                        :value="item.dictDataValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="支付时间">
                <date-range
                    :clearable="true"
                    @change="dateChange"
                    type="date"
                    size="small"
                    range-separator="至"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="getList"
                    round
                >
                    查询
                </el-button>
                <el-button
                    round
                    type="primary"
                    plain
                    @click="exportRepositoryOrder"
                >
                    导出订单
                </el-button>
                <el-button
                    type="text"
                    @click="reset"
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>
        <el-table
            :data="tableData"
        >
            <el-table-column prop="id" label="订单编号" />
            <el-table-column prop="resourceName" label="课程资源名称" />
            <el-table-column prop="resourceTagList" label="标签" width="400">
                <template #default="{row}">
                    <div :class="$style.tag" v-for="(item,index) in row.resourceTagList" :key="index">
                        {{ item }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="courseType" label="课程类型">
                <template #default="{ row }">
                    {{ row.courseType === 1 ? '单课程' : '系列课程' }}
                </template>
            </el-table-column>
            <el-table-column prop="videoCount" label="资源数量" />
            <el-table-column prop="sellingPrice" label="单价（元）" />
            <el-table-column prop="sellingPrice" label="实付款（元）" />
            <el-table-column prop="source" label="来源" />
            <el-table-column prop="payStatus" label="状态">
                <template #default="{ row }">
                    <span v-text="statusMap[row.payStatus]" />
                </template>
            </el-table-column>
            <el-table-column prop="payTime" label="支付时间" />
            <el-table-column align="right" header-align="right" width="100" prop="createTime" label="操作">
                <template #default="{row}">
                    <a style="color:#4F63FF;" @click="$router.push({ name: 'SourceServiceOrderDetail', params:{ id: row.id } })">
                        查看详情
                    </a>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :total="total" v-model="params.current" @change="getList" />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { getRepositoryOrderList, exportRepositoryOrder } from '../../../../apis/subscription-service'
import { createObjectUrl } from '../../../../assets/ts/upload'
import { getDataDictionary } from './../../../../apis/common'
import moment from 'moment'
  @Component({

  })
export default class LiveServiceOrder extends Vue {
  tableData = []
    tags = []
    source = []
    total = 0
    params = {
        current: 1,
        size: 10,
        keyword: '',
        tagName: '',
        source: '',
        startTime: '',
        endTime: ''
    }

  statusMap = {
      FINISHED: '已完成',
      WAIT_PAY: '待支付'
  }

  async created () {
      try {
          await this.getDataDictionary()
          await this.getList()
      } catch (e) { throw e }
  }

  async getDataDictionary () {
      try {
          const result = await Promise.all([getDataDictionary('RESOURCE_SOURCE_TAG'), getDataDictionary('RESOURCE_SOURCE')])
          this.tags = result[0].result || []
          this.source = result[1].result || []
      } catch (e) { throw e }
  }

  async getList () {
      try {
          const { result } = await getRepositoryOrderList(this.params)
          this.total = result.total || 0
          this.tableData = result.records || []
      } catch (e) { throw e }
  }

  async reset () {
      try {
          this.params = {
              current: 1,
              size: 10,
              keyword: '',
              tagName: '',
              source: '',
              startTime: '',
              endTime: ''
          }
          await this.getList()
      } catch (e) { throw e }
  }

  async dateChange ({ start, end }) {
      try {
          this.params.current = 1
          this.params.startTime = start
          this.params.endTime = end
          await this.getList()
      } catch (e) { throw e }
  }

  async exportRepositoryOrder () {
      try {
          const params = {
              keyword: this.params.keyword,
              tagName: this.params.tagName,
              source: this.params.source,
              startTime: this.params.startTime,
              endTime: this.params.endTime
          }
          const blob = await exportRepositoryOrder(params)
          const url = createObjectUrl(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `资源库订单列表${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
          a.click()
      } catch (e) { throw e }
  }
}
</script>

<style module lang='scss'>

    .functional-container {
        > .search {
            padding: 12px 20px;
        }
        .tag {
            display: inline-block;
            min-width: 78px;
            margin: 0 4px 4px 0;
            padding: 0 4px;
            border: 1px solid #ec742e;
            line-height: 20px;
            font-size: 12px;
            white-space: nowrap;
            text-align: center;
            color: #ec742e;
        }
    }

</style>
