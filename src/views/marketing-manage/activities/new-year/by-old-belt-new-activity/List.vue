<template>
    <div :class="$style.list">
        <div :class="$style.top">
            <span>活动列表</span>
        </div>
        <el-form inline class="wrap border-bottom mb-20">
            <el-form-item class="mb-0">
                <el-input style="width: 220px;" placeholder="活动名称/活动奖励" />
            </el-form-item>
            <el-form-item class="mb-0" label="状态: ">
                <el-select v-model="status" clearable>
                    <el-option value="1" label="所有活动" />
                    <el-option value="2" label="未开始" />
                    <el-option value="3" label="进行中" />
                    <el-option value="4" label="已结束" />
                    <el-option value="5" label="已成功" />
                </el-select>
            </el-form-item>
            <el-form-item class="mb-0" label="活动时间: ">
                <date-range />
            </el-form-item>
            <el-form-item class="mb-0">
                <el-button type="primary">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="data">
            <el-table-column label="活动名称" />
            <el-table-column label="组合数" />
            <el-table-column label="活动商品数" />
            <el-table-column label="组合总库存" />
            <el-table-column label="剩余库存" />
            <el-table-column label="参与人数" />
            <el-table-column label="浏览量" />
            <el-table-column label="访客数" />
            <el-table-column label="活动时间" />
            <el-table-column label="活动状态" />
            <el-table-column label="操作" width="350" align="center">
                <template>
                    <el-button>结束</el-button>
                    <el-button @click="$router.push({ name: 'ByOldBeltNewActivityDetail', params: { id: 123 } })">
                        详情
                    </el-button>
                    <el-button type="primary" plain @click="$router.push({ name: 'ByOldBeltNewActivityDetailData', params: { id: 123 } })">
                        查看数据
                    </el-button>
                    <el-popover
                        placement="bottom-end"
                        width="80"
                        trigger="hover"
                    >
                        <div :class="$style.popver">
                            <div>复制</div>
                            <div>分享</div>
                        </div>
                        <pl-svg :key="7" class="icon-gengduo" slot="reference" name="icon-gengduo" />
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <Pagination />
    </div>
</template>

<script>
import { getActivityList } from '../../../../../apis/marketing-manage/by-old-belt-new-activity'
export default {
    name: 'ByOldBeltNewActivityList',
    data () {
        return {
            status: '',
            data: [{}]
        }
    },
    async created () {
        await this.getList()
    },
    methods: {
        async getList () {
            try {
                await getActivityList()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
  .list {
    background-color: #fff;
    min-height: 80vh;
  }
  .top {
    display: flex;
    align-items: flex-end;
    height: 55px;
    background-color: #f6f6f6;
    > span {
      display: inline-block;
      width: 116px;
      line-height: 39px;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      background-color: #fff;
    }
  }
  .popver {
    line-height: 30px;
    text-align: center;
    color: #333;
    > div {
      cursor: pointer;
    }
  }
</style>
