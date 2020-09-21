<template>
    <div class="member-list">
        <div class="data">
            <h4>游客数据</h4>
            <div class="data-list">
                <div>
                    <b>{{ visitorData.todayUserCount }}</b>
                    今日新增游客
                </div>
                <div>
                    <b>{{ visitorData.monthUserCount }}</b>
                    近30天新增游客
                </div>
                <div>
                    <b>{{ visitorData.count }}</b>
                    游客总量
                </div>
            </div>
        </div>
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
                label="来源"
            >
                <el-select
                    v-model="form.userSource"
                    clearable
                    @change="search"
                >
                    <el-option
                        v-for="(item, index) of sourceList"
                        :key="index"
                        :label="item.sourceName"
                        :value="item.sourceId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="首次访问时间">
                <date-range :init="[form.createStartTime, form.createEndTime]"
                            @change="visitTimeRange"
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
                    type="text"
                    size="mini"
                    @click="resetForm"
                >
                    清空筛选条件
                </el-button>
            </div>
        </el-form>
        <div class=" mb-1" />
        <el-table
            :data="table"
            class="table-customer"
        >
            <el-table-column
                label="头像"
            >
                <template #default="{ row }">
                    <img
                        class="avatar"
                        :src="row.userHeadImage"
                        alt=""
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="nickName"
                label="昵称"
            />
            <el-table-column
                label="性别"
            >
                <template slot-scope="{row}">
                    <span v-if="row.gender === 1">男</span>
                    <span v-if="row.gender === 2">女</span>
                    <span v-if="row.gender === 3">未知</span>
                </template>
            </el-table-column>
            <el-table-column
                label="地区"
            >
                <template slot-scope="{row}">
                    {{ row.province + row.city }}
                </template>
            </el-table-column>
            <el-table-column
                prop="userSource"
                label="来源"
            />
            <el-table-column
                prop="createTime"
                label="首次访问时间"
            />
        </el-table>
        <Pagination
            @change="getYouKe"
            @sizeChange="sizeChange"
            v-model="form.current"
            :total="total"
            :sizes="true"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import Pagination from '../../../../components/common/Pagination'

import { getYouKe, getYouKeCount } from '../../../../apis/member'

@Component({
    components: {
        Pagination
    }
})

export default class VistorManageList extends Vue {
  // 数据
  leave=''
  form= {
      keyword: '',
      current: 1,
      size: 10,
      createStartTime: '',
      createEndTime: '',
      userSource: '微信H5'
  }

  sourceList = [
      { sourceId: '微信H5', sourceName: '微信H5' },
      { sourceId: '小程序', sourceName: '小程序' }
  ]

  total=0
  table= []
  routeName= ''
  visitorData = {
      todayUserCount: 0,
      monthUserCount: 0,
      count: 0
  }

  // 生命周期函数
  created () {
      this.routeName = this.$route.name
      this.getYouKe()
      this.getYouKeCount()
  }

  visitTimeRange ({ start, end }) {
      this.form.createStartTime = start
      this.form.createEndTime = end
      this.getYouKe()
  }

  // methods
  async getYouKe () {
      try {
          const { result } = await getYouKe(this.form)
          this.table = result.records
          this.total = result.total
      } catch (e) {
          throw e
      }
  }

  async getYouKeCount () {
      try {
          const { result } = await getYouKeCount()
          this.visitorData = result
      } catch (e) {
          throw e
      }
  }

  sizeChange (val) {
      this.form.current = 1
      this.form.size = val
      this.getYouKe()
  }

  search () {
      this.form.current = 1
      this.getYouKe()
  }

  resetForm () {
      this.form = {
          keyword: '',
          current: 1,
          size: 10,
          createStartTime: '',
          createEndTime: '',
          userSource: '微信H5'
      }
      this.getYouKe()
  }
}
</script>

<style lang="scss" scoped>
    .member-list{
        min-height: calc(100vh - 110px);
        padding-bottom: 30px;
        background-color: #ffffff;
    }
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
    .avatar{
        width: 40px;
        height: 40px;
        border-radius: 14px;
    }
</style>
