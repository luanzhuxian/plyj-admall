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
                <el-button @click="getDataDetail" type="text">查看明细</el-button>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    已获得奖品人数
                </div>
                <div :class="$style.cardItemContent">
                    <i v-text="statistics.drawSum || 0" /> <span /> <span>人</span>
                </div>
            </div>
            <div :class="$style.tabCardItem">
                <div :class="$style.cardItemTitle">
                    获得智慧礼人数
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
                    :clearable="true"
                    @change="dateChange"
                    type="datetime"
                    range-separator="至"
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item label="打卡次数：">
                <el-select v-model="filterForm.signinCount" @change="search" clearable>
                    <el-option
                        v-for="item in signinCountMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
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
                    round
                    type="primary"
                    plain
                    @click="dialogVerificationVisible = true"
                >
                    去核销
                </el-button>
                <el-button
                    round
                    type="primary"
                    plain
                    @click="changeExport"
                    :disabled="total === 0"
                >
                    导出数据
                </el-button>
                <el-button type="text" @click="resetFilter">
                    清空筛选条件
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
                label="打卡次数"
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
                    <el-button plain slot="reference" @click="getActivityGiftDetail(row)">
                        查看 ({{ row.awardCount || 0 }})
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="drawTime"
                label="最近获奖时间"
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

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px"
                     label-position="left">
                <el-form-item label="搜索内容" prop="condition">
                    <el-input
                        v-model.trim="exportData.condition"
                        placeholder="请输入搜索手机号"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="参与时间" prop="startTime">
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

        <verification :dialog-verification-visible.sync="dialogVerificationVisible" />
        <GiftList :obtain-time="true" :show.sync="showGift" :gift-data="giftData" />
        <el-dialog
            title="查看示例"
            :visible.sync="showDataDetail"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="770px"
        >
            <div :class="$style.dataDetail">
                <el-table :data="dataDetail" class="mt-10" stripe>
                    <span slot="empty" class="empty">
                        <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                        没有查到数据，请确认后重新查询！
                    </span>
                    <el-table-column
                        prop="time"
                        label="活动日期"
                        header-align="left"
                        align="left"
                    />
                    <el-table-column
                        width="180"
                        prop="everyAddPeople"
                    >
                        <span slot="header">
                            新增打卡人数
                            <el-tooltip class="item" style="display: inline-block" effect="dark" placement="bottom">
                                <div slot="content">
                                    新增打卡人数，是指每天新加入打<br>
                                    卡活动且首次打卡成功的用户人数
                                </div>
                                <pl-svg name="yaji-jinggao" fill="#999999" style="margin-left: 4px;" />
                            </el-tooltip>
                        </span>
                    </el-table-column>
                    <el-table-column
                        width="180"
                        prop="eodaySigninPeople"
                    >
                        <span slot="header">
                            当日打卡人数
                            <el-tooltip class="item" style="display: inline-block" effect="dark" placement="bottom">
                                <div slot="content">
                                    当日打卡人数，是指当天进行打<br>
                                    卡，并打卡成功的用户人数
                                </div>
                                <pl-svg name="yaji-jinggao" fill="#999999" style="margin-left: 4px;" />
                            </el-tooltip>
                        </span>
                    </el-table-column>
                    <el-table-column
                        width="180"
                        prop="totalPeople"
                    >
                        <span slot="header">
                            累计参与人数
                            <el-tooltip class="item" style="display: inline-block" effect="dark" placement="bottom">
                                <div slot="content">
                                    累计打卡人数，是指累计历史参<br>
                                    与打卡活动的所有用户的总额
                                </div>
                                <pl-svg name="yaji-jinggao" fill="#999999" style="margin-left: 4px;" />
                            </el-tooltip>
                        </span>
                    </el-table-column>
                </el-table>
                <el-button
                    type="primary"
                    @click="showDataDetail = false"
                >
                    我知道了
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import verification from '../../../../components/order-center/Verification.vue'
import GiftList from '../../../../components/marketing-manage/Gift-List'
import moment from 'moment/moment'
import { createObjectUrl } from '../../../../assets/ts/upload'
import {
    activityStatistic,
    queryActivityList,
    exportActivityStatistic,
    queryActivityGiftDetail,
    signTimeInterval,
    signEveryAddPeopleStatistic,
    signTodaySigninPeopleStatistic
} from '../../../../apis/marketing-manage/new-year/year-flavor'

