<template>
    <div class="member-list">
        <DataBar
            title="游客数据"
            :data-list="[
                { title: '今日新增游客', data: visitorData.todayUserCount },
                { title: '近30天新增游客', data: visitorData.monthUserCount },
                { title: '游客总量', data: visitorData.count }
            ]"
        />
        <SearchBox>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    style="width: 250px;"
                    v-model.trim="form.keyword"
                    placeholder="请输入用户昵称/真实姓名"
                    @change="search"
                />
            </el-form-item>
            <el-form-item
                label="来源："
            >
                <el-select
                    v-model="form.userSource"
                    clearable
                    @change="search"
                >
                    <el-option :value="''" label="全部" />
                    <el-option
                        v-for="(item, index) of sourceList"
                        :key="index"
                        :label="item.sourceName"
                        :value="item.sourceId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="首次访问时间：">
                <date-range :init="[form.createStartTime, form.createEndTime]"
                            @change="visitTimeRange"
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
                    @click="resetForm"
                >
                    清空筛选条件
                </el-button>
            </el-form-item>
        </SearchBox>
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
import { getYouKe, getYouKeCount } from '../../../../apis/member'
import DataBar from '../components/Data-Bar.vue'

@Component({
    components: {
        DataBar
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
      userSource: ''
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
      this.routeName = this.$route.name || ''
      this.getYouKe()
      this.getYouKeCount()
  }

  visitTimeRange ({ start, end }: DynamicObject) {
      this.form.createStartTime = start
      this.form.createEndTime = end
      this.search()
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

  sizeChange (val: number) {
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
          userSource: ''
      }
      this.getYouKe()
  }
}
</script>

<style lang="scss" scoped>
    .member-list {
        min-height: calc(100vh - 110px);
        padding-bottom: 30px;
        background-color: #ffffff;
    }
    .form-filter {
        padding: 20px 32px;
        background: #F5F6FA;
        border-radius: 10px;
        .filter-inp{
            width: 350px;
        }
        .filter-btns {
            padding-left: 96px;
            button{
                height: 32px;
                border-radius: 16px;
            }
        }
    }
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 14px;
        object-fit: cover;
    }
</style>
