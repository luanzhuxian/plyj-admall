<template>
    <div :class="$style.container" class="wrap">
        <PlTabs
            :value="$route.name"
            :tabs="[
                { label: '课程数据', name: 'CoursesSeriesOfCoursesData' },
                { label: '用户数据', name: 'UsersSeriesOfCoursesData' },
            ]"
            @tabClick="data => $router.push({ name: data.name })"
        />
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
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button round type="primary" plain @click="resetFilterForm">
                    清空筛选条件
                </el-button>
                <el-button
                    round
                    type="primary"
                    plain
                    :disabled="!tableData.length"
                    @click="showExport = true"
                >
                    导出数据
                </el-button>
            </el-form-item>
        </search-box>
        <div>
            <el-table :data="tableData" class="mt-10" stripe>
                <span slot="empty" class="empty">
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                    没有查到数据，请确认后重新查询！
                </span>
                <el-table-column
                    label="用户名称"
                    width="200"
                >
                    <template #default="{row}">
                        <!-- studyCount观看课节数不为零，则为已观看学习 isTryWatch只有只试看的时候为1 -->
                        <div :class="{
                            [$style.isTryWatch]: row.isTryWatch,
                            [$style.isNotWatch]: !row.isTryWatch && !row.studyCount
                        }"
                        >
                            {{ row.realName || row.nickName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                />
                <el-table-column
                    prop="userTags"
                    label="用户分组"
                >
                    <template #default="{row}">
                        <template v-if="row.userTags.length">
                            <div :class="$style.tag" v-for="(item,index) in row.userTags" :key="index">
                                {{ item }}
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
                    label="观看课程"
                >
                    <template #default="{row}">
                        {{ row.studyCount? `已学习${row.studyCount}/${row.totalCount}`: '未学习' }}
                        <el-button v-if="Number(row.studyCount)" type="text" @click="checkWatchDetailList(row.userId)">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="首次点播时间"
                >
                    <template #default="{row}">
                        {{ row.studyCount || row.isTryWatch ? row.createTime : '--' }}
                    </template>
                </el-table-column>
                <!--TODO.当前统计流量为总流量，但是更换视频后，观看课程中按课节查看会低于外面的，暂不显示-->
                <el-table-column
                    v-if="false"
                    prop="dataFlowSizeShow"
                    label="消耗流量"
                >
                    <template #default="{row}">
                        {{ row.dataFlowSizeShow ? row.dataFlowSizeShow : '--' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="100"
                >
                    <template slot-scope="{ row }">
                        <el-button v-if="!row.isGive && row.orderId" @click="showOrderDetail(row)" type="text">
                            查看订单
                        </el-button>
                        <el-button v-if="row.isGive && !row.studyCount" @click="cancleSend(row)" type="text">
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
        </div>
        <WatchDetailList
            :show.sync="showWatchDetailList"
            :course-id="filterForm.courseResourceId"
            :user-id="selectedUserId"
        />

        <!-- 导出 -->
        <ExportData :show.sync="showExport" :form="filterForm" type="users" @confirm="exportData" />
    </div>
</template>

<script>
import moment from 'moment'
import ExportData from './../components/Export-Data'
import { getSingleCourseListDetail, exportSingleCourseDetailDataList } from './../../../../../../apis/product-center/online-teaching/series-of-courses'
import { submitSendCourseUsersList } from './../../../../../../apis/product-center/online-teaching/knowledge-course'
import { getTagList } from './../../../../../../apis/member'
import { createObjectUrl } from '../../../../../../assets/ts/upload'
import WatchDetailList from './../components/Watch-Detail-List'
export default {
    name: 'UsersSeriesOfCoursesData',
    data () {
        return {
            showExport: false,
            filterForm: {
                courseResourceId: '',
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
            userGroup: [],
            showWatchDetailList: false, // 当前用户详情
            selectedUserId: ''
        }
    },
    components: {
        WatchDetailList,
        ExportData
    },
    async activated () {
        try {
            this.filterForm.courseResourceId = this.$route.params.id || ''
            this.isFree = this.$route.query.isFree === '1'
            await this.getList()
            await this.getTagList()
        } catch (e) { throw e }
    },
    deactivated () {
        this.clearData()
    },
    methods: {
        async search () {
            try {
                this.filterForm.current = 1
                await this.getList()
            } catch (e) { throw e }
        },
        async resetFilterForm () {
            try {
                this.clearData()
                this.filterForm.courseResourceId = this.$route.params.id || ''
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
        async exportData (data) {
            try {
                const form = {
                    type: 'NETSCHOOL',
                    courseId: this.filterForm.courseResourceId,
                    userTagId: this.filterForm.userTagId,
                    keyword: data.keyword,
                    startTime: data.startTime,
                    endTime: data.endTime
                }
                const dataList = await exportSingleCourseDetailDataList(form)
                const url = createObjectUrl(dataList)
                const aElement = document.createElement('a')
                aElement.href = url
                aElement.download = `数据详情${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }..xls`
                aElement.click()
                aElement.remove()
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
                const { result: { records, total } } = await getSingleCourseListDetail(this.filterForm)
                this.tableData = records || []
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
        },
        checkWatchDetailList (id) {
            this.selectedUserId = id
            this.showWatchDetailList = true
        }
    }
}
</script>

<style lang="scss" module scoped>

.container {
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    .el-form-item__label {
        color: #333;
        font-size: 12px;
        font-weight: bold;
    }
    .wrap {
        display: flex;
        justify-content: space-between;
        padding: 12px 20px;
        padding-bottom: 0 !important;
    }
    .tag {
        display: inline-block;
        min-width: 78px;
        margin: 0 4px 4px 0;
        padding: 0 4px;
        border: 1px solid #ec742e;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        text-align: center;
        color: #ec742e;
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

    .isTryWatch::after {
        content: '试看';
        display: inline-block;
        margin-right: 4px;
        padding: 0 4px;
        border: 2px solid #f1af36;
        line-height: 14px;
        font-size: 10px;
        color: #f1af36;
    }

    .isNotWatch::after {
        content: '未观看';
        display: inline-block;
        margin-right: 4px;
        padding: 0 4px;
        border: 2px solid #ec5144;
        line-height: 14px;
        font-size: 10px;
        color: #ec5144;
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
