<template>
    <div class="member-list">
        <el-form
            :inline="true"
            class="wrap border-bottom mb-20"
        >
            <el-form-item class="mb-0">
                <el-input
                    clearable
                    @change="search"
                    placeholder="昵称"
                    v-model="form.nickName"
                />
            </el-form-item>
            <el-form-item class="mb-0">
                <el-button
                    type="primary"
                    style="width:98px"
                    @click="search"
                >
                    查询
                </el-button>
            </el-form-item>
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
      size: 10
  }

  total=0
  table= []
  routeName= ''
  // 生命周期函数
  created () {
      this.routeName = this.$route.name
      this.getYouKe()
  }

  // methods
  async getYouKe () {
      try {
          const { data: res } = await getYouKe(this.form)
          this.table = res.result.records
          this.total = res.result.total
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
</style>
