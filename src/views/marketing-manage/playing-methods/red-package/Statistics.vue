<template>
    <div class="red-package-statistics wrap">
        <ListHeader
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/福利红包.png"
            :title="$route.query.name"
            description="低价购买福利红包  支付抵扣享优惠  "
            time-title="领取时间"
            :start-time="$route.query.receiveStartTime"
            :end-time="$route.query.receiveEndTime"
        >
            <span :class="{
                [$style.status]:true,
                [$style.blueBg]:Number(activityStatus) === 0,
                [$style.greenBg]:Number(activityStatus) === 1,
                [$style.orangeBg]:Number(activityStatus) === 2,
                [$style.grayBg]:Number(activityStatus) === 3,
            }">
                <i class="yaji-icon icon-time" />
                {{ activityStatusMap[$route.query.activityStatus] }}
            </span>
            <el-button type="text" @click="share()">
                分享
            </el-button>
        </ListHeader>
        <section :class="$style.statistics">
            <div :class="$style.statisticsItem">
                <div>发放量</div>
                <div><b :class="$style.number">{{ statisticsData.issueVolume }}</b>张</div>
            </div>
            <div :class="$style.statisticsItem">
                <div>领取量</div>
                <div><b :class="$style.number">{{ statisticsData.claimVolume }}</b>张</div>
            </div>
            <div :class="$style.statisticsItem">
                <div>使用量</div>
                <div><b :class="$style.number">{{ statisticsData.useVolume }}</b>张</div>
            </div>
            <div :class="$style.statisticsItem">
                <div>支付金额</div>
                <div><b :class="$style.number">{{ statisticsData.payAmount }}</b>元</div>
            </div>
        </section>
        <section :class="$style.searchBox">
            <el-form class="mt-24" inline>
                <el-form-item label="搜索内容：">
                    <el-input
                        style="width: 220px"
                        v-model.trim="form.keyword"
                        placeholder="请输入用户信息/联系人信息"
                        clearable
                        @change="search"
                    />
                </el-form-item>
                <el-form-item label="使用状态：" style="margin-left: 30px;">
                    <el-select
                        v-model="form.status"
                        clearable
                        @change="search"
                    >
                        <el-option
                            label="全部"
                            value=""
                        />
                        <el-option
                            label=" 未使用"
                            :value="0"
                        />
                        <el-option
                            label="已使用"
                            :value="1"
                        />
                        <el-option
                            label="已过期"
                            :value="2"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="领取时间：" style="margin-left: 30px;">
                    <date-range
                        ref="receiveDateRange"
                        type="date"
                        size="small"
                        start-label="领取时间："
                        end-label=""
                        range-separator="至"
                        clearable
                        @change="receiveDateChange"
                    />
                </el-form-item>
                <el-form-item label="使用时间：">
                    <date-range
                        ref="useDateRange"
                        type="date"
                        size="small"
                        start-label="使用时间："
                        end-label=""
                        range-separator="至"
                        clearable
                        @change="useDateChange"
                    />
                </el-form-item>
                <el-form-item style="display: block; padding-left: 82px;">
                    <el-button
                        round
                        type="primary"
                        @click="search"
                    >
                        查询
                    </el-button>
                    <el-button
                        v-if="table && table.length"
                        type="primary"
                        plain
                        round
                        @click="showExportDialog"
                    >
                        导出数据
                    </el-button>
                    <el-button type="text" @click="resetFilter">
                        清空筛选条件
                    </el-button>
                </el-form-item>
            </el-form>
        </section>
        <section>
            <el-table
                ref="table"
                class="content-table"
                :data="table"
            >
                <span
                    slot="empty"
                    class="empty"
                >
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                    <!-- 查询状态，查询缺省 -->
                    <!--                    <span v-if="true">-->
                    <!--                        暂无任何福利红包的查询结果-->
                    <!--                    </span>-->
                    <!--                    &lt;!&ndash; 活动状态，未开始 &ndash;&gt;-->
                    <!--                    <span v-if="true">-->
                    <!--                        活动暂未开始，暂无活动数据~-->
                    <!--                    </span>-->
                    <!--                    &lt;!&ndash; 活动状态，进行中 &ndash;&gt;-->
                    <!--                    <span v-if="true">-->
                    <!--                        暂无活动数据哦，快去分享活动吧~-->
                    <!--                    </span>-->
                    <!-- 活动状态，已停止 / 已结束 -->
                    <span v-if="true">
                        暂无活动数据哦~
                    </span>
                </span>
                <el-table-column
                    label="用户信息"
                    width="200"
                >
                    <template slot-scope="{row}">
                        <p>{{ row.baseMallUserName ? row.baseMallUserName: '--' }}</p>
                        <p>{{ row.mobile ? row.mobile: '--' }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="联系人信息"
                >
                    <template slot-scope="{row}">
                        <p>{{ row.receiveName ? row.receiveName: '--' }}</p>
                        <p>{{ row.receiveMobile ? row.receiveMobile: '--' }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="amount"
                    label="福利红包（元）"
                    width="150"
                />
                <el-table-column
                    prop="receiveTime"
                    label="领取时间"
                    width="150"
                >
                    <template slot-scope="{row}">
                        {{ row.createTime || '--' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="receiveTime"
                    label="使用时间"
                    width="150"
                >
                    <template slot-scope="{row}">
                        {{ row.useTime || '--' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="使用状态"
                >
                    <template #default="{row}">
                        {{ useStatusMap[row.status] }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="分享人"
                    width="200"
                >
                    <template slot-scope="{row}">
                        <p>{{ row.shareName ? row.shareName: '--' }}</p>
                        <p>{{ row.shareMobile ? row.shareMobile: '--' }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderNo"
                    label="支付订单编号"
                    width="160"
                >
                    <template slot-scope="{row}">
                        <span v-if="row.orderNo && row.orderNo.length">
                            {{ row.orderNo }}
                            <el-button type="text" @click="$router.replace({name:'RightGoodsDetail',params:{id:row.orderNo }})">查看订单</el-button>
                        </span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                @change="getList"
                @sizeChange="sizeChange"
                v-model="form.page"
                :total="total"
                :sizes="true"
            />
        </section>

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" @confirm="exportList" @close="closeExportDialog">
            <el-form
                ref="exportForm"
                :model="exportForm"
                :rules="exportRules"
                label-width="100px"
                label-position="left"
            >
                <el-form-item prop="searchValue" label="搜索内容：">
                    <el-input
                        v-model.trim="exportForm.keyword"
                        placeholder="请输入订单编号/领取人/电话"
                        style="width: 350px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="status" label="状态：">
                    <el-select v-model="exportForm.status">
                        <el-option
                            label="全部"
                            value=""
                        />
                        <el-option
                            label=" 未使用"
                            :value="0"
                        />
                        <el-option
                            label="已使用"
                            :value="1"
                        />
                        <el-option
                            label="已过期"
                            :value="2"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间类型">
                    <el-radio-group @change="exportTypeChange" v-model="exportForm.dateType">
                        <el-radio :label="1">
                            领取时间
                        </el-radio>
                        <el-radio :label="2">
                            使用时间
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="startTime" label="选择时间：">
                    <el-radio-group @change="exportRangeChange" v-model="exportForm.dateRange">
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
                        ref="exportReceiveDatePicker"
                        size="small"
                        clearable
                        disable-after
                        :disabled-start-time="exportForm.dateRange !== 3"
                        :disabled-end-time="exportForm.dateRange !== 3"
                        :init="exportForm.startTime ? [exportForm.startTime, exportForm.endTime] : []"
                        range-separator="至"
                        end-label=""
                        @change="exportDatechange"
                    />
                </el-form-item>
            </el-form>
        </ExportDialog>
        <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'
import ListHeader from '../../components/List-Header.vue'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import Share from '../../../../components/common/Share.vue'
import { createObjectUrl } from '../../../../assets/ts/upload'

import {
    getRedPackageStatistics,
    getRedPackageStatisticsList,
    exportRedPackageDataList
} from '../../../../apis/marketing-manage/red-package'
import { namespace } from 'vuex-class'
const userModule = namespace('user')

@Component({
    components: {
        ListHeader,
        ExportDialog,
        Share
    }
})
export default class RedPackageStatistics extends Vue {
    /* data */
    @Prop(String) id!: string
    @userModule.Getter('mallUrl') mallUrl!: string;
    form = {
        activityId: '',
        keyword: '',
        status: '',
        receiveStartTime: '',
        receiveEndTime: '',
        useStartTime: '',
        useEndTime: '',
        page: 1,
        size: 10
    }

    activityStatus: string | (string | null)[] | undefined
    activityStatusMap = {
        0: '未开始',
        1: '进行中',
        2: '已停止',
        3: '已结束'
    }

    useStatusMap = {
        0: '未使用',
        1: '已使用',
        2: '已过期'
    }

    table = []
    total = 0
    statisticsData = {}

    // 导出数据
    showExport = false
    exportForm = {
        //  1 注册 2 登录 3 购买
        dateType: 1,
        // 1 7日内 2 30日内 3自选
        dateRange: 3,
        startTime: '',
        endTime: '',
        keyword: '',
        status: ''
    }

    exportRules = {
        startTime: [{ required: true, message: '请选择时间', trigger: 'blur' }]
    }

    // 分享链接
    qrcodeText = ''
    // 分享开关
    qrcodeShow = false

    async created () {
        this.activityStatus = this.$route.query.activityStatus
        try {
            this.table = []
            this.form.activityId = this.id
            this.total = 0
            await this.getList()
            await this.getStatistics()
        } catch (e) {
            throw e
        }
    }

    /* methods */
    async getList () {
        try {
            const { result } = await getRedPackageStatisticsList(this.form)
            this.table = result.records
            this.total = result.total
        } catch (e) {
            throw e
        }
    }

    async getStatistics () {
        try {
            const { result } = await getRedPackageStatistics(this.form.activityId)
            this.statisticsData = result
        } catch (e) {
            throw e
        }
    }

    async search () {
        try {
            this.form.page = 1
            await this.getList()
            await this.getStatistics()
        } catch (e) {
            throw e
        }
    }

    async resetFilter () {
        try {
            this.form = {
                activityId: this.id,
                keyword: '',
                status: '',
                receiveStartTime: '',
                receiveEndTime: '',
                useStartTime: '',
                useEndTime: '',
                page: 1,
                size: 10
            };
            (this.$refs.receiveDateRange as HTMLFormElement).clear();
            (this.$refs.useDateRange as HTMLFormElement).clear()
            await this.getList()
            await this.getStatistics()
        } catch (e) {
            throw e
        }
    }

    async receiveDateChange (val: { start: string; end: string }) {
        try {
            this.form.receiveStartTime = val.start
            this.form.receiveEndTime = val.end
            await this.search()
        } catch (e) {
            throw e
        }
    }

    async useDateChange (val: { start: string; end: string }) {
        try {
            this.form.useStartTime = val.start
            this.form.useEndTime = val.end
            await this.search()
        } catch (e) {
            throw e
        }
    }

    async sizeChange (val: number) {
        try {
            this.form.size = val
            await this.search()
        } catch (e) {
            throw e
        }
    }

    exportRangeChange (val: number) {
        const start: string | Date = new Date()
        const end: string | Date = new Date()
        const formatType = 'YYYY-MM-DD'

        if (val === 1) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        } else if (val === 2) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        } else {
            this.exportForm.startTime = ''
            this.exportForm.endTime = ''
            this.exportTypeChange(this.exportForm.dateType as number)
        }
    }

    async exportTypeChange (type: number) {
        if (this.exportForm.dateRange !== 3) {
            return
        }

        await this.$nextTick()
        //  1 领取 2 使用
        if (type === 1 && this.form.receiveStartTime) {
            this.exportDatechange({
                start: this.form.receiveStartTime,
                end: this.form.receiveEndTime
            })
        }
        if (type === 2 && this.form.useStartTime) {
            this.exportDatechange({
                start: this.form.useStartTime,
                end: this.form.useEndTime
            })
        }
    }

    async exportDatechange ({ start, end }: DynamicObject) {
        this.exportForm.startTime = start
        this.exportForm.endTime = end
        if (!start || !end) {
            return
        }
        await this.$nextTick();
        (this.$refs.exportReceiveDatePicker as HTMLFormElement).initDate()
    }

    showExportDialog () {
        const { keyword, status, receiveStartTime, useStartTime } = this.form
        this.exportForm = {
            //  1 注册 2 登录 3 购买
            dateType: 1,
            // 1 7日内 2 30日内 3自选
            dateRange: 3,
            startTime: '',
            endTime: '',
            keyword,
            status
        }
        if (receiveStartTime) {
            this.exportForm.dateType = 1
        } else if (useStartTime) {
            this.exportForm.dateType = 2
        } else {
            this.exportForm.dateType = 1
        }
        this.exportTypeChange(Number(this.exportForm.dateType))
        this.showExport = true
    }

    closeExportDialog () {
        this.exportForm = {
            //  1 注册 2 登录 3 购买
            dateType: 1,
            // 1 7日内 2 30日内 3自选
            dateRange: 3,
            startTime: '',
            endTime: '',
            keyword: '',
            status: ''
        };
        (this.$refs.exportForm as HTMLFormElement).clearValidate()
        this.showExport = false
    }

    async exportList () {
        await (this.$refs.exportForm as HTMLFormElement).validate()
        const data: DynamicObject = {
            activityId: this.id,
            status: this.exportForm.status,
            keyword: this.exportForm.keyword
        }
        if (this.exportForm.dateType === 1) {
            data.receiveStartTime = this.exportForm.startTime
            data.receiveEndTime = this.exportForm.endTime
        }
        if (this.exportForm.dateType === 2) {
            data.useStartTime = this.exportForm.startTime
            data.useEndTime = this.exportForm.endTime
        }
        try {
            const blob = await exportRedPackageDataList(data)
            // @ts-ignore
            const url = createObjectUrl(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `福利红包${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
            a.click()
            a.remove()
            this.closeExportDialog()
        } catch (e) {
            throw e
        }
    }

    share () {
        try {
            this.qrcodeText = `${ this.mallUrl }/red-package/detail/${ this.id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        } catch (e) {
            throw e
        }
    }
}

</script>

<style lang="scss" module>
.activityStatus {
    display: inline-flex;
    align-items: center;
    margin-left: 15px;
    padding: 0 10px;
    height: 24px;
    background: #2DCA72;
    border-radius: 20px;
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.05);
    font-size: 12px;
    color: #FFFFFF;
    i {
        margin-right: 4px;
    }
}

.status{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    margin-left: 15px;
    border-radius: 15px;
    color: #ffffff;
    >i{
        margin-right: 5px;
    }
}

.green-bg{
    background-color: #2DCA72;
}
.blue-bg{
    background-color: #4F63FF;
}
.orange-bg{
    background-color: #F79F1A;
}
.gray-bg{
    background-color: #999999;
}

.statistics {
    margin-bottom: 20px;
    padding: 20px 45px;
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-gap: 0 150px;
}

.search-box {
    display: flex;
    padding: 20px 32px;
    background-color: #F5F6FA;
    border-radius: 10px;
}

.number {
    margin-right: 10px;
    font-size: 48px;
    line-height: 64px;
    color: #333333;
}
</style>
