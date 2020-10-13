<template>
    <div class="coupon-list">
        <div class="title-box">
            <span class="title">{{ statisticsData.couponName }} -</span>
            <div class="right-box">
                <div v-if="statisticsData.status === 4" class="coupon-status active-coupon">
                    <pl-svg name="icon-shijian1" fill="#fff" width="16" />
                    {{ statisticsData.statusText }}...
                </div>
                <div v-if="statisticsData.status === 0 || statisticsData.status === 2 || statisticsData.status === 3" class="coupon-status disabled-coupon">
                    <pl-svg name="icon-shijian1" fill="#fff" width="16" />
                    {{ statisticsData.statusText }}…
                </div>
                <div class="active-time" v-if="!statisticsData.distributionMethod">
                    <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" /> 领取时间： {{ statisticsData.receiveStartTime }} - {{ statisticsData.receiveEndTime }}
                </div>
            </div>
        </div>
        <div class="data-statistics-box">
            <div class="data-statistics">
                <div class="data-statistics-title">
                    领取量
                </div>
                <div>
                    <span class="data-statistics-num">{{ statisticsData.receiveAmount }}</span> <span class="data-statistics-unit">张</span>
                </div>
            </div>
            <div class="data-statistics">
                <div class="data-statistics-title">
                    已使用量
                </div>
                <div>
                    <span class="data-statistics-num">{{ statisticsData.usedAmount }}</span> <span class="data-statistics-unit">张</span>
                </div>
            </div>
        </div>
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    clearable
                    v-model.trim="form.name"
                    placeholder="请输入领取人/电话"
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    :clearable="true"
                    v-model="form.status"
                    @change="search"
                >
                    <el-option v-for="(item, index) in exportStatus" :label="item.label" :value="item.value" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="用券时间：">
                <date-range
                    ref="dateRange"
                    :clearable="true"
                    @change="dateChange"
                    size="small"
                    start-label="用券时间："
                    range-separator="至"
                    end-label=""
                />
            </el-form-item>
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
                    @click="changeExport"
                >
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>
        <div>
            <el-table
                class="content-table"
                :data="table"
                ref="table"
            >
                <span
                    slot="empty"
                    class="empty"
                >
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 没有查到相关信息，请确认后重新查看！
                </span>
                <el-table-column
                    prop="orderDetails"
                    label="满减券金额"
                    width="150"
                >
                    <template slot-scope="{row}">
                        满{{ row.useLimitAmount }}减{{ row.amount }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="发放数量"
                    width="100"
                >
                    <template slot-scope="{row}">
                        {{ row.destributeCount }}张
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="routeName === 'ViewCouponListActive'"
                    label="活动来源"
                    prop="activityName"
                    width="150"
                />
                <el-table-column
                    label="领取人昵称"
                    prop="receiverName"
                    width="200"
                />
                <el-table-column
                    prop="receiverMobile"
                    label="领取人电话"
                    width="150"
                />
                <el-table-column
                    prop="receiveTime"
                    label="领取时间"
                    width="150"
                />
                <el-table-column
                    prop="useTime"
                    label="用券时间"
                    width="300"
                />
                <el-table-column
                    width="1"
                    style="opacity: 0; display: none;"
                    type="expand"
                >
                    <template slot-scope="{ row }">
                        <el-table
                            :show-header="false"
                            :data="row.orders"
                            :cell-style="{ border: 'none' }"
                        >
                            <el-table-column v-if="routeName === 'ViewReductionCouponListActive'" width="1200" />
                            <el-table-column v-if="routeName === 'ViewReductionCouponListSelf'" width="1050" />
                            <el-table-column>
                                <template slot-scope="item">
                                    {{ item.row }}
                  &nbsp;&nbsp;&nbsp;
                                    <el-button size="mini" @click="goOrderDetail(item.row)">
                                        查看订单
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orders"
                    label="订单编号"
                    width="300"
                >
                    <template slot-scope="{ row }">
                        <span :class="{'more': row.orders.length>1}">
                            <div v-if="row.orders.length === 1" style="display: inline-flex">
                                <span v-text="row.orders[0]" />
                &nbsp;&nbsp;&nbsp;
                                <el-button size="mini" @click="goOrderDetail(row.orders[0])">查看订单</el-button>
                            </div>
                            <span v-if="row.orders.length > 1">
                                <span style="color: #666">
                                    {{ `订单编号(${row.orders.length})条` }}
                                </span>
                                <pl-svg
                                    name="icon-sanjiao"
                                    width="12"
                                    :style="{ cursor: 'pointer', transition: 'transform .2s linear', transform: row.expanded ? 'rotate(-180deg)' : 'rotate(0)'}"
                                    @click="toggleRowExpansion(row)"
                                />
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="statusText"
                    label="使用状态"
                    align="right"
                    header-align="right"
                />
            </el-table>
            <Pagination
                @change="getList"
                @sizeChange="sizeChange"
                v-model="form.current"
                :total="total"
                :sizes="true"
            />
        </div>

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item label="搜索关键词" prop="searchValue">
                    <el-input
                        v-model.trim="exportData.name"
                        placeholder="请输入订单编号/领取人/电话"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-select v-model="exportData.status">
                        <el-option v-for="(item,index) in exportStatus" :label="item.label" :value="item.value" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领取时间" prop="startTime">
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
import { selectCouponDetail, getCouponstatistics, exportReductionCoupon } from '../../../../apis/marketing-manage/coupon'
import { resetForm } from '../../../../assets/ts/utils'
import { createObjectUrl } from '../../../../assets/ts/upload'
import moment from 'moment'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'

export default {
    name: 'ViewCouponList',
    components: {
        ExportDialog
    },
    data () {
        return {
            showExport: false,
            exportData: {
                status: '',
                name: '',
                dateRange: 3, // 1 7日内 2 30日内 3自选
                startTime: '',
                endTime: ''
            },
            exportRules: {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            },
            exportStatus: [
                { label: '全部', value: '' },
                { label: '待使用', value: 0 },
                { label: '已使用', value: 1 },
                { label: '已过期', value: 99 }
            ],
            routeName: '',
            table: [],
            detail: {},
            keywords: '',
            form: {
                couponId: '',
                name: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            total: 0,
            statisticsData: ''
        }
    },
    watch: {
    // $route (to, from) {
    //   this.form.size = 10
    //   this.getList()
    // }
    },
    activated () {
        this.routeName = this.$route.name
        const params = this.$route.params
        this.form.couponId = params.id
        this.table = []
        this.total = 0
        this.getList()
        this.getStatistics()
    },
    deactivated () {
        resetForm(this.form, {
            current: 1,
            size: 10
        })
        this.form.status = ''
        this.$refs.dateRange.clear()
    },
    methods: {
    // 展开更多订单
        toggleRowExpansion (row) {
            row.expanded = !row.expanded
            this.$refs.table.toggleRowExpansion(row, row.expanded)
        },
        async getStatistics () {
            try {
                const { result } = await getCouponstatistics(this.form.couponId)
                this.statisticsData = result
            } catch (e) {
                throw e
            }
        },
        search () {
            this.form.current = 1
            this.getList()
            this.getStatistics()
        },
        sizeChange (val) {
            this.form.current = 1
            this.form.size = val
            this.getList()
        },
        async getList () {
            try {
                const { result } = await selectCouponDetail(this.form)
                this.table = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            this.form.current = 1
            this.getList()
        },
        goOrderDetail (id) {
            this.$router.push({ name: 'ClassOrderDetail', params: { id } })
        },
        changeExport () {
            const obj = {
                status: '',
                name: '',
                startTime: '',
                endTime: ''
            }
            obj.status = this.form.status
            obj.name = this.form.name
            obj.startTime = this.form.startTime
            obj.endTime = this.form.endTime
            this.exportData = {
                ...this.exportData,
                ...obj
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                status: '',
                name: '',
                dateRange: 3, // 1 7日内 2 30日内 3自选
                startTime: '',
                endTime: ''
            }
            this.$refs.exportForm.clearValidate()
            this.showExport = false
        },
        async exportDatechange ({ start, end }) {
            this.exportData.startTime = start
            this.exportData.endTime = end
            if (!start || !end) {
                return
            }
            await this.$nextTick()
            this.$refs.exportDatePicker.initDate()
        },
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
        },
        async exportList () {
            await this.$refs.exportForm.validate()
            const data = {
                couponId: this.$route.params.id,
                status: this.exportData.status,
                name: this.exportData.name,
                startTime: this.exportData.startTime,
                endTime: this.exportData.endTime
            }
            try {
                const blob = await exportReductionCoupon(data)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `满减券${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
                this.exportClose()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .inline-b{
    display: inline-block;
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
  .switch{
    margin-left: 10px;
  }
  .coupon-status{
    margin-right: 20px;
    padding: 2px 12px;
    background-color: #EC742E;
    border-radius:130px;
    color: #FFFFFF;
  }
  .active-coupon{
    background-color: #EC742E;
    color: #FFFFFF;
  }
  .disabled-coupon{
    background-color: #EEEEEE;
    color: #666666;
  }
  .right-box{
    display: flex;
    margin-left: 26px;
  }
  .active-time{
    border:1px solid rgba(204,204,204,1);
    border-radius:130px;
    padding: 2px 10px;
    font-size:16px;
    color: #666666;
  }
  .data-statistics-box{
    display: flex;
    padding: 23px 16px;
    border-bottom: 1px solid #E7E7E7;
    .data-statistics{
      width: 300px;
      padding-left: 40px;
      border-right: 1px solid #E7E7E7;
      .data-statistics-title {
        margin-bottom: 10px;
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
      .data-statistics-num{
        font-size: 50px;
        color: #333333;
      }
      .data-statistics-unit{
        font-size: 14px;
        color: #666666;
      }
    }
    .data-statistics:last-child{
      border: none;
    }
  }
  .coupon-list{
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    background-color: #ffffff;
    .title-box{
      display: flex;
      align-items: center;
      padding: 10px 23px;
      .title{
        color: #333333;
        font-weight: bold;
        font-size: 16px;
        padding-left: 11px;
      }
    }
    .right-btn {
      position: absolute;
      right: 40px;
    }

    .ml-40 {
      margin-left: 40px;
    }

    .empty{
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 12px;
        margin-right: 8px;
      }
    }

    .invoice-detail {
      line-height: 24px;

      .box {
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        color: #666;
        font-size: 12px;
        border-bottom: 1px solid #e7e7e7;

        &:nth-last-of-type(1) {
          border: none;
        }

        .status {
          font-size: 14px;
        }

        .time {
          display: inline-flex;
          flex-direction: column;
        }

        p {
          display: inline-flex;
          justify-content: space-between;

          span:nth-of-type(1) {
            width: 120px;
            text-align: right;
          }

          span:nth-of-type(2) {
            width: 100%;
            text-align: right;
          }
        }
      }
    }

    ::v-deep .content-table {
      .el-table__expand-column {
        .cell {
          display: none;
        }
      }

      .el-table__expanded-cell {
        padding: 0;

        .table-expand {
          display: flex;
          flex-direction: column;
          padding-left: 244px;

          .el-form-item {
            margin: 12px 0;
          }
        }
      }
    }

    .detail-Box {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      line-height: 21px;

      > .detail-content {
        display: flex;
        flex-direction: column;
        padding: 16px 0;
        border-bottom: 1px solid #E7E7E7;

        span {
          padding: 6px 0;
        }
      }

      > .detail-content:first-child {
        padding-top: 0;
      }

      .order-box {
        padding: 16px 0;
        border-bottom: 1px solid #E7E7E7;
        font-size: 14px;
        color: #666;

        .order-content {
          padding-bottom: 16px;

          .detail-content {
            display: flex;
            flex-direction: column;
            background-color: #F6F6F6;
            padding: 16px;

            > span {
              padding: 6px 0;
            }

            .commodity {
              padding: 6px 0;
              display: flex;
              flex-direction: row;

              .commodity-title {
                /*width: 124px;*/
              }

              .commodity-content {
                display: flex;
                flex: 1;
                flex-direction: column;
                div {
                  display: flex;
                  /*justify-content: space-between;*/
                  padding: 5px 0;
                  .commodity-name {
                    width: 233px;
                  }

                  .commodity-num {
                    width: 60px;
                    padding-left: 15px;
                  }
                }
                div:first-child{
                  padding-top: 0;
                }
              }
            }
          }

          .detail-content:first-child {
            border-bottom: 1px solid #E7E7E7;
          }
        }

        .order-content:last-child {
          padding-bottom: 0;
        }
      }
    }

    .more {
      display: flex;
      flex-direction: column;
      >div {
        display: flex;
        flex-direction: row;
        padding: 10px 0 10px 200px;
        font-size: 12px;
        color: #222222;
      }
    }
  }
</style>
