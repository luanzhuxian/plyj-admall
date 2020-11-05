<template>
    <div>
        <SearchBox>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    @change="search"
                    placeholder="请输入直播名称"
                    v-model="liveWatchListForm.keyword"
                />
            </el-form-item>
            <el-form-item label="类型：">
                <el-select
                    v-model="liveWatchListForm.liveType"
                    @change="search"
                    clearable
                >
                    <el-option :value="''" label="全部" />
                    <el-option :value="'live'" label="实时直播" />
                    <el-option :value="'video'" label="录制直播" />
                </el-select>
            </el-form-item>
            <el-form-item label="直播时间：">
                <date-range
                    @change="formatLiveWatchListTimeRange"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item label="形式：">
                <el-select
                    v-model="liveWatchListForm.liveMode"
                    @change="search"
                    clearable
                >
                    <el-option :value="''" label="全部" />
                    <el-option :value="'public'" label="公开课" />
                    <el-option :value="'private'" label="私享课" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    round
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    @click="changeExportLiveWatchList"
                    type="primary"
                    plain
                    round
                    v-if="liveWatchList && liveWatchList.length"
                >
                    导出数据
                </el-button>
                <el-button type="text" @click="resetLiveWatchList">清空筛选条件</el-button>
            </el-form-item>
        </SearchBox>

        <el-table
            key="LiveWatchList"
            :data="liveWatchList"
            class="table-customer"
            style="width: 100%"
        >

            <el-table-column
                prop="liveStartTime"
                label="直播时间"
            />
            <el-table-column
                prop="liveName"
                label="直播信息"
                width="200px"
            >
                <template #default="{ row }">
                    <div>
                        <img style="width: 75px; height: 50px; margin-right: 10px; vertical-align: top;" :src="row.liveFrontCover" alt="">
                        <span style="display:inline-block; width: 90px">{{ row.liveName }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="liveMode"
                label="形式"
            >
                <template #default="{ row }">
                    {{ row.liveType === 'public' ? '公开课' : '私享课' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="liveType"
                label="类型"
            >
                <template #default="{ row }">
                    {{ row.liveType === 'live' ? '实时直播' : '录制直播' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="实付款（元）">
                <template #default="{ row }">
                    {{ row.amount / 100 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="支付优惠"
            />
            <el-table-column
                prop="sharer"
                label="分享人"
            />
            <el-table-column
                prop="firstViewingTime"
                label="首次观看时间"
            />
            <!--<el-table-column
                fixed="right"
                label="操作"
            >
                <template #default="{ row }">
                    <el-button type="text" @click="$router.push({ name: 'OnlineSchoolOrderDetail', params: { id: row.orderId } })">
                        订单详情
                    </el-button>
                </template>
            </el-table-column>-->
        </el-table>
        <Pagination
            @change="getLiveWatchList"
            v-model="liveWatchListForm.current"
            :total="liveWatchListTotal"
        />
        <!--        导出-->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="110px" label-position="left">
                <el-form-item label="关键字" prop="keyword">
                    <el-input
                        v-model.trim="exportData.keyword"
                        placeholder="请输入直播名称"
                        style="width: 300px;"
                        clearable
                    />
                </el-form-item>

                <el-form-item label="类型：">
                    <el-select
                        v-model="exportData.liveType"
                        @change="search"
                        clearable
                    >
                        <el-option :value="''" label="全部" />
                        <el-option :value="'live'" label="实时直播" />
                        <el-option :value="'video'" label="录制直播" />
                    </el-select>
                </el-form-item>

                <el-form-item label="形式：">
                    <el-select
                        v-model="exportData.liveMode"
                        @change="search"
                        clearable
                    >
                        <el-option :value="''" label="全部" />
                        <el-option :value="'public'" label="公开课" />
                        <el-option :value="'private'" label="私享课" />
                    </el-select>
                </el-form-item>
                <el-form-item label="直播时间" prop="liveStartTime">
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
                        :init="exportData.liveStartTime ? [exportData.liveStartTime,exportData.liveEndTime] : []"
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

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import {
    exportLiveQuery,
    getLiveWatchList
} from '../../../../apis/member'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import { ElForm } from 'admall-element/types/form'
import { createObjectUrl } from '@/assets/ts/upload'
import moment from 'moment'
@Component({
    components: { ExportDialog }
})
export default class MemberLiveRecord extends Vue {
    liveWatchList = []
    liveWatchListTotal = 0
    // 直播观看记录
    liveWatchListForm: DynamicObject = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        liveMode: '',
        liveType: '',
        liveStartTime: '',
        liveEndTime: ''
    }

    // 导出
    showExport = false
    exportData: DynamicObject = {
        mallUserId: '',
        keyword: '',
        liveMode: '',
        liveType: '',
        liveStartTime: '',
        liveEndTime: '',
        dateRange: 3
    }

    exportRules = {
        liveStartTime: [
            { required: true, message: '请选择时间', trigger: 'blur' }
        ]
    }

    @Prop() userId!: string
    @Prop({ type: Array }) orderType!: DynamicObject[]
    @Prop({ type: Array }) orderStatusMap!: DynamicObject[]

    async created () {
        await this.search()
    }

    // methods
    // 直播观看记录
    async getLiveWatchList () {
        try {
            this.liveWatchListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getLiveWatchList(this.liveWatchListForm)
            this.liveWatchList = records || []
            this.liveWatchListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async search () {
        try {
            this.liveWatchListForm.current = 1
            await this.getLiveWatchList()
        } catch (e) {
            throw e
        }
    }

    async formatLiveWatchListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.liveWatchListForm.liveStartTime = start
            this.liveWatchListForm.liveEndTime = end
            await this.search()
        } catch (e) {
            throw e
        }
    }

    async resetLiveWatchList () {
        this.liveWatchListForm = {
            mallUserId: '',
            current: 1,
            size: 10,
            keyword: '',
            liveMode: '',
            liveType: '',
            liveStartTime: '',
            liveEndTime: ''
        };
        (this.$refs.dateRange as HTMLFormElement).clear()
        await this.getLiveWatchList()
    }

    changeExportLiveWatchList () {
        for (const item of Object.keys(this.exportData)) {
            if (item !== 'dateRange') this.exportData[item] = this.liveWatchListForm[item]
        }
        this.showExport = true
    }

    exportClose () {
        this.exportData = {
            mallUserId: '',
            keyword: '',
            liveMode: '',
            liveType: '',
            liveStartTime: '',
            liveEndTime: '',
            dateRange: 3
        };
        (this.$refs.exportForm as ElForm).clearValidate()
        this.showExport = false
    }

    async exportList () {
        await (this.$refs.exportForm as HTMLFormElement).validate()
        const blob = await exportLiveQuery(this.exportData)
        const url = createObjectUrl(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `直播观看记录${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
        a.click()
        this.showExport = false
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
            this.exportData.liveStartTime = ''
            this.exportData.liveEndTime = ''
        }
    }

    async exportDatechange ({ start, end }: DynamicObject) {
        this.exportData.liveStartTime = start
        this.exportData.liveEndTime = end
        if (!start || !end) {
            return
        }
        await this.$nextTick();
        (this.$refs.exportDatePicker as HTMLFormElement).initDate()
    }
}
</script>

<style module lang="scss">

</style>
