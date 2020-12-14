<template>
    <div :class="$style.container">
        <div :class="$style.tabCardContent">
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    粽粽大礼
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.finalCount || 0" /> <span /> <span>类</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    已领取粽粽大礼
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.finalSum || 0" /> <span>个</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    阶梯奖品
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.ladderCount || 0" /> <span>类</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    已领取阶梯奖品
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.ladderSum || 0" /> <span>个</span>
                </div>
            </div>
        </div>
        <el-form
            :inline="true"
            class="wrap border-bottom mb-20"
        />
        <el-table :data="tableData" class="mt-10" stripe>
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到数据，请确认后重新查询！
            </span>
            <el-table-column
                prop="name"
                label="奖品类型"
                header-align="left"
                align="left"
            >
                <template #default="{row}">
                    {{ row.awardType === 1 ? '阶梯奖品' : '粽粽大礼' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="奖品名称"
                header-align="center"
                align="center"
            />
            <el-table-column
                label="获得条件"
                header-align="center"
                align="center"
            >
                <template #default="{row}">
                    <span v-if="row.awardType === 1">
                        获得 {{ row.ladderAwardLocation }} 个签到
                    </span>
                    <span v-if="row.awardType === 2">
                        获得 全部 签到
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="stock"
                label="总库存"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="surStock"
                label="剩余库存"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="alreceived"
                label="已领取"
                header-align="right"
                align="right"
            />
        </el-table>
        <pagination
            v-model="filterForm.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="getList"
            style="margin-top: 12px;text-align: center;"
        />
    </div>
</template>

<script>
import { queryGiftList } from '../../../../apis/marketing-manage/new-year/year-flavor'
export default {
    name: 'SignInGiftData',
    data () {
        return {
            filterForm: {
                current: 1,
                size: 10
            },
            tableData: [],
            total: 0,
            statistics: {
                ladderCount: 0,
                finalCount: 0,
                ladderSum: 0,
                finalSum: 0
            }
        }
    },
    async created () {
        try {
            await this.getList()
        } catch (e) { throw e }
    },
    methods: {
        async sizeChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.size = val
                await this.getList()
            } catch (e) { throw e }
        },
        // 获取列表数据
        async getList () {
            try {
                const activityId = this.$route.params.id
                const { result: { total, records } } = await queryGiftList(activityId, this.filterForm)
                this.statistics = {
                    ladderCount: records[0] && records[0].ladderCount,
                    finalCount: records[0] && records[0].finalCount,
                    ladderSum: records[0] && records[0].ladderSum,
                    finalSum: records[0] && records[0].finalSum
                }
                this.tableData = records[0] && records[0].list
                this.total = total
            } catch (e) { throw e }
        }
    }
}
</script>

<style lang="scss" module scoped>

  .container {
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    background-color: #ffffff;
    .el-form-item__label{
      color: #333333;
      font-size: 12px;
      font-weight: bold;
    }
    .wrap{
      border-top: 1px solid #e7e7e7;
      padding-top: 20px;
      padding-bottom: 0 !important;
    }
    > .tab-card-content {
      display: flex;
      height: 205px;
      padding: 23px 0;
      > .tab-card-item {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        padding-left: 40px;
        width: max-content;
        &:nth-last-of-type(1):after {
          display: none;
        }
        &:after {
          position: absolute;
          right: 0;
          top: 0;
          content: '';
          width: 1px;
          height: 100%;
          background-color: $--border-color;
        }
        > .yesterday, .see-detail {
          font-size: 14px;
          line-height: 19px;
          padding: 0;
          color: $--color-primary-blue;
        }
        > .card-item-title {
          font-size: 18px;
          font-weight: bold;
        }
        > .card-item-content {
          display: flex;
          align-items: flex-end;
          position: relative;
          font-size: 14px;
          padding-right: 20px;
          color: #666;
          > i {
            color: #333;
            line-height: 67px;
            font-size: 50px;
            word-break: keep-all;
          }
          > span {
            margin-left: 14px;
            line-height: 40px;
          }
          > .watch-detail {
            color: $--color-primary-blue;
            font-size:12px;
            position: absolute;
            cursor: pointer;
            bottom: -29px;
            left: -11px;
          }
        }
      }
    }
  }

</style>
