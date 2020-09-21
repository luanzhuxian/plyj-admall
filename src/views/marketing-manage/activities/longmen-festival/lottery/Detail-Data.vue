<template>
    <div :class="$style.detailData">
        <div :class="$style.dataPreview" class="border-bottom">
            <div :class="$style.previewItem">
                <div :class="$style.type">
                    发放量
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.allAwardLimit || 0" />
                    <span class="gray-2">个</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    中奖量
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.awardDraw || 0" />
                    <span class="gray-2">个</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    参与人数
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.joinUserNumber || 0" />
                    <span class="gray-2">人</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    优惠券礼包
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.favorablePrice || 0" />
                    <span class="gray-2">元</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    奖学金
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.scholarshipPrice || 0" />
                    <span class="gray-2">元</span>
                </div>
            </div>

            <div :class="$style.previewItem">
                <div :class="$style.type">
                    礼品
                </div>
                <div>
                    <i :class="$style.value" v-text="statistics.giftSize || 0" />
                    <span class="gray-2">个</span>
                </div>
            </div>
        </div>

        <search-box class="mt-24" label-width="85px">
            <el-form-item label="搜索内容：">
                <el-input v-model="form.keyword" @change="search()" placeholder="输入关键字" />
            </el-form-item>
            <el-form-item label="参与时间：">
                <date-range
                    :clearable="true"
                    disable-after
                    @change="dateChange"
                    size="small"
                    start-label="参与时间："
                    range-separator="至"
                    end-label=""
                    ref="dateRange"
                />
            </el-form-item>
            <div />
            <el-form-item>
                <el-button round type="primary" @click="search()">
                    查询
                </el-button>

                <el-button round type="primary" @click="dialogVerificationVisible = true">
                    核销
                </el-button>
                <el-button
                    v-if="total"
                    round
                    type="primary"
                    plain
                    @click="changeExport"
                >
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>

        <el-table
            ref="orderTable"
            :data="data"
            stripe
        >
            <el-table-column label="注册用户昵称" prop="userName" />
            <el-table-column label="联系方式" prop="userMobile" />
            <el-table-column label="获得抽奖次数" prop="luckDrawTotal" />
            <el-table-column label="已使用抽奖次数" prop="useLuckDrawNumber" />
            <el-table-column label="中奖">
                <template #default="{ row }">
                    {{ row.prizeWinningNumber }}
                    <el-button v-if="row.prizeWinningNumber" @click="getWinningGift(row.userId)" type="text">
                        查看
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="参与时间"
                prop="createTime"
                align="right"
                header-align="right"
            />
        </el-table>
        <Pagination
            v-model="form.current"
            :size="form.size"
            :total="total"
            @change="getList"
        />

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item label="搜索关键词" prop="keyword">
                    <el-input
                        v-model.trim="exportData.keyword"
                        placeholder="搜索关键字"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="参与时间" prop="startDate">
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
                        :init="exportData.startDate ? [exportData.startDate,exportData.endDate] : []"
                        :clearable="true"
                        @change="exportDatechange"
                        range-separator="至"
                        end-label=""
                    />
                </el-form-item>
            </el-form>
        </ExportDialog>

        <GiftList :show.sync="giftPreview.show" :gift-data="giftPreview.giftData" />

        <verification :dialog-verification-visible.sync="dialogVerificationVisible" />
    </div>
</template>

<script>
import moment from 'moment/moment'
import ExportDialog from '../../../../order-manage/components/Export-Dialog'
import { createObjectUrl } from '../../../../../assets/ts/upload'
import { getLotteryStatisticsList, exportLotteryStatistic, getWinningGift } from '../../../../../apis/marketing-manage/lonmen-festival/lottery'
import verification from '../../../../../components/order-center/Verification.vue'
import GiftList from '../components/Gift-List'

export default {
    name: 'LongmenLotteryData',
    components: {
        verification,
        GiftList,
        ExportDialog
    },
    data () {
        return {
            dialogVerificationVisible: false,
            showExport: false,
            exportData: {
                keyword: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3,
                startDate: '',
                endDate: ''
            },
            exportRules: {
                startDate: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            },
            data: [],
            form: {
                keyword: '',
                current: 1,
                startDate: '',
                endDate: '',
                size: 10
            },
            total: 0,
            giftPreview: {
                show: false,
                giftData: []
            }
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        statistics: {
            type: Object,
            default: () => ({})
        }
    },
    async created () {
        try {
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getList () {
            try {
                const { data } = await getLotteryStatisticsList(this.form, this.id)
                this.data = data.result.records || []
                this.total = data.result.total
            } catch (e) {
                throw e
            }
        },
        async getWinningGift (userId) {
            try {
                const { data } = await getWinningGift(this.id, userId)
                this.giftPreview.show = true
                this.giftPreview.giftData = data.result
            } catch (e) {
                throw e
            }
        },
        dateChange ({ start, end }) {
            this.form.startDate = start || ''
            this.form.endDate = end || ''
            try {
                this.search()
            } catch (e) {
                throw e
            }
        },
        async search () {
            try {
                this.form.current = 1
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        changeExport () {
            this.exportData = {
                ...this.exportData,
                ...this.form
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                keyword: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3,
                startDate: '',
                endDate: ''
            }
            this.$refs.exportForm.clearValidate()
            this.showExport = false
        },
        async exportDatechange ({ start, end }) {
            this.exportData.startDate = start
            this.exportData.endDate = end
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
                start = this.form.startDate || ''
                end = this.form.endDate || ''
            }

            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        },
        async exportList () {
            try {
                await this.$refs.exportForm.validate()
                const {
                    startDate,
                    endDate,
                    keyword
                } = this.exportData
                const data = await exportLotteryStatistic(this.id, {
                    startDate,
                    endDate,
                    keyword
                })
                const a = document.createElement('a')
                a.href = createObjectUrl(data)
                a.download = `${ this.statistics.name } ${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
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

<style module lang="scss">

  .data-preview {
    display: flex;
    align-items: center;
    height: 142px;
    padding: 0 24px;
  }
  .preview-item {
    height: 94px;
    padding: 9px 50px;
    border-right: 1px solid #e7e7e7;
    &:nth-last-of-type(1) {
      border-right: none;
    }
    .type {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .value {
      margin-right: 14px;
      font-size: 28px;
    }
  }

</style>
<style scoped lang="scss">
  .child-table {
    margin-left: 250px;
    &:before {
      display: none;
    }
    ::v-deep .el-table__row:nth-last-of-type(1) {
      td {
        border: none !important;
      }
    }
  }
  ::v-deep .el-table__expand-column {
    .el-table__expand-icon {
      display: none;
    }
  }
  .el-icon-arrow-right {
    transition: all .2s ease-in-out;
    transform: rotate(0);
  }
  .expanded-btn.expanded {
    .el-icon-arrow-right {
      transform: rotate(90deg);
    }
  }

</style>
