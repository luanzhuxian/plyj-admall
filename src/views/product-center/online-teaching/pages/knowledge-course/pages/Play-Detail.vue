<template>
    <div :class="$style.container" class="wrap">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model.trim="filterForm.keyword"
                    placeholder="请输入用户名称/手机号"
                    clearable
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="用户分组：" v-if="false">
                <el-select
                    v-model="filterForm.userTagId"
                    @change="search"
                >
                    <el-option
                        v-for="item of userGroup"
                        :key="item.id"
                        :label="item.tagName"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="首次点播时间：">
                <date-range
                    class="date-range"
                    size="small"
                    :clearable="true"
                    @change="dateChange"
                    :init="timeRange"
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
                    type="primary"
                    :disabled="!tableData.length"
                    plain
                    @click="changeExport"
                >
                    导出数据
                </el-button>
                <el-button
                    type="text"
                    @click="resetFilterForm">
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
                label="用户名称"
            >
                <template #default="{row}">
                    <!--studyCount观看课节数不为零，则为已观看学习-->
                    <div :class="{[$style.isNotWatch]: !row.studyCount}">
                        {{ row.realName || row.nickName }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号"
            />
            <el-table-column prop="userTags" label="用户分组">
                <template #default="{row}">
                    <template v-if="row.userTags && row.userTags.length">
                        <div class="tag">
                            <el-popover
                                placement="bottom-end"
                                trigger="hover"
                            >
                                <ul class="tag-user-list">
                                    <li v-for="(item, index) of row.userTags" :key="index" v-text="item" />
                                </ul>
                                <div slot="reference">
                                    <span v-for="(item, index) in row.userTags.slice(0, 3)" :key="index">{{ item }} </span>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                    <div v-else>
                        无
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                v-if="!isFree"
                prop="payAmount"
                label="实付金额（元）"
            />
            <el-table-column
                v-if="!isFree"
                prop="payDiscounts"
                label="支付优惠"
            />
            <el-table-column
                label="分享人"
            >
                <template #default="{row}">
                    <div v-if="row.shareUserName" :class="[row.isHelper ? $style.isHelper : '' ]">
                        {{ row.shareUserName }}
                    </div>
                    <div v-else>
                        无
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="首次点播时间"
            >
                <template #default="{row}">
                    {{ row.studyCount ? row.createTime : '--' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="watchTimeShow"
                label="观看时长"
            >
                <template #default="{ row }">
                    {{ row.watchTimeShow && row.studyCount ? row.watchTimeShow : '0秒' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="dataFlowSizeShow"
                label="消耗流量"
            >
                <template #default="{row}">
                    {{ row.dataFlowSizeShow ? row.dataFlowSizeShow : '--' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="right" header-align="right" width="100">
                <template #default="{ row }">
                    <!--非送课学员才有订单-->
                    <el-button type="text" v-if="row.orderId" @click="showOrderDetail(row)">
                        查看订单
                    </el-button>
                    <!--未观看视频学员支持取消赠送-->
                    <el-button type="text" v-if="row.isGive && !row.studyCount" @click="cancleSend(row)">
                        取消赠送
                    </el-button>
                </template>
            </el-table-column>
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
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item label="搜索内容" prop="keyword">
                    <el-input
                        v-model.trim="exportData.keyword"
                        placeholder="请输入搜索内容"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="时间" prop="startTime">
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
import moment from 'moment'
import ExportDialog from './../../../../../order-manage/components/Export-Dialog'
import { getPlayDetail, exportDataList, submitSendCourseUsersList } from './../../../../../../apis/product-center/online-teaching/knowledge-course'
import { getTagList } from './../../../../../../apis/member'
import { createObjectUrl } from './../../../../../../assets/ts/upload'
export default {
    name: 'KnowledgeCourseDetail',
    components: {
        ExportDialog
    },
    data () {
        return {
            showExport: false,
            exportData: {
                dateRange: 3, // 1 7日内 2 30日内 3自选
                keyword: '',
                startTime: '',
                endTime: ''
            },
            exportRules: {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            },
            filterForm: {
                courseResourceId: '',
                liveId: '',
                startTime: '',
                endTime: '',
                keyword: '',
                userTagId: '',
                current: 1,
                size: 10
            },
            timeRange: [],
            isFree: false, // 当前课程是否免费
            total: 0,
            tableData: [],
            userGroup: []
        }
    },
    async created () {
        try {
            this.filterForm.courseResourceId = this.$route.query.courseResourceId || ''
            this.filterForm.liveId = this.$route.params.liveId || ''
            this.isFree = this.$route.query.isFree === '1'
            await this.getList()
            await this.getTagList()
        } catch (e) { throw e }
    },
    methods: {
        async search () {
            this.filterForm.current = 1
            await this.getList()
        },
        async resetFilterForm () {
            try {
                this.clearData()
                this.filterForm.liveId = this.$route.params.liveId || ''
                this.filterForm.courseResourceId = this.$route.query.courseResourceId || ''
                await this.search()
            } catch (e) {
                throw e
            }
        },
        async dateChange ({ start, end }) {
            try {
                this.filterForm.current = 1
                this.filterForm.startTime = start || ''
                this.filterForm.endTime = end || ''
                await this.search()
            } catch (e) { throw e }
        },
        async sizeChange (val) {
            try {
                this.filterForm.current = 1
                this.filterForm.size = val
                await this.getList()
            } catch (e) { throw e }
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
                dateRange: 3, // 1 7日内 2 30日内 3自选
                keyword: '',
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
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        },
        async exportList () {
            try {
                await this.$refs.exportForm.validate()
                const data = this.exportData
                const form = {
                    type: 'NETSCHOOL',
                    courseId: data.courseResourceId,
                    userTagId: data.userTagId,
                    keyword: data.keyword,
                    startTime: data.startTime,
                    endTime: data.endTime
                }
                const dataList = await exportDataList(form)
                const url = createObjectUrl(dataList)
                const aElement = document.createElement('a')
                aElement.href = url
                aElement.download = `数据详情${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }..xls`
                aElement.click()
                aElement.remove()
                this.exportClose()
            } catch (e) {
                throw e
            }
        },
        showOrderDetail (row) {
            this.$router.push({ name: 'OnlineSchoolOrderDetail', params: { id: row.orderId } })
        },
        async cancleSend (row) {
            try {
                await this.$confirm('确认要取消赠送吗？')
                await submitSendCourseUsersList({
                    id: this.filterForm.courseResourceId,
                    params: {
                        deleteUserIdList: [row.userId]
                    }
                })
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        // 获取列表数据
        async getList () {
            try {
                const { result: { records, total } } = await getPlayDetail(this.filterForm)
                this.tableData = records
                this.total = total
            } catch (e) { throw e }
        },
        // 获得用户分组标签和活动标签列表
        async getTagList () {
            try {
                const { result } = await getTagList()
                result.unshift({
                    id: '',
                    tagName: '全部'
                })
                this.userGroup = result || []
            } catch (e) {
                throw e
            }
        },
        clearData () {
            this.filterForm = {
                courseResourceId: '',
                liveId: '',
                startTime: '',
                endTime: '',
                keyword: '',
                userTagId: '',
                current: 1,
                size: 10
            }
            this.timeRange = []
        }
    }
}
</script>

<style lang="scss" module scoped>

.container {
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    background-color: #fff;
    .el-form-item__label {
        color: #333;
        font-size: 12px;
        font-weight: bold;
    }
    .tag {
        color: #999;
    }
    .isHelper {
        &:before {
            content: 'H';
            display: inline-block;
            margin-right: 4px;
            padding: 0 4px;
            border: 2px solid #ec742e;
            line-height: 20px;
            font-size: 10px;
            color: #ec742e;
        }
    }
    .isNotWatch {
        &:after {
            content: '未观看';
            display: inline-block;
            margin-right: 4px;
            padding: 0 4px;
            border: 1px solid #ec5144;
            line-height: 14px;
            font-size: 10px;
            color: #ec5144;
        }
    }
}

</style>

<style lang="scss" scoped>

.date-range {
    ::v-deep .el-input {
        width: 200px !important;
    }
}

</style>
