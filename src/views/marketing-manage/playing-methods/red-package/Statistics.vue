<template>
    <div class="red-package-statistics wrap">
        <ListHeader
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/福利红包.png"
            title="福利红包"
            description="低价购买福利红包  支付抵扣享优惠  "
            start-time="2019.10.28"
            end-time="2020.01.31"
        >
            <span :class="$style.status">
                <i class="yaji-icon icon-time" />
                使用中
            </span>
            <el-button type="text">
                分享
            </el-button>
        </ListHeader>
        <section :class="$style.statistics">
            <div :class="$style.statisticsItem">
                <div>发放量</div>
                <div><b :class="$style.number">1</b>张</div>
            </div>
            <div :class="$style.statisticsItem">
                <div>领取量</div>
                <div><b :class="$style.number">18</b>张</div>
            </div>
            <div :class="$style.statisticsItem">
                <div>使用量</div>
                <div><b :class="$style.number">18</b>张</div>
            </div>
            <div :class="$style.statisticsItem">
                <div>支付金额</div>
                <div><b :class="$style.number">18</b>元</div>
            </div>
        </section>
        <section :class="$style.searchBox">
            <el-form class="mt-24" inline>
                <el-form-item label="搜索内容：">
                    <el-input
                        v-model.trim="form.name"
                        placeholder="请输入福利红包活动名称"
                        clearable
                        @change="search"
                    />
                </el-form-item>
                <el-form-item label="状态：" style="margin-left: 30px;">
                    <el-select
                        :clearable="true"
                        v-model="form.status"
                        @change="search"
                    >
                        <el-option
                            label="全部"
                            value=""
                        />
                        <el-option
                            label="待使用"
                            :value="0"
                        />
                        <el-option
                            label="已使用"
                            :value="2"
                        />
                        <el-option
                            label="已过期"
                            :value="3"
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
                    <span v-if="true">
                        暂无任何福利红包的查询结果
                    </span>
                    <span v-if="true">
                        活动暂未开始，暂无活动数据~
                    </span>
                    <span v-if="true">
                        暂无活动数据哦，快去分享活动吧~
                    </span>
                    <span v-if="true">
                        暂无活动数据哦~
                    </span>
                </span>
                <el-table-column
                    prop="receiverName"
                    label="领取人昵称"
                    width="200"
                />
                <el-table-column
                    prop="receiverName"
                    label="真实姓名"
                />
                <el-table-column
                    prop="receiverMobile"
                    label="联系电话"
                    width="150"
                />
                <el-table-column
                    prop="destributeCount"
                    label="福利红包（元）"
                    width="150"
                />
                <el-table-column
                    prop="receiveTime"
                    label="领取时间"
                    width="150"
                >
                    <template slot-scope="{row}">
                        {{ row.receiverName || '--' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="statusText"
                    label="使用状态"
                />
                <el-table-column
                    label="分享人"
                    width="200"
                >
                    <template slot-scope="{row}">
                        <template v-if="row.receiverName">
                            <span>{{ row.receiverName }}</span>
                            <span v-if="row.receiverMobile">{{ row.receiverMobile }}</span>
                        </template>
                        <templata>
                            --
                        </templata>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orders"
                    label="支付订单编号"
                    width="150"
                >
                    <template slot-scope="{row}">
                        {{ row.orders[0] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orders"
                    label="关联产品订单"
                    width="300"
                >
                    <template slot-scope="{ row }">
                        <span :class="{ 'more': row.orders.length > 1 }">
                            <div v-if="row.orders.length === 1" style="display: inline-flex">
                                <span v-text="row.orders[0]" />
                                <el-button size="mini" @click="goOrderDetail(row.orders[0])">查看订单</el-button>
                            </div>
                            <span v-else-if="row.orders.length > 1">
                                <span style="color: #666">
                                    {{ `关联(${row.orders.length})个订单` }}
                                </span>
                                <PlSvg
                                    name="icon-sanjiao"
                                    width="12"
                                    :style="{
                                        cursor: 'pointer',
                                        transition: 'transform .2s linear',
                                        transform: row.expanded ? 'rotate(-180deg)' : 'rotate(0)'
                                    }"
                                    @click="toggleRowExpansion(row)"
                                />
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    type="expand"
                    width="1"
                    style="opacity: 0; display: none;"
                >
                    <template slot-scope="{ row }">
                        <el-table
                            :data="row.orders"
                            :show-header="false"
                            :cell-style="{ border: 'none' }"
                        >
                            <el-table-column v-if="statisticsData.distributionMethod" width="1200" />
                            <el-table-column v-else width="1050" />
                            <el-table-column>
                                <template slot-scope="item">
                                    <span>{{ item.row }}</span>
                                    <el-button size="mini" @click="goOrderDetail(item.row)">
                                        查看订单
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>

            </el-table>
            <Pagination
                @change="getList"
                @sizeChange="sizeChange"
                v-model="form.current"
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
                        v-model.trim="exportForm.name"
                        placeholder="请输入订单编号/领取人/电话"
                        style="width: 350px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="status" label="状态：">
                    <el-select v-model="exportForm.status">
                        <el-option v-for="(item,index) in exportStatus" :label="item.label" :value="item.value" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="startTime" label="领取时间：">
                    <date-range
                        ref="exportReceiveDatePicker"
                        size="small"
                        clearable
                        disable-after
                        :init="exportForm.startTime ? [exportForm.startTime, exportForm.endTime] : []"
                        range-separator="至"
                        end-label=""
                        @change="exportDatechange"
                    />
                </el-form-item>
                <el-form-item prop="startTime" label="使用时间：">
                    <date-range
                        ref="exportUseDatePicker"
                        size="small"
                        clearable
                        disable-after
                        :init="exportForm.startTime ? [exportForm.startTime, exportForm.endTime] : []"
                        range-separator="至"
                        end-label=""
                        @change="exportDatechange"
                    />
                </el-form-item>
            </el-form>
        </ExportDialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'
import ListHeader from '../../components/List-Header.vue'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import {
    selectCouponDetail,
    getCouponstatistics,
    exportReductionCoupon
} from '../../../../apis/marketing-manage/coupon'
import { createObjectUrl } from '../../../../assets/ts/upload'

@Component({
    components: {
        ListHeader,
        ExportDialog
    }
})
export default class RedPackageStatistics extends Vue {
    /* data */
    @Prop(String) id!: string

    routeName = ''
    table = []
    form = {
        couponId: '',
        name: '',
        status: '',
        startTime: '',
        endTime: '',
        useStartTime: '',
        useEndTime: '',
        current: 1,
        size: 10
    }

    total = 0
    statisticsData = ''

    // 导出数据
    showExport = false
    exportForm = {
        status: '',
        name: '',
        startTime: '',
        endTime: ''
    }

    exportRules = {
        startTime: [
            { required: true, message: '请选择时间', trigger: 'blur' }
        ]
    }

    exportStatus = [
        { label: '全部', value: '' },
        { label: '待使用', value: 0 },
        { label: '已使用', value: 1 },
        { label: '已过期', value: 99 }
    ]

    async created () {
        try {
            this.routeName = this.$route.name || ''
            this.table = []
            const { params } = this.$route
            this.form.couponId = params.id
            this.total = 0
            await this.getList()
            await this.getStatistics()
        } catch (error) {
            throw error
        }
    }

    /* methods */
    async getList () {
        try {
            const { result } = await selectCouponDetail(this.form)
            this.table = result.records
            this.total = result.total
        } catch (error) {
            throw error
        }
    }

    async getStatistics () {
        try {
            const { result } = await getCouponstatistics(this.form.couponId)
            this.statisticsData = result
        } catch (error) {
            throw error
        }
    }

    async search () {
        try {
            this.form.current = 1
            await this.getList()
            await this.getStatistics()
        } catch (error) {
            throw error
        }
    }

    async resetFilter () {
        try {
            this.form = {
                couponId: this.$route.params.id,
                name: '',
                status: '',
                startTime: '',
                endTime: '',
                useStartTime: '',
                useEndTime: '',
                current: 1,
                size: 10
            }
            // @ts-ignore
            this.$refs.receiveDateRange.clear()
            // @ts-ignore
            this.$refs.useDateRange.clear()
            await this.getList()
            await this.getStatistics()
        } catch (error) {
            throw error
        }
    }

    async receiveDateChange (val: { start: string; end: string }) {
        try {
            this.form.startTime = val.start
            this.form.endTime = val.end
            await this.search()
        } catch (error) {
            throw error
        }
    }

    async useDateChange (val: { start: string; end: string }) {
        try {
            this.form.useStartTime = val.start
            this.form.useEndTime = val.end
            await this.search()
        } catch (error) {
            throw error
        }
    }

    async sizeChange (val: number) {
        try {
            this.form.size = val
            await this.search()
        } catch (error) {
            throw error
        }
    }

    toggleRowExpansion (row: {expanded: boolean}) {
        row.expanded = !row.expanded
        // @ts-ignore
        this.$refs.table.toggleRowExpansion(row, row.expanded)
    }

    showExportDialog () {
        const { name, status, startTime, endTime } = this.form
        this.exportForm = {
            ...this.exportForm,
            name,
            status,
            startTime,
            endTime
        }
        this.showExport = true
    }

    closeExportDialog () {
        this.exportForm = {
            status: '',
            name: '',
            startTime: '',
            endTime: ''
        }
        // @ts-ignore
        this.$refs.exportForm.clearValidate()
        this.showExport = false
    }

    async exportDatechange ({ start, end }: { start: string; end: string }) {
        this.exportForm.startTime = start
        this.exportForm.endTime = end
        if (!start || !end) {
            return
        }
        await this.$nextTick()
        // @ts-ignore
        this.$refs.exportReceiveDatePicker.initDate()
        // @ts-ignore
        this.$refs.exportUseDatePicker.initDate()
    }

    async exportList () {
        // @ts-ignore
        await this.$refs.exportForm.validate()
        const data = {
            couponId: this.$route.params.id,
            status: this.exportForm.status,
            name: this.exportForm.name,
            startTime: this.exportForm.startTime,
            endTime: this.exportForm.endTime
        }
        try {
            const blob = await exportReductionCoupon(data)
            // @ts-ignore
            const url = createObjectUrl(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `满减券${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
            a.click()
            a.remove()
            this.closeExportDialog()
        } catch (e) {
            throw e
        }
    }

    goOrderDetail (id: string) {
        this.$router.push({ name: 'CourseOrderDetail', params: { id } })
    }
}

</script>

<style lang="scss" module>
.status {
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