export default {
    name: 'SignInData',
    components: {
        verification,
        ExportDialog,
        GiftList
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            showGift: false,
            showDataDetail: false,
            showExport: false,
            exportData: {
                condition: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3,
                startTime: '',
                endTime: ''
            },
            exportRules: {
                startTime: [
                    {
                        required: true,
                        message: '请选择时间',
                        trigger: 'blur'
                    }
                ]
            },
            filterForm: {
                startTime: '',
                endTime: '',
                condition: '',
                signinCount: '',
                current: 1,
                size: 10
            },
            tableData: [],
            giftData: [],
            signinCountMap: [],
            dialogVerificationVisible: false,
            total: 0,
            statistics: {
                // 浏览量
                pv: 0,
                // 访客量
                uv: 0,
                // 参与人数
                takeSum: 0,
                // 抽奖人数
                drawSum: 0,
                // 端午活动大礼包人数
                finalSum: 0
            },
            dataDetail: []
        }
    },
    async created () {
        try {
            await this.getData()
            await this.getList()
            for (let i = 0; i < this.data.entity.checkDays; i++) {
                this.signinCountMap.push({
                    label: i + 1,
                    value: i + 1
                })
            }
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getDataDetail () {
            try {
                if (!this.dataDetail || !this.dataDetail.length) {
                    const { result: res1 } = await signTimeInterval(this.id)
                    const { result: res2 } = await signEveryAddPeopleStatistic(this.id)
                    const { result: res3 } = await signTodaySigninPeopleStatistic(this.id)
                    const data = []
                    res1.forEach(item1 => {
                        if (moment(item1) > moment()) return
                        const item2 = res2.find(item => item.everyTime === item1)
                        const item3 = res3.find(item => item.everyTime === item1)
                        data.push({
                            time: item1,
                            everyAddPeople: item2 ? item2.addCount : 0,
                            eodaySigninPeople: item3 ? item3.addCount : 0
                        })
                    })
                    data.forEach((item, index) => {
                        if (index) {
                            item.totalPeople = data[index - 1].totalPeople + item.everyAddPeople
                        } else {
                            item.totalPeople = item.everyAddPeople
                        }
                    })
                    this.dataDetail = data
                }
                this.showDataDetail = true
            } catch (e) {
                throw e
            }
        },
        async search () {
            try {
                this.filterForm.current = 1
                await this.getList()
                await this.getData()
            } catch (e) {
                throw e
            }
        },
        async resetFilter () {
            try {
                this.filterForm = {
                    sstartTime: '',
                    endTime: '',
                    condition: '',
                    signinCount: '',
                    current: 1,
                    size: 10
                }
                this.$refs.dateRange.clear()
                await this.getList()
                await this.getData()
            } catch (e) {
                throw e
            }
        },
        async dateChange ({ start, end }) {
            try {
                this.filterForm.current = 1
                this.filterForm.startTime = start || ''
                this.filterForm.endTime = end || ''
                await this.getList()
                await this.getData()
            } catch (e) {
                throw e
            }
        },
        async sizeChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.size = val
                await this.getList()
                await this.getData()
            } catch (e) {
                throw e
            }
        },
        async getData () {
            try {
                const { result } = await activityStatistic(this.id)
                this.statistics = result
            } catch (e) {
                throw e
            }
        },
        // 获得奖品详情
        async getActivityGiftDetail ({ userId }) {
            try {
                const activityId = this.id
                const { result } = await queryActivityGiftDetail(activityId, userId)
                this.giftData = result
                this.showGift = true
            } catch (e) {
                throw e
            }
        },
        // 获取列表数据
        async getList () {
            try {
                const activityId = this.id
                const { result: { records, total } } = await queryActivityList(activityId, this.filterForm)
                this.tableData = records || []
                this.total = total
            } catch (e) {
                throw e
            }
        },
        changeExport () {
            this.exportData = {
                ...this.exportData,
                ...this.filterForm
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                condition: '',
                // 1 7日内 2 30日内 3自选
                dateRange: 3,
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
                start = this.filterForm.startTime || ''
                end = this.filterForm.endTime || ''
            }

            this.exportDatechange({
                start: start && `${ moment(start)
                    .format(formatType) } 00:00:00`,
                end: end && `${ moment(end)
                    .format(formatType) } 23:59:59`
            })
        },
        // 导出数据
        async exportList () {
            try {
                await this.$refs.exportForm.validate()
                const exportData = this.exportData
                const params = {
                    startTime: exportData.startTime,
                    endTime: exportData.endTime,
                    condition: exportData.condition
                }
                const activityId = this.id
                const blob = await exportActivityStatistic(activityId, params)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `数据-${ moment(new Date())
                    .format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
                this.exportClose()
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

        .el-form-item__label {
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

                > button {
                    position: absolute;
                    bottom: -10px;
                }

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
                        font-size: 12px;
                        position: absolute;
                        cursor: pointer;
                        bottom: -29px;
                        left: -11px;
                    }
                }
            }
        }

        .data-detail {
            text-align: center;
            >button{
                margin-top: 10px;
            }
        }
    }

</style>
