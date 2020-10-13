<template>
    <div :class="$style.container">
        <div :class="$style.tabCardContent">
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    浏览量
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.pv || 0" /> <span>次</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    访客量
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.uv || 0" /> <span>人</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    参与人数
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.takeSum || 0" /> <span>人</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    获得抽奖机会人数
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.drawSum || 0" /> <span /> <span>人</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    获得年味大礼人数
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.finalSum || 0" /><span>人</span>
                </div>
            </div>
        </div>
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filterForm.condition"
                    placeholder="搜索手机号码"
                    clearable
                />
            </el-form-item>
            <el-form-item label="参与时间：">
                <date-range
                    size="small"
                    :clearable="true"
                    @change="dateChange"
                    type="datetime"
                    range-separator="至"
                />
            </el-form-item>
            <div />
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    round
                    plain
                    @click="dialogVerificationVisible = true"
                >
                    去核销
                </el-button>
                <el-button
                    round
                    plain
                    @click="exportData"
                    :disabled="total === 0"
                >
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="tableData" class="mt-10" stripe>
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                没有查到数据，请确认后重新查询！
            </span>
            <el-table-column
                prop="nick"
                label="昵称"
                header-align="left"
                align="left"
            />
            <el-table-column
                prop="phoneNo"
                label="联系方式"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="signinCount"
                label="获得年味数量"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="awardCount"
                label="获得礼品数量"
                header-align="center"
                align="center"
            >
                <template #default="{row}">
                    <el-popover
                        placement="top"
                        trigger="click"
                    >
                        <el-table :data="giftData">
                            <el-table-column align="center" width="150" prop="awardName" label="获得奖品" />
                            <el-table-column align="center" prop="awardCount" label="获得数量" />
                            <el-table-column align="center" width="150" prop="gainTime" label="获奖时间" />
                            <el-table-column align="center" width="150" prop="useTime" label="使用时间" />
                            <el-table-column align="center" prop="address" label="状态">
                                <template #default="{row:{status,awardType}}">
                                    <span v-if="awardType === 1">{{ giftStatus[status] || '其他' }}</span>
                                    <span v-else-if="awardType === 2">{{ useStatus[status] || '其他' }}</span>
                                    <span v-else>{{ couponStatus[status] || '其他' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button plan slot="reference" @click="getActivityGiftDetail(row)">
                            查看 ({{ row.awardCount || 0 }})
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="drawTime"
                label="抽奖时间"
                header-align="center"
                align="center"
            />
            <el-table-column
                prop="takeTime"
                label="参与时间"
                header-align="right"
                align="right"
            />
            <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="$router.push({name:'OrderDetail', params:{id: scope.row.orderId}})"
          >
            查看订单
          </el-button>
        </template>
      </el-table-column> -->
        </el-table>
        <pagination
            v-model="filterForm.current"
            :sizes="true"
            :total="total"
            @sizeChange="sizeChange"
            @change="getList"
            style="margin-top: 12px;text-align: center;"
        />
        <verification :dialog-verification-visible.sync="dialogVerificationVisible" />
    </div>
</template>

<script>
import verification from '../../../../../components/order-center/Verification.vue'
import moment from 'moment/moment'
import { createObjectUrl } from '../../../../../assets/ts/upload'
import { activityStatistic, queryActivityList, exportActivityStatistic, queryActivityGiftDetail } from '../../../../../apis/marketing-manage/new-year/year-flavor'
export default {
    components: {
        verification
    },
    data () {
        return {
            filterForm: {
                startTime: '',
                endTime: '',
                condition: '',
                current: 1,
                size: 10
            },
            tableData: [],
            giftData: [],
            dialogVerificationVisible: false,
            total: 0,
            // 礼品状态
            giftStatus: ['待使用', '已使用', '已过期'],
            // 奖学金状态
            useStatus: ['待领取', '未使用', '已使用', '已过期', '已失效', '已删除'],
            // 券使用状态
            couponStatus: ['待使用', '已使用', '已过期'],
            statistics: {
                // 浏览量
                pv: 0,
                // 访客量
                uv: 0,
                // 参与人数
                takeSum: 0,
                // 抽奖人数
                drawSum: 0,
                // 年味大礼包人数
                finalSum: 0
            }
        }
    },
    activated () {
        this.getData()
        this.getList()
    },
    deactivated () {
        this.filterForm = {
            startTime: '',
            endTime: '',
            condition: '',
            current: 1,
            size: 10
        }
    },
    methods: {
        async search () {
            try {
                this.filterForm.current = 1
                this.getList()
            } catch (e) { throw e }
        },
        async dateChange ({ start, end }) {
            try {
                this.filterForm.current = 1
                this.filterForm.startTime = start || ''
                this.filterForm.endTime = end || ''
                this.getList()
            } catch (e) { throw e }
        },
        async sizeChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.size = val
                this.getList()
            } catch (e) { throw e }
        },
        async getData () {
            try {
                const { result } = await activityStatistic(this.$route.params.id)
                this.statistics = result
            } catch (e) { throw e }
        },
        // 获得奖品详情
        async getActivityGiftDetail ({ userId }) {
            try {
                const activityId = this.$route.params.id
                const { result } = await queryActivityGiftDetail(activityId, userId)
                this.giftData = result
            } catch (e) { throw e }
        },
        // 获取列表数据
        async getList () {
            try {
                const activityId = this.$route.params.id
                const { data: { result: { records, total } } } = await queryActivityList(activityId, this.filterForm)
                this.tableData = records || []
                this.total = total
            } catch (e) { throw e }
        },
        // 导出数据
        async exportData () {
            try {
                const params = {
                    startTime: '',
                    endTime: '',
                    condition: ''
                }
                const activityId = this.$route.params.id
                const blob = await exportActivityStatistic(activityId, params)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `数据-${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
            } catch (e) {
                throw e
            }
        },
        // 查看明细
        watchDetail () {
            this.$alert({
                title: '总营业额明细',
                message: `<p>定金支付总额：${ this.statistics.depositAmount || 0 } 元<p/><p>支付尾款总额：${ this.statistics.preBalanceAmount || 0 }元</p>`,
                dangerouslyUseHTMLString: true
            })
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
    .wrap {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e7e7e7;
      padding: 12px 20px;
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
