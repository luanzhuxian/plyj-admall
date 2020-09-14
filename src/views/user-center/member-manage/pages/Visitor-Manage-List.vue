<template>
    <div class="member-list">
        <div class="data">
            <h4>游客数据</h4>
            <div class="data-list">
                <div>
                    今日新增会员
                    <b>{{ visitorData.data0 }}</b>
                </div>
                <div>
                    近30天新增会员
                    <b>{{ visitorData.data30 }}</b>
                </div>
                <div>
                    累计会员总量
                    <b>{{ visitorData.data99 }}</b>
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
                    v-model.trim="form.nickName"
                    placeholder="请输入用户昵称/真实姓名/手机号"
                    @change="search"
                    class="filter-inp"
                />
            </el-form-item>
            <el-form-item
                label="来源"
            >
                <el-select
                    v-model="form.sourceId"
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
                prop="mallUserId"
                label="ID"
            />
            <el-table-column
                prop="invitationCode"
                label="头像"
            >
                <template #default="{ row }">
                    <img
                        height="50"
                        :src="row.avatarUrl"
                        alt=""
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="nickName"
                label="昵称"
            />
            <el-table-column
                prop="sex"
                label="性别"
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

<script>
import { Vue, Component } from 'vue-property-decorator'

import Pagination from '../../../../components/common/Pagination'

import { getYouKe } from '../../../../apis/member'

@Component({
    components: {
        Pagination
    }
})

export default class VistorManageList extends Vue {
  // 数据
  leave=''
  form= {
      nickName: '',
      current: 1,
      size: 10,
      sourceId: '1'
  }

  sourceList = [
      { sourceId: '1', sourceName: '微信H5' },
      { sourceId: '2', sourceName: '小程序' }
  ]

  total=0
  table= []
  routeName= ''
  visitorData = {
      data0: 0,
      data30: 30,
      data99: 99
  }

  // 生命周期函数
  created () {
      this.routeName = this.$route.name
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

  sizeChange (val) {
      this.form.current = 1
      this.form.size = val
      this.getYouKe()
  }

  search () {
      this.form.current = 1
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
</style>
